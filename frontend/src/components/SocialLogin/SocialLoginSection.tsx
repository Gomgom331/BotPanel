import SocialLoginButton, { Provider } from "./SocialLoginButton";
import { SOCIAL_PROVIDERS } from "./providers";
import styles from "./SocialLoginButton.module.css";
import { useTranslation } from "react-i18next";

export default function SocialLoginSection() {
    const { t } = useTranslation()
    return (
        <>  
            <div className={styles.socialLoginTitle}>
                <hr /><span className={styles.loginText}>{t("auth.social.title")}</span><hr />
            </div>
            <div className={styles.iconRow}>
                {SOCIAL_PROVIDERS.map((p) => (
                    <SocialLoginButton key={p.id} provider={p as Provider} />
                ))}
            </div>
        </>
    );
}