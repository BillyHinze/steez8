import crypto from "node:crypto";
import { physicsFor } from "./physics-v2.mjs";
const maps = ["apex", "forestline", "halfpipe", "bigair"];
const key = () => crypto.randomBytes(8).toString("hex").slice(0, 8);
const fault = (message, status = 400) =>
  Object.assign(Error(message), { status });
export class Cups {
  constructor(store, transport, { clock = Date.now } = {}) {
    this.store = store;
    this.net = transport;
    this.now = clock;
    this.events = new Map();
    this.ready = physicsFor("apex").then((p) => (this.input = p.input));
    for (const c of store.rows("cups"))
      if (this.now() - c.created < 86400000) this.events.set(c.code, c);
    this.timer = setInterval(
      () => this.tick().catch((e) => console.error("Cup tick:", e.message)),
      250,
    );
    this.timer.unref();
  }
  save(c) {
    this.store.put("cups", c.code, c);
  }
  roomMeta(room) {
    const c = this.events.get(room.replace(/^cup-/, ""));
    return c && room === "cup-" + c.code
      ? {
          park: c.event?.runs[c.event.run]?.map || c.rules.maps[0],
          cap: 40,
          cup: c,
        }
      : null;
  }
  roomAccess(id, room, watch) {
    return (
      !!this.roomMeta(room) &&
      (watch ||
        this.events.get(room.slice(4)).signups.some((r) => r.account === id))
    );
  }
  assigned(room, id) {
    const c = this.events.get(room.slice(4));
    return c?.signups.find((r) => r.account === id)?.id || null;
  }
  call(c) {
    return {
      code: c.code,
      rules: c.rules,
      signed: c.signups.map((r) => r.id),
      top: c.event
        ? this.input
            .cupStandings(c.event)
            .slice(0, 3)
            .map((r) => ({ name: r.name, score: r.score }))
        : [],
      ...(c.startsAt ? { starts: c.startsAt } : {}),
    };
  }
  publish(c) {
    this.save(c);
    this.net.roomSend(c.room, { t: "cup-call", call: this.call(c) });
    if (c.event)
      this.net.roomSend("cup-" + c.code, {
        t: "cup-view",
        view: { now: this.now(), event: c.event },
      });
  }
  entry(id, c, signed) {
    this.net.hubSend(id, {
      t: "cup-entry",
      code: c.code,
      signed,
      count: c.signups.length,
      seats: c.rules.seats,
      ...(c.host === id ? { admin: true } : {}),
    });
  }
  async hub(id, m) {
    await this.ready;
    const c =
      this.events.get(m.code) ||
      [...this.events.values()].find(
        (c) => c.room === m.room && c.status === "open",
      );
    if (!c) return this.net.hubSend(id, { t: "cup-gone", code: m.code });
    if (m.op === "join" || m.op === "sign" || m.op === "enter")
      return this.join(id, c);
    if (m.op === "leave" || m.op === "withdraw") return this.withdraw(id, c);
    if (m.op === "watch")
      return this.net.hubSend(id, {
        t: "cup-go",
        code: c.code,
        map: c.event?.runs[c.event.run].map || c.rules.maps[0],
      });
    if (m.op === "start" && c.host === id) return this.start(c);
  }
  async room(client, m) {
    await this.ready;
    const id = client.user.id;
    if (m.op === "open") {
      if (!this.store.owner(id))
        throw fault("Only the owner can open an official cup", 403);
      if (
        [...this.events.values()].some(
          (c) => c.host === id && !["over", "cancelled"].includes(c.status),
        )
      )
        throw fault("Finish the current cup first", 409);
      const r = m.rules || {},
        selected = [...new Set(r.maps || [])]
          .filter((v) => maps.includes(v))
          .slice(0, 4);
      if (!selected.length) throw fault("Choose at least one cup map");
      const seats = Math.max(
          2,
          Math.min(400, Math.round(Number(r.seats) || 20)),
        ),
        minutes = [2, 5, 10, 15, 30].includes(r.startIn) ? r.startIn : 2;
      const c = {
        code: key(),
        host: id,
        room: client.room,
        created: this.now(),
        status: "open",
        rules: {
          maps: selected,
          seats,
          min: Number.isFinite(r.min) ? Math.max(0, r.min) : null,
          max: Number.isFinite(r.max) ? Math.min(10000000, r.max) : null,
          final: r.final === "total" ? "total" : "zero",
          startIn: minutes,
          checked: true,
        },
        startsAt: this.now() + minutes * 60000,
        signups: [],
        event: null,
        missing: {},
      };
      this.events.set(c.code, c);
      this.publish(c);
      this.net.clientSend(client, { t: "cup-admin" });
      this.entry(id, c, false);
      return;
    }
    const c =
      this.events.get(m.code) ||
      this.events.get(client.room.replace(/^cup-/, "")) ||
      [...this.events.values()].find(
        (c) => c.room === client.room && c.status === "open",
      );
    if (!c) return;
    if (["join", "sign", "enter"].includes(m.op)) return this.join(id, c);
    if (["leave", "withdraw"].includes(m.op)) return this.withdraw(id, c);
    if (m.op === "start" && c.host === id) return this.start(c);
    if (m.op === "cancel" && c.host === id) {
      c.status = "cancelled";
      this.publish(c);
      for (const rider of c.signups)
        this.net.hubSend(rider.account, { t: "cup-gone", code: c.code });
      return;
    }
    if (["ready", "here"].includes(m.op) && c.event) {
      const rider = c.signups.find((r) => r.account === id);
      if (rider) {
        this.input.cupReady(c.event, rider.id, this.now());
        this.publish(c);
      }
    }
  }
  join(id, c) {
    if (c.status !== "open") throw fault("Cup sign-up has closed", 409);
    if (c.signups.some((r) => r.account === id)) return this.entry(id, c, true);
    if (c.signups.length >= c.rules.seats) throw fault("Cup is full", 409);
    const best =
      this.store.board("apex-2026-10-18").find((r) => r.player_id === id)
        ?.score || 0;
    if (
      (c.rules.min !== null && best < c.rules.min) ||
      (c.rules.max !== null && best > c.rules.max)
    ) {
      this.net.hubSend(id, {
        t: "cup-entry",
        code: c.code,
        signed: false,
        count: c.signups.length,
        seats: c.rules.seats,
        no: c.rules.min !== null && best < c.rules.min ? "low" : "high",
      });
      return;
    }
    c.signups.push({
      account: id,
      id: Math.max(0, ...c.signups.map((r) => r.id)) + 1,
      name: this.store.profile(id).handle,
      at: this.now(),
    });
    this.publish(c);
    this.entry(id, c, true);
  }
  withdraw(id, c) {
    const rider = c.signups.find((r) => r.account === id);
    if (!rider) return;
    if (c.event) this.input.cupWithdraw(c.event, rider.id, this.now());
    else c.signups = c.signups.filter((r) => r.account !== id);
    this.publish(c);
    this.entry(id, c, false);
  }
  start(c) {
    if (c.status !== "open") return;
    if (c.signups.length < 2) {
      c.startsAt = this.now() + 60000;
      this.publish(c);
      return;
    }
    if (c.signups.length > 30) return this.startHeats(c);
    c.status = "live";
    c.event = this.input.cupCreate(
      c.signups.map((r) => ({ id: r.id, name: r.name })),
      this.now(),
      c.rules.final,
      this.input.cupSchedule(c.rules.maps, c.signups.length),
    );
    this.publish(c);
    for (const rider of c.signups)
      this.net.hubSend(rider.account, {
        t: "cup-go",
        code: c.code,
        map: c.rules.maps[0],
      });
  }
  startHeats(root) {
    root.originalSignups = [...root.signups];
    root.eliminated = [];
    const plan = this.input.cupHeats(root.signups.length);
    root.status = "heats";
    root.round = 0;
    root.plan = JSON.parse(JSON.stringify(plan));
    root.qualifiers = [...root.signups];
    this.spawnHeats(root);
  }
  spawnHeats(root) {
    const stage = root.plan.rounds[root.round];
    if (!stage) {
      root.status = "open";
      root.signups = root.qualifiers.map((r, i) => ({ ...r, id: i + 1 }));
      root.startsAt = this.now();
      this.start(root);
      return;
    }
    root.children = [];
    let cursor = 0;
    for (const count of stage.heats) {
      const group = root.qualifiers
        .slice(cursor, cursor + count)
        .map((r, i) => ({ ...r, id: i + 1 }));
      cursor += count;
      const c = {
        code: key(),
        parent: root.code,
        host: root.host,
        room: root.room,
        created: this.now(),
        status: "live",
        rules: { ...root.rules, maps: ["apex"], seats: count },
        signups: group,
        missing: {},
        event: this.input.cupCreate(
          group.map((r) => ({ id: r.id, name: r.name })),
          this.now(),
          "zero",
          this.input.cupSchedule(["apex"], group.length),
        ),
      };
      root.children.push(c.code);
      this.events.set(c.code, c);
      this.publish(c);
      for (const r of group)
        this.net.hubSend(r.account, { t: "cup-go", code: c.code, map: "apex" });
    }
    this.save(root);
  }
  advanceHeats(root) {
    const children = root.children.map((code) => this.events.get(code));
    if (children.some((c) => c.status !== "over")) return;
    const advance = root.plan.rounds[root.round].advance;
    for (const [n, child] of children.entries())
      for (const row of this.input.cupStandings(child.event)) {
        if (row.place !== null && row.place <= advance) continue;
        const signup = child.signups.find((r) => r.id === row.id);
        root.eliminated.push({
          account: signup.account,
          name: row.name,
          score: row.score,
          place: null,
          heat: { round: root.round + 1, n: n + 1 },
          after: "apex",
          ...(row.gone ? { left: true } : {}),
        });
      }
    const qualifiers = children.flatMap((c) =>
      this.input
        .cupStandings(c.event)
        .filter((r) => r.place !== null && r.place <= advance)
        .map((r) => c.signups.find((s) => s.id === r.id)),
    );
    root.qualifiers = qualifiers;
    root.round++;
    this.spawnHeats(root);
  }
  joined(client) {
    if (this.store.owner(client.user.id))
      this.net.clientSend(client, { t: "cup-admin" });
    const c =
      this.events.get(client.room.replace(/^cup-/, "")) ||
      [...this.events.values()].find(
        (c) => c.room === client.room && c.status === "open",
      );
    if (!c) return;
    delete c.missing[client.user.id];
    this.net.clientSend(client, { t: "cup-call", call: this.call(c) });
    if (c.event)
      this.net.clientSend(client, {
        t: "cup-view",
        view: { now: this.now(), event: c.event },
      });
  }
  left(client) {
    const c = this.events.get(client.room.replace(/^cup-/, ""));
    if (
      c &&
      c.status === "live" &&
      c.signups.some((r) => r.account === client.user?.id)
    )
      c.missing[client.user.id] = this.now();
  }
  verificationContext(id, request) {
    const ref = request.cup,
      c = this.events.get(ref?.code),
      rider = c?.signups.find((r) => r.account === id);
    if (!c || !rider || c.status !== "live")
      throw fault("Cup entry not found", 403);
    if (
      c.event.phase !== "run" ||
      c.event.run !== ref.run ||
      c.event.runs[c.event.run].map !== ref.map
    )
      throw fault("This cup round is not accepting inputs", 409);
    const active = c.event.riders
        .filter((r) => !r.gone && (r.cutAt === null || r.cutAt > c.event.run))
        .sort((a, b) => a.slot - b.slot),
      slot = this.input.cupPosition(c.event, rider.id);
    if (slot < 0) throw fault("This rider has been eliminated", 403);
    return {
      cup: c,
      rider,
      run: ref.run,
      park: ref.map,
      competitive: true,
      cupLane: { slot, count: active.length },
      maximumSeconds:
        { apex: 150, forestline: 150, halfpipe: 120, bigair: 60 }[ref.map] + 5,
    };
  }
  verified(context, result) {
    const c = context.cup;
    if (c.event.run !== context.run || c.event.phase !== "run")
      throw fault("This cup round has ended", 409);
    if (this.input.cupMark(c.event, context.rider.id, result.score, this.now()))
      this.publish(c);
  }
  async tick() {
    await this.ready;
    for (const c of this.events.values()) {
      if (c.status === "open" && this.now() >= c.startsAt) this.start(c);
      if (c.status !== "live" || !c.event) continue;
      for (const [id, at] of Object.entries(c.missing)) {
        if (this.now() - at > 60000) {
          const rider = c.signups.find((r) => r.account === id);
          if (rider) this.input.cupWithdraw(c.event, rider.id, this.now());
          delete c.missing[id];
        }
      }
      const beforeMap = c.event.runs[c.event.run].map;
      if (this.input.cupTick(c.event, this.now())) {
        const nextMap = c.event.runs[c.event.run].map;
        if (nextMap !== beforeMap)
          for (const r of c.signups)
            this.net.hubSend(r.account, {
              t: "cup-go",
              code: c.code,
              map: nextMap,
            });
        this.publish(c);
      }
      if (c.event.phase === "over") {
        c.status = "over";
        c.top = this.input
          .cupStandings(c.event)
          .slice(0, 3)
          .map((r) => ({ name: r.name, score: r.score }));
        this.publish(c);
        if (c.parent) {
          const root = this.events.get(c.parent);
          if (root) this.advanceHeats(root);
        } else {
          const winner = this.input
              .cupStandings(c.event)
              .find((r) => r.place === 1),
            rider = c.signups.find((r) => r.id === winner?.id);
          if (rider && !c.rewarded) {
            this.store.transaction(() => {
              this.store.economy.ledger(
                rider.account,
                1000,
                "prize",
                "cup:" + c.code,
              );
              this.store.economy.grant(
                rider.account,
                "cork7-cup-winner",
                "cup:" + c.code,
              );
              c.rewarded = true;
              this.save(c);
            });
          }
        }
      } else if (this.now() - (c.sentAt || 0) > 1000) {
        c.sentAt = this.now();
        this.publish(c);
      }
    }
  }
  summary() {
    const c = [...this.events.values()]
      .filter((c) => !c.parent && !["cancelled", "over"].includes(c.status))
      .sort((a, b) => a.created - b.created)[0];
    if (!c) return null;
    const event = c.event,
      map = event?.runs[event.run]?.map || c.rules.maps[0],
      leg = (event?.runs[event.run]?.leg || 0) + 1;
    return {
      code: c.code,
      live: c.status !== "open",
      map,
      leg,
      legs: c.rules.maps.length,
      riders: (c.originalSignups || c.signups).length,
      admin: this.store.profile(c.host)?.handle || "Owner",
      at: c.created,
      ...(c.status === "open"
        ? { open: { room: c.room, seats: c.rules.seats, startAt: c.startsAt } }
        : {}),
      ...(c.status === "heats"
        ? {
            heats: c.children.length,
            watch: c.children[0],
            done: c.children.filter(
              (code) => this.events.get(code)?.status === "over",
            ).length,
          }
        : {}),
    };
  }
  results(code) {
    const c = this.events.get(code);
    if (!c) return null;
    return {
      code: c.code,
      at: c.created,
      created: c.created,
      admin: this.store.profile(c.host)?.handle || "Owner",
      riders: (c.originalSignups || c.signups).length,
      heats: c.children?.length || 0,
      maps: c.rules.maps,
      rows: [
        ...(c.event ? this.input.cupStandings(c.event) : []),
        ...(c.eliminated || []).map(({ account, ...row }) => row),
      ],
      rules: c.rules,
      top: c.top || [],
      standings: c.event ? this.input.cupStandings(c.event) : [],
      finished: c.status === "over",
    };
  }
  close() {
    clearInterval(this.timer);
  }
}
