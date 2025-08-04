from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path
from dotenv import load_dotenv
import os


BASE_DIR = Path(__file__).resolve().parent
# .env.common 항상 먼저 로드 (override=False)
load_dotenv(dotenv_path=BASE_DIR / ".env.common", override=False)

# ENV가 없으면 기본 설정은 local 만약 잇으면 다른 값으로 실행
os.environ.setdefault("ENV", "local")
env_name = os.getenv("ENV")
env_path = BASE_DIR / f".env.{env_name}"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    debug: bool = False
    ENV: str = env_name
    API_TITLE: str = "FastAPI 기본"
    API_DESCRIPTION: str = "기본 설명"
    fastapi_hf_token_key: str  
    django_app_dir: str = "../django_app"

    class Config:
        env_file = env_path
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings():
    return Settings()
