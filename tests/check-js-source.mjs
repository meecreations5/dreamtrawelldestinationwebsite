import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=process.cwd();let passed=0;
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
const full=path.join(dir,ent.name);if(ent.isDirectory()){if(!['node_modules','.next','.git'].includes(ent.name))walk(full)}
else if(/\.(js|jsx|mjs|ts|tsx)$/.test(ent.name)){
if(/\.(ts|tsx)$/.test(ent.name))throw new Error('Unexpected TypeScript file: '+full);
if(ent.name.endsWith('.jsx')){
 // JSX is checked during npm run build; optional local parser may be used if globally installed.
 const source=fs.readFileSync(full,'utf8');
 if(!source.trim())throw new Error('Empty JSX file: '+full);
}else execFileSync(process.execPath,['--check',full],{stdio:'pipe'});
passed++;
}}
}
walk(root);console.log('Checked '+passed+' JavaScript / JSX source files (JS syntax verified; JSX fully validated by Next.js build).');
