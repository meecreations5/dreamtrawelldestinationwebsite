import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import { ManagedPageSections } from '@/components/managed-page-sections';
import { listContent } from '@/lib/content';
import { Eyebrow } from '@/components/ui';
import Link from 'next/link';
import { Quote } from 'lucide-react';
export const dynamic = 'force-dynamic';
export default async function Testimonials() { const reviews = (await listContent('testimonials')).filter(r => r.consentVerified); const editorialPage=await getPublicPage('testimonials'); return <main id="main"><section className="sub-hero shell"><Eyebrow>VOICES FROM OUR PARTNERS</Eyebrow><h1>{editorialPage.heroTitle || <>Partnerships built on <em>real experiences.</em></>}</h1><p>{editorialPage.heroDescription || <>We publish only attributable, approved feedback from travel-industry partners.</>}</p></section><section className="section shell pt-zero">{reviews.length ? <div className="guide-grid">{reviews.map(r => <article className="guide-card review-card" key={r.slug}><Quote size={26}/><blockquote>“{r.quote}”</blockquote><strong>{r.name}</strong><p>{r.agency} · {r.destination}</p></article>)}</div> : <div className="empty"><h2>{editorialPage.textOverrides?.heading01 || <>Verified testimonials coming soon.</>}</h2><p>{editorialPage.textOverrides?.paragraph01 || <>We are collecting approval from travel partners before publishing their comments.</>}</p><Link className="btn btn-red" href="/partners">Explore trade partnerships</Link></div>}</section><ManagedPageSections page={editorialPage}/></main>; }

export async function generateMetadata(){return pageRecordMetadata('testimonials',await getPublicPage('testimonials'));}
