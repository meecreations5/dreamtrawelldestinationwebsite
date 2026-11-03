export default function robots() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const indexable = process.env.SITE_INDEXABLE === 'true';
  return {
    rules: indexable ? [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] }] : [{userAgent:'*',disallow:'/'}],
    sitemap: indexable ? `${url.replace(/\/$/, '')}/sitemap.xml` : undefined,
  };
}
