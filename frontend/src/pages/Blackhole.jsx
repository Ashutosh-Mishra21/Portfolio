import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { timeline, resume, profile } from "../mock/mock";
import { ArrowDown, Download, ArrowLeft, ChevronRight, Award, Briefcase, GraduationCap, Sparkles, Code2 } from "lucide-react";

/**
 * Canvas black hole — Interstellar / Gargantua inspired.
 * Renders:
 *  - background starfield
 *  - gravitational lens halo (bright ring)
 *  - accretion disk (tilted ellipse behind the event horizon)
 *  - lensed upper arc of disk (the signature "Einstein ring over the top")
 *  - event horizon (pure black disk)
 *  - photon ring (thin bright ring)
 *
 * Scales via `zoom` prop to simulate being pulled in.
 */
const BlackHoleCanvas = ({ zoom = 1, warp = 0 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let w = 0, h = 0, cx = 0, cy = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      cx = w / 2;
      cy = h / 2;
    };
    resize();
    window.addEventListener("resize", resize);

    // Static starfield
    const stars = Array.from({ length: 260 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: (0.3 + Math.random() * 1.2) * dpr,
      a: 0.3 + Math.random() * 0.7,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    let raf;
    const draw = () => {
      time += 0.012;
      const z = canvas.__zoom || 1;
      const warpAmt = canvas.__warp || 0;

      ctx.clearRect(0, 0, w, h);

      // Background stars (streaked when warping)
      for (const s of stars) {
        s.twinkle += 0.02;
        const flick = 0.6 + Math.sin(s.twinkle) * 0.4;
        const sx = s.x * w;
        const sy = s.y * h;
        const streak = warpAmt * 80 * dpr;
        if (streak > 0.5) {
          const dx = sx - cx;
          const dy = sy - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          ctx.strokeStyle = `rgba(255,255,255,${s.a * flick * 0.7})`;
          ctx.lineWidth = s.r;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + (dx / dist) * streak, sy + (dy / dist) * streak);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(255,255,255,${s.a * flick})`;
          ctx.beginPath();
          ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Scale all blackhole geometry with zoom
      const baseR = Math.min(w, h) * 0.11 * z;     // event horizon radius
      const diskOuter = baseR * 3.6;
      const diskInner = baseR * 1.25;
      const tilt = 0.18; // vertical scale for ellipse (thin disk)

      // --- OUTER HALO (soft warm glow) ---
      const haloGrad = ctx.createRadialGradient(cx, cy, baseR * 0.9, cx, cy, baseR * 5);
      haloGrad.addColorStop(0, "rgba(255,200,130,0.55)");
      haloGrad.addColorStop(0.3, "rgba(255,150,80,0.20)");
      haloGrad.addColorStop(0.7, "rgba(180,80,40,0.06)");
      haloGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = haloGrad;
      ctx.fillRect(0, 0, w, h);

      // --- LOWER HALF OF ACCRETION DISK (behind black hole) ---
      ctx.save();
      ctx.translate(cx, cy);
      // Draw an ellipse ring, but only lower half (hidden by horizon from above)
      const drawDiskHalf = (whichHalf) => {
        // whichHalf: 'bottom' or 'top-front'
        const startA = whichHalf === "bottom" ? 0 : Math.PI;
        const endA = whichHalf === "bottom" ? Math.PI : Math.PI * 2;
        // build radial-like gradient along disk radius
        for (let r = diskInner; r < diskOuter; r += baseR * 0.04) {
          const t = (r - diskInner) / (diskOuter - diskInner); // 0 inner → 1 outer
          // Heat color: near inner edge = near white, mid = yellow-orange, outer = deep orange
          const heat = 1 - t;
          const red = 255;
          const green = Math.round(120 + heat * 135);
          const blue = Math.round(40 + heat * 180);
          const alpha = (1 - t) * 0.9 * (0.85 + 0.15 * Math.sin(time * 2 + r * 0.02));
          ctx.strokeStyle = `rgba(${red},${green},${blue},${alpha})`;
          ctx.lineWidth = baseR * 0.06;
          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * tilt, 0, startA, endA);
          ctx.stroke();
        }
      };
      // Back half first (behind horizon) — this is the "bottom" of ellipse from viewer POV
      drawDiskHalf("bottom");
      ctx.restore();

      // --- EVENT HORIZON (pure black disk with slight fuzz at edge) ---
      const horizonGrad = ctx.createRadialGradient(cx, cy, baseR * 0.85, cx, cy, baseR * 1.05);
      horizonGrad.addColorStop(0, "rgba(0,0,0,1)");
      horizonGrad.addColorStop(0.9, "rgba(0,0,0,1)");
      horizonGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = horizonGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 1.05, 0, Math.PI * 2);
      ctx.fill();

      // --- LENSED UPPER ARC (Einstein ring — disk bent over the top) ---
      ctx.save();
      ctx.translate(cx, cy);
      for (let r = baseR * 1.08; r < baseR * 2.2; r += baseR * 0.05) {
        const t = (r - baseR * 1.08) / (baseR * 1.12);
        const heat = 1 - t;
        const red = 255;
        const green = Math.round(140 + heat * 115);
        const blue = Math.round(60 + heat * 160);
        const alpha = (1 - t) * 0.95;
        ctx.strokeStyle = `rgba(${red},${green},${blue},${alpha})`;
        ctx.lineWidth = baseR * 0.04;
        ctx.beginPath();
        // A thin near-circular arc spanning top, slightly tilted
        ctx.ellipse(0, -baseR * 0.02, r, r * 0.95, 0, Math.PI + 0.35, Math.PI * 2 - 0.35);
        ctx.stroke();
      }
      ctx.restore();

      // --- FRONT HALF OF DISK (in front of horizon) ---
      ctx.save();
      ctx.translate(cx, cy);
      for (let r = diskInner; r < diskOuter; r += baseR * 0.04) {
        const t = (r - diskInner) / (diskOuter - diskInner);
        const heat = 1 - t;
        const red = 255;
        const green = Math.round(120 + heat * 135);
        const blue = Math.round(40 + heat * 180);
        const alpha = (1 - t) * 0.95 * (0.85 + 0.15 * Math.sin(time * 2.5 + r * 0.015));
        ctx.strokeStyle = `rgba(${red},${green},${blue},${alpha})`;
        ctx.lineWidth = baseR * 0.07;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * tilt, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // --- PHOTON RING (thin bright ring just outside horizon) ---
      ctx.save();
      ctx.translate(cx, cy);
      const photonGrad = ctx.createRadialGradient(0, 0, baseR * 1.02, 0, 0, baseR * 1.18);
      photonGrad.addColorStop(0, "rgba(255,240,200,0)");
      photonGrad.addColorStop(0.5, "rgba(255,230,180,0.9)");
      photonGrad.addColorStop(1, "rgba(255,180,120,0)");
      ctx.strokeStyle = photonGrad;
      ctx.lineWidth = baseR * 0.05;
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 1.1, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // --- Central flash when deep warp (entering) ---
      if (warpAmt > 0.7) {
        const flashA = (warpAmt - 0.7) / 0.3;
        const fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
        fg.addColorStop(0, `rgba(255,245,220,${flashA * 0.95})`);
        fg.addColorStop(0.3, `rgba(255,200,150,${flashA * 0.3})`);
        fg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = fg;
        ctx.fillRect(0, 0, w, h);
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Sync zoom/warp into canvas dataset-like
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.__zoom = zoom;
      canvasRef.current.__warp = warp;
    }
  }, [zoom, warp]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

/* ---------- Timeline block ---------- */
const TimelineItem = ({ item, index, total }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.25 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const left = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative grid grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-center transition-all duration-1000 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${Math.min(index * 80, 400)}ms` }}
    >
      <div className={left ? "text-right pr-2 md:pr-8" : "order-3 text-left pl-2 md:pl-8"}>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber-200/70 mb-2">
          {item.year}
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-light text-white">
          {item.title}
        </h3>
        <div className="mt-1 text-amber-100/70 text-sm">{item.place}</div>
        <p className="mt-3 text-white/60 text-[15px] leading-relaxed max-w-md ml-auto">
          {!left && <span className="sr-only" />}
          {item.description}
        </p>
      </div>

      {/* Center spine */}
      <div className="relative flex flex-col items-center order-2 self-stretch">
        <div className="flex-1 w-px bg-gradient-to-b from-amber-200/30 via-amber-200/10 to-transparent" />
        <div className="relative my-2">
          <div className="w-3 h-3 rounded-full bg-amber-200 shadow-[0_0_16px_rgba(255,220,150,0.9)]" />
          <div className="absolute inset-0 rounded-full bg-amber-200 animate-ping opacity-30" />
        </div>
        <div className="flex-1 w-px bg-gradient-to-t from-amber-200/30 via-amber-200/10 to-transparent" />
      </div>

      <div className={left ? "order-3" : ""} />
      {index === total - 1 && null}
    </div>
  );
};

/* ---------- Main page ---------- */
const Blackhole = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [warp, setWarp] = useState(0);
  const [pulled, setPulled] = useState(false);
  const autoScrollRef = useRef(false);
  const timelineRef = useRef(null);

  // Scroll-driven zoom/warp + auto-suck effect
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;

      // Zone A: 0 — vh*2 is the blackhole section
      const sectionEnd = vh * 2;
      const progress = Math.min(y / sectionEnd, 1);
      // Zoom grows from 1 to ~6 as user progresses through the blackhole section
      setZoom(1 + progress * 5);
      setWarp(Math.max(0, (progress - 0.3) / 0.7));

      // Trigger auto-scroll when user reaches ~8% scroll
      if (!autoScrollRef.current && y > vh * 0.08 && y < sectionEnd - 10) {
        autoScrollRef.current = true;
        setPulled(true);
        const startY = y;
        const targetY = sectionEnd + 20;
        const start = performance.now();
        const duration = 3800;
        const ease = (t) => 1 - Math.pow(1 - t, 2.6); // strong ease-out
        const step = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = ease(t);
          window.scrollTo(0, startY + (targetY - startY) * eased);
          if (t < 1) requestAnimationFrame(step);
          else {
            // done — allow normal scrolling again
            autoScrollRef.current = true;
            setPulled(false);
          }
        };
        requestAnimationFrame(step);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-clip">
      {/* Canvas blackhole fills viewport, sticky during the blackhole section */}
      <div className="absolute inset-x-0 top-0 h-[200vh] pointer-events-none">
        <div className="sticky top-0 h-screen">
          <BlackHoleCanvas zoom={zoom} warp={warp} />
          {/* Vignette during warp */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, transparent ${60 - warp * 40}%, rgba(0,0,0,${0.4 + warp * 0.6}) 100%)`,
              transition: "background 0.2s linear"
            }}
          />
        </div>
      </div>

      {/* HERO */}
      <section className="relative h-screen flex flex-col items-center justify-end pb-20 z-10">
        <div className="text-center px-6">
          <div className="font-mono text-[10px] tracking-[0.5em] uppercase text-amber-200/70 mb-4">
            — OBJECT · GARGANTUA · M ≈ 10⁸ M☉
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light leading-[0.95]">
            Do not <span className="italic text-amber-100">look away.</span>
          </h1>
          <p className="mt-6 text-white/60 max-w-md mx-auto">
            Scroll gently. Spacetime around you is about to stop behaving.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/40">
              {pulled ? "Event horizon breached" : "Approach"}
            </span>
            <ArrowDown size={14} className="text-white/50 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Spacer representing the journey through */}
      <section className="relative h-screen z-10 flex items-center justify-center">
        <div
          className="text-center transition-opacity duration-700"
          style={{ opacity: warp > 0.8 ? 1 : 0 }}
        >
          <div className="font-mono text-[10px] tracking-[0.5em] uppercase text-amber-100/80 mb-4">
            — On the other side
          </div>
          <div className="font-display text-3xl md:text-5xl font-light italic text-white/80">
            a life, reassembled
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section
        ref={timelineRef}
        className="relative z-10 py-32 bg-gradient-to-b from-black via-[#040010] to-[#050018] border-t border-white/5"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="text-center mb-20">
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase text-amber-200/70 mb-4">
              — Timeline
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-light">
              The <span className="italic text-amber-100">long way</span> here
            </h2>
            <p className="mt-4 text-white/55 max-w-lg mx-auto">
              Years compressed into a vertical line. Each dot, a turning point.
            </p>
          </div>

          <div className="space-y-16">
            {timeline.map((item, i) => (
              <TimelineItem key={item.year + item.title} item={item} index={i} total={timeline.length} />
            ))}
          </div>
        </div>
      </section>

      {/* RESUME */}
      <section className="relative z-10 py-32 bg-[#050018]">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <div className="font-mono text-[10px] tracking-[0.5em] uppercase text-amber-200/70 mb-4">
                — Résumé / CV
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-light">
                {resume.name}
              </h2>
              <div className="mt-2 text-amber-100/80 text-lg">{resume.title}</div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/60">
                <span>{resume.location}</span>
                <span className="text-white/30">·</span>
                <a href={`mailto:${resume.email}`} className="hover:text-amber-100">{resume.email}</a>
                <span className="text-white/30">·</span>
                <span>{resume.phone}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <a href={`https://${resume.links.github}`} target="_blank" rel="noreferrer" className="text-amber-200/80 hover:text-amber-100">{resume.links.github}</a>
                <a href={`https://${resume.links.linkedin}`} target="_blank" rel="noreferrer" className="text-amber-200/80 hover:text-amber-100">{resume.links.linkedin}</a>
              </div>
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.print(); }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-200 hover:bg-amber-100 text-[#0a0520] text-sm font-medium rounded-full transition-colors"
            >
              <Download size={14} />
              Print / Save PDF
            </a>
          </div>

          <p className="text-white/70 text-lg leading-relaxed max-w-3xl mb-16">
            {resume.summary}
          </p>

          {/* Experience */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase size={16} className="text-amber-200/80" />
              <h3 className="font-display text-2xl text-white">Experience</h3>
            </div>
            <div className="space-y-10">
              {resume.experience.map((e) => (
                <div key={e.role + e.company} className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8 pb-8 border-b border-white/5">
                  <div>
                    <div className="font-mono text-[11px] tracking-widest uppercase text-white/50">
                      {e.period}
                    </div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-white/35 mt-1">
                      {e.location}
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-xl text-white">{e.role}</div>
                    <div className="text-amber-100/70 text-sm mb-3">{e.company}</div>
                    <ul className="space-y-1.5">
                      {e.bullets.map((b) => (
                        <li key={b.slice(0, 40)} className="flex gap-2 text-white/70 text-[15px]">
                          <ChevronRight size={14} className="mt-1 text-amber-200/60 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles size={16} className="text-amber-200/80" />
              <h3 className="font-display text-2xl text-white">Selected projects</h3>
            </div>
            <div className="space-y-10">
              {resume.projects.map((p) => (
                <div key={p.name} className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8 pb-8 border-b border-white/5">
                  <div className="font-mono text-[11px] tracking-widest uppercase text-white/50">
                    {p.period}
                  </div>
                  <div>
                    <div className="font-display text-xl text-white">{p.name}</div>
                    <div className="text-amber-100/70 text-sm mb-3 font-mono">{p.tech}</div>
                    <ul className="space-y-1.5">
                      {p.bullets.map((b) => (
                        <li key={b.slice(0, 40)} className="flex gap-2 text-white/70 text-[15px]">
                          <ChevronRight size={14} className="mt-1 text-amber-200/60 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills + Education + Certifications */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Code2 size={16} className="text-amber-200/80" />
                <h3 className="font-display text-2xl text-white">Skills</h3>
              </div>
              <div className="space-y-5">
                {Object.entries(resume.skillCategories).map(([cat, items]) => (
                  <div key={cat}>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-amber-200/70 mb-2">
                      {cat}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((s) => (
                        <span key={s} className="px-3 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded-full text-white/80">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap size={16} className="text-amber-200/80" />
                  <h3 className="font-display text-2xl text-white">Education</h3>
                </div>
                <div className="space-y-5">
                  {resume.education.map((ed) => (
                    <div key={ed.degree} className="pb-5 border-b border-white/5 last:border-b-0">
                      <div className="font-display text-base text-white leading-snug">{ed.degree}</div>
                      <div className="text-white/60 text-sm">{ed.school}</div>
                      <div className="font-mono text-[11px] tracking-widest uppercase text-white/40 mt-1">
                        {ed.period} · {ed.gpa}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Award size={16} className="text-amber-200/80" />
                  <h3 className="font-display text-2xl text-white">Certifications</h3>
                </div>
                <ul className="space-y-2">
                  {resume.certifications.map((a) => (
                    <li key={a} className="flex gap-2 text-white/70 text-[15px]">
                      <span className="text-amber-200/60">·</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interests */}
          {resume.interests && resume.interests.length > 0 && (
            <div className="mb-16">
              <div className="font-mono text-[10px] tracking-widest uppercase text-amber-200/70 mb-3">
                Interests
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.interests.map((it) => (
                  <span key={it} className="px-3 py-1.5 text-xs font-mono bg-white/5 border border-white/10 rounded-full text-white/80">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Return home */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 hover:border-amber-200/60 hover:text-amber-100 text-white/80 text-sm font-mono tracking-wider rounded-full transition-colors"
            >
              <ArrowLeft size={14} />
              Return to {profile.name.split(" ")[0] || "the system"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blackhole;
