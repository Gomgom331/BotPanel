from __future__ import annotations
# 맨위에다 둬야지 잘 작동함

from django.conf import settings
from django.core.exceptions import ValidationError #데이터 유효성 오류
from django.db import models
from django.db.models import Q, UniqueConstraint # Q: 복잡한 쿼리(AND, OR, NOT 조건) / 복합 유니크 제약 조건 
from django.db.models.signals import pre_save, pre_delete, post_delete, post_save #Signal 특정 이벤트가 발생했을 때 자동으로 연결된 함수
from django.dispatch import receiver #Signal과 함수를 연결하는 데코레이터
from django.utils.text import slugify #slug 형식 (웹 url 친화적 문자열로 변환)




"""
---------------------------------------------------------------------    
    <2025-09-18 기능추가시>

    - 회사별 기능 추가
        전역 스코프에 새 기능 키(reports.export, member.audit.view 등)만 추가
        회사에서 해당 기능을 쓰고 싶으면 GroupRoleScope(group, role, scope) 레코드만 추가
        (필요하면 GroupFeatureFlag까지 함께 ON
        
    - 회사 전용 메뉴
        MenuItem.required_any에 group.{slug} 스코프 추가 → 그 회사에만 보임
        기능 플래그도 연결했다면 전역/그룹 토글로 단계적 오픈 가능
        
    - 민감 필드/관리 기능
        스코프를 세분화 (profile.sensitive.read/write, group.manage …) 후
        GroupRoleScope로 역할별 배분 + **시리얼라이저**에서 필드 가드(읽기/쓰기 스코프 체크)    
        
    - 그룹 플래그(회사 전용 토글)
        GroupFeatureFlag로 전역 토글을 덮어쓰기, 비율 롤아웃, 기간 제한 지원.
        
    => 시리얼라이저 : SON, XML 같은 표현 형식으로 변환해주는 도구

---------------------------------------------------------------------    
"""



"""
전역 공용 스코프 레지스토리
    - kind="feature": 기능(버튼/엔드포인트/필드 등)
    - kind="group"  : 회사 라벨(예: group.gbt)  ← UI/정책/로그 필터용
"""
class Scope(models.Model):
    KIND_FEATURE = "feature" 
    KIND_GROUP = "group"
    KIND_CHOICES = [
        (KIND_FEATURE, "KIND_FEATURE"),
        (KIND_GROUP, "KIND_GROUP")
    ]
    
    key = models.CharField(
        max_length=100, 
        unique=True,
        help_text="스코프 키 (예: 'entry.read', 'user.manage','group.gbt')"
    )
    slug = models.SlugField(
        max_length=120,
        unique=True,
        help_text="URL-friendly 식별자 (검색/링크 최적화)"
    ) 
    kind = models.CharField(
        max_length=20,
        choices=KIND_CHOICES, default=KIND_FEATURE,
        help_text="스코프 종류: 'feature(기능)','group(회사라벨)'"
    )
    desc = models.CharField(max_length=200, blank=True, help_text="설명")
    
    class Meta:
        db_table = "rbac_scope"
        verbose_name = "스코프(세부 권한)"
        verbose_name_plural="스코프(세부 권한)"
        indexes = [
            models.Index(fields=['slug'], name='idx_scope_slug'),
            models.Index(fields=['kind'], name='idx_scope_kind'),
        ]
        
    def clean(self):
        # group scope는 반드시 "group." 프리픽스 사용 강제
        if self.kind == self.KIND_GROUP and not self.key.startswith("group."):
            raise ValidationError('kind="group" 스코프의 key는 "group.<slug>" 형식이어야 합니다.')
        # feature scope는 group.* 사용 금지 (네임스페이스 충돌 방지)
        if self.kind == self.KIND_FEATURE and self.key.startswith("group."):
            raise ValidationError('kind="feature" 스코프의 key는 "group."으로 시작할 수 없습니다.')
        
    def __str__(self) -> str:
        return f"{self.key} ({self.kind})"
    

"""
그룹의 경우 사업자 번호 등 추가 예정
"""    
class Group(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="그룹/회사 명"
    )
    slug = models.SlugField(
        max_length=120,
        unique=True,
        help_text="회사 식별 slug (예: gbt 등)"
    ) 
    desc = models.CharField(
        max_length=200,
        blank=True,
        help_text="설명"
    )


    class Meta:
        db_table = "rbac_group"
        verbose_name = "그룹 (조직 단위)"
        verbose_name_plural = "그룹 (조직 단위)"
        indexes = [
            models.Index(fields=["name"], name="idx_rbac_group_name"),
            models.Index(fields=["slug"], name="idx_rbac_group_slug"),
        ]

    @property
    def rep_scope_key(self) -> str:
        """대표 스코프 키 규칙: group.{slug}"""
        return f"group.{self.slug}"

    @property
    def rep_scope_slug(self) -> str:
        """대표 스코프의 slug 규칙 (키와 분리해 유지)"""
        return slugify(self.rep_scope_key)

    def __str__(self) -> str:
        return self.name
    
"""
유저의 회사 내 역할 등급
member(1) < owner(2) < admin(3)
"""    
class GroupMembership(models.Model):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"

    ROLE_CHOICES = [
        (MEMBER, "Member"),  # 1
        (OWNER, "Owner"),    # 2
        (ADMIN, "Admin"),    # 3
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="group_memberships",
        help_text="사용자",
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="memberships",
        help_text="그룹",
    )
    role_in_group = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=MEMBER,
        help_text="그룹 내 역할 (member < owner < admin)"
    )
    is_default = models.BooleanField(
        default=False,
        help_text="기본 진입 그룹 여부"
    )
    
    class Meta:
        db_table = "rbac_group_membership"
        verbose_name = "그룹 소속(멤버십)"
        constraints = [
            UniqueConstraint(fields=["user", "group"], name="uniq_rgm_user_group"),
            UniqueConstraint(
                fields=["user"], name="uniq_rgm_default_per_user",
                condition=Q(is_default=True),
            ),
        ]
        indexes = [
            models.Index(fields=["user"], name="idx_rgm_user"),
            models.Index(fields=["group"], name="idx_rgm_group"),
        ]

    def __str__(self) -> str:
        badge = " [default]" if self.is_default else ""
        return f"{self.user} * {self.group} ({self.role_in_group}){badge}"
        
        
"""
그룹의 특정 역할 → 기능 스코프" 매핑
그룹마다 정책이 달라도, 전역 스코프 키는 재사용(중복 폭발 방지)
"""
class GroupRoleScope(models.Model):
    ROLE_CHOICES = GroupMembership.ROLE_CHOICES
    
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="role_scopes",
        help_text="스코프를 부여하는 그룹"
    )
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=GroupMembership.MEMBER,
        help_text="이 역할 이상에 부여 (서비스 레이어에서 상속)"
    )
    scope = models.ForeignKey(
        Scope,
        on_delete=models.CASCADE,
        related_name="granted_to_group_roles",
        help_text = "연결한 스코프(kind='feature')"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="OFF면 임시 비활성화 (서비스 레이어는 True만 반영)"
    )
    desc = models.CharField(max_length=200, blank=True, help_text="부여 사유/메모")
    granted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="group_role_scope_grants",
        help_text="권한을 부여한 운영자(선택)"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="생성일")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="수정일")
    
    class Meta:
        db_table = "rbac_group_role_scope"
        constraints = [
            UniqueConstraint(fields=["group", "role", "scope"], name="uniq_rgrs_triple"),
        ]
        indexes = [
            models.Index(fields=["group", "role"], name="idx_rgrs_group_role"),
            models.Index(fields=["is_active"], name="idx_rgrs_active"),
        ]
    
    def clean(self):
        """
        저장 전 정합성 보장:
        - scope.kind 는 반드시 'feature'여야 함
        """
        if self.scope_id:
            # scope가 캐시/선택되어 있으면 kind 검사
            kind = getattr(self.scope, "kind", None)
            if kind is None:
                # 혹시 캐시가 없으면 DB에서 한 번 더 가져와 안전검사
                kind = Scope.objects.filter(pk=self.scope_id).values_list("kind", flat=True).first()
            if kind != Scope.KIND_FEATURE:
                raise ValidationError({"scope": 'GroupRoleScope.scope 는 kind="feature" 스코프만 허용합니다.'})

    def __str__(self) -> str:
        status = "ON" if self.is_active else "OFF"
        return f"[{status}] {self.group.slug}:{self.role} → {self.scope.key}"
    

"""
전역 기능 토글
- 메뉴/기능 노출 시: 그룹 개별 설정이 있으면 이를 우선, 없으면 전역값 사용
"""
class FeatureFlag(models.Model):
    key = models.CharField(
        max_length=100,
        unique=True,
        help_text="기능 플래그 키"
    )
    enabled = models.BooleanField(
        default=False,
        help_text="전역 활성화 여부"
    )
    desc = models.CharField(
        max_length=200,
        blank=True,
        help_text="설명"
    )
    
    class Meta:
        db_table = "rbac_feature_flag"
        verbose_name = "기능 플래그"
    
    def __str__(self) -> str:
        return f"{self.key} ({'ON' if self.enabled else 'OFF'})"
    


"""
회사(그룹) 단위로 기능 토글을 덮어쓰거나(override),
점진적으로 배포(rollout_percent)하거나, 
기간 한정 제공(start/end) 가능
"""
class GroupFeatureFlag(models.Model):
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='feature_flags',
        help_text='대상 그룹'
    )
    flag = models.ForeignKey(
        FeatureFlag,
        on_delete=models.CASCADE,
        related_name="group_overrides",
        help_text="전역기능플래그"
    )
    enabled = models.BooleanField(
        default=True,
        help_text="이 그룹에서 사용할지 여부(전역값보다 우선순위)"
    )
    rollout_percent = models.PositiveIntegerField(
        default=100, 
        help_text="이 그룹 내 사용자 중 활성화 비율(0~100)"
    )
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    note = models.CharField(max_length=200, blank=True, help_text="메모")
    
    
    class Meta:
        db_table = "rbac_group_feature_flag"
        constraints = [
            UniqueConstraint(fields=["group", "flag"], name="uniq_group_flag_override"),
            models.CheckConstraint(
                name="ck_rollout_percent_range",
                check=Q(rollout_percent__gte=0) & Q(rollout_percent__lte=100),
            ),
        ]
        indexes = [
            models.Index(fields=["group"], name="idx_gff_group"),
            models.Index(fields=["flag"], name="idx_gff_flag"),
        ]

    def __str__(self) -> str:
        return f"{self.group.slug}:{self.flag.key} ({'ON' if self.enabled else 'OFF'} / {self.rollout_percent}%)"
    
    
# 메뉴 아이템 -----------------------------------------------------
# 사이드바에 들어갈 메뉴바

class MenuItem(models.Model):
    KIND_ITEM = "item" # 각 메뉴
    KIND_GROUP = "group" # 메뉴의 그룹
    KIND_CHOICES = [
        (KIND_ITEM, "Item (link)"),
        (KIND_GROUP, "Group (header)"),
    ]
    # 그룹에 속해있는 메뉴
    parent = models.ForeignKey(
        "self", null=True, 
        blank=True, 
        on_delete=models.CASCADE,
        related_name="children", 
        verbose_name="상위 메뉴",
        help_text="최상위면 비움. 하위는 부모 지정"
    )
    # 제목 or 링크 / item or group
    kind = models.CharField(
        max_length=10, 
        choices=KIND_CHOICES, 
        default=KIND_ITEM,
        verbose_name="메뉴 타입", 
        help_text="링크 메뉴인지/그룹 헤더인지"
    )
    # 메뉴 명 (기본을 한국어로)
    label_ko = models.CharField(
        max_length=50,
        verbose_name="한국 메뉴명",
        help_text="표시 이름",
    )
    label_en = models.CharField(
        max_length=50,
        verbose_name="영어 메뉴명",
        help_text="표시 이름",
    )
    label_zh = models.CharField(
        max_length=50,
        verbose_name="중국 메뉴명",
        help_text="표시 이름",
    )
    # 내부 경로
    path = models.CharField(
        max_length=200,
        default="",
        blank=True,
        verbose_name="경로",
        help_text="내부경로, 그룹타입은 비움(그룹명에만 쓰이고 path가 없어서)"
    )
    # 이 메뉴에 필요한 스코프(OR)
    required_any = models.ManyToManyField(
        Scope,
        blank=True,
        related_name="menus_any",
        verbose_name="필요 스코프(OR)",
        help_text='비우면 권한 제한 없음. 회사 전용은 "group.{slug}"를 추가'
    )
    # 뷰 활성화 비활성화
    feature_flag = models.ForeignKey(
        FeatureFlag,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="menus",
        verbose_name="가상 플래그",
        help_text="ON일 때만 노출, 회사별 오버라이드는 GroupFeatureFlag를 서비스에서 적용"
    )
    order = models.IntegerField(default=0, verbose_name="정렬 순서")
    # 외부 api
    external = models.BooleanField(default=False, verbose_name="외부 링크")
    external_url = models.URLField(blank=True, default="", verbose_name="외부 링크 URL")
    # 설명
    desc = models.CharField(max_length=200, blank=True, verbose_name="설명")
    # 사용여부
    enabled = models.BooleanField(default=True, verbose_name="사용 여부")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    
    class Meta:
        db_table = "menu_item"
        verbose_name = "메뉴"
        ordering = ["parent_id", "order", "id"]
        indexes = [
            models.Index(fields=["parent", "order"], name="idx_menu_parent_order"),
            models.Index(fields=["feature_flag"], name="idx_menu_feature_flag"),
        ]
        constraints = [
            # group ⇒ path == "" & external == False
            models.CheckConstraint(name="menu_group_path_blank", check=~Q(kind="group") | Q(path="")),
            models.CheckConstraint(name="menu_group_external_false", check=~Q(kind="group") | Q(external=False)),
            # item & external ⇒ external_url 필요, path 비움
            models.CheckConstraint(
                name="menu_item_ext_url_required",
                check=~(Q(kind="item") & Q(external=True)) | ~Q(external_url=""),
            ),
            models.CheckConstraint(
                name="menu_item_ext_path_blank",
                check=~(Q(kind="item") & Q(external=True)) | Q(path=""),
            ),
            # item & 내부링크 ⇒ path 필요, external_url 비움
            models.CheckConstraint(
                name="menu_item_path_required_when_internal",
                check=~(Q(kind="item") & Q(external=False)) | ~Q(path=""),
            ),
            models.CheckConstraint(
                name="menu_item_internal_exturl_blank",
                check=~(Q(kind="item") & Q(external=False)) | Q(external_url=""),
            ),
            # 동일 부모 내 라벨 유니크 + 루트 라벨 유니크
            UniqueConstraint(fields=["parent", "label_ko"], name="uniq_menu_parent_label"),
            UniqueConstraint(fields=["label_ko"], condition=Q(parent__isnull=True), name="uniq_menu_root_label"),
        ]

    def clean(self):
        if self.kind == self.KIND_GROUP:
            self.external = False
            if self.path:
                raise ValidationError("group 타입은 path를 비워야 합니다.")
        if self.kind == self.KIND_ITEM:
            if self.external:
                if not self.external_url:
                    raise ValidationError("external=True인 item은 external_url이 필요합니다.")
                if self.path:
                    raise ValidationError("external=True인 item은 path를 비워야 합니다.")
            else:
                if not self.path:
                    raise ValidationError("external=False인 item은 path가 필요합니다.")
                if self.external_url:
                    raise ValidationError("external=False인 item은 external_url을 비워야 합니다.")

    def __str__(self) -> str:
        return self.label_ko
    
"""
그룹의 대표 스코프 (group.{slug})를 생성/정합성 유지
MenuItem.required_any에 group.{slug}를 넣어 회사 전용 메뉴를 쉽게 제어
"""
def _ensure_group_rep_scope(instance: Group):
    key = instance.rep_scope_key
    sslug = instance.rep_scope_slug
    scope, created = Scope.objects.get_or_create(
        key=key,
        defaults=dict(kind=Scope.KIND_GROUP, slug=sslug, desc=f"{instance.name} 대표 스코프"),
    )
    #key가 존재하되 slug/desc가 바뀌었을 수 있으니 보정하기
    dirty = False
    if scope.kind != Scope.KIND_GROUP:
        scope.kind = Scope.KIND_GROUP
        dirty = True
    if scope.slug != sslug:
        scope.slug = sslug
        dirty = True
    if created or dirty:
        scope.save(update_fields=["kind", "slug"] if not created else None)
    
    return scope

"""
slug  변경 감지 용도로 기존 값을 조회 (필요시 후속 처리 가능)
"""
@receiver(pre_save, sender=Group)
def _on_group_pre_save(sender, instance: Group, **kwargs):
    return


@receiver(post_save, sender=Group)
def _on_group_post_save(sender, instance: Group, created: bool, **kwargs):
    _ensure_group_rep_scope(instance)
    
"""
그룹 삭제 시 대표 스코프를 자동 삭제할지 여부는 정책에 따름 (깔끔히 제거)

"""
@receiver(post_delete, sender=Group)
def _on_group_post_delete(sender, instance: Group, **kwargs):
    key = f"group.{instance.slug}"
    try:
        Scope.objects.filter(key=key, kind=Scope.KIND_GROUP).delete()
    except Exception:
        pass
    
    
    