import fs from 'node:fs';
import assert from 'node:assert/strict';
import { DEFAULT_THEME, THEME_PRESETS, contrastRatio } from '../lib/site-theme.js';

const css = fs.readFileSync('app/v13-0-4-contrast.css', 'utf8');
const layout = fs.readFileSync('app/layout.jsx', 'utf8');
const detail = fs.readFileSync('app/(site)/destinations/[slug]/page.jsx', 'utf8');
const original = fs.readFileSync('app/pearl-mist.css', 'utf8');

assert(layout.includes("import './v13-0-4-contrast.css';"), 'The contrast patch must be imported');
assert(layout.indexOf('v13-0-4-contrast.css') > layout.indexOf('v13-0-3-polish.css'), 'Contrast patch must load last');
assert(detail.includes('className="destination-cover"'), 'All destination detail heroes must share the common class');
assert(detail.includes('btn btn-outline transparent'), 'Secondary destination CTA must be present');
assert(original.includes('.public-site :is(h1,h2,h3,h4,h5,h6)'), 'Confirm this patch protects headings from the global palette rule');
for (const target of [
  '.public-site .destination-cover .shell > h1',
  '.public-site .destination-cover .shell > .eyebrow',
  '.public-site .destination-cover .destination-hero-buttons .btn-outline.transparent',
  '.public-site .destination-cover .destination-hero-buttons .btn-outline.transparent:hover',
  '.v12-destination-cta', '.destination-v10-planning', '.v12-philosophy', '.dark-panel'
]) assert(css.includes(target), `Missing CSS safeguard: ${target}`);
assert.match(css, /\.public-site \.destination-cover \.shell > h1\s*\{\s*color:\s*#FFFFFF/i);
assert.match(css, /\.public-site \.destination-cover \.destination-hero-buttons \.btn-outline\.transparent\s*\{[^}]*color:\s*#FFFFFF;[^}]*background:\s*rgba\(/s);
for(const t of [DEFAULT_THEME, ...THEME_PRESETS.map(x=>x.palette)]) {
  assert(contrastRatio('#FFFFFF',t.navy)>=4.5, 'White text must contrast with published navy presets');
}
console.log('PASS: Shared destination hero, secondary CTA, dark panel contrasts and palette preset checks.');
