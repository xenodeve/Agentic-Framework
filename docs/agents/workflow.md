# Agent Workflow

<!-- lang:en -->

How agents plan and implement in this repo, and which skills fire automatically.

## Development workflow

1. `/grill-me` — stress-test the concept interview-style before committing to it.
2. `/grill-with-docs` — challenge the plan against `docs/adr/`; lazily produces domain docs when a term or decision actually resolves.
3. **Survey the change sites** — enumerate every place the change touches before writing the plan.
4. `/to-prd` — turn the grilled plan into a PRD (one PRD per epic), carrying the survey as its change inventory.
5. `/to-issues` — break the PRD into GitHub issues on `xenodeve/Agentic Framework` with triage labels (one issue per deliverable).
6. `/tdd` — implement test-first (red → green → refactor).

`/grill-me`, `/grill-with-docs`, `/to-prd`, `/to-issues` are **user-invocation-only** (`disable-model-invocation`) — an agent cannot call them through the Skill tool. Absence from the available-skills listing is **not** evidence they are missing: ask the developer to run them, naming the exact command, and do not improvise their output. If the developer declines, that is a park, recorded with what is undone.

**Hard gate: PRD → issues → PR.** Never open a PR without a referenced issue. A PRD becomes issues before code; code maps to an issue before a PR.

## Auto-triggered skills

| Boundary | Skill |
|---|---|
| after writing code | `simplify` |
| before merge | `code-review` + `scrutinize` |
| touched auth / secret | `security-review` |
| done | `verify` |

The check at task start does **not** discharge a later trigger — re-route at every phase boundary (`using-t4`).

## Verify command

`bun run verify` (lint + typecheck + build) is the fast ship-gate command; keep it a fast prefix of the CI jobs in `.github/workflows/t4-verify.yml`.

Every frontend change is verified end-to-end — unit tests can't see real layout or hydration: `bun run build` + `bun start` + check each touched route (the site is static; the SSG output is the artifact). Add a case when a page or interactive UI is added. No e2e runner exists yet — when one lands, it goes in `t4-e2e.yml`, never in `verify`.

<!-- lang:th -->

วิธีที่ agent วางแผนและ implement ใน repo นี้ และ skill ใดถูกเรียกอัตโนมัติ

## Development workflow

1. `/grill-me` — กดสอบ concept แบบสัมภาษณ์ก่อนตัดสินใจ
2. `/grill-with-docs` — ท้าแผนต่อ ADR ใน `docs/adr/` · สร้าง domain docs แบบ lazy เมื่อคำหรือ decision ชัดจริง
3. **สำรวจ change sites** — enumerate ทุกจุดที่ change สัมผัส ก่อนเขียนแผน
4. `/to-prd` — เปลี่ยนแผนเป็น PRD (หนึ่ง PRD ต่อหนึ่ง epic) พร้อม change inventory จากขั้นสำรวจ
5. `/to-issues` — แยก PRD เป็น GitHub issues บน `xenodeve/Agentic Framework` พร้อม triage labels (หนึ่ง issue ต่อหนึ่ง deliverable)
6. `/tdd` — implement test-first (red → green → refactor)

`/grill-me`, `/grill-with-docs`, `/to-prd`, `/to-issues` เป็น **user-invocation-only** (`disable-model-invocation`) — agent เรียกผ่าน Skill tool ไม่ได้ การที่มันไม่อยู่ใน available-skills **ไม่ใช่** หลักฐานว่าไม่มี: ให้ dev รันแล้วบอกคำสั่งที่ตรง · อย่า improvise ผลของมัน ถ้า dev ปฏิเสธ ให้ park และบันทึกสิ่งที่ยังค้าง

**Hard gate: PRD → issues → PR** — ห้ามเปิด PR โดยไม่อ้างอิง issue · PRD ต้องกลายเป็น issues ก่อนโค้ด · โค้ดต้อง map ไป issue ก่อน PR

## Auto-triggered skills

| Boundary | Skill |
|---|---|
| เขียนโค้ดเสร็จ | `simplify` |
| ก่อน merge | `code-review` + `scrutinize` |
| แตะ auth / secret | `security-review` |
| เสร็จ | `verify` |

การเช็คตอนเริ่ม task **ไม่ปลด** trigger ข้างหลัง — re-route ทุก phase boundary (`using-t4`)

## Verify command

`bun run verify` (lint + typecheck + build) คือ fast ship-gate · รักษาให้เป็น fast prefix ของ CI jobs ใน `.github/workflows/t4-verify.yml`

ทุก frontend change ต้อง verify end-to-end — unit tests มองไม่เห็น layout/hydration จริง: `bun run build` + `bun start` + เช็คทุก route ที่แตะ (เว็บ static · SSG output คือ artifact) · เพิ่ม case เมื่อเพิ่มหน้า/UI ยังไม่มี e2e runner — เมื่อมี ให้เข้า `t4-e2e.yml` ห้ามเข้า `verify`
