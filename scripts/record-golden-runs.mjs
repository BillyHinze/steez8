// Records deterministic "golden" runs for the score verifier.
//
//   node --experimental-vm-modules scripts/record-golden-runs.mjs
//
// For every park whose LIVE simulation version has no golden run yet, a
// scripted rider (the SNOWBOT line-following policy plus spins and every grab
// style) rides to the finish. Its exact inputs are encoded as a real input log
// and verified by the production worker. The result is stored in
// tests/fixtures/golden-runs.json.
//
// Existing runs are NEVER overwritten: a changed score for an already
// recorded version is exactly what tests/simulation-versions.test.mjs exists
// to catch. Record new runs only after registering a new simulation version.
import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { physicsFor } from "../server/physics-v2.mjs";
import { workerJob } from "../server/verify-v2.mjs";
import { SIMULATIONS, liveVersion } from "../server/simulation-versions.mjs";

const output = path.resolve(import.meta.dirname, "../tests/fixtures/golden-runs.json");
const existing = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, "utf8")) : [];
const FLAGS = { forward: 1, brake: 2, jump: 4, grab: 8, cork: 16, recover: 32, over: 64, butter: 128 };
const quantize = (value) => Math.round(Math.max(-1, Math.min(1, value)) * 1000) / 1000;

async function ride(park, version) {
  const physics = await physicsFor(park, version);
  const C = physics.course.C, s = physics.createSimulation();
  const center = typeof C.center === "function" ? C.center : physics.course.O;
  const lips = [
    ...C.JUMPS.map((j) => j.z),
    ...(C.RAILS || []).filter((r) => r.entry === "pop" && Math.abs(r.offset) < 1).map((r) => r.z - 4),
  ].sort((a, b) => a - b);
  const steps = [];
  let air = 0, jumps = 0, still = 0;
  for (let frame = 0; frame < 36000 && s.phase !== "finished"; frame++) {
    const input = { steer: 0, airRoll: 0, forward: false, brake: false, jump: false, grab: false, cork: false, over: false, butter: false, grabStyle: 0, board: false };
    if (s.airborne) {
      if (air === 0) jumps++;
      air += 1 / 60;
      input.steer = air < 0.5 ? (jumps % 2 ? 1 : -1) : 0;
      // Vary hold length around the 0.25 s qualifying time so small changes to
      // grab rules change the verified result: 0.22 s, 0.30 s, 0.6 s, to landing.
      const hold = [0.22, 0.30, 0.6, Infinity][jumps % 4];
      input.grab = air > 0.12 && air < 0.12 + hold;
      input.grabStyle = jumps % 8; // cycles through every catalog grab, 0-7
    } else {
      air = 0;
      const t = 28 + s.speed * 0.35;
      const n = Math.atan2(center(s.z + t) - s.x, t);
      const r = Math.atan2(Math.sin(n - s.travelHeading), Math.cos(n - s.travelHeading));
      const lip = lips.find((z) => z > s.z), d = lip === undefined ? Infinity : lip - s.z;
      input.steer = s.grind ? 0 : quantize(r * 2.7 / (0.72 + Math.min(0.42, s.speed / 85)));
      input.forward = park === "bigair" || s.speed < 9;
      input.jump = d < 15 && d > 3;
    }
    still = s.speed < 0.5 && !s.airborne && s.crashTime <= 0 ? still + 1 : 0;
    const recover = still > 120;
    if (recover) { s.recover(); still = 0; }
    s.update(1 / 60, input);
    steps.push({ ...input, recover });
  }
  if (s.phase !== "finished") throw Error(park + " golden rider did not finish");
  const raw = Buffer.alloc(9 + steps.length * 6);
  raw[0] = 1;
  raw.writeUInt32LE(version, 1);
  raw.writeUInt32LE(steps.length, 5);
  steps.forEach((step, i) => {
    const at = 9 + i * 6;
    raw.writeInt16LE(Math.round(step.steer * 1000), at);
    raw.writeInt16LE(Math.round(step.airRoll * 1000), at + 2);
    raw[at + 4] = Object.entries(FLAGS).reduce((bits, [name, bit]) => bits | (step[name] ? bit : 0), 0);
    raw[at + 5] = (step.grabStyle & 127) | (step.board ? 128 : 0);
  });
  const inputs = gzipSync(raw, { level: 9 }).toString("base64");
  const expected = await workerJob({ park, inputs, competitive: false, maximumSeconds: 600 });
  if (expected.error || expected.score !== Math.round(s.score))
    throw Error(`${park}: client simulation scored ${Math.round(s.score)} but the verifier returned ${JSON.stringify(expected)}`);
  delete expected.id;
  return { park, version, recorded: new Date().toISOString().slice(0, 10), inputs, expected };
}

const runs = [...existing];
for (const park of Object.keys(SIMULATIONS)) {
  const version = liveVersion(park);
  if (runs.some((r) => r.park === park && r.version === version)) {
    console.log(`${park} v${version}: already recorded, kept`);
    continue;
  }
  const run = await ride(park, version);
  runs.push(run);
  console.log(`${park} v${version}: score ${run.expected.score}, ${run.expected.landed_jumps} landings, best "${run.expected.best_trick}"`);
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(runs, null, 1) + "\n");
console.log("Wrote", path.relative(process.cwd(), output));
