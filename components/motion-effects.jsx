'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
export default function MotionEffects(){const pathname=usePathname();useEffect(()=>{
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce)return;
 const elements=document.querySelectorAll('.section-heading, .v11-service-card, .v11-story-card, .steps-grid > div, .destination-knowledge-card');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('v11-visible');observer.unobserve(entry.target)}}),{threshold:.08});
 elements.forEach(el=>{el.classList.add('v11-reveal');observer.observe(el)});
 return()=>observer.disconnect();
 },[pathname]);return null;}
