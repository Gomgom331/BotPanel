// 호스트 서버 맵핑 각 전용  axios 인스터스, 인터셉터로 정책을 분리해서 호출
import axios, { AxiosInstance, AxiosHeaders  } from "axios"
import { getCookie } from "../utils/getCookie"

// env
const FASTAPI_URL = process.env.REACT_APP_API_FASTAPI_URL;
const DJANGO_URL = process.env.REACT_APP_API_DJANGO_URL;

// 제대로 불러왔는지 체크
if (!FASTAPI_URL || !DJANGO_URL) {
    throw new Error("필수 환경변수 누락: FASTAPI_URL 또는 DJANGO_URL");
}

// get 은 csrf 대상이 아니라 제외 (unsafe 메서드에만 토큰 검증)
const NEED_CSRF = new Set(["post", "put", "patch", "delete"]);


// Django ------------------------------------------------
export const djangoClient: AxiosInstance = axios.create({
    baseURL: DJANGO_URL,
    withCredentials: true, // 쿠키전송
})

// HTTP 요청이 서버로 전송되기 전에 수정
djangoClient.interceptors.request.use((config) => {
    // 소문자로 변환
    const method = (config.method || "get").toLowerCase();
    if (NEED_CSRF.has(method)) {
        const csrf = getCookie("csrftoken"); // CSRF_COOKIE_HTTPONLY=False 기준
        // 토큰 추가
        if (csrf) {
            (config.headers ??= new AxiosHeaders()).set("X-CSRFToken", csrf);
        }
    }
    return config;
});

// 서버로부터 응답을 받은 후, 전달되기 전에 처리
djangoClient.interceptors.response.use(
    (res) => res,
    async (err: any) => {
        const original = err.config;
        const status = err?.response?.status;
        // 에러를 반환하여 무한루프 방지 (자동 토큰 갱신)
        if (status === 401 && !original?._retried){
            original._retried = true;
            try{
                await djangoClient.post("/auth/refresh-cookie/");
                return djangoClient(original);
            } catch (e) {
                // refresh 실패시 에러
                return Promise.reject(e);
            }
        }
        return Promise.reject(err);
    }
);


// FastApi ------------------------------------------------
// FastAPI: LLM/외부 API 프록시 (쿠키/CSRF 불필요)
export const fastapiClient: AxiosInstance = axios.create({
    baseURL: FASTAPI_URL,
    withCredentials: false, // 쿠키를 보내지 않음
    timeout: 60_000, // LLM 호출시간이 길 수가 있어 여유롭게 시간 설정 60,000(구분자)
});

// HTTP 요청이 서버로 전송되기 전에 수정
fastapiClient.interceptors.request.use((config) => {
    (config.headers ??= new AxiosHeaders()).set("X-Client", "web");
    return config;
});
