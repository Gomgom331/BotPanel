import React, { useMemo } from "react";

interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

function getCssVar(variable: string): string {
    const key = variable.replace(/var\((--[^)]+)\)/, "$1");
    //"getComputedStyle" 요소에 적용된 외부 스타일 시트와 인라인 스타일의 최종 연산 결과값을 객체로 반환
    // getPropertyValue , getComputedStyle 같이 사용
    return getComputedStyle(document.documentElement)
        .getPropertyValue(key) //속성값
        .trim(); // 공백 제거
}

// 받은 색상이 어떤 속성의 값인지 체크 및 수정 후 반환 
function toRGBA(color: string): RGBA {
    // 문자열  true/false 로 반환
    // css 변수
    if (color.startsWith("var(")) return toRGBA(getCssVar(color));
    
    // hex
    if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
        a: 1,
        };
    }

    //rgb
    if(color.startsWith("rgb")){
        const values = color.match(/[\d.]+/g)?.map(Number) ?? [0,0,0];
        return {
            r: values[0],
            g: values[1],
            b: values[2],
            a: values[3] ?? 1,
        };
    }

    // hsl
    if(color.startsWith("hsl")){
        const values = color.match(/[\d.]+/g)?.map(Number) ?? [0,0,0];
        let [h,s,l,a] = values;

        h = h % 360;
        s /= 100;
        l /= 100;

        const C = (1 - Math.abs(2 * l - 1)) * s;
        const X = C * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - C / 2;

        let r = 0, g = 0, b = 0;

        if (h < 60) [r, g, b] = [C, X, 0];
        else if (h < 120) [r, g, b] = [X, C, 0];
        else if (h < 180) [r, g, b] = [0, C, X];
        else if (h < 240) [r, g, b] = [0, X, C];
        else if (h < 300) [r, g, b] = [X, 0, C];
        else [r, g, b] = [C, 0, X];

        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255),
            a: a ?? 1,
            };
        }
    return {r:0, g:0, b:0, a:1 };
}


function applyOpacity(color: string, opacity: number): string {
    const { r, g, b } = toRGBA(color);
    const a = Math.max(0, Math.min(1, opacity)); // 클램프 (0~1)
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function useOpacityColor(color: string, opacity: number = 1) {
    return useMemo(() => applyOpacity(color, opacity), [color, opacity]);
}

// ----------------------------------------------------------------
// tip
// 특정 색상 값 RGB, HEX, HSL, CSS 변수 등 모든 색상을 받아
// 원하는 투명도 값을 주어 해당 컬러에 맞는 배경을 줌
// Opacity 1-0 값을 사용 1(보임) - 0(투명)
// 컬러 , 투명도 입력
// import { useOpacityColor } from ""
// const [opacity, setOpacity] = useState(0.8); // 0~1 사이 입력
// const iconColor = "#3366FF";
// const finalColor = useOpacityColor(iconColor, opacity);
// useState 없이 단순히 받아와서 사용해도 됨
// ----------------------------------------------------------------