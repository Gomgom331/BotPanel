// import { useCallback } from "react";
// import axios from "axios";
// // CSRF 토큰 불러오기
// import { getCookie } from "../utils/getCookie";


// // 환경변수 가져오기
// const FASTAPI_URL = process.env.REACT_APP_API_FASTAPI_URL;
// const DJANGO_URL = process.env.REACT_APP_API_DJANGO_URL;

// // 타입 오류를 없애기 위해 먼저 체크
// if (!FASTAPI_URL || !DJANGO_URL) {
//     throw new Error("필수 환경변수 누락: FASTAPI_URL 또는 DJANGO_URL");
// }

// // 호스트 서버
// interface UseBackendUrlProps {
//     source: "fastapi" | "django"; // 필요시 확장 가능
//     parameterPath: string; // ex) "/users/1"
// }

// // 호스트 맵핑
// const HOST_MAP: Record<"fastapi" | "django", string> = {
//     fastapi: FASTAPI_URL,
//     django: DJANGO_URL,
// };

// // 실행하기
// export function useBackendSenderWithCSRF({ source, parameterPath }: UseBackendUrlProps) {
    
//     const host = HOST_MAP[source];

//     // 호스트가 없을시 에러문 호출
//     if(!host){
//         console.error(`알 수 없는 source: '${source}'. 'fastapi' 또는 'django'만 허용 됩니다.`);
//         throw new Error(`Invalid source: '${source}'`);
//     }

//     const fullUrl = `${host}${parameterPath}`;
//     // 전송
//     const send = useCallback(
//         async (data: any) => {

//             console.log("host",host)
//             console.log('22')
//             console.log('data',data)

//             // url 조합
//             try {
//                 const response = await axios.post(fullUrl, data, {
//                     withCredentials: true, // 쿠키 전송
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 });
//                 console.log("성공")
//                 return response.data;
//             } catch (error) {
//                 console.error("전송 실패 : ", error);
//                 throw error;
//             }
//         },
//         [fullUrl]
//     );

//     return send
// }

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

