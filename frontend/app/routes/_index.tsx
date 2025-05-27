import { ActionFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { LoaderFunction, redirect } from "react-router";
import { TaskOperations } from "~/lib/types";
import { authenticator, sessionStorage } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  // const formData = await request.formData();

  console.log("JM", request);

  try {
    let user = await authenticator.authenticate("user-pass", request);
    let session = await sessionStorage.getSession(
      request.headers.get("cookie")
    );

    session.set("user", user);

    return redirect("/task", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
    // switch (operation) {
    //   case TaskOperations.SIGN_IN:
    //     let user = await authenticator.authenticate("user-pass", request);
    //     let session = await sessionStorage.getSession(
    //       request.headers.get("cookie")
    //     );

    //     session.set("user", user);

    //     return redirect("/task", {
    //       headers: {
    //         "Set-Cookie": await sessionStorage.commitSession(session),
    //       },
    //     });

    //   default:
    //     return redirect("/task");
    // }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    throw error;
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");

  if (user) return redirect("/task");

  return null;
};

export default function Index() {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle") {
      formRef.current?.reset();
    }
  }, [fetcher.state]);

  return (
    <div className="flex-grow font-lexend flex justify-around items-center bg-[#fefefe] 2xl:max-w-[900px] mx-auto">
      <div className="rounded-md max-w-[min(300px,_80%)] mx-auto bg-white shadow-md py-8 px-4">
        <h1 className="text-[1.4rem] text-center text-[#111] font-bold mb-4">
          Start by creating a new user
        </h1>

        <fetcher.Form
          method="post"
          ref={formRef}
          preventScrollReset
          className="@md:rounded-md mx-auto flex items-center overflow-hidden w-full @md:w-auto flex-col gap-2"
        >
          <input
            type="hidden"
            name="operation"
            value={TaskOperations.SIGN_UP}
          />
          <input
            name="email"
            type="text"
            className="bg-[#ffffff] text-black px-4 py-2 border-2 w-full outline-none border-[#4FBBBB] font-lexend"
            placeholder="Username"
          />
          <input
            name="password"
            type="password"
            className="bg-[#ffffff] text-black px-4 py-2 border-2 w-full outline-none border-[#4FBBBB] font-lexend"
            placeholder="Password"
          />
          <input
            name="repeatedPassword"
            type="password"
            className="bg-[#ffffff] text-black px-4 py-2 border-2 w-full outline-none border-[#4FBBBB] font-lexend"
            placeholder="Repeat password"
          />
          <button
            type="submit"
            className="text-[#ffffff] px-4 py-2 w-full outline-none bg-[#4FBBBB] hover:bg-[#5Fcccc] font-lexend"
          >
            Create and log in
          </button>
        </fetcher.Form>
      </div>

      <span className="text-[2rem]">or</span>

      <div className="rounded-md max-w-[min(300px,_80%)] mx-auto bg-white shadow-md py-8 px-4">
        <h1 className="text-[1.4rem] text-center text-[#111] font-bold mb-4">
          Log in as an existing user
        </h1>

        <fetcher.Form
          method="post"
          ref={formRef}
          preventScrollReset
          className="@md:rounded-md mx-auto flex items-center overflow-hidden w-full @md:w-auto flex-col gap-2"
        >
          {/* <input
            type="hidden"
            name="operation"
            value={TaskOperations.SIGN_IN}
          /> */}
          <input
            name="email"
            type="text"
            className="bg-[#ffffff] text-black px-4 py-2 border-2 w-full outline-none border-[#4FBBBB] font-lexend"
            placeholder="Username"
            required
          />
          <input
            name="password"
            type="password"
            className="bg-[#ffffff] text-black px-4 py-2 border-2 w-full outline-none border-[#4FBBBB] font-lexend"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="text-[#ffffff] px-4 py-2 w-full outline-none bg-[#4FBBBB] hover:bg-[#5Fcccc] font-lexend"
          >
            Log in
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
