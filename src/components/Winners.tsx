"use client";

import { usePrefs } from "./PrefsProvider";
import { Heading, Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { Icon } from "./ui/Icon";

export function Winners() {
  const { c } = usePrefs();
  const w = c.winners;
  return (
    <Section tone="soft">
      <Heading eyebrow={w.eyebrow} title={w.title} />
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {w.items.map((it, i) => (
          <Reveal key={it.who} delay={i * 70}>
            <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5">
              <span className="mb-4 grid size-11 place-items-center rounded-xl bg-cyan/12 text-cyan-ink">
                <Icon name={it.icon} size={22} />
              </span>
              <h3 className="font-display text-lg font-extrabold">{it.who}</h3>
              <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-fg-faint">{w.problem}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{it.problem}</p>
              <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-cyan-ink">{w.answer}</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed">{it.answer}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
