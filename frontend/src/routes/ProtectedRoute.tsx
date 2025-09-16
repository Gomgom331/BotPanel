// // routes/ProtectedRoute.tsx
// import { Navigate } from "react-router-dom";
// import { useUser } from "../hooks/useUser";

// type AllowRole = "none" | "guest" | "user" | "admin" | "editor";

// export default function ProtectedRoute({
//   children, roles,
// }: { children: React.ReactNode; roles?: AllowRole[] }) {
//   const { role } = useUser(); // "none" | "guest" | "user" | "admin" | "editor"

//   if (roles && !roles.includes(role)) {
//     // none이면 로그인으로, 그 외엔 홈으로
//     return role === "none" ? <Navigate to="/login" replace /> : <Navigate to="/" replace />;
//   }
//   return <>{children}</>;
// }


// routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

type PersonaRole = "none" | "guest" | "user" | "admin";

/**
 * 라우트 가드
 * - roles: 허용할 persona(페이지 분기)
 * - needScopes: 필요한 스코프 중 1개 이상 보유해야 통과(기능 분기)
 * - redirectTo: 권한 불충분 시 보낼 경로(기본 "/")
 */

export default function ProtectedRoute({
  children,
  roles,
  needScopes,
  redirectTo = "/",
}: {
  children: React.ReactNode;
  roles?: PersonaRole[];
  needScopes?: string[] | string;
  redirectTo?: string;
}) {
  const { role, loading, hasAnyScope } = useUser();

  // 서버 진실 동기화 중이면 깜빡임 방지
  if (loading) return null; // or <FullScreenSpinner />

  // 1) persona(페이지 분기)
  if (roles && !roles.includes(role)) {
    // 비로그인만 로그인 페이지로 보냄
    return role === "none" ? <Navigate to="/login" replace /> : <Navigate to={redirectTo} replace />;
  }

  // 2) scopes(기능 분기)
  if (needScopes) {
    const ok = hasAnyScope(needScopes);
    if (!ok) {
      // 권한 부족 → 403이나 홈으로
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children}</>;
}
