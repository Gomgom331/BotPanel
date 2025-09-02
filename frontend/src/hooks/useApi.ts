// 모든 api 로직 관리
import { useCallback, useMemo } from "react";
import type { AxiosRequestConfig, Method } from "axios";
import { djangoClient, fastapiClient } from "../api/clients";

import { API_ENDPOINTS, type EndpointKey } from "../constants/apiEndpoints";

// 타입 정의
type SendOptions = {
    method?: Method;
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    config?: AxiosRequestConfig;
};

// 옵션 객체인지(=정식 호출) 혹은 숏핸드(payload만)인지 구분
function isSendOptions(arg: any): arg is SendOptions {
    return (
        arg &&
        typeof arg === "object" &&
        ("method" in arg ||
        "data" in arg ||
        "params" in arg ||
        "headers" in arg ||
        "config" in arg)
    );
}

// baseURL의 끝 슬래시만 제거 
function joinUrl(base: string | undefined, path: string) {
    const b = (base || "").replace(/\/+$/, "");
    const p = (path || "").replace(/^\/+/, "");
    return `${b}/${p}`;
}

// 엔드포인트로만 계산하기
export function useApi(endpointKey: EndpointKey) {
    const endpoint = API_ENDPOINTS[endpointKey];
    
    const client = useMemo(() => 
        endpoint.source === "django" ? djangoClient : fastapiClient, 
        [endpoint.source]
    );
    
    const url = useMemo(() => 
        joinUrl(client.defaults.baseURL, endpoint.path), 
        [client, endpoint.path]
    );

    const send = useCallback(
        async <T = any>(arg?: SendOptions | any): Promise<T> => {
            const opts: SendOptions = isSendOptions(arg) ? arg : { method: "post", data: arg };
            const {
                method = "post",
                data,
                params,
                headers: extraHeaders,
                config,
            } = opts;

            const methodLower = String(method).toLowerCase();
            const computedHeaders: Record<string, string> = { ...(extraHeaders || {}) };
            if (methodLower !== "get") {
                computedHeaders["Content-Type"] ||= "application/json";
            }

            const res = await client.request<T>({
                url,
                method,
                data,
                params,
                headers: computedHeaders,
                ...(config || {}),
            });
            return res.data as T;
        },
        [client, url]
    );

    return send;
}
