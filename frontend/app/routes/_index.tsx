import { ActionFunction, MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { LoaderFunction, redirect } from "react-router";
import { TaskOperations } from "~/lib/types";
import { authenticator, sessionStorage } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "CareLuLu Programming Challenge | Home" },
    {
      property: "og:title",
      content: "Task creator challenge",
    },
    {
      name: "description",
      content:
        "This app is for the CareLuLu programming" +
          " challenge. Backend is mainly created via" +
          " NodeJS, GraphQL, ExpressJS, and MySQL db via" +
          " Prisma. Frontend is by using ReactJS's" +
          " framework" +
          " RemixJS.",
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const operation = formData.get("operation");

  try {
    let user;
    switch (operation) {
      case TaskOperations.SIGN_IN:
        user = await authenticator.authenticate("signin", request);
        break;
      case TaskOperations.SIGN_UP:
        user = await authenticator.authenticate("signup", request);
        break;
      default:
        throw new Error("Invalid form submission");
    }

    const session = await sessionStorage.getSession(
      request.headers.get("cookie")
    );

    session.set("user", user);

    return redirect("/task", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    throw error;
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");

  if (user) return redirect("/task");

  return null;
};

export default function Index() {
  const signInFetcher = useFetcher();
  const signInFormRef = useRef<HTMLFormElement>(null);

  const signUpFetcher = useFetcher();
  const signUpFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (signInFetcher.state === "idle") {
      signInFormRef.current?.reset();
    }
  }, [signInFetcher.state]);

  return (
    <div className="flex-grow font-lexend flex justify-around items-center bg-[#fefefe] 2xl:max-w-[900px] mx-auto">
      <div className="rounded-md max-w-[min(300px,_80%)] mx-auto bg-white shadow-md py-8 px-4">
        <h1 className="text-[1.4rem] text-center text-[#111] font-bold mb-4">
          Start by creating a new user
        </h1>

        <signUpFetcher.Form
          method="post"
          ref={signUpFormRef}
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
        </signUpFetcher.Form>
      </div>

      <span className="text-[2rem]">or</span>

      <div className="rounded-md max-w-[min(300px,_80%)] mx-auto bg-white shadow-md py-8 px-4">
        <h1 className="text-[1.4rem] text-center text-[#111] font-bold mb-4">
          Log in as an existing user
        </h1>

        <signInFetcher.Form
          method="post"
          ref={signInFormRef}
          preventScrollReset
          className="@md:rounded-md mx-auto flex items-center overflow-hidden w-full @md:w-auto flex-col gap-2"
        >
          <div className="bg-red">
            <p>Incorrect password</p>
          </div>
          <input
            type="hidden"
            name="operation"
            value={TaskOperations.SIGN_IN}
          />
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
        </signInFetcher.Form>
      </div>
    </div>
  );
}
