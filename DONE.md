# DONE — agent ship log

> Newest entry on top. One dated `##` heading per shipped unit. Archive to `DONE-archive-<period>.md` when this passes a few hundred lines.

---

## 2026-09-03 — visual direction approved; batch A shipped (branch `docs/12-visual-direction`, issue #12)

**Goal:** record the developer's approval (2026-09-03) of the direction explored at `docs/mock/visible-grid/index.html` and ship its artifacts so spec §6 stops gating visual work.

**Shipped:**
- spec §6 rewrite marked `approved` (Editorial Minimalism × Modern Swiss × Liquid Glass; ultramarine accent; Archivo + Bai Jamjuree, TH-primary with EN toggle; light/dark; Visible Grid cut for this round)
- `CLAUDE.md` — the "pending final developer sign-off" sentence → approved; batch A is no longer gated
- `docs/mock/` committed — `visible-grid/index.html` (the explored artifact) + older `Fable 5.1/`, `Luna/` mocks as reference
- ledger: the visual-direction row reconciled to ✅ (follow-up = implement the direction on the site)
- **Excluded:** untracked `DESIGN.md` left out on purpose — it describes a different project ("T4 Labs"), contradicts the approved direction (Visible Grid as signature, orange accent `#E8461B`), and its references (`../Requirement.MD`, `docs/design/expensive-minimalism.md`) are dead in this repo; it stays untracked for a developer decision

**Validation:** docs-only diff — `bun run verify` green on the branch (re-run for the gate ledger).

---

## 2026-09-02 — repo live on GitHub + CI billing-lock recorded (branch `main`, commits `8f54c07` → `29bdb8a`)

**Goal:** ship the local scaffold to GitHub with the T4 enforcement tiers live, and record the account-level ceiling honestly.

**Shipped:**
- repo `xenodeve/Agentic-Framework` (GitHub normalised the space in `Agentic Framework` to a hyphen) — `main` pushed, remote bound
- 24 triage/type/component/lifecycle labels created (22 created; `wontfix` + `Bug` already existed as GitHub defaults)
- issue #1 (bootstrap, closed with the closing-reason comment) + issue #2 (CI restoration, open, `ready-for-human`)
- `core.hooksPath .githooks` bound — the three guards ran live on every push (issue-ref, gate-ledger, tree-budget all exercised)
- `workflow_dispatch` added to `t4-verify.yml` so the gate can be re-armed without a new commit

**The ceiling (recorded, not hidden):** the account is **billing-locked** — every Actions run is a 0s `startup_failure`. Per the T4 `ci-cd-layer` "cannot run at all" protocol: `requireGreenCI: false` in `.claude/t4.json` (with no checks at all, `true` would deny every merge forever), `pre-push` no longer claims a CI backstop, `CLAUDE.md` + the ledger state that a merged PR here means "the author ran `bun run verify`". Rulesets and classic branch protection are **Pro-only** (both 403); the `security-and-analysis` endpoint is 404 (secret scanning + push protection not configurable from this account). What landed: `automated-security-fixes` enabled, `vulnerability-alerts` PUT accepted. A human merging on the web is bound by **nothing** server-side on this account — the local tiers are the entire gate.

**Validation:** `bun run verify` green (lint + typecheck + build, SSG all routes). Fresh production serve + curl: `/`, `/ecosystem`, `/ecosystem/{xeno-skills,openclink,clone-space}`, `/blog`, `/blog/the-agentic-framework` → 200 with rendered content markers; unknown slug + unknown route → 404.

---

## 2026-09-02 — site scaffold + T4 operating layer (branch `main`, repo not yet pushed)

**Goal:** stand up the presentation + blog site for the Agentic Framework ecosystem with the T4 operating standard, ready for content that is still being distilled (sources in `docs/` exist; the IA spec is `draft`).

**Shipped:**
- Next.js 16.3.4 (App Router, Turbopack) + React 19 + TypeScript + Tailwind 4, Bun (`bun.lock`)
- content pipeline: `content/ecosystem/*.md` + `content/blog/*.md` (gray-matter, react-markdown, remark-gfm), SSG via `generateStaticParams()` — single read boundary `src/lib/content.ts`
- routes: `/`, `/ecosystem`, `/ecosystem/[slug]`, `/blog`, `/blog/[slug]` — **scaffold IA; the draft spec (`docs/superpowers/specs/2026-09-02-site-ia-storytelling-design.md`) restructures this to hub-and-spoke single-scroll, not yet applied**
- design baseline: Editorial Minimalism × Modern Swiss × Liquid Glass × Visible Grid (dark zinc scale, single lime accent, Major Third type scale, 8pt grid, glass sticky header, hairline ledger grids) — tokens in `src/app/globals.css`
- T4 operating layer: `CLAUDE.md`, `docs/agents/*` (bilingual EN/TH), memory (`docs/OPEN-WORK-LEDGER.md`, `DONE.md`, `Obsidian-Agentic-Framework/`), `docs/adr/`, `.claude/` hooks + `t4.json` + `settings.json`, `.github/workflows/t4-verify.yml`, `.githooks/` guards

**Validation:** `bun run verify` (lint + typecheck + build) green (2026-09-02). Production server (`bun start`, port 3000) + curl: `/`, `/ecosystem`, all three item pages, `/blog`, the post page → 200; unknown slug → 404; style markers present in HTML (backdrop-blur header, `divide-` hairlines, numbered indices). All routes static (SSG).

**Not shipped (by instruction — setup only, requirements not final):** content deep-dives, the spec's IA restructure, the motion pass. See `docs/OPEN-WORK-LEDGER.md`.
