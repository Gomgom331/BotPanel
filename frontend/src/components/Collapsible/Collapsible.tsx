import React, { useEffect, useRef } from "react";

/**
 * 접히는 애니메이션용 래퍼
 * - isOpen 기준으로 height 0 ↔ 내용 높이(px) 를 애니메이션
 * - 짧은 콘텐츠 / 긴 콘텐츠 모두 부드럽게 작동해야 함
 *
 * @example
 * <Collapsible isOpen={isOpen}>
 *   <div>자식 메뉴들...</div>
 * </Collapsible>
 */


type CollapsibleProps = {
    isOpen: boolean;
    children: React.ReactNode;
};

const Collapsible: React.FC<CollapsibleProps> = ({ isOpen, children }) => {
    const ref = useRef<HTMLDivElement | null>(null); // dom 요소를 직접 참조 (접근)
    const firstRenderRef = useRef(true);

    useEffect(() => {
        const el = ref.current; // 돔객체 전체 불러오기
        if (!el) return;

        const duration = 280; // 속도 너무 빠르면 값 높이기

        el.style.transition = `
            height ${duration}ms ease-in-out,
            opacity ${duration}ms ease-in-out,
            transform ${duration}ms ease-in-out
        `;

        // 닫힌 상태에서 포인터 이벤트를 비활성화 (teb, click 접근성을 차단)
        if(!isOpen){
            el.style.pointerEvents = 'none';
        }else{
            el.style.pointerEvents = 'auto';
        }

        // 첫 렌더에서 isOpen=true 인 경우: 그냥 펼쳐진 상태로 두고 애니메이션은 생략
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
        if (isOpen) {
            el.style.height = "auto";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            el.style.display = "block"
        } else {
            el.style.height = "0px";
            el.style.opacity = "0";
            el.style.transform = "translateY(-4px)";
            el.style.display = "none"
        }
            return;
        }

        if (isOpen){
            // 메뉴가 열릴 때
            el.style.willChange = "height, opacity, transform";

            // 0으로 고정
            el.style.height = "0px";
            el.style.opacity = "0";
            el.style.transform = "translateY(-4px)";
            el.style.display = "block"

            requestAnimationFrame(() => {
                // 다음 프레임에서 0 => 실제 높이로 변환
                const target = el.scrollHeight; // 메뉴 실제 높이
                el.style.height = `${target}px`;
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            });

            const onEnd = (e: TransitionEvent) => {
                if (e.propertyName !== "height") return;
                el.style.height = "auto"; // 나중에 내용이 늘어도 자연스럽게
                el.style.willChange = "auto";
                el.removeEventListener("transitionend", onEnd);
                // 포인트 이벤트 활성화
                el.style.pointerEvents = "auto";
            };
            el.addEventListener("transitionend", onEnd);

        } else {
            // 열린 상태에서 닫힐때
            el.style.willChange = "height, opacity, transform";

            // auto 상태일 수 있으니, 현재 실제 픽셀 높이로 잠그기
            const current = el.scrollHeight;
            el.style.willChange = "height, opacity, transform";
            el.style.height = `${current}px`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";

            // 다음 프레임에서는 0으로 수축
            requestAnimationFrame(()=>{
                el.style.height = "0px";
                el.style.opacity = "0";
                el.style.transform = "translateY(-4px)";
            });
            
            // 비활성화
            el.style.pointerEvents = "none"

            const onEnd = (e: TransitionEvent) => {
                if (e.propertyName !== "height") return;
                el.style.willChange = "auto";
                el.removeEventListener("transitionend", onEnd);

                // 디스플레이 비활성화
                el.style.display = "none";
            };
            el.addEventListener("transitionend", onEnd);
        }
    }, [isOpen]);

    return(
        <div
            ref={ref}
            aria-hidden={!isOpen}
            style={{
                overflow: "hidden",
            }}
        >
            {children}
        </div>
    );
};

export default Collapsible;