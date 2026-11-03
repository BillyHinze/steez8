import fs from "node:fs";
const releaseNotes=JSON.parse(fs.readFileSync(new URL("../public/release-notes.json",import.meta.url),"utf8"));
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function shell(title, body, brand, script = "") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script src="/runtime-config.js"></script><script src="/services.js"></script><title>${escape(title)} · ${escape(brand)}</title><link rel="stylesheet" href="/_next/static/css/index._D7AXDAY.css"><style>html,body{overflow:auto;background:#edf2f6;color:#14243a}body{font-family:'DM Sans',sans-serif;margin:0}main{width:min(1000px,90%);margin:0 auto;padding:35px 0 80px}header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #cbd5e1;padding-bottom:20px}a{color:inherit}header a{text-decoration:none;font-weight:700}h1,h2{font-family:Knewave,sans-serif;text-transform:uppercase}h1{font-size:clamp(36px,6vw,66px);line-height:1.1;margin:50px 0 20px}h2{margin-top:35px;font-size:26px}p,li{line-height:1.8}button,.button{display:inline-flex;align-items:center;justify-content:center;background:#152c48;color:white;border:0;border-radius:10px;padding:13px 20px;font:700 15px 'DM Sans',sans-serif;cursor:pointer;text-decoration:none}input,select,textarea{font:inherit;padding:11px;border:1px solid #bac9d8;border-radius:8px;max-width:100%;background:white}label{display:grid;gap:8px;margin:15px 0}.card{background:white;border:1px solid #d5dfe9;border-radius:16px;padding:25px;margin:20px 0;box-shadow:0 10px 25px #192f4810}.badge{display:inline-block;background:#e2c36d;color:#30260c;border-radius:6px;padding:4px 9px;font-size:11px;font-weight:900;letter-spacing:.13em}table{border-collapse:collapse;width:100%}th,td{text-align:left;border-bottom:1px solid #e0e7ee;padding:12px;overflow-wrap:anywhere}.notice{padding:16px;background:#fff4d4;border:1px solid #e6d080;border-radius:10px}.row{display:flex;gap:12px;flex-wrap:wrap}.muted{color:#53667c}nav{display:flex;gap:18px;flex-wrap:wrap}code{overflow-wrap:anywhere}.hidden{display:none}#status{white-space:pre-wrap}</style></head><body><main><header><a href="/">${escape(brand)}</a><a class="button" href="/">Back to Basecamp ↗</a></header>${body}<footer style="margin-top:55px"><nav><a href="/about">About</a><a href="/how-to-play">Controls</a><a href="/privacy">Privacy</a><a href="/credits">Credits</a><a href="/status">Service status</a></nav></footer></main>${script ? `<script type="module">${script}</script>` : ""}</body></html>`;
}
export function checkoutPage(id, brand) {
  return shell(
    "Cash purchases disabled",
    '<h1>Cash purchases disabled</h1><div class="notice">No payment has been taken. Cash checkout is closed until an independent payment provider is connected. You can still use earned or owner-granted POW in the item shop.</div><p>Players cannot confirm an unpaid order as paid.</p>',
    brand,
  );
}
export function infoPage(path, brand) {
  if (["/journal", "/sessions", "/squads"].includes(path)) {
    const config={"/journal":["Mountain journal","mountain-journal","journal"],"/sessions":["Mountain Sessions","mountain-sessions","sessions"],"/squads":["Ranked Squads","ranked-squads","squads"]}[path];
    return shell(config[0], '<section style="margin-top:30px" id="'+config[1]+'"></section>', brand, "import('/"+config[2]+".js');");
  }
  if (path === "/updates") return shell("Updates", '<h1>Fresh tracks.</h1><p>New modes. Bigger crews. Your mountain story.</p><div class="row"><a class="button" href="/?open=updates">Updates in Basecamp ↗</a><a class="button" href="/sessions">Mountain Sessions ↗</a><a class="button" href="/squads">Ranked Squads ↗</a></div><section class="mt-root mt-release-list">'+releaseNotes.map(n=>'<article>'+(n.image?'<img src="'+escape(n.image)+'" alt="'+escape(n.alt)+'">':'')+'<p class="muted">'+escape(n.label)+' · '+escape(n.tag)+'</p><h2>'+escape(n.title)+'</h2><p>'+escape(n.body)+'</p><ul>'+(n.highlights||[]).map(h=>'<li>'+escape(h)+'</li>').join('')+'</ul>'+(n.link?'<a class="button" href="'+escape(n.link.href)+'">'+escape(n.link.label)+' ↗</a>':'')+'</article>').join('')+'</section><p>Earlier original update history is preserved in Basecamp’s Updates tab.</p>',brand,"import('/mountain-ui.js').then(m=>m.css());");

  if (path === "/challenges")
    return shell(
      "Daily goals",
      '<h1>Daily goals</h1><p>Ride, finish your goals and claim your POW. A fresh set arrives every day.</p><section id="daily-goals" aria-label="Your daily goals"></section>',
      brand,
      "import('/challenges.js');",
    );
  if (path === "/reset-password")
    return shell(
      "Reset your password",
      `<h1>Reset your password</h1><p>Choose a new password for the rider account linked to this one-use recovery link.</p><form id="reset" class="card"><label>New password<input id="password" type="password" autocomplete="new-password" minlength="8" maxlength="256" required></label><label>Confirm password<input id="confirm" type="password" autocomplete="new-password" minlength="8" maxlength="256" required></label><button type="submit">Update password</button><p id="result" role="status"></p></form>`,
      brand,
      `let session=null;const form=document.querySelector('#reset'),result=document.querySelector('#result'),button=form.querySelector('button');form.addEventListener('submit',async e=>{e.preventDefault();const password=document.querySelector('#password').value;if(password!==document.querySelector('#confirm').value){result.textContent='The passwords do not match.';return}button.disabled=true;try{const token=new URL(location.href).searchParams.get('reset');if(!token)throw Error('This recovery link is missing its token.');async function send(path,body,method='POST',access=null){const r=await fetch(path,{method,headers:{'content-type':'application/json',...(access?{authorization:'Bearer '+access}:{})},body:JSON.stringify(body)}),data=await r.json();if(!r.ok)throw Error(data.error||'Request failed');return data}session??=await send('/auth/v1/verify',{token_hash:token,type:'recovery'});await send('/auth/v1/user',{password},'PUT',session.access_token);history.replaceState(null,'','/reset-password');form.replaceChildren();const p=document.createElement('p'),a=document.createElement('a');p.textContent='Password updated. Sign in at Basecamp with your new password.';a.href='/';a.textContent='Back to Basecamp';a.className='button';form.append(p,a)}catch(error){result.textContent=error.message;button.disabled=false}});`,
    );
  if (path === "/owner")
    return shell(
      "Owner Basecamp",
      `<h1>Owner Basecamp <span class="badge">OWNER</span></h1><p class="muted">Private tools for your independent game.</p><div id="auth" class="notice">Checking owner access…</div><section id="tools" class="hidden"><div class="card"><h2>Your account</h2><p id="entitlements"></p><p>Every cosmetic and paid season reward is unlocked for the owner. No fabricated leaderboard score is needed.</p></div><div class="card"><h2>Grant an item or POW</h2><label>Rider<select id="rider"></select></label><label>POW<input id="pow" type="number" min="0" max="10000000" value="0"></label><label>Optional item<select id="item"><option value="">Choose an item</option></select></label><button id="grant">Grant selected rewards</button></div><div class="card"><h2>Moderation</h2><label>Ban duration in hours<input id="hours" type="number" min="1" max="720" value="24"></label><label>Reason<input id="reason" maxlength="200"></label><div class="row"><button id="ban">Ban selected rider</button><button id="unban">Remove ban</button></div><div id="reports"></div></div><div class="card"><h2>Open a cup</h2><p>Real players sign up from the mountain. Cups start when at least two riders have entered.</p><label>Seats<select id="seats"><option>20</option><option>40</option><option>60</option><option>80</option><option>100</option><option>200</option><option>400</option></select></label><button id="cup">Open a four-map cup</button></div><div class="card"><h2>Development mail outbox</h2><p class="notice">Development emails stay here. No message is sent to the email address.</p><div id="mail"></div></div><div class="card"><h2>Cash purchases</h2><p>Disabled. Players cannot complete test purchases or mint POW through checkout.</p></div></section><p id="status" role="status"></p>`,
      brand,
      ownerScript,
    );
  const content = {
    "/about": [
      "Find your line",
      `<p>This independent reconstruction preserves the original Cork7 terrain, custom simulation, rider animation, tricks, scoring, camera, ski and snowboard equipment, and replay tools.</p><p>Accounts, online rooms, competitive matches, parties, pass progress and item transactions use this game’s own server and database.</p><a class="button" href="/">Ride now ↗</a>`,
    ],
    "/how-to-play": [
      "How to ride",
      `<p>Open <b>Menu → Controls</b> in the game for the exact current bindings and gamepad settings. Bindings are configurable and saved to your account.</p><div class="card"><table><tr><th>Action</th><th>Default keyboard</th></tr><tr><td>Steer / spin</td><td>A / D</td></tr><tr><td>Forward / tuck and flip</td><td>W</td></tr><tr><td>Brake and reverse flip</td><td>S</td></tr><tr><td>Load and release your pop</td><td>Space</td></tr><tr><td>Mute / tail / Japan grab</td><td>Shift / Q / E</td></tr><tr><td>Air roll</td><td>Left / right arrows</td></tr><tr><td>Rodeo / misty modifier</td><td>Up arrow</td></tr><tr><td>Butter</td><td>B</td></tr><tr><td>Skip the lift</td><td>F</td></tr><tr><td>Pause / menu</td><td>P / Escape</td></tr></table></div><h2>Play with friends</h2><p>Create an account, add friends in Friends, invite them to a party, and let the leader pick a park. Public and private rooms use real connected riders. Ranked pairs actual queued accounts and verifies submitted input logs on the server.</p><h2>Replays</h2><p>Your last five runs are kept on this device. Save a run to keep it, switch replay cameras, or export a clip. Replays are available in Basecamp.</p>`,
    ],
    "/download": [
      "Play in your browser",
      `<p>The independent rewrite runs directly in the browser. No independent desktop installer has been released.</p><a class="button" href="/">Open the game ↗</a><h2>Run your copy</h2><p>Source and setup instructions are available in the <a href="https://github.com/BillyHinze/steez8">STEEZ8 repository</a>.</p>`,
    ],
    "/privacy": [
      "Privacy",
      `<p>This game stores account email addresses, password hashes, sessions, rider profiles, settings, inventory, pass progress, verified run data, reports and match history in its independent database. Passwords are salted and hashed; access and refresh tokens are stored as hashes.</p><p>Other players can see your gamertag, equipment, scores, competitive record and online activity. Your password and email address are not part of public leaderboards or room messages.</p><p>The public site is hosted by GitHub Pages, with account and multiplayer services on Render and durable database storage on Turso. Local replays and some preferences use browser storage. Development password-reset messages remain in a private owner outbox. Cash checkout is disabled. The original production analytics and account services are not used.</p><p>To delete a rider account, open Menu → Account → Delete account and complete the confirmation. The owner must transfer ownership before deleting the owner account.</p>`,
    ],
    "/terms-of-use": [
      "Terms of use",
      `<p>Respect other riders. Do not harass, spam, impersonate another player, manipulate competitive results or exploit the service. Reports are reviewed through owner moderation tools.</p><p>This is an independent reconstruction in development. Availability and progress may change during testing. Cash purchases are disabled. No real-money payment is represented by a local item or POW transaction.</p><p>The original game source and assets are retained under the permission described in the project brief. Third-party credits and music licenses continue to apply.</p>`,
    ],
    "/credits": [
      "Credits",
      `<p>Original game, custom physics, terrain, rider artwork and game systems: Cork7 and its original developer, reused under the permission described in the project brief.</p><p>Rendering: Three.js. Interface: React, React DOM and Vinext. Independent services: Node.js, SQLite and ws. Typography: DM Sans, Knewave and Barlow Condensed.</p><h2>Music</h2><p>The retained player displays track names, artists and license links. Tracks include work by | e s c p | / FSM Team, KV and Lesion X. Preserve those attributions when distributing the project.</p><p>See the preserved original source and project manifests for exact asset provenance and third-party notices.</p>`,
    ],
    "/status": [
      "Service status",
      `<div class="card"><p id="service">Checking service…</p></div><p>Cash checkout is intentionally disabled. Virtual-currency purchases use server-owned balances and an atomic ledger. The owner has complete item and pass entitlements.</p><p>Matchmaking needs actual queued players; there are no artificial online counts or pretend opponents.</p>`,
    ],
  };
  const [title, body] = content[path] || content["/about"];
  return shell(
    title,
    `<h1>${title}</h1>${body}`,
    brand,
    path === "/status"
      ? `fetch('/api/health').then(r=>r.json()).then(s=>document.querySelector('#service').textContent=s.ok?'Online · '+s.online+' riders connected · cash checkout '+s.payments:'Unavailable').catch(()=>document.querySelector('#service').textContent='Unavailable');`
      : "",
  );
}
const ownerScript = `
import {t as getClient} from '/_next/static/chunks/supabase-BEhtaJUq.js';
const client=getClient();const session=(await client.auth.getSession()).data.session;let token=session?.access_token;
const status=document.querySelector('#status'),notice=document.querySelector('#auth');
async function api(path,body){const r=await fetch(path,{method:body?'POST':'GET',headers:{authorization:'Bearer '+token,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const value=await r.json();if(!r.ok)throw Error(value.error||'Request failed');return value}
const option=(value,label)=>{const o=document.createElement('option');o.value=value;o.textContent=label;return o};
async function load(){try{const s=await api('/api/owner/summary');notice.textContent='Signed in as '+s.owner.handle+' · OWNER';document.querySelector('#tools').classList.remove('hidden');const me=await api('/api/me');document.querySelector('#entitlements').textContent=me.account.items.length+' equipment choices unlocked · '+me.account.pow.toLocaleString()+' POW · owner pass access';const select=document.querySelector('#rider');select.replaceChildren(...s.players.map(p=>option(p.id,p.handle+(p.role==='owner'?' · OWNER':''))));const catalog=await api('/api/catalog');const items=document.querySelector('#item');items.replaceChildren(option('','Choose an item'),...catalog.items.map(i=>option(i.value,i.name+' · '+i.kind)));const mail=document.querySelector('#mail');mail.replaceChildren();for(const message of s.mail){const p=document.createElement('p'),a=document.createElement('a');p.textContent=message.email+' · '+new Date(message.created_at).toLocaleString()+' ';a.textContent='Open one-use recovery link';a.href=message.link;p.append(a);mail.append(p)}if(!s.mail.length)mail.textContent='No development messages.';const reports=document.querySelector('#reports');reports.replaceChildren();for(const r of s.reports.filter(r=>!r.resolved)){const p=document.createElement('p');p.textContent=(r.reason||'Report')+' · '+(r.room||r.kind||'game');reports.append(p)}}catch(e){notice.textContent=e.message+'. Sign in with the owner account at Basecamp.'}}
const player=()=>document.querySelector('#rider').value;
document.querySelector('#grant').onclick=async()=>{try{await api('/api/owner/grant',{player:player(),pow:Number(document.querySelector('#pow').value),item:document.querySelector('#item').value||undefined});status.textContent='Rewards granted.'}catch(e){status.textContent=e.message}};
document.querySelector('#ban').onclick=async()=>{try{await api('/api/owner/ban',{player:player(),hours:Number(document.querySelector('#hours').value),note:document.querySelector('#reason').value});status.textContent='Ban applied.'}catch(e){status.textContent=e.message}};
document.querySelector('#unban').onclick=async()=>{try{await api('/api/owner/ban',{player:player(),remove:true});status.textContent='Ban removed.'}catch(e){status.textContent=e.message}};
document.querySelector('#cup').onclick=async()=>{try{const r=await api('/api/owner/cup-create',{maps:['apex','forestline','halfpipe','bigair'],seats:Number(document.querySelector('#seats').value),final:'zero',startIn:2});status.textContent='Cup opened: '+r.code+'. Riders can sign up from Apex.'}catch(e){status.textContent=e.message}};
load();
`;
