// 에러 메신저만 상수값으로 표기해두기
// 여기만 수정하면 전체가 따라옵니다. (문자열은 전부 i18n 키로 통일)

export const DEFAULT_I18N_KEY = "error.server.generic" as const;

export const ERROR_I18N_MAP: Record<string, string> = {
  // ----- 서버/공통 -----
  SERVER_ERROR: "error.server.generic",
  INVALID_REQUEST: "error.invalid.request.generic",
  INVALID_INPUT: "error.required.credentials.both",

  // ----- 메서드 -----
  ERROR_METHOD_INVALID_GENERIC: "error.method.generic",
  ERROR_METHOD_INVALID_GET: "error.method.get",
  ERROR_METHOD_INVALID_POST: "error.method.post",
  ERROR_METHOD_INVALID_PUT: "error.method.put",
  ERROR_METHOD_INVALID_DELETE: "error.method.delete",

  // ----- 로그인 자격 -----
  ERR_NO_SUCH_USER: "error.required.credentials.no_such_user",
  ERR_BAD_PASSWORD: "error.required.credentials.bad_password",
  ERR_AUTH_INACTIVE: "error.required.credentials.inactive",
  ERR_AUTH_DELETED_USER: "error.required.deleted_user",

  // ----- 필수값 -----
  REQUIRED_USERNAME: "error.required.username",
  REQUIRED_PASSWORD: "error.required.password",
  REQUIRED_EMAIL: "error.required.email",

  // ----- 유효성 -----
  INVALID_EMAIL: "error.invalid.email",
  TOO_SHORT_PASSWORD: "error.invalid.password.length",

  // ----- 중복 -----
  DUPLICATE_USERNAME: "error.duplicate.username",
  DUPLICATE_EMAIL: "error.duplicate.email",
};

// code가 이미 i18n 키면 그대로, 아니면 맵에서 찾아서 반환
export function toI18nKey(code?: string): string {
  if (!code) return DEFAULT_I18N_KEY;
  if (code.includes(".")) return code; // 이미 'error.*' 형태
  return ERROR_I18N_MAP[code] || DEFAULT_I18N_KEY;
}

// 서버에서 내려온 fieldErrors를 i18n 키로 일괄 변환
export function mapFieldErrors<T extends string>(
  fieldErrors?: Record<T, string>
): Record<T, string> | undefined {
  if (!fieldErrors) return undefined;
  const out: Record<T, string> = {} as any;
  for (const k in fieldErrors) out[k as T] = toI18nKey(fieldErrors[k as T]);
  return out;
}
