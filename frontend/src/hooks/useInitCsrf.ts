import { useEffect, useRef } from 'react';
import { useApi } from './useApi';

export const useInitCsrf = () => {
    const didInitRef = useRef(false);
    const sendCsrf = useApi('CSRF_TOKEN');

    console.log("useCsrf")

    useEffect(() => {
        if (didInitRef.current) return;
        didInitRef.current = true;

        sendCsrf()
            .then(() => {
                console.log("CSRF 토큰 발급 완료");
            })
            .catch((error) => {
                console.error("CSRF 토큰 발급 실패:", error);
            });
    }, [sendCsrf]);
};