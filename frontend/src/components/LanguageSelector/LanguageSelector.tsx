// import React from "react";
// import { useTranslation } from "react-i18next";
// import Icon from "../Icon/Icon"

// import styles from "./LanguageSelector.module.css"

// const LanguageSelector: React.FC = () => {
//   const { i18n } = useTranslation(); // ✅ 여기에서 i18n 구조분해

//   const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     i18n.changeLanguage(e.target.value);
//   };

//   return (
//     <div className={styles.container}>
//       <Icon name="language" size={16}/>
//       {/* <span>Languge</span> */}
//       <select onChange={handleChangeLang} value={i18n.language}>
//         <option value="ko">한국어</option>
//         <option value="en">English</option>
//         <option value="zh">中文</option>
//       </select>
//     </div>
//   );
// };

// export default LanguageSelector;

// src/components/LanguageSelector/LanguageSelector.tsx
// 컴포넌트: LanguageSelector
import React, {useState, useRef} from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon/Icon";

import styles from "./LanguageSelector.module.css";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const next = e.target.value;
  if (next !== i18n.language) i18n.changeLanguage(next);
  setOpen(false);
  e.currentTarget.blur(); // 선택 후 포커스 제거(화살표 원복 보장)
};

  // 이벤트
  // const handleFocus = () => setOpen(true);
  // const handleBlur = () => setOpen(false);

  // const handleMouseDown = () => setOpen((v) => !v);
  // const handleKeyDown: React.KeyboardEventHandler<HTMLSelectElement> = (e) => {
  //   // 키보드로 드롭다운을 열 때(스페이스/엔터)도 open 추정
  //   if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
  //     setOpen((v) => !v);
  //   }
  // };

  return (
    <div className={styles.container}>
      <Icon name="language" size={18} />
      <div 
        className={styles.selectWrap}
        data-open={open ? "true" : "false"}
        ref={wrapRef}
      >
        <select
          aria-label="Select language"
          className={styles.select}
          onChange={handleChangeLang}
          value={i18n.language}
          // 이벤트
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onMouseDown={() => setOpen(v => !v)}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
              setOpen(v => !v);
          }
  }}
        >
          <option className={styles.options} value="ko">한국어</option>
          <option className={styles.options} value="en">English</option>
          <option className={styles.options} value="zh">中文</option>
        </select>
        {/* 화살표 아이콘 */}
        <span className={styles.chevron} aria-hidden="true" />
      </div>
    </div>
  );
};

export default LanguageSelector;
