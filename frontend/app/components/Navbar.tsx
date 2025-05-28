import { useFetcher } from "@remix-run/react";
import { TaskOperations } from "~/lib/types";

export function Navbar() {
  const logoutFetcher = useFetcher();

  return (
    <nav className="mb-auto h-[60px] bg-[#4FBBBB]">
      <div className="2xl:max-w-[700px] mx-auto w-full flex justify-center items-center h-full">
        <div className="">
          <h1 className="font-lexend font-bold text-white text-2xl">
            We will take <span className="text-[#F15786]">care</span> of your
            tasks
          </h1>
        </div>
        <div>
          <logoutFetcher.Form method="post" action="/logout" preventScrollReset>
            <button type="submit">Signout</button>
          </logoutFetcher.Form>
        </div>
      </div>
    </nav>
  );
}
