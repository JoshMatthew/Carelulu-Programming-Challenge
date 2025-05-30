import { FetcherWithComponents } from "@remix-run/react";
import { ReactNode } from "react";
import { CgSpinner } from "react-icons/cg";
import { FETCHER_STATE } from "~/lib/constants";

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
        `${fetcher.state !== FETCHER_STATE.SUBMITTING && !icon ? "hidden" : "block"}`
      }
    >
      {fetcher.state === FETCHER_STATE.SUBMITTING ? (
        <CgSpinner className={`${loadingIconClassName} animate-spin`} />
      ) : (
        icon
      )}
    </span>
  );
};
