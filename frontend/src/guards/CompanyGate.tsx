import { useUser } from "../hooks/useUser";
import { useParams, Navigate } from "react-router-dom";

function CompanyGate({ needGroupRoles, children }: { needGroupRoles?: ("owner"|"admin"|"member")[] | "owner"|"admin"|"member", children: React.ReactNode }) {
    const { slug } = useParams();
    const { role, loading, isMemberOfSlug, inGroupHasRole } = useUser();

    if (loading) return null;
    // 유저 확인
    if (role !== "user") return <Navigate to="/403" replace />;
    // 멤버십 확인
    if (!isMemberOfSlug(slug)) return <Navigate to="/403" replace />;

    if (needGroupRoles && !inGroupHasRole(slug, needGroupRoles)) {
    return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
}

export default CompanyGate;