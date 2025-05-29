import { FetcherWithComponents } from "@remix-run/react";
import { ReactNode } from "react";
import { CgSpinner } from "react-icons/cg";

export const LoadingIcon = ({
  fetcher,
  icon,
  className = "",
  loadingIconClassName = "",
}: {
  fetcher: FetcherWithComponents<unknown>;
  icon?: ReactNode;
  className?: string;
  loadingIconClassName?: string;
}) => {
  return (
    <span
      className={
        className +
        `${fetcher.state !== "submitting" && !icon ? "hidden" : "block"}`
      }
    >
      {fetcher.state === "submitting" ? (
        <CgSpinner className={`${loadingIconClassName} animate-spin`} />
      ) : (
        icon
      )}
    </span>
  );
};
