'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase-client';
import { PAGE_DEFINITIONS, initialPage } from '@/lib/site-page-defaults';
import { PAGE_TEXT_FIELDS } from '@/lib/page-text-fields';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, RefreshCw, ExternalLink } from 'lucide-react';

const MAX_SECTIONS=24;
const MAX_FAQS=30;
function cleanString(s,max=1600){return String(s??'').trim().slice(0,max)}
function cleanPage(src,key,status){
 return { slug:key, status,
   heroTitle:cleanString(src.heroTitle,180),heroDescription:cleanString(src.heroDescription,600),
   contactDetails:Object.fromEntries(['location','email','phone','privacyEmail','legalName'].map(k=>[k,cleanString(src.contactDetails?.[k],150)])),
   textOverrides:Object.fromEntries(Object.entries(src.textOverrides||{}).filter(([key])=>/^(heading|paragraph|subheading)[0-9]{2}$/.test(key)).slice(0,100).map(([key,value])=>[key,cleanString(value,1800)]).filter(([,value])=>value)),
   seoTitle:cleanString(src.seoTitle,120),seoDescription:cleanString(src.seoDescription,250),socialImage:cleanString(src.socialImage,1200),
   sections:(src.sections||[]).slice(0,MAX_SECTIONS).map(s=>({type:'text',heading:cleanString(s.heading,180),body:cleanString(s.body,2400),items:(s.items||[]).slice(0,16).map(v=>cleanString(v,220)).filter(Boolean)})),
   faqs:(src.faqs||[]).slice(0,MAX_FAQS).map(f=>({question:cleanString(f.question,220),answer:cleanString(f.answer,1500)}))
 };
}
export default function PageContentEditor({role,uid}) {
 const [key,setKey]=useState('home');const [page,setPage]=useState(initialPage('home'));const [busy,setBusy]=useState(true);const [saving,setSaving]=useState(false);const [message,setMessage]=useState('');const [dirty,setDirty]=useState(false);
 const superAdmin=role==='super_admin';
 useEffect(()=>{let live=true;setBusy(true);setMessage('');setDirty(false);(async()=>{try{const [snap,draft]=await Promise.all([getDoc(doc(clientDb(),'sitePages',key)),getDoc(doc(clientDb(),'sitePageDrafts',key))]);if(live)setPage({...initialPage(key),...(snap.exists()?snap.data():{}),...(draft.exists()?draft.data():{}),slug:key});}catch(e){if(live){setPage(initialPage(key));setMessage(`Could not read saved page: ${e.message}`)}}finally{if(live)setBusy(false)}})();return()=>{live=false}},[key]);
 const patch=(name,val)=>{setPage(p=>({...p,[name]:val}));setDirty(true)};
 const editSection=(i,field,value)=>patch('sections',page.sections.map((s,j)=>i===j?{...s,[field]:value}:s));
 const editFaq=(i,field,value)=>patch('faqs',page.faqs.map((s,j)=>i===j?{...s,[field]:value}:s));
 const swap=(field,i,by)=>{const next=[...page[field]],j=i+by;if(j<0||j>=next.length)return;[next[i],next[j]]=[next[j],next[i]];patch(field,next)};
 async function save(status){if(!superAdmin)return;if(status==='published'&&!window.confirm('Publish this page, FAQ or SEO change to the public website? Review legal text and contact information first.'))return;setSaving(true);setMessage('');try{
   const record=cleanPage(page,key,status);
   if(!record.seoTitle||!record.seoDescription)throw new Error('SEO title and description are required.');
   if(status==='published'&&['privacy-policy','terms-of-use','cookies'].includes(key)&&!window.confirm('These are policy drafts. Has the appropriate company/legal reviewer verified the actual privacy practices and terms?')){setSaving(false);return;}
   await setDoc(doc(clientDb(),status==='draft'?'sitePageDrafts':'sitePages',key),{...record,updatedBy:uid,updatedAt:serverTimestamp()});
   if(status==='published'){try{await deleteDoc(doc(clientDb(),'sitePageDrafts',key))}catch{/* A stale private draft can be overwritten later; the public page is already published. */}}
   setPage(record);setDirty(false);setMessage(`${PAGE_DEFINITIONS[key].name} saved as ${status}. Public pages may need a refresh.`);
  }catch(e){setMessage('Save failed: '+(e?.message||'Review Firestore rules.'))}finally{setSaving(false)}}
 const input=(label,name,max=500,rows=0,help='')=><label className="staff-field full">{label}{rows?<textarea rows={rows} maxLength={max} value={page[name]||''} onChange={e=>patch(name,e.target.value)} disabled={!superAdmin||busy}/>:<input maxLength={max} value={page[name]||''} onChange={e=>patch(name,e.target.value)} disabled={!superAdmin||busy}/>} {help&&<small>{help}</small>}</label>;
 return <section className="staff-form-section staff-page-cms"><div className="staff-section-head"><h2>Pages, FAQs & on-page SEO</h2><p>Manage legal/information pages, additional editorial sections and search metadata. Programme, destination, package and offer records are still edited in their dedicated modules.</p></div>
 <div className="staff-page-list">{Object.entries(PAGE_DEFINITIONS).map(([id,d])=><button type="button" className={key===id?'active':''} key={id} onClick={()=>{if(dirty&&!window.confirm('Discard unsaved edits?'))return;setKey(id)}}>{d.name}</button>)}</div>
 {busy?<p>Loading page...</p>:<><div className="staff-info-alert"><b>{PAGE_DEFINITIONS[key].name}</b> · {PAGE_DEFINITIONS[key].path} · {page.status==='published'?'Published':'Not published in CMS'} <a href={PAGE_DEFINITIONS[key].path} target="_blank" rel="noreferrer"><ExternalLink size={14}/> Preview public route</a></div>
 <div className="staff-fields-grid">
 {input('Search result / browser title','seoTitle',120,0,'Use a natural title, usually around 45–65 characters. The site adds the brand where appropriate.')}
 {input('Meta description','seoDescription',250,3,'Unique description of this page, typically around 120–160 characters.')}
 {input('Social-sharing image URL (optional)','socialImage',1200,0,'Use a verified HTTPS image. Leave blank to use the site image.')}
 {input('Page hero title override (optional)','heroTitle',180,0,'Overrides the visible hero title on standard static pages. Blank preserves the approved layout copy.')}
 {input('Page hero description override (optional)','heroDescription',600,3,'Blank preserves the existing visible introduction.')}
 </div>
 {key==='contact'&&<><hr/><h3>Verified contact & legal identity</h3><p className="staff-help">Use only company-approved contact details. These appear in the footer and contact page; inaccurate details should not be published.</p><div className="staff-fields-grid">{[{id:'location',label:'Office city / region'},{id:'email',label:'Public trade email'},{id:'phone',label:'Public trade phone'},{id:'privacyEmail',label:'Privacy / grievance email'},{id:'legalName',label:'Registered legal entity name'}].map(f=><label className="staff-field" key={f.id}>{f.label}<input maxLength={150} value={page.contactDetails?.[f.id]||''} disabled={!superAdmin} onChange={e=>patch('contactDetails',{...(page.contactDetails||{}),[f.id]:e.target.value})}/></label>)}</div></>}
 <hr/><details className="staff-page-block" open><summary><strong>Existing page content: headings & paragraphs ({PAGE_TEXT_FIELDS[key]?.length||0} fields)</strong></summary><p className="staff-help">Only add an override where you want different text. Blank fields keep the approved typography and original source content. Some button labels, layout labels and structured catalogue content are edited elsewhere.</p>
 <div className="staff-fields-grid">{(PAGE_TEXT_FIELDS[key]||[]).map(field=><label key={field.id} className="staff-field full">{field.label}{field.id.startsWith('paragraph')?<textarea rows={3} maxLength={1800} value={page.textOverrides?.[field.id]||''} placeholder={field.hint} disabled={!superAdmin||busy} onChange={e=>patch('textOverrides',{...(page.textOverrides||{}),[field.id]:e.target.value})}/>:<input maxLength={1800} value={page.textOverrides?.[field.id]||''} placeholder={field.hint} disabled={!superAdmin||busy} onChange={e=>patch('textOverrides',{...(page.textOverrides||{}),[field.id]:e.target.value})}/>}</label>)}</div></details>
 <hr/><div className="staff-group-title"><h3>Additional editable page sections</h3><button className="staff-outline" type="button" disabled={!superAdmin||page.sections.length>=MAX_SECTIONS} onClick={()=>patch('sections',[...page.sections,{type:'text',heading:'',body:'',items:[]}])}><Plus size={16}/> Add section</button></div>
 <p className="staff-help">These editorial sections appear after the page's core modules. The existing complex layouts remain intact. Legal pages use these sections as their main content. Leave them empty where not needed.</p>
 {page.sections.map((s,i)=><div key={i} className="staff-page-block"><header><b>Section {i+1}</b><div><button type="button" title="Move up" onClick={()=>swap('sections',i,-1)} disabled={!superAdmin||i===0}><ArrowUp size={16}/></button><button type="button" title="Move down" onClick={()=>swap('sections',i,1)} disabled={!superAdmin||i===page.sections.length-1}><ArrowDown size={16}/></button><button type="button" title="Remove" onClick={()=>patch('sections',page.sections.filter((_,j)=>i!==j))} disabled={!superAdmin}><Trash2 size={16}/></button></div></header><div className="staff-fields-grid"><label className="staff-field full">Heading<input maxLength={180} value={s.heading||''} onChange={e=>editSection(i,'heading',e.target.value)} disabled={!superAdmin}/></label><label className="staff-field full">Body text<textarea maxLength={2400} rows={5} value={s.body||''} onChange={e=>editSection(i,'body',e.target.value)} disabled={!superAdmin}/></label><label className="staff-field full">Optional bullet list (one per line)<textarea rows={3} value={(s.items||[]).join('\n')} onChange={e=>editSection(i,'items',e.target.value.split('\n').slice(0,16))} disabled={!superAdmin}/></label></div></div>)}
 {key==='faqs'&&<><hr/><div className="staff-group-title"><h3>Questions & answers</h3><button type="button" className="staff-outline" disabled={!superAdmin||page.faqs.length>=MAX_FAQS} onClick={()=>patch('faqs',[...page.faqs,{question:'',answer:''}])}><Plus size={16}/> Add FAQ</button></div>{page.faqs.map((f,i)=><div className="staff-page-block" key={i}><header><b>FAQ {i+1}</b><div><button title="Move up" type="button" disabled={!superAdmin||i===0} onClick={()=>swap('faqs',i,-1)}><ArrowUp size={16}/></button><button title="Move down" type="button" disabled={!superAdmin||i===page.faqs.length-1} onClick={()=>swap('faqs',i,1)}><ArrowDown size={16}/></button><button title="Remove" type="button" disabled={!superAdmin} onClick={()=>patch('faqs',page.faqs.filter((_,j)=>i!==j))}><Trash2 size={16}/></button></div></header><label className="staff-field">Question<input maxLength={220} value={f.question} onChange={e=>editFaq(i,'question',e.target.value)} disabled={!superAdmin}/></label><label className="staff-field full">Answer<textarea rows={3} maxLength={1500} value={f.answer} onChange={e=>editFaq(i,'answer',e.target.value)} disabled={!superAdmin}/></label></div>)}</>}
 <div className="v12-sitecopy-actions"><button className="staff-primary" type="button" disabled={!superAdmin||saving||busy} onClick={()=>save('published')}><Save size={16}/>{saving?'Saving...':'Publish page'}</button><button className="staff-outline" type="button" disabled={!superAdmin||saving||busy} onClick={()=>save('draft')}>Save as draft</button><button className="staff-outline" type="button" disabled={busy||saving} onClick={()=>{setPage(initialPage(key));setDirty(true)}}><RefreshCw size={16}/> Reset fields locally</button></div>
 {!superAdmin&&<p className="staff-help">Only Super Admin can publish website pages and SEO changes.</p>}{message&&<p role="status" className="staff-info-alert">{message}</p>}
 </>}</section>;
}
