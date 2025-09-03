// 공용 펌 이벤트
// 1. react-hook-form 기본설정과 초기화
// 2. 다국어 변경시 에러 초기화
// 3. 필드의 타입에 따라 적절히 setValue()
// 4. t 번역 함수 제공 <<  useTranslation의 t를 컴포넌트에서 쉽게 접근 가능하게 반환

// Form/AutoFormField.tsx , types/form.ts, hooks/useCommonForm.ts => 연결되어 있으니 문제가 생기거나
// 수정시에는 해당 파일 체크하기

import {
  useForm,
  FieldValues,
  UseFormProps,
  UseFormReturn,
  Path,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

//  모든 입력 타입 정의 (form.ts와 일치시켜야 함)
export type ValueType =
  | "string"
  | "number"
  | "boolean"
  | "password"
  | "email"
  | "phone"
  | "select"
  | "date"
  | "file"
  | "radio"
  | "checkBox"
  | "toggleBtn";

export const useCommonForm = <T extends FieldValues>(
  fieldNames: (keyof T)[],
  options?: UseFormProps<T>
): {
  t: ReturnType<typeof useTranslation>["t"];
  createChangeHandler: (
    fieldName: keyof T,
    type?: ValueType
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
} & UseFormReturn<T> => {
  const { t, i18n } = useTranslation();
  const methods = useForm<T>({ mode: "onSubmit", ...options });
  const { clearErrors, setValue } = methods;

  // 언어 변경 시 에러 초기화 (예: 다국어 메시지 반영)
  const stableFieldNames = useRef(fieldNames);
  useEffect(() => {
    stableFieldNames.current.forEach((name) => {
      clearErrors(name as Path<T>);
    });
  }, [i18n.language, clearErrors]);

  // 필드 onChange 핸들러
  const createChangeHandler = (
    fieldName: keyof T,
    type: ValueType = "string"
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    let value: any = raw;
    if (type === "number") value = Number(raw);
    else if (type === "boolean") value = raw === "true";

    setValue(fieldName as Path<T>, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return { t, createChangeHandler, ...methods };
};