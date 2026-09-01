---
name: site-scope
description: site scope (hub-and-spoke: xeno-skills is the hub), IA spec is draft, content sources in docs/
type: project
---

The Agentic Framework site is **hub-and-spoke**: **xeno-skills** is the core ("the framework"); **openclink** (the MCP transport the `clink-*` skills use for multi-agent orchestration) and **clone space** (machine-readable web archives the design-family skills use as reference) are the spokes. Positioning recorded as ตกลงกันแล้ว in the spec.

**The IA spec is DRAFT** — `docs/superpowers/specs/2026-09-02-site-ia-storytelling-design.md` (`status: draft`, 2026-09-02): single-scroll storytelling `/` with hash anchors + `/?skill=<slug>` origin-story popups; `/ecosystem/openclink` + `/ecosystem/clone-space` deep pages; the `/ecosystem` index page cut. Developer instruction (2026-09-02): **do not start content/feature work until the requirements are final** — the scaffold's IA (`/ecosystem` index + three equal items) is a placeholder the spec supersedes.

**Why:** content sources already exist in `docs/` (per-project `*-analysis.md` + `*-present-blog-brief.md`, `xeno-skills-origin-stories.md`, the Codex code review pending); building against the draft spec means rebuilding when it lands.
**How to apply:** no content deep-dives or route restructure until the spec is approved; keep scaffold stubs marked as stubs.

Design blend (developer choice, 2026-09-02): **Editorial Minimalism × Modern Swiss × Liquid Glass × Visible Grid** — dark zinc scale + single lime accent, Major Third type scale, 8pt grid, glass sticky header, hairline ledger grids. Tokens: `src/app/globals.css`.
