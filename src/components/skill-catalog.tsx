"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import type { SiteSkill } from "@/lib/skills";

/** useSyncExternalStore needs a stable subscribe; we only read once per render. */
const emptySubscribe = () => () => {};

type Props = {
  skills: SiteSkill[];
  familyLabels: Record<string, string>;
};

/**
 * The #skills catalog. Every origin-story panel is rendered into the HTML at
 * SSR; the client only toggles visibility (no fetch-on-click). Mobile: full-
 * screen bottom sheet; desktop: centered glass panel.
 *
 * `?skill=<slug>` deep-links a panel open. Read on the client (not via
 * `searchParams`) so `/` stays a static route; unknown slugs are ignored.
 */
export function SkillCatalog({ skills, familyLabels }: Props) {
  const [manual, setManual] = useState<string | null>(null);
  const [deepLinkDismissed, setDeepLinkDismissed] = useState(false);

  // Hydration-safe read of ?skill= (the server snapshot is null), so the first
  // paint matches the SSR HTML — every panel hidden — and the browser URL opens
  // its panel only after hydration. No mount effect, no fetch-on-click.
  const deepLinkSlug = useSyncExternalStore(
    emptySubscribe,
    () => {
      const slug = new URLSearchParams(window.location.search).get("skill");
      return slug && skills.some((s) => s.slug === slug) ? slug : null;
    },
    () => null,
  );

  const openSlug = manual ?? (deepLinkDismissed ? null : deepLinkSlug);

  const toggle = (slug: string) => {
    if (openSlug !== slug) {
      setManual(slug);
      return;
    }
    if (manual === slug) setManual(null);
    else setDeepLinkDismissed(true);
  };

  const close = () => {
    if (manual) setManual(null);
    else if (deepLinkSlug) setDeepLinkDismissed(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (manual) setManual(null);
      else if (deepLinkSlug) setDeepLinkDismissed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [manual, deepLinkSlug]);

  const families = [
    ...new Set(
      skills.map((s) => s.family).filter((f): f is string => f !== null),
    ),
  ];
  const standalone = skills.filter((s) => s.family === null);

  const row = (skill: SiteSkill) => (
    <SkillRow
      key={skill.slug}
      skill={skill}
      open={openSlug === skill.slug}
      onToggle={() => toggle(skill.slug)}
    />
  );

  return (
    <div>
      <div className="grid gap-x-12 sm:grid-cols-2">
        {families.map((family) => (
          <div key={family} className="py-6">
            <p className="label text-faint">{familyLabels[family] ?? family}</p>
            <div className="mt-2">{skills.filter((s) => s.family === family).map(row)}</div>
          </div>
        ))}
        {standalone.length > 0 && (
          <div className="py-6">
            <p className="label text-faint">Standalone</p>
            <div className="mt-2">{standalone.map(row)}</div>
          </div>
        )}
      </div>
      {/* the count comes from the generated manifest — never a literal */}
      <p className="metadata mt-4">
        {skills.length} skills · generated from SKILL.md frontmatter
      </p>

      {skills.map((skill) => (
        <Panel
          key={skill.slug}
          skill={skill}
          skills={skills}
          familyLabels={familyLabels}
          open={openSlug === skill.slug}
          onClose={close}
        />
      ))}
    </div>
  );
}

function SkillRow({
  skill,
  open,
  onToggle,
}: {
  skill: SiteSkill;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={`Open the ${skill.slug} origin story`}
      className="group relative block w-full py-3 text-left"
    >
      <span
        className={`font-mono text-sm transition-colors duration-200 group-hover:text-accent ${
          open ? "text-accent" : ""
        }`}
      >
        {skill.slug}
      </span>
      <span className="sr-only">{skill.description}</span>
      {/* hover summary */}
      <span className="glass-layer pointer-events-none absolute left-0 top-[calc(100%-0.5rem)] z-10 max-w-md rounded-lg p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="block text-xs leading-relaxed text-muted">
          {skill.description}
        </span>
      </span>
    </button>
  );
}

function Panel({
  skill,
  skills,
  familyLabels,
  open,
  onClose,
}: {
  skill: SiteSkill;
  skills: SiteSkill[];
  familyLabels: Record<string, string>;
  open: boolean;
  onClose: () => void;
}) {
  const story = skill.originStory;
  const inheritedLabel = skill.inheritedFrom
    ? (familyLabels[skill.inheritedFrom] ?? skill.inheritedFrom)
    : undefined;
  // family entry skill: using-design, using-clink, using-t4
  const entrySlug = skill.family ? `using-${skill.family}` : undefined;
  const entryExists = entrySlug
    ? skills.some((s) => s.slug === entrySlug)
    : false;

  return (
    <div
      role="dialog"
      aria-label={`${skill.slug} origin story`}
      aria-hidden={!open}
      hidden={!open}
      className={open ? "fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-6" : undefined}
    >
      <button
        type="button"
        aria-label="Close origin story"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/20"
        tabIndex={open ? 0 : -1}
      />
      <div
        className="glass-layer relative flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-t-lg sm:max-w-xl sm:rounded-lg"
        aria-hidden={!open}
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-edge px-6 py-5">
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              {skill.slug}
            </h3>
            <p className="metadata mt-1">
              {inheritedLabel
                ? `inherited from ${inheritedLabel}`
                : (familyLabels[skill.family ?? ""] ?? "standalone")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            tabIndex={open ? 0 : -1}
            className="font-mono text-lg leading-none text-muted transition-colors duration-200 hover:text-foreground"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">
          {story ? (
            <div className="space-y-6">
              <StoryBlock label="Problem" text={story.problem} />
              <StoryBlock label="Attempt" text={story.attempt} />
              <StoryBlock label="Effectiveness" text={story.effectiveness} />
              {(story.date || story.source) && (
                <p className="metadata">
                  {[story.date, story.source].filter(Boolean).join(" · ")}
                </p>
              )}
              {inheritedLabel && (
                <p className="text-xs leading-relaxed text-faint">
                  No story of its own — inherits the {inheritedLabel} family’s
                  story.
                  {entryExists && (
                    <>
                      {" "}
                      See{" "}
                      <a
                        href={`/?skill=${entrySlug}`}
                        className="text-accent underline decoration-edge-strong underline-offset-4"
                      >
                        {entrySlug}
                      </a>
                      .
                    </>
                  )}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              No origin story recorded yet — the story is never invented.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StoryBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="label text-accent">{label}</p>
      <p className="mt-2 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
