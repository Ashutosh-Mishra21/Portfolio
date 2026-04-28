import React from "react";
import { profile } from "../mock/mock";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/5 py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_rgba(255,200,140,0.8)]" />
            <span className="font-display tracking-[0.3em] text-sm uppercase text-white/80">
              {profile.name}
            </span>
          </div>

          <div className="font-mono text-[10px] tracking-widest uppercase text-white/40">
            © {year} · All transmissions reserved
          </div>

          <div className="flex items-center gap-3">
            {[
              { href: profile.socials.github, icon: Github },
              { href: profile.socials.linkedin, icon: Linkedin },
              { href: profile.socials.twitter, icon: Twitter }
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:border-amber-200/60 hover:text-amber-100 transition-colors"
              >
                <s.icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 flex flex-wrap gap-x-6 gap-y-2">
          <span>LAT 34.0522° N</span>
          <span>LON 118.2437° W</span>
          <span className="text-amber-200/50">SIGNAL LOCKED</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
