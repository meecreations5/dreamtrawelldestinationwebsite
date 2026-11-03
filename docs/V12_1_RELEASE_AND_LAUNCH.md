# DreamTrawell DMC V12.1 – CSS, thumbnail recovery, website copy and launch plan

**Stack:** Next.js 16 · JavaScript/JSX · Firebase Client SDK · Microsoft Login. No Firebase Admin SDK or TypeScript.

## What is implemented in this update

- `components/resilient-image.jsx`: if a remote image cannot load, display a local fallback. Never expose a broken-image icon. Applies to programme/package cards, detail page images, homepage hero, quote sidebar and admin image previews.
- `public/assets/package-fallbacks/*.svg`: **29 distinct, locally hosted illustrative placeholders**. They are not genuine destination photos and must be replaced with approved photographs before production publication.
- `app/package-polish.css`: responsive card alignment, same-size 16:9 package image slots, legible text, stronger hover/focus states, reduced-motion support.
- `Admin → Website copy`: edit the main hero/introduction copy for Home, Destinations heading, About, For Agents, Services, Contact, and the public footer summary. This uses `siteSettings/publicCopy` with public read and Super Admin-only writes. Brand tagline and official logo remain unchanged.
- `app/robots.js` and `app/sitemap.js`: production indexing is **off by default** until `SITE_INDEXABLE=true` is explicitly configured.

### IMPORTANT: Content editability status

- **Editable in admin:** Seven destination profiles; package/programme content, thumbnail image, itinerary, inclusions and upgrades; campaigns; testimonials; media/knowledge library; now key website heading/intro copy above.
- **Not yet fully CMS editable:** All homepage mid-page sections and benefits, About principles text, Service descriptions, For Agents FAQs, all individual footer/nav link labels, contact addresses, legal/policy copy, and arbitrary page section order/layout. Do not tell staff that every paragraph can be edited in admin.

## Deploy on a staging copy first

1. Back up Firestore data and your existing working project. Preserve `.env.local` locally; never upload it to GitHub.
2. Extract the ZIP. Copy your `.env.local` from your working project to the extracted project root.
3. Install dependencies (`npm install`) with internet access, committing the resulting `package-lock.json` to your Git repository. Run `npm run build` and `npm run start`.
4. Review changes to `firestore.rules`, then deploy with `npx firebase-tools deploy --only firestore:rules --project dreamtrawelldestinationwebsite`. **Do not overwrite unknown production rules without reviewing them first.**
5. Sign in at `/admin`. Under `Website copy`, save headings and text as Super Admin, then refresh Home/About/For Agents/Services/Contact to verify.
6. For each programme/package, open the Media Library, upload a licensed photograph, then set its package image via Admin → Packages & programmes and publish. Do not leave placeholders as final product photography.
7. Test all seven destinations, 29 packages/programmes, enquiry creation and admin enquiry review. Confirm anonymous Auth and Firestore write rules, plus anti-spam and rate-limit strategy.
8. Verify contact addresses and genuine testimonials; provide reviewed Privacy Policy and Terms before live launch.
9. Set `NEXT_PUBLIC_SITE_URL=https://your-final-domain` in the hosting build environment. Only after final approval, set `SITE_INDEXABLE=true` and trigger a new deployment.

## Recommended hosting

Use **Firebase App Hosting** (not Firebase Hosting's legacy framework preview) for dynamic Next.js: connect a private GitHub repo and live branch, enable Firebase/Google Cloud **Blaze** plan, set build-time public Firebase env variables and your final domain. App Hosting requires a lockfile (e.g. package-lock.json). This architecture does not require Firebase Admin SDK in your app. Microsoft Entra and Firebase Authentication must include the production domain in their permitted/authorized redirect domains.

## Mandatory checks before claiming production is ready

- `npm run build` completes under your locked Next.js runtime; then smoke test `npm run start`
- Every programme has a genuinely working approved image; thumbnails must be different when content differs
- Admin access is limited by security rules; ordinary users cannot read draft content or enquiries
- Email/phone and legal pages are reviewed; public quotation submissions generate reliable confirmations
- Accessibility: keyboard menu and accordions, focus, colour contrast, alt text, mobile 360/390/768 px
- Performance: Lighthouse / Core Web Vitals and network waterfall, especially remote images
- Security: App Check strategy appropriate to SSR, bot protection, Firestore cost limits, backups, monitoring
- CRM native-lead integration remains **unimplemented**; existing website enquiries stay in website Firestore

## Validation in this environment

Source JS/JSX parse checks, data tests, V10–V12 source checks and ZIP integrity pass. **Full Next.js production build is not verified** because the npm registry is unreachable in this environment. No Firebase rules have been deployed; no live Microsoft/Firebase/CRM testing or live website deployment was performed.
