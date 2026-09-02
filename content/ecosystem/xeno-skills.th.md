---
title: "xeno-skills"
description: "skills, hooks บังคับใช้เวิร์กโฟลว์ และมาตรฐานปฏิบัติการ T4 engineering สำหรับการพัฒนาแบบ agent-primary"
repo: "xenodeve/xeno-skills"
status: "production"
tags: [skills, hooks, t4]
---

## คืออะไร

xeno-skills คือมาตรฐานปฏิบัติการที่ทีม T4 รัน repo ของตัวเองบน — coding agent เป็น developer หลัก เอกสารของ repo จึงเป็นคู่มือปฏิบัติการของมัน — และกฎถูกบังคับด้วย hooks, git guards และ contract tests ไม่ใช่คำปรึกษาที่ทิ้งไว้ให้ prompt

## ทำงานอย่างไร

- **Skills** route งานไปยังกระบวนการที่ถูกต้อง (`using-t4` entry map, `clink` multi-agent orchestration, `design` web UI suite)
- **Hooks** รักษา session ให้ไม่ออกจากราง — injection ตอน session เริ่ม, reminder ทุก turn และ `PreToolUse` gate ที่บล็อก PR ที่ไม่มี issue และ git อันตราย
- **Memory** เป็น first-class — open-work ledger, ship log และ memory vault ทำให้ agent ตัวใหม่กู้สภาพกลับมาได้หลัง context reset

## สถานะ

ใช้งานจริง (production) ในโปรเจกต์จริงของทีม (MangaDock, T4-Fastwork) และ bootstrap เข้า repo ของตัวเอง

deep-dive ฉบับเต็มกำลังมาถึง — architectural analysis (Antigravity) และ code review (Codex) กำลังดำเนินอยู่ และจะลงอยู่ใน `docs/`
