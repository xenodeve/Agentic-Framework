"use client";

import { useLang } from "@/lib/i18n-react";
import { UI_STRINGS } from "@/lib/ui-strings";

const rows = [
  { key: "standard", value: "xeno-skills" },
  { key: "transport", value: "openclink" },
  { key: "designReference", value: "clone space" },
  { key: "repo", value: "xenodeve/Agentic-Framework" },
] as const;

export function SiteFooter() {
  const lang = useLang();
  const t = UI_STRINGS[lang].footer;

  return (
    <footer className="border-t border-edge">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <dl className="grid grid-cols-[8rem_1fr] gap-x-8 gap-y-2 sm:grid-cols-[12rem_1fr]">
          {rows.map((row) => (
            <div key={row.key} className="contents">
              <dt className="metadata">{t[row.key]}</dt>
              <dd className="text-sm text-muted">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="wordmark-outline mt-16 font-display text-6xl font-semibold tracking-tight sm:text-8xl">
          Agentic
        </p>
      </div>
    </footer>
  );
}
