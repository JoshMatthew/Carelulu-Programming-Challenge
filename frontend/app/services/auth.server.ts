import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { SigninUserMutation } from "~/lib/graphql";
import { gqlClient } from "~/lib/graphql-client";
import { FormStrategy } from "remix-auth-form";

type User = {
  token: string;
  username: string;
  id: string;
};

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

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("email") as string;
    const password = form.get("password") as string;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    return await signIn(username, password);
  }),

  "user-pass"
);
