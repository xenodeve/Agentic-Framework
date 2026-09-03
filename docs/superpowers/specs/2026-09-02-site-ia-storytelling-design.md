---
title: "Agentic Framework website — hub-and-spoke, single-scroll IA"
status: approved
date: "2026-09-02"
approved: "2026-09-02 — developer directive: full redesign per this spec + the docs/ content sources"
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

## 6. Brand/visual direction (revised 2026-09-03)

> **สถานะ: approved 2026-09-03 (developer sign-off)** เวอร์ชันก่อนของ section นี้
> (ตัดสินใจ 2026-09-02: direction “Swiss Signal” accent แดง + hero แถบดำ, body layout
> “Quiet Ledger” ดัชนีซ้าย sticky, และ Visible Grid) **ถูกแทนที่ 2026-09-03** — หลัง
> developer ดู mock รอบใหม่ redirect มาทาง direction ใหม่ที่ explore อยู่จริงที่
> `docs/mock/visible-grid/index.html` (ชื่อ directory เป็น misnomer — rename ตอน
> direction เด็ดขาด) เนื้อเต็มของเวอร์ชันก่อนดูได้จาก git history และ mock เก่ายังอยู่ครบ
> (`docs/mock/Fable 5.1/index.html`, `docs/mock/Luna/index.html`)

**Direction ที่กำลัง explore: Editorial Minimalism × Modern Swiss × Liquid Glass — เป็น 3 ส่วน**
(Visible Grid ถูกตัดรอบนี้: ไม่มีเส้น column, ไม่มีไม้บรรทัด `01–12`, ไม่มี registration marks,
ไม่มีปุ่ม GRID / คีย์ `G` — revisit ภายหลัง sign-off)

- palette light: paper `#f3f2ec` · ink `#131310` · accent เดียว ultramarine `#2233c9`;
  dark theme: paper `#0d0d10` · ink `#eceada` · accent `#8f9bff` (contrast วัดจริงแล้ว —
  text เล็กทุกสี ≥4.5:1 ยกเว้น `--faint` light ที่ต้องรับค่าเดียวกับ `--muted` เพราะ paper นี้
  ไม่มีแถบ AA ระหว่างสองสี — วัดแล้ว `#74726b` = 4.29 fail)
- font: display/body Latin = Archivo (width axis บีบแคบเฉพาะ headline), **ไทย = Bai Jamjuree**
  (+ line-height display เพิ่มสำหรับ diacritics ที่ซ้อน), mono = JetBrains Mono สำหรับ
  label/annotation เท่านั้น
- **ภาษา: ไทยเป็นภาษาหลัก + ปุ่มสลับ TH | EN** (persist `localStorage`, update
  `html[lang]`); identifier / command / skill slug คงอังกฤษ byte-exact เสมอ
- **theme: light/dark** — default ตาม `prefers-color-scheme`, สลับด้วยปุ่ม persist
- Liquid Glass ใช้เป็น *ชั้นเครื่องมือที่ลอยเหนือหน้ากระดาษ* เท่านั้น (sticky nav,
  origin-story popup, card เดียว) — ห้ามเป็นพื้นหลัง section, ห้ามซ้อน glass บน glass,
  ห้าม blob/orb/3D; สูตรเดียว `backdrop-filter: blur(≈22px) saturate(170%)` + fallback
  อ่านได้เมื่อไม่รองรับ (ข้อยกเว้น glassmorphism จาก brief §14 ยังคงใช้ตามนี้)
- mono annotation (slug, src lines, tag) เป็นอังกฤษเสมอ — อ่านเป็น code ไม่ใช่ prose

หลักที่ยังคงจาก brief §14 (ไม่เปลี่ยน): text-first, neutral base + accent เดียว, contrast สูง,
whitespace สื่อความมั่นใจ, แสดง dissent/limitation ตรง ๆ แทนภาพว่าทุกอย่างสมบูรณ์แบบ,
ไม่ใช้ AI gradient ม่วง/ฟ้า, ไม่ใช้ card grid สามคอลัมน์แบบ SaaS, ไม่มี claim ที่ไม่มี source

Micro-rules ที่ต้องคงไว้ (จาก `design-rules` / `design-audit`): type scale Major Third 1.25
จาก 16px ยกเว้น hero title เป็น display exception; spacing ลง 8pt; contrast ≥4.5:1 สำหรับ
text เล็ก (ค่าที่วัดจริงอยู่ในรายการบน); ปุ่มทุกปุ่มมี default / hover / active (+disabled
เมื่อใช้) states; **OG title / description / image ยังต้องทำก่อน deploy** (ตรวจ 2026-09-03 —
site ปัจจุบันยังไม่มี); ข้อมูลเกิน 4 รายการ chunk เป็นกลุ่ม

Motion: quiet reveal ตอน scroll + hover lift เท่านั้น เคารพ `prefers-reduced-motion`
(รายละเอียด animation popup/diagram อยู่นอกขอบเขตตาม §10; motion pass ทั้งก้อนยัง open
— ดู ledger)

**สิ่งที่ถูกแทนที่ (ไม่บังคับใช้อีกต่อไป):** Swiss red accent `#e63312`, hero แถบดำ,
ไม้บรรทัดคอลัมน์สีแดง, Visible Grid (เส้น + ปุ่ม GRID / คีย์ `G`), ดัชนีซ้าย sticky
(“Quiet Ledger”), และ hard-decision record ของ Phase 1–3 รอบนั้น (เก็บตรงนี้เป็น record เดียว —
mock เก่าใน `docs/mock/` ยังเป็น reference)

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

## 9. รอบ review ที่สอง (external AI review, verified ก่อนรับเข้า)

ตรวจ claim เฉพาะเจาะจงกับ repo จริงก่อนรับเข้า spec (ห้ามเชื่อ AI ตัวอื่นตรง ๆ โดยไม่ verify):

- จำนวน skill 19 ตัว **ยืนยันถูกต้องแล้ว** (นับจาก `SKILL.md` จริงใน `xeno-skills/skills/`)
- `using-clink` มี pal/openclink registration-key drift จริง (`#204`, บรรทัด 38-41 ของ
  `skills/multi-agent/using-clink/SKILL.md`) — ใช้เป็น evidence เรื่อง honest-about-limits ได้
- ตัวเลข capture ของ Clone Space (82,613 ตัวอักษร GLSL, 9 canvas context, 1,510
  event-listener registration บน chaingpt.org) ตรงกับที่มีอยู่แล้วใน
  `docs/clone-space-analysis.md`
- **Clone Space ยังไม่ได้ wire เข้า `design-setup` จริง** — grep แล้วมีแค่ Dribbble/
  Pinterest/21st.dev เป็นแหล่ง inspiration, ที่เดียวที่ Clone Space โผล่ในทั้ง xeno-skills
  repo คือ `clink-subagents` อ้าง PR ของ `clone-space-mcp` เป็นเคสสอนเรื่อง mutation
  testing เท่านั้น ไม่เกี่ยวกับ design workflow — **ตัดสินใจแล้ว: เขียนเนื้อหาบนเว็บตามที่
  วางไว้ปกติ (Clone Space เป็น reference source ให้ design family) แต่ต้องติด status tag
  `(developing)` ชัดเจนตรงจุดนั้น** ไม่ implement การเชื่อมจริงใน xeno-skills repo ตอนนี้
  (เป็นคนละ repo, นอกขอบเขตเว็บนี้)

เปลี่ยน/เพิ่มจาก spec เดิมตามรอบ review นี้:

1. **Hero** — ห้ามวาง `xeno-skills · openclink · Clone Space` เป็นป้าย 3 ชื่อขนาดเท่ากัน
   ให้ xeno-skills กิน visual mass ส่วนใหญ่ ส่วน openclink/Clone Space โผล่เป็น
   "Powered by" ขนาดเล็กกว่าใต้ positioning statement
2. **Mini architecture diagram** — เพิ่มหลัง Four Outcomes (section 3 เดิม) แบบย่อ
   (xeno-skills → Delegate → OpenClink, xeno-skills → Design → Clone Space) เพื่อ lock
   mental model ตั้งแต่ต้น ก่อนจะ scroll ไปเจอ `#built-on` แบบเต็มท้ายหน้า — `#built-on`
   ยังอยู่ตำแหน่งเดิม ทำหน้าที่ deep explanation
3. **Skill catalog ห้าม hardcode "19"** — ต้อง generate จาก `SKILL.md` จริงตอน build
   (parse frontmatter → `skills.generated.json` → join กับ `WebsiteSkillMeta` ที่มีแค่สิ่งที่
   ไม่อยู่ใน `SKILL.md` เช่น `originStory`, `featured`) กันปัญหา documentation drift
   ที่เกือบเกิดขึ้นแล้วในรอบ review นี้เอง (ตัวเลขที่ผิดไม่ใช่ของเรา แต่แสดงว่าความเสี่ยงมีจริง)
4. **`/ecosystem`** — เปลี่ยนจากตัดทิ้งเฉย ๆ เป็น 308 redirect ไป `/#built-on` (กัน 404
   เพราะเป็น URL ที่คนเดาเองได้ง่าย)

## 10. นอกขอบเขตของ spec นี้ (ตัดสินใจตอนทำ implementation plan)

- รายละเอียด animation/scroll-trigger ของ popup และ diagram
- mobile-specific behavior ของ popup (full-screen sheet หรือ centered modal)
- จะ derive skill catalog จาก `xeno-skills` repo อัตโนมัติ หรือ copy เป็น content แบบ static
  ในรอบแรก (mirror ปัญหา documentation drift ที่ brief เดิมเตือนไว้ใน §13)
