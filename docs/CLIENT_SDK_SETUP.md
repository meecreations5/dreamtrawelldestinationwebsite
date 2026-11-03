# DreamTrawell Client SDK deployment guide

## Firebase setup

1. Firebase Console → Authentication → Sign-in method → enable **Microsoft**. Configure its client ID and secret from Microsoft Entra (Web redirect URI `https://dreamtrawelldestinationwebsite.firebaseapp.com/__/auth/handler`).
2. Enable **Anonymous** in the same Authentication console for public package enquiry submissions.
3. Add `localhost` for local development if it is not already listed under Authentication → Settings → Authorized domains.
4. Firebase Console → Firestore Database → Create database.
5. Firebase Console → Storage → Get started. Select a billing plan if your project requires it.
6. Deploy both rule files from source: `npx firebase-tools login` then `npx firebase-tools deploy --only firestore:rules,storage --project dreamtrawelldestinationwebsite`.
7. Start Next.js with `npm install`, `cp .env.example .env.local`, `npm run dev`.

## First super admin (no service-account key)

- Open `/admin` and sign in with Microsoft.
- Copy Firebase UID displayed in **Access not granted**. This is not the Microsoft Entra object ID.
- Firebase Console → Firestore → Start collection `adminUsers` → Document ID = Firebase UID.
- Add `role` (string) = `super_admin` and `active` (boolean) = `true`. Save.
- Refresh or sign out/in. The site checks `adminUsers/{uid}` on every new session and Security Rules check it for each sensitive database operation.
- Repeat for additional approved staff with `role` = `admin`. These role records must be managed manually in Firebase Console in this version.

## CMS and quotation workflow

- Super admin: **Import starter catalogue** (one-time) writes seed records to `siteDestinations`, `sitePackages`, and a catalogue initialization flag.
- Staff: create/edit status = `draft`, `published` or `archived` and upload website images to `website-media/{uid}/{uuid}.jpg|png|webp`.
- Testimonials publish only with verified consent, checked in client validation and rules.
- Public: pick package → customise → quote request; Firebase anonymous account created if necessary; Firestore write to `websiteEnquiries`; no personal enquiry reads are permitted to the sender.
- Staff: see 100 newest enquiries, update status. No automatic CRM syncing yet.

## Production limitations and decisions

- Test rules in Firestore / Storage rules playground and emulator before deployment. Never use Firestore test-mode rules publicly.
- Anonymous authentication is not anti-spam. Add Firebase App Check, CAPTCHA, request throttling and retention safeguards before advertising the public form. If enforcing App Check for Firestore, server-rendered public Firestore Lite queries must be replaced by a published snapshot or client-only Firestore reads.
- Unverified public inputs can still be inaccurate; agents' quotation requests should be manually reviewed.
- Uploaded website images are publicly readable, including draft artwork; don't upload internal/vendor files to `website-media`.
- Add Firestore indexes if a query requests them; enquiry staff listing uses `createdAt` descending, no compound index required.
- Website CRM bridging will require a separately authenticated server endpoint or other trusted cross-project mechanism. It is intentionally not simulated by insecure client writes.
