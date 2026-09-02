import { readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** Canonical hub sections, in spec §3 order. */
export const HUB_SECTIONS = [
  "hero",
  "problem",
  "four-outcomes",
  "mini-architecture",
  "workflow",
  "skills",
  "multi-agent",
  "t4-standard",
  "hooks",
  "research",
  "built-on",
  "install",
  "blog-teaser",
] as const;

export type HubSectionSlug = (typeof HUB_SECTIONS)[number];

export type HubContent = {
  title: string;
  description: string;
  /** section slug → markdown body (heading stripped) */
  sections: Record<HubSectionSlug, string>;
};

function slugify(heading: string): string {
  return heading
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function parseHubContent(raw: string): HubContent {
  const { data, content } = matter(raw);
  const sections: Record<string, string> = {};

  const lines = content.split("\n");
  let current: string | null = null;
  let buffer: string[] = [];
  const flush = () => {
    if (current !== null) {
      sections[current] = buffer.join("\n").trim();
    }
    buffer = [];
  };

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      flush();
      current = slugify(heading[1]);
    } else if (current !== null) {
      buffer.push(line);
    }
  }
  flush();

  const result = {} as Record<HubSectionSlug, string>;
  for (const slug of HUB_SECTIONS) {
    // a missing section renders empty — the page still builds, the gap is visible
    result[slug] = sections[slug] ?? "";
  }
  return {
    title: typeof data.title === "string" ? data.title : "Agentic Framework",
    description: typeof data.description === "string" ? data.description : "",
    sections: result,
  };
}

export function loadHubContent(): HubContent {
  const raw = readFileSync(
    path.join(process.cwd(), "content", "hub-content.md"),
    "utf8",
  );
  return parseHubContent(raw);
}
