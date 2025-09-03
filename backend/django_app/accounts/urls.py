from django.urls import path, include

# class views
from .views.auth import LoginView
from .views.auth import LogoutView
from .views.refresh_cookie import RefreshCookieView
from .views.csrf import csrf_view
from .views.profile import MeView


urlpatterns = [
    # 사용자 인증 관련 API
    path('auth/', include([
        path('login/', LoginView.as_view(), name='login'),
        path('logout/', LogoutView.as_view(), name='logout'),
        path('refresh-cookie/', RefreshCookieView.as_view(), name='refresh_cookie'),
    ])),
    path('csrf/', csrf_view, name="csrf"),
    path('user/', include([
        path('me/', MeView.as_view(), name='me'),
    ]))
] 



