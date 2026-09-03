import { expect, test } from "bun:test";
import { getEcosystem, getPosts } from "./content";

// Runs against the real repo content (same as scripts/generate-skills.test.ts):
// the loaders must pair .th.md siblings without leaking them as slugs.

test("a .th.md sibling never becomes its own slug", () => {
  const slugs = [
    ...getEcosystem().map((item) => item.slug),
    ...getPosts().map((post) => post.slug),
  ];
  for (const slug of slugs) {
    expect(slug.endsWith(".th")).toBe(false);
  }
});

test("every slug keeps a distinct entry", () => {
  const slugs = [
    ...getEcosystem().map((item) => item.slug),
    ...getPosts().map((post) => post.slug),
  ];
  expect(new Set(slugs).size).toBe(slugs.length);
});

test("a .th.md sibling attaches to its entry when present", () => {
  const openclink = getEcosystem().find((item) => item.slug === "openclink");
  expect(openclink?.titleTh ?? "").not.toBe("");
  expect(openclink?.bodyTh ?? "").not.toBe("");
  const post = getPosts().find(
    (candidate) => candidate.slug === "the-agentic-framework",
  );
  expect(post?.bodyTh ?? "").not.toBe("");
});
