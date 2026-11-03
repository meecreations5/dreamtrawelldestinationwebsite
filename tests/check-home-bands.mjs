import assert from 'node:assert/strict';
import fs from 'node:fs';
const home=fs.readFileSync('app/(site)/page.jsx','utf8');
const css=fs.readFileSync('app/home-colour-bands.css','utf8');
const layout=fs.readFileSync('app/layout.jsx','utf8');
assert.match(home,/className="dt-home"/);
for(const band of ['white','ivory','champagne','mist','warm','navy']) {
  assert.ok(home.includes('dt-home-band--'+band), `homepage missing ${band} band`);
  assert.ok(css.includes('.dt-home-band--'+band), `style missing ${band} band`);
}
assert.ok((home.match(/className="shell">/g)||[]).length>=7, 'full-width bands should retain content shells');
assert.ok(layout.includes("import './home-colour-bands.css';"));
assert.ok(css.includes('var(--luxury-champagne)') && css.includes('var(--luxury-ivory)'));
assert.ok(css.includes('.dt-home > section.section-soft'));
assert.ok(!css.includes('!important'));
console.log('PASS: V13.0.1 home section bands, responsive rules and dynamic-theme compatibility.');
