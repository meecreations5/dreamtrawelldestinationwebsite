import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import { ManagedPageSections } from '@/components/managed-page-sections';
import Link from 'next/link';
import { ArrowUpRight, Compass, ArrowRight, ClipboardList } from 'lucide-react';
import { getPackages } from '@/lib/content';
import { Eyebrow, PackageCard } from '@/components/ui';
export const dynamic='force-dynamic';

export default async function Programmes(){const packages=(await getPackages()).filter(p=>p.category==='Trade programme');const editorialPage=await getPublicPage('programmes'); return <main id="main">
<section className="sub-hero shell v12-editorial-hero"><Eyebrow>THE DESTINATION PROGRAMME LIBRARY</Eyebrow><h1>{editorialPage.heroTitle || <>Ready-to-shape journeys. <em>Never one-size-fits-all.</em></>}</h1><p>{editorialPage.heroDescription || <>Explore trade-only programme ideas with full sample itineraries. Open any programme for day-wise planning, indicative inclusions and practical details before costing.</>}</p><div className="hero-buttons"><Link href="/packages" className="btn btn-outline">All package categories <ArrowUpRight size={16}/></Link><Link href="/customise" className="btn btn-red">Custom programme enquiry <ArrowRight size={16}/></Link></div></section>
<section className="section shell pt-zero"><div className="v12-programme-topline"><span><Compass size={18}/> {packages.length} curated programme ideas</span><span>FIT · Family · Honeymoon · Group · MICE</span></div><div className="package-grid">{packages.map(p=><PackageCard key={p.slug} p={p}/>)}</div>{!packages.length&&<div className="empty">There are no published trade programmes at this time.</div>}</section>
<section className="section section-soft"><div className="shell v12-programme-banner"><div><Eyebrow>DESIGNED FOR THE TRAVEL TRADE</Eyebrow><h2>{editorialPage.textOverrides?.heading01 || <>Need a different route, pace <em>or experience mix?</em></>}</h2><p>{editorialPage.textOverrides?.paragraph01 || <>Use these programmes as a starting point. Our destination desk can review hotel areas, touring sequences, transfer arrangements and the client's priorities.</>}</p></div><Link href="/customise" className="btn btn-red"><ClipboardList size={17}/> Create a custom brief</Link></div></section>
<ManagedPageSections page={editorialPage}/></main>}

export async function generateMetadata(){return pageRecordMetadata('programmes',await getPublicPage('programmes'));}
