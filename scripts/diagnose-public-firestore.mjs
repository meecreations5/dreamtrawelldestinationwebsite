// Read-only public Firestore check. No Firebase Admin SDK, Microsoft login, or service account.
import { initializeApp, deleteApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, limit, query, where } from 'firebase/firestore/lite';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
if (!config.apiKey || !config.projectId || !config.appId) {
  console.error('Missing Firebase client settings. Check .env.local next to package.json.');
  process.exit(1);
}
const app = initializeApp(config, 'dreamtrawell-public-diagnostic');
const db = getFirestore(app);
let failed = false;
try {
  console.log('Checking unauthenticated public reads against Firebase project:', projectId);
  for (const name of ['sitePackages', 'siteDestinations']) {
    try {
      const snap = await getDocs(query(collection(db, name), where('status', '==', 'published'), limit(2)));
      console.log('PASS:', name, 'public published query permitted. Sample result count:', snap.size);
    } catch (err) {
      failed = true;
      console.error('FAIL:', name, err?.code || err?.message);
    }
  }
  try {
    const meta = await getDoc(doc(db, 'siteSettings', 'catalogue'));
    console.log('PASS: siteSettings/catalogue readable. Exists:', meta.exists());
  } catch (err) {
    failed = true;
    console.error('FAIL: siteSettings/catalogue', err?.code || err?.message);
  }
} finally {
  await deleteApp(app);
}
if (failed) {
  console.error('\nYour app cannot read published content using the public Firebase SDK.');
  console.error('Check Firebase Console > Firestore Database > Rules for the selected project.');
  console.error('From the PROJECT ROOT deploy the reviewed rules with:');
  console.error('npx firebase-tools deploy --only firestore:rules --project dreamtrawelldestinationwebsite');
  console.error('Also check that Firestore App Check enforcement is not rejecting server-side public reads.');
  process.exitCode = 1;
} else {
  console.log('\nPublic access is working. If Next.js still shows an error, restart dev server and confirm its .env.local project ID.');
}
