import React, { useEffect, useRef, useState } from "react";
import { profile } from "../mock/mock";

// Galaxy Approach: a canvas-rendered rotating spiral galaxy + copy fades in.
const Galaxy = () => {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0 -> 1 as user scrolls through section

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let w = 0, h = 0, cx = 0, cy = 0;
    let stars = [];

    const build = () => {
      w = canvas.width = Math.max(canvas.clientWidth * dpr, 800);
      h = canvas.height = Math.max(canvas.clientHeight * dpr, 800);
      cx = w / 2;
      cy = h / 2;
      const arms = 4;
      const count = 2400;
      stars = [];
      for (let i = 0; i < count; i++) {
        const r = Math.pow(Math.random(), 0.55) * Math.min(w, h) * 0.46;
        const arm = Math.floor(Math.random() * arms);
        const armOffset = (arm * Math.PI * 2) / arms;
        const theta = armOffset + r * 0.014 + (Math.random() - 0.5) * 0.45;
        const bright = Math.random();
        stars.push({
          r, theta, bright,
          size: (0.5 + Math.random() * 1.8) * dpr,
        });
      }
    };

    // Wait for layout then build
    requestAnimationFrame(() => { build(); });
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);
    window.addEventListener("resize", build);

    let rotation = 0;
    let raf;
    const draw = () => {
      if (w > 0 && h > 0 && stars.length) {
        ctx.clearRect(0, 0, w, h);
        rotation += 0.0008;

        // Brighter, larger core glow
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.42);
        grad.addColorStop(0, "rgba(255, 230, 180, 0.55)");
        grad.addColorStop(0.15, "rgba(255, 200, 150, 0.32)");
        grad.addColorStop(0.4, "rgba(190, 130, 200, 0.14)");
        grad.addColorStop(0.7, "rgba(80, 60, 120, 0.06)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Stars along spiral
        for (const s of stars) {
          const t = s.theta + rotation * (1 + 0.1 * (1 - s.r / (Math.min(w, h) * 0.5)));
          const x = cx + Math.cos(t) * s.r;
          const y = cy + Math.sin(t) * s.r * 0.42; // less flat = more spiral body
          const r = s.r / (Math.min(w, h) * 0.5);
          const cr = Math.round(255 - r * 55);
          const cg = Math.round(220 - r * 40);
          const cb = Math.round(180 + r * 70);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${(0.4 + s.bright * 0.6) * (1 - r * 0.3)})`;
          ctx.beginPath();
          ctx.arc(x, y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", build);
    };
  }, []);

  // Scroll progress within this section — aligned with sticky pin range
  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // sticky pins while rect.top <= 0 and rect.bottom >= vh
      const scrollable = Math.max(1, rect.height - vh);
      const p = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Galaxy scales up and slightly blurs as we approach it
  const scale = 0.7 + progress * 1.0; // 0.7 -> 1.7
  const blur = Math.max(0, 6 - progress * 14); // starts blurry, sharpens fast
  const galaxyOpacity = Math.min(1, 0.25 + progress * 2.2);
  const textOpacity = Math.min(1, Math.max(0, (progress - 0.28) * 2.3));

  return (
    <section id="galaxy" ref={wrapRef} className="relative min-h-[220vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            opacity: galaxyOpacity,
            transition: "filter 0.3s ease-out"
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-[120vmin] h-[120vmin] max-w-[1400px] max-h-[1400px]"
          />
        </div>

        {/* Intro copy */}
        <div
          className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-28"
          style={{ opacity: textOpacity, transform: `translateY(${(1 - textOpacity) * 30}px)` }}
        >
          <div className="max-w-2xl">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-200/70 mb-6">
              — Approaching the Milky Way
            </div>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-white">
              I build <span className="italic text-amber-100/90">quiet</span> interfaces for <br className="hidden md:block" />
              <span className="italic text-rose-200/80">loud</span> ideas.
            </h2>
            <div className="mt-10 grid md:grid-cols-[auto_1fr] gap-x-10 gap-y-3 text-white/70">
              <div className="font-mono text-[11px] tracking-widest uppercase text-white/40 pt-1">
                Role
              </div>
              <div className="text-lg">{profile.role}</div>
              <div className="font-mono text-[11px] tracking-widest uppercase text-white/40 pt-1">
                About
              </div>
              <p className="text-base md:text-lg leading-relaxed text-white/75 font-light">
                {profile.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,0,16,0.85) 100%)"
        }} />
      </div>
    </section>
  );
};

export default Galaxy;
