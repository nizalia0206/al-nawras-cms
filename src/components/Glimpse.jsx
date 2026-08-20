import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconFlame,
  IconPanel,
  IconELV,
  IconArrow,
} from "./Icons";

const GLIMPSES = [
  {
    icon: IconFlame,
    eyebrow: "About",
    title: "Who We Are",
    desc: "Founded in Sharjah in 2005 — mission, vision and a message from our Managing Director.",
    href: "/about/overview",
    internal: true,
    tag: "Overview · Mission & Vision · Founder",
  },
  {
    icon: IconPanel,
    eyebrow: "Systems & Solutions",
    title: "Full Life-Safety Stack",
    desc: "Fire fighting, fire alarm, voice evacuation, emergency lighting, ELV and smoke management.",
    href: "/systems/fire-fighting",
    internal: true,
    tag: "6 Solution Categories",
  },
  {
    icon: IconELV,
    eyebrow: "Brands",
    title: "Authorized Distributor",
    desc: "Honeywell, Teknoware, Waterfall, KD Industries, Uranus and H3C — with full product ranges.",
    href: "#brands",
    tag: "6 Global Brand Partners",
  },
  {
    icon: IconFlame,
    eyebrow: "Projects",
    title: "1,000+ Delivered",
    desc: "Danube Properties, Ellington, Saudi German Hospital and more, executed since 2005.",
    href: "#projects",
    tag: "Residential · Healthcare · Hospitality",
  },
  {
    icon: IconPanel,
    eyebrow: "Certifications",
    title: "Licensed & Compliant",
    desc: "ISO 9001:2015, Civil Defense licenses across Sharjah, Dubai and Abu Dhabi.",
    href: "#certifications",
    tag: "3 Emirates · ISO Certified",
  },
  {
    icon: IconELV,
    eyebrow: "Contact",
    title: "Get in Touch",
    desc: "Offices in Sharjah, Dubai and Abu Dhabi, plus a dedicated warehouse and workshop.",
    href: "#contact",
    tag: "Sharjah · Dubai · Abu Dhabi",
  },
];

function GlimpseCard({ item }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Icon = item.icon;
  const cardClass =
    "reveal group relative flex flex-col bg-white border border-ink/[.08] p-8 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,.15)] hover:-translate-y-0.5";
  const inner = (
    <>
      <span className="absolute left-0 top-0 h-[3px] w-0 bg-gradient-to-r from-flame1 to-gold transition-[width] duration-400 group-hover:w-full" />
      <div className="w-11 h-11 text-flame1 mb-6">
        <Icon className="w-full h-full" />
      </div>
      <div className="text-[11.5px] tracking-[.16em] uppercase text-flame1 font-semibold mb-2">
        {item.eyebrow}
      </div>
      <h3 className="font-display text-[19px] uppercase tracking-wide text-ink mb-3">
        {item.title}
      </h3>
      <p className="text-[14px] leading-[1.7] text-inksoft flex-grow">{item.desc}</p>
      <div className="mt-5 pt-4 border-t border-ink/[.08] flex items-center justify-between">
        <span className="text-[12px] tracking-wide text-inksoft">{item.tag}</span>
        <IconArrow className="w-4 h-4 text-flame1 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </>
  );

  return item.internal ? (
    <Link ref={ref} to={item.href} className={cardClass}>
      {inner}
    </Link>
  ) : (
    <a ref={ref} href={item.href} className={cardClass}>
      {inner}
    </a>
  );
}

export default function Glimpse() {
  const headRef = useRef(null);
  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-paper py-[90px] md:py-[110px]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div ref={headRef} className="reveal max-w-[640px] mb-14">
          <div className="sec-eyebrow">Explore Al Nawras</div>
          <h2 className="font-display text-[30px] md:text-[42px] font-semibold uppercase leading-[1.05] text-ink">
            Everything Al Nawras Delivers
          </h2>
          <p className="mt-[18px] text-[16px] leading-[1.7] text-inksoft">
            A quick look at what's ahead — our story, our systems, the brands we represent, and the
            projects we've delivered across the UAE since 2005.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GLIMPSES.map((item) => (
            <GlimpseCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
