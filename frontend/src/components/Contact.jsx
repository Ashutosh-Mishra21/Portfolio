import React, { useState } from "react";
import { profile } from "../mock/mock";
import { Mail, Github, Linkedin, Twitter, Instagram, ArrowUpRight, Send } from "lucide-react";
import { toast } from "../hooks/use-toast";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Missing fields", description: "Please fill in all fields." });
      return;
    }
    setSending(true);
    setTimeout(() => {
      // Mock: save to localStorage
      const existing = JSON.parse(localStorage.getItem("cosmic_messages") || "[]");
      existing.push({ ...form, at: new Date().toISOString() });
      localStorage.setItem("cosmic_messages", JSON.stringify(existing));
      setSending(false);
      setForm({ name: "", email: "", message: "" });
      toast({
        title: "Transmission sent ✨",
        description: "Your signal is travelling at light speed. I'll respond soon."
      });
    }, 900);
  };

  return (
    <section id="contact" className="relative py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-16">
          {/* Left */}
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-200/70 mb-5">
              — Section 05 / Transmission
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-light text-white leading-[0.95]">
              Let's <span className="italic text-amber-100">orbit</span><br />
              together.
            </h2>
            <p className="mt-8 text-white/60 text-lg max-w-md leading-relaxed">
              I'm open to freelance work, collaborations, and the occasional late-night design conversation.
            </p>

            <a
              href={`mailto:${profile.email}`}
              className="mt-10 inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-white hover:text-amber-100 transition-colors group"
            >
              <Mail size={22} className="text-amber-200/80" />
              {profile.email}
              <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </a>

            <div className="mt-14">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">
                Elsewhere
              </div>
              <div className="flex items-center gap-3">
                {[
                  { href: profile.socials.github, icon: Github, label: "GitHub" },
                  { href: profile.socials.linkedin, icon: Linkedin, label: "LinkedIn" },
                  { href: profile.socials.twitter, icon: Twitter, label: "Twitter" },
                  { href: profile.socials.instagram, icon: Instagram, label: "Instagram" }
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank" rel="noreferrer"
                    className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:border-amber-200/60 hover:text-amber-100 transition-colors"
                    aria-label={s.label}
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <form
            onSubmit={submit}
            className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-10"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber-200/70 mb-6">
              Send a signal
            </div>

            <div className="space-y-5">
              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-white/40 block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/15 focus:border-amber-200/70 py-2.5 outline-none text-white transition-colors"
                  placeholder="Astronaut"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-white/40 block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-transparent border-b border-white/15 focus:border-amber-200/70 py-2.5 outline-none text-white transition-colors"
                  placeholder="you@domain.space"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-white/40 block mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border-b border-white/15 focus:border-amber-200/70 py-2.5 outline-none text-white resize-none transition-colors"
                  placeholder="Tell me about your idea…"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-200 hover:bg-amber-100 disabled:opacity-60 text-[#0a0520] text-sm font-medium rounded-full transition-colors"
            >
              {sending ? "Transmitting…" : (
                <>
                  <Send size={14} />
                  Send transmission
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
