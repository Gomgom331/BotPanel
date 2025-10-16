// 모든 api 로직 관리
// ----------------------------------------------------
// api 서버 요청 (토큰값 ,데이터 등 같이 전송하는 역할)
// 엔드포인트 key 값만 전달 받아 api를 호출해주는 hook
// ----------------------------------------------------
import { useCallback, useMemo } from "react";
import type { AxiosRequestConfig, Method } from "axios";
import { djangoClient, fastapiClient } from "../api/clients";
import { API_ENDPOINTS, type EndpointKey } from "../constants/apiEndpoints";
import { useParams } from "react-router-dom";



// 타입 정의
type SendOptions = {
    method?: Method;
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    config?: AxiosRequestConfig;
    pathParams?: Record<string, string | number | undefined>; // ← 추가: 동적 경로 치환용
};

function isSendOptions(arg: any): arg is SendOptions {
    return arg && typeof arg === "object" && (
        "method" in arg || "data" in arg || "params" in arg ||
        "headers" in arg || "config" in arg || "pathParams" in arg
    );
}

// baseURL의 끝 슬래시만 제거
function joinUrl(base: string | undefined, path: string) {
    const b = (base || "").replace(/\/+$/, "");
    const p = (path || "").replace(/^\/+/, "");
    return `${b}/${p}`;
}

// :param 치환
function applyPathParams(path: string, params?: Record<string, string | number | undefined>) {
    if (!params) return path;
    return path.replace(/:([A-Za-z0-9_]+)/g, (_, k) =>
        params[k] !== undefined ? String(params[k]) : `:${k}`
    );
}

// Django CSRF (unsafe 메서드에만)
const CSRF_SAFE = /^(get|head|options|trace)$/i;
    function getCookie(name: string) {
        if (typeof document === "undefined") return "";
            const m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
        return m ? decodeURIComponent(m[2]) : "";
    }

    // 엔드포인트로만 계산하기 (+ slug 치환 지원)
    export function useApi(endpointKey: EndpointKey) {
    const endpoint = API_ENDPOINTS[endpointKey];
    const { slug } = useParams(); // 필요 시 자동 치환에 사용

    const client = useMemo(
        () => (endpoint.source === "django" ? djangoClient : fastapiClient),
        [endpoint.source]
    );

    // 원본 path를 보관 (실제 url은 send 시점에 pathParams로 치환)
    const rawPath = endpoint.path;

    const send = useCallback(
    async <T = any>(arg?: SendOptions | any): Promise<T> => {
        const opts: SendOptions = isSendOptions(arg) ? arg : { data: arg };

        // 기본 메서드: 데이터가 없으면 GET, 있으면 POST
        const pickedMethod: Method =
        (opts.method as Method) ??
        ((opts.data === undefined || opts.data === null) ? "get" : "post");

        const methodLower = String(pickedMethod).toLowerCase();

        // pathParams 병합: 옵션 > URL의 :slug 자동치환
        const mergedPathParams = {
            slug,           // URL에 slug가 있으면 우선 자동 치환
            ...(opts.pathParams || {}), // 호출부에서 명시하면 덮어씀
        };

        const finalPath = applyPathParams(rawPath, mergedPathParams);
        const url = joinUrl(client.defaults.baseURL, finalPath);

        const computedHeaders: Record<string, string> = { ...(opts.headers || {}) };

        if (methodLower !== "get") {
        computedHeaders["Content-Type"] ||= "application/json";
        }

        // Django라면 unsafe 메서드에 CSRF 헤더 부착
        if (endpoint.source === "django" && !CSRF_SAFE.test(methodLower)) {
            const token = getCookie("csrftoken");
        if (token) computedHeaders["X-CSRFToken"] = token;
        }

        const res = await client.request<T>({
            url,
            method: pickedMethod,
            data: opts.data,
            params: opts.params,
            headers: computedHeaders,
            withCredentials: true, // 쿠키 전송 보장
            ...(opts.config || {}),
        });

        return res.data as T;
    },[client, rawPath, endpoint.source, slug]
    );

    return send;
}
