
// // routes/ProtectedRoute.tsx
// import { Navigate } from "react-router-dom";
// import { useUser } from "../hooks/useUser";

// type PersonaRole = "none" | "guest" | "user" | "admin";

// /**
//  * 라우트 가드
//  * - roles: 허용할 persona(페이지 분기)
//  * - needScopes: 필요한 스코프 중 1개 이상 보유해야 통과(기능 분기)
//  * - redirectTo: 권한 불충분 시 보낼 경로(기본 "/")
//  */

// export default function ProtectedRoute({
//   children,
//   roles,
//   needScopes,
//   redirectTo = "/",
// }: {
//   children: React.ReactNode;
//   roles?: PersonaRole[];
//   needScopes?: string[] | string;
//   redirectTo?: string;
// }) {
//   const { role, loading, hasAnyScope } = useUser();

//   // 서버 진실 동기화 중이면 깜빡임 방지
//   if (loading) return null; // or <FullScreenSpinner />

//   // 1) persona(페이지 분기)
//   if (roles && !roles.includes(role)) {
//     // 비로그인만 로그인 페이지로 보냄
//     return role === "none" ? <Navigate to="/login" replace /> : <Navigate to={redirectTo} replace />;
//   }

//   // 2) scopes(기능 분기)
//   if (needScopes) {
//     const ok = hasAnyScope(needScopes);
//     if (!ok) {
//       // 권한 부족 → 403이나 홈으로
//       return <Navigate to="/403" replace />;
//     }
//   }

//   return <>{children}</>;
// }

import { Navigate, useLocation, useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";

type PersonaRole = "none" | "guest" | "user" | "admin";

export default function ProtectedRoute({
  children,
  roles,
  needScopes,
  needGroupRoles,
  redirectTo = "/",
}: {
  children: React.ReactNode;
  roles?: PersonaRole[];
  needScopes?: string[] | string;
  needGroupRoles?: Array<"owner" | "admin" | "member"> | "owner" | "admin" | "member";
  redirectTo?: string;
}) {
  const { role, loading, hasAnyScope, inAnyGroup, me } = useUser();
  const location = useLocation();
  const { slug } = useParams();

  if (loading) return null;

  if (roles && roles.includes(role)) {
  } else {
    if (roles) {
      return role === "none"
        ? <Navigate to="/login" replace state={{ from: location }} />
        : <Navigate to={redirectTo} replace />;
    }
    if (role === "none") {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  const firstSeg = location.pathname.split("/").filter(Boolean)[0];
  const isCompanyRoute = !!firstSeg && !["login", "guest", "admin", "403"].includes(firstSeg);

  if (isCompanyRoute) {
    if (role !== "user") return <Navigate to="/403" replace />;
    if (!slug) return <Navigate to="/403" replace />;

    const isMember = inAnyGroup(slug, "slug");
    if (!isMember) return <Navigate to="/403" replace />;

    if (needGroupRoles) {
      const wants = Array.isArray(needGroupRoles) ? needGroupRoles : [needGroupRoles];
      const myRole = me?.groups?.find(g => g.slug === slug)?.role_in_group ?? null;
      if (!myRole || !wants.includes(myRole)) return <Navigate to="/403" replace />;
    }

    localStorage.setItem("lastSlug", slug);
  }

  if (needScopes) {
    const ok = hasAnyScope(needScopes);
    if (!ok) return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
