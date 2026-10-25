# Byte Cat Studio

Free 2027 cat calendar website with on-site email collection. Static frontend on Vercel, Cloudflare Worker API, and a private Cloudflare D1 database. Node 20+ for building; Node 22+ for SQLite-backed integration tests (tested with Node 24). No package dependencies.

## Visitor flow

Pinterest → https://bytecatstudio.com → enter email → email and optional consent saved atomically → immediate ZIP download. No checkout or card is required. This flow does not send an automatic delivery email and does not verify ownership of the submitted email address.

Promotional consent starts unchecked. Every request records the consent wording version and timestamp. The latest submitted choice updates the subscriber preference. Send marketing only to records with marketing_opt_in = 1, and provide an unsubscribe method in every message.

## Development and deployment

Run `npm test`, `npm run build`, then `npm run dev` (port 3000). Vercel builds main with `npm run build` and serves `dist`. The build defaults to https://api.bytecatstudio.com. Set SIGNUP_API_URL to an empty string to disable signup, or to that exact HTTPS origin to enable it. GUMROAD_PRODUCT_URL is no longer used.

Worker source, D1 schema, and deployment configuration are in `worker/`. The deployed Worker is `bytecat-calendars`, bound as DB to `bytecat-subscribers`. Apply schema.sql before deployment. The Worker is separately deployed; a Vercel deployment does not update it. Dashboard Edit code or Wrangler with an authorized Cloudflare login can deploy worker.mjs.

The API accepts only the production website origins, bounds request size, checks a honeypot, rate-limits using hourly salted IP hashes, and uses parameterized SQL. It returns a download token only after the email, consent record, and token transaction succeeds. Tokens expire after 30 minutes. No subscriber list is exposed by the API.

## Viewing and managing emails

Open Cloudflare → Storage & databases → D1 → bytecat-subscribers → Explore Data or Console.
Database: https://dash.cloudflare.com/aac736894e8a84d4a6f8dcb8aee613cc/workers/d1/databases/4892765d-3800-4daf-bb9d-449fe8ee4f81/studio

All download requests:
```sql
SELECT email, marketing_opt_in, datetime(created_at,'unixepoch') AS requested_utc
FROM subscribers ORDER BY created_at DESC;
```

Only promotional opt-ins:
```sql
SELECT email FROM subscribers WHERE marketing_opt_in = 1;
```

Handle unsubscribe requests sent to bytecatglobal@gmail.com promptly. Update the specified subscriber to marketing_opt_in = 0 and retain a dated consent event; never import calendar-only addresses into marketing campaigns. Before any future campaign, use the current opted-in list and exclude the launch test address.

## Files and privacy

The customer ZIP contains one PDF and 12 monthly PNGs. It is outside dist, and the API streams the prepared ZIP from a pinned GitHub commit. The GitHub repository and ZIP were already public: this form gates the normal website experience, not every possible direct link. Use private object storage if stronger file access control is needed later.

public/logo.png is the original supplied logo, unchanged. Calendar previews remain watermarked. Privacy copy describes Cloudflare, Vercel, GitHub file delivery, Google Fonts, consent, and contact requests. No advertising trackers or analytics scripts are added.

## Other launch channels

Gumroad draft: https://gumroad.com/products/euasbb/edit — $0 minimum and suggested price, listing copy, cover, and customer ZIP saved. Gumroad still requires owner payout setup before publication; the website does not depend on it.

Pinterest board: https://www.pinterest.com/bytecatglobal/free-printable-calendars/
See launch files for copy and verified launch status.

Cloudflare apex/www Vercel records preserve unrelated mail DNS. www redirects to the apex; api.bytecatstudio.com is a separate Worker custom domain.
