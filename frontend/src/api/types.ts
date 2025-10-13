// 공통  API 응답 타입 정의 (전체적인 폼)
// 백에서 받는 결과값에 따라 데이터 처리

// 성공시
export type ApiSuccess<D = unknown> = {
    success: true;
    data?: D;
};

// 실패시 - 전역 폼 에러
export type ApiFormError= {
    success: false;
    formError: string;
    code?: string;
    params?: Record<string, any>
}

// 실패시 - 필드별 에러
export type ApiFieldErrors<TField extends string = string> = {
    success: false;
    fieldErrors: Record<TField, string>;
    code?: string;
    params?: Record<string, any>;
}

// 공통 실패 타입
export type ApiFail<TField extends string = string> =
    | ApiFormError
    | ApiFieldErrors<TField>;

// 공통 응답 타입
export type ApiResponse<D = unknown, TField extends string = string> = 
    | ApiSuccess<D>
    | ApiFail<TField>;