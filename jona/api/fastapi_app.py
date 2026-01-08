"""
JONA FastAPI Application
"""

from fastapi import FastAPI
from typing import Optional

from jona.core.jona_character import JonaCharacter


def create_app(jona: Optional[JonaCharacter] = None) -> FastAPI:
    """Create FastAPI application"""
    app = FastAPI(
        title="JONA API",
        description="Justice, Order, Nature, Authenticity Framework",
        version="1.0.0"
    )

    @app.get("/")
    async def root() -> dict:
        """Root endpoint"""
        return {
            "message": "JONA API Server",
            "version": "1.0.0",
            "status": "running"
        }

    @app.get("/health")
    async def health_check() -> dict:
        """Health check endpoint"""
        return {
            "status": "healthy",
            "service": "jona"
        }

    return app


async def run_server(
    jona: Optional[JonaCharacter] = None,
    host: str = "127.0.0.1",
    port: int = 8000
) -> None:
    """Run the FastAPI server"""
    import uvicorn

    app = create_app(jona)

    config = uvicorn.Config(
        app=app,
        host=host,
        port=port,
        log_level="info"
    )
    server = uvicorn.Server(config)
    await server.serve()
