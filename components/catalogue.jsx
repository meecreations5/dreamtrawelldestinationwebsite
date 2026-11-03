'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { X, GitCompareArrows } from 'lucide-react';
import { PackageCard } from '@/components/ui';
import { filterPackages } from '@/lib/discovery.mjs';
export function Catalogue({ packages, destinations }) {
    const qp = useSearchParams();
    const [dest, setDest] = useState(qp.get('destination') || '');
    const [cat, setCat] = useState(qp.get('category') || '');
    const [nights, setNights] = useState(qp.get('nights') || '');
    const [q, setQ] = useState('');
    const [comp, setComp] = useState([]);
    const filtered = useMemo(() => filterPackages(packages,{destination:dest,category:cat,nights,query:q}), [dest, cat, nights, q, packages]);
    const selected = packages.filter(p => comp.includes(p.slug));
    function toggle(slug) { setComp(old => old.includes(slug) ? old.filter(x => x !== slug) : old.length < 3 ? [...old, slug] : old); }
    return <section className="shell section pt-zero"><div className="catalogue-bar"><label>Destination<select value={dest} onChange={e => setDest(e.target.value)}><option value="">All destinations</option>{destinations.map(d => <option key={d}>{d}</option>)}</select></label><label>Category<select value={cat} onChange={e => setCat(e.target.value)}><option value="">All types</option>{['Standard', 'Premium', 'Specialised', 'Trade programme'].map(d => <option key={d}>{d}</option>)}</select></label><label>Minimum nights<select value={nights} onChange={e => setNights(e.target.value)}><option value="">Any</option>{[3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}+</option>)}</select></label><label>Search<input placeholder="Package or experience" value={q} onChange={e => setQ(e.target.value)}/></label><button type="button" className="clear-btn" onClick={() => { setDest(''); setCat(''); setNights(''); setQ(''); }}>Clear</button></div><div className="result-label"><strong>{filtered.length}</strong> package frameworks available <span>Compare up to three packages</span></div><div className="package-grid">{filtered.map(p => <PackageCard p={p} key={p.slug} showCompare compared={comp.includes(p.slug)} onCompare={toggle}/>)}</div>{!filtered.length && <div className="empty">No matching packages. Try another destination or category.</div>}{!!selected.length && <div className="compare-dock"><span><GitCompareArrows size={17}/> {selected.length} selected</span><button className="btn btn-red small" type="button" onClick={() => document.getElementById('comparison')?.showPopover()}>Compare now</button><button className="dock-clear" type="button" onClick={() => setComp([])} aria-label="Clear compare"><X size={18}/></button></div>}<div id="comparison" popover="auto" className="compare-panel"><div className="compare-head"><h2>Compare programmes</h2><button onClick={() => document.getElementById('comparison')?.hidePopover()} aria-label="Close comparison"><X /></button></div><div className="compare-columns">{selected.map(p => <div key={p.slug}><b>{p.title}</b><p>{p.destination} · {p.duration}</p><strong>{p.category}</strong><p><b>Ideal for:</b> {p.audience}</p><p><b>Suggested stay:</b> {p.nights} nights</p><p><b>Summary:</b> {p.summary}</p><h4>Inclusions</h4>{p.inclusions.map((s, i) => <p key={i}>✓ {s}</p>)}<Link href={`/customise?package=${encodeURIComponent(p.slug)}`} className="btn btn-red small">Customise this</Link></div>)}</div></div></section>;
}
