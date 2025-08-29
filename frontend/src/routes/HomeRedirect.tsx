import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const HomeRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isTrial } = useUser(); 
  // isAuthenticated: user/admin만 true
  // isTrial: guest일 때 true

  useEffect(() => {
    if (isAuthenticated || isTrial) {
      // user, admin, guest 모두 "/"로
      navigate("/");
    } else {
      // role === "none" → 로그인 필요
      navigate("/login");
    }
  }, [isAuthenticated, isTrial, navigate]);

  return null;
};

export default HomeRedirect;
