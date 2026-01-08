#!/usr/bin/env python3
"""
JONA Main Entry Point - Justice, Order, Nature, Authenticity
© 2025 UltraWebThinking. All Rights Reserved.
"""

import asyncio
import sys
import signal
from pathlib import Path
from typing import Optional

from jona.config import JONAConfig
from jona.core.jona_character import JonaCharacter
from jona.api.fastapi_app import run_server
from jona.utils.logging import get_jona_logger, setup_logging

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

logger = get_jona_logger(__name__)


async def initialize_jona() -> JonaCharacter:
    """Initialize JONA character instance"""
    try:
        config = JONAConfig()
        jona = JonaCharacter(config=config)
        await jona.initialize()
        logger.info("JONA initialized successfully")
        return jona
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise
    except RuntimeError as e:
        logger.error(f"Initialization error: {e}")
        raise


def handle_shutdown(
    _signum: int,
    _frame: Optional[object]
) -> None:
    """Handle graceful shutdown on signal"""
    logger.info("Shutdown signal received")
    asyncio.create_task(shutdown())


async def shutdown() -> None:
    """Graceful shutdown routine"""
    try:
        logger.info("Shutting down JONA...")
        # Add cleanup logic here
    except RuntimeError as e:
        logger.error(f"Shutdown error: {e}")


async def main() -> None:
    """Main entry point"""
    try:
        # Initialize JONA
        jona = await initialize_jona()

        # Setup signal handlers
        signal.signal(signal.SIGINT, handle_shutdown)
        signal.signal(signal.SIGTERM, handle_shutdown)

        # Run FastAPI server
        await run_server(jona)

    except (ValueError, RuntimeError) as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
        sys.exit(0)


if __name__ == "__main__":
    asyncio.run(main())
