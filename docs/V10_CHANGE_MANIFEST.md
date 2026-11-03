# DreamTrawell V10: Admin and Destination Experience

Baseline: DreamTrawell_Firestore_Public_Read_Fix_JS (Client SDK only, Microsoft sign-in). No Firebase Admin SDK or TypeScript introduced.

## Site routes and visual separation

- `app/layout.jsx`: minimal shared document and analytics only.
- `app/(site)/layout.jsx`: public header and public footer, exclusively for public routes.
- `app/admin/layout.jsx`: independent admin route layout without public chrome.
- All existing public route directories moved into `app/(site)/` with URL paths unchanged.
- `components/admin-panel.jsx`: preserves Microsoft / Firebase Client SDK authentication but renders the new workspace after role verification.
- `components/admin-workspace.jsx`: dashboard, admin sidebar, staff header, search/status filters, richer structured editors, gallery upload, preview, publishing, enquiries, restricted staff-access provisioning.
- `app/globals.css`: admin theme and destination intelligence sections; responsive/mobile styling and reduced-motion compatible.

## Static-to-dynamic destination recovery

- `data/destinations.json` now contains original static V7 destination intelligence for all seven destinations, extracted from each original `destination-{slug}.html`: `destinationHeadline`, `destinationOverview`, `sellingAreas`, `travellerProfiles`, `planningHeadline`, `planningNote`, `experienceHighlights`, `areaProfiles` (Area, Advantages, Considerations, Best suited to), `standardExperiences`, `offbeatIdeas`, `hotelGuidance`, and `operationalNotes`.
- `app/(site)/destinations/[slug]/page.jsx` now displays these fields. Older records without the new fields continue to display the previous area/activities fallback.
- `lib/validation.js` and `firestore.rules` permit the new structured fields.

## Package thumbnail distinction

- `data/packages.json` includes 29 distinct *proposed* thumbnail URLs, one for each package/programme, and accessible `imageAlt` text.
- The images are sample external images and MUST be reviewed for visual accuracy, licensing and production suitability before publishing.
- `components/ui.jsx` uses the new alternative text.

## Existing Firebase data: safe migration

- New Super Admin dashboard action `Add missing guides & images` calls `syncMissingStaticContent` in `lib/client-operations.js`.
- For destinations, this adds only missing rich-guide fields; existing edited fields remain unchanged.
- For package images, it replaces ONLY the original destination-wide starter image, not an already customised image URL. It adds `imageAlt` only if absent.
- No automatic overwrite occurs on page load. Never import the starter catalogue twice.

## Staff administration

- `firestore.rules` permits super_admin to list adminUsers and create/update records **for other UIDs only**. It blocks staff self-elevation, deletion, and own role edits. Existing Firebase Console bootstrap method remains valid.
- `lib/client-operations.js` provides `fetchStaffAccounts` and `saveStaffAccount` using Firebase Web SDK; no Admin SDK.
- Staff must authenticate with Microsoft first and provide their Firebase UID for provisioning.

## Files changed

- Updated: `app/layout.jsx`, `app/admin/page.jsx`, `app/globals.css`, `components/admin-panel.jsx`, `components/ui.jsx`, `data/destinations.json`, `data/packages.json`, `lib/client-operations.js`, `lib/validation.js`, `firestore.rules`, `tests/check-security.mjs`.
- Created: `app/(site)/layout.jsx`, `app/admin/layout.jsx`, `components/admin-workspace.jsx`, this manifest and deployment guide.
- Relocated unchanged public pages: `app/{page.jsx,about,customise,destinations,offers,packages,partners,testimonials}` → `app/(site)/...`.

## Known limitations

- Microsoft and Firestore remain live-service configuration requirements.
- No actual Firebase deployment or real Microsoft browser login was carried out here.
- Thumbnails are unique URL references; real photographic review is needed.
- Full Next.js build was not possible without installed npm dependencies in this environment; syntax, data and source security checks were run.
- Quotation enquiries still belong to `websiteEnquiries` (CRM integration is a separate pending workflow).
