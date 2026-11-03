'use client';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
export function clientApp() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId)
    throw new Error('Firebase web app config not set');
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}
export function clientAuth() { return getAuth(clientApp()); }
export function clientDb() { return getFirestore(clientApp()); }
export function clientStorage() { return getStorage(clientApp()); }
export function isAnalyticsAllowed(){try{return typeof window!=='undefined' && window.localStorage.getItem('dt_analytics_consent_v1')==='granted';}catch{return false}}
export async function enableClientAnalytics() {
  if (typeof window === 'undefined' || !firebaseConfig.measurementId || !isAnalyticsAllowed()) return null;
  const { getAnalytics, isSupported } = await import('firebase/analytics');
  if (!(await isSupported())) return null;
  return getAnalytics(clientApp());
}
// Optional; do NOT enable App Check enforcement until the server-side public content
// strategy is adapted to use browser-backed App Check or a public snapshot.
export async function enableClientAppCheck() {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY) return null;
  const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
  return initializeAppCheck(clientApp(), {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

export async function trackPublicEvent(name,params={}){
 if(typeof window==='undefined')return;try{const analytics=await enableClientAnalytics();if(!analytics)return;const {logEvent}=await import('firebase/analytics');logEvent(analytics,name,params);}catch{/* browsing must never depend on analytics */}
}
