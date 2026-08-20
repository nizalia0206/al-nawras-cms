import { useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "./Icons";
import { IconArrow } from "./Icons";
import { systems } from "../data/content";

const SYSTEM_ROUTES = {
  "sys-fire": "/systems/fire-fighting",
  "sys-alarm": "/systems/fire-alarm",
  "sys-voice": "/systems/voice-evacuation",
  "sys-light": "/systems/emergency-lighting",
  "sys-elv": "/systems/elv",
  "sys-smoke": "/systems/smoke-management",
};

export default function ServicesGrid({
  eyebrow = "Systems & Solutions",
  title = "Solutions for every stage of building safety",
  desc = "Al Nawras engineers, supplies, installs and commissions a complete range of fire, life-safety, ELV and ICT systems — each backed by certified brand partners and a qualified in-house delivery team.",
  items = systems,
  activeId,
  id,
}) {
  const [hovered, setHovered] = useState(activeId ?? items[1]?.id ?? null);

  return (
    <section id={id} className="bg-paper py-[90px] md:py-[110px]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="max-w-[680px] mb-14">
          <div className="sec-eyebrow">{eyebrow}</div>
          <h2 className="font-display font-semibold uppercase text-[28px] md:text-[40px] leading-[1.08] text-ink">
            {title}
          </h2>
          {desc && <p className="mt-5 text-[15.5px] md:text-[16.5px] leading-[1.75] text-inksoft">{desc}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const Icon = Icons[item.icon] || Icons.IconFlame;
            const to = SYSTEM_ROUTES[item.id];
            const isActive = hovered === item.id;
            const card = (
              <div
                onMouseEnter={() => setHovered(item.id)}
                className={`svc-card cursor-pointer ${isActive ? "is-active" : ""}`}
              >
                <div className="svc-icon w-11 h-11 text-flame1 mb-6">
                  <Icon className="w-full h-full" />
                </div>
                <h3 className="font-display text-[18px] uppercase tracking-wide mb-2.5">
                  {item.title}
                </h3>
                <p className="svc-desc text-[13.5px] leading-[1.65] text-inksoft flex-grow">
                  {item.desc}
                </p>
                <span className="svc-learn mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-wide text-flame1">
                  Learn more <IconArrow className="w-3 h-3" />
                </span>
              </div>
            );
            return to ? (
              <Link key={item.id} to={to} className="block">
                {card}
              </Link>
            ) : (
              <div key={item.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
