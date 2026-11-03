import crypto from "node:crypto";
import * as parks from "../public/_next/static/chunks/parks-1qsmaijL.js";
import { physicsFor } from "./physics-v2.mjs";
const maps = new Set(["apex", "bigair", "forestline", "halfpipe"]),
  slots = ["L1", "R1", "L2", "R2"];
const code = () => crypto.randomBytes(8).toString("hex").slice(0, 8),
  roomName = (kind, park, id) =>
    `${kind}-${park === "apex" ? "" : park + "-"}${id}`;
const fault = (message, status = 400) =>
  Object.assign(Error(message), { status });
export class Competition {
  constructor(store, transport, { clock = Date.now } = {}) {
    this.store = store;
    this.net = transport;
    this.now = clock;
    this.queues = new Map();
    this.invites = new Map();
    this.partyInvites = new Map();
    this.parties = new Map();
    this.membership = new Map();
    this.matches = new Map();
    this.byRoom = new Map();
    this.ready = physicsFor("apex").then((p) => (this.input = p.input));
    for (const m of store
      .rows("matches")
      .filter(
        (m) => m.state.phase !== "over" && this.now() - m.created < 86400000,
      )) {
      this.matches.set(m.id, m);
      this.byRoom.set(m.room, m);
      m.reconnectUntil = this.now() + 90000;
    }
    for (const p of store.rows("parties")) {
      this.parties.set(p.id, p);
      for (const id of p.members) this.membership.set(id, p.id);
    }
    this.timer = setInterval(
      () =>
        this.tick().catch((e) => console.error("Competition tick:", e.message)),
      250,
    );
    this.timer.unref();
  }
  save(m) {
    this.store.put("matches", m.id, m);
  }
  party(id) {
    return this.parties.get(this.membership.get(id)) || null;
  }
  partySnapshot(p) {
    return {
      id: p.id,
      key: p.key,
      leader: p.leader,
      members: p.members.map((id) => ({
        id,
        name: this.store.profile(id)?.handle || "Rider",
        outfit: this.store.get("player_outfits", id)?.outfit,
        here: this.net.hub(id)?.where?.at === "lobby",
        role: this.store.role(id),
      })),
      dest: p.dest,
    };
  }
  publishParty(p) {
    this.store.put("parties", p.id, p);
    for (const id of p.members)
      this.net.hubSend(id, { t: "party", party: this.partySnapshot(p) });
  }
  hello(id) {
    const p = this.party(id);
    this.net.hubSend(id, {
      t: "party",
      party: p ? this.partySnapshot(p) : null,
    });
    if (p) {
      this.publishParty(p);
      const now = this.now();
      this.net.hubSend(id, {
        t: "party-chat-history",
        party: p.id,
        lines: (p.chat || []).map((r) => ({ ...r, age: now - r.at })),
      });
    }
  }
  available(id) {
    if (this.store.squads?.busy(id) || this.store.mountainSessions?.active(id)) return false;
    return ![...this.matches.values()].some(
      (m) =>
        Object.values(m.players).includes(id) &&
        !["winner", "over"].includes(m.state.phase),
    );
  }
  connections(m) {
    return this.net.peers(m.room).filter((c) => c.user && !c.watch);
  }
  roomAccess(id, room, watch) {
    const match = this.byRoom.get(room);
    if (match) return watch || Object.values(match.players).includes(id);
    const p = /^party-([a-z0-9]{16})-([a-z]+)$/.exec(room);
    if (p) {
      const party = this.party(id);
      return (
        (!!party && party.key === p[1] && maps.has(p[2])) ||
        (!!party &&
          party.key === p[1] &&
          ["nordryggen", "shirakumo"].includes(p[2]))
      );
    }
    return false;
  }
  roomMeta(room) {
    const m = this.byRoom.get(room);
    if (m) return { park: m.park, cap: m.kind === "team" ? 24 : 22, match: m };
    const p = /^party-([a-z0-9]{16})-([a-z]+)$/.exec(room);
    return p ? { park: p[2], cap: 4 } : null;
  }
  async hub(id, message) {
    await this.ready;
    const m = message;
    if (m.t === "ranked") return this.queue(id, m);
    if (m.t === "challenge") return this.challenge(id, m);
    if (m.t === "answer") return this.answer(id, m);
    if (m.t === "start") return this.startChallenge(id, m.code);
    if (m.t === "cancel") {
      const offer = this.invites.get(m.code);
      if (offer?.from === id) {
        this.invites.delete(m.code);
        this.net.hubSend(offer.to, { t: "cancelled", code: m.code });
      }
      return;
    }
    if (m.t === "party") return this.partyAction(id, m);
    if (m.t === "party-chat") return this.partyChat(id, m);
    if (m.t === "team-private") return this.privateTeam(id, m);
    if (m.t === "party-report") {
      if (this.party(id)?.members.includes(m.who))
        this.store.put("reports", crypto.randomUUID(), {
          from: id,
          who: m.who,
          reason: String(m.reason).slice(0, 100),
          kind: "party",
          at: new Date().toISOString(),
        });
      return;
    }
  }
  queue(id, m) {
    if (!m.on) {
      const entry = this.queues.get(id);
      if (entry) for (const person of entry.ids) this.queues.delete(person);
      return;
    }
    const reject = (why, extra = {}) =>
      this.net.hubSend(id, { t: "ranked-off", why, ...extra });
    if (this.store.banned(id)) return reject("banned");
    if (!this.available(id)) return reject("busy");
    const until = this.store.get("ranked_breaks", id)?.until || 0;
    if (until > this.now())
      return reject("break", { wait: until - this.now() });
    const size = m.size === "2v2" ? "2v2" : "1v1",
      party = this.party(id);
    let ids = [id];
    if (party && party.members.length > 1) {
      if (size === "1v1" || party.members.length > 2)
        return reject("party-size");
      if (party.leader !== id) return reject("not-leader");
      ids = [...party.members];
      if (ids.some((person) => !this.net.hub(person)))
        return reject("mate-left");
      if (ids.some((person) => this.net.hub(person)?.where?.at !== "lobby"))
        return reject("mate-busy");
      if (
        Math.abs(
          this.store.rating(ids[0], size).rating -
            this.store.rating(ids[1], size).rating,
        ) > 500
      )
        return reject("spread");
    }
    if (ids.some((person) => !this.available(person))) return reject("busy");
    const old = this.queues.get(id),
      entry = old && old.size === size ? old : { ids, size, at: this.now() };
    for (const person of ids) this.queues.set(person, entry);
    this.queueStatus();
    this.matchQueues();
  }
  queueStatus() {
    for (const [id, e] of this.queues)
      this.net.hubSend(id, {
        t: "ranked-queue",
        ...this.store.publicStanding(id, e.size),
        searching: [...this.queues.values()].filter((q) => q.size === e.size)
          .length,
        ...(e.size === "2v2"
          ? {
              size: "2v2",
              ...(e.ids.length === 2
                ? {
                    mate: this.store.profile(e.ids.find((x) => x !== id))
                      ?.handle,
                  }
                : {}),
            }
          : {}),
      });
  }
  matchQueues() {
    const one = [...new Set(this.queues.values())]
      .filter((q) => q.size === "1v1")
      .sort((a, b) => a.at - b.at);
    while (one.length >= 2) {
      const a = one.shift(),
        r = this.store.rating(a.ids[0]).rating,
        limit = 200 + Math.floor((this.now() - a.at) / 30000) * 100,
        index = one.findIndex(
          (b) => Math.abs(this.store.rating(b.ids[0]).rating - r) <= limit,
        );
      if (index < 0) break;
      const b = one.splice(index, 1)[0];
      this.createMatch(
        "duel",
        "apex",
        { host: a.ids[0], guest: b.ids[0] },
        true,
      );
      for (const id of [...a.ids, ...b.ids]) this.queues.delete(id);
    }
    const groups = [...new Set(this.queues.values())]
      .filter((q) => q.size === "2v2")
      .sort((a, b) => a.at - b.at);
    while (groups.reduce((n, e) => n + e.ids.length, 0) >= 4) {
      const selected = [],
        ids = [];
      for (const g of groups) {
        if (ids.length + g.ids.length > 4) continue;
        selected.push(g);
        ids.push(...g.ids);
        if (ids.length === 4) break;
      }
      if (ids.length < 4) break;
      const duo = selected.find((g) => g.ids.length === 2),
        host = duo ? duo.ids : ids.slice(0, 2),
        guest = ids.filter((id) => !host.includes(id));
      if (
        Math.abs(
          this.store.rating(host[0], "2v2").rating -
            this.store.rating(host[1], "2v2").rating,
        ) > 500 ||
        Math.abs(
          this.store.rating(guest[0], "2v2").rating -
            this.store.rating(guest[1], "2v2").rating,
        ) > 500
      )
        break;
      this.createMatch(
        "team",
        "apex",
        { L1: host[0], L2: host[1], R1: guest[0], R2: guest[1] },
        true,
      );
      for (const g of selected) {
        groups.splice(groups.indexOf(g), 1);
        for (const id of g.ids) this.queues.delete(id);
      }
    }
  }
  createMatch(
    kind,
    park,
    players,
    ranked,
    { privateMatch = false, together = false, requestedCode = null } = {},
  ) {
    const id = crypto.randomUUID(),
      c = requestedCode || code(),
      state = kind === "duel" ? parks.O() : this.input.st(together),
      m = {
        id,
        code: c,
        kind,
        park,
        players,
        ranked,
        privateMatch,
        together,
        state,
        created: this.now(),
        phaseAt: this.now(),
        missing: {},
        verified: {},
        pendingScores: {},
        out: [],
        rematch: [],
      };
    m.room = roomName(kind, park, c);
    this.matches.set(id, m);
    this.byRoom.set(m.room, m);
    this.save(m);
    for (const [role, person] of Object.entries(players)) {
      if (kind === "duel") {
        const vs = players[role === "host" ? "guest" : "host"];
        this.net.hubSend(person, {
          t: ranked ? "ranked-match" : role === "host" ? "started" : "start",
          code: c,
          park,
          host: role === "host",
          vs: {
            id: vs,
            name: this.store.profile(vs)?.handle,
            ...this.store.publicStanding(vs),
          },
        });
      } else
        this.net.hubSend(person, {
          t: "team-match",
          code: c,
          slot: role,
          names: Object.fromEntries(
            Object.entries(players).map(([s, id]) => [
              s,
              this.store.profile(id)?.handle || "Rider",
            ]),
          ),
          ...(privateMatch ? { private: true, park } : {}),
          ...(together ? { together: true } : {}),
        });
    }
    return m;
  }
  challenge(id, m) {
    const deny = (why) => this.net.hubSend(id, { t: "failed", to: m.to, why });
    if (m.to === id) return deny("yourself");
    if (
      !this.store
        .friends(id)
        .some((f) => f.account === m.to && f.state === "friends")
    )
      return deny("not-friends");
    if (!this.net.hub(m.to)) return deny("offline");
    if (!this.available(id)) return deny("you-busy");
    if (!this.available(m.to)) return deny("busy");
    const c = code(),
      offer = {
        code: c,
        from: id,
        to: m.to,
        park: maps.has(m.park) ? m.park : "apex",
        until: this.now() + 30000,
        accepted: false,
      };
    this.invites.set(c, offer);
    this.net.hubSend(m.to, {
      t: "challenge",
      code: c,
      from: { id, name: this.store.profile(id).handle },
      park: offer.park,
    });
    this.net.hubSend(id, { t: "sent", to: m.to, code: c, park: offer.park });
  }
  answer(id, m) {
    const offer = this.invites.get(m.code);
    if (!offer || offer.to !== id || offer.until < this.now()) return;
    offer.accepted = !!m.yes;
    this.net.hubSend(offer.from, { t: "answer", code: m.code, yes: !!m.yes });
    if (!m.yes) this.invites.delete(m.code);
  }
  startChallenge(id, c) {
    const offer = this.invites.get(c);
    if (
      !offer ||
      offer.from !== id ||
      !offer.accepted ||
      offer.until < this.now()
    )
      return;
    this.invites.delete(c);
    this.createMatch("duel", offer.park, { host: id, guest: offer.to }, false, {
      requestedCode: c,
    });
  }
  privateTeam(id, m) {
    const p = this.party(id),
      deny = (why) => this.net.hubSend(id, { t: "team-private-off", why });
    if (!p || p.leader !== id) return deny("not-leader");
    if (p.members.length !== 4) return deny("party-size");
    const values = Object.values(m.lineup || {});
    if (
      !slots.every((slot) => typeof m.lineup?.[slot] === "string") ||
      values.length !== 4 ||
      new Set(values).size !== 4 ||
      values.some((v) => !p.members.includes(v))
    )
      return deny("bad");
    if (values.some((v) => !this.available(v) || !this.net.hub(v)))
      return deny("not-here");
    this.createMatch(
      "team",
      maps.has(m.park) ? m.park : "apex",
      m.lineup,
      false,
      { privateMatch: true, together: m.together === true },
    );
  }
  ensureParty(id) {
    let p = this.party(id);
    if (!p) {
      p = {
        id: crypto.randomUUID(),
        key: crypto.randomBytes(8).toString("hex"),
        leader: id,
        members: [id],
        private: false,
        dest: { n: 0, park: null, privacy: "public" },
        chat: [],
        kicked: {},
      };
      this.parties.set(p.id, p);
      this.membership.set(id, p.id);
      this.publishParty(p);
    }
    return p;
  }
  partyAction(id, m) {
    const p = this.party(id),
      deny = (why) =>
        this.net.hubSend(id, { t: "party-failed", op: m.op, to: m.to, why });
    if (["invite", "ask"].includes(m.op)) {
      if (m.to === id) return deny("yourself");
      if (
        !this.store
          .friends(id)
          .some((f) => f.account === m.to && f.state === "friends")
      )
        return deny("not-friends");
      if (!this.net.hub(m.to)) return deny("offline");
      const party = m.op === "invite" ? this.ensureParty(id) : this.party(m.to);
      if (!party) return deny("no-party");
      if (party.members.length >= 4) return deny("full");
      if (m.op === "invite" && party.leader !== id) return deny("not-leader");
      if (m.op === "invite" && this.party(m.to)?.id === party.id)
        return deny("in-party");
      if (m.op === "ask" && p && p.members.length > 1) return deny("in-party");
      const target = m.op === "invite" ? m.to : party.leader,
        joiner = m.op === "invite" ? m.to : id;
      if ((party.kicked[joiner] || 0) > this.now() && m.op === "ask")
        return deny("removed");
      const c = code(),
        offer = {
          code: c,
          party: party.id,
          from: id,
          to: target,
          joiner,
          op: m.op,
          until: this.now() + 30000,
        };
      this.partyInvites.set(c, offer);
      this.net.hubSend(target, {
        t: m.op === "invite" ? "party-invite" : "party-ask",
        code: c,
        from: { id, name: this.store.profile(id).handle },
        size: party.members.length,
      });
      this.net.hubSend(id, { t: "party-sent", op: m.op, to: m.to });
      return;
    }
    if (m.op === "answer") {
      const invite = this.partyInvites.get(m.code);
      if (!invite || invite.to !== id || invite.until < this.now())
        return deny("gone");
      this.partyInvites.delete(m.code);
      this.net.hubSend(invite.from, { t: "party-taken", code: m.code });
      this.net.hubSend(id, { t: "party-taken", code: m.code });
      const party = this.parties.get(invite.party);
      if (!party || party.members.length >= 4) return deny("full");
      if (!m.yes) {
        this.net.hubSend(invite.from, {
          t: "party-no",
          from: { id, name: this.store.profile(id).handle },
        });
        return;
      }
      const old = this.party(invite.joiner);
      if (old && old.members.length > 1) return deny("in-party");
      if (old) this.leaveParty(invite.joiner);
      party.members.push(invite.joiner);
      delete party.kicked[invite.joiner];
      this.membership.set(invite.joiner, party.id);
      this.publishParty(party);
      return;
    }
    if (!p) return deny("no-party");
    if (m.op === "leave") return this.leaveParty(id);
    if (m.op === "outfit") {
      this.publishParty(p);
      return;
    }
    if (
      ["kick", "lead", "private", "privacy"].includes(m.op) &&
      p.leader !== id
    )
      return deny("not-leader");
    if (m.op === "kick") {
      if (!p.members.includes(m.who) || m.who === id) return deny("bad");
      p.kicked[m.who] = this.now() + 600000;
      this.leaveParty(m.who, true);
      return;
    }
    if (m.op === "lead") {
      if (!p.members.includes(m.who)) return deny("bad");
      p.leader = m.who;
      this.publishParty(p);
      return;
    }
    if (m.op === "private" || m.op === "privacy") {
      p.private = !!(m.on ?? m.private);
      p.dest = {
        ...p.dest,
        privacy: p.private ? "private" : "public",
        n: p.dest.n + 1,
      };
      this.publishParty(p);
      return;
    }
  }
  leaveParty(id, removed = false) {
    this.queue(id, { on: false });
    const p = this.party(id);
    if (!p) return;
    p.members = p.members.filter((x) => x !== id);
    this.membership.delete(id);
    this.net.hubSend(id, {
      t: "party",
      party: null,
      ...(removed ? { why: "removed" } : {}),
    });
    if (!p.members.length) {
      this.parties.delete(p.id);
      this.store.remove("parties", p.id);
    } else {
      if (p.leader === id) p.leader = p.members[0];
      this.publishParty(p);
    }
  }
  where(id, where) {
    const p = this.party(id);
    if (!p) return;
    if (p.leader === id && where?.at === "live" && parks.PARKS[where.park]) {
      p.private = where.party === true;
      const dest = {
        park: where.park,
        privacy: p.private ? "private" : "public",
        ...(!p.private ? { room: where.room || 1 } : {}),
      };
      if (JSON.stringify({ ...p.dest, n: undefined }) !== JSON.stringify(dest))
        p.dest = { ...dest, n: p.dest.n + 1 };
    }
    this.publishParty(p);
  }
  partyChat(id, m) {
    const p = this.party(id);
    if (!p) return;
    const previous = p.chat.at(-1);
    if (previous?.from.id === id && this.now() - previous.at < 700) return;
    const text =
      typeof m.text === "string"
        ? m.text
            .trim()
            .replace(/[\x00-\x1f]/g, "")
            .slice(0, 120)
        : null;
    if (!text && !(Number.isInteger(m.quick) && m.quick >= 0 && m.quick < 50))
      return;
    const line = {
      from: { id, name: this.store.profile(id).handle },
      ...(text ? { text } : { quick: m.quick }),
      at: this.now(),
    };
    p.chat.push(line);
    p.chat = p.chat.slice(-80);
    this.store.put("parties", p.id, p);
    for (const person of p.members)
      this.net.hubSend(person, {
        t: "party-chat",
        party: p.id,
        ...line,
        age: 0,
      });
  }
  joined(c) {
    const m = this.byRoom.get(c.room);
    if (!m) return;
    const role = Object.keys(m.players).find((k) => m.players[k] === c.user.id);
    if (role) delete m.missing[role];
    this.sendRecords(m);
    if (
      m.state.phase === "waiting" &&
      Object.values(m.players).every((id) =>
        this.connections(m).some((c) => c.user.id === id),
      )
    ) {
      m.state = { ...m.state, phase: "intro", seq: m.state.seq + 1 };
      m.phaseAt = this.now();
      this.save(m);
      this.broadcastState(m);
    }
  }
  left(c) {
    const m = this.byRoom.get(c.room);
    if (!m || c.watch || ["winner", "over"].includes(m.state.phase)) return;
    const role = Object.keys(m.players).find((k) => m.players[k] === c.user.id);
    if (role) m.missing[role] = this.now();
  }
  activeRoles(m) {
    if (m.kind === "duel") return [parks.S(m.state, m.state.drop)];
    return this.input
      .tt(m.state, m.state.drop)
      .map((role) => this.input.lt(role));
  }
  hostPeer(m) {
    const host = m.kind === "duel" ? m.players.host : m.players.L1;
    return (
      this.connections(m).find((c) => c.user.id === host) ||
      this.connections(m)[0]
    );
  }
  wire(m) {
    const host = this.hostPeer(m);
    if (!host) return null;
    return {
      t: "duel",
      op: "state",
      id: host.id,
      name: host.name,
      v: 2,
      seq: m.state.seq,
      phase: m.state.phase,
      drop: m.state.drop,
      first: m.state.first === "guest" ? "g" : "h",
      runs: [...m.state.runs.host, ...m.state.runs.guest].map(parks.D),
      win:
        m.state.winner === "draw"
          ? "d"
          : m.state.winner === "host"
            ? "h"
            : m.state.winner === "guest"
              ? "g"
              : "",
      wo: !!m.state.walkover,
      left: parks.h[m.state.phase]
        ? Math.max(0, parks.h[m.state.phase] - (this.now() - m.phaseAt))
        : -1,
    };
  }
  broadcastState(m) {
    const wire = this.wire(m);
    // Every player, including the match host, must receive authoritative
    // server phases. Otherwise the host can advance locally while the guest
    // remains on an old round waiting for verification.
    if (wire) this.net.roomSend(m.room, wire);
    this.sendRecords(m);
  }
  sendRecords(m) {
    const peers = this.connections(m);
    if (m.kind === "duel") {
      const record = {
        t: "duel-record",
        duel: m.id,
        riders: peers
          .filter((c) => Object.values(m.players).includes(c.user.id))
          .map((c) => {
            const r = this.store.rating(c.user.id);
            return {
              id: c.id,
              w: r.wins,
              l: r.losses,
              d: r.draws,
              ...(m.ranked ? this.store.publicStanding(c.user.id) : {}),
            };
          }),
        ...(m.ranked ? { ranked: true } : {}),
        runs: 2,
        ...(m.result
          ? {
              over: {
                gaveUp: m.gaveUp || null,
                void: !!m.result.void,
                why: m.gaveUp ? "left" : undefined,
                runs: [...m.state.runs.host, ...m.state.runs.guest].map(
                  parks.D,
                ),
              },
            }
          : {}),
      };
      this.net.roomSend(m.room, record);
    } else {
      this.net.roomSend(m.room, {
        t: "team-record",
        team: m.id,
        ranked: m.ranked,
        ratings: Object.fromEntries(
          Object.entries(m.players).map(([slot, id]) => [
            slot,
            this.store.publicStanding(id, "2v2"),
          ]),
        ),
        on: {
          keeper: "L1",
          out: m.out.map((slot) => ({ slot, excused: false })),
          at: {
            seq: m.state.seq,
            phase: m.state.phase,
            drop: m.state.drop,
            runs: [...m.state.runs.host, ...m.state.runs.guest].map(parks.D),
          },
        },
        ...(m.result
          ? {
              over: {
                gaveUp: m.gaveUp || null,
                void: !!m.result.void,
                left: m.out,
                runs: [...m.state.runs.host, ...m.state.runs.guest].map(
                  parks.D,
                ),
              },
            }
          : {}),
      });
    }
  }
  mountainChallenge(c, message) {
    const v = parks.i(message);
    if (
      !v ||
      !["invite", "accept", "decline", "cancel", "start"].includes(v.op) ||
      !v.code ||
      !maps.has(c.park)
    )
      return false;
    const peers = this.net.peers(c.room).filter((p) => p !== c && !p.watch),
      target = peers.find((p) => p.id === v.to),
      id = c.user.id;
    const relay = () => {
      for (const peer of peers)
        if (v.to === undefined || peer === target)
          this.net.clientSend(peer, {
            ...v,
            t: "duel",
            id: c.id,
            name: c.name,
          });
    };
    if (v.op === "invite") {
      if (
        !this.available(id) ||
        this.invites.has(v.code) ||
        this.byRoom.has(roomName("duel", c.park, v.code)) ||
        (v.to !== undefined && !target)
      )
        return false;
      this.invites.set(v.code, {
        code: v.code,
        kind: "mountain",
        from: id,
        to: target?.user.id || null,
        room: c.room,
        park: c.park,
        until: this.now() + 30000,
        accepted: [],
      });
      relay();
      return true;
    }
    const invite = this.invites.get(v.code);
    if (
      !invite ||
      invite.kind !== "mountain" ||
      invite.room !== c.room ||
      invite.until < this.now()
    )
      return false;
    if (v.op === "cancel" && invite.from === id) {
      relay();
      this.invites.delete(v.code);
      return true;
    }
    if (
      ["accept", "decline"].includes(v.op) &&
      invite.from === target?.user.id &&
      (!invite.to || invite.to === id)
    ) {
      if (v.op === "accept" && !invite.accepted.includes(id))
        invite.accepted.push(id);
      relay();
      return true;
    }
    if (
      v.op === "start" &&
      invite.from === id &&
      target &&
      invite.accepted.includes(target.user.id) &&
      this.available(id) &&
      this.available(target.user.id)
    ) {
      this.createMatch(
        "duel",
        invite.park,
        { host: id, guest: target.user.id },
        false,
        { requestedCode: v.code },
      );
      relay();
      this.invites.delete(v.code);
      return true;
    }
    return false;
  }
  async room(c, message) {
    await this.ready;
    const m = this.byRoom.get(c.room);
    if (c.watch) return false;
    if (!m) return this.mountainChallenge(c, message);
    const role = Object.keys(m.players).find((k) => m.players[k] === c.user.id),
      v = parks.i(message);
    if (!role || !v) return true;
    if (v.op === "hello") {
      this.net.roomSend(c.room, { ...v, t: "duel", id: c.id, name: c.name }, c);
      this.sendRecords(m);
      this.broadcastState(m);
      return true;
    }
    if (v.op === "state") {
      // The original host client sends its local phase rather than a result
      // message. This is a completion hint only: never trust its claimed score.
      if (
        c === this.hostPeer(m) &&
        m.state.phase === "run" &&
        v.phase === "posted" &&
        v.drop === m.state.drop &&
        this.activeRoles(m).includes(role)
      ) this.notePendingScore(m, role);
      if (c === this.hostPeer(m)) this.broadcastState(m);
      return true;
    }
    if (v.op === "result") {
      if (
        v.drop === m.state.drop &&
        this.activeRoles(m).includes(role)
      ) {
        if (v.score < 0) this.post(m, role, parks.y(v.score));
        else if (m.state.phase === "run") this.notePendingScore(m, role);
      }
      return true;
    }
    if (v.op === "bye") {
      m.missing[role] = this.now() - parks.m.leaveGrace;
      return true;
    }
    if (v.op === "rematch" && ["winner", "over"].includes(m.state.phase)) {
      if (!m.rematch.includes(c.user.id)) m.rematch.push(c.user.id);
      if (Object.values(m.players).every((id) => m.rematch.includes(id))) {
        const next = this.createMatch(
          m.kind,
          maps.has(v.park) ? v.park : m.park,
          m.players,
          m.ranked,
          { privateMatch: m.privateMatch, together: m.together },
        );
        for (const peer of this.connections(m))
          this.net.clientSend(peer, {
            t: "duel",
            op: "move",
            id: c.id,
            name: c.name,
            v: 2,
            code: next.code,
            park: next.park,
          });
      }
      return true;
    }
    if (v.op === "camera")
      this.net.roomSend(c.room, { ...v, t: "duel", id: c.id, name: c.name }, c);
    return true;
  }
  verificationContext(id, request) {
    const ref = request.duel || request.team,
      m = this.matches.get(ref?.id);
    if (!m || m.kind !== (request.duel ? "duel" : "team"))
      throw fault("Match not found", 404);
    const role = Object.keys(m.players).find((k) => m.players[k] === id);
    if (!role) throw fault("Not a participant in this match", 403);
    const active =
      ref.drop === m.state.drop &&
      ["present", "count", "run"].includes(m.state.phase) &&
      this.activeRoles(m).includes(role);
    const pending = m.kind === "duel" &&
      m.pendingScores?.[`${ref.drop}:${role}`];
    // The player may finish while the verifier is still working. Continue
    // accepting that exact proof even after the next player's turn begins.
    if (!active && !(pending && !m.result))
      throw fault("This match round is not accepting inputs", 409);
    return {
      match: m,
      role,
      drop: ref.drop,
      park: m.park,
      competitive: true,
      lane:
        m.kind === "team" && m.together ? (role.endsWith("1") ? -1.6 : 1.6) : 0,
      maximumSeconds: parks.w(m.park).runLimit / 1000 + 5,
    };
  }
  verified(context, result) {
    const m = context.match,
      key = context.drop + ":" + context.role;
    if (m.verified[key] !== undefined) return;
    // A completed duel turn is only provisionally scored until the input log
    // has been simulated. The verifier can finish during another rider's turn.
    if (m.kind === "duel" && m.pendingScores?.[key] && !m.result) {
      this.settleDuelScore(m, key, result.score);
      return;
    }
    if (
      m.state.drop !== context.drop ||
      !["present", "count", "run"].includes(m.state.phase) ||
      !this.activeRoles(m).includes(context.role)
    )
      throw fault("This match round has ended", 409);
    m.verified[key] = result.score;
    console.info("Competition run verified", {
      match: m.id, kind: m.kind, drop: context.drop,
      role: context.role, score: result.score,
    });
    this.post(m, context.role, result.score);
  }
  settleDuelScore(m, key, mark) {
    const pending = m.pendingScores?.[key];
    if (!pending || m.result || m.kind !== "duel") return;
    delete m.pendingScores[key];
    m.verified[key] = mark;
    const { drop, role } = pending;
    const runs = [...m.state.runs[role]];
    runs[Math.floor(drop / 2)] = mark;
    m.state = {
      ...m.state,
      seq: m.state.seq + 1,
      runs: { ...m.state.runs, [role]: runs },
    };
    // The provisional result can change the winner after all four drops.
    if (m.state.phase === "winner" && !m.state.walkover) {
      m.state.winner = parks.g({
        ...m.state, phase: "posted", drop: 3,
      }).winner;
    }
    console.info("Competition run verified", {
      match: m.id, kind: "duel", drop, role, score: mark,
    });
    this.save(m);
    this.broadcastState(m);
  }
  notePendingScore(m, role) {
    m.pendingScores ??= {};
    if (m.kind === "duel") {
      if (m.state.phase !== "run") return;
      const drop = m.state.drop, key = drop + ":" + role;
      if (m.pendingScores[key]) return;
      m.pendingScores[key] = { drop, role, at: this.now() };
      console.info("Competition run finished; advancing turn while verifying", {
        match: m.id, drop, role,
      });
      // Never trust the client's score. Zero is a provisional placeholder;
      // the verified replay will replace it, even during a later drop.
      this.post(m, role, 0);
      return;
    }
    // Together 2v2 still requires all teammates' verified marks.
    m.pendingScores[role] ??= this.now();
  }
  post(m, role, mark) {
    const old = m.state;
    if (m.kind === "duel") m.state = parks.A(m.state, role, m.state.drop, mark);
    else
      m.state = this.input.ct(m.state, this.input.ut(role), m.state.drop, mark);
    if (m.state === old) return;
    if (m.pendingScores) delete m.pendingScores[role];
    const peer = this.connections(m).find((c) => c.user.id === m.players[role]);
    if (peer)
      this.net.roomSend(
        m.room,
        {
          t: "duel",
          op: "result",
          id: peer.id,
          name: peer.name,
          v: 2,
          drop: old.drop,
          score: parks.D(mark),
        },
        peer,
      );
    if (m.state.phase !== old.phase) m.phaseAt = this.now();
    this.save(m);
    this.broadcastState(m);
  }
  finish(m) {
    if (m.result) return;
    const winner = m.state.winner || "draw";
    m.result = { ranked: m.ranked, rated: m.ranked, void: false };
    const size = m.kind === "team" ? "2v2" : "1v1",
      before = Object.fromEntries(
        Object.entries(m.players).map(([role, id]) => [
          role,
          this.store.rating(id, size),
        ]),
      );
    this.store.transaction(() => {
      for (const [role, id] of Object.entries(m.players)) {
        const side =
            m.kind === "duel" ? role : role.startsWith("L") ? "host" : "guest",
          own = Object.keys(m.players).filter(
            (r) =>
              (m.kind === "duel" ? r : r.startsWith("L") ? "host" : "guest") ===
              side,
          ),
          opponent = Object.keys(m.players).filter((r) => !own.includes(r)),
          average = (roles) =>
            roles.reduce((sum, r) => sum + before[r].rating, 0) / roles.length,
          result =
            winner === "draw" ? "draw" : winner === side ? "win" : "loss",
          forgiven =
            m.kind === "team" &&
            result === "loss" &&
            m.out.some((r) => own.includes(r)) &&
            !m.out.includes(role),
          expected = 1 / (1 + 10 ** ((average(opponent) - average(own)) / 400)),
          delta =
            m.ranked && !forgiven
              ? Math.round(
                  32 *
                    ((result === "win" ? 1 : result === "draw" ? 0.5 : 0) -
                      expected),
                )
              : 0,
          r = before[role];
        if (m.ranked && !forgiven)
          this.store.put("ratings-" + size, id, {
            ...r,
            rating: Math.max(0, r.rating + delta),
            peak: Math.max(r.peak, r.rating + delta),
            games: r.games + 1,
            wins: r.wins + Number(result === "win"),
            losses: r.losses + Number(result === "loss"),
            draws: r.draws + Number(result === "draw"),
          });
        m.result[role] = {
          rating: r.rating,
          delta,
          result: forgiven ? "forgiven" : result,
        };
        const record = this.store.get("duel_records", id) || {
          player_id: id,
          wins: 0,
          losses: 0,
          draws: 0,
        };
        this.store.put("duel_records", id, {
          ...record,
          wins: record.wins + Number(result === "win"),
          losses: record.losses + Number(result === "loss"),
          draws: record.draws + Number(result === "draw"),
        });
      }
      this.save(m);
    });
    this.sendRecords(m);
  }
  result(id, kind) {
    const m = this.store.get("matches", id);
    if (!m) return null;
    if (kind === "team")
      return m.result
        ? {
            rated: m.ranked,
            ...(m.result.void ? { void: true } : {}),
            riders: Object.fromEntries(
              Object.keys(m.players).map((role) => [role, m.result[role]]),
            ),
          }
        : null;
    return m.ranked
      ? m.result
        ? {
            ranked: true,
            rated: true,
            host: m.result.host,
            guest: m.result.guest,
          }
        : null
      : { ranked: false };
  }
  async tick() {
    await this.ready;
    const now = this.now();
    for (const [c, i] of this.invites)
      if (i.until < now) this.invites.delete(c);
    for (const [c, i] of this.partyInvites)
      if (i.until < now) this.partyInvites.delete(c);
    for (const [id, e] of this.queues)
      if (!this.net.hub(id))
        for (const person of e.ids) {
          this.queues.delete(person);
          if (person !== id)
            this.net.hubSend(person, { t: "ranked-off", why: "mate-left" });
        }
    this.matchQueues();
    for (const m of this.matches.values()) {
      // Verification is allowed to settle after the turn advances. When a
      // verifier remains unavailable, end the provisional score as a DNF.
      if (m.kind === "duel") {
        for (const [key, pending] of Object.entries(m.pendingScores || {})) {
          if (pending && typeof pending === "object" &&
              now - pending.at >= 240000)
            this.settleDuelScore(m, key, "dnf");
        }
      }
      if (m.state.phase === "over") continue;
      for (const [role, at] of Object.entries(m.missing)) {
        if (
          now - at < parks.m.leaveGrace ||
          ["winner", "over"].includes(m.state.phase)
        )
          continue;
        if (m.kind === "duel") {
          m.state = parks.P(m.state, role);
          m.gaveUp = role;
          m.phaseAt = now;
        } else {
          if (!m.out.includes(role)) m.out.push(role);
          if (this.activeRoles(m).includes(role)) this.post(m, role, "dnf");
          if (m.out.filter((r) => r.startsWith(role[0])).length >= 2) {
            m.state = {
              ...m.state,
              phase: "winner",
              winner: role.startsWith("L") ? "guest" : "host",
              seq: m.state.seq + 1,
            };
            m.gaveUp = role;
            m.phaseAt = now;
          }
        }
        if (m.ranked) {
          const previous = this.store.get("ranked_breaks", m.players[role]),
            strikes =
              previous && now - previous.at < 7200000
                ? previous.strikes + 1
                : 1,
            delay = (
              m.kind === "team"
                ? [300000, 900000, 1800000]
                : [60000, 300000, 900000]
            )[Math.min(2, strikes - 1)];
          this.store.put("ranked_breaks", m.players[role], {
            strikes,
            at: now,
            until: now + delay,
          });
        }
        delete m.missing[role];
        this.save(m);
        this.broadcastState(m);
      }
      // A walkover is final regardless of unfinished run verification.
      if (m.kind === "duel" && m.state.walkover) {
        for (const [key, pending] of Object.entries(m.pendingScores || {}))
          if (pending && typeof pending === "object")
            this.settleDuelScore(m, key, "dnf");
      }
      if (m.state.phase === "waiting") {
        if (now > (m.reconnectUntil || m.created + 90000)) {
          m.state = { ...m.state, phase: "over" };
          m.result = { void: true, ranked: m.ranked };
          this.save(m);
        }
        continue;
      }
      // A score that cannot be verified must not hold the next rider hostage.
      // After a bounded grace period, record a DNF rather than fake points.
      if (m.state.phase === "run") {
        for (const role of this.activeRoles(m)) {
          const reportedAt = m.pendingScores?.[role];
          if (reportedAt !== undefined && now - reportedAt >= 120000)
            this.post(m, role, "dnf");
        }
      }
      // Keep the winner screen up until all submitted runs are verified (or
      // safely timed out). Never publish ranked ratings from placeholder scores.
      const duelPending = m.kind === "duel" &&
        Object.values(m.pendingScores || {}).some(
          (p) => p && typeof p === "object",
        );
      if (m.state.phase === "winner" && duelPending) {
        if (now - (m.sentAt || 0) >= 4000) {
          m.sentAt = now;
          this.broadcastState(m);
        }
        continue;
      }
      if (m.state.phase === "winner" && !m.result) this.finish(m);
      if (
        m.state.phase === "run" &&
        now - m.phaseAt > parks.w(m.park).runLimit
      ) {
        for (const role of this.activeRoles(m)) this.post(m, role, "dnf");
      } else if (
        parks.h[m.state.phase] &&
        now - m.phaseAt >= parks.h[m.state.phase]
      ) {
        m.state = m.kind === "duel" ? parks.g(m.state) : this.input.Q(m.state);
        m.phaseAt = now;
        this.save(m);
        this.broadcastState(m);
      }
      if (m.state.phase === "winner" && !duelPending) this.finish(m);
      if (now - (m.sentAt || 0) >= 4000) {
        m.sentAt = now;
        this.broadcastState(m);
      }
    }
  }
  summary() {
    const active = [...this.matches.values()].filter(
      (m) => !["winner", "over"].includes(m.state.phase),
    );
    return {
      ranked: active.filter((m) => m.kind === "duel" && m.ranked).length,
      friendly: active.filter((m) => m.kind === "duel" && !m.ranked).length,
      searching: [...this.queues.values()].filter((m) => m.size === "1v1")
        .length,
      teams: active.filter((m) => m.kind === "team").length,
      teamSearching: [...this.queues.values()].filter((m) => m.size === "2v2")
        .length,
    };
  }
  duels(park) {
    return [...this.matches.values()]
      .filter(
        (m) =>
          m.park === park &&
          m.kind === "duel" &&
          !["winner", "over"].includes(m.state.phase),
      )
      .map((m) => ({
        code: m.code,
        host: this.store.profile(m.players.host)?.handle,
        guest: this.store.profile(m.players.guest)?.handle,
        watching: this.net.peers(m.room).filter((c) => c.watch).length,
        live: m.state.phase !== "waiting",
      }));
  }
  close() {
    clearInterval(this.timer);
  }
}
