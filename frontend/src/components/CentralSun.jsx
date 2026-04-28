import React from "react";

/**
 * The central Sun in the Experience solar system. Clicking it scrolls to Skills.
 * Extracted from SolarSystem to keep that component lean.
 */
const CentralSun = () => {
  const onClick = () => {
    const el = document.getElementById("sun");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group"
      aria-label="Navigate to skills"
    >
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: 260, height: 260,
          left: -130, top: -130,
          background: "radial-gradient(circle, rgba(255,200,130,0.35) 0%, rgba(255,140,80,0.12) 35%, transparent 70%)",
          filter: "blur(28px)"
        }}
      />
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
  );
};

export default CentralSun;
