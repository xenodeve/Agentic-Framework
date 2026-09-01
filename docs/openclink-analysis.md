# รายงานการวิเคราะห์สถาปัตยกรรมและแนวคิดของ OpenClink
*(Architecture Analysis and Technical Breakdown of OpenClink)*

> **สถานะเอกสาร:** ตรวจสอบกับซอร์สจริงที่ `D:\Github\pal-mcp-server` เมื่อ **2026-09-02**
> branch `feat/149-clink-run-journal`, commit ล่าสุด `200fcb9` (2026-08-19), plugin version `9.8.2` (`pyproject.toml`)

---

## 1. บทสรุปผู้บริหาร (Executive Summary)

**OpenClink** (ชื่อโฟลเดอร์จริง `pal-mcp-server`, เดิมชื่อ Zen MCP → PAL MCP) เป็น **MCP (Model Context Protocol) server** ที่ทำหน้าที่สองอย่างพร้อมกัน:

1. **Multi-model tool server** — มี tool ในตัวเอง 19 ตัว (`chat`, `thinkdeep`, `debug`, `codereview` ฯลฯ) ที่คุยตรงกับ provider เช่น Gemini, OpenAI, Azure OpenAI, X.AI, OpenRouter, DIAL และโมเดลบนเครื่อง (Ollama/custom)
2. **CLI-to-CLI bridge (`clink` tool)** — สะพานที่เปิด CLI agent ภายนอก (Codex CLI, Antigravity `agy`, Cursor `cursor-agent`, OpenCode, Claude Code เอง) ให้เป็น subagent ที่รันในบริบทแยก แล้วส่งเฉพาะผลลัพธ์กลับ

**ในบริบทเว็บ T4 Labs นี้ OpenClink ไม่ใช่ผลิตภัณฑ์ที่ยืนเดี่ยว** — มันคือ **transport layer** ที่ `xeno-skills` เรียกใช้เฉพาะผ่านตระกูล skill `clink-*` (`using-clink`, `clink-brainstorm`, `clink-subagents`, `clink-debug`, `clink-masteragent`) เพื่อทำ multi-agent orchestration เท่านั้น `clink` tool หนึ่งตัวใน OpenClink คือกลไกส่งคำสั่งของทั้งตระกูล skill นี้

จุดที่ทำให้โปรเจกต์นี้น่าสนใจเชิงวิศวกรรมไม่ใช่แค่ฟีเจอร์ แต่คือ **วัฒนธรรมการตรวจสอบตัวเองแบบสุดโต่ง**: มีรายงาน deep-scan วันที่ 2026-08-13 ที่อ่านโค้ด production ประมาณ 26,000 จาก 30,238 บรรทัด ยืนยัน 605 ข้อกล่าวอ้าง และสรุปตรงไปตรงมาว่า **"silent failure is the house style"** — ระบบ degrade เงียบ ๆ โดย caller ไม่รู้ตัว และไม่มี test ไหน fail เพราะไม่มีอะไร fail จริง

---

## 2. จุดกำเนิดและเหตุผลของการ fork

### 2.1 สายเลือด (lineage)

`Zen MCP` → `PAL MCP` → **`OpenClink`** (fork ของ [`BeehiveInnovations/pal-mcp-server`](https://github.com/BeehiveInnovations/pal-mcp-server), Apache-2.0) ต้นทางหยุดดูแลตั้งแต่ราวกลางปี 2026 (README ระบุเช่นนี้ แต่รายงาน deep-scan 2026-08-13 ตรวจ object database แล้วพบว่า commit ล่าสุดของ upstream คือ 2025-12-15 — ควรอ้างว่า "ไม่มี commit ใหม่ตั้งแต่ธ.ค. 2025" มากกว่าคำว่า "unmaintained" แบบเหมารวม, source: `docs/reports/2026-08-13-deep-scan-architecture-safety-and-direction.md` §13)

fork นี้ดูแลโดย `xenodeve` และเปลี่ยนชื่อจาก `pal-mcp-server` เป็น `openclink` อย่างสมบูรณ์บน `main` เมื่อ **2026-08-16** (PR #114, 22 commits, 176 files — source: `docs/OPEN-WORK-LEDGER.md`) เหตุผลของการเปลี่ยนชื่อคือ `pal-mcp-server` ถูกใช้บน PyPI แล้วโดยโปรเจกต์อื่น (เวอร์ชัน 10.4.3)

### 2.2 ปัญหาที่ fork แก้ (ไม่ใช่แค่ฟีเจอร์ใหม่)

| ปัญหา | สาเหตุ | ทางแก้ของ fork |
|---|---|---|
| Google เลิก Gemini CLI กลางปี 2026 หันไป Antigravity (`agy`) | `agy` พิมพ์ output เฉพาะเมื่อคิดว่ามี real terminal ต่ออยู่ — subprocess pipe ธรรมดาได้ stdout ว่างเปล่า exit 0 | รัน `agy` ผ่าน Windows ConPTY จริงด้วย `pywinpty` (ADR 0001, commit `9087c81`) |
| ต้องการสลับโมเดล/effort โดยไม่แก้ config + restart | upstream fix โมเดลไว้ที่ config time เท่านั้น | เพิ่ม `model` / `reasoning_effort` เป็น optional parameter ต่อ call ของ `clink` (ADR 0002, commit `97a7072`) |
| ติดตั้งแล้วอยากให้ CLI ที่มีอยู่แล้วในเครื่องใช้งานได้ทันที | ไม่มีกลไก discover executable path นอก `PATH` เปล่า | `clink/discovery.py` ไล่หาใน known install locations (winget, `%LOCALAPPDATA%`, npm) ก่อน fallback (ADR 0003, commit `d44ae01`) |
| `mcp` 2.0.0 ลบ `Server.list_tools` ที่ `server.py` ใช้เป็น decorator | unbounded dependency `mcp>=1.0.0` | pin `mcp>=1.0.0,<2` ใน `pyproject.toml` ทั้งสองไฟล์ (`requirements.txt` ตามด้วย test `test_dependency_pins.py`) |
| `images` parameter ถูกรับไว้แล้วทิ้งเงียบ ๆ (ไม่มี runner ไหนใช้เลย) | ทุก agent ทำ `_ = (files, images)` | เปลี่ยนเป็น error ทันทีพร้อมบอกทางแก้จริง (ฝัง path ใน `prompt` แล้วให้ agent เปิดไฟล์เอง) |

**breaking change เดียวของ fork นี้**: `model` เปลี่ยนจาก optional เป็น **required** ใน `clink` (issue #29) — เหตุผลคือ "โมเดลที่ไม่มีใครเลือก" กับ "โมเดลที่มีคนเลือก" ต้องแยกออกจากกันไม่ให้ปนกันใน `resolved_model` (source: `CHANGES-FORK.md`)

---

## 3. สถาปัตยกรรมระบบ

```mermaid
graph TD
    Dev["Developer (มนุษย์)"] -->|บรีฟงาน| Skills["xeno-skills — ศูนย์กลาง orchestration"]

    subgraph ClinkFamily["ตระกูล skill clink-* ใน xeno-skills"]
        UsingClink["using-clink (เกตตัดสินใจ)"]
        Brainstorm["clink-brainstorm"]
        Subagents["clink-subagents"]
        DebugSkill["clink-debug"]
        Master["clink-masteragent"]
    end
    Skills --> UsingClink --> Brainstorm & Subagents & DebugSkill & Master

    subgraph OpenClink["OpenClink — MCP server (โฟลเดอร์จริง pal-mcp-server)"]
        direction TB
        MCPTool["clink tool (tools/clink.py) — CLI-to-CLI bridge"]
        Registry["clink/registry.py + discovery.py<br/>โหลด conf/cli_clients/*.json"]
        Agents["clink/agents/* — 6 runner<br/>base / claude / codex / antigravity / cursor / opencode / gemini"]
        Parsers["clink/parsers/* — แปลง output ต่อ CLI เป็นรูปแบบเดียว"]
        NativeTools["18 tool ในตัว: chat / thinkdeep / planner /<br/>consensus / debug / codereview / precommit / …"]
        Providers["providers/* — Gemini, OpenAI, Azure, X.AI,<br/>OpenRouter, DIAL, Custom/Ollama"]

        MCPTool --> Registry --> Agents --> Parsers
        NativeTools --> Providers
    end

    Brainstorm -. MCP call: clink .-> MCPTool
    Subagents -. MCP call: clink .-> MCPTool
    DebugSkill -. MCP call: clink .-> MCPTool
    Master -. MCP call: clink .-> MCPTool

    Agents -->|subprocess ธรรมดา, JSON/JSONL| CodexCLI["codex CLI"]
    Agents -->|subprocess ธรรมดา, JSON| ClaudeCLI["claude / claude-9arm CLI"]
    Agents -->|Windows ConPTY (pywinpty)| AgyCLI["agy — Antigravity CLI"]
    Agents -->|subprocess, text| CursorCLI["cursor-agent CLI"]
    Agents -->|subprocess, JSONL ต่อ event| OpenCodeCLI["opencode CLI"]

    CodexCLI & ClaudeCLI & AgyCLI & CursorCLI & OpenCodeCLI -.-> ExternalModel["โมเดลจริงของแต่ละ CLI<br/>(GPT-5.6, Gemini, Claude, Grok, Kimi, GLM ฯลฯ)"]
```

**จุดสำคัญที่ต้องเข้าใจ:** เส้นจาก `clink-brainstorm` / `clink-subagents` ฯลฯ ไปยัง OpenClink เป็น **MCP tool call เดียว** (`clink`) เท่านั้น — skill ทั้งตระกูลของ xeno-skills ไม่ได้เรียก tool อื่นใน OpenClink เลย (`chat`, `thinkdeep`, `debug` ฯลฯ เป็นทางเลือกสำหรับ end-user ของ OpenClink เองที่ไม่เกี่ยวกับ xeno-skills โดยตรง)

### 3.1 clink agent runners — ตารางความสามารถจริง

| `cli_name` | Runner | กลไก transport | Parser | หมายเหตุเฉพาะ fork | Evidence / วันที่ |
|---|---|---|---|---|---|
| `codex` | `CodexAgent` (`clink/agents/codex.py`) | `asyncio.create_subprocess_exec` ธรรมดา, `--json` | `codex_jsonl` | มี `-m` (model) + `-c model_reasoning_effort=` (5 ระดับ: low/medium/high/xhigh/max) | `docs/clink-model-effort-guide.md`, 2026-07-16 |
| `claude` / `claude-9arm` | `BaseCLIAgent` (generic) | subprocess ธรรมดา, `--output-format json` | `claude_json` | `claude-9arm` คือ config เดียวกันชี้ไปยัง gateway ทางเลือก (`--settings` + `--model`) ผ่าน `conf/cli_clients/claude-9arm.json` ที่ ship active | ADR 0003, 2026-07-16 |
| `antigravity` | `AntigravityAgent` (`clink/agents/antigravity.py`) | **Windows ConPTY** (`winpty.PtyProcess.spawn`) — ต้องมี pseudo-terminal จริงเพราะ `agy` เงียบเมื่ออยู่หลัง pipe ธรรมดา | `antigravity_text` (ลบ ANSI/CR-LF) | บั๊กใหญ่ที่พบและแก้: `--print` เป็น value-taking flag กิน `--model` เป็นค่าของตัวเอง — ต้องวางลำดับ `--model` **ก่อน** `--print` | ADR 0001/0002, resolved 2026-07-16, commit `7e80e42` |
| `cursor` | `BaseCLIAgent` + preset | subprocess, `-p --trust --output-format text` | `antigravity_text` (reuse) | เปิดทางไปยัง Grok (xAI), Kimi (Moonshot), GLM (Zhipu) ที่ client อื่นแตะไม่ถึง; มีบั๊ก `SHELL=bash.exe` บน Windows ที่ทำให้ tool ทุกตัวตายเงียบ ๆ | `CHANGES-FORK.md`, 2026-08 |
| `opencode` | `OpenCodeAgent` (`clink/agents/opencode.py`) | subprocess, `--format json` (1 JSON event/บรรทัด) | `opencode` parser เฉพาะ | **ตัวเดียวที่รายงานค่าใช้จ่ายจริงของตัวเอง** (`part.cost` → `cli_reported_cost`) และตัวเดียวที่ถึง provider `opencode-go` (deepseek, GLM, Kimi, MiniMax, Qwen, Grok) — รองรับ `--variant` (reasoning effort) ตั้งแต่ #125 | `docs/OPEN-WORK-LEDGER.md`, ships complete 2026-08-16 (#125–127, PR #128) |
| `gemini` | `BaseCLIAgent` + preset | subprocess, `--yolo -o json` | `gemini` parser | **binary ต้นทางเลิกใช้แล้วกลางปี 2026** — README แนะนำให้ใช้ `antigravity` แทน แต่ preset ยังอยู่ในโค้ด | `README.md` |

### 3.2 Tool ทั้ง 19 ตัวใน OpenClink

| หมวด | เปิดโดยดีฟอลต์ | ปิดโดยดีฟอลต์ |
|---|---|---|
| **การร่วมมือ & วางแผน** | `clink`, `chat`, `thinkdeep`, `planner`, `consensus` | — |
| **วิเคราะห์ & คุณภาพโค้ด** | `debug`, `precommit`, `codereview` | `analyze` |
| **เครื่องมือพัฒนา** | — | `refactor`, `testgen`, `secaudit`, `docgen`, `tracer` |
| **ยูทิลิตี้** | `apilookup`, `challenge` | `selectagents` (ยังเป็น stub — ดู §5) |
| **บังคับเปิดเสมอ** | `listmodels`, `version` | — |

รวม **19 tool** (`server.py:264-283` — verified ตรงกับตัวเลขที่ README ประกาศ) — 10 เปิดดีฟอลต์ + 7 ปิดดีฟอลต์ + 2 บังคับเปิด

### 3.3 Provider ที่รองรับสำหรับ native tools (ไม่ผ่าน clink)

`providers/` มี 7 ไฟล์ implementation: `gemini.py`, `openai.py`, `azure_openai.py`, `xai.py`, `openrouter.py`, `dial.py`, `custom.py` (Ollama/vLLM/LM Studio ผ่าน OpenAI-compatible endpoint) — เลือกโมเดลอัตโนมัติผ่าน capability-rank recipe ใน `docs/model_ranking.md` (คะแนน 1–100 จาก `intelligence_score` มนุษย์ตั้ง + bonus context window/output/thinking)

---

## 4. งานวิจัยเชิงประจักษ์: deep-scan ที่เขย่าตัวเอง (2026-08-13)

นี่คือหลักฐานเชิงประจักษ์ที่แข็งแรงที่สุดของโปรเจกต์ — ไม่ใช่ benchmark ความสามารถ แต่คือ**การตรวจสอบความปลอดภัยและสัญญาของตัวเอง**อย่างเป็นระบบ (`docs/reports/2026-08-13-deep-scan-architecture-safety-and-direction.md`)

### 4.1 วิธีวิจัย

3 รอบ, 605 ข้อกล่าวอ้างรวม, อ่านโค้ด production ~26,000/30,238 บรรทัด: รอบ 1–2 ใช้ผู้อ่าน 12 คนคู่กับ "ผู้หักล้าง" (adversarial refutation) — จาก 68 การหักล้างที่วางแผนไว้ รันจริงแค่ 27 ครั้ง และ **11 ใน 27 (41%) ถูกหักล้างหรือแก้ไข** รอบ 3 เปลี่ยนวิธีเป็นให้ผู้เขียนรายงานตรวจ claim ที่สำคัญเองโดยตรง แทน adversarial fan-out — ถูกกว่าและแม่นกว่า

### 4.2 สิ่งที่พบ (สรุปด้วยความเข้าใจของผู้เขียนเอกสารนี้ ไม่ใช่คัดลอก)

| หมวด | สิ่งที่พบ | Source |
|---|---|---|
| **Safety boundary** | `readOnlyHint: True` บน `clink` ทั้งที่ agent ที่ spawn มี flag bypass-approval เต็มรูปแบบ; child process ได้รับ `os.environ` เต็มก้อน (ทุก API key); ไม่มี `cwd` sandbox; path block-list มีช่องโหว่ (`C:\ProgramData`, `.git/config` อ่านได้ตรง ๆ) | §2, `tools/clink.py:156-157`, `clink/agents/base.py:533-536` |
| **Concurrency/liveness** | timeout ของ clink **รายงานไม่ได้จริง** เมื่อ grandchild process ยึด pipe; `provider.generate_content` เป็น synchronous call ใน `async def` — 1 chat กับโมเดลบนเครื่องสามารถ freeze event loop ได้นาน**ถึง 30 นาที** | §3 |
| **State leak** | tool ที่อ้างว่า "stateless" มี 11 field ที่รอดข้าม request; บทสนทนาต่อเทิร์นเพิ่มขนาด**สองเท่า** เพราะ guard string ไม่ match กัน (วัดได้: 3,069 → 54,280 ตัวอักษรใน 5 รอบ) | §4 |
| **Prompt layer** | system prompt 3 ไฟล์ (`planner`, `tracer`, `docgen`) รวม 29,879 byte **ไม่เคยถูกส่งถึงโมเดลเลย** เพราะ gate เงื่อนไขผิด | §5 |
| **Contract layer** | `confidence='certain'` (ทางออกจากการเรียกโมเดลเสียเงิน) พิมพ์เป็น `str` เฉย ๆ ใน 4 tool — พิมพ์ผิดตัวพิมพ์แล้วเงียบ ๆ ยังถูกเรียกเก็บเงินอยู่ดี; `consensus` panel ที่ล้มทั้งหมดยังรายงาน `consensus_confidence: "high"` (hardcode 2 จุด) | §6 |
| **บทสรุปของทั้งรายงาน** | **"silent failure is the house style"** — ระบบ degrade เงียบ ๆ ทุกจุด และไม่มี test ไหน fail เพราะไม่มีอะไร fail ในทางเทคนิค | §9 |

### 4.3 การหักล้างที่ทำให้รายงานน่าเชื่อถือมากขึ้น

รายงานบันทึกสิ่งที่ **ถูกหักล้าง** ไว้ด้วย ไม่ลบทิ้ง — เช่น "clink ไม่มี end-to-end test เลย" เป็นเท็จ (มี `tests/test_clink_integration.py` จริง) และ "thread ที่เขียนอยู่ตลอดไม่มีวันหมดอายุ" เป็นเท็จเช่นกัน (ที่ turn ceiling `add_turn` return ก่อน `setex` ทำให้ TTL หยุดเลื่อน) — บทเรียนที่รายงานทิ้งไว้เอง: **"ทุกข้อที่ถูกหักล้างเป็นคำกล่าวแบบ absolute (never/zero/only) เกือบทั้งหมด"**

### 4.4 รายงานที่ตามมาแก้ข้อสรุปเดิม (2026-08-13 เช่นกัน)

`docs/reports/2026-08-13-cli-enforcement-capability.md` **ล้มข้อสรุปเดิม** ของ spike วันที่ 2026-08-04 ที่บอกว่า "Claude Code เป็น client เดียวที่มี pre-tool hook" ผลตรวจจากตัว binary จริงพบว่า **4 จาก 5 client มีกลไกบล็อก tool call ได้** (`codex` มี 11 hook event ฝังใน binary รวม `PreToolUse`; `agy` และ `cursor-agent` มี hook ผ่าน `hooks.json`) และยังพบกลไกที่แรงกว่า hook: `--tools ""` บน Claude Code **ลบ built-in tool ออกจาก context ทั้งหมด** ในขณะที่ MCP tool ยังใช้ได้ — ทดสอบจริงแล้วว่า worker ที่ spawn ด้วย `--tools ""` เหลือ MCP tool เดียวเป็นเครื่องมือทั้งหมด อ่านไฟล์ไม่ได้เลย

---

## 5. สถานะปัจจุบันและพัฒนาการล่าสุด

| วันที่ | เหตุการณ์ | Source |
|---|---|---|
| **2026-08-19** | ledger ตัด epic #20 (safety hardening) และ #89 ออกเป็น issue ย่อย #144–#153; item แรกที่ยังไม่แก้: process ลูกของ `clink` ไม่ถูกฆ่าทั้ง tree เมื่อ cancel | `docs/OPEN-WORK-LEDGER.md` |
| **2026-08-16** | เปลี่ยนชื่อ repo `pal-mcp-server` → `openclink` เสร็จสมบูรณ์บน `main` (PR #114); PowerShell quality gate (`code_quality_checks.ps1`) หยุด auto-fix โค้ดเงียบ ๆ (บั๊กที่ทำให้ gate เขียนทับไฟล์มา 6 สัปดาห์เพราะ guard test อ่านแค่ `.sh`) | `DONE.md` |
| **2026-08-16** | `selectagents` (11 sub-issue #98–#113) รวมเข้า `main` ครบ — คำนวณ ranking, budget, partition, persist plan ได้จริง **แต่ยังอยู่ใน `DISABLED_TOOLS`** เพราะ dataset ราคาเป็น fixture ที่ construct ขึ้นเอง ไม่ใช่ราคาจริง (`#102` รอ spike `#97` ที่ยังไม่เริ่ม) | `docs/OPEN-WORK-LEDGER.md` |
| **2026-08-16** | `opencode` client รองรับสมบูรณ์ — แก้ 3 gap (reasoning effort ไม่ถูกทิ้ง, cost ถึง accounting block, cache-read ไม่หาย) verify กับ binary จริง | `docs/OPEN-WORK-LEDGER.md`, #125–127 |
| **2026-08-13** | deep-scan 605 claims + CLI-enforcement-capability report (ดู §4) | `docs/reports/` |
| **2026-08-09** | T4 enforcement layer (hooks) มี test คลุมจริง 17 เทส หลังจากที่ก่อนหน้านี้ ship มาโดยไม่มี committed test เลย | `docs/OPEN-WORK-LEDGER.md`, #83 |
| **2026-08-01** | ยังไม่เคยมี CI รันสำเร็จเลยสักครั้งในประวัติ repo — บัญชีถูก billing-block ไม่สามารถเปิด GitHub Actions ได้ (ตรวจสอบด้วย `gh run list`) — หมายความว่า **PR gate คือวินัยตอนเปิด PR ไม่ใช่ green check อัตโนมัติ** | `docs/OPEN-WORK-LEDGER.md`, `[[ci-unavailable-billing-blocked]]` |
| **2026-07-16** | ADR 0001–0002 (ConPTY, per-call model/effort), แก้บั๊ก antigravity `--print` กิน `--model` | `docs/adr/`, `docs/reports/2026-07-16-*` |

**ชุดเทส:** 152 ไฟล์ใน `tests/` (นับตรงจาก repo วันที่ตรวจ) — ledger ล่าสุดรายงาน **1,285 ผ่าน** หลัง PR #143 (2026-08-16) เทียบกับ 1,280 ก่อนหน้า — ตัวเลขนี้เป็น local run บนเครื่อง dev ไม่ใช่ CI เพราะ CI รันไม่ได้

---

## 6. บทบาทของ OpenClink ในระบบนิเวศ T4 (ทำไมมันไม่ยืนเดี่ยว)

OpenClink **ไม่มี end-user ทั่วไปเดินเข้ามาใช้เอง** ในบริบทของเว็บนี้ — มันถูกเรียกจาก 2 ทาง:

1. **`xeno-skills` เรียกผ่านตระกูล `clink-*`** — นี่คือทางหลักที่เว็บนี้ต้องนำเสนอ `using-clink` เป็นเกตตัดสินใจก่อนเรียก, `clink-brainstorm` ใช้ `clink` ยิงคำถามเดียวกันไปหลาย agent พร้อมกันเพื่อขอ judgment, `clink-subagents` ใช้ `clink` ส่งงานย่อยที่ verify ได้ไปให้ agent ที่เหมาะสมตาม routing table (ดู `docs/clink-model-effort-guide.md` ที่มาจากฝั่ง OpenClink เองเพื่อคำนวณ capability index ต่อ model+effort), `clink-debug` ใช้ fresh lineage agent ในการ falsify สมมติฐาน, `clink-masteragent` กำหนดกติกากลางของการเลือก model/effort
2. **ผู้ใช้ปลายทางของ OpenClink เอง** (นักพัฒนาที่ต่อ MCP client โดยตรง) — ใช้ tool อีก 18 ตัวที่ไม่ใช่ `clink` เช่น `chat`, `debug`, `codereview` — เส้นทางนี้**ไม่เกี่ยวข้องกับ xeno-skills**

**นัยสำคัญสำหรับเว็บไซต์:** เมื่อพูดถึง OpenClink บนเว็บของ T4 Labs ต้องอธิบายในฐานะ **infrastructure/transport ที่ xeno-skills พึ่งพา** ไม่ใช่ผลิตภัณฑ์คู่ขนานที่มีน้ำหนักเท่ากัน — โครงสร้าง IA ควรวาง OpenClink เป็นชั้น "how the delegation actually happens" ใต้เรื่องราวของ xeno-skills ไม่ใช่หน้า landing แยกที่แข่งกันเอง

---

## 7. บทเรียนและข้อคิดสำหรับการออกแบบ Agentic Framework

1. **"Verify against a real CLI" คือวินัยที่ป้องกันบั๊กใหญ่ที่สุดของโปรเจกต์นี้ได้จริง** — บั๊ก antigravity `--print` กิน `--model` ผ่าน unit test สีเขียวมาตลอดเพราะ test เช็คแค่ `_build_command()` output ไม่เคยรันกับ `agy` จริง (`CLAUDE.md` ยกเป็นตัวอย่าง non-negotiable)
2. **การประกาศว่า "stateless" หรือ "read-only" ต้องพิสูจน์ ไม่ใช่แค่ comment ในโค้ด** — deep-scan พบทั้งสองคำกล่าวอ้างเป็นเท็จโดยมีหลักฐานรันจริงรองรับ
3. **เอกสารการตลาด (`docs/context-revival.md` เรียกตัวเองว่า "The Most Profound Feature") กับความจริงทางวิศวกรรมขัดแย้งกันได้** — thread เก็บใน memory ล้วน (ไม่มี Redis/disk), TTL slide เฉพาะตอนเขียนสำเร็จ, restart ทำลาย thread ทั้งหมด — ฟีเจอร์ยังใช้งานได้จริงแต่ข้อจำกัดต้องระบุคู่กับคำโฆษณาเสมอ
4. **การหักล้างข้อค้นพบของตัวเองอย่างเปิดเผย (11/27 = 41% ถูกหักล้าง) น่าเชื่อถือกว่ารายงานที่มีแต่ข้อสรุปที่รอดทุกข้อ** — เป็นแนวทางเดียวกับหลักการ "Documented ≠ Enforced" ของ xeno-skills แต่ประยุกต์กับ "Reported ≠ Verified"
5. **การ fork แบบ additive-only (ไม่แตะพฤติกรรมเดิม) ทำให้ diff ตรวจง่ายและ merge conflict กับ upstream ต่ำ** แต่ก็สร้างภาระเอกสาร — deep-scan §13 พบว่า 1 การเปลี่ยนโค้ด (antigravity `--effort`) ทำให้เอกสาร 5 ไฟล์ + tool schema สดๆ ในโค้ด ล้าสมัยพร้อมกัน — ต้องมีกลไก sync เอกสารกับโค้ด ไม่ใช่พึ่งความจำคน
