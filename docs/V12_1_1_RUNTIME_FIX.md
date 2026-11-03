# DreamTrawell V12.1.1 — Server/Client image fallback fix

## Error
`Attempted to call packageFallback() from the server but packageFallback is on the client` at `components/ui.jsx`.

## Root cause
`components/resilient-image.jsx` is a Client Component (`'use client'`). It previously also exported `packageFallback`, a normal function. Server Components imported and called that function, which Next.js forbids across the React Server Component boundary.

## Focused fix
- Added `lib/package-image.js` containing the pure `packageFallback` helper and the existing 29-package slug mapping.
- Updated `components/ui.jsx` and `app/(site)/packages/[slug]/page.jsx` to import the helper from `lib/package-image.js`.
- Updated the client-side `components/quote-builder.jsx` to use the same helper.
- Kept `components/resilient-image.jsx` client-only, responsible for `onError` image fallback rendering.
- Added `npm run test:image-boundary` to prevent this regression.

No content, layout, Firebase rules, authentication, or package data was altered.

## Apply the fix
Download and extract the clean source project, or copy the four changed files and one new utility from the patch archive. Preserve your existing `.env.local` file, since the clean source deliberately excludes it.

In your Windows project root:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run test:image-boundary
npm run dev
```

Visit the homepage (`/`), package catalogue (`/packages`) and a package detail page (`/packages/programme-vietnam-heritage-circuit`) to verify no server/client boundary error occurs. A live production build is still required before deployment.

## Files changed
- `components/resilient-image.jsx`
- `components/ui.jsx`
- `components/quote-builder.jsx`
- `app/(site)/packages/[slug]/page.jsx`
- `lib/package-image.js` (new)
- `tests/check-image-boundary.mjs` (new)
- `package.json`
