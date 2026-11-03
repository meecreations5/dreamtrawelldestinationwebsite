import { pageMetadata } from '@/lib/seo';
import { StructuredData, breadcrumbData } from '@/lib/seo-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent, getPackages } from '@/lib/content';
import { Eyebrow, PackageCard } from '@/components/ui';
import { AreaExplorer } from '@/components/area-explorer';
import { MapPin, Compass, Lightbulb, ArrowUpRight, Hotel, Route, Star, Clock3, CheckCircle2, AlertTriangle } from 'lucide-react';
export const dynamic = 'force-dynamic';

function BulletCard({ title, icon: Icon, items, extraClass='' }) {
  if (!items?.length) return null;
  return <section className={`destination-knowledge-card ${extraClass}`}>
    <div className="destination-knowledge-label"><Icon size={20}/><h3>{title}</h3></div>
    <ul>{items.map((item,i)=><li key={i}><CheckCircle2 size={16}/><span>{item}</span></li>)}</ul>
  </section>;
}
function AreaKnowledge({d}) {
  const areaProfiles=d.areaProfiles || [];
  if (!areaProfiles.length) return <div className="guide-grid">
    <section className="guide-card"><MapPin/><h3>Popular areas</h3>{d.areas?.map(v=><div className="guide-item" key={v}>{v}</div>)}</section>
    <section className="guide-card"><Compass/><h3>Experiences</h3>{d.activities?.map(v=><div className="guide-item" key={v}>{v}</div>)}</section>
    <section className="guide-card"><Lightbulb/><h3>Agent planning notes</h3><p>{d.guidance}</p></section>
  </div>;
  return <div className="area-knowledge">
    <AreaExplorer areas={areaProfiles}/>
    <details className="v11-area-table-toggle"><summary>View full area comparison table</summary><div className="area-table-scroll" role="region" aria-label="Destination area comparison" tabIndex={0}>
      <table className="area-table"><thead><tr><th>Area</th><th>Advantages</th><th>Considerations</th><th>Best suited to</th></tr></thead>
      <tbody>{areaProfiles.map((a,i)=><tr key={i}><th scope="row"><MapPin size={15}/>{a.area}</th><td>{a.advantages}</td><td>{a.considerations}</td><td>{a.suitableFor}</td></tr>)}</tbody></table></div>
    </details>
    <div className="area-mobile-accordion">{areaProfiles.map((a,i)=><details key={i} className="area-accordion"><summary><MapPin size={16}/>{a.area}</summary><div><p><strong>Advantages:</strong> {a.advantages}</p><p><strong>Considerations:</strong> {a.considerations}</p><p><strong>Best suited to:</strong> {a.suitableFor}</p></div></details>)}</div>
  </div>;
}
export default async function DestinationDetail({params}) {
  const {slug}=await params;
  const d=await getContent('destinations',slug);
  if(!d)notFound();
  const packs=(await getPackages()).filter(p=>p.destination.toLowerCase()===d.name.toLowerCase());
  const rich=!!(d.areaProfiles?.length || d.hotelGuidance || d.offbeatIdeas?.length);
  return <main id="main"><StructuredData data={breadcrumbData([{name:'Home',path:'/'},{name:'Destinations',path:'/destinations'},{name:d.name,path:'/destinations/'+slug}])}/>
    <section className="destination-cover" style={{backgroundImage:`linear-gradient(90deg,#092448e8,#09244866),url('${d.hero}')`}}>
      <div className="shell"><Eyebrow>DESTINATION KNOWLEDGE / {d.eyebrow.toUpperCase()}</Eyebrow><h1>{d.name}</h1><p>{d.summary}</p>
        <div className="destination-hero-buttons"><Link className="btn btn-red" href={`/packages?destination=${encodeURIComponent(d.name)}`}>Explore {d.name} packages <ArrowUpRight size={16}/></Link><Link className="btn btn-outline transparent" href="#destination-knowledge">Agent destination guide <Compass size={16}/></Link></div>
      </div>
    </section>
    {!!(d.destinationHeadline||d.sellingAreas?.length||d.experienceHighlights?.length) && <section className="section destination-v10-intro"><div className="shell">
      {d.destinationHeadline && <div className="destination-v10-brief"><div><Eyebrow>DESTINATION BRIEF</Eyebrow><h2>{d.destinationHeadline}</h2></div><p>{d.destinationOverview || d.summary}</p></div>}
      <div className="destination-v10-three">
        <div className="destination-v10-panel"><Eyebrow>KEY TOURIST AREAS</Eyebrow>{d.sellingAreas?.map((a,i)=><div className="destination-v10-row" key={i}><b>{String(i+1).padStart(2,'0')}</b><span>{a}</span></div>)}</div>
        <div className="destination-v10-panel"><Eyebrow>SUITABLE TRAVELLER PROFILES</Eyebrow>{d.travellerProfiles?.map((a,i)=><div className="destination-v10-row" key={i}><b>↗</b><span>{a}</span></div>)}</div>
        <div className="destination-v10-panel destination-v10-planning"><Eyebrow>AGENT PLANNING NOTE</Eyebrow><h3>{d.planningHeadline || 'Plan with destination knowledge.'}</h3><p>{d.planningNote || d.guidance}</p><Link href="/customise" className="destination-planning-link">Ask the destination desk <ArrowUpRight size={16}/></Link></div>
      </div>
      {!!d.experienceHighlights?.length&&<div className="destination-v10-experiences"><div className="section-heading"><div><Eyebrow>WHAT TO INCLUDE</Eyebrow><h2>Experiences worth <em>exploring.</em></h2></div><p>Suggested experience components for travel-agent itineraries.</p></div><div className="destination-v10-experience-grid">{d.experienceHighlights.map((ex,i)=><article key={i}><span>{String(i+1).padStart(2,'0')}</span><h3>{ex.title}</h3><p>{ex.description}</p></article>)}</div></div>}
    </div></section>}
    <section className="section shell" id="destination-knowledge">
      <div className="section-heading"><div><Eyebrow>DESTINATION INTELLIGENCE</Eyebrow><h2>Know {d.name}. <em>Sell with confidence.</em></h2></div><p>Location selection, experience suitability and operational considerations for travel-agent itinerary planning.</p></div>
      <div className="destination-caveat"><AlertTriangle size={18}/><span>Destination briefs are planning references. Confirm hotel terms, routing, attraction availability and current travel requirements before issuing a quotation.</span></div>
      <div className="destination-subheading"><MapPin size={21}/><h3>Popular areas & traveller suitability</h3></div>
      <AreaKnowledge d={d}/>
      {rich && <>
        <div className="destination-knowledge-grid">
          <BulletCard title="Standard sightseeing & activities" icon={Compass} items={d.standardExperiences || d.activities}/>
          <BulletCard title="Off-beat & customisation ideas" icon={Star} items={d.offbeatIdeas}/>
        </div>
        <div className="destination-knowledge-grid">
          <section className="destination-knowledge-card soft"><div className="destination-knowledge-label"><Hotel size={20}/><h3>Hotel & location guidance</h3></div><p>{d.hotelGuidance}</p></section>
          <section className="destination-knowledge-card soft"><div className="destination-knowledge-label"><Route size={20}/><h3>Ground operations & routing</h3></div><p>{d.operationalNotes || d.guidance}</p></section>
        </div>
      </>}
      <div className="destination-agent-bar"><div><Clock3 size={24}/><span><b>Need a customised routing recommendation?</b><small>Our DMC desk can help refine hotel areas and day-wise touring.</small></span></div><Link className="btn btn-navy" href="/customise">Request destination support <ArrowUpRight size={16}/></Link></div>
    </section>
    <section className="section section-soft"><div className="shell"><div className="section-heading"><div><Eyebrow>TRAVEL-AGENT READY</Eyebrow><h2>Packages in <em>{d.name}.</em></h2></div><p>Standard and specialised itineraries, ready for customisation based on your client's requirement.</p></div><div className="package-grid">{packs.slice(0,6).map(p=><PackageCard p={p} key={p.slug}/>)}</div></div></section>
    <section className="v12-destination-cta" style={{backgroundImage:`linear-gradient(90deg,rgba(8,35,65,.96),rgba(8,35,65,.65)),url('${d.hero}')`}}><div className="shell v12-destination-cta-content"><div><Eyebrow>YOUR DESTINATION DESK</Eyebrow><h2>Planning a <em>{d.name} enquiry?</em></h2><p>Share the passenger details, dates and expected inclusions. We'll help structure a realistic ground requirement.</p></div><Link className="btn btn-red" href={`/customise?destination=${encodeURIComponent(d.name)}`}>Request {d.name} support <ArrowUpRight size={16}/></Link></div></section>
  </main>;
}

export async function generateMetadata({params}){const {slug}=await params;const item=await getContent('destinations',slug);if(!item)return {robots:{index:false,follow:false}};return pageMetadata('/destinations/'+slug,{title:item.seoTitle||(item.title||item.name)+' | DreamTrawell Destination',description:item.seoDescription||item.summary||item.destinationOverview,image:item.hero});}
