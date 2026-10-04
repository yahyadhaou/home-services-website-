"use client";

import Image from "next/image";
import { Download, ExternalLink, FileText, Package } from "lucide-react";
import { usePrefs } from "./PrefsProvider";
import { Heading, Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";

export type FileSizes = Record<string, number>;

const SLIDES: Record<string, number> = { Client: 16, Business: 18, Admin: 17 };

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function Downloads({ sizes }: { sizes: FileSizes }) {
  const { c } = usePrefs();
  const d = c.downloads;

  const row = (key: string, kind: "Pitch-Deck" | "Executive-Summary") => {
    const file = `${key}-${kind}.pdf`;
    const isDeck = kind === "Pitch-Deck";
    const count = isDeck ? SLIDES[key] : 3;
    return (
      <li key={file} className="rounded-xl border border-border bg-bg-soft/60 p-3.5">
        <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-cyan/12 text-cyan-ink">
          <FileText size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{isDeck ? d.deck : d.summary}</p>
          <p className="text-xs text-fg-faint">
            {count} {isDeck ? d.slides : d.pages} · PDF · {sizes[file] ? mb(sizes[file]) : ""}
          </p>
        </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
        <a
          href={`/downloads/${file}`}
          target="_blank"
          rel="noopener"
          aria-label={`${d.preview}: ${file}`}
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-fg-muted hover:text-fg"
        >
          <ExternalLink size={15} />
        </a>
        <a
          href={`/downloads/${file}`}
          download
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-cyan px-3.5 py-2 text-xs font-bold text-[#06121f] hover:brightness-110"
        >
          <Download size={14} />
          {d.download}
        </a>
        </div>
      </li>
    );
  };

  return (
    <Section id="downloads" tone="soft">
      <Heading eyebrow={d.eyebrow} title={d.title} sub={d.sub} />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {d.groups.map((g, i) => (
          <Reveal key={g.key} delay={i * 90}>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface">
              <div className="relative aspect-[16/9] border-b border-border bg-surface-2">
                <Image
                  src={`/covers/${g.key}-Pitch-Deck.webp`}
                  alt={`${g.name} — ${d.deck}`}
                  fill
                  sizes="(min-width: 1024px) 400px, 100vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-ink">{g.tag}</p>
                <h3 className="mt-1 text-xl font-extrabold">{g.name}</h3>
                <ul className="mt-5 grid gap-3">
                  {row(g.key, "Pitch-Deck")}
                  {row(g.key, "Executive-Summary")}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan/40 bg-cyan/8 p-5">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-cyan text-[#06121f]">
              <Package size={22} />
            </span>
            <div>
              <p className="font-display text-lg font-extrabold">{d.all}</p>
              <p className="text-sm text-fg-muted">{d.allNote}</p>
            </div>
          </div>
          <a
            href="/downloads/HomeServices-Pitch-Pack.zip"
            download
            className="inline-flex items-center gap-2 rounded-xl bg-cyan px-5 py-3 text-sm font-bold text-[#06121f] hover:brightness-110"
          >
            <Download size={16} />
            ZIP
          </a>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="text-xl font-extrabold">{d.brand.title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{d.brand.sub}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {d.brand.files.map((f) => (
                <li key={f.file}>
                  <a
                    href={`/brand/${f.file}`}
                    download
                    className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-3.5 py-2 text-xs font-bold text-fg-muted hover:text-fg"
                  >
                    <Download size={13} />
                    {f.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="grid place-items-center rounded-2xl bg-[#f5f8fc] p-8">
              <Image src="/brand/homeservices-logo-horizontal-on-light.png" alt="HomeServices logo" width={320} height={50} unoptimized className="h-auto w-[260px]" />
            </div>
            <div className="grid place-items-center rounded-2xl bg-[#0b1b2e] p-8">
              <Image src="/brand/homeservices-logo-horizontal-on-dark.png" alt="HomeServices logo" width={320} height={50} unoptimized className="h-auto w-[260px]" />
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
