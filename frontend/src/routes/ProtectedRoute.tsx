// routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

type AllowRole = "none" | "guest" | "user" | "admin";

export default function ProtectedRoute({
  children, roles,
}: { children: React.ReactNode; roles?: AllowRole[] }) {
  const { role } = useUser(); // "none" | "guest" | "user" | "admin"

  if (roles && !roles.includes(role)) {
    // none이면 로그인으로, 그 외엔 홈으로
    return role === "none" ? <Navigate to="/login" replace /> : <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
