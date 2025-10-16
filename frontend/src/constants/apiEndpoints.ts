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
    // csrf
    CSRF_TOKEN: {
        source: API_SOURCES.DJANGO,
        path: "/csrf/"
    },
    // 쿠키
    REFRESH_COOKIE: {
        source: API_SOURCES.DJANGO,
        path: "/auth/refresh-cookie/"
    },
    // 로그인
    AUTH_LOGIN: {
        source: API_SOURCES.DJANGO,
        path: "/auth/login/"
    },
    // 로그아웃
    AUTH_LOGOUT: {
        source: API_SOURCES.DJANGO,
        path: "/auth/logout/"
    },
    // 내정보 조회
    USER_ME: {
        source: API_SOURCES.DJANGO,
        path: "/user/me/"
    },
}as const;

// 타입 정의 
export type EndpointKey = keyof typeof API_ENDPOINTS;

// --------------------------------
// < 사용법 > 
// frontend 에 쓰이는 모든 endpoint는 상수로 작성해서 사용하기
//
// useAPI 를 불러와 원하는 변수값을 넣기 (hook/useApi)
// import { useApi } from "./useApi";
// const fetchMe = useApi("USER_ME");

// path 값만 불러오고 싶을 경우
//
