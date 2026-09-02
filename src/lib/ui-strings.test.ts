import { expect, test } from "bun:test";
import { UI_STRINGS } from "./ui-strings";

/** Collect leaf paths ("header.navBlog", "hub.sectionTitles.problem", …). */
function leafPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") {
    return [prefix];
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

test("Thai and English carry exactly the same string keys", () => {
  const th = new Set(leafPaths(UI_STRINGS.th));
  const en = new Set(leafPaths(UI_STRINGS.en));
  expect([...th].sort()).toEqual([...en].sort());
});

test("no UI string is empty in either language", () => {
  for (const lang of ["th", "en"] as const) {
    const leaves = leafPaths(UI_STRINGS[lang]).filter((path) => path !== "");
    const values: Record<string, string> = {};
    for (const path of leaves) {
      const segments = path.split(".");
      let node: unknown = UI_STRINGS[lang];
      for (const segment of segments) {
        node = (node as Record<string, unknown>)[segment];
      }
      values[path] = node as string;
    }
    const empty = leaves.filter((path) => !values[path]?.trim());
    expect(empty).toEqual([]);
  }
});

test("Thai strings actually contain Thai text somewhere per group", () => {
  const thai = /[฀-๿]/;
  for (const group of Object.values(UI_STRINGS.th)) {
    expect(thai.test(JSON.stringify(group))).toBe(true);
  }
});
