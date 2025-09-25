// 로그인/권한 컨텍스트 훅
// 서버가 계산한 persona/scopes/groups를 /user/me 에서 받아와 전역 분기에 사용
import { useEffect, useMemo, useRef, useState } from "react";
import { useApi } from "./useApi";

export type UserRole = "none" | "guest" | "user" | "admin";
export type GroupRoleInGroup = "owner" | "admin" | "member";
export type GroupInfo = { id: number; name: string; slug?: string; role_in_group: GroupRoleInGroup };
export type MePayload = {
  id: number; username: string;
  persona: Exclude<UserRole, "none">; // guest | user | admin
  groups: GroupInfo[]; scopes: string[]; features?: string[];
};

const LSK = "user";

function readCached(): { role: UserRole; me?: Partial<MePayload> } {
  try {
    const raw = localStorage.getItem(LSK);
    if (!raw) return { role: "none" };
    const o = JSON.parse(raw);
    const role = o?.role;
    if (role === "guest" || role === "user" || role === "admin") return { role, me: o };
    return { role: "none" };
  } catch { return { role: "none" }; }
}

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
  const cached = readCached();
  const [role, setRole] = useState<UserRole>(cached.role);
  const [me, setMe] = useState<MePayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 탭 간 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LSK) {
        const c = readCached();
        setRole(c.role);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // /user/me API
  const fetchMe = useApi("USER_ME");

  const refresh = useMemo(() => async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true); setError(null);
    try {
      const res = await fetchMe<{ success: boolean; me?: any; user?: any }>({ method: "get" });
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
      if (!ac.signal.aborted) setLoading(false);
    }
  }, [fetchMe]);

  useEffect(() => {
    refresh();
    return () => abortRef.current?.abort();
  }, [refresh]);

  // 파생 상태
  const isAuthenticated = role === "user" || role === "admin";
  const isGuest = role === "guest";
  const hasRole = role !== "none";
  const scopes = me?.scopes ?? [];
  const groups = me?.groups ?? [];

  // 헬퍼
  const hasAnyScope = (need: string[] | string) => {
    const needs = Array.isArray(need) ? need : [need];
    return needs.some((s) => scopes.includes(s));
  };
  const inAnyGroup = (need: string[] | string, by: "slug" | "name" = "name") => {
    const wants = new Set(Array.isArray(need) ? need : [need]);
    return groups.some((g) => wants.has((by === "slug" ? g.slug : g.name) ?? ""));
  };

  return {
    role, me, scopes, groups,
    isAuthenticated, isGuest, hasRole,
    loading, error,
    refresh, hasAnyScope, inAnyGroup,
  };
};
