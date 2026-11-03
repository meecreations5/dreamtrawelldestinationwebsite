import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import { ManagedPageSections } from '@/components/managed-page-sections';
import Link from 'next/link';
import { getDestinations } from '@/lib/content';
import { Eyebrow } from '@/components/ui';
import { DestinationBrowser } from '@/components/destination-browser';
export const dynamic='force-dynamic';
export default async function Destinations(){const dests=await getDestinations();const editorialPage=await getPublicPage('destinations'); return <main id="main"><section className="sub-hero shell"><Eyebrow>DESTINATION KNOWLEDGE DESK</Eyebrow><h1>{editorialPage.heroTitle || <>Explore the world with <em>local perspective.</em></>}</h1><p>{editorialPage.heroDescription || <>Choose the right destination, areas and experiences for your client's travel style. Our destination guides help you plan more confidently.</>}</p></section><section className="section shell pt-zero"><DestinationBrowser destinations={dests}/></section><section className="section section-soft"><div className="shell v12-programme-banner"><div><Eyebrow>NEED DESTINATION GUIDANCE?</Eyebrow><h2>{editorialPage.textOverrides?.heading01 || <>Not sure which destination <em>fits your client?</em></>}</h2><p>{editorialPage.textOverrides?.paragraph01 || <>Share the travellers, available nights, budget and experience preference. We can help you explore realistic routing and package options.</>}</p></div><Link href="/customise" className="btn btn-red">Ask the destination desk</Link></div></section><ManagedPageSections page={editorialPage}/></main>}

export async function generateMetadata(){return pageRecordMetadata('destinations',await getPublicPage('destinations'));}
