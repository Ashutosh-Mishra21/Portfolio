import React, { useEffect, useRef, useState } from "react";

/**
 * Cosmic backdrop with two scenes that cross-fade with scroll position:
 *
 *  Scene A (top of page, scrollProgress = 0):
 *    Pure deep-space view of the HELIX NEBULA ("Eye of God") —
 *    central white star + cyan/teal inner ring + amber/red outer ring,
 *    surrounded by sparse stars.
 *
 *  Scene B (after the About section, scrollProgress = 1):
 *    Inside the Milky Way — dense star clouds, warm gas tendrils,
 *    dark dust silhouettes, and slowly-drifting ASTEROIDS in the
 *    foreground.
 *
 *  scrollProgress transitions linearly from 0 → 1 as the user scrolls
 *  through the hero + About section.
 */
const Starfield = ({ density = 1 }) => {
  const helixRef = useRef(null);     // Helix nebula painted layer
  const interiorRef = useRef(null);  // Milky Way gas / dust painted layer
  const starRef = useRef(null);      // animated stars + dust + asteroids
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rafRef = useRef(null);
  const [progress, setProgress] = useState(0);

  /* -------- Scroll progress 0 (hero) → 1 (past About) -------- */
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      const start = vh * 0.6;          // begin transition mid-hero
      const end = vh * 3.0;            // fully inside Milky Way after about ~3 viewports
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, (y - start) / (end - start)));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* -------- Helix nebula (painted once per resize) -------- */
  useEffect(() => {
    const c = helixRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let w, h;

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5;
      const cy = h * 0.48;
      const baseR = Math.min(w, h) * 0.32;

      /* Outer faint halo (red / pink) */
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 2.4);
      halo.addColorStop(0.0, "rgba(255, 130, 110, 0.0)");
      halo.addColorStop(0.4, "rgba(220, 90, 110, 0.10)");
      halo.addColorStop(0.7, "rgba(160, 70, 130, 0.06)");
      halo.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      /* Outer ring (orange / red gas) — thick band of dust */
      paintRing(ctx, cx, cy, {
        innerR: baseR * 1.05,
        outerR: baseR * 1.6,
        flatness: 0.92,
        rot: 0.05,
        stops: [
          [0.0, "rgba(255,130,80,0.0)"],
          [0.25, "rgba(255,140,90,0.55)"],
          [0.55, "rgba(255,90,90,0.45)"],
          [0.85, "rgba(180,60,80,0.25)"],
          [1.0, "rgba(0,0,0,0)"]
        ],
        knots: 90,
        knotColor: ["#ffd6b8", "#ffae8b", "#ff7c6c"],
        dpr
      });

      /* Inner ring (cyan / teal — ionized oxygen) */
      paintRing(ctx, cx, cy, {
        innerR: baseR * 0.62,
        outerR: baseR * 1.05,
        flatness: 0.92,
        rot: 0.05,
        stops: [
          [0.0, "rgba(80,200,220,0.0)"],
          [0.3, "rgba(120,220,230,0.55)"],
          [0.6, "rgba(80,200,210,0.55)"],
          [0.9, "rgba(60,140,200,0.30)"],
          [1.0, "rgba(0,0,0,0)"]
        ],
        knots: 70,
        knotColor: ["#cff8ff", "#9fe6f0", "#5fc8d8"],
        dpr
      });

      /* Inner glow (cyan core inside the iris) */
      const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 0.62);
      inner.addColorStop(0.0, "rgba(160,230,255,0.22)");
      inner.addColorStop(0.6, "rgba(80,180,220,0.10)");
      inner.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = inner;
      ctx.beginPath();
      ctx.ellipse(cx, cy, baseR * 0.62, baseR * 0.62 * 0.92, 0, 0, Math.PI * 2);
      ctx.fill();

      /* Central white-dwarf star with diffraction spikes */
      const starR = baseR * 0.025;
      // Halo
      const starHalo = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR * 12);
      starHalo.addColorStop(0, "rgba(255,255,255,0.95)");
      starHalo.addColorStop(0.2, "rgba(220,230,255,0.55)");
      starHalo.addColorStop(0.6, "rgba(160,200,255,0.18)");
      starHalo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = starHalo;
      ctx.beginPath();
      ctx.arc(cx, cy, starR * 12, 0, Math.PI * 2);
      ctx.fill();
      // Diffraction spikes
      ctx.save();
      ctx.translate(cx, cy);
      for (const angle of [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]) {
        const grd = ctx.createLinearGradient(-baseR * 0.6, 0, baseR * 0.6, 0);
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(0.5, "rgba(255,255,255,0.5)");
        grd.addColorStop(1, "rgba(255,255,255,0)");
        ctx.save();
        ctx.rotate(angle);
        ctx.fillStyle = grd;
        ctx.fillRect(-baseR * 0.6, -starR * 0.6, baseR * 1.2, starR * 1.2);
        ctx.restore();
      }
      ctx.restore();
      // Hot core
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.beginPath();
      ctx.arc(cx, cy, starR * 1.6, 0, Math.PI * 2);
      ctx.fill();

      /* Sparse field stars (just the helix scene) */
      for (let i = 0; i < 250; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = (0.3 + Math.random() * 0.9) * dpr;
        const a = 0.25 + Math.random() * 0.5;
        ctx.fillStyle = `rgba(220, 220, 240, ${a})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      w = c.width = window.innerWidth * dpr;
      h = c.height = window.innerHeight * dpr;
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
      paint();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* -------- Milky Way interior (painted once per resize) -------- */
  useEffect(() => {
    const c = interiorRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let w, h;

    const paint = () => {
      ctx.clearRect(0, 0, w, h);

      /* Warm gas tendrils (Milky Way bulge tones) */
      const clouds = [
        { x: 0.2, y: 0.3, r: 0.55, c: "rgba(220, 140, 90, 0.18)" },
        { x: 0.78, y: 0.18, r: 0.4, c: "rgba(255, 180, 130, 0.16)" },
        { x: 0.55, y: 0.65, r: 0.55, c: "rgba(180, 100, 90, 0.14)" },
        { x: 0.12, y: 0.78, r: 0.5, c: "rgba(220, 120, 150, 0.12)" },
        { x: 0.85, y: 0.85, r: 0.4, c: "rgba(160, 100, 200, 0.13)" },
        { x: 0.4, y: 0.45, r: 0.6, c: "rgba(255, 200, 140, 0.10)" },
        { x: 0.65, y: 0.32, r: 0.45, c: "rgba(140, 180, 220, 0.09)" }
      ];
      for (const n of clouds) {
        const grad = ctx.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, n.r * Math.min(w, h));
        grad.addColorStop(0, n.c);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      /* Dark dust silhouettes (chunky shadows blocking light) */
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      for (let i = 0; i < 14; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = (0.05 + Math.random() * 0.18) * Math.min(w, h);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, "rgba(8, 4, 20, 0.55)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * (0.4 + Math.random() * 0.4), Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      /* Dense background star clouds — very bright dust of small stars */
      for (let i = 0; i < 1800; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = (0.2 + Math.random() * 0.7) * dpr;
        const a = 0.2 + Math.random() * 0.6;
        // Tinted: warm gold, neutral, or cool blue
        const tint = Math.random() < 0.7
          ? `rgba(255, 230, 200, ${a})`
          : (Math.random() < 0.5 ? `rgba(220, 220, 255, ${a})` : `rgba(255, 200, 180, ${a})`);
        ctx.fillStyle = tint;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      /* A handful of bright stars with bloom */
      for (let i = 0; i < 22; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = (1.4 + Math.random() * 1.6) * dpr;
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 8);
        halo.addColorStop(0, "rgba(255,245,220,0.9)");
        halo.addColorStop(0.4, "rgba(255,210,170,0.25)");
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, r * 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      w = c.width = window.innerWidth * dpr;
      h = c.height = window.innerHeight * dpr;
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
      paint();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* -------- Animated stars + dust + asteroids -------- */
  useEffect(() => {
    const canvas = starRef.current;
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
        tint: Math.random() < 0.85
          ? "230, 230, 255"
          : (Math.random() < 0.5 ? "255, 220, 180" : "200, 220, 255")
      }))
    );

    const dust = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0, vy: 0,
      r: (0.6 + Math.random() * 1.2) * window.devicePixelRatio,
      a: 0.18 + Math.random() * 0.25
    }));

    /* Asteroids — irregular drifting rocks visible only inside Milky Way */
    const asteroids = Array.from({ length: 26 }).map(() => {
      const sides = 7 + Math.floor(Math.random() * 5);
      const verts = Array.from({ length: sides }).map((_, i) => {
        const ang = (i / sides) * Math.PI * 2;
        const rr = 0.6 + Math.random() * 0.5;
        return { ang, rr };
      });
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: (12 + Math.random() * 36) * window.devicePixelRatio,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        vx: (Math.random() - 0.5) * 0.4 * window.devicePixelRatio,
        vy: (0.05 + Math.random() * 0.4) * window.devicePixelRatio,
        verts,
        crater: Array.from({ length: 4 + Math.floor(Math.random() * 5) }).map(() => ({
          dx: (Math.random() - 0.5) * 0.7,
          dy: (Math.random() - 0.5) * 0.7,
          r: 0.07 + Math.random() * 0.13
        })),
        baseHue: 30 + Math.random() * 30
      };
    });

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

    let lastProgress = 0;
    const draw = () => {
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.06;
      const mx = mouseRef.current.x || w / 2;
      const my = mouseRef.current.y || h / 2;

      ctx.clearRect(0, 0, w, h);

      /* Read latest scroll progress via dataset */
      const p = canvas.__progress ?? lastProgress;
      lastProgress = p;

      /* Stars (always on, density boosts a bit when inside the galaxy) */
      const boost = 1 + p * 0.4;
      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        const flick = 0.7 + Math.sin(s.twinkle) * 0.3;
        const offX = ((mx - w / 2) / w) * s.parallax;
        const offY = ((my - h / 2) / h) * s.parallax;
        s.y += s.speed;
        if (s.y > h + 10) { s.y = -10; s.x = Math.random() * w; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.tint}, ${Math.min(1, s.a * flick * boost)})`;
        ctx.arc(s.x + offX, s.y + offY, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.layer === 2 && flick > 0.93) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 220, 180, ${s.a * 0.35})`;
          ctx.arc(s.x + offX, s.y + offY, s.r * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* Cursor dust */
      for (const d of dust) {
        const dx = mx - d.x;
        const dy = my - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
        const force = Math.min(120 * window.devicePixelRatio, 3500 / dist);
        d.vx += (dx / dist) * force * 0.00015;
        d.vy += (dy / dist) * force * 0.00015;
        d.vx *= 0.94;
        d.vy *= 0.94;
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(200, 210, 255, ${d.a})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Asteroids — only render when scrolled past the about section */
      if (p > 0.05) {
        for (const a of asteroids) {
          a.x += a.vx;
          a.y += a.vy;
          a.rot += a.rotSpeed;
          if (a.x < -a.size * 2) a.x = w + a.size;
          if (a.x > w + a.size * 2) a.x = -a.size;
          if (a.y > h + a.size * 2) { a.y = -a.size; a.x = Math.random() * w; }
          drawAsteroid(ctx, a, p);
        }
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

  /* Push the latest progress into the canvas dataset (avoids re-running effect) */
  useEffect(() => {
    if (starRef.current) starRef.current.__progress = progress;
  }, [progress]);

  return (
    <>
      {/* Helix nebula — fades out as we scroll past hero */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, opacity: 1 - progress, transition: "opacity 0.2s linear" }}
      >
        <canvas ref={helixRef} className="w-full h-full" />
      </div>

      {/* Milky Way interior — fades in as we scroll into the about section */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, opacity: progress, transition: "opacity 0.2s linear" }}
      >
        <canvas ref={interiorRef} className="w-full h-full" />
      </div>

      {/* Animated stars + cursor dust + asteroids (always on, intensity scales) */}
      <canvas
        ref={starRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </>
  );
};

/* =============== HELPERS =============== */

// Paints an irregular tilted ring with knot-like granular structure.
function paintRing(ctx, cx, cy, opts) {
  const { innerR, outerR, flatness, rot, stops, knots, knotColor, dpr } = opts;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  /* Smooth band fill via stroked ellipses */
  for (let r = innerR; r <= outerR; r += 1.5) {
    const t = (r - innerR) / (outerR - innerR);
    const color = sampleStops(stops, t);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * flatness, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  /* Knots — bright clumpy specks distributed within the band */
  for (let i = 0; i < knots; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = innerR + Math.random() * (outerR - innerR);
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * flatness;
    const sr = (0.6 + Math.random() * 1.5) * (dpr || 1);
    const c = knotColor[Math.floor(Math.random() * knotColor.length)];
    const halo = ctx.createRadialGradient(x, y, 0, x, y, sr * 6);
    halo.addColorStop(0, hexA(c, 0.7));
    halo.addColorStop(0.5, hexA(c, 0.18));
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, sr * 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hexA(c, 1);
    ctx.beginPath();
    ctx.arc(x, y, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function sampleStops(stops, t) {
  // Linearly interpolate between rgba color stops [pos, "rgba(...)"]
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i];
    const [p1, c1] = stops[i + 1];
    if (t >= p0 && t <= p1) {
      const k = (t - p0) / (p1 - p0 || 1);
      return mixRgba(c0, c1, k);
    }
  }
  return stops[stops.length - 1][1];
}

function mixRgba(a, b, k) {
  const pa = parseRgba(a);
  const pb = parseRgba(b);
  const m = (x, y) => Math.round(x + (y - x) * k);
  const ma = pa[3] + (pb[3] - pa[3]) * k;
  return `rgba(${m(pa[0], pb[0])},${m(pa[1], pb[1])},${m(pa[2], pb[2])},${ma})`;
}

function parseRgba(s) {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return [0, 0, 0, 0];
  const parts = m[1].split(",").map((x) => parseFloat(x.trim()));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0, parts[3] ?? 1];
}

function drawAsteroid(ctx, a, progress) {
  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(a.rot);

  // Body shape
  ctx.beginPath();
  for (let i = 0; i < a.verts.length; i++) {
    const v = a.verts[i];
    const px = Math.cos(v.ang) * a.size * v.rr;
    const py = Math.sin(v.ang) * a.size * v.rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  // Fill: rocky brown radial gradient
  const grad = ctx.createRadialGradient(-a.size * 0.25, -a.size * 0.3, 0, 0, 0, a.size);
  grad.addColorStop(0, `hsla(${a.baseHue}, 25%, 55%, ${0.85 * progress})`);
  grad.addColorStop(0.7, `hsla(${a.baseHue - 10}, 30%, 25%, ${0.85 * progress})`);
  grad.addColorStop(1, `hsla(${a.baseHue}, 25%, 12%, ${0.95 * progress})`);
  ctx.fillStyle = grad;
  ctx.fill();

  // Outline
  ctx.strokeStyle = `rgba(0,0,0,${0.5 * progress})`;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Craters
  for (const c of a.crater) {
    ctx.fillStyle = `hsla(${a.baseHue - 15}, 30%, 18%, ${0.7 * progress})`;
    ctx.beginPath();
    ctx.arc(c.dx * a.size, c.dy * a.size, c.r * a.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Highlight
  ctx.fillStyle = `hsla(${a.baseHue + 10}, 25%, 75%, ${0.18 * progress})`;
  ctx.beginPath();
  ctx.ellipse(-a.size * 0.25, -a.size * 0.3, a.size * 0.35, a.size * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function hexA(hex, alpha) {
  const h = hex.replace("#", "");
  const norm = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const bigint = parseInt(norm, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export default Starfield;
