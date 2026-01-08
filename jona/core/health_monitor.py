"""
Health Monitor for JONA - System health tracking
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Any, Optional
from enum import Enum


class HealthStatus(Enum):
    """Health status levels"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    CRITICAL = "critical"


@dataclass
class SystemHealth:
    """System health metrics"""
    status: HealthStatus = HealthStatus.HEALTHY
    uptime_seconds: float = 0.0
    cpu_usage: float = 0.0
    memory_usage: float = 0.0
    disk_usage: float = 0.0
    api_latency_ms: float = 0.0
    active_sessions: int = 0
    request_count: int = 0
    error_count: int = 0
    last_check: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "status": self.status.value,
            "uptime_seconds": self.uptime_seconds,
            "cpu_usage": self.cpu_usage,
            "memory_usage": self.memory_usage,
            "disk_usage": self.disk_usage,
            "api_latency_ms": self.api_latency_ms,
            "active_sessions": self.active_sessions,
            "request_count": self.request_count,
            "error_count": self.error_count,
            "last_check": self.last_check.isoformat()
        }

    @property
    def error_rate(self) -> float:
        """Calculate error rate"""
        if self.request_count == 0:
            return 0.0
        return (self.error_count / self.request_count) * 100


class HealthMonitor:
    """Monitors system health"""

    def __init__(self):
        self.start_time = datetime.utcnow()
        self.health = SystemHealth()
        self.checks: Dict[str, Any] = {}

    def update_health(self, metrics: Dict[str, Any]) -> SystemHealth:
        """Update health metrics"""
        self.health.cpu_usage = metrics.get("cpu_usage", 0.0)
        self.health.memory_usage = metrics.get("memory_usage", 0.0)
        self.health.disk_usage = metrics.get("disk_usage", 0.0)
        self.health.api_latency_ms = metrics.get("api_latency_ms", 0.0)
        self.health.active_sessions = metrics.get("active_sessions", 0)
        self.health.request_count = metrics.get("request_count", 0)
        self.health.error_count = metrics.get("error_count", 0)

        # Calculate uptime
        uptime = (datetime.utcnow() - self.start_time).total_seconds()
        self.health.uptime_seconds = uptime

        # Determine status
        self.health.status = self._calculate_status()
        self.health.last_check = datetime.utcnow()

        return self.health

    def _calculate_status(self) -> HealthStatus:
        """Calculate overall health status"""
        error_rate = self.health.error_rate

        if self.health.cpu_usage > 90 or self.health.memory_usage > 95:
            return HealthStatus.CRITICAL
        elif error_rate > 10 or self.health.cpu_usage > 75 or self.health.memory_usage > 85:
            return HealthStatus.UNHEALTHY
        elif error_rate > 5 or self.health.cpu_usage > 60 or self.health.memory_usage > 70:
            return HealthStatus.DEGRADED
        else:
            return HealthStatus.HEALTHY

    def get_health(self) -> SystemHealth:
        """Get current health status"""
        return self.health

    def is_healthy(self) -> bool:
        """Check if system is healthy"""
        return self.health.status in [HealthStatus.HEALTHY, HealthStatus.DEGRADED]

    def add_check(self, check_name: str, result: bool, details: Optional[str] = None) -> None:
        """Add health check result"""
        self.checks[check_name] = {
            "result": result,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        }

    def get_checks(self) -> Dict[str, Any]:
        """Get all health checks"""
        return self.checks
