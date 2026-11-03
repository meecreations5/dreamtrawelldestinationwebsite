'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { House, Compass, BriefcaseBusiness, FilePenLine, MoreHorizontal, X, Headset, Handshake, Building2, Info, MessageSquareQuote } from 'lucide-react';
const links=[['Discover','/',House],['Explore','/destinations',Compass],['Packages','/packages',BriefcaseBusiness]];
const more=[['Contact trade desk','/contact',Headset],['For travel agents','/partners',Handshake],['DMC services','/services',Building2],['About us','/about',Info],['Partner feedback','/testimonials',MessageSquareQuote]];
export default function MobileDock(){
  const pathname=usePathname(); const [open,setOpen]=useState(false); const sheetRef=useRef(null);
  useEffect(()=>setOpen(false),[pathname]);
  useEffect(()=>{
    if(!open)return;
    function onKey(e){if(e.key==='Escape')setOpen(false)}
    function onPointer(e){if(sheetRef.current&&!sheetRef.current.contains(e.target)&&!e.target.closest('.dt-mobile-dock'))setOpen(false)}
    window.addEventListener('keydown',onKey);document.addEventListener('pointerdown',onPointer);
    return()=>{window.removeEventListener('keydown',onKey);document.removeEventListener('pointerdown',onPointer)};
  },[open]);
  const active = href => href==='/'?pathname==='/':pathname===href||pathname.startsWith(href+'/');
  const selectedPkg=pathname.startsWith('/packages/')?pathname.split('/')[2]:'';
  const quoteHref=selectedPkg?`/customise?package=${encodeURIComponent(selectedPkg)}`:'/customise';
  return <>
    {open&&<div ref={sheetRef} className="dt-more-sheet" aria-label="Additional website pages" id="dt-mobile-more">
      <div className="dt-more-heading"><strong>Explore DreamTrawell</strong><button aria-label="Close additional menu" type="button" onClick={()=>setOpen(false)}><X size={20}/></button></div>
      {more.map(([name,href,Icon])=><Link onClick={()=>setOpen(false)} key={href} href={href}><Icon size={18}/>{name}</Link>)}
    </div>}
    <nav className="dt-mobile-dock" aria-label="Mobile quick navigation">
      {links.map(([label,href,Icon])=><Link key={href} aria-current={active(href)?'page':undefined} href={href} className={active(href)?'active':''}><Icon size={20} strokeWidth={1.8}/><span>{label}</span></Link>)}
      <Link href={quoteHref} aria-current={pathname.startsWith('/customise')?'page':undefined} className={pathname.startsWith('/customise')?'active':''}><FilePenLine size={20} strokeWidth={1.8}/><span>Quote</span></Link>
      <button type="button" aria-expanded={open} aria-controls="dt-mobile-more" className={open?'active':''} onClick={()=>setOpen(!open)}><MoreHorizontal size={20} strokeWidth={1.8}/><span>More</span></button>
    </nav>
  </>;
}
