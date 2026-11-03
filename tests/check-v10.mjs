import fs from 'node:fs';
import assert from 'node:assert/strict';
const read = p => fs.readFileSync(p,'utf8');
const destinations = JSON.parse(read('data/destinations.json'));
const packages = JSON.parse(read('data/packages.json'));
assert.equal(destinations.length,7);
assert.equal(packages.length,29);
for (const d of destinations) {
 assert.ok(d.areaProfiles.length >= 3, `Missing area comparison for ${d.slug}`);
 for (const field of ['destinationHeadline','destinationOverview','sellingAreas','travellerProfiles','planningHeadline','planningNote','experienceHighlights','standardExperiences','offbeatIdeas','hotelGuidance','operationalNotes']) assert.ok(d[field]?.length > 0, `Missing ${field} in ${d.slug}`);
}
for (const name of new Set(packages.map(p=>p.destination))) {
 const all=packages.filter(p=>p.destination===name);
 assert.equal(new Set(all.map(p=>p.image)).size,all.length,`Duplicate package photograph in ${name}`);
 assert.ok(all.every(p=>p.imageAlt?.length),`Missing image alt in ${name}`);
}
const root = read('app/layout.jsx');
const publicLayout=read('app/(site)/layout.jsx');
const adminLayout=read('app/admin/layout.jsx');
assert.ok(!root.includes('<Header')&&!root.includes('<Footer')&&!adminLayout.includes('<Header')&&!adminLayout.includes('<Footer'));
assert.ok(publicLayout.includes('<Header')&&publicLayout.includes('<Footer'));
assert.ok(read('components/admin-workspace.jsx').includes('Team & access'));
const rules=read('firestore.rules');
assert.ok(rules.includes('uid != request.auth.uid'));
assert.ok(rules.includes('areaProfiles')&&rules.includes('imageAlt'));
console.log('PASS: 7 restored destination knowledge guides, 29 unique package thumbnails, separate admin route layout, role protections.');
