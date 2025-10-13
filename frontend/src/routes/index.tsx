// // routes/index.tsx
// import { Routes, Route } from "react-router-dom";
// import { publicRoutes, protectedRoutes, fallbackRoute } from "./routeConfig";
// import ProtectedRoute from "./ProtectedRoute";

// const AppRoutes = () => {
//     const FallbackComponent = fallbackRoute.component;

//     return (
//     <Routes>
//         {/* 공개 라우트 (roles로 접근 제어) */}
//         {publicRoutes.map(({ path, component: Component, roles }) => (
//             <Route
//                 key={path}
//                 path={path}
//                 element={
//                 <ProtectedRoute roles={roles}>
//                     <Component />
//                 </ProtectedRoute>
//                 }
//             />
//         ))}

//         {/* 보호 라우트 (roles로 접근 제어) */}
//         {protectedRoutes.map(({ path, component: Component, roles }) => (
//             <Route
//                 key={path}
//                 path={path}
//                 element={
//                 <ProtectedRoute roles={roles}>
//                     <Component />
//                 </ProtectedRoute>
//                 }
//             />
//         ))}

//         {/* 전체 범위 폴백 */}
//         <Route path={fallbackRoute.path} element={<FallbackComponent />} />
//     </Routes>
//     );
// };

// export default AppRoutes;


// routes/index.tsx
import { Routes, Route } from "react-router-dom";
import { publicRoutes, protectedRoutes, fallbackRoute } from "./routeConfig";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    const Fallback = fallbackRoute.component;

    return (
    <Routes>
        {/* 공개 라우트도 roles로 제어(예: 로그인 페이지는 ["none"]만 허용) */}
        {publicRoutes.map(({ path, component: Component, roles, needScopes, redirectTo }) => (
        <Route
            key={path}
            path={path}
            element={
            <ProtectedRoute roles={roles} needScopes={needScopes} redirectTo={redirectTo}>
                <Component />
            </ProtectedRoute>
            }
        />
        ))}
        {/* 보호 라우트: 로그인/권한 필수 */}
        {protectedRoutes.map(({ path, component: Component, roles, needScopes, redirectTo }) => (
        <Route
            key={path}
            path={path}
            element={
            <ProtectedRoute roles={roles} needScopes={needScopes} redirectTo={redirectTo}>
                <Component />
            </ProtectedRoute>
            }
        />
        ))}

        {/* 폴백 */}
        <Route path={fallbackRoute.path} element={<Fallback />} />
    </Routes>
    );
};

export default AppRoutes;
