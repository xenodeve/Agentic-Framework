# Open Work Ledger

> Consolidated single source for what is open: tracked (GitHub issue) **and** untracked (this file only). GitHub issues stay the source of truth for *what to do*; the ledger is the discovery index that also catches work with no issue. Reconcile both directions: every 🔴 row becomes an issue; a closed issue leaves its row until the next session prunes it.

**Legend:** ✅ done, awaiting merge · 🟢 buildable now · 🟡 gated (on another item) · 🔴 **UNTRACKED** (no GitHub issue — highest miss risk)

---

## Content

| Item | Status | Gate | Next action |
|---|---|---|---|
| IA + content design spec — `docs/superpowers/specs/2026-09-02-site-ia-storytelling-design.md` | ✅ | **approved 2026-09-02** (developer directive) | implemented in the redesign issues below |
| xeno-skills hub page (`/` single-scroll storytelling, `/?skill=<slug>` origin-story popups) | 🟢 | spec approved | distill from `docs/xeno-skills-present-blog-brief.md` (855 lines) + `xeno-skills-origin-stories.md` |
| `/ecosystem/openclink` + `/ecosystem/clone-space` deep pages | 🟢 | spec approved | distill from `docs/openclink-{analysis,present-blog-brief}.md` + `docs/clone-space-{analysis,present-blog-brief}.md` |
| `/ecosystem` index → 308 `/#built-on` (spec §9.4) | 🟢 | spec approved | the scaffold's index page is replaced by the redirect |
| Codex code review (xeno-skills) | 🔴 | review not finished | when it lands in `docs/`, fold into the hub page evidence section |
| hero hierarchy vs spec §9.1 — xeno-skills takes visual mass + smaller “Powered by”; current hero label puts all three names equal (`page.tsx:65`) | 🟢 | — | adjust hero label split; decision folded into the direction sign-off batch |

## Site

| Item | Status | Gate | Next action |
|---|---|---|---|
| **Visual direction — approved 2026-09-03** (`docs/mock/visible-grid/index.html` — Editorial × Swiss × Liquid Glass; TH-primary + EN toggle + dark/light, Visible Grid cut for this round) | ✅ | developer sign-off 2026-09-03 | shipped in #12 (spec §6 rewritten + approved, mock committed as reference) · **open follow-up: implement the direction on the site** (separate issue when scoped; hero label split from the content row rides along) |
| **CI down — account billing-locked** (`t4-verify.yml` runs come back `startup_failure`, 0s, no log) | 🟡 | developer restores account billing | every run is `startup_failure` · compensations in force: `requireGreenCI: false` in `.claude/t4.json` (true would deny every merge forever), `pre-push` message corrected (no CI backstop behind it), a merged PR means **"the author ran `bun run verify`"** not "CI passed" · when billing is restored: re-trigger `t4-verify.yml`, create the ruleset (required checks `lint`/`typecheck`/`build`/`guards`, block direct pushes to `main`, require PR), flip `requireGreenCI: true` · **a human merging on the web is not bound by any of this — say so, don't pretend** |
| **Server-side protection unavailable on this account** (rulesets AND classic branch protection both 403 "Upgrade to GitHub Pro"; `security-and-analysis` endpoint 404; what landed: `automated-security-fixes` enabled, `vulnerability-alerts` PUT accepted but state not GET-able, secret scanning **not configured — endpoint absent**) | 🟡 | account upgrade to Pro (or make the repo public) | the ceiling: with no ruleset and no branch protection, **nothing server-side binds a human on this account** — the local tiers (hooks, guards, `verify` gate) are the entire gate · tracked with #2 (CI restoration) |
| motion pass (staggered reveals, `prefers-reduced-motion`) + dev Tweaks Bar | 🔴 | design-setup phases 3/7 skipped in scaffold — **content is now real (13-section hub + generated catalog), gate unblocked** | decide |
| e2e runner (playwright) + `t4-e2e.yml` | 🔴 | no test runner yet | `t4-verify.yml` ships without a `test` job until one exists |
| OG title / description / image on the site (spec §6 micro-rules) — verified absent from `src/app` 2026-09-03 | 🟢 | pre-deploy | add `og:*` + twitter card meta to `layout.tsx` + an OG image |

---

**Management plan.** Phase 0 — the spec is the multiplier: route restructure, the hub page, and the two deep pages are all cheap once it is approved; the content sources already exist in `docs/`. Phase 1 — file GitHub issues for the 🔴 rows above.
