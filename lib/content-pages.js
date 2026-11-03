import 'server-only';
import { cache } from 'react';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, getDoc, doc } from 'firebase/firestore/lite';
import { PAGE_DEFINITIONS, initialPage } from '@/lib/site-page-defaults';
const config={apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID};
export const getPublicPage = cache(async key=>{
 const base=initialPage(key);if(!base)return null;
 const fallback={...base,reviewed:!['privacy-policy','terms-of-use','cookies','disclaimer'].includes(key)};
 if(!config.apiKey||!config.projectId||!config.appId)return fallback;
 try{const app=getApps().length?getApp():initializeApp(config);const db=getFirestore(app);const snap=await getDoc(doc(db,'sitePages',key));
   if(!snap.exists()||snap.data().status!=='published')return fallback;
   const value=snap.data();return {...base,...value,reviewed:true,sections:Array.isArray(value.sections)?value.sections:base.sections,faqs:Array.isArray(value.faqs)?value.faqs:base.faqs};
 }catch{return fallback;}
});
export { PAGE_DEFINITIONS };
