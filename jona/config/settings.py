"""
JONA Production Settings - Hetzner Deployment
Environment-based configuration management
"""

from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache


class Settings(BaseSettings):
    """Production-grade settings with environment variables"""

    # Application
    app_name: str = "JONA - Intelligent Neural Operating Architecture"
    app_version: str = "1.0.0"
    environment: str = "production"
    debug: bool = False

    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_workers: int = 4
    api_timeout: int = 30
    api_rate_limit: int = 1000

    # Database
    database_url: str = "postgresql://jona:password@localhost:5432/jona_db"
    database_pool_size: int = 20
    database_pool_timeout: int = 30
    database_pool_recycle: int = 3600

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    redis_pool_size: int = 10
    redis_ttl: int = 86400

    # MongoDB
    mongo_url: str = "mongodb://localhost:27017"
    mongo_db: str = "jona_prod"

    # Security
    jwt_secret: str = "your-super-secret-jwt-key"
    jwt_algorithm: str = "HS256"
    jwt_expiration: int = 3600
    cors_origins: list = ["*"]
    allowed_hosts: list = ["localhost", "127.0.0.1"]

    # Logging
    log_level: str = "INFO"
    log_format: str = "json"
    log_file: Optional[str] = None

    # Monitoring
    prometheus_enabled: bool = True
    prometheus_port: int = 9090
    prometheus_scrape_interval: int = 15

    # File Upload
    max_upload_size: int = 52428800  # 50MB
    upload_dir: str = "/data/uploads"

    # Feature Flags
    feature_eeg_analysis: bool = True
    feature_audio_synthesis: bool = True
    feature_health_monitoring: bool = True
    feature_session_management: bool = True

    class Config:
        env_file = ".env.production"
        case_sensitive = False
        extra = "allow"


@lru_cache()
def get_settings() -> Settings:
    """Get settings singleton"""
    return Settings()


settings = get_settings()
