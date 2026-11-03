'use client';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, OAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { clientAuth } from '@/lib/firebase-client';
import { getAdminRole, fetchAdminItems, saveCmsItem, saveEnquiryStatus, uploadWebsiteImage, importStarterCatalogue } from '@/lib/client-operations';
import seedDestinations from '@/data/destinations.json';
import seedPackages from '@/data/packages.json';
import { Lock, LogOut, Save, Plus, RefreshCw, UploadCloud, Search } from 'lucide-react';
import { AdminWorkspace } from '@/components/admin-workspace';
const modules = ['overview','theme', 'homeHero', 'siteCopy','pagesSEO','destinations','packages','media','library','promotions','testimonials','enquiries','team'];
const blank = { packages: { slug: '', title: '', destination: 'Singapore', category: 'Standard', duration: '3N / 4D', nights: 3, audience: 'FIT / Family', summary: '', image: '', imageAlt: '', gallery: [], days: [{ label: 'DAY 01', title: 'Arrival', description: '' }], inclusions: [], upgrades: [], status: 'draft' }, destinations: { slug: '', name: '', eyebrow: '', summary: '', hero: '', areas: [], activities: [], guidance: '', destinationHeadline:'', destinationOverview:'', sellingAreas:[], travellerProfiles:[], planningHeadline:'', planningNote:'', experienceHighlights:[], areaProfiles: [], standardExperiences: [], offbeatIdeas: [], hotelGuidance: '', operationalNotes: '', status: 'draft' }, testimonials: { slug: '', name: '', agency: '', destination: '', quote: '', consentVerified: false, status: 'draft' }, promotions: { slug: '', title: '', destination: '', summary: '', validFrom: '', validUntil: '', status: 'draft' } };
export function AdminPanel() {
    const [user, setUser] = useState(null);
    const [initial, setInitial] = useState(true);
    const [configuration, setConfiguration] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [password, setPassword] = useState('');
    const [module, setModule] = useState('overview');
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [dirty,setDirty]=useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [authBusy, setAuthBusy] = useState(false);
    const [access, setAccess] = useState('signed_out');
    const [accessMessage, setAccessMessage] = useState('');
    const [role, setRole] = useState(null);
    useEffect(() => { try {
        const auth = clientAuth();
        return onAuthStateChanged(auth, u => { setUser(u); setInitial(false); });
    }
    catch (e) {
        setConfiguration(e instanceof Error ? e.message : 'Auth not configured');
        setInitial(false);
    } }, []);
    useEffect(()=>{const warn=e=>{if(dirty){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn)},[dirty]);
    // Firestore Rules enforce this same role independently on every read/write.
    useEffect(() => {
        let cancelled = false;
        if (!user || user.isAnonymous) { setAccess('signed_out'); setRole(null); return; }
        setAccess('checking');
        setAccessMessage('');
        (async () => {
            try {
                const verifiedRole = await getAdminRole(user);
                if (!cancelled) {
                    setRole(verifiedRole);
                    setAccess(verifiedRole ? 'granted' : 'denied');
                    setAccessMessage(verifiedRole ? '' : 'This Microsoft account does not have an active administrator role.');
                }
            } catch (e) {
                if (!cancelled) { setAccess('denied'); setAccessMessage(e?.message || 'Unable to verify access.'); }
            }
        })();
        return () => { cancelled = true; };
    }, [user]);
    function loginError(error) {
        const messages = {
            'auth/popup-closed-by-user': 'Microsoft sign-in was cancelled.',
            'auth/popup-blocked': 'Your browser blocked the Microsoft sign-in window. Allow pop-ups and try again.',
            'auth/operation-not-allowed': 'Microsoft sign-in is not enabled in Firebase Authentication yet.',
            'auth/unauthorized-domain': 'Add this website domain to Firebase Authentication authorised domains.',
            'auth/account-exists-with-different-credential': 'An account already exists with this email using another sign-in method. Sign in with the existing method and ask an administrator to link Microsoft to that account.',
            'auth/network-request-failed': 'Network error. Check your connection and retry.',
        };
        return messages[error?.code] || (error instanceof Error ? error.message : 'Unable to sign in');
    }
    async function loginMicrosoft() {
        setMessage('');
        setAuthBusy(true);
        try {
            const provider = new OAuthProvider('microsoft.com');
            // A single-tenant Microsoft Entra app may require the Directory (tenant) ID.
            const tenantId = process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID;
            if (tenantId) provider.setCustomParameters({ tenant: tenantId });
            // No Microsoft Graph permissions are requested: login only.
            await signInWithPopup(clientAuth(), provider);
        } catch (error) {
            setMessage(loginError(error));
        } finally {
            setAuthBusy(false);
        }
    }
    async function fetchData(next = module) {
        if (!user || access !== 'granted') return;
        if(['overview','theme','homeHero','siteCopy','pagesSEO','team','media','library'].includes(next)) {setItems([]);setActive(null);return;}
        setLoading(true); setMessage('');
        try { setItems(await fetchAdminItems(next)); setActive(null); }
        catch (e) { setMessage(e?.message || 'Unable to load records. Check Firestore Security Rules.'); }
        finally { setLoading(false); }
    }
    useEffect(() => { if (user && access === 'granted')
        void fetchData(module); }, [user, module, access]);
    async function login(e) {
        e.preventDefault();
        setMessage('');
        setAuthBusy(true);
        try {
            await signInWithEmailAndPassword(clientAuth(), loginEmail, password);
        } catch (error) {
            setMessage(loginError(error));
        } finally {
            setAuthBusy(false);
        }
    }
    function chooseModule(next) { if(dirty && !window.confirm('Discard unsaved changes?'))return;setDirty(false); if(next==='team' && role!=='super_admin')return;setModule(next);setItems([]);setActive(null);setIsNew(false); }
    function newItem() { if(dirty&&!window.confirm('Discard unsaved edits?'))return;setDirty(false);setActive(structuredClone(blank[module] || {})); setIsNew(true); }
    function update(key, value) { setDirty(true);setActive((old) => ({ ...old, [key]: value })); }
    async function save() {
        if (!user || !active) return;
        setLoading(true); setMessage('');
        try {
            const savedSlug = await saveCmsItem(module, active, isNew, user.uid);
            const fresh = await fetchAdminItems(module);
            setItems(fresh);
            setActive(fresh.find(item => item.slug === savedSlug) || null);
            setIsNew(false);setDirty(false);
            setMessage('Content saved. Published content will appear on the public website.');
        } catch (e) { setMessage(e?.message || 'Unable to save record.'); }
        finally { setLoading(false); }
    }
    async function uploadImage(file, key) {
        if (!user) return;
        setLoading(true); setMessage('');
        try {
            const url = await uploadWebsiteImage(file, user.uid);
            if (key.startsWith('gallery:')) {
                const index = Number(key.split(':')[1]);
                setDirty(true);
                setActive(old => ({ ...old, gallery: (old.gallery || []).map((photo, i) => i === index ? {...photo, url} : photo) }));
            } else update(key, url);
            setMessage('Image uploaded to Firebase Storage. Save the record to publish changes.');
        } catch (e) { setMessage(e?.message || 'Upload failed.'); }
        finally { setLoading(false); }
    }
    async function changeEnquiry(reference, status) {
        if (!user) return;
        try {
            await saveEnquiryStatus(active.id, status, user.uid);
            const fresh = await fetchAdminItems('enquiries');
            setItems(fresh);
            setActive(fresh.find(item => item.id === active.id) || null);
            setMessage('Enquiry status updated.');
        } catch (e) { setMessage(e?.message || 'Unable to update enquiry.'); }
    }
    async function importCatalogue() {
        if (!user || role !== 'super_admin') return;
        if (!window.confirm('Import the 7 draft destination profiles and 29 package frameworks to Firestore? This can only be done once.')) return;
        setLoading(true); setMessage('');
        try {
            const count = await importStarterCatalogue(user.uid, seedDestinations, seedPackages);
            setMessage(`Imported ${count} destination and package records. Review content before sharing with agents.`);
            await fetchData(module);
        } catch(e) { setMessage(e?.message || 'Catalogue import failed.'); }
        finally { setLoading(false); }
    }
    if (initial)
        return <div id="main" className="shell section">Loading staff access...</div>;
    if (configuration)
        return <div id="main" className="shell admin-login"><Lock size={34}/><h1>Website Management</h1><p>{configuration}</p><p>Configure your Firebase web app in <code>.env.local</code>, then enable the Microsoft provider in Firebase Authentication.</p></div>;
    if (!user || user.isAnonymous)
        return <section id="main" className="shell admin-login" aria-label="Staff sign-in">
            <Lock size={32}/>
            <span className="eyebrow">DREAMTRAWELL · STAFF ONLY</span>
            <h1>Website Management</h1>
            <p>Sign in with your authorised Microsoft work account to manage destinations, packages and enquiries.</p>
            <button type="button" className="microsoft-login" onClick={loginMicrosoft} disabled={authBusy}>
                <span className="ms-mark" aria-hidden="true"><i/><i/><i/><i/></span>
                {authBusy ? 'Connecting to Microsoft...' : 'Continue with Microsoft'}
            </button>
            <p className="admin-login-help">Only staff whose Firebase UID is approved in the adminUsers collection can manage the website.</p>
            <details className="admin-login-fallback">
                <summary>Use email and password instead</summary>
                <form onSubmit={login}>
                    <label>Staff email<input type="email" autoComplete="username" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required/></label>
                    <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required/></label>
                    <button className="btn btn-outline" type="submit" disabled={authBusy}>Sign in with email</button>
                </form>
            </details>
            {message && <div className="form-error" role="alert">{message}</div>}
        </section>;
    if (access === 'checking')
        return <section id="main" className="shell admin-login"><Lock size={32}/><h1>Checking staff access</h1><p>Verifying your DreamTrawell administrator permissions...</p></section>;
    if (access !== 'granted')
        return <section id="main" className="shell admin-login"><Lock size={32}/><h1>Access not granted</h1>
            <p>Signed in as <strong>{user.email || 'Microsoft user'}</strong>, but this account does not have an approved DreamTrawell website administrator role.</p>
            <div className="form-error" role="alert">{accessMessage || 'Ask an administrator to create adminUsers/{your Firebase UID} in Firestore Console.'}</div>
            <p>Open Firebase Console → Authentication → Users to copy your Firebase UID, then create an active role record in Firestore.</p><p><strong>Firebase UID:</strong> <code>{user.uid}</code> <button type="button" className="btn btn-outline small" onClick={() => navigator.clipboard?.writeText(user.uid)}>Copy UID</button></p>
            <button className="btn btn-outline" type="button" onClick={() => signOut(clientAuth())}>Sign out</button>
        </section>;
    return <AdminWorkspace
      module={module} chooseModule={chooseModule} role={role} user={user}
      items={items} active={active} setActive={setActive} isNew={isNew} setIsNew={setIsNew}
      loading={loading} message={message} setMessage={setMessage}
      newItem={newItem} update={update} save={save} uploadImage={uploadImage}
      fetchData={fetchData} changeEnquiry={changeEnquiry} importCatalogue={importCatalogue} dirty={dirty} selectRecord={item=>{if(dirty&&!window.confirm('Discard unsaved edits?'))return;setActive(item);setIsNew(false);setDirty(false)}}
      onSignOut={() => signOut(clientAuth())}
    />;
}
