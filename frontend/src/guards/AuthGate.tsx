// role 1분기 확인 gate
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser"

// 1차 분기점
type PersonaRole = "none" | "guest" | "user" | "admin";

export default function AuthGate({
    roles,
    needScopes,
    redirectTo = "/403",
    children,
} : {
    roles: PersonaRole[];                // 분기1: 전역 역할 요구
    needScopes?: string[] | string;
    redirectTo?: string;
    children: React.ReactNode;
}) {
    const { role, loading, hasAnyScope } = useUser();
    const location = useLocation();

    if(loading) return null
    // role 확인
    if (!roles.includes(role)) {
    if (role === "none") {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
        return <Navigate to={redirectTo} replace />;
    }

    // 권한 확인
    if (needScopes){
        const ok = hasAnyScope(needScopes);
        if(!ok) return <Navigate to="/403" replace />
    }

    return <>{children}</>;
}