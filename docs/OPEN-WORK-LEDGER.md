# Open Work Ledger

> Consolidated single source for what is open: tracked (GitHub issue) **and** untracked (this file only). GitHub issues stay the source of truth for *what to do*; the ledger is the discovery index that also catches work with no issue. Reconcile both directions: every 🔴 row becomes an issue; a closed issue leaves its row until the next session prunes it.

**Legend:** ✅ done, awaiting merge · 🟢 buildable now · 🟡 gated (on another item) · 🔴 **UNTRACKED** (no GitHub issue — highest miss risk)

---

## Content

| Item | Status | Gate | Next action |
|---|---|---|---|
| IA + content design spec — `docs/superpowers/specs/2026-09-02-site-ia-storytelling-design.md` | 🟡 | `status: draft` (developer: requirements not final) | developer approves the spec, then restructure routes per §2 |
| xeno-skills hub page (`/` single-scroll storytelling, `/?skill=<slug>` origin-story popups) | 🔴 | spec approval | distill from `docs/xeno-skills-present-blog-brief.md` (855 lines) + `xeno-skills-origin-stories.md` |
| `/ecosystem/openclink` + `/ecosystem/clone-space` deep pages | 🔴 | spec approval | distill from `docs/openclink-{analysis,present-blog-brief}.md` + `docs/clone-space-{analysis,present-blog-brief}.md` |
| `/ecosystem` index removal (hub-and-spoke replaces it) | 🔴 | spec approval | the scaffold currently has the index page the spec cuts |
| Codex code review (xeno-skills) | 🔴 | review not finished | when it lands in `docs/`, fold into the hub page evidence section |

## Site

| Item | Status | Gate | Next action |
|---|---|---|---|
| motion pass (staggered reveals, `prefers-reduced-motion`) + dev Tweaks Bar | 🔴 | design-setup phases 3/7 skipped in scaffold | decide when content is real |
| e2e runner (playwright) + `t4-e2e.yml` | 🔴 | no test runner yet | `t4-verify.yml` ships without a `test` job until one exists |

---

**Management plan.** Phase 0 — the spec is the multiplier: route restructure, the hub page, and the two deep pages are all cheap once it is approved; the content sources already exist in `docs/`. Phase 1 — file GitHub issues for the 🔴 rows above.
