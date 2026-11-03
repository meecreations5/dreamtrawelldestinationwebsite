/** Public brand links: unset entries never render on the website. */
export const SOCIAL_KEYS = Object.freeze(['instagram', 'facebook', 'linkedin', 'youtube', 'x', 'whatsapp']);
export const SOCIAL_LINKS_EMPTY = Object.freeze(Object.fromEntries(SOCIAL_KEYS.map(key => [key, ''])));
export const SOCIAL_PROVIDERS = Object.freeze({
  instagram: { label: 'Instagram', hosts: ['instagram.com', 'www.instagram.com'], sample: 'https://www.instagram.com/youraccount/' },
  facebook: { label: 'Facebook', hosts: ['facebook.com', 'www.facebook.com', 'fb.com', 'www.fb.com'], sample: 'https://www.facebook.com/yourpage/' },
  linkedin: { label: 'LinkedIn', hosts: ['linkedin.com', 'www.linkedin.com'], sample: 'https://www.linkedin.com/company/yourcompany/' },
  youtube: { label: 'YouTube', hosts: ['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be'], sample: 'https://www.youtube.com/@yourchannel' },
  x: { label: 'X', hosts: ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'], sample: 'https://x.com/youraccount' },
  whatsapp: { label: 'WhatsApp', hosts: ['wa.me', 'api.whatsapp.com', 'www.whatsapp.com', 'whatsapp.com'], sample: 'https://wa.me/91XXXXXXXXXX' },
});

export function validSocialLink(key, value) {
  if (!SOCIAL_KEYS.includes(key)) return false;
  if (typeof value !== 'string' || value.length > 400) return false;
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port
      && SOCIAL_PROVIDERS[key].hosts.includes(url.hostname.toLowerCase())
      && url.pathname.length > 1;
  } catch { return false; }
}

export function sanitizeSocialLinks(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return Object.fromEntries(SOCIAL_KEYS.map(key => {
    const value = typeof source[key] === 'string' ? source[key].trim() : '';
    return [key, validSocialLink(key, value) ? value : ''];
  }));
}
