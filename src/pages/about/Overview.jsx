import PageHeader from "../../components/PageHeader";
import AboutSubNav from "../../components/AboutSubNav";
import useReveal from "../../hooks/useReveal";

export default function Overview() {
  const copyRef = useReveal();
  const statsRef = useReveal();

  return (
    <>
      <PageHeader
        eyebrow="Al Nawras Overview"
        title="Who We Are"
        desc="A UAE-based fire, life-safety, ELV and ICT solutions provider, delivering consultancy, products and support to the highest standards since 2005."
        crumbs={[{ label: "About" }]}
      />
      <AboutSubNav />

      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-[1.1fr_.9fr] gap-12 md:gap-20 items-start">
          <div ref={copyRef} className="reveal">
            <p className="text-[16px] leading-[1.85] text-inksoft mb-5">
              Al Nawras Safety &amp; Security Systems LLC was founded in Sharjah in 2005 and has grown into
              one of the UAE's trusted names in fire &amp; life safety, extra-low-voltage (ELV) and ICT
              infrastructure. With offices in{" "}
              <b className="text-ink font-semibold">Sharjah, Dubai and Abu Dhabi</b>, plus a dedicated
              warehouse and workshop, the company offers a genuine one-stop shop for developers,
              contractors and consultants across the Emirates.
            </p>
            <p className="text-[16px] leading-[1.85] text-inksoft mb-5">
              Al Nawras is Civil Defense-licensed to design, supply, install, test and commission fire
              detection, fire alarm, firefighting, emergency lighting and smoke control systems in
              Sharjah, Dubai and Abu Dhabi, and holds ISO 9001:2015 certification for its quality
              management system.
            </p>
            <p className="text-[16px] leading-[1.85] text-inksoft">
              Today, the company operates as an authorized distributor and sub-distributor for globally
              certified manufacturers — Honeywell, Teknoware, Waterfall, KD Industries, Uranus and H3C —
              bringing internationally recognized equipment to every fire, life-safety, ELV and ICT
              project it delivers.
            </p>
          </div>

          <div ref={statsRef} className="reveal grid grid-cols-2 gap-4">
            {[
              { n: "2005", l: "Year Founded" },
              { n: "1,000+", l: "Projects Executed" },
              { n: "3", l: "UAE Offices" },
              { n: "6", l: "Global Brand Partners" },
            ].map((s) => (
              <div key={s.l} className="bg-paper2 p-6 border border-black/[.06]">
                <div className="font-display text-[28px] font-semibold text-flame1">{s.n}</div>
                <div className="text-[12.5px] tracking-wide uppercase text-inksoft mt-1.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
