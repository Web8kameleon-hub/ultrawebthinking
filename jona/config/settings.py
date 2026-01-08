"""
JONA Configuration Settings
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class JONAConfig:
    """Main JONA configuration"""
    debug: bool = False
    host: str = "127.0.0.1"
    port: int = 8000
    log_level: str = "INFO"
    session_timeout_hours: int = 24
    cache_enabled: bool = True
    storage_path: str = "./data/jona"

    def __post_init__(self) -> None:
        """Validate configuration"""
        if not self.host:
            raise ValueError("Host cannot be empty")
        if self.port < 1 or self.port > 65535:
            raise ValueError("Port must be between 1 and 65535")
        if self.session_timeout_hours < 1:
            raise ValueError("Session timeout must be at least 1 hour")
