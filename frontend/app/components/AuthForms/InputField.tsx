import React from "react";

export const InputField = ({
  ref,
  name,
  type,
  value,
  changeHandler = undefined,
  placeholder,
  errors,
  errorText,
}: {
  ref?: React.LegacyRef<HTMLInputElement>;
  name: string;
  type: React.HTMLInputTypeAttribute;
  value?: string | number | readonly string[] | undefined;
  changeHandler?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  placeholder: string;
  errors: boolean;
  errorText?: string | undefined;
}) => {
  return (
    <>
      <input
        ref={ref}
        name={name}
        type={type}
        value={value}
        onChange={changeHandler}
        className={`bg-[#ffffff] text-black px-4 py-2 border-2 w-full outline-none font-lexend overflow-hidden ${
          errors ? "border-red-500" : "border-[#4FBBBB]"
        }`}
        placeholder={placeholder}
      />
      {errors && <span className="text-red-500 text-sm">{errorText}</span>}
    </>
  );
};
