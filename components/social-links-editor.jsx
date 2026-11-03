'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase-client';
import { SOCIAL_KEYS, SOCIAL_LINKS_EMPTY, SOCIAL_PROVIDERS, validSocialLink, sanitizeSocialLinks } from '@/lib/social-links';
import SocialLinks from '@/components/social-links';
import { Save, ExternalLink } from 'lucide-react';

export default function SocialLinksEditor({role,uid}) {
  const [links,setLinks] = useState({...SOCIAL_LINKS_EMPTY});
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [notice,setNotice] = useState('');
  const [error,setError] = useState('');
  useEffect(()=>{
    let active=true;
    getDoc(doc(clientDb(),'siteSettings','social')).then(snap=>{
      if(active && snap.exists())setLinks(sanitizeSocialLinks(snap.data()?.links));
    }).catch(e=>{if(active)setError(e.message||'Could not load social links.');}).finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[]);
  const invalid=SOCIAL_KEYS.filter(key=>!validSocialLink(key,links[key]));
  async function publish(e){
    e.preventDefault();
    setNotice('');setError('');
    if(role!=='super_admin'||invalid.length)return;
    setSaving(true);
    try{
      await setDoc(doc(clientDb(),'siteSettings','social'),{
        links:sanitizeSocialLinks(links),updatedBy:uid,updatedAt:serverTimestamp()
      });
      setLinks(sanitizeSocialLinks(links));
      setNotice('Social media links published. Refresh the public website to see the icons.');
    }catch(e){setError(e.message||'Unable to publish. Check the deployed Firestore Rules.');}
    finally{setSaving(false)}
  }
  return <section className="staff-form-section dt-social-editor">
    <div className="staff-section-head"><h3>Social media & brand links</h3><p>Only add verified DreamTrawell business profiles. Unfilled platforms stay hidden on the public website. The favicon is derived from the approved logo and is included automatically.</p></div>
    {loading?<p>Loading social links...</p>:<form onSubmit={publish}>
      <div className="staff-fields-grid">
        {SOCIAL_KEYS.map(key=><label className="staff-field" key={key}>
          {SOCIAL_PROVIDERS[key].label}
          <input type="url" inputMode="url" autoComplete="url" value={links[key]} placeholder={SOCIAL_PROVIDERS[key].sample}
            onChange={e=>setLinks(old=>({...old,[key]:e.target.value}))}
            aria-invalid={!validSocialLink(key,links[key])} disabled={role!=='super_admin'} maxLength={400}/>
          {!validSocialLink(key,links[key])&&<small className="staff-error">Enter a secure link to the correct {SOCIAL_PROVIDERS[key].label} website.</small>}
        </label>)}
      </div>
      <div className="dt-social-preview"><strong>Footer icon preview</strong><SocialLinks links={links}/><small>Only links to the corresponding official domains are accepted.</small></div>
      <div className="staff-editor-actions">
        <button type="submit" className="staff-primary" disabled={saving||role!=='super_admin'||invalid.length>0}><Save size={16}/>{saving?'Publishing...':'Publish social links'}</button>
        <a href="/" target="_blank" rel="noopener noreferrer" className="staff-outline"><ExternalLink size={16}/> Open website</a>
      </div>
    </form>}
    {notice&&<p role="status" className="staff-success">{notice}</p>}
    {error&&<p role="alert" className="staff-error">{error}</p>}
  </section>;
}
