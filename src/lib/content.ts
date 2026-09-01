import { readdirSync, readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();

export type EcosystemItem = {
  slug: string;
  title: string;
  description: string;
  repo: string;
  status: string;
  tags: string[];
  body: string;
};

export type Post = {
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
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(
        readFileSync(path.join(ROOT, dir, file), "utf8"),
      );
      return { slug, ...data, body: content } as T;
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
