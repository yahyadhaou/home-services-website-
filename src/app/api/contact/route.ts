import { Resend } from "resend";
import { z } from "zod";

// Contact form → e-mail through Resend. The API key stays on the server
// (RESEND_API_KEY); nothing secret ever reaches the browser.

const INTERESTS = ["pilot", "investor", "strategic", "demo", "other"] as const;

const INTEREST_LABEL: Record<(typeof INTERESTS)[number], string> = {
  pilot: "Pilot partner",
  investor: "Investor",
  strategic: "Strategic partner",
  demo: "Live demo request",
  other: "Other",
};

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  company: z.string().trim().max(120).optional().default(""),
  interest: z.enum(INTERESTS),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(500).optional().default(""),
});

// Best-effort limiter (per server instance): 5 messages per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const tooMany = (ip: string): boolean => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return false;
};

const clientIp = (req: Request): string =>
  req.headers.get("x-nf-client-connection-ip") ??
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  "unknown";

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Header values must never contain line breaks.
const oneLine = (s: string): string => s.replace(/[\r\n]+/g, " ").trim();

const json = (body: Record<string, unknown>, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ ok: false, error: "unavailable" }, 503);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, error: "invalid" }, 400);
  const data = parsed.data;

  // A filled honeypot is a bot: pretend success, send nothing.
  if (data.website) return json({ ok: true }, 200);

  if (tooMany(clientIp(request))) return json({ ok: false, error: "limited" }, 429);

  const to = process.env.CONTACT_TO_EMAIL || "dhaou.yahya98@gmail.com";
  // Without a verified domain, Resend only allows onboarding@resend.dev as the sender.
  const from = process.env.CONTACT_FROM_EMAIL || "HomeServices Showcase <onboarding@resend.dev>";

  const name = oneLine(data.name);
  const interest = INTEREST_LABEL[data.interest];
  const company = oneLine(data.company);

  const text = [
    `New message from the HomeServices showcase`,
    ``,
    `Name: ${name}`,
    `E-mail: ${data.email}`,
    company ? `Company: ${company}` : null,
    `Interested as: ${interest}`,
    ``,
    data.message,
  ]
    .filter((l): l is string => l !== null)
    .join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#0b1b2e;color:#fff;padding:18px 22px;border-radius:14px 14px 0 0">
      <strong style="font-size:16px">Home<span style="color:#5adbff">Services</span></strong>
      <div style="font-size:12px;color:#a9b9d0;margin-top:2px">New message from the showcase website</div>
    </div>
    <div style="background:#fff;padding:22px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 14px 14px">
      <table style="font-size:14px;line-height:1.6;border-collapse:collapse">
        <tr><td style="color:#64748b;padding-right:14px">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="color:#64748b;padding-right:14px">E-mail</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        ${company ? `<tr><td style="color:#64748b;padding-right:14px">Company</td><td>${escapeHtml(company)}</td></tr>` : ""}
        <tr><td style="color:#64748b;padding-right:14px">Interested as</td><td>${escapeHtml(interest)}</td></tr>
      </table>
      <hr style="border:0;border-top:1px solid #e2e8f0;margin:18px 0">
      <div style="font-size:14px;line-height:1.65;white-space:pre-wrap">${escapeHtml(data.message)}</div>
    </div>
    <p style="font-size:11px;color:#94a3b8;text-align:center;margin-top:14px">Reply to this e-mail to answer ${escapeHtml(name)} directly.</p>
  </div></body></html>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: oneLine(`[HomeServices] ${interest} — ${name}`).slice(0, 150),
      html,
      text,
    });
    if (error) {
      console.error("Resend rejected the message:", error.name, error.message);
      return json({ ok: false, error: "failed" }, 502);
    }
    return json({ ok: true }, 200);
  } catch (err) {
    console.error("Resend request failed:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "failed" }, 502);
  }
}
