# V13.0.2 — Pearl Mist & Homepage Destination Banner

## Included in this release

- Public pages: Pearl Mist (`#F4F8FA`), white (`#FFFFFF`) and Soft Cloud (`#EAF1F5`) backgrounds with DreamTrawell navy (`#0C2946`) and red (`#BD3046`) anchors. Old green About philosophy panel changed to theme navy. Existing page structure and all wording remain intact.
- Body-copy weight remains regular 400, section headings Manrope 600, editorial main hero Libre Baskerville 400, and mobile dock labels are increased to 11px. Overrides are scoped to `.public-site` so the admin interface is not affected.
- Theme & Colours retains the existing Firestore theme schema keys (`ivory` and `champagne`) for compatibility but relabels them to Pearl Mist and Soft Cloud. The recommended Pearl Mist palette is now the **default for new installations**.
- **Admin → Homepage Banner** (Super Admin can publish): Automatic rotation (6/8/12 seconds), or one selected published destination. Banner uses the destination's existing cover image from Admin → Destinations. Users can pause or manually move between auto banners. Automatic is default if there is no saved selection, or if a selected destination is unpublished or lacks a cover image.
- The image rotates in a client component; the server reads only a public document. Reduced-motion users see a static banner unless navigating manually; hidden tabs and pointer/focus hover pause rotation. No SDK admin credentials are included.

## Upgrade existing installations (important)

1. Back up the working source, Firebase data and deployed Firestore rules.
2. **Preferred:** Extract the changed-files-only hotfix over the existing V13.0.1 project. Do not replace `.env.local`.
3. Review `firestore.rules` changes against your live rules, especially `siteSettings/homeHero`. Deploy rules explicitly only after review, e.g. `npx firebase-tools deploy --only firestore:rules --project dreamtrawelldestinationwebsite` (run in your own configured environment).
4. Start the application and sign in at `/admin` using the existing Microsoft login.
5. Go to **Theme & colours → Pearl Mist (Recommended) → Publish Theme**. **This step matters if you previously published a warm ivory theme**: existing Firestore values are never automatically overwritten by new code.
6. Go to **Homepage banner**; choose automatic 8 seconds (default without a saved document) or fixed destination, and click **Publish Banner**. On the public homepage verify banner images and destination links.
7. Test homepage, seven destination pages, catalogue, 8 trade programmes, About, Contact, quotation form and mobile app-style navigation. Test on narrow and desktop viewport sizes.
8. Complete a production `npm install`, `npm run build` and `npm run start` locally. Live browser/Firebase testing still required before launch.

## Firestore schema

Public document: `siteSettings/homeHero`:

```js
{mode:'auto'|'fixed', destinationSlug:'', intervalSeconds:8, updatedBy:'<super-admin-uid>', updatedAt:<serverTimestamp>}
```

The public can GET this named document, not list siteSettings. Only active Super Admin can write it; rules verify allowed keys, enum, destinationSlug format and timestamp. All displayed banner destinations come from public **published** records. No destination records are made public by this change.

## Limits / launch status

- Rotating image comes from existing `siteDestinations.hero`. To change that photograph, edit the destination's Cover photograph in Admin → Destinations (requires normal publication approval).
- The public site automatically falls back to auto mode if no fixed published destination matches. If there are no published destinations with an image, a local fallback illustration is shown.
- The app uses source-level static images and approved URLs; no external images are guaranteed available or licensed.
- No live Firestore, Microsoft authentication, mobile browser run, Next.js production build, CRM sync or domain deployment is claimed. The npm registry is unavailable in this execution environment (`EAI_AGAIN`).

## Change manifest

- `app/(site)/page.jsx` home hero settings wiring
- `app/layout.jsx` import site-wide polish
- `app/pearl-mist.css` new public scoped CSS and admin banner editor CSS
- `components/home-hero-banner.jsx` new client banner renderer
- `components/home-hero-editor.jsx` new Super Admin UI
- `components/admin-workspace.jsx` new editor module
- `components/admin-panel.jsx` module routing
- `components/theme-editor.jsx` clarity text for Pearl Mist palette
- `lib/content.js` anonymous named-settings read
- `lib/home-hero-settings.js` new server/client-safe input sanitisation
- `lib/site-theme.js` brand palette defaults, semantics and presets
- `firestore.rules` new protected named settings document
- `package.json` version/test script
- `tests/check-v13.mjs` legacy test updated for new document name
- `tests/check-v13-0-2.mjs` new validation/regression tests
- `README.md` and `docs/V13_0_2_PEARL_MIST_BANNER.md`
