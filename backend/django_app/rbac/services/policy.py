from __future__ import annotations
# 클래스 이름을 문자열로 자동 취급해줌 (자기 자신을 타입으로 참조)
"""
< typing >
Optional : 값이 X 타입이나 None 일수도 있음을 의미 / 예: Optional[int] == int | None
Set : 자료구조에 들어가는 원소 타입을 지정 / 예: Set[str] == set 안에는 문자열만 들어감
Literal : 특정 값들 중 하나만 올 수 있음을 제한 / 예: Literal["GET", "POST"] → 반드시 "GET" 또는 "POST"만 가능
Dict : 딕셔너리의 키 타입과 값 타입을 지정 / Dict[str, int] == {"a" = 1, "b": 2} 와 같은 형태

"""
from typing import Optional, Set, Literal, Dict 
from django.db.models import Q


# 모델
from rbac.models import (
    Group,
    GroupMembership,
    GroupRoleScope,
)

RoleInGroup = Literal["member", "owner", "admin"]
RANK: Dict[RoleInGroup, int] = {"member": 1, "owner": 2, "admin": 3}

"""
최종 스코프 집합 = (속한 그룹들의 스코프) 합집합
운영자가 GroupScope.is_active=False로만 바꿔도 즉시 권한 철회

- 여기서 유저의 is_superuser, is_staff 검증을 계속 하는데 해당 권한을 가지고 있으면 그룹검사에서 제외를 시켜
전역적으로 시스템을 확인할 수 있게 제작됨

최종 스코프 집합(문자열 키들의 set)을 계산

규칙:
1) 비로그인은 빈 집합
2) 전역 관리자(is_staff/superuser)는 {"*"} 부여(전권)
3) 로그인 유저라면:
- 유저가 속한 모든 그룹에 대해:
a) 그룹 대표 스코프 "group.{slug}" 추가 (UI/정책 태깅용)
b) GroupRoleScope 중 is_active=True 이고,
"해당 레코드의 role 랭크 ≤ 내 역할 랭크" 인 기능 스코프를 합집합
- 상위 역할(admin) ⊇ owner ⊇ member (랭크 비교로 상속)

"""

def effective_scopes(user) -> Set[str]:
    if not user or not getattr(user, "is_authenticated", False):
        return set()
    
    # 시스템 관리자는 전권. (원하면 여기 정책을 바꿔 특정 세트만 부여 가능)
    if getattr(user, "is_staff", False) or getattr(user, "is_superuser", False):
        return {"*"}
    # 내 멤버쉬(그룹/slug/역할) 한번에 가져오기
    mems = (
        user.group_memberships
        .select_related("group")
        .values("group_id", "group__slug", "role_in_group")
    )
    if not mems:
        return set()
    
    out: Set[str] = set()
    # group_id → 내 역할 rank, group_id → slug
    rank_by_gid: Dict[int, int] = {}
    slug_by_gid: Dict[int, str] = {}
    for m in mems:
        gid = m["group_id"]
        slug_by_gid[gid] = m["group__slug"]
        rank_by_gid[gid] = RANK[m["role_in_group"]]
        
    # 그룹 대표 스코프 추가 : group.{slug}
    for gid, slug in slug_by_gid.items():
        out.add(f"group.{slug}")
        
    # 역할 기반 기능 스코프 상속(레코드 role ≤ 내 역할)
    rows = (
        GroupRoleScope.objects
        .filter(group_id__in=rank_by_gid.keys(), is_active=True)
        .select_related("scope")
        .values("group_id", "role", "scope__key")
    )
    for r in rows:
        need = RANK[r["role"]]
        mine = rank_by_gid.get(r["group_id"], 0)
        if mine >= need:
            out.add(r["scope__key"])

    return out
    
    
"""
특정 그룹이 부여하는 스코프 집합
"""
def group_scopes(group: Group, *, only_active: bool = True) -> Set[str]:
    qs = GroupRoleScope.objects.filter(group=group)
    if only_active:
        qs = qs.filter(is_active=True)
    return set(qs.values_list("scope__key", flat=True))


"""
멤버쉽 / 역할
해당 그룹에 멤버인지 체크
"""
def is_group_member(user, group:Group) -> bool:
    # 시스템 관리자인지 체크
    if getattr(user, "is_staff", False) or getattr(user, "is_superuser", False):
        return True
    return GroupMembership.objects.filter(user=user, group=group).exists()

"""
그룹내 유저 역할 없으면 None
전역관리자(admin)를 그룹 최상위로 
"""
def group_role(user, group: Group) -> Optional[RoleInGroup]:
    if getattr(user, "is_staff", False) or getattr(user, "is_superuser", False):
        return "admin"
    row = (
        GroupMembership.objects
        .filter(user=user, group=group)
        .values("role_in_group")
        .first()
    )
    return (row and row["role_in_group"]) or None

"""
그룹내 역할 확인 ("member": 1, "owner": 2, "admin": 3)
"""
def has_group_role_at_least(user, group:Group, min_role: RoleInGroup ="admin") -> bool:
    if getattr(user, "is_staff", False) or getattr(user, "is_superuser", False):
        return True
    r = group_role(user, group)
    if not r:
        return False
    return RANK[r] >= RANK[min_role]


# Member 멤버
def is_group_member_role(user, group: Group) -> bool:
    return has_group_role_at_least(user, group, "member")

# Owner 오너
def is_group_owner(user, group:Group) -> bool:
    return has_group_role_at_least(user, group, "owner")

# Admin 관리자
def is_group_admin(user, group:Group) -> bool:
    return has_group_role_at_least(user, group, "admin")


#-------------------------------------------------------------\
"""
유저의 기본 진입 그룹 (slug)
1) is_default=True 멤버십
2) 없으면 첫 멤버십
3) 없으면 None

"""
def default_group_slug_for(user) -> Optional[str]:
    if not user or not getattr(user, "is_authenticated", False):
        return None
    gm = (
        user.group_memberships
        .filter(is_default=True)
        .select_related("group")
        .first()
    )
    if gm:
        return getattr(gm.group, "slug", None) or gm.group.name
    gm = user.group_memberships.select_related("group").first()
    return (getattr(gm.group, "slug", None) or gm.group.name) if gm else None


"""
id, slug, name 값을 받아 Group 으로 인스턴스로 해석
RL 파라미터로 들어오는 값에 유연하게 대응
"""
def resolve_group(identifier) -> Optional[Group]:
    if identifier is None:
        return None
    try:
        return Group.objects.get(pk=int(identifier))
    except Exception:
        pass
    try:
        return Group.objects.get(Q(slug=str(identifier)) | Q(name=str(identifier)))
    except Group.DoesNotExist:
        return None
    