import * as React from 'react'

const textInputClasses =
  'p-1 rounded border-2 border-gray-400 focus:border-gray-800';

interface RadioButtonProps {
  name: string;
  value: string;
  label: string;
  defaultChecked?: boolean;
  inputRef: any;
}
export const RadioButton = ({
  name,
  value,
  label,
  defaultChecked = false,
  inputRef,
}: RadioButtonProps) => {
  return (
    <div className="flex">
      <input
        type="radio"
        name={name}
        id={value}
        value={value}
        ref={inputRef}
        defaultChecked={defaultChecked}
        className="h-8 pt-1"
      />
      <label htmlFor={value} className="h-8 pl-2 py-1">
        {label}
      </label>
    </div>
  );
};

interface TextInputProps {
  name: string;
  label: string;
  placeholder: string;
  inputRef: any;
  type?: string
}
export const TextInput = ({
  label,
  name,
  placeholder,
  inputRef,
  type = "text"
}: TextInputProps) => {
  return (
    <div className="flex flex-col py-2">
      <label
        className="uppercase text-xs tracking-wider font-bold text-gray-600"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className={textInputClasses}
        placeholder={placeholder}
        name={name}
        id={name}
        ref={inputRef}
        type={type}
      />
    </div>
  );
};
