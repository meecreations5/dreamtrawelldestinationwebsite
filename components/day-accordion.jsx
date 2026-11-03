'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
export function DayAccordion({days,packageSlug}) { const [open,setOpen]=useState(0);return <div className="day-list">{days.map((d,i)=><div className="day-card" key={i}><button type="button" aria-expanded={open===i} onClick={()=>setOpen(open===i?-1:i)}><span>DAY {String(i+1).padStart(2,'0')}</span><strong>{d.title}</strong><ChevronDown size={18} className={open===i?'rotated':''}/></button>{open===i&&<div className="day-details"><p>{d.description||'Suggested route and experiences. Final sequencing and transfers will be confirmed for your dates.'}</p>{packageSlug&&<Link className="v11-day-action" href={`/customise?package=${encodeURIComponent(packageSlug)}&day=${i+1}`}>Request changes to day {i+1} <ArrowUpRight size={16}/></Link>}</div>}</div>)}</div>}
