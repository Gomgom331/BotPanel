from django.conf import settings

ACCESS_MAX_AGE  = 60 * 30           # 30분
REFRESH_MAX_AGE = 60 * 60 * 24 * 7  # 7일

COOKIE_COMMON = {
    "httponly": True,
    "samesite": settings.SESSION_COOKIE_SAMESITE,  # cross-domain일 경우 None
    "secure": settings.SESSION_COOKIE_SECURE,      # dev=False, prod=True
    "path": "/",
}