"""
JONA Logging Utilities
"""

import logging
from typing import Dict, Any, Optional


def get_jona_logger(name: str) -> logging.Logger:
    """Get a configured logger for JONA"""
    return logging.getLogger(name)


def setup_logging(config: Optional[Dict[str, Any]] = None) -> None:
    """Setup logging configuration"""
    config = config or {"level": "INFO"}

    level = config.get("level", "INFO")
    log_format = (
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    logging.basicConfig(
        level=level,
        format=log_format,
        handlers=[
            logging.StreamHandler(),
        ]
    )
