import { FaGithub, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

export function Footer() {
  return (
    <div className="min-h-[60px] bg-[#97D1D0] flex flex-col justify-center items-center mt-auto py-4 gap-4">
      <div className="flex items-center gap-4">
        <FooterLink
          icon={<FaGithub className="text-gray-100 hover:text-white" />}
          href="https://github.com/JoshMatthew/Carelulu-Programming-Challenge"
        />{" "}
        <FooterLink
          icon={<FaPhoneAlt className="text-gray-100 hover:text-white" />}
          href="mailto:mateo.talplacido.24@gmail.com"
        />
      </div>
      <p className="m-auto text-white font-lexend text-xs">
        © Copyright {new Date().getFullYear()}
      </p>
    </div>
  );
}

const FooterLink = ({ icon, href }: { icon: ReactNode; href: string }) => {
  return (
    <Link to={href} className="text-2xl">
      {icon}
    </Link>
  );
};
