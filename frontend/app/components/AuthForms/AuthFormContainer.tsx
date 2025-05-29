import React from "react";

export const AuthFormContainer = ({
  formTitle,
  children,
}: {
  formTitle: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mx-auto h-full w-full rounded-md bg-white px-4 py-8 shadow-md md:w-[min(400px,_100%)]">
      <h1 className="x:max-w-[20ch] mx-auto mb-4 text-center text-[1.4rem] font-bold text-[#333]">
        {formTitle}
      </h1>
      {children}
    </div>
  );
};
