import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSwitchCompany } from "../../../hooks/useSwitchCompany";
import { useActiveCompany } from "../../../hooks/useActiveCompany";
import { useUser } from "../../../hooks/useUser";
import { useTranslation } from "react-i18next";



import Icon from "../../Icon/Icon";
import styles from "./CompanySelector.module.css";
import Tooltip from "../../Tooltip/Tooltip";

const CompanySelector: React.FC = () => {
    const [ t ] = useTranslation(); // 언어설정
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

    const { groups = [] } = useUser();
    const { activeSlug } = useActiveCompany();
    const { switchTo } = useSwitchCompany();

    /** 현재 선택된 그룹 인덱스 (없으면 0으로 보정) */
    const selectedIndex = useMemo(() => {
        const idx = groups.findIndex((g) => g.slug === activeSlug);
        return Math.max(0, idx);
    }, [groups, activeSlug]);

    /** 현재 선택된 그룹 객체 */
    const selected = groups[selectedIndex];

    /** 키보드 탐색용 활성 인덱스 (열릴 때 현재 선택값으로 초기화) */
    const [activeIndex, setActiveIndex] = useState<number>(selectedIndex);
    useEffect(() => {
        if (open) setActiveIndex(selectedIndex);
    }, [open, selectedIndex]);

    /** 열기/닫기 */
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

    /** 바깥 클릭 닫기 */
    useEffect(() => {
        if (!open) return;
        const onDown = (e: PointerEvent) => {
        if (!wrapRef.current?.contains(e.target as Node)) close();
        };
        window.addEventListener("pointerdown", onDown, { capture: true });
        return () =>
        window.removeEventListener(
            "pointerdown",
            onDown as any,
            // 일부 타입 충돌 회피
            { capture: true } as any
        );
    }, [open]);

    /** 활성 항목 뷰포트 보정 */
    useEffect(() => {
        if (!open) return;
        const el = itemRefs.current[activeIndex];
        el?.scrollIntoView({ block: "nearest" });
    }, [open, activeIndex]);

    /** 항목 선택 */
    const selectValue = async (idx: number) => {
        const next = groups[idx];
        if (!next) return;
        if (next.slug && next.slug !== activeSlug) {
        // 그룹 전환
        try {
            await switchTo(next.slug);
        } catch (e) {
            // 필요 시 에러 토스트/로그
            console.error("Failed to switch company:", e);
        }
        }
        close();
        // 포커스 복귀 (접근성)
        triggerRef.current?.focus();
    };

    /** 트리거 키보드 제어 (언어 셀렉터와 동일 패턴) */
    const onTriggerKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openMenu();
        setActiveIndex((idx) => {
            if (e.key === "ArrowDown") return Math.min(groups.length - 1, idx + 1);
            return Math.max(0, idx - 1);
        });
        // 리스트로 포커스 이동
        setTimeout(() => listRef.current?.focus(), 0);
        } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open ? close() : openMenu();
        if (!open) setTimeout(() => listRef.current?.focus(), 0);
        } else if (e.key === "Escape") {
        close();
        }
    };

    /** 리스트 키보드 제어 (Home/End/Enter/Space/Escape 포함) */
    const onListKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (e) => {
        if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(groups.length - 1, i + 1));
        } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        } else if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
        } else if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(groups.length - 1);
        } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectValue(activeIndex);
        } else if (e.key === "Escape") {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
        }
    };

    const listboxId = "company-listbox";

    return (
        <div className={styles.container}>
            <Tooltip
                content={t("tooltip.changeCompany")}
                placement="bottom"
            >
                <span className={styles.iconBox}>
                    <Icon name="company" size={"0.9rem"} />
                </span>
            </Tooltip>
            <p className={styles.textTitle}>{t('group.company')}</p>
            <div
                className={styles.selectWrap}
                data-open={open ? "true" : "false"}
                ref={wrapRef}
            >
                {/* 트리거 */}
                <button
                    type="button"
                    className={`${styles.trigger} borderFocus`}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={listboxId}
                    onClick={toggle}
                    onKeyDown={onTriggerKeyDown}
                    ref={triggerRef}
                >
                    <span className={styles.triggerLabel}>
                        {selected?.name ?? "Select"}
                    </span>
                </button>
                <span className={styles.chevron} aria-hidden="true" />

                {/* 드롭다운 목록 */}
                {open && (
                <ul
                    id={listboxId}
                    role="listbox"
                    tabIndex={-1}
                    className={styles.menu}
                    aria-activedescendant={`company-opt-${activeIndex}`}
                    onKeyDown={onListKeyDown}
                    ref={listRef}
                >
                    {groups.map((g, idx) => {
                    const isSelected = g.slug === activeSlug;
                    const isActive = activeIndex === idx;
                    return (
                        <li
                            id={`company-opt-${idx}`}
                            key={g.slug ?? `g-${g.id}-${idx}`}
                            role="option"
                            aria-selected={isSelected}
                            className={[
                                styles.option,
                                isSelected ? styles.optionSelected : "",
                                isActive ? styles.optionActive : "",
                            ].join(" ")}
                            ref={(el) => {
                                itemRefs.current[idx] = el;
                            }}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onMouseDown={(e) => e.preventDefault()} // 포커스 손실 방지
                            onClick={() => selectValue(idx)}
                            >
                            <span className={styles.optionLabel}>{g.name}</span>
                            {isSelected && (
                                <span className={styles.check} aria-hidden>
                                ✓
                                </span>
                            )}
                        </li>
                    );
                    })}
                </ul>
                )}
            </div>
        </div>
    );
    };

export default CompanySelector;
