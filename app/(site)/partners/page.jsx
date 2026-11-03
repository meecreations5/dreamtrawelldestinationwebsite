import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import { ManagedPageSections } from '@/components/managed-page-sections';
import { getPublicCopy } from '@/lib/content';
import Link from 'next/link';
import { Eyebrow } from '@/components/ui';
import { ArrowUpRight, Handshake, FileText, Compass, Headset, Users, CalendarDays, Hotel, Wallet, ChevronDown, ShieldCheck } from 'lucide-react';

const benefits=[
 [FileText,'Agent-led enquiries','Briefs received from travel professionals and agencies.'],
 [Handshake,'Clear quotations','Requirements, inclusions and revisions considered together.'],
 [Compass,'Practical recommendations','Locations, timing and traveller suitability considered before confirmation.'],
 [Headset,'Ground coordination','Confirmed services aligned with the itinerary and travel schedule.']
];
const brief=[
 [Users,'Passenger profile','Number of adults/children, ages, group type and key interests.'],
 [CalendarDays,'Travel dates','Arrival / departure, duration and flexibility.'],
 [Hotel,'Service scope','Hotels, meals, transfers, attraction mix, inclusions and exclusions.'],
 [Wallet,'Budget & style','Expected hotel category, budget range and traveller expectations.']
];
const faqs=[
 ['Do you work directly with retail travellers?','DreamTrawell Destinations is positioned here as a B2B DMC website for travel agents and professional partners. Consumer enquiries can be handled separately through the appropriate consumer channel.'],
 ['Can you provide only ground transfers or activities?','Yes. Send the relevant services in your brief; the team can review component-level requirements as well as complete land arrangements.'],
 ['Are public package prices final B2B quotations?','No. This website does not publish internal supplier costs or final agent net rates. Pricing is prepared for the actual dates, service scope and passenger requirement.'],
 ['Can we request revisions?','Yes. Please clearly share the changes in passenger requirements, hotel options or inclusions so the team can assess a revised quotation.'],
 ['Is an agent portal available?','An agent-login or CRM-connected portal may be developed in a later phase; it is not currently part of the public website.']
];
export default async function Partners(){const copy=await getPublicCopy();const editorialPage=await getPublicPage('partners'); return <main id="main">
 <section className="sub-hero shell v12-editorial-hero"><Eyebrow>EXCLUSIVELY FOR THE TRAVEL TRADE</Eyebrow><h1>{editorialPage.heroTitle || <>{copy.partnersLead} <em>{copy.partnersEmphasis}</em></>}</h1><p>{editorialPage.heroDescription || <>{copy.partnersDescription}</>}</p><Link className="btn btn-red" href="/customise">Send your next requirement <ArrowUpRight size={17}/></Link></section>
 <section className="section shell"><div className="section-heading"><div><Eyebrow>OUR PARTNERSHIP MODEL</Eyebrow><h2>{editorialPage.textOverrides?.heading01 || <>A DMC should make <em>your work easier.</em></>}</h2></div><p>{editorialPage.textOverrides?.paragraph01 || <>A clear working relationship, realistic itineraries and a smoother pathway from enquiry to confirmation.</>}</p></div><div className="v12-partner-statement"><div><ShieldCheck size={29}/><h3>{editorialPage.textOverrides?.subheading01 || <>You own the client relationship. We help power the journey.</>}</h3></div><p>{editorialPage.textOverrides?.paragraph02 || <>Our focus is B2B. Share your traveller requirements, and we collaborate on appropriate ground arrangements rather than redirecting the enquiry into a consumer checkout journey.</>}</p></div><div className="v12-pillar-grid">{benefits.map(([Icon,title,desc],i)=><article className="v12-pillar motion-card" key={title}><span className="v12-pillar-number">0{i+1}</span><Icon size={26}/><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
 <section className="section section-soft"><div className="shell"><div className="section-heading"><div><Eyebrow>PREPARE YOUR BRIEF</Eyebrow><h2>{editorialPage.textOverrides?.heading02 || <>What helps us quote <em>the right plan?</em></>}</h2></div><p>{editorialPage.textOverrides?.paragraph03 || <>The more precise the brief, the easier it is to develop relevant options.</>}</p></div><div className="v12-brief-grid">{brief.map(([Icon,title,desc])=><article key={title}><Icon size={24}/><h3>{title}</h3><p>{desc}</p></article>)}</div><div className="v12-brief-cta"><p>{editorialPage.textOverrides?.paragraph04 || <>Already have your client's requirements?</>}</p><Link className="btn btn-red" href="/customise">Create a quotation brief <ArrowUpRight size={16}/></Link></div></div></section>
 <section className="section shell"><div className="section-heading"><div><Eyebrow>QUICK ANSWERS</Eyebrow><h2>{editorialPage.textOverrides?.heading03 || <>A few things <em>worth knowing.</em></>}</h2></div><p>{editorialPage.textOverrides?.paragraph05 || <>Answers to the most common questions from new travel-agency partners.</>}</p></div><div className="v12-faq-list">{faqs.map(([q,a],i)=><details key={q}><summary><span>0{i+1}</span><strong>{q}</strong><ChevronDown size={19}/></summary><p>{a}</p></details>)}</div></section>
 <section className="v12-philosophy v12-partner-end"><div className="shell v12-philosophy-inner"><div><Eyebrow>YOUR CLIENTS, YOUR RELATIONSHIP</Eyebrow><h2>{editorialPage.textOverrides?.heading04 || <>A destination partner <em>behind your brand.</em></>}</h2></div><div><p>{editorialPage.textOverrides?.paragraph06 || <>From the first brief to the final operational handover, we support the travel trade with knowledge, thoughtful planning and destination coordination.</>}</p><Link className="btn btn-red" href="/contact">Contact the trade desk <ArrowUpRight size={16}/></Link></div></div></section>
 <ManagedPageSections page={editorialPage}/></main>}

export async function generateMetadata(){return pageRecordMetadata('partners',await getPublicPage('partners'));}
