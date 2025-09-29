import React, { useState } from "react";
import styles from "./Alert.module.css";
import Icon from "../Icon/Icon"

export type AlertType = "success" | "error" | "guide";

export interface AlertProps {
    type: AlertType;
    message: string[];
    trigger?: string;
    title?: string;
    icon?: string;
    closable?: boolean;
    shadow?:boolean;
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
    type,
    message,
    trigger,
    title,
    icon,
    closable = false,
    shadow= false,
    onClose,
}) => {
    // 닫기 이벤트
    const [closing, setClosing] = useState(false);

    React.useEffect(() => {
        if (closing && onClose) {
            const timer = setTimeout(() => {
                onClose();
                setClosing(false);
            }, 600); // 300ms for animation
            return () => clearTimeout(timer);
        }
    }, [closing, onClose]);

    if (closing) return null;

    // 닫기 아이콘 이벤트
    // 닫기 버튼 색상 설정
    let closeIconColor = "var(--error-line)";
    if (type === "success") {
        closeIconColor = "var(--success-line)";
    } else if (type === "guide") {
        closeIconColor = "var(--guide-ling)";
    }

    return (
        <div className={styles.alertContainer}>
        {icon && (
            <div>
                <span>{icon}</span>
            </div>
        )}
        <div className={`${styles.alertBox} ${styles[type]} ${shadow ? styles.shadowBox : ''}`}>
            <div className={styles.alertText}>
                {title && (
                    <h2 className={`${styles[type]} ${styles.title}`}>{title}</h2>
                )}
                <ul>
                    {message.map((msg, idx) => (
                        <li key={idx} className={`${styles.alertList} ${styles[type]}`}>
                            {msg}
                        </li>
                    ))}
                </ul>
            </div>
            {closable && (
                <div className={styles.buttonBox}>
                    <button type="button" onClick={() => setClosing(true)}>
                        <Icon name="close" color={closeIconColor} />
                    </button>
                </div>
            )}
        </div>
        {trigger && <div>{trigger}</div>}
    </div>
    );
};
