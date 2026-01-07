"""
Health Routes
=============

FastAPI routes for system health monitoring.
"""

from datetime import datetime
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Depends

from jona.core.jona_character import JonaCharacter


router = APIRouter()


def get_jona_character() -> JonaCharacter:
    """Get JONA character instance"""
    return JonaCharacter()


@router.get("/status")
async def health_status(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get overall system health status.

    Returns comprehensive health information for all JONA components.
    """
    try:
        health_data = await jona.get_health_status()

        return {
            "status": "healthy" if health_data.get("healthy") else "degraded",
            "components": health_data,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get health status: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/heartbeat")
async def heartbeat(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Simple heartbeat check.

    Returns confirmation that the system is running.
    """
    try:
        is_alive = await jona.is_alive()

        return {
            "alive": is_alive,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Heartbeat check failed: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/metrics")
async def health_metrics(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get detailed health metrics.

    Returns performance and resource metrics for all components.
    """
    try:
        metrics = await jona.get_system_metrics()

        return {
            "metrics": metrics,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get health metrics: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/components")
async def component_health(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get health status for individual components.

    Returns status for personality engine, EEG engine, etc.
    """
    try:
        components = await jona.get_component_health()

        return {
            "components": components,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get component health: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.post("/check")
async def health_check(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Perform comprehensive health check.

    Runs diagnostic tests on all components.
    """
    try:
        check_result = await jona.run_health_check()

        return {
            "status": "passed" if check_result.get("passed") else "failed",
            "results": check_result,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Health check failed: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/readiness")
async def readiness_probe(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Kubernetes readiness probe.

    Indicates if the service is ready to accept requests.
    """
    try:
        is_ready = await jona.is_ready()

        status_code = 200 if is_ready else 503

        return {
            "ready": is_ready,
            "status_code": status_code,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Readiness check failed: {str(e)}"
        raise HTTPException(status_code=503, detail=msg) from e


@router.get("/liveness")
async def liveness_probe(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Kubernetes liveness probe.

    Indicates if the service is still running.
    """
    try:
        is_live = await jona.is_alive()

        status_code = 200 if is_live else 503

        return {
            "live": is_live,
            "status_code": status_code,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Liveness check failed: {str(e)}"
        raise HTTPException(status_code=503, detail=msg) from e


@router.get("/dependencies")
async def dependency_check(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Check external dependencies status.

    Returns status of database, cache, API connections, etc.
    """
    try:
        dependencies = await jona.check_dependencies()

        return {
            "dependencies": dependencies,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Dependency check failed: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/resources")
async def resource_usage(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get current resource usage.

    Returns CPU, memory, and disk usage information.
    """
    try:
        resources = await jona.get_resource_usage()

        return {
            "resources": resources,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get resource usage: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/uptime")
async def uptime_info(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get system uptime information.

    Returns how long the system has been running.
    """
    try:
        uptime = await jona.get_uptime()

        return {
            "uptime_seconds": uptime,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get uptime: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.get("/alerts")
async def active_alerts(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Get currently active alerts.

    Returns any active health or performance alerts.
    """
    try:
        alerts = await jona.get_active_alerts()

        return {
            "alerts": alerts,
            "alert_count": len(alerts) if alerts else 0,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to get alerts: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e


@router.post("/restart")
async def restart_service(
    jona: JonaCharacter = Depends(get_jona_character)
) -> Dict[str, Any]:
    """
    Restart the JONA service.

    Performs a graceful restart of all components.
    """
    try:
        restart_result = await jona.restart_service()

        return {
            "status": "restarted",
            "result": restart_result,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        msg = f"Failed to restart service: {str(e)}"
        raise HTTPException(status_code=500, detail=msg) from e
