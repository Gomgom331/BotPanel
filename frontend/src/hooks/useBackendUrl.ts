// 계산 비용이 큰 값을 메모이제이션하여 성능을 최적화 해줌
// => 성능 최적화
// src/hooks/useBackendUrl.ts
import { useCallback, useMemo } from "react";
import type { AxiosRequestConfig, Method } from "axios";
import { djangoClient, fastapiClient } from "../api/clients";

type Source = "django" | "fastapi";

interface UseBackendUrlProps {
    source: Source;
    parameterPath: string; // 예) "/auth/login/"
}

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

export function useBackendSenderWithCSRF({ source, parameterPath }: UseBackendUrlProps) {
  // 분기: django ↔ fastapi
    const client = useMemo(() => (source === "django" ? djangoClient : fastapiClient), [source]);
    const url = useMemo(() => joinUrl(client.defaults.baseURL, parameterPath), [client, parameterPath]);

const send = useCallback(
    async <T = any>(arg?: SendOptions | any): Promise<T> => {
      // 숏핸드({ text: ... }) → { method:"post", data: ... }로 자동 변환
        const opts: SendOptions = isSendOptions(arg) ? arg : { method: "post", data: arg };
        const {
        method = "post",
        data,
        params,
        headers: extraHeaders,
        config,
    } = opts;

      // GET에는 굳이 Content-Type 넣지 않아 CORS preflight 줄임
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

