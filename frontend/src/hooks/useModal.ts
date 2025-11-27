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


// 모달 공용 훅 사용 방법 -------------------------------------------------
// import Modal from "..."
// import { useModal } from '../../hooks/useModal'; //모달

// const modal = useModal();

// return<>
//     <Modal
//         isOpen={modal.isOpen}
//         onClose={modal.close}
//         ...
//     >
//     <Modal/>

// </Modal>

