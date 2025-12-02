import React, { ReactNode } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../layout';
import Button from "../../Button/Button"

// 로그아웃, 저장, 확인용

interface ConfirmModalProps{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    id?:string | number;
    children?: ReactNode;
    iconName?: string;
    iconSize?: number | string;
    iconColor?: string;
    iconBgColor?: string;
    iconBgOpacity?: number;
    positiveButtonLabel?: string; // 확인 / 저장 / 예
    negativeButtonLabel?: string; // 취소 / 아니오
    onPositiveClick?: () => void | Promise<void>;
    onNegativeClick?: () => void | Promise<void>;
}

export const ConfirmModal:React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    title,
    id,
    children,
    iconName,
    iconSize="1.4286rem",
    iconColor="var(--color-primary)",
    iconBgColor="var(--color-primary)",
    iconBgOpacity=0.1,
    positiveButtonLabel="확인",
    negativeButtonLabel="취소",
    onPositiveClick,
    onNegativeClick,
}) =>{


    return (    
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader
                {...(iconName
                    ? {
                        iconName,
                        iconSize,
                        iconColor,
                        iconBgColor,
                        iconBgOpacity,
                    }
                    : {})}
                children={title}
            />
            <ModalBody
                children={children}
            />
            <ModalFooter>
                <Button 
                    label={positiveButtonLabel}
                    onClick={onPositiveClick}
                    color="primary"
                    variant="lg"
                    // id가 있을시 넣기
                    {...(id ? {id}: {})}
                />
                <Button
                    label={negativeButtonLabel}
                    onClick={onNegativeClick}
                    color="ghost"
                    variant="lg"
                />
            </ModalFooter>
        </Modal>
    )
}