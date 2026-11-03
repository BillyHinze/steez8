import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { infoPage } from '../server/pages.mjs';
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'dist');
const api = process.env.BACKEND_ORIGIN;
if (!api) throw Error('BACKEND_ORIGIN is required: use the HTTPS URL of your deployed game backend.');
const url = new URL(api);
if (!['https:', 'http:'].includes(url.protocol) || url.pathname !== '/' || url.search || url.hash || url.username || url.password || url.protocol === 'http:' && !['localhost','127.0.0.1'].includes(url.hostname)) throw Error('BACKEND_ORIGIN must be an HTTPS origin (HTTP is allowed only for localhost tests).');
const brand = 'STEEZ8';
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(path.join(root, 'public'), output, { recursive: true });
fs.writeFileSync(path.join(output, 'runtime-config.js'), `window.CORK7_CONFIG=Object.freeze(${JSON.stringify({ name: brand, version: '0.5.0', apiOrigin: url.origin })});\n`);
fs.writeFileSync(path.join(output, '.nojekyll'), '');
fs.writeFileSync(path.join(output, 'CNAME'), 'steez8.me\n');
fs.writeFileSync(path.join(output, 'version.json'), JSON.stringify({ version: '1.0.5' }));
for (const route of ['challenges','journal','sessions','squads','reset-password','about','how-to-play','download','privacy','credits','terms-of-use','terms','updates','owner','status']) {
  fs.mkdirSync(path.join(output, route), { recursive: true });
  fs.writeFileSync(path.join(output, route, 'index.html'), infoPage('/' + (route === 'terms' ? 'terms-of-use' : route), brand));
}
for (const tab of ['shop','leaderboard','locker','replays','pass','loadouts']) {
  fs.mkdirSync(path.join(output, tab), { recursive: true });
  fs.writeFileSync(path.join(output, tab, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/?open=${tab}"><title>${tab} · STEEZ8</title><a href="/?open=${tab}">Open ${tab}</a></html>`);
}
fs.writeFileSync(path.join(output, '404.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Back to the mountain · STEEZ8</title><body style="font:20px system-ui;background:#102b35;color:white;padding:10vw"><h1>This trail ends here.</h1><p>The page may have moved.</p><a style="color:#f6d978" href="/">Back to Basecamp →</a></body></html>');
// Version local modules and styles so cached Pages assets cannot replay an older client.
const webFiles=[];
function collect(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())collect(p);else webFiles.push(p);}}
collect(output);
const codeFiles=webFiles.filter(f=>/\.(?:js|css)$/.test(f));
const fingerprint=crypto.createHash('sha256');for(const f of codeFiles.sort())fingerprint.update(fs.readFileSync(f));
const release=fingerprint.digest('hex').slice(0,12);
const names=[...new Set(codeFiles.map(f=>path.basename(f)))].map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\let bytes = 0, files = 0;'));
const references=new RegExp('('+names.join('|')+')(?=["\x27\x60\\\\])','g');
for(const f of webFiles.filter(f=>/\.(?:js|html)$/.test(f))){
  let source=fs.readFileSync(f,'utf8').replace(references,'$1?release='+release);
  if(f.endsWith('index.html')){
    const pattern=/\.rsc\.push\(("(?:\\.|[^"\\])*")\)/g;
    const records=[...source.matchAll(pattern)].map(m=>JSON.parse(m[1]));
    for(let i=0;i<records.length-1;i++)if(/^[a-f0-9]+:T[\da-f]+,$/.test(records[i]))records[i]=records[i].replace(/T[\da-f]+,/,'T'+Buffer.byteLength(records[i+1]).toString(16)+',');
    let i=0;source=source.replace(pattern,()=>'.rsc.push('+JSON.stringify(records[i++])+')');
  }
  fs.writeFileSync(f,source);
}

let bytes = 0, files = 0;
function count(dir) { for (const entry of fs.readdirSync(dir, {withFileTypes:true})) { const file=path.join(dir,entry.name); if(entry.isDirectory())count(file);else {bytes+=fs.statSync(file).size;files++;} } }
count(output);
if (bytes > 1_000_000_000) throw Error('Static output exceeds the GitHub Pages 1 GB limit.');
console.log(`Built ${files} frontend files (${(bytes / 1024 / 1024).toFixed(1)} MiB) for steez8.me. Backend: ${url.origin}`);
