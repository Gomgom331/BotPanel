import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

/**
 * 홈 엔트리에서 persona에 따라 리다이렉트
 * - none   → /login
 * - guest  → /guest (없으면 "/")
 * - user   → / (일반 홈)
 * - admin → /admin (없으면 "/")
 */

export default function HomeRedirect() {
  const navigate = useNavigate();
  const { role, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (role === "none") {
      navigate("/login", { replace: true });

    } else if (role === "admin") {
      navigate("/admin", { replace: true });
      
    } else if (role === "guest") {
      navigate("/guest", { replace: true }); // 페이지 없으면 "/"로 바꿔도 됨

    } else {
      navigate("/", { replace: true });
    }

  }, [role, loading, navigate]);

  return null;
}