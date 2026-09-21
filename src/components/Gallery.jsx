import { useEffect, useState } from "react";
import { useTilt } from "../hooks/useTilt";

/**
 * Systems & Solutions picture card — same card as the Brands / Products page
 * (see .sys-card in index.css): 3D-tilt tile, square white thumbnail, brand tag,
 * category chip, 2-line title + description, dashed divider, Get Quote button.
 * Clicking the card opens the lightbox below.
 */
function SystemCard({ item, category, onOpen }) {
  const { ref, onMouseMove, onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd } = useTilt({ max: 10 });

  return (
    <div
      ref={ref}
      className="sys-card"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.name}`}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return; // ignore keys pressed on the Get Quote link
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="thumb">
        {item.brand && <span className="supplier-tag">{item.brand}</span>}
        <img src={item.src} alt={item.name} loading="lazy" />
        <span className="quick-view">Tap to enlarge →</span>
      </div>

      <div className="body">
        {category && <span className="cat-chip">{category}</span>}
        <h3>{item.name}</h3>
        {item.desc && <p className="short">{item.desc}</p>}
        <div className="price-row">
          <a
            href={`https://wa.me/971551099885?text=${encodeURIComponent(
              `Hi Al Nawras, I'd like to get a quote for ${item.name}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get a quote for ${item.name}`}
            onClick={(e) => e.stopPropagation()}
            className="btn btn-flame !py-2.5 !text-[11.5px] w-full justify-center"
          >
            Get Quote
          </a>
        </div>
      </div>
      <span className="card-accent-line" aria-hidden="true" />
    </div>
  );
}

export default function Gallery({ items, category }) {
  const [active, setActive] = useState(null);

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
      <div className="sys-grid" data-count={items.length}>
        {items.map((item, i) => (
          <SystemCard key={item.name + i} item={item} category={category} onOpen={() => setActive(i)} />
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

            {/* pictures are white-background product shots, so the stage is white too */}
            <div className="h-[360px] md:h-[440px] flex items-center justify-center p-6 md:p-8 bg-white relative overflow-hidden">
              <img
                key={active}
                src={items[active].src}
                alt={items[active].name}
                className="relative max-h-full max-w-full object-contain animate-[fadeScale_.45s_var(--ease)]"
              />
            </div>

            <div className="px-7 py-5 border-t border-black/[.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="sec-eyebrow !mb-1">
                  {items[active].brand ? items[active].brand : "Al Nawras Systems & Solutions"}
                </div>
                <h3 className="font-display uppercase text-[19px] tracking-wide text-ink">
                  {items[active].name}
                </h3>
                {items[active].desc && (
                  <p className="text-[13px] leading-[1.6] text-inksoft mt-1.5 max-w-[46ch]">{items[active].desc}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`https://wa.me/971551099885?text=${encodeURIComponent(
                    `Hi Al Nawras, I'd like to get a quote for ${items[active].name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-flame !py-2.5 !px-5 !text-[12.5px]"
                >
                  Get Quote
                </a>
                {items.length > 1 && (
                  <div className="flex items-center gap-2">
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
          </div>
        )}
      </div>
    </>
  );
}
