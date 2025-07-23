import { useState, useEffect } from "react";

export type UserRole = "guest" | "user" | "admin";

export const useUser = () => {
  const [role, setRole] = useState<UserRole>("guest");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setRole(parsed.role);
    }
  }, []);

  const isAuthenticated = role !== "guest";

  return { role, isAuthenticated };
};