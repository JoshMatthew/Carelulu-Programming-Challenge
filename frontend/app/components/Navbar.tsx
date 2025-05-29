import { redirect, useFetcher, useLoaderData } from "@remix-run/react";

type LoaderData = {
  user: {
    username: string;
  } | null;
};

export function Navbar() {
  const logoutFetcher = useFetcher();
  const data = useLoaderData<LoaderData>();

  return (
    <nav className="mb-auto h-[60px] bg-[#4FBBBB]">
      <div
        className={`mx-auto flex h-full w-full items-center px-4 2xl:max-w-[700px] ${data && data.user ? "justify-between" : "justify-center"}`}
      >
        <div>
          <h1 className="font-lexend text-2xl font-bold text-white">
            {data && data.user ? (
              `${data.user.username}'s Tasks`
            ) : (
              <>
                We will take <span className="text-accent">care</span> of your
                tasks
              </>
            )}
          </h1>
        </div>
        {data && data.user && (
          <logoutFetcher.Form method="post" action="/logout" preventScrollReset>
            <button type="submit" className="text-white hover:underline">
              Sign-out
            </button>
          </logoutFetcher.Form>
        )}
      </div>
    </nav>
  );
}
