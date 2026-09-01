---
name: tool-paths
description: bun and gh are not on PATH in git-bash — use the absolute paths
type: reference
---

On this machine, `command -v bun` and `command -v gh` fail in git-bash even though both are installed:

- `bun` → `~/.bun/bin/bun.exe` (bun 1.3.14)
- `gh` → `C:\Program Files\GitHub CLI\gh.exe` (authenticated as `xenodeve`)

**Why:** `command not found` here means "not on PATH", not "not installed" — a bootstrap that reads it as missing silently skips the step.
**How to apply:** resolve the absolute path before concluding a tool is absent; invoke it with the quoted absolute path.
