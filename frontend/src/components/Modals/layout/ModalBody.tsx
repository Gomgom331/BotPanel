import React, { ReactNode } from "react";
import styles from "./ModalBody.module.css";

interface ModalBodyProps {
    children: ReactNode,
    className?: string,
}

export const ModalBody: React.FC<ModalBodyProps> = ({
    children,
    className="",
}) => {
    return(
        <div className={styles.container}>
            {children}
        </div>
    )
}