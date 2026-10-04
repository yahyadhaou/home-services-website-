import nodemailer from "nodemailer";
import { z } from "zod";
import { oneLine, ownerMail, visitorMail, type ContactRequest } from "@/lib/contact-mail";

// Contact form → Gmail (SMTP with an app password).
//  1. the owner receives every detail, with reply-to set to the visitor;
//  2. the visitor receives a confirmation in the language they chose.
// Credentials live in environment variables on the server only.

const INTERESTS = ["pilot", "investor", "strategic", "demo", "other"] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  company: z.string().trim().max(120).optional().default(""),
  interest: z.enum(INTERESTS),
  message: z.string().trim().min(10).max(4000),
  lang: z.enum(["en", "de"]).default("en"),
  consent: z.literal(true),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(500).optional().default(""),
});

// Best-effort limiter (per server instance): 5 messages per IP per 10 minutes.
// It also limits how often the confirmation e-mail can be triggered.
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

const json = (body: Record<string, unknown>, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
  const user = process.env.GMAIL_USER;
  // Google shows app passwords in groups of four; the spaces are not part of it.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return json({ ok: false, error: "unavailable" }, 503);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, error: "invalid" }, 400);
  const { website, consent: _consent, ...rest } = parsed.data;
  void _consent;

  // A filled honeypot is a bot: pretend success, send nothing.
  if (website) return json({ ok: true }, 200);

  if (tooMany(clientIp(request))) return json({ ok: false, error: "limited" }, 429);

  const data: ContactRequest = { ...rest, name: oneLine(rest.name), company: oneLine(rest.company) };
  const to = process.env.CONTACT_TO_EMAIL || user;
  const siteUrl = process.env.URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? null;
  const from = `Yahya Dhaou | HomeServices <${user}>`;

  const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });

  try {
    // The owner's copy is the one that matters: if it fails, report failure.
    const owner = ownerMail(data);
    await transport.sendMail({
      from,
      to,
      replyTo: { name: data.name, address: data.email },
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
    });
  } catch (err) {
    console.error("Contact mail to owner failed:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "failed" }, 502);
  }

  // The confirmation is a courtesy: a failure here must not hide that the message arrived.
  try {
    const visitor = visitorMail(data, siteUrl);
    await transport.sendMail({
      from,
      to: { name: data.name, address: data.email },
      replyTo: to,
      subject: visitor.subject,
      html: visitor.html,
      text: visitor.text,
    });
  } catch (err) {
    console.error("Confirmation mail to visitor failed:", err instanceof Error ? err.message : err);
  }

  return json({ ok: true }, 200);
}
