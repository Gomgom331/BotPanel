import React, { useState } from "react";
import { useApi } from "../../hooks/useApi"


const ChatInput: React.FC = () => {

  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const sendToBackend = useApi("TEST_API")

  const sendMessage = async () => {
    console.log('메세지 발송');

    try {
      const response = await sendToBackend({ text: message });

      // 체크 후 삭제
      console.log("응답 전체", response); 
      console.log("response.data", response);  

      const topEmotion = response.result?.[0];

      if (topEmotion) {
        setResult(`${topEmotion.label} (${(topEmotion.score * 100).toFixed(1)}%)`);
      } else {
        setResult("감정을 분석할 수 없습니다.");
      }

    } catch (error: any) {
      console.error("❗ FastAPI 응답 에러", error);
      setResult("에러가 발생했습니다.");
    }
  }



  // api 호출
  // const api = useApi();


  // 메세지 호출
  // const sendMessage = async () => {
  //   const res = await api.post("/fastapi/test?soucr", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ text: message }),
  //   });

  //   const data = await res.json();
  //   const topEmotion = data.result?.[0];

  //   if (topEmotion) {
  //     setResult(`${topEmotion.label} (${(topEmotion.score * 100).toFixed(1)}%)`);
  //   } else {
  //     setResult("감정을 분석할 수 없습니다.");
  //   }
  // };





  // const sendMessage = async () => {
  //   try {
  //     const response = await api.post("/fastapi/test", { text: message }, {
  //       params: { source: "fastapi" },
  //     });
  
  //     console.log("응답 전체", response);         // 응답 구조 확인
  //     console.log("response.data", response.data); // 실제 JSON 본문
  
  //     const topEmotion = response.data.result?.[0];
  
  //     if (topEmotion) {
  //       setResult(`${topEmotion.label} (${(topEmotion.score * 100).toFixed(1)}%)`);
  //     } else {
  //       setResult("감정을 분석할 수 없습니다.");
  //     }
  //   } catch (error: any) {
  //     console.error("❗ FastAPI 응답 에러", error);
  //     setResult("에러가 발생했습니다.");
  //   }
  // };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="감정을 분석할 문장을 입력하세요"
      />
      <button onClick={sendMessage}>분석</button>
      {result && <p>예측된 감정: {result}</p>}
    </div>
  );
};

export default ChatInput;