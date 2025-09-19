from __future__ import annotations
from typing import Iterable, Set, Literal
from rest_framework.permissions import BasePermission #권한 체크를 위한 추상체크

# 서비스 레이어
from rbac.services.persona import derive_persona
from rbac.services.policy import (
    effective_scopes,
    is_group_member,
    has_group_role_at_least,
)

RoleInGroup = Literal["member","owner","admin"]

"""
전역 페르소나 요구
'_' -> 내부에서 쓰는 구현 외부X (모듈안에서만 작동)

allowed에 포함된 페르소나만 통과
"""
class _RequirePersonaIn(BasePermission):
    allowed: Set[str] = set()
    
    def has_permission(self, request, view) -> bool:
        return derive_persona(request.user) in self.allowed
    
def RequirePersonaIn(allowed: Iterable[str]):
    cls = type("RequirePersonaIn", (_RequirePersonaIn,),{})
    cls.allowed = set(allowed)
    return cls
    

"""
스코프(OR) 요구
required 중 하나라도 사용자가 가진 스코프와 교집합이면 통과
"""    
class _RequireScopesAny(BasePermission):
    required: Set[str] = set()
    
    def has_permission(self, request, view) -> bool:
        my = effective_scopes(request.user)
        return "*" in my or bool(self.required.intersection(my))
    

def RequireScopesAny(scopes: Iterable[str]):
    cls = type("RequireScopesAny", (_RequireScopesAny,), {})
    cls.required = set(scopes)
    return cls

"""
그룹멤버 / 역할 요구 (view.group_obj 필요)

View.initial() 등에서 self.group_obj = <Group> 를 미리 세팅해야 함
"""
class RequireGroupMember(BasePermission):
    def has_permission(self, request, view):
        group = getattr(view, "group_obj", None)
        return bool(group) and is_group_member(request.user, group)
# 모듈용
class _RequireGroupRoleAtLeast(BasePermission):
    min_role: str = "admin"
    
    def has_permission(self, request, view):
        group = getattr(view, "group_obj", None)
        return bool(group) and has_group_role_at_least(request.user, group, self.min_role)
    
def RequireGroupRoleAtLeast(min_role: str = "admin"):
    cls = type("RequireGroupRoleAtLeast", (_RequireGroupRoleAtLeast,),{})
    cls.min_role = min_role
    return cls
    