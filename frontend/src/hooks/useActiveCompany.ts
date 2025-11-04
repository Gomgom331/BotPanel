import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "./useUser";

export function useActiveCompany() {
    const { me } = useUser();
    const { slug: slugFromUrl } = useParams(); // URL에서 /.../:slug 있을 경우

    // /user/me 에서 내려오는 그룹 목록
    const groups = me?.groups ?? [];

    // 1) localStorage 에서 last_group_slug 읽기 (fallback 용)
    const storageSlug: string | null = (() => {
    if (typeof window === "undefined") return null;
    try {
        const cached = localStorage.getItem("user");
        if (!cached) return null;
        const data = JSON.parse(cached);
        return (
        data?.me?.last_group_slug ?? // 우리가 저장하는 필드
        data?.me?.active_group_slug ?? // 혹시 예전 이름을 쓴 경우 대비
        null
        );
    } catch {
        return null;
    }
    })();

    // 최종적으로 사용할 activeSlug 결정
    const activeSlug = useMemo(() => {
    // 1순위: URL에 slug가 있으면 그걸 최우선
    if (slugFromUrl) return slugFromUrl;

    // 2순위: 백엔드에서 내려주는 last_viewed_group (User FK)
    const lastViewedSlug = me?.last_viewed_group?.slug;
    if (lastViewedSlug) return lastViewedSlug;

    // 3순위: localStorage에 저장된 last_group_slug
    if (storageSlug && groups.some((g) => g.slug === storageSlug)) {
        return storageSlug;
    }

    // 4순위: 그래도 없으면 첫 번째 그룹
    return groups[0]?.slug ?? null;
    }, [slugFromUrl, me?.last_viewed_group?.slug, storageSlug, groups]);

    // 3) activeSlug 기준으로 실제 그룹 객체 찾기
    const activeGroup = useMemo(
    () => (activeSlug ? groups.find((g) => g.slug === activeSlug) ?? null : null),
    [groups, activeSlug]
    );

    // 4) 그룹 내에서의 내 역할
    const activeRole = activeGroup?.role_in_group ?? null;
    const isMember = !!activeGroup;

    return {
        me,
        groups,
        activeSlug,   // 현재 선택되어 있는 slug
        activeGroup,  // slug에 해당하는 그룹 객체
        activeRole,   // 그 그룹 내에서 내 role(owner/admin/member 등)
        isMember,
    };
}
