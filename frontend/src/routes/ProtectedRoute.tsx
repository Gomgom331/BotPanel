
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = "user" }) => {
  const { isAuthenticated, role } = useUser();

  // 사용자가 인증되지 않으면 로그인 페이지로 전달하기
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 관리자가 아닐시 권한 없음 페이지로 전달
  if (requiredRole === "admin" && role !== "admin") return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;