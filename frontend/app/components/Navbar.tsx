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
      <div className={`2xl:max-w-[700px] mx-auto w-full flex items-center h-full px-4 ${data && data.user ? 'justify-between' : 'justify-center'}`}>
        <div>
          <h1 className="font-lexend font-bold text-white text-2xl">
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
