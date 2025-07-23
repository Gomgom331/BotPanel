import { TFunction } from "i18next";
import { ERROR_KEYS } from "../constants/errorMessages"

export const commonRules = (t: TFunction) => ({
    required: {
        username: { required: t(ERROR_KEYS.REQUIRED_USERNAME) },
        password: { required: t(ERROR_KEYS.REQUIRED_PASSWORD) },
        email: { requred: t(ERROR_KEYS.REQUIRED_EMAIL) },
    },

})