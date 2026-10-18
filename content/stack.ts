import type { StackGroup } from "./schema";

// PLACEHOLDER: copied from intent/design-reference.html. `usedIn` must name ids from projects.ts.
export const stack: StackGroup[] = [
  {
    placeholder: true,
    title: "Language models and retrieval",
    items: [
      { name: "RAG pipelines" },
      { name: "chunking strategies" },
      { name: "multi-provider embeddings and vector stores" },
      { name: "NLP" },
      { name: "GraphRAG", tag: "exploring" },
    ],
    usedIn: ["rag-pipeline", "invoice-automation"],
  },
  {
    placeholder: true,
    title: "Computer vision",
    items: [
      { name: "OpenCV pipelines" },
      { name: "digit recognition" },
      { name: "CNN training and ONNX export", tag: "in progress" },
    ],
    usedIn: ["sudoku-solver"],
  },
  {
    placeholder: true,
    title: "Backend and APIs",
    items: [{ name: "Python 3.13" }, { name: "FastAPI" }, { name: "Pydantic v2" }, { name: "Docker" }],
    usedIn: ["rag-pipeline", "sudoku-solver"],
  },
  {
    placeholder: true,
    title: "Automation",
    items: [{ name: "n8n workflows and integrations" }],
    usedIn: ["invoice-automation"],
  },
  {
    placeholder: true,
    title: "Quality and tooling",
    items: [
      { name: "uv" },
      { name: "Ruff" },
      { name: "mypy strict" },
      { name: "Pytest" },
      { name: "pre-commit" },
      { name: "Just" },
    ],
    usedIn: ["rag-pipeline", "sudoku-solver"],
  },
  {
    placeholder: true,
    title: "Frontend, when needed",
    items: [
      { name: "TypeScript" },
      { name: "React" },
      { name: "Vite" },
      { name: "Tailwind" },
      { name: "Zod" },
      { name: "Vitest" },
    ],
    usedIn: ["sudoku-solver"],
  },
];
