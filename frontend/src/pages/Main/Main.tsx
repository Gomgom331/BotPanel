import React from "react"
import { useUser } from "../../hooks/useUser"

// 페이지 컴포넌트
import UserDashboard from "../User/Dashboard";
import AdminDashboard from "../Admin/Dashboard";
import GuestDashboard from "../Guest/Dashboard";

const Main: React.FC = () => {

    const {role} = useUser();

    return (
        <>
            <div>⚠️ 공사중</div>
            <div style={{ margin: "20px" }}>
            {role === "admin" && <AdminDashboard />}
            {role === "user" && <UserDashboard />}
            {role === "guest" && <GuestDashboard />}
            </div>
        </>
    );
}

export default Main