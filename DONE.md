# DONE — agent ship log

> Newest entry on top. One dated `##` heading per shipped unit. Archive to `DONE-archive-<period>.md` when this passes a few hundred lines.

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
