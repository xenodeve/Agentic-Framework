---
title: "openclink"
description: "MCP transport ที่ skills clink-* ของ xeno-skills พูดผ่าน — และ deep-scan ที่ค้นพบ silent failure คือ house style"
repo: "xenodeve/openclink"
status: "active"
tags: [mcp, multi-agent, transport]
---

## openclink คืออะไร

openclink (repo `xenodeve/openclink`, โฟลเดอร์ local ยังเป็น `pal-mcp-server`;
lineage Zen MCP → PAL MCP → OpenClink, Apache-2.0) เป็น Model Context
Protocol server ที่มีสองบทบาทพร้อมกัน:

- **CLI-to-CLI bridge** — เครื่องมือ `clink` ที่ spawn external CLI agent (Codex CLI, Antigravity `agy`, Cursor `cursor-agent`, OpenCode, Claude Code) เป็น subagent ใน context แยก แล้วส่งเฉพาะผลลัพธ์กลับเข้าบทสนทนาเดิม และ
- **MCP tools 19 ตัวแบบ native** (`chat`, `thinkdeep`, `debug`, `codereview`, `consensus` และอื่น ๆ) ที่พูดกับ model providers โดยตรง — Gemini, OpenAI, Azure, X.AI, OpenRouter, DIAL และโมเดล local (Ollama/custom) — โดยไม่ต้องผ่าน external CLI ใด ๆ

บน site นี้ openclink **ไม่ใช่ผลิตภัณฑ์เดี่ยว** บทบาทเดียวที่จำเป็นในบริบทนี้คือตัวแรก: เครื่องมือ `clink` คือกลไกเบื้องหลังครอบครัว skills `clink-*` ทั้งหมดของ xeno-skills (`using-clink`, `clink-brainstorm`, `clink-subagents`, `clink-debug`, `clink-masteragent`) เมื่อ `clink-brainstorm` "ยิงคำถามเดียวกันไปยังหลาย agent พร้อมกัน" นั่นคือการเรียก MCP tool ไปที่ `clink` ตัวละหนึ่งครั้งต่อ agent บรรทัดตำแหน่งที่ตั้ง: *transport หลาย-CLI ที่ skills clink-* ของ xeno-skills พูดผ่าน — ไม่ใช่ผลิตภัณฑ์เดี่ยวบน site นี้*

xeno-skills คือ "ทำอะไร เมื่อไหร่ กับใคร"; openclink คือ "คำสั่งไปถึง agent อีกตัวอย่างไรจริง ๆ" repo สอง repo สองชั้น

## ต้นเรื่อง

### ปัญหาจริง

fork นี้ไม่เกิดจากความอยากได้ฟีเจอร์ ปัญหาสามข้อบังคับให้เกิด:

1. **CLI ที่เงียบหาย.** Google ยุบ Gemini CLI กลางปี 2026 หันไปใช้ Antigravity (`agy`) ซึ่งเป็น binary ปิดซอร์สที่พิมพ์ output เฉพาะเมื่อเชื่อว่าต่อ terminal จริงอยู่ ทุก MCP server (รวม OpenClink ตัวเก่า) spawn child process ด้วย pipe ธรรมดา — ดังนั้น `agy` จึงคืน stdout ว่างพร้อม exit code 0 แบบเงียบ ไม่มี error ให้เห็น
2. **เลือก model/effort ต่อการเรียกไม่ได้.** upstream fix model ของแต่ละ CLI ไว้ตอน config (`conf/cli_clients/*.json`); การเปลี่ยนหมายถึงแก้ไฟล์แล้ว restart server
3. **ความหลากหลายของ CLI = ความหลากหลายของตระกูลโมเดล.** `cursor-agent` เปิดประตูสู่ตระกูลโมเดลที่ client ตัวอื่นแตะไม่ได้ — Grok (xAI), Kimi (Moonshot), GLM (Zhipu) `opencode` เปิด provider `opencode-go` (deepseek, GLM, Kimi, MiniMax, Qwen, Grok) นี่คือเหตุผลเชิงยุทธศาสตร์ที่ `clink-brainstorm` เรียก openclink แทนที่จะเป็น provider เดียว: ได้ความเห็นอิสระจริง ไม่ใช่ตระกูลโมเดลเดียวกันสามครั้ง

### ทดลองอะไร และมันทำงานอย่างไรจริง ๆ

openclink เป็น **fork แบบ additive-only** ของ
[`BeehiveInnovations/pal-mcp-server`](https://github.com/BeehiveInnovations/pal-mcp-server)
— ทุกการเปลี่ยนแปลงประกาศว่าไม่แตะพฤติกรรม upstream ยกเว้น breaking change ที่ตั้งใจหนึ่งเดียว (บันทึกไว้ด้านล่าง) สิ่งที่ fork เปลี่ยน:

- **Windows ConPTY transport สำหรับ `agy`** — รัน `agy` ผ่าน Windows ConPTY ตัวจริงด้วยไลบรารี `pywinpty` (ADR 0001, 2026-06-28, commit `9087c81`) เพราะมันพูดเฉพาะเมื่อเห็น pseudo-terminal ใช้บน Windows เท่านั้น
- **`model` / `reasoning_effort` ต่อการเรียก** — เพิ่มเป็นพารามิเตอร์ optional บนเครื่องมือ `clink` ต่อมาเป็น **required** สำหรับ `model` (ADR 0002, 2026-07-16, commit `97a7072`) นี่คือ breaking change เดียวของ fork: "โมเดลที่ไม่มีใครเลือก" ต้องไม่ปนกับ "โมเดลที่คนเลือก" ใน `resolved_model` (แหล่งที่มา: `CHANGES-FORK.md`, issue #29) การ map ต่างกันต่อ CLI — Codex ใช้ `-m` + `-c model_reasoning_effort=` (ห้าระดับ: low/medium/high/xhigh/max); ตัวอื่นใช้ `--model`
- **zero-setup CLI discovery** — `clink/discovery.py` หาตำแหน่งติดตั้งที่รู้จัก (winget, `%LOCALAPPDATA%`, npm) ก่อนค่อย fallback (ADR 0003, 2026-07-16, commit `d44ae01`)
- **dependency pin** — `mcp` 2.0.0 ตัด `Server.list_tools` ที่ `server.py` ใช้เป็น decorator ออก จึง pin `mcp>=1.0.0,<2` ในไฟล์ `pyproject.toml` ทั้งคู่ และเฝ้าด้วย `test_dependency_pins.py`
- **`images` ไม่ถูกทิ้งเงียบอีกต่อไป** — เดิมถูก accept แล้วทิ้งไป (`_ = (files, images)`); ตอนนี้ error ทันทีพร้อม fix จริง (ฝัง path ไว้ใน prompt ให้ agent เปิดไฟล์เอง)

repo ถูกเปลี่ยนชื่อ `pal-mcp-server` → `openclink` บน `main` เมื่อ **2026-08-16** (PR #114, 22 commits, 176 files) เพราะชื่อ `pal-mcp-server` ถูกโปรเจกต์อื่นใช้แล้วบน PyPI (version 10.4.3) การเปลี่ยนชื่อถูกทำแค่ครึ่งเดียวโดยตั้งใจ: MCP tool prefix ยังเป็น `pal` บน CLI ของ Claude/Codex เพราะ xeno-skills เองอ้างถึง `pal` ใน code 25 ครั้ง และ skills นั้นรันบน client สองตัวนั้นพอดี การย้าย prefix ต้องรอ xeno-skills merge การอัปเดตของตัวเอง (`xeno-skills#206`) — ตัวอย่างจริงของสอง repo ที่ต้องประสานเวลา

**บั๊กที่กลายเป็นวินัยถาวรของ repo:** `agy --print` เป็น flag ที่รับค่า และการเรียง argument `--print --model X` ทำให้ `--print` กลืน `--model` ไปเป็นค่าของตัวเอง โมเดลกลับไป default แบบเงียบ exit code 0 unit test เก่าพิสูจน์ได้แค่ว่า `_build_command()` สร้าง argv — ไม่ได้รัน `agy` นั่นคือเหตุผลที่ `CLAUDE.md` บรรจุไว้ว่าเป็นสิ่งที่ไม่ยอม: **verify การเปลี่ยนแปลงของ clink กับ CLI ตัวจริง ไม่ใช่แค่ unit test ที่เขียว**

## ผลการค้นพบจาก deep-scan: "silent failure คือ house style"

openclink ไม่ถูกนำเสนอที่นี่ว่าเป็นเครื่องมือไร้ตำหนิ เพราะ self-audit ของมันเองก็ปฏิเสธจะนำเสนอเช่นนั้น หลักฐานที่แข็งแรงที่สุดใน repo ไม่ใช่ capability benchmark แต่คือ systematic safety และ contract audit: `docs/reports/2026-08-13-deep-scan-architecture-safety-and-direction.md`

**วิธีการ (2026-08-13):** 3 รอบ รวม 605 claims อ่านโค้ด production ประมาณ 26,000 จาก 30,238 บรรทัด รอบ 1–2 จับคู่ผู้อ่าน 12 คนกับ "refuter" แบบ adversarial; จาก refutation ที่วางไว้ 68 รายการ รันจริง 27 และ **11 จาก 27 (41%) ถูกหักล้างหรือแก้ไข** รอบ 3 เปลี่ยนให้ผู้เขียนรายงานตรวจสอบ claims สำคัญด้วยตนเอง — ถูกต้องกว่าและถูกกว่าเดิม รายงานบันทึกสิ่งที่ตัวเองผิด แทนที่จะลบ: "clink ไม่มี end-to-end tests" เป็นเท็จ (`tests/test_clink_integration.py` มีอยู่) และ "thread ที่เขียนไว้ตลอดกาลไม่หมดอายุ" ก็เป็นเท็จ (ที่ turn ceiling `add_turn` คืนค่าก่อน `setex` จึง TTL เลื่อนหยุดเอง) บทเรียนของตัวมัน: แทบทุก claim ที่ถูกหักล้างคือคำสัมบูรณ์ ("ไม่เคย / ศูนย์ / เฉพาะ")

**ช่องโหว่จริงที่ค้นพบ** (แหล่งที่มา: รายงาน deep-scan 2026-08-13 อ้าง section ตามที่อ้าง):

| Layer | พบอะไร | ที่ไหน |
|---|---|---|
| Safety boundary | `readOnlyHint: True` บน `clink` ทั้งที่ agent ที่ spawn มากับ bypass-approval flags เต็มรูปแบบ; child process ได้รับ `os.environ` ทั้งหมด (API key ทุกตัว); ไม่มี sandbox `cwd`; path block-list มีช่องโหว่ (`C:\ProgramData`, `.git/config` อ่านตรงได้) | รายงาน §2, `tools/clink.py:156-157`, `clink/agents/base.py:533-536` |
| Concurrency / liveness | timeout ของ `clink` **จุดไม่จริง** เมื่อ grandchild process ถือ pipe อยู่; `provider.generate_content` เป็น synchronous call ภายใน `async def` — chat เดียวกับโมเดล local สามารถค้าง event loop **นานถึง 30 นาที** | รายงาน §3 |
| State leak | เครื่องมือที่อ้างว่า "stateless" มีฟิลด์ 11 ตัวที่อยู่ข้าม request; ขนาดบทสนทนาต่อ turn **คูณสอง** เพราะ guard string ไม่ match เลย (วัดได้จริง: 3,069 → 54,280 อักขระใน 5 รอบ) | รายงาน §4 |
| Prompt layer | ไฟล์ system-prompt 3 ตัว (`planner`, `tracer`, `docgen`) รวม 29,879 bytes **ไม่ไปถึงโมเดลเลย** เพราะ conditional gate ผิด | รายงาน §5 |
| Contract layer | `confidence='certain'` ถูกพิมพ์เป็น `str` เปล่าในเครื่องมือ 4 ตัว — พิมพ์ผิดเงียบแต่ยังถูกนับราคา; แผง `consensus` ที่ **ล้มเหลวทั้งหมด** ยังรายงาน `consensus_confidence: "high"` (hardcode 2 จุด) | รายงาน §6 |

และคำตัดสินของตัวรายงานเอง บอกตรง ๆ: **"silent failure คือ house style"** — ระบบ degrade เงียบในทุกชั้น จาก image ที่ถูกทิ้งไปจนถึงแผง consensus ที่ตายแต่ยังรายงานความมั่นใจ "high" และ **ไม่มี test ตัวไหนล้ม เพราะ technically ไม่มีอะไรล้ม**

รายงานวันที่สองในวันเดียวกัน (`docs/reports/2026-08-13-cli-enforcement-capability.md`) โค่นการ spike เก่าของ 2026-08-04 ที่อ้างว่า "Claude Code เป็น client เดียวที่มี pre-tool hook" เมื่อตรวจ binaries ตัวจริง **4 จาก 5 clients** มีวิธีบล็อก tool calls (`codex` ฝัง hook events 11 ตัวรวมถึง `PreToolUse`; `agy` และ `cursor-agent` ผ่าน `hooks.json`) บวกสิ่งที่แข็งแรงกว่า: `--tools ""` บน Claude Code ตัด built-in tools ออกจาก context ทั้งหมด ขณะที่ MCP tools ยังอยู่ บทเรียนที่ถูกบันทึก: `--help` ไม่ใช่แหล่งความจริงที่เชื่อถือได้ — ตรวจ binary กับเอกสาร vendored โดยตรง

**ยังเปิดอยู่ ณ snapshot 2026-09-02** (audit คือรายงาน ไม่ใช่การแก้ไข): ความไม่ตรงกันของ `readOnlyHint` ยังไม่ถูกแก้ child process ยังได้รับ `os.environ` ทั้งหมด และ open item ตัวแรกใน ledger คือ child process tree ของ `clink` ไม่ถูก kill เมื่อ cancel (#144 แยกออกมาจาก epics #20/#89 เมื่อ 2026-08-19)

## ทำงานอย่างไร

```text
xeno-skills: using-clink (decision gate: ควรเรียก openclink หรือไม่?)
    ↓
xeno-skills: clink-brainstorm / clink-subagents / clink-debug / clink-masteragent
    ↓ (หนึ่ง MCP tool call: "clink", ต่อ agent)
openclink: tools/clink.py → clink/registry.py + discovery.py (โหลด conf/cli_clients/*.json)
    ↓ (subprocess, หรือ Windows ConPTY สำหรับ agy)
external CLI ตัวจริง: codex / claude / agy / cursor-agent / opencode
    ↓
โมเดลตัวจริงของ CLI นั้นตอบ
    ↓
openclink: parser ต่อ CLI → AgentOutput แบบ normalize เดียว
    ↓
xeno-skills: master agent รวม → รายงานให้มนุษย์
```

จุดสำคัญ: เส้นจาก skills `clink-*` แต่ละตัวไป openclink คือ **MCP tool call เดียว** (`clink`) เครื่องมืออีก 18 ตัวไม่อยู่บนเส้นทางนี้ — พวกมันรับใช้ผู้ใช้ปลายทางของ openclink เอง (MCP clients) ไม่ใช่ xeno-skills

**Runners** — สิ่งที่ `clink` เข้าถึงได้จริง (snapshot 2026-09-02):

| `cli_name` | ตระกูลโมเดลที่เข้าถึงได้ | Transport | สถานะ |
|---|---|---|---|
| `codex` | GPT-5.6 (sol/luna/terra), GPT-5.5 | subprocess ธรรมดา, `--json` | active / production |
| `claude` / `claude-9arm` | โมเดล Claude หรือ gateway อีกทาง | subprocess ธรรมดา, `--output-format json` | active / production |
| `antigravity` | Gemini 3.x, Claude Opus/Sonnet 4.6, GPT-OSS 120B | **Windows-only ConPTY** (`pywinpty`) | active แต่ **จำกัดแพลตฟอร์ม** |
| `cursor` | Grok (xAI), Kimi (Moonshot), GLM (Zhipu), Composer | subprocess ธรรมดา; กับดัก `SHELL` ต่อเครื่องบน Windows | active มีกับดักที่รู้แล้ว |
| `opencode` | deepseek, GLM, Kimi, MiniMax, Qwen, Grok ผ่าน `opencode-go` | subprocess, JSON event บรรทัดละหนึ่ง | active / production (2026-08-16) |
| `gemini` | (ตัวเดิมก่อนถูกเลิก) | subprocess ธรรมดา, `--yolo -o json` | **vendor เลิกแล้ว** — README แนะนำ `antigravity` |

`opencode` เป็น runner ตัวเดียวที่รายงานต้นทุนของมันเอง (`part.cost` → `cli_reported_cost`) ทำไมเส้นทางจึงผ่าน CLI แทนที่จะเป็น API เดียว: แต่ละ agent ที่เชื่อมต่อ "เห็น" repo ตัวจริงผ่านเครื่องมือของตัวเอง (web search, การเข้าถึงไฟล์) ไม่ใช่แค่รับ prompt string; `clink-subagents` route งานย่อยด้วย capability index ต่อ model+effort ที่เก็บไว้ใน `docs/clink-model-effort-guide.md` ไม่ใช่การคาดเดา; `clink-debug` ได้ agent lineage ใหม่ที่ไม่มี context มรดก เพราะ `clink` เปิด process ใหม่ทุกครั้ง

เครื่องมือ 19 ตัวของ openclink (verify กับ `server.py:264-283`, ตรงกับ README): 10 ตัว on โดย default + 7 ตัว off โดย default + 2 ตัว always on (`listmodels`, `version`) 18 ตัวที่ไม่ใช่ `clink` คือความสามารถขนานสำหรับ MCP clients ของ openclink เอง — อย่าอ่านว่า "สิ่งที่ xeno-skills ใช้"

## หลักฐาน

ตัวเลขทุกตัวพร้อมวันที่ แหล่งที่มา และข้อจำกัด ค่าทั้งหมดมาจาก repo snapshot **2026-09-02** (branch `feat/149-clink-run-journal`, commit `200fcb9` ลงวันที่ 2026-08-19, version `9.8.2` ใน `pyproject.toml`/`config.py`) brief ชัดเจนว่าเหล่านี้ไม่คงถาวร — re-verify ก่อนเผยแพร่ซ้ำทุกครั้ง

| Fact / metric | ค่า | วันที่ | แหล่งที่มา | ข้อจำกัด |
|---|---|---|---|---|
| ขอบเขต deep-scan | 605 claims, 3 รอบ, อ่าน ~26,000/30,238 บรรทัด | 2026-08-13 | `docs/reports/2026-08-13-deep-scan-*.md` | self-audit ไม่ใช่ third-party audit |
| อัตรา refutation แบบ adversarial | 11/27 = 41% ถูกหักล้างหรือแก้ไข (จากที่วางไว้ 68, รันจริง 27) | 2026-08-13 | รายงานเดียวกัน | อีก 41 จาก 68 ที่วางไว้ไม่เคยรัน |
| การวัด state คูณสอง | 3,069 → 54,280 อักขระใน 5 รอบ | 2026-08-13 | รายงาน §4 | วัดบน guard-string path ของเครื่องมือเดียว |
| ค้าง event loop | นานถึง 30 นาทีต่อ chat เดียวกับโมเดล local | 2026-08-13 | รายงาน §3 | worst case บนโมเดล local |
| ชุด test | ไฟล์ 152 ตัวใน `tests/`; **1,285 ผ่าน** (เทียบกับ 1,280 ก่อน PR #143) | 2026-08-16 / นับ 2026-09-02 | `docs/OPEN-WORK-LEDGER.md`, นับใน repo โดยตรง | **local run เท่านั้น** — CI ไม่เคยรัน (ดูข้างล่าง) |
| ประวัติ CI | **ไม่มี CI run ใดผ่านเลย** ในประวัติ repo (บัญชี GitHub ถูก billing-block; verify ผ่าน `gh run list`) | ตรวจ 2026-09-02, entry 2026-08-01 | `docs/OPEN-WORK-LEDGER.md`, `[[ci-unavailable-billing-blocked]]` | gate ของ PR จึงเป็นวินัยตอนเปิด PR ไม่ใช่ automated green check |
| รองรับ `opencode` ครบถ้วน | ปิดช่องว่าง 3 ช่อง (effort ไม่ถูกทิ้ง, cost เข้าบัญชี, cache-read ไม่หาย), verify กับ binary ตัวจริง (#125–127, PR #128) | 2026-08-16 | `docs/OPEN-WORK-LEDGER.md` | claim แบบ snapshot; re-verify |
| สถานะ `selectagents` | sub-issue 11 ตัว (#98–#113) merge แล้ว แต่ยังอยู่ใน `DISABLED_TOOLS` เพราะราคาชุดข้อมูลคือ fixture ที่สร้างขึ้นเอง ไม่ใช่ราคาตลาดจริง | 2026-08-16 | `docs/OPEN-WORK-LEDGER.md` | off โดย default; รอ spike #97 (ยังไม่เริ่ม) |
| `deepseek-v4-flash` กับ `kimi-k3` | งานราว 323 เท่าสำหรับ quota เดียวกัน | ไม่ระบุในแหล่งที่มา | `CHANGES-FORK.md` | vendor pricing snapshot ไม่ใช่การวัดของทีม |
| `--tools ""` บน Claude Code | ตัด built-in tools ออกจาก context ทั้งหมด ขณะที่ MCP tools ยังอยู่; worker ที่ spawn แบบนี้มี MCP tool ตัวเดียวเป็นทั้ง toolkit และอ่านไฟล์ไม่ได้ | 2026-08-13 | `docs/reports/2026-08-13-cli-enforcement-capability.md` | ทดสอบกับ binaries ตัวจริง |
| ตัวเลข AA Intelligence Index | snapshot ของ index ที่วัดต่อ model+effort | 2026-07 | `docs/clink-model-effort-guide.md` | guide เองบอกว่า re-fetch ก่อนใช้ — ไม่ใช่ค่าถาวร |
| commit สุดท้ายของ upstream | 2025-12-15 (ไม่ใช่ "กลางปี 2026") | ตรวจ 2026-08-13 | รายงาน deep-scan §13 | "unmaintained ตั้งแต่ ~กลางปี 2026" ใน README ไม่แม่นยำเท่าการตรวจ object-database |
| `xeno-skills` อ้างถึง `pal` | 25 ครั้งใน code | ไม่ระบุในแหล่งที่มา | brief §9 (rename analysis) | เหตุผลที่การย้าย tool-prefix รอ `xeno-skills#206` |

ข้อควรระวัง metadata-drift ที่รับต่อจากการวิเคราะห์ (อย่า normalize ให้หายไป): `config.py` ระบุไว้ `__updated__ = "2025-12-15"` ซึ่งเก่าเมื่อเทียบกับพัฒนาการจริงของ 2026-07/08; `pyproject.toml` บอก Python `>=3.9`, README แนะนำ 3.10+, และ `CLAUDE.md` ตั้งชื่อ venv สามตัวต่างกัน (`.venv`, `.openclink_venv`, `venv`)

## ข้อจำกัดที่รู้แล้ว — สิ่งที่ openclink ไม่ทำ

- **ไม่ตัดสินใจว่าจะรัน multi-agent เมื่อไหร่** — `using-clink` เป็นคนตัดสินใจ
- **ไม่รวมผลลัพธ์ multi-agent** — master agent ของ xeno-skills ทำ
- **ไม่ verify ผลลัพธ์ที่ส่งกลับ** — ชั้น skills ต้อง verify เอง deep-scan ยืนยันว่ามีจุดหนึ่งที่ non-zero exit ถูกรายงานเป็นความสำเร็จ (แก้ไขแล้ว แต่บันทึกไว้)
- **`antigravity` เป็น Windows-only** ตามดีไซน์ (ConPTY ผ่าน `pywinpty`); ผลบนเครื่อง alt-OS ยังไม่ถูก verify (ระบุตรง ๆ ใน ADR 0001)
- **`cursor` ต้องการแก้ env-var `SHELL` ต่อเครื่องบน Windows**; preset ที่ ship ไม่มีการแก้
- **`selectagents` ยังเป็นทดลอง** — off โดย default ด้วยราคา fixture; ห้ามโฆษณาว่าทำงานครบ
- **Supervised subagent sessions** (epic #11: cancel by handle, list in-flight) ยังอยู่ในขั้น spike ส่วนใหญ่ gated
- **งาน safety ที่ยังเปิด ระบุเป็นข้อจำกัดไม่ใช่ฟีเจอร์:** `readOnlyHint: True` ไม่ตรงกับพฤติกรรมจริง; child process ได้รับ `os.environ` ทั้งหมดโดยไม่มี allowlist; ไม่มี sandbox `cwd` ตามคำเตือนเปิดของ `docs/tools/clink.md` เอง ต้องรันเฉพาะใน trusted workspace
- **ไม่มี third-party production-safety audit** และไม่มี CI — คุณภาพเป็น local-run only
- **Conversation memory อยู่ใน memory เท่านั้น** (ไม่ใช้ Redis/disk) TTL เลื่อนเฉพาะเมื่อเขียนสำเร็จ และการ restart ทำลายทุก thread เอกสารโทน marketing `docs/context-revival.md` ("The Most Profound Feature") ขัดกับข้อนี้และต้องจับคู่กับข้อจำกัดเสมอ
- **MCP tool prefix อยู่กลางการย้าย** (`pal` → `openclink`) และผูกกับไทม์ไลน์ของ `xeno-skills#206` ไม่ใช่การตัดสินใจของ openclink ตัวเดียว
- **เอกสารการติดตั้งเคยชี้ไปที่ upstream.** deep-scan 2026-08-13 พบว่า `run-server.sh` และ `docs/getting-started.md` เวอร์ชันเก่าชี้ไปที่ URL ของ upstream แทนที่จะเป็น fork (บั๊กที่ทำให้รัน upstream โดยไม่ได้อะไรจากงาน fork) ณ การตรวจ 2026-09-02 ไฟล์ชี้ไปที่ `xenodeve/openclink` ถูกต้องแล้ว — แต่เป็นบั๊กที่เคยกลับซ้ำ จึงต้อง re-verify ก่อนเผยแพร่

สรุปตรง ๆ ที่ brief ขอให้ site รับไว้: openclink ไม่พยายามเป็น multi-agent platform ที่สมบูรณ์แบบ มันเป็น bridge ที่ทำงานได้จริงและตรงต่อข้อจำกัดของตัวเอง — นั่นคือสิ่งที่ทำให้ xeno-skills ไว้ใจมันในฐานะ transport

กลับไปยังส่วน multi-agent ของ hub: [/#multi-agent](/#multi-agent)
