from django.db import models
from django.conf import settings

class Scope(models.Model):
    """
    실제 행동 권한의 최소단위
    """
    key = models.CharField(
        max_length=100, 
        unique=True,
        help_text='"entry.read", "entry.write", "user.manage", "llm.chat" 등'
    )
    desc = models.CharField(
        max_length=200,
        black=True,
        help_text="권한 설명"   
    )
    
    class Meta:
        db_table = "rbac_scope"
        help_text = "스코프(세부 권한)"
        
    def __str__(self) -> str:
        return self.key
    

class Group(models.Model):
    """
    팀/부서/프로젝트 등 조직 단위 그룹
    유저는 여러 그룹에 속할 수 있음 (다대다)/ 그룹이 부여하는 스코프를 추가로 얻음
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="그룹이름"
    )
    desc = models.CharField(
        max_length=200,
        blank=True,
        help_text="그룹내 설명"
    )
    
    class Meta:
        db_table = "rbac_group"
        help_text = "그룹 (조직 단위)"
        indexes = [
            models.Index(fields=["name"], name="idx_rbac_group_name"),
        ]
    def __str__(self) -> str:
        return self.name
    
    
class GroupScope(models.Model):
    """
    그룹이 부여하는 스코프
    """
    group = models.ForeignKey(
        Group, 
        on_delete=models.CASCADE,
        help_text="그룹"
    )
    scope = models.ForeignKey(
        Scope, 
        on_delete=models.CASCADE,
        help_text="스코프"
    )
    
    class Meta:
        db_table = "rbac_group_scope"
        verbose_name = "그룹-스코프 연결"
        unique_together = ("group", "scope")
        indexes = [
            models.Index(fields=["group", "scope"], name="idx_rbac_group_scope"),
        ]
        
    def __str__(self) -> str:
        return f"{self.group.name} - {self.scope.key}"
    
class FeatureFlag(models.Model):
    """
    기능 토글 플래그 (버튼 스위치 등)
    """
    key = models.CharField(
        max_length=100,
        unique=True,
        help_text="기능 플래그 키"
    )
    enabled = models.BooleanField(
        default=False,
        help_text="활성화 여부"
    )
    desc = models.CharField(
        max_length=200,
        blank=True,
        help_text="기능 설명"
    )
    
    class Meta:
        db_table = "rbac_feature_flag"
        verbose_name = "기능 플래그"
    
    def __str__(self) -> str:
        status = "ON" if self.enabled else "OFF"
        return f"{self.key} ({status})"
    

class MenuItem(models.Model):
    """
    메뉴 항목 정의 (메뉴 구조 및 권한 매핑)
    """
