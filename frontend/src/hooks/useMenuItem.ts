import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "./useLanguage ";
import { useApi } from "./useApi"


type MenuItem = {
    id: number;
    kind: "item" | "group";
    label: string;
    path: string;
    order: number;
    external: boolean;
    external_url?: string | null;
    children?: MenuItem[];
};

// 언어 리턴문
const normalizeLang = (lang: string): "ko" | "en" | "zh" => {
    const base = lang.split("-")[0];
    if (base === "en") return "en";
    if (base === "zh") return "zh";
    return "ko";
};

export const useMenuItem = () => {
    const { currentLanguage, onLanguageChange } = useLanguage(); // 언어변경
    const [menu, setMenu] = useState<MenuItem[]>([]); // 메뉴상태
    const [ loading, setLoading ] = useState(false); // 로딩

    const send = useApi("MENU_TREE");

    const fetchMenu = useCallback(
    async (langCode: string) => {
        const lang = normalizeLang(langCode); // 설정값 불러오기

        setLoading(true);
        try {
            const data = await send({
                method: "get",
                params: { lang },
            });
            setMenu(data ?? []);
        } catch (e) {
            console.log("Menu load failed: ", e);
        setMenu([]);
        } finally {
            setLoading(false);
        }
    },[send]); // depth 배열


    useEffect(()=> {
        // 초기로드
        fetchMenu(currentLanguage);

        // 언어가 바뀔때마다 재요청
        const off = onLanguageChange(fetchMenu);
        return off;
    }, [currentLanguage, fetchMenu, onLanguageChange]);

    console.log(menu);

    return { menu, loading };
};


