import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackendSenderWithCSRF } from "./useBackendUrl";

type LoginForm = { username: string; password: string };

export function useAuthActions(){
    const navigate = useNavigate();
    // 로딩
    const [loading, setLoading] = useState(false);

    // 로그인 요청 훅
    const sendLogin = useBackendSenderWithCSRF({
        source: "django",
        parameterPath: "/auth/login/",
    })
    // 로그아웃 요청 훅
    const sendLogout = useBackendSenderWithCSRF({
        source: "django",
        parameterPath: "/auth/logout/",
    })
    // 내정보 요청 훅
    const fetchMe = useBackendSenderWithCSRF({
        source: "django",
        parameterPath: "/user/me/",
    })

    // 공통 유저 스냅샷 저장 브로드 퀘스트 (세션 유지)
    const applyUserSnapshot = (raw: any) => {

        const u = raw?.user ?? raw;

        if (!u || typeof u !== "object") {
            console.error("[applyUserSnapshot] invalid payload:", raw);
            return;
        }

        localStorage.setItem(
            "user",
            JSON.stringify({
                username: u.username,
                role: u.role ?? "user",
                full_name: u.full_name ?? "",
                email: u.email ?? "",
                company: u.company ?? "",
                position: u.position ?? "",
                is_staff: u.is_staff ?? false,
            })
        );
        window.dispatchEvent(new StorageEvent("storage", {key: "user"}));
    };

    // 로그인 이벤트 --------------------------------------
    const login = useCallback(async (form: LoginForm) => {
        // 로딩 시작
        setLoading(true);

        // 로그인 시도
        try{
            const loginRes = await sendLogin({ method: "post", data: form }); 
            // 기존 api.post 실패시 에러
            if (!loginRes?.success) throw new Error(loginRes?.error || "LOGIN_FAILED");
            
            const meRes = await fetchMe({ method: "get" });
            // 내정보 조회 실패시 에러
            if (!meRes?.success) throw new Error("CANNOT_FETCH_ME");

            // 유저 정보 저장
            applyUserSnapshot(meRes.user);
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

    // 로그아웃 이벤트--------------------------------------
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