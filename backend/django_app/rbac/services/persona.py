from typing import Literal

Persona = Literal["admin","user","guest","anon"]

# 페이지 분기 페르소나 - 게스트 , 유저 , 에디터 (어드민)

# anon: 비로그인 (선택적으로 로그인 페이지로 리다이렉트) - 운영 편의를 위해 추가 (세션만료 / 로그아웃 처리)
# guest: 로그인 O, group_memberships = 0 이고 is_staff=False & is_superuser=False
# user: 로그인 O, group_memberships ≥ 1 이고 is_staff=False & is_superuser=False
# admin: 로그인 O, is_staff=True 또는 is_superuser=True

"""
- 세부 권한은 rbac.services.policy.effective_scopes() 등으로 계산
"""
def  derive_persona(user) -> Persona:
    if not user or not getattr(user, "is_authenticated", False):
        return "anon"
    if getattr(user, "is_staff", False)or getattr(user, "is_superuser", False):
        return "admin"
    try:
        has_group = user.group_memberships.exists()
    except Exception:
        # user 모델이 바뀌어도 안전하게
        has_group = False

    return "user" if has_group else "guest"
