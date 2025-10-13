// api 로직 --------------------------------
export const API_SOURCES = {
    DJANGO: "django",
    FASTAPI: "fastapi",
} as const;


export const API_ENDPOINTS = {
    // 테스트 ----------
    TEST_API: {
        source: API_SOURCES.FASTAPI,
        path: "/test/"
    },


    // 인증 관련 ----------
    // 로그인
    AUTH_LOGIN: {
        source: API_SOURCES.DJANGO,
        path: "/api/auth/login/"
    },
    // 로그아웃
    AUTH_LOGOUT: {
        source: API_SOURCES.DJANGO,
        path: "/api/auth/logout/"
    },
    // 내정보 조회
    USER_ME: {
        source: API_SOURCES.DJANGO,
        path: "/api/user/me/"
    },
}as const;

// 타입 정의 --------------------------------
export type EndpointKey = keyof typeof API_ENDPOINTS;
