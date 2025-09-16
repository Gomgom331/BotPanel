# 페이지 분기 페르소나 - 게스트 , 유저 , 에디터 (어드민)

# anon: 비로그인 (선택적으로 로그인 페이지로 리다이렉트) - 운영 편의를 위해 추가 (세션만료 / 로그아웃 처리)
# guest: 로그인 O, group_memberships = 0 이고 is_staff=False & is_superuser=False
# user: 로그인 O, group_memberships ≥ 1 이고 is_staff=False & is_superuser=False
# admin: 로그인 O, is_staff=True 또는 is_superuser=True

def derive_persona(user) -> str:
    if not user or not user.is_authenticated:
        return "anon"  # 로그인 요구 화면 등에 활용
    if getattr(user, "is_staff", False) or getattr(user, "is_superuser", False):
        return "admin"  # is_superuser 또는 is_staff 둘 중 하나라도 있으면 editor
    has_group = user.group_memberships.exists()
    return "user" if has_group else "guest"
