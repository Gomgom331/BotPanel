import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index";

// 스크롤 이벤트
import "./styles/scrollbar.css"

// csrf 토큰 적용
import { useInitCsrf } from "./hooks/useInitCsrf"
import { useScrollHidden } from './hooks/useScrollHidden';


function App() {
  useInitCsrf(); // 앱 전체가 처음 로딩될 때 한번 실행
  useScrollHidden(400);

  return (
    // 해당 라우터로 감싸줘야 실행이 됨
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
