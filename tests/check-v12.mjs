import fs from 'node:fs';
import assert from 'node:assert/strict';
import { filterDestinations, filterPackages } from '../lib/discovery.mjs';
const read = p => fs.readFileSync(p,'utf8');
const dests = JSON.parse(read('data/destinations.json'));
const packs = JSON.parse(read('data/packages.json'));
assert.equal(dests.length,7);
assert.equal(packs.length,29);
const programmes=packs.filter(p=>p.category==='Trade programme');
assert.equal(programmes.length,8);
for(const p of programmes){assert.equal(p.operationsChecklist.length,8,`${p.slug}: operations not migrated`);assert.ok(p.exclusionsNote.length>50,`${p.slug}: exclusion note not migrated`)}
assert.equal(filterPackages(packs,{category:'Programme'}).length,8);
assert.equal(filterPackages(packs,{category:'Trade programme'}).length,8);
assert.ok(filterDestinations(dests,'Night Safari').some(d=>d.name==='Singapore'));
assert.ok(filterDestinations(dests,'','Family').some(d=>d.name==='Singapore'));
assert.ok(filterDestinations(dests,'Sentosa').some(d=>d.name==='Singapore'));
const phrases={
 'app/(site)/page.jsx':['Everything your agent desk','Not just a quote','Ground arrangements','THE STARTING POINT IS THE TRAVELLER'],
 'app/(site)/about/page.jsx':['Better travel begins long','Know the place.','The principles behind','Accountability'],
 'app/(site)/partners/page.jsx':['Do you work directly','What helps us quote','A DMC should make'],
 'app/(site)/contact/page.jsx':['QuickContact','Trade quotations'],
 'app/(site)/programmes/page.jsx':['Ready-to-shape journeys','Trade programme'],
 'app/(site)/destinations/[slug]/page.jsx':['v12-destination-cta','destination-knowledge'],
 'app/(site)/packages/[slug]/page.jsx':['operationsChecklist','exclusionsNote','DayAccordion'],
 'components/quick-contact.jsx':['mailto:','does not create'],
 'components/chrome.jsx':['usePathname','v12-compact','/programmes'],
 'components/destination-browser.jsx':['filterDestinations'],
 'components/catalogue.jsx':['filterPackages'],
 'components/package-finder.jsx':['Trade programme'],
 'lib/validation.js':['operationsChecklist','exclusionsNote'],
 'firestore.rules':['operationsChecklist','exclusionsNote']
};
for(const [file,required] of Object.entries(phrases)) for(const phrase of required) assert.ok(read(file).includes(phrase),`${file} missing ${phrase}`);
assert.ok(!read('package.json').includes('firebase-admin'));
assert.ok(!fs.existsSync('node_modules')&&!fs.existsSync('.next')&&!fs.existsSync('.env.local'));
console.log('PASS: V12 editorial parity, 8 programme operations, destination/package discovery, routes, security whitelist.');
