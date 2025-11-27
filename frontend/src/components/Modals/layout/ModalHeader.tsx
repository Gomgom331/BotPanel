import React, { ReactNode } from "react";
import styles from "./ModalHeader.module.css";
import Icon from "../../Icon/Icon"
import { useOpacityColor } from "../../../hooks/useOpacityColor";

interface ModalHeaderProps {
    children: ReactNode;
    className?: string;
    iconName?: string;
    iconSize?: number | string;
    iconColor?: string;
    iconBgColor?: string;
    iconBgOpacity?: number;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
    children,
    className= "",
    iconName,
    iconSize="1.4286rem",
    iconColor="var(--color-primary)",
    iconBgColor="var(--color-primary)",
    iconBgOpacity=0.1

}) => {

    const  finalColor = useOpacityColor(iconBgColor, iconBgOpacity);

    return(
        <div className={`${styles.container} ${className}`}>
            {iconName && (
                <div className={styles.iconBox} style={{ backgroundColor: finalColor }}>
                    <Icon
                        name={iconName}
                        // 사이즈, 컬러 유무시 기입
                        size={iconSize}
                        {...(iconColor ? {color: iconColor} : {})}
                    />
                </div>
            )}
            <h1>{children}</h1>
        </div>
    )
}