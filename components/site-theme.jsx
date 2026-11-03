'use client';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase-client';
import { DEFAULT_THEME, sanitizeTheme, themeVariables } from '@/lib/site-theme';

/** Only the public site receives editable palette variables; admin remains independent. */
export default function SiteTheme({initialTheme=DEFAULT_THEME, children}) {
  const [theme,setTheme]=useState(()=>sanitizeTheme(initialTheme));
  useEffect(()=>{
    let unsubscribe=()=>{};
    try {
      unsubscribe=onSnapshot(doc(clientDb(),'siteSettings','theme'), snap=>{
        setTheme(snap.exists()?sanitizeTheme(snap.data()?.palette):DEFAULT_THEME);
      },()=>{
        // Keep server-provided or default theme if offline/rules not yet deployed.
      });
    } catch { /* Firebase not configured during local preview */ }
    return ()=>unsubscribe();
  },[]);
  return <div className="public-site" style={themeVariables(theme)}>{children}</div>;
}
