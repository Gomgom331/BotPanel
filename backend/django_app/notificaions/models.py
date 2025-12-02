from django.db import models
from accounts.models import CustomUser 


"""
<2025-12-02>
- 알림 기능
    1. 일반 유저가 가입 신청시 알림
        - 기존 유저가 그룹을 추가시 해당 그룹의 어드민에게 알림
        - 기존 유저가 아닌 신규 회원인 경우 시스템 관리자에게 알림
    2. 가입 신청 승인시 알림
        - 기존 유저가 그룹추가 승인이 되면 해당 유저에게 알림
    3. 공지사항
        - 시스템 관리자의 공지사항을 추가해야되나

"""


# class Notifications(models.Model):
    