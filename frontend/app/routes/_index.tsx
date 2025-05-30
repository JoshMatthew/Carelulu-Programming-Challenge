import { ActionFunction, MetaFunction } from "@remix-run/node";
import { LoaderFunction, redirect } from "react-router";
import { User } from "~/lib/types";
import { authenticator, sessionStorage } from "~/services/auth.server";
import { SignInForm } from "~/components/AuthForms/SignInForm";
import { SignUpForm } from "~/components/AuthForms/SignUpForm";
import { useSearchParams } from "@remix-run/react";
import {
  APP_ROUTES,
  AUTHENTICATOR,
  FORM_FIELD,
  HTTP_HEADER,
  SESSION,
  SESSION_COOKIE,
  API_OPERATIONS,
} from "~/lib/constants";

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

export const action: ActionFunction = async ({ request, params }) => {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const operation = formData.get(FORM_FIELD.OPERATION);

  try {
    let user;
    switch (operation) {
      case API_OPERATIONS.SIGN_IN:
        user = await authenticator.authenticate(AUTHENTICATOR.SIGN_IN, request);
        break;
      case API_OPERATIONS.SIGN_UP:
        user = await authenticator.authenticate(AUTHENTICATOR.SIGN_UP, request);
        break;
      default:
        throw new Error("Invalid form submission");
    }

    const session = await sessionStorage.getSession(
      request.headers.get(SESSION_COOKIE),
    );

    if (user.error) {
      return {
        error: user.error,
      };
    }

    if (user.token) {
      session.set(SESSION.USER, user);
      return redirect(APP_ROUTES.TASK, {
        headers: {
          [HTTP_HEADER.SET_COOKIE]: await sessionStorage.commitSession(session),
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
    request.headers.get(SESSION_COOKIE),
  );

  const user: User = session.get(SESSION.USER);

  if (user) return redirect(APP_ROUTES.TASK);

  return null;
};

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
