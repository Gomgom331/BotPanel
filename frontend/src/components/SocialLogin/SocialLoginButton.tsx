import React from "react";
import styles from "./SocialLoginButton.module.css";


export type Provider = {
    id: string;
    label: string;
    iconSrc: string;
    bgColor?: string;
    bgImage?: string;
    ring?: "none" | "light";
    onClick?: () => void;
};

type CSSVars = React.CSSProperties & {
    ["--bg"]?: string;
    ["--bg-image"]?: string;
};

export default function SocialLoginButton({ provider }: { provider: Provider }) {
    const { label, iconSrc, bgColor, bgImage, ring = "none", onClick } = provider;

    const style: CSSVars = {
        "--bg": bgColor ?? "#fff",
        "--bg-image": bgImage ? `url(${bgImage})` : "none",
    };


    return (
        <button
            type="button"
            aria-label={label}
            className={`${styles.circleBtn} ${ring === "light" ? styles.ringLight : ""}`}
            style={style}
            onClick={onClick}
        >
            <span aria-hidden className={styles.bg} />
            <img className={styles.icon} src={iconSrc} alt="" aria-hidden />
        </button>
    );
}