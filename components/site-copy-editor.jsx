'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase-client';
import { DEFAULT_SITE_COPY, SITE_COPY_FIELDS } from '@/lib/site-copy-defaults';
import { Save, RotateCcw, Globe2 } from 'lucide-react';

export default function SiteCopyEditor({ role, uid }) {
  const [copy, setCopy] = useState(DEFAULT_SITE_COPY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);
  async function load() {
    setLoading(true);
    try {
      const docRef = doc(clientDb(), 'siteSettings', 'publicCopy');
      const snap = await getDoc(docRef);
      setCopy({ ...DEFAULT_SITE_COPY, ...(snap.data()?.copy || {}) });
      setDirty(false);setMessage('');
    } catch (error) { setMessage('Unable to read website copy: ' + (error?.message || 'Unknown error')); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  async function save(e) {
    e.preventDefault();
    if (role !== 'super_admin') return;
    setSaving(true);setMessage('');
    try {
      const safe = Object.fromEntries(SITE_COPY_FIELDS.map(({key}) => [key, String(copy[key] || '').trim().slice(0,500)]));
      await setDoc(doc(clientDb(), 'siteSettings', 'publicCopy'), {copy:safe, updatedAt: serverTimestamp(), updatedBy:uid});
      setDirty(false); setMessage('Website copy saved. Refresh the public pages to view the update.');
    } catch(error) {setMessage('Save failed: ' + (error?.message || 'Check deployed Firestore rules.'));}
    finally {setSaving(false);}
  }
  return <section className="staff-form-section v12-sitecopy">
    <div className="staff-section-head"><h2><Globe2 size={21}/> Website text & brand copy</h2><p>Edit visible headings and introductions without changing code. The approved logo and tagline remain locked.</p></div>
    <p className="staff-info-alert">This controls the main hero/introduction copy and footer. Destination and package content are managed in their respective sections; other supporting sections remain code-defined.</p>
    <form onSubmit={save}>
      <div className="staff-fields-grid">{SITE_COPY_FIELDS.map(({key,label,multiline}) =>
        <label className={`staff-field ${multiline?'full':''}`} key={key}>{label}
          {multiline ? <textarea rows={3} maxLength={500} value={copy[key] || ''} disabled={role!=='super_admin'||loading} onChange={e=>{setCopy({...copy,[key]:e.target.value});setDirty(true);}}/> :
           <input maxLength={500} value={copy[key]||''} disabled={role!=='super_admin'||loading} onChange={e=>{setCopy({...copy,[key]:e.target.value});setDirty(true);}}/>}
        </label>)}
      </div>
      <div className="v12-sitecopy-actions"><button className="staff-primary" type="submit" disabled={role!=='super_admin'||saving||loading||!dirty}><Save size={16}/> {saving?'Saving...':'Save website text'}</button>
      <button className="staff-outline" type="button" onClick={()=>void load()} disabled={saving||loading}><RotateCcw size={16}/> Reload published text</button></div>
      {role!=='super_admin'&&<p className="muted">Only Super Admin can update these shared website messages.</p>}
      {message&&<p className="staff-info-alert" role="status">{message}</p>}
    </form>
  </section>;
}
