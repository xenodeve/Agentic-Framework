# Agentic Framework

Website that presents and blogs the team's agent-first ecosystem — **xeno-skills** (the hub), **openclink**, **clone space** — and the operating standard they run on. `README.md` is the human-facing overview; this file is the agent's operating manual.

> The **IA spec is approved** (`docs/superpowers/specs/2026-09-02-site-ia-storytelling-design.md`, `status: approved`, developer directive 2026-09-02) and the redesign is implemented in the working tree (hub single-scroll, 13 sections; `/ecosystem` → 308 `/#built-on`; generated skill catalog). **Spec §6 was rewritten 2026-09-03** to the explored direction (`docs/mock/visible-grid/index.html` — Editorial × Swiss × Liquid Glass, TH-primary + EN toggle, dark/light, Visible Grid cut for this round) and was **approved by the developer 2026-09-03** (batch A shipped in issue #12): the visual system may now be built on that direction; implementing it on the site is open follow-up work (see the ledger).

## Engineering north star

The coding agent is the primary developer of this repo. Docs are the agent's operating manual, not team paperwork. Content is Markdown-driven (`content/*.md`); pages are static (SSG). Do not add a database or a build-time network dependency.

## Session start (in this order; stop pulling detail once you have enough)

1. `karpathy-guidelines` — load once so every edit this session is surgical.
2. `docs/OPEN-WORK-LEDGER.md` — what is open, tracked and untracked.
3. `Obsidian-Agentic-Framework/Home.md` — team memory index; open only the notes the task touches.
4. Route the task through `using-t4` (below).
5. For code work — load Serena's symbol tools first and prefer them over Read/Grep for navigation (see **Serena** below).

## Routing — `using-t4` is a standing default

`using-t4` is not a pointer to read once: it is a **re-routing obligation at every phase boundary** — wrote code → `simplify`; before merge → `code-review` + `scrutinize`; touched auth/secret → `security-review`; done → `verify`. **A check at task start does not discharge a later trigger.** A parent skill does not discharge its leaves.

## Delegation — `clink-subagents` is the default

In an agent-primary repo the orchestrator's context window is the scarce resource, so delegate scoped, self-contained leaf tasks to subagents via `clink-subagents` by default. Two rules that do not relax:

- **Verify everything a subagent returns.** A report is a hypothesis until checked against the artifact it claims.
- **Never delegate the final verification** or a security-boundary change.

`clink-masteragent` is **not wired** (the question was never asked; the default is recorded here rather than left implied).

## Serena — code intelligence (wired)

Wired via `.mcp.json` (stdio, `ide-assistant` context, this repo, TypeScript). Serena exposes LSP symbol tools that navigate code **token-cheaper than Read/Grep** — confirmed working in this repo. For any code task, load them before reaching for built-in Read/Grep on code files.

**Structure-first, drill down (not slurp):**
1. `get_symbols_overview <file>` — what's in a file without reading it
2. `find_symbol` (`include_body=False`) — locate + depth before committing
3. body read (`include_body=True`) — only the symbols you actually touch
4. `find_referencing_symbols` — cross-file usage with code context, instead of grep-then-open
5. `get_diagnostics_for_file` — errors/warnings per file

**Prefer Serena over built-ins for code files:** overview/find before Read; `replace_symbol_body` / `rename_symbol` / `insert_*_symbol` / `replace_content` before Edit. Plain `Read`/`Edit` stays fine when the task is small enough that a symbol walk costs more than it saves.

**Caveats (verified in this repo):**
- Serena line numbers are **0-based**; built-in Read is **1-based** — convert when cross-referencing.
- `find_referencing_symbols`: pass `relative_path` to scope to one file (fast); omit it to scan the whole repo (slower).
- Small files / quick lookups: a direct `Read` can be faster than a 3-step symbol walk.
- Serena's memory store is empty (`list_memories` → `{}`); run its `onboarding` once if you want repo-specific memories recalled in future sessions.

## Other wired MCP servers (task-triggered)

The other four are **not session-start defaults** — reach for them on their trigger, not every turn. *(Only **serena** was runtime-verified this session; the rest describe the configured purpose from `.mcp.json` + tool schemas, not a tested result.)*

- **pal** — second-model analysis via `openclink` → `gateway.9arm.co` (default model `qwen3.6-35b-a3b`). Multi-step layer: `analyze`, `debug`, `codereview`, `secaudit`, `refactor`, `testgen`, `docgen`, `planner`, `thinkdeep`, plus `consensus` (multi-model) and `clink` (bridge to external CLIs: claude/gemini/codex/cursor/opencode). Uses a `step/step_number/total_steps` protocol + `continuation_id` for multi-turn. *Reach for:* an independent second opinion, cross-model consensus, or a scoped review you don't want running through your own context.
- **playwright** — real-browser automation via `@playwright/mcp` (`navigate/click/type/fill/snapshot/screenshot/console_messages/network_requests/evaluate/tabs/wait`). *Reach for:* the repo's **mandatory E2E frontend gate** (`bun run build` → serve → check each touched route) and anything unit tests can't see (layout, hydration, interaction).
- **headroom** — context-window compression: `compress` (returns a hash) / `retrieve` (by hash) / `stats`. *Reach for:* shrinking a large tool output or file before reasoning, retrieving it later by hash.
- **reactbits** — prebuilt React component library: `list_categories` / `list_components` / `search_components` / `get_component` (+ demo). *Reach for:* pulling a ready component instead of writing one from scratch.

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

### CI status (2026-09-02): down — account billing-locked

`bun run verify` is the **only** gate that actually runs; `t4-verify.yml` exists and is correct but every run comes back `startup_failure` (0s, no log) because the account is billing-locked. Consequences, recorded so a later agent does not re-derive them:

- **A merged PR here means "the author ran `bun run verify`", not "CI passed"** — nothing about the merge distinguishes the two.
- `.claude/t4.json` has `requireGreenCI: false` on purpose — with CI absent, `gh pr checks` is non-zero and `true` would deny every merge forever.
- `pre-push` says what is really behind it now (no CI backstop). A human pushing `--no-verify` from another clone, or merging on the web, is bound by **nothing** — that gap is exactly what required checks will close once billing is restored.
- Restoration is tracked in the open-work ledger; when billing is back: re-trigger `t4-verify.yml`, create the ruleset, flip `requireGreenCI: true`.

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
