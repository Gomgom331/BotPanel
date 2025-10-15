// 호스트 서버 맵핑 각 전용 axios 인스턴스, 인터셉터로 정책을 분리해서 호출
import axios, { AxiosInstance, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "../utils/getCookie";

// env
const FASTAPI_URL = process.env.REACT_APP_API_FASTAPI_URL!;
const DJANGO_URL  = process.env.REACT_APP_API_DJANGO_URL!;
if (!FASTAPI_URL || !DJANGO_URL) {
    throw new Error("필수 환경변수 누락: FASTAPI_URL 또는 DJANGO_URL");
}

// 경로 유틸: config.url이 절대/상대 모두 안전하게 pathname 추출
function getPath(config: InternalAxiosRequestConfig): string {
    try {
        return new URL(config.url!, config.baseURL || window.location.origin).pathname;
    } catch {
        return config.url || "";
    }
}

// CSRF는 unsafe 메서드에만
const NEED_CSRF = new Set(["post", "put", "patch", "delete"]);

// 리프레시 엔드포인트(여긴 인터셉터에서 스킵)
const REFRESH_PATH = "/api/auth/refresh-cookie/";
const SKIP_REFRESH_PATHS = new Set<string>([
    REFRESH_PATH,
    "/api/auth/login/",
    "/api/auth/logout/",
]);

// ----------------------------------------------
// Django 클라이언트 (일반 요청용)
// ----------------------------------------------
export const djangoClient: AxiosInstance = axios.create({
    baseURL: DJANGO_URL,
    withCredentials: true, // 쿠키 전송
});

// 요청 인터셉터: CSRF 헤더 주입
djangoClient.interceptors.request.use((config) => {
    const method = (config.method || "get").toLowerCase();
    if (NEED_CSRF.has(method)) {
    const csrf = getCookie("csrftoken"); // CSRF_COOKIE_HTTPONLY=False 기준
    if (csrf) {
        (config.headers ??= new AxiosHeaders()).set("X-CSRFToken", csrf);
    }
    }
    return config;
});

// ----------------------------------------------
// 리프레시용 "깨끗한" 클라이언트 (인터셉터 없음)
//  - 무한 루프 방지: 이 인스턴스로만 /auth/refresh-cookie/ 호출
// ----------------------------------------------
const refreshClient = axios.create({
    baseURL: DJANGO_URL,
    withCredentials: true,
});

// 필요 시 CSRF 넣기(서버 설정에 따라)
function refreshCall() {
    const csrf = getCookie("csrftoken");
    return refreshClient.post(
        REFRESH_PATH,
        {},
        csrf ? { headers: { "X-CSRFToken": csrf } } : undefined
    );
}

// 동시 401 딥듀프용
let refreshPromise: Promise<void> | null = null;

// 응답 인터셉터: 401 처리(1회 재시도 + 리프레시)
djangoClient.interceptors.response.use(
    (res) => res,
    async (err: any) => {
    const original = err.config as InternalAxiosRequestConfig & { _retried?: boolean };
    const status = err?.response?.status;
    const path = original ? getPath(original) : "";

    // 401이 아니면 그대로 에러 전달
    // if (status !== 401) return Promise.reject(err);
    if (status !== 401){
        console.log("에러아님");
        return Promise.reject(err);
    }
    
    // 리프레시 대상이 아닌 경로는 그대로 실패(무한루프 방지)
    if (!original || SKIP_REFRESH_PATHS.has(path)) {
        return Promise.reject(err);
    }

    // 이미 재시도한 요청은 더 이상 리프레시하지 않음
    if (original._retried) {
        return Promise.reject(err);
    }
    original._retried = true;

    try {
        // 진행 중인 리프레시가 있으면 기다리고, 없으면 새로 시작
        if (!refreshPromise) {
        refreshPromise = (async () => {
            await refreshCall(); // 실패 시 throw
        })().finally(() => {
            refreshPromise = null; // 완료/실패 후 해제
        });
        }
        await refreshPromise;

        // 토큰/쿠키 갱신 성공 → 원래 요청 재시도
        return djangoClient(original);
    } catch (refreshErr) {
        // 리프레시 실패 → 세션 종료 처리(선택: 로컬스토리지 정리/로그인 페이지 이동)
        try {
        localStorage.removeItem("user");
        window.dispatchEvent(new StorageEvent("storage", { key: "user" }));
        } catch {}
        return Promise.reject(refreshErr);
    }
    }
);

// ----------------------------------------------
// FastAPI 클라이언트 (LLM/외부 API 프록시: 쿠키/CSRF 불필요)
// ----------------------------------------------
export const fastapiClient: AxiosInstance = axios.create({
    baseURL: FASTAPI_URL,
    withCredentials: false,
    timeout: 60_000, // LLM 호출은 여유 시간
});

fastapiClient.interceptors.request.use((config) => {
    (config.headers ??= new AxiosHeaders()).set("X-Client", "web");
    return config;
});
