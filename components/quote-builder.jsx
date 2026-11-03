'use client';
import ResilientImage from '@/components/resilient-image';
import { packageFallback } from '@/lib/package-image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { submitWebsiteEnquiry } from '@/lib/client-operations';
import { trackPublicEvent } from '@/lib/firebase-client';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Download, Hotel, CalendarDays, Users, ShieldCheck, Info, MapPin } from 'lucide-react';
const stages = ['Stay & travel', 'Experiences', 'Agent details', 'Review'];
const customPackage={slug:'custom-requirement',title:'Custom travel requirement',destination:'',category:'Custom',nights:3,days:[],upgrades:[],image:'/assets/favicon.svg',imageAlt:'Custom destination enquiry',inclusions:[]};
const destinationChoices=['Dubai','Singapore','Thailand','Malaysia','Bali','Vietnam','Maldives'];
const defaults = { destination:'', arrivalDate: '', hotelCategory: 'Open to recommendations', mealPlan: 'Breakfast', transferType: 'Best available / advise', travelPurpose: 'Family holiday', rooms: 1, adults: 2, children: 0, childAges: '', infants: 0, budget: '', deadline: '', notes: '', agencyName: '', contactName: '', email: '', phone: '', consent: false, website: '' };
export function QuoteBuilder({ packages }) {
    const search = useSearchParams();
    const requested = search.get('package') || '';
    const selectedPackage = packages.find(p => p.slug === requested) || customPackage;
    const [slug, setSlug] = useState(selectedPackage?.slug || '');
    const p = packages.find(x => x.slug === slug) || customPackage;
    const [step, setStep] = useState(0);
    const [data, setData] = useState({ ...defaults, notes:search.get('service') ? `Service requirement: ${search.get('service')}.` : '', destination:p?.destination||search.get('destination')||'', nights: p?.nights || 3, daySelections: (p?.days || []).map((_, i) => i), upgrades: [] });
    const [startedAt] = useState(() => Date.now());
    const [working, setWorking] = useState(false);
    const [error, setError] = useState('');
    const [reference, setReference] = useState('');
    useEffect(() => { if (requested && packages.some(x => x.slug === requested)) {
        const q = packages.find(x => x.slug === requested);
        setSlug(q.slug);
        setData(old => ({ ...old, destination:q.destination, nights: q.nights, daySelections: q.days.map((_, i) => i), upgrades: [], notes:search.get('day') && q.days[Number(search.get('day'))-1] ? `Request changes to Day ${search.get('day')}: ${q.days[Number(search.get('day'))-1].title}. Please advise suitable alternatives.` : old.notes }));
    } }, [requested, packages]);
    const update = (key, value) => setData(old => ({ ...old, [key]: value }));
    function changePackage(next) { const q = packages.find(x => x.slug === next) || (next==='custom-requirement'?customPackage:null); if (!q)
        return; setSlug(q.slug); setData(old => ({ ...old, destination:q.destination, nights: q.nights, daySelections: q.days.map((_, i) => i), upgrades: [], notes:old.notes })); setReference(''); }
    const brief = useMemo(() => ["DreamTrawell Destination - B2B Quotation Brief", `Package: ${slug==='custom-requirement'?'Custom requirement':p?.title || 'Custom requirement'}`, `Destination: ${data.destination || p?.destination || 'Not selected'}`, `Category: ${p?.category || ''}`, `Arrival: ${data.arrivalDate || 'Tentative'}`, `Duration: ${data.nights}N / ${data.nights + 1}D`, `Hotel: ${data.hotelCategory}`, `Meal: ${data.mealPlan}`, `Transfers: ${data.transferType}`, `Travel purpose: ${data.travelPurpose}`, `Travellers: ${data.adults} adults, ${data.children} children, ${data.infants} infants`, `Child ages: ${data.childAges || 'N/A'}`, `Rooms: ${data.rooms}`, `Suggested days: ${p?.days.filter((_, i) => data.daySelections.includes(i)).map(x => x.title).join('; ') || 'Custom'}`, `Optional experiences: ${data.upgrades.join('; ') || 'None selected'}`, `Budget: ${data.budget || 'Not supplied'}`, `Deadline: ${data.deadline || 'Not supplied'}`, `Notes: ${data.notes || 'None'}`, `Agency: ${data.agencyName}`, `Agent: ${data.contactName}`, `Email: ${data.email}`, `Phone: ${data.phone}`].join('\n'), [data, p, slug]);
    const validStep = () => {
        if (step === 0 && (!data.destination || data.nights < 1 || data.nights > 45))
            return 'Choose a destination and valid stay duration.';
        if (step === 2 && (!data.agencyName.trim() || !data.contactName.trim() || !/^\S+@\S+\.\S+$/.test(data.email) || data.phone.replace(/\D/g, '').length < 8 || data.adults < 1))
            return 'Complete the agency name, contact person, valid email, phone and traveller count.';
        if (step === 3 && !data.consent)
            return 'Please confirm your understanding of the quotation process.';
        return '';
    };
    function next() { const msg = validStep(); if (msg) {
        setError(msg);
        return;
    } setError('');void trackPublicEvent('quote_step_completed',{step:step+1,package_type:p.category}); setStep(s => Math.min(3, s + 1)); }
    function back() { setError(''); setStep(s => Math.max(0, s - 1)); }
    async function submit() {
        const msg = validStep();
        if (msg) {
            setError(msg);
            return;
        }
        if (!p)
            return;
        setWorking(true);
        setError('');
        const body = { ...data, packageSlug: p.slug, formStartedAt: startedAt };
        try {
            const result = await submitWebsiteEnquiry(body);
            setReference(result.reference);void trackPublicEvent('quote_enquiry_created',{destination:data.destination,package_type:p.category});
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to submit your enquiry.');
        } finally { setWorking(false); }
    }
    async function copy() { try {
        await navigator.clipboard.writeText(brief);
        setError('Brief copied.');
    }
    catch {
        setError('Copy is unavailable. Use Download Brief.');
    } }
    function download() { const href = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = href; a.download = 'DreamTrawell-B2B-Quotation-Brief.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(href), 1000); }
    
    return <section className="shell quote-workspace"><div className="quote-toolbar"><div><span className="eyebrow">YOUR B2B REQUIREMENT</span><h2>Build your quotation brief</h2></div><Link href="/packages" className="text-link"><ArrowLeft size={16}/> Browse packages</Link></div><div className="quote-grid"><div className="quote-form-panel">
 <div className="quote-steps">{stages.map((s, i) => <button type="button" key={s} disabled={i > step} className={i === step ? 'current' : i < step ? 'complete' : ''} onClick={() => { setStep(i); setError(''); }}><span>{i < step ? <Check size={14}/> : String(i + 1).padStart(2, '0')}</span>{s}</button>)}</div>
 <div className="quote-panel-body" key={step}>
 {step === 0 && <><div className="section-step">01 / STAY & ROUTING</div><h3>Get the essentials right.</h3><p>Start with an existing programme, or choose a custom requirement without attaching an unrelated package.</p><div className="field-grid"><label className="full">Selected package<select value={slug} onChange={e => changePackage(e.target.value)}><option value="custom-requirement">Custom requirement (no package selected)</option>{packages.map(x => <option key={x.slug} value={x.slug}>{x.destination} · {x.title}</option>)}</select></label><label>Destination *<select value={data.destination} disabled={slug!=='custom-requirement'} onChange={e=>update('destination',e.target.value)}><option value="">Select destination</option>{destinationChoices.map(x=><option key={x}>{x}</option>)}</select></label><label>Travel date (optional)<input type="date" value={data.arrivalDate} onChange={e => update('arrivalDate', e.target.value)}/></label><label>Number of nights<input type="number" min="1" max="45" value={data.nights} onChange={e => update('nights', Number(e.target.value))}/></label><label>Hotel category<select value={data.hotelCategory} onChange={e => update('hotelCategory', e.target.value)}>{['Open to recommendations', '3 Star', '4 Star', '5 Star', 'Luxury / resort', 'Not required'].map(x => <option key={x}>{x}</option>)}</select></label><label>Meal preference<select value={data.mealPlan} onChange={e => update('mealPlan', e.target.value)}>{['Breakfast', 'Room only', 'Half board', 'Full board', 'All inclusive', 'To be advised'].map(x => <option key={x}>{x}</option>)}</select></label><label>Transfer preference<select value={data.transferType} onChange={e => update('transferType', e.target.value)}>{['Best available / advise', 'Private transfers', 'SIC / shared transfers', 'Private and SIC combination', 'Specific transfers only'].map(x => <option key={x}>{x}</option>)}</select></label><label>Travel purpose<select value={data.travelPurpose} onChange={e => update('travelPurpose', e.target.value)}>{['Family holiday', 'FIT / Leisure', 'Honeymoon / Couple', 'Group holiday', 'Corporate / MICE', 'Luxury holiday', 'Other'].map(x => <option key={x}>{x}</option>)}</select></label></div></>}
 {step === 1 && <><div className="section-step">02 / EXPERIENCE DESIGN</div><h3>Shape each day around them.</h3><p>Keep or remove suggestions, select optional experiences and describe any special requirements.</p><div className="check-collection"><h4>Suggested day-wise activities</h4>{p.days.map((day, i) => <label key={i} className="choice-row"><input type="checkbox" checked={data.daySelections.includes(i)} onChange={() => update('daySelections', data.daySelections.includes(i) ? data.daySelections.filter(x => x !== i) : [...data.daySelections, i])}/><span className="choice-date">Day {i + 1}</span><strong>{day.title}</strong></label>)}</div><div className="check-collection"><h4>Optional upgrades</h4>{p.upgrades.map(x => <label key={x} className="choice-row"><input type="checkbox" checked={data.upgrades.includes(x)} onChange={() => update('upgrades', data.upgrades.includes(x) ? data.upgrades.filter(y => y !== x) : [...data.upgrades, x])}/><strong>{x}</strong></label>)}</div><label className="full-text">Custom requests<textarea rows={4} value={data.notes} maxLength={3500} placeholder="Changes to activities, additional interests, special celebrations or routing notes" onChange={e => update('notes', e.target.value)}/></label></>}
 {step === 2 && <><div className="section-step">03 / TRAVELLERS & AGENT</div><h3>Who are we planning for?</h3><p>Only the details the destination desk needs to respond to your request.</p><div className="field-grid"><label>Adults *<input type="number" min="1" max="500" value={data.adults} onChange={e => update('adults', Number(e.target.value))}/></label><label>Children<input type="number" min="0" max="100" value={data.children} onChange={e => update('children', Number(e.target.value))}/></label>{data.children > 0 && <label>Child ages<input value={data.childAges} onChange={e => update('childAges', e.target.value)} placeholder="e.g. 5, 9"/></label>}<label>Infants<input type="number" min="0" max="50" value={data.infants} onChange={e => update('infants', Number(e.target.value))}/></label><label>Rooms<input type="number" min="1" max="300" value={data.rooms} onChange={e => update('rooms', Number(e.target.value))}/></label><label>Indicative budget<input value={data.budget} onChange={e => update('budget', e.target.value)} placeholder="e.g. INR 1,50,000 land only"/></label><label>Quotation needed by<input type="date" value={data.deadline} onChange={e => update('deadline', e.target.value)}/></label></div><h4>Travel partner details</h4><div className="field-grid"><label>Agency name *<input required value={data.agencyName} onChange={e => update('agencyName', e.target.value)}/></label><label>Contact person *<input required value={data.contactName} onChange={e => update('contactName', e.target.value)}/></label><label>Business email *<input type="email" required value={data.email} onChange={e => update('email', e.target.value)}/></label><label>Phone / WhatsApp *<input type="tel" required value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 ..."/></label></div><div aria-hidden="true" className="honeypot"><label>Leave blank<input tabIndex={-1} autoComplete="off" value={data.website} onChange={e => update('website', e.target.value)}/></label></div></>}
 {step === 3 && <><div className="section-step">04 / REVIEW</div><h3>Review your B2B brief.</h3><p>Details are checked before a real enquiry is created. This is not an online booking.</p><pre className="review-text">{brief}</pre><label className="consent"><input type="checkbox" checked={data.consent} onChange={e => update('consent', e.target.checked)}/><span>I understand this is a quotation request, not a booking or confirmed price. The team may contact me about this requirement. I have read the <Link href="/privacy-policy" target="_blank">Privacy Policy</Link> and understand how my enquiry details are used.</span></label><div className="review-actions"><button type="button" onClick={copy}><Copy size={15}/> Copy brief</button><button type="button" onClick={download}><Download size={15}/> Download .txt</button></div></>}
 {error && <div className={error === 'Brief copied.' ? 'form-note' : 'form-error'} role="status">{error}</div>}
 {reference && <div className="success-note" role="status"><CheckCircle2 /><div><strong>Enquiry received by the website intake.</strong><p>Reference: {reference}</p><small>The CRM lead-assignment bridge is configured separately.</small></div></div>}
 <div className="wizard-actions">{step > 0 && <button className="btn btn-outline" type="button" onClick={back}><ArrowLeft size={15}/> Back</button>}{step < 3 ? <button type="button" className="btn btn-red" onClick={next}>Continue <ArrowRight size={17}/></button> : <button type="button" className="btn btn-red" disabled={working || !!reference} onClick={submit}>{working ? 'Submitting...' : reference ? 'Submitted' : 'Submit enquiry'} <ArrowRight size={17}/></button>}</div>
 </div></div><aside className="quote-sidebar"><div className="quote-summary"><div className="summary-photo"><ResilientImage src={p.image} fallback={packageFallback(p)} alt={data.destination||'Custom trip'}/><span>{(data.destination||'CHOOSE DESTINATION').toUpperCase()} · {p.category.toUpperCase()}</span><strong>{p.title}</strong></div><div className="summary-details"><div className="live-label">● &nbsp; LIVE BRIEF SUMMARY</div><div><span><CalendarDays size={15}/> Duration</span><strong>{data.nights}N / {data.nights + 1}D</strong></div><div><span><MapPin size={15}/> Travel date</span><strong>{data.arrivalDate || 'Tentative'}</strong></div><div><span><Hotel size={15}/> Hotel</span><strong>{data.hotelCategory}</strong></div><div><span><Users size={15}/> Travellers</span><strong>{data.adults + data.children + data.infants}</strong></div><div><span><Check size={15}/> Planned days</span><strong>{data.daySelections.length}/{p.days.length}</strong></div><div className="no-price"><ShieldCheck size={21}/><span>Personalised B2B costing is prepared by our destination specialists.</span></div>{slug!=='custom-requirement'&&<Link href={`/packages/${p.slug}`} className="text-link">View original package <ArrowRight size={15}/></Link>}</div></div><div className="aside-promise"><Info size={18}/><div><strong>Realize the Experience.</strong><p>Ground handling, feasibility and supplier availability are confirmed during quotation.</p></div></div></aside></div></section>;
}
