import React, { useEffect } from "react";
import styles from "./Modal.module.css";
import Icon from "../Icon/Icon";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}


// 기본 컨테이너 (배경, 중앙정렬, 닫기버튼 등)
const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    size = 'md'

}) => {

    // esc 키로 닫기 + 스크롤 방지
    useEffect(()=>{
        // 열리지 않을시 실행 X
        if (!isOpen) return;

        // esc 키 이벤트
        const handleEsc = (e:KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        // 스크롤 방지
        document.body.style.overflow = "hidden";
        document.removeEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    // 모달이 열리지 않으면 아무것도 리턴하지 않음
    if (!isOpen) return null; 

    return(
        <div 
            className={styles.overlay}
            onClick={onClose}
        >
            <div 
                className={styles.container}
                // 클릭 방지
                onClick={(e)=> e.stopPropagation()}
            >
                <button 
                    className={styles.closeBtn}
                    aria-label="closeModal"
                    onClick={onClose}
                >
                    <Icon name="close"/>
                </button>
                {/* closeBtn */}
                {children}
            </div>
            {/* content */}
        </div>
        // container
    )
}

export default Modal;

