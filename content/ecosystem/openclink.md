---
title: "openclink"
description: "The MCP transport that xeno-skills' clink-* skills speak through — and the deep-scan that found silent failure is the house style."
repo: "xenodeve/openclink"
status: "active"
tags: [mcp, multi-agent, transport]
---

## What openclink is

openclink (repo `xenodeve/openclink`, local folder still `pal-mcp-server`;
lineage Zen MCP → PAL MCP → OpenClink, Apache-2.0) is a Model Context
Protocol server with two roles at once:

- a **CLI-to-CLI bridge** — the `clink` tool that spawns an external CLI
  agent (Codex CLI, Antigravity `agy`, Cursor `cursor-agent`, OpenCode,
  Claude Code) as a subagent in a separate context and sends only the result
  back into the original conversation; and
- **19 native MCP tools** (`chat`, `thinkdeep`, `debug`, `codereview`,
  `consensus`, and others) that talk directly to model providers — Gemini,
  OpenAI, Azure, X.AI, OpenRouter, DIAL, and local models (Ollama/custom) —
  without any external CLI.

On this site openclink is **not a standalone product**. Its one role that
matters here is the first: the `clink` tool is the mechanism behind the entire
`clink-*` skill family of xeno-skills (`using-clink`, `clink-brainstorm`,
`clink-subagents`, `clink-debug`, `clink-masteragent`). When `clink-brainstorm`
"fires the same question at several agents at once", that is one MCP tool call
to `clink` per agent. Positioning line: *the multi-CLI transport that
xeno-skills' clink-* skills speak through — not a standalone product on this
site.*

xeno-skills is "what to do, when, with whom"; openclink is "how the command
actually reaches another agent". Two repos, two layers.

## Origin story

### The real problem

The fork was not a feature wish. Three concrete problems forced it:

1. **A CLI that went silent.** Google retired the Gemini CLI in mid-2026 in
   favor of Antigravity (`agy`), a closed-source binary that only prints
   output when it believes a real terminal is attached. Every MCP server (the
   old OpenClink included) spawns child processes with a plain pipe — so `agy`
   returned an empty stdout with exit code 0. Silent, no error to see.
2. **Model/effort could not be chosen per call.** Upstream fixed each CLI's
   model at config time (`conf/cli_clients/*.json`); changing it meant editing
   a file and restarting the server.
3. **CLI diversity = model-family diversity.** `cursor-agent` opens the door
   to model families no other client can touch — Grok (xAI), Kimi (Moonshot),
   GLM (Zhipu). `opencode` opens the `opencode-go` provider (deepseek, GLM,
   Kimi, MiniMax, Qwen, Grok). That is the strategic reason
   `clink-brainstorm` calls openclink instead of one provider: it gets
   genuinely independent opinions, not the same model family three times.

### What was attempted, and what it actually does

openclink is an **additive-only fork** of
[`BeehiveInnovations/pal-mcp-server`](https://github.com/BeehiveInnovations/pal-mcp-server)
— every change is declared not to touch upstream behavior, except one explicit
breaking change (documented below). The changes the fork made:

- **Windows ConPTY transport for `agy`** — run `agy` through a real Windows
  ConPTY with the `pywinpty` library (ADR 0001, 2026-06-28, commit `9087c81`),
  because it only speaks when it sees a pseudo-terminal. Windows-only.
- **Per-call `model` / `reasoning_effort`** — added as optional parameters on
  the `clink` tool, later becoming **required** for `model` (ADR 0002,
  2026-07-16, commit `97a7072`). This is the fork's single breaking change:
  "a model nobody chose" must not be confused with "a model someone chose" in
  `resolved_model` (source: `CHANGES-FORK.md`, issue #29). Mapping differs per
  CLI — Codex uses `-m` + `-c model_reasoning_effort=` (five levels:
  low/medium/high/xhigh/max); the others use `--model`.
- **Zero-setup CLI discovery** — `clink/discovery.py` searches known install
  locations (winget, `%LOCALAPPDATA%`, npm) before falling back (ADR 0003,
  2026-07-16, commit `d44ae01`).
- **Dependency pin** — `mcp` 2.0.0 removed `Server.list_tools`, which
  `server.py` uses as a decorator, so `mcp>=1.0.0,<2` is pinned in both
  `pyproject.toml` files and guarded by `test_dependency_pins.py`.
- **`images` no longer silently dropped** — it used to be accepted and
  discarded (`_ = (files, images)`); now it errors immediately with a real
  fix (embed the path in the prompt and let the agent open the file).

The repo was renamed `pal-mcp-server` → `openclink` on `main` on **2026-08-16**
(PR #114, 22 commits, 176 files), because the name `pal-mcp-server` was already
taken on PyPI by another project (version 10.4.3). The rename was deliberately
done only halfway: the MCP tool prefix is still `pal` on the Claude/Codex CLIs,
because xeno-skills itself references `pal` 25 times in code and those skills
run on exactly those two clients. Moving the prefix has to wait for
xeno-skills to merge its own update (`xeno-skills#206`) — a real example of two
repos that must coordinate timing.

**The bug that became the repo's standing discipline:** `agy --print` is a
value-taking flag, and the argument order `--print --model X` makes `--print`
swallow `--model` as its own value. The model quietly reverts to the default;
exit code 0. The old unit test only proved that `_build_command()` builds the
argv — it never ran `agy`. That is why `CLAUDE.md` carries it as
non-negotiable: **verify clink changes against a real CLI, not just a green
unit test.**

## The deep-scan finding: "silent failure is the house style"

openclink is not presented here as a flawless tool, because its own self-audit
refuses to present it that way. The strongest evidence in the repo is not a
capability benchmark but a systematic safety and contract audit:
`docs/reports/2026-08-13-deep-scan-architecture-safety-and-direction.md`.

**Method (2026-08-13):** 3 rounds, 605 claims total, ~26,000 of 30,238 lines
of production code read. Rounds 1–2 paired 12 readers with an adversarial
"refuter"; of 68 planned refutations, 27 actually ran, and **11 of 27 (41%)
were refuted or corrected**. Round 3 switched to the report author verifying
the important claims directly — cheaper and more accurate. The report records
what it got wrong rather than deleting it: "clink has no end-to-end tests" is
false (`tests/test_clink_integration.py` exists), and "threads written forever
never expire" is also false (at the turn ceiling `add_turn` returns before
`setex`, so the TTL stops sliding). Its own lesson: nearly every refuted claim
was an absolute ("never / zero / only").

**The real holes it found** (source: the 2026-08-13 deep-scan report, section
references as cited):

| Layer | What was found | Where |
|---|---|---|
| Safety boundary | `readOnlyHint: True` on `clink` even though the spawned agents carry full bypass-approval flags; child processes receive the whole `os.environ` (every API key); no `cwd` sandbox; the path block-list has holes (`C:\ProgramData`, `.git/config` readable directly) | report §2, `tools/clink.py:156-157`, `clink/agents/base.py:533-536` |
| Concurrency / liveness | the `clink` timeout **cannot actually fire** when a grandchild process holds the pipe; `provider.generate_content` is a synchronous call inside `async def` — one chat with a local model can freeze the event loop for **up to 30 minutes** | report §3 |
| State leak | a tool claiming to be "stateless" has 11 fields that survive across requests; per-turn conversation size **doubles** because a guard string never matches (measured: 3,069 → 54,280 characters over 5 rounds) | report §4 |
| Prompt layer | 3 system-prompt files (`planner`, `tracer`, `docgen`), 29,879 bytes total, **never reach the model** because the conditional gate is wrong | report §5 |
| Contract layer | `confidence='certain'` is printed as a bare `str` in 4 tools — a typo stays silent and still gets billed; a `consensus` panel that **failed entirely** still reports `consensus_confidence: "high"` (hardcoded in 2 places) | report §6 |

And the report's own verdict, stated plainly: **"silent failure is the house
style"** — the system degrades silently at every layer, from a dropped image to
a dead consensus panel reporting "high" confidence, and **no test fails because
nothing technically fails**.

A second report the same day (`docs/reports/2026-08-13-cli-enforcement-capability.md`)
overturned an earlier 2026-08-04 spike that claimed "Claude Code is the only
client with a pre-tool hook". Inspecting the real binaries, **4 of 5 clients**
have a way to block tool calls (`codex` embeds 11 hook events including
`PreToolUse`; `agy` and `cursor-agent` via `hooks.json`), plus something
stronger: `--tools ""` on Claude Code strips built-in tools from context
entirely while MCP tools remain. Lesson recorded: `--help` is not a
trustworthy source of truth — check the binary and vendor docs directly.

**Still open as of the 2026-09-02 snapshot** (the audit is a report, not a
fix): the `readOnlyHint` mismatch is unfixed, child processes still get the full
`os.environ`, and the first open item in the ledger is that `clink`'s child
process tree is not killed on cancel (#144, carved out of epics #20/#89 on
2026-08-19).

## How it works

```text
xeno-skills: using-clink (decision gate: should openclink be called at all?)
    ↓
xeno-skills: clink-brainstorm / clink-subagents / clink-debug / clink-masteragent
    ↓ (one MCP tool call: "clink", per agent)
openclink: tools/clink.py → clink/registry.py + discovery.py (loads conf/cli_clients/*.json)
    ↓ (subprocess, or Windows ConPTY for agy)
real external CLI: codex / claude / agy / cursor-agent / opencode
    ↓
that CLI's real model answers
    ↓
openclink: per-CLI parser → one normalized AgentOutput
    ↓
xeno-skills: master agent synthesizes → human report
```

The key point: the line from each `clink-*` skill into openclink is a **single
MCP tool call** (`clink`). The other 18 tools are not on this path — they serve
openclink's own end users (MCP clients), not xeno-skills.

**The runners** — what `clink` can actually reach (snapshot 2026-09-02):

| `cli_name` | Model families reached | Transport | Status |
|---|---|---|---|
| `codex` | GPT-5.6 (sol/luna/terra), GPT-5.5 | plain subprocess, `--json` | active / production |
| `claude` / `claude-9arm` | Claude models, or an alternate gateway | plain subprocess, `--output-format json` | active / production |
| `antigravity` | Gemini 3.x, Claude Opus/Sonnet 4.6, GPT-OSS 120B | **Windows-only ConPTY** (`pywinpty`) | active but **platform-limited** |
| `cursor` | Grok (xAI), Kimi (Moonshot), GLM (Zhipu), Composer | plain subprocess; per-machine `SHELL` gotcha on Windows | active with a known gotcha |
| `opencode` | deepseek, GLM, Kimi, MiniMax, Qwen, Grok via `opencode-go` | subprocess, one JSON event per line | active / production (2026-08-16) |
| `gemini` | (the pre-deprecation original) | plain subprocess, `--yolo -o json` | **deprecated by vendor** — README recommends `antigravity` |

`opencode` is the only runner that reports its own real cost (`part.cost` →
`cli_reported_cost`). Why the path goes through CLIs rather than one API: each
connected agent "sees" the real repo through its own tools (web search, file
access) rather than only receiving a prompt string; `clink-subagents` routes
sub-tasks by a capability index per model+effort kept in
`docs/clink-model-effort-guide.md`, not by a guess; `clink-debug` gets a fresh
lineage agent with no inherited context because `clink` opens a new process
every time.

openclink's 19 tools (verified against `server.py:264-283`, matching the README):
10 on by default + 7 off by default + 2 always on (`listmodels`, `version`).
The 18 that are not `clink` are a parallel capability for openclink's own MCP
clients — do not read them as "what xeno-skills uses".

## Evidence

Every metric with date, source, and limitation. Values come from the repo
snapshot of **2026-09-02** (branch `feat/149-clink-run-journal`, commit
`200fcb9` dated 2026-08-19, version `9.8.2` in `pyproject.toml`/`config.py`).
The brief is explicit that these are not permanent — re-verify before every
republish.

| Fact / metric | Value | Date | Source | Limitation |
|---|---|---|---|---|
| Deep-scan scope | 605 claims, 3 rounds, ~26,000/30,238 lines read | 2026-08-13 | `docs/reports/2026-08-13-deep-scan-*.md` | self-audit, not a third-party audit |
| Adversarial refutation rate | 11/27 = 41% refuted or corrected (of 68 planned, 27 ran) | 2026-08-13 | same report | 41 of the 68 planned refutations never ran |
| State-doubling measurement | 3,069 → 54,280 characters over 5 rounds | 2026-08-13 | report §4 | measured on one tool's guard-string path |
| Event-loop freeze | up to 30 minutes for one local-model chat | 2026-08-13 | report §3 | worst case on a local model |
| Test suite | 152 files in `tests/`; **1,285 passing** (vs 1,280 before PR #143) | 2026-08-16 / counted 2026-09-02 | `docs/OPEN-WORK-LEDGER.md`, direct repo count | **local run only** — no CI has ever run (below) |
| CI history | **no CI run has ever succeeded** in repo history (GitHub account billing-blocked; confirmed via `gh run list`) | checked 2026-09-02, entry 2026-08-01 | `docs/OPEN-WORK-LEDGER.md`, `[[ci-unavailable-billing-blocked]]` | so the PR gate is discipline at PR-open time, not an automated green check |
| `opencode` support shipped complete | 3 gaps closed (effort not dropped, cost reaches accounting, cache-read not lost), verified against the real binary (#125–127, PR #128) | 2026-08-16 | `docs/OPEN-WORK-LEDGER.md` | snapshot claim; re-verify |
| `selectagents` status | 11 sub-issues (#98–#113) merged, but still in `DISABLED_TOOLS` because the price dataset is a self-constructed fixture, not real market prices | 2026-08-16 | `docs/OPEN-WORK-LEDGER.md` | off by default; waits on spike #97 (not started) |
| `deepseek-v4-flash` vs `kimi-k3` | ~323× the work for the same quota | no date in source | `CHANGES-FORK.md` | vendor pricing snapshot, not measured by the team |
| `--tools ""` on Claude Code | strips built-in tools from context entirely while MCP tools remain; a worker spawned this way has one MCP tool as its entire toolkit and can read no files | 2026-08-13 | `docs/reports/2026-08-13-cli-enforcement-capability.md` | tested on real binaries |
| AA Intelligence Index numbers | snapshot of measured index per model+effort | 2026-07 | `docs/clink-model-effort-guide.md` | the guide itself says re-fetch before use — not a permanent value |
| Upstream last commit | 2025-12-15 (not "mid-2026") | checked 2026-08-13 | deep-scan report §13 | the README's "unmaintained since ~mid-2026" is less precise than the object-database check |
| `xeno-skills` references `pal` | 25 times in code | no date in source | brief §9 (rename analysis) | why the tool-prefix move is gated on `xeno-skills#206` |

Metadata-drift caveats carried over from the analysis (do not normalize them
away): `config.py` carries `__updated__ = "2025-12-15"`, which is stale
against the real development of 2026-07/08; `pyproject.toml` says Python
`>=3.9`, the README recommends 3.10+, and `CLAUDE.md` names three different
venvs (`.venv`, `.openclink_venv`, `venv`).

## Known limitations — what openclink does not do

- **It does not decide when to run multi-agent** — `using-clink` decides.
- **It does not synthesize multi-agent results** — xeno-skills' master agent does.
- **It does not verify the results it sends back** — the skill layer must
  verify itself. The deep-scan confirmed a non-zero exit was, at some point,
  reported as a success (now fixed, but recorded).
- **`antigravity` is Windows-only** by design (ConPTY via `pywinpty`);
  results on alt-OS machines are unverified (stated plainly in ADR 0001).
- **`cursor` needs a per-machine `SHELL` env-var fix on Windows**; there is no
  fix in the shipped preset.
- **`selectagents` is experimental** — off by default on fixture prices; not to
  be advertised as fully working.
- **Supervised subagent sessions** (epic #11: cancel by handle, list in-flight)
  are still at spike stage, most phases gated.
- **Open safety work, stated as limitations not features:** `readOnlyHint: True`
  does not match real behavior; child processes get the full `os.environ` with
  no allowlist; no `cwd` sandbox. Per `docs/tools/clink.md`'s own opening
  warning, it must only be run inside a trusted workspace.
- **No third-party production-safety audit**, and no CI — quality is local-run
  only.
- **Conversation memory is in-memory only** (no Redis/disk), TTL slides only on
  a successful write, and a restart destroys every thread. The marketing-toned
  `docs/context-revival.md` ("The Most Profound Feature") conflicts with this
  and must always be paired with the limitation.
- **The MCP tool prefix is mid-migration** (`pal` → `openclink`) and is tied to
  the timeline of `xeno-skills#206`, not an openclink-only decision.
- **Installation docs used to point at upstream.** The 2026-08-13 deep-scan
  found `run-server.sh` and an older `docs/getting-started.md` pointed at the
  upstream URL instead of the fork (a bug that would run upstream with none of
  the fork's work). As of the 2026-09-02 check the files point at
  `xenodeve/openclink` correctly — but it is a bug that has recurred, so
  re-verify before publishing.

The honest summary the brief asks the site to carry: openclink is not trying to
be a perfect multi-agent platform. It is a bridge that actually works and is
honest about its own limits — which is what lets xeno-skills trust it as
transport.

Back to the hub's multi-agent section: [/#multi-agent](/#multi-agent)
