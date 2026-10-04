import { Reveal } from "./Reveal";

export function Section({
  id,
  children,
  className = "",
  tone = "base",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "base" | "soft";
}) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${tone === "soft" ? "bg-bg-soft" : ""} ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function Heading({
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className={`mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-cyan-ink ${center ? "justify-center" : ""}`}>
        <span className="h-[3px] w-7 rounded-full bg-cyan-ink" />
        {eyebrow}
      </p>
      <h2 className="text-balance text-3xl font-extrabold leading-[1.08] sm:text-5xl">{title}</h2>
      {sub ? <p className="mt-5 text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">{sub}</p> : null}
    </Reveal>
  );
}
