import React from "react";
import styles from "./Button.module.css"
import { useTranslation } from "react-i18next";
import Icon from "../Icon/Icon"

interface ButtonProps {
    type?: "button" | "submit" | "reset"; // 버튼타입
    label: string; // 버튼이름
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean; // 비활성화
    loading?: boolean; // 로딩
    loadingColor?: string; // 로딩 컬러
    variant?: "primary" | "secondary" | "large" | "icon"; // 스타일 구분
    color?: "primary" | "ghost" | "secondary" // 색상 구분
    fullWidth?: boolean;    // 너비 100%
    height?: string;        // 버튼 높이
    icon?: React.ReactNode; // 아이콘 포함 (선택)
}

const Button: React.FC<ButtonProps> = ({
    type = "button",
    label,
    onClick,
    disabled = false,
    loading = false,
    loadingColor,
    variant = "primary",
    fullWidth = false,
    height,
    color = "ghost",
    icon,
}) => {
    const { t } = useTranslation();

    // 버튼 스타일 (색상)
    const buttonStyle = {
        ...(height && { minHeight: height }),
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            style={buttonStyle}
            className={`
                ${styles.button}
                ${styles[variant]}
                ${fullWidth ? styles.fullWidth : ''}
                ${styles[color]}
            `}
        >
            {loading ? (
                <>
                    <Icon name="loading" color={loadingColor}/>

                    {/* <span className={styles.spinner} /> 
                    <span className={styles.loadingText}>{t("common.loading")}</span> */}
                </>
            ) : (
                <>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    {label}
                </>
            )}
        </button>
    );
}

export default Button;