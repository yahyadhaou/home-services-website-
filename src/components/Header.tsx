"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { usePrefs } from "./PrefsProvider";
import { Logo } from "./ui/Logo";

const LINKS = ["platform", "showroom", "apps", "business", "vision", "downloads"] as const;

export function Header() {
  const { c, locale, setLocale, theme, toggleTheme } = usePrefs();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const labels = c.nav;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-border bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" aria-label="HomeServices" className="shrink-0">
          <Logo size={34} />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((k) => (
            <a
              key={k}
              href={`#${k}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg"
            >
              {labels[k]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div role="group" aria-label={labels.language} className="flex rounded-lg border border-border bg-surface p-0.5 text-xs font-bold">
            {(["en", "de"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                aria-pressed={locale === l}
                className={`rounded-md px-2.5 py-1.5 uppercase transition-colors ${
                  locale === l ? "bg-cyan text-[#06121f]" : "text-fg-muted hover:text-fg"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={labels.theme}
            className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-fg-muted transition-colors hover:text-fg"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            href="#contact"
            className="hidden rounded-lg bg-cyan px-4 py-2 text-sm font-bold text-[#06121f] transition hover:brightness-110 sm:inline-block"
          >
            {labels.cta}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={labels.menu}
            className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-fg lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border bg-bg/95 px-5 pb-5 pt-3 backdrop-blur-xl lg:hidden">
          <ul className="grid gap-1">
            {[...LINKS, "contact" as const].map((k) => (
              <li key={k}>
                <a
                  href={`#${k}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-fg hover:bg-surface"
                >
                  {labels[k]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
