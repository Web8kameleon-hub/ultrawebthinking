#!/usr/bin/env python3
"""
JONA Main Application
====================

Main entry point for JONA system.
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


class JONAApplication:
    """Main JONA application class"""

    def __init__(self, config: JONAConfig):
        self.config = config
        self.jona_character: Optional[JonaCharacter] = None
        self.running = False

    async def initialize(self) -> bool:
        """Initialize the JONA system"""
        logger.info("Initializing JONA system...")

        try:
            # Create JONA character
            self.jona_character = JonaCharacter(self.config)
            await self.jona_character.start()

            logger.info("JONA system initialized successfully")
            return True

        except Exception as e:
            logger.error("Failed to initialize JONA system: %s", e)
            return False

    async def run(self):
        """Run the JONA application"""
        if not await self.initialize():
            return

        self.running = True
        logger.info("JONA system started")

        # Setup signal handlers
        def signal_handler(_signum: int, _frame: object) -> None:
            logger.info("Received signal, shutting down...")
            self.running = False

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

        try:
            # Main application loop
            while self.running:
                await asyncio.sleep(1)

                # Check system health
                if self.jona_character:
                    health_monitor = self.jona_character.health_monitor
                    health = await health_monitor.get_overall_health()
                    if health.value == "critical":
                        logger.warning("System health is critical")

        except Exception as e:
            logger.error("Error in main loop: %s", e)

        finally:
            await self.shutdown()

    async def shutdown(self) -> None:
        """Shutdown the JONA system"""
        logger.info("Shutting down JONA system...")

        try:
            if self.jona_character:
                await self.jona_character.stop()

            logger.info("JONA system shut down successfully")

        except Exception as e:
            logger.error("Error during shutdown: %s", e)


def main() -> None:
    """Main entry point"""
    # Setup logging
    logging_config = {
        'level': 'INFO',
        'name': 'jona_main'
    }
    setup_logging(logging_config)

    logger.info("Starting JONA Main Application")

    # Create configuration
    config = JONAConfig()

    # Create and run application
    app = JONAApplication(config)

    try:
        asyncio.run(app.run())
    except KeyboardInterrupt:
        logger.info("Application interrupted by user")
    except Exception as e:
        logger.error("Application error: %s", e)
        sys.exit(1)


def run_api_server() -> None:
    """Run the API server"""
    logging_config = {
        'level': 'INFO',
        'name': 'jona_api'
    }
    setup_logging(logging_config)

    logger.info("Starting JONA API Server")
    run_server()


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--api":
        run_api_server()
    else:
        main()
