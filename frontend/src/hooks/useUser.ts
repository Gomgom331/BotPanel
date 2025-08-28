import { useState, useEffect } from "react";

export type UserRole = "guest" | "user" | "admin";

export const useUser = () => {
  //  초기값을 게스트
  const [role, setRole] = useState<UserRole>("guest");

  // 사용자 정보 가여오기
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    console.log("savedUser",savedUser)
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setRole(parsed.role);
    }
  }, []);

  const isAuthenticated = role !== "guest";

  return { role, isAuthenticated };
};