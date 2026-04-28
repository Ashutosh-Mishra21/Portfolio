// All mock data lives here. Swap with backend data later.

export const profile = {
  name: "Your Name",
  tagline: "Crafting interfaces at the edge of space",
  role: "Creative Developer & Designer",
  bio: "I design and engineer immersive digital experiences — blending code, motion, and storytelling into products that feel alive. Currently exploring the intersection of 3D interfaces, generative art, and human-centered design.",
  location: "Earth · Remote",
  email: "hello@yourname.dev",
  socials: {
    github: "https://github.com/yourname",
    linkedin: "https://linkedin.com/in/yourname",
    twitter: "https://twitter.com/yourname",
    dribbble: "https://dribbble.com/yourname"
  }
};

export const projects = [
  {
    id: "mercury",
    name: "Helios OS",
    subtitle: "Design system & component library",
    description: "A comprehensive design language for next-generation web platforms. 200+ components, dark-first, accessible by default.",
    tech: ["React", "TypeScript", "Tailwind", "Storybook"],
    demo: "#",
    github: "#",
    color: "#c2876b",
    ring: "#8b5a3d",
    size: 10,
    orbit: 130,
    speed: 28,
    year: "2025"
  },
  {
    id: "venus",
    name: "Nebula Chat",
    subtitle: "Real-time AI collaboration",
    description: "An AI-native collaborative workspace with multi-model streaming, persistent context, and spatial conversation threading.",
    tech: ["Next.js", "FastAPI", "WebSockets", "Postgres"],
    demo: "#",
    github: "#",
    color: "#d4a373",
    ring: "#a07248",
    size: 14,
    orbit: 185,
    speed: 40,
    year: "2024"
  },
  {
    id: "earth",
    name: "Terra Atlas",
    subtitle: "Climate data visualization",
    description: "An interactive atlas rendering 40 years of climate data across 10,000 regions. Built with WebGL for silky 60fps globe interactions.",
    tech: ["Three.js", "D3", "React", "GraphQL"],
    demo: "#",
    github: "#",
    color: "#4a7c8c",
    ring: "#2f5463",
    size: 15,
    orbit: 240,
    speed: 56,
    year: "2024"
  },
  {
    id: "mars",
    name: "Redshift",
    subtitle: "Developer analytics",
    description: "Privacy-first analytics for engineering teams. Track deploys, incidents, and velocity without shipping user data off-device.",
    tech: ["Rust", "SvelteKit", "DuckDB", "Cloudflare"],
    demo: "#",
    github: "#",
    color: "#a8553a",
    ring: "#6e3522",
    size: 13,
    orbit: 295,
    speed: 78,
    year: "2023"
  },
  {
    id: "jupiter",
    name: "Orbital",
    subtitle: "Motion design toolkit",
    description: "A timeline-based animation library for React. Scrub, chain, and choreograph transitions with a single declarative API.",
    tech: ["React", "Framer Motion", "Zustand", "Vite"],
    demo: "#",
    github: "#",
    color: "#b89968",
    ring: "#7a6440",
    size: 22,
    orbit: 355,
    speed: 110,
    year: "2023"
  },
  {
    id: "saturn",
    name: "Auralis",
    subtitle: "Generative audio engine",
    description: "A browser-native synthesizer that turns text prompts into ambient soundscapes. Runs entirely on Web Audio + WASM.",
    tech: ["Web Audio", "Rust/WASM", "Tone.js"],
    demo: "#",
    github: "#",
    color: "#d9b382",
    ring: "#8a6f4f",
    size: 18,
    orbit: 420,
    speed: 150,
    year: "2022",
    hasRing: true
  }
];

export const skills = {
  frontend: [
    { name: "React", level: 95 },
    { name: "Next.js", level: 90 },
    { name: "TypeScript", level: 92 },
    { name: "Tailwind", level: 95 },
    { name: "Three.js", level: 78 },
    { name: "Framer Motion", level: 88 }
  ],
  backend: [
    { name: "Node.js", level: 88 },
    { name: "Python", level: 85 },
    { name: "FastAPI", level: 82 },
    { name: "PostgreSQL", level: 80 },
    { name: "MongoDB", level: 78 },
    { name: "GraphQL", level: 75 }
  ],
  tools: [
    { name: "Figma", level: 92 },
    { name: "Git", level: 94 },
    { name: "Docker", level: 80 },
    { name: "AWS", level: 76 },
    { name: "Spline", level: 72 },
    { name: "Blender", level: 65 }
  ]
};

export const navLinks = [
  { label: "Index", target: "hero" },
  { label: "About", target: "galaxy" },
  { label: "Work", target: "solar" },
  { label: "Skills", target: "sun" },
  { label: "Contact", target: "contact" },
  { label: "Blackhole", target: "blackhole", external: true, href: "/blackhole" }
];

// Life timeline for the blackhole page
export const timeline = [
  {
    year: "1998",
    title: "First light",
    place: "Born on a pale blue dot",
    description: "A small signal enters the universe."
  },
  {
    year: "2010",
    title: "First computer",
    place: "Discovered the machine",
    description: "Built my first HTML page. Felt like casting spells."
  },
  {
    year: "2015",
    title: "High school",
    place: "Late nights + side projects",
    description: "Shipped games, browser extensions, and a questionable chat app."
  },
  {
    year: "2019",
    title: "University",
    place: "B.S. Computer Science",
    description: "Specialized in HCI and graphics. Interned at three startups."
  },
  {
    year: "2021",
    title: "First full-time role",
    place: "Frontend Engineer",
    description: "Shipped a design system used by 2M+ users. Learned to say no."
  },
  {
    year: "2023",
    title: "Going independent",
    place: "Freelance & consulting",
    description: "Worked with teams across the US, Germany, and Japan."
  },
  {
    year: "2025",
    title: "Here, now",
    place: "Building in public",
    description: "Exploring 3D interfaces, AI-native tools, and generative art."
  }
];

export const resume = {
  name: profile?.name || "Your Name",
  title: "Creative Developer & Designer",
  summary: "8+ years designing and engineering product-grade interfaces. I lead with taste, ship with code, and obsess over motion.",
  experience: [
    {
      role: "Senior Creative Developer",
      company: "Independent",
      period: "2023 — Present",
      bullets: [
        "Led interactive rebrand projects for 12+ startups.",
        "Shipped WebGL product configurators with 60fps performance.",
        "Published two open-source libraries (combined 4.2k ★)."
      ]
    },
    {
      role: "Product Engineer",
      company: "Helios Studio",
      period: "2021 — 2023",
      bullets: [
        "Built a design system used across 6 B2B products.",
        "Reduced core-flow latency by 42% via streaming SSR.",
        "Mentored 4 junior engineers through hiring pipeline."
      ]
    },
    {
      role: "Frontend Intern",
      company: "Orbit Labs",
      period: "2020",
      bullets: [
        "Prototyped an AR try-on flow for e-commerce.",
        "Contributed to internal component library (Vue 3)."
      ]
    }
  ],
  education: [
    { degree: "B.S. Computer Science", school: "State University", period: "2017 — 2021" }
  ],
  awards: [
    "Awwwards · Site of the Day · 2024",
    "FWA · Shortlist · 2023",
    "CSS Design Awards · UI/UX · 2022"
  ]
};
