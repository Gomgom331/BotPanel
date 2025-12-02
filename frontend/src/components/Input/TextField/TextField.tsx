import React from "react";
import styles from "../../shared/FormControl.module.css";

interface TextFieldProps {
  type?: string;
  label?: string;
  value?: string | number;
  name?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  height?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  type = "text",
  label,
  value,
  name,
  placeholder,
  error,
  required = false,
  height,
  onChange,
  onBlur,
}) => {

  // 높이 강제조절
  const inputStyle = {
    ...(height && { height: height, minHeight: height })
  }


  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`${styles.input} ${error ? styles.error : ""} inputFocus`}
        style={inputStyle}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className={styles.errorText}>
          <span>ⓘ</span> {error}
        </p>
      )}
    </div>
  );
};

export default TextField;