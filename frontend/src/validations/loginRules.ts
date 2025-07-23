import { TFunction } from "i18next";
import { commonRules } from "./commonRules";

export const loginRules = (t: TFunction) => {
    // 공용 에러 필드 (빈박스)
    const common = commonRules(t);

    return{
        username: {
            ...common.required.username,
            mexLength: {
                value: 20,
                message: t("error.username.max")
            }
        }
    }

}