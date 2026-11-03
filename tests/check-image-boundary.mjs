import fs from 'node:fs';
import assert from 'node:assert/strict';
const read = (name) => fs.readFileSync(name, 'utf8');
const serverPaths = ['components/ui.jsx', 'app/(site)/packages/[slug]/page.jsx'];
const clientPath = 'components/quote-builder.jsx';
const helperPath = 'lib/package-image.js';
const util = read(helperPath);
assert(util.includes('export function packageFallback('));
assert(!util.includes('use client') && !util.includes('use server'));
assert(!read('components/resilient-image.jsx').includes('export function packageFallback'));
for (const p of [...serverPaths, clientPath]) {
  const s = read(p);
  assert(s.includes("import { packageFallback } from '@/lib/package-image'"), `${p}: pure helper not imported`);
  assert(s.includes('packageFallback(p)'), `${p}: fallback not applied`);
  assert(!s.includes("ResilientImage, { packageFallback }"), `${p}: invalid import from client component`);
}
assert(read('components/resilient-image.jsx').startsWith("'use client';"));
for (const { slug } of JSON.parse(read('data/packages.json'))) {
  assert(fs.existsSync(`public/assets/package-fallbacks/${slug}.svg`), `Missing fallback for ${slug}`);
}
console.log('PASS: Server/client import boundary and 29 package fallback assets.');
