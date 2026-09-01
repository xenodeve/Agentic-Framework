---
title: "OpenClink — Present & Blog Content Brief"
description: "สรุปบทบาท สถาปัตยกรรม หลักฐาน และแนวทางนำเสนอ OpenClink ในฐานะ transport ที่ xeno-skills เรียกใช้"
status: working-brief
source_repository: "D:\\Github\\pal-mcp-server"
upstream_repo_display_name: "openclink (github.com/xenodeve/openclink)"
snapshot_date: "2026-09-02"
audience:
  - human developers
  - engineering leads
  - AI-agent builders
  - contributors
---

# OpenClink — Present & Blog Content Brief

เอกสารนี้สรุป **OpenClink** (โฟลเดอร์จริงในเครื่อง dev คือ `pal-mcp-server`, repo คือ `xenodeve/openclink`) จาก snapshot วันที่ 2 กันยายน 2026 เพื่อใช้เป็นฐานข้อมูลสำหรับเว็บไซต์นำเสนอผลิตภัณฑ์และบล็อกเชิงวิศวกรรมของ T4 Labs

**ข้อความที่ต้องอ่านก่อนอ่านส่วนอื่น:** เอกสารนี้ไม่ใช่ brief สำหรับ "ผลิตภัณฑ์ตัวที่สาม" ที่มีน้ำหนักเท่า `xeno-skills` บนเว็บไซต์ OpenClink คือ **เครื่องมือสนับสนุนที่ `xeno-skills` เรียกใช้** ผ่านตระกูล skill `clink-*` เท่านั้น (`using-clink`, `clink-brainstorm`, `clink-subagents`, `clink-debug`, `clink-masteragent`) ทุก section ด้านล่างเขียนโดยยึดกรอบนี้ — แม้ OpenClink จะมี tool อีก 18 ตัวและ end-user ของตัวเองนอกบริบท xeno-skills ก็ตาม

## 1. Executive summary

OpenClink เป็น **MCP (Model Context Protocol) server** สองบทบาทในตัวเดียว:

- **`clink` tool** — สะพาน CLI-to-CLI ที่เปิด external CLI agent (Codex CLI, Antigravity `agy`, Cursor `cursor-agent`, OpenCode, Claude Code) ให้รันเป็น subagent ในบริบทแยก แล้วส่งเฉพาะผลลัพธ์กลับเข้ามาในบทสนทนาเดิม
- **tool อีก 18 ตัว** (`chat`, `thinkdeep`, `debug`, `codereview`, `consensus` ฯลฯ) ที่คุยตรงกับ provider โมเดล (Gemini, OpenAI, Azure, X.AI, OpenRouter, DIAL, โมเดลบนเครื่อง) โดยไม่ผ่าน CLI ภายนอก

**สำหรับเว็บไซต์ T4 Labs มีบทบาทเดียวที่สำคัญ**: `clink` tool คือกลไกส่งคำสั่งจริงที่อยู่หลังตระกูล skill `clink-*` ทั้งหมดของ `xeno-skills` เมื่อ `clink-brainstorm` "ยิงคำถามไปหลาย agent พร้อมกัน" หรือ `clink-subagents` "ส่งงานย่อยไปให้ Codex" นั่นคือการเรียก MCP tool `clink` ของ OpenClink หนึ่งครั้งต่อ agent หนึ่งตัว

ประโยค positioning ที่เหมาะกับเว็บไซต์:

> The multi-CLI transport that xeno-skills' clink-* skills speak through — not a standalone product on this site.

ฉบับภาษาไทย:

> ชั้น transport ที่เชื่อม CLI agent หลายตัวเข้าด้วยกัน ให้ตระกูล skill `clink-*` ของ xeno-skills เรียกใช้งานผ่าน MCP tool เดียว — ไม่ใช่ผลิตภัณฑ์แยกที่ยืนเดี่ยวบนเว็บนี้

จุดเด่นเชิงวัฒนธรรมที่ควรใช้เล่าเรื่อง: OpenClink มีรายงาน self-audit ที่ตรวจสอบตัวเองอย่างสุดโต่ง (deep-scan 605 claims, 2026-08-13) และสรุปตรงไปตรงมาว่า **"silent failure is the house style"** — เป็นตัวอย่างของความซื่อสัตย์ทางวิศวกรรมที่ควรใช้เป็นวัตถุดิบบล็อกมากกว่าจะซ่อนไว้

## 2. Repository snapshot และขอบเขตความจริง

- โฟลเดอร์ในเครื่อง: `D:\Github\pal-mcp-server` (repo คือ `xenodeve/openclink`)
- branch ที่อ่าน: `feat/149-clink-run-journal`
- commit ล่าสุดที่อ่าน: `200fcb9` (2026-08-19)
- version: `9.8.2` (`pyproject.toml`, `config.py`) — หมายเหตุ: `config.py` มี `__updated__ = "2025-12-15"` ซึ่ง**ล้าสมัยกว่า**การพัฒนาที่เกิดขึ้นจริงตลอดเดือน 2026-07/08 — เป็นตัวอย่าง metadata drift ที่ไม่ควร copy ขึ้นเว็บโดยไม่ตรวจ
- license: Apache-2.0 (สืบทอดจาก upstream)
- อ้างว่าเป็น fork ของ upstream ที่ "unmaintained since ~mid-2026" — แต่รายงาน deep-scan 2026-08-13 ตรวจ object database แล้วพบ commit ล่าสุดจริงของ upstream คือ **2025-12-15** ไม่ใช่ "กลางปี 2026" ควรใช้คำที่แม่นกว่านี้บนเว็บ
- Python: `pyproject.toml` ระบุ `>=3.9`, README ระบุ 3.10+ แนะนำ, `CLAUDE.md` พูดถึง venv 3 ชื่อต่างกัน (`.venv`, `.openclink_venv`, `venv`) — เป็น doc drift ที่มีอยู่จริง ไม่ควร normalize ให้ดูเรียบร้อยเกินจริงบนเว็บ

ใน snapshot นี้ยังไม่พบเว็บแอปสำหรับ present/blog อยู่ใน repo นี้เอง — เป็น backend/CLI-tool library ล้วน ไม่มีหน้าเว็บของตัวเอง

ตัวเลขในเอกสารนี้ (605 claims, 1,285 tests ผ่าน, 152 ไฟล์เทส ฯลฯ) มาจากรายงาน/ledger ตามวันที่ระบุ หรือจากการนับตรงจาก repo ในวันที่ตรวจ (2026-09-02) ไม่ใช่ตัวเลขที่จะคงที่ตลอดไป — ต้อง re-verify ก่อนใช้ยืนยันบนเว็บทุกครั้งที่ republish

## 3. จุดกำเนิดและปัญหาที่ fork แก้

### 3.1 Antigravity แทนที่ Gemini CLI ที่เลิกใช้

Google เลิก Gemini CLI กลางปี 2026 หันไป **Antigravity** (`agy`) — binary closed-source ตัวใหม่ที่พิมพ์ output เฉพาะเมื่อคิดว่ามี real terminal ต่ออยู่ วิธีที่ MCP server ทุกตัว (รวม OpenClink เดิม) spawn child process คือ plain pipe ธรรมดา ซึ่งทำให้ `agy` คืน stdout ว่างเปล่าพร้อม exit code 0 — เงียบสนิท ไม่มี error ให้เห็น

ทางแก้: รัน `agy` ผ่าน **Windows ConPTY จริง** ด้วยไลบรารี `pywinpty` (ADR 0001, 2026-06-28) — ปัจจุบันใช้ได้เฉพาะ Windows

### 3.2 ต้องเลือก model/effort ได้ต่อ call ไม่ใช่แค่ต่อ config

upstream fix โมเดลของแต่ละ CLI ไว้ที่ config time (`conf/cli_clients/*.json`) — จะเปลี่ยนต้องแก้ไฟล์แล้ว restart server fork นี้เพิ่ม `model` / `reasoning_effort` เป็น parameter optional (ภายหลังกลายเป็น required สำหรับ `model`) ที่ map ต่างกันไปตาม CLI: Codex ใช้ `-m` + `-c model_reasoning_effort=`, ที่เหลือใช้ `--model` เฉย ๆ (ADR 0002, 2026-07-16)

### 3.3 ความหลากหลายของ CLI = ความหลากหลายของตระกูลโมเดล

`cursor-agent` เปิดทางไปยังตระกูลโมเดลที่ client อื่นแตะไม่ถึงเลย — Grok (xAI), Kimi (Moonshot), GLM (Zhipu) `opencode` เปิดทางไปยัง provider `opencode-go` (deepseek, GLM, Kimi, MiniMax, Qwen, Grok ในราคาต่างกันมาก — `deepseek-v4-flash` ซื้องานได้ประมาณ 323 เท่าของ `kimi-k3` ในโควตาเท่ากัน, source: `CHANGES-FORK.md`) นี่คือเหตุผลเชิงกลยุทธ์ที่ `clink-brainstorm` ของ xeno-skills เรียก OpenClink แทนที่จะเรียก provider เดียว — ได้ "ความเห็นที่เป็นอิสระจากกันจริง" ไม่ใช่แค่ 3 ครั้งของตระกูลโมเดลเดียวกัน

## 4. Product DNA — แต่ต้องอ่านคู่กับข้อ 1

OpenClink ไม่มี Product DNA ของตัวเองที่ประกาศไว้ชัดเจนแบบ `xeno-skills` (ไม่มี `PRODUCT.md`) สิ่งที่สังเกตได้จากพฤติกรรมจริงของ repo คือ:

### Additive-only fork

ทุกการเปลี่ยนแปลงของ fork นี้ตั้งใจไม่แตะพฤติกรรม upstream เดิม (`CHANGES-FORK.md` ประกาศไว้ตั้งแต่บรรทัดแรก) ยกเว้น 1 breaking change ที่ระบุไว้ชัดเจนพร้อมเหตุผล (`model` เป็น required)

### Verify against the real CLI, not just the unit test

วินัยที่ยึดถือมากที่สุดของ repo นี้ — บั๊ก antigravity `--model` ที่ผ่าน unit test สีเขียวมาตลอดเป็นบทเรียนที่ `CLAUDE.md` อ้างถึงซ้ำ ๆ: **`_build_command()` test พิสูจน์แค่ว่า PAL สร้าง argv ถูก ไม่พิสูจน์ว่า CLI ทำตาม flag จริง**

### Radically self-critical documentation

deep-scan ของตัวเองที่ยอมรับว่า "silent failure is the house style" และ report ที่บันทึกว่าข้อสรุปของตัวเองถูกหักล้างไปเท่าไหร่ (11/27 = 41%) เป็นวัฒนธรรมที่ต่างจาก README การตลาดทั่วไป — `docs/context-revival.md` เองยังเขียนโทนโฆษณา ("The Most Profound Feature") ที่ deep-scan ภายหลังขัดแย้งด้วยข้อเท็จจริง (thread เก็บใน memory ล้วน, restart ทำลายทุก thread)

### Not audited for production safety by a third party

repo เองมีรายการ safety gap ที่รู้ตัวและยังไม่ปิด: child process ได้รับ `os.environ` เต็มก้อน, `readOnlyHint: True` ที่ไม่ตรงความจริง, ไม่มี `cwd` sandbox — ทั้งหมดนี้ **ต้อง**ถูกพูดถึงคู่กับทุกคำโฆษณาเรื่องความสามารถของ `clink`

## 5. ภาพสถาปัตยกรรมและ jobs-to-be-done ของ OpenClink ในฐานะเครื่องมือที่ xeno-skills เรียกใช้

```text
xeno-skills: using-clink (เกตตัดสินใจ: ควรเรียก OpenClink ไหม)
    ↓
xeno-skills: clink-brainstorm / clink-subagents / clink-debug / clink-masteragent
    ↓ (MCP tool call เดียว: "clink")
OpenClink: tools/clink.py → clink/registry.py → clink/agents/*.py
    ↓ (subprocess หรือ Windows ConPTY)
CLI ภายนอกจริง: codex / claude / agy / cursor-agent / opencode
    ↓
โมเดลจริงของแต่ละ CLI ตอบกลับ
    ↓
OpenClink: parser เฉพาะ CLI → normalize เป็น AgentOutput เดียวกัน
    ↓
xeno-skills: master agent สังเคราะห์ผลลัพธ์ → รายงานมนุษย์
```

**Jobs-to-be-done ของ OpenClink ในกรอบนี้ (ไม่ใช่ standalone):**

| Job | ใครใช้ (skill xeno-skills) | ทำไมต้องผ่าน OpenClink ไม่ใช่เรียก API ตรง |
|---|---|---|
| ขอความเห็นจากหลาย agent ที่เป็นอิสระจากกันจริง | `clink-brainstorm` | agent แต่ละตัว "เห็น" repo จริงผ่าน CLI ของตัวเอง (web search, file tool ของมันเอง) ไม่ใช่แค่ prompt ข้อความ |
| มอบงานย่อยที่ verify ได้ ให้โมเดลที่คุ้มค่าที่สุดตามดัชนีจริง | `clink-subagents` | routing table คำนวณจาก capability index ต่อ model×effort ที่ OpenClink เก็บไว้ (`docs/clink-model-effort-guide.md`) ไม่ใช่การเดา |
| falsify สมมติฐานด้วย fresh lineage agent | `clink-debug` | ต้องเปิด agent ตัวใหม่ที่ไม่มีอคติจาก context เดิม — `clink` เปิด process ใหม่ทุกครั้งโดยธรรมชาติ |
| ตัดสินใจเลือก model/effort จากข้อมูลวัดจริงแทนความจำ | `clink-masteragent` | ตัวเลข AA Intelligence Index ต่อ model+effort ถูก snapshot ไว้ที่ระดับ skill (`xeno-skills`) แต่วัดโดยยิง `clink` จริงกับ OpenClink |

**สิ่งที่ OpenClink "ไม่ทำ" ในฝั่งนี้ — สำคัญพอ ๆ กับที่มันทำ:** OpenClink ไม่ตัดสินใจว่าเมื่อไหร่ควรเรียก multi-agent (`using-clink` ตัดสิน), ไม่สังเคราะห์ผลลัพธ์จากหลาย agent (master agent ของ xeno-skills ทำ), ไม่ verify ผลลัพธ์ที่ส่งกลับมา (skill layer ต้อง verify เอง — deep-scan ยืนยันว่า non-zero exit เคยถูกรายงานเป็น success จริงในอดีต แม้จะแก้แล้วก็ตาม)

## 6. Tool catalog ทั้ง 19 ตัว (ไม่ใช่ทุกตัวเกี่ยวกับ xeno-skills)

| Tool | บทบาท | เปิดดีฟอลต์ | เกี่ยวกับ xeno-skills โดยตรง? |
|---|---|---|---|
| `clink` | สะพาน CLI-to-CLI | ✅ | ✅ **ตัวเดียวที่ clink-* เรียก** |
| `chat` | คุยกับโมเดลเดียว, brainstorm | ✅ | ❌ |
| `thinkdeep` | คิดเชิงลึก หา edge case | ✅ | ❌ |
| `planner` | แตกงานเป็นแผน | ✅ | ❌ |
| `consensus` | ขอความเห็นหลายโมเดล + จุดยืน | ✅ | ❌ |
| `debug` | หา root cause อย่างเป็นระบบ | ✅ | ❌ |
| `precommit` | ตรวจก่อน commit | ✅ | ❌ |
| `codereview` | review พร้อมระดับความรุนแรง | ✅ | ❌ |
| `apilookup` | บังคับค้นเอกสาร API ปีปัจจุบัน | ✅ | ❌ |
| `challenge` | กันคำตอบ "You're absolutely right!" | ✅ | ❌ |
| `analyze` | เข้าใจ codebase ทั้งก้อน | ปิด | ❌ |
| `refactor` / `testgen` / `secaudit` / `docgen` / `tracer` | เครื่องมือพัฒนาเฉพาะทาง | ปิด | ❌ |
| `selectagents` | คำนวณแผนมอบหมายงานจากข้อมูลวัดจริง | ปิด (ยังเป็น stub เชิงราคา) | ⚠️ แนวคิดคล้าย `clink-masteragent` แต่ **คนละระบบ ไม่เชื่อมกัน** |
| `listmodels` / `version` | utility บังคับเปิด | ✅ | ❌ |

**ข้อควรระวังสำหรับเว็บ:** อย่านำเสนอ 18 tool ที่ไม่ใช่ `clink` ว่าเป็น "สิ่งที่ xeno-skills ใช้" — มันเป็นความสามารถคู่ขนานของ OpenClink เองสำหรับผู้ใช้ MCP client ทั่วไป

## 7. clink agent catalog (สิ่งที่ `clink` tool เชื่อมได้จริง)

| `cli_name` | ตระกูลโมเดลที่เข้าถึง | กลไก transport เฉพาะตัว | สถานะ |
|---|---|---|---|
| `codex` | GPT-5.6 (sol/luna/terra), GPT-5.5 | subprocess ธรรมดา | active/production |
| `claude` / `claude-9arm` | Claude models หรือ gateway ทางเลือก | subprocess ธรรมดา | active/production |
| `antigravity` | Gemini 3.x, Claude Opus/Sonnet 4.6 (ผ่าน Antigravity), GPT-OSS 120B | **Windows-only ConPTY** | active แต่ **จำกัดแพลตฟอร์ม** |
| `cursor` | Grok (xAI), Kimi (Moonshot), GLM (Zhipu), Composer, GPT/Claude tier ปกติ | subprocess ธรรมดา, มีบั๊ก Windows `SHELL` ที่ต้อง config เฉพาะเครื่อง | active แต่มี known gotcha |
| `opencode` | deepseek, GLM, Kimi, MiniMax, Qwen, Grok ผ่าน `opencode-go` | subprocess, JSONL ต่อ event | active/production (2026-08-16) |
| `gemini` | (ตัวเดิม ก่อนเลิกใช้) | subprocess ธรรมดา | **deprecated โดย vendor** — README แนะนำ `antigravity` แทน |

## 8. สถานะที่ควรใช้บนเว็บไซต์ (production / active / experimental — แยกตาม feature)

### Production / active — ใช้งานได้จริงและ verify แล้วกับ CLI จริง

- `clink` tool เอง (core bridge)
- `codex`, `claude`/`claude-9arm`, `opencode` agents — verify กับ binary จริง มี live validation บันทึกไว้
- per-call `model` / `reasoning_effort` override (ADR 0002)
- zero-setup CLI discovery (ADR 0003)

### Active แต่มีข้อจำกัดต้องระบุคู่กันเสมอ

- `antigravity` — ใช้งานได้จริงแต่ **Windows-only** (ConPTY ผ่าน `pywinpty`); ผลลัพธ์บนเครื่อง alt-OS ยังไม่ verify (ADR 0001 ระบุไว้ตรง ๆ)
- `cursor` — ใช้งานได้แต่ต้องแก้ `SHELL` env var เองต่อเครื่องบน Windows ไม่มีวิธี fix ใน preset ที่ ship มา

### Experimental / stub — ห้ามโฆษณาว่าใช้งานได้เต็มรูปแบบ

- `selectagents` — โครงสร้างคำนวณเสร็จ 11/11 sub-issue merge แล้ว (2026-08-16) **แต่ยังปิดโดยดีฟอลต์เพราะ dataset ราคาเป็น fixture ที่ construct เอง ไม่ใช่ราคาตลาดจริง** (`conf/selectagents_dataset.json`) ต้องรอ spike `#97` ก่อนถึงจะเปิดได้
- Supervised subagent sessions (epic #11: cancel by handle, list in-flight sessions) — ยังอยู่ในขั้น spike, phase ส่วนใหญ่ gated

### Open safety work — ต้องเขียนเป็นข้อจำกัด ไม่ใช่ feature ที่ทำแล้ว

- `readOnlyHint: True` บน `clink` **ไม่ตรงกับพฤติกรรมจริง** (ยังไม่ได้แก้ ณ วันที่ตรวจ)
- child process รับ `os.environ` เต็มก้อน (ไม่มี allowlist) — ยังเป็น open item ใน ledger (#144 เป็น item แรกที่เกี่ยวข้อง เรื่อง process tree)
- ไม่มี CI ที่รันสำเร็จเลยในประวัติ repo (บัญชี GitHub billing-blocked) — เทสรันแบบ local เท่านั้น

## 9. Evidence และ case studies

### บั๊กที่ unit test เขียวหลอกได้ (antigravity `--print` กิน `--model`)

`agy --print` เป็น value-taking flag ลำดับ argument ผิด (`--print --model X`) ทำให้ `--print` กิน `--model` เป็นค่าของตัวเอง — โมเดลกลับไปที่ default เงียบ ๆ exit code 0 unit test เดิมพิสูจน์แค่ argv ที่สร้าง ไม่พิสูจน์ว่า `agy` ทำตาม บทเรียนที่ถูกยกเป็น non-negotiable ใน `CLAUDE.md`: **verify clink changes against a real CLI**

### "Silent failure is the house style"

deep-scan 2026-08-13 (605 claims, 3 รอบ, อ่านโค้ด ~26,000/30,238 บรรทัด) สรุปว่าการ degrade เงียบเกิดขึ้นทุกชั้นของระบบ — ตั้งแต่ image ที่ถูกทิ้งแบบไม่บอก ไปจนถึง `consensus` panel ที่ล้มทั้งหมดแต่ยังรายงาน confidence "high" บทเรียน: **"None of these can fail a test, because none of them fails"**

### รายงานที่ล้มข้อสรุปของรายงานก่อนหน้าตัวเอง

`docs/reports/2026-08-04-...` สรุปว่า Claude Code เป็น client เดียวที่มี pre-tool hook — `docs/reports/2026-08-13-cli-enforcement-capability.md` ตรวจ binary จริงแล้วพบว่า **4 จาก 5 client** ทำได้ (`codex`, `agy`, `cursor-agent` ด้วย) บทเรียน: `--help` ไม่ใช่แหล่งความจริงที่เชื่อถือได้ ต้องตรวจ binary/vendor docs โดยตรง

### การเปลี่ยนชื่อที่ทำถูกครึ่งเดียวโดยตั้งใจ

rename `pal-mcp-server` → `openclink` เสร็จบน `main` (2026-08-16) แต่ MCP tool prefix ยังคงเป็น `pal` บน Claude/Codex CLI โดยตั้งใจ — เพราะ `xeno-skills` เองอ้างชื่อ `pal` 25 ครั้งในโค้ด และ skill พวกนั้นรันอยู่บน client 2 ตัวนี้ การย้าย prefix ต้องรอ `xeno-skills` merge การอัปเดตของตัวเองก่อน (`xeno-skills#206`) — เป็นตัวอย่างจริงของ**ความสัมพันธ์ที่ผูกกันระหว่างสอง repo** ที่ต้องประสาน timing กัน

## 10. Content model สำหรับเว็บ

```text
ClinkAgent
- cli_name
- transportMechanism (subprocess | ConPTY)
- modelFamiliesReached
- platformConstraint
- maturity (production | active-with-caveat | experimental)
- sourcePath
- lastVerifiedDate
```

```text
Tool
- slug
- category (collaboration | code-quality | dev | utility)
- enabledByDefault
- relatedToXenoSkills (boolean — เกือบทุกตัวคือ false ยกเว้น clink)
- sourcePath
```

```text
SafetyFinding
- claim
- severity
- status (open | fixed | disputed)
- sourceReport
- dateFound
- dateFixed (ถ้ามี)
```

แหล่งข้อมูลที่ควรเป็น canonical:

- fork rationale → `CHANGES-FORK.md`
- ADR → `docs/adr/0001-*.md` ถึง `0003-*.md`
- clink tool docs → `docs/tools/clink.md`, `docs/clink-model-effort-guide.md`
- safety/self-audit → `docs/reports/2026-08-13-deep-scan-architecture-safety-and-direction.md`, `docs/reports/2026-08-13-cli-enforcement-capability.md`
- ship log → `DONE.md`
- open work → `docs/OPEN-WORK-LEDGER.md`
- model ranking recipe → `docs/model_ranking.md`

## 11. Brand และ visual direction สำหรับเว็บ

ยึดแนวทางเดียวกับ `xeno-skills-present-blog-brief.md` §14 (text-first, neutral base + accent เดียว, ไม่มี generic AI gradient, ไม่มี glassmorphism) แต่เพิ่มน้ำเสียงเฉพาะของ OpenClink:

- ใช้ evidence จาก deep-scan และรายงานที่หักล้างตัวเองเป็นวัตถุดิบภาพ — เช่น แสดงตาราง "11/27 ถูกหักล้าง" ตรง ๆ แทนที่จะซ่อน
- เมื่อพูดถึง `clink` ให้แสดงคู่กับ **ข้อจำกัดด้าน safety ที่ยังเปิดอยู่จริง** ไม่ใช่แค่ diagram สวย ๆ ของ multi-agent orchestration
- ใช้คำว่า "transport" / "bridge" มากกว่า "orchestrator" หรือ "platform" — เพื่อสื่อว่า OpenClink เป็นชั้นล่างที่ xeno-skills คุมนโยบายอยู่ข้างบน
- หลีกเลี่ยงการนำเสนอ `readOnlyHint`/sandbox ว่าปลอดภัย — ถ้าพูดถึงการรัน agent ภายนอกต้องพูดคู่กับ "ต้องอยู่ใน workspace ที่ไว้ใจได้เท่านั้น" (คำเตือนที่ `docs/tools/clink.md` เขียนไว้เองตั้งแต่บรรทัดต้น ๆ)

## 12. Blog topic ideas เฉพาะ OpenClink

### สงคราม ConPTY

- "ทำไม pipe ธรรมดาคุยกับ Antigravity ไม่ได้ และทำไม ConPTY ถึงต้องมาแทน"
- "บั๊กที่ unit test เขียวหลอกได้: เมื่อ `--print` กิน `--model` ไปเงียบ ๆ"

### ความซื่อสัตย์ทางวิศวกรรม

- "Silent failure is the house style: บทเรียนจาก deep-scan 605 claims"
- "รายงานที่หักล้างตัวเอง 41%: ทำไมนั่นถึงน่าเชื่อถือกว่ารายงานที่ไม่เคยผิด"
- "readOnlyHint ที่โกหก: เมื่อ annotation ของ tool ไม่ตรงกับสิ่งที่มันทำจริง"

### Multi-CLI orchestration

- "ทำไมต้องมี 6 CLI agent แทนที่จะยิง API เดียวหลายรอบ"
- "opencode: CLI ตัวเดียวที่บอกราคาตัวเองได้"
- "cursor-agent เปิดทางไปหา Grok/Kimi/GLM ได้อย่างไรโดยไม่ต้องเขียนโค้ดใหม่"

### ความสัมพันธ์กับ xeno-skills

- "clink คือ MCP tool ตัวเดียวที่ xeno-skills ทั้งตระกูล clink-* พึ่งพา"
- "เมื่อสอง repo ต้อง sync กันตอน rename: บทเรียนจาก `pal` → `openclink`"

## 13. Source map

### Product และ fork rationale

- `CHANGES-FORK.md`
- `README.md` / `README.en.md`
- `docs/name-change.md`

### Architecture และ decisions

- `docs/adr/0001-antigravity-via-windows-conpty.md`
- `docs/adr/0002-per-call-model-effort-per-backend.md`
- `docs/adr/0003-zero-setup-discovery-and-active-claude-9arm.md`
- `clink/agents/*.py`, `clink/parsers/*.py`, `clink/registry.py`, `clink/discovery.py`
- `providers/*.py`

### clink tool docs

- `docs/tools/clink.md`
- `docs/clink-model-effort-guide.md`
- `docs/context-revival.md` *(อ่านคู่กับ deep-scan §4 เพราะโทนการตลาดขัดกับข้อเท็จจริงบางส่วน)*
- `docs/model_ranking.md`
- `docs/getting-started.md`
- `docs/configuration.md`

### Safety / self-audit research

- `docs/reports/README.md` (ดัชนีรายงานทั้งหมด)
- `docs/reports/2026-07-16-clink-antigravity-model-override-investigation.md`
- `docs/reports/2026-07-16-clink-brainstorm-gap-analysis.md`
- `docs/reports/2026-07-16-pal-clink-architecture-hardening-review.md`
- `docs/reports/2026-08-04-clink-phase0-spike-host-followup-and-cli-capability.md`
- `docs/reports/2026-08-13-deep-scan-architecture-safety-and-direction.md`
- `docs/reports/2026-08-13-cli-enforcement-capability.md`

### Project memory / history

- `DONE.md`
- `docs/OPEN-WORK-LEDGER.md`
- `CLAUDE.md` (operating standard, T4)
- `AGENTS.md`

## 14. ข้อควรระวังด้านความถูกต้อง

1. **อย่านำเสนอ OpenClink เป็นผลิตภัณฑ์ยืนเดี่ยวเทียบเท่า xeno-skills** — มันคือ transport ที่ `clink-*` เรียกใช้ ต้องอยู่ใต้ narrative ของ xeno-skills เสมอในหน้า present
2. **อย่าโฆษณา `selectagents` ว่าใช้งานได้เต็มรูปแบบ** — มันยังปิดโดยดีฟอลต์เพราะราคาที่ใช้คำนวณเป็น fixture ที่ construct เอง ไม่ใช่ราคาตลาดจริง
3. **อย่าเขียนว่า `readOnlyHint`/sandbox ทำให้ `clink` ปลอดภัย** — deep-scan ยืนยันว่า child process ได้ `os.environ` เต็มก้อนและไม่มี `cwd` sandbox จริง ณ วันที่ตรวจ
4. **อย่าอ้างว่า antigravity ใช้ได้ทุกแพลตฟอร์ม** — ConPTY approach เป็น Windows-only โดยตั้งใจตาม ADR 0001
5. **อย่า copy โทนการตลาดจาก `docs/context-revival.md` ตรง ๆ** — ต้องระบุข้อจำกัดของ conversation memory (in-memory เท่านั้น, TTL, restart ทำลาย thread ทั้งหมด) คู่กันเสมอ
6. **อย่าอ้างว่า CI เขียวยืนยันคุณภาพ** — repo นี้ไม่มี CI ที่รันสำเร็จเลยในประวัติ (billing-blocked); ตัวเลขเทสทั้งหมดเป็นการรัน local
7. **อย่าอ้างวันที่ upstream "unmaintained since mid-2026" แบบไม่ตรวจ** — deep-scan พบ commit ล่าสุดจริงของ upstream คือ 2025-12-15
8. **ทุก claim เรื่องความสามารถของ client (`cursor`, `opencode`, `antigravity` ฯลฯ) ต้องมีวันที่ verify กำกับ** — โปรเจกต์นี้เปลี่ยนเร็วและมีบั๊กที่เคย "verify แล้ว" กลับกลายเป็นผิดในภายหลัง (เช่น กรณี antigravity model override)
9. **ต้องระบุว่า MCP tool prefix ยังอยู่ระหว่างเปลี่ยนผ่าน** (`pal` → `openclink`) และผูกกับ timeline ของ `xeno-skills#206` — ไม่ใช่การตัดสินใจของ OpenClink ฝ่ายเดียว
10. **ห้ามยกตัวเลข Artificial Analysis Intelligence Index มาเป็นตัวเลขถาวร** — `docs/clink-model-effort-guide.md` เองระบุว่าเป็น snapshot 2026-07 ต้อง re-fetch ก่อนใช้

## 15. Installation content (สำหรับ context เท่านั้น — ไม่ใช่จุดขายหลักบนเว็บ)

```bash
git clone https://github.com/xenodeve/openclink.git
cd openclink
./run-server.sh   # ตั้งค่า Claude Desktop / Claude Code / Codex CLI / Qwen CLI อัตโนมัติ
```

หรือทันทีด้วย `uvx --from git+https://github.com/xenodeve/openclink.git openclink`

**หมายเหตุสำคัญ:** deep-scan 2026-08-13 เคยพบว่า `run-server.sh` และ `docs/getting-started.md` รุ่นเก่าชี้ไปยัง upstream URL แทนที่จะเป็น fork ของตัวเอง (bug ที่ทำให้ผู้ใช้รัน upstream โดยไม่มีงานของ fork เลย) ตรวจสอบ ณ วันที่ 2026-09-02 พบว่าไฟล์ที่อ่านได้ชี้ไปยัง `xenodeve/openclink` ถูกต้องแล้ว — **แต่ควร re-verify ก่อนเผยแพร่ทุกครั้ง** เพราะเป็นประเภทบั๊กที่เคยเกิดซ้ำ

## 16. Final positioning

สำหรับเว็บไซต์ T4 Labs, OpenClink ควรถูกเล่าเป็น **"ชั้นที่ทำให้ multi-agent orchestration ของ xeno-skills เป็นไปได้จริง ไม่ใช่แค่แนวคิดบนกระดาษ"** — จุดขายไม่ใช่ "เชื่อม 6 CLI ได้" เฉย ๆ แต่คือ:

1. แต่ละ agent ที่เชื่อมได้ "เห็น" โลกจริงผ่านเครื่องมือของตัวเอง (web search, file access) ไม่ใช่แค่รับ prompt ข้อความ
2. ทุกความสามารถที่โฆษณาผ่านการ verify กับ CLI จริง ไม่ใช่แค่ unit test เขียว
3. ข้อจำกัดด้าน safety ที่ยังเปิดอยู่ถูกบันทึกและเปิดเผยต่อสาธารณะ ไม่ใช่ซ่อนไว้

narrative หลักที่ควรใช้ร่วมกันในหน้า Present และ Blog:

> OpenClink ไม่ได้พยายามเป็นแพลตฟอร์ม multi-agent ที่สมบูรณ์แบบ — มันคือสะพานที่ทำงานได้จริงและซื่อสัตย์กับข้อจำกัดของตัวเอง ซึ่งเป็นสิ่งที่ทำให้ `xeno-skills` ไว้ใจเรียกใช้มันในฐานะ transport ได้

ความแตกต่างจาก xeno-skills ที่ต้องชัดเจนบนเว็บเสมอ: **xeno-skills คือ "ควรทำอะไร เมื่อไหร่ กับใคร" ส่วน OpenClink คือ "ทำอย่างไรให้คำสั่งไปถึง agent อีกตัวจริง ๆ"** — สอง repo ทำงานคนละชั้น และเว็บไซต์ต้องไม่ทำให้ผู้อ่านสับสนว่าเป็นผลิตภัณฑ์เดียวกัน
