import React, { useState, useRef, useEffect, useCallback } from "react";
import { experiences } from "../mock/mock";
import { useHighlight } from "../context/HighlightContext";
import ExperiencePanel from "./ExperiencePanel";
import CentralSun from "./CentralSun";

/* -------- Realistic planet visual -------- */
export const PlanetVisual = ({ p, size, animated = false }) => (
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
    <div
      className="absolute inset-0 opacity-40 mix-blend-overlay"
      style={{
        background: `repeating-linear-gradient(
          ${p.id === "rag-arc" ? 8 : p.id === "nn-arc" ? 4 : 24}deg,
          rgba(255,255,255,0.12) 0px,
          rgba(0,0,0,0.18) ${size * 0.05}px,
          rgba(255,255,255,0.04) ${size * 0.1}px
        )`
      }}
    />
    <div
      className="absolute inset-0 opacity-25 mix-blend-screen"
      style={{
        background: `
          radial-gradient(ellipse at 65% 40%, ${p.color}88 0%, transparent 18%),
          radial-gradient(ellipse at 28% 65%, ${p.ring}aa 0%, transparent 20%),
          radial-gradient(ellipse at 75% 75%, ${p.color}66 0%, transparent 15%)
        `
      }}
    />
    <div
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{ boxShadow: `inset 0 0 ${size * 0.25}px ${size * 0.04}px ${p.color}55` }}
    />
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

/* -------- Moons orbiting a planet -------- */
export const Moons = ({ planet, planetSize, paused = false, scale = 1 }) => {
  const moons = planet.moons || [];
  const keyFor = (i) => `${planet.id}-moon-${i}`;
  return (
    <>
      {moons.map((m, i) => {
        const radius = planetSize * m.distance;
        return (
          <div
            key={keyFor(i)}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: 0,
              height: 0,
              animation: `orbit ${m.speed}s linear infinite`,
              animationDelay: `${-m.phase / 360 * m.speed}s`,
              animationPlayState: paused ? "paused" : "running",
              ['--orbit-radius']: `${radius}px`,
            }}
          >
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: planetSize * m.size * scale,
                height: planetSize * m.size * scale,
                background: `radial-gradient(circle at 35% 30%, ${m.color}, #1a1322 95%)`,
                boxShadow: `0 0 ${planetSize * m.size * 0.6}px ${m.color}55, inset -${planetSize * m.size * 0.18}px -${planetSize * m.size * 0.22}px ${planetSize * m.size * 0.4}px rgba(0,0,0,0.6)`
              }}
            />
          </div>
        );
      })}
      {moons.map((m, i) => (
        <div
          key={`${keyFor(i)}-ring`}
          className="absolute top-1/2 left-1/2 pointer-events-none rounded-full border border-white/[0.06]"
          style={{
            width: planetSize * m.distance * 2,
            height: planetSize * m.distance * 2,
            transform: "translate(-50%, -50%)"
          }}
        />
      ))}
    </>
  );
};

/* -------- Saturn-like ring -------- */
export const SaturnRing = ({ p, planetSize }) => (
  <div
    className="absolute top-1/2 left-1/2 pointer-events-none"
    style={{
      width: planetSize * 2.5,
      height: planetSize * 0.6,
      transform: "translate(-50%, -50%) rotate(-22deg)",
      borderRadius: "50%",
      background: `linear-gradient(90deg, transparent 0%, ${p.color}aa 20%, ${p.color} 50%, ${p.color}aa 80%, transparent 100%)`,
      opacity: 0.7,
      maskImage: "radial-gradient(ellipse at center, transparent 32%, black 34%)",
      WebkitMaskImage: "radial-gradient(ellipse at center, transparent 32%, black 34%)"
    }}
  />
);

/* -------- Single experience planet (orbiting + moons + tooltip) -------- */
const ExperiencePlanet = ({ p, index, total, hovered, paused, isLitFromContext, onHover, onLeave, onClick }) => {
  const isHovered = hovered === p.id;
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        width: 0, height: 0,
        animation: `orbit ${p.speed}s linear infinite`,
        animationDelay: `${-p.speed * (index / total + 0.12 * index)}s`,
        animationPlayState: paused ? "paused" : "running",
        ['--orbit-radius']: `${p.orbit}px`,
      }}
    >
      <div className="absolute -translate-x-1/2 -translate-y-1/2">
        <Moons planet={p} planetSize={p.size * 2} paused={paused} />

        <button
          onClick={() => onClick(p)}
          onMouseEnter={() => onHover(p.id)}
          onMouseLeave={onLeave}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
          style={{
            transform: `translate(-50%, -50%) scale(${isHovered || isLitFromContext ? 1.3 : 1})`,
          }}
        >
          {isLitFromContext && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: p.size * 4,
                height: p.size * 4,
                boxShadow: `0 0 30px 6px rgba(255,210,150,0.55)`,
                border: "1px solid rgba(255,210,150,0.5)"
              }}
            />
          )}

          <PlanetVisual p={p} size={p.size * 2} />
          {p.hasRing && <SaturnRing p={p} planetSize={p.size * 2} />}

          {isHovered && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap pointer-events-none">
              <div className="font-display text-sm text-white">{p.role}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-amber-200/80 text-center mt-0.5">
                {p.company}
              </div>
              <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/50 text-center mt-0.5">
                {p.duration}
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

/* -------- Main component -------- */
const SolarSystem = () => {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [paused, setPaused] = useState(false);
  const [scale, setScale] = useState(1);
  const wrapRef = useRef(null);
  const { setHighlight, isHighlighted } = useHighlight();

  // Pause planet motion while a panel is open
  useEffect(() => { setPaused(Boolean(selected)); }, [selected]);

  // Responsive scale
  useEffect(() => {
    const onResize = () => {
      const maxOrbit = Math.max(...experiences.map((p) => p.orbit));
      const needed = (maxOrbit + 80) * 2;
      const containerH = Math.min(window.innerHeight * 0.78, 900);
      const fit = Math.min(window.innerWidth / needed, containerH / needed, 1.1);
      setScale(Math.max(0.5, fit));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handlePlanetClick = useCallback(
    (e) => {
      setSelected(e.id);
      setHighlight({
        source: "experience",
        id: e.id,
        experiences: [e.id],
        projects: e.relatedProjects || [],
        skills: e.relatedSkills || []
      });
    },
    [setHighlight]
  );

  const closePanel = useCallback(() => setSelected(null), []);

  const jumpToProjects = useCallback(() => {
    setSelected(null);
    setTimeout(() => {
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const handleHover = useCallback((id) => setHovered(id), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  const exp = selected ? experiences.find((p) => p.id === selected) : null;

  return (
    <section id="solar" className="relative min-h-screen py-20 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-200/70 mb-3">
              — Section 03 / Career arc
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-light text-white leading-tight">
              Worlds I've <span className="italic text-amber-100">lived in</span>
            </h2>
            <p className="mt-3 text-white/55 max-w-md">
              Six planets — each a job, internship, or research arc. Hover for the role, click to step inside.
            </p>
          </div>
          <div className="font-mono text-[11px] text-white/40 tracking-widest uppercase">
            {exp ? `> ${exp.role}` : "> Awaiting selection · hover or click a planet"}
          </div>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative mx-auto flex items-center justify-center"
        style={{ height: "min(78vh, 900px)" }}
      >
        <div
          className="relative"
          style={{ transform: `scale(${scale})`, transformOrigin: "center center", width: 0, height: 0 }}
        >
          {experiences.map((p, i) => (
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

          <CentralSun />

          {experiences.map((p, i) => (
            <ExperiencePlanet
              key={p.id}
              p={p}
              index={i}
              total={experiences.length}
              hovered={hovered}
              paused={paused}
              isLitFromContext={isHighlighted("experience", p.id)}
              onHover={handleHover}
              onLeave={handleLeave}
              onClick={handlePlanetClick}
            />
          ))}
        </div>
      </div>

      <ExperiencePanel
        exp={exp}
        onClose={closePanel}
        onJumpToProjects={jumpToProjects}
        PlanetVisual={PlanetVisual}
        Moons={Moons}
        SaturnRing={SaturnRing}
      />
    </section>
  );
};

export default SolarSystem;
