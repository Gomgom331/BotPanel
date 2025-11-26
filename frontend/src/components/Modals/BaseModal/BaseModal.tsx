import React, { useEffect, useCallback } from "react";
import ReactDOM from "react-dom"

import styles from "./BaseModal.module.css";
import Icon from "../../Icon/Icon";

interface BaseModalProps {
    isOpen: boolean; // 열림 여부
    onClose: () => void; // 닫기 콜백
    closeOnEsc?: boolean; // esc 키로 닫기 여부 
    size?: 'sm' | 'md' | 'lg'; 
    children: React.ReactNode; // 모달 내용
    header?: React.ReactNode; // 모달 헤더
    footer?: React.ReactNode; // 모달 푸터
    className?: string; // 추가 커스텀
}


// 기본 컨테이너 (배경, 중앙정렬, 닫기버튼 등)
const BaseModal: React.FC<BaseModalProps> = ({
    isOpen,
    onClose,
    closeOnEsc = true,
    size = 'md',
    children,
    header,
    footer,
    className,
    
}) => {

    // esc 키 핸들링
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!closeOnEsc) return
            if (e.key === "Escape") {
                onClose();
            }
        },
        [closeOnEsc, onClose]
    )

    useEffect(() => {
        if (!isOpen) return
        console.log('작동확인')
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            console.log('해제확인')
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen, handleKeyDown])


    // 모달이 열리지 않으면 아무것도 리턴하지 않음
    if (!isOpen) return null; 

    // 포털 루트는 실제 앱에서 #modal-root 같은 요소를 만들어두고 사용해야 함
    // 원하는 위치에다가 생성해주기
    const portalRoot = document.getElementById("modal-root")
    if (!portalRoot) return null

    // // size에 따른 클래스는 나중에표기
    // 버튼크기와 아이콘 유무에 따라 다르게하기
    // const sizeClass =
    //     size === "sm"
    //     ? "max-w-sm"
    //     : size === "lg"
    //     ? "max-w-3xl"
    //     : size === "full"
    //     ? "w-full h-full m-0"
    //     : "max-w-lg"

    return ReactDOM.createPortal(
        (
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
        ),
        portalRoot
    )
}

export default BaseModal;

