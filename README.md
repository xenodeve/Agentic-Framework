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
```

## Layout

- `content/` — site content, Markdown with frontmatter
  - `content/ecosystem/*.md` — one file per project, slug = filename
  - `content/blog/*.md` — posts, sorted by `date`
- `docs/` — T4 operating layer (`agents/`, `adr/`, `OPEN-WORK-LEDGER.md`, `DONE.md`)
- `src/` — Next.js app (`app/` routes, `components/`, `lib/`)

## Content conventions

- **Ecosystem frontmatter:** `title`, `description`, `repo`, `status`, `tags`
- **Blog frontmatter:** `title`, `description`, `date` (YYYY-MM-DD), `tags`
- Presentation pages are English (public audience); blog posts are written in
  the author's language.
