import { Link } from "react-router-dom";
import WaveField from "./WaveField";

export default function PageHeader({ eyebrow, title, desc, crumbs = [] }) {
  return (
    <div className="relative bg-bgdark text-white overflow-hidden">
      {/* navy backdrop with radial glow + grid, matching the site's dark hero treatment */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 900px 500px at 82% 10%, rgba(238,108,47,.22), transparent 60%), radial-gradient(ellipse 700px 500px at 10% 0%, rgba(147,161,194,.14), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 z-0 opacity-[.3]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 20%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 20%, black, transparent)",
        }}
      />
      <WaveField className="opacity-70 mix-blend-screen" />

      <div className="relative z-[1] max-w-[1280px] mx-auto px-8 pt-14 pb-14 md:pt-[72px] md:pb-16">
        <div className="flex items-center gap-2 text-[12.5px] text-steellight mb-6">
          <Link to="/" className="hover:text-flame2 transition-colors">
            Home
          </Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="opacity-50">/</span>
              {c.href ? (
                <Link to={c.href} className="hover:text-flame2 transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </div>
        <div className="sec-eyebrow !text-flame2">{eyebrow}</div>
        <h1 className="font-display font-semibold uppercase text-[34px] md:text-[52px] leading-[1.05] max-w-[20ch]">
          {title}
        </h1>
        {desc && (
          <p className="mt-5 text-[15px] md:text-[16.5px] leading-[1.7] text-steellight max-w-[62ch]">
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}
