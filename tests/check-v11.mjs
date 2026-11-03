import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8');
const checks=[
 ['app/(site)/services/page.jsx','Hotels & resorts'],
 ['app/(site)/contact/page.jsx','Trade Desk'],
 ['components/destination-browser.jsx','v11-chip'],
 ['components/area-explorer.jsx','aria-pressed'],
 ['components/day-accordion.jsx','day=${i+1}'],
 ['components/quote-builder.jsx','custom-requirement'],
 ['components/admin-advanced.jsx','MediaLibrary'],
 ['components/admin-advanced.jsx','RevisionHistory'],
 ['components/admin-advanced.jsx','KnowledgeLibrary'],
 ['components/admin-workspace.jsx','exportEnquiryCsv'],
 ['components/admin-workspace.jsx','Move day earlier'],
 ['lib/client-operations.js','fetchRevisions'],
 ['lib/client-operations.js','updateEnquiryOperations'],
 ['firestore.rules','match /siteRevisions/'],
 ['firestore.rules','match /siteMedia/'],
 ['firestore.rules','match /siteKnowledge/'],
 ['docs/CRM_MAPPING.md','export a single enquiry']
];
for(const [path,phrase] of checks) assert.ok(read(path).toLowerCase().includes(phrase.toLowerCase()),`${path} missing ${phrase}`);
for(const dir of ['node_modules','.next'])assert.ok(!fs.existsSync(dir),'Build output must not be part of clean project');
assert.ok(!fs.existsSync('.env.local'),'Private .env.local should not be delivered');
console.log(`PASS: V11.1–V11.4 source checks (${checks.length})`);
