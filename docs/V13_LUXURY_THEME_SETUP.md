# DreamTrawell DMC V13 - Luxury Visual System + Admin Theme Controls

## Base and scope

Source baseline: V12.1.1 Next.js 16, JavaScript/JSX, Firebase Client SDK and Microsoft login. This release does not add TypeScript or Firebase Admin SDK. It preserves existing destination, package, programme, content editor, CMS, quotation and enquiries data schemas.

## What changed

- Public website: warm ivory canvas, deep-navy editorial design, restrained champagne borders, refined Manrope/Inter/Libre Baskerville typography, softer cards, cinematic hero treatment, interior-page colour parity and calmer hover states.
- Mobile: fixed five-item app-style dock (Discover, Explore, Packages, Quote, More); More opens a keyboard-dismissable tray with secondary pages. On package detail pages, Quote carries the selected package slug into the quotation builder.
- Admin: new `Theme & colours` section in the **separate admin UI**. It offers three curated palettes, six editable colour tokens, an unpublished visual preview, contrast warnings, Discard and Publish Theme.
- Firebase: a new **publicly readable** `/siteSettings/theme` document. Only an active `super_admin` may create or update the document. No public writes, no unrestricted CSS/HTML, and no Firebase Admin SDK.
- Public pages receive their theme through an allowed public Firestore read with a safe default. Open tabs subscribe to theme updates. Theme variables are scoped to `.public-site` so editing the public palette does not restyle the admin console.
- Accessibility: keyboard focus, reduced motion, minimum colour contrast checks for text/buttons and mobile-sized touch targets.

## Installation

1. Back up the current V12.1.1 project and Firestore data.
2. Apply the **V13 hotfix** over the project or extract the complete clean V13 ZIP. Keep your existing `.env.local` (not included in ZIP).
3. Check `firestore.rules` changes and deploy the revised rules to the correct Firebase project:
   `npx firebase-tools deploy --only firestore:rules --project dreamtrawelldestinationwebsite`
   This replaces deployed Firestore rules, so first review any live changes you made since V12.1.1.
4. Run `npm install`, `npm run test:v13`, `npm run build`, then `npm run dev` (or production `npm run start` after build).
5. Sign in as a `super_admin` at `/admin`, choose **Theme & colours** in the sidebar, preview a preset and choose **Publish Theme**.
6. Open the public website in another tab and confirm homepage, destination, package, footer and mobile colours. Public updates propagate to open tabs via Firestore snapshot subscription.

## Firestore document format

Path: `siteSettings/theme`

```
{
  palette: {
    navy: '#0C2946',
    red: '#BD3046',
    ivory: '#F8F6F2',
    champagne: '#D8C4A5',
    surface: '#FFFFFF',
    ink: '#243B51'
  },
  updatedBy: '<Firebase Authentication UID of super_admin>',
  updatedAt: <server timestamp>
}
```

All six fields must be #RRGGBB hex strings. Admin checks 4.5:1 foreground contrast for critical text/buttons before publishing. Rules verify the exact allowed fields, type and Super Admin authorisation. Existing pages continue showing the approved default palette if the document is not yet present or cannot be read.

## Colour editor limitations

Only **public-facing design tokens** are editable. The approved logo, programme photographs, Microsoft sign-in, admin design, navigation labels, itinerary content and company tagline remain unchanged. A few photographic overlays and utility colours intentionally remain fixed for visual legibility. New content still uses its existing CMS.

## Deployment and safety

- Do not expose service-account keys; this project uses Firebase Client SDK only.
- Do not deploy permissive `siteSettings` wildcard rules. Only the theme document is publicly readable; only Super Admin writes it.
- Existing Firestore records are not migrated or overwritten by this release.
- Live Firestore authentication/permission tests and a full Next.js production build are required on your configured machine before launch. Source syntax, regression and theme tests run successfully in this packaging environment, but dependency installation timed out here.
- Private `.env.local`, `node_modules` and `.next` are not in either archive.

## Acceptance checklist

- [ ] `/admin` Microsoft login remains functional.
- [ ] Regular admin can view theme but cannot publish.
- [ ] Super Admin can preview each preset and publish.
- [ ] Public website instantly uses the new colour palette without editing CSS.
- [ ] Original logo, destination data and package detail URLs still work.
- [ ] Mobile nav shows all five tabs and More tray, and Quote preloads the package on detail routes.
- [ ] Theme does not affect admin styling.
- [ ] Contrast validation rejects unreadable colours.
- [ ] Production build and browser/device tests pass.
