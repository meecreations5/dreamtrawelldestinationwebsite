# Migration manifest: Admin SDK → Firebase Client SDK

## Removed
- `firebase-admin` dependency
- `lib/admin.js` and `scripts/grant-admin.mjs`, `scripts/seed.mjs`
- `/api/admin/*` privileged API routes and `/api/enquiries` server intake
- All Firebase service-account credential requirements

## Added / rewritten
- `lib/firebase-client.js`: Firebase Auth, Firestore, Storage SDK
- `lib/client-operations.js`: role lookup, CRUD, media upload, anonymous quote intake, catalogue import
- `lib/content.js`: unprivileged Firestore Lite public queries, starter catalogue fallback
- `components/admin-panel.jsx`: Microsoft sign-in, role lookup, direct Firestore admin interface
- `components/quote-builder.jsx`: direct create-only Firestore enquiry
- `firestore.rules`: role-based publishing, enquiry privacy and data validation
- `storage.rules`: authorised uploads and public read-only marketing media
- `app/api/health/route.js`: no privileged server credentials
- `.env.example` and `.env.local`: web config only
- `docs/CLIENT_SDK_SETUP.md`, `tests/check-security.mjs`, `tests/check-jsx.mjs`

## Known remaining work
- Live Firebase Authentication provider enablement and console role bootstrap
- Deploy Firestore/Storage rules, test with emulator and live test accounts
- Spam protection, quota controls, privacy/retention policy
- Production CRM lead mapping / bidirectional synchronization
- Full dependency installation and Next.js build verification (registry unavailable in this environment)
