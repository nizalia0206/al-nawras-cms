import PageHeader from "../../components/PageHeader";
import SystemsSubNav from "../../components/SystemsSubNav";
import Gallery from "../../components/Gallery";
import useReveal from "../../hooks/useReveal";
import { IconSmoke, IconGateway, IconPanel } from "../../components/Icons";
import { smokeManagementImages } from "../../data/systemImages";
import useSystemImages from "../../hooks/useSystemImages";

const PRODUCTS = [
  { icon: IconSmoke, name: "Fire/Smoke Dampers", desc: "Duct-mounted dampers that inhibit smoke spread between zones." },
  { icon: IconGateway, name: "Extraction Fans", desc: "Mechanical smoke extraction to keep stairwells and corridors clear." },
  { icon: IconPanel, name: "Control Units", desc: "Electronic control panels coordinating smoke control sequences." },
];

export default function SmokeManagement() {
  const introRef = useReveal();
  const { groups } = useSystemImages("smoke-management", [{ title: "", items: smokeManagementImages }]);

  return (
    <>
      <PageHeader
        eyebrow="Systems & Solutions"
        title="Smoke Management"
        desc="Fire and smoke dampers, extraction fans and electronic control units, specified and installed to keep stairwells and escape routes clear for the duration of an event."
        crumbs={[{ label: "Systems & Solutions" }, { label: "Smoke Management" }]}
      />
      <SystemsSubNav />

      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div ref={introRef} className="reveal max-w-[70ch] mb-12 md:mb-16">
            <div className="sec-eyebrow">Overview</div>
            <p className="text-[16px] md:text-[17px] leading-[1.85] text-inksoft">
              Fire &amp; smoke dampers, ductwork inhibitors, extraction fans and electronic control
              units engineered to keep escape routes clear during an event.
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
            Dampers, Fans & Controls
          </h2>
          <Gallery items={groups[0]?.items || []} category="SMOKE MANAGEMENT" />
        </div>
      </section>
    </>
  );
}
