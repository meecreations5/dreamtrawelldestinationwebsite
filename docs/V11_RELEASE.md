# DreamTrawell V11 release and verification guide

## Before deployment

1. Back up Firestore `siteDestinations`, `sitePackages`, `sitePromotions`, `siteTestimonials`, `websiteEnquiries`, `adminUsers`, `siteSettings` and Storage media.
2. Keep existing `.env.local`. Do not commit secrets; this ZIP intentionally does not include it.
3. Review modified Firestore rules. V11 introduces `siteMedia`, `siteRevisions`, `siteKnowledge`, destination in new enquiries and staff-only assignment fields. New content publishing requires `super_admin`; editors can select `in_review`.
4. Apply rules, then **test with emulator or a staging Firebase project** using signed-out, anonymous, admin and super_admin identities. Deny access to vendor costs and admin records for public users.
5. Use actual verified photos with publishing rights, and real testimonials only with consent.
6. Run `npm install`, `npm run build`, test all pages on mobile and desktop, and deploy to hosting.

## UX smoke tests

- `/services` and `/contact` have correct navigation and no unverified phone numbers.
- Homepage appears with seven destinations, programmes, stories, services/process and a testimonial slider **only** when verified reviews exist.
- `/destinations` searches by name/area, filters by traveller profile, shows clear no-results.
- `/destinations/singapore` area explorer is keyboard operable; full comparison table still accessible.
- `/packages/:slug` expands itinerary days and `Request changes to day N` carries the selected day into `/customise` notes.
- `/customise` starts with **Custom requirement** when no package is selected; destination is mandatory; selecting a package preloads days and destination; no rates/vendor data exposed.
- Anonymous web enquiry can only be created; it cannot be listed or read by submitter. Verify no spoofed fields are accepted.
- `/admin` has a separate shell; Microsoft staff login required; non-staff cannot read editorial data.
- Media Library: upload a licensed photo with alt and rights, select it for a draft package, save and publish as Super Admin.
- Knowledge library: create and review a destination experience, publish as Super Admin, attach to programme itinerary editor.
- CMS: save draft, send for review, Super Admin publishes, revision history can load an earlier snapshot, unsaved navigation prompts.
- Enquiry inbox: change status, assign to staff member, enter internal note and priority; export CSV, match external CRM record only after confirmed import.

## CRM integration boundary

The existing DreamTrawell CRM lead collection, travel-agent matching keys, required fields and secure endpoint were not provided with this version. The V11 enquiry handoff is **manual export**, not a live CRM bridge. Do not deploy client-side writes into the CRM project. See `docs/CRM_MAPPING.md`.

## Dependency validation

Syntax, JSON catalogue and structural security checks can run offline. A real Next.js production build must be executed when `npm` registry access is available. In this environment, `npm install` failed due to DNS `EAI_AGAIN registry.npmjs.org`; no live Firebase rules tests or browser tests could be performed.
