import React, { useState } from "react";
import styles from "../../shared/FormControl.module.css";
import localStyles from "./PasswordField.module.css";

// 아이콘
import Icon from "../../Icon/Icon"

// 타입 지정
interface PasswordProps {
    label?: string;
    value?:string;
    name?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    height?: string | number;
    onChange?: (e:React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e:React.FocusEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<PasswordProps> = ({
    label,
    value,
    name,
    placeholder,
    error,
    required = false,
    height,
    onChange,
    onBlur,
}) => {

    // 비밀번호 뷰 아이콘
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // 강제로 높이기
    const inputStyle = {
        ...(height && { height: height, minHeight: height })
    };

    return (
        <div className={styles.container}>
            {label && (
                <label className={styles.label} htmlFor={name}>
                    {label} {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <div className={localStyles.passwordInputWrapper}>
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value ?? ""}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    required={required}
                    className={`${styles.input} ${error ? styles.error : ""}`}
                    style={inputStyle}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                />
                {/* 비밀번호 아이콘 */}
                <button
                    type="button"
                    className={localStyles.toggleButton}
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                    {showPassword ? <Icon name="eye-off"/> : <Icon name="eye"/>}
                </button>
            </div>
            {error && (
                <p id={`${name}-error`} className={styles.errorText}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default PasswordField;