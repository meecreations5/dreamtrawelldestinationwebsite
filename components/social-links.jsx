import { Facebook, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { sanitizeSocialLinks, SOCIAL_KEYS, SOCIAL_PROVIDERS } from '@/lib/social-links';

function XBrandIcon({size=18}) {return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M18.9 2H22l-6.79 7.75L23.2 22h-6.25l-4.9-7.36L5.6 22H2.3l7.22-8.25L1.8 2h6.43l4.43 6.71L18.9 2Zm-1.09 17.73h1.73L7.29 4.16H5.43l12.38 15.57Z"/></svg>}
const icons = {instagram:Instagram,facebook:Facebook,linkedin:Linkedin,youtube:Youtube,x:XBrandIcon,whatsapp:MessageCircle};

export default function SocialLinks({links, className = ''}) {
  const safe = sanitizeSocialLinks(links);
  const active = SOCIAL_KEYS.filter(key => safe[key]);
  if (!active.length) return null;
  return <nav className={`dt-social-links ${className}`} aria-label="DreamTrawell social media">
    {active.map(key => {
      const Icon = icons[key];
      const label = SOCIAL_PROVIDERS[key].label;
      return <a key={key} className="dt-social-link" href={safe[key]} target="_blank" rel="noopener noreferrer external" title={label} aria-label={`DreamTrawell on ${label}`}><Icon size={18} strokeWidth={1.8} aria-hidden="true"/><span className="sr-only">{label}</span></a>;
    })}
  </nav>;
}
