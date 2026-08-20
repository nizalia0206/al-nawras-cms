import { useEffect, useRef, useState } from "react";

/**
 * Wraps children in a fade/slide-up reveal that triggers once the
 * element scrolls into view. Falls back to "always visible" if
 * IntersectionObserver isn't available or reduced-motion is set.
 *
 * Usage: <Reveal delay={80}><section>...</section></Reveal>
 */
export default function Reveal({ children, as: Tag = "div", delay = 0, y = 22, className = "", ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    // If the element is already on screen at mount (e.g. above-the-fold
    // content right after a route change), reveal it immediately instead
    // of waiting on the observer — avoids content getting stuck invisible.
    const rect = el.getBoundingClientRect();
    const already = rect.top < (window.innerHeight || 800) * 1.05 && rect.bottom > -100;
    if (already) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px 0px 0px" }
    );
    io.observe(el);
    // safety net: never let something stay invisible forever
    const fallback = setTimeout(() => setInView(true), 1200);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "reveal-in" : ""} ${className}`}
      style={{ "--reveal-y": `${y}px`, "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
