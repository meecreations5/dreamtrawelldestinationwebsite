'use client';
import { useState } from 'react';
import { MapPin, ThumbsUp, Info, Users } from 'lucide-react';
export function AreaExplorer({areas}) {
 const [active,setActive]=useState(0);if(!areas?.length)return null;
 const chosen=areas[active]||areas[0];
 return <div className="v11-area-explorer"><div className="v11-area-choices" role="group" aria-label="Choose a destination area">{areas.map((a,i)=><button key={a.area+i} type="button" className={active===i?'selected':''} aria-pressed={active===i} onClick={()=>setActive(i)}><MapPin size={16}/><span>{a.area}</span><span aria-hidden="true">↗</span></button>)}</div><article className="v11-area-details" aria-live="polite"><span className="eyebrow">AREA GUIDE / {String(active+1).padStart(2,'0')}</span><h3>{chosen.area}</h3><div><ThumbsUp size={19}/><p><strong>Advantages</strong>{chosen.advantages}</p></div><div><Info size={19}/><p><strong>Important considerations</strong>{chosen.considerations}</p></div><div><Users size={19}/><p><strong>Ideal traveller profile</strong>{chosen.suitableFor}</p></div><small>Practical planning reference. Confirm transport and hotel availability for actual travel dates.</small></article></div>;
}
