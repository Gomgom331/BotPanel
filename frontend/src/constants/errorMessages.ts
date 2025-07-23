
// 에러 메세지 키를 상수로 정의해 중복을 방지
export const ERROR_KEYS = {
    REQUIRED_USERNAME: "error.required.username",
    REQUIRED_PASSWORD: "error.required.password",
    REQUIRED_EMAIL: "error.required.email",
    INVALID_EMAIL: "error.invalid.email",
    DUPLICATE_USERNAME: "error.duplicate.username",
    DUPLICATE_EMAIL: "error.duplicate.email",
    TOO_SHORT_PASSWORD: "error.invalid.password.length"
  } as const;