import { Routes, Route } from "react-router-dom";
import { publicRoutes, protectedRoutes, fallbackRoute } from "./routeConfig";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {

    const FallbackComponent = fallbackRoute.component;

    return (
        <Routes>
            {/* 공개 라우트 */}
            {publicRoutes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}

            {/* 보호 라우트 */}
            {protectedRoutes.map(({ path, component: Component, requiredRole }) => (
                <Route
                key={path}
                path={path}
                element={
                    <ProtectedRoute requiredRole={requiredRole}>
                        <Component />
                    </ProtectedRoute>
                }>
                    {/* 잘못된 하위 라우트 처리 */}
                    <Route path="*" element={<FallbackComponent />} />
                </Route>
            ))};
            {/* 전체 범위에 대한 fallback */}
            <Route path={fallbackRoute.path} element={<FallbackComponent  />} />
        </Routes>
    );
};

export default AppRoutes
