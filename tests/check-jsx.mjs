import fs from 'node:fs';
import ts from '/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js';
let count = 0;
function visit(dir) { for (const e of fs.readdirSync(dir, {withFileTypes:true})) {
  const p=dir+'/'+e.name;
  if (e.isDirectory() && !['node_modules','.next','.git'].includes(e.name)) visit(p);
  else if (/\.jsx?$/.test(e.name)) {
    const result=ts.transpileModule(fs.readFileSync(p,'utf8'), {fileName:p,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.Preserve,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,allowJs:true}});
    const bad=(result.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
    if (bad.length) throw new Error(p+' -> '+bad.map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join('; '));
    count++;
  }
}}
visit('app');visit('components');visit('lib');
console.log('PASS: JSX/JS compiler parser checks '+count+' files.');
