import React from "react";
import SideBar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import Modal from "../../components/Modals/Modal";

import localStyles from "./Dashboard.module.css"
import { useUser } from "../../hooks/useUser";
import { useLanguage } from "../../hooks/useLanguage "
import { useModal } from '../../hooks/useModal'; //모달


const UserDashboard: React.FC = () => {
    const { me } = useUser();
    const { t } = useLanguage();
    const modal = useModal();

    const handleConfirm = () => {
        console.log('확인!');
        modal.close();
    };

    return <>
        <div id="wrap" className={localStyles.wrap} style={{ display: "flex" }}>
            <SideBar />
            <div className={localStyles.container}>
                <Header />
                <main>
                    대쉬보드
                    <p>이메일: {me?.email}</p>
                    <button 
                        onClick={modal.open}
                        style={{ padding: '8px 16px', marginTop: '12px', fontSize: '1.4rem' }}
                    >
                        모달 열기 테스트
                    </button>
                    <Modal 
                        isOpen={modal.isOpen} 
                        onClose={modal.close}
                        size="md"
                        children={
                            <h1> 모달입니다 </h1>
                        }
                    ></Modal>
                </main>
                <Footer />
            </div>
        </div>
    </>;
}

export default UserDashboard