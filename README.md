# DreamTrawell Destination — V14.0.0 (CMS, SEO, Legal & Performance)

**Baseline:** V13.0.4 approved Pearl Mist website.

New: Admin > Pages, FAQs & SEO; Privacy Policy / Terms of Use / FAQs / Cookies / Disclaimer / Accessibility; editable page copy and SEO metadata; private drafts; consent-gated optional analytics; security/performance improvements.

**Install and limitations:** [docs/V14_CMS_SEO_PRIVACY_SECURITY_RELEASE.md](docs/V14_CMS_SEO_PRIVACY_SECURITY_RELEASE.md).

**Production status:** NOT yet launched or fully tested. Live build, Firebase rules, privacy/legal review, image rights and server-side bot protection are outstanding.

# DreamTrawell Destination DMC — V13.0.2

Latest: Pearl Mist visual refresh, lighter body typography and Admin → Homepage Banner settings. See [V13.0.2 release and upgrade guide](docs/V13_0_2_PEARL_MIST_BANNER.md).

## V13 luxury design and theme management

See [V13 setup and change guide](docs/V13_LUXURY_THEME_SETUP.md) for the new Admin → Theme & colours editor, Firestore rule changes and mobile dock. This is a source update on the working V12.1.1 base.

---

# DreamTrawell DMC V11.1–V11.4 — Next.js JavaScript + Firebase Client SDK

Complete **source-only** V11 integration over the approved V10 baseline. Uses **Next.js 16 + JavaScript/JSX + Firebase Client SDK** and **Microsoft Authentication**. No Firebase Admin SDK, TypeScript, `node_modules`, `.next` or private `.env.local` in this archive.

## Run

1. Copy `.env.example` to `.env.local` and verify your Firebase web app settings. Never put service-account credentials here.
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000` and `/admin`.
5. **Before accessing new media, revisions, publishing or enquiry fields:** back up Firestore records and review + deploy `firestore.rules` and `storage.rules` using `npx firebase-tools deploy --only firestore:rules,storage --project dreamtrawelldestinationwebsite`. Verify existing collection permissions are not unintentionally overwritten.
6. Sign in with an approved Microsoft account; only an existing Super Admin can publish reviewed content. See `docs/V11_RELEASE.md` for QA and roles.

## What's new

- **V11.1:** restored `/services` and `/contact`, homepage traveller & ground-handling narrative, searchable destination filters, selectable destination-area guidance.
- **V11.2:** restored accessible itinerary day-specific quotation changes, restrained scroll reveals, mobile sticky quotation CTA, optional approved testimonial slider, richer package comparison, explicit *Custom requirement* (no arbitrary default package).
- **V11.3:** shared media gallery with required rights and alt text, reusable experience/hotel knowledge records, itinerary move controls, draft → in-review → published content gating, revision snapshots/restore, dirty-editor warning and editable on-page preview.
- **V11.4:** staff enquiry assignment, priority, private notes, manual CRM handoff CSV and actual CRM ID tracking (only after external confirmation). No unaudited direct writes to the separate CRM Firebase project.

## Scope limitations

- Public enquiry records **do reach website Firestore** when Anonymous Auth, rules and the project are configured; they do **not automatically appear in your separate DreamTrawell CRM**. True cross-project synchronisation needs an approved authenticated integration and native CRM schema. See `docs/CRM_MAPPING.md`.
- New Media Library and revision flows require deployment and security-rules testing. No live Firebase login, rules deployment or npm dependency build was possible in the authoring environment.
- 29 packaged thumbnails are distinct but external starter images require approval and licensing review. No real partner testimonials are fabricated.
- Packaged destination data is draft reference content and must be fact-checked against the actual training workbooks before public release.

## Automated checks
`npm run test:data && npm run test:v10 && npm run test:security && node tests/check-jsx.mjs && npm run test:v11`

## V12 Static Design & Content Parity (3 November 2026)

This release restores the strongest public design and informational elements from the supplied V6 static website while preserving V11's interactive quotation builder and separate admin console. New `/programmes` route, richer homepage, About, For Agents and Contact pages, eight programme operations checklists, image-backed destination closing panels, improved filters and scroll header interaction are included.

**Full changes, safe Firestore migration and outstanding checks:** `docs/V12_RELEASE.md`.

Run `npm run test:v12` along with the pre-existing data, security and V11 tests. The Firebase Client SDK, Microsoft sign-in, private admin permissions, and collection names are unchanged. There is no Firebase Admin SDK.

## V13.0.3 (Visual corrections + B2B package detail UX)
See [`docs/V13_0_3_UI_AND_PACKAGE_RELEASE.md`](docs/V13_0_3_UI_AND_PACKAGE_RELEASE.md) for visual changes, 2 known photo replacements, optional CMS package gallery, necessary Firestore rule update and manual acceptance tests. The source is not yet production verified.
