import fs from 'node:fs';
import assert from 'node:assert/strict';
const p=(f)=>fs.readFileSync(f,'utf8');
const packs=JSON.parse(p('data/packages.json'));
assert.equal(packs.length,29);
for (const pkg of packs) {
 assert(fs.existsSync(`public/assets/package-fallbacks/${pkg.slug}.svg`),pkg.slug+' fallback missing');
 assert(p(`public/assets/package-fallbacks/${pkg.slug}.svg`).includes(pkg.destination.toUpperCase()),'Poster destination missing');
}
assert(p('components/ui.jsx').includes('packageFallback(p)'));
assert(p('components/resilient-image.jsx').includes('onError={handleError}'));
assert(p('app/layout.jsx').includes("import './package-polish.css'"));
assert(p('app/package-polish.css').includes('aspect-ratio: 16 / 9'));
assert(p('firestore.rules').includes("id == 'publicCopy' && isSuperAdmin()"));
assert(p('components/admin-workspace.jsx').includes('SiteCopyEditor'));
assert(p('app/robots.js').includes("SITE_INDEXABLE === 'true'"));
console.log('PASS: V12.1 resilient images, distinct posters, CSS, editor and no-index launch guard.');
