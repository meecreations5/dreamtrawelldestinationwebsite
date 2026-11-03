'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Images, ExternalLink, Save, RefreshCcw, Info } from 'lucide-react';
import Link from 'next/link';
import { clientDb } from '@/lib/firebase-client';
import { fetchAdminItems } from '@/lib/client-operations';
import { DEFAULT_HOME_HERO, sanitizeHomeHero } from '@/lib/home-hero-settings';
import ResilientImage from '@/components/resilient-image';

export default function HomeHeroEditor({role,uid}) {
  const [config,setConfig]=useState(DEFAULT_HOME_HERO);
  const [published,setPublished]=useState(DEFAULT_HOME_HERO);
  const [destinations,setDestinations]=useState([]);
  const [loading,setLoading]=useState(true),[saving,setSaving]=useState(false);
  const [notice,setNotice]=useState('');
  const canEdit=role==='super_admin';
  async function load(){
    setLoading(true);setNotice('');
    try {
      const [snapshot,rows]=await Promise.all([
        getDoc(doc(clientDb(),'siteSettings','homeHero')),
        fetchAdminItems('destinations'),
      ]);
      const next=snapshot.exists()?sanitizeHomeHero(snapshot.data()):DEFAULT_HOME_HERO;
      setConfig(next);setPublished(next);
      setDestinations(rows.filter(d=>d.status==='published'&&d.slug&&d.hero).sort((a,b)=>a.name.localeCompare(b.name)));
    }catch(error){setNotice(`Unable to load banner settings: ${error?.message||'Check Firestore rules.'}`)}
    finally{setLoading(false)}
  }
  useEffect(()=>{void load()},[]);
  const selected=destinations.find(d=>d.slug===config.destinationSlug);
  const fixed=config.mode==='fixed'&&!!selected;
  const valid=config.mode!=='fixed'||!!selected;
  async function publish(event){
    event.preventDefault();if(!canEdit||!valid)return;
    setSaving(true);setNotice('');
    try {
      const safe=sanitizeHomeHero(config);
      await setDoc(doc(clientDb(),'siteSettings','homeHero'),{...safe,updatedBy:uid,updatedAt:serverTimestamp()});
      setPublished(safe);setConfig(safe);
      setNotice('Homepage banner settings published. Refresh the public homepage to see them.');
    }catch(error){setNotice(`Could not publish banner settings: ${error?.message||'Check Firestore Rules.'}`)}
    finally{setSaving(false)}
  }
  return <section className="dt-banner-editor">
    <div className="staff-content-head"><div><span className="staff-overline">HOMEPAGE / VISUAL CONTENT</span><h2><Images size={24}/> Homepage destination banner</h2><p>Choose one published destination to feature, or automatically rotate all published destination photographs.</p></div><Link className="staff-outline" href="/" target="_blank"><ExternalLink size={15}/> Open homepage</Link></div>
    <div className="dt-banner-layout">
      <form className="staff-form-section" onSubmit={publish}>
        <h3>Banner display</h3>
        <div className="dt-banner-radio-group">
          <label><input type="radio" name="bannerMode" checked={config.mode==='auto'} disabled={!canEdit||loading} onChange={()=>setConfig(c=>({...c,mode:'auto',destinationSlug:''}))}/> Automatic rotation <small>Default when no destination has been selected</small></label>
          <label><input type="radio" name="bannerMode" checked={config.mode==='fixed'} disabled={!canEdit||loading} onChange={()=>setConfig(c=>({...c,mode:'fixed',destinationSlug:c.destinationSlug||destinations[0]?.slug||''}))}/> Fixed destination <small>Keep one selected destination on the homepage</small></label>
        </div>
        {config.mode==='fixed'?<label className="staff-field">Destination
          <select value={config.destinationSlug} disabled={!canEdit||loading} onChange={e=>setConfig(c=>({...c,destinationSlug:e.target.value}))}>
            <option value="">Select published destination</option>{destinations.map(d=><option key={d.slug} value={d.slug}>{d.name}</option>)}
          </select>
        </label>:<label className="staff-field">Rotate banner every
          <select value={config.intervalSeconds} disabled={!canEdit||loading} onChange={e=>setConfig(c=>({...c,intervalSeconds:Number(e.target.value)}))}>
            {[6,8,12].map(v=><option key={v} value={v}>{v} seconds</option>)}
          </select>
        </label>}
        <p className="dt-banner-note"><Info size={16}/> Images come from Admin → Destinations → Cover photograph. Only published destinations with an image participate.</p>
        {!valid&&<p className="staff-error" role="alert">Select a published destination before saving fixed mode.</p>}
        {!canEdit&&<p className="staff-info-alert">Only Super Admin can publish homepage banner changes.</p>}
        <div className="dt-banner-actions"><button className="staff-primary" disabled={!canEdit||loading||saving||!valid} type="submit"><Save size={16}/>{saving?'Publishing...':'Publish Banner'}</button><button className="staff-outline" type="button" disabled={saving||loading} onClick={()=>{setConfig(published);setNotice('Restored the published banner settings.')}}><RefreshCcw size={16}/> Revert</button></div>
        {notice&&<p role="status" className="staff-info-alert">{notice}</p>}
      </form>
      <div className="staff-form-section"><h3>Destination image preview</h3><p className="dt-banner-muted">{fixed?`Featured destination: ${selected.name}`:`Automatic rotation across ${destinations.length} published destinations`}</p>
        {selected&&config.mode==='fixed'&&<div className="dt-banner-main-preview"><ResilientImage src={selected.hero} fallback={`/assets/${selected.slug}.svg`} alt={`${selected.name} homepage banner preview`}/><strong>{selected.name}</strong></div>}
        <div className="dt-banner-dest-grid">{destinations.map(d=><button key={d.slug} type="button" disabled={!canEdit||loading} onClick={()=>setConfig(c=>({...c,mode:'fixed',destinationSlug:d.slug}))} className={fixed&&selected.slug===d.slug?'selected':''}><ResilientImage src={d.hero} fallback={`/assets/${d.slug}.svg`} alt={`${d.name} cover`}/><span>{d.name}</span></button>)}</div>
        {destinations.length===0&&<p className="staff-info-alert">No published destination images found. Publish a destination with a cover photograph first.</p>}
      </div>
    </div>
  </section>;
}
