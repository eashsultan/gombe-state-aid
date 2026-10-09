"""Application settings. All values come from environment / .env."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Gombe State Aid Summit API"
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = "postgresql+asyncpg://user:password@db:5432/gombe_summit"
    SYNC_DATABASE_URL: str = "postgresql+psycopg2://user:password@db:5432/gombe_summit"

    SECRET_KEY: str = "change-me-to-a-long-random-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    SMTP_HOST: str = "mailhog"
    SMTP_PORT: int = 1025
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@gombe-summit.ng"

    REDIS_URL: str = "redis://redis:6379/0"
    STORAGE_DIR: str = "/data/uploads"
    FRONTEND_URL: str = "http://localhost:3000"
    RESEND_WEBHOOK_SECRET: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
