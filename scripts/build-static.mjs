import fs from 'node:fs';
import path from 'node:path';
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
let bytes = 0, files = 0;
function count(dir) { for (const entry of fs.readdirSync(dir, {withFileTypes:true})) { const file=path.join(dir,entry.name); if(entry.isDirectory())count(file);else {bytes+=fs.statSync(file).size;files++;} } }
count(output);
if (bytes > 1_000_000_000) throw Error('Static output exceeds the GitHub Pages 1 GB limit.');
console.log(`Built ${files} frontend files (${(bytes / 1024 / 1024).toFixed(1)} MiB) for steez8.me. Backend: ${url.origin}`);
