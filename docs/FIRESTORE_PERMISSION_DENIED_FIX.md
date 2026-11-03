# Public Firestore `permission-denied` for packages

## Finding in this project

The homepage calls `listContent('packages')`, which queries `sitePackages` with `where('status', '==', 'published')`. The rules file contains `allow get, list: if isStaff() || resource.data.status == 'published';` for that collection. The public query and local rules are compatible. The log parameter `packages` refers to a logical content type, **not** a Firestore collection named `packages`.

**Likely issue:** Firestore has different rules deployed than the local file, the app is pointed at another project/database, or Firestore App Check enforcement disallows the server-rendered public SDK request. This cannot be verified from local source alone.

## Fix

1. In Firebase Console for `dreamtrawelldestinationwebsite`, open Firestore Database > Rules. Confirm the rules for `sitePackages`, `siteDestinations` and `siteSettings` match this project's `firestore.rules`.
2. Review the full rules file before deploying; deploying it replaces the rules currently active for the targeted database.
3. In this website's root folder run:

```sh
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules --project dreamtrawelldestinationwebsite
```

4. Run `npm run diagnose:firestore`. This tests the two published collection queries and the catalogue settings read without signing in. It prints PASS/FAIL without requiring Firebase Admin SDK.
5. Restart Next.js (`Ctrl+C`, `npm run dev`) and refresh `http://localhost:3000`.

Alternative: Copy the **entire** reviewed `firestore.rules` file into Firebase Console > Firestore Database > Rules and click Publish. Don't add `allow read, write: if true` as a workaround.

## Expected public access rules

```js
match /sitePackages/{id} {
  allow get, list: if isStaff() || resource.data.status == 'published';
  // Keep the original restricted staff create/update rules.
}
match /siteSettings/{id} {
  allow get: if id == 'catalogue';
  // Keep the original restricted staff create/update rules.
}
```

These are excerpts only; do **not** replace the entire rules file with these snippets.

## Why the page logged an error

In the original `lib/content.js`, both the published collection query and the subsequent catalogue-settings lookup used one `try/catch`. That made it impossible to tell which operation failed. This patch separates them and logs an actionable **warning once per operation**. In either error case, only packaged static sample content is shown: no draft or private records are accessed.

## If permission-denied persists

- Verify project ID in `.env.local` is exactly `dreamtrawelldestinationwebsite`.
- Ensure the **default** Firestore database exists and you deployed rules to that database.
- Check `sitePackages` documents use `status` exactly equal to string `published`. This matters for visibility, but a missing status value would normally result in zero published matches rather than a permission error if rules are correctly deployed.
- If Firestore **App Check enforcement** is ON, note that the Next.js server's Firebase Lite public read does not send a browser App Check token. Keep enforcement OFF for Firestore until the public-content fetching architecture is adapted. Do not disable it as a permanent production security workaround without implementing an alternative.
- After rule changes, allow propagation; rerun the diagnostics.

## Scope

No Firebase Admin SDK, no changes to admin roles or quotation submissions, and no changes to Firestore write permissions. This patch is about public content reads and diagnostics.
