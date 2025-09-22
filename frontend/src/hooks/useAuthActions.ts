// 로그인 로그아웃 (사용자 인증
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "./useApi";

type LoginForm = { username: string; password: string };



// 로컬스냅샷 유틸
function applyUserSnapshot( input: any ){
    try{
        const me = input?.me ?? input?.user ?? input;
        const persona = me?.persona ?? ((me?.groups?.length ?? 0) > 0 ? "user" : "guest");
        const snapshot = {
            role: persona,              // "guest" | "user" | "admin"
            scopes: me?.scopes ?? [],
            groups: me?.groups ?? [],
        };
        localStorage.setItem("user", JSON.stringify(snapshot));
        // 다른 탭 동기화
        window.dispatchEvent(new StorageEvent("storage", { key: "user" }));
    } catch{}
}


export function useAuthActions(){
    const navigate = useNavigate();
    // 로딩
    const [loading, setLoading] = useState(false);

    // 인증
    const sendLogin = useApi("AUTH_LOGIN"); //로그인
    const sendLogout = useApi("AUTH_LOGOUT"); //로그아웃
    const fetchMe = useApi("USER_ME"); // 내정보


    // 로그인 이벤트 ----------------------------------------------------------------------------
    const login = useCallback(async (form: LoginForm) => {
        // 로딩 시작
        setLoading(true);

        // 로그인 시도
        try{
            const loginRes = await sendLogin<{ success: boolean; error?: string }>({
                method: "post",
                data: form,
            });
            if (!loginRes?.success) {
                // 서버에서 error, formError, status 등 다양한 에러 정보를 받을 수 있음
                // error: 특정 필드 에러 (예: username, password)
                // formError: 폼 전체에 대한 에러 (예: 서버 오류, 비활성화 등)
                const errorMsg = loginRes?.error || loginRes?.formError || "LOGIN_FAILED";
                // 에러 정보를 객체로 반환하여 컴포넌트에서 분기 처리 가능
                // throw {
                //     error: loginRes?.error,         // 필드 에러 (예: REQUIRED_USERNAME)
                //     formError: loginRes?.formError, // 폼 에러 (예: SERVER_ERROR)
                //     status: loginRes?.status,       // HTTP 상태 코드
                //     message: errorMsg               // 최종 에러 메시지
                // };
            }
            
            const meRes = await fetchMe<{ success: boolean; user?: any; me?: any }>({ method: "get" });
            // 내정보 조회 실패시 에러
            if (!meRes?.success) throw new Error("CANNOT_FETCH_ME");

            // 유저 정보 저장
            applyUserSnapshot(meRes);
            navigate("/", {replace: true});
            return true;
        
        // 로그인 에러
        } catch (e){
            console.error("로그인 에러 : ", e);
            return false;
        // 작업 완료시
        } finally {
            setLoading(false);
        }
    }, 
    //""
    // 함수(콜백)를 메모이제이션 하기 위한 의존성 배열
    // login 함수를 매 렌더링마다 새로 만들지 않고, 의존성이 바뀌지 않는 한 같은 함수 참조를 재사용
    //""
    [sendLogin, fetchMe, navigate]);

    // 로그아웃 이벤트----------------------------------------------------------------------------
    const logout = useCallback(async () => {
        // 로딩 시작
        setLoading(true);

        // 로그아웃 시도
        try{
            // 서버 쿠키 삭제
            await sendLogout({ method: "post" });
        }catch(e){
            console.warn("[logout] ignored", e);
        }finally{
            // 스토리지 유저 정보 삭제
            localStorage.removeItem("user");
            window.dispatchEvent(new StorageEvent("storage", { key: "user" }));

            // 로딩 종료
            setLoading(false);
            
            // 로그인 페이지 이동
            window.location.href = "/login";
        }
    }, [sendLogout]);

    return { login, logout, loading };
}