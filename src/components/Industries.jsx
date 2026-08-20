import { industries } from "../data/content";

export default function Industries({ id }) {
  // duplicate the list so the marquee track can loop seamlessly at -50%
  const track = [...industries, ...industries];

  return (
    <section id={id} className="bg-white py-[90px] md:py-[110px] overflow-hidden border-t border-ink/[.06]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex items-center gap-3 mb-[18px]">
          <span className="inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold tracking-[.08em] uppercase text-flame1 border border-flame1/40 bg-flame1/[.06] rounded">
            SEC-02
          </span>
          <span className="flex-1 max-w-[70px] h-px bg-ink/15" />
          <span className="text-[11.5px] font-semibold tracking-[.22em] uppercase text-inksoft">
            Industries We Serve
          </span>
        </div>
        <h2 className="font-display font-semibold uppercase text-[28px] md:text-[40px] leading-[1.08] text-ink max-w-[680px]">
          Every sector, one standard of protection
        </h2>
      </div>

      <div className="mt-14 industries-marquee">
        <div className="industries-track">
          {track.map((item, i) => (
            <div key={`${item.id}-${i}`} className="industries-card">
              <div className="industries-card-img">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="industries-card-label">
                <span>{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
