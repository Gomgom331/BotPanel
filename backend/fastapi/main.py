from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from init_django import init_django
from fastapi_config import get_settings
import os, sys

# 라우터들 불러오기
from routers import auth, emotion

# 현재 path 확인
# print("현재 sys.path:", sys.path)

# Django 초기화
init_django()

# 설정 로드
os.environ.setdefault("ENV", "development")
settings = get_settings()

# FastAPI 앱 생성
app = FastAPI(title="FastAPI + Django")

# CORS 설정 (React 3000번 포트와 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록 (기능별 prefix 구분)
# app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(emotion.router, prefix="/test", tags=["Emotion"])