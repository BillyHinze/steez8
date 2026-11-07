import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { once } from "node:events";
import {
  GRAB_CATALOG, DEFAULT_GRAB_LOADOUT, validGrabLoadout,
  normalizeGrabLoadout, assignGrab, grabName,
} from "../public/grab-presets.js";
import { createApplication } from "../server/index.mjs";
import { physicsFor } from "../server/physics-v2.mjs";

test("the grab catalog has eight stable replay IDs and three distinct default bindings", () => {
  assert.equal(GRAB_CATALOG.length, 8);
  assert.deepEqual(GRAB_CATALOG.map(g => g.id), [0,1,2,3,4,5,6,7]);
  assert.deepEqual(DEFAULT_GRAB_LOADOUT.skis, [0,1,2]);
  assert.deepEqual(DEFAULT_GRAB_LOADOUT.board, [0,1,2]);
  assert.equal(grabName(7), "Back Scratcher");
  assert.equal(grabName(4, "board"), "Stalefish");
  assert(validGrabLoadout(DEFAULT_GRAB_LOADOUT));
});

test("slot assignment swaps instead of silently duplicating a style", () => {
  const old = normalizeGrabLoadout(null);
  const step1 = assignGrab(old, "skis", 0, 7);
  assert.deepEqual(step1.skis, [7,1,2]);
  const step2 = assignGrab(step1, "skis", 1, 7);
  assert.deepEqual(step2.skis, [1,7,2]);
  assert.deepEqual(step2.board, [0,1,2]);
  assert.deepEqual(old.skis, [0,1,2]);
  assert.throws(() => assignGrab(step2, "skis", -1, 0), RangeError);
  assert.throws(() => assignGrab(step2, "board", 0, 99), RangeError);
});

test("malformed, duplicated, and forged grab loadouts are not accepted", () => {
  for (const loadout of [
    null, {}, { skis:[0,0,2], board:[0,1,2] },
    { skis:[0,1,8], board:[0,1,2] },
    { skis:[0,1,2], board:[0,2] },
    { skis:["0",1,2], board:[0,1,2] },
  ]) assert.equal(validGrabLoadout(loadout), false);
  assert.deepEqual(normalizeGrabLoadout({skis:[7,6,5]}), {skis:[7,6,5], board:[0,1,2]});
});

test("the existing server physics counts each new grab without changing verified scoring logic", async () => {
  const physics = await physicsFor("apex");
  const simulation = physics.createSimulation();
  const ledger = simulation.grabLedger;
  ledger.reset();
  for (const style of [3,4,5,6,7]) {
    ledger.update(0.3, true, style, false);
    ledger.update(0.016, false);
  }
  assert.equal(ledger.count, 5);
  assert.deepEqual(Array.from(ledger.names), ["SAFETY GRAB", "BLUNT GRAB", "ROCKET AIR", "TRUE NOSE GRAB", "BACK SCRATCHER"]);
  ledger.reset();
  for (const style of [3,7]) {
    ledger.update(0.3, true, style, true);
    ledger.update(0.016, false);
  }
  assert.deepEqual(Array.from(ledger.names), ["INDY GRAB", "SEATBELT GRAB"]);
});

test("the active game, verified input parser, preview and score paths share grab-style support", async () => {
  const base = new URL("../public/", import.meta.url);
  const read = file => fs.readFileSync(new URL(file, base), "utf8");
  const engine = read("_next/static/chunks/engine-Dlp-9Jq2.js");
  const animation = read("_next/static/chunks/rider-animation-1mQglCn7.js");
  const locker = read("_next/static/chunks/rider-locker-BYJrrxbD.js");
  const replay = read("_next/static/chunks/replay-Bo7bmJ9f.js");
  const bootstrap = read("independent.js");
  const studio = read("grab-studio.js");
  const verifier = fs.readFileSync(new URL("../server/verification-worker-v2.mjs", import.meta.url),"utf8");
  assert(engine.includes("__steez8GrabActiveSlots[p]"));
  // New grabs have their own procedural 3D poses, not old Tail/Japan overlays.
  assert(animation.includes('from "../../../signature-grab-poses.js"'));
  assert(animation.includes("sigGrab(this,this.grabStyle,this.grab,signatureAirTime)"));
  assert(animation.includes("sigReach(this.grabContact,this.grabStyle,this.grab,e)"));
  assert(locker.includes("steez8:preview-grab"));
  // The preview camera must remain locally declared in strict-mode ES modules.
  // Comma-chaining the listener call to P=... caused the Locker to crash on mount.
  assert.match(locker, /window\.addEventListener\(`steez8:preview-grab`,previewGrab\);let P=new h\(/);
  assert.doesNotMatch(locker, /window\.addEventListener\(`steez8:preview-grab`,previewGrab\),P=/);
  assert(replay.includes("[1,4,5].includes(t.grabStyle)"));
  assert(bootstrap.includes("startGrabStudio();"));
  assert(studio.includes("/api/grab-loadout"));
  assert(studio.includes('grab-studio.css'));
  assert(verifier.includes("equipment & 127"));
});

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "steez8-grabs-"));
const app = createApplication({
  dataDir: dir,
  publicOrigin: "https://novacryptotool.com",
  allowedOrigins: "https://www.novacryptotool.com",
});
await app.ready;
app.server.listen(0, "127.0.0.1");
await once(app.server, "listening");
const base = "http://127.0.0.1:" + app.server.address().port;

async function api(route, body, accessToken, origin = "https://novacryptotool.com") {
  const response = await fetch(base + route, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      origin,
      ...(accessToken ? { authorization: "Bearer " + accessToken } : {}),
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { status: response.status, data: await response.json(), headers: response.headers };
}
test("saved grabs require authentication and reject invalid IDs", async () => {
  assert.equal((await api("/api/grab-loadout")).status,401);
  assert.equal((await api("/api/grab-loadout", {loadout:{skis:[0,1,2],board:[0,1,2]}})).status,401);
  const signed = await api("/auth/v1/signup", {
    email:"grab-a@example.test", password:"OnlyForGrabTests1", data:{handle:"GrabTestA"},
  });
  assert.equal(signed.status,200);
  const token = signed.data.access_token;
  const current = await api("/api/grab-loadout", undefined, token);
  assert.equal(current.status,200);
  assert.deepEqual(current.data.loadout,{skis:[0,1,2],board:[0,1,2]});
  assert.equal((await api("/api/grab-loadout",{loadout:{skis:[0,1,1],board:[0,1,2]}},token)).status,400);
  assert.equal((await api("/api/grab-loadout",{loadout:{skis:[0,1,99],board:[0,1,2]}},token)).status,400);
  const updated = { skis:[7,4,3], board:[6,5,1] };
  const result = await api("/api/grab-loadout",{loadout:updated, user_id:"fake"},token);
  assert.equal(result.status,200);
  assert.deepEqual(result.data.loadout,updated);
  assert.equal((await api("/api/grab-loadout",undefined,token)).data.loadout.skis[0],7);
});
test("per-account grab loadouts cannot be read or overwritten by another account",async()=>{
 const a=await api("/auth/v1/signup",{email:"grab-b@example.test",password:"OnlyForGrabTests1",data:{handle:"GrabTestB"}});
 assert.equal(a.status,200);
 const token=a.data.access_token;
 assert.deepEqual((await api("/api/grab-loadout",undefined,token)).data.loadout.skis,[0,1,2]);
 await api("/api/grab-loadout",{loadout:{skis:[3,2,1],board:[7,5,4]}},token);
 assert.deepEqual((await api("/api/grab-loadout",undefined,token)).data.loadout.board,[7,5,4]);
 assert.equal((await api("/api/grab-loadout",undefined,token,"https://untrusted.example")).status,403);
});
test.after(async()=>{await app.close();fs.rmSync(dir,{recursive:true,force:true});});
