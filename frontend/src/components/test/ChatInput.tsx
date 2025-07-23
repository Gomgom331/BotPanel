import React, { useState } from "react";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const sendMessage = async () => {
    const res = await fetch("http://localhost:9000/test/", {
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