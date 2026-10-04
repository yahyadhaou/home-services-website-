"use client";

import { usePrefs } from "./PrefsProvider";
import { Heading, Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { Icon } from "./ui/Icon";

export function BusinessModel() {
  const { c } = usePrefs();
  const b = c.business;
  const m = b.market;

  return (
    <Section id="business">
      <Heading eyebrow={b.eyebrow} title={b.title} sub={b.lead} />

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <Reveal>
          <div className="h-full rounded-3xl border border-border bg-surface p-7 sm:p-8">
            <div className="flex h-16 overflow-hidden rounded-2xl text-sm font-extrabold">
              <div className="flex w-[88%] items-center bg-cyan px-5 text-[#06121f]">€88 · {b.split.provider}</div>
              <div className="grid w-[12%] min-w-[64px] place-items-center bg-fg text-bg">€12</div>
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium text-fg-faint">
              <span>{b.split.provider}</span>
              <span>{b.split.fee}</span>
            </div>
            <p className="mt-4 text-sm text-fg-muted">{b.split.caption}</p>
            <ul className="mt-6 grid gap-4">
              {b.points.map((p) => (
                <li key={p.t} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-cyan/12 text-cyan-ink">
                    <Icon name={p.icon} size={18} />
                  </span>
                  <div>
                    <p className="font-bold">{p.t}</p>
                    <p className="text-sm leading-relaxed text-fg-muted">{p.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="h-full rounded-3xl border border-border bg-surface p-7 sm:p-8">
            <h3 className="text-xl font-extrabold">{b.scale.title}</h3>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-border text-[0.7rem] uppercase tracking-wider text-cyan-ink">
                    {b.scale.cols.map((col, i) => (
                      <th key={col} className={`px-3 py-3 font-bold ${i === b.scale.cols.length - 1 ? "text-right" : ""}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.scale.rows.map((row) => (
                    <tr key={row[0]} className="border-b border-border last:border-0">
                      {row.map((cell, i) => (
                        <td key={i} className={`px-3 py-4 ${i === 0 ? "font-bold" : "text-fg-muted"} ${i === row.length - 1 ? "text-right font-extrabold text-fg" : ""}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-fg-faint">{b.scale.note}</p>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <div className="rounded-3xl border border-border bg-bg-soft p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <h3 className="text-2xl font-extrabold sm:text-3xl">{m.title}</h3>
              <p className="mt-4 leading-relaxed text-fg-muted">{m.lead}</p>
              <p className="mt-4 text-sm font-semibold">{m.insight}</p>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              {m.stats.map((s) => (
                <div key={s.l} className="rounded-2xl border border-border bg-surface p-5">
                  <dd className="font-display text-3xl font-extrabold text-cyan-ink sm:text-4xl">{s.v}</dd>
                  <dt className="mt-1 text-sm text-fg-muted">{s.l}</dt>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-fg-faint">{m.source}</p>
        </div>
      </Reveal>
    </Section>
  );
}
