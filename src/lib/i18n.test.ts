import { expect, test } from "bun:test";
import {
  getLang,
  hydrateLang,
  localized,
  resolveLang,
  setLang,
  subscribeLang,
} from "./i18n";

test("localized picks Thai only when active and non-blank", () => {
  expect(localized("th", "เปิดใช้งาน", "Enabled")).toBe("เปิดใช้งาน");
  expect(localized("en", "เปิดใช้งาน", "Enabled")).toBe("Enabled");
  expect(localized("th", undefined, "Enabled")).toBe("Enabled");
  expect(localized("th", "   ", "Enabled")).toBe("Enabled");
});

// In the test runtime there is no window/localStorage: the store must still
// work (default th) and never touch the DOM.
// NOTE: the tests share the module-level store state and run in declared
// order — "defaults to th" asserts the initial value, so it must stay first.

test("the language defaults to th before anything is set", () => {
  expect(getLang()).toBe("th");
});

test("resolveLang only accepts a valid stored value", () => {
  expect(resolveLang(null, "th")).toBe("th");
  expect(resolveLang("en", "th")).toBe("en");
  expect(resolveLang("th", "en")).toBe("th");
  expect(resolveLang("garbage", "en")).toBe("en");
});

test("hydrateLang moves to the persisted value, otherwise stays put", () => {
  hydrateLang(() => "en");
  expect(getLang()).toBe("en");
  setLang("th");
  hydrateLang(() => "garbage");
  expect(getLang()).toBe("th");
});

test("setLang switches and notifies subscribers exactly once per change", () => {
  const seen: string[] = [];
  const unsubscribe = subscribeLang(() => seen.push(getLang()));
  setLang("en");
  setLang("en"); // a no-op switch does not re-emit
  unsubscribe();
  expect(seen).toEqual(["en"]);
  setLang("th");
  expect(seen).toEqual(["en"]); // the subscription is gone
  expect(getLang()).toBe("th");
});
