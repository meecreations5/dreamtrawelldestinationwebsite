import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import { ManagedPageSections } from '@/components/managed-page-sections';
import { getPublicCopy } from '@/lib/content';
import Link from 'next/link';
import { Eyebrow } from '@/components/ui';
import { ArrowUpRight, Compass, CheckCircle2, Handshake, ShieldCheck, MessageSquareQuote } from 'lucide-react';

const values=[
 [Compass,'Relevance','Sell the right experience to the right traveller.'],
 [CheckCircle2,'Clarity','Make arrangements, inclusions and decisions easier to understand.'],
 [Handshake,'Collaboration',"Work as an extension of the agency's travel planning process."],
 [ShieldCheck,'Accountability','Give operational detail the attention it deserves.']
];
export default async function About(){const copy=await getPublicCopy();const editorialPage=await getPublicPage('about'); return <main id="main">
 <section className="sub-hero shell v12-editorial-hero"><Eyebrow>OUR STORY / THE DESTINATION DESK</Eyebrow><h1>{editorialPage.heroTitle || <>{copy.aboutLead} <em>{copy.aboutEmphasis}</em></>}</h1><p>{editorialPage.heroDescription || <>{copy.aboutDescription}</>}</p><span className="v12-tagline">Realize the Experience.</span></section>
 <section className="section shell v12-about-intro"><div><Eyebrow>WHAT WE BELIEVE</Eyebrow><h2>{editorialPage.textOverrides?.heading01 || <>Better travel begins long <em>before departure.</em></>}</h2></div><div><p>{editorialPage.textOverrides?.paragraph01 || <>We believe a good travel programme brings three things together: the aspirations of the traveller, the commercial priorities of the travel agent and what is practically possible at the destination.</>}</p><p>{editorialPage.textOverrides?.paragraph02 || <>Our role as a DMC partner is to connect those elements through itinerary planning, relevant destination information, supplier coordination and clear communication.</>}</p><Link className="text-link" href="/partners">How we work with travel agents <ArrowUpRight size={16}/></Link></div></section>
 <section className="v12-philosophy"><div className="shell v12-philosophy-inner"><div><Eyebrow>HOW WE THINK</Eyebrow><h2>{editorialPage.textOverrides?.heading02 || <>Know the place.<br/>Understand the person.<br/><em>Deliver the plan.</em></>}</h2></div><p>{editorialPage.textOverrides?.paragraph03 || <>DreamTrawell’s work is built around thoughtful destination solutions rather than an inventory-only approach. We aim to make it easier for agents to recommend and deliver international travel with clarity.</>}</p></div></section>
 <section className="section shell"><div className="section-heading"><div><Eyebrow>OUR OPERATING PRINCIPLES</Eyebrow><h2>{editorialPage.textOverrides?.heading03 || <>The principles behind <em>the operations.</em></>}</h2></div><p>{editorialPage.textOverrides?.paragraph04 || <>Simple commitments that guide how we plan, communicate and coordinate with our travel partners.</>}</p></div><div className="v12-pillar-grid">{values.map(([Icon,t,d],i)=><article className="v12-pillar motion-card" key={t}><span className="v12-pillar-number">0{i+1}</span><Icon size={27}/><h3>{t}</h3><p>{d}</p></article>)}</div></section>
 <section className="section section-soft"><div className="shell v12-about-testimonials"><div><Eyebrow>PARTNER CONFIDENCE</Eyebrow><h2>{editorialPage.textOverrides?.heading04 || <>Hear from our <em>trade partners.</em></>}</h2><p>{editorialPage.textOverrides?.paragraph05 || <>We feature only genuine, approved partner feedback. Learn about our approach while verified testimonials are being collected.</>}</p></div><div><Link href="/testimonials" className="btn btn-navy"><MessageSquareQuote size={17}/> Partner feedback</Link></div></div></section>
 <section className="section shell cta-section"><Eyebrow>REALIZE THE EXPERIENCE.</Eyebrow><h2>{editorialPage.textOverrides?.heading05 || <>Destination knowledge that works <em>for your agency.</em></>}</h2><p>{editorialPage.textOverrides?.paragraph06 || <>Share the destination, travel dates and your client's needs. We will help structure a practical programme and quotation.</>}</p><Link className="btn btn-red" href="/customise">Send your requirement <ArrowUpRight size={16}/></Link></section>
 <ManagedPageSections page={editorialPage}/></main>}

export async function generateMetadata(){return pageRecordMetadata('about',await getPublicPage('about'));}
