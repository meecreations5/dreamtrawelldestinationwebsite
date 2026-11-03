import { pageMetadata } from '@/lib/seo';
import { StructuredData, breadcrumbData } from '@/lib/seo-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent, getPackages } from '@/lib/content';
import { Eyebrow, PackageCard } from '@/components/ui';
import { CalendarDays, Users, ArrowUpRight, ChevronRight, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { packageFallback } from '@/lib/package-image';
import { packageImageSource } from '@/lib/package-image';
// DayAccordion now appears inside the accessible PackageGuideTabs itinerary panel.
import PackageGallery from '@/components/package-gallery';
import PackageGuideTabs from '@/components/package-guide-tabs';
export const dynamic = 'force-dynamic';
export default async function PackageDetail({params}) {
 const {slug}=await params; const p=await getContent('packages',slug); if(!p)notFound();
 const more=(await getPackages()).filter(x=>x.slug!==p.slug && x.destination===p.destination).slice(0,3);
 const images=[{src:packageImageSource(p)||packageFallback(p),alt:p.imageAlt||`${p.destination} destination programme`} ,...(Array.isArray(p.gallery)?p.gallery.filter(g=>g?.url).slice(0,8).map(g=>({src:g.url,alt:g.alt||`${p.title} travel photo`})) : [])];
 const quoteHref=`/customise?package=${encodeURIComponent(p.slug)}`;
 return <main id="main" className="dt-package-page"><StructuredData data={breadcrumbData([{name:'Home',path:'/'},{name:'Packages',path:'/packages'},{name:p.title,path:'/packages/'+slug}])}/>
  <section className="dt-package-top"><div className="shell">
    <nav className="dt-package-crumb" aria-label="Breadcrumb"><Link href="/packages">Packages</Link><ChevronRight size={14}/><Link href={`/packages?destination=${encodeURIComponent(p.destination)}`}>{p.destination}</Link><ChevronRight size={14}/><span aria-current="page">{p.title}</span></nav>
    <div className="dt-package-header"><div><Eyebrow>{p.destination.toUpperCase()} · {p.category.toUpperCase()}</Eyebrow><h1>{p.title}</h1><p>{p.summary}</p></div><Link className="btn btn-red dt-detail-desktop-quote" href={quoteHref}>Customise & request quote <ArrowUpRight size={17}/></Link></div>
    <div className="dt-package-highlights"><span><CalendarDays size={18}/>{p.duration}</span><span><Users size={18}/>{p.audience}</span><span><SlidersHorizontal size={18}/> Tailor-made options</span></div>
    <PackageGallery title={p.title} images={images} fallback={packageFallback(p)}/>
  </div></section>
  <section className="section dt-package-body"><div className="shell dt-detail-layout"><div className="dt-detail-main"><PackageGuideTabs pack={{slug:p.slug,days:p.days,inclusions:p.inclusions,upgrades:p.upgrades,operationsChecklist:p.operationsChecklist,exclusionsNote:p.exclusionsNote}}/></div>
    <aside className="dt-detail-sidebar"><div className="dt-quote-panel"><span className="eyebrow">YOUR TRAVEL BRIEF</span><h2>Make this itinerary your client's.</h2><p>Adjust dates, travellers, hotel preferences and experiences. Our destination desk will review the details and prepare a B2B quotation.</p><Link href={quoteHref} className="btn btn-red">Build quotation brief <ArrowUpRight size={17}/></Link><div className="dt-quote-note"><ShieldCheck size={17}/><span>Enquiry-led service. No public supplier net rates or checkout.</span></div></div>
      <div className="dt-detail-assurance"><h3>Useful to know</h3><p>Package concepts are indicative and can be revised. Availability, inclusions and prices are confirmed individually for your enquiry.</p></div>
    </aside></div></section>
  {!!more.length&&<section className="section section-soft dt-package-related"><div className="shell"><div className="section-heading"><div><Eyebrow>MORE IN {p.destination.toUpperCase()}</Eyebrow><h2>Explore other <em>programme ideas.</em></h2></div><Link className="text-link" href={`/packages?destination=${encodeURIComponent(p.destination)}`}>See all {p.destination} packages <ArrowUpRight size={16}/></Link></div><div className="package-grid">{more.map(x=><PackageCard key={x.slug} p={x}/>)}</div></div></section>}
  <div className="dt-package-mobile-cta"><div><small>YOUR TRAVEL BRIEF</small><span>Customise {p.duration}</span></div><Link href={quoteHref} className="btn btn-red">Request quote <ArrowUpRight size={16}/></Link></div>
 </main>;
}

export async function generateMetadata({params}){const {slug}=await params;const item=await getContent('packages',slug);if(!item)return {robots:{index:false,follow:false}};return pageMetadata('/packages/'+slug,{title:item.seoTitle||(item.title||item.name)+' | DreamTrawell Destination',description:item.seoDescription||item.summary||item.destinationOverview,image:item.image});}
