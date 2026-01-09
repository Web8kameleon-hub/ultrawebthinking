"""
JONA Production Settings - Hetzner Deployment
Environment-based configuration management with .env support
"""

from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache
import os


class Settings(BaseSettings):
    """
    Production-grade settings with environment variables
    Reads from .env file or environment variables
    """

    # Application
    app_name: str = os.getenv("APP_NAME", "JONA - Intelligent Neural Operating Architecture")
    app_version: str = os.getenv("APP_VERSION", "1.0.0")
    environment: str = os.getenv("ENVIRONMENT", "production")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"

    # API Configuration
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    api_workers: int = int(os.getenv("API_WORKERS", "4"))
    api_timeout: int = int(os.getenv("API_TIMEOUT", "30"))
    api_rate_limit: int = int(os.getenv("API_RATE_LIMIT", "1000"))

    # Database (from .env)
    database_url: str = os.getenv("DATABASE_URL", "postgresql://jona:password@localhost:5432/jona_db")
    database_pool_size: int = int(os.getenv("DATABASE_POOL_SIZE", "20"))
    database_pool_timeout: int = int(os.getenv("DATABASE_POOL_TIMEOUT", "30"))
    database_pool_recycle: int = int(os.getenv("DATABASE_POOL_RECYCLE", "3600"))

    # Redis (from .env)
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    redis_pool_size: int = int(os.getenv("REDIS_POOL_SIZE", "10"))
    redis_ttl: int = int(os.getenv("REDIS_TTL", "86400"))

    # MongoDB (from .env)
    mongo_url: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    mongo_db: str = os.getenv("MONGO_DB", "jona_prod")

    # Security (from .env - CRITICAL!)
    jwt_secret: str = os.getenv("JWT_SECRET", "CHANGE_ME_TO_A_VERY_LONG_RANDOM_STRING")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_expiration: int = int(os.getenv("JWT_EXPIRATION", "3600"))
    cors_origins: list = ["*"]  # Can be customized in .env as JSON
    allowed_hosts: list = ["localhost", "127.0.0.1"]

    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    log_format: str = os.getenv("LOG_FORMAT", "json")
    log_file: Optional[str] = os.getenv("LOG_FILE", None)

    # Monitoring
    prometheus_enabled: bool = os.getenv("PROMETHEUS_ENABLED", "true").lower() == "true"
    prometheus_port: int = int(os.getenv("PROMETHEUS_PORT", "9090"))
    prometheus_scrape_interval: int = int(os.getenv("PROMETHEUS_SCRAPE_INTERVAL", "15"))

    # File Upload
    max_upload_size: int = int(os.getenv("MAX_UPLOAD_SIZE", "52428800"))  # 50MB
    upload_dir: str = "/data/uploads"

    # ==================== EXTERNAL LLM SERVICES ====================
    # Groq API (for fast inference)
    groq_api_key: Optional[str] = os.getenv("GROQ_API_KEY", None)
    groq_model: str = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")
    groq_enabled: bool = groq_api_key is not None

    # OpenAI API (optional alternative)
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4")
    openai_enabled: bool = openai_api_key is not None

    # Anthropic API (optional alternative)
    anthropic_api_key: Optional[str] = os.getenv("ANTHROPIC_API_KEY", None)
    anthropic_model: str = os.getenv("ANTHROPIC_MODEL", "claude-3-opus")
    anthropic_enabled: bool = anthropic_api_key is not None

    # ==================== INFRASTRUCTURE (ADMIN ONLY) ====================
    # Hetzner Configuration - NOT exposed to clients
    hetzner_token: Optional[str] = os.getenv("HETZNER_TOKEN", None)
    hetzner_region: str = os.getenv("HETZNER_REGION", "nbg1")
    hetzner_monthly_cost: float = float(os.getenv("HETZNER_MONTHLY_COST", "8.99"))

    # ==================== EMAIL SERVICE (Optional) ====================
    smtp_server: Optional[str] = os.getenv("SMTP_SERVER", None)
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_username: Optional[str] = os.getenv("SMTP_USERNAME", None)
    smtp_password: Optional[str] = os.getenv("SMTP_PASSWORD", None)
    smtp_enabled: bool = smtp_server is not None

    # ==================== NOTIFICATIONS ====================
    slack_webhook_url: Optional[str] = os.getenv("SLACK_WEBHOOK_URL", None)
    slack_enabled: bool = slack_webhook_url is not None

    # ==================== PAYMENTS (Optional) ====================
    stripe_api_key: Optional[str] = os.getenv("STRIPE_API_KEY", None)
    stripe_webhook_secret: Optional[str] = os.getenv("STRIPE_WEBHOOK_SECRET", None)
    stripe_enabled: bool = stripe_api_key is not None

    # Feature Flags
    feature_eeg_analysis: bool = True
    feature_audio_synthesis: bool = True
    feature_health_monitoring: bool = True
    feature_session_management: bool = True

    class Config:
        env_file = ".env"  # Load from .env file
        case_sensitive = False
        extra = "allow"


@lru_cache()
def get_settings() -> Settings:
    """Get settings singleton"""
    return Settings()


settings = get_settings()
