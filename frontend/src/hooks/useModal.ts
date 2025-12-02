import React, { useState } from "react";

// 모달 상태
export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false); //모달 열림 상태

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(prev => !prev);

    return {
            isOpen,
            open,
            close,
            toggle,
    };
};