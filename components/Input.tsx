import React, { useState } from "react";
import HideIcon from "../assets/Hide";
import ShowIcon from "../assets/Show";

export interface IFormInputProps {
  label?: string;
  labelHelper?: string;
  placeholder?: string;
  name?: string;
  error?: string | boolean;
  defaultValue?: string | number;
  value?: string | number;
  type?: React.HTMLInputTypeAttribute | "textarea";
  inputClassName?: string;
  labelClassName?: string;
  className?: string;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  icon?: JSX.Element | string;
  required?: boolean;
  disabled?: boolean;
}

const Input = ({
  className,
  labelClassName,
  label,
  labelHelper,
  name,
  onChange,
  onBlur,
  placeholder,
  required,
  disabled,
  defaultValue,
  error,
  type = "text",
}: IFormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type
    ? type === "password"
      ? showPassword === true
        ? "text"
        : "password"
      : type
    : "text";
  return (
    <div className={`w-full flex flex-col items-start mt-3 ${className}`}>
      <label
        htmlFor=""
        className={`text-[15px] text-[#344054] flex gap-2 items-center font-medium mb-[2px] ${labelClassName}`}
      >
        {label} {required ? <span className="text-shades-red">*</span> : ""}{" "}
        {labelHelper ? `-- ${labelHelper}` : ""}
        {type === "password" && (
          <span
            className="cursor-pointer text-[22px]"
            onClick={handleShowPassword}
          >
            {showPassword ? <HideIcon /> : <ShowIcon />}
          </span>
        )}
      </label>
      <input
        type={inputType}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        className={`flex flex-row gap-x-3 justify-center items-center p-2 border-[1.5px] border-[#D0D5DD] focus:border-[#001F5C] ${
          error ? "!border-red-500 !focus:border-red-500" : ""
        } rounded-md bg-transparent text-[14px] w-full text-[#666365]`}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={defaultValue}
      />
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
