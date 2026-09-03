---
title: Agentic Framework
description: มาตรฐานปฏิบัติการสำหรับ repo ที่ agent เป็น developer หลัก — xeno-skills · openclink · clone space
---

# Agentic Framework

## hero

framework นี้คือ **xeno-skills** — skills, เลเยอร์เวิร์กโฟลว์, memory และ hooks ที่ทำให้ agent เป็น developer หลักของ repo ได้ เครื่องมือสองตัวที่อยู่ใต้ลงมาเป็นเครื่องมือที่ถูกเรียก ไม่ใช่ผลิตภัณฑ์พี่น้อง: **openclink** — transport ที่ครอบครัว multi-agent ใช้ และ **Clone Space** — แหล่งอ้างอิงที่ให้ design family ยึด frontend ให้ติดกับเว็บไซต์จริง

เรื่องเล่าที่วนกลับมาทั้ง site และใช้ในทุกหน้า:

**ปัญหาจริง → กลไกที่แก้ → หลักฐานที่ยืนยัน → ข้อจำกัดที่ยังมี → วิธีลองด้วยตัวเอง**

## problem

xeno-skills ไม่ใช่ชุด prompt ทั่วไป — เป็นเลเยอร์ปฏิบัติการสำหรับ repo ที่ coding agent คือ developer หลัก ปัญหาสี่ข้อเหล่านี้วนกลับมาทุกครั้งในสภาพนั้น:

### มนุษย์นั่งอยู่ตรงกลาง

การรัน AI หลายตัวทีละที ทำให้ developer อยู่กลางคำตอบทุกครั้ง — อ่าน สรุป แล้วตอบคำถามเดิมซ้ำ ความตั้งใจคือ master agent รับโจทย์ครั้งเดียว เลือก skills เอง และ dispatch งาน ให้มนุษย์ approve เฉพาะสรุปและจุดตัดสินใจที่สำคัญ ณ ช่วงเวลาที่เหมาะสม — ไม่ใช่ทุกขั้นตอน

### โมเดลเดียว ถามครั้งเดียว ข้ามบางอย่างไป

แต่ละโมเดลมีจุดแข็งและจุดอับต่างกัน การถามโมเดลเดียวครั้งเดียวอาจข้าม edge case ปัญหาความเข้ากันได้ หรือสมมติฐานที่ไม่เคยถูกทดสอบ `clink-brainstorm` จึงรัน agent หลายคนพร้อมเลนส์ความคิดหลายแบบ ให้มีความเห็นต่างและ challenge loop ก่อนลงข้อสรุป

### context ลืม และเวิร์กโฟลว์เอนเอียง

เมื่อ session สิ้นสุดหรือ context ถูก compact agent อาจเก็บข้อสรุปไว้แต่เหตุผล หลักฐาน และคำถามที่ถูกตั้งไว้แล้วนั้นหาย ชั้น T4 มี memory layer, ledger, records และ handoff เพื่อให้ agent เปิดเฉพาะส่วนที่เกี่ยวข้องของเหตุผลกลับมาได้

### เขียนไว้ ≠ บังคับได้

กฎที่อาศัยอยู่เพียงใน prompt หรือเอกสาร สามารถถูกข้ามได้ถ้าไม่มีอะไรตรวจ ถ้ากฎสำคัญไม่มี check ที่รันได้ xeno-skills ถือว่าเป็นข้อบกพร่องของระบบ ไม่ใช่แค่ความล้มเหลวของ agent เท่านั้น

## four-outcomes

framework สรุปเป็นสี่สิ่งที่ agent ไว้ใจให้ทำได้:

### Route

เลือก skill และ phase ที่ถูกต้องก่อนลงมือ แล้ว re-route ทุก phase boundary `ask-xeno` และ `using-t4` คือจุดเข้า แผนที่บอกว่างานต้องการวินัยไหน

### Delegate

ส่งงาน leaf ที่มีขอบเขตและครบในตัวเองให้ agent อื่น ขณะที่ master ครอบครองการแยกส่วน การรวม และ verification สุดท้าย — "ส่งต่อใบไม้ ครอบครองทั้งต้น"

### Remember

เก็บ working state ให้ยั่งยืน retrieval-first — ดัชนีที่ skim แล้วเปิดเฉพาะ slice ที่จำเป็น — เพื่อให้งานรอดผ่าน compact และ session ใหม่

### Verify

ไม่มีอะไร "เสร็จ" โดยไม่มีหลักฐาน: คำสั่งที่คุณรัน output ของมัน หรือ `file:line` ที่อ่าน คำตัดสินทุกคำต้องการ artifact ที่ระบุชื่อ

## mini-architecture

งานไหลผ่าน framework อย่างไร:

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

กฎที่ควรเป็นพาดหัวได้:

> **ส่งต่อใบไม้ ครอบครองทั้งต้น**

worker ดูแลงานที่มีขอบเขตและตรวจได้ master รับผิดชอบการแยกส่วน สถาปัตยกรรม การรวม verification สุดท้าย trust boundary, output สองภาษา judgment ที่ตรวจไม่ได้ และข้อเสนอแนะสุดท้ายให้มนุษย์ ผลจาก subagent **ไม่ใช่** หลักฐานโดย default — diff, output, test, build และ side effects ถูกตรวจอีกครั้ง

## workflow

pipeline ที่ agent เดินตามตั้งแต่ไอเดียถึง merge:

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

survey คือขั้นตอนที่ถูก skip มากที่สุด: หาทุก occurrence, mirror, caller, test, doc และ config ที่การเปลี่ยนแปลงแตะ — ไม่ใช่แค่ไฟล์แรกที่ได้ มันคือ action trigger (ก่อนสิ่งแรกที่เขียนลงว่า "จะเปลี่ยนอะไร") ไม่ใช่ phase ที่รู้ตัวหลังข้ามไปแล้ว

## skills

skills จัดกลุ่มตาม family hover ชื่อดูบรรทัดสรุป เปิดดูต้นเรื่องเบื้องหลัง — ปัญหาจริง กลไกที่ตอบโจทย์ และหลักฐานของมันพร้อมข้อจำกัดที่ถูกประกาศไว้ skills ที่ไม่มีต้นเรื่องของตัวเองจะสืบทอดต้นเรื่องของ family และระบุเช่นนั้น

## multi-agent

ครอบครัว `clink` คือวิธีที่ agent หนึ่งประสานงาน agent อื่น ๆ โดยแยก **judgment** ออกจาก **execution**:

- `clink-brainstorm` — แผงตัดสินใจ ไม่ใช่ผู้ลงมือหลาย agent หลายเลนส์ challenge loop และ adversarial round ที่บังคับหลังบรรจบ
- `clink-subagents` — งาน leaf ที่มีขอบเขตครบในตัวเอง พร้อมสูตร token economics ที่ตัดสินว่า delegate หรือเก็บไว้เอง
- `clink-debug` — falsify และซ่อมด้วย lineage ใหม่ — agent ที่ตั้งสมมติฐานไม่ falsify ของตัวเอง
- `clink-masteragent` — การเลือก model, effort และ verification ของ orchestrator พร้อมตาราง score ในไฟล์

transport เบื้องหลังครอบครัวคือ **openclink** — MCP ที่ skills `clink` เรียก ต้นเรื่อง การค้นพบจาก deep-scan และหลักฐานของมันอยู่บนหน้าที่خصص: [openclink →](/ecosystem/openclink)

## t4-standard

ชั้น T4 คือมาตรฐานปฏิบัติการที่ agent รันบน โดยจัดโครงสร้างแบบ retrieval-first — ดัชนีที่ skim แล้วเปิดเฉพาะ slice ไม่ใช่กำแพงข้อความ:

- **`t4-agent-memory`** — ชั้น memory: team vault, open-work ledger, ship log และ records โครงสร้างที่ทำให้ agent อนาคตดึงเพียง slice ที่เกี่ยวข้อง
- **`t4-dev-workflow`** — pipeline ตั้งแต่ intake ถึง merge พร้อมกฎที่รักษา claim ไว้ใน register ที่หลักฐานรองรับ
- **`t4-engineering-records`** — จะเขียน record ไหน (post-mortem, ADR, impact register, bug case) และอย่างไรให้มันยังเป็น index ที่น่าเชื่อถือ
- **`t4-afk`** — งานไร้คนดูในขอบเขตที่อนุมัติ พร้อม gate ต่อ item และ digest สุดท้ายว่าทำอะไรข้ามอะไรและจอดอะไรไว้
- **`t4-project-bootstrap`** — ติดตั้งเลเยอร์ปฏิบัติการเข้า repo และพิสูจน์ว่า repo ที่ ship standard นี้ปฏิบัติตามจริง

## hooks

การบังคับใช้เป็นบันได แต่ละขั้นตรวจสิ่งที่ขั้นใต้ตรวจไม่ได้:

```text
Soft       SessionStart      — inject the directive, open the relevant route
Soft       UserPromptSubmit  — name the route and the skill that should apply
Hard       PreToolUse        — block an action whose shape is checkable
Agent-agnostic  .githooks/pre-push — issue reference, tree budget, gate ledger
Strongest  CI + branch rules — enforce a check in a shared system
Human      developer approval — decide what a machine cannot check
```

ข้อจำกัดที่พูดตรง ๆ: hooks วัดคุณภาพของ judgment ไม่ได้ ไม่อาจรับประกัน TDD หรือความลึกของการ review hooks ระดับ local ข้ามได้ด้วย `--no-verify` regex ไม่ใช่ shell parser ที่สมบูรณ์ และคำสั่ง nested บางรูปแบบอยู่พ้นขอบเขตของมัน CI และ branch rules แข็งแกร่งกว่า hook ระดับ local

> Prompt คอยชี้ทาง Hooks บังคับสิ่งที่ตรวจสอบได้ CI คุ้มครอง branch ร่วมกับมนุษย์เป็นเจ้าของ boundary ของ judgment

## research

หลักฐานทุกชิ้นมีวันที่ แหล่งที่มา และข้อจำกัด snapshot เป็นของวันที่บันทึก ไม่ใช่การรันใหม่

### Routing ลด context

เปลี่ยนจากการ inject skill map ทั้งก้อนเป็น routing + retrieval การ inject ลดจากประมาณ 8,974 bytes เหลือประมาณ 1,368 bytes ต่อครั้ง — ประหยัดรวมราว 30,424 bytes ตลอด session ที่ inject 4 ครั้ง

### Gate ผ่าน ไม่เท่ากับสะอาดหมดจด

ในหนึ่ง review ชุด gate 94 assertions ผ่าน ขณะที่ผู้ review พบ control bytes เล็ดลอดจาก generator บทเรียน: *test ยืนยัน contract ที่ประกาศ ไม่ใช่การไม่มีปัญหาอื่นทั้งหมด*

### compaction 113 ครั้งจริง

ตลอด 113 compactions ใน 10 projects: context ก่อน compact มัธยฐานประมาณ 719K มัธยฐานของส่วนที่ลดลงประมาณ 85% และ 13 จาก 113 ทำให้ context **โตขึ้น** ขนาด context ต้องคำนวณจาก `input_tokens` + `cache_creation` + `cache_read` — อ่านแต่ `cache_read` จะลงข้อสรุปผิด

### feedback issues 16 รายการ PR 16 ตัว

การแก้ไขคิว feedback เผยว่ากฎจำนวนมากล้มเหลวไม่ได้เป็นเพราะไม่ชัดเจน แต่เพราะ **ไม่มีช่วงเวลาที่มัน fire** — ก่อน edit แรกของงาน multi-leaf, ก่อนรอบ brainstorm, หลัง tool work ก่อน prose reply, ก่อนปิด issue, ก่อนประกาศ "verify แล้ว"

### T4-Compact: รองรับด้วยงานวิจัย ไม่ใช่ production

T4-Compact เป็นฟีเจอร์ทดลองที่มีงานวิจัยรองรับ กำลังพัฒนาอยู่ — supervisor อยู่นอก session ที่ compact หรือเปิดใหม่ให้ session มัน **ไม่ใช่** ฟีเจอร์ production ที่เสร็จแล้ว สถานะ: *research-backed · experimental implementation · ยังไม่ใช่ production*

## built-on

เครื่องมือสองตัวที่ framework เรียก ไม่ใช่ผลิตภัณฑ์พี่น้องสองตัว **openclink** คือ transport ที่ครอบครัว `clink` เรียกสำหรับการ orchestration หลาย agent **Clone Space** เก็บ snapshot ของหน้าเว็บทำงานให้ replay ออฟไลน์ได้พร้อม motion — แหล่งอ้างอิงที่ให้ design family ยึด frontend กับเว็บไซต์จริง Clone Space ยังอยู่ในขั้น **developing** ใน ecosystem นี้ (wiring ของ design family ยังไม่ถูก implement) ซึ่งระบุไว้บนหน้าที่ของตัวมัน ไม่ซ่อน

## install

สามเส้นทาง และต่างกันในตัวเอง:

- **Skills installer** — ติดตั้ง skills ที่ต้องการ: `npx skills add xenodeve/xeno-skills` หรือ skill เดียวด้วย `--skill clink-brainstorm`
- **Plugin** — ติดตั้ง skills พร้อม hook integration: `/plugin marketplace add xeno-skills` แล้ว `/plugin install xeno-skills`
- **Bootstrap** — นำเลเยอร์ปฏิบัติการ T4 เข้า repo ที่ควรรัน standard นี้ได้เองแบบ self-contained

hooks รันเฉพาะใน repo ที่มี `.claude/t4.json` — file นี้คือ opt-in

## blog-teaser

บันทึกภาคสนามจากการรัน standard กับงานจริง — case study, จุดตัดสินใจ, ความล้มเหลว และบทเรียน
