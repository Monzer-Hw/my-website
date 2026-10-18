import type { Job } from "./schema";

// PLACEHOLDER: invented companies and roles from intent/design-reference.html.
// Replace every entry with real experience before launch. Newest first.
export const experience: Job[] = [
  {
    placeholder: true,
    role: "AI Engineer",
    org: "Nordwerk Analytics GmbH",
    start: "2025-03",
    end: "present",
    location: "Düsseldorf, hybrid",
    summary:
      "Lead engineer on the internal document assistant, used by legal and procurement teams to search and question 40,000 contracts.",
    results: [
      "Designed the retrieval pipeline: hybrid search, reranking and cited answers. Contract lookups dropped from about 20 minutes to under one.",
      "Built an evaluation harness with a 300-question golden set, so every prompt or model change ships with a measured score.",
    ],
    tools: ["Python", "FastAPI", "pgvector", "Docker", "GitHub Actions"],
  },
  {
    placeholder: true,
    role: "Machine Learning Engineer, working student",
    org: "Ostkai Logistics AG",
    start: "2024-04",
    end: "2025-02",
    location: "Duisburg, on site",
    summary: "Part of a three-person automation team digitizing warehouse and back-office processes.",
    results: [
      "Shipped an OpenCV and CNN pipeline that flags damaged parcels at the inbound dock, catching 87% of cases manual checks used to miss.",
      "Automated invoice intake with n8n and an LLM extraction step, removing around 25 hours of manual data entry per week.",
    ],
    tools: ["Python", "OpenCV", "PyTorch", "ONNX", "n8n"],
  },
  {
    placeholder: true,
    role: "Data Science Intern",
    org: "Lumen Health Tech",
    start: "2023-09",
    end: "2024-03",
    location: "Cologne, remote",
    summary: "Worked with the support team on routing incoming tickets automatically.",
    results: [
      "Trained a ticket classifier across 14 categories and served it behind a small FastAPI service, cutting first-response routing time by a third.",
    ],
    tools: ["Python", "scikit-learn", "Hugging Face Transformers", "FastAPI"],
  },
];
