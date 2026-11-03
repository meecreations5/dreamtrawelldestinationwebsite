import assert from 'node:assert/strict';
import fs from 'node:fs';
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.ok(!p.dependencies['firebase-admin'], 'Admin SDK dependency must be absent');
const rules = fs.readFileSync('firestore.rules','utf8');
const storage = fs.readFileSync('storage.rules','utf8');
const files = [];
function walk(path) { for (const entry of fs.readdirSync(path, { withFileTypes: true })) {
  const next = path + '/' + entry.name;
  if (entry.isDirectory()) walk(next);
  else if (/\.(js|jsx|mjs)$/.test(entry.name) && !next.includes('/tests/')) files.push(next);
}}
walk('app'); walk('lib'); walk('components');
for (const f of files) assert.ok(!/from\s+['"]firebase-admin/.test(fs.readFileSync(f,'utf8')), f + ' still imports Admin SDK');
for (const important of ['adminUsers','websiteEnquiries','siteDestinations','sitePackages','siteTestimonials','sitePromotions','allow create:', 'allow get, list: if isStaff()']) assert.ok(rules.includes(important), 'Missing Firestore protection: ' + important);
assert.ok(rules.includes('uid != request.auth.uid') && rules.includes('allow list: if isSuperAdmin();') && rules.includes('allow delete: if false;'), 'Staff role rules missing super-admin restrictions');
assert.ok(storage.includes('firestore.get(') && storage.includes('request.auth.uid'), 'Storage role rules missing');
assert.ok(!fs.existsSync('lib/admin.js'), 'Old admin module still present');
assert.ok(!fs.existsSync('scripts/grant-admin.mjs'), 'Old role grant script still present');
assert.ok(!fs.existsSync('app/api/admin/content/route.js'), 'Old admin API still present');
assert.ok(!fs.existsSync('app/api/enquiries/route.js'), 'Old submission API still present');
console.log('PASS: Client-only Firebase architecture, locked role documents, content permissions, enquiry privacy, and Storage rules present.');
