import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

// ---------------------------------------------------
// useNavigate => 절대 경로로 이동시켜줌
// - replace : true (히스토리 스택에 추가하지 않고 현재 항목을 교체)
// - state: navigate('/user', { state: { userId: 123, name: 'John' } }); 다음페이지에 정보 전달

// 받는 쪽에서는 useLocation으로 접근
// const location = useLocation();
// console.log(location.state); => { userId: 123, name: 'John' }
// ---------------------------------------------------


// 마지막으로 입장한 그룹이 있으면 불러오기
function pickPrimarySlug(groups: { slug?: string }[]) {
  const last = localStorage.getItem("lastSlug");
  if (last && groups?.some(g => g.slug === last)) return last;
  return groups?.find(g => !!g.slug)?.slug ?? null;
}


// 1분기 role 체크하기
const HomeRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { role, loading, groups } = useUser();

  useEffect(() => {

    let alive = true;

    (async () => {
      if (!alive || loading) return;

      // 분기점1
      if (role === "none") { navigate("/login", { replace: true }); return; }
      if (role === "guest") { navigate("/guest", { replace: true }); return; }
      if (role === "admin") { navigate("/admin", { replace: true }); return; }

      const slug = pickPrimarySlug(groups);
      navigate(slug ? `/${slug}` : "/403", { replace: true });
    })();

    return () => { alive = false; };
  }, [role, loading, groups, navigate]);

  return null;
}

export default HomeRedirect