import React, { useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom"

import styles from "./Modal.module.css";
import Icon from "../../Icon/Icon";

// 기본 틀 + 닫기 버튼

interface ModalProps {
    isOpen: boolean; // 열림 여부
    onClose: () => void; // 닫기 콜백
    closeOnEsc?: boolean; // esc 키로 닫기 여부 
    size?: 'sm' | 'md' | 'lg'; 
    children: React.ReactNode; 
    className?: string; // 추가 커스텀
}


// 기본 컨테이너 (배경, 중앙정렬, 닫기버튼 등)
export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    closeOnEsc = true,
    size = 'md',
    children,
    className,
    
}) => {

   // ref로 모달 컴테이너 참조
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);  

    // 포커스 가능한 요소 찾기
    const getFocusableElements = useCallback(()=>{
        if(!modalRef.current) return [];

        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        return Array.from(
            modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
        );
    },[]);


    // esc 키 핸들링 / tab 키 핸들링
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // esc 닫기
            if (!closeOnEsc) return
            if (e.key === "Escape") {
                onClose();
            }

            // Tab 키 focus trap
            if (e.key === "Tab") {
                const focusableElements = getFocusableElements();
                
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                // Shift + Tab (역방향)
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } 
                // Tab (정방향)
                else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        },
        [closeOnEsc, onClose, getFocusableElements]
    )

    useEffect(() => {
        if (!isOpen) return

        // 모달 열릴 때 해당 포커스 저장
        previousActiveElement.current = document.activeElement as HTMLElement;
        // 키보드 이벤트 리스터
        window.addEventListener("keydown", handleKeyDown)

        const timeoutId = setTimeout(() => {
            const focusableElements = getFocusableElements();
            if (focusableElements.length > 0) {
                // const parent = focusableElements[0].parentElement;
                // parent?.focus();
                focusableElements[0].focus();
                console.log(focusableElements)
            }
        }, 0);

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            clearTimeout(timeoutId);

            if(previousActiveElement.current){
                previousActiveElement.current.focus();
            }
        }
    }, [isOpen, handleKeyDown, getFocusableElements]);


    // 모달이 열리지 않으면 아무것도 리턴하지 않음
    if (!isOpen) return null; 

    // 포털 루트는 실제 앱에서 #modal-root 같은 요소를 만들어두고 사용해야 함
    // 원하는 위치에다가 생성해주기
    const portalRoot = document.getElementById("modal-root")
    if (!portalRoot) return null

        // // size에 따른 클래스는 나중에표기
    // 버튼크기와 아이콘 유무에 따라 다르게하기 (나중에 추가 하기)
    const sizeClassMap: Record<'sm' | 'md' | 'lg', string> = {
        sm: styles.sm,
        md: styles.md,
        lg: styles.lg,
    };

    const sizeClass = sizeClassMap[size] ?? styles.md;

    return ReactDOM.createPortal(
        (
            <div
                className={styles.overlay}
                onClick={onClose}
            >
                <div 
                    className={`
                        ${styles.container}
                        ${sizeClass}
                    `}
                    // 클릭 방지
                    onClick={(e)=> e.stopPropagation()}
                    ref={modalRef}
                    role="dialog"
                    aria-modal="true"
                >
                    <button 
                        className={`
                            ${styles.closeBtn}
                        `}
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


