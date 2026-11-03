'use client';
import { useEffect, useState } from 'react';
// A failed external image never exposes a broken-image icon. Local illustrations are placeholders,
// not substitutes for approved promotional photography.
export default function ResilientImage({ src, fallback = '/assets/singapore.svg', alt = '', ...props }) {
  const [current, setCurrent] = useState(src || fallback);
  const [lastResort, setLastResort] = useState(false);
  useEffect(() => { setCurrent(src || fallback); setLastResort(false); }, [src, fallback]);
  const handleError = () => {
    if (current !== fallback) setCurrent(fallback);
    else if (!lastResort) { setLastResort(true); setCurrent('/assets/singapore.svg'); }
  };
  return <img loading="lazy" decoding="async" {...props} src={current} alt={alt} onError={handleError} />;
}
