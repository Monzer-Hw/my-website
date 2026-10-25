---
paths:
  - "app/**"
  - "components/**"
  - "lib/**"
  - "content/**"
  - ".env.example"
  - "next.config.ts"
  - "vercel.json"
  - "package.json"
---

# Privacy and legal rules

Sources: `intent/spec.md` 3.9 (privacy) and 3.10 (legal, Germany).

- No cookies, trackers or third-party requests on page load (spec 3.9).
- `app/api/contact/route.ts` stores nothing and never logs personal data.
- The contact rate limit (5 POSTs per IP per 10 min, then 429) is a
  Vercel Firewall rule on the project, not in the repo.
- Adding or changing a service that handles visitor data (hosting,
  email, video host, embeds, analytics) means the privacy text must be
  regenerated, and may need a cookie banner (spec 3.10). Flag it to the
  owner.
