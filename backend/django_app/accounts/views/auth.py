# /app/api/views/login_user.py
from django.http import JsonResponse
from django.views import View
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
import json
import logging, traceback, uuid

# 로거
logger = logging.getLogger(__name__)

# 모델
from accounts.models import CustomUser
from rbac.models import Group
from rbac.models import GroupMembership

# 쿠키
from ..utils.cookie import COOKIE_COMMON, ACCESS_MAX_AGE, REFRESH_MAX_AGE


# 로그인 뷰
class LoginView(View):
    """
    POST /auth/login/
    body: { "username": "...", "password": "..." }
    성공 시: HttpOnly 쿠키(access, refresh) 세팅 + 얇은 응답
    실패 시: 400/401
    """

    def post(self, request, *args, **kwargs):
        try:
            # JSON 파싱 옳은 데이터 값인지--------------
            try:
                data = json.loads(request.body or "{}")
            except json.JSONDecodeError:
                return JsonResponse({"success": False, "formError": "INVALID_REQUEST"}, status=400)
            # 받은 데이터 확인
            username = (data.get("username") or "").strip()
            password = data.get("password") or ""

            print(f"[LOGIN] username={username}, password={'*' * len(password) if password else 'None'}")

            # 필드 검증 (프론트에도 있으나 2중검사) --------------
            field_errors = {}
            if not username:
                field_errors["username"] = "REQUIRED_USERNAME"
            if not password:
                field_errors["password"] = "REQUIRED_PASSWORD"
            # 둘 다 없으면 formError
            if not username and not password:
                return JsonResponse({
                    "success": False,
                    "formError": "INVALID_INPUT",
                    "fieldErrors": field_errors
                }, status=400)
            elif field_errors:
                return JsonResponse({
                    "success": False,
                    "fieldErrors": field_errors
                }, status=400)

            # 사용자 존재 여부 (삭제 제외) --------------
            try:
                user_obj = CustomUser.objects.get(username=username, is_deleted=False)
            except CustomUser.DoesNotExist:
                return JsonResponse({
                    "success": False, 
                    "formError": "ERR_NO_SUCH_USER"
                })

            # 비밀번호 검증 (또는 authenticate 사용 가능)
            if not user_obj.check_password(password):
                field_errors["password"] = "ERR_BAD_PASSWORD"
                return JsonResponse({
                    "success": False, 
                    "fieldErrors": field_errors
                })

            # 활성 상태 확인 ----------------------------
            if not user_obj.is_active:
                return JsonResponse({
                    "success": False,
                    "formError": "ERR_AUTH_INACTIVE"
                })
                
            # 탈퇴 확인 ----------------------------
            if user_obj.is_deleted:
                return JsonResponse({
                    "success": False,
                    "formError": "ERR_AUTH_DELETED_USER"
                })
            
            # # 나중에 비밀번호 초기화 (비밀번호 바꾸기) 기능 만들기------
            # if user_obj.reset_token:
            #     return JsonResponse({
            #         "success": False,
            #         "error": "비밀번호 초기화"
            # })
            # ----------------------------------------------------------

            # 그룹 및 권한 확인 ----------------------------
            is_guest = False
            is_editor = False

            try:
                GroupMembership.objects.filter(user=user_obj).exists()
                # 그룹이 있으면 user
                role = "user"
            except GroupMembership.DoesNotExist: 
                # 그룹이 없으면 staff/superuser 체크
                if user_obj.is_staff or user_obj.is_superuser:
                    is_editor = True
                    role = "editor"
                else:
                    is_guest = True 
                    role = "guest"
                    
            # 토큰 발급 → HttpOnly 쿠키 저장 ----------------------------
            refresh = RefreshToken.for_user(user_obj)
            access  = str(refresh.access_token)

            response_data = {
                "success": True, 
                "message": "LOGIN_OK", 
                "role": role,
            }
            if is_guest:
                response_data["is_guest"] = True
            if is_editor:
                response_data["is_editor"] = True

            resp = JsonResponse(response_data, status=200)
            resp.set_cookie("access",  access,        max_age=ACCESS_MAX_AGE,  **COOKIE_COMMON)
            resp.set_cookie("refresh", str(refresh),  max_age=REFRESH_MAX_AGE, **COOKIE_COMMON)
            return resp

        except Exception as e:
            # 예기치 못한 에러 캡처 ----------------------------
            rid = uuid.uuid4().hex[:12]
            logger.error("[LOGIN][%s] %s\n%s", rid, str(e), traceback.format_exc())
            print("[LOGIN][ERROR] :",rid, str(e))
            return JsonResponse({
                "success": False,
                "status": 500,
                "formError": "SERVER_ERROR",
                "meta":f"requestId: {rid}"
                
            }, status=500)

    def get(self, request, *args, **kwargs):
        return JsonResponse({"success": False, "formError": "ERROR_METHOD_INVALID_GET"}, status=405)

    def put(self, request, *args, **kwargs):
        return JsonResponse({"success": False, "formError": "ERROR_METHOD_INVALID_PUT"}, status=405)

    def delete(self, request, *args, **kwargs):
        return JsonResponse({"success": False, "formError": "ERROR_METHOD_INVALID_DELETE"}, status=405)


# 로그아웃 뷰
class LogoutView(View):
    def post(self, request, *args, **kwargs):
        resp = JsonResponse({"success": True, "message": "LOGOUT_OK"}, status=200)
        resp.delete_cookie("access", path="/")
        resp.delete_cookie("refresh", path="/")
        return resp