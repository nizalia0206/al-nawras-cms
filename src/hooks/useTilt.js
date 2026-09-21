import { useRef, useCallback } from "react";

/**
 * useTilt — tracks the pointer over an element and exposes
 * event handlers that set CSS custom properties for a subtle,
 * realistic 3D tilt + glare-follow effect. Pure CSS does the
 * actual transform; this hook only computes and writes vars,
 * so it stays cheap even with many cards on screen.
 */
export function useTilt({ max = 8, glare = true } = {}) {
  const ref = useRef(null);
  const frame = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * (max * 2);
      const rx = (0.5 - py) * (max * 2);
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      if (glare) {
        el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      }
    });
  }, [max, glare]);

  const onMouseEnter = useCallback(() => {
    ref.current?.classList.add("is-hovering");
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-hovering");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  }, []);

  // Touch devices don't fire mouse events reliably — give the same
  // tilt + glow feedback on touch so the effect isn't desktop-only.
  const onTouchStart = useCallback((e) => {
    const el = ref.current;
    const t = e.touches && e.touches[0];
    if (!el || !t) return;
    const rect = el.getBoundingClientRect();
    const px = (t.clientX - rect.left) / rect.width;
    const py = (t.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${((0.5 - py) * (max * 2)).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * (max * 2)).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    el.classList.add("is-hovering");
  }, [max]);

  const onTouchEnd = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // let the lift/glow stay visible briefly so it actually reads as
    // an effect before navigation / reset happens
    setTimeout(() => {
      el.classList.remove("is-hovering");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }, 260);
  }, []);

  return { ref, onMouseMove, onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd };
}
