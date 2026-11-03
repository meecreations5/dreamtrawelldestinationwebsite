import { getDestinations, getPackages } from '@/lib/content';
import { getPublicPage } from '@/lib/content-pages';
export default async function sitemap() {
  // An unpublished site should not advertise a live indexable catalogue.
  if (process.env.SITE_INDEXABLE !== 'true') return [];
  const base=(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const staticPaths=['/','/destinations','/packages','/programmes','/services','/partners','/about','/contact','/testimonials','/offers','/faqs','/accessibility'];
  const [destinations,packages] = await Promise.all([getDestinations(),getPackages()]);
  const legal=await Promise.all(['privacy-policy','terms-of-use','cookies','disclaimer'].map(x=>getPublicPage(x)));
  const reviewedLegal=legal.filter(x=>x?.reviewed).map(x=>'/'+x.slug);
  const urls=[...staticPaths,...reviewedLegal,...destinations.map(x=>`/destinations/${x.slug}`),...packages.map(x=>`/packages/${x.slug}`)];
  return [...new Set(urls)].map(path=>({url:base+path,changeFrequency:'weekly',priority:path==='/'?1:0.6}));
}
