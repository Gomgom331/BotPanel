import React from "react";
import SideBar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header"

import localStyles from "./Dashboard.module.css"
import { useUser } from "../../hooks/useUser";
import { useLanguage } from "../../hooks/useLanguage "


const UserDashboard: React.FC = () => {
    const { me } = useUser();
    const { t } = useLanguage();


    return <>
        <div id="wrap" className={localStyles.wrap} style={{ display: "flex" }}>
            <SideBar />
            <div className={localStyles.container}>
                <Header />
                <main>
                    대쉬보드
                    <p>이메일: {me?.email}</p>
                </main>
            </div>
        </div>
    </>;
}

export default UserDashboard