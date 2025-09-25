// 로그인 로그아웃 (사용자 인증
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "./useApi";
import type { ApiResponse, ApiFail } from "../api/types";


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

// 타입지정
type LoginForm = { username: string; password: string };
type LoginFields = "username" | "password";


export function useAuthActions(){
    const navigate = useNavigate();
    // loading 상태
    const [loading, setLoading] = useState(false);

    // api
    const sendLogin = useApi("AUTH_LOGIN"); //로그인
    const sendLogout = useApi("AUTH_LOGOUT"); //로그아웃
    const fetchMe = useApi("USER_ME"); // 내정보


    // 로그인 이벤트 ----------------------------------------------------------------------------
    const login = useCallback(
        async (form: LoginForm): Promise<ApiResponse<void, LoginFields>> => {
            setLoading(true);
            console.log('form',form)
            try {
                console.log('폼확인용1')
                // 서버는 성공/실패를 ApiResponse 규격으로 반환
                const loginRes = await sendLogin<ApiResponse<void, LoginFields>>({
                    method: "post",
                    data: form,
                });
                console.log('폼확인용2');
                // 실패면 그대로 페이지에서 분기 처리(formError or fieldErrors)
                if (!loginRes?.success) return loginRes as ApiFail<LoginFields>;

                console.log('폼확인용3');
                // 성공 → 내 정보 가져오기 (기존 API 스키마 유지)
                const meRes = await fetchMe<{ success: boolean; user?: any; me?: any }>({
                    method: "get",
                });
                if (!meRes?.success) {
                    console.log('확인용33');
                    return { success: false, formError: "SERVER_ERROR"};
                }
                console.log('폼확인용44');
                // 스냅샷/이동
                applyUserSnapshot(meRes);
                navigate("/", { replace: true });
                return { success: true };
            } catch {
                // 예기치 못한 오류는 전역 폼 에러로
                console.log('확인용4455')
                return { success: false, formError: "SERVER_ERROR"};
            } finally {
                setLoading(false);
            }
        },
        [sendLogin, fetchMe, navigate]
    );

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