'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import ResilientImage from '@/components/resilient-image';
import { selectHeroDestinations } from '@/lib/home-hero-settings';

function shuffle(items,avoidSlug) {
  const pool=[...items];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  if(pool.length>1&&pool[0]===avoidSlug){const alternate=pool.findIndex(slug=>slug!==avoidSlug);[pool[0],pool[alternate]]=[pool[alternate],pool[0]];}
  return pool;
}
/** Visual-only Client Component: the Server Component passes serialisable destination records. */
export default function HomeHeroBanner({destinations=[],settings}) {
  const {items,mode,intervalSeconds}=useMemo(()=>selectHeroDestinations(destinations,settings),[destinations,settings]);
  const [active,setActive]=useState(items[0]?.slug||'');
  const [queue,setQueue]=useState([]);
  const [paused,setPaused]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [hidden,setHidden]=useState(false);
  const current=items.find(d=>d.slug===active)||items[0];
  const canRotate=mode==='auto'&&items.length>1;
  // Reset if the published list or selected destination changes.
  useEffect(()=>{setActive(items.length&&mode==='auto'?items[Math.floor(Math.random()*items.length)].slug:(items[0]?.slug||''));setQueue([])},[items,mode]);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReducedMotion(media.matches);
    update();media.addEventListener?.('change',update);
    return()=>media.removeEventListener?.('change',update);
  },[]);
  useEffect(()=>{
    const update=()=>setHidden(document.hidden);
    update();document.addEventListener('visibilitychange',update);
    return()=>document.removeEventListener('visibilitychange',update);
  },[]);
  function navigate(direction=1) {
    if(!canRotate)return;
    if(direction<0){
      const index=items.findIndex(d=>d.slug===current?.slug);
      setActive(items[(index-1+items.length)%items.length].slug);setQueue([]);return;
    }
    const available=items.map(d=>d.slug);
    const nextQueue=queue.length?queue:shuffle(available.filter(slug=>slug!==current?.slug),current?.slug);
    const next=nextQueue[0]||available.find(slug=>slug!==current?.slug);
    if(next){setActive(next);setQueue(nextQueue.slice(1));}
  }
  useEffect(()=>{
    if(!canRotate||paused||hovered||reducedMotion||hidden)return;
    const id=setInterval(()=>navigate(1),intervalSeconds*1000);
    return()=>clearInterval(id);
  });
  if(!current)return <div className="hero-photo dt-hero-photo-empty"><ResilientImage src="/assets/singapore.svg" fallback="/assets/singapore.svg" alt="DreamTrawell destination"/></div>;
  return <div className="hero-photo dt-hero-photo" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setHovered(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHovered(false)}}>
    <Link href={`/destinations/${encodeURIComponent(current.slug)}`} className="dt-hero-photo-link" aria-label={`Explore ${current.name}`}>
      <ResilientImage key={current.slug} className="dt-hero-photo-image" src={current.hero} fallback={`/assets/${current.slug}.svg`} alt={`${current.name} destination photograph`} />
    </Link>
    <div className="hero-caption dt-hero-caption" aria-live="polite" aria-atomic="true"><span>YOUR GROUND PARTNER</span><strong>{current.name}</strong><p>Plan with local knowledge. Execute with purpose.</p></div>
    {canRotate&&<div className="dt-hero-controls" aria-label="Featured destination banner controls">
      <button type="button" aria-label="Previous destination" onClick={()=>navigate(-1)}><ChevronLeft size={17}/></button>
      <span className="dt-hero-counter">{items.findIndex(d=>d.slug===current.slug)+1} / {items.length}</span>
      <button type="button" aria-label="Next destination" onClick={()=>navigate(1)}><ChevronRight size={17}/></button>
      <button type="button" aria-label={paused?'Resume banner rotation':'Pause banner rotation'} aria-pressed={paused} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button>
    </div>}
  </div>;
}
