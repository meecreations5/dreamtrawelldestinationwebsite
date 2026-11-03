NOTE: This document refers to the previous Firebase Admin SDK project. See CLIENT_SDK_SETUP.md for the current architecture.

# Firebase web application integration manifest

Existing source: `DreamTrawell_NextJS_Firebase_JS`
Configured Firebase web project: `dreamtrawelldestinationwebsite`

## Files updated
- `.env.local` (new, locally ignored by Git): the supplied public Firebase Web App config and the known project ID/storage bucket; **no Admin service-account secret included**.
- `.env.example`: expanded environment-variable template for Firebase Auth, Analytics, Storage and Firebase Admin.
- `.firebaserc` (new): Firebase CLI project alias for the web project.
- `lib/firebase-client.js`: singleton web app, email/password auth accessor, lazy client-only Analytics init.
- `components/analytics-init.jsx` (new): optional analytics initialization on public website pages (not Admin).
- `app/layout.jsx`: install the analytics component in the Next.js root layout.
- `lib/admin.js`: project ID alone no longer incorrectly reports Firebase Admin as configured.
- `app/api/health/route.js`: read-only setup status, separating web config from Admin credentials.
- `README.md`: website project and server setup instructions.
- `docs/FIREBASE_SETUP_CURRENT_PROJECT.md` (new): console steps and local verification.

## Validation
- `npm run test:data`: passed (7 destinations, 29 package/programme records).
- `npm run check:syntax`: passed (34 JS/JSX sources).
- `npm install`: blocked by DNS/network access to `registry.npmjs.org` (EAI_AGAIN). Full Next.js build not verified here.

## Important scope boundary
- Server SDK authentication and Firestore/Storage access require separately provisioned credentials and enabled Firebase services.
- Existing DreamTrawell CRM connection is not yet implemented; website enquiries are staged into website-specific collections pending verified mapping to the CRM code/database.
