import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { sanitizeSocialLinks, validSocialLink, SOCIAL_KEYS } from '../lib/social-links.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(resolve(root,p),'utf8');
const rule = read('firestore.rules');
const layout=read('app/layout.jsx');
const footer=read('components/chrome.jsx');
const image=read('components/resilient-image.jsx');
const hero=read('components/home-hero-banner.jsx');
const social=read('components/social-links.jsx');
const admin=read('components/admin-workspace.jsx');

assert.equal(SOCIAL_KEYS.length, 6);
assert(validSocialLink('instagram', 'https://www.instagram.com/dreamtrawell/'));
assert(validSocialLink('facebook', 'https://www.facebook.com/dreamtrawell/'));
assert(validSocialLink('linkedin', 'https://www.linkedin.com/company/dreamtrawell/'));
assert(validSocialLink('youtube', 'https://www.youtube.com/@dreamtrawell'));
assert(validSocialLink('x', 'https://x.com/dreamtrawell'));
assert(validSocialLink('whatsapp', 'https://wa.me/919876543210'));
for (const value of ['javascript:alert(1)','http://instagram.com/test','https://instagram.com.evil.org/test','https://somewhere.org/test']) {
  assert(!validSocialLink('instagram',value),`should not allow ${value}`);
}
assert.equal(sanitizeSocialLinks({instagram:' https://instagram.com/dreamtrawell/ ',facebook:'https://attacker.org/page'}).facebook,'');
assert.equal(sanitizeSocialLinks({instagram:' https://instagram.com/dreamtrawell/ '}).instagram,'https://instagram.com/dreamtrawell/');
assert(rule.includes("id in ['catalogue','publicCopy','theme','homeHero','social']"));
assert(rule.includes("(id == 'social' && validSocial())"));
assert(rule.includes('request.resource.data.updatedBy == request.auth.uid'));
assert(rule.includes('request.resource.data.updatedAt == request.time'));
assert(rule.includes('return isSuperAdmin()'));
assert(layout.includes("'/favicon.ico'") && layout.includes("'/icon.png'") && layout.includes("'/apple-icon.png'"));
for (const name of ['app/favicon.ico','app/icon.png','app/apple-icon.png','public/assets/favicon.svg']) {
  assert(statSync(resolve(root,name)).size>300,`${name} file should exist and not be empty`);
}
assert(footer.includes('<SocialLinks links={socialLinks}/>'));
assert(social.includes('rel="noopener noreferrer external"'));
assert(social.includes('aria-label'));
assert(admin.includes('<SocialLinksEditor role={role} uid={user.uid}/>'));
assert(!image.includes('decoding="async"'));
assert(!hero.includes('fetchPriority="high"'));
console.log('PASS: V14.0.1 favicon assets, public social profiles, provider validation, admin roles, and image hydration attributes');
