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
      className="mx-auto flex w-full flex-col items-center gap-2 overflow-hidden rounded-md px-2"
    >
      {children}
    </fetcher.Form>
  );
};

export const AuthSubmitBtn = ({ children }: { children: ReactNode }) => {
  return (
    <button
      type="submit"
      className="flex w-full justify-center bg-[#4FBBBB] px-4 py-2 font-lexend text-[#ffffff] outline-none hover:bg-[#5Fcccc]"
    >
      {children}
    </button>
  );
};
