import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MedICARE AI Backend"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "medicare-ai-demo-secret-key-32-chars-minimum")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Database: PostgreSQL with SQLite fallback for local verification
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./medicare_ai_demo.db")

    # Vector Database
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")

    # AI API Keys
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    MEDICAL_AI_API_KEY: str = os.getenv("MEDICAL_AI_API_KEY", "")

    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://medicare-ai.vercel.app"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
