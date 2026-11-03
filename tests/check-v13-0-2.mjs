import fs from 'node:fs';
import assert from 'node:assert/strict';
import {DEFAULT_THEME, THEME_PRESETS, validateTheme, themeVariables} from '../lib/site-theme.js';
import {DEFAULT_HOME_HERO, sanitizeHomeHero, selectHeroDestinations} from '../lib/home-hero-settings.js';
const file = f=>fs.readFileSync(f,'utf8');
assert.equal(DEFAULT_THEME.ivory.toLowerCase(),'#f4f8fa');
assert.equal(DEFAULT_THEME.champagne.toLowerCase(),'#eaf1f5');
assert.equal(DEFAULT_THEME.surface.toLowerCase(),'#ffffff');
assert.equal(DEFAULT_THEME.ink.toLowerCase(),'#425466');
assert.equal(validateTheme(DEFAULT_THEME),'');
assert.ok(THEME_PRESETS.some(x=>x.id==='pearl'));
assert.equal(themeVariables(DEFAULT_THEME)['--dt-pearl'],'#F4F8FA');
assert.deepEqual(sanitizeHomeHero({mode:'invalid',destinationSlug:'!danger',intervalSeconds:100}),DEFAULT_HOME_HERO);
assert.deepEqual(sanitizeHomeHero({mode:'fixed',destinationSlug:'dubai',intervalSeconds:6}),{mode:'fixed',destinationSlug:'dubai',intervalSeconds:6});
const records = [
 {slug:'dubai',name:'Dubai',hero:'/assets/dubai.svg',status:'published'},
 {slug:'singapore',name:'Singapore',hero:'/assets/singapore.svg',status:'published'},
 {slug:'draft',name:'Draft',hero:'/assets/dubai.svg',status:'draft'},
 {slug:'no-photo',name:'No photo',hero:'',status:'published'}
];
assert.equal(selectHeroDestinations(records,DEFAULT_HOME_HERO).items.length,2);
assert.equal(selectHeroDestinations(records,{mode:'fixed',destinationSlug:'dubai',intervalSeconds:12}).items[0].slug,'dubai');
assert.equal(selectHeroDestinations(records,{mode:'fixed',destinationSlug:'draft',intervalSeconds:12}).mode,'auto');
assert.equal(selectHeroDestinations(records,{mode:'fixed',destinationSlug:'missing',intervalSeconds:12}).items.length,2);
const home=file('app/(site)/page.jsx');
assert.ok(home.includes('getPublicHomeHero()')&&home.includes('<HomeHeroBanner'));
assert.ok(!home.includes("dests.find(d => d.slug === 'singapore')"));
const rules=file('firestore.rules');
assert.ok(rules.includes("id in ['catalogue','publicCopy','theme','homeHero']"));
assert.ok(rules.includes("id == 'homeHero' && validHomeHero()"));
assert.ok(rules.includes('function validHomeHero()')&&rules.includes("request.resource.data.intervalSeconds in [6,8,12]"));
const admin=file('components/home-hero-editor.jsx');
assert.ok(admin.includes('fetchAdminItems')&&admin.includes('serverTimestamp()')&&admin.includes('Publish Banner'));
assert.ok(admin.includes("role==='super_admin'"));
assert.ok(file('components/admin-workspace.jsx').includes('HomeHeroEditor role={role}'));
const hero=file('components/home-hero-banner.jsx');
for(const term of ['prefers-reduced-motion','visibilitychange','setInterval','shuffle','Pause banner rotation','ResilientImage'])assert.ok(hero.includes(term),term);
const css=file('app/pearl-mist.css');
for(const term of ['.public-site','.dt-hero-controls','font-weight:400','--dt-pearl','font-size:11px','.dt-banner-layout'])assert.ok(css.includes(term),term);
assert.ok(file('app/layout.jsx').includes("import './pearl-mist.css'"));
console.log('PASS: Pearl Mist tokens, theme contrast, homepage banner auto/fixed fallback, admin permissions and styling.');
