"""
Configuration settings
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""

    # Groq API Configuration
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # Server Configuration
    NODE_ENV: str = "development"
    PORT: int = 5001

    # Rate Limiting
    RATE_LIMIT_WINDOW_MS: int = 15 * 60 * 1000  # 15 minutes
    RATE_LIMIT_MAX: int = 100

    # Groq Timeouts (milliseconds)
    GROQ_TIMEOUT_FAST: int = 15000
    GROQ_TIMEOUT_NORMAL: int = 30000
    GROQ_TIMEOUT_MOBILE: int = 10000

    # Groq Token Limits
    GROQ_TOKENS_FAST: int = 1000
    GROQ_TOKENS_NORMAL: int = 2000
    GROQ_TOKENS_MOBILE: int = 800

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()


def validate_env():
    """Validate environment variables"""
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is required but not set in environment")

    if not settings.GROQ_MODEL:
        raise ValueError("GROQ_MODEL is required but not set in environment")

    print("✅ Environment variables validated")


# Constants
RATE_LIMIT_CONFIG = {
    "windowMs": settings.RATE_LIMIT_WINDOW_MS,
    "max": settings.RATE_LIMIT_MAX
}

GROQ_TIMEOUT = {
    "fast": settings.GROQ_TIMEOUT_FAST / 1000,  # Convert to seconds
    "normal": settings.GROQ_TIMEOUT_NORMAL / 1000,
    "mobile": settings.GROQ_TIMEOUT_MOBILE / 1000
}

GROQ_TOKENS = {
    "fast": settings.GROQ_TOKENS_FAST,
    "normal": settings.GROQ_TOKENS_NORMAL,
    "mobile": settings.GROQ_TOKENS_MOBILE
}
