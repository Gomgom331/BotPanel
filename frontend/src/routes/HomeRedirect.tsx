import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동, 히스토리 조작
import { useUser } from "../hooks/useUser";

const HomeRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(()=>{
    if (isAuthenticated) navigate("/");
    else navigate("/login");
  }, [isAuthenticated, navigate]);

  return null;
};

export default HomeRedirect;

