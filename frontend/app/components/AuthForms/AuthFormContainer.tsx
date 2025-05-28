import React from "react";

export const AuthFormContainer = ({
  formTitle,
  children,
}: {
  formTitle: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-md w-[min(400px,_100%)] mx-auto bg-white shadow-md py-8 px-4">
      <h1 className="text-[1.4rem] text-center text-[#333] font-bold mb-4 x:max-w-[20ch] mx-auto">
        {formTitle}
      </h1>
      {children}
    </div>
  );
};
