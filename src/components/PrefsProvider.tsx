"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getContent } from "@/content";
import type { Content } from "@/content/en";
import type { Locale } from "@/data/screens";

export type Theme = "dark" | "light";

type Prefs = {
  locale: Locale;
  theme: Theme;
  c: Content;
  setLocale: (l: Locale) => void;
  toggleTheme: () => void;
};

const PrefsContext = createContext<Prefs | null>(null);

// One-year cookie so the server renders the right language and theme on the
// next visit without a flash.
const remember = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
};

export function PrefsProvider({
  initialLocale,
  initialTheme,
  children,
}: {
  initialLocale: Locale;
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    remember("hs_lang", l);
    document.documentElement.lang = l;
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      remember("hs_theme", next);
      document.documentElement.dataset.theme = next;
      return next;
    });
  }, []);

  const value = useMemo<Prefs>(
    () => ({ locale, theme, c: getContent(locale), setLocale, toggleTheme }),
    [locale, theme, setLocale, toggleTheme],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): Prefs {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return ctx;
}
