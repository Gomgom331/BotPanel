from django.http import JsonResponse
from django.views import View

class LogoutView(View):
    def post(self, request, *args, **kwargs):
        resp = JsonResponse({"success": True, "message": "LOGOUT_OK"}, status=200)
        resp.delete_cookie("access", path="/")
        resp.delete_cookie("refresh", path="/")
        return resp
    
