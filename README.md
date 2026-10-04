# HomeServices Showcase

The public showroom website for the HomeServices platform: an interactive gallery of every real app screen, the story behind the product, the six pitch PDFs for download, and a contact form that delivers by e-mail through [Resend](https://resend.com).

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
| Contact | Validated form → `POST /api/contact` → Resend |

## Run it

```bash
npm install
cp .env.example .env.local   # add your Resend key
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Contact form and Resend

`src/app/api/contact/route.ts` validates the request (Zod), blocks bots with a honeypot field, applies a best-effort rate limit (5 messages per IP per 10 minutes), escapes all user input in the HTML e-mail, and sends through Resend with `replyTo` set to the visitor — so replying in your mail client answers them directly.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Required. Create it at resend.com → API Keys. Server-side only. |
| `CONTACT_TO_EMAIL` | Recipient. Defaults to `dhaou.yahya98@gmail.com`. |
| `CONTACT_FROM_EMAIL` | Sender. Defaults to `HomeServices Showcase <onboarding@resend.dev>`. |

**About the sender address:** without a verified domain, Resend only allows `onboarding@resend.dev` as the sender and only delivers to the e-mail address of your own Resend account — which is exactly what this site needs if you sign up to Resend with `dhaou.yahya98@gmail.com`. To send from your own domain, verify it in Resend and set `CONTACT_FROM_EMAIL`.

If the key is missing the API answers `503` and the form shows a friendly message pointing to the direct e-mail address.

## Deploy to Netlify

1. Push this folder to a Git repository and import it in Netlify (the included `netlify.toml` and Netlify's Next.js support do the rest).
2. In **Site configuration → Environment variables** add `RESEND_API_KEY` (and optionally the two others).
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
