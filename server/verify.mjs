import { Worker } from "node:worker_threads";
import fs from "node:fs";
import path from "node:path";
const courses = {
  "nordryggen-v1": "nordryggen",
  "apex-v1": "apex",
  "forestline-v2": "forestline",
  "bigair-v7": "bigair",
  "halfpipe-v9": "halfpipe",
};
let running = 0;
export async function verifyRun(store, id, body, replayOnly = false) {
  if (replayOnly) {
    const run = store.get("completed_runs", body.run_id);
    if (!run || run.player_id !== id)
      throw Object.assign(Error("Run not found"), { status: 404 });
    if (!run.verified)
      throw Object.assign(Error("Run is not verified"), { status: 403 });
    if (typeof body.replay !== "string" || body.replay.length > 2e6)
      throw Object.assign(Error("Invalid replay"), { status: 400 });
    const bytes = Buffer.from(body.replay, "base64");
    if (bytes[0] !== 31 || bytes[1] !== 139)
      throw Object.assign(Error("Replay must be gzip"), { status: 400 });
    const directory = path.join(store.directory, "replays", run.season_id);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, run.id + ".c7r.gz"), bytes);
    store.put("completed_runs", run.id, { ...run, has_replay: true });
    return { replay: true };
  }
  if (
    !body.run ||
    !courses[body.run.course_id] ||
    !/^\w[\w-]{0,60}$/.test(String(body.run.season_id)) ||
    !/^([a-f0-9]{8}-[a-f0-9-]{27})$/.test(String(body.run.id)) ||
    typeof body.inputs !== "string" ||
    body.inputs.length > 1000000
  )
    throw Object.assign(
      Error("A supported course, run ID and input log are required"),
      { status: 400 },
    );
  const existing = store.get("completed_runs", body.run.id);
  if (existing) {
    if (existing.player_id !== id)
      throw Object.assign(Error("Run belongs to another account"), {
        status: 403,
      });
    return {
      verified: existing.verified,
      score: existing.score,
      replay: !!existing.has_replay,
      account: store.account(id),
    };
  }
  if (running >= 2)
    throw Object.assign(Error("Verification queue is busy; retry shortly"), {
      status: 429,
    });
  running++;
  let result;
  try {
    result = await new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL("./verification-worker.mjs", import.meta.url),
        {
          workerData: {
            park: courses[body.run.course_id],
            inputs: body.inputs,
          },
          resourceLimits: { maxOldGenerationSizeMb: 160 },
        },
      );
      const timer = setTimeout(() => {
        worker.terminate();
        reject(
          Object.assign(Error("Verification time limit exceeded"), {
            status: 422,
          }),
        );
      }, 15000);
      worker.once("message", (message) => {
        clearTimeout(timer);
        worker.terminate();
        message.error
          ? reject(Object.assign(Error(message.error), { status: 422 }))
          : resolve(message);
      });
      worker.once("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
      worker.once("exit", (code) => {
        clearTimeout(timer);
        if (code !== 0)
          reject(
            Object.assign(Error("Verification worker ended"), { status: 422 }),
          );
      });
    });
  } finally {
    running--;
  }
  if (result.phase !== "finished")
    throw Object.assign(
      Error("The original simulation did not reach the finish"),
      { status: 422 },
    );
  if (
    body.run.season_id !== result.season_id ||
    body.run.course_id !== result.course_id
  )
    throw Object.assign(
      Error("Course or season does not match the recovered simulation"),
      { status: 422 },
    );
  const run = {
    ...result,
    player_id: id,
    id: body.run.id,
    season_id: body.run.season_id,
    course_id: body.run.course_id,
    created_at: new Date().toISOString(),
    verified: true,
    has_replay: false,
    source: "independent-original-simulation",
  };
  store.put("completed_runs", run.id, run);
  store.put("run_inputs", run.id, { player_id: id, inputs: body.inputs });
  return {
    verified: true,
    score: run.score,
    adjusted:
      run.score !==
      Math.round(
        (body.run.tricks || 0) +
          (body.run.grabs || 0) +
          (body.run.rails || 0) +
          (body.run.landings || 0),
      ),
    replay: false,
    account: store.account(id),
  };
}
