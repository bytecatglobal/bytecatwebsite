# Byte Cat Studio

Static calendar landing page for bytecatstudio.com. Node 20+; no external dependencies.

## Local workflow

Run `npm run build`, then `npm run dev`. The server listens on port 3000. Run `npm test` for build and public-file boundary checks.

Set `GUMROAD_PRODUCT_URL` to the real HTTPS Gumroad product URL before building to activate checkout. Without it the website displays a coming-soon message and does not collect or pretend to save email addresses. The customer ZIP is kept under launch/, outside the public build.

## Launch

1. Use launch/gumroad-listing.md and upload launch/Byte-Cat-Studio-Free-Calendars-2027.zip to Gumroad. Review product permissions and publish in your account.
2. Push this repository to bytecatglobal/bytecatwebsite and import it into Vercel. The included vercel.json selects npm run build and dist as the output directory. No package installation is required.
3. In Vercel, set GUMROAD_PRODUCT_URL to the published product URL, then deploy.
4. Add bytecatstudio.com and www.bytecatstudio.com under the Vercel project's Domains settings. In Cloudflare, enter the exact DNS records Vercel supplies. Preserve existing mail and other unrelated DNS records. Use DNS-only for the Vercel records initially, and verify domain ownership and HTTPS in Vercel. Choose one canonical domain and redirect the other in Vercel.
5. Verify the mobile page, all calendar previews, Gumroad free checkout, email receipt, and downloaded files. Review privacy copy and add a public contact method before launch.
6. Publish the prepared Pinterest content from launch/pinterest-content.md and link the profile to the live domain. Add Pinterest's domain verification record only if its dashboard requests it.

No accounts were connected and no deployment or emails were sent by this local build. An open browser tab is not accessible to this chat. Live checkout, delivery, DNS and account settings still need account access and verification.
