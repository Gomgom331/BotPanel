from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response
from rest_framework import status

from rbac.services.persona import derive_persona          
from rbac.services.policy import effective_scopes         
from rbac.models import GroupMembership, FeatureFlag      # 그룹/플래그 조회



def _public_user_payload(user):
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
        "company": getattr(user, "company", None),
        "position": getattr(user, "position", None),
        "role": getattr(user, "role", None) or "user",  # 레거시 표시용(실권한 아님)
        "is_active": bool(getattr(user, "is_active", True)),
        "is_staff": bool(getattr(user, "is_staff", False)),
    }

class MeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        u = request.user

        persona = derive_persona(u)
        groups_qs = GroupMembership.objects.filter(user=u).values(
            "group__id", "group__name", "role_in_group"
        )
        groups = [
            {"id": g["group__id"], "name": g["group__name"], "role_in_group": g["role_in_group"]}
            for g in groups_qs
        ]
        scopes = sorted(list(effective_scopes(u)))
        features = list(FeatureFlag.objects.filter(enabled=True).values_list("key", flat=True))

        me_payload = {
            **_public_user_payload(u),
            "persona": persona,
            "groups": groups,
            "scopes": scopes,
            "features": features,
        }
        # 하위 호환 위해 "user" 키도 함께 내려줌
        return Response({"success": True, "me": me_payload, "user": me_payload}, status=status.HTTP_200_OK)