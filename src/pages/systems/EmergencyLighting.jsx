import PageHeader from "../../components/PageHeader";
import SystemsSubNav from "../../components/SystemsSubNav";
import Gallery from "../../components/Gallery";
import useReveal from "../../hooks/useReveal";
import { IconBattery, IconExitSign, IconGateway } from "../../components/Icons";
import { emergencyLightImages } from "../../data/systemImages";
import useSystemImages from "../../hooks/useSystemImages";

const PRODUCTS = [
  { icon: IconBattery, name: "Central Battery Systems", desc: "8–72 output circuit central battery panels for site-wide emergency power." },
  { icon: IconExitSign, name: "Exit & Emergency Luminaires", desc: "DALI-addressable exit signs and emergency luminaires, various IP ratings." },
  { icon: IconGateway, name: "IntelliPanel & Gateways", desc: "Touch-screen monitoring of up to 1024 luminaires per panel." },
];

export default function EmergencyLighting() {
  const introRef = useReveal();
  const { groups } = useSystemImages("emergency-lighting", [{ title: "", items: emergencyLightImages }]);

  return (
    <>
      <PageHeader
        eyebrow="Systems & Solutions"
        title="Emergency Lighting"
        desc="Central battery systems and DALI-addressable emergency and exit luminaires from Teknoware ESCALUX, monitored end-to-end through IntelliPanel and ESC-GATE gateways for consistent, code-compliant coverage."
        crumbs={[{ label: "Systems & Solutions" }, { label: "Emergency Lighting" }]}
      />
      <SystemsSubNav />

      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div ref={introRef} className="reveal max-w-[70ch] mb-12 md:mb-16">
            <div className="sec-eyebrow">Overview</div>
            <p className="text-[16px] md:text-[17px] leading-[1.85] text-inksoft">
              Central battery systems and DALI-addressable emergency &amp; exit luminaires from
              Teknoware ESCALUX, monitored through IntelliPanel and ESC-GATE gateways for guaranteed
              egress lighting during an outage.
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
            Panels & Luminaires
          </h2>
          <Gallery items={groups[0]?.items || []} category="EMERGENCY LIGHTING" />
        </div>
      </section>
    </>
  );
}
