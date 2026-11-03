import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const packages=JSON.parse(readFileSync('data/packages.json'));const destinations=JSON.parse(readFileSync('data/destinations.json'));
assert.equal(destinations.length,7);assert.equal(packages.length,29);
const names=new Set(destinations.map(d=>d.name));const slugs=new Set();
for(const p of packages){assert.ok(p.slug && !slugs.has(p.slug));slugs.add(p.slug);assert.ok(names.has(p.destination),p.title);assert.ok(p.days.length>0,p.title);assert.ok(p.nights>0,p.title);assert.ok(!('vendorCost' in p),'no public cost')}
console.log('PASS: 7 destinations, 29 programme templates, unique slugs, itinerary days present, no vendor cost fields.');
