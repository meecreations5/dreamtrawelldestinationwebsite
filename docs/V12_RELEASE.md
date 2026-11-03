# DreamTrawell V12 · Static Design & Content Parity

## Baselines

- **Public design and content reference:** user-supplied V6 Interactive Motion static website ZIP (45 HTML pages).
- **Functional baseline:** V11 Next.js + JavaScript/JSX + Firebase Client SDK + Microsoft Authentication.
- V12 does **not** introduce TypeScript, Firebase Admin SDK, public B2B net rates, or checkout.

## What changed

### Homepage
Restored V6's `Great travel is built on great groundwork` hero statement; four DMC strengths; `Not just a quote. A plan that works.` editorial band; six ground-services cards; and three featured trade-programme previews. V11's Package Finder, destination cards, CTA, client enquiry, and real-testimonial gating are kept.

### About
Restored `Destination knowledge. A partnership mindset.`, `Better travel begins long before departure.`, the green-toned `Know the place. Understand the person. Deliver the plan.` brand section, and the four original principles Relevance / Clarity / Collaboration / Accountability. Official logo remains unchanged.

### For Travel Agents
Restored B2B client ownership and the full partnership story; benefits cards; four-part brief checklist; five FAQs; stronger closing CTA. Does not claim an active agent portal.

### Trade programmes and package details
Added a dedicated `/programmes` page for eight trade programmes while retaining `/packages` and package comparison. Each trade programme detail now shows its original V6 operational checklist and exclusions note. Both values are editable in the admin package editor (new optional schema fields).

### Destinations
All seven dynamic guides keep the enhanced V11 interactive area explorer, detailed source content and package listing. Added the destination-specific image-backed closing call-to-action, prefilled to the chosen destination in the quotation builder.

### Contact and Services
Restored editorial titles and a separate quick-message experience. Quick-message form **opens the visitor's email application**, following the V6 static behaviour; it does **not** store a CRM enquiry. The guided `/customise` form remains the stored website enquiry path. The addresses displayed are from the supplied V6 static source and should be confirmed before publication.

### Navigation and interaction
Restored compact scroll header, reading progress, route-highlighted navigation, a direct Trade Programmes link, and subtle card/reveal effects. Reduced-motion support is retained. Existing admin layout remains completely separate.

### Confirmed filter fixes
- `Programme` label now aligns with Firestore category `Trade programme`; legacy URL query label also resolves.
- Destination search includes activities, experience highlights, off-beat items, selling areas, area knowledge and traveller profiles.
- Family filter matches `Families with children`.

## Modified/new files

### New
- `app/(site)/programmes/page.jsx`
- `components/quick-contact.jsx`
- `lib/discovery.mjs`
- `tests/check-v12.mjs`
- `docs/V12_RELEASE.md`

### Modified
- `app/(site)/page.jsx`
- `app/(site)/about/page.jsx`
- `app/(site)/partners/page.jsx`
- `app/(site)/contact/page.jsx`
- `app/(site)/services/page.jsx`
- `app/(site)/destinations/page.jsx`
- `app/(site)/destinations/[slug]/page.jsx`
- `app/(site)/packages/page.jsx`
- `app/(site)/packages/[slug]/page.jsx`
- `app/globals.css`
- `components/chrome.jsx`
- `components/catalogue.jsx`
- `components/destination-browser.jsx`
- `components/package-finder.jsx`
- `components/quote-builder.jsx`
- `components/admin-workspace.jsx`
- `lib/client-operations.js`
- `lib/validation.js`
- `data/packages.json`
- `firestore.rules`
- `package.json`
- `README.md`

## Existing Firestore records: critical migration detail

**Code changes do not automatically update content already published to Firestore.**

1. Back up Firestore collections (`siteDestinations`, `sitePackages`, `siteSettings`, etc.) and keep the working local `.env.local` safely outside the ZIP.
2. Review the V12 `firestore.rules` field whitelist change for the new `operationsChecklist` and `exclusionsNote` values, then deploy it with your existing authorised Firebase CLI account:
   `npx firebase-tools deploy --only firestore:rules --project dreamtrawelldestinationwebsite`
3. Start V12 and sign into the separate `/admin` console with your existing approved Microsoft account.
4. From Overview, select **Add missing guides & images**. V12 extends this non-destructive action to copy programme operations fields only when the field does **not exist**. Existing package details and custom thumbnails are not overwritten.
5. Verify the eight programme details on the public website. Only content in `published` records is publicly visible.

## Run locally

```bash
npm install
npm run test:data
npm run check:syntax
node tests/check-jsx.mjs
npm run test:v10
npm run test:v11
npm run test:v12
npm run test:security
npm run dev
```

Note: `npm run check:syntax` verifies raw JavaScript; JSX parse checks rely on `tests/check-jsx.mjs`. Full Next.js production build should be run on your local machine or CI.

## Known boundaries & production QA

- No automatic synchronisation with the separate operational DreamTrawell CRM. Website enquiry records are not yet native CRM leads.
- No production deployment, actual Firestore rule deployment or live Microsoft sign-in test has been done in this environment.
- No browser-based visual/pixel QA of running V12; package installation was blocked by unavailable npm network access.
- Approve the public trade-desk addresses copied from the V6 reference before launch.
- Do not treat starter image URLs as licensed photography. Verify every thumbnail and promotional image before publication.
- Verify accessibility, keyboard navigation, responsive layouts and all 7 destination/29 package routes once the app builds locally.
- Firestore and Storage Rules must be tested with anonymous, authorised admin and unauthorised accounts before launch.
- Verified-only testimonials remain; no fictional partner feedback is published.
- Public quotation is an enquiry, not an online booking or confirmed rate.
