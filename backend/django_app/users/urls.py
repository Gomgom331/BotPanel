from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    # 사용자 인증 관련
    # path('register/', views.register, name='register'),
    # path('login/', views.login, name='login'),
    # path('logout/', views.logout, name='logout'),
    # path('profile/', views.profile, name='profile'),
    # path('profile/edit/', views.edit_profile, name='edit_profile'),
    
    # # 사용자 관리
    # path('list/', views.user_list, name='user_list'),
    # path('<int:user_id>/', views.user_detail, name='user_detail'),
]
