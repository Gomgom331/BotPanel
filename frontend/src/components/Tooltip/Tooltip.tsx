
// hover/focus/click 트리거, top/bottom/left/right 배치, delay, 포털 옵션
import React, { useState, useRef, useId, useEffect } from "react";
import ReactDOM from "react-dom";
import { cn } from "../../utils/cn";
import styles from "./Tooltip.module.css";

type Placement = "top" | "bottom" | "left" | "right";
type Trigger = "hover" | "focus" | "click";
type Align = "left" | "center" | "right"

type TooltipProps = {
    children: React.ReactNode;          // 툴팁을 달 요소
    content: React.ReactNode;           // 툴팁 내용
    placement?: Placement;              // 위치
    trigger?: Trigger | Trigger[];      // 트리거
    offset?: number;                    // 간격(px)
    delay?: number;                     // 나타나는 지연(ms)
    disabled?: boolean;
    className?: string;                 // 래퍼 커스텀 클래스
    tooltipClassName?: string;          // 말풍선 커스텀 클래스
    // 상위 컨테이너 overflow 숨김이면 true 권장
    usePortal?: boolean;                // body 포털로 그리기 (overflow 이슈 회피) 
    align?: Align;                     // text 정렬
};

const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    placement = "top",
    trigger = ["hover", "focus"],
    offset = 8,
    delay = 80,
    disabled = false,
    className,
    tooltipClassName,
    usePortal = false,
    align = "center",
}) => {

const id = useId();
const triggers = Array.isArray(trigger) ? trigger : [trigger];
const [open, setOpen] = useState(false);
const [delayed, setDelayed] = useState(false);
const timerRef = useRef<number | null>(null);
const anchorRef = useRef<HTMLDivElement>(null);
const tipRef = useRef<HTMLDivElement>(null);

// open 지연 처리
useEffect(() => {
if (!open) {
    setDelayed(false);
    return;
}
timerRef.current = window.setTimeout(() => setDelayed(true), delay);
return () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
};
}, [open, delay]);

// 클릭 바깥 감지 (trigger에 click 포함 시)
useEffect(() => {
if (!open || !triggers.includes("click")) return;
const onDoc = (e: MouseEvent) => {
    if (!anchorRef.current) return;
    if (!anchorRef.current.contains(e.target as Node)) setOpen(false);
};

document.addEventListener("mousedown", onDoc);
return () => document.removeEventListener("mousedown", onDoc);
}, [open, triggers]);

// 이벤트
const show = () => !disabled && setOpen(true);
const hide = () => setOpen(false);
const toggle = () => (!disabled && setOpen((v) => !v));

const onMouseEnter = triggers.includes("hover") ? show : undefined;
const onMouseLeave = triggers.includes("hover") ? hide : undefined;
const onFocus = triggers.includes("focus") ? show : undefined;
const onBlur = triggers.includes("focus") ? hide : undefined;
const onClick = triggers.includes("click") ? toggle : undefined;

// 위치 계산: anchor를 relative, tooltip을 absolute로 두고 CSS로 배치
// 포털일 경우엔 화면 기준(fixed) 배치로 전환
const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

useEffect(() => {
    if (!open || !delayed) return;
    const anchor = anchorRef.current;
    const tip = tipRef.current;
    if (!anchor || !tip) return;

    const a = anchor.getBoundingClientRect();
    const t = tip.getBoundingClientRect();

    let top = 0, left = 0;
    switch (placement) {
        case "top":
        top = a.top - t.height - offset;
        left = a.left + a.width / 2 - t.width / 2;
        break;
        case "bottom":
        top = a.bottom + offset;
        left = a.left + a.width / 2 - t.width / 2;
        break;
        case "left":
        top = a.top + a.height / 2 - t.height / 2;
        left = a.left - t.width - offset;
        break;
        case "right":
        top = a.top + a.height / 2 - t.height / 2;
        left = a.right + offset;
        break;
    }
    setCoords({ top, left });
}, [open, delayed, placement, offset, content]);

const tipNode = delayed && open && !disabled ? (
<div
    ref={tipRef}
    role="tooltip"
    id={id}
    className={cn(styles.tooltip, styles[placement], tooltipClassName)}
    style={
        {...(usePortal && coords
            ? { position: "fixed", top: coords.top, left: coords.left }
            : {}),
        textAlign: align,}
    }
>
    {content}
    <span className={styles.arrow} />
</div>
) : null;

return (
<div
    ref={anchorRef}
    className={cn(styles.anchor, className)}
    aria-describedby={open ? id : undefined}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onFocus={onFocus}
    onBlur={onBlur}
    onClick={onClick}
>
    {children}
    {/* 포털이 아니면 로컬에 붙임 */}
    {!usePortal && tipNode}
    {/* 포털이면 body에 붙임 */}
    {usePortal && tipNode
    ? ReactDOM.createPortal(tipNode, document.body)
    : null}
</div>
);};

export default Tooltip;