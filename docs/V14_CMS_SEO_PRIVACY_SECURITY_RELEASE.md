# DreamTrawell Destination DMC — V14.0.0

## Release purpose

Baseline: **V13.0.4**, preserving the approved Pearl Mist design, all seven destination guides, packages, enquiry-led quotation builder, separate Microsoft/Firebase admin login, theme controls, and homepage destination rotation.

This release adds a content/SEO/legal workflow and modest performance/security hardening. **It is not a production sign-off or a completed CRM integration.**

## 1. Public pages added

| URL | Content | Editing |
|---|---|---|
| `/faqs` | Eight initial travel-agent questions, collapsible answers, FAQ structured data | Admin > Pages, FAQs & SEO |
| `/privacy-policy` | Draft privacy notice, data collection and rights | Admin; legal/privacy reviewer approval required |
| `/terms-of-use` | Draft B2B website terms | Admin; counsel approval required |
| `/cookies` | Browser storage and tracking notice | Admin; verify actual SDKs and consent needs |
| `/disclaimer` | Travel-programme accuracy / quotations / images | Admin |
| `/accessibility` | Accessibility principles and contact | Admin |

All are linked in the public footer. The enquiry form now links to the privacy policy. The B2B context remains: **no checkout, booking confirmation, public supplier net rates, GP or vendor confidential content.**

The bundled privacy/terms/cookie/disclaimer text is an **editorial starting draft**, not a legally reviewed policy. These four pages default to `noindex` until reviewed and explicitly published via Super Admin, even when `SITE_INDEXABLE=true`. Their URLs still load so your team can inspect them.

## 2. Content management from Admin

Use **Admin > Pages, FAQs & SEO**. Select one of 16 page groups:

- Main public pages: Homepage, Destinations, Packages, Programmes, Services, For Agents, About, Contact, Offers, Testimonials.
- Supporting pages: FAQs, Privacy Policy, Terms of Use, Cookies, Travel Disclaimer, Accessibility.

Editable fields include visible hero title/description overrides, **59 existing layout headings and paragraphs** in addition to the 19 pre-existing Website Copy fields, supplemental editorial sections with optional bullet lists and ordering, FAQ questions/answers, page-level SEO title/description, social image URL and verified contact details. The contact module includes public trade email/phone, city, privacy email and legal company name. The existing destination and package admin editors also now accept optional SEO title and description.

**Limitations:** Design, navigation structure, some microcopy, card labels, complex editorial card arrays and system-generated UI strings are still source-defined. Product, guide, campaign, testimonial and package structured fields remain editable from their dedicated admin modules. It would be inaccurate to call this a no-code visual page builder for *every* element.

Drafts are stored privately in **`sitePageDrafts/{slug}`**; public content is in **`sitePages/{slug}`**. Saving a draft **does not unpublish** the current version. Only Super Admin may publish or delete a draft. Published pages are readable publicly, while draft records are staff-only.

## 3. On-page SEO

- Per-page canonical URL, title and meta description; social sharing/Open Graph/Twitter card metadata.
- Per-destination and per-package metadata using approved CMS records, including optional SEO overrides.
- Sitemap includes published destinations and packages, plus reviewed legal pages when indexing is enabled.
- Robots rules exclude admin and internal API routes; the quotation page has `noindex` metadata.
- Structured data: `Organization`, selected `BreadcrumbList` and FAQ structured data. No fabricated reviews, ratings, sales or prices.
- Unpublished content is inaccessible to anonymous public reads through Firestore Rules.

Search indexing is disabled by default. On the *real production origin* set `NEXT_PUBLIC_SITE_URL=https://your-verified-domain` and only after approvals set `SITE_INDEXABLE=true`. Inspect generated canonical, `robots.txt` and `sitemap.xml` from the deployed host.

## 4. Security and privacy hardening

- New Firestore roles and field validation for site pages and drafts, default-deny retained.
- Super Admin gated publishing; saved drafts do not replace the live page.
- General security headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and restrictive feature permissions.
- User-controlled optional analytics consent (reject/allow) stored in the browser; analytics is not loaded until consent is granted. A Cookie preferences link allows a new choice.
- Enquiry consent text now links to the privacy notice; existing enquiry structure and Firebase rules remain unchanged.
- User-authored CMS content renders as escaped React text rather than raw HTML.

### Important unresolved launch controls

1. **Enquiry spam / bot abuse:** Anonymous Firebase Authentication and client-side honeypots are **not robust rate limiting**. Before public launch, implement an authenticated, abuse-protected submission backend (e.g. Cloud Functions with App Check and a server-side rate limiter or another trusted verified endpoint). Do not enable Cloud Firestore App Check enforcement for the public-server-read website until the SSR design supports it.
2. **Privacy operations:** Verify controller/legal company identity, privacy and grievance email, retention schedule, service providers, cross-border transfers, data requests, analytics consent and breach response. Have the company CS/legal/privacy reviewer approve policy text, especially in light of India's DPDP framework and phased commencement. See official [MeitY materials](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025%3B).
3. **Live Firebase rules testing:** Use the Firebase emulator or a staging project to verify unauthenticated published GET, denied draft GET, Super Admin publish, regular admin publish rejection, and client create-only enquiry writes.
4. **Images:** Replace provisional demo photographs with reviewed, licensed and destination-accurate imagery. Confirm alt text and preview crops.
5. **Email/CRM:** No automatic acknowledgement email or authenticated CRM lead creation was introduced in this release.
6. **Production CSP:** A strict Content-Security-Policy was intentionally *not* enabled blindly, because OAuth, Firebase, external fonts, and approved image hosts require a tested, site-specific allowlist.

## 5. Performance and accessibility

- Package/destination details use direct, published-only Firestore document reads instead of querying the entire catalogue for one slug.
- Updated image component defaults to lazy loading and asynchronous decoding; the first rotating hero image is requested eagerly with high fetch priority.
- New CMS uploads are optionally resized (max 2000px) and converted to WebP when compression reduces file size; unsupported browsers keep the original.
- UUID-based uploaded media uses immutable long-term cache headers; older existing media remains unchanged.
- Two Google Fonts stylesheet requests consolidated into one with preconnects.
- Core typography/backgrounds and UI sections remain from V13.0.4; new document/FAQ pages are responsive and keyboard operable.

**Not yet measured:** Lighthouse/Core Web Vitals, real network waterfall, CDN/browser cache behaviour, mobile LCP, and actual hosting performance. These require the deployed website.

## 6. Apply the release

1. Back up your working **V13.0.4** website project, Firebase rules and live content.
2. Prefer the focused V14 hotfix; preserve the existing `.env.local`, any local media and your user changes.
3. Merge and review `firestore.rules` rather than overwriting production rules blindly. Deploy with your existing Firebase CLI credentials and correct Firebase project selection.
4. From project root, run `npm install`, `npm run test:v14`, `node tests/check-jsx.mjs`, `npm run test:security`, `npm run build`, and `npm run start`.
5. Open `/admin` with your authorised Microsoft Super Admin account, then select **Pages, FAQs & SEO**. Test draft save, publishing, FAQ edits, page descriptions and dynamic destination/package SEO.
6. Fill verified contact details and obtain company/legal approval for the policies. Publish each reviewed policy explicitly.
7. Verify `/faqs`, `/privacy-policy`, `/terms-of-use`, `/cookies`, `/disclaimer` and `/accessibility` at desktop and mobile sizes.
8. Validate the anonymous enquiry creation and consent wording, then run full end-to-end browser tests. Implement the anti-abuse gate before opening the site to public search.
9. Deploy on the chosen host with the verified HTTPS production origin. Only then consider `SITE_INDEXABLE=true`; connect Google Search Console and submit sitemap after launch validation.

### Windows PowerShell

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm install
node tests/check-v14.mjs
node tests/check-jsx.mjs
npm run test:security
npm run build
npm run start
```

### Environment addition

```env
NEXT_PUBLIC_SITE_URL=https://your-actual-domain.example
SITE_INDEXABLE=false
```

Keep working Firebase credentials from `.env.local`; do not commit that file. `.env.example` only documents public Firebase web configuration and launch flags.

## 7. Validation evidence

- Source parsing: TypeScript transpiler JSX/JS parser, JS syntax checker, PostCSS syntax parser.
- Existing V10/V11/V12/V13 regression suites and V13.0.4 contrast regression tests passed.
- New `tests/check-v14.mjs` validates the page inventory, admin route, SEO, consent, security and static copy overrides.
- **Full Next.js build not verified.** `npm install` failed with `EAI_AGAIN` resolving `registry.npmjs.org/firebase` in this environment. Do not claim this release is production-ready until it builds and runs on your own machine/staging host.

## 8. Primary files changed/added

New: `lib/site-page-defaults.js`, `lib/page-text-fields.js`, `lib/content-pages.js`, `lib/seo.js`, `lib/seo-data.js`, `components/page-content-editor.jsx`, `components/managed-page-sections.jsx`, `components/public-document.jsx`, `components/cookie-consent.jsx`, six new static information routes, `app/v14-cms-seo.css`, and `tests/check-v14.mjs`.

Modified: public page routes for metadata/content overrides, shared public layout/footer, admin navigation and package/destination SEO form, Firebase client / analytics consent / media uploads, public content reads, security and Firestore rules, sitemap/robots, font loading, project environment example and package version.

**Do not alter the CRM application or Firebase project when applying this website release.**
