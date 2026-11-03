# JavaScript Conversion Manifest

- Converted 12 App Router page/layout files from `.tsx` to `.jsx`.
- Converted 5 server route files from `.ts` to `.js`.
- Converted 7 React components from `.tsx` to `.jsx`.
- Converted 4 utility files from `.ts` to `.js` (type-only lib/types removed).
- Converted `next.config.ts` to `next.config.mjs`.
- Replaced TypeScript config with `jsconfig.json` path alias.
- Removed `typescript`, `@types/*`, and the TypeScript checking script.
- Added Suspense boundaries around package search and customisation components using `useSearchParams`, to support Next.js production rendering.
- Preserved public pages, seven destinations, twenty-nine package/programme templates, the four-step quote form, Firebase admin CMS, and staged CRM enquiry intake.
- No legacy DreamTrawell CRM schema was merged; `docs/CRM_MAPPING.md` remains the integration contract.
- Validated JavaScript/JSX parser syntax of all 33 JS-source files and verified package data.
- Full Next.js production build still requires installing project dependencies.
