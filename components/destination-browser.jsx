'use client';
import { useMemo, useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { DestinationCard } from '@/components/ui';
import { filterDestinations } from '@/lib/discovery.mjs';
export function DestinationBrowser({ destinations }) {
 const [query,setQuery]=useState('');const [profile,setProfile]=useState('All travellers');
 const profiles=['All travellers','Family','Honeymoon','Group','Corporate','Luxury'];
 const filtered=useMemo(()=>filterDestinations(destinations,query,profile),[destinations,query,profile]);
 return <><div className="v11-filter-panel"><label className="v11-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search destinations, areas or experiences" aria-label="Search destinations"/></label><div className="v11-chip-row" role="group" aria-label="Traveller type filter">{profiles.map(x=><button key={x} type="button" aria-pressed={profile===x} className={`v11-chip ${profile===x?'selected':''}`} onClick={()=>setProfile(x)}>{x}</button>)}</div><div className="v11-filter-summary"><span>{filtered.length} destination{filtered.length===1?'':'s'} match</span>{(query||profile!=='All travellers')&&<button type="button" onClick={()=>{setQuery('');setProfile('All travellers')}}><X size={14}/> Clear filters</button>}</div></div><div className="destination-grid v11-results" aria-live="polite">{filtered.map(d=><DestinationCard key={d.slug} d={d}/>)}</div>{!filtered.length&&<div className="empty"><MapPin size={28}/><h3>No matching destinations</h3><p>Try another search or traveller type.</p></div>}</>;
}
