import PageHeader from "../../components/PageHeader";
import SystemsSubNav from "../../components/SystemsSubNav";
import Gallery from "../../components/Gallery";
import useReveal from "../../hooks/useReveal";
import { IconPanel, IconDetector, IconNotify } from "../../components/Icons";
import { fireAlarmImages } from "../../data/systemImages";
import useSystemImages from "../../hooks/useSystemImages";

const PRODUCTS = [
  { icon: IconPanel, name: "Addressable Control Panels", desc: "1–4 loop networkable analogue addressable fire alarm panels." },
  { icon: IconDetector, name: "Smoke & Heat Detectors", desc: "Addressable photoelectric, heat and multi-criteria detection devices." },
  { icon: IconNotify, name: "Notification Appliances", desc: "Horns, strobes and sounder/strobe combinations for alerting occupants." },
];

export default function FireAlarm() {
  const introRef = useReveal();
  const { groups } = useSystemImages("fire-alarm", [{ title: "", items: fireAlarmImages }]);

  return (
    <>
      <PageHeader
        eyebrow="Systems & Solutions"
        title="Fire Alarm Systems"
        desc="Multi-loop addressable detection and control, designed around Honeywell's Morley and Farenhyt platforms and commissioned by our qualified engineering team to give occupants the earliest possible warning."
        crumbs={[{ label: "Systems & Solutions" }, { label: "Fire Alarm" }]}
      />
      <SystemsSubNav />

      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div ref={introRef} className="reveal max-w-[70ch] mb-12 md:mb-16">
            <div className="sec-eyebrow">Overview</div>
            <p className="text-[16px] md:text-[17px] leading-[1.85] text-inksoft">
              Multi-loop addressable fire alarm control panels, detectors and networking — supplied and
              commissioned with Honeywell Morley &amp; Farenhyt platforms for early, reliable detection
              across every zone of a building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 md:mb-20">
            {PRODUCTS.map((p) => (
              <div key={p.name} className="bg-paper2 p-6 border border-black/[.06] flex gap-4">
                <p.icon className="w-8 h-8 text-flame1 shrink-0" />
                <div>
                  <div className="font-display uppercase text-[14.5px] tracking-wide text-ink mb-1">{p.name}</div>
                  <div className="text-[13.5px] leading-[1.6] text-inksoft">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-display uppercase text-[22px] md:text-[26px] tracking-wide text-ink mb-6 flex items-center gap-3">
            <span className="w-6 h-[2px] bg-gradient-to-r from-flame1 to-gold" />
            Panels & Detection Devices
          </h2>
          <Gallery items={groups[0]?.items || []} category="FIRE ALARM" />
        </div>
      </section>
    </>
  );
}
