# Brand, search and email upgrade — 26 October 2026

## Latest activation update — 26 October 2026

- GA4 account 413390877 / property 560670675 created for Byte Cat Studio; website stream 16202357826, measurement ID G-2BG0D8CY1C. Malaysia reporting timezone, MYR currency, objectives Generate leads and Drive sales. Enhanced measurement is off; no automatic form tracking.
- GA4 Realtime verified: one active user, two page_view events (brand homepage and calendar page), and one freebie_request event from the approved test. Analytics is receiving live data.
- Website Analytics loads only after visitor consent. Reject/accept behavior checked live: Google tag count 0 before consent, 0 after reject, 1 after allow. Footer Cookie settings supports withdrawal. Consent choice and Analytics cookies expire after 180 days. Google signals and advertising personalization are disabled.
- Page-view URLs discard arbitrary query values; known Pinterest campaign values are allowlisted. Referrers retain only their origin. The freebie_request event sends only the fixed freebie ID, never an email, marketing choice, confirmation token, or download token. This counts a successful email request, NOT a verified address or completed download.
- Updated privacy notice describes optional Analytics. All nine automated tests passed, including consent rejection, withdrawal, expiry, and sensitive URL filtering. A live approved test request succeeded. GA home showed one active visitor from Malaysia during setup.
- The owner completed the Analytics agreement screen in the browser; the assistant did not click agreement acceptance. New-property reports can take time to populate. Future sales require checkout/purchase event integration when a shop is actually added; no purchase tracking is claimed now.

- Subsequent Pinterest retry: August and October direct links saved and verified. Total now 13/20. June, March, April, February, July, May, and January still retained the original working redirect links after attempts. January's final save explicitly displayed “Sorry! There was an error editing your Pin.” No Pins were deleted or republished.

- Resend is now ACTIVE. Owner approved creation of the sending-only key for mail.bytecatstudio.com. It is stored as encrypted RESEND_API_KEY in the Worker, never in source.
- Worker DELIVERY_MODE and Vercel EMAIL_DELIVERY are both verified_email. Production redeployed successfully.
- Real test to the owner-approved launch-test address arrived in Gmail Inbox. Email link opened the confirmation page; explicit confirmation unlocked the ZIP. D1 verified=1, marketing_opt_in=0, and exactly one verified consent record.
- The delivered ZIP SHA-256 matches the original: BCDC473A027C06CDBA66C78D0E8500CDE4094F987003B2CCD5771C59265AABF9.
- Updated privacy notice, new terms of use, and a contact page are live at /privacy.html, /terms.html, and /contact/. Footer and download form link to the policies. Terms permit personal/household use and ask visitors to share the landing-page link instead of redistributing files.
- Contact button now opens a page with a Gmail compose option, email-app link, and visible address. Public contact remains bytecatglobal@gmail.com until hello@bytecatstudio.com receives a verified test. Existing root Zoho MX remains unchanged. Gmail shows prior Zoho setup and a hello-address label; this alone is not current delivery proof.
- Retried all 12 remaining Pinterest edits: print-at-home, September, and November saved and were verified. Total direct links updated: 11/20. August, June, March, April, February, October, July, May, and January still retained old links after Pinterest editing failures. Existing homepage redirect preserves all those links and campaign parameters.
- Six automated tests passed after the policy/contact change. Live policy, terms, and contact routes return HTTP 200.
- Gumroad remains a separate unpublished draft pending owner payout setup; the website download does not depend on Gumroad.

The sections below preserve the earlier preparation record and are superseded by the activation update above.

## Earlier live verification

- Brand homepage: https://bytecatstudio.com/
- Freebies library: https://bytecatstudio.com/freebies/
- Calendar landing page: https://bytecatstudio.com/freebies/2027-cat-calendar/
- Old homepage #get campaign links redirect to the calendar page, retaining UTM parameters. Tested in the browser.
- Live signup still saves email and returns the download link. Promotional opt-in remains optional.
- Mobile homepage, library and calendar page checked at 390px without horizontal overflow.
- Canonical titles/descriptions, Open Graph and Twitter previews, original-logo favicon, semantic content, structured data, robots.txt and sitemap.xml are live.
- Google Search Console accepted https://bytecatstudio.com/sitemap.xml successfully. Indexing/rankings are not guaranteed.
- Six automated build/backend tests pass. GitHub source matches tested local files.
- Pinterest profile name, bio and brand homepage link updated and verified. Board description now links to the calendar landing page.

## Resend: prepared; activation awaits owner approval

- mail.bytecatstudio.com verified in Resend, Tokyo region. Existing Zoho and website DNS records preserved; only three Resend authentication/delivery records added.
- Worker version 0d683276 deployed with optional verified-email flow; additive D1 migration succeeded.
- Confirmation GET has no subscription side effect. Explicit confirmation POST records verified email and optional consent atomically, then allows a 30-minute ZIP download. Email links last 24 hours.
- Sending is not active. A scoped Sending access key restricted to mail.bytecatstudio.com is prepared in Resend, but has NOT been created. Browser security requires confirmation before creating the credential and storing it in Cloudflare.
- After approval: create the key; store encrypted RESEND_API_KEY on bytecat-calendars; set Worker DELIVERY_MODE=verified_email; set Vercel EMAIL_DELIVERY=verified_email and redeploy; test delivery to the approved launch-test address, confirmation, consent and actual ZIP download.
- README contains the full activation and subscriber-management instructions. No credentials are stored in source.

## Pinterest direct-link migration

Eight direct Pin URLs were saved and verified. Pinterest subsequently returned “Sorry! There was an error editing your Pin” on the print-at-home, September and November edits. Remaining old links still work through the tested homepage redirect; direct edits must be resumed when Pinterest accepts them.

| Pin | Direct URL updated |
|---|---|
| [Free December 2027 Cat Calendar — Festive Holiday Planner](https://www.pinterest.com/pin/1140114461958762242/) | Yes |
| [All 12 Months Free — Byte Cat Studio 2027 Calendars](https://www.pinterest.com/pin/1140114461958762241/) | Yes |
| [Printable Calendar with Notes — Plan Your 2027](https://www.pinterest.com/pin/1140114461958762239/) | Yes |
| [2027 Monthly Calendar PNGs — Download the Full Set](https://www.pinterest.com/pin/1140114461958762238/) | Yes |
| [Free 2027 Cat Calendar Bundle — PDF + 12 PNGs](https://www.pinterest.com/pin/1140114461958762237/) | Yes |
| [Sunday-Start 2027 Calendar — Free Cat Printables](https://www.pinterest.com/pin/1140114461958762236/) | Yes |
| [Cat Lover Desk Decor — Free 2027 Calendar](https://www.pinterest.com/pin/1140114461958762235/) | Yes |
| [Cozy Planning for 2027 — Free Monthly Cat Calendars](https://www.pinterest.com/pin/1140114461958762234/) | Yes |
| [Print-at-Home 2027 Calendars — Free Cat Collection](https://www.pinterest.com/pin/1140114461958762233/) | Pending; old link redirects |
| [Free September 2027 Cat Calendar — Autumn Planning Calendar](https://www.pinterest.com/pin/1140114461958757987/) | Pending; old link redirects |
| [Free November 2027 Cat Calendar — Cozy Autumn Printable](https://www.pinterest.com/pin/1140114461958757986/) | Pending; old link redirects |
| [Free August 2027 Cat Calendar — Late Summer Printable](https://www.pinterest.com/pin/1140114461958757984/) | Pending; old link redirects |
| [Free June 2027 Cat Calendar — Summer Cat Calendar](https://www.pinterest.com/pin/1140114461958757983/) | Pending; old link redirects |
| [Free March 2027 Cat Calendar — Spring Picnic Cat Planner](https://www.pinterest.com/pin/1140114461958757982/) | Pending; old link redirects |
| [Free April 2027 Cat Calendar — Spring Desk Calendar](https://www.pinterest.com/pin/1140114461958757981/) | Pending; old link redirects |
| [Free February 2027 Cat Calendar — Printable Monthly Planner](https://www.pinterest.com/pin/1140114461958757980/) | Pending; old link redirects |
| [Free October 2027 Cat Calendar — Halloween Season Planner](https://www.pinterest.com/pin/1140114461958757979/) | Pending; old link redirects |
| [Free July 2027 Cat Calendar — Summer Planning Printable](https://www.pinterest.com/pin/1140114461958757977/) | Pending; old link redirects |
| [Free May 2027 Cat Calendar — Floral Cat Printable](https://www.pinterest.com/pin/1140114461958757976/) | Pending; old link redirects |
| [Free January 2027 Cat Calendar — Cozy Printable Planner](https://www.pinterest.com/pin/1140114461958755189/) | Pending; old link redirects |

Gumroad remains a separate prepared $0 draft, pending owner payout setup. It is not required for website downloads.
