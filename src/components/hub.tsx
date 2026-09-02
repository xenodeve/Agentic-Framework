"use client";

import type { ReactNode } from "react";
import { localized } from "@/lib/i18n";
import { useLang } from "@/lib/i18n-react";
import { UI_STRINGS, type HubTitleSlug } from "@/lib/ui-strings";
import type { HubContent } from "@/lib/hub-content";
import type { EcosystemItem, Post } from "@/lib/content";
import type { SiteSkill } from "@/lib/skills";
import { Markdown } from "@/components/markdown";
import { SkillCatalog } from "@/components/skill-catalog";

type Props = {
  hubTh: HubContent;
  hubEn: HubContent;
  /** openclink + clone-space cards (spec §3 §10 "Built on") */
  builtOn: EcosystemItem[];
  posts: Post[];
  skills: SiteSkill[];
  familyLabels: Record<string, string>;
};

/** Split the hero body into a big display statement and the remaining prose. */
function splitHero(body: string): [string, string] {
  const idx = body.indexOf("\n\n");
  if (idx < 0) return [body, ""];
  return [body.slice(0, idx), body.slice(idx + 2)];
}

/** Flatten a markdown body into an inline paragraph. */
function inlineText(body: string): string {
  return body.replace(/\n/g, " ");
}

export function Hub({ hubTh, hubEn, builtOn, posts, skills, familyLabels }: Props) {
  const lang = useLang();
  const t = UI_STRINGS[lang];
  const hub = lang === "th" ? hubTh : hubEn;
  // Thai fields fall back to English when the translation is absent.
  const desc = (item: EcosystemItem) =>
    localized(lang, item.descriptionTh, item.description);
  const itemTitle = (item: EcosystemItem) =>
    localized(lang, item.titleTh, item.title);
  const postTitle = (post: Post) =>
    localized(lang, post.titleTh, post.title);
  const postDesc = (post: Post) =>
    localized(lang, post.descriptionTh, post.description);

  const [heroLead, heroRest] = splitHero(hub.sections.hero);

  const section = (id: HubTitleSlug, index: string, children: ReactNode) => (
    <section id={id} className="relative border-t border-edge">
      <span aria-hidden className="registration-mark" style={{ top: -7, left: -4 }}>
        +
      </span>
      <span aria-hidden className="registration-mark" style={{ top: -7, right: -4 }}>
        +
      </span>
      <div className="px-6 sm:px-10">
        <header className="pt-16 sm:pt-24">
          <div className="flex items-baseline gap-4">
            <span className="metadata text-accent">{index}</span>
            <h2 className="text-h4 font-semibold tracking-tight">
              {t.hub.sectionTitles[id]}
            </h2>
          </div>
        </header>
        <div className="py-10 sm:py-14">{children}</div>
      </div>
    </section>
  );

  return (
    <div className="mx-auto w-full max-w-5xl grid-rails">
      {/* Hero — the framework takes the visual mass (spec §9.1) */}
      <section id="hero" className="relative">
        <div className="crosshatch pointer-events-none absolute inset-x-0 top-0 h-[420px] sm:h-[520px]" />
        <div className="relative px-6 pt-24 sm:px-10 sm:pt-32">
          <p className="label text-accent">{t.hub.heroKicker}</p>
          <h1 className="mt-8 max-w-3xl font-display text-h1 font-semibold leading-[1.04] tracking-tight">
            {inlineText(heroLead)}
          </h1>
          <div className="mt-10 max-w-[62ch]">
            <Markdown>{heroRest}</Markdown>
          </div>
        </div>
      </section>

      {section("problem", "01", (
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections.problem}</Markdown>
        </div>
      ))}

      {section("four-outcomes", "02", (
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections["four-outcomes"]}</Markdown>
        </div>
      ))}

      {section("mini-architecture", "03", (
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections["mini-architecture"]}</Markdown>
        </div>
      ))}

      {section("workflow", "04", (
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections.workflow}</Markdown>
        </div>
      ))}

      {section("skills", "05", (
        <>
          <p className="max-w-[62ch] leading-relaxed text-muted">
            {inlineText(hub.sections.skills)}
          </p>
          <div className="mt-10">
            <SkillCatalog skills={skills} familyLabels={familyLabels} />
          </div>
        </>
      ))}

      {section("multi-agent", "06", (
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections["multi-agent"]}</Markdown>
        </div>
      ))}

      {section("t4-standard", "07", (
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections["t4-standard"]}</Markdown>
        </div>
      ))}

      {section("hooks", "08", (
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections.hooks}</Markdown>
        </div>
      ))}

      {section("research", "09", (
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections.research}</Markdown>
        </div>
      ))}

      {section("built-on", "10", (
        <>
          <p className="max-w-[62ch] leading-relaxed text-muted">
            {inlineText(hub.sections["built-on"])}
          </p>
          <div className="mt-10 grid gap-px bg-edge sm:grid-cols-2">
            {builtOn.map((item) => (
              <a
                key={item.slug}
                href={`/ecosystem/${item.slug}`}
                className="group flex flex-col bg-background p-6 transition-colors duration-200 hover:bg-surface"
              >
                <span className="label text-faint group-hover:text-accent">
                  {item.status}
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                  {itemTitle(item)}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {desc(item)}
                </p>
                <span className="mt-6 font-mono text-xs text-accent">
                  {item.slug} →
                </span>
              </a>
            ))}
          </div>
        </>
      ))}

      {section("install", "11", (
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections.install}</Markdown>
        </div>
      ))}

      {section("blog-teaser", "12", (
        <>
          <p className="max-w-[62ch] leading-relaxed text-muted">
            {inlineText(hub.sections["blog-teaser"])}
          </p>
          <div className="mt-10 grid divide-y divide-edge">
            {posts.slice(0, 3).map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-2 py-6"
              >
                <div className="flex items-baseline gap-4">
                  <time
                    dateTime={post.date}
                    className="metadata"
                  >
                    {post.date}
                  </time>
                  <h3 className="text-2xl font-semibold tracking-tight group-hover:text-accent">
                    {postTitle(post)}
                  </h3>
                </div>
                <p className="pl-16 text-sm leading-relaxed text-muted">
                  {postDesc(post)}
                </p>
              </a>
            ))}
          </div>
        </>
      ))}
    </div>
  );
}
