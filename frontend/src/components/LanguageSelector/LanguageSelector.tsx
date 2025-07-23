import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation(); // ✅ 여기에서 i18n 구조분해

  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select onChange={handleChangeLang} value={i18n.language}>
      <option value="ko">한국어</option>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  );
};

export default LanguageSelector;
