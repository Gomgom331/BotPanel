// 여러 객체를 나눠서 정의한 후, 하나의 ERROR_KEYS로 합쳐서 내보내는 방법
const SERVER = {
  SERVER_ERROR: "error.server.generic",
}

const METHOD = {
  ERROR_METHOD_INVALID_GENERIC:"error.method.generic",
  ERROR_METHOD_INVALID_GET:"error.method.get",
  ERROR_METHOD_INVALID_POST:"error.method.post",
  ERROR_METHOD_INVALID_PUT:"error.method.put",
  ERROR_METHOD_INVALID_DELETE:"error.method.delete",
}

const ERROR = {
  INVALID_INPUT: "error.required.credentials.both",
  ERR_AUTH_INACTIVE: "error.required.credentials.inactive",
  ERR_NO_SUCH_USER: "error.required.credentials.no_such_user",
  ERR_BAD_PASSWORD: "error.required.credentials.bad_password",
  ERR_AUTH_DELETED_USER: "error.required.deleted_user",
  REQUIRED_USERNAME: "error.required.username",
  REQUIRED_PASSWORD: "error.required.password",
  REQUIRED_EMAIL: "error.required.email",
  INVALID_EMAIL: "error.invalid.email",
  INVALID_REQUEST: "error.invalid.request.generic",
  TOO_SHORT_PASSWORD: "error.invalid.password.length",
  DUPLICATE_USERNAME: "error.duplicate.username",
  DUPLICATE_EMAIL: "error.duplicate.email",
}

// 여러 객체를 합쳐서 하나의 ERROR_KEYS로 내보내기
export const ERROR_KEYS = {
  ...SERVER,
  ...METHOD,
  ...ERROR,
} as const; 