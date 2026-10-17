# Version control conventions

- **Branches**: never commit to `main`. Branch from up-to-date `main`
  as `<type>/<short-description>` (e.g. `feat/contact-form`), one
  topic per branch.
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/):
  `<type>(<scope>): <summary>` + optional bullet body (what and why).
  - Types: `feat`, `fix`, `docs` (incl. intent/spec/plan), `style`,
    `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
  - Summary: imperative, lowercase, no period, ≤ 72 chars.
  - Breaking change: `!` + `BREAKING CHANGE:` footer.
  - One logical change per commit.
- **PRs**: conventional title; description with `## Summary`,
  `## Changes`, optional `## Notes`. Merging an intent/spec/plan PR
  means the owner accepts it.
- **After merge**: delete the branch (local + GitHub) and its
  worktree, then `git pull --ff-only` on `main`.
- **Never**: force-push `main`, commit secrets or `.env` files, or
  skip hooks without approval.
