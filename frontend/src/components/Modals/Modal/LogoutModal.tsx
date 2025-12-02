import React from "react";
import { ConfirmModal } from "../presets/ConfirmModal";
import { useAuthActions } from "../../../hooks/useAuthActions";
import { useLanguage } from "../../../hooks/useLanguage";

interface LogoutModalProps {
    isOpen: boolean; //열림
    onClose: ()=> void; //닫힘
} 

const LogoutModal:React.FC<LogoutModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { t } = useLanguage(); // 언어설정
    const { logout } = useAuthActions(); // 로그아웃

    const handleLogout = async () => {
        await logout();
        onClose();
    };

    return(
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("logout.confirm")}
            iconName="logout"
            positiveButtonLabel={t("logout.title")}
            negativeButtonLabel={t("common.cancelAction")}
            onPositiveClick={handleLogout}
            onNegativeClick={onClose}
        >
            {t("logout.warning")}
        </ConfirmModal>
    )
}

export default LogoutModal;
