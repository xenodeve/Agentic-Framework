import { readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { localized } from "./i18n";

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

/**
 * A Thai section that is missing or empty falls back to English per key, so a
 * partially-translated hub never renders a blank section.
 */
export function mergeHubLocales(en: HubContent, th?: HubContent): HubContent {
  if (!th) return en;
  const sections = {} as Record<HubSectionSlug, string>;
  for (const slug of HUB_SECTIONS) {
    sections[slug] = localized("th", th.sections[slug], en.sections[slug]);
  }
  return {
    title: localized("th", th.title, en.title),
    description: localized("th", th.description, en.description),
    sections,
  };
}

/** English is the required source; the Thai sibling is optional. */
export function loadLocalizedHub(): { th: HubContent; en: HubContent } {
  const en = parseHubContent(
    readFileSync(path.join(process.cwd(), "content", "hub-content.md"), "utf8"),
  );
  const thPath = path.join(process.cwd(), "content", "hub-content.th.md");
  let th: HubContent | undefined;
  try {
    th = parseHubContent(readFileSync(thPath, "utf8"));
  } catch {
    // no Thai file yet — the site simply renders English everywhere
  }
  return { th: mergeHubLocales(en, th), en };
}
