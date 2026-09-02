import { readdirSync, readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();

/** Thai fields are attached when a `*.th.md` sibling exists. */
export type Localized = {
  titleTh?: string;
  descriptionTh?: string;
  bodyTh?: string;
};

export type EcosystemItem = Localized & {
  slug: string;
  title: string;
  description: string;
  repo: string;
  status: string;
  tags: string[];
  body: string;
};

export type Post = Localized & {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  body: string;
};

// Frontmatter is untyped (gray-matter returns `any`), so the cast happens at
// this one boundary.
function load<T>(dir: string): T[] {
  let files: string[] = [];
  try {
    files = readdirSync(path.join(ROOT, dir));
  } catch {
    return [];
  }
  // A `*.th.md` is a translation sibling, not its own entry: it must never
  // become a slug (a fake /ecosystem/<slug>.th route) — it attaches below.
  const entries = files.filter(
    (file) => file.endsWith(".md") && !file.endsWith(".th.md"),
  );
  return entries
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(
        readFileSync(path.join(ROOT, dir, file), "utf8"),
      );
      const item = { slug, ...data, body: content } as unknown as T &
        Localized;
      const thFile = `${slug}.th.md`;
      if (files.includes(thFile)) {
        const { data: thData, content: thContent } = matter(
          readFileSync(path.join(ROOT, dir, thFile), "utf8"),
        );
        if (typeof thData.title === "string") item.titleTh = thData.title;
        if (typeof thData.description === "string") {
          item.descriptionTh = thData.description;
        }
        item.bodyTh = thContent;
      }
      return item as T;
    });
}

export function getEcosystem(): EcosystemItem[] {
  return load<EcosystemItem>("content/ecosystem");
}

export function getEcosystemItem(slug: string): EcosystemItem | undefined {
  return getEcosystem().find((item) => item.slug === slug);
}

export function getPosts(): Post[] {
  return load<Post>("content/blog").sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}
