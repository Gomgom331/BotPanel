import SocialLoginButton, { Provider } from "./SocialLoginButton";
import { SOCIAL_PROVIDERS } from "./providers";
import styles from "./SocialLoginButton.module.css";

export default function SocialLoginSection() {
    return (
        <>  
            <div className={styles.socialLoginTitle}>
                <hr /><span className={styles.loginText}>간편로그인</span><hr />
            </div>
            <div className={styles.iconRow}>
                {SOCIAL_PROVIDERS.map((p) => (
                    <SocialLoginButton key={p.id} provider={p as Provider} />
                ))}
            </div>
        </>
    );
}