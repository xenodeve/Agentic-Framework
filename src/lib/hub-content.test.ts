import { expect, test } from "bun:test";
import { parseHubContent } from "./hub-content";

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
