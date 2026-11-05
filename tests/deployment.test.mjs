import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { once } from 'node:events';
import { gzipSync } from 'node:zlib';
import { WebSocket } from 'ws';
import { createApplication } from '../server/index.mjs';
import { physicsFor } from '../server/physics-v2.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'steez8-deployment-'));
const origin='https://steez8.me';
const app=createApplication({dataDir:dir,publicOrigin:origin,allowedOrigins:'https://www.steez8.me'});
await app.ready;
app.server.listen(0,'127.0.0.1'); await once(app.server,'listening');
const base='http://127.0.0.1:'+app.server.address().port;
let account;
async function api(route,body,token) {
 const res=await fetch(base+route,{method:body?'POST':'GET',headers:{Origin:origin,'content-type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});
 return {res,body:await res.json()};
}
test('HTTPS frontend passes CORS through a plain HTTP proxy connection; foreign origins fail',async()=>{
 const pre=await fetch(base+'/auth/v1/signup',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization,content-type,x-client-info'}});
 assert.equal(pre.status,204); assert.equal(pre.headers.get('access-control-allow-origin'),origin);
 for(const foreign of ['https://attacker.test','null','https://steez8.me.attacker.test']) {
  const denied=await fetch(base+'/api/health',{headers:{Origin:foreign,'X-Forwarded-Host':'steez8.me','X-Forwarded-Proto':'https'}}); assert.equal(denied.status,403); assert.equal(denied.headers.get('access-control-allow-origin'),null);
 }
 const healthy=await api('/api/health'); assert.equal(healthy.res.status,200); assert.equal(healthy.body.ready,true); assert.match(healthy.res.headers.get('vary'),/Origin/);
});
test('trimmed signup, password login and refresh rotation work across origins',async()=>{
 const signed=await api('/auth/v1/signup',{email:'  DeployQA@Example.Test  ',password:'DeployQA-Only-2026',data:{handle:'DeployQA'}});
 assert.equal(signed.res.status,200,JSON.stringify(signed.body)); assert.equal(signed.body.user.email,'deployqa@example.test'); account=signed.body;
 const login=await api('/auth/v1/token?grant_type=password',{email:' DEPLOYQA@example.test ',password:'DeployQA-Only-2026'});
 assert.equal(login.res.status,200); assert.equal(login.body.user.id,account.user.id);
 const refresh=await api('/auth/v1/token?grant_type=refresh_token',{refresh_token:login.body.refresh_token}); assert.equal(refresh.res.status,200);
 const me=await api('/auth/v1/user',null,refresh.body.access_token); assert.equal(me.res.status,200); assert.equal(me.body.id,account.user.id);
});
test('WebSocket origin guard rejects unauthorized browser origins',async()=>{
 const ws=new WebSocket(base.replace('http:','ws:')+'/',{origin:'https://attacker.test'});
 const status=await new Promise((resolve,reject)=>{ws.on('unexpected-response',(_,res)=>{resolve(res.statusCode);res.resume();ws.terminate();}); ws.on('open',()=>{ws.close();reject(Error('Foreign origin accepted'));});ws.on('error',()=>{});});
 assert.equal(status,403);
});
test('Ridgeline completes with identical client and server physics and earns its own passport stamp',async()=>{
 const physics=await physicsFor('ridgeline'), sim=physics.createSimulation(),controls=[]; sim.arrive();
 assert.equal(physics.course.Rn.course,'ridgeline-v1');
 for(let frame=0;frame<20000&&sim.phase!=='finished';frame++) {
  const target=Math.atan2(physics.course.O(sim.z+12)-25-sim.x,12),diff=Math.atan2(Math.sin(target-sim.heading),Math.cos(target-sim.heading));
  const steer=Math.round(Math.max(-1,Math.min(1,diff*1.8))*1000)/1000; controls.push(steer);
  sim.update(1/60,{steer,airRoll:0,forward:true,brake:false,jump:false,grab:false,cork:false,over:false,butter:false,grabStyle:0,board:false});
 }
 assert.equal(sim.phase,'finished');
 const raw=Buffer.alloc(9+controls.length*6);raw[0]=1;raw.writeUInt32LE(36,1);raw.writeUInt32LE(controls.length,5);
 controls.forEach((steer,i)=>{raw.writeInt16LE(Math.round(steer*1000),9+i*6);raw[13+i*6]=1;});
 const verified=await api('/functions/v1/verify-run',{inputs:gzipSync(raw).toString('base64'),run:{id:crypto.randomUUID(),course_id:'ridgeline-v1',season_id:'ridgeline-2026-11'}},account.access_token);
 assert.equal(verified.res.status,200,JSON.stringify(verified.body));assert.equal(verified.body.score,Math.round(sim.score));
 const journal=(await api('/api/journal',null,account.access_token)).body;assert.equal(journal.passport.length,6);assert.equal(journal.passport.find(p=>p.id==='ridgeline').runs,1);
});
test.after(async()=>{await app.close();fs.rmSync(dir,{recursive:true,force:true});});
