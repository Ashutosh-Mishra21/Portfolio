import React, { useEffect, useMemo, useRef, useState } from "react";
import { projectsList, projectFilters } from "../mock/mock";
import { useHighlight } from "../context/HighlightContext";
import { ExternalLink, Github } from "lucide-react";

/* ------- The shuttle SVG (side view, 4 windows = filters) ------- */
const ShuttleSVG = ({ activeFilter, onWindowClick, filters }) => {
  // The 4 categories shown on the shuttle (excluding "all")
  const windowFilters = filters.filter((f) => f.id !== "all");

  return (
    <svg viewBox="0 0 880 220" className="w-full h-auto select-none" aria-label="Project shuttle">
      <defs>
        <linearGradient id="shuttleBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#e8e3f0" />
          <stop offset="55%" stopColor="#a09cb6" />
          <stop offset="100%" stopColor="#564f6e" />
        </linearGradient>
        <linearGradient id="shuttlePanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#33304a" />
          <stop offset="100%" stopColor="#1a1726" />
        </linearGradient>
        <radialGradient id="flame" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#fff5d8" stopOpacity="1" />
          <stop offset="35%" stopColor="#ffb978" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#ff5e2a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff5e2a" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Engine flame trail */}
      <ellipse cx="30" cy="110" rx="110" ry="22" fill="url(#flame)" />
      <ellipse cx="60" cy="110" rx="60" ry="12" fill="#fff5d8" opacity="0.85" />

      {/* Tail fins */}
      <path d="M 130 60 L 90 30 L 170 60 Z"  fill="url(#shuttlePanel)" stroke="#534b6f" strokeWidth="1.5" />
      <path d="M 130 160 L 90 190 L 170 160 Z" fill="url(#shuttlePanel)" stroke="#534b6f" strokeWidth="1.5" />

      {/* Body */}
      <rect x="130" y="60" width="540" height="100" rx="50" fill="url(#shuttleBody)" stroke="#3d3756" strokeWidth="1.5" />

      {/* Body panel lines */}
      <line x1="130" y1="110" x2="670" y2="110" stroke="#3d3756" strokeWidth="0.5" opacity="0.5" />

      {/* Nose cone */}
      <path d="M 670 60 Q 850 110 670 160 Z" fill="url(#shuttleBody)" stroke="#3d3756" strokeWidth="1.5" />
      <path d="M 740 80 Q 800 110 740 140" stroke="#3d3756" strokeWidth="1" fill="none" opacity="0.5" />

      {/* Antenna */}
      <line x1="760" y1="110" x2="830" y2="110" stroke="#fcd38f" strokeWidth="1.5" />
      <circle cx="830" cy="110" r="3" fill="#fcd38f" filter="url(#glow)" />

      {/* Windows = filters */}
      {windowFilters.map((f, i) => {
        const cx = 230 + i * 105;
        const isActive = activeFilter === f.id;
        return (
          <g key={f.id} onClick={() => onWindowClick(f.id)} style={{ cursor: "pointer" }} role="button" aria-label={`Filter: ${f.label}`}>
            {/* Frame */}
            <circle cx={cx} cy="110" r="30" fill="#0f0a1c" stroke={isActive ? f.color : "#4a4361"} strokeWidth={isActive ? 3 : 1.6} />
            {/* Glass glow */}
            <circle
              cx={cx} cy="110" r="24"
              fill={isActive ? f.color : "#1a1530"}
              opacity={isActive ? 0.85 : 0.5}
              filter={isActive ? "url(#glow)" : undefined}
            />
            {/* Specular highlight */}
            <ellipse cx={cx - 8} cy="104" rx="8" ry="5" fill="#ffffff" opacity={isActive ? 0.5 : 0.2} />
            {/* Label below */}
            <text x={cx} y="183" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2" fill={isActive ? f.color : "#9690b0"} style={{ textTransform: "uppercase" }}>
              {f.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ------------- Project card ------------- */
const ProjectCard = ({ project, isHighlighted, isVisible }) => (
  <div
    className={`relative bg-[#0a0520]/95 border rounded-2xl p-6 transition-all duration-500 ${
      isHighlighted
        ? "border-amber-200/80 shadow-[0_0_40px_rgba(255,210,150,0.25)] scale-[1.02]"
        : "border-white/10 hover:border-white/25"
    } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
  >
    {isHighlighted && (
      <div className="absolute top-3 right-3 font-mono text-[9px] tracking-widest uppercase text-amber-200/90 px-2 py-0.5 rounded-full border border-amber-200/40">
        Linked
      </div>
    )}

    <div className="flex items-start justify-between mb-3 gap-3 pr-16">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber-200/70">
          {project.period}
        </div>
        <h3 className="font-display text-xl text-white mt-1 leading-tight">{project.name}</h3>
        <div className="text-amber-100/70 text-sm mt-0.5">{project.subtitle}</div>
      </div>
    </div>

    <p className="text-white/70 text-[14px] leading-relaxed mb-4">{project.description}</p>

    {project.metrics && project.metrics.length > 0 && (
      <div className="flex flex-wrap gap-3 mb-4">
        {project.metrics.map((m) => (
          <div key={m.label} className="flex items-baseline gap-1.5">
            <span className="font-display text-amber-200 text-base">{m.value}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">{m.label}</span>
          </div>
        ))}
      </div>
    )}

    <div className="flex flex-wrap gap-2 mb-5">
      {project.tech.map((t) => (
        <span key={t} className="px-2.5 py-1 text-[11px] font-mono bg-white/5 border border-white/10 rounded-full text-white/80">
          {t}
        </span>
      ))}
    </div>

    <div className="flex gap-2">
      <a
        href={project.github}
        target="_blank" rel="noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono rounded-full transition-colors"
      >
        <Github size={12} />
        Source
      </a>
      {project.demo ? (
        <a
          href={project.demo}
          target="_blank" rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-amber-200/90 hover:bg-amber-200 text-[#0a0520] text-xs font-medium rounded-full transition-colors"
        >
          <ExternalLink size={12} />
          Live demo
        </a>
      ) : (
        <span className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-white/40 text-xs font-mono rounded-full">
          No demo
        </span>
      )}
    </div>
  </div>
);

/* ------------- Main component ------------- */
const Shuttle = () => {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);  // 0..1 across the section's pin range
  const [activeFilter, setActiveFilter] = useState("all");
  const { highlight, isHighlighted } = useHighlight();

  /* If an external highlight pushed projects, switch to "all" so they're visible. */
  useEffect(() => {
    if (highlight && (highlight.projects || []).length) setActiveFilter("all");
  }, [highlight]);

  /* Sticky-pin scroll progress */
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const el = wrapRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const scrollable = Math.max(1, rect.height - vh);
        const p = Math.min(Math.max(-rect.top / scrollable, 0), 1);
        setProgress(p);
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Shuttle x position: enters from left, settles ~20-70% progress, exits right */
  let shuttleX = -100;
  let shuttleOpacity = 0;
  if (progress < 0.18) {
    const t = progress / 0.18;
    shuttleX = -100 + t * 100;
    shuttleOpacity = t;
  } else if (progress < 0.72) {
    shuttleX = 0;
    shuttleOpacity = 1;
  } else {
    const t = (progress - 0.72) / 0.28;
    shuttleX = t * 130;
    shuttleOpacity = 1 - t;
  }

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projectsList;
    return projectsList.filter((p) => p.categories.includes(activeFilter));
  }, [activeFilter]);

  return (
    <section id="projects" ref={wrapRef} className="relative min-h-[180vh]">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        {/* Heading row */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-4">
            <div>
              <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-200/70 mb-2">
                — Section 04 / Cargo Bay
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-light text-white leading-tight">
                Projects on <span className="italic text-amber-100">approach</span>
              </h2>
            </div>

            {/* Filter pills (also accessible via shuttle windows) */}
            <div className="flex flex-wrap gap-2">
              {projectFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase rounded-full border transition-colors ${
                    activeFilter === f.id
                      ? "border-amber-200/80 text-amber-100 bg-amber-200/10"
                      : "border-white/15 text-white/60 hover:border-white/35 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shuttle */}
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div
            className="relative will-change-transform"
            style={{
              transform: `translateX(${shuttleX}%)`,
              opacity: shuttleOpacity,
              transition: "transform 0.05s linear, opacity 0.2s linear"
            }}
          >
            <ShuttleSVG
              activeFilter={activeFilter}
              onWindowClick={setActiveFilter}
              filters={projectFilters}
            />
          </div>
        </div>

        {/* Project cards — always visible */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 mt-2">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {projectsList.map((p) => {
              const visible = activeFilter === "all" || p.categories.includes(activeFilter);
              return (
                <div
                  key={p.id}
                  style={{ display: visible ? "block" : "none" }}
                >
                  <ProjectCard
                    project={p}
                    isHighlighted={isHighlighted("project", p.id)}
                    isVisible={visible}
                  />
                </div>
              );
            })}
          </div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 text-center mt-5">
            Showing {filteredProjects.length} of {projectsList.length} projects
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shuttle;
