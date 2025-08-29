
// // pages
// import Login from "../pages/Login/Login";
// import Main from "../pages/Main/Main";
// import Chat from "../components/test/ChatInput";

// // components
// // import NotFound from "../pages/Error/NotFound"

// // hook & function
// import HomeRedirect from "../routes/HomeRedirect";
// import { ComponentType } from "react";


// export type UserRole = "admin" | "user";

// // 공통 인터페이스
// export interface AppRoute {
//     path: string;
//     component: ComponentType<any>; // 컴포넌트만 받고 렌더링은 라우터에서
//     requiredRole?: UserRole;
// }

// // 공개 라우터
// export const publicRoutes: AppRoute[] = [
//     { path: "/login", component: Login },
//     { path: "/chat", component: Chat },
// ];

// // 비공개 라우터
// export const protectedRoutes: AppRoute[] = [
//     { path: "/", component: Main, requiredRole: "user" },
// ];


// // 일치하는 경로가 없을 때 홈으로 보내는 페이지
// export const fallbackRoute: AppRoute = {
//     path: "*",
//     component: HomeRedirect,
// };


// routes/routeConfig.ts
import type { ComponentType } from "react";
import Chat from "../components/test/ChatInput";
import Login from "../pages/Login/Login";
import Main from "../pages/Main/Main";
import AdminDashboard from "../pages/Admin/Dashboard";

import HomeRedirect from "../routes/HomeRedirect";

export type UserRole = "none" | "guest" | "user" | "admin";
export interface AppRoute {
    path: string;
    component: ComponentType<any>;
    roles?: UserRole[];
}
// 공개 라우터


// 게스트도 입장 가능한 공개/체험 페이지
export const publicRoutes: AppRoute[] = [
    { path: "/chat", component: Chat, roles: ["none","guest","user","admin"] }, 
    { path: "/login", component: Login, roles: ["none"] },
];

// 보호 라우트
export const protectedRoutes: AppRoute[] = [
    { path: "/",         component: Main,          roles: ["guest","user","admin"] }, // 게스트도 입장, 내부는 역할별 스위치        // 유저/관리자만
    { path: "/admin",    component: AdminDashboard,roles: ["admin"] },                // 관리자만
];

// fallback
export const fallbackRoute: AppRoute = { path: "*", component: HomeRedirect };