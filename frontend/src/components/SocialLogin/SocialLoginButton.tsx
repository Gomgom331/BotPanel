import { useMemo } from "react";
import React from "react";
import styles from "./SocialLoginButton.module.css";
import { useTranslation } from "react-i18next";

import Tooltip from "../Tooltip/Tooltip";

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
    const { t, i18n } = useTranslation();

    // 라벨을 번역해 주입
    const localizedProvider = useMemo(() => {
    const { label: labelKey, ...rest } = provider;
    return {
        ...rest,
        // 번역 키가 없을 때 원래 문자열을 fallback으로 사용
        label: t(labelKey, { defaultValue: labelKey }),
    };}, [provider.label, i18n.language, t]);

    const {
        id,
        label,         
        iconSrc,
        bgColor,
        bgImage,
        ring = "none",
        onClick,
    } = localizedProvider;

    const style: CSSVars = {
        "--bg": bgColor ?? "#fff",
        "--bg-image": bgImage ? `url(${bgImage})` : "none",
    };


    return (
        <Tooltip
            placement="bottom"
            trigger={["hover", "focus", "click"]}
            content={label}
        >
            <button
                type="button"
                aria-label={id}
                className={`${styles.circleBtn} ${ring === "light" ? styles.ringLight : ""} ${styles.shadow}`}
                style={style}
                onClick={onClick}
            >
                <span aria-hidden className={styles.bg} />
                <img className={styles.icon} src={iconSrc} alt="" aria-hidden />
            </button>
        </Tooltip>
    );
}