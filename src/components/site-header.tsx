"use client";

import Link from "next/link";
import { useEffect } from "react";
import { hydrateLang, setLang } from "@/lib/i18n";
import { useLang } from "@/lib/i18n-react";
import { UI_STRINGS } from "@/lib/ui-strings";

const links = [
  { href: "/#skills", key: "navSkills" as const },
  { href: "/ecosystem/openclink", key: "navOpenclink" as const },
  { href: "/ecosystem/clone-space", key: "navCloneSpace" as const },
  { href: "/blog", key: "navBlog" as const },
];

export function SiteHeader() {
  const lang = useLang();
  const t = UI_STRINGS[lang].header;

  // The header is on every page (root layout), so the persisted language
  // choice is applied here once, after mount.
  useEffect(() => {
    hydrateLang();
  }, []);

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <div className="glass-layer mx-auto flex h-12 w-full max-w-4xl items-center justify-between rounded-full px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Agentic Framework
        </Link>
        <nav className="flex items-center gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label text-muted transition-colors duration-200 hover:text-foreground"
            >
              {t[link.key]}
            </Link>
          ))}
          {/* TH is primary — Thai renders without JS; EN only via this toggle */}
          <span className="flex items-center gap-1">
            {(["th", "en"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={lang === value}
                onClick={() => setLang(value)}
                className={`label rounded px-1.5 py-0.5 transition-colors duration-200 ${
                  lang === value
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </span>
        </nav>
      </div>
    </header>
  );
}
