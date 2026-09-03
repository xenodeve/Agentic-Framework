# DESIGN.md — Agentic Framework site

The visual system for this site. Register: **presentation** — the site presents the
agent-first ecosystem (**xeno-skills** hub, **openclink**, **Clone Space**); the design carries
positioning, not a product surface of its own. Concept: **Editorial Minimalism × Modern Swiss ×
Liquid Glass**.

The approved direction is spec §6 — `docs/superpowers/specs/2026-09-02-site-ia-storytelling-design.md`
(**approved 2026-09-03**, developer sign-off). This file is the design-tokens summary of that
decision; **where the two disagree, spec §6 wins.** Explored artifact:
`docs/mock/visible-grid/index.html` (directory name is a known misnomer). Superseded mocks kept as
reference: `docs/mock/Fable 5.1/index.html`, `docs/mock/Luna/index.html`.

**Visible Grid is cut for this round** — no column rails, no `01–12` rulers, no registration
marks, no GRID button / key `G`. Revisit after the direction is implemented (spec §6).

## Design Summary

Warm paper canvas, near-black ink, **one** ultramarine accent used sparingly. The design is carried
by high-contrast **grotesque display + mono label** typography, generous negative space, and exact
Swiss alignment. **Elevation is by hairline + whitespace, never drop-shadow.** **Liquid Glass**
appears only as *floating tool layers over the paper* — sticky nav, the origin-story popup, one
pinned card — never a section background, never glass-on-glass, never blob/orb/3D. Recreate:
precise, quiet, engineered; text-first; dissent and limitations stated plainly instead of imagery
claiming everything is perfect.

## Design Tokens

### Colors (two themes — default follows `prefers-color-scheme`, toggle persists)

| Role | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#f3f2ec` | `#0d0d10` | canvas (warm off-white, not pure white) |
| `--ink` | `#131310` | `#eceada` | primary text, hairlines |
| `--muted` | — value set during implementation | — | secondary body, captions |
| `--faint` | **must equal `--muted`** | — | measured (spec §6): `#74726b` = 4.29 on this paper fails AA — there is no AA band between the two hues, so faint takes muted's value |
| `--line` | `rgba(19,19,16,.10)` soft `.06–.08` | dark-scheme equivalent | hairlines, borders, table rules |
| `--accent` | `#2233c9` | `#8f9bff` | **single accent** — measured contrast: all small text ≥ 4.5:1 except the `--faint` note above |
| glass tint | `rgba(243,242,236,.6)` + `backdrop-filter: blur(≈22px) saturate(170%)` | dark equivalent + same recipe | **floating layers only**, with a readable fallback when `backdrop-filter` is unsupported |

Hierarchy by **value/opacity** (ink 100 / 70 / 45%), never a second hue. Small text ≥ 4.5:1 —
measured values are recorded in spec §6.

### Typography

- **Display / heading** — **Archivo** (Latin), `clamp`-scaled large, width axis narrowed for
  headlines only; big display jumps hard from small body — that contrast IS the Swiss look.
- **Body** — **Bai Jamjuree** (Thai) + Archivo (Latin), 15–16px, line-height 1.6; display
  line-height raised for stacked Thai diacritics.
- **Labels / annotations** — **JetBrains Mono**, 12px UPPERCASE, letter-spacing .14–.2em — slugs,
  `src` lines, tags, `01/02` indices. **Mono annotations are always English** — read as code,
  never prose (identifiers / commands / skill slugs stay byte-exact English under the i18n policy).

Type scale: **Major Third 1.25 from 16px**, hero title the single display exception; spacing on an
**8pt** grid. *Note:* the committed font stack is groundwork (Space Grotesk + Anuphan +
JetBrains Mono, `src/app/layout.tsx`) — final Archivo + Bai Jamjuree landing happens in the open
visual-implementation follow-up, not yet applied to the site.

## Components (what this site actually has)

- **Sticky nav (Liquid Glass)** — frosted `blur(≈22px) saturate(170%)`; **TH|EN toggle** with
  `aria-pressed` (`af-lang` persisted, `<html lang>` synced — SSG HTML ships `lang="th"` so Thai
  works without JS); theme toggle.
- **Hero** — xeno-skills takes the visual mass; openclink / Clone Space appear as a smaller
  “Powered by” line (spec §9.1), not three equal names.
- **Section hairlines** — full-bleed 1px rules at macro boundaries + mono numbered indices.
- **Skill catalog** — **generated** from `xeno-skills` SKILL.md frontmatter at build time
  (`scripts/generate-skills.ts` → `content/skills.generated.json`; never a hardcoded count);
  hover = short summary, click or `?skill=<slug>` opens the origin story.
- **Origin-story popup (Liquid Glass)** — **SSR'd into the HTML from the start** (no fetch-on-click,
  so search engines see it), deep-linkable via query param; problem → attempt → effectiveness
  (+ source/date) per the content model.
- **Ecosystem / built-on cards** — one card may take the glass moment; **no three-column SaaS
  card grid**.
- **Evidence / metric blocks** — every metric carries **date + source + limitation** (content model
  §5 / spec §7); no unsourced claims, numbers stated with their limits.
- **Buttons** — primary = ink fill + paper text; secondary = paper + 1px `--line`; ghost = text +
  `→`. Every button has default / hover / active (+ disabled when used) states. Accent is never a
  button fill (keep it scarce).

## Motion

Quiet scroll reveals + hover lift only, 150–300ms ease-out; no bounce; focus = 2px offset ring;
**`prefers-reduced-motion` → instant.** The full motion pass is open work (ledger) — this doc pins
the direction, not the implementation.

## Content Style

Text-first. Direct, short, warm. **Thai is the primary language** with a TH|EN toggle (spec §6);
identifiers / commands / skill slugs and mono annotations stay English byte-exact. No hype, no
filler, no stock imagery, **no AI purple/blue gradients**; whitespace conveys confidence; limits
and dissent are stated plainly (spec §7: the openclink deep-scan finding stays leading, Clone
Space's “anti-AI-slop” framing is attributed to the project owner, T4-Compact is labelled
experimental).

## Provenance

- **Source:** approved spec §6 (2026-09-03 developer sign-off) + explored mock
  `docs/mock/visible-grid/index.html`
- **Superseded and retired** (recorded, not enforced): the “Swiss Signal” direction — Swiss red
  accent `#e63312`, dark hero band, red column rulers, Visible Grid machinery, sticky left index
  (“Quiet Ledger”). Single record of the retirement: spec §6.
