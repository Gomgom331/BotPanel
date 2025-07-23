import React from "react";
import styles from "../../shared/FormControl.module.css"
// import localStyles from "./SelectField.module.css"

interface SelectFieldProps {
  label?: string;
  value?: string | number;
  name?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  name,
  options,
  placeholder,
  error,
  required = false,
  onChange,
  onBlur,
}) => {
  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`${styles.input} ${error ? styles.error : ""}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className={styles.errorText}>
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;