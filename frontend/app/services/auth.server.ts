import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { SigninUserMutation, SignupUserMutation } from "~/lib/graphql";
import { FormStrategy } from "remix-auth-form";
import { User } from "~/lib/types";
import { gqlClient } from "~/lib/graphql-client";
import {
  APP_ROUTES,
  AUTHENTICATOR,
  FORM_NAME,
  HTTP_HEADER,
  SESSION,
  SESSION_COOKIE,
} from "~/lib/constants";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["secret_demo_only"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const authenticator = new Authenticator<User>();

async function signIn(username: string, password: string): Promise<User> {
  try {
    const result = await gqlClient.request(
      SigninUserMutation,
      {
        data: {
          username,
          password,
        },
      },
      {
        "x-api-key": process.env.API_KEY || "",
      },
    );

    if (!result)
      return {
        token: "",
        id: "",
        username: "",
      };

    const { signIn }: any = result;

    return {
      token: signIn.token,
      id: signIn.user.id,
      username: signIn.user.user_name,
    };
  } catch (e) {
    return checkAndReturnError(e);
  }
}

async function signUp(username: string, password: string): Promise<User> {
  try {
    const result: {
      signUp: any;
    } = await gqlClient.request(
      SignupUserMutation,
      {
        data: {
          username,
          password,
        },
      },
      {
        "x-api-key": process.env.API_KEY || "",
      },
    );

    if (!result)
      return {
        token: "",
        id: "",
        username: "",
      };

    const {
      signUp,
    }: {
      signUp: {
        token: string;
        user: {
          id: string;
          user_name: string;
        };
      };
    } = result;

    return {
      token: signUp.token,
      id: signUp.user.id,
      username: signUp.user.user_name,
    };
  } catch (e) {
    return checkAndReturnError(e);
  }
}

function checkAndReturnError(e: unknown) {
  if (e instanceof Error) {
    let errorMessage = "";

    if (e.message.includes("400")) {
      errorMessage = "No API KEY provided";
    } else if (e.message.includes("403")) {
      errorMessage = "API KEY invalid";
    } else {
      errorMessage = e.message.slice(0, e.message.indexOf(":"));
    }

    return {
      token: "",
      id: "",
      username: "",
      error: errorMessage,
    };
  } else {
    console.error("An unknown error occurred:", e);
    return {
      token: "",
      id: "",
      username: "",
      error: JSON.stringify(e),
    };
  }
}

export async function authenticateUser(request: Request, returnTo?: string) {
  let session = await sessionStorage.getSession(
    request.headers.get(SESSION_COOKIE),
  );
  let user = session.get(SESSION.USER);
  if (user) return user;
  if (returnTo) session.set(SESSION.RETURN_TO, returnTo);
  throw redirect(APP_ROUTES.HOME, {
    headers: {
      [HTTP_HEADER.SET_COOKIE]: await sessionStorage.commitSession(session),
    },
  });
}

export async function logoutUser(request: Request) {
  let session = await sessionStorage.getSession(
    request.headers.get(SESSION_COOKIE),
  );
  return redirect(APP_ROUTES.HOME, {
    headers: {
      [HTTP_HEADER.SET_COOKIE]: await sessionStorage.destroySession(session),
    },
  });
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get(FORM_NAME.USER_NAME) as string;
    const password = form.get(FORM_NAME.PASSWORD) as string;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    return await signIn(username, password);
  }),

  AUTHENTICATOR.SIGN_IN,
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get(FORM_NAME.USER_NAME) as string;
    const password = form.get(FORM_NAME.PASSWORD) as string;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    return await signUp(username, password);
  }),

  AUTHENTICATOR.SIGN_UP,
);
