import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ToggleContentProvider } from "./components/ToggleContentContext";
import { GlobalLoadingBar } from "./components/GlobalLoadingBar";
import { LoaderFunction } from "react-router";
import { sessionStorage } from "~/services/auth.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const user = session.get("user");

  if (user) return { user };

  return null;
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ToggleContentProvider>
          <GlobalLoadingBar />
          <Navbar />
          {children}
          <Footer />
        </ToggleContentProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
