// pages
import Login from "../pages/Login/Login";
import Main from "../pages/Main/Main";
import Chat from "../components/test/ChatInput";

// components
import NotFound from "../pages/Error/NotFound"

// hook & function
import HomeRedirect from "../routes/HomeRedirect";
import { ComponentType } from "react";


export type UserRole = "admin" | "user";

// 공통 인터페이스
export interface AppRoute {
    path: string;
    component: ComponentType<any>; // 컴포넌트만 받고 렌더링은 라우터에서
    requiredRole?: UserRole;
}


// 공개 라우터
export const publicRoutes: AppRoute[] = [
    { path: "/login", component: Login },
    { path: "/chat", component: Chat },
];

// 비공개 라우터
export const protectedRoutes: AppRoute[] = [
    { path: "/", component: Main, requiredRole: "user" },
];


// 일치하는 경로가 없을 때 홈으로 보내는 페이지
export const fallbackRoute: AppRoute = {
    path: "*",
    component: HomeRedirect,
};