from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response
from rest_framework import status

# rbac
from rbac.services.persona import derive_persona
from rbac.services.policy import (
    effective_scopes,
    default_group_slug_for,
    resolve_group,
    is_group_member,
    group_role,
    group_scopes,
)

def _public_user_payload(user) -> dict:
    
    full_name = (
        getattr(user, "full_name", None)
        or (getattr(user, "get_full_name", lambda: "")() or "").strip()
        or user.get_username()
    )
    return {
        "id": user.id,
        "username": user.get_username(),
        "email": getattr(user, "email", "") or "",
        "full_name": full_name,
        "is_active": bool(getattr(user, "is_active", True)),
        "is_staff": bool(getattr(user, "is_staff", False)),
        "is_superuser": bool(getattr(user, "is_superuser", False)),
    }
    
"""
현재 로그인 사용자 컨텍스트
"""    
class MeView(APIView):
    def get(self, request):
        
        u = request.user
        # 멤버쉽 유무 ----------------
        try:
            
            memberships = (
                u.group_memberships.all()
                .select_related("group")
                .only(
                    "role_in_group", "is_default",
                    "group__id", "group__name", "group__slug"
                )
            )
        except Exception as e:
            memberships = []  # 빈 리스트
            print(f"Error fetching memberships: {e}")
        
        # 그룹목록 ----------------
        try:
            groups = [
                {
                    "id": m.group.id,
                    "name": m.group.name,
                    "slug": m.group.slug,          # rbac.Group.slug (회사 코드)
                    "role_in_group": m.role_in_group,  # "member" | "owner" | "admin"
                    "is_default": m.is_default,
                }
                for m in memberships
            ]
        except Exception as e:
            groups = [] # 빈리스트
            print(f"Error fetching groups: {e}")
        
        # 멤버십 맵(빠른 조회용) ----------------
        by_slug = {}
        groups = []
        
        for m in memberships:
            item = {
                "id" : m.group.id,
                "name": m.group.name,
                "slug": m.group.slug,
                "role_in_group": m.role_in_group, #member, admin, owner
                "is_default": m.is_default,
            }
            groups.append(item)
            if m.group.slug:
                by_slug[m.group.slug] = item
                
        # last_viewed_group 직렬화
        last_viewed = None
        if getattr(u, "last_viewed_group_id", None):
            g = u.last_viewed_group
            if g and g.slug in by_slug:
                last_viewed = {
                    "id": g.id,
                    "name": g.name,
                    "slug": g.slug,
                    "role_in_group": by_slug[g.slug]["role_in_group"],
                }
            else:
                # 멤버가 아니면 정리
                u.last_viewed_group = None
                u.save(update_fields=["last_viewed_group"])
        


        # 페르소나 ----------------
        persona = derive_persona(u)  # "admin" | "user" | "guest" | "none"
        
        # 최종스코프 ----------------
        scopes = sorted(list(effective_scopes(u)))
        
        # 기본 진입 그룹 ----------------
        default_group = default_group_slug_for(u)
        
        # 기본 컨텍스트----------------
        me_payload = {
            **_public_user_payload(u),
            "persona": persona,
            "groups": groups,
            "scopes": scopes,
            "primary_group_slug": default_group,  # 프론트 호환 키 유지
            "last_viewed_group": last_viewed,
        }
        
        # 5) (선택) 활성 그룹 컨텍스트 (?group=slug | id | name)
        g_ident = request.query_params.get("group")
        if g_ident:
            g = resolve_group(g_ident)
            if g:
                me_payload["active_group"] = {
                    "id": g.id,
                    "name": g.name,
                    "slug": getattr(g, "slug", None),
                    "is_member": is_group_member(u, g),
                    "role_in_group": group_role(u, g),     # 내 역할
                    "declared_scopes": sorted(list(group_scopes(g))),  # 이 회사가 정책으로 선언한 기능 스코프
                }
                
        return Response({"success": True, "me": me_payload}, status=status.HTTP_200_OK)