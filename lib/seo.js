import { PAGE_DEFINITIONS } from '@/lib/site-page-defaults';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const SITE_URL = (() => { try { const url = new URL(rawSiteUrl); return url.origin; } catch { return 'http://localhost:3000'; } })();
export function pageMetadata(path, { title, description, image, noIndex = false } = {}) {
  const canonical = new URL(path, SITE_URL).toString();
  const safeTitle = String(title || 'DreamTrawell Destination | B2B DMC').slice(0, 120);
  const safeDescription = String(description || 'Destination expertise and customised B2B travel programmes for travel agents.').slice(0, 250);
  const safeImage = image && /^https?:\/\//i.test(image) ? image : `${SITE_URL}/assets/dreamtrawell-official-logo.png`;
  return { title:safeTitle, description:safeDescription, alternates:{canonical}, robots:{index:!noIndex && process.env.SITE_INDEXABLE==='true',follow:!noIndex && process.env.SITE_INDEXABLE==='true'},
    openGraph:{type:'website',url:canonical,title:safeTitle,description:safeDescription,siteName:'DreamTrawell Destination',images:[{url:safeImage,alt:'DreamTrawell Destination DMC'}]},
    twitter:{card:'summary_large_image',title:safeTitle,description:safeDescription,images:[safeImage]}
  };
}
export function pageRecordMetadata(key, record) {
  const d = PAGE_DEFINITIONS[key];
  return pageMetadata(d.path,{title:record?.seoTitle || d.title,description:record?.seoDescription || d.description,image:record?.socialImage,noIndex:record?.reviewed===false});
}
export function jsonLd(object) { return JSON.stringify(object).replace(/</g,'\\u003c'); }
