import { TFunction } from "i18next";
import { toI18nKey } from "../constants/errorMessages";

export const commonRules = (t: TFunction) => ({
  // 프리셋(정적)
    required: {
        username: { required: t(toI18nKey("REQUIRED_USERNAME")) },
        password: { required: t(toI18nKey("REQUIRED_PASSWORD")) },
        email:    { required: t(toI18nKey("REQUIRED_EMAIL")) },
    },

  // 헬퍼(동적) - 필요 시 사용
    makeRequired: (code: string) => ({ required: t(toI18nKey(code)) }),
    minLength: (len: number, code: string) =>
        ({ minLength: { value: len, message: t(toI18nKey(code)) } }),
    pattern: (regex: RegExp, code: string) =>
        ({ pattern: { value: regex, message: t(toI18nKey(code)) } }),
});
