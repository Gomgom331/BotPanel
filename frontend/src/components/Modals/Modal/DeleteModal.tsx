import React from "react";
import { ConfirmModal } from "../presets/ConfirmModal";
import { useLanguage } from "../../../hooks/useLanguage";

interface DeleteModalProps{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;  // 삭제함수
    id?: string | number;
    title: string; // 모달 타이틀
    name?: string; // 삭제할 항목 이름
    itemType?: string; // 삭제항 항목 타입
    isLoading?: boolean // 삭제 로딩
    message?: string; // 메시지
    alert?: boolean; // 재확인
}

const DeleteModal:React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    id,
    title,
    name,
    itemType,
    isLoading,
    message="",
    alert,
}) => {

    const { t } = useLanguage();
    const test1 = function(){return 2;}

    const handleDelte = () => {
        test1();
        onClose();
    }

    return(
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}onNegativeClick
            iconName="trash"
            title={`${title} 삭제하시겠습니까? ${t("common.delete")}`}
            positiveButtonLabel="삭제"
            onPositiveClick={handleDelte}
            onNegativeClick={onClose}
        >
            {message ? message : "삭제하시겠습니까"}
        </ConfirmModal>
    )
}

export default DeleteModal