from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from ..models import CustomUser # 유저 모델
from rbac.models import Group, GroupMembership 

class UserLastGroupView(APIView):
    # 인증자만 사용
    permission_classes = [IsAuthenticated]

    # user last-group 변경
    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        if not slug:
            return Response({"detail": "slug가 필요합니다."}, status=400)

        # 이미 request.user 자체가 CustomUser 인스턴스
        user: CustomUser = request.user

        # 해당 유저가 속한 그룹인지 검증하면서 가져오기
        group = get_object_or_404(
            Group,
            slug=slug,
            memberships__user=user,   # GroupMembership의 related_name이 memberships 라고 가정
        )

        user.last_viewed_group = group
        user.save(update_fields=["last_viewed_group"])

        # 해당 그룹에서의 유저 role 가져오기
        membership = GroupMembership.objects.filter(user=user, group=group).first()
        role = getattr(membership, "role_in_group", None)

        print("user", user)
        print("group", group)
        print("role", role)

        return Response(
            {
                "slug": group.slug,
                "name": group.name,
                "role_in_group": role,
            }
        )
        