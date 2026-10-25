# Byte Cat Studio — start here next time

Updated: 26 October 2026. This is the current handover. It supersedes dated status claims in `launch/brand-email-upgrade.md`, `launch/launch-status.md`, and earlier chat summaries.

## Owner's latest direction

**Byte Cat Studio is a broad creative brand, NOT restricted to cat-inspired products.** Cats are the mascot and first calendar collection, but later products can cover many themes and categories. The owner explicitly corrected cat-only positioning while preparing Buy Me a Coffee. Keep the name and “Little things. Brighter days.”, but describe the brand as illustrations, printables, and digital goods. Do not assume future products must feature cats.

The studio will offer multiple freebies and paid products. Keep the brand homepage, freebies library, individual collection landing pages, and future shop separate. Support/tips must be optional and must not gate free downloads. Promotional email signup remains a separate unchecked choice.

## What is live

| Item | Status / URL |
|---|---|
| Brand homepage | https://bytecatstudio.com/ |
| Freebies library | https://bytecatstudio.com/freebies/ |
| Free 2027 calendars | https://bytecatstudio.com/freebies/2027-cat-calendar/ |
| Contact | https://bytecatstudio.com/contact/ — hello@bytecatstudio.com |
| Privacy | https://bytecatstudio.com/privacy.html — includes optional Analytics |
| Terms | https://bytecatstudio.com/terms.html — free digital delivery and personal/household calendar use |
| Pinterest | https://www.pinterest.com/bytecatglobal/ — 20 published Pins |
| Source repository | https://github.com/bytecatglobal/bytecatwebsite |

The original logo is installed. Site design uses cream, sage, orange, dark borders, and hard shadows. Mobile layouts, previews for all 12 months, contact page, and consent banner have been checked at 390px without horizontal overflow.

The site includes unique titles/descriptions/canonicals, Open Graph/Twitter previews, favicon, structured data, robots.txt, and sitemap.xml. Google Search Console accepted the sitemap. No ranking or AI-answer inclusion guarantee is implied.

Old homepage campaign links using #get, #collection, #details, or #updates redirect to the calendar landing page and preserve queries. Retain this compatibility.

## Email collection and delivery — live and tested

Flow: Pinterest / website → calendar form → Resend confirmation email → visitor explicitly confirms on API page → ZIP download.

- Sender: **Byte Cat Studio <notifications@mail.bytecatstudio.com>**.
- Reply-to and public support: **hello@bytecatstudio.com**.
- Sender was changed from calendars@mail.bytecatstudio.com at the owner's request, so it fits future products.
- Confirmation email links last 24 hours. ZIP download links last 30 minutes after confirmation.
- Expired confirmation/download screens now include a prominent **Request a fresh email** button to the calendar form. An already-used email link does not automatically renew an expired download: request a fresh email.
- Opening a confirmation link (GET) does not confirm marketing or issue the download. Explicit confirmation POST records verification and consent atomically.
- Marketing checkbox is optional and unchecked. Latest confirmed preference is stored separately. Never market to all download recipients automatically.
- Real test mail reached Gmail; explicit confirmation unlocked a valid ZIP. Database verification showed verified=1, marketing_opt_in=0, and one verified consent event. New notifications sender and hello reply-to were also inspected in Gmail headers.
- Approved test recipient: recorded in the private local handover. Do not expose subscriber lists or use unrelated email addresses for tests.
- Limits: 10 requests/IP/hour, 3 emails/recipient/hour, 90 email attempts/day. If demand grows, review provider limits and abuse protections before changing these.
- ZIP has one PDF and 12 PNGs. Verified SHA-256: BCDC473A027C06CDBA66C78D0E8500CDE4094F987003B2CCD5771C59265AABF9.
- Original ZIP is in public GitHub. This is an email-request delivery flow, not private-file DRM. Future paid products need appropriate private storage and purchase entitlements; do not reuse the public ZIP approach for protected sales.

## Infrastructure and accounts

Use the owner-specified Byte Cat Chrome profile (recorded in the private local handover). Browser tab IDs are temporary; discover current tabs instead of assuming old IDs still exist.

- Vercel project: bytecatwebsite, the studio account; connected to GitHub main. Build `npm run build`, output `dist`.
- Vercel production variable: `EMAIL_DELIVERY=verified_email`.
- Cloudflare account: use the studio account; account identifiers are in the private local handover.
- Worker: bytecat-calendars, custom domain https://api.bytecatstudio.com. Latest email/recovery deployment observed: 802f85d7.
- Worker variable: `DELIVERY_MODE=verified_email`; encrypted secret: `RESEND_API_KEY`. **Never put the secret in source, frontend, or handover files.**
- D1: bytecat-subscribers, binding DB. Schema is in worker/schema.sql.
- Resend domain: mail.bytecatstudio.com, verified, Tokyo region; sending-only key scoped to that domain is installed.
- Root email MX points to Zoho: mx.zoho.com, mx2.zoho.com, mx3.zoho.com. Owner confirmed they already have branded mail. Gmail has a hello@bytecatstudio.com label and prior Zoho setup messages. New inbound delivery to hello was not independently tested by the assistant.
- **Cloudflare Email Routing is NOT enabled. Nothing needs deleting.** Preserve Zoho MX/SPF/DKIM, Resend child records, DMARC, Google verification, and website records.
- Resend child records: resend._domainkey.mail TXT; rsend.mail and send.mail CNAMEs. Keep them for outbound email delivery.
- Root/www Vercel DNS and API Worker custom domain are configured. www redirects to apex.

## Google Analytics — live and tested

- GA4 account/property/web-stream identifiers are recorded in the private local handover.
- Measurement ID **G-2BG0D8CY1C** (public configuration, not a secret).
- Malaysia reporting time zone, MYR currency. Objectives: Generate leads and Drive sales. Optional account data sharing left off.
- Enhanced measurement off. Site sends page views plus `freebie_request` after a successful request response, only with Analytics consent. This event is NOT email verification or a completed download/purchase.
- Realtime showed one active test visitor, two page_view events, and one freebie_request event.
- Google script absent before consent and after rejection; present after allowance. Withdrawal via Cookie settings was checked live and removed the loaded tag after reload.
- Consent stored for 180 days; Analytics cookie lifetime configured to 180 days. Google signals and advertising personalization disabled.
- URLs discard arbitrary query parameters; known Pinterest campaign values are allowlisted; referrer retains origin only. No email, marketing preference, or secret tokens are sent as custom parameters.
- All nine tests passed, including consent rejection, withdrawal, expiry, URL sanitization, and existing delivery tests.
- Future paid sales require real checkout/purchase integration. No purchase tracking exists yet. `freebie_request` was not separately configured as a GA key event.
- Potential later refinement: owner manually used `utm_source=Pinterest` on at least January; current allowlist recognizes lowercase `pinterest`. Campaign attribution can be normalized case-insensitively in a future focused update. Links still work regardless.

## Pinterest — link migration complete per owner

- All 20 Pins are published.
- Assistant verified 13 direct link updates, then observed January pointing directly to the calendar page (14 total).
- Owner manually updated February, March, April, May, June, and July and said **“ok done all.”** Treat link work as complete based on owner confirmation; do not keep reporting seven or six links as pending.
- Pinterest previously returned generic save errors during repeated edits. A temporary limit was plausible but never confirmed. Do not delete/recreate Pins or repeatedly hammer Save.
- Recommended general direct destination: https://bytecatstudio.com/freebies/2027-cat-calendar/#get . Preserve useful campaign tracking where practical.
- Profile last observed as “Byte Cat”; its older bio remained focused on cat-inspired products/free calendars. A broader profile/board copy set was suggested in chat but **not confirmed applied**. Update to the latest broad brand direction below if requested.

### Suggested broad brand copy — draft, not confirmed published

Profile name: **Byte Cat Studio | Printables & Digital Goods**

Bio: **Illustrations, printables, and digital goods for brighter everyday moments. Explore useful little tools, playful designs, and fresh ideas for planning, creating, and making things your own. Little things. Brighter days.**

Website: https://bytecatstudio.com/

Cover: **Little things. Brighter days. / Illustrations, printables & digital goods.**

Freebies board: **Free Printables | Byte Cat Studio**

Freebies description: **Free printables and digital goodies from Byte Cat Studio. Discover little gifts for your plans, projects, and everyday spaces. Explore the growing collection at bytecatstudio.com/freebies/.**

Calendar board: **2027 Cat Calendars | Free Printables**. Keep this collection-specific; the calendar artwork does feature cats.

Future shop board: **Digital Shop | Byte Cat Studio**. Create when products exist; do not imply an empty shop is live.

## Buy Me a Coffee — newly added, draft setup

- Owner shared https://buymeacoffee.com/complete-your-page . Signed-in setup form is available.
- Filled Name **Byte Cat Studio**, website **https://bytecatstudio.com/**, and the broad About copy below. Owner explicitly corrected “not just cat inspired.”
- **Next was not clicked; page not confirmed published.** Profile image upload and any remaining setup are unfinished. No payout setup or financial agreement was completed. No public creator URL has been recorded yet. Keep the setup tab as a handoff if available; draft fields may not persist if it closes.
- Use as optional “Support the studio” link on the site/footer or after a free download. Do not replace or gate the free calendar flow.

Draft About:

> Little things. Brighter days.
>
> Byte Cat Studio is an independent creative studio making illustrations, printables, and digital goods for everyday life. From useful little tools to playful designs, we are building a growing collection of things to enjoy, use, and share.
>
> If you enjoy our work, you can support the studio here. Your support helps us make time for new ideas, original artwork, and future freebies. Support is completely optional—our free downloads stay free.
>
> Explore our latest creations at bytecatstudio.com. Thank you for being part of the studio.

## Gumroad and future shop

- Gumroad $0 calendar draft prepared with listing copy, artwork, and ZIP; not published because payout setup required owner action. Website downloads do not depend on Gumroad.
- Do not claim payouts are configured or a Gumroad/Buy Me a Coffee product is live without checking.
- Future /shop/ page is planned, not built. No paid checkout, payment collection, memberships, or purchase notifications are implemented.
- Existing website copy still describes the first collection as cat-inspired. A future broad-brand wording pass should update homepage/bio/SEO descriptions while retaining accurate cat-calendar descriptions. This has NOT yet been done.

## Local workspace and safe resume

Workspace: see the private local BYTE-CAT-START-HERE.md beside the repository.

Repository folder: `bytecatwebsite`

Original logo folder: `bytecat logo`; installed website asset: `bytecatwebsite/public/logo.png`.

Main files:

- scripts/pages.mjs: generated brand/freebies/calendar/contact/privacy/terms pages, SEO and favicon.
- public/index.html: source calendar template, transformed by the generator. public/privacy.html is an older source file; generated privacy comes from pages.mjs and is authoritative.
- public/brand.css and public/style.css: design.
- public/app.js: signup interactions; public/analytics.js: consent-gated GA4.
- worker/worker.mjs and worker/schema.sql: delivery backend and database.
- launch/Byte-Cat-Studio-Free-Calendars-2027.zip: customer bundle.
- test/*.test.mjs: nine tests at last verification.

Commands, run inside bytecatwebsite:

```powershell
npm test
$env:EMAIL_DELIVERY='verified_email'
npm run build
npm run dev
```

Static build supports Node 20+; SQLite integration tests need Node 22+ (tested on Node 24). No external package dependencies.

**Git caution:** source was published through the authenticated GitHub Chrome UI because local CLI authentication is a different GitHub account. Local HEAD is behind remote and the worktree shows many modified/untracked files that represent our published work. Do not reset, clean, overwrite, or assume those are disposable. Fetch/read/compare with origin/main before reconciling. Do not switch unrelated CLI accounts or extract browser credentials. A broad reset was previously rejected; no reset was performed.

`source-review.mjs` in the workspace is a temporary localhost:3002 read-only source transfer helper with an explicit file allowlist; never serve secrets. Stop its process when finished. It is not part of production.

## Next session priorities

1. Read this file first and respect the latest broad creative-brand direction.
2. Finish Buy Me a Coffee profile image/setup; record the actual public page URL, then add an optional support link if requested. Owner handles financial setup and any required agreement acceptance.
3. Apply broad brand positioning to profile/homepage/SEO when requested; keep calendar landing copy specific.
4. Confirm hello mailbox delivery if needed; leave Zoho and Resend DNS intact.
5. Build additional freebie collections and a real shop only once products/assets/checkout provider are selected. Extend the current calendar-specific database/delivery design to explicit product IDs and entitlements before adding multiple products.
6. Pinterest direct link updates are already owner-confirmed complete. Do not reopen as pending unless a fresh audit finds a specific broken link.

Never include API keys, private subscriber exports, payment details, or credentials in progress documents or GitHub.
