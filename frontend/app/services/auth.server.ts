import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { SigninUserMutation, SignupUserMutation } from "~/lib/graphql";
import { FormStrategy } from "remix-auth-form";
import { User } from "~/lib/types";
import { gqlClient } from "~/lib/graphql-client";

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
    const result = await gqlClient.request(SigninUserMutation, {
      data: {
        username,
        password,
      },
    });

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
    } = await gqlClient.request(SignupUserMutation, {
      data: {
        username,
        password,
      },
    });

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
    const errorMessage = e.message.slice(0, e.message.indexOf(":"));
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
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");
  if (user) return user;
  if (returnTo) session.set("returnTo", returnTo);
  throw redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function logoutUser(request: Request) {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  return redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("email") as string;
    const password = form.get("password") as string;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    return await signIn(username, password);
  }),

  "signin",
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("email") as string;
    const password = form.get("password") as string;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    return await signUp(username, password);
  }),

  "signup",
);
