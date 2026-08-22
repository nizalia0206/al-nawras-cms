import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { IconChevron } from "./Icons";

const NAV = [
  { label: "Home", to: "/" },
  {
    label: "About",
    items: [
      { title: "Overview", desc: "Who Al Nawras is, at a glance", to: "/about/overview" },
      { title: "Mission & Vision", desc: "What drives every installation", to: "/about/mission" },
      { title: "Message from the Founder", desc: "A word from our leadership", to: "/about/founder" },
      { title: "Our Team", desc: "The people behind Al Nawras", to: "/about/team" },
      { title: "Certifications", desc: "Our accreditations & approvals", to: "/about/certifications" },
      { title: "Contact", desc: "Get in touch with our team", href: "#contact" },
    ],
  },
  {
    label: "Systems & Solutions",
    wide: true,
    items: [
      { title: "Fire Fighting Systems", desc: "Pumps, sprinklers, hydrants", to: "/systems/fire-fighting" },
      { title: "Fire Alarm Systems", desc: "Addressable detection networks", to: "/systems/fire-alarm" },
      { title: "Voice Evacuation Systems", desc: "Life-safety audio & ECS", to: "/systems/voice-evacuation" },
      { title: "Emergency Lighting", desc: "Central battery & DALI systems", to: "/systems/emergency-lighting" },
      { title: "ELV Systems", desc: "Low-voltage building technology", to: "/systems/elv" },
      { title: "Smoke Management", desc: "Ventilation & smoke control", to: "/systems/smoke-management" },
    ],
  },
  {
    label: "Brands",
    items: [
      { title: "All Products", desc: "Browse the full catalog", to: "/products" },
      { title: "Honeywell", desc: "Fire alarm & voice evacuation", to: "/products?supplier=honeywell" },
      { title: "Teknoware / ESCALUX", desc: "Central battery & emergency lighting", to: "/products?supplier=teknoware" },
      { title: "Waterfall", desc: "UL/FM fire pump sets", to: "/products?supplier=waterfall" },
      { title: "Uranus Cable", desc: "Fire-resistant cables & ELV", to: "/products?supplier=uranus" },
      { title: "H3C", desc: "Networking & ICT infrastructure", to: "/products?supplier=h3c" },
      { title: "KD Pipes", desc: "Pipes & fittings", to: "/products?supplier=kdpipes" },
    ],
  },
  {
    label: "Projects",
    items: [
      { title: "All Projects", desc: "1,000+ projects across the Emirates", to: "/projects" },
      { title: "Residential", desc: "Towers & residential developments", to: "/projects?type=Residential" },
      { title: "Commercial", desc: "Business & mixed-use developments", to: "/projects?type=Commercial" },
      { title: "Healthcare", desc: "Hospitals & medical facilities", to: "/projects?type=Healthcare" },
      { title: "Hospitality", desc: "Hotels & hospitality buildings", to: "/projects?type=Hospitality" },
    ],
  },
  { label: "Careers", to: "/careers" },
];

export default function Header() {
  const [shrink, setShrink] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerGroup, setDrawerGroup] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeAll = () => setOpenIdx(null);
    document.addEventListener("click", closeAll);
    return () => document.removeEventListener("click", closeAll);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-[200] bg-white/95 backdrop-blur-md border-b border-ink/[.08] shadow-[0_2px_20px_-8px_rgba(0,0,0,.08)]"
      >
        <div
          className={`max-w-[1280px] mx-auto px-8 flex items-center justify-between transition-[height] duration-300 ${
            shrink ? "h-[92px]" : "h-[104px]"
          }`}
        >
          <Link to="/" className="flex items-center">
            <Logo size={84} />
          </Link>

          <nav className="hidden [@media(min-width:1080px)]:flex items-center gap-0.5">
            {NAV.map((item, idx) => (
              <div
                key={item.label}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                {item.items ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                      className="flex items-center gap-1.5 px-3 py-3.5 text-[13px] font-semibold uppercase tracking-[.06em] text-ink whitespace-nowrap hover:text-flame1 transition-colors"
                    >
                      {item.label}
                      <IconChevron
                        className={`w-2.5 h-2.5 opacity-60 transition-transform duration-300 ${
                          openIdx === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <span
                      className={`absolute left-3 right-3 bottom-2 h-[2px] bg-gradient-to-r from-flame1 to-gold origin-left transition-transform duration-300 ${
                        openIdx === idx ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                    <div
                      className={`absolute top-full ${
                        item.wide ? "left-1/2 -translate-x-1/2 min-w-[560px] grid grid-cols-2" : "left-1/2 -translate-x-1/2 min-w-[340px]"
                      } bg-white border border-ink/[.08] rounded-sm shadow-[0_30px_60px_-20px_rgba(0,0,0,.15)] p-2.5 gap-0.5 transition-all duration-300 ${
                        openIdx === idx ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-2"
                      }`}
                    >
                      {item.items.map((sub) =>
                        sub.to ? (
                          <Link
                            key={sub.title}
                            to={sub.to}
                            onClick={() => setOpenIdx(null)}
                            className="flex flex-col gap-0.5 px-3.5 py-3 rounded-sm hover:bg-paper2 transition-colors group"
                          >
                            <span className="text-[14px] font-semibold text-ink group-hover:text-flame1">
                              {sub.title}
                            </span>
                            <span className="text-[12px] text-inksoft">{sub.desc}</span>
                          </Link>
                        ) : (
                          <a
                            key={sub.title}
                            href={sub.href}
                            onClick={() => setOpenIdx(null)}
                            className="flex flex-col gap-0.5 px-3.5 py-3 rounded-sm hover:bg-paper2 transition-colors group"
                          >
                            <span className="text-[14px] font-semibold text-ink group-hover:text-flame1">
                              {sub.title}
                            </span>
                            <span className="text-[12px] text-inksoft">{sub.desc}</span>
                          </a>
                        )
                      )}
                    </div>
                  </>
                ) : item.to ? (
                  <Link
                    to={item.to}
                    className="relative flex items-center px-3 py-3.5 text-[13px] font-semibold uppercase tracking-[.06em] text-ink whitespace-nowrap hover:text-flame1 transition-colors group"
                  >
                    {item.label}
                    <span className="absolute left-3 right-3 bottom-2 h-[2px] bg-gradient-to-r from-flame1 to-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="relative flex items-center px-3 py-3.5 text-[13px] font-semibold uppercase tracking-[.06em] text-ink whitespace-nowrap hover:text-flame1 transition-colors group"
                  >
                    {item.label}
                    <span className="absolute left-3 right-3 bottom-2 h-[2px] bg-gradient-to-r from-flame1 to-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </a>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3.5">
            <a href="#contact" className="btn btn-flame hidden [@media(min-width:1080px)]:inline-flex !py-2.5">
              Get in touch
            </a>
            <button
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="[@media(min-width:1080px)]:hidden w-10 h-10 flex items-center justify-center flex-col gap-[5px]"
            >
              <span className="w-[22px] h-0.5 bg-ink" />
              <span className="w-[22px] h-0.5 bg-ink" />
              <span className="w-[22px] h-0.5 bg-ink" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[300] bg-white overflow-y-auto transition-transform duration-400 [@media(min-width:1080px)]:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-ink/[.08]">
          <Logo size={34} />
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-ink text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="px-3.5 pb-14 pt-2.5">
          {NAV.map((item, idx) => (
            <div key={item.label} className="border-b border-ink/[.08]">
              {item.items ? (
                <>
                  <button
                    type="button"
                    onClick={() => setDrawerGroup(drawerGroup === idx ? null : idx)}
                    className="w-full flex justify-between items-center px-2.5 py-[18px] text-ink text-[17px] font-medium font-display tracking-wide"
                  >
                    {item.label}
                    <IconChevron
                      className={`w-3 h-3 transition-transform duration-300 ${
                        drawerGroup === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-400 ${
                      drawerGroup === idx ? "max-h-[600px]" : "max-h-0"
                    }`}
                  >
                    {item.items.map((sub) =>
                      sub.to ? (
                        <Link
                          key={sub.title}
                          to={sub.to}
                          onClick={() => setDrawerOpen(false)}
                          className="block px-2.5 py-2.5 pl-5 text-[14.5px] text-inksoft border-l-2 border-ink/[.08] hover:text-flame1"
                        >
                          {sub.title}
                        </Link>
                      ) : (
                        <a
                          key={sub.title}
                          href={sub.href}
                          onClick={() => setDrawerOpen(false)}
                          className="block px-2.5 py-2.5 pl-5 text-[14.5px] text-inksoft border-l-2 border-ink/[.08] hover:text-flame1"
                        >
                          {sub.title}
                        </a>
                      )
                    )}
                  </div>
                </>
              ) : item.to ? (
                <Link
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                  className="block px-2.5 py-[18px] text-ink text-[17px] font-medium font-display tracking-wide"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className="block px-2.5 py-[18px] text-ink text-[17px] font-medium font-display tracking-wide"
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
