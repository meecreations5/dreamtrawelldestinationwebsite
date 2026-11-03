'use client';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';
export function PackageFinder({ destinations }) { const router = useRouter(); const [dest, setDest] = useState(''); const [tier, setTier] = useState(''); const [nights, setNights] = useState(''); return <form className="finder" onSubmit={e => { e.preventDefault(); const params = new URLSearchParams(); if (dest)
    params.set('destination', dest); if (tier)
    params.set('category', tier); if (nights)
    params.set('nights', nights); router.push(`/packages?${params}`); }}><div className="finder-label"><span>FIND THE RIGHT STARTING POINT</span><strong>Find a package for your client</strong></div><label>Destination<select value={dest} onChange={e => setDest(e.target.value)}><option value="">All destinations</option>{destinations.map(d => <option key={d}>{d}</option>)}</select></label><label>Package type<select value={tier} onChange={e => setTier(e.target.value)}><option value="">All categories</option>{['Standard', 'Premium', 'Specialised', 'Trade programme'].map(d => <option key={d}>{d}</option>)}</select></label><label>Duration<select value={nights} onChange={e => setNights(e.target.value)}><option value="">Any duration</option>{[3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}+ nights</option>)}</select></label><button className="btn btn-red" type="submit"><Search size={16}/> Explore</button></form>; }
