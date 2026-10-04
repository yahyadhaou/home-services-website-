# HomeServices Showcase

The public showroom website for the HomeServices platform: an interactive gallery of every real app screen, the story behind the product, the six pitch PDFs for download, and a bilingual contact form that delivers by e-mail through Gmail.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4**. English and German, dark and light theme, responsive from phone to desktop.

## What is on the page

| Section | Content |
|---|---|
| Hero | Value proposition, four headline numbers, live phone previews |
| Platform | The three products and how they reinforce each other |
| **Showroom** | 67 real screenshots — client app (37), partner manager (14), coworker (4), admin dashboard (12) — with product tabs, topic filters, light/dark filter, keyboard navigation and a full-size lightbox |
| The apps | Features per product; manager / coworker / independent roles |
| Who it helps | The problem and the answer for clients, companies, coworkers, independents and the admin |
| Business | 12 % fee model, illustrative scale table (labelled as assumptions), ZDH market figures with source |
| Trust | Security and engineering facts, technology stack |
| Vision | AI roadmap (clearly labelled "not yet built") and release roadmap |
| Downloads | 3 pitch decks + 3 executive summaries, a ZIP of all six, and the logo kit |
| Contact | Validated form → `POST /api/contact` → Gmail: full details to the owner, confirmation to the visitor in their language |

## Run it

```bash
npm install
cp .env.example .env.local   # add the Gmail app password
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Contact form (Gmail)

`src/app/api/contact/route.ts` validates the request (Zod), blocks bots with a honeypot field, applies a best-effort rate limit (5 messages per IP per 10 minutes) and sends **two e-mails** through Gmail SMTP (nodemailer):

1. **To the owner** — every field (name, e-mail, company, interest, message, and the language the visitor chose), with `reply-to` set to the visitor so a normal reply answers them directly.
2. **To the visitor** — a confirmation in the language they were viewing the site in (English or German), signed by Yahya, with a link to the pitch documents. It never echoes the visitor's message text, so the form cannot be used to send arbitrary content to a third party's address.

If the owner's e-mail fails, the visitor sees an error. If only the confirmation fails, the message still counts as delivered.

| Variable | Purpose |
|---|---|
| `GMAIL_USER` | The Gmail account that sends and, by default, receives. |
| `GMAIL_APP_PASSWORD` | A Google **app password** (not the account password). Create one at myaccount.google.com/apppasswords — requires 2-step verification. Spaces are ignored. |
| `CONTACT_TO_EMAIL` | Optional. Deliver to another inbox. |
| `NEXT_PUBLIC_SITE_URL` | Optional. Public URL for the link in the confirmation (Netlify provides `URL` itself). |

Keep the real values in `.env.local` (git-ignored) and in Netlify's environment variables — never in the code. If you ever expose the app password, revoke it in your Google account and create a new one.

If the variables are missing the API answers `503` and the form shows a friendly message pointing to the direct e-mail address.

## Deploy to Netlify

1. Push this folder to a Git repository and import it in Netlify (the included `netlify.toml` and Netlify's Next.js support do the rest).
2. In **Site configuration → Environment variables** add `GMAIL_USER` and `GMAIL_APP_PASSWORD`.
3. Deploy. Test the form once with a real message.

## Updating content

- **Text** (both languages): `src/content/en.ts` and `src/content/de.ts`. The German file is type-checked against the English one, so a missing key is a compile error.
- **Screenshots and captions:** drop new images into `../pdf/<client|provider manager|coworker|admin>/`, add a caption entry in `src/data/screens.ts`, then run `npm run assets`. That script optimises images to WebP, copies the PDFs and logo into `public/`, builds the ZIP, and measures each screenshot's size and light/dark appearance.
- **PDFs:** regenerate them in `../presentation-kit`, copy into `../pdf/`, then `npm run assets`.

## Structure

```
src/
  app/            layout (fonts, theme + language from cookies), page, api/contact
  components/     Header, Hero, Platform, Showroom, Apps, Winners, BusinessModel,
                  TrustVision, Downloads, Contact, Footer, ui/
  content/        en.ts, de.ts, index.ts
  data/           screens.ts (captions), screen-facts.json (generated)
scripts/          prepare-assets.mjs
public/           shots/, covers/, downloads/, brand/   (generated, committed)
```

Language and theme are remembered in cookies, so the server renders the right version immediately with no flash.

## Notes

- Screenshots come from the running apps with demo data; the site says so in its footer.
- Payments in the apps are simulated (a payment provider is the first roadmap item) and the AI features are a roadmap — the site labels both honestly.
