import { expect, test } from "bun:test";
import { parseHubContent, mergeHubLocales } from "./hub-content";

const doc = `---
title: Hub
description: The hub page
---

# Title line (ignored)

## hero

Hero body.

## Problem

Problem body.
More problem.

## four-outcomes

Outcomes body.

## unknown-section

Not part of the hub.
`;

test("splits on ## headings and slugifies them", () => {
  const hub = parseHubContent(doc);
  expect(hub.title).toBe("Hub");
  expect(hub.description).toBe("The hub page");
  expect(hub.sections.hero).toBe("Hero body.");
  expect(hub.sections.problem).toBe("Problem body.\nMore problem.");
  expect(hub.sections["four-outcomes"]).toBe("Outcomes body.");
});

test("a missing section is an empty string, not an error", () => {
  const hub = parseHubContent(doc);
  expect(hub.sections["mini-architecture"]).toBe("");
  expect(hub.sections["blog-teaser"]).toBe("");
});

test("all canonical sections are present as keys", () => {
  const hub = parseHubContent(doc);
  for (const slug of [
    "hero",
    "skills",
    "multi-agent",
    "t4-standard",
    "hooks",
    "research",
    "built-on",
    "install",
  ]) {
    expect(Object.hasOwn(hub.sections, slug)).toBe(true);
  }
});

const enDoc = parseHubContent(doc);
// Thai doc: has hero + four-outcomes in Thai; problem is empty; others absent
const thDoc = parseHubContent(`---
title: ศูนย์กลาง
description: หน้า hub ภาษาไทย
---

## hero

เนื้อหา hero ภาษาไทย

## problem

## four-outcomes

ผลลัพธ์สี่ประการ
`);

test("a Thai section falls back to English per key when missing", () => {
  const merged = mergeHubLocales(enDoc, thDoc);
  expect(merged.sections["mini-architecture"]).toBe(""); // EN was empty too
  expect(merged.sections.problem).toBe(enDoc.sections.problem); // TH absent
  expect(merged.title).toBe("ศูนย์กลาง");
});

test("an empty Thai section falls back to English, never blank", () => {
  const merged = mergeHubLocales(enDoc, thDoc);
  expect(merged.sections.problem).toBe("Problem body.\nMore problem.");
  expect(merged.sections["four-outcomes"]).toBe("ผลลัพธ์สี่ประการ");
});

test("a missing Thai doc leaves the English doc unchanged", () => {
  const merged = mergeHubLocales(enDoc, undefined);
  expect(merged).toEqual(enDoc);
});
