from django.urls import path, include
from . import views

# class views
from .views.login_user import LoginView

urlpatterns = [
    # 사용자 인증 관련 API
    path('auth/', include([
        path('login/', LoginView.as_view(), name='login'),
    ])),
] 



