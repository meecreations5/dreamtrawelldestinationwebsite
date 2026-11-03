# Deploy V10 safely

1. Back up your existing project and Firebase Firestore documents. Do not replace your live project's `.env.local` with any ZIP's defaults. Preserve its configuration.
2. Extract the new project or apply the files from `docs/V10_CHANGE_MANIFEST.md` to your current project. Retain installed dependencies if already present.
3. Run `npm install`, then `npm run test:data && npm run check:syntax && npm run test:security`.
4. Review the new Firestore rules, especially the changes to `adminUsers` and new destination content keys. Deploy only after confirming the active Firebase project and any existing custom rules:
   `npx firebase-tools deploy --only firestore:rules --project dreamtrawelldestinationwebsite`
5. Run `npm run dev` and open `/admin`. The admin panel now has a completely separate header and sidebar. Sign in with Microsoft.
6. Open Admin → Overview → `Add missing guides & images` while logged in as super_admin. This merge only adds missing destination guide fields, upgrades starter images and preserves custom edits. It may take some time because it checks existing records individually. Confirm completion in the dashboard notification.
7. Confirm `/destinations/singapore`, `/destinations/dubai`, `/packages`. Check the area comparison, hotel / routing guidance, and distinct programme card photographs.
8. Open Admin → Team & access to add or update staff by Firebase Auth UID. Verify your rules deny unauthorised staff access. Never permit client self-assignment of roles.
9. Check image quality and photo rights before accepting a final published programme. Replace any provisional external photo via each package's Image Upload field.
10. Run `npm run build` locally and manually test mobile/admin navigation, Microsoft login, editing, publishing, enquiry status and image upload. Build and live-service tests were not executed by this artifact generator.

## Troubleshooting

- If static content remains after migration, refresh Firestore and confirm `siteDestinations/{slug}` has `sellingAreas`, `travellerProfiles`, `experienceHighlights`, `areaProfiles`, `standardExperiences`, `offbeatIdeas`, `hotelGuidance`, and `operationalNotes`.
- If staff access throws permission-denied, deploy the V10 `firestore.rules`, but verify they do not remove other rules your project needs.
- If a thumbnail is still repeated, inspect `sitePackages/{slug}.image`; manually curated images are deliberately NOT overwritten by migration.
- Do not share Microsoft client secrets or service-account keys with your frontend. Firebase Admin SDK is not used.
