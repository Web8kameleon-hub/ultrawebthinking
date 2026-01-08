"""
JONA EEG Engine
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Any, List, Optional


@dataclass
class EEGData:
    """EEG data container"""
    samples: List[float]
    sample_rate: float
    channel: str = "default"
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EEGMetrics:
    """EEG analysis metrics"""
    alpha_power: float = 0.0
    beta_power: float = 0.0
    theta_power: float = 0.0
    delta_power: float = 0.0
    gamma_power: float = 0.0

    def to_dict(self) -> Dict[str, float]:
        """Convert to dictionary"""
        return {
            "alpha_power": self.alpha_power,
            "beta_power": self.beta_power,
            "theta_power": self.theta_power,
            "delta_power": self.delta_power,
            "gamma_power": self.gamma_power
        }


class EEGEngine:
    """EEG processing engine"""

    def __init__(self) -> None:
        """Initialize EEG engine"""
        self.active_streams: Dict[str, Any] = {}
        self.metrics_history: List[EEGMetrics] = []

    async def process_eeg_data(
        self, data: EEGData
    ) -> Dict[str, Any]:
        """Process EEG data"""
        metrics = EEGMetrics()
        self.metrics_history.append(metrics)
        return {"status": "processed", "metrics": metrics.to_dict()}

    async def start_stream(
        self,
        stream_id: str,
        sample_rate: float = 250.0,
        channels: Optional[List[str]] = None,
        buffer_size: int = 1000
    ) -> str:
        """Start EEG stream"""
        self.active_streams[stream_id] = {
            "sample_rate": sample_rate,
            "channels": channels or ["default"],
            "buffer_size": buffer_size,
            "created_at": datetime.now()
        }
        return stream_id

    async def stop_stream(self, stream_id: str) -> Dict[str, Any]:
        """Stop EEG stream"""
        if stream_id in self.active_streams:
            del self.active_streams[stream_id]
        return {"status": "stopped", "stream_id": stream_id}
