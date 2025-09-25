import React from "react";
import { Controller } from "react-hook-form";
import { AutoFormFieldProps, ValueType } from "../../types/form";
import { toI18nKey } from "../../constants/errorMessages"

//필드별 대응 컴포넌트
import TextField from "../Input/TextField/TextField"; //기본 텍스트필드
import PasswordField from "../Input/PasswordField/PasswordField"; // 패스워드 필드 (눈 아이콘)
import SelectField from "../Input/SelectField/SelectField";

// Form/AutoFormField.tsx , types/form.ts, hooks/useCommonForm.ts => 연결되어 있으니 문제가 생기거나
// 수정시에는 해당 파일 체크하기


const fieldComponentMap: Record<ValueType, React.FC<any>> = {
  string: TextField,
  number: TextField,
  password: PasswordField,
  select: SelectField,
  // 아래필드 생성 후 추가해주기
  boolean: TextField, // TODO: Implement BooleanField
  email: TextField, // TODO: Implement EmailField
  phone: TextField, // TODO: Implement PhoneField
  date: TextField, // TODO: Implement DateField
  file: TextField, // TODO: Implement FileField
  radio: TextField, // TODO: Implement RadioField
  checkBox: TextField, // TODO: Implement CheckBoxField
  toggleBtn: TextField, // TODO: Implement ToggleButtonField
}

const AutoFormField = <T extends Record<string, any>>({
    fields,
    control,
    errors,
    onChange,
    t,
}: AutoFormFieldProps<T>) => {
  return(
    <>
      {fields.map((field) => {
        const Component = fieldComponentMap[field.type ?? "string"];

        return (
          <Controller
            key={String(field.name)}
            name={field.name as any}
            control={control}
            // required는 React Hook Form이 해당 입력 필드가 반드시 값이 있어야 한다는 유효성 검사
            rules={((): any => {
              const r: any = {};
              if (field.errorKey) r.required = t(toI18nKey(field.errorKey));
              return r;
            })()}
            render={({ field: controllerField }) => (
              <Component
                {...controllerField}
                name={String(field.name)}
                label={field.label}
                error={errors[field.name]?.message as string}
                onChange={onChange(field.name, field.type)}
                height={field.height}
                placeholder={field.placeholder}
                options={field.options} // select, radio 등에서 사용
              />
            )}
          />
        );
      })}
    </>
  )
}

export default AutoFormField