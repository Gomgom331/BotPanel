import { useEffect, useRef } from "react";
import axios from "axios";

const DJANGO_URL = process.env.REACT_APP_API_DJANGO_URL;

export function useInitCsrf() {

    // 토큰 중복 발행 방지
    const didInitRef = useRef(false);
    useEffect(()=> {  
        if (didInitRef.current) return;
        didInitRef.current = true; // 실행됨 표시
        axios.get(`${DJANGO_URL}/csrf/`,{
            withCredentials: true,
        }).then(() => {
            console.log("CSRF 토큰 발급 완료");
        }).catch((err) => {
            console.error("CSRF 토큰 발급 실패", err);
        });
    }, []);
}