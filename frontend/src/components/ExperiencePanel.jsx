import React, { useEffect } from "react";
import { X, MapPin, ChevronRight } from "lucide-react";

/**
 * Floating experience-detail panel shown when a planet is clicked.
 * Kept as its own component so SolarSystem stays small and easy to read.
 */
const ExperiencePanel = ({ exp, onClose, onJumpToProjects, PlanetVisual, Moons, SaturnRing }) => {
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!exp) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8" style={{ pointerEvents: "none" }}>
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md animate-fade-up"
        style={{ pointerEvents: "auto" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-6xl grid md:grid-cols-[1.1fr_1.1fr] gap-6 md:gap-10 items-center animate-fade-up"
        style={{ pointerEvents: "auto" }}
      >
        {/* Planet preview */}
        <div className="hidden md:flex items-center justify-center py-10 relative h-[560px]">
          <div
            className="absolute rounded-full animate-pulse-glow"
            style={{
              width: 520, height: 520,
              background: `radial-gradient(circle, ${exp.color}33 0%, ${exp.color}11 40%, transparent 70%)`,
              filter: "blur(40px)"
            }}
          />
          <div className="relative">
            <div className="absolute top-1/2 left-1/2">
              <Moons planet={exp} planetSize={340} paused={false} scale={0.7} />
            </div>
            <PlanetVisual p={exp} size={340} animated />
            {exp.hasRing && <SaturnRing p={exp} planetSize={340} />}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-[#0a0520]/95 border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="md:hidden flex justify-center mb-6">
            <PlanetVisual p={exp} size={140} animated />
          </div>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber-200/70">{exp.type}</div>
            <div className="w-6 h-px bg-white/20" />
            <div className="font-mono text-[10px] tracking-widest uppercase text-white/40">{exp.duration}</div>
          </div>

          <h3 className="font-display text-3xl md:text-4xl font-light text-white leading-tight">
            {exp.role}
          </h3>
          <div className="mt-1 text-amber-100/85 text-base">{exp.company}</div>

          {exp.location && (
            <div className="mt-3 flex items-center gap-2 text-white/55 text-sm">
              <MapPin size={13} className="text-amber-200/70" />
              {exp.location}
            </div>
          )}

          <div className="mt-7">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Impact</div>
            <ul className="space-y-2.5">
              {(exp.bullets || []).map((b) => (
                <li key={b.slice(0, 40)} className="flex gap-2 text-white/80 text-[15px] leading-relaxed">
                  <ChevronRight size={14} className="mt-1.5 text-amber-200/70 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {(exp.relatedSkills || []).length > 0 && (
            <div className="mt-7">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Skills used</div>
              <div className="flex flex-wrap gap-2">
                {exp.relatedSkills.map((t) => (
                  <span key={t} className="px-3 py-1.5 text-xs font-mono bg-white/5 border border-white/10 rounded-full text-white/80">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(exp.relatedProjects || []).length > 0 && (
            <div className="mt-8">
              <button
                onClick={onJumpToProjects}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-200/90 hover:bg-amber-200 text-[#0a0520] text-sm font-medium rounded-full transition-colors"
              >
                See {exp.relatedProjects.length} linked project{exp.relatedProjects.length > 1 ? "s" : ""}
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperiencePanel;
