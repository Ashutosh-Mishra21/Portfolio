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

const moonsFor = (count, seedPalette) =>
  Array.from({ length: count }).map((_, i) => ({
    distance: 1.6 + i * 0.55 + Math.random() * 0.3,
    speed: 6 + i * 3 + Math.random() * 2,
    size: 0.18 + Math.random() * 0.12,
    color: seedPalette[i % seedPalette.length],
    phase: Math.random() * 360
  }));

/* =================================================================
   EXPERIENCE — planets in Section 03 (the existing solar-system view)
   Six entries: 2 industry roles + 4 self-directed research arcs.
   ================================================================= */
export const experiences = [
  {
    id: "omics",
    role: "AI Developer",
    company: "OMICS International USA",
    duration: "Jul 2025 — Present",
    location: "Hyderabad, India",
    type: "Industry",
    bullets: [
      "Used LLMs to automate internal operations, cutting handwritten paperwork by ~70%.",
      "Engineered multi-agent AI systems that lifted operational effectiveness 40%.",
      "Shipped GenAI applications now used daily by 60+ internal users."
    ],
    relatedProjects: ["compound-ai", "rag-qa"],
    relatedSkills: ["LLMs", "Transformers", "FastAPI", "RAG"],
    // Visual props (kept compatible with the existing SolarSystem):
    color: "#d4a373",
    ring: "#a07248",
    size: 14,
    orbit: 130,
    speed: 28,
    year: "2025",
    moons: moonsFor(2, ["#e0c9a8", "#b89a78"])
  },
  {
    id: "exposys",
    role: "Data Science Intern",
    company: "Exposys Data Labs",
    duration: "May 2024 — Jun 2024",
    location: "Remote · Chennai, India",
    type: "Internship",
    bullets: [
      "Built regression models forecasting startup profitability from marketing/admin/R&D spend.",
      "EDA + feature engineering pushed model accuracy to 98%.",
      "Delivered actionable insights for early-stage startup decision-making."
    ],
    relatedProjects: ["startup-forecaster"],
    relatedSkills: ["Scikit-learn", "Pandas", "NumPy"],
    color: "#4a7c8c",
    ring: "#2f5463",
    size: 14,
    orbit: 185,
    speed: 40,
    year: "2024",
    moons: moonsFor(1, ["#cfd8dc"])
  },
  {
    id: "btech",
    role: "B.Tech · Computer Science",
    company: "XIM University (XIMB)",
    duration: "2021 — 2025  ·  CGPA 8.06",
    location: "Bhubaneswar, India",
    type: "Academic",
    bullets: [
      "Specialized in machine learning, deep learning, and applied mathematics.",
      "Shipped multiple end-to-end AI projects, including a neural network built from scratch.",
      "Graduated with 8.06 CGPA while running independent research in parallel."
    ],
    relatedProjects: ["nn-scratch", "transformer-study"],
    relatedSkills: ["Python", "NumPy", "TensorFlow"],
    color: "#a8553a",
    ring: "#6e3522",
    size: 15,
    orbit: 240,
    speed: 56,
    year: "2021–25",
    moons: moonsFor(2, ["#c9a89a", "#8a5544"])
  },
  {
    id: "transformer-arc",
    role: "Independent NLP Research",
    company: "Comparative Transformer Study",
    duration: "Sep 2024 — Feb 2025",
    location: "Independent",
    type: "Research",
    bullets: [
      "Benchmarked Transformer architectures (BERT, RoBERTa, DistilBERT) on Amazon reviews.",
      "Built end-to-end pipeline measuring robustness, accuracy, training cost, and inference speed.",
      "RoBERTa hit 89% sentiment classification accuracy with optimized configurations."
    ],
    relatedProjects: ["transformer-study"],
    relatedSkills: ["Transformers", "TensorFlow", "PyTorch"],
    color: "#b89968",
    ring: "#7a6440",
    size: 13,
    orbit: 295,
    speed: 78,
    year: "2024–25",
    moons: moonsFor(2, ["#d6c4a0", "#a08a60"])
  },
  {
    id: "rag-arc",
    role: "Agentic AI Research",
    company: "RAG QA System",
    duration: "Jan 2025 — Present",
    location: "Independent",
    type: "Research",
    bullets: [
      "Designing a production-grade Retrieval-Augmented Generation system over enterprise corpora.",
      "Hybrid agentic + rule-based semantic chunking to reduce hallucinations vs fixed-size chunking.",
      "End-to-end pipeline: ingestion, embeddings, vector indexing, reranking, web API."
    ],
    relatedProjects: ["rag-qa", "compound-ai"],
    relatedSkills: ["LLMs", "LangChain", "RAG", "Vector DBs"],
    color: "#cfa07c",
    ring: "#8a6a4a",
    size: 22,
    orbit: 355,
    speed: 110,
    year: "2025",
    moons: moonsFor(3, ["#e8d4b6", "#a8896a", "#c4a17c"])
  },
  {
    id: "nn-arc",
    role: "Self-Directed ML Deep Dive",
    company: "Neural Network From Scratch",
    duration: "May 2023 — Jun 2023",
    location: "Independent",
    type: "Research",
    bullets: [
      "Implemented a feed-forward NN with backpropagation in pure NumPy.",
      "94% accuracy on a synthetic binary classification benchmark; L2 regularization cut overfitting 25%.",
      "Built interactive visualizations of training dynamics — used by 50+ peers as a teaching aid."
    ],
    relatedProjects: ["nn-scratch"],
    relatedSkills: ["NumPy", "Matplotlib", "Python"],
    color: "#d9b382",
    ring: "#8a6f4f",
    size: 18,
    orbit: 420,
    speed: 150,
    year: "2023",
    hasRing: true,
    moons: moonsFor(2, ["#e8d9b6", "#a08c6a"])
  }
];

/* Backwards-compat alias used by the existing SolarSystem component */
export const projects = experiences;

/* =================================================================
   PROJECTS — shown inside the Shuttle section.
   ================================================================= */
export const projectsList = [
  {
    id: "compound-ai",
    name: "Compound AI · Journal Generator",
    subtitle: "Multi-agent academic publishing pipeline",
    description: "A multi-agent AI system that automates academic journal generation, cutting manual content time by 80%. Gemini + Groq LLaMA pipeline, CORE API for literature retrieval, LaTeX-based output.",
    tech: ["Python", "FastAPI", "Gemini", "Groq LLaMA", "LaTeX"],
    metrics: [
      { label: "time saved", value: "80%" },
      { label: "coherence", value: "+35%" },
      { label: "citations", value: "+50%" }
    ],
    github: "https://github.com/Ashutosh-Mishra21",
    demo: null,
    period: "Jul 2025 — Present",
    categories: ["ai", "research"],
    relatedSkills: ["LLMs", "FastAPI", "RAG"],
    relatedExperiences: ["omics", "rag-arc"]
  },
  {
    id: "rag-qa",
    name: "RAG QA System",
    subtitle: "Agentic retrieval-augmented generation",
    description: "Production-grade RAG QA over enterprise document corpora. Hybrid agentic + rule-based semantic chunking reduces hallucinations versus fixed-size chunking.",
    tech: ["Python", "LangChain", "LLMs", "Vector DBs"],
    metrics: [{ label: "hallucination", value: "↓ vs fixed-chunk" }],
    github: "https://github.com/Ashutosh-Mishra21",
    demo: null,
    period: "Jan 2025 — Present",
    categories: ["ai", "nlp"],
    relatedSkills: ["LangChain", "LLMs", "RAG"],
    relatedExperiences: ["rag-arc", "omics"]
  },
  {
    id: "transformer-study",
    name: "Comparative Transformer Study",
    subtitle: "Sentiment NLP across architectures",
    description: "Benchmarked Transformer models on Amazon review datasets — measured robustness, accuracy, training cost, and inference speed. RoBERTa reached 89% sentiment classification accuracy.",
    tech: ["Python", "TensorFlow", "Hugging Face"],
    metrics: [{ label: "accuracy", value: "89%" }],
    github: "https://github.com/Ashutosh-Mishra21",
    demo: null,
    period: "Sep 2024 — Feb 2025",
    categories: ["nlp", "research"],
    relatedSkills: ["Transformers", "TensorFlow"],
    relatedExperiences: ["transformer-arc", "btech"]
  },
  {
    id: "nn-scratch",
    name: "Neural Network From Scratch",
    subtitle: "Backprop in pure NumPy",
    description: "Feed-forward neural network with backpropagation, 94% on synthetic binary task. L2 regularization + custom gradient descent reduced overfitting 25%. Visualizations used by 50+ peers.",
    tech: ["Python", "NumPy", "Matplotlib"],
    metrics: [
      { label: "accuracy", value: "94%" },
      { label: "overfit", value: "−25%" }
    ],
    github: "https://github.com/Ashutosh-Mishra21",
    demo: null,
    period: "May 2023 — Jun 2023",
    categories: ["ml", "research"],
    relatedSkills: ["NumPy", "Matplotlib"],
    relatedExperiences: ["nn-arc", "btech"]
  },
  {
    id: "startup-forecaster",
    name: "Startup Profitability Forecaster",
    subtitle: "Regression + EDA for early-stage VCs",
    description: "Regression models forecasting startup profitability from marketing/admin/R&D spend. Heavy EDA + feature engineering pushed accuracy to 98%. Delivered during Exposys internship.",
    tech: ["Python", "Scikit-learn", "Pandas", "Seaborn"],
    metrics: [{ label: "accuracy", value: "98%" }],
    github: "https://github.com/Ashutosh-Mishra21",
    demo: null,
    period: "May 2024 — Jun 2024",
    categories: ["ml", "research"],
    relatedSkills: ["Scikit-learn", "Pandas"],
    relatedExperiences: ["exposys"]
  }
];

export const projectFilters = [
  { id: "all",       label: "All",         color: "#fcd38f" },
  { id: "ai",        label: "AI Systems",  color: "#fcd38f" },
  { id: "nlp",       label: "NLP",         color: "#c99bff" },
  { id: "ml",        label: "ML",          color: "#8ad0ff" },
  { id: "research",  label: "Research",    color: "#a8d4ff" }
];

/* =================================================================
   SKILLS — three-orbit solar system, Section 04
   ================================================================= */
export const skillsOrbits = [
  {
    name: "inner",
    label: "Core",
    radius: 150,
    speed: 70,
    color: "#fcd38f",
    skills: [
      { name: "LLMs",         context: "Driving force behind OMICS GenAI suite + RAG QA",
        relatedProjects: ["compound-ai", "rag-qa"], relatedExperiences: ["omics", "rag-arc"] },
      { name: "RAG",          context: "Powers the RAG QA system",
        relatedProjects: ["rag-qa", "compound-ai"], relatedExperiences: ["rag-arc"] },
      { name: "Transformers", context: "Used in the comparative sentiment study",
        relatedProjects: ["transformer-study", "rag-qa"], relatedExperiences: ["transformer-arc"] },
      { name: "FastAPI",      context: "API layer for journal generator + GenAI apps",
        relatedProjects: ["compound-ai"], relatedExperiences: ["omics"] }
    ]
  },
  {
    name: "middle",
    label: "Strong tools",
    radius: 250,
    speed: 110,
    color: "#c99bff",
    skills: [
      { name: "PyTorch",      context: "Deep learning research + experimentation",
        relatedProjects: ["transformer-study"], relatedExperiences: ["transformer-arc"] },
      { name: "TensorFlow",   context: "Sentiment analysis pipeline",
        relatedProjects: ["transformer-study"], relatedExperiences: ["transformer-arc", "btech"] },
      { name: "LangChain",    context: "RAG agent orchestration",
        relatedProjects: ["rag-qa"], relatedExperiences: ["rag-arc"] },
      { name: "Scikit-learn", context: "Startup profitability regression",
        relatedProjects: ["startup-forecaster"], relatedExperiences: ["exposys"] }
    ]
  },
  {
    name: "outer",
    label: "Supporting",
    radius: 350,
    speed: 160,
    color: "#8ad0ff",
    skills: [
      { name: "NumPy",      context: "Core matrix work; built NN from scratch",
        relatedProjects: ["nn-scratch"], relatedExperiences: ["nn-arc"] },
      { name: "Pandas",     context: "Data wrangling for EDA",
        relatedProjects: ["startup-forecaster"], relatedExperiences: ["exposys"] },
      { name: "Matplotlib", context: "Training-dynamics visualizations",
        relatedProjects: ["nn-scratch"], relatedExperiences: ["nn-arc"] },
      { name: "Git",        context: "Version control for everything",
        relatedProjects: [], relatedExperiences: [] }
    ]
  }
];

export const navLinks = [
  { label: "Index",      target: "hero" },
  { label: "About",      target: "galaxy" },
  { label: "Experience", target: "solar" },
  { label: "Projects",   target: "projects" },
  { label: "Skills",     target: "sun" },
  { label: "Contact",    target: "contact" },
  { label: "Blackhole",  target: "blackhole", external: true, href: "/blackhole" }
];

/* Life timeline (used by /blackhole page) */
export const timeline = [
  { year: "2018 – 2019", title: "Class X",                                  place: "Kendriya Vidyalaya Command Hospital, Kolkata", description: "Scored 87.8%. First exposure to programming." },
  { year: "2019 – 2021", title: "Class XII (PCM)",                          place: "Shiv Jyoti Senior Secondary School, Kota",      description: "Scored 85.6%. Foundations in math and physics in India's coaching capital." },
  { year: "2021 – 2025", title: "B.Tech, Computer Science & Engineering",   place: "XIM University (XIMB), Bhubaneswar — 8.06 CGPA",description: "Specialized in ML and deep learning. Built a neural network from scratch in NumPy and shipped multiple end-to-end AI projects." },
  { year: "May – Jun 2024", title: "Data Science Intern",                   place: "Exposys Data Labs (Remote, Chennai)",           description: "Regression models forecasting startup profitability. EDA + feature engineering pushed accuracy to 98%." },
  { year: "Sep 2024 – Feb 2025", title: "Transformer Sentiment Study",      place: "Independent NLP research",                      description: "Compared Transformer architectures on Amazon reviews. RoBERTa reached 89% sentiment classification accuracy." },
  { year: "Jan 2025 – Present", title: "RAG QA System",                     place: "Ongoing project",                               description: "Designing an agentic RAG system with hybrid semantic chunking, embeddings, and reranking." },
  { year: "Jul 2025 – Present", title: "AI Developer",                      place: "OMICS International USA, Hyderabad",            description: "Multi-agent AI systems and GenAI apps used by 60+ internal users — paperwork ↓ 70%, ops ↑ 40%." }
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
    { role: "AI Developer", company: "OMICS International USA", period: "Jul 2025 — Present", location: "Hyderabad, Telangana, India",
      bullets: [
        "Used LLM-based technologies to automate internal operations, reducing handwritten paperwork by ~70%.",
        "Engineered multi-agent AI systems that increased operational effectiveness by 40%.",
        "Developed and deployed GenAI applications now used by 60+ internal users."
      ]
    },
    { role: "Data Science Intern", company: "Exposys Data Labs", period: "May 2024 — Jun 2024", location: "Remote · Chennai, India",
      bullets: [
        "Built regression models forecasting startup profitability using marketing, admin, and R&D spend.",
        "Performed EDA and feature engineering to push model accuracy up to 98%.",
        "Delivered actionable insights for early-stage startup decision-making and forecasting."
      ]
    }
  ],
  projects: [
    { name: "Compound AI System for Journal Generation", period: "Jul 2025 — Present", tech: "Python · FastAPI · Gemini · Groq LLaMA · LaTeX",
      bullets: [
        "Multi-agent AI system that automates academic journal generation, cutting manual content time by 80%.",
        "Integrated Gemini + Groq LLaMA with multi-stage prompting; coherence improved 35%.",
        "CORE API-powered literature retrieval lifted citation accuracy and relevance by 50%.",
        "LaTeX-based PDF/HTML generation enables end-to-end publication in under 2 minutes."
      ]
    },
    { name: "Comparative Study of Transformer Models", period: "Sep 2024 — Feb 2025", tech: "Python · TensorFlow · Hugging Face",
      bullets: [
        "Sentiment-analysis study across multiple Transformer architectures on Amazon review datasets.",
        "Pipeline measured robustness, accuracy, training cost, and inference speed; RoBERTa hit 89%.",
        "Generated insights on deployment trade-offs to improve sentiment classification performance."
      ]
    },
    { name: "Neural Network From Scratch", period: "May 2023 — Jun 2023", tech: "Python · NumPy",
      bullets: [
        "Feed-forward neural network with backpropagation, 94% accuracy on synthetic binary task.",
        "L2 regularization + custom gradient descent reduced overfitting 25%.",
        "Interactive visualizations of training dynamics used by 50+ students."
      ]
    },
    { name: "RAG QA System", period: "Jan 2025 — Present", tech: "Python · LangChain · LLMs · Vector DBs",
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

/* Legacy shape kept for any older imports */
export const skills = {
  frontend: skillsOrbits[0].skills.map((s) => ({ name: s.name, level: 90 })),
  backend:  skillsOrbits[1].skills.map((s) => ({ name: s.name, level: 85 })),
  tools:    skillsOrbits[2].skills.map((s) => ({ name: s.name, level: 80 }))
};
