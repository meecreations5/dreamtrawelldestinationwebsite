'use client';
import { useState, useEffect } from 'react';
import ResilientImage from '@/components/resilient-image';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
export default function PackageGallery({ images, fallback, title }) {
  const photos = Array.isArray(images) ? images.filter(x=>x && typeof x.src==='string' && x.src.trim()) : [];
  const [index,setIndex]=useState(0);
  useEffect(()=>setIndex(0),[title]);
  if (!photos.length) return null;
  const selected=photos[Math.min(index,photos.length-1)];
  return <div className="dt-package-gallery">
    <div className="dt-gallery-stage"><ResilientImage loading="eager" src={selected.src} fallback={fallback} alt={selected.alt||title}/>
      {photos.length>1&&<><button type="button" className="dt-gallery-arrow prev" aria-label="Previous photograph" onClick={()=>setIndex(i=>(i-1+photos.length)%photos.length)}><ChevronLeft size={21}/></button><button type="button" className="dt-gallery-arrow next" aria-label="Next photograph" onClick={()=>setIndex(i=>(i+1)%photos.length)}><ChevronRight size={21}/></button></>}
      <span className="dt-gallery-count"><Images size={15}/> {Math.min(index,photos.length-1)+1} / {photos.length}</span>
    </div>
    {photos.length>1&&<div className="dt-gallery-thumbs" aria-label="Choose package photograph">{photos.map((photo,i)=><button type="button" key={`${photo.src}-${i}`} className={i===index?'active':''} onClick={()=>setIndex(i)} aria-pressed={i===index} aria-label={`View photograph ${i+1}`}><ResilientImage loading="lazy" src={photo.src} fallback={fallback} alt=""/></button>)}</div>}
  </div>;
}
