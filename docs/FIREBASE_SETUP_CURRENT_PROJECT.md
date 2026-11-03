NOTE: This document refers to the previous Firebase Admin SDK project. See CLIENT_SDK_SETUP.md for the current architecture.

# DreamTrawell Website Firebase Setup

Project ID: `dreamtrawelldestinationwebsite`
Auth domain: `dreamtrawelldestinationwebsite.firebaseapp.com`
Storage bucket: `dreamtrawelldestinationwebsite.firebasestorage.app`
Analytics measurement ID: `G-WJK1SKFBQ9`

## Connection status
- Web SDK identifiers: configured in `.env.local`.
- Staff Firebase Auth client: configured; requires Email/Password enabled and users.
- Browser Analytics: initialises only in supported browsers; does not run during SSR.
- Firestore server reads/writes, Storage uploads, enquiry ingestion: **not enabled** until the Admin SDK is authenticated.
- Direct legacy CRM sync: staged, not active. See `CRM_MAPPING.md`.

## Check
```bash
npm install
npm run test:data
npm run check:syntax
npm run dev
```
Visit `http://localhost:3000/api/health`. Expect `webAppConfigured: true` and `databaseConfigured: false` while no server credentials are installed.

Enable Firebase Console Authentication → Email/Password; Firestore Database; and Storage as needed.
For a local Firebase Admin SDK credential, set either:
- `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` in the untracked `.env.local`, **or**
- `GOOGLE_APPLICATION_CREDENTIALS` to your service-account JSON file path, outside the source repo.

Do not paste service-account private keys in chat. Restrict Firebase web API keys to Firebase-related APIs, apply access rules, and review public form abuse protection.

## Deployment notes
For Next.js hosting, add the same `NEXT_PUBLIC_FIREBASE_*` settings to the hosting environment, then separately configure secure server credentials and `ENQUIRY_RATE_LIMIT_SALT`. Public client settings are embedded in the Next.js build.
`firebase.json` contains Firestore/Storage rules, not an entire Next.js deployment configuration. Avoid deploying Hosting to this Firebase project until a compatible Next.js hosting strategy is decided.
