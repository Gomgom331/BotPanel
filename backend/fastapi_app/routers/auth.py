# # backend/fastapi/routers/auth.py

# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from django.contrib.auth import authenticate
# from django.contrib.auth.models import User  # Django 모델 import

# router = APIRouter(tags=["Auth"])

# class LoginRequest(BaseModel):
#     username: str
#     password: str

# @router.post("/login")
# async def login_api(data: LoginRequest):
#     user = authenticate(username=data.username, password=data.password)
#     if not user:
#         raise HTTPException(status_code=401, detail="Invalid credentials")
#     # Django ORM을 통해 추가 정보 조회/수정 가능
#     return {"message": "Login success", "username": user.username}
