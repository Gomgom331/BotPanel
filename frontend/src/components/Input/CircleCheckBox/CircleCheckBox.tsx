import React from "react";
import styles from "./CircleCheckBox.module.css"

import Icon from "../../Icon/Icon"

// 원형, 네모 체크 박스 
interface CircleCheckBoxProps {
    id: string | number;
    label?: string;
    checked?: boolean;
    size?: string;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    name?: string;
    value?: string;
    iconSize?: string;
    iconColor?: string;
}

const CircleCheckBox: React.FC<CircleCheckBoxProps> = ({
    id,
    label,
    checked = false,
    size = "1.4rem",
    onChange,
    disabled = false,
    name,
    value,
    iconSize = "0.6rem",
    iconColor = "var(--icon-color-wh)",
}) => {
    // 체크 이벤트
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.checked);
        }
    };
    // 아이디
    const stringId = String(id); //id를 문자열로 변환

    return (

        <label className={`${styles["checkboxItem"]} ${disabled ? styles.disabled : ""}`}>
            <input
                id={stringId}
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                name={name}
                value={value}
            />
            <span 
                className={styles["checkboxCircle"]}
                style={{
                    width: size,
                    height: size,
                }}
            >
                <Icon 
                    name="check" 
                    size={iconSize} 
                    color={iconColor}
                    className={styles["checkIcon"]}
                />
            </span>
            {label && <span className={styles["checkboxLabel"]}>{label}</span>}
        </label>
    );
};

export default CircleCheckBox;