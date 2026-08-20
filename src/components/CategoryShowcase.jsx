import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconPump,
  IconDetector,
  IconSpeaker,
  IconBattery,
  IconELV,
  IconSmoke,
  IconArrow,
} from "./Icons";
import {
  fireFightingGroups,
  fireAlarmImages,
  voiceEvacImages,
  emergencyLightImages,
  elvImages,
  smokeManagementImages,
} from "../data/systemImages";

const AUTOPLAY_MS = 5500;

const CATEGORIES = [
  {
    icon: IconPump,
    label: "Fire Fighting Systems",
    line1: "Rapid Response,",
    line2: "Total Suppression",
    tagline: "Pumps, sprinklers, hydrants & risers engineered for total suppression coverage.",
    to: "/systems/fire-fighting",
    image: fireFightingGroups[1].items[1].src,
    imageName: "Fire Hydrants",
  },
  {
    icon: IconDetector,
    label: "Fire Alarm Systems",
    line1: "Early Warning,",
    line2: "Zero Delay",
    tagline: "Addressable detection networks that catch a threat before it spreads.",
    to: "/systems/fire-alarm",
    image: fireAlarmImages[1].src,
    imageName: "Smoke Detectors",
  },
  {
    icon: IconSpeaker,
    label: "Voice Evacuation",
    line1: "Clear Direction,",
    line2: "Safe Evacuation",
    tagline: "Life-safety audio and ECS systems that guide occupants to safety, clearly.",
    to: "/systems/voice-evacuation",
    image: voiceEvacImages[0].src,
    imageName: "Speakers & PA System",
  },
  {
    icon: IconBattery,
    label: "Emergency Lighting",
    line1: "Guided Path,",
    line2: "Always Lit",
    tagline: "Central battery & DALI systems that keep exit paths lit when it matters most.",
    to: "/systems/emergency-lighting",
    image: emergencyLightImages[1].src,
    imageName: "Exit & Emergency Luminaires",
  },
  {
    icon: IconELV,
    label: "ELV Systems",
    line1: "Connected Building,",
    line2: "Constant Watch",
    tagline: "Access control, CCTV and low-voltage infrastructure across every building.",
    to: "/systems/elv",
    image: elvImages[1].src,
    imageName: "CCTV & Surveillance",
  },
  {
    icon: IconSmoke,
    label: "Smoke Management",
    line1: "Clean Air,",
    line2: "Clear Escape",
    tagline: "Ventilation and smoke control systems engineered for safe evacuation.",
    to: "/systems/smoke-management",
    image: smokeManagementImages[2].src,
    imageName: "Smoke Extraction Fans",
  },
];

export default function CategoryShowcase() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => {
      setPrev(active);
      setActive((i) => (i + 1) % CATEGORIES.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timerRef.current);
  }, [active, paused]);

  const current = CATEGORIES[active];
  const goTo = (i) => {
    if (i === active) return;
    setPrev(active);
    setActive(i);
  };

  return (
    <section
      className="relative overflow-hidden bg-bgdark min-h-[600px] sm:min-h-[660px] md:min-h-[92vh] md:max-h-[820px] flex flex-col -mt-px"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* stacked slide backdrops (crossfade) */}
      {CATEGORIES.map((cat, i) => (
        <div
          key={cat.label}
          aria-hidden={i !== active}
          className={`absolute inset-0 z-0 transition-opacity duration-[900ms] ease-[var(--ease)] ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* base tone — continues straight down from the Hero's dark backdrop, no seam */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#10131a_0%,#10131a_18%,#0d0f16_55%,#0a0c11_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_75%_at_22%_60%,rgba(29,34,48,.55)_0%,transparent_70%)]" />
          {/* ambient glow */}
          <span
            className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[52%] h-[80%] rounded-full blur-[90px] opacity-60"
            style={{
              background: "radial-gradient(circle, rgba(255,91,30,.32), rgba(255,176,32,.10) 60%, transparent 75%)",
              animation: i === active ? "pulseGlow 5s ease-in-out infinite" : "none",
            }}
          />
          {/* grid texture */}
          <div
            className="absolute inset-0 opacity-[.25]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
              backgroundSize: "54px 54px",
              maskImage: "radial-gradient(ellipse 85% 80% at 65% 50%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 85% 80% at 65% 50%, black, transparent)",
            }}
          />
          {/* spotlighted product image, right-anchored, edges faded into the scene */}
          <img
            src={cat.image}
            alt=""
            className="absolute right-[-2%] sm:right-[4%] top-1/2 -translate-y-1/2 h-[62%] sm:h-[70%] md:h-[76%] max-w-[58%] object-contain"
            style={{
              maskImage:
                "radial-gradient(ellipse 62% 62% at 50% 50%, black 45%, transparent 82%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 62% 62% at 50% 50%, black 45%, transparent 82%)",
              filter: "brightness(.92) saturate(1.05) drop-shadow(0 20px 50px rgba(0,0,0,.65))",
              ...(i === active ? { animation: "floatY 6s ease-in-out infinite" } : {}),
            }}
          />
          {/* left-to-right dark gradient so headline stays legible over the image */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0a0c11_0%,rgba(10,12,17,.85)_32%,rgba(10,12,17,.35)_55%,transparent_75%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#0a0c11] to-transparent" />
        </div>
      ))}

      {/* transition flash */}
      {prev !== null && (
        <span
          key={active}
          className="absolute inset-0 z-[1] bg-white pointer-events-none"
          style={{ animation: "heroFlash 700ms ease-out forwards" }}
        />
      )}

      {/* headline content */}
      <div className="relative z-[2] flex-1 flex items-center max-w-[1280px] w-full mx-auto px-6 sm:px-8 pt-[70px] pb-10">
        <div className="max-w-[640px]">
          <div key={"eyebrow-" + active} className="sec-eyebrow !text-flame2" style={{ animation: "slideIn .5s var(--ease)" }}>
            {current.label}
          </div>
          <h2
            key={"h-" + active}
            className="font-display font-bold uppercase leading-[1.06] text-[34px] sm:text-[46px] md:text-[54px]"
            style={{ animation: "slideIn .55s var(--ease) .05s backwards" }}
          >
            <span className="block text-white">{current.line1}</span>
            <span className="block text-steellight">{current.line2}</span>
          </h2>
          <p
            key={"p-" + active}
            className="mt-5 text-[15px] sm:text-[16.5px] leading-[1.7] text-steellight max-w-[42ch]"
            style={{ animation: "slideIn .55s var(--ease) .1s backwards" }}
          >
            {current.tagline}
          </p>
          <div key={"b-" + active} style={{ animation: "slideIn .55s var(--ease) .16s backwards" }}>
            <Link to={current.to} className="btn btn-flame mt-8 w-fit">
              Explore {current.label} <IconArrow />
            </Link>
          </div>
        </div>
      </div>

      {/* tab bar */}
      <div className="relative z-[2] border-t border-white/[.08] bg-[#0a0c11]/60 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 flex overflow-x-auto">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = i === active;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => goTo(i)}
                className={`relative flex items-center gap-3 px-4 sm:px-5 py-5 shrink-0 text-left transition-colors duration-300 ${
                  isActive ? "text-white" : "text-steel hover:text-steellight"
                }`}
              >
                <Icon
                  className={`w-6 h-6 shrink-0 transition-all duration-300 ${
                    isActive ? "text-flame2 scale-110" : "text-steel"
                  }`}
                />
                <span className="text-[13px] sm:text-[14px] font-semibold leading-tight whitespace-nowrap">
                  {cat.label}
                </span>

                {/* progress underline */}
                <span className="absolute left-0 right-0 bottom-0 h-[3px] bg-white/[.08] overflow-hidden">
                  {isActive && (
                    <span
                      key={active}
                      className="block h-full bg-gradient-to-r from-flame1 to-gold"
                      style={{
                        animation: `fillBar ${AUTOPLAY_MS}ms linear forwards`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
