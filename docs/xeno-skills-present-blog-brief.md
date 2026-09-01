---
title: "xeno-skills — Present & Blog Content Brief"
description: "สรุปผลิตภัณฑ์ สถาปัตยกรรม หลักฐาน และแนวทางนำเสนอ xeno-skills บนเว็บไซต์"
status: working-brief
source_repository: "D:\\Github\\xeno-skills"
snapshot_date: "2026-09-02"
audience:
  - human developers
  - engineering leads
  - AI-agent builders
  - contributors
---

# xeno-skills — Present & Blog Content Brief

เอกสารนี้สรุป `xeno-skills` จาก snapshot วันที่ 2 กันยายน 2026 เพื่อใช้เป็นฐานข้อมูลสำหรับเว็บไซต์นำเสนอผลิตภัณฑ์และบล็อกเชิงวิศวกรรม

เอกสารนี้ไม่ใช่การคัดลอก `SKILL.md` ทั้งหมดมาแสดงต่อผู้ใช้ แต่เป็นชั้นอธิบายสำหรับมนุษย์ โดยชี้กลับไปยัง source of truth ใน repository เมื่อจำเป็น

## 1. Executive summary

`xeno-skills` ไม่ใช่ชุด prompt ทั่วไป แต่เป็น operating layer สำหรับ repository ที่ให้ AI agent เป็นผู้ลงมือทำงานหลัก หรือที่ repository เรียกว่า **agent-primary repository**

ระบบประกอบด้วย:

- agent skills สำหรับ route งานและกำหนดพฤติกรรม
- multi-agent orchestration สำหรับขอ judgment, challenge และส่งงานย่อย
- T4 workflow สำหรับ intake, planning, TDD, review และ verification
- working memory สำหรับกู้คืน state ระหว่าง session
- workflow-enforcement hooks และ Git guards สำหรับ block action ที่ตรวจสอบได้
- tests, research และ records เพื่อทำให้คำอ้างอิงมีหลักฐาน

ประโยค positioning ที่เหมาะกับเว็บไซต์:

> Agent-primary skills and workflow-enforcement hooks for repositories that ship with evidence.

ฉบับภาษาไทย:

> ทักษะและกลไกกำกับ workflow สำหรับ repository ที่ให้ agent ลงมือทำงาน โดยทุกข้อสรุปสำคัญต้องมีหลักฐานตรวจสอบได้

หลักคิดที่เป็นแกนของผลิตภัณฑ์คือ:

> xeno-skills ช่วยให้ agent รู้ว่าควรทำอะไร เรียกใช้ใคร จำอะไรไว้ ตรวจสอบอย่างไร และหยุดตรงไหน — ไม่ได้พยายามแทนที่มนุษย์ทั้งหมด

## 2. Repository snapshot และขอบเขตความจริง

ข้อมูลนี้อ่านจาก branch ปัจจุบัน:

- branch: `feat/314-compact-supervisor`
- commit ล่าสุดที่อ่าน: `8afd169`
- `origin/main`: `8167712`
- plugin version: `0.1.0`
- license: MIT
- จำนวน skills ที่ค้นพบใน `skills/`: 19 ตัว

branch ปัจจุบันมีงาน T4-Compact ที่กำลังพัฒนาอยู่ จึงต้องแยกสถานะบนเว็บไซต์เป็น `implemented`, `research-backed`, `experimental` และ `planned` ให้ชัดเจน

ใน snapshot นี้ยังไม่พบเว็บแอปสำหรับ present/blog อยู่ใน `xeno-skills` เอง ตัว repository เป็น skill library, workflow layer, hooks, tests, documentation และ research library

ตัวเลขในเอกสารนี้ เช่น 1,207 assertions, 113 compactions และผล benchmark ของ model เป็นข้อมูลจากบันทึกการทำงานหรือ research ตามวันที่ระบุ ไม่ใช่ผลการรันใหม่ในวันที่สร้างเว็บไซต์

## 3. จุดกำเนิดและปัญหาที่ผลิตภัณฑ์แก้

### 3.1 Human-AI communication bottleneck

การให้ AI หลายตัวช่วยออกแบบระบบแบบทีละตัวทำให้ developer ต้องอยู่ตรงกลางตลอดเวลา คอยอ่านคำตอบ สรุป และตอบคำถามซ้ำ ๆ

แนวคิดของ xeno-skills คือให้ master agent เป็นผู้รับโจทย์หลักครั้งเดียว แล้วคัดเลือก skill และกระจายงานให้ agent อื่น โดยมนุษย์เข้ามาอนุมัติผลสรุปและการตัดสินใจสำคัญในจุดที่เหมาะสม

### 3.2 Model bias และ single-shot limitation

โมเดลแต่ละตัวมีจุดแข็งและจุดบอดต่างกัน การถามโมเดลเดียวครั้งเดียวอาจพลาด edge case, compatibility issue หรือ assumption ที่ไม่ได้ตรวจ

`clink-brainstorm` จึงใช้หลาย agent และหลาย cognitive lens เพื่อให้เกิดข้อโต้แย้งและ challenge loop ก่อนสรุป

### 3.3 Context amnesia และ workflow drift

เมื่อ session จบหรือ context ถูก compact agent อาจจำได้เฉพาะข้อสรุป แต่ลืมเหตุผล หลักฐาน และคำถามที่เคยปิดไปแล้ว

T4 จึงมี memory layer, ledger, records และ handoff ที่ทำให้ agent เปิดกลับไปยัง reasoning เฉพาะส่วนที่เกี่ยวข้องได้

### 3.4 Enforcement theater

กฎที่อยู่ใน prompt หรือเอกสารอาจถูกข้ามได้ ถ้าไม่มี hook, guard, test หรือ CI ตรวจจริง

หลักสำคัญของ xeno-skills คือ:

> Documented ≠ enforced.

หากกฎสำคัญไม่มีการตรวจสอบที่ executable จะถือเป็น defect ของระบบ ไม่ใช่ความผิดของ agent เพียงอย่างเดียว

## 4. Product DNA

### Verifiable

คำอ้างสำคัญต้องมีหลักฐาน เช่น test, command output, transcript, diff, build result, `file:line` หรือ commit SHA

### Surgical

ทำเป็นชั้นบาง ๆ ที่เชื่อม ecosystem อื่น ไม่ทำซ้ำสิ่งที่มีอยู่แล้ว ได้แก่:

- Superpowers สำหรับวิธีทำงาน
- Matt Pocock skills สำหรับ grill, spec, ticket และ tracker
- 9arm skills สำหรับ debug, review และ delegation
- PAL/openclink สำหรับเครื่องมือ multi-agent

### Retrieval-first

ไม่ยัดเอกสารทั้งหมดลง context แต่ใช้ลำดับ:

```text
เปิด index ก่อน
เปิดเฉพาะ slice ที่เกี่ยวข้อง
อ้างอิงกลับไปยัง source of truth
```

### Honest about limits

hooks ตรวจได้เฉพาะ action ที่มีรูปแบบชัดเจน ไม่สามารถรับประกันคุณภาพของ judgment, ความลึกของ review หรือคุณภาพของ TDD ได้ทั้งหมด

### Anti-brand

สิ่งที่ xeno-skills ไม่ต้องการเป็น:

- ระบบ enforcement ที่มีไว้โชว์แต่ไม่มีใครรัน
- requirement ที่เขียนว่า required แต่ไม่ได้ required จริง
- vocabulary ที่ไม่มี test หรือ label รองรับ
- paperwork ที่เพิ่มภาระโดยไม่เพิ่มความถูกต้อง
- ระบบที่อ้างว่า autonomous ทั้งหมดและไม่ต้องมี human approval

## 5. ภาพสถาปัตยกรรมโดยรวม

```text
Human brief
    ↓
ask-xeno / using-t4
    ↓
เลือก skill และ phase ที่ถูกต้อง
    ↓
┌──────────────────────┬─────────────────────┐
│ judgment              │ bounded work        │
│ clink-brainstorm     │ clink-subagents     │
│ clink-debug          │ leaf implementation │
└──────────────────────┴─────────────────────┘
    ↓
Master agent รวมผลและตรวจสอบ
    ↓
Grill → Survey → PRD → Issues → TDD
    ↓
Simplify → Review → Security review → Verify
    ↓
Pre-push guards → CI → Human approval
```

กฎ delegation ที่ควรเป็นข้อความเด่นบนเว็บไซต์:

> Delegate the leaves, own the tree.

worker ทำงานย่อยที่ self-contained และตรวจสอบผลได้ ส่วน master ต้องถือ responsibility เรื่อง:

- decomposition
- architecture
- integration
- final verification
- security boundary
- bilingual output
- uncheckable judgment
- final recommendation ต่อมนุษย์

ผลจาก subagent ไม่ถือเป็นหลักฐานโดยอัตโนมัติ ต้องตรวจ diff, output, test, build และ side effect อีกครั้ง

## 6. Skill catalog ทั้ง 19 ตัว

### Router

| Skill | บทบาท |
|---|---|
| `ask-xeno` | จุดเริ่มต้นสำหรับเลือก family: T4, clink, design หรือ coding |

`ask-xeno` ตั้งใจให้บางและไม่ทำซ้ำรายละเอียดของ skill อื่น มี contract test ว่า skill ทุกตัวเข้าถึงได้ภายในไม่เกิน 2 hops และต้องอยู่ภายใน byte budget ที่กำหนด

### Multi-agent / Clink

| Skill | บทบาท |
|---|---|
| `using-clink` | ตัดสินใจก่อนใช้ multi-agent ว่าควร brainstorm, delegate หรือ debug |
| `clink-masteragent` | กำหนดบทบาท master, model selection, effort, prompt, recovery และ verification |
| `clink-brainstorm` | ขอ judgment จากหลาย agent พร้อม challenge และ synthesis |
| `clink-subagents` | ส่งงานย่อยที่ bounded และตรวจสอบผลได้ |
| `clink-debug` | สังเกต ตั้งสมมติฐาน falsify และ repair ด้วย fresh lineage |

#### `clink-brainstorm`

เป็นคณะกรรมการตัดสินใจ ไม่ใช่ implementation worker

หลักการ:

- ใช้คำถามเดียวกันกับ agent หลายตัว
- ใช้อย่างน้อย 3 มุมมองในโจทย์สำคัญ
- แยก fact, evidence, assumption และ unknown
- ต้องแสดง evidence boundary
- เมื่อมี disagreement ต้องมี challenge loop
- เมื่อทุก agent เห็นตรงกัน ต้องมี adversarial round
- master ต้องสังเคราะห์ recommendation เอง ไม่แปะคำตอบมาต่อกัน

รูปแบบ `BrainstormRequest v1` มี protocol/version, problem, objective, scope, exclusions, questions, context, evidence, assumptions, unknowns, previous attempts และ permissions

#### `clink-subagents`

เหมาะกับ implementation, refactor, bulk transformation, focused research และ first draft ที่แยกขอบเขตได้

ไม่ควร delegate orchestration, architecture, integration, final verification, security review, bilingual decision หรือ judgment ที่ย้อนกลับยาก

ค่าใช้จ่ายที่ควรพิจารณาคือ:

```text
อ่านและคิดเองมากแค่ไหน
เทียบกับ prompt + output + verification ของ subagent
```

งานอ่านข้อมูลขนาดใหญ่แล้วคืนผลสั้นมักคุ้มค่ากับการ delegate มากที่สุด เพราะลด context ที่ master ต้องถือ

#### `clink-debug`

การ debug ต้องใช้ fresh lineage เมื่อทำ falsification หรือ repair ไม่ควรให้ producer คนเดิมเป็นผู้ยืนยันสมมติฐานของตัวเอง และควรหยุดเมื่อผ่านรอบที่ไม่สร้าง discriminating evidence

### T4 operating layer

| Skill | บทบาท |
|---|---|
| `using-t4` | แผนที่หลักของ T4 และ routing ตาม phase |
| `t4-project-bootstrap` | ติดตั้ง operating layer เข้า repository ใหม่ |
| `t4-agent-memory` | จัดการ memory, ledger, handoff และ retrieval |
| `t4-dev-workflow` | workflow จาก intake ถึง merge |
| `t4-engineering-records` | post-mortem, ADR, impact register และ bug case |
| `t4-afk` | ทำงานแบบ unattended ในขอบเขตที่อนุมัติไว้ |
| `t4-bro` | กติกาการตอบภาษาไทยแบบตรงและแม่น |

#### `using-t4`

กฎหลักคือ route ก่อนเริ่มงาน และ re-route ทุก phase boundary

non-negotiables ที่ควรนำเสนอ:

- evidence ก่อน verdict
- root cause ก่อน fix
- proof ก่อน skip
- memory ก่อน exploration
- PRD → issues → PR
- TDD
- verify ก่อนบอกว่าเสร็จ
- review และ security review ก่อน merge
- bilingual tracker
- E2E test สำหรับ frontend เมื่อเกี่ยวข้อง

#### `t4-agent-memory`

memory มีหลายชั้น:

1. Team vault เช่น `Obsidian-xeno-skills/Home.md`
2. Personal memory ใน `~/.claude`
3. `docs/OPEN-WORK-LEDGER.md`
4. `DONE.md`
5. skill-feedback issues และ local copies
6. survey provenance cache
7. Serena code memories

ลำดับการอ่านที่แนะนำ:

```text
Home → Open-work ledger → Issue → History/research เฉพาะที่ต้องใช้
```

#### `t4-dev-workflow`

pipeline หลัก:

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

การ survey ต้องค้นหาทุก occurrence, mirror, caller, test, doc และ config ที่อาจได้รับผลกระทบ ไม่ใช่แก้ไฟล์แรกที่ค้นพบแล้วหยุด

#### `t4-afk`

AFK ไม่ได้ลดมาตรฐาน แต่ใช้กับ worklist ที่มี scope และ permission ชัดเจน

ทำได้เองเมื่อเป็น implementation ภายใน issue ที่อนุมัติแล้วและ reversible ส่วน architecture, security, data migration, irreversible action, ambiguity และ scope expansion ต้อง stop-and-park

ทุก item ต้องมี checkpoint, gate และ final digest ของสิ่งที่ทำ, สิ่งที่ไม่ทำ และสิ่งที่ต้องรอ

#### `t4-engineering-records`

เลือก record ตามเหตุการณ์:

- post-mortem สำหรับ bug ที่แก้และ validate แล้ว
- ADR สำหรับ decision ที่ย้อนกลับยาก
- system-impact register สำหรับการเปลี่ยนที่กระทบระบบ
- bug-case catalog สำหรับบทเรียนที่นำไปใช้ซ้ำได้

#### `t4-project-bootstrap`

ใช้ติดตั้ง T4 operating layer เช่น `CLAUDE.md`, `CONTEXT.md`, glossary, product docs, memory, hooks, `.githooks`, CI, records และ tests

จุดสำคัญคือ repository ที่เป็นผู้จัดส่งมาตรฐานควร apply มาตรฐานกับตัวเอง และมี test ตรวจ self-consistency ของการติดตั้ง

### Design family

| Skill | บทบาท |
|---|---|
| `using-design` | entry point ของ Web Design Suite |
| `design-setup` | สำรวจและเลือก visual direction ก่อน production |
| `design-rules` | typography, color, spacing, responsive และ component rules |
| `design-psychology` | mental model, MAYA, 3 brains และ perceived value |
| `design-audit` | ตรวจ first impression, LIFT, trust และ CTA |

ลำดับการใช้คือ:

```text
design-setup → design-rules → design-psychology → design-audit
```

`design-setup` มี hard decision gates ให้ผู้ใช้เลือก style direction, body layout และ hero composition ก่อน promote เป็น production

`design-rules` แนะนำ Major Third scale 1.25 จาก 16px, body line-height ประมาณ 150%, color ratio 60/30/10, contrast อย่างน้อย 4.5:1 สำหรับ text ขนาดเล็ก, responsive grid 12/8/4 columns, 8pt spacing และ CTA ที่ปรากฏเป็นช่วง ๆ ตลอดหน้า

`design-psychology` เรียงการรับรู้เป็น survival/safety → emotional/MAYA → rational/chunking และใช้ micro-pattern เพื่อสร้าง signature โดยไม่ทำให้ navigation สับสน

`design-audit` ประเมินหน้าเว็บใน 30 วินาที ตั้งแต่ load/OG image, clarity, hierarchy, whitespace, micro-interactions, LIFT, trust และ CTA

### Coding discipline

| Skill | บทบาท |
|---|---|
| `karpathy-guidelines` | คิดก่อนเขียน, ทำให้ง่าย, surgical change และ verify ตาม goal |

## 7. Workflow enforcement และ trust boundary

| ระดับ | กลไก | หน้าที่ |
|---|---|---|
| Soft | `SessionStart` | inject T4 directive และเปิด route ที่เกี่ยวข้อง |
| Soft | `UserPromptSubmit` | แจ้ง route และความแตกต่างระหว่าง skill ที่ควรใช้กับที่ใช้จริง |
| Hard | `PreToolUse` | block action ที่ตรวจสอบรูปแบบได้ |
| Agent-agnostic | `.githooks/pre-push` | ตรวจ issue reference, tree budget และ gate ledger |
| Strongest | CI + branch rules | enforce check ในระบบกลาง |
| Human boundary | Developer approval | ตัดสินใจเรื่องที่เครื่องตรวจไม่ได้ |

active hook path หลักใน `hooks/hooks.json` คือ:

- `t4-session-start`
- `t4-prompt-reminder`
- `t4-gate`
- `t4-turn-end`
- `t4-skill-log`

ระบบจะทำงานเฉพาะ repository ที่มี `.claude/t4.json` ซึ่งเป็น opt-in marker

`t4-gate` ตรวจ action เช่น:

- PR ที่ไม่มี issue reference
- `git reset --hard`
- force push
- branch deletion
- `git clean -f`
- merge ก่อน verify
- merge ก่อน review
- GitHub mutation ผ่าน MCP
- command ที่ไม่สามารถระบุได้ใน T4 repo

ข้อจำกัดที่ควรเขียนบนเว็บไซต์อย่างชัดเจน:

- hooks ไม่สามารถวัดคุณภาพของ judgment
- hooks ไม่สามารถรับประกัน TDD หรือ review depth
- local hooks อาจถูก bypass ด้วย `--no-verify`
- regex ไม่ใช่ shell parser เต็มรูปแบบ
- nested command บางรูปแบบอาจอยู่นอกขอบเขต
- CI และ branch rules แข็งแรงกว่า local hook
- required CI checks ต้องตรวจสถานะ live ก่อนประกาศว่าเปิดใช้งานครบ

แก่นของเรื่องนี้คือ:

> Prompts guide. Hooks enforce checkable actions. CI protects the shared branch. Humans own the judgment boundary.

## 8. T4-Compact และ context management

T4-Compact เป็น research-backed experimental feature ที่กำลังพัฒนา ไม่ควรนำเสนอเป็นฟีเจอร์ production ที่เสร็จสมบูรณ์

แนวคิดคือ model อยู่ข้างใน session จึงไม่สามารถ compact ตัวเองได้ จึงมี supervisor process ข้างนอก session คอย:

```text
Supervisor
  → spawn session
  → อ่าน stream-json
  → รอ request จาก agent
  → ตรวจ valid handoff
  → compact หรือ reopen session
  → ส่งข้อความให้ session อ่าน handoff แล้วทำงานต่อ
```

### ผลการวัดจาก compaction จริง

จาก 113 compactions ใน 10 projects:

- median context ก่อน compact ประมาณ 719K
- median reduction ประมาณ 85%
- compact แล้วเหลือประมาณ 70–105K
- ต่ำกว่า 150K มี median benefit ประมาณ 0%
- 13 จาก 113 ครั้ง compact แล้ว context ใหญ่ขึ้น
- fixed prefix median ประมาณ 63K
- context โตประมาณ 2K ต่อ turn
- summary หนึ่งครั้งมีขนาดประมาณ 50K

### ข้อค้นพบเชิงกลไก

context size ต้องคำนวณจาก:

```text
input_tokens
+ cache_creation_input_tokens
+ cache_read_input_tokens
```

การดูเฉพาะ `cache_read` ทำให้เกิดข้อสรุปผิดได้ เพราะ cache ที่ลดลงอาจย้ายไปอยู่ใน `cache_creation`

เศรษฐศาสตร์ของแต่ละ worker ไม่เหมือนกัน:

- Claude Code อาจได้ประโยชน์จาก in-session compaction
- local model อาจเสียเวลาจากการ re-prefill เมื่อ prefix ถูกเปลี่ยน
- leaf worker แบบ one-shot ไม่จำเป็นต้อง compact
- กลไกที่ portable คือ reopen
- `/compact` เป็น Claude Code adapter ไม่ใช่กลไกทั่วไปสำหรับทุก harness

### สถานะ implementation ปัจจุบัน

plan #304 แบ่งเป็นหลาย slices ได้แก่ probe transport, supervisor, handoff validity, gate, skill, restore และ memory row

สิ่งที่มีแล้วหรือกำลังอยู่ใน branch ปัจจุบัน:

- transport probe ที่ยืนยันว่า `/compact` ส่งผ่าน stream-json ได้
- handoff validator ที่ตรวจ freshness, ownership, completeness และ record/index bijection
- supervisor skeleton สำหรับ spawn, read, watch และ inject
- portable reopen เป็น default path
- `/compact` เป็น opt-in adapter
- acknowledgement ผ่าน `--replay-user-messages`
- fail-closed เมื่อ handoff validator หายหรือ handoff ไม่ valid
- `t4-compact-call` ที่เขียน request แล้ว return ทันที เพื่อไม่ให้ agent รอ supervisor และเกิด deadlock

ป้ายสถานะที่เหมาะสมบนเว็บ:

```text
Research-backed
Experimental implementation
Not yet a completed production feature
```

## 9. Evidence และ case studies

### Routing ลด context

เดิมมีการ inject skill map ประมาณ 8,974 bytes ต่อครั้ง หลังเปลี่ยนเป็น routing และ retrieval เหลือประมาณ 1,368 bytes ต่อ injection และบันทึกว่าประหยัดได้ประมาณ 30,424 bytes ใน session สี่ injections

บทเรียนคือ retrieval-first ช่วยทั้งประหยัด token และลด noise

### Test ที่ผ่านไม่ได้แปลว่าไม่มี defect

ในการ review หนึ่งครั้ง gate suite 94 assertions ผ่าน แต่ reviewer พบ raw control bytes ที่หลุดมาจาก generator

บทเรียน:

> Test ยืนยันเฉพาะ contract ที่ถูกระบุไว้ ไม่ได้ยืนยันว่าระบบไม่มีปัญหาอื่นทั้งหมด

### Feedback queue 16 issues / 16 PRs

การแก้ feedback ทำให้เห็นว่ากฎจำนวนมากไม่ได้ผิดเพราะเขียนไม่ชัด แต่ผิดเพราะไม่มี moment ที่กฎจะถูกเรียกใช้ เช่น:

- ก่อน edit แรกของ multi-leaf task
- ก่อนยิง brainstorm round
- หลัง tool work ก่อน prose reply
- ก่อน close issue
- ก่อนประกาศว่า verify แล้ว

### Self-bootstrap

repository ใช้ bootstrap layer กับตัวเองและมี test ตรวจ marker, settings, hook copies, `.githooks`, CI wiring และ standing-default wording

บทเรียนคือ standard-shipper ต้องพิสูจน์ว่าตัวเองทำตาม standard ที่กำลังจัดส่ง

### Delegation economics

research แสดงว่า:

- Codex เหมาะกับ hard leaf ที่ต้องอ่าน แก้ run และ self-correct
- Antigravity เหมาะกับ artifact ที่ trivial และ single-shot
- local Qwen เหมาะกับ read/gather/format แต่ไม่ควรให้เขียน unsandboxed
- ทุก output ต้อง verify ไม่ว่าจะมาจาก model ใด

ตัวเลข model benchmark เป็น snapshot ตามวันที่ ไม่ควรใช้เป็น product SLA ถาวร

## 10. Website information architecture

| หน้า | วัตถุประสงค์ |
|---|---|
| Home | positioning, workflow loop, proof และ CTA |
| Present | narrative สำหรับนำเสนอผลิตภัณฑ์ |
| Skills | catalog 19 skills พร้อม family และ use case |
| T4 Standard | memory, workflow, records, AFK และ bootstrap |
| Multi-agent | brainstorm, subagents, debug และ master |
| Hooks & Guarantees | สิ่งที่ enforce ได้และสิ่งที่ยังเป็น human judgment |
| Research | metrics, methodology และ benchmark snapshots |
| Blog | case studies, decisions, failures และ lessons |
| Install | skills installer, plugin และ bootstrap |
| Docs | operational detail ที่ชี้กลับไป source |
| GitHub | source, issues, release และ contribution |

### Homepage section order

1. Hero: `From prompts to shipped work—with evidence.`
2. ปัญหา: single-shot AI และ human bottleneck
3. Four outcomes: Route, Delegate, Remember, Verify
4. Workflow diagram
5. Evidence cards
6. Trust boundary และข้อจำกัด
7. Skill families
8. Installation
9. Latest research และ blog

ไม่ควรทำหน้าแรกเป็น card grid ของ skill 19 ใบที่ไม่มี hierarchy ควรให้ผู้ใช้เริ่มจาก intent:

```text
ฉันต้องการ...
  → ออกแบบ UI
  → debug
  → สร้าง feature
  → ส่งงานให้ agent อื่น
  → ทำงานแบบ AFK
  → bootstrap repository
```

## 11. Present deck ที่แนะนำ

1. The AI bottleneck
2. Why single-shot agents drift
3. xeno-skills คือ operating layer
4. Four routes: Route, Delegate, Remember, Verify
5. Clink: judgment vs execution
6. T4 workflow จาก idea ถึง merge
7. Enforcement ladder
8. Evidence จาก real work
9. Honest limits
10. Install และ next step

ควรมี failure case ใน presentation ด้วย เพราะ failure case แสดงว่า architecture เกิดจากปัญหาจริง ไม่ใช่ diagram ที่ออกแบบในสุญญากาศ

## 12. Blog pillars และหัวข้อเริ่มต้น

### Operating system

- Why documented rules still fail
- What “agent-primary repository” actually means
- How T4 turns workflow into a repeatable operating layer
- Why memory must be retrieval-first

### Multi-agent

- Brainstorm is not delegation
- Delegate the leaves, own the tree
- Why every subagent result still needs verification
- How fresh lineage improves debugging

### Evidence and failure

- The 94-assertion gate that still missed raw control bytes
- When an agent’s receipt is not evidence
- Why a rule needs a moment to fire
- What 16 feedback PRs taught us about enforcement

### Context economics

- What 113 real compactions revealed
- Why `cache_read` is not context size
- Reopen versus compact
- Why local models invert the compaction economics

### Design

- Designing a developer-tool website without AI landing-page clichés
- The 30-second audit
- Three brains, MAYA and LIFT
- Why xeno’s design suite has hard user decision gates

## 13. Content model สำหรับเว็บ

ไม่ควร copy ข้อมูลจากหลายไฟล์ด้วยมือ เพราะจะเกิด documentation drift แบบที่ README ภาษาไทยและอังกฤษมีอยู่แล้ว

ควรสร้าง content model ที่ derive จาก source เช่น:

```text
Skill
- slug
- family
- title
- summary
- audience
- triggers
- prerequisites
- outputs
- maturity
- sourcePath
- updatedAt
```

```text
Evidence
- claim
- metric
- method
- date
- sourcePath
- confidence
- limitation
```

```text
BlogPost
- slug
- title
- language
- category
- date
- relatedSkills
- evidence
- maturity
```

แหล่งข้อมูลที่ควรเป็น canonical:

- skill catalog → `skills/**/SKILL.md`
- routing → generated `hooks/routing-table.json`
- product/brand → `PRODUCT.md`
- glossary → `UBIQUITOUS_LANGUAGE.md`
- workflow → `docs/development-workflow.md`
- evidence → `docs/research/*`
- history → `DONE.md`
- open work → `docs/OPEN-WORK-LEDGER.md`

ทุก metric card ควรมีจำนวน, วันที่วัด, วิธีวัด, source และ limitation

## 14. Brand และ visual direction สำหรับเว็บ

เว็บไซต์ควรสื่อว่า xeno-skills เป็น engineering system ไม่ใช่ AI magic

แนวทางที่สอดคล้องกับ product และ design skills:

- ใช้ text-first layout ที่อ่าน source และ evidence ได้ง่าย
- ใช้ neutral base, accent เดียว และ contrast สูง
- ใช้ typography ที่มีเอกลักษณ์แทน default Inter โดยไม่จำเป็น
- ใช้ whitespace เพื่อสื่อความมั่นใจและ value
- ใช้ diagram, transcript excerpt, test result และ timeline เป็น visual material
- แสดง dissent และ limitation แทนการสร้างภาพว่า multi-agent เห็นตรงกันเสมอ
- ใช้ familiar navigation ตาม mental model ของเว็บไซต์ developer tool
- ใช้ micro-interaction เป็น signature ไม่ทำให้ workflow ซับซ้อน

ควรหลีกเลี่ยง:

- generic purple/cyan AI gradient
- glassmorphism และ 3D ที่ไม่ช่วยอธิบายระบบ
- card grid สามคอลัมน์แบบ SaaS ทั่วไป
- claim ขนาดใหญ่ที่ไม่มี source
- animation หนักจนอ่าน evidence ไม่ได้

Repo ตั้งใจไม่มี `DESIGN.md` เพราะเป็น developer-tools library ไม่ใช่ visual product โดยตรง ดังนั้น design suite เป็น guidance สำหรับการสร้างเว็บไซต์ ไม่ควรถูกตีความว่าเป็น brand specification ที่สมบูรณ์อยู่แล้ว

เว็บไซต์ควรมี EN/TH ที่มีรายละเอียดเท่ากันในหน้าหลักและเอกสารสำคัญ ไม่ใช่แปลไทยแบบย่อจนสูญเสียเงื่อนไขหรือ limitation

## 15. สถานะที่ควรใช้ในเว็บไซต์

### Implemented / operational

- 19 skills
- plugin manifest
- skill discovery
- T4 workflow documentation
- memory layer
- canonical hooks
- bootstrap copies
- Git guards
- contract tests
- CI workflow definition
- bilingual conventions

### Research-backed แต่ต้องใส่วันที่

- model capability matrix
- delegation economics
- 113 compaction measurements
- OpenCode compatibility survey
- Thai Token Optimizer audit
- composition audits กับ ecosystem อื่น

### Experimental / in progress

- T4-Compact supervisor
- `t4-compact-call`
- compaction policy และ thresholds
- full reopen lifecycle
- completed compact skill
- portability across every harness

### Internal-only หรือควรสรุปก่อนเผยแพร่

- raw open-work ledger
- Obsidian vault
- agent invocation logs
- internal issue numbers
- environment-specific paths
- unresolved GitHub work
- billing incident ที่ยังไม่ตรวจ live

## 16. ข้อควรระวังด้านความถูกต้อง

1. อย่าแสดง T4-Compact ว่า production-ready
2. อย่าใช้ model benchmark เป็น SLA ถาวร
3. อย่าเขียนว่า hooks enforce TDD หรือ code quality ทั้งหมด
4. อย่า copy operational status จาก README โดยไม่ตรวจ source ล่าสุด
5. ควรแก้ EN/TH documentation drift ก่อนใช้เป็น data source ของเว็บ
6. ควรแสดง `implemented`, `tested but dark`, `planned` แยกจากกัน
7. อย่าสร้าง catalog แบบ manual duplication จาก `SKILL.md`
8. ควรระบุว่า clink ต้องใช้ PAL/openclink หรือ MCP ที่เกี่ยวข้อง
9. ควรแสดง human approval เป็นส่วนหนึ่งของ architecture
10. ทุก claim ควรมี date, evidence และ limitation

## 17. Installation content

คำสั่งที่ README ระบุไว้:

```bash
npx skills add xenodeve/xeno-skills
npx skills add xenodeve/xeno-skills --skill clink-brainstorm
```

สำหรับ plugin:

```text
/plugin marketplace add xeno-skills
/plugin install xeno-skills
```

เว็บไซต์ควรอธิบายความแตกต่างของสองเส้นทาง:

- skills installer: ติดตั้ง skill ตามที่ต้องการ
- plugin: ติดตั้ง skill และ hook integration
- bootstrap: นำ T4 operating layer เข้า repository ที่ต้องการใช้มาตรฐานแบบ self-contained

ต้องระบุด้วยว่า hook จะทำงานเฉพาะ repo ที่มี `.claude/t4.json`

## 18. Source map

### Product และ brand

- `PRODUCT.md`
- `CONTEXT.md`
- `UBIQUITOUS_LANGUAGE.md`
- `README.md`
- `README.en.md`

### Presentation และ workflow

- `docs/agentic-workflow-presentation.md`
- `docs/development-workflow.md`
- `docs/agents/workflow.md`
- `docs/agents/issue-tracker.md`
- `docs/agents/domain.md`

### Enforcement

- `docs/adr/0001-hook-based-workflow-enforcement.md`
- `hooks/hooks.json`
- `hooks/t4-gate`
- `.githooks/pre-push`
- `.github/workflows/t4-verify.yml`
- `.claude/t4.json`

### Memory และ project history

- `DONE.md`
- `docs/OPEN-WORK-LEDGER.md`
- `Obsidian-xeno-skills/Home.md`

### Research

- `docs/research/2026-08-21-compaction-yield.md`
- `docs/research/2026-07-16-subagent-delegation-log.md`
- `docs/research/2026-07-16-subagent-vs-self-token-economics.md`
- `docs/research/2026-08-05-clink-model-inventory-refresh.md`
- `docs/research/2026-08-11-opencode-compatibility-survey.md`
- `docs/research/2026-08-12-thai-token-optimizer-hook-architecture.md`
- `docs/research/2026-08-14-compliance-hook-surface-across-harnesses.md`
- `docs/research/2026-08-04-xeno-vs-9arm-composition-audit.md`
- `docs/research/2026-08-04-xeno-vs-superpowers-composition-audit.md`
- `docs/research/2026-08-04-xeno-vs-mattpocock-composition-audit.md`
- `docs/research/2026-08-04-xeno-vs-impeccable-composition-audit.md`

### Skill source

- `skills/ask-xeno/SKILL.md`
- `skills/using-clink/SKILL.md`
- `skills/clink-brainstorm/SKILL.md`
- `skills/clink-debug/SKILL.md`
- `skills/clink-masteragent/SKILL.md`
- `skills/clink-subagents/SKILL.md`
- `skills/using-t4/SKILL.md`
- `skills/t4-project-bootstrap/SKILL.md`
- `skills/t4-agent-memory/SKILL.md`
- `skills/t4-dev-workflow/SKILL.md`
- `skills/t4-engineering-records/SKILL.md`
- `skills/t4-afk/SKILL.md`
- `skills/t4-bro/SKILL.md`
- `skills/using-design/SKILL.md`
- `skills/design-setup/SKILL.md`
- `skills/design-rules/SKILL.md`
- `skills/design-audit/SKILL.md`
- `skills/design-psychology/SKILL.md`
- `skills/karpathy-guidelines/SKILL.md`

## 19. Final positioning

สำหรับเว็บไซต์ present/blog ควรเล่า xeno-skills เป็นระบบที่ทำให้ software agent ทำงานได้อย่างมีวินัยและตรวจสอบได้ โดยมี 4 คำหลัก:

```text
Route
Delegate
Remember
Verify
```

เว็บไซต์ที่ดีของ xeno-skills ไม่ควรขายความรู้สึกว่า AI ฉลาดมหัศจรรย์ แต่ควรทำให้ผู้ชมเห็น:

1. ปัญหาที่เกิดขึ้นจริง
2. กลไกที่แก้ปัญหา
3. หลักฐานที่รองรับ
4. ขอบเขตที่ระบบยังทำไม่ได้
5. วิธีทดลองใช้ด้วยตัวเอง

นั่นคือความแตกต่างระหว่าง xeno-skills กับ prompt collection ทั่วไป และเป็น narrative หลักที่ควรใช้ร่วมกันทั้งหน้า Present, หน้า Skills และ Blog
