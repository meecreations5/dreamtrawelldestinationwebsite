'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase-client';
import { DEFAULT_THEME, THEME_FIELDS, THEME_PRESETS, contrastRatio, sanitizeTheme, themeVariables, validateTheme } from '@/lib/site-theme';
import { CheckCircle2, Eye, Palette, RotateCcw, Save, ExternalLink } from 'lucide-react';
import Link from 'next/link';
export default function ThemeEditor({role,uid}) {
  const [palette,setPalette]=useState(DEFAULT_THEME);
  const [published,setPublished]=useState(DEFAULT_THEME);
  const [loading,setLoading]=useState(true),[saving,setSaving]=useState(false);
  const [notice,setNotice]=useState('');
  const [dirty,setDirty]=useState(false);
  async function load() {
    setLoading(true);setNotice('');
    try {
      const snapshot=await getDoc(doc(clientDb(),'siteSettings','theme'));
      const next=snapshot.exists()?sanitizeTheme(snapshot.data()?.palette):DEFAULT_THEME;
      setPublished(next);setPalette(next);setDirty(false);
    } catch(error){setNotice(`Could not load theme: ${error?.message||'Check rules.'}`)}
    finally{setLoading(false)}
  }
  useEffect(()=>{void load()},[]);
  useEffect(()=>{if(!dirty)return;const fn=e=>{e.preventDefault();e.returnValue=''};window.addEventListener('beforeunload',fn);return()=>window.removeEventListener('beforeunload',fn)},[dirty]);
  const validation=validateTheme(palette);
  const canEdit=role==='super_admin';
  async function publish(e) {
    e.preventDefault();if(!canEdit||validation)return;
    setSaving(true);setNotice('');
    try {
      const safe=sanitizeTheme(palette);
      await setDoc(doc(clientDb(),'siteSettings','theme'),{palette:safe,updatedBy:uid,updatedAt:serverTimestamp()});
      setPublished(safe);setDirty(false);setNotice('Theme published. Open the website to see the updated colours. Already-open website tabs will update automatically.');
    }catch(error){setNotice(`Theme could not be published: ${error?.message||'Check Firestore permissions.'}`)}
    finally{setSaving(false)}
  }
  function edit(key,value){setPalette(p=>({...p,[key]:value}));setDirty(true);setNotice('')}
  return <section className="dt-theme-editor">
    <div className="staff-content-head"><div><span className="staff-overline">DESIGN SYSTEM / PUBLIC WEBSITE</span><h2><Palette size={24}/> Colour scheme & appearance</h2><p>Choose a curated palette or change individual colours. Preview before publishing. Your official logo and admin interface are unaffected.</p></div><Link href="/" target="_blank" className="staff-outline"><ExternalLink size={15}/> Open website</Link></div>
    <div className="dt-theme-layout">
      <form onSubmit={publish} className="staff-form-section dt-theme-controls">
        <h3>Choose a colour direction</h3><p className="dt-theme-description">The Pearl Mist preset keeps your navy-and-red brand identity. Background colours and text are adjusted throughout the public website.</p>
        <div className="dt-theme-presets">{THEME_PRESETS.map(preset=><button type="button" key={preset.id} disabled={!canEdit||loading} onClick={()=>{setPalette(sanitizeTheme(preset.palette));setDirty(true)}} className="dt-theme-preset"><span className="dt-theme-preset-swatches">{THEME_FIELDS.slice(0,4).map(({key})=><i key={key} style={{background:preset.palette[key]}}/>)}</span><strong>{preset.name}</strong><small>{preset.description}</small></button>)}</div>
        <div className="dt-theme-fields">{THEME_FIELDS.map(field=><div className="dt-theme-field" key={field.key}><div><strong>{field.label}</strong><small>{field.help}</small></div><label className="dt-theme-colour"><input aria-label={`Choose ${field.label}`} type="color" value={/^#[0-9A-Fa-f]{6}$/.test(palette[field.key]||'')?palette[field.key]:DEFAULT_THEME[field.key]} disabled={!canEdit||loading} onChange={e=>edit(field.key,e.target.value)}/><input aria-label={`${field.label} hex colour`} spellCheck="false" maxLength={7} value={palette[field.key]} disabled={!canEdit||loading} onChange={e=>edit(field.key,e.target.value)}/></label></div>)}</div>
        <div className="dt-theme-contrast"><strong>Contrast checks</strong><span>Body text: {contrastRatio(palette.ink,palette.surface).toFixed(1)}:1</span><span>Navy button: {contrastRatio(palette.navy,'#FFFFFF').toFixed(1)}:1</span><span>Red button: {contrastRatio(palette.red,'#FFFFFF').toFixed(1)}:1</span></div>
        {validation&&<p className="staff-error" role="alert">{validation}</p>}
        {role!=='super_admin'&&<p className="staff-info-alert">Only Super Admin can publish website theme changes.</p>}
        <div className="dt-theme-actions"><button type="submit" className="staff-primary" disabled={!canEdit||!dirty||saving||loading||!!validation}><Save size={16}/>{saving?'Publishing...':'Publish Theme'}</button><button type="button" className="staff-outline" disabled={saving||loading} onClick={()=>{setPalette(published);setDirty(false);setNotice('Preview restored to last published theme.')}}><RotateCcw size={16}/> Discard preview</button></div>
        {notice&&<p role="status" className="staff-info-alert">{notice}</p>}
      </form>
      <div className="dt-theme-preview-column"><div className="dt-theme-preview-label"><Eye size={17}/><strong>Live preview</strong><span>{dirty?'Unpublished changes':'Published theme'}</span></div>
        <div className="dt-theme-preview" style={themeVariables(palette)}>
          <div className="dt-theme-preview-top"><span>DREAMTRAWELL DESTINATION</span><span>REALIZE THE EXPERIENCE.</span></div>
          <div className="dt-theme-preview-content"><small>CURATED DESTINATIONS / CONSIDERED EXPERIENCES</small><h3>Exceptional places.<br/><em>Thoughtful journeys.</em></h3><p>Destination-led planning and dependable ground support for travel professionals.</p><div className="dt-theme-preview-actions"><span>Explore destinations</span><span>Request a quotation</span></div></div>
          <div className="dt-theme-preview-card"><div className="dt-theme-card-image">SINGAPORE / 3 NIGHTS</div><div><small>FEATURED PROGRAMME</small><h4>Singapore Essentials</h4><p>Explore a considered programme, then personalise it for your traveller.</p><b>View programme ↗</b></div></div>
        </div>
        <div className="dt-theme-preview-note"><CheckCircle2 size={16}/><span>Preview only. Publishing updates public colours; banner settings, site copy and the admin layout remain independent.</span></div>
      </div>
    </div>
  </section>;
}
