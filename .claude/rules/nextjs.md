---
paths:
  - "app/**"
  - "components/**"
  - "lib/**"
---

# Next.js 16 rules

- `cacheComponents` is on: `new Date()`, `Math.random()` and similar
  fail the prerender. Put them in a `"use cache"` function with an
  explicit `cacheLife(...)`, or in a Client Component.
