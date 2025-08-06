// 테마 등 원하는 라우터를 여기서 추가해주기
// function App() {
//   return (
//     <BrowserRouter>
//       <UserProvider>
//         <ThemeProvider>
//           <AppRoutes />
//         </ThemeProvider>
//       </UserProvider>
//     </BrowserRouter>
//   );
// }

// React Router의 useRoutes() 훅이나 <Routes>  는 내부적으로 RouterContext를 필요로 하는데, 
// 이 컨텍스트는 <BrowserRouter> 같은 상위 라우터 컴포넌트를 제공하는데, 해당 라우터로 감싸지 않으면
// context가 없어서 에러가 발생함

import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index";

// csrf 토큰 적용
import { useInitCsrf } from "./hooks/useInitCsrf"

function App() {
  useInitCsrf(); // 앱 전체가 처음 로딩될 떄 한번 실행

  return (
    // 해당 라우터로 감싸줘야 실행이 됨
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
