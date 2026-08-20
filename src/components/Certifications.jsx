import { certifications } from "../data/content";

export default function Certifications() {
  return (
    <section id="certifications" className="bg-white py-[90px] md:py-[110px] border-t border-ink/[.06]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="max-w-[680px] mb-14">
          <div className="sec-eyebrow">Certifications</div>
          <h2 className="font-display font-semibold uppercase text-[28px] md:text-[40px] leading-[1.08] text-ink">
            Licensed, accredited and compliant
          </h2>
          <p className="mt-5 text-[15.5px] md:text-[16.5px] leading-[1.75] text-inksoft">
            Every system we deliver is backed by the accreditations, Civil Defense licenses and
            manufacturer authorizations required to work to the international standard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
  );
}
