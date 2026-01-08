"""
JONA Session Manager
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Any
from enum import Enum


class SessionStatus(Enum):
    """Session status enumeration"""
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    EXPIRED = "expired"
    TERMINATED = "terminated"


class SessionType(Enum):
    """Session type enumeration"""
    INTERACTIVE = "interactive"
    THERAPEUTIC = "therapeutic"
    MONITORING = "monitoring"
    DIAGNOSTIC = "diagnostic"


@dataclass
class SessionData:
    """Session data container"""
    session_id: str
    user_id: str
    status: SessionStatus = SessionStatus.ACTIVE
    session_type: SessionType = SessionType.INTERACTIVE
    created_at: datetime = field(default_factory=datetime.now)
    last_activity: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def is_expired(self) -> bool:
        """Check if session is expired"""
        return self.status == SessionStatus.EXPIRED

    def update_activity(self) -> None:
        """Update last activity timestamp"""
        self.last_activity = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "session_id": self.session_id,
            "user_id": self.user_id,
            "status": self.status.value,
            "session_type": self.session_type.value,
            "created_at": self.created_at.isoformat(),
            "last_activity": self.last_activity.isoformat(),
            "metadata": self.metadata
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> "SessionData":
        """Create from dictionary"""
        return SessionData(
            session_id=data["session_id"],
            user_id=data["user_id"],
            status=SessionStatus(data["status"]),
            session_type=SessionType(data["session_type"]),
            created_at=datetime.fromisoformat(data["created_at"]),
            last_activity=datetime.fromisoformat(
                data["last_activity"]
            ),
            metadata=data.get("metadata", {})
        )
