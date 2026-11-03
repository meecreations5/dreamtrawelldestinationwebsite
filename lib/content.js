import 'server-only';
import { DEFAULT_SITE_COPY } from '@/lib/site-copy-defaults';
import { DEFAULT_THEME, sanitizeTheme } from '@/lib/site-theme';
import { DEFAULT_HOME_HERO, sanitizeHomeHero } from '@/lib/home-hero-settings';
import seedDestinations from '@/data/destinations.json';
import seedPackages from '@/data/packages.json';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, limit, query, where } from 'firebase/firestore/lite';
export const collections = { destinations: 'siteDestinations', packages: 'sitePackages', testimonials: 'siteTestimonials', promotions: 'sitePromotions' };
export function supportedType(type) { return Object.hasOwn(collections, type); }
const publicConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
function publicDb() {
  if (!publicConfig.apiKey || !publicConfig.projectId || !publicConfig.appId) return null;
  // Unprivileged web SDK: public reads are evaluated against Firestore Rules.
  const app = getApps().length ? getApp() : initializeApp(publicConfig);
  return getFirestore(app);
}
function starterContent(type) {
  if (type === 'destinations') return seedDestinations.map(d => ({ ...d, status: 'published' }));
  if (type === 'packages') return seedPackages.map(({ id, contentStatus, ...p }) => p);
  return [];
}
// Avoid a Next.js development error overlay for a recoverable public read failure.
// A Firestore permission-denied result still requires fixing the deployed rules.
const reportedReadFailures = new Set();
function reportPublicReadFailure(type, stage, error) {
  const code = error?.code || error?.message || 'unknown-error';
  const key = `${type}:${stage}:${code}`;
  if (reportedReadFailures.has(key)) return;
  reportedReadFailures.add(key);
  const hint = code === 'permission-denied'
    ? 'Check the DEPLOYED Firestore rules for sitePackages/siteDestinations and the Firebase project ID. From the website root: npx firebase-tools deploy --only firestore:rules --project dreamtrawelldestinationwebsite. Do not make draft documents public.'
    : 'Check the Firebase project, Firestore database, network access and App Check enforcement.';
  console.warn(`[DreamTrawell] Public Firestore ${stage} failed for ${collections[type]} (${code}). ${hint} Bundled sample content is shown instead of private CMS data.`);
}
export async function listContent(type) {
  if (!supportedType(type)) return [];
  const db = publicDb();
  if (!db) return process.env.NODE_ENV === 'production' ? [] : starterContent(type);
  let items;
  try {
    // Firestore Security Rules are not filters. Keep this EXACT status condition:
    // public users may only query status == 'published' records.
    const constraints = [where('status', '==', 'published'), limit(500)];
    if (type === 'testimonials') constraints.unshift(where('consentVerified', '==', true));
    const snapshot = await getDocs(query(collection(db, collections[type]), ...constraints));
    items = snapshot.docs.map(d => { const { createdAt, updatedAt, updatedBy, ...publicFields } = d.data(); return { ...publicFields, slug: d.id }; });
  } catch (error) {
    reportPublicReadFailure(type, 'collection query', error);
    // Static demo catalogue only. Firestore permissions are NOT bypassed.
    return process.env.NODE_ENV === 'production' ? [] : starterContent(type);
  }
  if (items.length) return items;
  try {
    // Read this *specific* public settings document; never list all siteSettings.
    const meta = await getDoc(doc(db, 'siteSettings', 'catalogue'));
    return meta.exists() && meta.data().initialized === true ? [] : (process.env.NODE_ENV === 'production' ? [] : starterContent(type));
  } catch (error) {
    reportPublicReadFailure(type, 'catalogue settings lookup', error);
    return process.env.NODE_ENV === 'production' ? [] : starterContent(type);
  }
}
export async function getContent(type, slug) {
  if (!supportedType(type) || !/^[a-z0-9][a-z0-9-]{0,100}$/.test(slug)) return null;
  const db = publicDb();
  if (!db) return process.env.NODE_ENV === 'production' ? null : starterContent(type).find(d => d.slug === slug) || null;
  try {
    // Firestore rules evaluate this single-document GET; unpublished records cannot be read.
    const snap = await getDoc(doc(db, collections[type], slug));
    if (!snap.exists() || snap.data().status !== 'published') return null;
    if (type === 'testimonials' && snap.data().consentVerified !== true) return null;
    const {createdAt,updatedAt,updatedBy,...publicFields} = snap.data();
    return {...publicFields, slug: snap.id};
  } catch (error) {
    reportPublicReadFailure(type, 'record lookup', error);
    return process.env.NODE_ENV === 'production' ? null : starterContent(type).find(d => d.slug === slug) || null;
  }
}
export async function getDestinations() { return listContent('destinations'); }
export async function getPackages() { return listContent('packages'); }

export async function getPublicCopy() {
  const db = publicDb();
  if (!db) return DEFAULT_SITE_COPY;
  try {
    const snapshot = await getDoc(doc(db, 'siteSettings', 'publicCopy'));
    const copy = snapshot.exists() ? snapshot.data().copy : {};
    return Object.fromEntries(Object.entries(DEFAULT_SITE_COPY).map(([key, fallback]) =>
      [key, typeof copy?.[key] === 'string' && copy[key].trim() ? copy[key] : fallback]));
  } catch (error) {
    // Public copy safely falls back when the new document/rule has not been deployed yet.
    console.warn('[DreamTrawell] Website copy could not be loaded; using approved defaults.');
    return DEFAULT_SITE_COPY;
  }
}


/** Public, unprivileged theme read; never accesses private admin records. */
export async function getPublicTheme() {
  const db=publicDb();
  if(!db)return DEFAULT_THEME;
  try {
    const snapshot=await getDoc(doc(db,'siteSettings','theme'));
    return snapshot.exists()?sanitizeTheme(snapshot.data()?.palette):DEFAULT_THEME;
  } catch {
    // Keep default approved luxury palette when rules are not yet deployed.
    return DEFAULT_THEME;
  }
}

/** Public home banner preferences; the matching Firestore Rules allow only document GET. */
export async function getPublicHomeHero() {
  const db=publicDb();
  if(!db)return DEFAULT_HOME_HERO;
  try {
    const snap=await getDoc(doc(db,'siteSettings','homeHero'));
    return snap.exists()?sanitizeHomeHero(snap.data()):DEFAULT_HOME_HERO;
  } catch {return DEFAULT_HOME_HERO;}
}
