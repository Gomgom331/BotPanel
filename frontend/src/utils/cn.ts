// src/utils/cn.ts
// 문자열/객체 형태를 받아 공백으로 합쳐주는 경량 클래스 합성기
export function cn(
    ...inputs: Array<
    string | false | null | undefined | Record<string, boolean>
>): string {
    const out: string[] = [];
    for (const i of inputs) {
    if (!i) continue;
    if (typeof i === "string") {
        out.push(i);
    } else {
        for (const [k, v] of Object.entries(i)) {
        if (v) out.push(k);
        }
    }
    }
    return out.join(" ");
}
