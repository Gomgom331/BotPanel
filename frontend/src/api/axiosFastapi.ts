import axios, { AxiosInstance } from "axios";

// 쿠키에서 CSRF 토큰을 추출하는 함수
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const lastPart = parts.pop();
    if (lastPart) {
      return lastPart.split(";").shift();
    }
  }
  return undefined;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_FASTAPI_URL,
  timeout: Number(process.env.REACT_APP_AXIOS_TIMEOUT),// 타임아웃 지정
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken") || "",
  },
});

export default axiosInstance;