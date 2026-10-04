"use client";

import { ChevronRight } from "lucide-react";
import { usePrefs } from "./PrefsProvider";
import { Heading, Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { Icon } from "./ui/Icon";

export function Trust() {
  const { c } = usePrefs();
  const t = c.trust;
  return (
    <Section tone="soft">
      <Heading eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map((it, i) => (
          <Reveal key={it.t} delay={(i % 3) * 70}>
            <article className="h-full rounded-2xl border border-border bg-surface p-6">
              <span className="mb-4 grid size-11 place-items-center rounded-xl bg-indigo/12 text-indigo-ink">
                <Icon name={it.icon} size={22} />
              </span>
              <h3 className="font-display text-lg font-bold">{it.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{it.d}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-fg-faint">{t.stackTitle}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {t.stack.map((s) => (
            <li key={s} className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-fg-muted">
              {s}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

export function Vision() {
  const { c } = usePrefs();
  const v = c.vision;
  return (
    <Section id="vision">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading eyebrow={v.eyebrow} title={v.title} sub={v.lead} />
        <span className="rounded-full border border-amber/50 bg-amber/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-ink">{v.badge}</span>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {v.columns.map((col, i) => (
          <Reveal key={col.who} delay={i * 80}>
            <article className="h-full rounded-3xl border border-border bg-gradient-to-b from-surface-2 to-surface p-7">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-cyan/12 text-cyan-ink">
                  <Icon name={col.icon} size={22} />
                </span>
                <h3 className="font-display text-xl font-extrabold">{col.who}</h3>
              </div>
              <ul className="mt-5 grid gap-3">
                {col.items.map((it) => (
                  <li key={it} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
                    <ChevronRight size={16} className="mt-0.5 shrink-0 text-cyan-ink" strokeWidth={3} />
                    {it}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6">
        <div className="rounded-2xl border border-border bg-bg-soft p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-ink">{v.principles.title}</p>
          <ul className="mt-3 grid gap-2 md:grid-cols-3 md:gap-6">
            {v.principles.items.map((p) => (
              <li key={p} className="text-sm leading-relaxed text-fg-muted">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <h3 className="mb-6 text-2xl font-extrabold">{v.roadmap.title}</h3>
        <ol className="grid gap-4 md:grid-cols-4">
          {v.roadmap.stages.map((s, i) => (
            <li key={s.tag} className={`rounded-2xl border p-5 ${i === 0 ? "border-cyan/50 bg-cyan/8" : "border-border bg-surface"}`}>
              <p className={`text-xs font-bold uppercase tracking-[0.16em] ${i === 0 ? "text-cyan-ink" : "text-fg-faint"}`}>{s.tag}</p>
              <ul className="mt-3 grid gap-2">
                {s.items.map((it) => (
                  <li key={it} className="flex gap-2 text-sm leading-relaxed text-fg-muted">
                    <ChevronRight size={14} className="mt-1 shrink-0 text-cyan-ink" strokeWidth={3} />
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
