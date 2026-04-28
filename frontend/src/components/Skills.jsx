import React, { useEffect, useRef, useState } from "react";
import { skillsOrbits } from "../mock/mock";
import { useHighlight } from "../context/HighlightContext";

/**
 * Three-orbit solar system.
 *  Sun (Core: AI/ML Systems) at center.
 *  Inner / Middle / Outer orbits, each with 4 skill chips counter-rotating to stay readable.
 *  Hover: chip scales + tooltip. Click: cross-section highlight via context.
 */
const Skills = () => {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(true);
  const [hovered, setHovered] = useState(null); // { orbit, name }
  const [scale, setScale] = useState(1);
  const { setHighlight, isHighlighted, highlight } = useHighlight();

  // Pause animations when section not visible
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting && e.intersectionRatio > 0.05),
      { threshold: [0, 0.05, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Responsive scale so the outermost orbit fits viewport
  useEffect(() => {
    const onResize = () => {
      const maxOrbit = Math.max(...skillsOrbits.map((o) => o.radius));
      const needed = (maxOrbit + 70) * 2;
      const vw = window.innerWidth;
      const containerH = Math.min(window.innerHeight * 0.8, 900);
      const fit = Math.min(vw / needed, containerH / needed, 1.05);
      setScale(Math.max(0.45, fit));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSkillClick = (skill) => {
    setHighlight({
      source: "skill",
      id: skill.name,
      skills: [skill.name],
      projects: skill.relatedProjects || [],
      experiences: skill.relatedExperiences || []
    });
  };

  return (
    <section id="sun" ref={wrapRef} className="relative min-h-screen py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-200/70 mb-3">
              — Section 05 / Core
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-light text-white leading-tight">
              Inside the <span className="italic text-amber-100">star</span>
            </h2>
            <p className="mt-3 text-white/55 max-w-md">
              Three orbits. Click any skill to see where it appears across my work.
            </p>
          </div>
          <div className="font-mono text-[11px] text-white/40 tracking-widest uppercase">
            {highlight && highlight.source === "skill"
              ? `> ${highlight.id} · ${(highlight.projects || []).length + (highlight.experiences || []).length} links`
              : "> Hover or click a skill"}
          </div>
        </div>

        {/* Mobile: stacked grouped layout */}
        <div className="lg:hidden mt-8 space-y-6">
          {skillsOrbits.map((o) => (
            <div key={o.name}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: o.color, boxShadow: `0 0 10px ${o.color}` }} />
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/50">{o.label}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {o.skills.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => handleSkillClick(s)}
                    className={`px-3 py-1.5 text-[12px] font-mono rounded-full border transition-colors ${
                      isHighlighted("skill", s.name)
                        ? "border-amber-200/80 text-amber-100 bg-amber-200/10"
                        : "border-white/15 text-white/80 hover:border-white/35"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: 3-orbit solar system */}
        <div
          className="hidden lg:flex relative items-center justify-center"
          style={{ height: "min(80vh, 900px)" }}
        >
          <div
            className="relative"
            style={{ transform: `scale(${scale})`, transformOrigin: "center center", width: 0, height: 0 }}
          >
            {/* Orbit rings */}
            {skillsOrbits.map((o) => (
              <div
                key={`ring-${o.name}`}
                className="orbit-path-vivid"
                style={{
                  width: o.radius * 2,
                  height: o.radius * 2,
                  borderColor: hovered && hovered.orbit === o.name ? `${o.color}88` : "rgba(255, 220, 180, 0.16)"
                }}
              />
            ))}

            {/* Sun */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div
                className="absolute rounded-full animate-pulse-glow"
                style={{
                  width: 280, height: 280, left: -140, top: -140,
                  background: "radial-gradient(circle, rgba(255,200,130,0.32) 0%, rgba(255,140,80,0.10) 35%, transparent 70%)",
                  filter: "blur(28px)"
                }}
              />
              <div
                className="w-[110px] h-[110px] rounded-full relative"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #fff0cc 0%, #ffc56a 35%, #f5883a 70%, #c95a1c 100%)",
                  boxShadow: "0 0 70px rgba(255,180,100,0.65), 0 0 160px rgba(255,140,80,0.35), inset -12px -16px 32px rgba(120,40,0,0.5), inset 6px 6px 22px rgba(255,235,180,0.5)"
                }}
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-center whitespace-nowrap">
                <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-200/80">
                  Core
                </div>
                <div className="font-display text-base text-white mt-1">
                  AI / ML Systems
                </div>
              </div>
            </div>

            {/* Orbits + chips */}
            {skillsOrbits.map((o) => {
              const N = o.skills.length;
              return (
                <div
                  key={o.name}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    animation: `spin-slow ${o.speed}s linear infinite`,
                    animationPlayState: active && !hovered ? "running" : "paused"
                  }}
                >
                  {o.skills.map((s, i) => {
                    const angle = (i / N) * 360;
                    const isLit = isHighlighted("skill", s.name);
                    const isHover = hovered && hovered.name === s.name;
                    return (
                      <div
                        key={s.name}
                        className="absolute"
                        style={{
                          transform: `rotate(${angle}deg) translateX(${o.radius}px) rotate(${-angle}deg)`,
                          width: 0, height: 0
                        }}
                      >
                        <div
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{
                            // Counter-rotate to keep the chip upright while orbit spins
                            animation: `spin-slow ${o.speed}s linear infinite reverse`,
                            animationPlayState: active && !hovered ? "running" : "paused"
                          }}
                        >
                          <button
                            onMouseEnter={() => setHovered({ orbit: o.name, name: s.name })}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => handleSkillClick(s)}
                            className={`relative px-3.5 py-1.5 rounded-full border whitespace-nowrap font-mono text-[12px] tracking-wide transition-all duration-200 ${
                              isLit
                                ? "border-amber-200/90 text-amber-100 bg-amber-200/15 scale-110 shadow-[0_0_22px_rgba(255,210,150,0.35)]"
                                : isHover
                                  ? "border-white/40 text-white bg-[#0a0520]/95 scale-110"
                                  : "border-white/20 text-white/85 bg-[#0a0520]/85 hover:border-white/40"
                            }`}
                            style={{ pointerEvents: "auto" }}
                          >
                            <span
                              className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                              style={{ background: o.color, boxShadow: `0 0 8px ${o.color}` }}
                            />
                            {s.name}

                            {/* Tooltip */}
                            {isHover && s.context && (
                              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-[#0a0520] border border-white/15 text-[11px] text-white/85 max-w-[260px] text-center font-sans normal-case shadow-2xl">
                                {s.context}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {skillsOrbits.map((o) => (
              <div key={o.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: o.color, boxShadow: `0 0 8px ${o.color}` }} />
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/50">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
