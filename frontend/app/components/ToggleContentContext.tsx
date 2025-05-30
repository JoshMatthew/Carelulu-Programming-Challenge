import { createContext, useContext, ReactNode } from "react";
import {
  redirect,
  useLocation,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { APP_ROUTES } from "~/lib/constants";

interface ToggleContentType {
  isOn: boolean;
  close: () => void;
}

const ToggleContentContext = createContext<ToggleContentType | undefined>(
  undefined,
);

export const ToggleContentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOn = /^\/task\/[^/]+$/.test(location.pathname);
  const close = () => navigate(APP_ROUTES.TASK);

  return (
    <ToggleContentContext.Provider value={{ isOn, close }}>
      {children}
    </ToggleContentContext.Provider>
  );
};

export const useToggle = (): ToggleContentType => {
  const context = useContext(ToggleContentContext);
  if (context === undefined) {
    throw new Error("useToggle must be used within a ToggleContentProvider");
  }
  return context;
};
