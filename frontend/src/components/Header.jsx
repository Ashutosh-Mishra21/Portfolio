import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { navLinks, profile } from "../mock/mock";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const navigate = useNavigate();
  const location = useLocation();
  const onBlackholePage = location.pathname.startsWith("/blackhole");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (onBlackholePage) return;
      const sections = navLinks
        .filter((l) => !l.external)
        .map((l) => document.getElementById(l.target))
        .filter(Boolean);
      const y = window.scrollY + window.innerHeight / 3;
      for (const s of sections) {
        if (s.offsetTop <= y && s.offsetTop + s.offsetHeight > y) {
          setActive(s.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onBlackholePage]);

  const scrollTo = (link) => {
    if (link.external) {
      navigate(link.href);
      window.scrollTo(0, 0);
      return;
    }
    if (onBlackholePage) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(link.target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return;
    }
    const el = document.getElementById(link.target);
    if (!el) return;
    // Special case: for the sticky Galaxy section, land on the interesting frame
    if (link.target === "galaxy") {
      const vh = window.innerHeight;
      const target = el.offsetTop + Math.max(0, el.offsetHeight - vh) * 0.42;
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "backdrop-blur-xl bg-[#030010]/60 border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <button
          onClick={() => {
            if (onBlackholePage) navigate("/");
            else scrollTo({ target: "hero" });
          }}
          className="flex items-center gap-2 group"
        >
          <span className="w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_12px_rgba(255,200,140,0.9)] group-hover:scale-125 transition-transform" />
          <span className="font-display text-sm tracking-[0.3em] uppercase text-white/80">
            {profile.name.split(" ")[0] || "Portfolio"}
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => {
            const isActive = link.external
              ? onBlackholePage
              : !onBlackholePage && active === link.target;
            return (
              <button
                key={link.label}
                onClick={() => scrollTo(link)}
                className={`group relative px-4 py-2 text-[13px] font-mono tracking-wider transition-colors ${
                  isActive ? "text-amber-100" : "text-white/50 hover:text-white"
                }`}
              >
                <span className="text-white/30 mr-1.5">0{i + 1}.</span>
                {link.label}
                {isActive && (
                  <span className="absolute left-4 right-4 bottom-1 h-px bg-amber-200/70" />
                )}
              </button>
            );
          })}
        </nav>

        <a
          href={`mailto:${profile.email}`}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider text-white/80 border border-white/15 rounded-full hover:border-amber-200/60 hover:text-amber-100 transition-colors"
        >
          Get in touch
          <span className="w-1 h-1 rounded-full bg-amber-200 animate-pulse" />
        </a>
      </div>
    </header>
  );
};

export default Header;
