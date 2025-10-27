import { Routes, Route  } from "react-router-dom";
import AuthGate from "../guards/AuthGate"; // 1분기 게이트
import CompanyGate from "../guards/CompanyGate"; // 2분기 게이트

import HomeRedirect from "./HomeRedirect";

// page component
import TestPage from "../components/test/ChatInput";
import LoginPage from "../pages/Auth/Login/Login"; // 로그인

// 나중에 게스트, 관리자 라우트 만들어두기
import GuestPage from "../pages/Guest/Dashboard";
import AdminPage from "../pages/Admin/Dashboard";
import NotFound  from "../pages/Error/NotFound";
import UserPage from "../pages/User/Dashboard";


export default function AppRoutes() {
    return (
    <Routes>
        {/* 루트 → 분기점1에 따라 분기 */}
        <Route path="/" element={<HomeRedirect />} />

        {/* 공개/비회사 라우트 */}
        <Route path="/test" element={<TestPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
            path="/guest"
            element={<AuthGate roles={["guest"]}><GuestPage /></AuthGate>}
        />
        <Route
            path="/admin"
            element={<AuthGate roles={["admin"]}><AdminPage /></AuthGate>}
        />
        <Route path="/403" element={<NotFound />}/>

        {/* 회사별 보호 라우트 (/:slug/*) — 오직 user만 접근 */}
        <Route path=":slug">
            <Route
                index
                element={ 
                    <CompanyGate>
                        <UserPage />
                    </CompanyGate>
                }
            />
            {/* <Route
                path="dashboard"
                element={
                    <ProtectedRoute roles={["user"]}>
                        <UserPage />
                    </ProtectedRoute>
                }
            /> */}
        </Route>

        {/* 폴백 */}
        <Route path="*" element={<NotFound />} />
    </Routes>
    );
}
