# ADR 0001 — static content pipeline (Next.js SSG + `content/*.md`)

- **Status:** Accepted (2026-09-02) — implemented
- **Area:** Frontend
- **Related:** none yet

## Context

The site presents and blogs a growing ecosystem (xeno-skills, openclink, clone space). Content is authored in Markdown from source analyses in `docs/`. There is no account system and no dynamic data.

## Decision

- **Next.js 16 (App Router) with `generateStaticParams()`** — every route is built at build time. `src/lib/content.ts` reads `content/**/*.md` (gray-matter frontmatter) and feeds the pages.
- **A `content/` file is a page.** Adding `content/ecosystem/<slug>.md` produces `/ecosystem/<slug>` with no code change; `getPost` / `getEcosystemItem` in `src/lib/content.ts` are the single read boundary.
- **No database, no build-time network dependency.** Content ships in the build; the deployable is a static artifact.

## Alternatives considered

- **MDX inside `src/app`.** Rejected — content mixed with code would couple the authoring surface to the build; Markdown under `content/` can be written without touching `src/`.
- **A headless CMS.** Rejected — nothing is served dynamically today; a database would add an operational surface the site does not need.

## Consequences

- **Positive:** authoring is file-based; SSG output is trivially hostable; a missing slug is a build-time `notFound()`, not a runtime surprise.
- **Negative / limits:** content changes require a rebuild (acceptable — there is no runtime content); frontmatter schemas live in `src/lib/content.ts` and must be read there when a field is added.
- **Follow-ups:** the draft IA spec (`docs/superpowers/specs/2026-09-02-site-ia-storytelling-design.md`) keeps content Markdown-driven and adds client-side `/?skill=<slug>` popups on the static `/` — compatible with SSG; no pipeline change expected.
