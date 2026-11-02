# GEO waitlist

Waitlist landing page for the hosted GEO / AI search visibility product built on the
open-source [Headless GEO plugin](https://github.com/echoatgrs/geo-plugin).
Next.js 16, English / Russian / Chinese, sign-ups go to a Google Sheet.
Dot-matrix look (Doto, Geist, Geist Mono via `next/font`), animations respect `prefers-reduced-motion`.

```sh
npm install
npm run dev      # http://localhost:3000 -> redirects to /en, /ru or /zh
```

| What | Where |
| --- | --- |
| Product name, domain, GitHub link (placeholders) | `site.config.ts` |
| Layout, styles, motion | `app/[lang]/page.tsx`, `app/[lang]/globals.css`, `LiveConsole.tsx` (streaming log), `Reveal.tsx` (starts animations on scroll) |
| Example data in the illustrations | `app/[lang]/demo.ts` (not real traffic) |
| Page copy | `i18n/en.ts`, `i18n/ru.ts`, `i18n/zh.ts` (ru and zh are typed against en, so a missing string fails the build) |
| Language redirect for `/` (Accept-Language, default English) | `proxy.ts` |
| Sign-up endpoint | `app/api/waitlist/route.ts` |
| Google Sheets receiver | `google-sheets/Code.gs` |

The form posts to `/api/waitlist`, which validates the email, drops honeypot submissions and forwards
`{ email, site, cms, role, lang, source, createdAt }` as JSON to `WAITLIST_WEBHOOK_URL`.
Without that variable, `next dev` appends to `.data/waitlist.jsonl` and production answers 503.

## Google Sheets

1. Create a Google Sheet (for example "GEO waitlist").
2. **Extensions → Apps Script**. Replace the contents of `Code.gs` with `google-sheets/Code.gs` from this repo. Save.
3. **Project Settings (gear) → Script Properties → Add**: `SECRET` = a long random string
   (`openssl rand -hex 24`).
4. **Deploy → New deployment → type: Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and
   authorize. Copy the Web app URL (ends in `/exec`).
5. Set `WAITLIST_WEBHOOK_URL` to that URL plus `?key=<SECRET>`:
   `https://script.google.com/macros/s/AKfy.../exec?key=3f9c...`

The script creates a `Waitlist` tab with a header row on the first sign-up, skips duplicate emails, and stores
values starting with `= + - @` as text so nobody can inject spreadsheet formulas.
If you edit the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

Test it from your machine:

```sh
curl -L -X POST "$WAITLIST_WEBHOOK_URL" -H 'content-type: application/json' \
  -d '{"email":"test@example.com","lang":"en","source":"curl"}'
# {"ok":true}
```

## Deploy

Any Node host that runs Next.js works. On Vercel: import the repo, add `WAITLIST_WEBHOOK_URL` under
Environment Variables, deploy. Then set `url` in `site.config.ts` to the real domain (used for canonical and
hreflang links).
