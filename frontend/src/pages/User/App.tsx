import React from "react";
import SideBar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header"

import localStyles from "./Dashboard.module.css"

const UserDashboard: React.FC = () => {
    return <>
        <div id="wrap" className={localStyles.wrap} style={{ display: "flex" }}>
            <SideBar />
            <div className={localStyles.container}>
                <Header />
                <main>
                    대쉬보드
                </main>
            </div>
        </div>
    </>;
}

export default UserDashboard