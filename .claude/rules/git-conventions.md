# Version control conventions

All changes to this repository follow these rules.

## Branches
- `main` is the default branch and always reflects accepted work.
- Never commit directly to `main`. Every change goes through a
  branch and a pull request.
- Branch from an up-to-date `main`.
- Name branches `<type>/<short-description>` in kebab-case, using the
  commit types below, e.g. `feat/contact-form`, `docs/spec-v1`,
  `fix/mobile-nav-overflow`.
- One topic per branch.

## Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <summary>

- <what changed and why>
- <what changed and why>
```

- Types:
  - `feat`: a new feature
  - `fix`: a bug fix
  - `docs`: documentation and SDLC artifacts (intent.md, spec.md, plan.md)
  - `style`: formatting only, no behavior change
  - `refactor`: code change that neither fixes a bug nor adds a feature
  - `perf`: performance improvement
  - `test`: adding or changing tests
  - `build`: build system or dependencies
  - `ci`: CI configuration
  - `chore`: maintenance and tooling, e.g. `.claude/` config
- Scope (optional): the area touched, e.g. `intent`, `spec`,
  `projects`, `contact`.
- Summary: imperative mood ("add", not "added"), lowercase, no
  trailing period, at most 72 characters.
- Body: short bullets explaining what changed and why. Optional for
  trivial changes.
- Breaking changes: add `!` after the type/scope and a
  `BREAKING CHANGE:` footer.
- One logical change per commit.

## Pull requests
- Title: a Conventional Commit summary, e.g.
  `docs(spec): define requirements and design for v1`.
- Description sections:
  - `## Summary`: what the PR does and why
  - `## Changes`: the main changes as bullets
  - `## Notes` (optional): follow-ups, open questions, review hints
- Merging an SDLC artifact PR (intent.md, spec.md, plan.md) means the
  owner accepts that artifact.

## After merging
- Delete the branch, locally and on GitHub.
- Remove any worktree used for the branch.
- Update local `main` with `git pull --ff-only`.

## Never
- Force-push to `main` or rewrite its published history.
- Commit secrets, credentials or `.env` files.
- Skip hooks (`--no-verify`) without the owner's explicit approval.
