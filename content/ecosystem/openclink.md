---
title: "openclink"
description: "MCP server that connects CLI agents — Claude Code, Codex, Antigravity — into one workflow."
repo: "xenodeve/openclink"
status: "active"
tags: [mcp, multi-agent]
---

## What it is

openclink is an MCP server that wires the CLI agents the team actually runs —
Claude Code, Codex, and Antigravity — into a single workflow, so a task can be
delegated across them and verified before it merges back.

It is the transport behind the team's multi-agent pattern: distribute a
problem, let the agents argue it out through their own strengths, and carry
only the synthesized result back to a human for approval.

## Status

Active. Deep-dive incoming while the architecture analysis and code review
land in `docs/`.
