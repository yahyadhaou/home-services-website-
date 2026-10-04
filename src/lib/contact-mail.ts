// E-mail templates for the contact form: one message to the owner with every
// detail, and a confirmation to the visitor in the language they chose.

export type Lang = "en" | "de";
export type Interest = "pilot" | "investor" | "strategic" | "demo" | "other";

export type ContactRequest = {
  name: string;
  email: string;
  company: string;
  interest: Interest;
  message: string;
  lang: Lang;
};

const INTEREST: Record<Lang, Record<Interest, string>> = {
  en: {
    pilot: "Pilot partner",
    investor: "Investor",
    strategic: "Strategic partner",
    demo: "Live demo request",
    other: "Other",
  },
  de: {
    pilot: "Pilotpartner",
    investor: "Investor",
    strategic: "Strategischer Partner",
    demo: "Live-Demo-Anfrage",
    other: "Sonstiges",
  },
};

export const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Header values must never contain line breaks. */
export const oneLine = (s: string): string => s.replace(/[\r\n]+/g, " ").trim();

const shell = (inner: string, footer: string) => `<!doctype html><html><body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <div style="max-width:580px;margin:0 auto;padding:24px">
    <div style="background:#0b1b2e;color:#fff;padding:20px 24px;border-radius:14px 14px 0 0">
      <strong style="font-size:18px">Home<span style="color:#5adbff">Services</span></strong>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 14px 14px;font-size:15px;line-height:1.65">
      ${inner}
    </div>
    <p style="font-size:11px;color:#94a3b8;text-align:center;margin-top:14px">${footer}</p>
  </div></body></html>`;

/** The message Yahya receives: every field, readable at a glance. */
export function ownerMail(r: ContactRequest) {
  const interest = INTEREST.en[r.interest];
  const langName = r.lang === "de" ? "Deutsch (DE)" : "English (EN)";
  const row = (k: string, v: string) =>
    `<tr><td style="color:#64748b;padding:3px 16px 3px 0;vertical-align:top">${k}</td><td>${v}</td></tr>`;

  const html = shell(
    `<p style="margin:0 0 14px"><strong>New message from the showcase website</strong></p>
     <table style="font-size:14px;border-collapse:collapse">
       ${row("Name", `<strong>${escapeHtml(r.name)}</strong>`)}
       ${row("E-mail", `<a href="mailto:${escapeHtml(r.email)}">${escapeHtml(r.email)}</a>`)}
       ${r.company ? row("Company", escapeHtml(r.company)) : ""}
       ${row("Interested as", escapeHtml(interest))}
       ${row("Visitor language", escapeHtml(langName))}
     </table>
     <hr style="border:0;border-top:1px solid #e2e8f0;margin:18px 0">
     <div style="white-space:pre-wrap">${escapeHtml(r.message)}</div>`,
    `Reply to this e-mail to answer ${escapeHtml(r.name)} directly. A confirmation was sent to the visitor in ${r.lang === "de" ? "German" : "English"}.`,
  );

  const text = [
    "New message from the showcase website",
    "",
    `Name: ${r.name}`,
    `E-mail: ${r.email}`,
    r.company ? `Company: ${r.company}` : null,
    `Interested as: ${interest}`,
    `Visitor language: ${langName}`,
    "",
    r.message,
  ]
    .filter((l): l is string => l !== null)
    .join("\n");

  return {
    subject: oneLine(`[HomeServices] ${interest} — ${r.name} (${r.lang.toUpperCase()})`).slice(0, 150),
    html,
    text,
  };
}

const COPY = {
  en: {
    subject: "Thank you for contacting HomeServices",
    hello: (n: string) => `Hello ${n},`,
    body: (i: string) =>
      `thank you for your message about <strong>${i}</strong>. I read every message personally and will get back to you soon.`,
    bodyText: (i: string) => `thank you for your message about "${i}". I read every message personally and will get back to you soon.`,
    meanwhile: "In the meantime you can look at the pitch documents:",
    demo: "A live, click-through demo of the working product is available on request — just reply to this e-mail.",
    sign: "Kind regards",
    role: "Founder, HomeServices",
    auto: "This is an automatic confirmation. You can simply reply to this e-mail.",
    docs: "Pitch documents and showroom",
  },
  de: {
    subject: "Vielen Dank für Ihre Nachricht an HomeServices",
    hello: (n: string) => `Guten Tag ${n},`,
    body: (i: string) =>
      `vielen Dank für Ihre Nachricht zum Thema <strong>${i}</strong>. Ich lese jede Nachricht persönlich und melde mich bald bei Ihnen.`,
    bodyText: (i: string) => `vielen Dank für Ihre Nachricht zum Thema „${i}“. Ich lese jede Nachricht persönlich und melde mich bald bei Ihnen.`,
    meanwhile: "Bis dahin können Sie sich die Pitch-Dokumente ansehen:",
    demo: "Eine Live-Demo des funktionierenden Produkts gibt es auf Anfrage — antworten Sie einfach auf diese E-Mail.",
    sign: "Freundliche Grüße",
    role: "Gründer, HomeServices",
    auto: "Dies ist eine automatische Bestätigung. Sie können einfach auf diese E-Mail antworten.",
    docs: "Pitch-Dokumente und Showroom",
  },
} as const;

/** The confirmation the visitor receives, in their language. Deliberately does not echo their message text. */
export function visitorMail(r: ContactRequest, siteUrl: string | null) {
  const c = COPY[r.lang];
  const interest = INTEREST[r.lang][r.interest];
  const firstName = oneLine(r.name).split(" ")[0].slice(0, 40);
  const link = siteUrl ? `${siteUrl.replace(/\/$/, "")}/#downloads` : null;

  const html = shell(
    `<p style="margin:0 0 12px">${c.hello(escapeHtml(firstName))}</p>
     <p style="margin:0 0 12px">${c.body(escapeHtml(interest))}</p>
     ${link ? `<p style="margin:0 0 12px">${c.meanwhile}<br><a href="${escapeHtml(link)}" style="color:#0a7ea4;font-weight:bold">${c.docs} →</a></p>` : ""}
     <p style="margin:0 0 18px">${c.demo}</p>
     <p style="margin:0">${c.sign},<br><strong>Yahya Dhaou</strong><br><span style="color:#64748b">${c.role}</span></p>`,
    c.auto,
  );

  const text = [
    c.hello(firstName),
    "",
    c.bodyText(interest),
    link ? `\n${c.meanwhile}\n${link}` : "",
    "",
    c.demo,
    "",
    `${c.sign},`,
    "Yahya Dhaou",
    c.role,
  ].join("\n");

  return { subject: c.subject, html, text };
}
