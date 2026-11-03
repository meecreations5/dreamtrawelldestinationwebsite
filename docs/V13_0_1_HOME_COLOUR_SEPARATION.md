# V13.0.1 – Homepage Section Colour Separation (Focused Fix)

## Why
The V13 homepage used warm ivory as the global public-site surface. Several `section shell` sections inherited it, while `.section-soft` mixed 92% ivory with the card surface, which produced almost no visible section contrast.

## Changes
- `app/(site)/page.jsx`: added homepage-only `dt-home` class and full-width section bands with existing `.shell` content containers. All homepage text, section order, links and functionality are retained.
- `app/home-colour-bands.css`: defines a 6-tone cadence derived from the six admin-editable palette variables (white/surface, ivory, warm ivory, muted navy pearl, champagne, navy). Strong final deep-navy enquiry CTA, subtle dividers, mobile spacing and white testimonial band.
- `app/layout.jsx`: imports homepage-only CSS last, so it overrides the V13 styling without changing other pages.
- `tests/check-home-bands.mjs`: structural smoke tests.

No changes to Firebase, Firestore rules, admin CMS, quotations, package cards, mobile dock, auth or other pages.

### Homepage colour sequence
Hero ivory -> Difference white -> Destinations warm ivory -> Brief champagne -> Services white -> Packages pearl -> Programmes white -> Traveller personas warm ivory -> Why us navy -> Work white -> Partner confidence warm -> [verified testimonials white, when available] -> Quote navy.

## Install the hotfix
Copy the listed changed files to the matching paths of your current **working V13 project**, then restart the Next.js dev server and refresh the browser. No Firebase migration necessary.

### Check locally
`node tests/check-home-bands.mjs`
`npm run test:v13`
`npm run dev`

### Important validation limits
Static source/regression tests are not a substitute for an end-to-end browser or production build test; verify rendered desktop and mobile layouts locally before deploying. Dynamic colour palettes remain supported; custom palette combinations will produce different section shades by design.
