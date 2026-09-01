---
title: "Agentic Framework website — hub-and-spoke, single-scroll IA"
status: draft
date: "2026-09-02"
---

# Agentic Framework website — information architecture & content design

## 1. Positioning (ตกลงกันแล้ว)

xeno-skills ไม่ใช่ 1 ใน 3 โปรเจกต์เท่ากัน แต่เป็นแกนกลางของเว็บทั้งก้อน (the framework)
openclink และ Clone Space เป็นเครื่องมือที่ xeno-skills เรียกใช้:

- **openclink** — transport ที่ skill ตระกูล `clink-*` (using-clink, clink-brainstorm,
  clink-subagents, clink-debug, clink-masteragent) เรียกใช้สำหรับ multi-agent orchestration
- **Clone Space** — เครื่องมือให้ agent ไปศึกษา frontend/design จริงจากเว็บทั่วไป
  เพื่อกันงาน design หลุด "AI slop" ใช้เป็น reference source ให้ design-family skills
  (design-setup, design-rules, design-psychology, design-audit)
  > หมายเหตุความถูกต้อง: framing "anti-AI-slop" มาจากเจ้าของโปรเจกต์ ไม่ใช่คำที่ repo
  > Clone Space ประกาศเอง ต้องเขียนแยกให้ชัดในหน้า `/ecosystem/clone-space`

เนื้อเรื่องหลักของทั้งเว็บ (ใช้ซ้ำได้ทุกหน้า): **ปัญหาที่เกิดขึ้นจริง → กลไกที่แก้ →
หลักฐานที่รองรับ → ขอบเขตที่ยังทำไม่ได้ → วิธีทดลองใช้เอง**

## 2. Route structure

| Route | รูปแบบ | เนื้อหา |
|---|---|---|
| `/` | หน้าเดียว scroll ยาว (storytelling) | ทุก section ของ xeno-skills เรียงกันตาม §3 |
| `/#<section>` | hash anchor บน `/` | ลิงก์ตรงไปแต่ละ section ได้ (shareable, bookmark ได้, native browser scroll) |
| `/?skill=<slug>` | query param บน `/` | เปิด popup origin-story ของ skill นั้นทันทีตอนโหลดหน้า (shareable) |
| `/ecosystem/openclink` | หน้าเดียวลึก | origin story, deep-scan findings, evidence, โยงกลับ `/#multi-agent` |
| `/ecosystem/clone-space` | หน้าเดียวลึก | origin story, capture/replay mechanism, evidence, โยงกลับ `/#skills` (design family) |
| `/blog`, `/blog/[slug]` | เดิม ไม่เปลี่ยน | คงโครงเดิมของ scaffold ปัจจุบัน |

`/present`, `/skills`, `/t4-standard`, `/multi-agent`, `/hooks`, `/research`, `/install` ที่เคย
ร่างเป็น route แยกในรอบก่อน **ยุบเป็น section ภายใน `/` ทั้งหมด** ตาม decision ล่าสุด

**ตัดทิ้ง** `/ecosystem` (index list รวม) — section `#built-on` บน `/` ทำหน้าที่เป็น
ทางเข้าเดียวไปหา `/ecosystem/openclink` และ `/ecosystem/clone-space` แทน scaffold ปัจจุบันมี
`src/app/ecosystem/page.tsx` (index) ต้องลบไฟล์นี้ตอน implementation ส่วน
`src/app/ecosystem/[slug]/page.tsx` เก็บไว้

## 3. Section order บน `/`

1. Hero — positioning statement, ป้าย `xeno-skills · openclink · Clone Space`
2. ปัญหา — human-AI bottleneck, model bias, context amnesia, enforcement theater
   (อ้างอิง `docs/xeno-skills-present-blog-brief.md` §3)
3. Four outcomes — Route / Delegate / Remember / Verify
4. Workflow diagram (จาก brief §5)
5. **Skill catalog** (`#skills`) — grid/list ของ 19 skills แบ่งตาม family, hover = summary
   สั้น, click = เปิด popup origin story เต็ม (ดู §4)
6. **Multi-agent** (`#multi-agent`) — clink family, การ์ดโยงออกไป `/ecosystem/openclink`
7. **T4 standard** (`#t4-standard`) — memory / workflow / records / AFK / bootstrap
8. **Hooks & enforcement** (`#hooks`) — enforcement ladder, ข้อจำกัดที่ hook ตรวจไม่ได้
9. **Evidence / research** (`#research`) — metric พร้อมวันที่, case study (brief §9)
10. **Built on** (`#built-on`) — การ์ด openclink + Clone Space โยงไป `/ecosystem/*`
11. **Install** (`#install`) — skills installer / plugin / bootstrap
12. Blog teaser — 3 โพสต์ล่าสุด โยงไป `/blog`

## 4. Interaction model — popup

- เนื้อหา popup ทุกอันต้อง **render ลง HTML ตั้งแต่ SSR** แล้ว toggle แสดง/ซ่อนด้วย client
  state เท่านั้น (ห้าม fetch-on-click) — กัน search engine มองไม่เห็นเนื้อหา origin story
- เปิด/ปิดผ่าน query param `?skill=<slug>` → deep-link ตรงไปยัง popup ได้จากภายนอก
  (เช่นจาก blog post หรือจาก `/ecosystem/openclink` ที่จะลิงก์กลับมาที่ skill เฉพาะใน `#multi-agent`)
- popup แสดง: problem → attempt → effectiveness (+ source/date) ตาม `OriginStory` block (§5)
- skill ที่ไม่มี origin story ของตัวเอง (inherit จาก family) — popup แสดงข้อความ inherit
  พร้อมลิงก์ไป origin story ของ family แม่ ไม่เสกเนื้อหาขึ้นมาเอง

## 5. Content model

เพิ่มจาก content model เดิมใน `docs/xeno-skills-present-blog-brief.md` §13:

```text
OriginStory
- problem        (ปัญหาจริงก่อนมี skill/project นี้)
- attempt         (กลไกที่ใช้แก้)
- effectiveness   (หลักฐาน/ตัวเลข + limitation, หรือระบุตรงว่ายังไม่มี evidence เชิงตัวเลข)
- date
- sourcePath
```

- `Skill.originStory?: OriginStory | { inheritFrom: string }` — skill สำคัญมี origin story
  ของตัวเอง ส่วน skill เล็กที่ไม่มีปัญหาต้นทางเฉพาะ ให้ inherit จาก family
- `EcosystemTool` (openclink, clone-space) ก็ใช้ `OriginStory` แบบเดียวกันที่ระดับโปรเจกต์

แหล่งข้อมูลจริงที่ป้อน content model นี้ (งานวิจัยที่ทำไปแล้วในรอบสนทนานี้):

| ไฟล์ | ใช้ป้อน |
|---|---|
| `docs/xeno-skills-analysis.md`, `docs/xeno-skills-present-blog-brief.md` | ปัญหา/DNA/IA ระดับ xeno-skills, evidence ทั่วไป |
| `docs/xeno-skills-origin-stories.md` (agent กำลังเขียน) | `OriginStory` ต่อ skill สำหรับ popup ใน `#skills` |
| `docs/openclink-analysis.md`, `docs/openclink-present-blog-brief.md` | เนื้อหา `/ecosystem/openclink` ทั้งหน้า |
| `docs/clone-space-analysis.md`, `docs/clone-space-present-blog-brief.md` | เนื้อหา `/ecosystem/clone-space` ทั้งหน้า |

## 6. Brand/visual direction

ใช้แนวทางเดียวกับ `docs/xeno-skills-present-blog-brief.md` §14 ทั้งเว็บ (ไม่ใช่แค่หน้า
xeno-skills): text-first, neutral base + accent เดียว, ไม่ใช้ AI gradient/glassmorphism,
แสดง dissent/limitation ตรง ๆ แทนภาพว่าทุกอย่างสมบูรณ์แบบ — ใช้กับหน้า `/ecosystem/*` ด้วย
เพื่อให้ทั้งเว็บอ่านเป็นระบบเดียวกัน ไม่ใช่ 3 สไตล์ต่างกัน

## 7. ความถูกต้องที่ต้องระวังเป็นพิเศษ (สรุปจาก 3 research doc)

1. openclink: ต้องขึ้น deep-scan finding (2026-08-13) ว่า "silent failure is the house
   style" พร้อมช่องโหว่จริงที่พบ — ห้ามนำเสนอเป็นเครื่องมือไร้ข้อบกพร่อง
2. Clone Space: ระบุชัดว่า framing "anti-AI-slop" มาจากเจ้าของโปรเจกต์ ไม่ใช่คำที่ repo
   ประกาศเอง
3. xeno-skills: ห้ามนำเสนอ T4-Compact เป็น production-ready (ยัง experimental)
4. ทุก metric ต้องมี date + source + limitation ตาม content model เดิม

## 8. Scaffold ปัจจุบัน vs. ที่ต้องเปลี่ยน

มีอยู่แล้ว: `/`, `/blog`, `/blog/[slug]`, `/ecosystem`, `/ecosystem/[slug]`,
`lib/content.ts`, `components/markdown.tsx`, `site-header.tsx`, `site-footer.tsx`

ต้องสร้างใหม่:
- เขียน `page.tsx` (`/`) ใหม่ทั้งหมดเป็น long-scroll ตาม §3
- component `SkillCard` (hover preview) + `OriginStoryPopup` (SSR'd, query-param toggle)
- component ต่อ section (`ProblemSection`, `MultiAgentSection`, `T4StandardSection`,
  `HooksSection`, `EvidenceSection`, `BuiltOnSection`, `InstallSection`)
- content source ใหม่สำหรับ skill catalog + origin story (derive จาก
  `docs/xeno-skills-origin-stories.md` — ต้องตัดสินใจตอนทำ implementation plan ว่าจะ
  copy เป็น content file แบบมี frontmatter หรือ generate จาก source จริงยังไง)
- ปรับเนื้อหา `content/ecosystem/openclink.md`, `content/ecosystem/clone-space.md` ให้ลึก
  ตาม `docs/openclink-present-blog-brief.md`, `docs/clone-space-present-blog-brief.md`

## 9. นอกขอบเขตของ spec นี้ (ตัดสินใจตอนทำ implementation plan)

- รายละเอียด animation/scroll-trigger ของ popup และ diagram
- mobile-specific behavior ของ popup (full-screen sheet หรือ centered modal)
- จะ derive skill catalog จาก `xeno-skills` repo อัตโนมัติ หรือ copy เป็น content แบบ static
  ในรอบแรก (mirror ปัญหา documentation drift ที่ brief เดิมเตือนไว้ใน §13)
