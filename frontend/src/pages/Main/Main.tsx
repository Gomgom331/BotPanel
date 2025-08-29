import React from "react"
import { useUser } from "../../hooks/useUser"

// 페이지 컴포넌트
import UserDashboard from "../User/Dashboard";
import AdminDashboard from "../Admin/Dashboard";
import GuestDashboard from "../Guest/Dashboard";

import Button from "../../components/Button/Button"

// 로그아웃
import { useAuthActions } from "../../hooks/useAuthActions";

const Main: React.FC = () => {

    const { logout, loading } = useAuthActions();
    const {role} = useUser();

    return (
        <>
            <Button 
                label="로그아웃" 
                variant="primary" 
                color="primary" 
                height="30px"
                onClick={logout}
                loading={loading}
            />
            
            <div style={{ margin: "20px" }}>⚠️ 공사중</div>
            <div style={{ margin: "20px" }}>
                {role === "admin" && <AdminDashboard />}
                {role === "user" && <UserDashboard />}
                {role === "guest" && <GuestDashboard />}
            </div>
        </>
    );
}

export default Main