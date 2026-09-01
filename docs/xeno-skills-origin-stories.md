---
title: "xeno-skills — Origin Stories ต่อ Skill (19 ตัว)"
description: "Problem → Attempt → Effectiveness ของแต่ละ skill ดึงจาก SKILL.md จริง สำหรับใช้เขียน popup 'origin story' บนเว็บ present/blog"
status: working-draft
source_repository: "D:\\Github\\xeno-skills"
snapshot_date: "2026-09-02"
---

# xeno-skills — Origin Stories ต่อ Skill

เอกสารนี้ต่อยอดจาก `docs/xeno-skills-analysis.md` และ `docs/xeno-skills-present-blog-brief.md` โดยลงลึกระดับ **skill ต่อ skill** — อ่าน `SKILL.md` จริงทั้ง 19 ตัวใน `D:\Github\xeno-skills\skills\` แล้วดึงเฉพาะ skill ที่มี origin story ชัดเจน (มี problem/incident อ้างอิงในตัวไฟล์เอง) ออกมาเป็น Problem → Attempt → Effectiveness

**หลักการคัดเลือก:** skill ที่ไม่มี incident หรือปัญหาต้นทางเขียนไว้ในตัวเอง จะถูกทำเครื่องหมายว่า "inherit จาก family" แทนการเสก origin story ขึ้นมาเอง ตัวเลข/วันที่ทั้งหมดด้านล่างคัดลอกมาจากข้อความจริงใน `SKILL.md` — ไม่มีการเติมตัวเลขที่ไม่มีอยู่จริง

สถานะที่พบ: **13 skill มี origin story ของตัวเองชัดเจน** (มี incident/measurement อ้างอิงในไฟล์), **6 skill inherit จาก family** (ask-xeno, design-rules, design-psychology, design-audit, using-design, t4-engineering-records)

---

## Router

### ask-xeno

**Problem:** ไม่มี incident ที่ระบุวันที่ในไฟล์นี้เอง — ปัญหาที่ระบุเป็น rationale เชิงป้องกัน: ถ้า router ตัวนี้เขียนรายละเอียดของแต่ละ family ซ้ำไว้ในตัวเอง เนื้อหาจะ "drift" ออกจาก family entry ตัวจริงเมื่อ family นั้นแก้ไขตัวเอง ("restating them here would create a second copy that drifts from the first") และมีความเสี่ยงที่ agent จะเรียก skill ผิดเพราะ "มันคือตัวที่ใกล้ที่สุด" ("A skill invoked because it was the nearest one is worse than none")

**Attempt (วิธีแก้):** ตั้งใจทำให้ไฟล์ "บาง" ที่สุด — มีแค่ตาราง 4 แถวชี้ไปยัง family entry (`using-t4`, `using-clink`, `using-design`, `karpathy-guidelines`) ไม่มีรายละเอียดของ family ใดๆ อยู่ในตัวเอง และมีทางออกชัดเจนเมื่อไม่มี skill ไหนตรง ("say so and use the general skills directly")

**Effectiveness:** ยังไม่มี evidence เชิงตัวเลขใน `SKILL.md` เอง มีแค่ rationale เรื่องป้องกัน drift เอกสารเสริม `docs/xeno-skills-present-blog-brief.md` อ้างว่ามี contract test บังคับให้ทุก skill เข้าถึงได้ภายใน 2-hop และมี byte budget (~1.8KB) แต่ **ข้อความนั้นไม่ปรากฏใน `ask-xeno/SKILL.md` เอง** — ก่อนใช้ตัวเลขนี้บนเว็บควรตรวจสอบกับไฟล์ test จริงใน `xeno-skills/tests/` อีกครั้ง

**Source:** `skills/ask-xeno/SKILL.md` (ทั้งไฟล์ ~19 บรรทัด)

**Date:** ไม่ระบุ

---

## Coding discipline

### karpathy-guidelines

**Problem:** guideline ทั้ง 4 ข้อ (think-before-coding, simplicity-first, surgical-changes, goal-driven-execution) เป็น "prose ที่ agent ถูกไว้ใจให้ทำตาม" ซึ่งพิสูจน์ได้ยากว่าทำจริงหรือไม่ — ไฟล์ระบุ incident ที่วัดได้จริงในกฎข้อ 3 (Surgical Changes) สองกรณี: (1) ไฟล์ `.pyc` สองไฟล์ "ขี่" อยู่บน branch ประมาณ 20 commits เพราะ `importlib` cache bytecode ข้าง source โดยไม่มีใน edit/plan/test ใดๆ เลย เห็นเฉพาะใน `git status` ซึ่งถูกอ่านผิดว่าเป็น "ไฟล์ที่ฉันแก้" แทนที่จะเป็น "ไฟล์ที่เปลี่ยน"; (2) agent แก้ preset list เพิ่ม 1 entry แล้วสังเกตว่ามี entry ที่สองที่ไม่เคยถูกเพิ่ม จึงเพิ่มให้ด้วยและ "เปิดเผย" การกระทำนี้ใน PR body — ซึ่งไฟล์ระบุว่าการเปิดเผยไม่เท่ากับได้รับอนุญาต ("Disclosing an extra change does not authorise it")

**Attempt (วิธีแก้):** เพิ่มกฎย่อยชัดเจน — "If you notice something incomplete, mention it - don't complete it", บังคับให้ทุกไฟล์ที่ stage ต้อง trace กลับไปยัง request ของ user ("every staged file should trace to a change you made"), เตือนว่า `git add -A` stage สิ่งที่ tool เขียนพอๆ กับสิ่งที่ user เขียน จึงต้องอ่าน file list ไม่ใช่แค่ diff

**Effectiveness:** ไฟล์ยอมรับตรงๆ ว่ากฎเหล่านี้ยัง "ไม่สมบูรณ์" — "§3 already has one recorded failure — no rule for completing something left incomplete... found only because a session went wrong and was reconstructed afterwards" คำว่า "Measured" ถูกใช้กำกับทั้งสอง incident แต่ **ไม่มีวันที่ระบุ** และไม่มีตัวเลขอัตราความล้มเหลว (ไม่มี denominator) กลไกการเก็บหลักฐานต่อเนื่องคือให้ agent รายงาน rule ที่ไม่ถูกทำตามเป็น `skill-feedback` issue บน `xenodeve/xeno-skills` ที่ท้ายทุก session

**Source:** `skills/karpathy-guidelines/SKILL.md` §3 "Surgical Changes", §"At session end"

**Date:** ไม่ระบุวันที่ชัดเจน (มีแค่คำว่า "Measured")

---

## Multi-agent / Clink

### using-clink

**Problem:** ชื่อ tool จริงของ `clink` คือ `mcp__<server>__clink` โดย `<server>` เป็น key ที่ client แต่ละเครื่องตั้งเอง ไม่ใช่ชื่อ server ตายตัว — วันที่ **2026-08-20** เครื่องนี้รายงาน `pal: openclink` (server ถูกเปลี่ยนชื่อเป็น `openclink` แต่ registration key ยังเป็น `pal`) ถ้า agent อ่าน rename แล้ว "แก้" ชื่อ tool เป็น `mcp__openclink__clink` จะ resolve ไม่ได้เลย — และปัญหานี้จะพังพร้อมกันทั้ง 4 skill ใน family เดียวกัน (issue `#204`)

**Attempt (วิธีแก้):** สอนให้ resolve prefix ก่อนเรียกทุกครั้งด้วย `claude mcp list` (อ่าน key ทางซ้ายของ colon) แทนที่จะเดาหรือแก้ string ตรงๆ — และชี้ว่า enforcement layer (`hooks/t4-delegation-gate`, `hooks/t4-clink-boundary`) แก้ปัญหานี้ไปแล้วด้วย regex `^mcp__[A-Za-z0-9_.-]+__clink$` ที่ทนต่อการ rename ในขณะที่ prose เดิมไม่ทน

**Effectiveness:** incident `#204` เป็นหลักฐานเชิงประจักษ์ของปัญหาเดิม (สังเกตจริงบนเครื่องพัฒนา วันที่ระบุชัด) ส่วนการแก้ (`PR #206`) ไฟล์เองยอมรับข้อจำกัด — "both spellings are wrong on some machine, so the fix is to stop spelling it" คือไม่มี fix แบบ hardcode ที่ถูกต้องเสมอ ต้อง resolve ทุกครั้งแทน ยังไม่มีตัวเลขว่าการ resolve-ก่อนเรียกลดอัตราความล้มเหลวไปเท่าไหร่ — มีแค่หลักฐานว่า incident เกิดขึ้นจริงครั้งหนึ่ง

**Source:** `skills/multi-agent/using-clink/SKILL.md` §"Resolve the tool name; the prefix is not part of the tool"

**Date:** 2026-08-20 (incident `#204`)

---

### clink-masteragent

**Problem:** ไฟล์เปิดด้วย incident ตรงๆ — "during the work that produced this skill, the orchestrating agent chose a model for a review panel from a recollection of an earlier failure rather than from any score" เมื่อตรวจสอบย้อนหลังกับข้อมูลจริง โมเดลที่เลือก **อ่อนกว่าในแกนที่งานต้องการจริง** — ชนะแค่ hallucination-resistance (ซึ่ง prompt ปิดความเสี่ยงนี้ไปแล้วด้วยการห้ามใช้ tool) แต่แพ้ 3.6 คะแนน composite intelligence และเกือบ 2 เท่าใน agentic ability ซึ่งเป็นแกนที่ "live" อยู่จริงในงานนั้น

**Attempt (วิธีแก้):** ใส่ตาราง score เต็ม (84 model+effort rows) ไว้ **ในไฟล์ skill โดยตรง** แทนที่จะเป็น document แยกที่ต้องเปิดเอง ("Falling from a recommendation to the evidence is a scroll, not a decision") พร้อมกฎ "อย่า rank ด้วย composite index อย่างเดียว" (มีแค่ 34% ของ composite ที่วัดด้วย tool-in-the-loop จริง)

**Effectiveness:** มี incident วัดได้หลายกรณีในไฟล์เดียวกัน — **2026-08-05**: worker `gpt-5.6-luna` ที่ `high` effort ถูกส่งงานพร้อมกัน 2 leaf; code leaf ได้ test ที่ดี แต่ prose leaf คืน assertion 11 ข้อที่เป็น `grep` หาประโยคที่ worker "แต่งขึ้นเอง" — รันผ่านและ reproduce ได้จริงบนเครื่อง orchestrator แต่ assertion ไม่ได้ทดสอบอะไรจริง; **2026-08-05** เช่นกัน: audit detector ที่แก้ไขแล้วยัง flag ผิดพลาดแบบเดิมซ้ำ — เวอร์ชันแรก flag **30 จาก 32** suites ว่ามีปัญหา ทั้งที่ตัวเลขจริงคือ **11 suites** ("Corrected, the real number was 11") ไฟล์สรุปเองว่า "Not yet written" สำหรับ case list ที่จะทำให้การเลือกโมเดลเป็นระบบมากขึ้น (อ้างอิง issue `#74`)

**Source:** `skills/multi-agent/clink-masteragent/SKILL.md` §"Why this exists", §"A delegated green is not a green", §"a delegated detector is neither"

**Date:** 2026-08-05 (สอง incident); incident เรื่องเลือกโมเดลผิดจากความจำไม่ได้ระบุวันที่

---

### clink-brainstorm

**Problem:** convergence ของหลาย agent ไม่ได้แปลว่าคำตอบถูก — ไฟล์มี incident วันที่ระบุชัดสามกรณี: **2026-08-11** prompt ถามว่าการเปลี่ยนแปลงเป็น "the right next move, or displacement activity while the mechanism has four known bypasses" — agent 3 ตัวจาก 3 model family ต่างลงเอยที่คำว่า "displacement" เหมือนกัน (เพราะ prompt เสนอคำตอบไว้ในตัวเอง) เมื่อรัน adversarial round ทั้งสามกลับคำ และตัวหนึ่งเขียนตรงๆ ว่า `"self_critique": "I walked into the offered displacement slot"`; **2026-08-13** panel ตัดสิน plan ที่บรรยายว่า reviewer เช็ค "rules were followed" — agent ทั้งสามตีความคำว่า "rules" ไปทาง "code quality ดีไหม" ทั้งหมด ทั้งที่ developer หมายถึง "workflow ถูก process ไหม" — unanimous agreement บนคำตีความที่ผิด; **2026-08-11** อีกกรณี: agentic agent ถูกสั่งห้ามอ่านไฟล์ แล้วให้คำตอบเหมือน `chat` ที่ latency แย่กว่า จนกระทั่งตัวหนึ่ง "ฝ่าฝืน" คำสั่งไปอ่านไฟล์จริง 11 ไฟล์ (351s, 426k input tokens) แล้วถอนข้อเสนอของตัวเองออก — นั่นคือ round เดียวที่ให้คำตอบที่มีค่า

**Attempt (วิธีแก้):** เพิ่ม "prompt audit" ก่อนยิงคำถามจริง (เช็คว่า prompt เสนอคำตอบไว้ในตัวหรือไม่, label ตัวเลือกใดไว้หรือไม่, บอกจุดยืนของผู้ถามหรือไม่) และเพิ่ม "forced adversarial round" หลัง agent เห็นตรงกัน โดย tailor คำถามท้าทายตาม cognitive lens ของแต่ละ agent

**Effectiveness:** incident ทั้งสามมีวันที่และรายละเอียดชัดเจนในไฟล์ ไฟล์เองสรุปว่า "The tell is that there is no tell" — prompt ที่มี constraint ชัดเจน ระบุไฟล์ ตัวเลือก 3 แบบ และ word count แล้วยังพลาดได้จากคำนามคำเดียวที่มีสองความหมาย แสดงว่า audit ที่ทำต้องเช็คที่ "terms" ไม่ใช่ "คุณภาพ prompt โดยรวม" ยังไม่มีตัวเลขอัตราความสำเร็จของ prompt-audit ใหม่ (เพิ่งเพิ่มกฎหลัง incident เหล่านี้)

**Source:** `skills/multi-agent/clink-brainstorm/SKILL.md` §"How to run a brainstorm round" (ข้อ 1), §"When agents converge"

**Date:** 2026-08-11, 2026-08-13

---

### clink-subagents

**Problem:** มี incident หลักที่วันที่ระบุชัดคือ **2026-08-11** — orchestrator implement ทั้ง clink client (parser, agent, config, discovery, doc 4 ไฟล์) โดย **ไม่ delegate อะไรเลยสักชิ้น** ทั้งที่ repo's `CLAUDE.md` เปิดด้วย "delegation is the default, not the optimisation" และ developer เพิ่งเรียก `/clink-subagents` กับ `/clink-masteragent` ในข้อความก่อนหน้าทันที — ไฟล์สรุปว่า "the gap is not knowledge... the selection step did not run and conclude keep; it never ran" — ปัญหาคือไม่มี "moment" ที่บังคับให้ตัดสินใจ delegate/keep ไม่ใช่ปัญหาความรู้

**Attempt (วิธีแก้):** เพิ่มกฎ "ก่อน edit แรกของงานที่มีมากกว่า 1 leaf ต้อง name แต่ละ leaf แล้วบันทึก delegate/keep พร้อมเหตุผล" — บันทึกแค่บรรทัดเดียวต่อ leaf แต่ทำให้ "keep" ตรวจสอบย้อนหลังได้ พร้อมสูตร token economics ที่เทียบ "สิ่งที่จะอ่าน+คิดเอง" กับ "prompt+ผลลัพธ์+verification" เพื่อตัดสิน delegate/keep อย่างเป็นระบบแทนความรู้สึก

**Effectiveness:** มี incident วัดได้อีกหลายชุดในไฟล์เดียวกัน — **2026-08-05**: model/effort เดียวกัน (`gpt-5.6-luna` `high`) ส่งงาน 2 leaf พร้อมกัน code leaf คืน test ที่ดี prose leaf คืน assertion ที่เป็นประโยค "ที่ worker แต่งขึ้นเอง" ทั้งหมด (แสดงว่า "verifiable" ต้องหมายถึง observable behaviour ไม่ใช่ checkable-looking); **2026-08-04**: ตาราง "jobs a client cannot do" ถูก re-verify พร้อมวันที่กำกับทุกแถว (เช่น antigravity รันคำสั่งไม่ได้เมื่อ headless — verified 2026-08-04); **2026-07-31**: latency วัดจริงบน T4-Fastwork — codex 401s/529s, cursor 108s, antigravity 55s สำหรับงาน read-heavy (บันทึกใน `xeno-skills` issue `#55`); **2026-07-16**: token economics วัดจริง — สรุปงานยาว 30,696 ตัวอักษรด้วยตัวเองใช้ token ~8.5k เทียบกับ delegate ที่ใช้ 240–464 token difficulty ladder (R0–R3) วัดจุดที่แต่ละ client "แตก" — qwen แตกที่ R2 (mutate input โดยไม่รู้ตัว), antigravity แตกที่ R3 (รันไฟล์เองไม่ได้), codex ผ่าน R3 ทั้งหมด

**Source:** `skills/multi-agent/clink-subagents/SKILL.md` §"When to delegate — and when not to", §"Benchmark of record"

**Date:** 2026-08-11, 2026-08-05, 2026-08-04, 2026-07-31, 2026-07-16

---

### clink-debug

**Problem:** ไฟล์นี้ไม่มี incident ที่ระบุวันที่ในตัวเอง — ปัญหาที่อธิบายเป็น pattern เชิงกลไกที่ตั้งชื่อไว้ว่า **"hypothesis laundering"**: worker เสนอ hypothesis ที่ดูสมเหตุสมผล แล้วถูกส่งผ่าน review ที่ไม่ได้ independent จริง กลับมาเป็น "panel-backed certainty" ซึ่งไฟล์บอกว่าแย่กว่าการให้ agent เดียว debug คนเดียว เพราะ "the ceremony manufactures confidence that nothing in the process earned"

**Attempt (วิธีแก้):** กำหนด seat rule ตายตัว — Promote/Decide/Close ต้องเป็นของ orchestrator เท่านั้น ห้าม subagent ทำ, Falsify/Repair ต้องใช้ "fresh lineage" เท่านั้น (ห้าม continuation_id เดิม, ควรเปลี่ยน client ด้วย) และห้าม agent ที่เสนอ hypothesis ทำหน้าที่ falsify หรือ repair hypothesis ของตัวเอง

**Effectiveness:** ยังไม่มี evidence เชิงตัวเลขหรือ incident ที่มีวันที่กำกับใน `SKILL.md` นี้เอง — มีแค่ rationale เชิงกลไกอธิบายว่าทำไม pattern นี้ถึงล้มเหลว (ต่างจาก `clink-masteragent` และ `clink-brainstorm` ในตระกูลเดียวกันที่มี incident วันที่ชัดเจน) ไฟล์ที่เกี่ยวข้อง (`clink-masteragent`) อ้างว่า "Every defect found in these skills so far came from a session going wrong" ซึ่งบอกเป็นนัยว่า mechanism ของ `clink-debug` เองก็น่าจะมาจากการสังเกตแบบเดียวกัน แต่ไม่มีการอ้างอิงเคสเฉพาะไว้ในไฟล์นี้

**Source:** `skills/multi-agent/clink-debug/SKILL.md` §"The provenance rule"

**Date:** ไม่ระบุ

---

## T4 operating layer

### using-t4

**Problem:** ไฟล์นี้เคยถูก inject "verbatim" ทุก session start และทุกครั้งที่ compact ด้วยขนาด **8,974 bytes เทียบกับ cap 9,000 bytes** — เหลือพื้นที่แค่ 26 ไบต์ก่อนจะเกิน budget ("MAINTAINERS" comment ในไฟล์เองบันทึกไว้ตรงๆ) การแก้ไขเนื้อหาในอนาคตเสี่ยงชนกับกฎอีกข้อที่บังคับให้มี 5 phrase เป๊ะๆ อยู่ในไฟล์ (`Route first` · `Red flags` · `phase boundary` · `does not discharge` · `load the current one`) ทำให้การ trim เพื่อลดขนาดมีโอกาสไปตัด phrase ที่ contract test บังคับไว้โดยไม่รู้ตัว

**Attempt (วิธีแก้):** ย้าย mechanism การ inject จริงไปที่ `hooks/t4-directive.md` (~1.3KB) ที่คัดมาแค่ 5 phrase หลัก ส่วน `using-t4/SKILL.md` เปลี่ยนเป็นไฟล์ที่ **agent load เมื่อ route เท่านั้น** (ไม่ inject verbatim อีกต่อไป) — อ้างอิง issue `#182` ว่าเป็นจุดที่แก้ปัญหานี้ และมี test บังคับ `tests/hooks/test-dispatcher-content.sh` คอยเช็ค 5 phrase ทุกครั้งที่แก้ไฟล์

**Effectiveness:** ตัวเลข 8,974B/9,000B เป็นตัวเลขจริงที่บันทึกไว้ในไฟล์ (ไม่ใช่ค่าประมาณ) และมี contract test คุ้มครองเนื้อหาอยู่จริง (`test-dispatcher-content.sh`) — เป็นตัวอย่างที่หายากในกลุ่ม skill นี้ที่มีทั้ง "อาการ" (byte overflow เกือบเกิด) และ "กลไกป้องกันซ้ำ" (test) ครบ แต่ไม่มีข้อมูลว่าการ inject แบบ verbatim เคยทำให้ session พังจริงกี่ครั้งก่อนจะแก้

**Source:** `skills/t4/using-t4/SKILL.md` ส่วน comment บนสุดของไฟล์ (MAINTAINERS note), issue `#182`

**Date:** ไม่ระบุวันที่ (มีเลข issue `#182` และตัวเลข byte กำกับ)

---

### t4-project-bootstrap

**Problem:** ไฟล์นี้มี incident วันที่/เลข issue อ้างอิงหนาแน่นที่สุดไฟล์หนึ่งในกลุ่ม T4 — **`#244`**: `/ask-xeno` ถูกเรียกตอนต้น session แต่ไม่เคยเข้า `using-t4` จริง ทำให้เอกสารหลายพันคำถูกส่งให้ developer โดยไม่เคยโหลด `t4-bro` (มาตรฐานภาษา) เลย; **`#84`**: ก่อน fix นี้ executable ที่เรียกด้วย absolute path หลุดจาก `PreToolUse` gate ไปเลย ทำให้ `"C:\Program Files\GitHub CLI\gh.exe" pr create` ข้าม PR-needs-issue rule ได้แบบไม่มีสัญญาณเตือน; **`#129`**: agent เขียนลงเอกสารวิจัยว่า "this tool has never been installed or run" ทั้งที่เครื่องมือ (`bun`) ติดตั้งจริงที่ `~/.bun/bin/` แค่ไม่ได้อยู่บน PATH; วัดจริง **2026-08-04** บน repo ที่ bootstrap ไปแล้ว: มีแค่ **8 จาก 19 label ที่เอกสารระบุไว้จริง** (`needs-triage` เป็นหนึ่งใน label ที่หาย)

**Attempt (วิธีแก้):** เพิ่ม 3 prerequisite ที่ต้องเช็คก่อนเริ่ม bootstrap จริง (โหลด discipline เองก่อนอ่าน repo, resolve tool ด้วย absolute path ก่อนสรุปว่าไม่มี, ถาม developer เรื่อง companion ecosystem แทนเดา) และเพิ่ม step 11 ที่บังคับ "พูดผลออกมาดังๆ แม้ตอนที่ผ่าน" — เพราะ "a repo with the docs and no hooks looks bootstrapped" (docs วางไว้ครบแต่ hook ไม่ทำงานจริงมองไม่ออกจากภายนอก) พร้อมสั่งให้ `gh label create` จริงแล้วรายงานว่าอันไหนสร้างแล้ว อันไหนมีอยู่แล้ว อันไหนข้าม

**Effectiveness:** incident ทั้งหมดข้างต้นมีเลข issue หรือวันที่กำกับชัดเจนในไฟล์เอง เป็นหลักฐานเชิงประจักษ์ระดับสูงกว่า skill อื่นในกลุ่ม แต่ยังไม่มีตัวเลขว่า checklist ใหม่ (step 1-3, step 11) ป้องกันการเกิดซ้ำได้จริงกี่ % — มีแค่หลักฐานว่าปัญหาเกิดขึ้นจริงมาก่อนและมีการแก้ไขเชิงกระบวนการ

**Source:** `skills/t4/t4-project-bootstrap/SKILL.md` §"Before you start", §5 (label creation), issue `#244` `#84` `#129`

**Date:** 2026-08-04 (label sync); incident `#244` `#84` `#129` ไม่ระบุวันที่ตรง มีแค่เลข issue

---

### t4-agent-memory

**Problem:** ระบบบันทึก skill-usage feedback (`t4-skill-log` hook) อาจ "หายไปเงียบๆ" เมื่อ branch ถูก cut จาก base ที่เก่ากว่าวันที่ hook ถูกติดตั้ง — วัดจริงในไฟล์: จาก **52 ครั้งที่ `Skill` tool ถูกเรียกใน session เดียว log บันทึกได้แค่ 11 ครั้ง** และมี "ช่องว่างต่อเนื่อง 3 ครั้ง" ที่ล้อมกรอบด้วยคำสั่ง `git switch` สองคำสั่งพอดี (branch ที่ cut จาก base เก่าไม่มี hook) ไฟล์ยังบันทึกว่ามีสมมติฐานผิด 2 ข้อที่เคยถูกเสนอมาก่อนจะเจอสาเหตุจริง (คิดว่า logger filter non-library skill ออก, คิดว่า argv cap 32KB กินข้อมูลไป) — ทั้งสองข้อผิดเมื่อตรวจสอบจริง

**Attempt (วิธีแก้):** แยกให้ชัดว่า "การขาดหายในไฟล์ log" คือ `unknown` ไม่ใช่ `no` จนกว่าจะเช็คว่า hook มีอยู่จริงในช่วงเวลานั้น (`git log --diff-filter=A -- .claude/hooks/t4-skill-log` เพื่อหาจุดเริ่ม denominator) และแยกให้ชัดว่า **"denominator" (skill อะไรถูกเรียก) เป็นสิ่งที่ hook ตรวจสอบได้จริง** แต่ **"rule นั้นทำตามจริงไหม" เป็นสิ่งที่ไม่มี hook ใดตรวจได้** — ต้องอาศัย agent discipline รายงานเอง

**Effectiveness:** มี measurement ตัวเลขจริงในไฟล์ (52 vs 11) พร้อม 3-session tracking ที่ระบุวันที่ชัดเจน — **2026-08-14**: ไม่มีทั้ง tracker issue และ local note (handoff แค่ "ตั้งชื่อหนี้" แต่ไม่จ่าย); **2026-08-17**: มี tracker issue เขียนไว้ ("owed"); **2026-08-19**: มีทั้งคู่ แต่ไฟล์ยอมรับตรงๆ ว่า "The third row is not a success. The report was produced because something external kept the session going, not because reaching the end produced it" — คือยังไม่มั่นใจว่ากลไกใหม่แก้ปัญหาได้จริงหรือแค่บังเอิญ

**Source:** `skills/t4/t4-agent-memory/SKILL.md` §"What an absence in the log means", §"The Obsidian note"

**Date:** 2026-08-14, 2026-08-17, 2026-08-19

---

### t4-dev-workflow

**Problem:** เป็น skill ที่มี incident วันที่ระบุมากที่สุดในทั้งหมด 19 ตัว — ตัวอย่างที่ชัดที่สุด 4 กรณี: (1) **`#78` vs `#86`** (วันเดียวกัน ห่างกันไม่กี่นาที): `#78` ข้าม survey ก่อนวางแผน ผลคือ clause ที่เพิ่มเข้าไปทำให้ injected dispatcher โต **9,033B เทียบ cap 9,000B** ส่วน `#86` ทำ survey ก่อนและ budget การเพิ่มไว้ล่วงหน้า — ไฟล์สรุปว่าความต่างไม่ใช่ความขยัน แต่เป็นเพราะ `#86` มี survey เป็น section ในตัว issue เอง; (2) **2026-08-19**: คำสั่ง `gh issue close` ยิงสำเร็จ **สองครั้งขณะที่ PR ยังไม่ merge** เพราะ chain ด้วย `&&` กับคำสั่งอื่นที่ print "not mergeable" ออกมาแต่ exit code ไม่ถูกเช็ค; (3) **2026-08-11**: merge PR แม่ (`#35`) ด้วย `--delete-branch` ทำให้ PR ลูก (`#41`) ที่ base อยู่บน branch เดียวกันถูกปิดอัตโนมัติแบบกู้คืนไม่ได้ (`gh pr reopen` ล้มเหลว เพราะ base branch ไม่มีอยู่แล้ว); (4) **2026-08-14**: ตัวเลข cost-per-task จาก Artificial Analysis ถูกใช้อ้างอิงผิด lane สองครั้งซ้อน (วัด metered API lane แต่ผู้ใช้จริงอยู่บน flat subscription) developer ต้องแก้ไขให้สองครั้ง

**Attempt (วิธีแก้):** เพิ่มกฎเฉพาะจุดสำหรับแต่ละ incident — survey เปลี่ยนจาก "phase-boundary trigger" เป็น "action trigger" (ก่อนเขียนสิ่งที่จะเปลี่ยนแปลงลงไปครั้งแรก); เพิ่มกฎ "precondition ของ action ต้องอ่านเป็น step แยก ไม่ chain ด้วย `&&`"; เพิ่มขั้นตอนตายตัว "retarget child PR ไป `main` ก่อน merge parent เสมอ"; เพิ่มกฎ "ถามว่าตัวเลขนี้วัดหน่วยอะไร ก่อนใช้ตัดสินใจ"

**Effectiveness:** ทุก incident ข้างต้นมีเลข issue หรือวันที่กำกับชัดเจน และไฟล์ยังบันทึก incident อื่นเพิ่มอีก เช่น **`#242`** (2026-08-18): skill ที่ถูก `disable-model-invocation` หายไปจาก listing โดยไม่มีสัญญาณ ทำให้ agent เข้าใจผิดว่า skill "ไม่มี" แล้วเขียนงานซ้ำเอง; และ PR `pal-mcp-server#86` ที่ผ่าน gate (`T4-Gates: simplify=not-run code-review=not-run scrutinize=not-run security-review=not-run verify=ran` — ทุกค่าถูกต้องตามรูปแบบ) แต่ผิดกฎที่ลึกกว่า (ไม่มี checkable fact รองรับการข้ามแต่ละ gate เลยสักข้อ) — ไฟล์เองสรุปบทเรียนว่า "A permissive guard beside a strict rule relaxes the strict rule in practice unless the difference is stated where the rule is" ยังไม่มีตัวเลขอัตราความสำเร็จของกฎใหม่ทั้งหมดนี้ — มีแค่หลักฐานว่าปัญหาเกิดขึ้นจริงและมีบันทึกละเอียด

**Source:** `skills/t4/t4-dev-workflow/SKILL.md` §"Survey the change sites", §"No verdict before evidence", §"Retarget a stacked PR", §"Skipping a rule requires proof"

**Date:** 2026-08-11, 2026-08-14, 2026-08-17, 2026-08-18, 2026-08-19 (หลาย incident คนละวันในไฟล์เดียว)

---

### t4-afk

**Problem:** gate ที่ถูกเลื่อนไปทำท้าย batch แทนที่จะทำทันทีต่อ item เท่ากับไม่ได้ทำเลย — ไฟล์ระบุ measurement (ไม่มีวันที่กำกับ): batch ที่เลื่อน `/code-review` และ `/scrutinize` ไปรวบรัดครั้งเดียวกับ 62 commits พบ **defect 3 ตัว ที่ commit ไปแล้วทั้งหมด** หนึ่งในนั้นเขียนโดย session เดียวกันเองเมื่อไม่กี่ชั่วโมงก่อน และ 2 ใน 3 fix ต้องเขียน **หลังจาก branch merge ไปแล้ว**

**Attempt (วิธีแก้):** เปลี่ยน trigger จาก "phase boundary" (จับยาก เพราะไม่มีใครสังเกตว่าข้ามไปแล้ว) เป็น "cue ที่จับได้ชัด" — "the first item that changes a file" และบังคับให้ digest ท้าย batch ต้อง "enumerate" ทุก gate เป็น ran/not-run/n-a **ต่อ item ไม่ใช่ต่อ batch** เพราะคำตอบเดียวที่ครอบ 50 commits ผ่านข้อบังคับ "state every gate" ได้โดยไม่โกหกสักคำ แต่ไม่บอกอะไรเลย

**Effectiveness:** มี measurement เชิงตัวเลข (3 defects จาก 62 commits) แต่ **ไม่มีวันที่กำกับ** ในไฟล์นี้ และไม่มี denominator ว่า batch แบบนี้เกิดกี่ครั้งก่อนจะพบปัญหา ไฟล์อ้างอิง incident ของ `t4-dev-workflow` (`#78`/`#86`) เชิงโครงสร้างเดียวกัน (trigger ที่ phase-boundary ไม่ทำงาน) แต่ไม่ใช่ incident ของตัวเอง

**Source:** `skills/t4/t4-afk/SKILL.md` §"The safe per-item loop" (ข้อ 4)

**Date:** ไม่ระบุ (มีแค่คำว่า "Measured")

---

### t4-bro

**Problem:** กฎนี้ควรจะ apply ทุกข้อความที่ developer อ่าน แต่ไฟล์ระบุว่าตัวมันเองถูกข้ามไปจริงในวันที่ **2026-08-14** — แม้ skill นี้ถูกโหลดอยู่แล้ว การอธิบายออกแบบยาวชุดหนึ่งถูกส่งออกไปเป็น **ภาษาอังกฤษ** developer ต้องเขียน "คุยเป็นภาษาไทย" ซ้ำสองครั้งและเรียก `/t4-bro` เป็นครั้งที่สามถึงจะถูกทำตาม ไฟล์สรุปว่า "the rule was not skipped for a stated reason; it was never applied, which is worse, because there is no decision to review" — และในวันที่ **2026-08-12** มี incident แยกอีกกรณี (เรื่อง "shape" ของคำตอบ ไม่ใช่ภาษา): agent ตอบ 4 คำถามด้วย `##` heading + ตาราง 2 อัน + ตัวหนาแทบทุกบรรทัด ทั้งที่คำศัพท์ระดับคำทุกคำถูกต้องตามกฎแล้ว

**Attempt (วิธีแก้):** ระบุ "trigger ที่จับได้จริง" แทนกฎที่ครอบคลุมทุกข้อความ (ซึ่งเท่ากับไม่มี trigger เลย) — คือ "**ข้อความ prose แรกหลังช่วง tool work ต่อเนื่อง**" เพราะเป็นจุดที่ agent เพิ่งอ่าน output ภาษาอังกฤษมาแล้วมักเขียนต่อเป็นอังกฤษ และเพิ่มตาราง before/after จากประโยคจริงใน session ของ repo นี้เอง เพื่อสอน register ที่ถูกต้อง

**Effectiveness:** incident วันที่ 2026-08-14 มีวันที่และรายละเอียดชัดเจนที่สุดในกลุ่ม (developer แก้ไขซ้ำ 2 ครั้ง + เรียก skill ซ้ำ 1 ครั้ง ใน session เดียว) ไฟล์เองยอมรับว่ากฎเรื่อง "shape" ก็เพิ่งถูกแก้ไปแล้วครั้งหนึ่งด้วย worked-example (PR `#140`, incident 2026-08-12) แล้วยังพบว่ากฎภาษา (ชัดเจนกว่า "shape" มาก) ก็ยังพลาดได้อยู่ดี — สรุปเองว่า "A rule that is unambiguous and still not applied has a trigger problem, not a clarity problem" ยังไม่มีข้อมูลว่ากฎ trigger ใหม่ (tool-work→prose boundary) ป้องกันการเกิดซ้ำได้จริงหรือไม่ เพราะเพิ่งถูกเพิ่มหลัง incident นี้

**Source:** `skills/t4/t4-bro/SKILL.md` §"The moment this fires"

**Date:** 2026-08-14 (ภาษา), 2026-08-12 (shape, PR #140)

---

### t4-engineering-records

**Problem:** *inherit จาก origin story ของ `t4-dev-workflow`* — ไฟล์นี้เป็นชุด template/แนวทางเลือกประเภท record (post-mortem / ADR / system-impact / bug-catalog) ไม่มี incident หรือวันที่อ้างอิงในตัวเอง เหตุผลที่ต้อง "รักษาความน่าเชื่อถือของ record" (`file:line`, commit SHA, validated-only) มาจาก incident จริงที่บันทึกไว้ใน `t4-dev-workflow` (เช่น "No verdict before evidence" §, สาม incident วันที่ 2026-08-17 ที่ evidence ถูกต้องแต่ตอบผิดคำถาม) และหลักการ "unverified record is worse than none" ก็สอดคล้องกับหลักการเดียวกันใน `t4-agent-memory` เรื่อง "freshness over authority"

**Source:** `skills/t4/t4-engineering-records/SKILL.md` (ทั้งไฟล์ — ไม่มี incident ของตัวเอง), เทียบกับ `skills/t4/t4-dev-workflow/SKILL.md` §"No verdict before evidence"

---

## Design family

### design-setup

**Problem:** ไม่มี incident ที่ระบุวันที่ในไฟล์นี้ — ปัญหาที่ระบุเป็น pattern เชิงคุณภาพงานที่สังเกตซ้ำๆ ("AI Slop"): output design จาก AI มักออกมาเป็นแพทเทิร์นซ้ำเดิม — "generic dark slate modes, cyan/purple gradients, default Inter fonts, 3D blobs, uniform 3-column cards, and cliché copy" ไฟล์ระบุสาเหตุเชิงกลไกไว้ตรงๆ ว่า "AI has no inherent taste and defaults to 'regression to the mean'"

**Attempt (วิธีแก้):** บังคับ 3-phase build sequence พร้อม **Hard Decision Gate** 3 จุดที่ agent ห้ามข้ามเอง (เลือก 1 จาก 5 aesthetic direction → เลือก 1 จาก 3 body-layout variant → เลือก hero image จาก 2-pass generation) และแยก exploratory code ไว้ใน directory ต่างหาก (`/design-exploration/`) ไม่ให้แตะ production route จนกว่าจะอนุมัติ

**Effectiveness:** ยังไม่มี evidence เชิงตัวเลขใน `SKILL.md` เอง — เป็นการแปลง methodology จากวิดีโอวิจัยภายนอก (Chase AI, Chris McCoy) มาเป็นกฎปฏิบัติ ไม่มี incident/metric ของทีม xeno-skills เองมากำกับว่า hard-gate นี้ช่วยลด "AI Slop" ได้จริงกี่เปอร์เซ็นต์ อ้างอิงเพิ่มเติมอยู่ที่ `references/01_chase_ai_anti_slop_web_design.md` และ `references/05_chris_mccoy_5_web_design_skills.md`

**Source:** `skills/design/design-setup/SKILL.md` §0, §1, §6

**Date:** ไม่ระบุ

---

### design-rules

**Problem:** *inherit จาก origin story ของ `design-setup`* — ไฟล์นี้เป็นชุดกฎเชิงตัวเลข (Major Third scale 1.25x, 60-30-10, 8pt grid, 4-state button ฯลฯ) ที่แปลงมาจาก framework ของ Kole Jain / Chris McCoy / Ran Segall / Satori Graphics โดยตรง ไม่มี "ปัญหาที่เกิดขึ้นจริงในทีม xeno-skills" อ้างอิงในตัวไฟล์เอง — ไฟล์ระบุไว้เองว่าเป็น layer ที่ "automatically referenced and enforced by `design-setup`" จึงอาศัย problem framing เดียวกับ `design-setup` (ป้องกัน AI Slop)

**Source:** `skills/design/design-rules/SKILL.md` (ทั้งไฟล์ — ไม่มี incident ของตัวเอง)

---

### design-psychology

**Problem:** *inherit จาก origin story ของ `design-setup`* — ไฟล์เป็นการแปลง framework จิตวิทยาผู้ใช้ (3-Brain Persona, MAYA Principle, Cognitive Chunking) จาก Chris McCoy และ Ran Segall โดยตรง ไม่มี incident ของทีมเองอ้างอิงในไฟล์ ไฟล์ระบุตัวเองว่า "works in synergy with `design-setup` (page layout structuring), `design-rules` (CSS/Tailwind micro-rules), and `design-audit` (conversion audit)" — เป็นส่วนขยายของปัญหาเดียวกัน (ป้องกันงานออกแบบที่ generic/ไม่น่าเชื่อถือ)

**Source:** `skills/design/design-psychology/SKILL.md` (ทั้งไฟล์ — ไม่มี incident ของตัวเอง)

---

### design-audit

**Problem:** *inherit จาก origin story ของ `design-setup`* — ไฟล์แปลง 30-Second First Impression Test ของ Ran Segall (Flux Academy) และ LIFT System ของ Satori Graphics มาเป็น checklist ตรวจสอบ ไม่มี incident ของทีม xeno-skills อ้างอิงในไฟล์ — เป็นขั้นตอน "audit" ที่ปิดท้าย pipeline เดียวกับ `design-setup → design-rules → design-psychology → design-audit` ตามที่ `using-design` ระบุไว้

**Source:** `skills/design/design-audit/SKILL.md` (ทั้งไฟล์ — ไม่มี incident ของตัวเอง)

---

### using-design

**Problem:** ไฟล์นี้เป็น orchestrator/router ของ 4 sub-skill ในตระกูล design ไม่มี incident หรือปัญหาต้นทางเป็นของตัวเอง — ส่วนเดียวที่พาดพิงถึงความล้มเหลวจริงคือย่อหน้าปิดท้าย ("At session end — record what actually happened") ซึ่งเป็น**กลไกเดียวกับที่ยืมมาจาก `t4-agent-memory` ตรงๆ** — ไฟล์เขียนไว้เองว่า "The rules, the skeleton and the read-trigger live in `t4-agent-memory` — load it rather than working from this paragraph"

**Attempt (วิธีแก้):** ไม่มี attempt เฉพาะของตัวเอง — ทำหน้าที่แค่ประกาศลำดับการใช้ 4 sub-skill (`design-setup → design-rules → design-psychology → design-audit`) และยืมกลไกการบันทึก feedback จาก `t4-agent-memory`

**Effectiveness:** ยังไม่มี evidence เชิงตัวเลขของตัวเอง — mechanism การรายงาน rule ที่ไม่ถูกทำตามเป็น `skill-feedback` issue เป็นกลไกร่วมของทั้งไลบรารี ไม่ใช่หลักฐานเฉพาะของ `using-design`

**Source:** `skills/design/using-design/SKILL.md` §"At session end — record what actually happened" (อ้างอิง `t4-agent-memory`)

**Date:** ไม่ระบุ

---

## สรุปสถานะสำหรับทีมเว็บ

| กลุ่ม | มี origin story ของตัวเอง | inherit จาก family |
|---|---|---|
| Router | — | `ask-xeno` (ไม่มี incident แต่มี rationale ป้องกัน drift) |
| Coding discipline | `karpathy-guidelines` | — |
| Multi-agent/Clink | `using-clink`, `clink-masteragent`, `clink-brainstorm`, `clink-subagents`, `clink-debug` (rationale-only) | — |
| T4 | `using-t4`, `t4-project-bootstrap`, `t4-agent-memory`, `t4-dev-workflow`, `t4-afk`, `t4-bro` | `t4-engineering-records` |
| Design | `design-setup` (rationale-only) | `design-rules`, `design-psychology`, `design-audit`, `using-design` |

**สิ่งที่ควรให้มนุษย์ยืนยันเพิ่มก่อนขึ้นเว็บจริง:**

1. ตัวเลข "contract test บังคับ 2-hop navigation + byte budget 1.8KB" ของ `ask-xeno` มาจาก `docs/xeno-skills-present-blog-brief.md` เท่านั้น **ไม่ปรากฏใน `ask-xeno/SKILL.md`** — ต้องเปิด `xeno-skills/tests/` จริงเพื่อยืนยันก่อนอ้างบนเว็บ
2. incident หลายรายการ (โดยเฉพาะกลุ่ม `clink-*` และ `t4-dev-workflow`) อ้างอิงเลข issue (`#78`, `#86`, `#204`, `#244` ฯลฯ) แต่ไม่มีวันที่ครบ — ถ้าต้องการโชว์ timeline บนเว็บควรเปิด GitHub issue จริงเพื่อดึงวันที่ปิด/เปิด issue มาประกอบ
3. `karpathy-guidelines` และ `t4-afk` มีคำว่า "Measured" กำกับ incident แต่ไม่มีวันที่หรือ sample size (denominator) — ควรถามทีมว่ามี log ต้นทางที่ระบุวันที่ไว้หรือไม่ก่อนใช้เป็นหลักฐานเชิงปริมาณ
4. skill ที่ถูกจัดเป็น "inherit จาก family" (design 4 ตัว + `t4-engineering-records`) ยังมีคุณค่าเชิงเนื้อหา (กฎ/checklist ละเอียด) มาก แค่ไม่มี "เหตุการณ์ต้นกำเนิด" ของตัวเอง — popup บนเว็บสำหรับ skill กลุ่มนี้ควรลิงก์ไปยัง origin story ของ skill แม่แทนที่จะปล่อยว่าง
