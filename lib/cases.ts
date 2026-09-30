export type CaseVariant = "topology" | "pid" | "chat";

export type CaseStudy = {
  id: string;
  /** Short domain code shown where the project list shows a number. */
  code: string;
  name: string;
  sub: string;
  highlight: string;
  kind: string;
  summary: string;
  problem: string;
  built: { title: string; body: string }[];
  pipeline: string[];
  stack: string[];
  status: { label: string; done: boolean }[];
  visual: CaseVariant;
  /** Fake URL shown in the preview window's address bar. */
  host: string;
};

export const CASES: CaseStudy[] = [
  {
    id: "alarms",
    code: "RCA",
    name: "Alarm Correlation Engine",
    sub: "Root-cause analysis over a network graph",
    highlight: "knowledge graph",
    kind: "Enterprise network AI / Knowledge graphs",
    summary:
      "When a network device fails, hundreds of alarms fire downstream. This engine groups them into incidents and names the root cause with a confidence score that is the same on every run and can be explained step by step.",
    problem:
      "Root causes came straight from an LLM, so scores drifted between runs and nobody could say why. The UI showed two unrelated numbers, and every incident was treated as brand new, even ones the team had already solved.",
    built: [
      {
        title: "Knowledge graph",
        body: "Turned a raw broadband topology file into a directed graph: every device a node, every link an edge. A classifier derives each node's role, from ISP router and BNG down to floor routers and end users, and VPN and MPLS overlays are mapped on top. The graph is cached against a SHA-256 hash of its source, so a changed topology rebuilds itself.",
      },
      {
        title: "Deterministic root cause",
        body: "Reverse BFS, lowest common ancestor, blast radius and weighted Dijkstra walk upstream from the alarming nodes and rank root-cause candidates with one explainable 0–1 confidence. A second score says how surely each alarm belongs to its cluster.",
      },
      {
        title: "Memory of past incidents",
        body: "Human-approved incidents are stored in an embedded ChromaDB knowledge base. Hybrid retrieval, dense vectors plus BM25, followed by a structural re-rank, recognises known failure patterns and nudges confidence within fixed bounds. Known, high-confidence cases skip manual review, and every confirmation or correction flows back in.",
      },
      {
        title: "Topology view",
        body: "An interactive network map laid out with the barycenter heuristic to keep edges from crossing. Click a device to see its blast radius and the services that depend on it; pick an incident and the map filters to exactly the nodes involved.",
      },
    ],
    pipeline: ["Topology", "Knowledge graph", "Alarm clusters", "Graph RCA", "Past incidents", "Confidence gate", "Human review"],
    stack: ["Python", "NetworkX", "ChromaDB", "BM25", "Dijkstra", "Gemini", "FastAPI"],
    status: [
      { label: "Knowledge graph", done: true },
      { label: "Confidence scoring", done: true },
      { label: "Knowledge base", done: true },
    ],
    visual: "topology",
    host: "rca-engine / incident replay",
  },
  {
    id: "pid",
    code: "P&ID",
    name: "P&ID Diagram Intelligence",
    sub: "Ask an engineering drawing questions",
    highlight: "vision LLM → graph",
    kind: "Computer vision / Graph RAG",
    summary:
      "Upload a piping and instrumentation diagram and ask it questions in plain English. A vision model reads the drawing tile by tile, rebuilds it as a graph of components and connections, and answers through generated database queries.",
    problem:
      "P&IDs are huge, dense drawings with hundreds of valves, transmitters and signal lines. Finding out what connects to what used to mean zooming around a PDF and tracing lines by eye.",
    built: [
      {
        title: "Read the drawing",
        body: "PDFs are rasterised with PyMuPDF and cut into overlapping tiles. Gemini 2.5 Pro reads each tile and returns structured JSON: every component's tag, ISA class and function, and every connection's signal type and flow direction.",
      },
      {
        title: "Rebuild it as a graph",
        body: "Tile results are merged and de-duplicated across tile edges into one graph and stored in Neo4j, covering 20+ ISA 5.1 component types and relationships like CONNECTED_TO and SENDS_SIGNAL_TO.",
      },
      {
        title: "Answer in English",
        body: "A question becomes a Cypher query, the results go back through the LLM, and the answer streams into a React UI with suggested questions for each diagram and a Cytoscape.js graph view.",
      },
      {
        title: "In progress",
        body: "A YOLO detector that crops each symbol before the LLM sees it, for cleaner identification, and a post-processing pass that catches ambiguous tags, missing links and components split across tiles.",
      },
    ],
    pipeline: ["PDF", "Overlapping tiles", "Gemini Vision", "Merge & dedupe", "Neo4j", "Question → Cypher", "Streamed answer"],
    stack: ["Gemini 2.5 Pro", "YOLO", "FastAPI", "Neo4j", "PyMuPDF", "React", "Cytoscape.js"],
    status: [
      { label: "Diagram → graph pipeline", done: true },
      { label: "Chat over the graph", done: true },
      { label: "YOLO symbol detection", done: false },
      { label: "Graph post-processing", done: false },
    ],
    visual: "pid",
    host: "pid-graph / tile scan",
  },
  {
    id: "assistant",
    code: "LLM",
    name: "Test-Data AI Assistant",
    sub: "A chatbot with memory and a safety net",
    highlight: "session-safe rollbacks",
    kind: "LLM application / Quality",
    summary:
      "An AI assistant inside an enterprise test-data platform. It answers questions about database schemas, finds relationships between tables and writes synthetic-data rules, remembering the conversation and snapshotting its changes so they can be undone.",
    problem:
      "Follow-up questions lost their context, and AI-written rules changed data with no way back. Testing then turned up a serious bug: resetting one chat quietly wiped relationship edits made in a different chat on the same project.",
    built: [
      {
        title: "Conversational memory",
        body: "History is saved per user and per session. A follow-up like “what about those tables?” is rewritten by the LLM into a complete question before retrieval, with schema Q&A and rule generation kept in separate histories.",
      },
      {
        title: "Checkpoints before changes",
        body: "Before any AI-generated rule is applied, the data generator's state is snapshotted to disk, laying the groundwork for undoing a single rule.",
      },
      {
        title: "Session isolation fix",
        body: "Every chat session wrote its checkpoints into one shared folder, so a reset in one window rolled back another's work. I gave each session its own checkpoint space and scoped undo, reset and restore to the session that asked, fixing two path bugs along the way.",
      },
      {
        title: "Tests, formatting, docs",
        body: "pytest suites for checkpoints, rollback and session isolation; end-to-end testing that surfaced several bugs, all since fixed; a markdown layer that tidies answers without ever breaking one; setup guides and full feature documentation.",
      },
    ],
    pipeline: ["Question", "History-aware rewrite", "Retrieval", "LLM", "Checkpoint", "Markdown", "Answer"],
    stack: ["Python", "LLMs", "MCP", "FAISS", "pytest", "REST APIs"],
    status: [
      { label: "Memory & checkpoints", done: true },
      { label: "Isolation fix & tests", done: true },
      { label: "Feature documentation", done: true },
    ],
    visual: "chat",
    host: "assistant / two sessions",
  },
];
