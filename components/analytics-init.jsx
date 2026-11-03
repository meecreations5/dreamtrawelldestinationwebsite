'use client';
import { useEffect } from 'react';
import { enableClientAnalytics } from '@/lib/firebase-client';

export default function AnalyticsInit() {
  useEffect(() => {
    // Public usage analytics only; omit private content-management pages.
    if (window.location.pathname.startsWith('/admin')) return;
    void enableClientAnalytics().catch(() => {
      // Analytics is optional. Browser privacy settings or blocked scripts
      // must not interrupt browsing, quotations or staff authentication.
    });
    const onConsent=()=>{void enableClientAnalytics().catch(()=>{});};
    window.addEventListener('dt-analytics-consent-updated',onConsent);
    return ()=>window.removeEventListener('dt-analytics-consent-updated',onConsent);
  }, []);
  return null;
}
