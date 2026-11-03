# V13.0.4 — Shared Destination Banner Contrast Hotfix

**Baseline:** V13.0.3 Visual & Package UX. **Scope:** CSS only, no Firebase or application workflow changes.

## Issue

Across all seven destination detail pages, dark/navy headings were appearing on dark image banners. The `Agent destination guide` secondary button appeared empty because the Pearl Mist stylesheet supplied a white `btn-outline` background while an older transparent style supplied white text.

## Correction

A final, narrowly scoped `app/v13-0-4-contrast.css` import locks the image-banner title, eyebrow, description and secondary-button foreground colours to readable light shades. The secondary action now has a dark translucent surface and clear white border and text in all states.

The same on-dark text treatment protects existing dark editorial surfaces, including destination planning-note panels and destination-end support banners. These fixes work across all seven destination records because they share the same page component. The admin colour palette still controls the underlying brand surfaces; this patch deliberately keeps foreground text on dark surfaces readable.

## Changed files

- `app/layout.jsx` — one import added after V13.0.3 styling
- `app/v13-0-4-contrast.css` — new focused contrast rules
- `tests/check-v13-0-4.mjs` — static regression coverage

**No changes** to destination content, package data, authentication, Firebase rules, quotation flow, images, navigation, admin UI or public routes.

## Install

1. Back up your working V13.0.3 project.
2. Extract the hotfix ZIP at your project root, preserving `app/` and `tests/` paths.
3. Clear the `.next` build cache and restart Next.js.
4. Open **Dubai, Singapore, Thailand, Malaysia, Bali, Vietnam and Maldives** destination pages. Check title, summary, both buttons, planning-note card, and the destination-end CTA in desktop/mobile widths.
5. If deploying, run `npm run build` on the target system and verify the production site with your published Admin theme selection.

## PowerShell

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
node tests/check-v13-0-4.mjs
npm run dev
```

A source/test pass is **not** a substitute for a real Next.js production build and browser QA.
