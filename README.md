# Agentic Framework

Website for presenting and blogging the T4 team's agent-first development
ecosystem — xeno-skills, openclink, clone space.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4
· Bun (package manager; `bun.lock` committed).

## Commands

```bash
bun dev        # dev server
bun run build  # production build
bun start      # serve the production build
bun run lint   # eslint
bun run typecheck  # tsc --noEmit
bun run verify # lint + typecheck + build — the fast ship-gate command
```

## Layout

- `content/` — site content, Markdown with frontmatter
  - `content/ecosystem/*.md` — one file per project, slug = filename
  - `content/blog/*.md` — posts, sorted by `date`
- `docs/` — T4 operating layer (`agents/`, `adr/`, `superpowers/` specs) + content sources (analyses, briefs, origin stories)
- `Obsidian-Agentic-Framework/` — team memory vault (`Home.md` index)
- `DONE.md` — ship log · `docs/OPEN-WORK-LEDGER.md` — open work, tracked and untracked
- `src/` — Next.js app (`app/` routes, `components/`, `lib/`)
- `.claude/` — T4 hooks + `t4.json` · `.githooks/` — push guards · `.github/workflows/` — CI

## Content conventions

- **Ecosystem frontmatter:** `title`, `description`, `repo`, `status`, `tags`
- **Blog frontmatter:** `title`, `description`, `date` (YYYY-MM-DD), `tags`
- Presentation pages are English (public audience); blog posts are written in
  the author's language.
