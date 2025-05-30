import { ActionFunction, redirect } from "@remix-run/node";
import { APP_ROUTES, HTTP_HEADER, SESSION_COOKIE } from "~/lib/constants";
import { sessionStorage } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get(SESSION_COOKIE),
  );
  return redirect(APP_ROUTES.HOME, {
    headers: {
      [HTTP_HEADER.SET_COOKIE]: await sessionStorage.destroySession(session),
    },
  });
};
