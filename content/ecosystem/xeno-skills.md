---
title: "xeno-skills"
description: "Agent skills, workflow-enforcement hooks, and the T4 engineering operating standard for agent-primary development."
repo: "xenodeve/xeno-skills"
status: "production"
tags: [skills, hooks, t4]
---

## What it is

xeno-skills is the operating standard the T4 team runs its repos on. The
coding agent is the primary developer, so the repo's docs are its operating
manual — and the rules are enforced by hooks, git guards, and contract tests,
not left as advice in a prompt.

## How it works

- **Skills** route a task to the right process (`using-t4` entry map, `clink`
  multi-agent orchestration, `design` web UI suite).
- **Hooks** keep a session on the rails — session-start injection, per-turn
  reminder, and a `PreToolUse` gate that blocks a PR without an issue and
  dangerous git.
- **Memory** is first-class — an open-work ledger, ship log, and memory vault
  let a fresh agent recover state after a context reset.

## Status

In production on the team's real projects (MangaDock, T4-Fastwork) and
self-bootstrapped onto its own repo.

Full deep-dive incoming — architecture analysis (Antigravity) and code review
(Codex) are in progress and land in `docs/`.
