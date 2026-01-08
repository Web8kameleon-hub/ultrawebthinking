"""
Alert System for JONA - Status and incident management
"""

from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional


class AlertLevel(Enum):
    """Alert severity levels"""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


@dataclass
class Alert:
    """Alert data structure"""
    level: AlertLevel
    message: str
    timestamp: datetime
    source: str
    resolved: bool = False

    def to_dict(self) -> dict:
        return {
            "level": self.level.value,
            "message": self.message,
            "timestamp": self.timestamp.isoformat(),
            "source": self.source,
            "resolved": self.resolved
        }


class AlertSystem:
    """Manages system alerts and notifications"""

    def __init__(self):
        self.alerts: List[Alert] = []
        self.max_alerts = 1000

    def create_alert(self, level: AlertLevel, message: str, source: str) -> Alert:
        """Create new alert"""
        alert = Alert(
            level=level,
            message=message,
            timestamp=datetime.utcnow(),
            source=source
        )
        self.alerts.append(alert)
        
        # Keep only last N alerts
        if len(self.alerts) > self.max_alerts:
            self.alerts = self.alerts[-self.max_alerts:]
        
        return alert

    def resolve_alert(self, alert_index: int) -> Optional[Alert]:
        """Mark alert as resolved"""
        if 0 <= alert_index < len(self.alerts):
            self.alerts[alert_index].resolved = True
            return self.alerts[alert_index]
        return None

    def get_active_alerts(self) -> List[Alert]:
        """Get unresolved alerts"""
        return [a for a in self.alerts if not a.resolved]

    def get_critical_alerts(self) -> List[Alert]:
        """Get critical unresolved alerts"""
        return [a for a in self.alerts 
                if not a.resolved and a.level == AlertLevel.CRITICAL]

    def clear_resolved(self) -> int:
        """Remove resolved alerts, return count"""
        before = len(self.alerts)
        self.alerts = [a for a in self.alerts if not a.resolved]
        return before - len(self.alerts)
