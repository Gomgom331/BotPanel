import { Control, FieldValues, FieldErrors } from "react-hook-form";
import { TFunction } from "i18next";

// Form/AutoFormField.tsx , types/form.ts, hooks/useCommonForm.ts => 연결되어 있으니 문제가 생기거나
// 수정시에는 해당 파일 체크하기

export type ValueType = 
  | "string"
  | "number"
  | "boolean"
  | "password" // 패스워드 눈 아이콘 이벤트 포함
  | "email" // 복합 컴포넌트
  | "phone" // 복합 컴포넌트
  | "select" // 단순 select 
  | "date"
  | "file" // 첨부파일 
  | "radio"
  | "checkBox" // 체크 ()
  | "toggleBtn" //토글형식 버튼 첨부


  // 각 필드 항목 구성
  export interface FieldConfig<T extends FieldValues>{
    name: keyof T;
    label: string;
    type?: ValueType;
    errorKey: string;
    height?: string | number;
    // select, radio 등 옵션이 필요한 경우 추가 가능
    // option?: { label: string; value: string | number }; \
    options?: string[];
    placeholder?: string;
  }

  export interface AutoFormFieldProps<T extends FieldValues>{
    fields: FieldConfig<T>[];
    control: Control<T>;
    errors: FieldErrors<T>;
    onChange:(
      fieldName: keyof T,
      type?: ValueType
    )=>(e: React.ChangeEvent<HTMLInputElement>)=> void;
    t: TFunction
  }

