from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App
    APP_NAME: str = "wardrobe-ai-shop"
    APP_VERSION: str = "0.1.0"
    APP_ENV: str = "development"   # development / production
    DEBUG: bool = False

    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # API
    API_V1_PREFIX: str = "/api/v1"

    # Database (no default, so the app fails loudly if it's missing)
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()