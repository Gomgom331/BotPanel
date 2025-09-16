from rbac.models import GroupScope

def effective_scopes(user) -> set[str]:
    if not user or not user.is_authenticated:
        return set()
    if getattr(user, "is_superuser", False):
        return {"*"}
    group_ids = user.group_memberships.values_list("group_id", flat=True)
    return set(
        GroupScope.objects.filter(group_id__in=group_ids)
        .values_list("scope__key", flat=True)
    )