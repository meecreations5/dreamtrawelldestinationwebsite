NOTE: This document refers to the previous Firebase Admin SDK project. See CLIENT_SDK_SETUP.md for the current architecture.

# DreamTrawell Admin Login - Firebase Configuration Fix

The previous Microsoft-login ZIP omitted `.env.local` because it is normally gitignored. The Firebase client therefore displayed **Firebase web app config not set**. This version includes `.env.local` with the previously provided **public web app identifiers only**. It does not contain service-account private keys or Microsoft client secrets.

## Run

1. Unzip the project and open the folder containing `package.json`.
2. Run `npm install` and `npm run dev`.
3. Open `http://localhost:3000/api/health` and confirm `webAppConfigured: true`.
4. Open `http://localhost:3000/admin`.

## Further setup required

- Enable Microsoft sign-in in Firebase Authentication and set up the Microsoft Entra app redirect URI, per `docs/MICROSOFT_SIGNIN_SETUP.md`.
- For successful **admin permissions and CMS access**, configure the Firebase Admin SDK securely on the server and assign a Firestore role to the authenticated Firebase UID. The included public config is not an Admin SDK credential.
- If developing from a prior ZIP instead of this one, copy `.env.example` to `.env.local` and restart `npm run dev`.

Keep `.env.local` out of version control. NEVER paste a Firebase Admin private key or Microsoft client secret into `NEXT_PUBLIC_*` variables.
