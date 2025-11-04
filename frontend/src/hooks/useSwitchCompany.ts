import { useNavigate } from "react-router-dom";
import { useApi } from "./useApi"
import { useUser } from "./useUser";

// 유저 회사별
export function useSwitchCompany(){
    const navigate = useNavigate(); // 
    const setLast = useApi("USER_SET_LAST_GROUP"); 
    const { refresh, isMemberOfSlug } = useUser(); //

    async function switchTo(slug: string){
        // 멤버십 가드 (선택)
        if (!isMemberOfSlug(slug)) return; // 방어

        // 라우팅 (ux 우선)
        localStorage.setItem("lastSlug", slug);
        navigate(`/${slug}`, { replace: true });

        //서버 갱신
        try{
            await setLast({ method: "get", pathParams: {slug : slug} });
        } catch(e){
            console.log("api error : ",e);
        }

        // me를 다시 불러와 동기화
        try { await refresh(); } catch {}
    }
    return { switchTo };
}