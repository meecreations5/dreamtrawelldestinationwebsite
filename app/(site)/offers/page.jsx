import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import { ManagedPageSections } from '@/components/managed-page-sections';
import { listContent } from '@/lib/content';
import { Eyebrow } from '@/components/ui';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default async function Offers() { const date = new Date().toISOString().slice(0, 10); const offers = (await listContent('promotions')).filter(p => (!p.validFrom || p.validFrom <= date) && (!p.validUntil || p.validUntil >= date)); const editorialPage=await getPublicPage('offers'); return <main id="main"><section className="sub-hero shell"><Eyebrow>FEATURED TRADE CAMPAIGNS</Eyebrow><h1>{editorialPage.heroTitle || <>Offers with a <em>clear purpose.</em></>}</h1><p>{editorialPage.heroDescription || <>Selected B2B travel promotions. All arrangements are subject to written commercial confirmation.</>}</p></section><section className="section shell pt-zero">{offers.length ? <div className="guide-grid">{offers.map(o => <article className="guide-card" key={o.slug}><span className="eyebrow">{o.destination}</span><h3>{o.title}</h3><p>{o.summary}</p><p>Valid: {o.validFrom || 'On request'} to {o.validUntil || 'On request'}</p><Link className="btn btn-red small" href="/customise">Request a quote</Link></article>)}</div> : <div className="empty">No current public offers. Visit the package library for indicative itineraries.</div>}</section><ManagedPageSections page={editorialPage}/></main>; }

export async function generateMetadata(){return pageRecordMetadata('offers',await getPublicPage('offers'));}
