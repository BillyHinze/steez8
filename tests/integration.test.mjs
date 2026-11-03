import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { once } from "node:events";
import { WebSocket } from "ws";
import { createApplication } from "../server/index.mjs";
import { physicsFor } from "../server/physics.mjs";
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "independent-ski-test-"));
const app = createApplication({ dataDir: dir });
app.server.listen(0, "127.0.0.1");
await once(app.server, "listening");
const base = `http://127.0.0.1:${app.server.address().port}`;
async function api(url, body, token, method = body ? "POST" : "GET") {
  const response = await fetch(base + url, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: "Bearer " + token } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, data: await response.json() };
}
const accounts = {};
test.after(async () => {
  await app.close();
  fs.rmSync(dir, { recursive: true, force: true });
});
test("real registration, password verification, persistence and session rotation", async () => {
  for (const handle of ["Alpha", "Bravo"]) {
    const r = await api("/auth/v1/signup", {
      email: handle.toLowerCase() + "@example.test",
      password: "local-test-password",
      data: { handle },
    });
    assert.equal(r.status, 200);
    assert.equal(r.data.user.is_anonymous, false);
    accounts[handle] = r.data;
  }
  const duplicate = await api("/auth/v1/signup", {
    email: "alpha@example.test",
    password: "local-test-password",
    data: { handle: "AlphaAgain" },
  });
  assert.equal(duplicate.status, 409);
  assert.equal(
    (
      await api("/auth/v1/token?grant_type=password", {
        email: "alpha@example.test",
        password: "wrong",
      })
    ).status,
    400,
  );
  const login = await api("/auth/v1/token?grant_type=password", {
    email: "alpha@example.test",
    password: "local-test-password",
  });
  assert.equal(login.data.user.id, accounts.Alpha.user.id);
  const refresh = await api("/auth/v1/token?grant_type=refresh_token", {
    refresh_token: login.data.refresh_token,
  });
  assert.equal(refresh.status, 200);
  assert.equal(
    (await api("/auth/v1/user", null, login.data.access_token)).status,
    401,
  );
  assert.equal(
    (await api("/auth/v1/user", null, refresh.data.access_token)).status,
    200,
  );
  assert.equal(
    (
      await api("/auth/v1/token?grant_type=refresh_token", {
        refresh_token: login.data.refresh_token,
      })
    ).status,
    401,
  );
  const row = app.store.db
    .prepare("SELECT password_hash FROM users WHERE id=?")
    .get(accounts.Alpha.user.id);
  assert.notEqual(row.password_hash, "local-test-password");
});
test("settings persist and one rider cannot write or read another rider’s private data", async () => {
  const a = accounts.Alpha,
    b = accounts.Bravo;
  assert.equal(
    (
      await api(
        "/rest/v1/player_settings",
        { player_id: a.user.id, controls: { jump: "Space" } },
        a.access_token,
      )
    ).status,
    201,
  );
  const saved = await api(
    "/rest/v1/player_settings?player_id=eq." + a.user.id,
    null,
    a.access_token,
  );
  assert.equal(saved.data[0].controls.jump, "Space");
  assert.deepEqual(
    (
      await api(
        "/rest/v1/player_settings?player_id=eq." + a.user.id,
        null,
        b.access_token,
      )
    ).data,
    [],
  );
  assert.equal(
    (
      await api(
        "/rest/v1/player_settings",
        { player_id: a.user.id, controls: {} },
        b.access_token,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await api(
        "/rest/v1/completed_runs",
        { id: "fake", score: 999999 },
        a.access_token,
      )
    ).status,
    403,
  );
  assert.equal(
    (await api("/rest/v1/rpc/my_snapshot", {}, a.access_token)).data.profile
      .handle,
    "Alpha",
  );
});
test("friend requests use real stored relationships and require the recipient to accept", async () => {
  const a = accounts.Alpha,
    b = accounts.Bravo;
  assert.equal(
    (await api("/rest/v1/rpc/friend_ask", { target: "Bravo" }, a.access_token))
      .data.result,
    "asked",
  );
  assert.equal(
    (await api("/rest/v1/rpc/my_friends", {}, b.access_token)).data[0].state,
    "asked-you",
  );
  assert.equal(
    (
      await api(
        "/rest/v1/rpc/friend_answer",
        { other: b.user.id, yes: true },
        a.access_token,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await api(
        "/rest/v1/rpc/friend_answer",
        { other: a.user.id, yes: true },
        b.access_token,
      )
    ).status,
    200,
  );
  assert.equal(
    (await api("/rest/v1/rpc/my_friends", {}, a.access_token)).data[0].state,
    "friends",
  );
});
function client(room) {
  const ws = new WebSocket(
    base.replace("http:", "ws:") + "/parties/mountain/" + room,
  );
  const messages = [];
  ws.on("message", (data, binary) =>
    messages.push(binary ? Buffer.from(data) : JSON.parse(data)),
  );
  return {
    ws,
    messages,
    async wait(predicate) {
      for (let n = 0; n < 100; n++) {
        const item = messages.find(predicate);
        if (item) return item;
        await new Promise((r) => setTimeout(r, 10));
      }
      throw Error(
        "Expected socket message not received: " + JSON.stringify(messages),
      );
    },
  };
}
test("two authenticated clients exchange roster, actual binary poses, chat and disconnections", async () => {
  const a = client("halfpipe"),
    b = client("halfpipe");
  try {
    await Promise.all([once(a.ws, "open"), once(b.ws, "open")]);
    a.ws.send(
      JSON.stringify({ t: "auth", token: accounts.Alpha.access_token }),
    );
    const ar = await a.wait((m) => m.t === "roster");
    b.ws.send(
      JSON.stringify({ t: "auth", token: accounts.Bravo.access_token }),
    );
    const br = await b.wait((m) => m.t === "roster");
    assert.equal(br.riders[0].name, "Alpha");
    assert.notEqual(ar.me, br.me);
    assert.equal((await a.wait((m) => m.t === "join")).name, "Bravo");
    const packet = Buffer.alloc(98);
    packet[0] = 1;
    packet[1] = 255;
    packet.writeFloatLE(2, 2);
    packet.writeInt16LE(32767, 92);
    a.ws.send(packet);
    const forwarded = await b.wait(Buffer.isBuffer);
    assert.equal(
      forwarded[1],
      ar.me,
      "server must replace the spoofed rider ID",
    );
    a.ws.send(JSON.stringify({ t: "chat", text: "Test line" }));
    assert.equal((await b.wait((m) => m.t === "chat")).text, "Test line");
    assert.equal((await api("/populations")).data.rooms.halfpipe.count, 2);
    a.ws.close();
    assert.equal((await b.wait((m) => m.t === "leave")).id, ar.me);
  } finally {
    a.ws.terminate();
    b.ws.terminate();
  }
});
test("malformed network packets are rejected and unauthenticated clients cannot join", async () => {
  const a = client("bigair");
  try {
    await once(a.ws, "open");
    a.ws.send(JSON.stringify({ t: "auth", token: "fake" }));
    const [code] = await once(a.ws, "close");
    assert.equal(code, 4004);
  } finally {
    a.ws.terminate();
  }
  const b = client("bigair");
  try {
    await once(b.ws, "open");
    b.ws.send(
      JSON.stringify({ t: "auth", token: accounts.Bravo.access_token }),
    );
    await b.wait((m) => m.t === "roster");
    b.ws.send(Buffer.alloc(98));
    const [code] = await once(b.ws, "close");
    assert.equal(code, 1008);
  } finally {
    b.ws.terminate();
  }
});
test("the original physics and all five competitive course collision sets execute deterministically", async () => {
  for (const park of [
    "nordryggen",
    "apex",
    "bigair",
    "forestline",
    "halfpipe",
  ]) {
    const p = await physicsFor(park),
      a = p.createSimulation(),
      b = p.createSimulation();
    a.arrive();
    b.arrive();
    assert.ok(a.collisions);
    const input = {
      steer: 0,
      airRoll: 0,
      forward: true,
      brake: false,
      jump: false,
      grab: false,
      cork: false,
      over: false,
      butter: false,
      grabStyle: 0,
      board: false,
    };
    for (let n = 0; n < 120; n++) {
      a.update(1 / 60, input);
      b.update(1 / 60, input);
    }
    assert.equal(a.z, b.z);
    assert.equal(a.score, b.score);
    assert.ok(Number.isFinite(a.x + a.y + a.z));
    assert.equal(p.course.m, park);
  }
});
test("a completed input log is replayed by original server physics, ignoring forged client scores", async () => {
  const p = await physicsFor("halfpipe"),
    s = p.createSimulation(),
    inputs = [];
  s.arrive();
  for (let n = 0; n < 10000 && s.phase !== "finished"; n++) {
    const target = Math.atan2(p.course.O(s.z + 12) - s.x, 12),
      diff = Math.atan2(
        Math.sin(target - s.heading),
        Math.cos(target - s.heading),
      );
    const steer =
      Math.round(Math.max(-1, Math.min(1, diff * 1.8)) * 1000) / 1000;
    inputs.push({ steer });
    s.update(1 / 60, {
      steer,
      airRoll: 0,
      forward: true,
      brake: false,
      jump: false,
      grab: false,
      cork: false,
      over: false,
      butter: false,
      grabStyle: 0,
      board: false,
    });
  }
  assert.equal(s.phase, "finished");
  const data = Buffer.alloc(9 + inputs.length * 6);
  data[0] = 1;
  data.writeUInt32LE(7, 1);
  data.writeUInt32LE(inputs.length, 5);
  for (let n = 0; n < inputs.length; n++) {
    data.writeInt16LE(Math.round(inputs[n].steer * 1000), 9 + n * 6);
    data[13 + n * 6] = 1;
  }
  const id = crypto.randomUUID(),
    body = {
      run: {
        id,
        course_id: p.course.Rn.course,
        season_id: p.course.Rn.season,
        tricks: 9999999,
        grabs: 0,
        rails: 0,
        landings: 0,
      },
      inputs: gzipSync(data).toString("base64"),
    };
  const verified = await api(
    "/functions/v1/verify-run",
    body,
    accounts.Alpha.access_token,
  );
  assert.equal(verified.status, 200, JSON.stringify(verified.data));
  assert.equal(verified.data.verified, true);
  assert.equal(verified.data.score, Math.round(s.score));
  assert.equal(verified.data.adjusted, true);
  const board = await api("/leaderboard?season=" + p.course.Rn.season);
  assert.equal(board.data.count, 1);
  assert.equal(board.data.top[0].run_id, id);
  assert.equal(board.data.top[0].score, Math.round(s.score));
  const repeat = await api(
    "/functions/v1/verify-run",
    body,
    accounts.Alpha.access_token,
  );
  assert.equal(repeat.data.score, verified.data.score);
  assert.equal(app.store.rows("completed_runs").length, 1);
  const invalid = await api(
    "/functions/v1/verify-run",
    {
      ...body,
      run: { ...body.run, id: crypto.randomUUID() },
      inputs: "not-gzip",
    },
    accounts.Alpha.access_token,
  );
  assert.equal(invalid.status, 422);
});
test("shared replays decode with the original codec and reject score, sample and ownership forgery", async () => {
  const p = await physicsFor("halfpipe"),
    codec = (await p.module("replay-Bo7bmJ9f.js")).b,
    run = app.store.rows("completed_runs")[0],
    recorder = new codec.ReplayRecorder({});
  for (let n = 0; n < 3; n++) recorder.capture(codec.blankPose(), {});
  const replay = recorder.finish({
    score: run.score,
    course: run.course_id,
    season: run.season_id,
  });
  const encoded = () => gzipSync(codec.encodeReplay(replay)).toString("base64");
  const uploaded = await api(
    "/functions/v1/verify-run?replay",
    { run_id: run.id, replay: encoded() },
    accounts.Alpha.access_token,
  );
  assert.equal(uploaded.status, 200, JSON.stringify(uploaded.data));
  assert.equal(uploaded.data.replay, true);
  const r = await fetch(
    base +
      "/storage/v1/object/public/run-replays/" +
      run.season_id +
      "/" +
      run.id +
      ".c7r.gz",
  );
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("content-type"), "application/gzip");
  replay.meta.score++;
  assert.equal(
    (
      await api(
        "/functions/v1/verify-run?replay",
        { run_id: run.id, replay: encoded() },
        accounts.Alpha.access_token,
      )
    ).status,
    422,
  );
  replay.meta.score--;
  replay.floats[0] = Infinity;
  assert.equal(
    (
      await api(
        "/functions/v1/verify-run?replay",
        { run_id: run.id, replay: encoded() },
        accounts.Alpha.access_token,
      )
    ).status,
    422,
  );
  assert.equal(
    (
      await api(
        "/functions/v1/verify-run?replay",
        { run_id: run.id, replay: encoded() },
        accounts.Bravo.access_token,
      )
    ).status,
    404,
  );
  assert.equal(
    (
      await api(
        "/functions/v1/delete-account",
        { confirm: "DELETE MY ACCOUNT" },
        accounts.Alpha.access_token,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await fetch(
        base +
          "/storage/v1/object/public/run-replays/" +
          run.season_id +
          "/" +
          run.id +
          ".c7r.gz",
      )
    ).status,
    404,
  );
});
