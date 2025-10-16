import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index";

// csrf 토큰 적용
import { useInitCsrf } from "./hooks/useInitCsrf"

function App() {
  useInitCsrf(); // 앱 전체가 처음 로딩될 때 한번 실행

  return (
    // 해당 라우터로 감싸줘야 실행이 됨
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
