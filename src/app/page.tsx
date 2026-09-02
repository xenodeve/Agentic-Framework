import type { ReactNode } from "react";
import { getEcosystem, getPosts } from "@/lib/content";
import { loadHubContent } from "@/lib/hub-content";
import { familyLabels, skills } from "@/lib/skills";
import { Markdown } from "@/components/markdown";
import { SkillCatalog } from "@/components/skill-catalog";

const hub = loadHubContent();
const ecosystem = getEcosystem();
const posts = getPosts();

// The two tools the framework calls, in order (spec §3 §10 "Built on").
const builtOn = ["openclink", "clone-space"]
  .map((slug) => ecosystem.find((item) => item.slug === slug))
  .filter((item): item is (typeof ecosystem)[number] => item !== undefined);

/** Split the hero body into a big display statement and the remaining prose. */
function splitHero(body: string): [string, string] {
  const idx = body.indexOf("\n\n");
  if (idx < 0) return [body, ""];
  return [body.slice(0, idx), body.slice(idx + 2)];
}

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
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
            <h2 className="text-h4 font-semibold tracking-tight">{title}</h2>
          </div>
        </header>
        <div className="py-10 sm:py-14">{children}</div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [heroLead, heroRest] = splitHero(hub.sections.hero);

  return (
    <main className="mx-auto w-full max-w-5xl grid-rails">
      {/* Hero — the framework takes the visual mass (spec §9.1) */}
      <section id="hero" className="relative">
        <div className="crosshatch pointer-events-none absolute inset-x-0 top-0 h-[420px] sm:h-[520px]" />
        <div className="relative px-6 pt-24 sm:px-10 sm:pt-32">
          <p className="label text-accent">
            xeno-skills · openclink · clone space
          </p>
          <h1 className="mt-8 max-w-3xl font-display text-h1 font-semibold leading-[1.04] tracking-tight">
            {heroLead.replace(/\n/g, " ")}
          </h1>
          <div className="mt-10 max-w-[62ch]">
            <Markdown>{heroRest}</Markdown>
          </div>
        </div>
      </section>

      <Section id="problem" index="01" title="The problem">
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections.problem}</Markdown>
        </div>
      </Section>

      <Section id="four-outcomes" index="02" title="Four outcomes">
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections["four-outcomes"]}</Markdown>
        </div>
      </Section>

      <Section id="mini-architecture" index="03" title="How it fits together">
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections["mini-architecture"]}</Markdown>
        </div>
      </Section>

      <Section id="workflow" index="04" title="The workflow">
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections.workflow}</Markdown>
        </div>
      </Section>

      <Section id="skills" index="05" title="The skills">
        <p className="max-w-[62ch] leading-relaxed text-muted">
          {hub.sections.skills.replace(/\n/g, " ")}
        </p>
        <div className="mt-10">
          <SkillCatalog skills={skills} familyLabels={familyLabels} />
        </div>
      </Section>

      <Section id="multi-agent" index="06" title="Multi-agent">
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections["multi-agent"]}</Markdown>
        </div>
      </Section>

      <Section id="t4-standard" index="07" title="The T4 standard">
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections["t4-standard"]}</Markdown>
        </div>
      </Section>

      <Section id="hooks" index="08" title="Hooks & enforcement">
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections.hooks}</Markdown>
        </div>
      </Section>

      <Section id="research" index="09" title="Evidence">
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections.research}</Markdown>
        </div>
      </Section>

      <Section id="built-on" index="10" title="Built on">
        <p className="max-w-[62ch] leading-relaxed text-muted">
          {hub.sections["built-on"].replace(/\n/g, " ")}
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
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
              <span className="mt-6 font-mono text-xs text-accent">
                {item.slug} →
              </span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="install" index="11" title="Install">
        <div className="max-w-[62ch]">
          <Markdown>{hub.sections.install}</Markdown>
        </div>
      </Section>

      <Section id="blog-teaser" index="12" title="Latest">
        <p className="max-w-[62ch] leading-relaxed text-muted">
          {hub.sections["blog-teaser"].replace(/\n/g, " ")}
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
                  {post.title}
                </h3>
              </div>
              <p className="pl-16 text-sm leading-relaxed text-muted">
                {post.description}
              </p>
            </a>
          ))}
        </div>
      </Section>
    </main>
  );
}
