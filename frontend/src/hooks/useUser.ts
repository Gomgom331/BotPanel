// 로그인/권한 컨텍스트 훅
// 서버가 계산한 persona/scopes/groups를 /user/me 에서 받아와 전역 분기에 사용
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useApi } from "./useApi";

export type UserRole = "none" | "guest" | "user" | "admin"; //1분기
export type GroupRoleInGroup = "owner" | "admin" | "member"; // 2분기
export type GroupInfo = { id: number; name: string; slug?: string; role_in_group: GroupRoleInGroup };

// /user/me API 페이로드 타입
export type MePayload = {
  id: number; username: string;
  persona: Exclude<UserRole, "none">; // guest | user | admin
  groups: GroupInfo[]; scopes: string[]; features?: string[];
};

const LSK = "user";

// 로컬스토리지에서 읽기 (역할 및 유저 정보)
function readCached(): { role: UserRole; me?: Partial<MePayload> } {
  try {
    const raw = localStorage.getItem(LSK);
    if (!raw) return { role: "none" };
    const o = JSON.parse(raw);
    const role = o?.role;

    // 타입 검증
    if (role === "guest" || role === "user" || role === "admin") return { role, me: o };
    return { role: "none" };
  } catch { return { role: "none" }; }
}
// 쓰기
function writeCached(role: UserRole, me?: Partial<MePayload>) {
  try {
    const out: any = { role };
    if (me?.scopes) out.scopes = me.scopes;
    if (me?.groups) out.groups = me.groups;
    localStorage.setItem(LSK, JSON.stringify(out));
  } catch {}
}

export const useUser = () => {
  // 
  const cached = readCached(); // 캐쉬
  const [role, setRole] = useState<UserRole>(cached.role); // Role
  const [me, setMe] = useState<MePayload | null>(cached.me as MePayload | null) // 유저 정보, 정보가 없으면 null
  const [loading, setLoading] = useState<boolean>(true); // 로딩
  const [error, setError] = useState<string | null>(null); // 에러
  const abortRef = useRef<AbortController | null>(null); // 중단 컨트롤러

  // 탭 간 동기화 (storge 이벤트로 다른 탭에서의 변경사항도 감지, 동기화가 됨)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LSK) {
        const c = readCached();
        setRole(c.role);
        if(c.me){
          setMe(c.me as MePayload)
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  // /user/me API
  const fetchMe = useApi("USER_ME");

  // 새로고침 함수
  const refresh = useMemo(() => async () => {
    // 이전 요청 중단
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    // 초기화
    setLoading(true); setError(null);
    // API 호출
    try {
      const res = await fetchMe<{ success: boolean; me?: any; user?: any }>({ method: "get" });
      if (res == null){
        return { success: false, formError: "SERVER_ERROR"};
      }
      // if (!res?.success){
      //   return { success: false, formError: "SERVER_ERROR"};
      // }
      if (ac.signal.aborted) return;
      if (!res?.success) {
        // 서버가 200에 success=false를 줄 리턴 경로가 있다면 none으로
        setMe(null); setRole("none"); writeCached("none"); return;
      }
      const data = res.me ?? res.user; // 백엔드 호환
      if (!data) { setMe(null); setRole("none"); writeCached("none"); return; }

      const persona: UserRole =
        data.persona ?? ((data.groups?.length ?? 0) > 0 ? "user" : "guest");

      setMe(data);
      setRole(persona);
      writeCached(persona, data);
    } catch (e: any) {
      // 401은 clients에서 throw 될 테니 여기서 none 전환해도 OK
      setError(e?.message ?? "me_error");
      setMe(null); setRole("none"); writeCached("none");
    } finally {
      if (!ac.signal.aborted) setLoading(false); // 중단됐으면 상태 변경 안함
    }
  }, [fetchMe]);

  useEffect(() => {
    refresh();
    return () => abortRef.current?.abort();
  }, [refresh]);

  // 파생 상태 및 함수 (초기에 계산해서 반환)
  const isAuthenticated = useMemo(() => role === "user" || role === "admin", [role]);
  const isGuest = role === "guest";
  const hasRole = role !== "none";
  const scopes = useMemo(() => me?.scopes ?? [], [me?.scopes]);
  const groups = useMemo(() => me?.groups ?? [], [me?.groups]);

  // 스코프 확인 (권한)
  const hasAnyScope = useCallback((need: string[] | string) => {
    const needs = Array.isArray(need) ? need : [need];
    return needs.some((s) => scopes.includes(s));
  },[scopes]);

  // 그룹 확인
  const inAnyGroup = useCallback((need: string[] | string, by: "slug" | "name" = "name") => {
    const wants = new Set(Array.isArray(need) ? need : [need]);
    return groups.some((g) => wants.has((by === "slug" ? g.slug : g.name) ?? ""));
  },[groups]);

  // slug (그룹내) 역활 확인 및 반환 , 없으면 null
  const getGroupRole = (slug?:string):GroupRoleInGroup | null => {
    if (!slug) return null;
    const g = groups.find((x)=> x.slug === slug);
    return g?.role_in_group ?? null;
  };

  // 해당 slug에서 allowed 역할 중 하나라도 가지는지
  const inGroupHasRole = (
    slug: string | undefined,
    allowed: GroupRoleInGroup[] | GroupRoleInGroup
  ): boolean => {
    if (!slug) return false;
    const wants = Array.isArray(allowed) ? allowed : [allowed];
    const r = getGroupRole(slug);
    return !!r && wants.includes(r);
  };  

  // 멤버십만 확인(역할 무관)
  const isMemberOfSlug = (slug?: string): boolean =>
    !!slug && groups.some((g) => g.slug === slug);

  return {
    role, me, scopes, groups,
    isAuthenticated, isGuest, hasRole,
    loading, error,
    refresh, hasAnyScope, inAnyGroup,
    getGroupRole, inGroupHasRole, isMemberOfSlug,
  };
};
