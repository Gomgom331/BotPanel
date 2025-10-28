from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.db import models
from rbac.models import Group

# 유저 생성 매니저
class UserManager(BaseUserManager):
    
    def create_user(self, username, email, full_name, password=None, **extra_fields):
        if not username:
            raise ValueError("아이디는 필수입니다.")
        if not email:
            raise ValueError("이메일은 필수입니다.")
        if not full_name:
            raise ValueError("이름은 필수입니다.")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, username, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(username ,email, full_name, password, **extra_fields)


"""
role 필드를 포함한 기존 사용자 모델에
RBAC 확장 도입을 해 'role'은 표시/폴백 용도로만 남겨두기
=> 실제 권한은 rbac앱의 테이블로 계산하기
"""

class CustomUser(AbstractUser):
    username = models.CharField(unique=True, max_length=20) #아이디
    full_name = models.CharField(max_length=30) #유저이름
    email = models.EmailField(unique=True) # 중복제거
    is_active = models.BooleanField(default=False)  # 승인되기 전에는 False (승인시 True)
    is_staff = models.BooleanField(default=False)   # admin 접근 권한 (view)
    is_superuser = models.BooleanField(default=False) # admin 접근 권한 (수정자)
    approved_by = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL) # 사용자를 승인한 관리자 참조
    date_joined = models.DateTimeField(auto_now_add=True)  # 접근일자
    reset_token = models.CharField(max_length=255, null=True, blank=True, default=False) # 비밀번호 초기화 토큰
    is_deleted = models.BooleanField(default=False) # 회원탈퇴
    # 컬럼 추가가 안됨
    last_viewed_group = models.ForeignKey(Group, null=True, blank=True, on_delete=models.SET_NULL) # 마지막 그룹활동
    
    USERNAME_FIELD = "username"
    # python manage.py createsuperuser 사용시 추가 입력 사항
    REQUIRED_FIELDS = ["email", "full_name"]  # superuser 생성 시 입력할 항목
    
    objects = UserManager()
    
    def __str__(self):
        return self.username
    
    # 전역관리자 여부 ((시스템 레벨)
    @property
    def is_global_admin(self) -> bool:
        return bool(self.is_staff or self.is_superuser)
