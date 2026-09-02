"use client";

import { localized } from "@/lib/i18n";
import { useLang } from "@/lib/i18n-react";
import { UI_STRINGS } from "@/lib/ui-strings";
import type { Post } from "@/lib/content";

export function BlogList({ posts }: { posts: Post[] }) {
  const lang = useLang();
  const t = UI_STRINGS[lang];
  const title = (post: Post) => localized(lang, post.titleTh, post.title);
  const description = (post: Post) =>
    localized(lang, post.descriptionTh, post.description);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
      <h1 className="text-h2 font-semibold">{t.blogIndex.title}</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted">
        {t.blogIndex.intro}
      </p>
      <div className="mt-16 grid divide-y divide-edge">
        {posts.map((post, i) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-3 py-8"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <time
                dateTime={post.date}
                className="font-mono text-xs text-muted"
              >
                {post.date}
              </time>
              <h2 className="text-2xl font-semibold group-hover:text-accent">
                {title(post)}
              </h2>
            </div>
            <p className="pl-8 text-sm leading-relaxed text-muted">
              {description(post)}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
