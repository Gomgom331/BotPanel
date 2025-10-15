// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../hooks/useUser";

// /**
//  * 홈 엔트리에서 persona에 따라 리다이렉트
//  * - none   → /login
//  * - guest  → /guest (없으면 "/")
//  * - user   → / (일반 홈)
//  * - admin → /admin (없으면 "/")
//  */

// export default function HomeRedirect() {
//   const navigate = useNavigate();
//   const { role, loading } = useUser();

//   useEffect(() => {
//     if (loading) return;
//     if (role === "none") {
//       navigate("/login", { replace: true });

//     } else if (role === "admin") {
//       navigate("/admin", { replace: true });
      
//     } else if (role === "guest") {
//       navigate("/guest", { replace: true }); // 페이지 없으면 "/"로 바꿔도 됨

//     } else {
//       navigate("/", { replace: true });
//     }

//   }, [role, loading, navigate]);

//   return null;
// }

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

function pickPrimarySlug(groups: { slug?: string }[]) {
  const last = localStorage.getItem("lastSlug");
  if (last && groups?.some(g => g.slug === last)) return last;
  return groups?.find(g => !!g.slug)?.slug ?? null;
}

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

      // role === "user"
      const slug = pickPrimarySlug(groups);
      navigate(slug ? `/${slug}/dashboard` : "/403", { replace: true });
    })();

    return () => { alive = false; };
  }, [role, loading, groups, navigate]);

  return null;
}

export default HomeRedirect