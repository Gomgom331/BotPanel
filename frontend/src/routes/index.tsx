// // routes/index.tsx
// import { Routes, Route } from "react-router-dom";
// import { publicRoutes, protectedRoutes, fallbackRoute } from "./routeConfig";
// import ProtectedRoute from "./ProtectedRoute";

// const AppRoutes = () => {
//     const Fallback = fallbackRoute.component;

//     return (
//     <Routes>
//         {/* 공개 라우트도 roles로 제어(예: 로그인 페이지는 ["none"]만 허용) */}
//         {publicRoutes.map(({ path, component: Component, roles, needScopes, redirectTo }) => (
//         <Route
//             key={path}
//             path={path}
//             element={
//             <ProtectedRoute roles={roles} needScopes={needScopes} redirectTo={redirectTo}>
//                 <Component />
//             </ProtectedRoute>
//             }
//         />
//         ))}
//         {/* 보호 라우트: 로그인/권한 필수 */}
//         {protectedRoutes.map(({ path, component: Component, roles, needScopes, redirectTo }) => (
//         <Route
//             key={path}
//             path={path}
//             element={
//             <ProtectedRoute roles={roles} needScopes={needScopes} redirectTo={redirectTo}>
//                 <Component />
//             </ProtectedRoute>
//             }
//         />
//         ))}

//         {/* 폴백 */}
//         <Route path={fallbackRoute.path} element={<Fallback />} />
//     </Routes>
//     );
// };

// export default AppRoutes;

import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HomeRedirect from "./HomeRedirect";

import LoginPage from "../pages/Auth/Login/Login"; // 로그인
// 나중에 게스트, 관리자 라우트 만들어두기
import GuestPage from "../pages/Guest/Dashboard";
import AdminPage from "../pages/Admin/Dashboard";
import NotFound  from "../pages/Error/NotFound";
import UserPage from "../pages/User/Dashboard";


export default function AppRoutes() {
    return (
    <Routes>
        {/* 루트 → 분기점1에 따라 분기 */}
        <Route path="/" element={<HomeRedirect />} />

        {/* 공개/비회사 라우트 */}
        <Route
        path="/login"
        element={
            <ProtectedRoute roles={["none"]}>
            <LoginPage />
            </ProtectedRoute>
        }
        />
        <Route
        path="/guest"
        element={
            <ProtectedRoute roles={["guest"]}>
            <GuestPage />
            </ProtectedRoute>
        }
        />
        <Route
        path="/admin"
        element={
            <ProtectedRoute roles={["admin"]}>
            <AdminPage />
            </ProtectedRoute>
        }
        />
        <Route
        path="/403"
        element={
            <ProtectedRoute roles={["guest","user","admin"]}>
            <NotFound />
            </ProtectedRoute>
        }
        />

        {/* 회사별 보호 라우트 (/:slug/*) — 오직 user만 접근 */}
        <Route path=":slug">
        {/* index → dashboard */}
        <Route
            index
            element={
                <ProtectedRoute roles={["user"]}>
                    <Navigate to="dashboard" replace />
                </ProtectedRoute>
            }
        />
        <Route
            path="dashboard"
            element={
                <ProtectedRoute roles={["user"]}>
                    <UserPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="orders"
            element={
                <ProtectedRoute roles={["user"]} needGroupRoles={["member","admin","owner"]}>
                    <UserPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="settings"
            element={
                <ProtectedRoute roles={["user"]} needGroupRoles={["admin","owner"]}>
                    <UserPage />
                </ProtectedRoute>
            }
        />
        </Route>

        {/* 폴백 */}
        <Route path="*" element={<NotFound />} />
    </Routes>
    );
}
