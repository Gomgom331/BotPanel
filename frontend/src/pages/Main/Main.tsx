// import React from "react"
// import { useUser } from "../../hooks/useUser"

// // 페이지 컴포넌트
// import UserDashboard from "../User/Dashboard";
// import EditorDashboard from "../Editor/Dashboard";
// import GuestDashboard from "../Guest/Dashboard";

// import Button from "../../components/Button/Button"

// // 로그아웃
// import { useAuthActions } from "../../hooks/useAuthActions";

// const Main: React.FC = () => {

//     const { logout, loading } = useAuthActions();
//     const {role} = useUser();

//     return (
//         <>
//             <Button 
//                 label="로그아웃" 
//                 variant="primary" 
//                 color="primary" 
//                 height="30px"
//                 onClick={logout}
//                 loading={loading}
//             />
            
//             <div style={{ margin: "20px" }}>⚠️ 공사중</div>
//             <div style={{ margin: "20px" }}>
//                 {role === "editor" && <EditorDashboard />}
//                 {role === "user"  && <UserDashboard />}
//                 {role === "guest" && <GuestDashboard />}
//             </div>
//         </>
//     );
// }

// export default Main


// pages/Main/Main.tsx
import React from "react";
import { useUser } from "../../hooks/useUser";
import UserDashboard from "../User/Dashboard";
import Button from "../../components/Button/Button";
import { useAuthActions } from "../../hooks/useAuthActions";

const Main: React.FC = () => {
    const { role } = useUser();
    const { logout, loading } = useAuthActions();

    // 안전 장치: 혹시 잘못 들어오면 아무 것도 렌더 안 함(또는 403)
    if (role !== "user" && role !== "admin") return null;

    return (
    <>
        <Button label="로그아웃" variant="primary" color="primary" height="30px"
                onClick={logout} loading={loading}/>
        <div style={{ margin: 20 }}>⚠️ 공사중</div>
        <div style={{ margin: 20 }}>
        {/* 유저 기본 홈: 에디터도 /admin으로 가도록 HomeRedirect/routeConfig에서 보장 */}
        <UserDashboard />
        </div>
    </>
    );
};

export default Main;
