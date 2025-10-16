// role user 이면 2분기 (회사) 확인
// import { Navigate, useParams } from "react-router-dom";
// import { useUser } from "../hooks/useUser";

// // 결제자 < 관리자 < 일반사용자
// type GroupRoleInGroup = "owner" | "admin" | "member;"

// export default function CompanyGate({
//     needGroupRoles,
//     children,
// } : {
//     needGroupRoles?:  GroupRoleInGroup[] | GroupRoleInGroup;
//     children: React.ReactNode;
// }) {
//     const { slug } = useParams();
//     const { role, loading, inAnyGroup, me} = useUser();

//     if (loading) return null;

//     // 유저가 아니거나 slug가 없을 경우 반환
//     if (role !== "user") return <Navigate to="/403" replace />;
//     if (!slug) return <Navigate to="/403" replace />;

//     // slug, 그룹이 없을 경우 반환
//     const isMember = inAnyGroup(slug, "slug");
//     if (!isMember) return <Navigate to="/403" replace />

//     // 권한 확인
//     if (needGroupRoles) {
//         const wants = Array.isArray(needGroupRoles) ? needGroupRoles : [needGroupRoles]
//         const myRole = me?.groups?.find(g => g.slug === slug)?.role_in_group ?? null;
//         if (!myRole || !wants.includes(myRole)) return <Navigate to="/403" replace />;
//     }

//     localStorage.setItem("lastSlug", slug);
//     return <>{children}</>;
// }

import { useUser } from "../hooks/useUser";
import { useParams, Navigate } from "react-router-dom";

function CompanyGate({ needGroupRoles, children }: { needGroupRoles?: ("owner"|"admin"|"member")[] | "owner"|"admin"|"member", children: React.ReactNode }) {
    const { slug } = useParams();
    const { role, loading, isMemberOfSlug, inGroupHasRole } = useUser();

    if (loading) return null;
    if (role !== "user") return <Navigate to="/403" replace />;
    if (!isMemberOfSlug(slug)) return <Navigate to="/403" replace />;

    if (needGroupRoles && !inGroupHasRole(slug, needGroupRoles)) {
    return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
}

export default CompanyGate;