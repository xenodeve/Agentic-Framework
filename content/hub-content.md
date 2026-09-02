---
title: Agentic Framework
description: Agent-primary skills and workflow-enforcement hooks for repositories that ship with evidence.
---

# Agentic Framework

## hero

Agent-primary skills and workflow-enforcement hooks for repositories that
ship with evidence.

The framework is **xeno-skills** — the skills, workflow layer, memory, and
hooks that let an agent be the primary developer of a repo. Two tools sit
beneath it as tools it calls, not as sibling products: **openclink**, the
transport the multi-agent family uses, and **Clone Space**, the reference
source the design family grounds a frontend in a real website.

The recurring story of this whole site, used on every page:

**a real problem → the mechanism that fixes it → the evidence that supports
it → the limits it still has → how to try it yourself.**

## problem

xeno-skills is not a general prompt collection. It is an operating layer for
a repository where the coding agent is the main developer. Four problems
keep coming back in that setting:

### The human sits in the middle

Running several AIs in parallel, one at a time, puts the developer in the
middle of every answer — reading, summarising, and re-answering the same
questions. The intent is that a master agent takes the brief once, picks the
skills, and dispatches the work, so a human approves the summary and the
decisions that matter at the right moment — not every step.

### One model, asked once, misses things

Each model has different strengths and blind spots. Asking a single model a
single time can miss an edge case, a compatibility issue, or an untested
assumption. `clink-brainstorm` therefore runs several agents and several
cognitive lenses so there is disagreement and a challenge loop before a
conclusion.

### Context amnesia and workflow drift

When a session ends or the context is compacted, an agent may keep the
conclusion and lose the reasoning, the evidence, and the questions already
settled. The T4 layer has a memory layer, a ledger, records, and a handoff so
an agent can open only the relevant slice of reasoning again.

### Documented ≠ enforced

A rule that lives only in a prompt or a document can be skipped if nothing
checks it. If an important rule has no executable check, xeno-skills treats
that as a defect of the system, not only a failure of the agent.

## four-outcomes

The framework resolves to four things an agent can be trusted to do:

### Route

Pick the correct skill and phase before acting, and re-route at every phase
boundary. `ask-xeno` and `using-t4` are the entries; the map tells you which
discipline a task needs.

### Delegate

Send bounded, self-contained leaf work to other agents while the master owns
the decomposition, integration, and final verification. "Delegate the
leaves, own the tree."

### Remember

Keep working state durable and retrieval-first — an index you skim and a slice
you open — so work survives a compact and a new session.

### Verify

Nothing is "done" without evidence: the command you ran, its output, or the
`file:line` you read. A verdict word requires a named artifact.

## mini-architecture

How a task flows through the framework:

```text
Human brief
    ↓
ask-xeno / using-t4
    ↓
pick the right skill and phase
    ↓
┌──────────────────────┬─────────────────────┐
│ judgment             │ bounded work        │
│ clink-brainstorm     │ clink-subagents     │
│ clink-debug          │ leaf implementation │
└──────────────────────┴─────────────────────┘
    ↓
Master agent combines and verifies
    ↓
Grill → Survey → PRD → Issues → TDD
    ↓
Simplify → Review → Security review → Verify
    ↓
Pre-push guards → CI → Human approval
```

The rule that should be the headline:

> **Delegate the leaves, own the tree.**

A worker handles bounded, verifiable work. The master keeps responsibility
for decomposition, architecture, integration, final verification, the
security boundary, bilingual output, uncheckable judgment, and the final
recommendation to a human. A subagent's result is **not** evidence by
default — the diff, output, test, build, and side effects are checked again.

## workflow

The pipeline an agent follows from idea to merge:

```text
Intake
  → Grill
  → Survey every change site
  → PRD
  → GitHub issues
  → TDD
  → Implementation
  → Simplify
  → Review / Security review
  → Verify
  → PR / Merge
  → Records / Memory
```

The survey is the step most skipped: find every occurrence, mirror, caller,
test, doc, and config a change touches — not just the first file that matched.
It is an action trigger (before the first thing you write down that you will
change), not a phase you notice after crossing it.

## skills

The skills, grouped by family. Hover a name for a summary; open one for the
origin story behind it — the real problem, the mechanism that addressed it,
and the evidence for it, with its limits stated. Skills that have no story of
their own inherit their family's, and say so.

## multi-agent

The `clink` family is how one agent coordinates others. It splits **judgment**
from **execution**:

- `clink-brainstorm` — a decision panel, not an implementation worker. Several
  agents, several lenses, a challenge loop, and a forced adversarial round
  after convergence.
- `clink-subagents` — bounded, self-contained leaf work, with a token-economics
  formula that decides delegate-versus-keep.
- `clink-debug` — fresh-lineage falsification and repair; the agent that
  proposed a hypothesis does not falsify its own.
- `clink-masteragent` — the orchestrator's model, effort, and verification
  choices, with the score table in-file.

The transport behind the family is **openclink** — the MCP the `clink` skills
call. Its origin story, a deep-scan finding, and its evidence live on the
dedicated page: [openclink →](/ecosystem/openclink)

## t4-standard

The T4 layer is the operating standard an agent runs on, organised to be
retrieval-first — an index you skim and a slice you open, not a wall of text:

- **`t4-agent-memory`** — the memory layer: a team vault, an open-work ledger,
  a ship log, and records, structured so a future agent pulls one relevant slice.
- **`t4-dev-workflow`** — the pipeline from intake to merge, and the rules that
  keep a claim at the register the evidence supports.
- **`t4-engineering-records`** — which record to write (post-mortem, ADR,
  impact register, bug case) and how to keep it a reliable index.
- **`t4-afk`** — unattended work inside approved scope, with a per-item gate and
  a final digest of what was done, skipped, and parked.
- **`t4-project-bootstrap`** — install the operating layer into a repo, and
  prove the repo that ships the standard actually follows it.

## hooks

Enforcement is a ladder, each rung checking what the one below it cannot:

```text
Soft       SessionStart      — inject the directive, open the relevant route
Soft       UserPromptSubmit  — name the route and the skill that should apply
Hard       PreToolUse        — block an action whose shape is checkable
Agent-agnostic  .githooks/pre-push — issue reference, tree budget, gate ledger
Strongest  CI + branch rules — enforce a check in a shared system
Human      developer approval — decide what a machine cannot check
```

The honest limit, stated plainly: hooks cannot measure the quality of judgment.
They cannot guarantee TDD or review depth. Local hooks can be bypassed with
`--no-verify`. A regex is not a full shell parser, and some nested commands fall
outside it. CI and branch rules are stronger than a local hook.

> Prompts guide. Hooks enforce checkable actions. CI protects the shared branch.
> Humans own the judgment boundary.

## research

Evidence carries a date, a source, and a limitation. Snapshots are from the day
they were recorded, not a fresh run.

### Routing reduces context

Switching from injecting the whole skill map to routing + retrieval took the
injection from about 8,974 bytes to about 1,368 bytes per injection — roughly
30,424 bytes saved across a four-injection session.

### A passing gate is not a clean bill

In one review a 94-assertion gate suite passed while the reviewer found raw
control bytes leaking from the generator. The lesson: *a test confirms the stated
contract, not the absence of all other problems.*

### 113 real compactions

Across 113 compactions in 10 projects: median context before compact about 719K,
median reduction about 85%, and 13 of the 113 left the context **larger**.
Context size has to be computed from `input_tokens` + `cache_creation` +
`cache_read` — reading `cache_read` alone reaches the wrong conclusion.

### 16 feedback issues, 16 PRs

Fixing the feedback queue showed that many rules fail not because they are unclear
but because they have **no moment at which they fire** — before the first edit of
a multi-leaf task, before a brainstorm round, after tool work before a prose reply,
before closing an issue, before declaring "verified".

### T4-Compact: research-backed, not production

T4-Compact is an experimental, research-backed feature in development — a
supervisor outside the session that compacts or reopens it. It is **not** a
completed production feature. Status: *research-backed · experimental
implementation · not yet production*.

## built-on

Two tools the framework calls, not two sibling products. **openclink** is the
transport the `clink` family calls for multi-agent orchestration. **Clone Space**
archives a live web page so it replays offline with the motion intact — a reference
source the design family uses to ground a frontend in a real website. Clone Space
is still **developing** in this ecosystem (the design-family wiring is not yet
implemented); that is stated on its page, not hidden.

## install

Three paths, and they are different:

- **Skills installer** — install the skills you want:
  `npx skills add xenodeve/xeno-skills`, or a single skill with
  `--skill clink-brainstorm`.
- **Plugin** — install the skills plus hook integration:
  `/plugin marketplace add xeno-skills` then `/plugin install xeno-skills`.
- **Bootstrap** — bring the T4 operating layer into a repo that should run the
  standard self-contained.

The hooks only run in a repo that has `.claude/t4.json` — that marker is the
opt-in.

## blog-teaser

Field notes from running the standard on real work — case studies, decisions,
failures, and lessons.
