import React, { ReactNode } from "react";
import styles from "./ModalFooter.module.css";

interface ModalFooterProps {
    children: React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className? : string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
    children,
    align = 'right',
    className,
}) => {
    
    // 정렬에 따른 스타일 값
    const justifyMap: Record<'left' | 'center' | 'right', string> = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
    };

    return(
        <div className={`${styles.container} ${className}`} style={{ justifyContent : justifyMap[align] }}>
            { children }
        </div>
    )
}