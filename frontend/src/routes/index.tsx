// routes/index.tsx
import { Routes, Route } from "react-router-dom";
import { publicRoutes, protectedRoutes, fallbackRoute } from "./routeConfig";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    const FallbackComponent = fallbackRoute.component;

    return (
    <Routes>
        {/* 공개 라우트 (roles로 접근 제어) */}
        {publicRoutes.map(({ path, component: Component, roles }) => (
            <Route
                key={path}
                path={path}
                element={
                <ProtectedRoute roles={roles}>
                    <Component />
                </ProtectedRoute>
                }
            />
        ))}

        {/* 보호 라우트 (roles로 접근 제어) */}
        {protectedRoutes.map(({ path, component: Component, roles }) => (
            <Route
                key={path}
                path={path}
                element={
                <ProtectedRoute roles={roles}>
                    <Component />
                </ProtectedRoute>
                }
            />
        ))}

        {/* 전체 범위 폴백 */}
        <Route path={fallbackRoute.path} element={<FallbackComponent />} />
    </Routes>
    );
};

export default AppRoutes;
