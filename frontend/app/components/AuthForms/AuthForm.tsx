import { HTMLFormMethod } from "@remix-run/router";
import React, { ReactNode } from "react";
import { FetcherWithComponents } from "@remix-run/react";

export const AuthForm = ({
  method,
  ref,
  submitHandler,
  children,
  fetcher,
}: {
  method: HTMLFormMethod;
  ref: React.LegacyRef<HTMLFormElement>;
  submitHandler: React.FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  fetcher: FetcherWithComponents<unknown>;
}) => {
  return (
    <fetcher.Form
      method={method}
      ref={ref}
      preventScrollReset
      onSubmit={submitHandler}
      className="rounded-md mx-auto flex items-center overflow-hidden w-full flex-col gap-2 px-2"
    >
      {children}
    </fetcher.Form>
  );
};

export const AuthSubmitBtn = ({ children }: { children: ReactNode }) => {
  return (
    <button
      type="submit"
      className="text-[#ffffff] px-4 py-2 w-full outline-none bg-[#4FBBBB] hover:bg-[#5Fcccc] font-lexend"
    >
      {children}
    </button>
  );
};
