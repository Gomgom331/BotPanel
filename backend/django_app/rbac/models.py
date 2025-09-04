from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
# Q = ORM에서 **복잡한 쿼리 조건(AND, OR, NOT 등 논리 연산)**을 표현
# UniqueConstraint = 테이블 수준에서 고유 제약조건을 정의
from django.db.models import Q, UniqueConstraint

class Scope(models.Model):
    """
    실제 행동 권한의 최소단위
    """
    key = models.CharField(
        max_length=100, 
        unique=True,
        help_text='"entry.read", "entry.write", "user.manage", "llm.chat" 등'
    )
    desc = models.CharField(
        max_length=200,
        black=True,
        help_text="권한 설명"   
    )
    
    class Meta:
        db_table = "rbac_scope"
        help_text = "스코프(세부 권한)"
        
    def __str__(self) -> str:
        return self.key
    

class Group(models.Model):
    """
    팀/부서/프로젝트 등 조직 단위 그룹
    유저는 여러 그룹에 속할 수 있음 (다대다)/ 그룹이 부여하는 스코프를 추가로 얻음
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="그룹이름"
    )
    desc = models.CharField(
        max_length=200,
        blank=True,
        help_text="그룹내 설명"
    )
    
    class Meta:
        db_table = "rbac_group"
        help_text = "그룹 (조직 단위)"
        indexes = [
            models.Index(fields=["name"], name="idx_rbac_group_name"),
        ]
    def __str__(self) -> str:
        return self.name
    
class GroupMembership(models.Model):
    """
    유저가 어떤 그룹에 어떤 지위로 속하는지 정의
    - Owner, Admin, Member (해당 회사의 오너, 관리자, 멤버(사원))
    그룹 정의로 설정, 관리 권한 분리 가능 (다대다)
    """    
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    ROLE_CHOICES = [
        (OWNER, "Owner"),
        (ADMIN, "Admin"),
        (MEMBER, "Member"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="group_memberships", # 데이터 관계도 이름
        help_text="사용자"
    )
    group= models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="memberships",
        help_text="그룹",
    )
    role_in_group = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=MEMBER,
        help_text="그룹 내 역할 (Owner, Admin, Member)"
    )
    
    class Meta:
        db_table = "rbac_group_membership"
        verbose_name = "그룹 소속(멤버십)"
        unique_together = ("user", "group") # 한 유저가 같은 그룹에 중복 등록 불가
        # 바로 위치를 찾아 레코드를 읽어줘서 조회가 빨라지지만 쓰기 비용이 늘어남
        indexes = [
            models.Index(fields=["user"], name="idx_rgm_user"), # user 검색 최적화
            models.Index(fields=["group"], name="idx_rgm_group"), # group 검색 최적화
        ]
    def __str__(self) -> str:
        return f"{self.user} * {self.group} ({self.role_in_group})"
    
class GroupScope(models.Model):
    """
    그룹이 부여하는 스코프
    """
    group = models.ForeignKey(
        Group, 
        on_delete=models.CASCADE,
        help_text="그룹"
    )
    scope = models.ForeignKey(
        Scope, 
        on_delete=models.CASCADE,
        help_text="스코프"
    )
    
    class Meta:
        db_table = "rbac_group_scope"
        verbose_name = "그룹-스코프 연결"
        unique_together = ("group", "scope")
        indexes = [
            models.Index(fields=["group", "scope"], name="idx_rbac_group_scope"),
        ]
        
    def __str__(self) -> str:
        return f"{self.group.name} - {self.scope.key}"
    
class FeatureFlag(models.Model):
    """
    기능 토글 플래그 (버튼 스위치 등)
    """
    key = models.CharField(
        max_length=100,
        unique=True,
        help_text="기능 플래그 키"
    )
    enabled = models.BooleanField(
        default=False,
        help_text="활성화 여부"
    )
    desc = models.CharField(
        max_length=200,
        blank=True,
        help_text="기능 설명"
    )
    
    class Meta:
        db_table = "rbac_feature_flag"
        verbose_name = "기능 플래그"
    
    def __str__(self) -> str:
        status = "ON" if self.enabled else "OFF"
        return f"{self.key} ({status})"
    

class MenuItem(models.Model):
    """
    메뉴 항목 정의 (트리 구조 + 권한 + 기능 플래그)
    계층 구조, 메뉴별 권한설정 가능
    
    - group: 링크 없는 그룹(대메뉴 컨테이너)
    - item : 실제 이동 가능한 메뉴(내부 path 또는 외부 URL)
    
    대메뉴의 경우 명시적으로만 작성되어 있고 (메뉴의 그룹) 링크가 없는 경우는
    kind=group 으로 설정하고 path 값은 비우기
    """
    KIND_ITEM = "item"
    KIND_GROUP = "group"
    KIND_CHOICES = [
        (KIND_ITEM,  "Item (link)"),
        (KIND_GROUP, "Group (header)"),
    ]
    
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="children",
        verbose_name="상위 메뉴",
        help_text="최상위 메뉴면 비워둠. 하위 메뉴는 여기에 부모를 지정"
    )
    # 메뉴 타입 정하기 (아이템, 그룹)
    kind = models.CharField(
        max_length=10,
        choices=KIND_CHOICES,
        default=KIND_ITEM,
        verbose_name="메뉴 타입",
        help_text="실제 링크 메뉴인지 , 그룹 헤더인지 구분하기"
    )
    label = models.CharField(
        max_length=50,
        verbose_name="메뉴명",
        help_text="사이드바/탑바 등에 보일 이름"
    )
    path = models.CharField(
        max_length=200,
        blank=True, 
        verbose_name="경로",
        help_text="메뉴 이름 클릭시 이동할 경로(예: /entries, /llm). 상위/하위 관계와 무관하게 절대경로 추천 kind=item 일 대만 사용하고 group 일떄는 값 비워두기"
    )
    
    # 다대다로 권한 설정
    required_any = models.ManyToManyField(
        Scope, 
        blank=True,
        related_name="menus_any",
        verbose_name="필요 스코프",
        help_text="비우면 누구나 접근가능(권한 제한 없음)"
    )
    
    # 기능 플래그 연결 (특정 기능이 켜저 있을 때 보이기, 서버 로직에서 결정)
    feature_flag = models.ForeignKey(
        FeatureFlag, # 기능 플래그와 연결
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="menus",
        verbose_name="기능 플래그",
        help_text="ON일 때만 메뉴 노출 (비우면 항상 노출)"
        
    )
    # 메뉴 표시 순서 (정렬 순서)
    order = models.IntegerField(
        default=0,
        verbose_name="정렬 순서",
        help_text="형제들 사이의 순서 (값이 작을수록 위)"
    )
    # 외부 링크인지 (다른 도메인) ------------------------
    external = models.BooleanField(
        default=False,
        verbose_name="외부 링크",
        help_text="외부 URL로 이동하는 메뉴인지"
    )
    # 외부 링크 URL
    external_url = models.URLField(
        blank=True,
        verbose_name="외부 링크 URL",
        help_text="external=True일 때 이동할 주소(예: https://www.example.com)"
    )
    
    # 부가적인 설명란 ------------------------
    desc = models.CharField(
        max_length=200, 
        blank=True, 
        verbose_name="설명",
        help_text="메뉴 목적/대상자 설명(선택, 로직 영향 X)."
    )
    
    # 운영 편의 
    enabled = models.BooleanField(default=True, verbose_name="사용 여부")
    
    # 날짜 
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    
    
    class Meta:
        db_table = "menu_item"
        verbose_name = "메뉴"
        ordering = ["parent_id", "order", "id"]
        # 검색 최적화
        indexes = [
            models.Index(fields=["parent", "order"], name="idx_menu_parent_order"),
            models.Index(fields=["feature_flag"], name="idx_menu_feature_flag"),
        ]
        constraints = [
            # group ⇒ path == "" & external == False
            models.CheckConstraint(
                name="menu_group_path_blank",
                check=~Q(kind="group") | Q(path=""),
            ),
            models.CheckConstraint(
                name="menu_group_external_false",
                check=~Q(kind="group") | Q(external=False),
            ),
            # item & external ⇒ external_url 필요, path 비워야 함
            models.CheckConstraint(
                name="menu_item_ext_url_required",
                check=~(Q(kind="item") & Q(external=True)) | ~Q(external_url=""),
            ),
            models.CheckConstraint(
                name="menu_item_ext_path_blank",
                check=~(Q(kind="item") & Q(external=True)) | Q(path=""),
            ),
            # item & 내부링크 ⇒ path 필요, external_url 비워야 함
            models.CheckConstraint(
                name="menu_item_path_required_when_internal",
                check=~(Q(kind="item") & Q(external=False)) | ~Q(path=""),
            ),
            models.CheckConstraint(
                name="menu_item_internal_exturl_blank",
                check=~(Q(kind="item") & Q(external=False)) | Q(external_url=""),
            ),
            # 동일 부모에서 라벨 중복 금지
            UniqueConstraint(fields=["parent", "label"], name="uniq_menu_parent_label"),
            # 루트(부모 없음)에서 라벨 중복 금지
            UniqueConstraint(fields=["label"], condition=Q(parent__isnull=True), name="uniq_menu_root_label"),
        ]
    
    # 유효성 확인하기 (관리자/테스트에서 즉시 피드백)
    def clean(self):
        if self.kind == self.KIND_GROUP:
            self.external = False
            if self.path:
                raise ValidationError("group 타입은 path를 비워야 합니다")
        if self.kind == self.KIND_ITEM:
            if self.external:
                if not self.external_url:
                    raise ValidationError("external=True인 item은 external_url이 필요합니다")
                if self.path:
                    raise ValidationError("external=True인 item은 path를 비워야 합니다")
            else:
                if not self.path:
                    raise ValidationError("external=False인 item은 path가 필요합니다.")
                if self.external_url:
                    raise ValidationError("external=False인 item은 external_url을 비워야 합니다")
                
    
    def __str__(self) -> str:
        prefix = {"item":"","group":""}.get(self.kind, "*")
        return f"{prefix} {self.label}"