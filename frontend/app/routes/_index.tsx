import { ActionFunction, MetaFunction } from "@remix-run/node";
import {
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router";
import { TaskOperations, User } from "~/lib/types";
import { authenticator, sessionStorage } from "~/services/auth.server";
import { SignInForm } from "~/components/AuthForms/SignInForm";
import { SignUpForm } from "~/components/AuthForms/SignUpForm";
import { useSearchParams } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "CareTask - CareLuLu Programming Challenge" },
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

export const action: ActionFunction = async ({ request, params }) => {
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
      request.headers.get("cookie"),
    );

    if (user.error) {
      return {
        error: user.error,
      };
    }

    if (user.token) {
      session.set("user", user);
      return redirect("/task", {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    throw error;
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );

  const user: User = session.get("user");

  if (user) return redirect("/task");

  return null;
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const showSignUp = searchParams.get("signup") === "true";

  return (
    <div className="mx-auto flex w-full flex-grow justify-center bg-[#fefefe] font-lexend md:items-start">
      <div className="mt-[7rem] w-full">
        {showSignUp ? <SignUpForm /> : <SignInForm />}
      </div>
    </div>
  );
}
