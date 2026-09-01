---
title: "Clone Space (clone-space-mcp) — Present & Blog Content Brief"
description: "สรุปผลิตภัณฑ์ สถาปัตยกรรม หลักฐาน และแนวทางนำเสนอ Clone Space บนเว็บไซต์ ในฐานะเครื่องมือสนับสนุน xeno-skills"
status: working-brief
source_repository: "D:\\Github\\Clone Space"
snapshot_date: "2026-09-02"
snapshot_commit: "main @ 205a616c (2026-08-17)"
audience:
  - human developers
  - engineering leads
  - AI-agent builders (โดยเฉพาะทีมที่ทำ design/frontend agent)
  - contributors
---

# Clone Space (clone-space-mcp) — Present & Blog Content Brief

เอกสารนี้สรุป `clone-space-mcp` จาก snapshot วันที่ 2 กันยายน 2026 (branch `main`, commit `205a616c`) เพื่อใช้เป็นฐานข้อมูลสำหรับเว็บไซต์นำเสนอผลิตภัณฑ์และบล็อกเชิงวิศวกรรมของทีม T4 Labs

เอกสารนี้ไม่ใช่การคัดลอก `README.md` หรือ ADR ทั้งหมดมาแสดงต่อผู้ใช้ แต่เป็นชั้นอธิบายสำหรับมนุษย์ โดยชี้กลับไปยัง source of truth ใน repository เมื่อจำเป็น รายละเอียดสถาปัตยกรรมเชิงลึกอยู่ใน [`clone-space-analysis.md`](clone-space-analysis.md) — ไฟล์นี้เน้นมุม positioning/content สำหรับเว็บ

---

## 1. Executive summary

**Clone Space archive หน้าเว็บจริงบน internet ให้ replay แบบออฟไลน์โดยที่ motion ยังทำงานอยู่จริง แล้วบอกด้วยว่าบรรทัดโค้ดไหนเป็นตัวขับการเคลื่อนไหวนั้น** ไม่ใช่แค่ "archive เว็บได้แบบ offline replay" เฉย ๆ — นี่คือเครื่องมือให้ **AI agent อ่าน mechanism ของ frontend จริงจากเว็บไซต์ที่มีอยู่จริง** ได้ ไม่ใช่แค่ดู markup หรือ screenshot

**Framing หลักที่ต้องใช้บนเว็บไซต์ (จาก brief ของเจ้าของโปรเจกต์ — ดูหมายเหตุด้านล่าง):** Clone Space คือ **anti-AI-slop design research tool** — เมื่อ agent ต้องออกแบบ frontend และเสี่ยงจะสร้างงานที่ดูเหมือน "AI generate ทั่วไป" (gradient ม่วง-ฟ้าซ้ำ ๆ, glassmorphism ที่ไม่มีเหตุผล, card grid สามคอลัมน์แบบ SaaS ทั่วไป) Clone Space ให้ agent **capture เว็บไซต์จริงที่มี design/motion ที่ดี แล้ว replay+extract ดูกลไกจริงเบื้องหลัง** — ไม่ใช่แค่ก็อป CSS แต่เห็นว่า timing, easing, trigger, library ตัวไหนถูกใช้จริง และที่บรรทัดไหน

> **หมายเหตุความถูกต้อง:** ประโยค "anti-AI-slop" **ไม่ใช่คำที่ปรากฏใน repo ของ Clone Space เอง** README/CLAUDE.md ของ Clone Space นิยาม north-star ของตัวเองด้วยภาษาที่เป็นกลางกว่า — "replay offline with real fidelity" + "AI agent can consume it and explain how the page is built" (`CLAUDE.md:20-24`) framing "anti-AI-slop" คือ**การตีความบทบาทของเครื่องมือนี้ภายใน ecosystem ของ xeno-skills** ตามที่เจ้าของโปรเจกต์อธิบายไว้สำหรับ brief นี้โดยตรง — ใช้ได้บนเว็บ present/blog ในฐานะ positioning statement ของทีม แต่**ต้องไม่เขียนราวกับว่าเป็นคำที่ repo ประกาศไว้เอง**

ประโยค positioning ที่เหมาะกับเว็บไซต์:

> Clone Space lets an agent read how a real website actually moves — before it designs the next one.

ฉบับภาษาไทย:

> Clone Space ให้ agent เห็นว่าเว็บไซต์จริงเคลื่อนไหวและถูกสร้างขึ้นมาอย่างไร ก่อนจะไปออกแบบเว็บถัดไป

---

## 2. Repository snapshot และขอบเขตความจริง

- repository: `xenodeve/clone-space-mcp` (`README.md` ไม่ระบุ org ตรง ๆ แต่ `docs/adr/` และ `DONE.md` อ้างอิง `xenodeve/clone-space-mcp` และ `xenodeve/xeno-skills` เป็น cross-reference)
- branch อ่าน: `main`, commit `205a616c` (2026-08-17)
- package version: `0.1.0-alpha.0` (`package.json`)
- license: **ยังไม่เลือก** (`README.md:337`)
- สถานะที่ README ประกาศเอง: **"Alpha, and honest about it. All four stages run end to end"** (`README.md:322`)

ตัวเลขในเอกสารนี้ (เช่น 82,613 ตัวอักษร GLSL, 153 mutation entries, exit code ของ equivalence gate) เป็นข้อมูลจากเอกสารและบันทึกการทำงานตามวันที่ระบุ ไม่ใช่ผลการรันใหม่ในวันที่สร้างเว็บไซต์ — ต้องตรวจซ้ำก่อนอ้างว่าเป็นสถานะปัจจุบันหากเวลาผ่านไปนาน

---

## 3. Jobs-to-be-done — Clone Space ในฐานะเครื่องมือสนับสนุน xeno-skills (ไม่ใช่ยืนเดี่ยว)

Clone Space **ไม่ใช่ผลิตภัณฑ์ปลายทางที่ผู้ใช้ทั่วไปเปิดเว็บแล้วกดใช้เอง** มันคือ MCP server ที่ agent (โดยเฉพาะ agent ที่ทำงานภายใต้ xeno-skills' design family — `design-setup`, `design-rules`, `design-psychology`, `design-audit`, `design-taste-frontend` และสกิลออกแบบอื่น ๆ) เรียกใช้เป็นขั้นตอนหนึ่งของ workflow

**Job ที่ 1 — หา design reference ที่มีกลไกจริงรองรับ ไม่ใช่แค่ดูสวย**
เมื่อ agent ต้องออกแบบ hero section ที่มี motion, agent สามารถ `capture_page` เว็บที่มี motion แบบที่ต้องการ → `replay_page` เพื่อยืนยันว่า motion รันจริง → `extract_behaviour` เพื่อดู mechanism ที่แท้จริง (timing, easing, library, trigger) แทนที่จะเดาจาก screenshot หรือความจำของโมเดล

**Job ที่ 2 — ป้องกันไม่ให้ agent เดา CSS/animation แบบผิด ๆ จนออกมาเป็น "AI slop"**
โมเดลภาษาที่ไม่เห็นโค้ดจริงมักสร้างงานออกแบบที่วน pattern ซ้ำ ๆ (gradient ม่วง-ฟ้า, glassmorphism ไม่มีเหตุผล — ตรงกับรายการ anti-pattern ที่ `xeno-skills-present-blog-brief.md` §14 เตือนไว้พอดี) การให้ agent เห็น behaviour graph จริงพร้อม `file:line` เป็น grounding ที่ทำให้การตัดสินใจออกแบบอิงหลักฐาน ไม่ใช่การสุ่มจากการกระจายทั่วไปของ pattern ที่โมเดลเคยเห็น

**Job ที่ 3 — ตรวจสอบว่า clone/reference ที่ทำขึ้นพฤติกรรมตรงกับต้นฉบับจริงหรือไม่**
`bun run equivalence <url>` ให้ agent วัดว่า replay ตรงกับ live page จริงในมิติที่ระบุ (scroll, motion settled, interaction, network) ก่อนเชื่อว่า reference ที่ capture มาใช้ได้

**สิ่งที่ Clone Space ไม่ทำ:** มันไม่ใช่ scraper สำหรับเก็บ content, ไม่ใช่ browser automation ทั่วไป (ไม่ใช่ Playwright wrapper เฉย ๆ), และไม่ใช่เครื่องมือสร้างเว็บ — มันตอบคำถามเดียว: **"เว็บที่มีอยู่จริงนี้ ทำงานยังไง"**

---

## 4. Product DNA / Positioning statement

### Fidelity over convenience

การตัดสินใจที่แบกน้ำหนักที่สุดคือ replay URL เดิมด้วย HAR แทนการ serialize DOM ที่ hydrate แล้ว — เพราะการ serialize ทำลาย hydration และ entry animation ซึ่งเป็นจุดประสงค์หลักของโปรเจกต์ (`README.md:11-14`)

### Honest about what it cannot do

ทุกข้อจำกัดถูกบันทึกไว้พร้อมตัวเลขวัดจริง แทนที่จะซ่อนไว้: `listener_execution` 0% ในทุก verdict, CSS transition ไม่อยู่ใน behaviour graph, `layout.scrollHeight` race ที่ยังไม่ปิด (#187) — ดูรายละเอียดใน `clone-space-analysis.md` §6

### Reported, never guessed

ทุกจุดที่ไม่แน่ใจ ระบบรายงานว่าไม่แน่ใจแทนที่จะเดา: `identity-unresolved`, `"undetermined"` tri-state, `unrepresented`, `unservable` — pattern เดียวกันซ้ำในทุก ADR

### Measured, not argued

ทุก decision สถาปัตยกรรมใหญ่มีการวัดจริงกำกับ (CDP spike, mutation corpus, metamorphic check, equivalence verdicts) — ดู §7

### Security-conscious but not naive

credential/cookie/token ถูก redact ก่อน publish เสมอ (ADR 0003) **แต่ response body ไม่ถูก redact และไม่มีทางถูก redact ได้** (ADR 0009) — เพราะ replay ต้องใช้ response body เป็นวัตถุดิบในการรันหน้าเว็บใหม่ นี่คือ trade-off ที่ต้องสื่อสารตรง ๆ บนเว็บไซต์ ไม่ใช่ซ่อนไว้

---

## 5. สถานะ — production / active / experimental แยกตาม feature

**อย่าประกาศทั้งโปรเจกต์ว่า "production"** README เองประกาศว่า Alpha ทั้งระบบ (`README.md:322`) ตารางนี้แยกตาม feature เพื่อให้เว็บไซต์สื่อสารสถานะแบบละเอียดพอที่จะเชื่อถือได้:

| Feature | สถานะ | หลักฐาน |
|---|---|---|
| `capture_page` — HAR record + adaptive sweep + bounded interaction | **Active, ship ครบ** | ADR 0001–0007, 0009 ทั้งหมด Accepted; ใช้งานได้ end-to-end |
| `replay_page` — `routeFromHAR` navigate URL เดิม | **Active, ship ครบ** | README §Replay |
| `restoreTiming` (replay option) | **Experimental, off by default** | ต้นทุน wall-clock สูง (825ms→4577ms); วัดบนแค่ 1 fixture + 1 เว็บจริง (`README.md:129-134`) |
| `extract_behaviour` — behaviour graph + sourcemap resolution | **Active** แต่มีข้อจำกัดที่รู้อยู่ (CSS transition ไม่แสดง) | `docs/agents/using-the-tools.md` |
| `inspect_archive` (Bun, ไม่ต้องมี agent) | **Active, ship ครบ** | README §Serve |
| 4 MCP tools ผ่าน stdio | **Active** (layer 1–3 shipped, #124/#126) | `docs/OPEN-WORK-LEDGER.md` |
| Equivalence gate (`bun run equivalence`) | **Active แต่ verdict ยังไม่ reproducible เต็มที่** — #187 (`layout.scrollHeight` race) ยังเปิดอยู่ | `docs/reports/2026-08-17-equivalence-verdicts.md` |
| `listener_execution` coverage | **ยังไม่ implement** — 0% ในทุก verdict ที่บันทึกไว้ | `README.md:328-329` |
| Element identity (`wa:` id + fingerprint) | **Active** บน fixture (63/63); ADR เองบอกว่านี่คือ "floor ไม่ใช่ ceiling" สำหรับเว็บจริง | `docs/adr/0002-...md:136-141` |
| Target discovery (OOPIF/worker/popup) | **Active with known gap** — target ที่เกิด-ตายระหว่าง navigate หลุด (ADR 0008) | `docs/adr/0008-...md` |
| WebSocket private-address refusal | **Active with known gap** — ครอบเฉพาะ IP literal ไม่ครอบ hostname (#185) | `DONE.md`, `docs/agents/using-the-tools.md` |
| CI required checks (GitHub Actions) | **ไม่ทำงาน** — ล็อกเรื่อง billing (#2); มี self-attested check (`t4-verify`) แทนตั้งแต่ 2026-08-16 | `CLAUDE.md:107-136` |
| Mutation corpus / fixture sites / ADR / metamorphic check | **Active, ใช้งานจริงต่อเนื่อง** | `README.md` §How it is kept honest |
| License | **ยังไม่เลือก** | `README.md:337` |
| Visual milestones / archive evidence index / symbol recovery / evidence graph (deep-client-comprehension slice 4,5,7,8) | **ยังไม่แม้แต่ filed เป็น issue** | `docs/OPEN-WORK-LEDGER.md` (แถว 🔴) |

---

## 6. Evidence และ case studies

### Shader ที่ไม่มีอยู่ในไฟล์ไหนเลย จนกว่าจะรันหน้าเว็บ

hook ถูกติดตั้งที่ browser API layer (ไม่ใช่ library-specific) — บน `www.chaingpt.org` ที่ `THREE` โหลดเป็น ES module (ไม่ใช่ global) shader ทุกตัวยังถูกจับได้: **82,613 ตัวอักษร GLSL, 9 canvas context, 1,510 การเรียก `addEventListener`** (`README.md:98-99`) นี่คือตัวอย่างที่ดีที่สุดของ "ทำไม static file reading ไม่พอ — ต้องรันหน้าเว็บจริง"

### "บรรทัดไหน" ที่ resolve ผ่าน sourcemap จริง ไม่ fetch เพิ่ม

`extract_behaviour` แปลง `three.module.min.js:12:326662` (บรรทัด 12 ของไฟล์ที่มีสิบกว่าบรรทัด — อ่านไม่รู้เรื่อง) เป็น `three.module.js:18723:5` พร้อมข้อความจริงบรรทัดนั้น (`gl.shaderSource(shader, string)`) โดย**ไม่ fetch อะไรจากเน็ตเพิ่ม** — ใช้แค่สิ่งที่ capture ดึงไว้แล้วเท่านั้น ถ้า sourcemap ไม่ได้ถูก capture ไว้ ระบบรายงานว่าไม่มี แทนที่จะไปดึงจากเน็ตซึ่งจะทำให้ archive ที่ควรออฟไลน์แอบพึ่งพาเว็บไซต์ต้นทางอยู่ (`README.md:159-160`)

### Equivalence gate วันแรกที่มีคำสั่งจริง (2026-08-17) — PASS แล้ว FAIL ห่างกันไม่กี่นาที

เว็บเดียวกัน (`labs.chaingpt.org`) เครื่องเดียวกัน ไม่มีอะไรเปลี่ยน แต่ได้ PASS แล้ว FAIL ในการรันติดกัน — reproduce บั๊กที่มีอยู่แล้ว (#182) ได้ในชั่วโมงแรกที่คำสั่งนี้มีอยู่จริง เป็นตัวอย่างที่ดีของ "การทำ verification จริงจังเปิดเผยปัญหาที่ manual QA จะไม่มีวันเจอ" (`docs/reports/2026-08-17-equivalence-verdicts.md`)

### p-value ที่ตีพิมพ์ผิดไป 15 เท่า และถูกจับโดย reviewer รอบสอง

claim ที่ว่า "20 clean draws จาก rate 25% = 0.3%" ถูกพบภายหลังว่าคำนวณผิดวิธี (one-sample แทนที่จะเป็น two-sample) — ค่าจริงคือ p = 0.024–0.047 ซึ่งอ่อนกว่าที่อ้างไว้ราว 15 เท่า ไม่มี automated test ใดจับ arithmetic ผิดแบบนี้ได้เลย ต้องอาศัย delegated review รอบที่สองจากคนละ back-end (`DONE.md`, entry 2026-08-16)

### Private-address refusal ที่ทิ้งทั้ง archive ไม่ใช่แค่ entry ที่ผิด

`capture_page` ปฏิเสธ publish ทั้ง archive ถ้ามี HAR entry ใดตอบกลับจาก private address (loopback, link-local, CGNAT ที่ Tailscale ใช้) — **ทิ้งทั้งชุด ไม่ใช่แค่ entry ที่ผิด** เพราะบทเรียนจาก #156 คือ "archive ที่ขาดสิ่งที่หน้าเว็บขอไปแบบเงียบ ๆ" คือความล้มเหลวที่แย่กว่า (`README.md:243-247`)

---

## 7. Content model สำหรับเว็บ

```text
Tool
- slug (capture_page / replay_page / extract_behaviour / inspect_archive / equivalence)
- runtime (Node / Bun)
- answers (คำถามที่ตอบได้ — ตาม README table)
- maturity (active / experimental / known-gap)
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
- limitation
```

```text
Mechanism
- name (เช่น "GLSL shader capture", "wa: id reconciliation")
- howItWorks (สรุปสั้น)
- provenADR (ถ้ามี — เช่น ADR 0002)
- knownLimits
```

```text
BlogPost
- slug
- title
- language
- category
- date
- relatedTools
- evidence
- maturity
```

แหล่งข้อมูลที่ควรเป็น canonical:

- product overview → `README.md`
- glossary → `UBIQUITOUS_LANGUAGE.md`
- workflow ของ agent → `CLAUDE.md`, `AGENTS.md`, `docs/agents/using-the-tools.md`
- สถาปัตยกรรม/การตัดสินใจ → `docs/adr/*.md`
- หลักฐานเชิงตัวเลข → `docs/reports/*.md`
- ประวัติงานที่ ship → `DONE.md`
- งานที่เปิดอยู่ → `docs/OPEN-WORK-LEDGER.md`

ทุก metric card ควรมีจำนวน, วันที่วัด, วิธีวัด, source และ limitation — เหมือนที่ระบบเอกสารต้นทางทำอยู่แล้ว (จุดแข็งของ repo นี้คือความมีวินัยด้านการอ้างหลักฐาน ควรรักษาความมีวินัยแบบเดียวกันไว้บนเว็บ)

---

## 8. Brand และ visual direction สำหรับเว็บ

ใช้แนวทางเดียวกับที่ระบุใน `xeno-skills-present-blog-brief.md` §14 เพราะ Clone Space อยู่ใน ecosystem เดียวกันและควรสื่อสารเป็นระบบเดียวกันทางสายตา ไม่ใช่แบรนด์คนละทิศ:

- **text-first layout** ที่อ่าน source/evidence ได้ง่าย — ไม่ใช่ hero ที่เป็น visual gimmick
- **neutral base + accent เดียว + contrast สูง** เหมือนกัน
- ใช้ **before/after หรือ live-vs-replay comparison** เป็น visual material หลัก (แทน mockup) — เพราะจุดขายของ Clone Space คือ "หลักฐานว่าของจริงทำงานยังไง" การโชว์ screenshot คู่ (live page / replayed archive) หรือ code snippet ของ `origin`→`original` sourcemap resolution จะสื่อความหมายได้ตรงกว่า diagram นามธรรม
- **แสดงข้อจำกัดตรง ๆ** เช่น "listener_execution 0%" หรือ coverage vector ที่ไม่ครบ — ตรงกับหลักการ "Honest about limits" ของ xeno-skills เอง ไม่ใช่ซ่อนไว้เพื่อขายของ
- หลีกเลี่ยง **generic AI gradient, glassmorphism, card grid สามคอลัมน์แบบ SaaS ทั่วไป** — ยิ่งสำคัญสำหรับ Clone Space เพราะ positioning ของมันคือ "เครื่องมือต่อต้าน AI slop" การให้หน้าเว็บของมันเองดูเป็น AI slop จะขัดกับ narrative ตัวเอง

ควรมี EN/TH รายละเอียดเท่ากันในหน้าหลัก เหมือนที่ repo เก็บ `docs/agents/*` เป็น bilingual mirror ด้วย `<!-- lang:en -->`/`<!-- lang:th -->` อยู่แล้ว (`CLAUDE.md:145-146`)

---

## 9. Blog topic ideas เฉพาะ Clone Space

### Anti-AI-slop / design research

- "ทำไม agent ที่ออกแบบ frontend ควรเห็นโค้ดจริงจากเว็บจริงก่อน ไม่ใช่แค่จำ pattern"
- "GSAP timeline ไม่ได้เขียนอยู่ในไฟล์ไหนเลย — capture มันได้ยังไง"
- "shader 82,613 ตัวอักษรที่ไม่มีอยู่จนกว่าจะรันหน้าเว็บ: บทเรียนเรื่อง runtime-only artifact"
- "CSS transition ที่ behaviour graph มองไม่เห็น — ข้อจำกัดที่ต้องรู้ก่อนเชื่อ reference ที่ capture มา"

### Motion/animation capture

- "จับ ScrollTrigger ที่ trigger จริงได้ยังไง โดยไม่รู้ล่วงหน้าว่าเว็บใช้ library ไหน"
- "instrument ที่ browser API layer vs instrument ที่ library เฉพาะเจ้า — ทำไมแบบแรกทนกว่า"
- "sourcemap resolution: จาก `min.js:12:326662` กลับไปเป็นบรรทัดจริงในซอร์ส โดยไม่ fetch อะไรเพิ่ม"

### Verification / anti-slop ที่เป็นรูปธรรม

- "PASS แล้ว FAIL ห่างกันไม่กี่นาที: บทเรียนจาก equivalence gate วันแรกที่มีคำสั่งจริง"
- "coverage vector ทำไมต้องเป็น vector ไม่ใช่คะแนนเดียว"
- "p-value ที่ตีพิมพ์ผิดไป 15 เท่า และไม่มี test อัตโนมัติจับได้"

### Security / responsibility

- "ทำไม response body ไม่มีวันถูก redact ได้ — และสิ่งที่ผู้ใช้ต้องรู้ก่อน capture หน้าเว็บ"
- "ปฏิเสธทั้ง archive เพราะ entry เดียวที่มาจาก private address — ทำไมไม่แค่ตัด entry นั้นทิ้ง"

---

## 10. Source map

### Product และภาพรวม

- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `UBIQUITOUS_LANGUAGE.md`
- `package.json`

### สถาปัตยกรรม/การตัดสินใจ

- `docs/adr/0001-node-drives-the-browser-bun-runs-everything-else.md`
- `docs/adr/0002-element-identity-wa-ids-with-fingerprint-reconciliation.md`
- `docs/adr/0003-redact-transport-credentials-before-publishing-captures.md`
- `docs/adr/0004-separate-environment-evidence-from-replay-configuration.md`
- `docs/adr/0005-checkpoint-coherence-for-archive-artifacts.md`
- `docs/adr/0006-run-scoped-archive-artifacts-and-capability-flags.md`
- `docs/adr/0007-normalized-har-fallback-for-logically-identical-requests.md`
- `docs/adr/0008-target-discovery-is-enabled-after-navigation.md`
- `docs/adr/0009-response-bodies-are-not-redactable.md`

### วิธี agent ใช้เครื่องมือจริง

- `docs/agents/using-the-tools.md`
- `docs/agents/domain.md`
- `docs/agents/workflow.md`
- `docs/agents/issue-tracker.md`

### หลักฐานเชิงตัวเลข

- `docs/reports/2026-07-30-cdp-spike.md`
- `docs/reports/2026-08-04-metamorphic-baseline.md`
- `docs/reports/2026-08-17-equivalence-verdicts.md`

### ประวัติ/งานที่เปิดอยู่

- `DONE.md`
- `docs/OPEN-WORK-LEDGER.md`

### โค้ดต้นทาง (สำหรับตรวจ claim)

- `src/capture/` — `record.ts`, `instrument.ts`, `interaction.ts`, `interaction-drive.ts`, `budget.ts`, `redact.ts`, `private-address.ts`, `request-normalization.ts`, `targets.ts`, `transcript.ts`, `checkpoints.ts`, `commit.ts`
- `src/replay/` — `replay.ts`, `arrival-schedule.ts`
- `src/extract/` — `behaviour.ts`, `sourcemap.ts`, `archive-sources.ts`
- `src/identity/` — `inject.ts`, `fingerprint.ts`, `reconcile.ts`
- `src/equivalence/` — `run.ts`, `classify.ts`, `settle.ts`, `network-digest.ts`, `perturbation.ts`
- `src/serve/` — `mcp.ts`, `node-tools.ts`, `inspector.ts`
- `src/archive/read.ts`

---

## 11. ข้อควรระวังด้านความถูกต้อง

1. **อย่าประกาศทั้งโปรเจกต์ว่า production-ready** — README เองเรียกตัวเองว่า Alpha; ใช้ตารางสถานะแยกตาม feature ใน §5 แทน
2. **อย่าเขียนราวกับว่า "anti-AI-slop" เป็นคำที่ repo ของ Clone Space ประกาศไว้เอง** — มันคือ positioning ที่มาจาก brief ของเจ้าของโปรเจกต์สำหรับใช้บนเว็บ present/blog เท่านั้น (ดู §1)
3. **ต้องเตือนเรื่อง redaction ทุกครั้งที่พูดถึง capture** — response body **ไม่ถูก redact** (ADR 0009) ห้ามชี้ agent หรือผู้ใช้ไปยังหน้าที่ต้องล็อกอิน, internal tool หรือหน้าที่มีข้อมูลอ่อนไหว
4. **`listener_execution` 0% ในทุก verdict ที่บันทึกไว้** — อย่าพูดว่า equivalence gate "พิสูจน์ความเท่ากันของ interaction แล้ว" มันยังไม่เคยขับ listener เลย
5. **coverage เป็น vector ไม่ใช่คะแนนเดียว** — verdict เขียวที่ coverage ต่ำเป็นคำกล่าวเล็ก อย่าโฆษณาเป็นคำกล่าวใหญ่
6. **ตัวเลขที่มาจาก DONE.md/reports เป็น snapshot ตามวันที่** — ต้องระบุวันที่กำกับเสมอ ไม่ใช่ปัจจุบันเสมอไป (เช่น mutation corpus 153 entries คือค่าที่อ่านได้ ณ 2026-09-02)
7. **CI required checks ยังไม่ active จริง** (#2, billing lock) — `t4-verify` เป็น self-attested check ไม่ใช่ CI จริง อย่าเขียนว่า "ผ่าน CI" เฉย ๆ โดยไม่ระบุว่าเป็น self-attested
8. **`restoreTiming` เป็น experimental option ที่ off by default** — อย่าเขียนว่า replay "timing ตรงกับต้นฉบับเป๊ะ" โดยไม่ระบุว่า feature นี้ต้องเปิดเองและมีต้นทุน
9. **ทุก claim ตัวเลขต้องมี source path และวันที่วัด** — ตามที่ repo ต้นทางทำเป็นวินัยอยู่แล้ว เว็บไซต์ควรรักษามาตรฐานเดียวกัน ไม่ใช่ลดทอนเป็น marketing copy ที่ไม่มีหลักฐาน
10. **Clone Space เป็นเครื่องมือสนับสนุน ไม่ใช่ผลิตภัณฑ์ยืนเดี่ยว** — บนเว็บ ควรวางตำแหน่งเป็นส่วนหนึ่งของ ecosystem xeno-skills เสมอ (เหมือน openclink) ไม่ใช่นำเสนอแยกขาดจนดูเหมือนแข่งกับ xeno-skills เอง

---

## 12. Final positioning

สำหรับเว็บไซต์ present/blog ควรเล่า Clone Space เป็นเครื่องมือที่ตอบคำถามเดียวอย่างเข้มงวด: **"เว็บไซต์ที่มีอยู่จริงนี้ ทำงานยังไง"** — ไม่ใช่ scraper ไม่ใช่ browser automation ทั่วไป และไม่ใช่ generator

จุดที่ควรทำให้ผู้ชมเห็นชัดคือ:

1. ปัญหาที่แก้จริง — dead skeleton จาก save-as ธรรมดา, runtime-only artifact ที่ไม่มีทางอ่านจากไฟล์
2. กลไกที่แก้ปัญหานั้น — instrument ที่ browser API layer, wa: id + fingerprint reconciler, sourcemap resolution
3. หลักฐานที่รองรับ — ตัวเลขจริงจาก mutation corpus, metamorphic check, equivalence verdicts พร้อมวันที่
4. ขอบเขตที่ยังทำไม่ได้ — listener_execution 0%, CSS transition ไม่แสดง, layout race ที่ยังเปิดอยู่
5. บทบาทใน ecosystem — เครื่องมือสนับสนุนที่ xeno-skills เรียกใช้ตอน agent ต้องการ ground การออกแบบ frontend กับของจริง ไม่ใช่แข่งกับ xeno-skills

นั่นคือ narrative หลักที่ควรใช้ร่วมกันทั้งหน้า Present, หน้า Tools และ Blog ของ Clone Space
