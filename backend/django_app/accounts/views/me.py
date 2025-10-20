from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response
from rest_framework import status

# rbac
# 👇 경로 수정: rbac.services.*  ->  rbac.*
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
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        u = request.user
        print('1')
        print(u)
        # 그룹멤버쉽
        memberships = (
            u.group_memberships.all()
            .select_related("group")
            .only(
                "role_in_group", "is_default",
                "group__id", "group__name", "group__slug"
            )
        )
        # 그룹목록
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
        
        # 페르소나
        persona = derive_persona(u)  # "admin" | "user" | "guest" | "anon"
        print('2')
        print(persona)
        # 최종스코프
        scopes = sorted(list(effective_scopes(u)))
        print('3')
        print(scopes)
        # 기본 진입 그룹
        default_group = default_group_slug_for(u)
        print('4')
        print(default_group)
        
        # 기본 컨텍스트
        me_payload = {
            **_public_user_payload(u),
            "persona": persona,
            "groups": groups,
            "scopes": scopes,
            "primary_group_slug": default_group,  # 프론트 호환 키 유지
        }
        print('5')
        print(me_payload)
        
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
        print('6')
        print(g_ident)
        return Response({"success": True, "me": me_payload}, status=status.HTTP_200_OK)