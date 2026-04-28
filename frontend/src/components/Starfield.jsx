import React, { useEffect, useRef } from "react";

// A multi-layered starfield + distant galaxies + drifting nebula gas clouds.
// This is the cosmic backdrop for the entire site.
const Starfield = ({ density = 1 }) => {
  const canvasRef = useRef(null);
  const nebulaRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rafRef = useRef(null);

  // ---------- Static (well, slowly animating) nebula layer on its own canvas ----------
  useEffect(() => {
    const c = nebulaRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let w, h;
    const resize = () => {
      w = c.width = window.innerWidth * dpr;
      h = c.height = window.innerHeight * dpr;
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
      paint();
    };

    // Distant galaxies — small ellipses with a bright core glow
    const galaxies = Array.from({ length: 28 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: 12 + Math.random() * 38, // px (will multiply by dpr)
      tilt: Math.random() * Math.PI,
      flatness: 0.18 + Math.random() * 0.5,
      hue: ["#ffd9a8", "#ffe7c1", "#cfb6ff", "#a8d4ff", "#ffb8c9", "#fff1d6"][Math.floor(Math.random() * 6)],
      core: ["#fff5da", "#fff", "#ffe9b8"][Math.floor(Math.random() * 3)],
      alpha: 0.35 + Math.random() * 0.4
    }));

    // Nebula gas clouds — large soft radial gradients
    const nebulae = [
      { x: 0.18, y: 0.22, r: 0.42, color: "rgba(120, 70, 180, 0.18)" },
      { x: 0.78, y: 0.15, r: 0.36, color: "rgba(80, 130, 220, 0.16)" },
      { x: 0.62, y: 0.68, r: 0.5,  color: "rgba(220, 90, 130, 0.10)" },
      { x: 0.10, y: 0.78, r: 0.45, color: "rgba(220, 170, 90, 0.10)" },
      { x: 0.42, y: 0.50, r: 0.55, color: "rgba(60, 90, 160, 0.10)" },
      { x: 0.88, y: 0.85, r: 0.32, color: "rgba(180, 110, 200, 0.12)" }
    ];

    const paint = () => {
      ctx.clearRect(0, 0, w, h);

      // Nebula clouds
      for (const n of nebulae) {
        const grad = ctx.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, n.r * Math.min(w, h));
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Distant galaxies
      for (const g of galaxies) {
        const gx = g.x * w;
        const gy = g.y * h;
        const r = g.r * dpr;

        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(g.tilt);

        // Disk halo
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.6);
        halo.addColorStop(0, hexA(g.hue, 0.45 * g.alpha));
        halo.addColorStop(0.4, hexA(g.hue, 0.18 * g.alpha));
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 1.6, r * 1.6 * g.flatness, 0, 0, Math.PI * 2);
        ctx.fill();

        // Disk body (slightly brighter)
        const body = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        body.addColorStop(0, hexA(g.core, 0.95 * g.alpha));
        body.addColorStop(0.4, hexA(g.hue, 0.55 * g.alpha));
        body.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * g.flatness, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        const core = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.25);
        core.addColorStop(0, hexA(g.core, 1));
        core.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ---------- Star + dust canvas (animated) ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth * window.devicePixelRatio);
    let h = (canvas.height = window.innerHeight * window.devicePixelRatio);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    const LAYERS = [
      { count: Math.floor(180 * density), speed: 0.05, size: [0.3, 0.8], alpha: [0.25, 0.6], parallax: 6 },
      { count: Math.floor(140 * density), speed: 0.15, size: [0.6, 1.3], alpha: [0.45, 0.85], parallax: 16 },
      { count: Math.floor(60 * density), speed: 0.30, size: [1.0, 2.0], alpha: [0.65, 1.0], parallax: 30 }
    ];

    const stars = LAYERS.flatMap((layer, li) =>
      Array.from({ length: layer.count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (layer.size[0] + Math.random() * (layer.size[1] - layer.size[0])) * window.devicePixelRatio,
        a: layer.alpha[0] + Math.random() * (layer.alpha[1] - layer.alpha[0]),
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.008 + Math.random() * 0.025,
        layer: li,
        speed: layer.speed,
        parallax: layer.parallax,
        // Subtle color tint for variety: warm white, cool white, or pale amber
        tint: Math.random() < 0.85
          ? "230, 230, 255"
          : (Math.random() < 0.5 ? "255, 220, 180" : "200, 220, 255")
      }))
    );

    const dust = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      r: (0.6 + Math.random() * 1.2) * window.devicePixelRatio,
      a: 0.18 + Math.random() * 0.25
    }));

    const onMouse = (e) => {
      mouseRef.current.tx = e.clientX * window.devicePixelRatio;
      mouseRef.current.ty = e.clientY * window.devicePixelRatio;
    };
    const onResize = () => {
      w = canvas.width = window.innerWidth * window.devicePixelRatio;
      h = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize", onResize);

    const draw = () => {
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.06;
      const mx = mouseRef.current.x || w / 2;
      const my = mouseRef.current.y || h / 2;

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        const flick = 0.7 + Math.sin(s.twinkle) * 0.3;
        const offX = ((mx - w / 2) / w) * s.parallax;
        const offY = ((my - h / 2) / h) * s.parallax;
        s.y += s.speed;
        if (s.y > h + 10) { s.y = -10; s.x = Math.random() * w; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.tint}, ${s.a * flick})`;
        ctx.arc(s.x + offX, s.y + offY, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.layer === 2 && flick > 0.93) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 220, 180, ${s.a * 0.35})`;
          ctx.arc(s.x + offX, s.y + offY, s.r * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const p of dust) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
        const force = Math.min(120 * window.devicePixelRatio, 3500 / dist);
        p.vx += (dx / dist) * force * 0.00015;
        p.vy += (dy / dist) * force * 0.00015;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(200, 210, 255, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return (
    <>
      {/* Nebula + distant galaxies (deepest layer) */}
      <canvas
        ref={nebulaRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {/* Stars + dust (animated) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </>
  );
};

// Helpers
const hexA = (hex, alpha) => {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
};

export default Starfield;
