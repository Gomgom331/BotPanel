# api/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw = request.COOKIES.get("access")
        if not raw:
            return None
        token = self.get_validated_token(raw)
        return self.get_user(token), token
