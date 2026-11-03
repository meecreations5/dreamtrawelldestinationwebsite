NOTE: This document refers to the previous Firebase Admin SDK project. See CLIENT_SDK_SETUP.md for the current architecture.

# DreamTrawell DMC — Microsoft staff login setup (Next.js + JavaScript + Firebase)

This repository includes a **Continue with Microsoft** button on `/admin` using Firebase Authentication's `OAuthProvider('microsoft.com')`. No Microsoft Graph permissions are requested. Email/password is available as a fallback. The existing server-side Firestore staff roles still protect every administration API.

## Step 1 — Register your Microsoft application

1. Open https://entra.microsoft.com/ and sign in with your organisation's Microsoft admin account.
2. Navigate to **Entra ID > App registrations > New registration**.
3. Name: `DreamTrawell Destination Website`.
4. **Supported account types**: select **Accounts in this organizational directory only** for company work/school accounts. If you truly require staff using personal Microsoft/Outlook accounts, select the broader supported account type deliberately.
5. Configure a **Web** redirect URI (not your website `/admin` page):

   `https://dreamtrawelldestinationwebsite.firebaseapp.com/__/auth/handler`

6. Register, and copy **Application (client) ID** and **Directory (tenant) ID**. For a single-tenant app, add `NEXT_PUBLIC_MICROSOFT_TENANT_ID=YOUR_DIRECTORY_TENANT_ID` to `.env.local` and your deployment environment. For a multi-tenant/personal Microsoft account registration, leave this setting unset.
7. Go to **Certificates & secrets > Client secrets > New client secret** and securely record its **Value** (NOT the Secret ID). The secret expires: set a rotation reminder.
8. If you skipped the redirect URI during registration, add it under **Authentication > Add a platform > Web**.

## Step 2 — Enable Microsoft in Firebase

1. Open https://console.firebase.google.com/project/dreamtrawelldestinationwebsite/authentication/providers
2. Go to **Authentication > Sign-in method > Add new provider > Microsoft**.
3. Paste the Microsoft **Application (client) ID** and **Client secret Value** into the **Firebase Console**, not the Next.js source or `.env.local`.
4. Copy/verify the Firebase callback URL shown in the provider settings; it must match the **Web** redirect URI in Entra exactly.
5. Enable the provider and save.
6. In Firebase Authentication **Settings > Authorized domains**, verify `localhost` (for local development, add manually if absent) and add the eventual deployed website domain. Keep the generated `dreamtrawelldestinationwebsite.firebaseapp.com` auth domain.

## Step 3 — Authorise the staff account

Signing in with Microsoft only verifies identity. It does **not** grant access to website administration.

1. The team member first visits `http://localhost:3000/admin` and selects **Continue with Microsoft**.
2. The website shows **Access not granted** until that Firebase Auth user has a Firestore role.
3. From a trusted development machine with **server-side Firebase Admin credentials** configured, run:

   `npm run grant-admin -- staff@yourdomain.com admin`

   Use `super_admin` only for an approved top-level administrator.

4. Sign out and sign in again, or reload `/admin`, to recheck the role.

Role check location: `lib/admin.js` reads `users/{firebaseAuthUid}.role` and accepts only `admin` / `super_admin`. Microsoft users are **not automatically assigned** admin privileges. Existing CRM lead permissions are unchanged.

**Important for existing password-based users:** Depending on your Firebase Auth one-account-per-email configuration, signing in to Microsoft with an existing email can result in `auth/account-exists-with-different-credential`. You need a deliberate provider-linking/migration process to preserve the existing Firebase UID and staff role. Do not delete old users or grant permissions based on email alone.

## Step 4 — Test

Run `npm install`, `npm run dev`, then open `/admin`.

- Unauthorised Microsoft user: login succeeds but website administration is blocked.
- Approved Microsoft user: package and enquiry tabs become available.
- Email/password fallback: still works if enabled in Firebase.
- Logout: returns to the login page.
- Popup blocked: the UI shows the reason; enable popups for the website.

## Security

- Do not paste the **Microsoft client secret** into the source code, public JS environment variables, or Git repositories; it belongs **only in Firebase Authentication provider settings**.
- Do not ask for Graph/Outlook/OneDrive scopes just for login.
- Do not confuse the Firebase **client SDK API key** (public) with the Firebase Admin private key (private).
- Server API endpoints must continue calling `requireAdmin()` even though the admin page is gated. `app/api/admin/me/route.js` exists only to improve UX.
- Firebase role mapping and full CRM integration still require the Firebase Admin SDK environment and relevant database resources.

Official setup references:
https://firebase.google.com/docs/auth/web/microsoft-oauth
https://learn.microsoft.com/entra/identity-platform/how-to-add-redirect-uri
