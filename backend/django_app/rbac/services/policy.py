# from rbac.models import GroupScope

# # 스코프, 멤버십, 기본 그룹 계산

# def effective_scopes(user) -> set[str]:
#     if not user or not user.is_authenticated:
#         return set()
#     if getattr(user, "is_superuser", False):
#         return {"*"}
#     group_ids = user.group_memberships.values_list("group_id", flat=True)
#     return set(
#         GroupScope.objects.filter(group_id__in=group_ids)
#         .values_list("scope__key", flat=True)
#     )


from __future__ import annotations # 클래스 이름을 문자열로 자동 취급해줌 (자기 자신을 타입으로 참조)
"""
Optional : 값이 X 타입이나 None 일수도 있음을 의미 / 예: Optional[int] == int | None
Set : 자료구조에 들어가는 원소 타입을 지정 / 예: Set[str] == set 안에는 문자열만 들어감
Literal : 특정 값들 중 하나만 올 수 있음을 제한 / 예: Literal["GET", "POST"] → 반드시 "GET" 또는 "POST"만 가능
Dict : 딕셔너리의 키 타입과 값 타입을 지정 / Dict[str, int] == {"a" = 1, "b": 2} 와 같은 형태
"""
from typing import Optional, Set, Literal, Dict 
from django.db.models import Q

# 모델
from rbac.models import Group, GroupScope, GroupMembership

RoleInGroup = Literal["member", "owner", "admin"]
GROUP_ROLE_RANK: Dict[RoleInGroup, int] = {"member": 1, "owner": 2, "admin": 3}


"""
최종 스코프 집합 = (속한 그룹들의 스코프) 합집합
superuser면 전권("*") 부여(선택)

운영자가 GroupScope.is_active=False로만 바꿔도 즉시 권한 철회가 적용돼.
"""
# def effective_scopes(user) -> set[str]:
#     if not user or not getattr(user, "is_authenticated", False):
#         return set()
#     if getattr(user, "is_superuser", False):
#         return {"*"}
#     group_ids = user.group_memberships.values_list("group_id", flat=True)
#     return set(
#         GroupScope.objects
#         .filter(group_id__in=group_ids, is_active=True) #활성화만 반영하게끔 함
#         .values_list("scope__key", flat=True)
#     )



def effective_scopes(user) -> Set[str]:
    if not user or not getattr(user, "is_authenticated", False):
        return set()
    if getattr(user, "is_superuser", False):
        return {"*"}  # 선택: 전권
    group_ids = user.group_memberships.values_list("group_id", flat=True)
    if not group_ids:
        return set()
    keys = (GroupScope.objects
            .filter(group_id__in=group_ids, is_active=True)
            .values_list("scope__key", flat=True))
    return set(keys)

"""
그룹 스코프
"""
def group_scopes(group: Group, *, only_active: bool = True) -> Set[str]:
    qs = GroupScope.objects.filter(group=group)
    if only_active:
        qs = qs.filter(is_active=True)
    return set(qs.values_list("scope__key", flat=True))
