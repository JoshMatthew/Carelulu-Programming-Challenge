import { Outlet } from "@remix-run/react";
import { useToggle } from "./ToggleContentContext";

export const TaskDetail = () => {
  const { isOn } = useToggle();

  return (
    <>
      {isOn && (
        <div className="fade-in fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center bg-[#11111160]">
          <div
            className={`mt-auto max-w-full transition-all duration-500 ease-in-out md:mt-0`}
          >
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};
