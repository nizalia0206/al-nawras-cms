import { NavLink } from "react-router-dom";

const TABS = [
  { label: "Overview", to: "/about/overview" },
  { label: "Mission & Vision", to: "/about/mission" },
  { label: "Message from the Founder", to: "/about/founder" },
  { label: "Our Team", to: "/about/team" },
];

export default function AboutSubNav() {
  return (
    <div className="border-b border-black/[.09] bg-paper2">
      <div className="max-w-[1280px] mx-auto px-8 flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `relative px-5 py-4 text-[14px] font-medium whitespace-nowrap transition-colors ${
                isActive ? "text-ink" : "text-inksoft hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {t.label}
                <span
                  className={`absolute left-5 right-5 bottom-0 h-[2px] bg-gradient-to-r from-flame1 to-gold transition-transform duration-300 origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
