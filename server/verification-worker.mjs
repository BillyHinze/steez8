import { parentPort, workerData } from "node:worker_threads";
import { gunzipSync } from "node:zlib";
import { physicsFor } from "./physics.mjs";
try {
  const raw = gunzipSync(Buffer.from(workerData.inputs, "base64"), {
    maxOutputLength: 220000,
  });
  if (raw.length < 9 || raw[0] !== 1) throw Error("Unknown input-log format");
  const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength),
    version = view.getUint32(1, true),
    steps = view.getUint32(5, true);
  const expected = {
    nordryggen: 39,
    apex: 7,
    bigair: 8,
    forestline: 31,
    halfpipe: 36,
  }[workerData.park];
  if (version !== expected || steps > 36000 || raw.length !== 9 + steps * 6)
    throw Error("Input-log version or length mismatch");
  const physics = await physicsFor(workerData.park);
  const s = physics.createSimulation();
  s.arrive();
  for (let n = 0; n < steps; n++) {
    const at = 9 + n * 6,
      flags = raw[at + 4],
      equipment = raw[at + 5],
      steer = view.getInt16(at, true) / 1000,
      airRoll = view.getInt16(at + 2, true) / 1000;
    if (Math.abs(steer) > 1 || Math.abs(airRoll) > 1)
      throw Error("Invalid input axis");
    if (flags & 32) s.recover();
    s.update(1 / 60, {
      steer,
      airRoll,
      forward: !!(flags & 1),
      brake: !!(flags & 2),
      jump: !!(flags & 4),
      grab: !!(flags & 8),
      cork: !!(flags & 16),
      over: !!(flags & 64),
      butter: !!(flags & 128),
      grabStyle: equipment & 127,
      board: !!(equipment & 128),
    });
    if (!Number.isFinite(s.x + s.y + s.z + s.score))
      throw Error("Nonfinite simulation state");
  }
  parentPort.postMessage({
    phase: s.phase,
    score: Math.round(s.score),
    ...s.runScore,
    course_id: physics.course.Rn.course,
    season_id: physics.course.Rn.season,
    duration_ms: Math.round(s.elapsed * 1000),
    top_speed_kmh: Math.round(s.topSpeed),
    airtime_ms: Math.round(s.totalAirTime * 1000),
    landed_jumps: s.landedJumps,
    clean_landings: s.cleanLandings,
    crashes: s.crashes,
    best_combo: Math.round(s.bestCombo),
    best_trick: s.bestTrick,
  });
} catch (error) {
  parentPort.postMessage({ error: error.message });
}
