---
title: "Clone Space"
description: "Archives a live web page so it replays offline with the motion intact — and an AI agent can read how it is built."
repo: "xenodeve/clone-space-mcp"
status: "alpha"
tags: [mcp, web-archival]
---

## What Clone Space is

Clone Space (`xenodeve/clone-space-mcp`) is an MCP server that archives a real
internet page so it replays offline with the motion still working — the
carousel still slides, GSAP timelines still run, ScrollTriggers still fire —
and then says **which line of code** drives each movement
(`README.md:1-9`, snapshot commit `205a616c`, 2026-08-17).

The load-bearing decision is how replay works: it opens the **original URL**
and serves the **original document HTML** from the capture's HAR via
`routeFromHAR(har, { notFound: 'abort' })`, so the page's **real JavaScript
runs again** — not a mock, not a synthetic replay, and not a serialized
hydrated DOM. Serialize-to-standalone is exactly the approach the project
rejects: it destroys the hydration and entry animations it exists to keep
(`README.md:11-14`).

On this site Clone Space is **not a standalone product**. It is a tool the
xeno-skills design family (`design-setup`, `design-rules`,
`design-psychology`, `design-audit`, `using-design`) calls when an
agent needs to ground a frontend design in a real website: `capture_page` a
site with the motion it wants → `replay_page` to confirm the motion actually
runs → `extract_behaviour` to see the real mechanism (timing, easing,
library, trigger, and the `file:line` that drives it) instead of guessing
from a screenshot or from the model's memory of patterns. Positioning line:
*Clone Space lets an agent read how a real website actually moves — before it
designs the next one.*

The "anti-AI-slop design research tool" label attached to it in this
ecosystem is the **project owner's (the developer's) framing, stated for this
website's present and blog content — it is not a term the Clone Space repo
declares about itself**. The repo's own north-star is written in more neutral
language: replay offline with real fidelity, and an AI agent can consume the
archive and explain how the page is built (`CLAUDE.md:20-24`). The framing is
used on this site as the team's positioning statement and is nowhere presented
as a repo claim.

Status: **Alpha, and honest about it. All four stages run end to end**
(`README.md:322`, commit `205a616c`, 2026-08-17). The open limits are
recorded in detail rather than hidden — see the "Known limitations" section.

## Origin story

### The real problem

Four concrete problems, as recorded in `docs/clone-space-analysis.md` §2:

1. **Dead skeleton.** Ordinary archiving (wget, save-as, DOM snapshot) keeps
   the markup but the behaviour dies — there is no JavaScript context left to
   keep it alive.
2. **Runtime-only artifacts.** GSAP timelines and WebGL shaders assembled from
   strings at runtime do not exist in **any file** an archive could hold. You
   have to **run the real page** to see them (`README.md:98-104`).
3. **Minified positions are meaningless.** The runtime reports positions like
   `three.module.min.js:12:326662` — line 12 of a file with a dozen lines.
   Without sourcemap resolution, it means nothing.
4. **"Looks right" is not "measured equal".** A clone that looks the same can
   behave differently from the original, and nobody would know without a
   mechanism that compares live and replay for real.

### What was attempted

An MCP server with four stages — capture → replay → extract → serve — plus a
fifth role, the equivalence gate. The first structural decision came from a
measurement, not a preference: a 2026-07-30 spike found the Playwright client
does not work under Bun (raw CDP over websocket works in 99 ms, but
`chromium.launch` times out at 30 s), while Node runs it in 68 ms — so
**Node drives the browser, Bun runs everything else** (ADR 0001, 2026-07-30).
The capture's observation hooks are installed at the **browser API layer**
(e.g. `WebGLRenderingContext.prototype.shaderSource`), not at any particular
animation library, because everything ends up going through the WebGL API —
so shaders are caught even when `THREE` is an ES module and not a global
(`README.md:92-99`).

Timeline (dates and sources from `docs/clone-space-analysis.md` §5):

| Date | Event |
|---|---|
| 2026-07-30 | CDP spike answers Q1–Q3; Playwright unusable under Bun → runtime split (ADR 0001) |
| 2026-07-31 | Element identity (`wa:` id + fingerprint reconciler) merged — fixture 63/63 matched, 0 unresolved (ADR 0002) |
| 2026-08-01 | Credential redaction before publish (ADR 0003); environment evidence separated from replay config (ADR 0004) |
| 2026-08-03 | Checkpoint coherence (ADR 0005); mutation + regression corpus starts with 7 entries (#53) |
| 2026-08-04 | Capability flags (ADR 0006); metamorphic check begins — first numbers retracted immediately |
| 2026-08-05 | Gates that had been skipped (`/code-review`, `/scrutinize`) run retroactively and find 5 real defects in code already merged and past every automated gate |
| 2026-08-09 | Request normalization (ADR 0007) ships end-to-end |
| 2026-08-14 | Target-discovery ordering (ADR 0008); response bodies declared **not redactable** (ADR 0009) |
| 2026-08-16 | Private-address refusal (#162); WebSocket gap scoped (#185); `t4-verify` self-attested check armed |
| 2026-08-17 | Equivalence gate becomes a real command (`bun run equivalence`, #171 criterion 5); three real verdicts recorded |

### Effectiveness

- All four stages run end-to-end (`README.md:322` at commit `205a616c`,
  2026-08-17).
- The equivalence gate's first real runs (2026-08-17) reproduced an open bug
  (#182, `layout.scrollHeight` race) within the first hour the command
  existed — a failure manual QA would never have surfaced
  (`docs/reports/2026-08-17-equivalence-verdicts.md`).
- The mutation corpus — which re-applies defects that actually happened and
  requires the named test to go red — grew from its first 7 entries (#53,
  2026-08-03) to 153 (README, read 2026-09-02).

## How it works — capture and replay

```text
live URL
  ↓
capture_page (Node/Playwright, src/capture/)
  adaptive sweep (budget: wall-clock / bytes / nodes / height / events)
  + bounded interaction (refuses cross-origin / download / nav / form /
    auth-looking controls)
  + observation hooks at the browser API layer (before any page script runs)
  + wa: id injection (preorder + MutationObserver)
  ↓
private staging dir (ADR 0003)
  ↓
redact credentials / cookies / tokens → [REDACTED]
(response bodies stay — ADR 0009)
  ↓
fail-closed validation (checkpoint coherence, run-scoped capabilities,
private-address refusal)
  ↓
commit.json written last (SHA-256 of every file)
  ↓
archive (chmod 0600: network.har · environment.json · capabilities.json ·
targets.json · transcript.json · checkpoints.json)
  ↓
replay_page (Node): routeFromHAR, original URL, the real JS runs again;
every request the archive cannot answer is aborted
  ↓
extract_behaviour: behaviour graph + sourcemap resolution (no extra fetches)
  ↓
serve: 4 MCP tools on stdio · inspect_archive (Bun, no agent needed)
```

**Capture** (`capture_page`, Node/Playwright) — what it captures:

- an adaptive sweep with budgets (wall-clock, bytes, nodes, page height,
  events), plus bounded interaction that refuses cross-origin, download,
  navigation, form, and auth-looking controls;
- observation hooks installed at the browser API layer **before any page
  script runs** — library-agnostic (e.g. `WebGLRenderingContext.prototype.shaderSource`);
- element identity: injected `wa:` ids (preorder + `MutationObserver`),
  matched across runs by a fingerprint reconciler (tag + stable-attribute
  subset + sibling ordinal + text hash + parent node). `wa:` ids are
  handles, not keys — they mean something only within one run;
- every network request/response attached as separate files (HAR, full mode);
- a target inventory (OOPIF, popup, worker, worklet) via
  `Target.setDiscoverTargets` after `page.goto` — targets that live and die
  during navigation itself are missed (known gap, ADR 0008).

What it does to the capture before it may exist as an archive:

- **Redaction**: credentials/cookies/tokens → `[REDACTED]` (ADR 0003).
  **Response bodies are not redacted and cannot be** (ADR 0009, 2026-08-14) —
  the replay needs them as raw material. Never point capture at a page behind
  login, an internal tool, or a page with sensitive data.
- **Fail-closed**: if validation fails, the archive is not published — there
  is no "soft success". Private staging directory; `commit.json` written
  last, carrying the SHA-256 of every file (ADR 0005, 0006).
- **Private-address refusal**: if any HAR entry answers from a private
  address (loopback, link-local, CGNAT), the **whole archive** is refused,
  not just the offending entry.

**Replay** (`replay_page`, Node) — what it replays:

- the **original URL with the original HTML**, served from the HAR; every
  request the archive does not answer is **aborted**
  (`notFound: 'abort'`) — the replay never falls back to the live network.
- the page's **real JavaScript runs again**: GSAP, ScrollTriggers, shaders.
- an optional `restoreTiming` (off by default): delays responses to match the
  real offsets from page-load start. Measured cost: `goto` 825 ms → 4,577 ms
  on one 146-entry site (`README.md:129-134`) — which is why it stays off.

**Extract** (`extract_behaviour`, runs on the replay):

- a behaviour graph: mechanism, target, timing, easing, library,
  ScrollTrigger detail.
- sourcemap resolution **without fetching anything extra**:
  `three.module.min.js:12:326662` → `three.module.js:18723:5`, with the real
  line (`gl.shaderSource(shader, string)`) — using only what the capture
  already pulled. If the sourcemap was not captured, it says so instead of
  fetching from the network: an offline archive must not secretly depend on
  the original site (`README.md:150-160`).
- `unrepresented`: what was observed but cannot be represented is reported as
  such (CSS transitions, for example) instead of silently dropped.

**Serve** — four MCP tools over stdio (thin MCP layer, pure tools, archive
reader), plus `inspect_archive` on Bun: a visual HTML report with no agent
involved. That, and `bun run equivalence <url>`, are the two ways to try it
yourself without building anything.

**Equivalence gate** (`bun run equivalence <url>`):

- drives the **live page and the replayed archive with the same driver, in
  one session**, collects the same set of digests from both sides, and
  reports `0` PASS · `1` FAIL (unexplained residual) · `2` INCOMPLETE
  (nothing proven equal yet) · `3` did not finish (`README.md:208-210`).
- Deliberate principles: coverage is a **vector, not a single score**;
  `unobserved` is never counted as `equal`; the live page is driven several
  times as a control, and a field that swings against itself is reported
  `unstable` rather than blamed on the clone; `--measure-perturbation` asks
  whether the instrumentation itself changes the page's behaviour.

## Evidence

Every metric with date, source, and limitation. Values come from the repo
snapshot of **2026-09-02** (branch `main`, commit `205a616c` dated
2026-08-17, package version `0.1.0-alpha.0`), read from the cited files —
not new runs. Re-verify before claiming any of it as current state.

| Fact / metric | Value | Date | Source | Limitation |
|---|---|---|---|---|
| GLSL shader capture on `www.chaingpt.org` | 82,613 GLSL characters | no date in source (snapshot commit `205a616c`, 2026-08-17; read 2026-09-02) | `README.md:98` via `docs/clone-space-analysis.md` §3.3 | single-site capture recorded in the README, not a fresh run; `THREE` was an ES module, not a global — the hooks caught the shaders at the browser API layer |
| Canvas contexts on `www.chaingpt.org` | 9 | as above | `README.md:98` via same | as above |
| `addEventListener` registrations on `www.chaingpt.org` | 1,510 | as above | `README.md:99` via same | as above |
| Animation registry vs `document.getAnimations()` | 12/12 on firecrawl.dev and 12/12 on chaingpt.org | no date in source (snapshot read 2026-09-02) | `docs/agents/using-the-tools.md:83-95` | two sites only; CSS **transitions** are not in the graph (row below) |
| Element identity on fixture | 63/63 matched, 0 unresolved, five hard cases | 2026-07-31 (ADR 0002 merged) | `docs/adr/0002-…md:136-141` | fixture only; the ADR itself calls this a floor, not a ceiling, for real sites |
| `restoreTiming` wall-clock cost | `goto` 825 ms → 4,577 ms | no date in source (snapshot read 2026-09-02) | `README.md:129-134` | one fixture + one real 146-entry site; the option is off by default |
| First real equivalence verdicts | firecrawl.dev FAIL (motion_settled 0%, interaction 63%) · chaingpt.org INCOMPLETE (stable_fields 90%) · labs.chaingpt.org PASS then FAIL minutes apart, same machine, nothing changed | 2026-08-17 | `docs/reports/2026-08-17-equivalence-verdicts.md` | `listener_execution` is 0% in all of them (row below) |
| Mutation corpus size | 153 entries, grown from 7 (#53, 2026-08-03) | read 2026-09-02 | `README.md` | snapshot count |
| Metamorphic baseline (unrelated-node insertion, seed `0x24080426`) | 2/400 vs 179/400 with bug #20 restored; the first two measurements (32/400, then 78/400) were retracted | 2026-08-04 | `docs/reports/2026-08-04-metamorphic-baseline.md` | a metric, not an assertion — correct code can lose matches too; the "89.5×" ratio is explicitly not citable (base of 2 too small) |
| Published p-value | "0.75^20 = 0.3%" (one-sample test against a control-derived rate) was wrong; Fisher's exact on 5/20 vs 0/20 gives p = 0.024 one-tailed, 0.047 two-tailed — weaker by a factor of about 15 | 2026-08-16 | `DONE.md` entry 2026-08-16 | found by a second-round delegated review; **no automated test** (lint, typecheck, 558 unit tests, 95 browser tests, mutation corpus) catches arithmetic errors of this kind |
| `listener_execution` coverage | 0% in every recorded verdict | as of commit `205a616c` (2026-08-17) | `README.md:328-329` | equivalence verdicts are statements about navigation/scroll, **not** interaction |
| CSS transitions absent from the behaviour graph | 318 transition-bearing elements on firecrawl.dev, 1,028 on chaingpt.org, not reported by the graph | no date in source (snapshot read 2026-09-02) | `docs/agents/using-the-tools.md:83-95` | a page animated purely with Tailwind/Framer transitions will report unusually few nodes |
| Cross-origin CSS sheet via CDP | 593 bytes readable through `CSS.getStyleSheetText` where the page itself gets a `SecurityError` | 2026-07-30 | `docs/reports/2026-07-30-cdp-spike.md` | the spike's first round answered this question wrong (a bug in the measurement harness itself) — recorded as a lesson, not a result |

## Known limitations — what Clone Space does not do

- **It is not a content scraper, not general browser automation, and not a
  website generator.** It answers one question: *how does this existing real
  website work?*
- **It has not driven event listeners.** `listener_execution` is 0% in every
  recorded verdict (`README.md:328-329`); a green verdict is a claim about
  navigation and scroll, not about interaction.
- **The `layout.scrollHeight` race (#187) is still open** — two replays of
  the same archive can get different heights; the fix (`restoreTiming`) is
  off by default because of its wall-clock cost.
- **CSS transitions are not in the behaviour graph** — visible only while
  running, through `getAnimations()`; a page animated purely with
  Tailwind/Framer transitions reports unusually few nodes.
- **Out-of-process iframes and closed shadow roots** are outside the current
  element-identity scheme (ADR 0002); targets that are born and die during
  navigation are missed (ADR 0008); the WebSocket private-address refusal
  covers IP literals but not hostnames (#185).
- **CI required checks are not live** (the GitHub account is billing-locked,
  #2); `t4-verify` is a self-attested check armed 2026-08-16, not a CI.
- **The license is not chosen** (`README.md:337`).
- **Response bodies are never redacted and cannot be** (ADR 0009) — the
  standing warning: never point capture at pages behind login, internal
  tools, or sensitive data.

The honest summary this page should carry: Clone Space is Alpha, and it says
so. Its strength is that it records its own limits in detail — `identity-unresolved`,
`"undetermined"`, `unrepresented`, `unservable` are first-class results, not
errors hidden in a footnote — which is what lets an agent decide what a
capture does and does not prove.

## Role in the ecosystem — the design family's reference source (developing)

On this site Clone Space is positioned as the reference source for the
xeno-skills design family: when an agent designs a hero with motion, seeing
the **real mechanism** of a real site — timing, easing, trigger, library, and
the `file:line` that drives it — grounds the design decision in evidence
instead of in the model's sampling of the pattern distribution it was
trained on. That is the project owner's "anti-AI-slop" framing of the tool
(stated for this website; the repo does not declare it itself), and it is
why Clone Space lives under the design family in the hub's skill catalog.

**As of the 2026-09-02 snapshot this is (developing), not wired.** Clone
Space is **not integrated into the design tooling**: the design skills'
current inspiration sources are Dribbble, Pinterest, and 21st.dev. The only
mention of `clone-space-mcp` in the entire xeno-skills repo is a PR that
`clink-subagents` cites as a mutation-testing case — unrelated to the design
workflow. The connection above is the intended role, not an existing one;
nothing on this site claims the integration exists.

Back to the hub's skill catalog, where the design family lives:
[/#skills](/#skills)
