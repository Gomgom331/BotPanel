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
  placeholder = "선택해주세요.",
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
  // 키보드 제어
  const [activeIndex, setActiveIndex] = useState(-1) // 활성화된 옵션 인덱스
  const listRef = useRef<HTMLUListElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find(opt => opt.value === value); // value
  const displayText = selectedOption?.label || placeholder; // 보이는 텍스트


  //메뉴 열기
  const openMenu = () => {
    if (!disabled) {
      setIsOpen(true);
      // 현재 선택된 옵션의 인덱스로 설정
      const currentIndex = options.findIndex(opt => opt.value === value);
      setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  };

  // 메뉴 닫기
  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
    triggerRef.current?.focus();
  };


  const handleSelect = async (optionValue: string | number) => {
    setIsOpen(false); // 기본 false

    if (onChange) {
      onChange(optionValue);
    }

    // 트리거로 포커스 복귀
    setTimeout(()=> triggerRef.current?.focus(), 0);

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

  // 트리거 키보드 제어
  const onTriggerKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if(e.key === "ArrowDown" || e.key === "ArrowUp"){
      e.preventDefault();
      openMenu();
      setActiveIndex((idx)=> {
        if(e.key === "ArrowDown") return Math.min(options.length -1, idx + 1);
        return Math.max(0, idx -1);
      });

      setTimeout(() => listRef.current?.focus(), 0);
    }else if(e.key === "Enter" || e.key === " "){

      e.preventDefault();
      isOpen ? close() : openMenu();
      if (!isOpen) setTimeout(()=> listRef.current?.focus(), 0);

    }else if(e.key === "Escape"){

      close();
    }
  };

  // 리스트 키보드 제어
  const onListKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((idx) => Math.min(options.length - 1, idx + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((idx) => Math.max(0, idx - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < options.length) {
        handleSelect(options[activeIndex].value);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close();
    }
  };


  useEffect(() => {
    //셀렉트 박스 마우스 이벤트
    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            setActiveIndex(-1); // 인덱스 초기화
            handleBlur();
        }
    };
    if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  useEffect(()=>{
    if (isOpen && activeIndex >= 0 && listRef.current){
      const activeOption = listRef.current.children[activeIndex] as HTMLElement;
      if (activeOption) {
        activeOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex, isOpen]);

  return (
      <div className={baseStyles.container}>
          {label && (
              <label className={baseStyles.label} htmlFor={name}>
                  {label} {required && <span className={baseStyles.required}>*</span>}
              </label>
          )}
          
          <div className={selectStyles.selectWrapper} ref={selectRef}>
              <div 
                ref={triggerRef} //ref 연결
                className={`
                  ${baseStyles.input} 
                  ${selectStyles.selectInput} 
                  ${error ? baseStyles.error : ''} 
                  ${disabled ? baseStyles.disabled : ''}
                  ${isOpen ? selectStyles.open : ''}
                  borderFocus
                `}
                onClick={() => !disabled && (isOpen ? close() : openMenu())} // close 함수 사용
                onKeyDown={onTriggerKeyDown}
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
                  <ul 
                    ref={listRef}
                    className={
                      `${selectStyles.dropdown} 
                      scrollBox`
                    } 
                    role="listbox" 
                    tabIndex={-1}
                    onKeyDown={onListKeyDown}
                  >
                      {options.map((option, index) => (
                          <li
                              key={option.value}
                              className={`
                                  ${selectStyles.option} 
                                  ${value === option.value ? selectStyles.selectedOption : ''}
                                  ${activeIndex === index ? selectStyles.activeOption : ''}
                              `}
                              onClick={() => handleSelect(option.value)}
                              onMouseEnter={()=> setActiveIndex(index)}
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