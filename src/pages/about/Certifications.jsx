import PageHeader from "../../components/PageHeader";
import AboutSubNav from "../../components/AboutSubNav";
import { certifications } from "../../data/content";
import useReveal from "../../hooks/useReveal";

export default function Certifications() {
  const ref = useReveal();

  return (
    <>
      <PageHeader
        eyebrow="Al Nawras Overview"
        title="Certifications"
        desc="Every system we deliver is backed by the accreditations, Civil Defense licenses and manufacturer authorizations required to work to the international standard."
        crumbs={[{ label: "About", href: "/about/overview" }, { label: "Certifications" }]}
      />
      <AboutSubNav />

      <section className="bg-paper py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-[680px] mb-14">
            <div className="sec-eyebrow">Certifications</div>
            <h1 className="font-display font-semibold uppercase text-[28px] md:text-[40px] leading-[1.08] text-ink">
              Licensed, accredited and compliant
            </h1>
            <p className="mt-5 text-[15.5px] md:text-[16.5px] leading-[1.75] text-inksoft">
              Al Nawras holds Civil Defense licenses across the Emirates and is an authorized
              distributor and system integrator for every brand we install, so every project we
              deliver is fully compliant from design through handover.
            </p>
          </div>

          <div ref={ref} className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map((c) => (
              <div key={c.num} className="svc-card">
                <div className="font-display text-[28px] font-semibold text-flame1 mb-3">{c.num}</div>
                <h3 className="font-display text-[17px] uppercase tracking-wide mb-2.5">{c.title}</h3>
                <p className="svc-desc text-[13.5px] leading-[1.65] text-inksoft flex-grow">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
