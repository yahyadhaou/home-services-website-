"use client";

import { Check } from "lucide-react";
import { usePrefs } from "./PrefsProvider";
import { Heading, Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { PhoneFrame, BrowserFrame } from "./ui/Frames";
import { pick } from "@/data/screens";

const ACCENT: Record<string, { text: string; bg: string; ring: string }> = {
  client: { text: "text-cyan-ink", bg: "bg-cyan", ring: "hover:border-cyan/60" },
  business: { text: "text-amber-ink", bg: "bg-amber", ring: "hover:border-amber/60" },
  admin: { text: "text-indigo-ink", bg: "bg-indigo", ring: "hover:border-indigo/60" },
};

export function Platform() {
  const { c, locale } = usePrefs();
  const p = c.platform;
  const alt = (s: { title: { en: string; de: string } }) => s.title[locale];
  const client = pick("client", "29");
  const business = pick("manager", "13");
  const admin = pick("admin", "a-overview");

  return (
    <Section id="platform">
      <Heading eyebrow={p.eyebrow} title={p.title} sub={p.sub} />

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-3">
        {p.products.map((prod, i) => {
          const a = ACCENT[prod.key];
          return (
            <Reveal key={prod.key} delay={i * 90}>
              <article className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-colors ${a.ring}`}>
                <div className="relative flex h-64 items-end justify-center overflow-hidden border-b border-border bg-gradient-to-b from-surface-2 to-surface px-6 pt-8">
                  {prod.key === "admin" ? (
                    <div className="w-[92%] translate-y-6 transition-transform duration-500 group-hover:translate-y-3">
                      <BrowserFrame screen={admin} alt={alt(admin)} sizes="420px" />
                    </div>
                  ) : (
                    <div className="translate-y-10 transition-transform duration-500 group-hover:translate-y-5">
                      <PhoneFrame screen={prod.key === "client" ? client : business} alt={alt(prod.key === "client" ? client : business)} width={176} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${a.text}`}>{prod.tag}</p>
                  <h3 className="mt-2 text-2xl font-extrabold">{prod.name}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-muted">{prod.text}</p>
                  <ul className="mt-5 grid gap-2.5">
                    {prod.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm font-medium">
                        <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${a.bg} text-[#06121f]`}>
                          <Check size={12} strokeWidth={3.4} />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-16">
        <h3 className="mb-8 text-center text-lg font-bold text-fg-muted">{p.flywheel.title}</h3>
        <ol className="grid gap-4 md:grid-cols-4">
          {p.flywheel.steps.map((s, i) => (
            <li key={s.t} className="relative rounded-2xl border border-border bg-surface p-5">
              <span className="mb-3 grid size-8 place-items-center rounded-full bg-cyan text-sm font-extrabold text-[#06121f]">{i + 1}</span>
              <p className="font-display text-lg font-bold">{s.t}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{s.d}</p>
              {i < p.flywheel.steps.length - 1 ? (
                <span aria-hidden className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-cyan-ink md:block">
                  ›
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
