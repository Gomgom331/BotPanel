# from django.db import models
# from django.conf import settings

# # Create your models here.

# class UserProfile(models.Model):
#     """사용자 프로필 모델"""
#     user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
#     phone_number = models.CharField(max_length=15, blank=True, null=True)
#     birth_date = models.DateField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     def __str__(self):
#         return f"{self.user.username}의 프로필"
    
#     class Meta:
#         verbose_name = "사용자 프로필"
#         verbose_name_plural = "사용자 프로필들"

# class Post(models.Model):
#     """게시글 모델"""
#     title = models.CharField(max_length=200, verbose_name="제목")
#     content = models.TextField(verbose_name="내용")
#     author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     is_published = models.BooleanField(default=False, verbose_name="발행 여부")
    
#     def __str__(self):
#         return self.title
    
#     class Meta:
#         verbose_name = "게시글"
#         verbose_name_plural = "게시글들"
#         ordering = ['-created_at']
