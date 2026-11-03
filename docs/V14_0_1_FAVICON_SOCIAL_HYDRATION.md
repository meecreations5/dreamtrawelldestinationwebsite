# DreamTrawell V14.0.1 - Favicon, social icons and image hydration hotfix

Baseline: V14 CMS, SEO & Legal complete project. This is a focused change; no catalogue, quotation, Microsoft Auth, theme palette or public layout redesign.

## What's new

1. **Favicon and mobile bookmark:** `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, generated from a compact navy/red/white DreamTrawell-inspired monogram (not a replacement for the approved full logo). The old placeholder `public/assets/favicon.svg` is updated to match. Next.js metadata explicitly references the new assets.
2. **Public social media icons:** accessible Instagram, Facebook, LinkedIn, YouTube, X and WhatsApp icons in the website footer and Contact page. Only published, validated, non-empty URLs appear. External links use `noopener noreferrer` and open in a new tab.
3. **Admin → Social media links:** Super Admin may enter and publish the company's real profiles. Blank profiles remain hidden. No links have been fabricated or prefilled.
4. **SEO:** Organization structured-data `sameAs` reflects only the configured social links.
5. **Hydration warning:** removed unnecessary image `decoding="async"` attribute from the Client Component image wrapper and redundant hero `loading="eager"`/`fetchPriority="high"` attributes that appeared in the supplied hydration mismatch. Image fallback behaviour remains intact.

## Apply the hotfix

1. Back up the working V14 project and existing Firestore rules. Extract the **Hotfix** into its project root with folder structure retained, overwriting matching files. Prefer this over replacing the entire working project.
2. Review and deploy the updated `firestore.rules` from the hotfix to the intended Firebase project. The rule adds public read of **only** `siteSettings/social` and strict Super Admin-only publishing. It does not modify other collections or data.
3. Restart the app from its root:
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   npm install
   npm run build
   npm run dev
   ```
4. Open `/admin` and choose **Social media links**. Paste the verified full `https://` profile URLs and click **Publish social links**. Empty values are safe and remain hidden. Refresh the public footer and `/contact` page.
5. Visit `/favicon.ico`, `/icon.png` and `/apple-icon.png` directly; hard-refresh the tab (Ctrl+Shift+R) if an old favicon is cached. Check admin and public routes.
6. Verify the home hero, seven destination cards and package cards for hydration warnings. If hydration warnings remain after a clean Next build, test in a clean browser profile with extensions disabled and capture the new error trace.

## Configured platforms

- Instagram: `instagram.com`
- Facebook: `facebook.com` / `fb.com`
- LinkedIn: `linkedin.com`
- YouTube: `youtube.com` / `youtu.be`
- X: `x.com` / `twitter.com`
- WhatsApp: `wa.me` / `api.whatsapp.com` / `whatsapp.com`

Only correct provider domains and HTTPS URLs are accepted. Social media links are public information; do not paste secrets, access tokens or private admin URLs.

## Validation performed

- V10–V14 source regression tests, V14.0.1 social validation test and TypeScript JSX compiler parsing.
- Generated favicon checked at 512px; ICO, PNG and SVG files exist.
- `npm run build` could **not** complete here because dependencies (`next`) are not installed in this container. Do not treat the website as production-verified until your local/staging production build and browser QA succeed.
- Live Firebase rules and Microsoft sign-in not tested here.

## Changed files

- `app/favicon.ico` (new)
- `app/icon.png` (new)
- `app/apple-icon.png` (new)
- `app/layout.jsx`
- `app/(site)/layout.jsx`
- `app/(site)/contact/page.jsx`
- `app/v14-brand-social.css` (new)
- `components/chrome.jsx`
- `components/resilient-image.jsx`
- `components/home-hero-banner.jsx`
- `components/social-links.jsx` (new)
- `components/social-links-editor.jsx` (new)
- `components/admin-panel.jsx`
- `components/admin-workspace.jsx`
- `lib/content.js`
- `lib/social-links.js` (new)
- `public/assets/favicon.svg`
- `firestore.rules`
- `package.json`
- `tests/check-v13.mjs`
- `tests/check-v13-0-2.mjs`
- `tests/check-v14.mjs` (updated version assertion)
- `tests/check-v14-0-1.mjs` (new)
- `docs/V14_0_1_FAVICON_SOCIAL_HYDRATION.md` (new)

No changes to environment files or live Firestore records are bundled.
