"""
EEG Routes
==========

FastAPI routes for EEG data processing.
"""

from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query, Body

from .dependencies import get_jona_character
from ..core.jona_character import JonaCharacter
from ..core.eeg_engine import EEGData


router = APIRouter()


@router.post("/data")
async def submit_eeg_data(
    data: List[float] = Body(..., description="EEG data samples"),
    sample_rate: float = Body(250.0, description="Sample rate in Hz"),
    channel: str = Body("default", description="EEG channel identifier"),
    metadata: Optional[Dict[str, Any]] = Body(
        None, description="Additional metadata"
    ),
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Submit EEG data for processing.

    Processes EEG data through the JONA system and returns analysis results.
    """
    try:
        if not data:
            msg = "EEG data cannot be empty"
            raise HTTPException(status_code=400, detail=msg)

        # Create EEG data object
        eeg_data = EEGData(
            samples=data,
            sample_rate=sample_rate,
            channel=channel,
            timestamp=datetime.now(),
            metadata=metadata or {}
        )

        # Process EEG data
        analysis_result = await jona.process_eeg_data(eeg_data)

        return {
            "status": "processed",
            "data_points": len(data),
            "sample_rate": sample_rate,
            "channel": channel,
            "analysis": analysis_result,
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        msg = f"Failed to process EEG data: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.post("/stream/start")
async def start_eeg_stream(
    sample_rate: float = Body(250.0, description="Sample rate in Hz"),
    channels: List[str] = Body(
        ["default"], description="EEG channels"
    ),
    buffer_size: int = Body(1000, description="Buffer size for streaming"),
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Start EEG data streaming.

    Initializes streaming mode for continuous EEG data processing.
    """
    try:
        stream_id = await jona.start_eeg_stream(
            sample_rate=sample_rate,
            channels=channels,
            buffer_size=buffer_size
        )

        return {
            "stream_id": stream_id,
            "status": "started",
            "sample_rate": sample_rate,
            "channels": channels,
            "buffer_size": buffer_size,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to start EEG stream: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.post("/stream/{stream_id}/data")
async def stream_eeg_data(
    stream_id: str,
    data: Dict[str, List[float]] = Body(
        ..., description="EEG data by channel"
    ),
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Stream EEG data.

    Submit streaming EEG data for real-time processing.
    """
    try:
        if not data:
            msg = "EEG data cannot be empty"
            raise HTTPException(status_code=400, detail=msg)

        # Process streaming data
        result = await jona.process_eeg_stream(stream_id, data)

        total_samples = sum(len(samples) for samples in data.values())

        return {
            "stream_id": stream_id,
            "status": "processed",
            "channels_processed": len(data),
            "total_samples": total_samples,
            "result": result,
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        msg = f"Failed to process EEG stream: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.post("/stream/{stream_id}/stop")
async def stop_eeg_stream(
    stream_id: str,
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Stop EEG data streaming.

    Terminates the specified EEG stream.
    """
    try:
        result = await jona.stop_eeg_stream(stream_id)

        return {
            "stream_id": stream_id,
            "status": "stopped",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to stop EEG stream: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/metrics")
async def get_eeg_metrics(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get current EEG metrics.

    Returns the latest EEG processing metrics.
    """
    try:
        metrics = await jona.get_eeg_metrics()

        return {
            "metrics": metrics.to_dict() if metrics else None,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get EEG metrics: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/analysis/history")
async def get_eeg_analysis_history(
    limit: int = Query(
        50, max=500, description="Maximum number of history entries"
    ),
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get EEG analysis history.

    Returns historical EEG analysis results.
    """
    try:
        history = await jona.get_eeg_analysis_history(limit)

        # Convert history to dict format
        history_data = []
        for entry in history:
            entry_dict = {
                "timestamp": entry.timestamp.isoformat(),
                "data_points": len(entry.samples),
                "sample_rate": entry.sample_rate,
                "channel": entry.channel,
                "metrics": (entry.metrics.to_dict() if entry.metrics
                            else None)
            }
            history_data.append(entry_dict)

        return {
            "history": history_data,
            "count": len(history_data),
            "limit": limit,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get EEG analysis history: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/brainwaves")
async def get_brainwave_analysis(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get brainwave analysis.

    Returns current brainwave state analysis.
    """
    try:
        analysis = await jona.get_brainwave_analysis()

        return {
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get brainwave analysis: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.post("/calibrate")
async def calibrate_eeg(
    calibration_data: List[float] = Body(
        ..., description="Calibration EEG data"
    ),
    duration_seconds: float = Body(
        30.0, description="Calibration duration in seconds"
    ),
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Calibrate EEG processing.

    Performs calibration using baseline EEG data.
    """
    try:
        if not calibration_data:
            msg = "Calibration data cannot be empty"
            raise HTTPException(status_code=400, detail=msg)

        result = await jona.calibrate_eeg(
            calibration_data, duration_seconds
        )

        return {
            "status": "calibrated",
            "calibration_samples": len(calibration_data),
            "duration_seconds": duration_seconds,
            "result": result,
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        msg = f"Failed to calibrate EEG: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/status")
async def get_eeg_status(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get EEG processing status.

    Returns the current status of EEG processing components.
    """
    try:
        status = await jona.get_eeg_status()

        return {
            "status": status,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get EEG status: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.post("/filter")
async def apply_eeg_filter(
    data: List[float] = Body(..., description="EEG data to filter"),
    filter_type: str = Body(
        ..., description="Filter type (lowpass, highpass, bandpass, notch)"
    ),
    cutoff_freq: Optional[float] = Body(
        None, description="Cutoff frequency in Hz"
    ),
    order: int = Body(4, description="Filter order"),
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Apply digital filter to EEG data.

    Filters EEG data using specified filter parameters.
    """
    try:
        if not data:
            msg = "EEG data cannot be empty"
            raise HTTPException(status_code=400, detail=msg)

        filtered_data = await jona.apply_eeg_filter(
            data, filter_type, cutoff_freq, order
        )

        return {
            "status": "filtered",
            "original_samples": len(data),
            "filtered_samples": len(filtered_data),
            "filter_type": filter_type,
            "cutoff_freq": cutoff_freq,
            "order": order,
            "filtered_data": filtered_data[:1000],
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        msg = f"Failed to apply EEG filter: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/frequency/bands")
async def get_frequency_bands() -> Dict[str, Any]:
    """
    Get EEG frequency bands.

    Returns standard EEG frequency band definitions.
    """
    frequency_bands = {
        "delta": {
            "range": "0.5-4 Hz",
            "description": "Deep sleep, healing"
        },
        "theta": {
            "range": "4-8 Hz",
            "description": "Meditation, creativity"
        },
        "alpha": {
            "range": "8-12 Hz",
            "description": "Relaxed awareness"
        },
        "beta": {
            "range": "12-30 Hz",
            "description": "Active thinking"
        },
        "gamma": {
            "range": "30-100 Hz",
            "description": "Higher cognitive functions"
        }
    }

    return {
        "frequency_bands": frequency_bands,
        "timestamp": datetime.now().isoformat()
    }


@router.post("/detect/artifacts")
async def detect_artifacts(
    data: List[float] = Body(..., description="EEG data to analyze"),
    threshold: float = Body(
        100.0, description="Artifact detection threshold"
    ),
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Detect artifacts in EEG data.

    Identifies and marks artifacts in EEG signals.
    """
    try:
        if not data:
            msg = "EEG data cannot be empty"
            raise HTTPException(status_code=400, detail=msg)

        artifacts = await jona.detect_eeg_artifacts(data, threshold)

        artifact_percentage = (len(artifacts) / len(data)) * 100

        return {
            "status": "analyzed",
            "data_samples": len(data),
            "artifacts_detected": len(artifacts),
            "threshold": threshold,
            "artifacts": artifacts[:100],
            "artifact_percentage": artifact_percentage,
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        msg = f"Failed to detect artifacts: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/connectivity")
async def get_brain_connectivity(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get brain connectivity analysis.

    Returns analysis of connectivity between brain regions.
    """
    try:
        connectivity = await jona.get_brain_connectivity()

        return {
            "connectivity": connectivity,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get brain connectivity: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.post("/export")
async def export_eeg_data(
    format: str = Body("json", description="Export format (json, csv, mat)"),
    include_metrics: bool = Body(
        True, description="Include computed metrics"
    ),
    time_range: Optional[Dict[str, str]] = Body(
        None, description="Time range for export"
    ),
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Export EEG data.

    Exports EEG data and analysis results in specified format.
    """
    try:
        export_data = await jona.export_eeg_data(
            format=format,
            include_metrics=include_metrics,
            time_range=time_range
        )

        return {
            "status": "exported",
            "format": format,
            "include_metrics": include_metrics,
            "data": export_data,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to export EEG data: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e
