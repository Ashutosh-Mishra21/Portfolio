import React, { useState, useEffect, useRef } from "react";
import { skills } from "../mock/mock";

const categories = [
  { key: "frontend", label: "Frontend", color: "#fcd38f" },
  { key: "backend", label: "Backend", color: "#c99bff" },
  { key: "tools", label: "Tools", color: "#8ad0ff" }
];

const Skills = () => {
  const [active, setActive] = useState("frontend");
  const [zoomed, setZoomed] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh - rect.top) / (rect.height + vh);
      setZoomed(p > 0.25 && p < 0.9);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeSkills = skills[active];
  const N = activeSkills.length;
  const radius = 200;

  return (
    <section id="sun" ref={wrapRef} className="relative min-h-screen py-28 flex items-center">
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
        <div className="mb-16 max-w-xl">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-200/70 mb-4">
            — Section 04 / Core
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-light text-white leading-tight">
            Inside the <span className="italic text-amber-100">star</span>
          </h2>
          <p className="mt-4 text-white/55">
            Tools and languages I use to turn ideas into orbiting products.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          {/* Category selector */}
          <div className="space-y-2">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className={`group w-full text-left p-5 border rounded-xl transition-all ${
                  active === c.key
                    ? "border-amber-200/40 bg-white/[0.03]"
                    : "border-white/10 hover:border-white/20 bg-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2 h-2 rounded-full transition-transform group-hover:scale-150"
                        style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }}
                      />
                      <span className="font-display text-2xl text-white">{c.label}</span>
                    </div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mt-2 ml-5">
                      {skills[c.key].length} Technologies
                    </div>
                  </div>
                  <span className={`font-mono text-xs transition-transform ${active === c.key ? "translate-x-1 text-amber-200" : "text-white/30"}`}>
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Radial skill display */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Sun core */}
            <div
              className="absolute w-32 h-32 rounded-full transition-transform duration-700"
              style={{
                background: "radial-gradient(circle at 35% 35%, #ffe3a8, #ffb567 45%, #e08340 85%)",
                boxShadow: "0 0 80px rgba(255,180,100,0.5), 0 0 160px rgba(255,140,80,0.25)",
                transform: `scale(${zoomed ? 1 : 0.6})`
              }}
            />
            <div className="absolute w-[440px] h-[440px] rounded-full border border-white/5" />
            <div className="absolute w-[340px] h-[340px] rounded-full border border-white/10" />

            {/* Orbiting tags */}
            {activeSkills.map((s, i) => {
              const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={s.name}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    transform: zoomed
                      ? `translate(${x}px, ${y}px)`
                      : `translate(0px, 0px) scale(0.5)`,
                    opacity: zoomed ? 1 : 0,
                    transitionDelay: `${i * 60}ms`
                  }}
                >
                  <div className="group flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                    <div className="px-4 py-2 rounded-full bg-[#0a0520]/90 border border-white/15 backdrop-blur-sm font-mono text-[13px] tracking-wide text-white whitespace-nowrap hover:border-amber-200/60 hover:text-amber-100 transition-colors">
                      {s.name}
                    </div>
                    <div className="mt-1.5 w-10 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-200/70"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
