import { useState, useEffect } from "react";

// any 는 user admin 포함
export type UserRole = "guest" | "user" | "admin" | "any";

function getInitialRole(): UserRole {
  try {
    // 유저값을 불러와 권한 체크하기
    const raw = localStorage.getItem("user");
    if (!raw) return "guest";
    const parsed = JSON.parse(raw);
    const role = parsed?.role as UserRole | undefined;
    return role === "admin" || role === "user" ? role : "guest";
  } catch {
    return "guest";
  }
}

export const useUser = () => {
  // 초기 렌더에localStorage에서 읽어 권한 반영
  const [role, setRole] = useState<UserRole>(getInitialRole);

  // 로그인/로그아웃 등으로 값이 바뀐 뒤 새로고침했을 때도 안전
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const next = parsed?.role as UserRole | undefined;
        if (next && next !== role) setRole(next);
      } catch {/* 무시 */}
    } else if (role !== "guest") {
      setRole("guest");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 마운트 때 한 번 동기화

  const isAuthenticated = role !== "guest";
  return { role, isAuthenticated };
};
