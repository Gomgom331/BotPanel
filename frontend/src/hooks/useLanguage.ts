// 다국어 훅
// react-i18next 기반으로 다국어 처리 기능 제공 
// ex) const {t} = useLanguage(); t('key'); <p>{t('welcome')}</p>
// 줄 건너뛰기를 하고싶을 경우 .me

import { useTranslation } from "react-i18next";
import { useCallback } from "react";


export const useLanguage = () => {
    const { t, i18n } = useTranslation();
    
    // 현재 언어
    const currentLanguage = i18n.language;

    // 언어 변경 감지 콜백 등록 (필요한 컴포넌트에서만 사용하기)
    const onLanguageChange = useCallback(
        (callback: (lang: string)=> void) => {
            const handler = (lng: string) => callback(lng);
            i18n.on("languageChanged", handler);

            // 정리 함수 반환
            return () => {
                i18n.off("languageChanged", handler);
            };
        },
        [i18n]
    );

    return {
        t, // 번역 함수
        currentLanguage, // 현재 언어 코드
        onLanguageChange, // 언어 변경 이벤트 리스너
    }
}