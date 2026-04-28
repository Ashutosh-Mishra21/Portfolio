import React, { useEffect, useState } from "react";
import { profile } from "../mock/mock";
import { ArrowDown, MapPin } from "lucide-react";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hero fades out as user scrolls
  const progress = Math.min(scrollY / 600, 1);
  const opacity = 1 - progress;
  const translateY = progress * -80;
  const scale = 1 - progress * 0.06;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-10"
    >
      {/* Subtle nebula wash */}
      <div className="absolute inset-0 nebula-bg pointer-events-none" style={{ zIndex: 0 }} />

      {/* Faint concentric rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
        <div
          className="w-[900px] h-[900px] rounded-full border border-white/5 animate-spin-slow"
          style={{ transform: `scale(${1 + progress * 0.3})` }}
        />
        <div className="absolute w-[600px] h-[600px] rounded-full border border-white/[0.04]" />
        <div className="absolute w-[1200px] h-[1200px] rounded-full border border-white/[0.03]" />
      </div>

      <div
        className="relative z-10 text-center max-w-4xl mx-auto"
        style={{ opacity, transform: `translateY(${translateY}px) scale(${scale})` }}
      >
        {/* Coordinates */}
        <div className="flex items-center justify-center gap-3 mb-10 font-mono text-[11px] tracking-[0.3em] uppercase text-white/40">
          <span>RA 17h 45m</span>
          <span className="w-8 h-px bg-white/20" />
          <span className="text-amber-200/80">TRANSMISSION 001</span>
          <span className="w-8 h-px bg-white/20" />
          <span>Dec -29°</span>
        </div>

        <h1 className="font-display text-[13vw] md:text-[8.5rem] lg:text-[11rem] leading-[0.9] font-light text-white/95 text-glow-cool">
          {profile.name.split(" ")[0] || "Hello"}
          <span className="block font-normal italic text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-amber-200 to-rose-200/80 text-glow-warm">
            {profile.name.split(" ").slice(1).join(" ") || "World"}
          </span>
        </h1>

        <p className="mt-10 text-lg md:text-xl text-white/60 font-light max-w-xl mx-auto leading-relaxed">
          {profile.tagline}
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-mono tracking-widest uppercase text-white/40">
          <MapPin size={12} className="text-amber-200/70" />
          <span>{profile.location}</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        style={{ opacity }}
      >
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/40">
          Begin Journey
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        <ArrowDown size={14} className="text-white/50 animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
