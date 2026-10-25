# Launch status - 26 October 2026

## Live and verified

- Website: https://bytecatstudio.com, hosted on Vercel. Original logo and Byte Cat neobrutalist design deployed. All 12 month previews work.
- Visitors enter an email on the website. The Cloudflare Worker saves the address and explicit promotional preference to private D1 before returning a 30-minute download link. The promotional checkbox is optional and initially unchecked.
- API: https://api.bytecatstudio.com. Worker: bytecat-calendars. Database: bytecat-subscribers. Source, schema and deployment configuration are in worker/.
- Actual website submission saved the approved launch-test address. Both promotional choices were tested. The final test submitted false.
- Actual downloaded ZIP matched the source SHA256 BCDC473A027C06CDBA66C78D0E8500CDE4094F987003B2CCD5771C59265AABF9. It contains one PDF and 12 monthly PNGs.
- Mobile checked at 390 x 844: no horizontal overflow, email validation, successful form submission, download link and December preview checked.
- Automated tests cover build configuration, input validation, consent persistence, expiring links, rate limits and database failure rollback.
- Pinterest: 20 Pins published (12 monthly and 8 collection-focused), linking to the website with campaign parameters. Board count verified: https://www.pinterest.com/bytecatglobal/free-printable-calendars/
- Apex and www use Vercel. www redirects to apex. The eight unrelated mail/verification DNS records were preserved. api is a separate Cloudflare Worker custom domain.

## Gumroad: prepared, publication blocked

Draft: https://gumroad.com/products/euasbb/edit

Title, description, summary, cover, $0 minimum and $0 suggested amount are saved. Customer ZIP was uploaded and saved (16.3 MB shown). Publish still reports that a payout method is required. The owner must complete https://gumroad.com/settings/payments before publication. No live Gumroad checkout is claimed. The website works independently of Gumroad.

## Operation and limitations

See README.md for the private D1 dashboard link and subscriber/marketing-only queries. Exclude the launch-test address from campaigns. Send promotional emails only to people whose latest marketing_opt_in is 1; process unsubscribe requests sent to bytecatglobal@gmail.com.

Downloads appear on-site. Automatic delivery emails and email-ownership verification are not configured. The source ZIP already exists in the public GitHub repository, so this is a normal website signup flow, not confidential file storage or copy protection.

No passwords, financial details or API credentials are stored in this repository.
