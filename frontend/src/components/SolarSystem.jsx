import React, { useState, useRef, useEffect } from "react";
import { projects } from "../mock/mock";
import { X, ExternalLink, Github } from "lucide-react";

// Reusable planet renderer. Used both in orbit and in the detail panel.
const PlanetVisual = ({ p, size, animated = false }) => (
  <div
    className={`relative rounded-full overflow-hidden ${animated ? "animate-spin-slow" : ""}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle at 30% 28%, ${p.color} 0%, ${p.color} 18%, ${p.ring} 65%, #0a0516 100%)`,
      boxShadow: `
        inset -${size * 0.12}px -${size * 0.18}px ${size * 0.35}px rgba(0,0,0,0.65),
        inset ${size * 0.08}px ${size * 0.08}px ${size * 0.22}px rgba(255,255,255,0.08),
        0 0 ${size * 0.6}px ${p.color}33,
        0 0 ${size * 1.2}px ${p.color}11
      `
    }}
  >
    {/* Surface bands */}
    <div
      className="absolute inset-0 opacity-40 mix-blend-overlay"
      style={{
        background: `repeating-linear-gradient(
          ${p.id === "jupiter" ? 8 : p.id === "saturn" ? 4 : 24}deg,
          rgba(255,255,255,0.12) 0px,
          rgba(0,0,0,0.18) ${size * 0.05}px,
          rgba(255,255,255,0.04) ${size * 0.1}px
        )`
      }}
    />
    {/* Atmospheric rim */}
    <div
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        boxShadow: `inset 0 0 ${size * 0.25}px ${size * 0.04}px ${p.color}55`
      }}
    />
    {/* Specular highlight */}
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size * 0.32,
        height: size * 0.28,
        top: size * 0.14,
        left: size * 0.22,
        background: "radial-gradient(ellipse, rgba(255,255,255,0.35), transparent 70%)",
        filter: "blur(4px)"
      }}
    />
  </div>
);

const SolarSystem = () => {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [paused, setPaused] = useState(false);
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const onResize = () => {
      const maxOrbit = Math.max(...projects.map((p) => p.orbit));
      const needed = (maxOrbit + 60) * 2;
      const vw = window.innerWidth;
      const containerH = Math.min(window.innerHeight * 0.78, 900);
      const fit = Math.min(vw / needed, containerH / needed, 1.1);
      setScale(Math.max(0.5, fit));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (selected) setPaused(true);
    else setPaused(false);
  }, [selected]);

  const proj = selected ? projects.find((p) => p.id === selected) : null;

  return (
    <section id="solar" className="relative min-h-screen py-20 overflow-hidden">
      {/* Section heading */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-200/70 mb-3">
              — Section 03 / The System
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-light text-white leading-tight">
              Selected <span className="italic text-amber-100">worlds</span>
            </h2>
          </div>
          <div className="font-mono text-[11px] text-white/40 tracking-widest uppercase">
            {proj ? `> ${proj.name}` : "> Awaiting selection · hover or click a planet"}
          </div>
        </div>
      </div>

      {/* System canvas */}
      <div
        ref={wrapRef}
        className="relative mx-auto flex items-center justify-center"
        style={{ height: "min(78vh, 900px)" }}
      >
        <div
          className="relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            width: 0,
            height: 0
          }}
        >
          {/* Orbit rings - more visible */}
          {projects.map((p, i) => (
            <div
              key={`orbit-${p.id}`}
              className="orbit-path-vivid"
              style={{
                width: p.orbit * 2,
                height: p.orbit * 2,
                opacity: hovered === p.id ? 0.9 : 0.22 + i * 0.02
              }}
            />
          ))}

          {/* Sun with corona */}
          <button
            onClick={() => {
              const el = document.getElementById("sun");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group"
            aria-label="Navigate to skills"
          >
            {/* Outer corona */}
            <div
              className="absolute rounded-full animate-pulse-glow"
              style={{
                width: 260, height: 260,
                left: -130, top: -130,
                background: "radial-gradient(circle, rgba(255,200,130,0.35) 0%, rgba(255,140,80,0.12) 35%, transparent 70%)",
                filter: "blur(28px)"
              }}
            />
            {/* Inner glow */}
            <div
              className="absolute rounded-full"
              style={{
                width: 160, height: 160,
                left: -80, top: -80,
                background: "radial-gradient(circle, rgba(255,220,160,0.5), transparent 65%)",
                filter: "blur(14px)"
              }}
            />
            <div
              className="w-[90px] h-[90px] rounded-full relative"
              style={{
                background: "radial-gradient(circle at 35% 35%, #fff0cc 0%, #ffc56a 35%, #f5883a 70%, #c95a1c 100%)",
                boxShadow: "0 0 60px rgba(255,180,100,0.65), 0 0 140px rgba(255,140,80,0.35), inset -10px -14px 30px rgba(120,40,0,0.5), inset 6px 6px 20px rgba(255,235,180,0.5)"
              }}
            />
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3 font-mono text-[10px] tracking-[0.3em] uppercase text-amber-200/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Skills →
            </span>
          </button>

          {/* Planets */}
          {projects.map((p, i) => (
            <div
              key={p.id}
              className="absolute top-1/2 left-1/2"
              style={{
                width: 0, height: 0,
                animation: `orbit ${p.speed}s linear infinite`,
                animationDelay: `${-p.speed * (i / projects.length + 0.12 * i)}s`,
                animationPlayState: paused ? "paused" : "running",
                ['--orbit-radius']: `${p.orbit}px`,
              }}
            >
              <button
                onClick={() => setSelected(p.id)}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                style={{
                  transform: `translate(-50%, -50%) scale(${hovered === p.id ? 1.3 : 1})`,
                  transformOrigin: "center",
                }}
              >
                <PlanetVisual p={p} size={p.size * 2} />

                {/* Saturn's ring */}
                {p.hasRing && (
                  <div
                    className="absolute top-1/2 left-1/2 pointer-events-none"
                    style={{
                      width: p.size * 5,
                      height: p.size * 1.2,
                      transform: "translate(-50%, -50%) rotate(-22deg)",
                      borderRadius: "50%",
                      background: `linear-gradient(90deg, transparent 0%, ${p.color}aa 20%, ${p.color} 50%, ${p.color}aa 80%, transparent 100%)`,
                      opacity: 0.6,
                      maskImage: "radial-gradient(ellipse at center, transparent 30%, black 32%)",
                      WebkitMaskImage: "radial-gradient(ellipse at center, transparent 30%, black 32%)"
                    }}
                  />
                )}

                {hovered === p.id && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap pointer-events-none">
                    <div className="font-display text-sm text-white">{p.name}</div>
                    <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/50 text-center mt-0.5">{p.year}</div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Project panel with large spinning planet preview */}
      {proj && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8" style={{ pointerEvents: "none" }}>
          {/* dim backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-up"
            style={{ pointerEvents: "auto" }}
            onClick={() => setSelected(null)}
          />
          <div
            className="relative w-full max-w-5xl grid md:grid-cols-[1fr_1.1fr] gap-0 md:gap-4 items-center animate-fade-up"
            style={{ pointerEvents: "auto" }}
          >
            {/* Planet preview */}
            <div className="hidden md:flex items-center justify-center py-10 relative">
              <div
                className="absolute rounded-full animate-pulse-glow"
                style={{
                  width: 320, height: 320,
                  background: `radial-gradient(circle, ${proj.color}44, transparent 65%)`,
                  filter: "blur(28px)"
                }}
              />
              <div className="relative">
                <PlanetVisual p={proj} size={240} animated />
                {proj.hasRing && (
                  <div
                    className="absolute top-1/2 left-1/2 pointer-events-none"
                    style={{
                      width: 480,
                      height: 140,
                      transform: "translate(-50%, -50%) rotate(-22deg)",
                      borderRadius: "50%",
                      background: `linear-gradient(90deg, transparent 0%, ${proj.color}aa 20%, ${proj.color} 50%, ${proj.color}aa 80%, transparent 100%)`,
                      opacity: 0.7,
                      maskImage: "radial-gradient(ellipse at center, transparent 32%, black 34%)",
                      WebkitMaskImage: "radial-gradient(ellipse at center, transparent 32%, black 34%)"
                    }}
                  />
                )}
              </div>
            </div>

            {/* Info card */}
            <div className="bg-[#0a0520]/95 border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {/* Mobile planet preview */}
              <div className="md:hidden flex justify-center mb-6">
                <PlanetVisual p={proj} size={120} animated />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber-200/70">
                  Planet · {proj.id}
                </div>
                <div className="w-6 h-px bg-white/20" />
                <div className="font-mono text-[10px] tracking-widest uppercase text-white/40">
                  {proj.year}
                </div>
              </div>

              <h3 className="font-display text-3xl md:text-4xl font-light text-white leading-tight">
                {proj.name}
              </h3>
              <p className="mt-1 text-amber-100/80 text-sm">{proj.subtitle}</p>

              <p className="mt-6 text-white/70 leading-relaxed text-[15px]">
                {proj.description}
              </p>

              <div className="mt-7">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">
                  Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {proj.tech.map((t) => (
                    <span key={t} className="px-3 py-1.5 text-xs font-mono bg-white/5 border border-white/10 rounded-full text-white/80">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <a
                  href={proj.demo}
                  target="_blank" rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-200/90 hover:bg-amber-200 text-[#0a0520] text-sm font-medium rounded-full transition-colors"
                >
                  <ExternalLink size={14} />
                  Live demo
                </a>
                <a
                  href={proj.github}
                  target="_blank" rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-sm font-medium rounded-full transition-colors"
                >
                  <Github size={14} />
                  Source
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SolarSystem;
