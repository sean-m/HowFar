# Copilot Instructions

## Repository shape

- This repo is a curated collection of Copilot/agent skills under `.agents/skills/`.
- Each skill is usually a self-contained folder with a `SKILL.md` entry point and optional companion docs beside it.
- `skills-lock.json` records the pinned upstream skill sources and hashes; treat it as registry metadata, not application code.
- There is no app source tree, package manifest, or repo-local build pipeline in the root. Most work here is editing markdown/YAML skill docs and keeping them consistent with their companion reference files.

## Commands

- No repo-specific build, test, or lint commands are defined.
- For tracker operations referenced by the skills, use `gh` for GitHub and `glab` for GitLab, following the tracker-specific docs under `.agents/skills/setup-matt-pocock-skills/`.

## High-level architecture

- The repo is organized around reusable agent workflows, not runtime code.
- The important split is between:
  - **Skill entry points** in `.agents/skills/*/SKILL.md`
  - **Shared reference docs** next to a skill (`SKILL-MECHANICS.md`, templates, glossary files, tracker docs)
  - **Registry metadata** in `skills-lock.json`
- Many skills are intentionally small and point to sibling docs for deeper rules. Prefer preserving that structure over inlining long guidance into one file.

## Key conventions

- Skill files start with YAML frontmatter (`---`) and usually define `name` and `description`; use `disable-model-invocation: true` when the skill should only be user-invoked.
- Keep naming aligned: the folder name, `name`, and surrounding docs should describe the same skill/workflow.
- Preserve the repo’s shared vocabulary from the docs:
  - **module / interface / seam / depth / adapter** for design work
  - **map / ticket / frontier / blocking** for wayfinding work
- When editing skills that depend on issue-tracker setup, remember the setup docs expect `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, and optionally `docs/agents/triage-labels.md`.
- `triage` comments and issue updates have a required AI disclaimer at the top; keep that exact wording when changing triage behavior.
- `wayfinder` is a planning workflow: one map issue, child decision tickets, and no more than one ticket resolved per session unless it is a research ticket.
- `to-tickets` should produce tracer-bullet slices with explicit blocking edges; `implement` is expected to use `/tdd` and then `/code-review`.
