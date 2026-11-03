// Pure, browser-independent helper. Safe to use in Next.js Server and Client Components.
const bundledPackages = new Set(["package-bali-premium", "package-bali-specialised", "package-bali-standard", "package-dubai-premium", "package-dubai-specialised", "package-dubai-standard", "package-malaysia-premium", "package-malaysia-specialised", "package-malaysia-standard", "package-maldives-premium", "package-maldives-specialised", "package-maldives-standard", "package-singapore-premium", "package-singapore-specialised", "package-singapore-standard", "package-thailand-premium", "package-thailand-specialised", "package-thailand-standard", "package-vietnam-premium", "package-vietnam-specialised", "package-vietnam-standard", "programme-bali-slow-escape", "programme-dubai-corporate-incentive", "programme-dubai-signature-explorer", "programme-malaysia-city-and-highlands", "programme-singapore-corporate-experience", "programme-singapore-family-discoveries", "programme-thailand-city-and-coast", "programme-vietnam-heritage-circuit"]);

export function packageFallback(p) {
  const slug = p?.slug || p?.id;
  if (slug && bundledPackages.has(slug)) {
    return `/assets/package-fallbacks/${slug}.svg`;
  }
  const slugDest = (p?.destination || 'Singapore').toLowerCase().replace(/[^a-z]/g,'');
  const supported = ['dubai','singapore','thailand','malaysia','bali','vietnam','maldives'];
  return `/assets/${supported.includes(slugDest) ? slugDest : 'singapore'}.svg`;
}

// V13.0.3: known misidentified *legacy* images only. A newly selected CMS image always takes precedence.
// Destination cover photos are temporary pending licensed package-specific photography.
const incorrectLegacyImages = {
  'programme-singapore-family-discoveries': {old:'photo-1542051841857-5f90071e7989', cover:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=82'},
  'programme-dubai-corporate-incentive': {old:'photo-1499856871958-5b9627545d1a', cover:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=82'},
};
export function packageImageSource(p) {
  const src = typeof p?.image === 'string' ? p.image : '';
  const known = incorrectLegacyImages[p?.slug];
  return known && src.includes(known.old) ? known.cover : src;
}
