// import { lazy } from "react";
// import HomeRedirect from "./HomeRedirect";
// // persona(페이지 분기) 타입: 서버 /user/me 의 persona와 1:1 매칭
// export type PersonaRole = "none" | "guest" | "user" | "admin";

// // 라우트 선언 타입
// export type AppRoute = {
//     path: string;
//     component: React.ComponentType<any>;
//     roles?: PersonaRole[];   // 허용할 persona (없으면 전부 허용)
//     needScopes?: string[];   // OR 조건. 이 스코프 중 하나라도 있으면 통과
//     redirectTo?: string;     // 권한 부족 시 보낼 경로(기본 "/")
// };

// // ---- 페이지 컴포넌트 (원하는 방식대로 import/lazy 해도 됨) ----
// const TestPage = lazy(() => import("../components/test/ChatInput"))
// const LoginPage = lazy(() => import("../pages/Auth//Login/Login"));
// const NotFound = lazy(() => import("../pages/Error/NotFound"));
// const GuestLanding = lazy(() => import("../pages/Guest/Dashboard"));   // 선택
// const UserPage = lazy(() => import("../pages/Main/Main"));            // 일반 유저 홈
// const AdminHome = lazy(() => import("../pages/Admin/Dashboard"));      // 관리자 홈

// // -------------------- 공개 라우트 --------------------
// // "/"는 HomeRedirect로 persona에 따라 분기
// export const publicRoutes: AppRoute[] = [
//     { path: "/",      component: HomeRedirect, roles: ["none","guest","user","admin"] },
//     { path: "/test",      component: TestPage, roles: ["none","guest","user","admin"] },
//     { path: "/login", component: LoginPage, roles: ["none"] },
//     { path: "/403", component: NotFound, roles: ["guest", "user", "admin"] },
// ];

// // -------------------- 보호 라우트 -------s-------------
// // roles로 페이지 분기, needScopes로 기능 권한(OR) 추가
// export const protectedRoutes: AppRoute[] = [
//     { path: "/test", component: TestPage, roles: ["none","guest","user","admin"] },
//     // 게스트 전용/체험 페이지(필요 없으면 빼도 됨)
//     { path: "/guest", component: GuestLanding, roles: ["guest"] },

//     // 일반 유저 전용 (그룹단위 페이지 유저에서도 - user, admin, owner 로 나뉘어짐)
//     { path: "/user", component: UserPage, roles: ["user"] },

//     // 관리자(에디터) 전용
//     { path: "/admin", component: AdminHome, roles: ["admin"] },
// ];

// // -------------------- 폴백 --------------------
// export const fallbackRoute: AppRoute = { path: "*", component: NotFound };





// // 도메인 기능 예시(스코프 기반)
// //   { path: "/entries",     component: EntriesList, roles: ["user","admin"], needScopes: ["entry.read"] },
// //   { path: "/entries/new", component: EntryNew,    roles: ["user","admin"], needScopes: ["entry.write"] },
