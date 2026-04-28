import React, { useEffect, useRef } from "react";

/**
 * Cosmic backdrop made of three layered canvases:
 *   1. Nebula canvas (deep, painted once on resize):
 *        - Two large realistic nebulae (Orion / Eagle style)
 *           with multi-color clouds, dust filaments, embedded young stars
 *        - ~36 distant galaxies with star halos and varied morphology
 *        - Faint background star dust
 *   2. Star canvas (animated, parallax + twinkle)
 *   3. Cursor-driven dust particles
 */
const Starfield = ({ density = 1 }) => {
  const nebulaRef = useRef(null);
  const starRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rafRef = useRef(null);

  /* ------------ STATIC NEBULA + DISTANT GALAXIES (painted once per resize) ------------ */
  useEffect(() => {
    const c = nebulaRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let w, h;

    const paint = () => {
      ctx.clearRect(0, 0, w, h);

      // ---- 1. Soft global gas wash ----
      const gases = [
        { x: 0.18, y: 0.22, r: 0.42, color: "rgba(120, 70, 180, 0.16)" },
        { x: 0.78, y: 0.15, r: 0.36, color: "rgba(80, 130, 220, 0.14)" },
        { x: 0.62, y: 0.68, r: 0.50, color: "rgba(220, 90, 130, 0.09)" },
        { x: 0.10, y: 0.80, r: 0.45, color: "rgba(220, 170, 90, 0.10)" },
        { x: 0.42, y: 0.50, r: 0.55, color: "rgba(60, 90, 160, 0.10)" },
        { x: 0.88, y: 0.85, r: 0.32, color: "rgba(180, 110, 200, 0.10)" }
      ];
      for (const n of gases) {
        const grad = ctx.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, n.r * Math.min(w, h));
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // ---- 2. Large realistic nebulae (two of them) ----
      paintNebula(ctx, w, h, dpr, {
        cx: w * 0.82,
        cy: h * 0.30,
        size: Math.min(w, h) * 0.42,
        rot: 0.4,
        // Orion-style: pink/magenta core, blue young stars, amber edges
        palette: [
          { c: "rgba(255, 90, 130, 0.18)", t: 0.0 },
          { c: "rgba(220, 110, 180, 0.12)", t: 0.25 },
          { c: "rgba(120, 80, 200, 0.09)", t: 0.50 },
          { c: "rgba(60, 110, 200, 0.07)", t: 0.75 },
          { c: "rgba(0, 0, 0, 0)", t: 1.0 }
        ],
        starTint: ["#cfe5ff", "#fff", "#ffe9b8"],
        starCount: 70,
        dustCount: 10
      });

      paintNebula(ctx, w, h, dpr, {
        cx: w * 0.14,
        cy: h * 0.78,
        size: Math.min(w, h) * 0.34,
        rot: 1.6,
        // Eagle-style: cyan/teal core, amber edges
        palette: [
          { c: "rgba(140, 220, 255, 0.16)", t: 0.0 },
          { c: "rgba(120, 200, 220, 0.11)", t: 0.25 },
          { c: "rgba(220, 140, 90, 0.09)", t: 0.55 },
          { c: "rgba(160, 80, 60, 0.06)", t: 0.80 },
          { c: "rgba(0, 0, 0, 0)", t: 1.0 }
        ],
        starTint: ["#fff", "#ffd6a8", "#cfe5ff"],
        starCount: 55,
        dustCount: 8
      });

      // ---- 3. Distant galaxies (varied: spiral / elliptical / ring) ----
      const galaxies = generateGalaxies(36, w, h);
      for (const g of galaxies) paintGalaxy(ctx, g, dpr);

      // ---- 4. Faint deep-field star dust (lots of tiny dots) ----
      ctx.save();
      for (let i = 0; i < 800; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = (0.2 + Math.random() * 0.5) * dpr;
        const a = 0.15 + Math.random() * 0.4;
        ctx.fillStyle = `rgba(220, 220, 240, ${a})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
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

  /* ------------ STAR + DUST CANVAS (animated) ------------ */
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
      <canvas ref={nebulaRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
      <canvas ref={starRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
    </>
  );
};

/* =================== HELPERS =================== */

// Paint a realistic nebula: layered gas, dust filaments, embedded young stars
function paintNebula(ctx, w, h, dpr, opts) {
  const { cx, cy, size, rot, palette, starTint, starCount, dustCount } = opts;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  // Multi-color gas: 6 overlapping irregular blobs, each its own color stop
  ctx.globalCompositeOperation = "screen";
  const blobCount = 9;
  for (let i = 0; i < blobCount; i++) {
    const ang = (i / blobCount) * Math.PI * 2 + (i * 0.31);
    const offset = size * (0.05 + Math.random() * 0.35);
    const bx = Math.cos(ang) * offset;
    const by = Math.sin(ang) * offset * 0.65;
    const br = size * (0.35 + Math.random() * 0.45);
    const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    // Pick two adjacent palette stops to mix
    const k = i % (palette.length - 1);
    grad.addColorStop(0, palette[k].c);
    grad.addColorStop(0.5, palette[Math.min(k + 1, palette.length - 1)].c);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(bx, by, br, br * 0.7, ang, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  // Dust filaments — dark curved blobs (multiply)
  ctx.globalCompositeOperation = "multiply";
  for (let i = 0; i < dustCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = size * (0.1 + Math.random() * 0.55);
    const px = Math.cos(ang) * r;
    const py = Math.sin(ang) * r * 0.7;
    const dr = size * (0.1 + Math.random() * 0.18);
    const dg = ctx.createRadialGradient(px, py, 0, px, py, dr);
    dg.addColorStop(0, "rgba(8, 4, 20, 0.55)");
    dg.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = dg;
    ctx.beginPath();
    ctx.ellipse(px, py, dr, dr * 0.5, ang, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  // Embedded young stars — bright cores with halo glow
  for (let i = 0; i < starCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.6) * size * 0.7;
    const px = Math.cos(ang) * r;
    const py = Math.sin(ang) * r * 0.7;
    const tint = starTint[Math.floor(Math.random() * starTint.length)];
    const sr = (0.4 + Math.random() * 1.2) * dpr;
    const isBright = Math.random() < 0.18;
    if (isBright) {
      // Halo
      const halo = ctx.createRadialGradient(px, py, 0, px, py, sr * 8);
      halo.addColorStop(0, hexA(tint, 0.55));
      halo.addColorStop(0.5, hexA(tint, 0.18));
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(px, py, sr * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = hexA(tint, 0.95);
    ctx.beginPath();
    ctx.arc(px, py, sr * (isBright ? 1.6 : 1), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function generateGalaxies(count, w, h) {
  const types = ["spiral", "spiral", "spiral", "elliptical", "edge", "ring"];
  const palettes = [
    { hue: "#ffd9a8", core: "#fff5da", arm: "#ffe7c1" },
    { hue: "#cfb6ff", core: "#fff", arm: "#e8d8ff" },
    { hue: "#a8d4ff", core: "#ffeec0", arm: "#cfe6ff" },
    { hue: "#ffb8c9", core: "#fff", arm: "#ffd0db" },
    { hue: "#fff1d6", core: "#fff", arm: "#ffe7c1" },
    { hue: "#ffcfa8", core: "#fff5da", arm: "#ffd9b8" }
  ];
  return Array.from({ length: count }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 14 + Math.random() * 38,
    tilt: Math.random() * Math.PI,
    flatness: 0.18 + Math.random() * 0.55,
    type: types[Math.floor(Math.random() * types.length)],
    palette: palettes[Math.floor(Math.random() * palettes.length)],
    alpha: 0.4 + Math.random() * 0.4,
    armCount: 2 + Math.floor(Math.random() * 3) // 2-4
  }));
}

function paintGalaxy(ctx, g, dpr) {
  const { x, y, r, tilt, flatness, type, palette, alpha, armCount } = g;
  const R = r * dpr;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);

  // ---- Outer star halo (faint scatter of stars around galaxy) ----
  const haloStarCount = type === "elliptical" ? 28 : 20;
  for (let i = 0; i < haloStarCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const dist = R * (1.1 + Math.random() * 1.6);
    const sx = Math.cos(a) * dist;
    const sy = Math.sin(a) * dist * (type === "elliptical" ? flatness * 1.3 : flatness * 0.8 + 0.2);
    const sr = (0.3 + Math.random() * 0.8) * dpr;
    ctx.fillStyle = hexA("#ffffff", (0.25 + Math.random() * 0.45) * alpha);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---- Outer aura ring ----
  const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 2);
  aura.addColorStop(0, hexA(palette.hue, 0.32 * alpha));
  aura.addColorStop(0.45, hexA(palette.hue, 0.10 * alpha));
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.ellipse(0, 0, R * 2, R * 2 * (type === "elliptical" ? flatness : Math.max(flatness, 0.55)), 0, 0, Math.PI * 2);
  ctx.fill();

  if (type === "spiral") {
    // ---- Disk body ----
    const disk = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    disk.addColorStop(0, hexA(palette.core, 0.95 * alpha));
    disk.addColorStop(0.35, hexA(palette.hue, 0.55 * alpha));
    disk.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = disk;
    ctx.beginPath();
    ctx.ellipse(0, 0, R, R * flatness, 0, 0, Math.PI * 2);
    ctx.fill();

    // ---- Spiral arms (subtle bright streaks) ----
    ctx.globalCompositeOperation = "screen";
    for (let arm = 0; arm < armCount; arm++) {
      const armAngle = (arm * Math.PI * 2) / armCount;
      for (let k = 0; k < 14; k++) {
        const t = k / 14;
        const rad = R * (0.15 + t * 0.85);
        const a = armAngle + rad * 0.04;
        const px = Math.cos(a) * rad;
        const py = Math.sin(a) * rad * flatness;
        const sr = (0.5 + Math.random() * 1.4) * dpr;
        ctx.fillStyle = hexA(palette.arm, (1 - t) * 0.7 * alpha);
        ctx.beginPath();
        ctx.arc(px, py, sr, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";

    // ---- Bright core ----
    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.28);
    core.addColorStop(0, hexA(palette.core, alpha));
    core.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.28, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "elliptical") {
    // Smooth gradient ellipse
    const body = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.2);
    body.addColorStop(0, hexA(palette.core, alpha));
    body.addColorStop(0.4, hexA(palette.hue, 0.55 * alpha));
    body.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.2, R * 1.2 * flatness, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "edge") {
    // Edge-on disk: thin streak with central bulge + dust lane
    const body = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    body.addColorStop(0, hexA(palette.core, alpha));
    body.addColorStop(0.4, hexA(palette.hue, 0.4 * alpha));
    body.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.4, R * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    // Bulge
    const bulge = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.35);
    bulge.addColorStop(0, hexA(palette.core, alpha));
    bulge.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = bulge;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.35, 0, Math.PI * 2);
    ctx.fill();
    // Dust lane
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgba(8, 4, 20, 0.85)";
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.2, R * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  } else if (type === "ring") {
    // Central bright dot + faint ring
    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.25);
    core.addColorStop(0, hexA(palette.core, alpha));
    core.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.25, 0, Math.PI * 2);
    ctx.fill();
    // Ring
    ctx.strokeStyle = hexA(palette.hue, 0.55 * alpha);
    ctx.lineWidth = R * 0.06;
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 0.85, R * 0.85 * flatness, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Faint outer ring
    ctx.strokeStyle = hexA(palette.hue, 0.18 * alpha);
    ctx.lineWidth = R * 0.025;
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.05, R * 1.05 * flatness, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

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
