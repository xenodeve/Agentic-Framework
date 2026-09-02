# Issue tracker: GitHub

<!-- lang:en -->

Issues and PRDs for this repo live as **GitHub issues** on `xenodeve/Agentic-Framework` (GitHub normalised the space in the name to a hyphen). Use the `gh` CLI for all operations.

> **Tooling:** `gh` is not on PATH — invoke `C:\Program Files\GitHub CLI\gh.exe` (authenticated as `xenodeve`, `repo` + `workflow` scopes). `bun` is at `~/.bun/bin/bun.exe`.

## Language: bilingual bodies (English + Thai)

Every issue, PRD, and PR body is **bilingual — English first, then a full Thai mirror** at the same depth. Not a summary; not a translation of the title.

- **Title:** English, conventional-commit style (`feat: …`, `fix: …`).
- **Body:** English sections, then a `## สรุปภาษาไทย` section that mirrors **every** English section at the same depth.
- **Identifiers stay English, byte-exact** — paths, commands, symbols, labels, error strings are never translated.
- **Hedging words stay** — "likely", "unverified", "not run" must appear in both languages. Deleting a hedge in the mirror is a false statement.
- **A single-language body is a defect.**

## Conventions

- **Create / read / list / comment:** `gh issue create` · `gh issue view <n>` · `gh issue list` · `gh issue comment <n> --body-file <file>`.
- **Close with a reason:** `gh issue close <n> --comment "<why>"`.
- **Infer the repo from `git remote -v`** — `gh` does this automatically inside a clone; pass `--repo` only when standing outside one.
- **Label every issue** from `docs/agents/triage-labels.md` on creation.
- **The PRD → issues → PR gate** holds: a PR references the issue(s) it ships (`#NNN` in the branch name or a commit on the branch — the `check-issue-ref` guard reads exactly those places).

## Skill phrase mapping

- "publish to the issue tracker" → create a GitHub issue.
- "fetch the relevant ticket" → `gh issue view <n> --comments`.

<!-- lang:th -->

Issues และ PRDs ของ repo นี้เป็น **GitHub issues** บน `xenodeve/Agentic-Framework` (GitHub normalize ชื่อจาก space เป็น hyphen) · ใช้ `gh` CLI ทุก operation

> **Tooling:** `gh` ไม่อยู่บน PATH — เรียก `C:\Program Files\GitHub CLI\gh.exe` (auth เป็น `xenodeve`, scope `repo` + `workflow`) · `bun` อยู่ที่ `~/.bun/bin/bun.exe`

## ภาษา: bilingual bodies (อังกฤษ + ไทย)

ทุก issue, PRD, PR body เป็น **bilingual — อังกฤษก่อน แล้วตามด้วย mirror ภาษาไทยเต็ม** ที่ความลึกเท่ากัน ไม่ใช่ summary · ไม่ใช่การแปล title

- **Title:** อังกฤษ แบบ conventional-commit (`feat: …`, `fix: …`)
- **Body:** sections อังกฤษ แล้วตามด้วย `## สรุปภาษาไทย` ที่ mirror **ทุก** section อังกฤษที่ความลึกเท่ากัน
- **Identifier คงอังกฤษ byte-exact** — paths, commands, symbols, labels, error strings ห้ามแปล
- **คำ hedge คงอยู่** — "likely", "unverified", "not run" ต้องมีในทั้งสองภาษา ตัด hedge ออกจาก mirror คือการกล่าวเท็จ
- **body ภาษาลูกเดียวคือ defect**

## Conventions

- **สร้าง / อ่าน / list / comment:** `gh issue create` · `gh issue view <n>` · `gh issue list` · `gh issue comment <n> --body-file <file>`
- **ปิดพร้อมเหตุผล:** `gh issue close <n> --comment "<ทำไม>"`
- **เดา repo จาก `git remote -v`** — `gh` ทำเองอัตโนมัติใน clone · ใส่ `--repo` เฉพาะเมื่ออยู่นอก clone
- **label ทุก issue** ตาม `docs/agents/triage-labels.md` ตอนสร้าง
- **gate PRD → issues → PR** ยืนอยู่: PR อ้าง issue ที่มัน ship (`#NNN` ในชื่อ branch หรือ commit บน branch — guard `check-issue-ref` อ่านตรงนั้นพอดี)

## Skill phrase mapping

- "publish to the issue tracker" → สร้าง GitHub issue
- "fetch the relevant ticket" → `gh issue view <n> --comments`
