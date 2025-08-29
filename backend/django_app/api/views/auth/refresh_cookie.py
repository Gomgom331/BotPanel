# app/api/views/refresh_cookie.py
from django.http import JsonResponse
from django.views import View
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from api.utils.cookie import COOKIE_COMMON, ACCESS_MAX_AGE

class RefreshCookieView(View):
    def post(self, request, *args, **kwargs):
        refresh_cookie = request.COOKIES.get("refresh")
        if not refresh_cookie:
            return JsonResponse({"success": False, "error": "NO_REFRESH"}, status=401)
        try:
            refresh = RefreshToken(refresh_cookie)
            access = str(refresh.access_token)
        except TokenError:
            return JsonResponse({"success": False, "error": "INVALID_REFRESH"}, status=401)

        resp = JsonResponse({"success": True, "message": "REFRESH_OK"}, status=200)
        resp.set_cookie("access", access, max_age=ACCESS_MAX_AGE, **COOKIE_COMMON)
        return resp
