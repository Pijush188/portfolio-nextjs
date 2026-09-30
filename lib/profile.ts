export const ROLES = [
  { title: "Junior Data Scientist", org: "Calsoft", when: "Sep 2025 — Present", current: true },
  { title: "AI/ML Intern", org: "Calsoft", when: "Feb 2025 — Aug 2025", current: false },
];

/** `color` tags each group in the list and its hover card. */
export const SKILLS: { group: string; color: string; note: string; items: string[]; usedIn: string[] }[] = [
  {
    group: "LLMs & GenAI",
    color: "#ffb45c",
    note: "Assistants and agents that reason over real data",
    items: ["Gemini", "LangGraph", "RAG pipelines", "Multi-agent systems", "MCP"],
    usedIn: ["Test-Data AI Assistant", "P&ID Diagram Intelligence"],
  },
  {
    group: "Graphs & retrieval",
    color: "#7fb3ff",
    note: "Knowledge graphs, vector stores, hybrid search",
    items: ["Neo4j & Cypher", "NetworkX", "ChromaDB", "FAISS", "BM25 hybrid search"],
    usedIn: ["Alarm Correlation Engine", "P&ID Diagram Intelligence"],
  },
  {
    group: "ML & vision",
    color: "#d98cb8",
    note: "Training and fine-tuning image models",
    items: ["TensorFlow", "CNNs & transfer learning", "InceptionV3", "YOLO detection"],
    usedIn: ["Cassava Leaf Detection", "P&ID Diagram Intelligence"],
  },
  {
    group: "Backend",
    color: "#ffd7a3",
    note: "Serving models behind clean APIs",
    items: ["Python", "FastAPI", "Flask", "REST APIs", "pytest"],
    usedIn: ["Alarm Correlation Engine", "Test-Data AI Assistant"],
  },
  {
    group: "Frontend",
    color: "#8f96ff",
    note: "Interfaces for the systems I build",
    items: ["React", "Vite", "Cytoscape.js", "three.js", "GSAP"],
    usedIn: ["Vision Pro UI", "VidTube", "P&ID Diagram Intelligence"],
  },
  {
    group: "Foundations",
    color: "#9fd8c8",
    note: "The groundwork underneath it all",
    items: ["Java", "SQL & MySQL", "Statistics", "DBMS & OOP", "OS & networks"],
    usedIn: ["Everything above"],
  },
];

export const DEGREE = {
  when: "2021 — 2025",
  what: "B.Tech, Information Technology",
  school: "Meghnad Saha Institute of Technology",
  place: "Kolkata",
  cgpa: 8.77,
};

export const SCHOOL = [
  { when: "2018 — 2020", what: "Class XII", school: "Searsole Raj High School, Raniganj", score: "83%" },
  { when: "2017 — 2018", what: "Class X", school: "Searsole Raj High School, Raniganj", score: "88%" },
];

export const CERTIFICATES = [
  {
    kind: "Award",
    name: "Smart India Hackathon 2023",
    detail: "2nd runner-up, college-level round",
    href: "https://drive.google.com/file/d/1327PZ7e1U_rdz1QL67ANuwerq-o7EBig/view?usp=drive_link",
  },
  {
    kind: "Certificate",
    name: "Machine Learning Specialization",
    detail: "Supervised and unsupervised learning, recommender systems, reinforcement learning",
    href: "https://drive.google.com/file/d/1gweGq_ObgCKokayUxK7oJVq31Lfymi1L/view?usp=drive_link",
  },
];
