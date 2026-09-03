"use client";

import { localized } from "@/lib/i18n";
import { useLang } from "@/lib/i18n-react";
import { UI_STRINGS } from "@/lib/ui-strings";
import type { EcosystemItem, Post } from "@/lib/content";
import { Markdown } from "@/components/markdown";

export function PostView({ post }: { post: Post }) {
  const lang = useLang();
  const title = localized(lang, post.titleTh, post.title);
  const body = localized(lang, post.bodyTh, post.body);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
      <time dateTime={post.date} className="font-mono text-xs text-muted">
        {post.date}
      </time>
      <h1 className="mt-4 text-h2 font-semibold">{title}</h1>
      <div className="mt-12 border-t border-edge pt-12">
        <Markdown>{body}</Markdown>
      </div>
    </article>
  );
}

export function EcosystemItemView({ item }: { item: EcosystemItem }) {
  const lang = useLang();
  const t = UI_STRINGS[lang];
  const title = localized(lang, item.titleTh, item.title);
  const description = localized(lang, item.descriptionTh, item.description);
  const body = localized(lang, item.bodyTh, item.body);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-accent">{t.ecosystem.kicker}</p>
      <h1 className="mt-4 text-h2 font-semibold">{title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">{description}</p>
      <p className="mt-4 font-mono text-xs text-muted">{item.status}</p>
      <div className="mt-12 border-t border-edge pt-12">
        <Markdown>{body}</Markdown>
      </div>
    </article>
  );
}
