import { Worker } from "node:worker_threads";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const courses = {
    "nordryggen-v1": "nordryggen",
    "apex-v1": "apex",
    "ridgeline-v1": "ridgeline",
    "forestline-v2": "forestline",
    "bigair-v7": "bigair",
    "halfpipe-v9": "halfpipe",
  },
  uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const fault = (message, status = 400) =>
  Object.assign(Error(message), { status });
let running = 0;
export async function workerJob(data) {
  if (running >= Math.max(1, Number(process.env.VERIFICATION_CONCURRENCY) || 3))
    throw fault("Verification queue is busy; retry shortly", 429);
  running++;
  try {
    return await new Promise((resolve, reject) => {
      const worker = new Worker(
          new URL("./verification-worker-v2.mjs", import.meta.url),
          { workerData: data, resourceLimits: { maxOldGenerationSizeMb: 192 } },
        ),
        timer = setTimeout(() => {
          worker.terminate();
          reject(fault("Verification time limit exceeded", 422));
        }, 20000);
      worker.once("message", (m) => {
        clearTimeout(timer);
        worker.terminate();
        m.error ? reject(fault(m.error, 422)) : resolve(m);
      });
      worker.once("error", (e) => {
        clearTimeout(timer);
        reject(e);
      });
      worker.once("exit", (code) => {
        clearTimeout(timer);
        if (code !== 0) reject(fault("Verification worker ended", 422));
      });
    });
  } finally {
    running--;
  }
}
export async function verifyRun(store, id, body, replayOnly = false) {
  if (store.banned(id)) throw fault("Account is not eligible to submit runs", 403);
  if (replayOnly) {
    const run = store.get("completed_runs", body.run_id);
    if (!run || run.player_id !== id) throw fault("Run not found", 404);
    if (
      !run.verified ||
      typeof body.replay !== "string" ||
      body.replay.length > 2e6
    )
      throw fault("Invalid replay", 400);
    await workerJob({
      replay: body.replay,
      expected: run,
      park: courses[run.course_id],
    });
    const directory = path.join(store.directory, "replays", run.season_id);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(
      path.join(directory, run.id + ".c7r.gz"),
      Buffer.from(body.replay, "base64"),
    );
    // The local file is a cache. Cloud deployments persist shared clips in the
    // same permanent database as the verified run.
    if (store.remote) store.put('shared_replays', run.id, { player_id: id, data: body.replay });
    store.put("completed_runs", run.id, { ...run, has_replay: true });
    return { replay: true };
  }
  if (typeof body.inputs !== "string" || body.inputs.length > 1000000)
    throw fault("A bounded input log is required");
  let context = null;
  if (body.duel || body.team)
    context = store.competition.verificationContext(id, body);
  else if (body.cup) context = store.cups.verificationContext(id, body);
  const park = context?.park || courses[body.run?.course_id];
  if (!park) throw fault("A supported course is required");
  const run = body.run;
  if (
    run &&
    (!uuid.test(String(run.id)) ||
      !/^[-a-z0-9]{1,60}$/.test(String(run.season_id)))
  )
    throw fault("A valid run and season are required");
  const existing = run && store.get("completed_runs", run.id);
  if (existing && existing.player_id !== id)
    throw fault("Run belongs to another account", 403);
  if (existing && !context)
    return {
      verified: true,
      score: existing.score,
      replay: !!existing.has_replay,
      account: store.account(id),
    };
  const result = await workerJob({
    park,
    inputs: body.inputs,
    competitive: !!context,
    lane: context?.lane || 0,
    cup: context?.cupLane || null,
    maximumSeconds: context?.maximumSeconds || 600,
  });
  if (!context && result.phase !== "finished")
    throw fault("The original simulation did not reach the finish", 422);
  if (
    run &&
    (run.season_id !== result.season_id || run.course_id !== result.course_id)
  )
    throw fault(
      "Course or season does not match the recovered simulation",
      422,
    );
  if (context) {
    if (context.match) store.competition.verified(context, result);
    else store.cups.verified(context, result);
  }
  let saved = existing;
  if (run && !existing && result.phase === "finished") {
    saved = {
      ...result,
      id: run.id,
      player_id: id,
      season_id: result.season_id,
      course_id: result.course_id,
      created_at: new Date().toISOString(),
      verified: true,
      has_replay: false,
      source: "original-simulation",
      inputs_hash: result.inputs_hash,
    };
    store.transaction(() => {
      store.put("completed_runs", saved.id, saved);
      store.put("run_inputs", saved.id, { player_id: id, inputs: body.inputs });
      store.economy?.verifiedRun(id, saved);
      store.mountainSessions?.accept(id, saved, { competitive: !!context });
      store.squads?.accept(id, saved, { competitive: !!context });
    });
  }
  return {
    verified: true,
    score: result.score,
    adjusted:
      !!run &&
      result.score !==
        Math.round(
          (run.tricks || 0) +
            (run.grabs || 0) +
            (run.rails || 0) +
            (run.landings || 0),
        ),
    replay: !!saved?.has_replay,
    account: store.account(id),
  };
}
