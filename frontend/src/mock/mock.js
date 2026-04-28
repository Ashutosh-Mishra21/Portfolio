// All mock/profile data lives here.

export const profile = {
  name: "Ashutosh Mishra",
  tagline: "Building intelligent systems at the edge of language and code",
  role: "AI / ML Engineer",
  bio: "AI/ML Engineer specializing in Large Language Models, multi-agent systems, and deep learning. I build production-grade AI pipelines — from automated journal generation and OCR workflows to neural networks from scratch — turning research into reliable, real-world systems.",
  location: "Bhubaneswar · India",
  email: "ashutoshmishra21oct2003@gmail.com",
  phone: "+91 95718 21291",
  socials: {
    github: "https://github.com/Ashutosh-Mishra21",
    linkedin: "https://linkedin.com/in/ashutosh-mishra-99b07b221",
    twitter: "https://twitter.com/yourhandle",
    instagram: "https://instagram.com/yourhandle"
  }
};

// Random helper for moon counts/positions deterministically per planet
const moonsFor = (count, seedPalette) =>
  Array.from({ length: count }).map((_, i) => ({
    distance: 1.6 + i * 0.55 + Math.random() * 0.3,
    speed: 6 + i * 3 + Math.random() * 2,
    size: 0.18 + Math.random() * 0.12,
    color: seedPalette[i % seedPalette.length],
    phase: Math.random() * 360
  }));

export const projects = [
  {
    id: "mercury",
    name: "Compound AI · Journal Generator",
    subtitle: "Multi-agent academic publishing pipeline",
    description: "A multi-agent AI system that automates academic journal generation, cutting manual content creation time by 80%. Integrates Google Gemini + Groq LLaMA with a multi-stage prompting pipeline, CORE API for literature retrieval, and LaTeX-based PDF/HTML output — end-to-end publication in under 2 minutes.",
    tech: ["Python", "FastAPI", "Gemini", "Groq LLaMA", "LaTeX"],
    demo: "#",
    github: "https://github.com/Ashutosh-Mishra21",
    color: "#c2876b",
    ring: "#8b5a3d",
    size: 10,
    orbit: 130,
    speed: 28,
    year: "2025",
    moons: moonsFor(1, ["#d8c4b0"])
  },
  {
    id: "venus",
    name: "RAG QA System",
    subtitle: "Agentic retrieval-augmented generation",
    description: "A production-grade RAG QA system integrating LLMs, LangChain, and vector databases for context-aware question answering over enterprise document corpora. Hybrid agentic + rule-based semantic chunking reduces hallucinations versus fixed-size chunking.",
    tech: ["Python", "LangChain", "LLMs", "Vector DBs"],
    demo: "#",
    github: "https://github.com/Ashutosh-Mishra21",
    color: "#d4a373",
    ring: "#a07248",
    size: 14,
    orbit: 185,
    speed: 40,
    year: "2025",
    moons: moonsFor(2, ["#e0c9a8", "#b89a78"])
  },
  {
    id: "earth",
    name: "Transformer Sentiment Study",
    subtitle: "Comparative NLP on product reviews",
    description: "Comprehensive sentiment-analysis study comparing Transformer architectures on large-scale Amazon review datasets. Built a full preprocessing + evaluation pipeline measuring robustness, accuracy, cost, and inference speed. RoBERTa hit 89% accuracy.",
    tech: ["Python", "TensorFlow", "Hugging Face", "RoBERTa"],
    demo: "#",
    github: "https://github.com/Ashutosh-Mishra21",
    color: "#4a7c8c",
    ring: "#2f5463",
    size: 15,
    orbit: 240,
    speed: 56,
    year: "2025",
    moons: moonsFor(1, ["#cfd8dc"])
  },
  {
    id: "mars",
    name: "Neural Network From Scratch",
    subtitle: "Feed-forward NN + backprop in NumPy",
    description: "Implemented a complete feed-forward neural network with backpropagation in pure NumPy, hitting 94% accuracy on a binary classification benchmark. L2 regularization + custom gradient descent reduced overfitting 25%. Visualizations used by 50+ students.",
    tech: ["Python", "NumPy", "Matplotlib"],
    demo: "#",
    github: "https://github.com/Ashutosh-Mishra21",
    color: "#a8553a",
    ring: "#6e3522",
    size: 13,
    orbit: 295,
    speed: 78,
    year: "2023",
    moons: moonsFor(2, ["#c9a89a", "#8a5544"])
  },
  {
    id: "jupiter",
    name: "OMICS GenAI Suite",
    subtitle: "LLM tooling for internal ops",
    description: "Suite of GenAI applications built at OMICS International USA: multi-agent systems that lifted operational effectiveness 40%, and LLM workflows that cut handwritten paperwork ~70%. Used by 60+ internal users daily.",
    tech: ["Python", "LLMs", "Multi-agent", "FastAPI"],
    demo: "#",
    github: "https://github.com/Ashutosh-Mishra21",
    color: "#b89968",
    ring: "#7a6440",
    size: 22,
    orbit: 355,
    speed: 110,
    year: "2025",
    moons: moonsFor(3, ["#d6c4a0", "#a08a60", "#c4ad7e"])
  },
  {
    id: "saturn",
    name: "Startup Profitability Forecaster",
    subtitle: "Regression + EDA for early-stage VCs",
    description: "Regression models forecasting startup profitability from marketing, admin, and R&D spend. Heavy EDA + feature engineering pushed accuracy to 98%. Delivered actionable decision-support insights for early-stage startups during my Exposys internship.",
    tech: ["Python", "Scikit-learn", "Pandas", "Seaborn"],
    demo: "#",
    github: "https://github.com/Ashutosh-Mishra21",
    color: "#d9b382",
    ring: "#8a6f4f",
    size: 18,
    orbit: 420,
    speed: 150,
    year: "2024",
    hasRing: true,
    moons: moonsFor(2, ["#e8d9b6", "#a08c6a"])
  }
];

export const skills = {
  frontend: [
    { name: "FastAPI", level: 90 },
    { name: "Streamlit", level: 82 },
    { name: "LaTeX", level: 88 },
    { name: "Matplotlib", level: 85 },
    { name: "Seaborn", level: 80 },
    { name: "Jupyter", level: 95 }
  ],
  backend: [
    { name: "Python", level: 95 },
    { name: "TensorFlow", level: 90 },
    { name: "PyTorch", level: 85 },
    { name: "Hugging Face", level: 88 },
    { name: "LangChain", level: 82 },
    { name: "SQL", level: 80 }
  ],
  tools: [
    { name: "OpenCV", level: 80 },
    { name: "YOLO", level: 75 },
    { name: "Git", level: 90 },
    { name: "Prompt Engg.", level: 92 },
    { name: "RAG", level: 86 },
    { name: "Vector DBs", level: 78 }
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

// Life timeline — derived from the resume
export const timeline = [
  {
    year: "2018 – 2019",
    title: "Class X",
    place: "Kendriya Vidyalaya Command Hospital, Kolkata",
    description: "Scored 87.8%. First exposure to programming and the universe of computer science."
  },
  {
    year: "2019 – 2021",
    title: "Class XII (PCM)",
    place: "Shiv Jyoti Senior Secondary School, Kota",
    description: "Scored 85.6%. Built foundations in mathematics and physics in India's coaching capital."
  },
  {
    year: "2021 – 2025",
    title: "B.Tech, Computer Science & Engineering",
    place: "XIM University (XIMB), Bhubaneswar — 8.06 CGPA",
    description: "Specialized in machine learning and deep learning. Built a neural network from scratch in NumPy and shipped multiple end-to-end AI projects."
  },
  {
    year: "May – Jun 2024",
    title: "Data Science Intern",
    place: "Exposys Data Labs (Remote, Chennai)",
    description: "Built regression models forecasting startup profitability. EDA + feature engineering pushed model accuracy to 98%."
  },
  {
    year: "Sep 2024 – Feb 2025",
    title: "Transformer Sentiment Study",
    place: "Independent NLP research",
    description: "Compared Transformer architectures on Amazon reviews. RoBERTa reached 89% sentiment classification accuracy."
  },
  {
    year: "Jan 2025 – Present",
    title: "RAG QA System",
    place: "Ongoing project",
    description: "Designing an agentic retrieval-augmented generation system with hybrid semantic chunking, embeddings, and reranking."
  },
  {
    year: "Jul 2025 – Present",
    title: "AI Developer",
    place: "OMICS International USA, Hyderabad",
    description: "Engineering multi-agent AI systems, GenAI apps, and LLM workflows used by 60+ internal users — cutting paperwork ~70% and lifting operational effectiveness 40%."
  }
];

export const resume = {
  name: "Ashutosh Mishra",
  title: "AI / ML Engineer",
  email: "ashutoshmishra21oct2003@gmail.com",
  phone: "+91 95718 21291",
  location: "Bhubaneswar, Odisha, India",
  links: {
    github: "github.com/Ashutosh-Mishra21",
    linkedin: "linkedin.com/in/ashutosh-mishra-99b07b221"
  },
  summary:
    "AI/ML Engineer specializing in Large Language Models, multi-agent systems, and deep learning. Experienced in building production-grade AI solutions — automated journal-generation pipelines, sentiment analysis systems, OCR workflows, and neural networks implemented from scratch. Strong foundation in ML theory, optimization, and scalable model deployment using TensorFlow, FastAPI, and Hugging Face. Seeking an AI / Machine Learning Engineer role to create high-impact, scalable AI systems.",
  experience: [
    {
      role: "AI Developer",
      company: "OMICS International USA",
      period: "Jul 2025 — Present",
      location: "Hyderabad, Telangana, India",
      bullets: [
        "Used LLM-based technologies to automate internal operations, reducing handwritten paperwork by ~70%.",
        "Engineered multi-agent AI systems that increased operational effectiveness by 40%.",
        "Developed and deployed GenAI applications now used by 60+ internal users."
      ]
    },
    {
      role: "Data Science Intern",
      company: "Exposys Data Labs",
      period: "May 2024 — Jun 2024",
      location: "Remote · Chennai, India",
      bullets: [
        "Built regression models forecasting startup profitability using marketing, admin, and R&D spend.",
        "Performed EDA and feature engineering to push model accuracy up to 98%.",
        "Delivered actionable insights for early-stage startup decision-making and forecasting."
      ]
    }
  ],
  projects: [
    {
      name: "Compound AI System for Journal Generation",
      period: "Jul 2025 — Present",
      tech: "Python · FastAPI · Gemini · Groq LLaMA · LaTeX",
      bullets: [
        "Multi-agent AI system that automates academic journal generation, cutting manual content time by 80%.",
        "Integrated Gemini + Groq LLaMA with multi-stage prompting; coherence improved 35%.",
        "CORE API-powered literature retrieval lifted citation accuracy and relevance by 50%.",
        "LaTeX-based PDF/HTML generation enables end-to-end publication in under 2 minutes."
      ]
    },
    {
      name: "Comparative Study of Transformer Models",
      period: "Sep 2024 — Feb 2025",
      tech: "Python · TensorFlow · Hugging Face",
      bullets: [
        "Sentiment-analysis study across multiple Transformer architectures on Amazon review datasets.",
        "Pipeline measured robustness, accuracy, training cost, and inference speed; RoBERTa hit 89%.",
        "Generated insights on deployment trade-offs to improve sentiment classification performance."
      ]
    },
    {
      name: "Neural Network From Scratch",
      period: "May 2023 — Jun 2023",
      tech: "Python · NumPy",
      bullets: [
        "Feed-forward neural network with backpropagation, 94% accuracy on synthetic binary task.",
        "L2 regularization + custom gradient descent reduced overfitting 25%.",
        "Interactive visualizations of training dynamics used by 50+ students."
      ]
    },
    {
      name: "RAG QA System",
      period: "Jan 2025 — Present",
      tech: "Python · LangChain · LLMs · Vector DBs",
      bullets: [
        "Production-grade RAG QA over enterprise document corpora.",
        "Hybrid agentic + rule-based semantic chunking to reduce hallucinations.",
        "End-to-end pipeline: ingestion, embeddings, vector indexing, reranking, web API."
      ]
    }
  ],
  education: [
    { degree: "B.Tech · Computer Science & Engineering", school: "XIM University (XIMB)", period: "2021 — 2025", gpa: "8.06 CGPA", location: "Bhubaneswar, India" },
    { degree: "Class XII · PCM", school: "Shiv Jyoti Senior Secondary School", period: "2019 — 2021", gpa: "85.6%", location: "Kota, India" },
    { degree: "Class X", school: "Kendriya Vidyalaya Command Hospital", period: "2018 — 2019", gpa: "87.8%", location: "Kolkata, India" }
  ],
  certifications: [
    "Data Warehouse Fundamentals",
    "Data Analytics with Python",
    "Optimization for Machine Learning",
    "Machine Learning Specialization",
    "Deep Learning Specialization",
    "Google AI Essentials",
    "IBM Generative AI Engineering"
  ],
  skillCategories: {
    "Programming": ["Python", "SQL"],
    "ML Frameworks": ["TensorFlow", "PyTorch", "Keras", "Scikit-learn"],
    "NLP & LLMs": ["Transformers", "FastAPI", "Prompt Engineering", "RAG"],
    "Computer Vision": ["OpenCV", "YOLO", "OCR Systems"],
    "Data": ["NumPy", "Pandas", "Matplotlib", "Seaborn"],
    "Tools": ["Git", "Jupyter", "VSCode", "LaTeX"],
    "Math for ML": ["Optimization", "Linear Algebra", "Probability"]
  },
  interests: ["Agentic AI Systems", "Game Development & Story Mechanics", "Astronomy (Astrophile)"]
};
