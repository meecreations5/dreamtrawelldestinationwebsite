import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import { ManagedPageSections } from '@/components/managed-page-sections';
import { getPublicCopy } from '@/lib/content';
import Link from 'next/link';
import { ArrowUpRight, Hotel, CarFront, Ticket, Map, UsersRound, BriefcaseBusiness, Ship, Headset, CheckCircle2 } from 'lucide-react';
import { Eyebrow } from '@/components/ui';
const services = [
  [Hotel,'Hotels & resorts','Practical area recommendations, categories, room preferences and supplier availability.'],
  [CarFront,'Transfers & transport','Private and SIC transfer options, airport meet-and-greet and intercity routing.'],
  [Ticket,'Sightseeing & tickets','Landmark visits, family attractions, ticketed shows and experience planning.'],
  [Map,'Tailor-made itineraries','Flexible day-wise programmes designed around the real traveller brief.'],
  [UsersRound,'FIT & group travel','Independent travellers, families, leisure groups and larger departures.'],
  [BriefcaseBusiness,'MICE & incentives','Corporate movement planning, event coordination and local logistics.'],
  [Ship,'Cruise & special experiences','Relevant cruise combinations, celebration arrangements and add-on experiences.'],
  [Headset,'On-ground destination desk','Operational coordination, local requirements and in-trip communication support.']
];

export default async function Services(){const copy=await getPublicCopy();const editorialPage=await getPublicPage('services'); return <main id="main"><section className="sub-hero shell"><Eyebrow>YOUR GROUND SUPPORT PARTNER</Eyebrow><h1>{editorialPage.heroTitle || <>{copy.servicesLead} <em>{copy.servicesEmphasis}</em></>}</h1><p>{editorialPage.heroDescription || <>{copy.servicesDescription}</>}</p><Link className="btn btn-red" href="/customise">Share a client requirement <ArrowUpRight size={16}/></Link></section><section className="section section-soft"><div className="shell"><div className="section-heading"><div><Eyebrow>END-TO-END DMC SUPPORT</Eyebrow><h2>{editorialPage.textOverrides?.heading01 || <>The ground services <em>behind a great trip.</em></>}</h2></div><p>{editorialPage.textOverrides?.paragraph01 || <>Build complete land packages or request individual components according to the brief.</>}</p></div><div className="v11-service-grid">{services.map(([Icon,title,desc])=><article className="v11-service-card motion-card" key={title}><span className="v11-icon"><Icon size={25}/></span><h3>{title}</h3><p>{desc}</p><Link href={`/customise?service=${encodeURIComponent(title)}`}>Discuss requirement <ArrowUpRight size={15}/></Link></article>)}</div></div></section><section className="section shell"><div className="section-heading"><div><Eyebrow>THE DREAMTRAWELL APPROACH</Eyebrow><h2>{editorialPage.textOverrides?.heading02 || <>Practical planning. <em>Dependable handovers.</em></>}</h2></div></div><div className="steps-grid">{[['01','Understand the brief'],['02','Prepare destination options'],['03','Refine and quote'],['04','Coordinate ground delivery']].map(([n,title])=><div key={n}><span>{n}</span><h3>{title}</h3><p>{editorialPage.textOverrides?.paragraph02 || <>We clarify inclusions, routing and operational dependencies before commitments are made.</>}</p></div>)}</div><p className="v11-caveat"><CheckCircle2 size={18}/> Specific availability, times and supplier terms are confirmed when quoting.</p></section><section className="section section-soft"><div className="shell v12-programme-banner"><div><Eyebrow>ONE CONSOLIDATED GROUND BRIEF</Eyebrow><h2>{editorialPage.textOverrides?.heading03 || <>Coordinate the journey, <em>not just the components.</em></>}</h2><p>{editorialPage.textOverrides?.paragraph03 || <>Share your complete itinerary and we can work towards a consolidated ground requirement.</>}</p></div><Link className="btn btn-red" href="/customise">Share a ground brief <ArrowUpRight size={16}/></Link></div></section><ManagedPageSections page={editorialPage}/></main>}

export async function generateMetadata(){return pageRecordMetadata('services',await getPublicPage('services'));}
