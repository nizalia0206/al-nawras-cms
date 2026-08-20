import { useEffect, useState } from "react";
import useReveal from "../hooks/useReveal";

function GalleryCard({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative bg-white rounded-sm border border-black/[.08] overflow-hidden text-left transition-all duration-500 ease-[var(--ease)] hover:-translate-y-1.5 hover:border-flame1/40 hover:shadow-[0_24px_50px_-20px_rgba(255,91,30,.4)]"
    >
      {/* image stage */}
      <div className="relative h-56 flex items-center justify-center p-8 overflow-hidden bg-paper2">
        {/* glow that blooms in behind the product on hover */}
        <span
          className="pointer-events-none absolute w-40 h-40 rounded-full bg-gradient-to-br from-flame1/25 to-gold/20 blur-2xl scale-0 opacity-0 transition-all duration-500 ease-[var(--ease)] group-hover:scale-125 group-hover:opacity-100"
          aria-hidden="true"
        />
        <img
          src={item.src}
          alt={item.name}
          loading="lazy"
          className="relative max-h-full max-w-full object-contain transition-transform duration-700 ease-[var(--ease)] group-hover:scale-[1.12] drop-shadow-[0_10px_18px_rgba(0,0,0,.12)]"
        />

        {/* expand hint */}
        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ink/85 text-white flex items-center justify-center opacity-0 -translate-y-1.5 scale-90 transition-all duration-400 ease-[var(--ease)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
          </svg>
        </span>
      </div>

      {/* label bar */}
      <div className="relative px-4 py-3.5 border-t border-black/[.07] flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-semibold uppercase tracking-wide text-ink leading-tight">
          {item.name}
        </span>
        <svg
          className="w-3.5 h-3.5 shrink-0 text-flame1 -translate-x-1 opacity-0 transition-all duration-400 ease-[var(--ease)] group-hover:translate-x-0 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        {/* animated underline accent */}
        <span className="absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-flame1 to-gold origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease)] group-hover:scale-x-100" />
      </div>
    </button>
  );
}

export default function Gallery({ items, columns = "sm:grid-cols-2 lg:grid-cols-3" }) {
  const [active, setActive] = useState(null);
  const ref = useReveal();

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, items.length]);

  return (
    <>
      <div ref={ref} className={`reveal-stagger grid grid-cols-1 ${columns} gap-5`}>
        {items.map((item, i) => (
          <GalleryCard key={item.name + i} item={item} onOpen={() => setActive(i)} />
        ))}
      </div>

      {/* Lightbox */}
      <div
        className={`fixed inset-0 z-[400] flex items-center justify-center p-6 transition-all duration-400 ease-[var(--ease)] ${
          active !== null ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setActive(null)}
      >
        <div className="absolute inset-0 bg-bgdarker/92 backdrop-blur-sm" />

        {active !== null && (
          <div
            className="relative max-w-[720px] w-full bg-white rounded-sm overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,.6)] transition-all duration-400 ease-[var(--ease)]"
            style={{
              transform: active !== null ? "scale(1) translateY(0)" : "scale(.94) translateY(16px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-ink/85 text-white flex items-center justify-center hover:bg-flame1 transition-colors duration-300"
            >
              &times;
            </button>

            <div className="h-[360px] md:h-[440px] flex items-center justify-center p-10 bg-paper2 relative overflow-hidden">
              <span className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-flame1/15 to-gold/15 blur-3xl" />
              <img
                key={active}
                src={items[active].src}
                alt={items[active].name}
                className="relative max-h-full max-w-full object-contain animate-[fadeScale_.45s_var(--ease)]"
              />
            </div>

            <div className="px-7 py-5 border-t border-black/[.07] flex items-center justify-between gap-4">
              <div>
                <div className="sec-eyebrow !mb-1">Al Nawras Systems &amp; Solutions</div>
                <h3 className="font-display uppercase text-[19px] tracking-wide text-ink">
                  {items[active].name}
                </h3>
              </div>
              {items.length > 1 && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActive((active - 1 + items.length) % items.length)}
                    aria-label="Previous"
                    className="w-9 h-9 rounded-full border border-black/[.12] flex items-center justify-center text-ink hover:border-flame1 hover:text-flame1 transition-colors duration-300"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M15 6l-6 6 6 6" /></svg>
                  </button>
                  <button
                    onClick={() => setActive((active + 1) % items.length)}
                    aria-label="Next"
                    className="w-9 h-9 rounded-full border border-black/[.12] flex items-center justify-center text-ink hover:border-flame1 hover:text-flame1 transition-colors duration-300"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
