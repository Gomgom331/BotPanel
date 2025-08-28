from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response
from rest_framework import status

def _public_user_payload(user):
    full_name = getattr(user, "full_name", None) \
        or (getattr(user, "get_full_name", lambda: "")() or "").strip() \
        or user.get_username()
    return {
        "id": user.id,
        "username": user.get_username(),
        "email": getattr(user, "email", "") or "",
        "full_name": full_name,
        "company": getattr(user, "company", None),
        "position": getattr(user, "position", None),
        "role": getattr(user, "role", None) or "user",
        "is_active": bool(getattr(user, "is_active", True)),
    }
    
class MeView(APIView):
    """
    현재 로그인한 사용자 정보 반환 (GET)
    - 인증 필요 (쿠키의 access 토큰)
    - GET은 safe method라 CSRF 헤더 불필요
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        return Response(
            {"success": True, "user": _public_user_payload(user)},
            status=status.HTTP_200_OK,
        )