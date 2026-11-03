import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { gzipSync } from "node:zlib";
import { physicsFor } from "../server/physics-v2.mjs";
import { once } from "node:events";
import { createApplication } from "../server/index.mjs";
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "cork7-mountain-update-"));
let now = Date.now();
const app = createApplication({ dataDir: directory, clock: () => now });
await app.ready; app.server.listen(0, "127.0.0.1"); await once(app.server, "listening");
const base = "http://127.0.0.1:" + app.server.address().port;
async function api(route, body, account) {
  const response = await fetch(base + route, { method: body ? "POST" : "GET", headers: { "content-type": "application/json", ...(account ? { authorization: "Bearer " + account.access_token } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, data: await response.json() };
}
async function rider(name) { const r = await api("/auth/v1/signup", { email: name + "@example.test", password: "MountainTest-Only1", data: { handle: name } }); assert.equal(r.status, 200); return r.data; }
const people = await Promise.all(Array.from({ length: 9 }, (_, i) => rider("Mountain" + i)));
const id = (i) => people[i].user.id;
let serial = 0;
function run(player, park = "apex", values = {}) {
  const r = { id: crypto.randomUUID(), player_id: player, verified: true, course_id: park + "-v1", score: 5000, crashes: 0, duration_ms: 30000, created_at: new Date(now).toISOString(), inputs_hash: "test-verified-input-" + serial++, ...values };
  app.store.transaction(() => { app.store.put("completed_runs", r.id, r); app.mountainSessions.accept(player, r); app.squads.accept(player, r); }); return r;
}
async function queue(size, indexes) {
  indexes.forEach((i) => app.squads.snapshot(id(i)));
  for (const i of indexes) { const r = await api("/api/squads/queue", { size }, people[i]); assert.equal(r.status, 200, JSON.stringify(r.data)); }
  const match = app.squads.current(id(indexes[0])); assert.ok(match); assert.equal(match.players.length, Number(size[0]) * 2);
  for (const i of indexes) { const r = await api("/api/squads/ready", { id: match.id }, people[i]); assert.equal(r.status, 200); }
  assert.equal(app.squads.current(id(indexes[0])).phase, "riding"); return match.id;
}
test("new APIs require authentication, and the Updates page announces shipped modes", async () => {
  for (const p of ["/api/journal", "/api/sessions", "/api/squads"]) assert.equal((await api(p)).status, 401);
  for (const p of ["/journal", "/sessions", "/squads", "/updates"]) { const r = await fetch(base + p); assert.equal(r.status, 200); }
  const update = await (await fetch(base + "/updates")).text(); assert.match(update, /Ranked 3v3 and 4v4/); assert.match(update, /675 POW/);
  assert.equal((await api("/api/sessions/start", { mode: "made-up", park: "apex" }, people[0])).status, 400);
});
test("journal counts only owned verified finishes and merges versions of the same park", async () => {
  run(id(0), "apex", { verified: false, score: 999999 }); run(id(1), "apex", { score: 999999 });
  run(id(0), "apex", { score: 1200 }); run(id(0), "apex", { course_id: "apex-v2", score: 6000 });
  run(id(0), "forestline", { score: 4000 }); run(id(0), "unknown", { score: 999999 });
  const snapshot = (await api("/api/journal", null, people[0])).data;
  assert.equal(snapshot.totals.runs, 3); assert.equal(snapshot.totals.parks, 2); assert.equal(snapshot.totals.best, 6000); assert.equal(snapshot.passport.find((p) => p.id === "apex").runs, 2);
  assert.ok(snapshot.recent.every((r) => !r.player_id && !r.inputs_hash));
});
test("milestones pay a fixed reward only once across repeated requests and reject forged progress", async () => {
  const before = app.store.balance(id(0));
  assert.equal((await api("/api/journal/claim", { milestone: "century", progress: 100, reward: 99999 }, people[0])).status, 409);
  const claims = await Promise.all([1, 2, 3].map(() => api("/api/journal/claim", { milestone: "first-tracks", reward: 99999, player_id: id(1) }, people[0])));
  assert.ok(claims.every((r) => r.status === 200)); assert.equal(app.store.balance(id(0)), before + 25);
  assert.equal(app.store.rows("milestone_rewards").filter((r) => r.player_id === id(0)).length, 1);
  assert.equal((await api("/api/journal/claim", { milestone: "first-tracks" }, people[2])).status, 409);
});
test("Time Attack rejects old, other-park and competitive runs and records the first valid finish", async () => {
  let r = await api("/api/sessions/start", { mode: "time-attack", park: "apex", value: 1 }, people[2]); assert.equal(r.status, 200);
  const session = r.data.active;
  assert.equal((await api("/api/sessions/start", { mode: "clean-line", park: "apex" }, people[2])).status, 409);
  run(id(2), "apex"); assert.equal(app.mountainSessions.snapshot(id(2)).active.runs.length, 0);
  now += 60000; run(id(2), "forestline"); assert.equal(app.mountainSessions.snapshot(id(2)).active.runs.length, 0);
  app.mountainSessions.accept(id(2), { player_id: id(2), verified: true }, { competitive: true });
  run(id(2), "apex", { duration_ms: 42000 });
  r = await api("/api/sessions", null, people[2]); assert.equal(r.data.active, null); assert.equal(r.data.bests[0].value, 42000);
  assert.equal((await api("/api/sessions/end", { id: session.id }, people[3])).status, 409);
});
test("Score Rush sums only the three best distinct finishes and banks on expiry", async () => {
  app.mountainSessions.start(id(3), "score-rush", "apex"); let first;
  for (const score of [100, 400, 200, 300]) { now += 35000; const r = run(id(3), "apex", { score }); first ??= r; }
  now += 35000; run(id(3), "apex", { score: 99999, inputs_hash: first.inputs_hash });
  assert.equal(app.mountainSessions.snapshot(id(3)).active.value, 900);
  now += 600000;
  const snapshot = app.mountainSessions.snapshot(id(3)); assert.equal(snapshot.active, null); assert.equal(snapshot.history[0].status, "complete"); assert.equal(snapshot.history[0].value, 900);
  assert.equal(app.mountainSessions.board("score-rush", "apex")[0].value, 900);
});
test("Clean Line requires zero crashes; Park Tour requires all five parks in order", () => {
  app.mountainSessions.start(id(4), "clean-line", "apex"); now += 60000; run(id(4), "apex", { crashes: 1 });
  assert.equal(app.mountainSessions.snapshot(id(4)).history[0].status, "failed"); assert.equal(app.mountainSessions.snapshot(id(4)).bests.length, 0);
  now += 1; app.mountainSessions.start(id(4), "clean-line", "apex"); now += 60000; run(id(4), "apex", { crashes: 0, score: 12000 }); assert.equal(app.mountainSessions.snapshot(id(4)).bests[0].value, 12000);
  app.mountainSessions.start(id(5), "park-tour", "apex"); now += 60000; run(id(5), "apex"); assert.equal(app.mountainSessions.snapshot(id(5)).active.runs.length, 0);
  for (const park of ["nordryggen", "apex", "bigair", "forestline", "halfpipe"]) { now += 60000; run(id(5), park); }
  const snapshot = app.mountainSessions.snapshot(id(5)); assert.equal(snapshot.active, null); assert.equal(snapshot.bests[0].value, 150000); assert.equal(snapshot.bests[0].runs.length, 5);
});
test("ranked 3v3 uses six real riders, checks readiness, adds scores and rates exactly once", async () => {
  now += 1000; const match = await queue("3v3", [0, 1, 2, 3, 4, 5]);
  assert.equal((await api("/api/squads/ready", { id: match }, people[6])).status, 409);
  assert.equal((await api("/api/sessions/start", { mode: "time-attack", park: "apex" }, people[0])).status, 409);
  assert.equal(app.store.competition.available(id(0)), false);
  now += 60000;
  for (let i = 0; i < 6; i++) run(id(i), "apex", { score: i < 3 ? 2000 : 1000 });
  const m = app.squads.snapshot(id(0)).match; assert.equal(m.phase, "complete"); assert.deepEqual(m.totals, [6000, 3000]);
  assert.equal(app.store.rating(id(0), "3v3").rating, 1016); assert.equal(app.store.rating(id(5), "3v3").rating, 984);
  assert.equal(app.store.rating(id(0), "1v1").games, 0); assert.equal(app.store.rating(id(0), "2v2").games, 0);
  run(id(0), "apex", { score: 100000 }); assert.equal(app.store.rating(id(0), "3v3").games, 1);
  assert.ok(m.players.every((p) => !p.id && !p.run));
});
test("ranked 4v4 supports eight riders and protects a losing teammate after a forfeit", async () => {
  now += 1000; const match = await queue("4v4", [0, 1, 2, 3, 4, 5, 6, 7]); now += 60000;
  assert.equal((await api("/api/squads/leave", { id: match }, people[0])).status, 200);
  for (let i = 1; i < 8; i++) run(id(i), "apex", { score: i < 4 ? 1000 : 2000 });
  const m = app.squads.snapshot(id(1)).match; assert.equal(m.phase, "complete"); assert.equal(m.players.find((p) => p.you).result.outcome, "forgiven");
  assert.equal(app.store.rating(id(1), "4v4").rating, 1000); assert.equal(app.store.rating(id(0), "4v4").rating, 984); assert.equal(app.store.rating(id(7), "4v4").rating, 1016);
  assert.equal((await api("/api/squads/queue", { size: "4v4" }, people[0])).status, 409);
});
test("stale queue presence and unconfirmed ready checks cannot create rated games", async () => {
  now += 360000; await api("/api/squads/queue", { size: "3v3" }, people[8]); now += 31000; app.squads.tick(); assert.equal(app.squads.queues.size, 0);
  for (let i = 0; i < 6; i++) await api("/api/squads/queue", { size: "3v3" }, people[i]);
  const m = app.squads.current(id(0)); assert.ok(m); await api("/api/squads/ready", { id: m.id }, people[0]); now += 61000; app.squads.tick();
  assert.equal(app.squads.snapshot(id(0)).match.phase, "void"); assert.equal(app.store.rating(id(0), "3v3").games, 1); assert.ok(app.squads.snapshot(id(1)).break_until > now);
});
test("parties stay together in larger ranked teams and a party change cancels search", () => {
  now += 120000;
  const party = { id: "test-squad-party", leader: id(0), members: [id(0), id(1), id(2)] };
  app.store.competition.parties.set(party.id, party); party.members.forEach((p) => app.store.competition.membership.set(p, party.id));
  for (let i = 0; i < 6; i++) app.squads.snapshot(id(i));
  assert.throws(() => app.squads.join(id(1), "3v3"), /leader/);
  app.squads.join(id(0), "3v3"); for (let i = 3; i < 6; i++) app.squads.join(id(i), "3v3");
  const m = app.squads.current(id(0)); assert.equal(new Set(m.players.filter((p) => party.members.includes(p.id)).map((p) => p.side)).size, 1);
  app.squads.leave(id(0), m.id); now += 120000;
  party.members.forEach((p) => app.squads.snapshot(p)); app.squads.join(id(0), "4v4"); party.members.pop(); app.squads.tick(); assert.equal(app.squads.queues.size, 0);
});
test("session, journal and squad records stay private and disappear with account deletion", async () => {
  const own = await api("/api/journal?player_id=" + id(0), null, people[8]); assert.equal(own.data.totals.runs, 0);
  for (const collection of ["mountain_sessions", "milestone_rewards", "squad_matches"]) assert.equal((await api("/rest/v1/" + collection, null, people[8])).status, 404);
  const old = app.store.rows("mountain_sessions").filter((r) => r.player_id === id(5)).length; assert.ok(old > 0);
  const deleted = await api("/functions/v1/delete-account", { confirm: "DELETE MY ACCOUNT" }, people[5]); assert.equal(deleted.status, 200);
  assert.equal(app.store.rows("mountain_sessions").filter((r) => r.player_id === id(5)).length, 0);
  assert.ok(app.mountainSessions.board("park-tour", "all").every((r) => r.handle !== "Mountain5"));
});
test("eight HTTP clients complete a ranked 4v4 through original physics verification", async () => {
  const physics = await physicsFor("apex"), simulation = physics.createSimulation(), controls = [];
  simulation.arrive();
  for (let frame = 0; frame < 20000 && simulation.phase !== "finished"; frame++) {
    const target = Math.atan2(physics.course.O(simulation.z + 12) - 25 - simulation.x, 12), diff = Math.atan2(Math.sin(target - simulation.heading), Math.cos(target - simulation.heading));
    const steer = Math.round(Math.max(-1, Math.min(1, diff * 1.8)) * 1000) / 1000;
    controls.push(steer);
    simulation.update(1 / 60, { steer, airRoll: 0, forward: true, brake: false, jump: false, grab: false, cork: false, over: false, butter: false, grabStyle: 0, board: false });
  }
  assert.equal(simulation.phase, "finished");
  const raw = Buffer.alloc(9 + controls.length * 6); raw[0] = 1; raw.writeUInt32LE(36, 1); raw.writeUInt32LE(controls.length, 5);
  controls.forEach((steer, i) => { raw.writeInt16LE(Math.round(steer * 1000), 9 + i * 6); raw[13 + i * 6] = 1; });
  const riders = await Promise.all(Array.from({ length: 8 }, (_, i) => rider("PhysicsSquad" + i)));
  // Advance the test clock over the simulated riding time; production uses wall time.
  now = Date.now() - Math.ceil(simulation.elapsed * 1000) - 5000;
  for (const r of riders) assert.equal((await api("/api/squads/queue", { size: "4v4" }, r)).status, 200);
  const match = app.squads.current(riders[0].user.id);
  for (const r of riders) assert.equal((await api("/api/squads/ready", { id: match.id }, r)).status, 200);
  now = Date.now();
  for (const r of riders) {
    const response = await api("/functions/v1/verify-run", { inputs: gzipSync(raw).toString("base64"), run: { id: crypto.randomUUID(), course_id: physics.course.Rn.course, season_id: physics.course.Rn.season, tricks: 999999999 } }, r);
    assert.equal(response.status, 200, JSON.stringify(response.data)); assert.equal(response.data.score, Math.round(simulation.score));
    assert.ok(app.store.rows("completed_runs").some(saved => saved.player_id === r.user.id && saved.inputs_hash === crypto.createHash("sha256").update(raw).digest("hex")));
  }
  const result = (await api("/api/squads", null, riders[0])).data.match;
  assert.equal(result.phase, "complete"); assert.equal(result.winner, "draw"); assert.equal(result.players.filter((p) => p.status === "finished").length, 8);
  assert.equal(result.totals[0], Math.round(simulation.score) * 4); assert.ok(result.players.every((p) => p.result.delta === 0));
  assert.ok(riders.every((r) => app.store.rating(r.user.id, "4v4").games === 1));
});
test.after(async () => { await app.close(); fs.rmSync(directory, { recursive: true, force: true }); });
