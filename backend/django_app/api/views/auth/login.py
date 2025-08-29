# /app/api/views/login_user.py
from django.http import JsonResponse
from django.views import View
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
import json

# 모델
from users.models import CustomUser

# 쿠키
from api.utils.cookie import COOKIE_COMMON, ACCESS_MAX_AGE, REFRESH_MAX_AGE

class LoginView(View):
    """
    POST /auth/login/
    body: { "username": "...", "password": "..." }
    성공 시: HttpOnly 쿠키(access, refresh) 세팅 + 얇은 응답
    실패 시: 400/401
    """

    def post(self, request, *args, **kwargs):
        try:
            # JSON 파싱
            try:
                data = json.loads(request.body or "{}")
            except json.JSONDecodeError:
                return JsonResponse({"success": False, "error": "INVALID_JSON"}, status=400)

            username = (data.get("username") or "").strip()
            password = data.get("password") or ""

            print(f"[LOGIN] username={username}, password={'*' * len(password) if password else 'None'}")

            # 필수 검증
            if not username or not password:
                return JsonResponse({
                    "success": False,
                    "error": "아이디와 비밀번호를 모두 입력해주세요."
                }, status=400)

            # 사용자 존재 여부 (삭제 제외)
            try:
                user_obj = CustomUser.objects.get(username=username, is_deleted=False)
            except CustomUser.DoesNotExist:
                return JsonResponse({"success": False, "error": "존재하지 않는 사용자입니다."}, status=401)

            # 비밀번호 검증 (또는 authenticate 사용 가능)
            if not user_obj.check_password(password):
                return JsonResponse({"success": False, "error": "비밀번호가 올바르지 않습니다."}, status=401)

            # 활성 상태 확인
            if not user_obj.is_active:
                return JsonResponse({
                    "success": False,
                    "error": "승인되지 않은 계정입니다. 관리자에게 문의하세요."
                }, status=401)

            # 토큰 발급 → HttpOnly 쿠키 저장
            refresh = RefreshToken.for_user(user_obj)
            access  = str(refresh.access_token)

            resp = JsonResponse({"success": True, "message": "LOGIN_OK"}, status=200)
            resp.set_cookie("access",  access,        max_age=ACCESS_MAX_AGE,  **COOKIE_COMMON)
            resp.set_cookie("refresh", str(refresh),  max_age=REFRESH_MAX_AGE, **COOKIE_COMMON)
            return resp

        except Exception as e:
            # 예기치 못한 에러 캡처
            print(f"[LOGIN][ERROR] {e}")
            return JsonResponse({
                "success": False,
                "error": f"로그인 처리 중 오류가 발생했습니다: {str(e)}"
            }, status=500)

    def get(self, request, *args, **kwargs):
        return JsonResponse({"success": False, "error": "POST 요청으로 로그인해주세요."}, status=405)

    def put(self, request, *args, **kwargs):
        return JsonResponse({"success": False, "error": "PUT 메서드는 지원하지 않습니다."}, status=405)

    def delete(self, request, *args, **kwargs):
        return JsonResponse({"success": False, "error": "DELETE 메서드는 지원하지 않습니다."}, status=405)
