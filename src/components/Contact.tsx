"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert, Loader2, Mail, Send } from "lucide-react";
import { usePrefs } from "./PrefsProvider";
import { Section } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { CONTACT_EMAIL } from "@/content";

type Status = "idle" | "sending" | "ok" | "error";
type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

const field =
  "w-full rounded-xl border border-border-strong bg-bg-soft px-4 py-3 text-[0.95rem] text-fg placeholder:text-fg-faint outline-none transition focus:border-cyan-ink focus:ring-2 focus:ring-cyan-ink/25 aria-[invalid=true]:border-[#ff6b5b]";

export function Contact() {
  const { c, locale } = usePrefs();
  const t = c.contact;
  const f = t.form;

  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      interest: String(fd.get("interest") ?? "pilot"),
      message: String(fd.get("message") ?? "").trim(),
      lang: locale,
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
    };

    const next: Errors = {};
    if (body.name.length < 2) next.name = f.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) next.email = f.emailInvalid;
    if (body.message.length < 10) next.message = f.tooShort;
    if (!body.consent) next.consent = f.required;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("error");
      setFeedback(f.invalid);
      return;
    }

    setStatus("sending");
    setFeedback("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("ok");
        setFeedback(f.ok);
        form.reset();
        return;
      }
      setStatus("error");
      setFeedback(res.status === 429 ? f.limited : res.status === 503 ? f.unavailable : res.status === 400 ? f.invalid : f.fail);
    } catch {
      setStatus("error");
      setFeedback(f.fail);
    }
  };

  const err = (k: keyof Errors) => (errors[k] ? <p className="mt-1.5 text-xs font-semibold text-[#ff6b5b]">{errors[k]}</p> : null);

  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-cyan-ink">
            <span className="h-[3px] w-7 rounded-full bg-cyan-ink" />
            {t.eyebrow}
          </p>
          <h2 className="text-balance text-3xl font-extrabold leading-[1.08] sm:text-5xl">{t.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">{t.sub}</p>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fg-faint">{t.direct}</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 inline-flex items-center gap-2.5 text-lg font-bold text-cyan-ink hover:underline">
              <Mail size={20} />
              {CONTACT_EMAIL}
            </a>
            <p className="mt-1 text-sm text-fg-muted">{t.person}</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-border bg-surface p-6 sm:p-8" aria-busy={status === "sending"}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-bold">{f.name}</label>
                <input id="name" name="name" autoComplete="name" maxLength={100} required aria-invalid={!!errors.name} className={field} />
                {err("name")}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-bold">{f.email}</label>
                <input id="email" name="email" type="email" autoComplete="email" maxLength={200} required aria-invalid={!!errors.email} className={field} />
                {err("email")}
              </div>
              <div>
                <label htmlFor="company" className="mb-1.5 block text-sm font-bold">{f.company}</label>
                <input id="company" name="company" autoComplete="organization" maxLength={120} className={field} />
              </div>
              <div>
                <label htmlFor="interest" className="mb-1.5 block text-sm font-bold">{f.interest}</label>
                <select id="interest" name="interest" defaultValue="pilot" className={field}>
                  {t.interests.map((o) => (
                    <option key={o.v} value={o.v}>
                      {o.l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="mb-1.5 block text-sm font-bold">{f.message}</label>
              <textarea id="message" name="message" rows={6} maxLength={4000} placeholder={f.messagePh} required aria-invalid={!!errors.message} className={`${field} resize-y`} />
              {err("message")}
            </div>

            {/* Honeypot — hidden from people and assistive tech */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="mt-5">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-fg-muted">
                <input type="checkbox" name="consent" aria-invalid={!!errors.consent} className="mt-1 size-4 shrink-0 accent-[var(--cyan)]" />
                <span>{f.consent}</span>
              </label>
              {err("consent")}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan px-6 py-3.5 text-sm font-bold text-[#06121f] transition hover:brightness-110 disabled:opacity-70"
              >
                {status === "sending" ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
                {status === "sending" ? f.sending : f.send}
              </button>
              <p role="status" aria-live="polite" className="min-h-6 text-sm font-semibold">
                {status === "ok" ? (
                  <span className="inline-flex items-center gap-2 text-[#2dd4a0]">
                    <CheckCircle2 size={17} /> {feedback}
                  </span>
                ) : null}
                {status === "error" ? (
                  <span className="inline-flex items-center gap-2 text-[#ff6b5b]">
                    <CircleAlert size={17} /> {feedback}
                  </span>
                ) : null}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
