"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Monitor, Smartphone, X } from "lucide-react";
import { usePrefs } from "./PrefsProvider";
import { Heading, Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { BrowserFrame, PhoneFrame } from "./ui/Frames";
import { APP_ORDER, SCREENS, type AppKey, type Group, type Screen } from "@/data/screens";

type ThemeFilter = "any" | "light" | "dark";

export function Showroom() {
  const { c, locale } = usePrefs();
  const s = c.showroom;

  const [app, setApp] = useState<AppKey>("client");
  const [group, setGroup] = useState<Group | "all">("all");
  const [theme, setTheme] = useState<ThemeFilter>("any");
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const all = SCREENS[app];
  const groups = useMemo(() => [...new Set(all.map((x) => x.group))], [all]);
  const hasBothThemes = useMemo(() => new Set(all.map((x) => x.theme)).size > 1, [all]);

  const list = useMemo(
    () => all.filter((x) => (group === "all" || x.group === group) && (theme === "any" || x.theme === theme)),
    [all, group, theme],
  );
  const current: Screen | undefined = list[Math.min(index, list.length - 1)];

  const go = useCallback(
    (delta: number) => {
      if (list.length === 0) return;
      setIndex((i) => (i + delta + list.length) % list.length);
    },
    [list.length],
  );

  const switchApp = (next: AppKey) => {
    setApp(next);
    setGroup("all");
    setTheme("any");
    setIndex(0);
  };

  // Keep the active thumbnail in view without scrolling the page.
  // (scrollIntoView would also scroll the page itself, so the rail is moved directly.)
  const railRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const rail = railRef.current;
    const el = rail?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!rail || !el) return;
    rail.scrollTo({ left: el.offsetLeft - (rail.clientWidth - el.clientWidth) / 2, behavior: "smooth" });
  }, [index, app, group, theme]);

  const onViewerKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  const label = (x: Screen) => x.title[locale];

  return (
    <Section id="showroom" tone="soft">
      <Heading eyebrow={s.eyebrow} title={s.title} sub={s.sub} />

      {/* Product tabs */}
      <Reveal className="mt-12">
        <div role="tablist" aria-label={s.title} className="flex flex-wrap gap-2">
          {APP_ORDER.map((k) => {
            const active = k === app;
            const Ico = k === "admin" ? Monitor : Smartphone;
            return (
              <button
                key={k}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => switchApp(k)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                  active
                    ? "border-cyan bg-cyan text-[#06121f]"
                    : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg"
                }`}
              >
                <Ico size={16} />
                {s.tabs[k]}
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-black/15" : "bg-bg-soft"}`}>{SCREENS[k].length}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-fg-faint">{s.tabNote[app]}</p>
      </Reveal>

      {/* Filters */}
      {groups.length > 1 || hasBothThemes ? (
        <div className="mt-6 flex flex-wrap items-center gap-2" aria-label="Filters">
          {groups.length > 1 ? (
            <>
              {(["all", ...groups] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={group === g}
                  onClick={() => {
                    setGroup(g);
                    setIndex(0);
                  }}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    group === g ? "border-cyan-ink bg-cyan-ink/15 text-cyan-ink" : "border-border text-fg-muted hover:text-fg"
                  }`}
                >
                  {s.filters[g]}
                </button>
              ))}
            </>
          ) : null}
          {hasBothThemes ? (
            <div className="ml-auto flex rounded-full border border-border p-0.5 text-xs font-bold">
              {(["any", "light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={theme === t}
                  onClick={() => {
                    setTheme(t);
                    setIndex(0);
                  }}
                  className={`rounded-full px-3 py-1.5 transition-colors ${theme === t ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"}`}
                >
                  {s.appearance[t]}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Viewer */}
      {current ? (
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]" onKeyDown={onViewerKey}>
          <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface-2 to-surface px-4 py-10 sm:py-12">
            <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={s.prev}
              className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-border-strong bg-bg/80 text-fg backdrop-blur transition hover:bg-bg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={s.next}
              className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-border-strong bg-bg/80 text-fg backdrop-blur transition hover:bg-bg"
            >
              <ChevronRight size={20} />
            </button>

            <button
              type="button"
              onClick={() => setLightbox(true)}
              aria-label={s.open}
              className="relative z-0 cursor-zoom-in rounded-[2rem] outline-offset-8"
            >
              {current.kind === "phone" ? (
                <PhoneFrame key={current.src} screen={current} alt={label(current)} width={290} priority />
              ) : (
                <div className="w-[min(88vw,640px)]">
                  <BrowserFrame key={current.src} screen={current} alt={label(current)} priority sizes="640px" />
                </div>
              )}
            </button>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-ink">
              {s.filters[current.group]} · {Math.min(index, list.length - 1) + 1} {s.counter} {list.length}
            </p>
            <h3 className="mt-3 text-3xl font-extrabold sm:text-4xl">{label(current)}</h3>
            <p className="mt-4 text-lg leading-relaxed text-fg-muted">{current.text[locale]}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm font-bold hover:bg-surface-2"
              >
                <ChevronLeft size={16} /> {s.prev}
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-sm font-bold text-[#06121f] hover:brightness-110"
              >
                {s.next} <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong px-4 py-2.5 text-sm font-bold text-fg-muted hover:text-fg"
              >
                <Maximize2 size={15} /> {s.open}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-border bg-surface p-8 text-center text-fg-muted">{s.noMatch}</p>
      )}

      {/* Thumbnails */}
      <div ref={railRef} className="thumb-rail mt-8 flex gap-3 overflow-x-auto pb-3" role="list" aria-label={s.thumbs}>
        {list.map((x, i) => {
          const active = i === Math.min(index, list.length - 1);
          const isPhone = x.kind === "phone";
          return (
            <button
              key={x.src}
              role="listitem"
              type="button"
              onClick={() => setIndex(i)}
              aria-current={active}
              aria-label={label(x)}
              className={`relative shrink-0 overflow-hidden rounded-xl border-2 bg-surface transition ${
                active ? "border-cyan opacity-100" : "border-transparent opacity-65 hover:opacity-100"
              }`}
              style={{ width: isPhone ? 66 : 150, aspectRatio: `${x.w} / ${x.h}` }}
            >
              <Image src={x.src} alt="" fill sizes="150px" unoptimized className="object-cover object-top" />
            </button>
          );
        })}
      </div>

      {lightbox && current ? (
        <Lightbox screen={current} title={label(current)} onClose={() => setLightbox(false)} onPrev={() => go(-1)} onNext={() => go(1)} closeLabel={s.close} prevLabel={s.prev} nextLabel={s.next} />
      ) : null}
    </Section>
  );
}

function Lightbox({
  screen,
  title,
  onClose,
  onPrev,
  onNext,
  closeLabel,
  prevLabel,
  nextLabel,
}: {
  screen: Screen;
  title: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={onClose}>
      <button ref={closeRef} type="button" onClick={onClose} aria-label={closeLabel} className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
        <X size={22} />
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label={prevLabel} className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
        <ChevronLeft size={24} />
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label={nextLabel} className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
        <ChevronRight size={24} />
      </button>
      <figure className="relative max-h-full" onClick={(e) => e.stopPropagation()}>
        <div
          className="relative overflow-hidden rounded-2xl bg-black shadow-2xl"
          style={
            screen.kind === "phone"
              ? { height: "min(88vh, 900px)", aspectRatio: `${screen.w} / ${screen.h}` }
              : { width: "min(92vw, 1500px)", aspectRatio: `${screen.w} / ${screen.h}`, maxHeight: "86vh" }
          }
        >
          <Image src={screen.src} alt={title} fill sizes="92vw" unoptimized className="object-contain" />
        </div>
        <figcaption className="mt-3 text-center text-sm font-semibold text-white/80">{title}</figcaption>
      </figure>
    </div>
  );
}
