import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { WebSocket } from 'ws';
import { createApplication } from '../server/index.mjs';
import { i as defaults } from '../public/_next/static/chunks/rider-appearance-Cs5aq3V7.js';
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cork7-gear-'));
let now=Date.parse('2026-11-04T12:00:00Z');
const app=createApplication({dataDir:directory,clock:()=>now}); await app.ready;app.server.listen(0,'127.0.0.1');await once(app.server,'listening');const base='http://127.0.0.1:'+app.server.address().port;
async function api(route,body,rider){const response=await fetch(base+route,{method:body?'POST':'GET',headers:{'content-type':'application/json',...(rider?{authorization:'Bearer '+rider.access_token}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};}
const a=(await api('/auth/v1/signup',{email:'gear@example.test',password:'Gear-Testing-Only',data:{handle:'GearRider'}})).data,b=(await api('/auth/v1/signup',{email:'observer@example.test',password:'Gear-Testing-Only',data:{handle:'GearObserver'}})).data;
function connect(account){const ws=new WebSocket(base.replace('http:','ws:')+'/parties/mountain/apex'),messages=[];ws.on('message',(data,binary)=>{if(!binary)messages.push(JSON.parse(data))});ws.on('open',()=>ws.send(JSON.stringify({t:'auth',token:account.access_token})));return {ws,messages,async wait(fn){for(let i=0;i<100;i++){const m=messages.find(fn);if(m)return m;await new Promise(r=>setTimeout(r,15))}throw Error('Missing socket event '+JSON.stringify(messages));}};}
test('saved equipment is broadcast to remote mountain riders and party snapshots after the database save',async()=>{
 const x=connect(a),y=connect(b);try{await x.wait(m=>m.t==='roster');await y.wait(m=>m.t==='roster');
 const party={id:'gear-party',leader:a.user.id,members:[a.user.id,b.user.id]};app.realtime.competition.parties.set(party.id,party);for(const id of party.members)app.realtime.competition.membership.set(id,party.id);
 const look={...defaults,helmetItem:'silver-pro',skiItem:'hw-phantom-skis',gloveItem:'park-mitten'};
 for(const item of ['silver-pro','hw-phantom-skis','park-mitten'])app.store.put('rider_items',a.user.id+':'+item,{player_id:a.user.id,item:item});
 const saved=await api('/rest/v1/player_outfits',{player_id:a.user.id,outfit:look},a);assert.ok([200,201].includes(saved.status),JSON.stringify(saved));
 const event=await y.wait(m=>m.t==='outfit'&&m.outfit.skiItem==='hw-phantom-skis');assert.equal(event.outfit.helmetItem,'silver-pro');assert.equal(event.outfit.gloveItem,'park-mitten');
 assert.equal(app.realtime.competition.partySnapshot(party,a.user.id).members.find(m=>m.id===a.user.id).outfit.skiItem,'hw-phantom-skis');
 }finally{x.ws.close();y.ws.close();}});
test('three named loadout slots are private, preserve full equipment, and revalidate grants on equip',async()=>{
 assert.equal((await api('/api/loadouts')).status,401);assert.equal((await api('/api/loadouts',{action:'save',slot:4},a)).status,400);
 let result=await api('/api/loadouts',{action:'save',slot:1,name:'Phantom kit'},a);assert.equal(result.status,200);assert.equal(result.data.slots[0].outfit.skiItem,'hw-phantom-skis');
 assert.equal((await api('/api/loadouts',null,b)).data.slots[0].outfit,null);
 await api('/rest/v1/player_outfits',{outfit:defaults},a);await api('/api/loadouts',{action:'equip',slot:1},a);assert.equal(app.store.get('player_outfits',a.user.id).outfit.skiItem,'hw-phantom-skis');
 app.store.remove('rider_items',a.user.id+':hw-phantom-skis');await api('/api/loadouts',{action:'equip',slot:1},a);assert.equal(app.store.get('player_outfits',a.user.id).outfit.skiItem,defaults.skiItem);
 assert.equal((await api('/rest/v1/player_outfits',{outfit:{skiItem:'invented'}},a)).status,400);
});
test('Air Time and Rail Jam rank the verified mode metric instead of overall score',()=>{
 for(const [mode,values,expected] of [['air-time',{airtime_ms:4500,rails:100},4500],['rail-jam',{airtime_ms:9000,rails:825},825]]){
 app.mountainSessions.start(b.user.id,mode,'apex');now+=60000;
 const run={id:mode,player_id:b.user.id,verified:true,course_id:'apex-v1',score:99999,duration_ms:30000,inputs_hash:mode,crashes:0,created_at:new Date(now).toISOString(),...values};app.store.put('completed_runs',mode,run);app.mountainSessions.accept(b.user.id,run);assert.equal(app.mountainSessions.snapshot(b.user.id).active,null);assert.equal(app.mountainSessions.board(mode,'apex')[0].value,expected);
 }
});
test('weekly goals merge park versions, exclude other riders and future/unverified runs, and pay once per UTC week',async()=>{
 const parks=['nordryggen','apex','bigair','forestline','halfpipe'];
 for(let i=0;i<20;i++)app.store.put('completed_runs','weekly-'+i,{id:'weekly-'+i,player_id:a.user.id,verified:true,course_id:parks[i%5]+'-v'+(i+1),score:1000,duration_ms:30000,created_at:new Date(now-(i%3)*86400000).toISOString()});
 const before=app.store.balance(a.user.id),snapshot=app.challenges.snapshot(a.user.id);assert.ok(snapshot.weekly_goals.every(g=>g.ready));
 for(const goal of snapshot.weekly_goals){await Promise.all([1,2].map(()=>api('/api/challenges/claim',{goal:goal.id,reward:999999},a)))}assert.equal(app.store.balance(a.user.id),before+300);
 const week=snapshot.week;now=Date.parse('2026-11-09T00:00:00Z');const next=app.challenges.snapshot(a.user.id);assert.notEqual(next.week,week);assert.ok(next.weekly_goals.every(g=>!g.claimed&&g.progress===0));assert.equal((await api('/api/challenges/claim',{goal:'weekly-laps'},a)).status,409);
});
test('equipment textures are real local WebP images and repeat static requests use ETags',async()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../asset-manifest-model-textures.json',import.meta.url),'utf8'));assert.equal(manifest.files.length,180);assert.ok(manifest.files.every(f=>!f.error));
 const url=base+'/items/halloween/phantom-ski-left.webp?rev=park-ink-5',response=await fetch(url),bytes=Buffer.from(await response.arrayBuffer());assert.equal(response.status,200);assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.match(response.headers.get('cache-control'),/max-age=3600/);
 const repeat=await fetch(url,{headers:{'if-none-match':response.headers.get('etag')}});assert.equal(repeat.status,304);assert.equal((await repeat.arrayBuffer()).byteLength,0);
});
test.after(async()=>{await app.close();fs.rmSync(directory,{recursive:true,force:true});});
