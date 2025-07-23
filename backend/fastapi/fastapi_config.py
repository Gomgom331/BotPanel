# from pydantic_settings import BaseSettings
# from functools import lru_cache
# from pathlib import Path
# from dotenv import load_dotenv
# import os

# # 기본 환경 설정
# os.environ.setdefault("ENV", "development")

# # 환경 파일 로드
# env_name = os.getenv("ENV")
# env_path = Path(__file__).resolve().parent / f".env.{env_name}"
# load_dotenv(dotenv_path=env_path)

# class Settings(BaseSettings):
#     debug: bool = False
#     ENV: str = env_name
#     API_TITLE: str = "FastAPI 기본"
#     API_DESCRIPTION: str = "기본 설명"

#     class Config:
#         env_file = env_path
#         env_file_encoding = "utf-8"

# @lru_cache()
# def get_settings():
#     return Settings()


from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path
from dotenv import load_dotenv
import os

os.environ.setdefault("ENV", "development")
env_name = os.getenv("ENV")
env_path = Path(__file__).resolve().parent / f".env.{env_name}"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    debug: bool = False
    ENV: str = env_name
    API_TITLE: str = "FastAPI 기본"
    API_DESCRIPTION: str = "기본 설명"
    fastapi_hf_token_key: str  

    class Config:
        env_file = env_path
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings():
    return Settings()
