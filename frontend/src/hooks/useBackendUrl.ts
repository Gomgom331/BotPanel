import { useCallback } from "react";
import axios from "axios";
// CSRF 토큰 불러오기
import { getCookie } from "../utils/getCookie";


// 환경변수 가져오기
const FASTAPI_URL = process.env.REACT_APP_API_FASTAPI_URL;
const DJANGO_URL = process.env.REACT_APP_API_DJANGO_URL;


// 타입 오류를 없애기 위해 먼저 체크
if (!FASTAPI_URL || !DJANGO_URL) {
    throw new Error("필수 환경변수 누락: FASTAPI_URL 또는 DJANGO_URL");
}

// 호스트 서버
interface UseBackendUrlProps {
    source: "fastapi" | "django"; // 필요시 확장 가능
    parameterPath: string; // ex) "/users/1"
}

// 호스트 맵핑
const HOST_MAP: Record<"fastapi" | "django", string> = {
    fastapi: FASTAPI_URL,
    django: DJANGO_URL,
};

// 실행하기
export function useBackendSenderWithCSRF({ source, parameterPath }: UseBackendUrlProps) {
    const host = HOST_MAP[source];

    if(!host){
        console.error(`알 수 없는 source: '${source}'. 'fastapi' 또는 'django'만 허용 됩니다.`);
        throw new Error(`Invalid source: '${source}'`);
    }

    const fullUrl = `${host}${parameterPath}`;
    // 전송
    const send = useCallback(
        async (data: any) => {
            // csrf 토큰 가져오기
            const csrfToken = getCookie("csrftoken");

            if (!csrfToken){
                console.warn("csrf 토큰이 없습니다. 확인해주세요")
            }
            // url 조합
            try {
                const response = await axios.post(fullUrl, data, {
                    headers: {
                        "X-CSRFToken": csrfToken ?? "",
                        "content-Type": "application/json",
                    },
                    withCredentials: true,
                });

                return response.data;
            } catch (error) {
                console.error("전송 실패 : ", error);
                throw error;
            }
        },
        [fullUrl]
    )

    return send
}