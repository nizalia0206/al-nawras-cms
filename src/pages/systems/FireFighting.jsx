import PageHeader from "../../components/PageHeader";
import SystemsSubNav from "../../components/SystemsSubNav";
import Gallery from "../../components/Gallery";
import useReveal from "../../hooks/useReveal";
import { IconPump, IconHoseReel, IconSmoke } from "../../components/Icons";
import { fireFightingGroups } from "../../data/systemImages";
import useSystemImages from "../../hooks/useSystemImages";

const PRODUCTS = [
  { icon: IconPump, name: "Fire Pump Sets", desc: "Horizontal & vertical inline pump sets, 750–1000+ GPM, UL/FM approved." },
  { icon: IconHoseReel, name: "Hose Reels & Hydrants", desc: "Wet riser, landing valve and hose reel systems for high-rise buildings." },
  { icon: IconSmoke, name: "Sprinkler & Deluge Systems", desc: "Automatic sprinklers, foam sprinkler and water deluge protection." },
];

export default function FireFighting() {
  const introRef = useReveal();
  const { groups } = useSystemImages("fire-fighting", fireFightingGroups);

  return (
    <>
      <PageHeader
        eyebrow="Systems & Solutions"
        title="Fire Fighting Systems"
        desc="A complete firefighting scope engineered, supplied and installed to the highest standards — UL-listed and FM-approved fire pump sets, hose reels, wet risers, sprinkler, foam and deluge systems, hydrants and portable extinguishers."
        crumbs={[{ label: "Systems & Solutions" }, { label: "Fire Fighting" }]}
      />
      <SystemsSubNav />

      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div ref={introRef} className="reveal max-w-[70ch] mb-12 md:mb-16">
            <div className="sec-eyebrow">Overview</div>
            <p className="text-[16px] md:text-[17px] leading-[1.85] text-inksoft">
              UL-listed/FM-approved fire pump sets, hose reels, wet risers, automatic sprinklers, foam
              and water deluge systems, hydrants and portable extinguishers — engineered, supplied and
              commissioned as a complete firefighting package.
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

          {groups.map((group) => (
            <div key={group.title} className="mb-16 md:mb-20 last:mb-0">
              <h2 className="font-display uppercase text-[22px] md:text-[26px] tracking-wide text-ink mb-6 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-gradient-to-r from-flame1 to-gold" />
                {group.title}
              </h2>
              <Gallery items={group.items} category={group.title} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
