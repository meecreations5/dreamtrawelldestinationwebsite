# DreamTrawell V13.0.3 | Site-wide visual corrections + B2B package detail UX

## Baseline and scope
Built on V13.0.2 Pearl Mist. Preserves existing website routes, package finder, Firebase Client SDK authentication, Super Admin colour management, homepage banner mode, enquiry builder, all destination guides, the content publishing workflow, and the B2B no-public-rates policy. This is a source update, **not a production deployment**.

## Visual corrections
- Final stylesheet `app/v13-0-3-polish.css` loads after `pearl-mist.css` and fixes colour cascade failures: heading/feature titles on navy backgrounds must be white. Also handles the About philosophy and destination planning panel.
- Removes remaining tan/champagne styling in the homepage brief section and destination area explorer; uses published Pearl Mist/Soft Cloud/surface theme variables.
- Improves content text legibility, section spacing, catalogue header-to-filter spacing, footer typography, and mobile body text.
- These colours are still controlled by Admin → Theme & Colours; the independent admin styling is not changed.

## Image accuracy
- Starter data and public display correct two **specifically identified wrong legacy photo IDs**: Singapore Family Discoveries (Tokyo imagery) and Dubai Corporate Incentive (Paris imagery). Those use existing Singapore/Dubai destination-cover URLs as *interim images*.
- A new custom photo selected by the admin is **never replaced** by these corrections. If live Firestore contains the old exact IDs, the public page uses the destination cover until the admin saves an approved package-specific replacement.
- Actual copyright permissions and all **other** package photographs must be verified manually before launch; the change does not claim to authenticate external photo licensing or location for all 29 records.

## Package detail layout
- Breadcrumbs, page title, summary, programme metadata, an optional photo gallery (main cover + up to 8 supporting images) with accessible buttons/thumbnails.
- Tabs for day-by-day itinerary, suggested inclusions/upgrades, hotel/transfer preference guidance, and planning notes. These display only data present in the package plus clearly labelled general guidance. No fictitious hotel inventory or rates are shown.
- Existing `DayAccordion` remains and links each day to a specific change request via `?day=`.
- Desktop sticky quotation panel; mobile app-style sticky quotation action above the fixed global navigation with safe-area spacing.
- Related packages remain on the page.

## CMS extension / important Firestore rules update
- Admin → Packages & programmes → Edit package → **Package photo gallery**. Add/remove up to 8 optional images, upload a licensed image via existing Firebase Storage upload, or paste an approved URL; provide alt text. Cover image remains editable as before.
- `packageSchema` accepts `gallery: [{url,alt}]` (optional, max 8).
- The *only* new Firestore content key permitted by this release is `gallery`. **Review and deploy** the edited `firestore.rules` before editing gallery fields. Do not overwrite live rules blindly; compare your deployed version with the release file.
- Existing package documents without `gallery` continue working. Other CMS data is not migrated or overwritten.

## Files changed/added
- app/(site)/packages/[slug]/page.jsx (reworked detail layout)
- app/layout.jsx (loads final polish stylesheet)
- app/v13-0-3-polish.css (new)
- components/package-gallery.jsx (new)
- components/package-guide-tabs.jsx (new)
- components/ui.jsx (known legacy image corrections in cards)
- components/admin-panel.jsx (gallery upload handler and default)
- components/admin-workspace.jsx (gallery editor)
- data/packages.json (2 interim corrected seed image URLs)
- lib/package-image.js (pure server/client-safe known legacy image correction helper)
- lib/validation.js (gallery schema)
- firestore.rules (gallery allowlist)
- package.json (version and release test)
- tests/check-v13-0-3.mjs (new)
- docs/V13_0_3_UI_AND_PACKAGE_RELEASE.md (this file)
- README.md (release notice)

## Local verification
Run `node tests/check-jsx.mjs`, `npm run test:data`, `npm run test:security`, `npm run test:v10`, `npm run test:v11`, `npm run test:v12`, `npm run test:v12.1`, `npm run test:v13`, `npm run test:v13.0.2`, `npm run test:v13.0.3`.

Build and live browser tests must be performed on the user's machine: `npm install`, `npm run build`, `npm run start`. The npm registry could not be reached in this execution environment.

## Suggested manual acceptance tests
1. Home: dark navy partner cards/headline, contrasting text, Pearl Mist brief section, footer, on desktop and mobile.
2. Singapore area explorer and dark planning card: area text should remain legible as tabs change.
3. Packages: heading and filter bar should be closer together; destination photos for the two named programmes should now be correct or use the selected CMS override.
4. Package detail: tab keyboard navigation, day 2/3 request links, image switcher with 2+ approved photos, gallery upload/remove and publish.
5. Mobile: quote bar remains above the five-item dock and doesn't hide the last itinerary content; test iPhone safe area.
6. Admin: publish another colour preset and confirm navy text remains white on dark surfaces.
7. Create a new website enquiry from the package; confirm an entry in `websiteEnquiries` and no supplier rates displayed.

## Not included
Automated CRM native lead sync, image rights verification, dynamic hotel rate feeds, inventory, payments, or full production deployment. Existing commercial quotation workflow remains unchanged.
