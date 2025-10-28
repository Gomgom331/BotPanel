import { useMemo } from "react";
import React { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../../hooks/useLanguage "
import { Icon } from "../../Icon/Icon";

import styles from "./CompanySelector.moduel.css"

const LANGS = [
    { value: "ko", label: "회사1" },
    { value: "en", label: "회사2" },
    { value: "zh", label: "회사3" },
]

const CompanySelector:React.FC = () => {
    const { t } = useLanguage();

    // 현재 선택된 slug
    const selectedIndex = useMemo(

    )

    const selected = LANGS[selectedIndex]
    const [open, setOpen] = useState(false);  // 드롭다운 열린 상태


    /** 키보드 탐색 중 강조 인덱스 (열릴 때 선택값으로 초기화) */
    const [activeIndex, setActiveIndex] = useState<number>(selectedIndex);

    

    function handleChange(){
        
    }

    /** 드롭다운 열기/닫기 */
    const toggle = () => {
        setOpen((v) => {
        const next = !v;
        if (next) setActiveIndex(selectedIndex);
        return next;
        });
    };  
    const close = () => setOpen(false);
    const openMenu = () => {
        setActiveIndex(selectedIndex);
        setOpen(true);
    };

    /** 리스트 키보드 제어 */
    const onListKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(LANGS.length - 1, i + 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(0, i - 1));
        } else if (e.key === "Home") {
            e.preventDefault();
            setActiveIndex(0);
        } else if (e.key === "End") {
            e.preventDefault();
            setActiveIndex(LANGS.length - 1);
        } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectValue(activeIndex);
        } else if (e.key === "Escape") {
            e.preventDefault();
            close();
            triggerRef.current?.focus();
        }
    };
    // 리스트 박스
    const listboxId = "lang-listbox"; 

    return(
        <div className={styles.container}>
            <Icon name="company" size="1.3rem" />
            <div className={styles.selectWrap} data-open={ open ? "true":"false"} ref={wrapRef}>
                <button
                    type="button"
                    className={styles.trigger}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={listboxId}
                    onClick={toggle}
                    onKeyDown={onTriggerKeyDown}
                    ref={triggerRef}
                >
                    <span className={styles.triggerLabel}>{selected?.label ?? "Select"}</span>
                </button>
                <span className={styles.chevron} aria-hidden="true" />

                {/* 드롭다운 목록 */}
                { open && (
                    <ul
                        id={listboxId}
                        role="listbox"
                        tabIndex={-1}
                        className={styles.menu}
                        aria-activedescendant={`lang-opt-${activeIndex}`}
                        onKeyDown={onListKeyDown}
                        ref={listRef}
                    >
                        { LANGS.map((opt, idx) => {
                            const active = activeIndex === idx;
                            return(
                                <li

                                ></li>
                            )
                        }
                        
                        )}
                    </ul>
                )}
            </div>
        </div>
    )

}

export default CompanySelector;