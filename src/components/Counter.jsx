import { useEffect, useRef, useState } from "react";

export default function Counter({ target, suffix = "", label, theme = "dark" }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const dur = 1400;
            const start = performance.now();
            function tick(now) {
              const p = Math.min(1, (now - start) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(eased * target));
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  const isLight = theme === "light";

  return (
    <div
      className={`pr-8 md:pr-[34px] mr-8 md:mr-[34px] border-r last:border-r-0 last:mr-0 last:pr-0 pt-[22px] ${
        isLight ? "border-ink/[.1]" : "border-white/[.08]"
      }`}
    >
      <div
        ref={ref}
        className={`font-display text-[26px] md:text-[34px] font-semibold flex items-baseline gap-0.5 ${
          isLight ? "text-ink" : "text-white"
        }`}
      >
        <span>{value}</span>
        <span className="text-flame1 text-[18px] md:text-[22px]">{suffix}</span>
      </div>
      <div className={`text-[12px] tracking-wide mt-1.5 uppercase ${isLight ? "text-inksoft" : "text-steel"}`}>
        {label}
      </div>
    </div>
  );
}
