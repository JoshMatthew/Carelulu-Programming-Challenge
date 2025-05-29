import { ActionFunction, redirect } from "@remix-run/node";
import { APP_ROUTES } from "~/lib/constants";
import { sessionStorage } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );
  return redirect(APP_ROUTES.HOME, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};
