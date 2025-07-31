import React, { useState } from "react";
import axiosInstance from "../../api/axiosFastapi";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  // 메세지 호출
  const sendMessage = async () => {
    const res = await fetch("http://127.0.0.1:9000/fastapi/test/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    });

    const data = await res.json();
    const topEmotion = data.result?.[0];

    if (topEmotion) {
      setResult(`${topEmotion.label} (${(topEmotion.score * 100).toFixed(1)}%)`);
    } else {
      setResult("감정을 분석할 수 없습니다.");
    }
  };

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