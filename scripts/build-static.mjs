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
// Keep the existing domain until Hostinger DNS and GitHub Pages settings are ready.
// Set PUBLIC_SITE_ORIGIN to the new HTTPS apex domain during a coordinated cutover.
const siteUrl = new URL(process.env.PUBLIC_SITE_ORIGIN || 'https://steez8.me');
if (siteUrl.protocol !== 'https:' || siteUrl.username || siteUrl.password ||
    siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash)
  throw Error('PUBLIC_SITE_ORIGIN must be a bare HTTPS origin with no path.');
const siteOrigin = siteUrl.origin;
const brand = 'STEEZ8';
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(path.join(root, 'public'), output, { recursive: true });
fs.writeFileSync(path.join(output, 'runtime-config.js'), `window.CORK7_CONFIG=Object.freeze(${JSON.stringify({ name: brand, version: '0.5.0', apiOrigin: url.origin })});\n`);
fs.writeFileSync(path.join(output, '.nojekyll'), '');
fs.writeFileSync(path.join(output, 'CNAME'), siteUrl.hostname + '\n');
fs.writeFileSync(path.join(output, 'version.json'), JSON.stringify({ version: '1.0.5' }));
for (const route of ['challenges','journal','sessions','squads','reset-password','about','how-to-play','download','privacy','credits','terms-of-use','terms','updates','owner']) {
  fs.mkdirSync(path.join(output, route), { recursive: true });
  fs.writeFileSync(path.join(output, route, 'index.html'), infoPage('/' + (route === 'terms' ? 'terms-of-use' : route), brand));
}
for (const tab of ['shop','leaderboard','locker','replays','pass','loadouts']) {
  fs.mkdirSync(path.join(output, tab), { recursive: true });
  fs.writeFileSync(path.join(output, tab, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/?open=${tab}"><title>${tab} · STEEZ8</title><a href="/?open=${tab}">Open ${tab}</a></html>`);
}
fs.writeFileSync(path.join(output, '404.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Back to the mountain · STEEZ8</title><body style="font:20px system-ui;background:#102b35;color:white;padding:10vw"><h1>This trail ends here.</h1><p>The page may have moved.</p><a style="color:#f6d978" href="/">Back to Basecamp →</a></body></html>');
// Keep canonical, Open Graph, JSON-LD, cached UI labels, and embedded RSC
// metadata consistent with the actual hostname. The RSC record byte lengths
// are recalculated below when index.html is versioned.
if (siteOrigin !== 'https://steez8.me') {
  function updateOrigins(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const filepath = path.join(dir, item.name);
      if (item.isDirectory()) { updateOrigins(filepath); continue; }
      if (!/\.(?:html|js|json|webmanifest)$/.test(item.name)) continue;
      const source = fs.readFileSync(filepath, 'utf8');
      if (source.includes('steez8.me'))
        fs.writeFileSync(filepath, source.replaceAll('steez8.me', siteUrl.hostname));
    }
  }
  updateOrigins(output);
}
// Start waking the backend while the browser loads static game files.
// This is one bounded request and does not periodically keep Render awake.
const entryFile=path.join(output,'index.html');
let entry=fs.readFileSync(entryFile,'utf8');
const serviceScript='<script src="/services.js"></script>';
if(!entry.includes(serviceScript)) throw Error('STEEZ8 basecamp service bootstrap missing');
entry=entry.replace(serviceScript,serviceScript+
  '<link rel="dns-prefetch" href="'+url.origin+'"/>'+
  '<link rel="preconnect" href="'+url.origin+'" crossorigin="anonymous"/>'+
  '<script src="/backend-warmup.js" async></script>');
fs.writeFileSync(entryFile,entry);
// Version local modules and styles so cached Pages assets cannot replay an older client.
const webFiles=[];
function collect(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())collect(p);else webFiles.push(p);}}
collect(output);
const codeFiles=webFiles.filter(f=>/\.(?:js|css)$/.test(f));
const fingerprint=crypto.createHash('sha256');for(const f of codeFiles.sort())fingerprint.update(fs.readFileSync(f));
const release=fingerprint.digest('hex').slice(0,12);
const names=[...new Set(codeFiles.map(f=>path.basename(f)))].map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
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


const outputHtml=fs.readFileSync(entryFile,'utf8');
const assetRefs=[...outputHtml.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["'](\/[^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)]
  .map(match=>match[1]);
if(assetRefs.length<12) throw Error('Basecamp lost essential scripts or styles');
for(const assetHref of assetRefs){
  const assetUrl=new URL(assetHref,siteOrigin);
  if(assetUrl.searchParams.get('release')!==release)
    throw Error('Unversioned game asset in Basecamp: '+assetHref);
  const assetPath=path.join(output,decodeURIComponent(assetUrl.pathname).slice(1));
  if(!fs.existsSync(assetPath)) throw Error('Missing published game asset: '+assetUrl.pathname);
}
const statusHtml=fs.readFileSync(path.join(output,'status','index.html'),'utf8');
if(!statusHtml.includes('Mountain connection')||!statusHtml.includes('status-check.js?release='+release))
  throw Error('Standalone connection diagnostics were not published');
console.log('Verified '+assetRefs.length+' versioned game assets and the connection status page.');

let bytes = 0, files = 0;
function count(dir) { for (const entry of fs.readdirSync(dir, {withFileTypes:true})) { const file=path.join(dir,entry.name); if(entry.isDirectory())count(file);else {bytes+=fs.statSync(file).size;files++;} } }
count(output);
if (bytes > 1_000_000_000) throw Error('Static output exceeds the GitHub Pages 1 GB limit.');
console.log(`Built ${files} frontend files (${(bytes / 1024 / 1024).toFixed(1)} MiB) for ${siteUrl.hostname}. Backend: ${url.origin}`);
