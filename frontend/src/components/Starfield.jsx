import React, { useEffect, useRef } from "react";

// Canvas starfield with 3 parallax layers + cursor gravity on dust.
const Starfield = ({ density = 1 }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth * window.devicePixelRatio);
    let h = (canvas.height = window.innerHeight * window.devicePixelRatio);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    const LAYERS = [
      { count: Math.floor(140 * density), speed: 0.08, size: [0.4, 0.9], alpha: [0.3, 0.7], parallax: 8 },
      { count: Math.floor(90 * density), speed: 0.18, size: [0.7, 1.4], alpha: [0.5, 0.9], parallax: 18 },
      { count: Math.floor(40 * density), speed: 0.32, size: [1.0, 2.0], alpha: [0.7, 1.0], parallax: 34 }
    ];

    const stars = LAYERS.flatMap((layer, li) =>
      Array.from({ length: layer.count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (layer.size[0] + Math.random() * (layer.size[1] - layer.size[0])) * window.devicePixelRatio,
        a: layer.alpha[0] + Math.random() * (layer.alpha[1] - layer.alpha[0]),
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        layer: li,
        speed: layer.speed,
        parallax: layer.parallax
      }))
    );

    // Dust particles (react to cursor)
    const dust = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      r: (0.6 + Math.random() * 1.2) * window.devicePixelRatio,
      a: 0.2 + Math.random() * 0.3
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
      // smooth lerp of mouse
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.06;
      const mx = mouseRef.current.x || w / 2;
      const my = mouseRef.current.y || h / 2;

      ctx.clearRect(0, 0, w, h);

      // Stars
      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        const flick = 0.7 + Math.sin(s.twinkle) * 0.3;
        const offX = ((mx - w / 2) / w) * s.parallax;
        const offY = ((my - h / 2) / h) * s.parallax;
        s.y += s.speed;
        if (s.y > h + 10) { s.y = -10; s.x = Math.random() * w; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(230, 230, 255, ${s.a * flick})`;
        ctx.arc(s.x + offX, s.y + offY, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.layer === 2 && flick > 0.95) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 220, 180, ${s.a * 0.4})`;
          ctx.arc(s.x + offX, s.y + offY, s.r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Dust — cursor gravity
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default Starfield;
