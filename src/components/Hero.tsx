"use client";

import { ArrowRight, Download } from "lucide-react";
import { usePrefs } from "./PrefsProvider";
import { PhoneFrame } from "./ui/Frames";
import { pick } from "@/data/screens";

export function Hero() {
  const { c, locale } = usePrefs();
  const h = c.hero;
  const left = pick("client", "34");
  const mid = pick("client", "33");
  const right = pick("client", "27");
  const mgr = pick("manager", "13");

  return (
    <section id="top" className="relative isolate overflow-hidden pt-[68px]">
      <div className="grid-bg absolute inset-0 -z-10 opacity-60" />
      <div
        className="absolute -z-10 size-[620px] rounded-full blur-3xl"
        style={{ background: "var(--hero-glow-1)", left: "-8%", top: "-10%" }}
      />
      <div
        className="absolute -z-10 size-[560px] rounded-full blur-3xl"
        style={{ background: "var(--hero-glow-2)", right: "-6%", top: "8%" }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-20">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-ink backdrop-blur">
            <span className="size-1.5 rounded-full bg-cyan-ink" />
            {h.eyebrow}
          </p>
          <h1 className="text-balance text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-[4.2rem]">
            {h.title}
            <span className="mt-1 block bg-gradient-to-r from-cyan-ink via-indigo-ink to-amber-ink bg-clip-text text-transparent">
              {h.titleAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-fg-muted">{h.sub}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#showroom"
              className="group inline-flex items-center gap-2 rounded-xl bg-cyan px-6 py-3.5 text-sm font-bold text-[#06121f] shadow-[0_12px_30px_-12px_rgba(90,219,255,0.8)] transition hover:brightness-110"
            >
              {h.ctaPrimary}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#downloads"
              className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/70 px-6 py-3.5 text-sm font-bold text-fg backdrop-blur transition hover:bg-surface"
            >
              <Download size={17} />
              {h.ctaSecondary}
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {h.pills.map((p) => (
              <li key={p} className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs font-semibold text-fg-muted">
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto h-[520px] w-full max-w-[560px] sm:h-[600px]" aria-hidden={false}>
          <div
            className="float absolute left-0 top-16 z-10 hidden sm:block"
            style={{ ["--r" as string]: "-5deg", ["--fd" as string]: "0.4s" }}
          >
            <PhoneFrame screen={left} alt={locale === "de" ? left.title.de : left.title.en} width={190} />
          </div>
          <div className="float absolute left-1/2 top-0 z-20 -translate-x-1/2" style={{ ["--fd" as string]: "0s" }}>
            <PhoneFrame screen={mid} alt={locale === "de" ? mid.title.de : mid.title.en} width={236} priority />
          </div>
          <div
            className="float absolute right-0 top-24 z-10 hidden sm:block"
            style={{ ["--r" as string]: "5deg", ["--fd" as string]: "0.9s" }}
          >
            <PhoneFrame screen={right} alt={locale === "de" ? right.title.de : right.title.en} width={190} />
          </div>
          <div
            className="float absolute -bottom-2 -right-2 z-30 hidden rounded-2xl border border-border-strong bg-surface/90 p-1 shadow-[var(--shadow)] backdrop-blur md:block"
            style={{ ["--fd" as string]: "1.3s" }}
          >
            <PhoneFrame screen={mgr} alt={locale === "de" ? mgr.title.de : mgr.title.en} width={128} className="!shadow-none" />
          </div>
        </div>
      </div>

      <div className="border-y border-border bg-bg-soft/70 backdrop-blur">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-5 py-8 sm:px-8 md:grid-cols-4">
          {h.stats.map((s) => (
            <div key={s.l} className="text-center md:border-r md:border-border md:last:border-r-0">
              <dt className="sr-only">{s.l}</dt>
              <dd>
                <span className="block font-display text-4xl font-extrabold text-cyan-ink sm:text-5xl">{s.v}</span>
                <span className="mt-1 block text-sm font-medium text-fg-muted">{s.l}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
