import { ReactNode } from "react";

export default function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`block text-[0.6rem] font-lexend text-[#ededed] bg-[#105050] py-[2.5px] px-[9px] rounded-[30px] text-center ${className}`}
    >
      {children}
    </p>
  );
}
