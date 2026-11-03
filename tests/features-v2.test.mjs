import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { once } from "node:events";
import { gzipSync } from "node:zlib";
import { WebSocket } from "ws";
import { createApplication } from "../server/index.mjs";
import vm from "node:vm";
import sources from "../server/recovered/runtime-sources.mjs";
import { physicsFor } from "../server/physics-v2.mjs";
import { workerJob } from "../server/verify-v2.mjs";
const directory = fs.mkdtempSync(
  path.join(os.tmpdir(), "cork7-feature-tests-"),
);
let now = Date.now();
const app = createApplication({ dataDir: directory, clock: () => now });
await app.ready;
app.server.listen(0, "127.0.0.1");
await once(app.server, "listening");
const base = "http://127.0.0.1:" + app.server.address().port,
  accounts = {},
  sockets = [];
async function api(route, body, token, method = body ? "POST" : "GET") {
  const r = await fetch(base + route, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: "Bearer " + token } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: r.status, data: await r.json() };
}
async function make(name) {
  const r = await api("/auth/v1/signup", {
    email: name.toLowerCase() + "@example.test",
    password: "FeatureTest-Password",
    data: { handle: name },
  });
  assert.equal(r.status, 200);
  accounts[name] = r.data;
  return r.data;
}
function socket(route) {
  const ws = new WebSocket(base.replace("http:", "ws:") + route),
    messages = [],
    waiters = [];
  sockets.push(ws);
  ws.on("message", (data, binary) => {
    const m = binary ? Buffer.from(data) : JSON.parse(data);
    messages.push(m);
    for (const w of [...waiters])
      if (w.predicate(m)) {
        waiters.splice(waiters.indexOf(w), 1);
        clearTimeout(w.timer);
        w.resolve(m);
      }
  });
  return {
    ws,
    messages,
    send: (m) => ws.send(JSON.stringify(m)),
    wait(predicate, timeout = 4000) {
      const old = messages.find(predicate);
      if (old) return Promise.resolve(old);
      return new Promise((resolve, reject) => {
        const w = {
          predicate,
          resolve,
          timer: setTimeout(() => {
            waiters.splice(waiters.indexOf(w), 1);
            reject(
              Error(
                "Missing socket message: " + JSON.stringify(messages.slice(-5)),
              ),
            );
          }, timeout),
        };
        waiters.push(w);
      });
    },
  };
}
async function hub(account) {
  const c = socket("/parties/friends/hub");
  await once(c.ws, "open");
  c.send({ t: "auth", token: account.access_token });
  await c.wait((m) => m.t === "hello");
  c.send({ t: "where", where: { at: "lobby" } });
  return c;
}
async function room(account, name) {
  const c = socket("/parties/mountain/" + name);
  await once(c.ws, "open");
  c.send({ t: "auth", token: account.access_token });
  const roster = await c.wait((m) => m.t === "roster");
  c.me = roster.me;
  return c;
}
function inputs(version, steps = 60) {
  const b = Buffer.alloc(9 + steps * 6);
  b[0] = 1;
  b.writeUInt32LE(version, 1);
  b.writeUInt32LE(steps, 5);
  for (let n = 0; n < steps; n++) b[13 + n * 6] = 1;
  return gzipSync(b).toString("base64");
}
async function tick(milliseconds) {
  now += milliseconds;
  await app.realtime.competition.tick();
  await app.cups.tick();
  await new Promise((r) => setTimeout(r, 10));
}
test.after(async () => {
  for (const ws of sockets) ws.terminate();
  await app.close();
  fs.rmSync(directory, { recursive: true, force: true });
});
test("owner entitlements cover the entire expanded catalog without fabricating scores", async () => {
  for (const name of ["Owner", "One", "Two", "Three", "Four", "Stranger"])
    await make(name);
  app.store.db
    .prepare("INSERT INTO metadata(key,value) VALUES(?,?)")
    .run("owner_user_id", accounts.Owner.user.id);
  const me = await api("/api/me", null, accounts.Owner.access_token);
  assert.equal(me.data.user.app_metadata.role, "owner");
  assert.equal(me.data.account.items.length, 580);
  assert.equal(me.data.account.best, null);
  assert.equal(me.data.account.tag, "OWNER");
  assert.equal(me.data.account.pass.paid, true);
  assert.equal(me.data.account.pass.xp, 50000);
  assert.equal(
    (await api("/api/owner/summary", null, accounts.One.access_token)).status,
    403,
  );
  assert.equal(
    (await api("/api/owner/summary", null, accounts.Owner.access_token)).status,
    200,
  );
});
test("cash and fake-payment completion are disabled for every player", async () => {
  for (const account of [accounts.Owner, accounts.One]) {
    const checkout = await api(
      "/functions/v1/shop",
      { checkout: "pow-600", currency: "usd" },
      account.access_token,
    );
    assert.equal(checkout.status, 503);
    assert.match(checkout.data.error, /disabled/i);
    assert.equal(
      (
        await api(
          "/api/test-checkout/nonexistent",
          { confirm: "CONFIRM TEST PURCHASE" },
          account.access_token,
        )
      ).status,
      403,
    );
  }
  assert.equal(app.store.rows("shop_orders").length, 0);
});
test("shop debits real POW once, grants real inventory, and refunds once atomically", async () => {
  const user = accounts.One,
    starting = app.store.balance(accounts.One.user.id),
    offer = app.store.catalog.offers.find((o) => o.id === "hooded-powder");
  assert.ok(offer);
  assert.equal(
    (await api("/functions/v1/shop", { buy: offer.id }, user.access_token))
      .status,
    409,
  );
  const grant = await api(
    "/api/owner/grant",
    { player: user.user.id, pow: 10000 },
    accounts.Owner.access_token,
  );
  assert.equal(grant.status, 200);
  const bought = await api(
    "/functions/v1/shop",
    { buy: offer.id, pow: offer.pow },
    user.access_token,
  );
  assert.equal(bought.status, 200);
  assert.equal(bought.data.balance, 10000 + starting - offer.pow);
  assert.ok(app.store.account(user.user.id).items.includes(offer.items[0]));
  const repeated = await api(
    "/functions/v1/shop",
    { buy: offer.id },
    user.access_token,
  );
  assert.equal(repeated.data.owned, true);
  assert.equal(repeated.data.balance, bought.data.balance);
  const returned = await api(
    "/functions/v1/shop",
    { return: offer.id },
    user.access_token,
  );
  assert.equal(returned.status, 200);
  assert.equal(returned.data.balance, 10000 + starting);
  assert.ok(!app.store.account(user.user.id).items.includes(offer.items[0]));
  assert.equal(
    (await api("/functions/v1/shop", { return: offer.id }, user.access_token))
      .status,
    404,
  );
  assert.equal(
    (
      await api(
        "/rest/v1/rider_items",
        { player_id: user.user.id, item: "chrome" },
        user.access_token,
      )
    ).status,
    403,
  );
  const today = (await api("/rest/v1/rpc/shop_today", {})).data;
  assert.ok(today.cards.length > 0);
  assert.ok(
    today.cards.every((card) =>
      app.store.catalog.displayCatalog.some((o) => o.id === card.card),
    ),
  );
});
test("pass purchase grants reached rewards once and gift permissions remain server owned", async () => {
  const user = accounts.One,
    pass = app.economy.passForNow();
  const paid = await api(
    "/functions/v1/shop",
    { buy: pass.id },
    user.access_token,
  );
  assert.equal(paid.status, 200);
  assert.equal(app.store.account(user.user.id).pass.paid, true);
  const first = pass.rewards.find((r) => r.track === "paid" && r.tier === 1);
  assert.ok(app.store.account(user.user.id).items.includes(first.item));
  const count = app.store.rows("pass_rewards").length;
  app.economy.settleRewards(user.user.id, pass);
  assert.equal(app.store.rows("pass_rewards").length, count);
  const owner = accounts.Owner;
  assert.equal(
    (
      await api(
        "/rest/v1/rpc/friend_ask",
        { target: "Two" },
        owner.access_token,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await api(
        "/rest/v1/rpc/friend_answer",
        { other: owner.user.id, yes: true },
        accounts.Two.access_token,
      )
    ).status,
    200,
  );
  const offer = app.store.catalog.offers.find((o) => o.id === "hooded-powder");
  const gift = await api(
    "/functions/v1/shop",
    { gift: offer.id, to: accounts.Two.user.id },
    owner.access_token,
  );
  assert.equal(gift.status, 200);
  assert.equal(gift.data.gifted, true);
  assert.ok(
    app.store.account(accounts.Two.user.id).items.includes(offer.items[0]),
  );
  assert.equal(
    (
      await api(
        "/functions/v1/shop",
        { gift: offer.id, to: accounts.Three.user.id },
        user.access_token,
      )
    ).status,
    403,
  );
});
test("two real queue clients enter ranked 1v1 and complete four server-verified drops", async () => {
  const a = await hub(accounts.One),
    b = await hub(accounts.Two);
  a.send({ t: "ranked", on: true });
  b.send({ t: "ranked", on: true });
  const found = await a.wait((m) => m.t === "ranked-match");
  assert.equal(found.park, "apex");
  assert.equal((await b.wait((m) => m.t === "ranked-match")).code, found.code);
  const name = "duel-" + found.code,
    ra = await room(accounts.One, name),
    rb = await room(accounts.Two, name);
  const match = app.realtime.competition.byRoom.get(name);
  assert.equal(match.state.phase, "intro");
  assert.equal((await ra.wait((m) => m.t === "duel-record")).duel, match.id);
  const forbidden = await api(
    "/functions/v1/verify-run",
    { duel: { id: match.id, drop: 0 }, inputs: inputs(36) },
    accounts.Stranger.access_token,
  );
  assert.equal(forbidden.status, 403);
  ra.send({ t: "duel", op: "result", drop: 0, score: 999999, v: 2 });
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(app.store.rating(accounts.One.user.id).games, 0);
  await tick(7000);
  await tick(4500);
  for (let drop = 0; drop < 4; drop++) {
    assert.equal(match.state.phase, "run");
    assert.equal(match.state.drop, drop);
    const role = drop % 2 ? "guest" : "host",
      account = Object.values(accounts).find(
        (a) => a.user.id === match.players[role],
      );
    const result = await api(
      "/functions/v1/verify-run",
      { duel: { id: match.id, drop }, inputs: inputs(36) },
      account.access_token,
    );
    assert.equal(result.status, 200, JSON.stringify(result.data));
    assert.equal(result.data.verified, true);
    assert.equal(match.state.phase, "posted");
    // Both browsers must receive the authoritative posted state. Previously
    // the server excluded the match host, leaving players on different turns.
    for (const peer of [ra, rb]) {
      const posted = await peer.wait(
        (m) => m.t === "duel" && m.op === "state" &&
          m.phase === "posted" && m.drop === drop,
      );
      assert.equal(posted.seq, match.state.seq);
    }
    await tick(4500);
    if (drop < 3) await tick(4500);
  }
  assert.equal(match.state.phase, "winner");
  assert.equal(app.store.rating(accounts.One.user.id).games, 1);
  assert.equal(app.store.rating(accounts.Two.user.id).games, 1);
  assert.equal(app.store.rating(accounts.One.user.id).draws, 1);
  const result = (await api("/rest/v1/rpc/ranked_result", { p_duel: match.id }))
    .data;
  assert.equal(result.rated, true);
  assert.equal(result.host.delta, 0);
  assert.equal(result.guest.delta, 0);
  const board = (
    await api("/rest/v1/rpc/ranked_board", {}, accounts.One.access_token)
  ).data;
  assert.equal(board.me.games, 1);
  assert.equal(board.open, true);
  ra.ws.close();
  rb.ws.close();
  a.ws.close();
  b.ws.close();
});
test("party invitation, privacy, chat, leadership and removal use authenticated membership", async () => {
  const a = await hub(accounts.Owner),
    b = await hub(accounts.Two),
    outsider = await hub(accounts.Stranger);
  a.send({ t: "party", op: "invite", to: accounts.Two.user.id });
  const invite = await b.wait((m) => m.t === "party-invite");
  b.send({ t: "party", op: "answer", code: invite.code, yes: true });
  const joined = await b.wait(
    (m) => m.t === "party" && m.party?.members.length === 2,
  );
  const party = app.realtime.competition.party(accounts.Owner.user.id);
  assert.equal(joined.party.leader, accounts.Owner.user.id);
  assert.equal(party.members.length, 2);
  a.send({ t: "party", op: "private", on: true });
  await a.wait((m) => m.t === "party" && m.party?.dest.privacy === "private");
  assert.equal(
    app.realtime.competition.roomAccess(
      accounts.Stranger.user.id,
      "party-" + party.key + "-apex",
      false,
    ),
    false,
  );
  assert.equal(
    app.realtime.competition.roomAccess(
      accounts.Two.user.id,
      "party-" + party.key + "-apex",
      false,
    ),
    true,
  );
  a.send({ t: "party-chat", text: "Private party line" });
  assert.equal(
    (await b.wait((m) => m.t === "party-chat")).text,
    "Private party line",
  );
  assert.ok(!outsider.messages.some((m) => m.t === "party-chat"));
  a.send({ t: "party", op: "lead", who: accounts.Two.user.id });
  await b.wait(
    (m) => m.t === "party" && m.party?.leader === accounts.Two.user.id,
  );
  b.send({ t: "party", op: "kick", who: accounts.Owner.user.id });
  await a.wait(
    (m) => m.t === "party" && m.party === null && m.why === "removed",
  );
  assert.equal(party.members.length, 1);
  b.send({ t: "party", op: "leave" });
  await b.wait((m) => m.t === "party" && m.party === null);
  a.ws.close();
  b.ws.close();
  outsider.ws.close();
});
test("four queue clients complete ranked 2v2 with original active-role order", async () => {
  const names = ["One", "Two", "Three", "Four"],
    hubs = [];
  for (const n of names) hubs.push(await hub(accounts[n]));
  for (const h of hubs) h.send({ t: "ranked", on: true, size: "2v2" });
  const found = await hubs[0].wait((m) => m.t === "team-match"),
    name = "team-" + found.code,
    peers = [];
  for (const n of names) peers.push(await room(accounts[n], name));
  const match = app.realtime.competition.byRoom.get(name);
  assert.equal(match.state.phase, "intro");
  await tick(7000);
  await tick(4500);
  for (let drop = 0; drop < 4; drop++) {
    const slot = ["L1", "R1", "L2", "R2"][drop],
      account = Object.values(accounts).find(
        (a) => a.user.id === match.players[slot],
      );
    assert.ok(app.realtime.competition.activeRoles(match).includes(slot));
    const result = await api(
      "/functions/v1/verify-run",
      { team: { id: match.id, drop }, inputs: inputs(36) },
      account.access_token,
    );
    assert.equal(result.status, 200, JSON.stringify(result.data));
    await tick(4500);
    if (drop < 3) await tick(4500);
  }
  assert.equal(match.state.phase, "winner");
  for (const name of names)
    assert.equal(app.store.rating(accounts[name].user.id, "2v2").games, 1);
  const result = (await api("/rest/v1/rpc/team_result", { p_team: match.id }))
    .data;
  assert.equal(result.rated, true);
  assert.equal(Object.keys(result.riders).length, 4);
  for (const c of [...hubs, ...peers]) c.ws.close();
});
test("owner cup uses original timed event state and verified rider marks", async () => {
  const owner = await hub(accounts.Owner),
    other = await hub(accounts.Three);
  const opened = await api(
    "/api/owner/cup-create",
    { maps: ["halfpipe"], seats: 20, final: "zero", startIn: 2 },
    accounts.Owner.access_token,
  );
  assert.equal(opened.status, 200, JSON.stringify(opened.data));
  const c = app.cups.events.get(opened.data.code);
  owner.send({ t: "cup", op: "join", code: c.code });
  other.send({ t: "cup", op: "join", code: c.code });
  await owner.wait((m) => m.t === "cup-entry" && m.signed);
  await other.wait((m) => m.t === "cup-entry" && m.signed);
  assert.equal(c.signups.length, 2);
  assert.equal(
    (
      await api(
        "/api/owner/cup-start",
        { code: c.code },
        accounts.Owner.access_token,
      )
    ).status,
    200,
  );
  const a = await room(accounts.Owner, "cup-" + c.code),
    b = await room(accounts.Three, "cup-" + c.code);
  assert.equal(
    a.me,
    c.signups.find((r) => r.account === accounts.Owner.user.id).id,
  );
  await tick(30000);
  await tick(3000);
  assert.equal(c.event.phase, "run");
  for (const [name, slot] of [
    ["Owner", 0],
    ["Three", 1],
  ]) {
    const verified = await api(
      "/functions/v1/verify-run",
      {
        cup: { code: c.code, run: 0, map: "halfpipe", slot, count: 2 },
        inputs: inputs(7),
      },
      accounts[name].access_token,
    );
    assert.equal(verified.status, 200, JSON.stringify(verified.data));
  }
  assert.equal(c.event.phase, "results");
  await tick(8000);
  assert.equal(c.status, "over");
  assert.equal(c.top.length, 2);
  assert.equal((await api("/cup-results/" + c.code)).data.finished, true);
  for (const s of [owner, other, a, b]) s.ws.close();
});
test("development recovery is private, single use, and changes the actual password", async () => {
  assert.equal(
    (await api("/auth/v1/recover", { email: "four@example.test" })).status,
    200,
  );
  const mail = app.store
    .rows("mail_outbox")
    .find((m) => m.email === "four@example.test");
  assert.ok(mail?.test);
  assert.equal(
    (await api("/api/owner/summary", null, accounts.Four.access_token)).status,
    403,
  );
  const token = new URL(mail.link).searchParams.get("reset"),
    verified = await api("/auth/v1/verify", {
      token_hash: token,
      type: "recovery",
    });
  assert.equal(verified.status, 200);
  assert.equal(
    (await api("/auth/v1/verify", { token_hash: token, type: "recovery" }))
      .status,
    400,
  );
  assert.equal(
    (
      await api(
        "/auth/v1/user",
        { password: "Changed-Feature-Test" },
        verified.data.access_token,
        "PUT",
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await api("/auth/v1/token?grant_type=password", {
        email: "four@example.test",
        password: "Changed-Feature-Test",
      })
    ).status,
    200,
  );
});
test("account deletion removes real private records and requires exact confirmation", async () => {
  const a = accounts.Stranger;
  assert.equal(
    (
      await api(
        "/functions/v1/delete-account",
        { confirm: "no" },
        a.access_token,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await api(
        "/functions/v1/delete-account",
        { confirm: "DELETE MY ACCOUNT" },
        a.access_token,
      )
    ).status,
    200,
  );
  assert.equal(app.store.user(a.user.id), null);
  assert.equal((await api("/auth/v1/user", null, a.access_token)).status, 401);
  assert.equal(
    (
      await api(
        "/functions/v1/delete-account",
        { confirm: "DELETE MY ACCOUNT" },
        accounts.Owner.access_token,
      )
    ).status,
    409,
  );
});
test("full collection pricing only charges and returns missing pieces; partly owned gifts are blocked", async () => {
  const buyer = accounts.Three,
    starting = app.store.balance(accounts.Three.user.id),
    full = app.economy.catalog.offers.find((o) => o.id === "hw-harvest-full");
  app.store.transaction(() => {
    app.economy.ledger(buyer.user.id, 20000, "gift", "test");
    app.economy.grant(buyer.user.id, full.items[0], "test-existing");
  });
  const remaining = full.items.slice(1),
    quoted =
      Math.floor(
        (remaining.reduce((n, id) => n + app.economy.offers.get(id).pow, 0) *
          0.7) /
          100,
      ) * 100;
  assert.equal(
    (
      await api(
        "/functions/v1/shop",
        { buy: full.id, pow: full.pow },
        buyer.access_token,
      )
    ).status,
    409,
  );
  const bought = await api(
    "/functions/v1/shop",
    { buy: full.id, pow: quoted },
    buyer.access_token,
  );
  assert.equal(bought.status, 200);
  assert.equal(bought.data.balance, 20000 + starting - quoted);
  assert.deepEqual(bought.data.items, remaining);
  assert.equal(
    (await api("/functions/v1/shop", { return: full.id }, buyer.access_token))
      .status,
    200,
  );
  assert.deepEqual(
    app.store
      .account(buyer.user.id)
      .items.filter((i) => full.items.includes(i)),
    [full.items[0]],
  );
  await api(
    "/rest/v1/rpc/friend_ask",
    { target: "Three" },
    accounts.Owner.access_token,
  );
  await api(
    "/rest/v1/rpc/friend_answer",
    { other: accounts.Owner.user.id, yes: true },
    buyer.access_token,
  );
  assert.equal(
    (
      await api(
        "/functions/v1/shop",
        { gift: full.id, to: buyer.user.id },
        accounts.Owner.access_token,
      )
    ).status,
    403,
  );
});
test("the real client where message changes party follow privacy and destination", async () => {
  const a = await hub(accounts.Owner),
    b = await hub(accounts.Three);
  a.send({ t: "party", op: "invite", to: accounts.Three.user.id });
  const invite = await b.wait((m) => m.t === "party-invite");
  b.send({ t: "party", op: "answer", code: invite.code, yes: true });
  await b.wait((m) => m.t === "party" && m.party?.members.length === 2);
  a.send({
    t: "where",
    where: { at: "live", park: "forestline", party: true },
  });
  const update = await b.wait(
    (m) => m.t === "party" && m.party?.dest.park === "forestline",
  );
  assert.equal(update.party.dest.privacy, "private");
  assert.equal(update.party.dest.room, undefined);
  const party = app.realtime.competition.party(accounts.Owner.user.id);
  assert.equal(
    app.realtime.competition.roomAccess(
      accounts.Four.user.id,
      "party-" + party.key + "-forestline",
      false,
    ),
    false,
  );
  a.send({ t: "where", where: { at: "live", park: "halfpipe", room: 3 } });
  const next = await b.wait(
    (m) => m.t === "party" && m.party?.dest.park === "halfpipe",
  );
  assert.equal(next.party.dest.privacy, "public");
  assert.equal(next.party.dest.room, 3);
  a.send({ t: "party", op: "leave" });
  b.send({ t: "party", op: "leave" });
  a.ws.close();
  b.ws.close();
});
test("the actual recovered duel controllers accept server turns for both host and guest", async () => {
  const physics = await physicsFor("apex");
  const Duel = physics.input.ht;
  assert.equal(typeof Duel, "function");
  function client(role) {
    const actions = { gates: 0, releases: 0 };
    const host = {
      toGate() { actions.gates++; },
      release() { actions.releases++; },
      myRun() { return { phase: "skiing", score: 0, moved: false }; },
      stopRun() {},
      opponentHere() { return true; },
      connected() { return true; },
    };
    const controller = new Duel(role, { host: "One", guest: "Two" },
      host, { send() {} }, 1000, undefined, 2, "apex");
    controller.refereeing();
    return { controller, actions };
  }
  const first = client("host"), second = client("guest");
  const wire = (seq, phase, drop, runs = [-1, -1, -1, -1, -1, -1]) => ({
    op: "state", seq, phase, drop, first: "h", runs,
    win: "", wo: false, left: 4000,
  });
  for (const c of [first, second]) {
    c.controller.receive(wire(1, "intro", 0), 1500);
    assert.equal(c.controller.state.phase, "intro");
    c.controller.receive(wire(2, "run", 0), 2000);
    assert.equal(c.controller.state.phase, "run");
    c.controller.update(2100);
  }
  assert.equal(first.actions.releases, 1);
  assert.equal(second.actions.releases, 0);
  for (const c of [first, second]) {
    c.controller.receive({
      ...wire(3, "posted", 0, [415021, -1, -1, -1, -1, -1]),
      pending: [0],
    }, 2300);
    assert.equal(c.controller.state.phase, "posted");
    assert.deepEqual(Array.from(c.controller.hud(2310).pending), [0]);
    c.controller.receive(wire(4, "present", 1, [0, -1, -1, -1, -1, -1]), 2500);
    assert.equal(c.controller.state.drop, 1);
    c.controller.receive(wire(5, "run", 1, [0, -1, -1, -1, -1, -1]), 2800);
    c.controller.update(2900);
    assert.equal(c.controller.state.phase, "run");
  }
  assert.equal(first.actions.releases, 1);
  assert.equal(second.actions.releases, 1);
});
test("duel releases each rider immediately and reconciles verified scores across turns", async () => {
  const c = app.realtime.competition,
    m = c.createMatch(
      "duel", "apex",
      { host: accounts.One.user.id, guest: accounts.Two.user.id },
      true,
    ),
    host = await room(accounts.One, m.room),
    guest = await room(accounts.Two, m.room);
  await tick(7000);
  await tick(4500);
  assert.equal(m.state.phase, "run");
  assert.equal(m.state.drop, 0);
  const firstContext = c.verificationContext(accounts.One.user.id, {
    duel: { id: m.id, drop: 0 },
  });

  // The browser host reports a local 'posted' state when it finishes.
  host.send({
    t: "duel", op: "state", v: 2, seq: 20, phase: "posted",
    drop: 0, first: "h", runs: [999999, -1, -1, -1],
    win: "", left: 4000,
  });
  const hostPosted = await host.wait(
    (x) => x.t === "duel" && x.op === "state" &&
      x.phase === "posted" && x.drop === 0,
  );
  const guestSawHost = await guest.wait(
    (x) => x.t === "duel" && x.op === "state" &&
      x.phase === "posted" && x.drop === 0,
  );
  // Both screens show an *estimated* score immediately. The server still
  // stores zero until replay verification, so forged points cannot win.
  assert.equal(hostPosted.runs[0], 999999);
  assert.equal(guestSawHost.runs[0], 999999);
  assert.deepEqual(hostPosted.pending, [0]);
  assert.deepEqual(guestSawHost.pending, [0]);
  assert.equal(m.state.runs.host[0], 0);
  assert.ok(m.pendingScores["0:host"]);
  assert.equal(m.state.phase, "posted");

  await tick(4500);
  assert.equal(m.state.phase, "present");
  assert.equal(m.state.drop, 1);
  await tick(4500);
  assert.equal(m.state.phase, "run");

  // Proof arriving after the second player starts still belongs to drop 0.
  const lateContext = c.verificationContext(accounts.One.user.id, {
    duel: { id: m.id, drop: 0 },
  });
  assert.equal(lateContext.role, firstContext.role);

  // Guest can finish immediately too. A forged score is never credited.
  guest.send({ t: "duel", op: "result", v: 2, drop: 1, score: 999999 });
  const secondPosted = await guest.wait(
    (x) => x.t === "duel" && x.op === "state" &&
      x.phase === "posted" && x.drop === 1,
  );
  assert.equal(secondPosted.runs[m.state.runs.host.length], 999999);
  assert.deepEqual(secondPosted.pending.sort(), [0, 1]);
  assert.equal(m.state.runs.guest[0], 0);
  assert.ok(m.pendingScores["1:guest"]);

  c.verified(lateContext, { score: 1450 });
  assert.equal(m.state.runs.host[0], 1450);
  assert.equal(m.state.drop, 1);
  const afterHostProof = c.wire(m);
  assert.equal(afterHostProof.runs[0], 1450);
  assert.equal(afterHostProof.runs[m.state.runs.host.length], 999999);
  assert.deepEqual(afterHostProof.pending, [1]);
  c.verified(c.verificationContext(accounts.Two.user.id, {
    duel: { id: m.id, drop: 1 },
  }), { score: 750 });
  assert.equal(m.state.runs.guest[0], 750);
  assert.equal(Object.keys(m.pendingScores).length, 0);
  assert.equal(Object.keys(m.verified).length, 2);
  assert.equal(c.wire(m).runs[m.state.runs.host.length], 750);
  assert.deepEqual(c.wire(m).pending, []);
  host.ws.close();
  guest.ws.close();
});
test("four delayed duel score proofs settle the final winner before ranked ratings", async () => {
  const a = await make("LateHost"),
    b = await make("LateGuest"),
    c = app.realtime.competition,
    m = c.createMatch("duel", "apex",
      { host: a.user.id, guest: b.user.id }, true),
    host = await room(a, m.room),
    guest = await room(b, m.room),
    contexts = [],
    scores = [1200, 300, 1100, 500];
  await tick(7000);
  await tick(4500);
  for (let drop = 0; drop < 4; drop++) {
    assert.equal(m.state.phase, "run");
    assert.equal(m.state.drop, drop);
    const role = c.activeRoles(m)[0];
    contexts.push(c.verificationContext(m.players[role],
      { duel: { id: m.id, drop } }));
    const peer = role === "host" ? host : guest;
    peer.send({ t: "duel", op: "result", v: 2, drop, score: 999999 });
    const posted = await peer.wait((x) =>
      x.t === "duel" && x.op === "state" &&
      x.phase === "posted" && x.drop === drop);
    assert.equal(posted.phase, "posted");
    assert.equal(m.state.runs[role][Math.floor(drop / 2)], 0);
    await tick(4500);
    if (drop < 3) await tick(4500);
  }
  assert.equal(m.state.phase, "winner");
  assert.equal(m.state.winner, "draw");
  assert.equal(app.store.rating(a.user.id).games, 0);
  assert.equal(app.store.rating(b.user.id).games, 0);
  for (let drop = 0; drop < contexts.length; drop++)
    c.verified(contexts[drop], { score: scores[drop] });
  assert.equal(m.state.winner, "host");
  assert.deepEqual(m.state.runs.host.slice(0, 2), [1200, 1100]);
  assert.deepEqual(m.state.runs.guest.slice(0, 2), [300, 500]);
  await tick(250);
  assert.equal(app.store.rating(a.user.id).wins, 1);
  assert.equal(app.store.rating(b.user.id).losses, 1);
  host.ws.close();
  guest.ws.close();
});
test("forfeits award the opponent once, apply a queue break, and allow an agreed rematch", async () => {
  const c = app.realtime.competition,
    m = c.createMatch(
      "duel",
      "apex",
      { host: accounts.One.user.id, guest: accounts.Two.user.id },
      true,
    ),
    a = await room(accounts.One, m.room),
    b = await room(accounts.Two, m.room);
  const before = app.store.rating(accounts.Two.user.id).wins;
  a.send({ t: "duel", op: "bye", v: 2 });
  await new Promise((r) => setTimeout(r, 20));
  await tick(10001);
  assert.equal(m.state.phase, "winner");
  assert.equal(app.store.rating(accounts.Two.user.id).wins, before + 1);
  assert.ok(app.store.get("ranked_breaks", accounts.One.user.id).until > now);
  await tick(1000);
  assert.equal(app.store.rating(accounts.Two.user.id).wins, before + 1);
  a.send({ t: "duel", op: "rematch", v: 2 });
  b.send({ t: "duel", op: "rematch", v: 2 });
  const move = await a.wait((m) => m.t === "duel" && m.op === "move");
  assert.notEqual(move.code, m.code);
  const fresh = [...c.matches.values()].find((m) => m.code === move.code);
  assert.equal(fresh.state.phase, "waiting");
  await tick(90001);
  assert.equal(fresh.result.void, true);
  assert.equal(fresh.state.phase, "over");
  a.ws.close();
  b.ws.close();
});
test("together 2v2 accepts both partners per drop and rejects stale verification contexts", async () => {
  accounts.Four = (
    await api("/auth/v1/token?grant_type=password", {
      email: "four@example.test",
      password: "Changed-Feature-Test",
    })
  ).data;
  const c = app.realtime.competition,
    players = {
      L1: accounts.One.user.id,
      L2: accounts.Two.user.id,
      R1: accounts.Three.user.id,
      R2: accounts.Four.user.id,
    },
    m = c.createMatch("team", "apex", players, false, {
      privateMatch: true,
      together: true,
    }),
    peers = [];
  for (const id of Object.values(players))
    peers.push(
      await room(
        Object.values(accounts).find((a) => a.user.id === id),
        m.room,
      ),
    );
  await tick(7000);
  await tick(4500);
  const stale = c.verificationContext(players.L1, {
    team: { id: m.id, drop: 0 },
  });
  let drops = 0;
  while (m.state.phase !== "winner" && drops < 8) {
    const roles = [...c.activeRoles(m)];
    assert.equal(roles.length, 2);
    for (const role of roles) {
      const account = Object.values(accounts).find(
        (a) => a.user.id === players[role],
      );
      const result = await api(
        "/functions/v1/verify-run",
        { team: { id: m.id, drop: m.state.drop }, inputs: inputs(36) },
        account.access_token,
      );
      assert.equal(result.status, 200, JSON.stringify(result.data));
    }
    await tick(4500);
    if (m.state.phase !== "winner") await tick(4500);
    drops++;
  }
  assert.equal(m.state.phase, "winner");
  assert.equal(Object.keys(m.verified).length, 8);
  const before = JSON.stringify(m.state);
  c.verified(stale, { score: 999999 });
  assert.equal(JSON.stringify(m.state), before);
  for (const p of peers) p.ws.close();
});
test("cup history matches original UI schemas and signup IDs remain unique after withdrawal", async () => {
  const c = [...app.cups.events.values()].find((c) => c.status === "over"),
    list = await api("/cup-results");
  assert.ok(Array.isArray(list.data));
  const item = list.data.find((v) => v.code === c.code);
  assert.equal(typeof item.at, "number");
  assert.equal(typeof item.riders, "number");
  const result = (await api("/cup-results/" + c.code)).data;
  assert.ok(Array.isArray(result.rows));
  assert.ok(Array.isArray(result.maps));
  assert.equal(typeof result.heats, "number");
  const opened = await api(
      "/api/owner/cup-create",
      { maps: ["apex", "halfpipe"], seats: 40, final: "total", startIn: 2 },
      accounts.Owner.access_token,
    ),
    cup = app.cups.events.get(opened.data.code);
  app.cups.join(accounts.One.user.id, cup);
  app.cups.join(accounts.Two.user.id, cup);
  app.cups.withdraw(accounts.One.user.id, cup);
  app.cups.join(accounts.Three.user.id, cup);
  assert.equal(new Set(cup.signups.map((r) => r.id)).size, 2);
  cup.status = "cancelled";
  const plan = app.cups.input.cupHeats(400);
  assert.equal(plan.rounds[0].heats.length, 20);
  assert.ok(plan.final <= 20);
});
test("mountain invitations relay only to the target and create an authorized friendly room", async () => {
  const a = await room(accounts.Owner, "apex"),
    b = await room(accounts.Three, "apex"),
    o = await room(accounts.Four, "apex");
  const code = "abcd1234";
  a.send({ t: "duel", op: "invite", code, to: b.me, park: "apex", v: 2 });
  const invite = await b.wait((m) => m.t === "duel" && m.op === "invite");
  assert.equal(invite.id, a.me);
  assert.ok(!o.messages.some((m) => m.op === "invite" && m.code === code));
  b.send({ t: "duel", op: "accept", code, to: a.me, v: 2 });
  await a.wait((m) => m.t === "duel" && m.op === "accept");
  a.send({ t: "duel", op: "start", code, to: b.me, v: 2 });
  await b.wait((m) => m.t === "duel" && m.op === "start");
  const match = app.realtime.competition.byRoom.get("duel-" + code);
  assert.ok(match);
  assert.equal(match.ranked, false);
  const ar = await room(accounts.Owner, match.room),
    br = await room(accounts.Three, match.room);
  br.send({ t: "duel", op: "hello", host: false, v: 2 });
  const hello = await ar.wait((m) => m.t === "duel" && m.op === "hello");
  assert.equal(hello.id, br.me);
  assert.equal(hello.name, "Three");
  assert.equal(match.state.phase, "intro");
  for (const peer of [a, b, o, ar, br]) peer.ws.close();
});
test("the reached free tier-one pass reward is real and granted only once", async () => {
  const starter = await make("Starter");
  const balance = app.store.balance(starter.user.id);
  assert.equal(balance, 25);
  app.economy.settleRewards(starter.user.id, app.economy.passForNow());
  assert.equal(app.store.balance(starter.user.id), balance);
});
test("media byte ranges return exact bounded bytes and reject invalid ranges", async () => {
  const url = base + "/brand/favicon-96.png",
    whole = await fetch(url),
    bytes = Buffer.from(await whole.arrayBuffer());
  assert.equal(whole.status, 200);
  const part = await fetch(url, { headers: { range: "bytes=0-7" } });
  assert.equal(part.status, 206);
  assert.equal(part.headers.get("content-range"), "bytes 0-7/" + bytes.length);
  assert.deepEqual(Buffer.from(await part.arrayBuffer()), bytes.subarray(0, 8));
  assert.equal(
    (await fetch(url, { headers: { range: "bytes=99999999-" } })).status,
    416,
  );
});
test("multi-heat cup keeps all entrants in its final history", async () => {
  const cups = app.cups,
    root = {
      code: "beef1234",
      host: accounts.Owner.user.id,
      room: "apex",
      created: now,
      status: "open",
      rules: {
        maps: ["bigair"],
        seats: 40,
        min: null,
        max: null,
        final: "total",
      },
      signups: Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        name: "HeatRider" + i,
        account: "fixture-heat-" + i,
      })),
      event: null,
      missing: {},
    };
  cups.events.set(root.code, root);
  cups.start(root);
  assert.equal(root.status, "heats");
  assert.equal(root.children.length, 2);
  await tick(30000);
  await tick(3000);
  for (const code of root.children) {
    const heat = cups.events.get(code);
    assert.equal(heat.event.phase, "run");
    for (const rider of heat.signups)
      cups.input.cupMark(heat.event, rider.id, rider.id, now);
  }
  await tick(8000);
  assert.equal(root.status, "live");
  assert.equal(root.signups.length, 20);
  assert.equal(root.eliminated.length, 20);
  assert.equal(cups.results(root.code).riders, 40);
  assert.equal(cups.results(root.code).rows.length, 40);
  root.status = "cancelled";
});
test("the original engine input encoders verify on every selected park", async () => {
  for (const [park, name] of Object.entries({
    nordryggen: "Dt",
    apex: "kv",
    bigair: "Cv",
    forestline: "wv",
    halfpipe: "Tv",
  })) {
    const physics = await physicsFor(park);
    let Encoder = physics.input.t;
    if (name !== "Dt") {
      const definition = sources["engine-Dlp-9Jq2.js"].match(
        new RegExp(
          "\\b" +
            name +
            "=(class extends Dt\\{encode\\(e=\\d+\\)\\{return super\\.encode\\(e\\)\\}\\})",
        ),
      );
      assert.ok(definition, name);
      Encoder = vm.runInNewContext("(" + definition[1] + ")", { Dt: Encoder });
    }
    const log = new Encoder();
    for (let i = 0; i < 60; i++) log.push({ steer: 0, forward: true });
    const result = await workerJob({
      park,
      inputs: gzipSync(log.encode()).toString("base64"),
      competitive: true,
      maximumSeconds: 215,
    });
    assert.ok(Number.isFinite(result.score), park);
  }
});
test("daily goals require authenticated, server-recorded completed runs", async () => {
  const rider = accounts.Starter;
  assert.equal((await api("/api/challenges")).status, 401);
  const before = await api("/api/challenges", null, rider.access_token);
  assert.equal(before.status, 200);
  assert.ok(before.data.goals.every((g) => g.progress === 0));
  const denied = await api(
    "/api/challenges/claim",
    { goal: "flow", progress: 5000, reward: 1000000000 },
    rider.access_token,
  );
  assert.equal(denied.status, 409);
  assert.equal(app.store.balance(rider.user.id), 25);
  app.store.put("completed_runs", "unverified-fixture", {
    id: "unverified-fixture",
    player_id: rider.user.id,
    verified: false,
    score: 999999,
    course_id: "apex-v1",
    created_at: new Date(now).toISOString(),
  });
  assert.ok(
    (await api("/api/challenges", null, rider.access_token)).data.goals.every(
      (g) => g.progress === 0,
    ),
  );
  for (const [i, score] of [1500, 6000, 2000].entries()) {
    const id = "challenge-fixture-" + i;
    app.store.put("completed_runs", id, {
      id,
      player_id: rider.user.id,
      verified: true,
      score,
      duration_ms: 30000,
      course_id: i === 1 ? "halfpipe-v9" : "apex-v1",
      created_at: new Date(now).toISOString(),
    });
  }
  const eligible = await api("/api/challenges", null, rider.access_token);
  assert.ok(eligible.data.goals.every((g) => g.ready && !g.claimed));
  assert.equal(eligible.data.balance, 25);
});
test("daily goal rewards are fixed, atomic, persistent and idempotent", async () => {
  const rider = accounts.Starter;
  const first = await api(
    "/api/challenges/claim",
    { goal: "flow", reward: 1000000000 },
    rider.access_token,
  );
  assert.equal(first.status, 200);
  assert.equal(first.data.balance, 75);
  assert.equal(first.data.goals.find((g) => g.id === "flow").claimed, true);
  const again = await api(
    "/api/challenges/claim",
    { goal: "flow" },
    rider.access_token,
  );
  assert.equal(again.data.balance, 75);
  for (const goal of ["laps", "explore"])
    assert.equal(
      (await api("/api/challenges/claim", { goal }, rider.access_token)).status,
      200,
    );
  assert.equal(app.store.balance(rider.user.id), 125);
  assert.equal(
    app.store.rows("daily_rewards").filter((r) => r.player_id === rider.user.id)
      .length,
    3,
  );
  assert.equal(
    (
      await api(
        "/api/challenges/claim",
        { goal: "flow" },
        accounts.Two.access_token,
      )
    ).status,
    409,
  );
});
test("daily goals reset at the server UTC boundary without reopening old rewards", async () => {
  const rider = accounts.Starter,
    previous = (await api("/api/challenges", null, rider.access_token)).data
      .day;
  now += 86400000;
  const next = await api("/api/challenges", null, rider.access_token);
  assert.notEqual(next.data.day, previous);
  assert.ok(next.data.goals.every((g) => g.progress === 0 && !g.claimed));
  assert.equal(
    (
      await api(
        "/api/challenges/claim",
        { goal: "flow", day: previous },
        rider.access_token,
      )
    ).status,
    409,
  );
  assert.equal(next.data.balance, 125);
});
