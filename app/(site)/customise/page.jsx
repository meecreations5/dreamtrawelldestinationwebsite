import { pageMetadata } from '@/lib/seo';
import { Suspense } from 'react';
import { getPackages } from '@/lib/content';
import { QuoteBuilder } from '@/components/quote-builder';
import { Eyebrow } from '@/components/ui';
export const dynamic = 'force-dynamic';
export default async function Customise() { const packages = await getPackages(); return <main id="main"><section className="quote-hero"><div className="shell"><Eyebrow>THE DREAMTRAWELL QUOTATION STUDIO</Eyebrow><h1>Make the journey <em>your client's.</em></h1><p>Select a package, refine the stays and activities, and send one clear B2B quotation brief to the destination desk.</p></div></section><Suspense fallback={<div className="shell section" aria-live="polite">Loading quotation builder...</div>}><QuoteBuilder packages={packages}/></Suspense></main>; }

export const metadata=pageMetadata('/customise',{title:'Request a B2B Quotation',description:'Send travel dates, preferences and a custom requirement to the destination desk.',noIndex:true});
