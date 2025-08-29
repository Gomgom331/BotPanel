
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

/**
 * ProtectedRoute
 * - 인증 필수
 * - requiredRole="user"  : user/admin 모두 허용
 * - requiredRole="admin" : admin만 허용
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user"; // 어드민 유저 허용
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = "user" }) => {
  const { isAuthenticated, role } = useUser(); // 권한 체크

  // 사용자가 인증되지 않으면 로그인 페이지로 전달하기
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 권한 계산
  const canAccess = 
    requiredRole === "user"
    ? role === "user" || role === "admin"
    : role === "admin";

  if (!canAccess) return <Navigate to="/" replace />
  return <>{children}</>;
};

export default ProtectedRoute;