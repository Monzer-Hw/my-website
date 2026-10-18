import type { Project } from "./schema";

// PLACEHOLDER: copied from intent/design-reference.html. Videos, live links and
// real posters arrive in phase 10; until then the poster art is drawn.
export const projects: Project[] = [
  {
    placeholder: true,
    id: "rag-pipeline",
    title: "Production RAG pipeline",
    status: { kind: "built", date: "June 2026" },
    summary:
      "A document Q&A system built from scratch, starting from a full PRD and codebase spec. Ingestion, chunking, storage and retrieval are separate layers, and every external provider sits behind one interface.",
    decisions: [
      {
        topic: "Providers",
        text: "Embeddings, vector store and LLM chosen through Factory and Strategy patterns, so switching vendors is a config change.",
      },
      { topic: "Config", text: "Typed Pydantic v2 settings loaded from YAML." },
      { topic: "Quality", text: "src layout, full type hints, mypy strict, Ruff and pre-commit hooks." },
    ],
    tools: ["Python", "Pydantic v2", "uv", "mypy", "Ruff"],
    links: {
      video: { src: "/videos/rag-pipeline.mp4", captions: "/videos/rag-pipeline.vtt", duration: "2:14" },
      code: "https://github.com/Monzer-Hw",
    },
    posterArt: "rag",
  },
  {
    placeholder: true,
    id: "sudoku-solver",
    title: "Sudoku solver",
    status: { kind: "in-progress" },
    summary:
      "Photograph a puzzle and get it solved. An OpenCV pipeline finds the grid and reads the digits, you confirm or correct what it recognized, and a constraint solver finishes the job.",
    decisions: [
      {
        topic: "Solver",
        text: "Constraint propagation with MRV ordering and naked and hidden singles; GAC (Régin) held back until it's needed.",
      },
      {
        topic: "API",
        text: "FastAPI with a discriminated-union response, so the frontend handles every outcome explicitly.",
      },
      {
        topic: "UX",
        text: "Recognise, confirm, edit, solve. The user stays in control when recognition is unsure.",
      },
    ],
    tools: ["Python 3.13", "FastAPI", "OpenCV", "Pytest", "Docker", "React", "TypeScript", "Vite", "Tailwind"],
    links: {
      video: { src: "/videos/sudoku-solver.mp4", captions: "/videos/sudoku-solver.vtt", duration: "1:38" },
      code: "https://github.com/Monzer-Hw/Sudoku-Solver",
    },
    posterArt: "sudoku",
  },
  {
    placeholder: true,
    id: "invoice-automation",
    title: "Invoice intake automation",
    status: { kind: "built", date: "2024" },
    summary:
      "An n8n workflow that picks up supplier invoices from a shared inbox, extracts the fields with an LLM, checks them against purchase orders and posts clean records to the ERP. Anything uncertain lands in a review queue instead of being guessed.",
    decisions: [
      {
        topic: "Extraction",
        text: "Structured output validated against a schema, with one retry before a human sees it.",
      },
      { topic: "Safety", text: "Confidence threshold per field, so a wrong amount never posts silently." },
      { topic: "Result", text: "Around 25 hours of manual entry removed per week." },
    ],
    tools: ["n8n", "Python", "Pydantic", "PostgreSQL"],
    links: {
      video: {
        src: "/videos/invoice-automation.mp4",
        captions: "/videos/invoice-automation.vtt",
        duration: "3:02",
      },
      code: "https://github.com/Monzer-Hw",
    },
    posterArt: "flow",
  },
];
