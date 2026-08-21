import { Link } from "react-router-dom";
import { IconLinkedIn, IconInstagram, IconX } from "./Icons";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export default function TopBar() {
  const { session } = useCustomerAuth();
  const socials = [
    { label: "LinkedIn", Icon: IconLinkedIn, href: "https://ae.linkedin.com/in/al-nawras-91365b25b" },
    { label: "Instagram", Icon: IconInstagram, href: "#" },
    { label: "X", Icon: IconX, href: "#" },
  ];

  const utilityLinks = [
    { label: "About Us", to: "/about/overview" },
    { label: "Certifications", to: "/about/certifications" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="bg-paper2 text-inksoft text-[12px] tracking-wide border-b border-ink/[.06]">
      <div className="max-w-[1280px] mx-auto px-8 h-[38px] flex items-center justify-between">
        <div className="flex items-center gap-5 md:gap-6">
          <span>info@nawrassystems.com</span>
          <span className="hidden md:inline">Sharjah · Dubai · Abu Dhabi, UAE</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-5 font-semibold uppercase tracking-[.08em] text-[11px] text-inksoft">
            {utilityLinks.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} className="hover:text-flame1 transition-colors">
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="hover:text-flame1 transition-colors">
                  {l.label}
                </a>
              )
            )}
          </div>
          <Link
            to={session ? "/account" : "/account/sign-in"}
            className="hidden sm:inline font-semibold uppercase tracking-[.08em] text-[11px] text-inksoft hover:text-flame1 transition-colors pl-4 border-l border-ink/[.1]"
          >
            {session ? "My Account" : "Sign In"}
          </Link>

          <div className="flex items-center gap-3 pl-4 border-l border-ink/[.1]">
            {socials.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-inksoft hover:text-flame1 transition-colors"
              >
                <Icon className="w-[16px] h-[16px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
