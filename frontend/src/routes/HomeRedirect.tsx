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
// function pickPrimarySlug(groups: { slug?: string }[]) {
//   const last = localStorage.getItem("lastSlug");
//   if (last && groups?.some(g => g.slug === last)) return last;
//   return groups?.find(g => !!g.slug)?.slug ?? null;
// }

function pickPrimarySlug(
  me: ReturnType<typeof useUser >["me"],
  groups: { slug? : string }[]
){
  
  // 서버가 준 마지막 활성화 그룹
  const fromServer = me?.last_viewed_group?.slug;
  if(fromServer && groups?.some(g => g.slug === fromServer )) return fromServer

  // 로컬 마지막 slug (여전히 소속인지 검증)
  const last = localStorage.getItem("lastSlug");
  if (last && groups?.some(g => g.slug === last)) return last

  // 첫번째 소속 그룸
  return groups?.find(g=> !!g.slug)?.slug?? null;
}



// 1분기 role 체크하기
const HomeRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { role, loading, me, groups } = useUser();

  useEffect(() => {
    if (loading) return

    // 1분기 분기처리
    if (role === "none")  { navigate("/login", { replace: true }); return; }
    if (role === "guest") { navigate("/guest", { replace: true }); return; }
    if (role === "admin") { navigate("/admin", { replace: true }); return; }

    const slug = pickPrimarySlug(me, groups);

    // slug가 있을시 
    if (slug) {
      localStorage.setItem("lastSlug", slug);
      navigate(`/${slug}` , {replace: true});
    } else{
      navigate("/403", {replace: true});
    }

  }, [role, loading, me, groups, navigate]);

  return null;
}

export default HomeRedirect