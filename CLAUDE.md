# Agentic Framework

Website that presents and blogs the team's agent-first ecosystem — **xeno-skills** (the hub), **openclink**, **clone space** — and the operating standard they run on. `README.md` is the human-facing overview; this file is the agent's operating manual.

> The **IA spec is a draft** (`docs/superpowers/specs/2026-09-02-site-ia-storytelling-design.md`, `status: draft`): hub-and-spoke single-scroll. Until it is approved, the scaffold IA (`/ecosystem` index + three equal items) is a placeholder. **Setup only until the requirements are final** — no content deep-dives or route restructure before then (developer instruction, 2026-09-02).

## Engineering north star

The coding agent is the primary developer of this repo. Docs are the agent's operating manual, not team paperwork. Content is Markdown-driven (`content/*.md`); pages are static (SSG). Do not add a database or a build-time network dependency.

## Session start (in this order; stop pulling detail once you have enough)

1. `karpathy-guidelines` — load once so every edit this session is surgical.
2. `docs/OPEN-WORK-LEDGER.md` — what is open, tracked and untracked.
3. `Obsidian-Agentic-Framework/Home.md` — team memory index; open only the notes the task touches.
4. Route the task through `using-t4` (below).

## Routing — `using-t4` is a standing default

`using-t4` is not a pointer to read once: it is a **re-routing obligation at every phase boundary** — wrote code → `simplify`; before merge → `code-review` + `scrutinize`; touched auth/secret → `security-review`; done → `verify`. **A check at task start does not discharge a later trigger.** A parent skill does not discharge its leaves.

## Delegation — `clink-subagents` is the default

In an agent-primary repo the orchestrator's context window is the scarce resource, so delegate scoped, self-contained leaf tasks to subagents via `clink-subagents` by default. Two rules that do not relax:

- **Verify everything a subagent returns.** A report is a hypothesis until checked against the artifact it claims.
- **Never delegate the final verification** or a security-boundary change.

`clink-masteragent` is **not wired** (the question was never asked; the default is recorded here rather than left implied).

## Dev notification

No repo notify script exists yet — use the built-in push tool. Notify on: a long task or TDD cycle complete, needing a decision (before closing issues / merging), or a batch done. Not routine sub-progress.

## Commands

| Command | What |
|---|---|
| `bun dev` | dev server |
| `bun run build` | production build |
| `bun start` | serve the production build |
| `bun run lint` | eslint |
| `bun run typecheck` | tsc --noEmit |
| `bun run verify` | lint + typecheck + build — the fast ship-gate command |

Tools are **not on PATH** — use the absolute paths:

- `bun` → `~/.bun/bin/bun.exe` (bun 1.3.14)
- `gh` → `C:\Program Files\GitHub CLI\gh.exe` (authenticated as `xenodeve`)

## Memory & records

- Open work: `docs/OPEN-WORK-LEDGER.md` (read at session start; update on finish / discover).
- Ship log: `DONE.md` (append after each shipped unit, newest on top).
- Team memory vault: `Obsidian-Agentic-Framework/` (`Home.md` index).
- ADRs: `docs/adr/` · approved plans / specs: `docs/superpowers/{specs,plans}/`
- Content sources (analyses, briefs, origin stories): `docs/`.

## Writing conventions

- **Chat and reports are Thai; code, commits, and identifiers are English.** English terms the developer uses (`merge`, `issue`, `test`, `skill`, `stack`) stay English byte-exact.
- **Tracker bodies (issues, PRDs, PRs) are bilingual:** English conventional-commit-style title + English body + a `## สรุปภาษาไทย` section that mirrors every English section at the same depth. See `docs/agents/issue-tracker.md`.

## Workflow gates

- PRD → issues → PR. Never open a PR without a referenced issue.
- TDD is mandatory for features and bugfixes.
- Every frontend change is verified end-to-end — unit tests can't see real layout or hydration: `bun run build`, serve, and check each touched route.

## Session end

Report each rule that did not hold as a `skill-feedback` issue on `xenodeve/xeno-skills` — `gh issue list --repo xenodeve/xeno-skills --state all --search "..."` first, comment on an existing issue rather than opening a second, and pass `--repo` on every call. See `t4-agent-memory`.

## docs/agents

- `docs/agents/workflow.md` — the pipeline, gates, and auto-triggered skills
- `docs/agents/issue-tracker.md` — the GitHub tracker and its conventions
- `docs/agents/triage-labels.md` — the label vocabulary
- `docs/agents/domain.md` — what the words mean in this repo
