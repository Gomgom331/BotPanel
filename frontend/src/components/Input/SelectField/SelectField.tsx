import React, { useState, useRef, useEffect } from "react";
import baseStyles from "../../shared/FormControl.module.css" // 공용
import selectStyles from "./SelectField.module.css" // select 용
import Icon from "../../Icon/Icon"


interface Option {
  value: string | number;
  label: string;
}


// select type
interface SelectProps {
  label?: string;
  value?: string | number;
  name?: string;
  options: Option[]; // 옵션의 라벨, 값 
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  // api 관련 
  apiUrl?: string;
  onApiSuccess?: (data: any) => void;
  onApiError?: (error: any) => void;
}

const CustomSelect: React.FC<SelectProps> = ({
  label,
  value,
  name,
  options,
  placeholder = "선책하세요",
  error,
  required = false,
  disabled = false,
  onChange,
  onBlur,
  apiUrl,
  onApiSuccess,
  onApiError,
}) => {
  const [ isOpen, setIsOpen ] = useState(false); // 열림 , 닫힘
  const [ isLoading, setIsLoading ] = useState(false); // 로딩
  const selectRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find(opt => opt.value === value); // value
  const displayText = selectedOption?.label || placeholder; // 보이는 텍스트

  const handleSelect = async (optionValue: string | number) => {
    setIsOpen(false); // 기본 false

    if (onChange) {
      onChange(optionValue);
    }

    // api 전송 (값이 있으면 전송)
    if(apiUrl){
      setIsLoading(true); // 로딩시작
      try{
        const Url = apiUrl.includes('?')
          ? `${apiUrl}&value=${optionValue}`
          : `${apiUrl}?value=${optionValue}`;

          const response = await fetch(Url);
          const data = await response.json();

          if(onApiSuccess){
            onApiSuccess(data);
          }
      
      }catch(err){
        // 에러시
        console.error('API Error : ',err);
        if(onApiError){
          onApiError(err);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  // focus를 벗어났을 때 실행되는 이벤트 핸들러
  const handleBlur = () => {
    if (onBlur){
      onBlur();
    }
  };


  useEffect(() => {
    //셀렉트 박스 마우스 이벤트
    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            handleBlur();
        }
    };
    //
    if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
      <div className={baseStyles.container}>
          {label && (
              <label className={baseStyles.label} htmlFor={name}>
                  {label} {required && <span className={baseStyles.required}>*</span>}
              </label>
          )}
          
          <div className={selectStyles.selectWrapper} ref={selectRef}>
              <div 
                  className={`
                    ${baseStyles.input} 
                    ${selectStyles.selectInput} 
                    ${error ? baseStyles.error : ''} 
                    ${disabled ? baseStyles.disabled : ''}
                    ${isOpen ? selectStyles.open : ''}
                  `}
                  onClick={() => !disabled && setIsOpen(!isOpen)}
                  onBlur={handleBlur}
                  tabIndex={disabled ? -1 : 0}
                  role="button"
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${name}-error` : undefined}
              >
                  <span className={value ? selectStyles.selectedText : selectStyles.placeholderText}>
                      {isLoading ? '로딩 중...' : displayText}
                  </span>
                  <span className={`${selectStyles.arrow} ${isOpen ? selectStyles.arrowOpen : ''}`}>
                      {
                        isLoading ? '로딩 중...' 
                        : <Icon 
                          name='chevronDown'
                          size={9}
                        />
                      }
                  </span>
              </div>
              
              {isOpen && !disabled && (
                  <ul className={`${selectStyles.dropdown} scrollBox`} role="listbox">
                      {options.map((option) => (
                          <li
                              key={option.value}
                              className={`
                                  ${selectStyles.option} 
                                  ${value === option.value ? selectStyles.selectedOption : ''}
                              `}
                              onClick={() => handleSelect(option.value)}
                              role="option"
                              aria-selected={value === option.value}
                          >
                              {option.label}
                          </li>
                      ))}
                  </ul>
              )}
          </div>
          
          {error && (
              <p id={`${name}-error`} className={baseStyles.errorText}>
                  {error}
              </p>
          )}
      </div>
  );


}
  

export default CustomSelect

// value 기본 값 설정 방법
// 아래처럼 변수를 선언 후 기본값이 될 value 값을 넣어준다
// const [selectedValue, setSelectedValue] = useState<string | number>('new');


{/* <CustomSelect
  value={selectedValue}
  options={[
      { value: "new", label: "최신순" },
      { value: "old", label: "오래된순" },
      { value: "old", label: "오래된순" },
      { value: "old", label: "오래된순" },
      { value: "old", label: "오래된순" },
      { value: "old", label: "오래된순" },
      { value: "old", label: "오래된순" },
      { value: "test", label: "select 테스트" }
  ]}
  onChange={(value) => setSelectedValue(value)}
/> */}