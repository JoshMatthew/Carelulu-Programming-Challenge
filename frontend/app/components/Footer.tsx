import { FaGithub, FaPhoneAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

export function Footer() {
  return (
    <footer className="bg-secondaryBg w-full">
      <div className="mx-auto mt-auto flex min-h-[60px] max-w-[1920px] flex-col items-center justify-center gap-4 py-4">
        <p className="font-lexend text-2xl font-bold text-white">
          Care <span className="text-accent">Task</span>
        </p>
        <div className="flex items-center gap-4">
          <FooterLink
            className="text-gray-100 hover:text-gray-700"
            icon={<FaGithub />}
            href="https://github.com/JoshMatthew/Carelulu-Programming-Challenge"
            linkLabel="See code"
          />{" "}
          <FooterLink
            className="text-gray-100 hover:text-gray-700"
            icon={<FaPhoneAlt />}
            href="mailto:mateo.talplacido.24@gmail.com"
            linkLabel="Contact dev"
          />
          <FooterLink
            className="text-gray-100 hover:text-gray-700"
            icon={<MdLogout />}
            href="https://www.carelulu.com/"
            linkLabel="Visit CareLuLu"
          />
        </div>
        <p className="m-auto font-lexend text-[0.7rem] text-gray-200">
          © Copyright {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

const FooterLink = ({
  icon,
  href,
  linkLabel,
  className = "",
}: {
  icon: ReactNode;
  href: string;
  linkLabel: string;
  className?: string;
}) => {
  return (
    <Link
      to={href}
      className={`flex items-center gap-2 text-[1rem] transition-colors duration-300 ${className}`}
    >
      {icon}
      <p className="block text-center font-lexend text-xs">{linkLabel}</p>
    </Link>
  );
};
