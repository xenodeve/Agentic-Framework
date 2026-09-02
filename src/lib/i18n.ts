/**
 * Language store — Thai is primary: the SSR HTML ships Thai (the initial value
 * below), so the site works without JS. A persisted choice (`af-lang`) is
 * applied once after mount; `setLang` switches in place and syncs <html lang>.
 *
 * The same useSyncExternalStore pattern as the ?skill= deep-link in
 * skill-catalog.tsx keeps hydration safe: server and first client render are
 * both "th", and the persisted choice flips the store after mount.
 */

export type Lang = "th" | "en";

const STORAGE_KEY = "af-lang";

let lang: Lang = "th";
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function getLang(): Lang {
  return lang;
}

export function subscribeLang(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** A stored value is only trusted if it names a known language. */
export function resolveLang(stored: string | null, current: Lang): Lang {
  return stored === "th" || stored === "en" ? stored : current;
}

/**
 * Pick a translation field: the Thai value when the active language is Thai
 * and the value exists and is non-blank, otherwise English. The single rule
 * for "what counts as translated" — every component fallback and
 * `mergeHubLocales` go through this.
 */
export function localized(lang: Lang, th: string | undefined, en: string): string {
  return lang === "th" && typeof th === "string" && th.trim() !== "" ? th : en;
}

function defaultRead(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage unavailable (private mode) — the choice just won't persist
  }
}

/**
 * Apply the persisted choice once, after mount. `read` is injectable for
 * tests; calling it with a no-op reader is safe on the server too.
 */
export function hydrateLang(read: () => string | null = defaultRead): void {
  const next = resolveLang(read(), lang);
  if (next !== lang) {
    lang = next;
    syncDom();
    emit();
  }
}

export function setLang(next: Lang): void {
  if (next === lang) return;
  lang = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // storage unavailable — the switch still applies for this visit
  }
  syncDom();
  emit();
}

function syncDom(): void {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
  }
}
