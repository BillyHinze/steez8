import crypto from "node:crypto";
import { parentPort } from "node:worker_threads";
import { gunzipSync } from "node:zlib";
import { physicsFor } from "./physics-v2.mjs";
async function verify(workerData) {
try {
  const physics = await physicsFor(workerData.park);
  if (workerData.replay) {
    const raw = gunzipSync(Buffer.from(workerData.replay, "base64"), {
        maxOutputLength: 12 * 1024 * 1024,
      }),
      codec = (await physics.module("replay-Bo7bmJ9f.js")).b;
    let replay;
    try {
      replay = codec.decodeReplay(
        raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength),
      );
    } catch {
      replay = codec.decodeReplay(new Uint8Array(raw));
    }
    if (
      !replay?.meta ||
      !Number.isFinite(replay.meta.duration) ||
      replay.meta.duration < 0 ||
      replay.meta.duration > 1500 ||
      replay.frames > 90000
    )
      throw Error("Replay exceeds supported bounds");
    if (
      !Number.isFinite(replay.hz) ||
      replay.hz < 1 ||
      replay.hz > 120 ||
      Math.abs(
        replay.meta.duration - Math.max(0, replay.frames - 1) / replay.hz,
      ) > 0.1 ||
      [...replay.floats].some((v) => !Number.isFinite(v)) ||
      replay.crashes.some(
        (c) =>
          c.index >= replay.frames ||
          [...c.points].some((v) => !Number.isFinite(v)),
      )
    )
      throw Error("Invalid replay samples");
    const meta = replay.meta,
      expected = workerData.expected;
    if (
      !Number.isFinite(meta.score) ||
      Math.round(meta.score) !== expected.score
    )
      throw Error("Replay score does not match the verified run");
    if (meta.course !== expected.course_id)
      throw Error("Replay course does not match the verified run");
    return { ok: true, frames: replay.frames };
  } else {
    const raw = gunzipSync(Buffer.from(workerData.inputs, "base64"), {
      maxOutputLength: 220000,
    });
    if (raw.length < 9 || raw[0] !== 1) throw Error("Unknown input-log format");
    const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength),
      version = view.getUint32(1, true),
      steps = view.getUint32(5, true),
      expected = {
        nordryggen: 39,
        apex: 36,
        ridgeline: 36,
        bigair: 31,
        forestline: 8,
        halfpipe: 7,
      }[workerData.park];
    if (
      version !== expected ||
      steps < 1 ||
      steps >
        Math.min(36000, Math.ceil((workerData.maximumSeconds || 600) * 60)) ||
      raw.length !== 9 + steps * 6
    )
      throw Error(`Input-log version or length mismatch (version=${version}, steps=${steps}, bytes=${raw.length}, limit=${workerData.maximumSeconds})`);
    const s = physics.createSimulation({
      competitive: workerData.competitive,
      lane: workerData.lane,
      cup: workerData.cup,
    });
    for (let n = 0; n < steps; n++) {
      const at = 9 + n * 6,
        flags = raw[at + 4],
        equipment = raw[at + 5],
        steer = view.getInt16(at, true) / 1000,
        airRoll = view.getInt16(at + 2, true) / 1000;
      if (
        Math.abs(steer) > 1 ||
        Math.abs(airRoll) > 1 ||
        (equipment & 127) > 15
      )
        throw Error("Invalid input");
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
    return {
      inputs_hash: crypto.createHash("sha256").update(raw).digest("hex"),
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
    };
  }
 } catch (error) {
    return { error: error.message };
  }
}

// Keep the physics runtime warm between verification requests. Rebuilding its VM
// for each run is particularly expensive on Render's small shared instances.
parentPort.on("message", async ({ id, data }) => {
  const result = await verify(data);
  parentPort.postMessage({ id, ...result });
});
