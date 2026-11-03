import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import { ManagedPageSections } from '@/components/managed-page-sections';
import { Suspense } from 'react';
import { getPackages, getDestinations } from '@/lib/content';
import { Catalogue } from '@/components/catalogue';
import { Eyebrow } from '@/components/ui';
export const dynamic = 'force-dynamic';
export default async function Packages() { const [packs, dests] = await Promise.all([getPackages(), getDestinations()]); const editorialPage=await getPublicPage('packages'); return <main id="main"><section className="sub-hero shell"><Eyebrow>THE B2B PACKAGE LIBRARY</Eyebrow><h1>{editorialPage.heroTitle || <>Discover, compare, <em>customise.</em></>}</h1><p>{editorialPage.heroDescription || <>Browse Standard, Premium, Specialised and Trade Programme starting points. Each itinerary can be customised to your client requirements; confirmed B2B rates are prepared after reviewing your brief.</>}</p></section><Suspense fallback={<div className="shell section" aria-live="polite">Loading package catalogue...</div>}><Catalogue packages={packs} destinations={dests.map(d => d.name)}/></Suspense><ManagedPageSections page={editorialPage}/></main>; }

export async function generateMetadata(){return pageRecordMetadata('packages',await getPublicPage('packages'));}
