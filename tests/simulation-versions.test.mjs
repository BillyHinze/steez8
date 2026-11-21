import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { gzipSync, gunzipSync } from "node:zlib";
import { physicsFor, physicsFromDirectory } from "../server/physics-v2.mjs";
import { workerJob } from "../server/verify-v2.mjs";
import {
  LIVE, LIVE_DIRECTORY, SIMULATIONS, SIMULATION_FILES,
  acceptedVersions, frozenDirectories, liveVersion, missingSimulationFiles,
} from "../server/simulation-versions.mjs";

const golden = JSON.parse(fs.readFileSync(new URL("./fixtures/golden-runs.json", import.meta.url), "utf8"));
const chunk = (name) => fs.readFileSync(path.join(LIVE_DIRECTORY, name), "utf8");

// Replays a golden input log in this thread, exactly as the verification
// worker does, against an explicit physics instance.
function replay(physics, inputs) {
  const raw = gunzipSync(Buffer.from(inputs, "base64"));
  const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength), steps = view.getUint32(5, true);
  const s = physics.createSimulation();
  for (let n = 0; n < steps; n++) {
    const at = 9 + n * 6, flags = raw[at + 4], equipment = raw[at + 5];
    if (flags & 32) s.recover();
    s.update(1 / 60, {
      steer: view.getInt16(at, true) / 1000, airRoll: view.getInt16(at + 2, true) / 1000,
      forward: !!(flags & 1), brake: !!(flags & 2), jump: !!(flags & 4), grab: !!(flags & 8),
      cork: !!(flags & 16), over: !!(flags & 64), butter: !!(flags & 128),
      grabStyle: equipment & 127, board: !!(equipment & 128),
    });
  }
  return { phase: s.phase, score: Math.round(s.score) };
}

test("every park has exactly one live simulation version", () => {
  for (const [park, versions] of Object.entries(SIMULATIONS)) {
    assert.equal(Object.values(versions).filter((v) => v === LIVE).length, 1, park);
    assert.ok(acceptedVersions(park).includes(liveVersion(park)), park);
  }
});

test("the server's live versions match what the shipped client stamps on input logs", () => {
  // Base encoder default (input-log chunk) plus the per-park subclasses in the engine.
  const stamped = new Set();
  for (const source of [chunk("input-log-BvMdAwyG.js"), chunk("engine-Dlp-9Jq2.js")])
    for (const match of source.matchAll(/encode\(e\s*=\s*(\d+)\)/g)) stamped.add(Number(match[1]));
  const live = new Set(Object.keys(SIMULATIONS).map(liveVersion));
  assert.deepEqual([...stamped].sort((a, b) => a - b), [...live].sort((a, b) => a - b),
    "A client encoder version changed without registering it in server/simulation-versions.mjs (or vice versa)");
});

test("every frozen simulation version has a complete copy of the simulation files", () => {
  for (const directory of frozenDirectories())
    assert.deepEqual(missingSimulationFiles(directory), [], directory);
  assert.deepEqual(missingSimulationFiles(LIVE_DIRECTORY), []);
});

test("every accepted simulation version has at least one golden run", () => {
  for (const park of Object.keys(SIMULATIONS))
    for (const version of acceptedVersions(park))
      assert.ok(golden.some((r) => r.park === park && r.version === version),
        `No golden run for ${park} v${version}: run scripts/record-golden-runs.mjs`);
});

for (const run of golden) {
  test(`golden ${run.park} v${run.version} run verifies to exactly the recorded result`, async () => {
    const result = await workerJob({ park: run.park, inputs: run.inputs, competitive: false, maximumSeconds: 600 });
    delete result.id;
    assert.deepEqual(result, run.expected,
      "Verified scoring changed for an existing simulation version. If intentional, freeze the old " +
      "simulation and register a new version (server/simulation-versions.mjs) instead of editing this fixture.");
  });
}

test("golden runs cover every grab style and rail and air scoring", () => {
  const styles = new Set();
  for (const run of golden) {
    const raw = gunzipSync(Buffer.from(run.inputs, "base64"));
    for (let at = 9; at < raw.length; at += 6) if (raw[at + 4] & 8) styles.add(raw[at + 5] & 127);
  }
  assert.deepEqual([...styles].sort(), [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.ok(golden.some((r) => r.expected.rails > 0), "no rail scoring covered");
  assert.ok(golden.some((r) => r.expected.grabs > 0 && r.expected.tricks > 0), "no air/grab scoring covered");
});

test("a frozen copy of the simulation files reproduces the golden result", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "steez8-frozen-sim-"));
  try {
    for (const file of SIMULATION_FILES) fs.copyFileSync(path.join(LIVE_DIRECTORY, file), path.join(directory, file));
    const run = golden.find((r) => r.park === "apex");
    const frozen = await physicsFromDirectory("apex", directory, "test-frozen-apex");
    assert.deepEqual(replay(frozen, run.inputs), { phase: "finished", score: run.expected.score });
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("unregistered input-log versions are rejected, not scored with the wrong physics", async () => {
  await assert.rejects(physicsFor("apex", 999), /Unsupported simulation version 999/);
  const run = golden.find((r) => r.park === "apex");
  const raw = gunzipSync(Buffer.from(run.inputs, "base64"));
  raw.writeUInt32LE(999, 1);
  await assert.rejects(
    workerJob({ park: "apex", inputs: gzipSync(raw).toString("base64"), competitive: false, maximumSeconds: 600 }),
    (error) => error.status === 422 && /version or length mismatch \(version=999/.test(error.message),
  );
});
