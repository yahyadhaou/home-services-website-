"use client";

import { usePrefs } from "./PrefsProvider";
import { Heading, Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { Icon } from "./ui/Icon";
import { BrowserFrame, PhoneFrame } from "./ui/Frames";
import { pick } from "@/data/screens";

type Feature = { icon: string; t: string; d: string };

function FeatureGrid({ items, tone }: { items: Feature[]; tone: "cyan" | "amber" | "indigo" }) {
  const color = { cyan: "text-cyan-ink bg-cyan/12", amber: "text-amber-ink bg-amber/12", indigo: "text-indigo-ink bg-indigo/12" }[tone];
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
      {items.map((f, i) => (
        <Reveal key={f.t} delay={i * 60}>
          <li className="h-full list-none rounded-2xl border border-border bg-surface p-5">
            <span className={`mb-3 grid size-10 place-items-center rounded-xl ${color}`}>
              <Icon name={f.icon} size={20} />
            </span>
            <h4 className="font-display text-base font-bold">{f.t}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{f.d}</p>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}

function AppHead({ tag, name, lead, tone }: { tag: string; name: string; lead: string; tone: "cyan" | "amber" | "indigo" }) {
  const t = { cyan: "text-cyan-ink", amber: "text-amber-ink", indigo: "text-indigo-ink" }[tone];
  return (
    <Reveal>
      <p className={`text-xs font-bold uppercase tracking-[0.22em] ${t}`}>{tag}</p>
      <h3 className="mt-2 text-3xl font-extrabold sm:text-4xl">{name}</h3>
      <p className="mt-4 text-pretty text-lg leading-relaxed text-fg-muted">{lead}</p>
    </Reveal>
  );
}

export function Apps() {
  const { c, locale } = usePrefs();
  const a = c.apps;
  const alt = (s: { title: { en: string; de: string } }) => s.title[locale];

  const cl = ["04", "26", "36"].map((id) => pick("client", id));
  const mg = ["13", "04", "11"].map((id) => pick("manager", id));
  const wk = [pick("coworker", "01"), pick("coworker", "02")];
  const ad = [pick("admin", "a-companies"), pick("admin", "a-booking")];

  return (
    <Section id="apps">
      <Heading eyebrow={a.eyebrow} title={a.title} sub={a.sub} />

      {/* Client */}
      <div className="mt-20 grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-2">
        <div>
          <AppHead tag={a.client.tag} name={a.client.name} lead={a.client.lead} tone="cyan" />
          <div className="mt-8">
            <FeatureGrid items={a.client.features} tone="cyan" />
          </div>
        </div>
        <Reveal className="relative mx-auto flex flex-wrap justify-center gap-3 lg:gap-4">
          {cl.map((s, i) => (
            <div key={s.id} className={i === 1 ? "mt-16" : ""}>
              <PhoneFrame screen={s} alt={alt(s)} width={188} />
            </div>
          ))}
        </Reveal>
      </div>

      {/* Business */}
      <div className="mt-28 rounded-[2rem] border border-border bg-bg-soft p-6 sm:p-10">
        <div className="max-w-3xl">
          <AppHead tag={a.business.tag} name={a.business.name} lead={a.business.lead} tone="amber" />
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {a.business.roles.map((r, i) => (
            <Reveal key={r.name} delay={i * 80}>
              <article className="h-full rounded-2xl border border-border bg-surface p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-amber/12 text-amber-ink">
                    <Icon name={r.icon} size={22} />
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-extrabold leading-tight">{r.name}</h4>
                    <p className="text-xs font-semibold uppercase tracking-wider text-fg-faint">{r.sub}</p>
                  </div>
                </div>
                <ul className="mt-4 grid gap-2">
                  {r.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
                      <Icon name="check" size={15} className="mt-1 shrink-0 text-amber-ink" strokeWidth={3} />
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 flex flex-wrap items-start justify-center gap-5">
          {mg.map((s, i) => (
            <div key={s.id} className={i === 1 ? "sm:mt-10" : ""}>
              <PhoneFrame screen={s} alt={alt(s)} width={172} />
            </div>
          ))}
          {wk.map((s, i) => (
            <div key={s.id} className={i === 0 ? "sm:mt-10" : ""}>
              <PhoneFrame screen={s} alt={alt(s)} width={172} />
            </div>
          ))}
        </Reveal>
      </div>

      {/* Admin */}
      <div className="mt-28 grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 grid gap-5 lg:order-1">
          {ad.map((s) => (
            <BrowserFrame key={s.id} screen={s} alt={alt(s)} sizes="(min-width: 1024px) 560px, 100vw" />
          ))}
        </Reveal>
        <div className="order-1 lg:order-2">
          <AppHead tag={a.admin.tag} name={a.admin.name} lead={a.admin.lead} tone="indigo" />
          <div className="mt-8">
            <FeatureGrid items={a.admin.features} tone="indigo" />
          </div>
        </div>
      </div>
    </Section>
  );
}
