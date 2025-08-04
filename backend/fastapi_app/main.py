from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from init_django import init_django
from fastapi_config import get_settings
import os, sys
from pathlib import Path
from dotenv import load_dotenv

# 라우터들 불러오기
from routers import auth, emotion

# 현재 path 확인
# print("현재 sys.path:", sys.path)

# 항상 공통 env 먼저
BASE_DIR = Path(__file__).resolve().parent

common_env = BASE_DIR / ".env.common"
if common_env.exists():
    load_dotenv(common_env, override=False)

env = os.getenv("ENV","local")
env_file = BASE_DIR / f".env.{env}"

if env_file.exists():
    load_dotenv(env_file, override=True)
else:
    raise FileNotFoundError(f"지정된 환경 파일이 없습니다: {env_file}")
    
# 설정 로드
os.environ.setdefault("ENV", "local")
settings = get_settings()

# Django 초기화
init_django()

# FastAPI 앱 생성
app = FastAPI(
    title="FastAPI + Django",
    root_path="/fastapi",
)

# CORS 설정 (React 3000번 포트와 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록 (기능별 prefix 구분)
app.include_router(emotion.router, prefix="/test", tags=["Emotion"])