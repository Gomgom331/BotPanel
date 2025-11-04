import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";


import Icon from "../../Icon/Icon";
import styles from "./LanguageSelector.module.css";
import Tooltip from "../../Tooltip/Tooltip";


/** 선택 가능한 언어 목록 */
const LANGS = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  /** 현재 선택된 언어의 인덱스와 라벨 계산 */
  const selectedIndex = useMemo(
    () => Math.max(0, LANGS.findIndex((l) => l.value === i18n.language)),
    [i18n.language]
  );
  const selected = LANGS[selectedIndex];

  /** 키보드 탐색 중 강조 인덱스 (열릴 때 선택값으로 초기화) */
  const [activeIndex, setActiveIndex] = useState<number>(selectedIndex);

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

  /** 바깥 클릭 닫기 */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    window.addEventListener("pointerdown", onDown, { capture: true });
    return () => window.removeEventListener("pointerdown", onDown, { capture: true } as any);
  }, [open]);

  /** 활성 항목이 바뀌면 보이도록 스크롤 */
  useEffect(() => {
    if (!open) return;
    const el = itemRefs.current[activeIndex];
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  /** 항목 선택 */
  const selectValue = (idx: number) => {
    const next = LANGS[idx];
    if (!next) return;
    if (next.value !== i18n.language) {
      i18n.changeLanguage(next.value);
    }
    close();
    // 트리거로 포커스 복귀 (접근성)
    triggerRef.current?.focus();
  };

  /** 트리거 키보드 제어 */
  const onTriggerKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu();
      // ArrowDown은 다음, ArrowUp은 이전으로 활성화
      setActiveIndex((idx) => {
        if (e.key === "ArrowDown") return Math.min(LANGS.length - 1, idx + 1);
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

  const listboxId = "lang-listbox";
  const [ t ] = useTranslation(); 

  return (
    
      <div className={styles.container}>
        <Tooltip
          content={t("tooltip.languageSetting")}
          placement="bottom"
        >
          <Icon name="language" size={"1.2rem"} />
        </Tooltip>
        <div className={styles.selectWrap} data-open={open ? "true" : "false"} ref={wrapRef}>
          {/* 트리거 (닫힌 상태 표시 + 열기/닫기) */}
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
          {open && (
            <ul
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              className={styles.menu}
              aria-activedescendant={`lang-opt-${activeIndex}`}
              onKeyDown={onListKeyDown}
              ref={listRef}
            >
              {LANGS.map((opt, idx) => {
                const selected = i18n.language === opt.value;
                const active = activeIndex === idx;
                return (
                  <li
                    id={`lang-opt-${idx}`}
                    key={opt.value}
                    role="option"
                    aria-selected={selected}
                    className={[
                      styles.option,
                      selected ? styles.optionSelected : "",
                      active ? styles.optionActive : "",
                    ].join(" ")}
                    ref={(el) => { itemRefs.current[idx] = el; }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()} // 포커스 손실 방지
                    onClick={() => selectValue(idx)}
                  >
                    <span className={styles.optionLabel}>{opt.label}</span>
                    {selected && <span className={styles.check} aria-hidden>✓</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
  );
};

export default LanguageSelector;