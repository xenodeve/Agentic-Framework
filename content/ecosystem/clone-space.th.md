---
title: "Clone Space"
description: "เก็บหน้าเว็บทำงานให้ replay ออฟไลน์ได้พร้อม motion — และ AI agent อ่านได้ว่ามันสร้างอย่างไร"
repo: "xenodeve/clone-space-mcp"
status: "alpha"
tags: [mcp, web-archival]
---

## Clone Space คืออะไร

Clone Space (`xenodeve/clone-space-mcp`) เป็น MCP server ที่เก็บหน้าเว็บจริงบนอินเทอร์เน็ต ให้ replay ออฟไลน์ได้โดย motion ยังทำงาน — carousel ยังเลื่อน GSAP timelines ยังรัน ScrollTriggers ยัง fire — และบอกต่อว่า **บรรทัดไหนของโค้ด** คือตัวขับเคลื่อนแต่ละการเคลื่อนไหว (`README.md:1-9`, snapshot commit `205a616c`, 2026-08-17)

การตัดสินใจที่แบกน้ำหนักทั้งหมดคือวิธีที่ replay ทำงาน: มันเปิด **URL เดิม** และเสิร์ฟ **HTML เอกสารเดิม** จาก HAR ของ capture ผ่าน `routeFromHAR(har, { notFound: 'abort' })` ทำให้ **JavaScript จริงของหน้าถูกรันอีกครั้ง** — ไม่ใช่ mock ไม่ใช่ synthetic replay และไม่ใช่ serialized hydrated DOM serialize-to-standalone คือแนวทางที่โปรเจกต์ปฏิเสธพอดี: มันทำลาย hydration และ entry animations ที่มันมีไว้เพื่อรักษามัน (`README.md:11-14`)

บน site นี้ Clone Space **ไม่ใช่ผลิตภัณฑ์เดี่ยว** มันเป็นเครื่องมือที่ design family ของ xeno-skills (`design-setup`, `design-rules`, `design-psychology`, `design-audit`, `using-design`) เรียกเมื่อ agent ต้องยึด frontend design กับเว็บไซต์จริง: `capture_page` เว็บที่ต้องการพร้อม motion → `replay_page` ยืนยันว่า motion รันจริง → `extract_behaviour` เห็นกลไกจริง (timing, easing, ไลบรารี, trigger และ `file:line` ที่ขับเคลื่อน) แทนการเดาจาก screenshot หรือความทรงจำเรื่อง pattern ของโมเดล บรรทัดตำแหน่งที่ตั้ง: *Clone Space ให้ agent อ่านได้ว่าเว็บไซต์จริงเคลื่อนไหวอย่างไรจริง ๆ — ก่อนออกแบบตัวถัดไป*

ป้าย "เครื่องมือวิจัยดีไซน์ต่อต้าน AI-slop" ที่ติดให้ใน ecosystem นี้คือ **เฟรมมิงของเจ้าของโปรเจกต์ (developer) ประกาศไว้สำหรับเนื้อหาปัจจุบันและบล็อกของเว็บนี้ — ไม่ใช่คำที่ repo ของ Clone Space ประกาศเกี่ยวกับตัวเอง** North-star ของ repo เขียนด้วยภาษาที่กลางกว่า: replay ออฟไลน์ด้วยความแม่นยำจริง และ AI agent นำ archive ไปอธิบายได้ว่าหน้านี้อย่างไร (`CLAUDE.md:20-24`) เฟรมมิงถูกใช้บน site นี้ในฐานะคำแถลงตำแหน่งของทีม และไม่เคยถูกนำเสนอว่าเป็น claim ของ repo

สถานะ: **Alpha และตรงต่อเรื่องนี้ ทั้งสี่ stage รัน end-to-end** (`README.md:322`, commit `205a616c`, 2026-08-17) ข้อจำกัดที่เปิดอยู่ถูกบันทึกรายละเอียด ไม่ซ่อน — ดูหัวข้อ "ข้อจำกัดที่รู้แล้ว"

## ต้นเรื่อง

### ปัญหาจริง

ปัญหาสี่ข้อ ตามที่บันทึกใน `docs/clone-space-analysis.md` §2:

1. **โครงกระดูกที่ตาย.** การ archive แบบธรรมดา (wget, save-as, DOM snapshot) เก็บ markup ไว้ แต่พฤติกรรมตาย — ไม่มี JavaScript context เหลืออยู่ให้มันมีชีวิตรอด
2. **artifact ที่เกิดเฉพาะตอน runtime.** GSAP timelines และ WebGL shaders ที่ประกอบขึ้นจาก string ตอน runtime ไม่อยู่ใน **ไฟล์ใด** ที่ archive จะเก็บได้ ต้อง **รันหน้านั้นจริง** ถึงจะเห็น (`README.md:98-104`)
3. **ตำแหน่งจาก minified ไร้ความหมาย.** runtime รายงานตำแหน่งอย่าง `three.module.min.js:12:326662` — บรรทัด 12 ของไฟล์ที่มีสิบกว่าบรรทัด โดยไม่มี sourcemap resolution มันไม่มีอะไรให้หมาย
4. **"ดูแล้วถูก" ไม่เท่ากับ "วัดแล้วว่าเท่ากัน." clone ที่ดูเหมือนเดียวกันอาจมีพฤติกรรมต่างจากต้นฉบับ และไม่มีใครรู้ได้โดยไม่มีกลไกที่เทียบ live กับ replay จริง

### ทดลองอะไร

MCP server สี่ stage — capture → replay → extract → serve — บวกบทบาทที่ห้าคือ equivalence gate การตัดสินใจเชิงโครงสร้างตัวแรกมาจากการวัด ไม่ใช่จากความชอบ: spike 2026-07-30 พบว่า Playwright client ไม่ทำงานบน Bun (raw CDP ผ่าน websocket ทำงานได้ใน 99 ms แต่ `chromium.launch` timeout ที่ 30 s) ขณะที่ Node รันได้ภายใน 68 ms — ดังนั้น **Node ขับ browser, Bun รันทุกอย่างอื่น** (ADR 0001, 2026-07-30) observation hooks ของ capture ถูกติดตั้งที่ **ชั้น API ของ browser** (เช่น `WebGLRenderingContext.prototype.shaderSource`) ไม่ใช่ที่ไลบรารี anim เดียวใด เพราะสุดท้ายทุกอย่างต้องผ่าน WebGL API — ดังนั้น shaders ถูกจับแม้แต่ตอน `THREE` เป็น ES module ไม่ใช่ global (`README.md:92-99`)

Timeline (วันที่และแหล่งที่มาจาก `docs/clone-space-analysis.md` §5):

| วันที่ | เหตุการณ์ |
|---|---|
| 2026-07-30 | CDP spike ตอบ Q1–Q3; Playwright ใช้ไม่ได้บน Bun → runtime split (ADR 0001) |
| 2026-07-31 | element identity (`wa:` id + fingerprint reconciler) merge — fixture 63/63 match, ไม่ค้าง 0 ตัว (ADR 0002) |
| 2026-08-01 | credential redaction ก่อน publish (ADR 0003); แยก environment evidence ออกจาก replay config (ADR 0004) |
| 2026-08-03 | checkpoint coherence (ADR 0005); mutation + regression corpus เริ่มที่ 7 entries (#53) |
| 2026-08-04 | capability flags (ADR 0006); metamorphic check เริ่ม — ตัวเลขสองชุดแรกถูกรีไทร์ทันที |
| 2026-08-05 | gates ที่ถูก skip (`/code-review`, `/scrutinize`) รันย้อนหลัง และพบ defect จริง 5 ตัวใน code ที่ merge ผ่านทุก automated gate ไปแล้ว |
| 2026-08-09 | request normalization (ADR 0007) ship end-to-end |
| 2026-08-14 | target-discovery ordering (ADR 0008); response bodies ประกาศว่า **redact ไม่ได้** (ADR 0009) |
| 2026-08-16 | private-address refusal (#162); scoping WebSocket gap (#185); เปิด check self-attested ของ `t4-verify` |
| 2026-08-17 | equivalence gate กลายเป็นคำสั่งจริง (`bun run equivalence`, เกณฑ์ #171 ข้อ 5); verdict จริงสามตัวถูกบันทึก |

### ความมีประสิทธิผล

- ทั้งสี่ stage รัน end-to-end (`README.md:322` ณ commit `205a616c`, 2026-08-17)
- การรันจริงชุดแรกของ equivalence gate (2026-08-17) ผลิตบั๊กที่เปิดอยู่ (#182, race ของ `layout.scrollHeight`) ขึ้นใหม่ภายในชั่วโมงแรกหลังคำสั่งมี — ความล้มเหลวที่ manual QA จะไม่มีวันจับได้ (`docs/reports/2026-08-17-equivalence-verdicts.md`)
- mutation corpus — ที่เอา defect ที่เคยเกิดขึ้นจริงมาประยุกต์ใหม่ และบังคับให้ test ที่ระบุชื่อ red — เติบโตจาก 7 entries แรก (#53, 2026-08-03) เป็น 153 (README, อ่าน 2026-09-02)

## ทำงานอย่างไร — capture และ replay

```text
live URL
  ↓
capture_page (Node/Playwright, src/capture/)
  adaptive sweep (budget: wall-clock / bytes / nodes / height / events)
  + bounded interaction (ปฏิเสธ cross-origin / download / nav / form /
    auth-looking controls)
  + observation hooks ที่ชั้น API ของ browser (ก่อน script หน้าจะรันอะไร)
  + wa: id injection (preorder + MutationObserver)
  ↓
private staging dir (ADR 0003)
  ↓
redact credentials / cookies / tokens → [REDACTED]
(response bodies ยังอยู่ — ADR 0009)
  ↓
fail-closed validation (checkpoint coherence, run-scoped capabilities,
private-address refusal)
  ↓
commit.json เขียนสุดท้าย (SHA-256 ของทุกไฟล์)
  ↓
archive (chmod 0600: network.har · environment.json · capabilities.json ·
targets.json · transcript.json · checkpoints.json)
  ↓
replay_page (Node): routeFromHAR, URL เดิม, JS ตัวจริงรันอีกครั้ง;
request ใดที่ archive ตอบไม่ได้ถูก abort ทั้งหมด
  ↓
extract_behaviour: behaviour graph + sourcemap resolution (ไม่ fetch เพิ่ม)
  ↓
serve: MCP tools 4 ตัวบน stdio · inspect_archive (Bun, ไม่ต้องใช้ agent)
```

**Capture** (`capture_page`, Node/Playwright) — จับอะไร:

- adaptive sweep พร้อม budget (wall-clock, bytes, nodes, ความสูงของหน้า, events) บวก bounded interaction ที่ปฏิเสธ cross-origin, download, navigation, form และ auth-looking controls;
- observation hooks ที่ติดตั้งที่ **ชั้น API ของ browser ก่อน script หน้าจะรัน** — ไม่ผูกกับไลบรารี (เช่น `WebGLRenderingContext.prototype.shaderSource`);
- element identity: `wa:` ids ที่ inject (preorder + `MutationObserver`) จับคู่ข้าม runs ด้วย fingerprint reconciler (tag + อนุภาคว่า stable attribute + ลำดับ sibling + text hash + parent node) `wa:` ids คือ handles ไม่ใช่ keys — หมายความเป็นอะไรเฉพาะใน run เดียว;
- ทุก network request/response แนบเป็นไฟล์แยก (HAR, full mode);
- target inventory (OOPIF, popup, worker, worklet) ผ่าน `Target.setDiscoverTargets` หลัง `page.goto` — targets ที่เกิดและตายระหว่าง navigation เองถูกพลาด (ช่องที่รู้แล้ว, ADR 0008)

สิ่งที่ทำกับ capture ก่อนที่จะเป็น archive ได้:

- **Redaction**: credentials/cookies/tokens → `[REDACTED]` (ADR 0003) **response bodies ไม่ถูก redact และ redact ไม่ได้** (ADR 0009, 2026-08-14) — replay ต้องการมันในฐานะวัตถุดิบ ห้ามชี้ capture ไปที่หน้าที่ login เครื่องมือภายใน หรือหน้าที่มีข้อมูลอ่อนไหว
- **Fail-closed**: ถ้า validation ล้ม archive ไม่ถูก publish — ไม่มี "soft success" โฟลเดอร์ private staging; `commit.json` เขียนสุดท้ายพร้อม SHA-256 ของทุกไฟล์ (ADR 0005, 0006)
- **Private-address refusal**: ถ้า entry ใดใน HAR ตอบจาก private address (loopback, link-local, CGNAT) **ทั้ง archive** ถูกปฏิเสธ ไม่ใช่แค่ entry ตัวนั้น

**Replay** (`replay_page`, Node) — replay อะไร:

- **URL เดิมพร้อม HTML เดิม** เสิร์ฟจาก HAR; request ใดที่ archive ไม่ถูกตอบถูก **abort** (`notFound: 'abort'`) — replay ไม่ fallback ไปยัง live network อีก
- **JavaScript ตัวจริงของหน้าถูกรันอีกครั้ง**: GSAP, ScrollTriggers, shaders
- `restoreTiming` เลือกได้ (off โดย default): ล่าช้า response ให้ตรงกับ offset จริงจากจุดเริ่มโหลดหน้า ต้นทุนที่วัดได้: `goto` 825 ms → 4,577 ms บนไซต์ 146 entries ตัวหนึ่ง (`README.md:129-134`) — นี่คือเหตุผลที่ยังคง off

**Extract** (`extract_behaviour`, รันบน replay):

- behaviour graph: กลไก, target, timing, easing, ไลบรารี, ScrollTrigger detail
- sourcemap resolution **โดยไม่ fetch เพิ่ม**: `three.module.min.js:12:326662` → `three.module.js:18723:5` พร้อมบรรทัดจริง (`gl.shaderSource(shader, string)`) — ใช้แค่อะไรที่ capture ดึงมาอยู่แล้ว ถ้า sourcemap ไม่ถูกจับ มันบอกเช่นนั้นแทนที่จะ fetch จาก network: archive ออฟไลน์ไม่ควรพึ่ง site ต้นฉบับเงียบ ๆ (`README.md:150-160`)
- `unrepresented`: สิ่งที่ observe ได้แต่ไม่สามารถ represent ได้ถูกรายงานในฐานะนั้น (เช่น CSS transitions) แทนการทิ้งไปเงียบ ๆ

**Serve** — MCP tools 4 ตัวบน stdio (MCP layer บาง ๆ, pure tools, archive reader) บวก `inspect_archive` บน Bun: HTML report ที่มีภาพ ไม่ต้องใช้ agent สองทางนี้เป็นวิธีลองด้วยตัวเองโดยไม่ต้อง build อะไร

**Equivalence gate** (`bun run equivalence <url>`):

- ขับ **หน้า live และ archive ที่ replay ด้วย driver เดียวกัน ใน session เดียว** เก็บชุด digest เดียวกันจากทั้งสองฝั่ง และรายงาน `0` PASS · `1` FAIL (residual ที่อธิบายไม่ได้) · `2` INCOMPLETE (ยังไม่มีอะไรพิสูจน์เท่ากัน) · `3` ไม่เสร็จ (`README.md:208-210`)
- หลักการที่วางไว้ตั้งใจ: coverage คือ **เวกเตอร์ ไม่ใช่คะแนนเดียว**; `unobserved` ไม่ถูกนับเป็น `equal`; หน้า live ถูกขับหลายครั้งเป็น control และ field ที่แกว่งกับตัวเองถูกรายงานว่า `unstable` แทนที่จะโทษ clone; `--measure-perturbation` ถามว่าการวัดเองทำให้พฤติกรรมของหน้าเปลี่ยนหรือไม่

## หลักฐาน

ตัวเลขทุกตัวพร้อมวันที่ แหล่งที่มา และข้อจำกัด ค่าทั้งหมดมาจาก repo snapshot **2026-09-02** (branch `main`, commit `205a616c` ลงวันที่ 2026-08-17, package version `0.1.0-alpha.0`) อ่านจากไฟล์ที่ถูกอ้าง — ไม่ใช่การรันใหม่ Re-verify ก่อน claim ว่าสิ่งใดคือสภาพปัจจุบัน

| Fact / metric | ค่า | วันที่ | แหล่งที่มา | ข้อจำกัด |
|---|---|---|---|---|
| GLSL shader capture บน `www.chaingpt.org` | 82,613 GLSL characters | ไม่ระบุในแหล่งที่มา (snapshot commit `205a616c`, 2026-08-17; อ่าน 2026-09-02) | `README.md:98` ผ่าน `docs/clone-space-analysis.md` §3.3 | capture เดียวแห่งไซต์ที่บันทึกใน README ไม่ใช่การรันใหม่; `THREE` เป็น ES module ไม่ใช่ global — hooks จับ shaders ได้ที่ชั้น API ของ browser |
| Canvas contexts บน `www.chaingpt.org` | 9 | ดังกล่าว | `README.md:98` ผ่านแหล่งเดียวกัน | ดังกล่าว |
| การ register `addEventListener` บน `www.chaingpt.org` | 1,510 | ดังกล่าว | `README.md:99` ผ่านแหล่งเดียวกัน | ดังกล่าว |
| Animation registry เทียบกับ `document.getAnimations()` | 12/12 บน firecrawl.dev และ 12/12 บน chaingpt.org | ไม่ระบุในแหล่งที่มา (snapshot อ่าน 2026-09-02) | `docs/agents/using-the-tools.md:83-95` | แค่สองไซต์; CSS **transitions** ไม่อยู่ใน graph (แถวด้านล่าง) |
| element identity บน fixture | 63/63 match, ไม่ค้าง 0 ตัว, เคสลำบากห้าตัว | 2026-07-31 (ADR 0002 merge แล้ว) | `docs/adr/0002-…md:136-141` | แค่ fixture; ADR เองเรียกนี้เป็น floor ไม่ใช่ ceiling สำหรับไซต์จริง |
| ต้นทุน wall-clock ของ `restoreTiming` | `goto` 825 ms → 4,577 ms | ไม่ระบุในแหล่งที่มา (snapshot อ่าน 2026-09-02) | `README.md:129-134` | fixture เดียว + ไซต์จริง 146 entries ตัวหนึ่ง; ตัวเลือก off โดย default |
| verdict equivalence ชุดแรกที่เป็นจริง | firecrawl.dev FAIL (motion_settled 0%, interaction 63%) · chaingpt.org INCOMPLETE (stable_fields 90%) · labs.chaingpt.org PASS แล้ว FAIL ห่างกันไม่กี่นาที เครื่องเดิม ไม่เปลี่ยนอะไร | 2026-08-17 | `docs/reports/2026-08-17-equivalence-verdicts.md` | `listener_execution` เป็น 0% ในทุกตัว (แถวด้านล่าง) |
| ขนาด mutation corpus | 153 entries เติบโตจาก 7 (#53, 2026-08-03) | อ่าน 2026-09-02 | `README.md` | จำนวนแบบ snapshot |
| Metamorphic baseline (unrelated-node insertion, seed `0x24080426`) | 2/400 เทียบกับ 179/400 เมื่อใส่บั๊ก #20 กลับมา; การวัดสองชุดแรก (32/400 แล้ว 78/400) ถูกรีไทร์ | 2026-08-04 | `docs/reports/2026-08-04-metamorphic-baseline.md` | ตัวเลขวัด ไม่ใช่คำรับรอง — โค้ดที่ถูกอาจพลาด match เช่นกัน; อัตราส่วน "89.5×" ห้ามอ้างอิง (ฐาน 2 เล็กเกินไป) |
| p-value ที่เผยแพร่ | "0.75^20 = 0.3%" (one-sample test เทียบกับอัตราที่ได้จาก control) ผิด; Fisher's exact ที่ 5/20 vs 0/20 ให้ p = 0.024 one-tailed, 0.047 two-tailed — อ่อนกว่าราว 15 เท่า | 2026-08-16 | entry 2026-08-16 ใน `DONE.md` | พบโดย delegated review รอบสอง; **ไม่มี automated test** (lint, typecheck, unit tests 558, browser tests 95, mutation corpus) ตัวใดจับข้อผิดพลาดทางเลขแบบนี้ได้ |
| ความครอบคลุม `listener_execution` | 0% ในทุก verdict ที่บันทึก | ณ commit `205a616c` (2026-08-17) | `README.md:328-329` | verdict equivalence เป็นคำแถลงเกี่ยวกับ navigation/scroll **ไม่ใช่** interaction |
| CSS transitions ไม่อยู่ใน behaviour graph | 318 elements ที่มีย่าน transition บน firecrawl.dev, 1,028 บน chaingpt.org ไม่ถูกรายงานโดย graph | ไม่ระบุในแหล่งที่มา (snapshot อ่าน 2026-09-02) | `docs/agents/using-the-tools.md:83-95` | หน้าที่ถูก animate ด้วย Tailwind/Framer transitions ล้วนจะรายงาน node น้อยผิดปกติ |
| CSS sheet cross-origin ผ่าน CDP | 593 bytes อ่านได้ผ่าน `CSS.getStyleSheetText` ขณะที่ตัวหน้าเองได้ `SecurityError` | 2026-07-30 | `docs/reports/2026-07-30-cdp-spike.md` | รอบแรกของ spike ตอบคำถามนี้ผิด (บั๊กของ harness วัดเอง) — บันทึกเป็นบทเรียน ไม่ใช่ผลลัพธ์ |

## ข้อจำกัดที่รู้แล้ว — สิ่งที่ Clone Space ไม่ได้ทำ

- **ไม่ใช่ content scraper ไม่ใช่ browser automation ทั่วไป และไม่ใช่ website generator.** มันตอบคำถามเดียว: *เว็บจริงที่มีอยู่ทำงานอย่างไร?*
- **ยังไม่เคยขับ event listeners.** `listener_execution` เป็น 0% ในทุก verdict ที่บันทึก (`README.md:328-329`); verdict เขียวคือคำแถลงเกี่ยวกับ navigation และ scroll ไม่ใช่ interaction
- **race ของ `layout.scrollHeight` (#187) ยังเปิดอยู่** — replay เดียวกันสองครั้งได้ความสูงต่างกัน; fix (`restoreTiming`) off โดย default เพราะต้นทุน wall-clock
- **CSS transitions ไม่อยู่ใน behaviour graph** — เห็นได้เฉพาะตอนรัน ผ่าน `getAnimations()`; หน้าที่ถูก animate ด้วย Tailwind/Framer transitions ล้วนรายงาน node น้อยผิดปกติ
- **out-of-process iframes และ shadow roots ที่ปิด** อยู่นอกระบบ element identity ปัจจุบัน (ADR 0002); targets ที่เกิดและตายระหว่าง navigation ถูกพลาด (ADR 0008); private-address refusal ของ WebSocket ครอบคลุม IP literals ไม่ใช่ hostnames (#185)
- **CI required checks ยังไม่ live** (บัญชี GitHub ถูก billing-locked, #2); `t4-verify` เป็น check self-attested ที่เปิดตั้งแต่วันที่ 2026-08-16 ไม่ใช่ CI
- **license ยังไม่ได้เลือก** (`README.md:337`)
- **response bodies ไม่ถูก redact และ redact ไม่ได้** (ADR 0009) — คำเตือนถาวร: ห้ามชี้ capture ไปที่หน้าที่ login เครื่องมือภายใน หรือข้อมูลอ่อนไหว

สรุปตรง ๆ ที่หน้านี้อาจรับไว้: Clone Space เป็น Alpha และพูดอย่างนั้น ความเข้มของมันคือการบันทึกข้อจำกัดของตัวเองเป็นรายรายละเอียด — `identity-unresolved`, `"undetermined"`, `unrepresented`, `unservable` เป็นผลลัพธ์ first-class ไม่ใช่ error ที่ซ่อนในเชิงอรรถ — นั่นคือสิ่งที่ทำให้ agent ตัดสินได้ว่า capture พิสูจน์อะไรและไม่พิสูจน์อะไร

## บทบาทใน ecosystem — แหล่งอ้างอิงของ design family (กำลังพัฒนา)

บน site นี้ Clone Space ถูกวางตำแหน่งเป็นแหล่งอ้างอิงของ design family ของ xeno-skills: เมื่อ agent ออกแบบ hero ที่มามotion การเห็น **กลไกจริง** ของไซต์จริง — timing, easing, trigger, ไลบรารี และ `file:line` ที่ขับเคลื่อน — ยึดการตัดสินใจดีไซน์กับหลักฐาน ไม่ใช่กับการ sampling การกระจาย pattern ที่โมเดลถูกฝึกมา นั่นคือเฟรม "ต่อต้าน AI-slop" ของเจ้าของโปรเจกต์ (ประกาศสำหรับเว็บนี้; repo ไม่ได้ประกาศเอง) และเป็นเหตุผลที่ Clone Space อยู่ใน design family ใน skill catalog ของ hub

**ณ snapshot 2026-09-02 นี่คือ (กำลังพัฒนา) ไม่ใช่ถูกต่อแล้ว.** Clone Space **ยังไม่ถูก integrate เข้าเครื่องมือของ design**: แหล่งแรงบันดาลใจปัจจุบันของ design skills คือ Dribbble, Pinterest และ 21st.dev คำอ้างถึง `clone-space-mcp` ครั้งเดียวใน repo xeno-skills ทั้ง repo คือ PR ที่ `clink-subagents` อ้างเป็น mutation-testing case — ไม่เกี่ยวข้องกับ design workflow การเชื่อมต่อข้างบนคือบทบาทที่ตั้งใจ ไม่ใช่สิ่งที่อยู่แล้ว ไม่มีอะไรบน site นี้ claim ว่าการ integrate มีอยู่แล้ว

กลับไปยัง skill catalog ของ hub ที่ design family อาศัยอยู่: [/#skills](/#skills)
