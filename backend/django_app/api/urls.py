from django.urls import path, include
from . import views

# class views
from .views.login_user import LoginView
from .views.csrf import csrf_view
from .views.user import MeView


urlpatterns = [
    # 사용자 인증 관련 API
    path('auth/', include([
        path('login/', LoginView.as_view(), name='login'),
    ])),
    path('csrf/', csrf_view, name="csrf"),
    path('user/', include([
        path('me/', MeView.as_view(), name='me'),
    ]))
] 



