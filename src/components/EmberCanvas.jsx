import { useEffect, useRef } from "react";

export default function EmberCanvas({ boost = false, className = "absolute inset-0 w-full h-full z-[1]" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];
    let rafId;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function makeParticle() {
      return {
        x: W * 0.55 + (Math.random() - 0.3) * W * 0.5,
        y: H + 20 + Math.random() * 80,
        r: Math.random() * (boost ? 3.8 : 2.6) + (boost ? 1.1 : 0.6),
        vy: Math.random() * (boost ? 1.3 : 0.9) + (boost ? 0.55 : 0.35),
        vx: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: Math.random() * 260 + 180,
        hue: Math.random() > 0.5 ? 22 : 38,
        flicker: Math.random() * Math.PI * 2,
      };
    }

    const base = window.innerWidth < 700 ? 45 : 90;
    const count = boost ? Math.round(base * 1.9) : base;
    for (let i = 0; i < count; i++) {
      const p = makeParticle();
      p.y = Math.random() * H;
      particles.push(p);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.life++;
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.flicker + p.life * 0.02) * 0.3;
        p.flicker += 0.02;
        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.15 ? lifeRatio / 0.15 : Math.max(0, 1 - (lifeRatio - 0.15) / 0.85);
        const glowAlpha = boost ? alpha : alpha * 0.9;
        const coreAlpha = boost ? Math.min(1, alpha * 1.15) : alpha;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * (boost ? 5 : 4));
        grad.addColorStop(0, `hsla(${p.hue},100%,60%,${glowAlpha})`);
        grad.addColorStop(1, `hsla(${p.hue},100%,50%,0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r * (boost ? 5 : 4), 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue + 10},100%,70%,${coreAlpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (p.life > p.maxLife || p.y < -20) {
          Object.assign(p, makeParticle());
        }
      });
      if (!reduceMotion) rafId = requestAnimationFrame(draw);
    }

    if (!reduceMotion) {
      rafId = requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [boost]);

  return <canvas ref={canvasRef} className={className} />;
}
