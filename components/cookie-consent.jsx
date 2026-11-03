'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const KEY='dt_analytics_consent_v1';
export default function CookieConsent(){
 const [choice,setChoice]=useState(null);
 useEffect(()=>{
   try { const saved=localStorage.getItem(KEY);if(saved==='granted'||saved==='denied')setChoice(saved);else setChoice('ask'); }catch{setChoice('ask');}
   const reOpen=()=>setChoice('ask'); window.addEventListener('dt-open-cookie-settings',reOpen);
   return ()=>window.removeEventListener('dt-open-cookie-settings',reOpen);
 },[]);
 function decide(value){try{localStorage.setItem(KEY,value)}catch{}setChoice(value);window.dispatchEvent(new Event('dt-analytics-consent-updated'));}
 if(choice!=='ask')return null;
 return <section className="dt-consent-banner" aria-label="Analytics cookie preferences" role="dialog" aria-modal="false">
   <div><h2>Your privacy choices</h2><p>We use necessary browser storage for the site and admin sign-in. Optional analytics is off unless you allow it. Read our <Link href="/cookies">Cookie Notice</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.</p></div>
   <div className="dt-consent-actions"><button type="button" className="btn btn-outline" onClick={()=>decide('denied')}>Reject optional analytics</button><button type="button" className="btn btn-red" onClick={()=>decide('granted')}>Allow analytics</button></div>
 </section>;
}
export function CookieSettingsButton(){return <button className="dt-cookie-settings" type="button" onClick={()=>window.dispatchEvent(new Event('dt-open-cookie-settings'))}>Cookie preferences</button>}
