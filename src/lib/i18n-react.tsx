"use client";

import { useSyncExternalStore } from "react";
import { getLang, subscribeLang, type Lang } from "./i18n";

/**
 * Subscribe a client component to the language store. The server snapshot
 * reads the same "th" initial value the HTML was built with (required for
 * static prerendering), so hydration matches; the persisted choice is applied
 * after mount (see i18n.ts).
 */
export function useLang(): Lang {
  return useSyncExternalStore(subscribeLang, getLang, getLang);
}
