// 역활 권한 구분짓기 \ 유저 정보 가져오기
import { useEffect, useState } from "react";

// none 은 인증 및 권한이 없음
export type UserRole = "none" | "guest" | "user" | "admin" | "editor";

// 권한이 없으면 None
function readRole(): UserRole {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "none";
    const role = JSON.parse(raw)?.role as UserRole | undefined;
    return role === "guest" || role === "user" || role === "admin" || role === "editor" ? role : "none";
  } catch {
    return "none";
  }
}

// 권한 상태 체크
export const useUser = () => {
  const [role, setRole] = useState<UserRole>(readRole); // ⬅ 동기 초기화

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "user") setRole(readRole());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isAuthenticated = role === "user" || role === "admin" || role === "editor";
  const isTrial = role === "guest";
  const hasRole = role !== "none";
  return { role, isAuthenticated, isTrial, hasRole };
};


