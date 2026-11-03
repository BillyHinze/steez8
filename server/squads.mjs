import crypto from "node:crypto";
const fault = (message, status = 400) => Object.assign(Error(message), { status });
const sizes = new Set(["3v3", "4v4"]);
export class Squads {
  constructor(store, { clock = Date.now } = {}) {
    this.store = store; this.now = clock; this.queues = new Map(); this.presence = new Map();
    this.timer = setInterval(() => this.tick(), 2000); this.timer.unref();
  }
  close() { clearInterval(this.timer); }
  matches(id) { return this.store.rows("squad_matches").filter((m) => m.players.some((p) => p.id === id)).sort((a, b) => b.created_at - a.created_at); }
  current(id) { return this.matches(id).find((m) => ["ready", "riding"].includes(m.phase)); }
  busy(id) { return this.queues.has(id) || !!this.current(id); }
  legacyBusy(id) { return this.store.competition?.queues.has(id) || [...(this.store.competition?.matches.values() || [])].some((m) => Object.values(m.players).includes(id) && !["winner", "over"].includes(m.state.phase)); }
  save(m) { this.store.put("squad_matches", m.id, m); }
  cancelQueue(id) { const q = this.queues.get(id); if (q) q.ids.forEach((id) => this.queues.delete(id)); }
  snapshot(id) {
    this.presence.set(id, this.now()); this.tick();
    const queue = this.queues.get(id), match = this.current(id) || this.matches(id)[0], party = this.store.competition?.party(id);
    return {
      now: this.now(), queue: queue ? { size: queue.size, since: queue.since, members: queue.ids.map((p) => this.store.user(p)?.handle || "Rider"), searching: [...this.queues.values()].filter((q) => q.size === queue.size).length } : null,
      match: match ? this.view(match, id) : null,
      standings: Object.fromEntries([...sizes].map((s) => [s, this.store.rankedBoard(id, s)])),
      party: party ? { leader: party.leader === id, count: party.members.length } : null,
      break_until: this.store.get("squad_breaks", id)?.until || 0,
    };
  }
  view(m, id) {
    return { id: m.id, size: m.size, phase: m.phase, ready_deadline: m.ready_deadline, deadline: m.deadline, winner: m.winner, void: m.void, reason: m.reason,
      totals: ["L", "R"].map((side) => m.players.filter((p) => p.side === side).reduce((sum, p) => sum + (p.score ?? 0), 0)),
      players: m.players.map((p) => ({ handle: this.store.user(p.id)?.handle || "Deleted rider", side: p.side, you: p.id === id, ready: p.ready, status: p.status, score: p.score, result: p.result })),
      you: m.players.find((p) => p.id === id)?.side,
    };
  }
  join(id, size) {
    if (!sizes.has(size)) throw fault("Choose 3v3 or 4v4");
    this.presence.set(id, this.now()); this.tick();
    if (this.current(id)) throw fault("Finish your current squad match first", 409);
    const party = this.store.competition?.party(id), teamSize = Number(size[0]);
    let ids = [id];
    if (party && party.members.length > 1) {
      if (party.leader !== id) throw fault("Your party leader starts the squad search", 409);
      if (party.members.length > teamSize) throw fault("Your party is too large for this format", 409);
      ids = [...party.members];
    }
    for (const person of ids) {
      if (this.store.banned(person)) throw fault("A rider is not eligible to queue", 403);
      if (this.current(person) || this.legacyBusy(person) || this.store.mountainSessions?.active(person)) throw fault("Everyone must finish their current match or session first", 409);
      if ((this.store.get("squad_breaks", person)?.until || 0) > this.now()) throw fault("A rider is on a short break after leaving a match", 409);
      if (person !== id && this.now() - (this.presence.get(person) ?? 0) > 30000) throw fault("Ask every party member to open the Squads tab before queueing", 409);
    }
    const ratings = ids.map((p) => this.store.rating(p, size).rating);
    if (Math.max(...ratings) - Math.min(...ratings) > 500) throw fault("Party ratings must be within 500 points", 409);
    ids.forEach((p) => this.cancelQueue(p));
    const entry = { ids, size, party: ids.length > 1 ? party.id : null, since: this.now() };
    ids.forEach((p) => this.queues.set(p, entry)); this.matchmake(); return this.snapshot(id);
  }
  matchmake() {
    for (const size of sizes) {
      const count = Number(size[0]), entries = [...new Set(this.queues.values())].filter((q) => q.size === size).sort((a, b) => a.since - b.since).slice(0, 24);
      // Small bounded subset search fills a team without splitting a party.
      const fill = (candidates, target, selected = []) => {
        if (!target) return selected;
        for (let i = 0; i < candidates.length; i++) { const q = candidates[i]; if (q.ids.length <= target) { const result = fill(candidates.slice(i + 1), target - q.ids.length, [...selected, q]); if (result) return result; } }
        return null;
      };
      while (entries.reduce((sum, q) => sum + q.ids.length, 0) >= count * 2) {
        const left = fill(entries, count); if (!left) break;
        const right = fill(entries.filter((q) => !left.includes(q)), count); if (!right) break;
        const average = (group) => group.flatMap((q) => q.ids).reduce((sum, id) => sum + this.store.rating(id, size).rating, 0) / count;
        const maxGap = 250 + Math.floor((this.now() - Math.min(...[...left, ...right].map((q) => q.since))) / 30000) * 100;
        if (Math.abs(average(left) - average(right)) > Math.min(1000, maxGap)) break;
        const m = { id: crypto.randomUUID(), size, phase: "ready", created_at: this.now(), ready_deadline: this.now() + 60000, players: [left, right].flatMap((group, side) => group.flatMap((q) => q.ids.map((id) => ({ id, side: side ? "R" : "L", ready: false, status: "waiting", score: null })))) };
        for (const q of [...left, ...right]) { q.ids.forEach((id) => this.queues.delete(id)); entries.splice(entries.indexOf(q), 1); } this.save(m);
      }
    }
  }
  ready(id, matchId) {
    if (this.store.banned(id)) throw fault("Account is not eligible to play", 403);
    this.tick(); const m = this.current(id);
    if (!m || m.id !== matchId || m.phase !== "ready") throw fault("This ready check is no longer open", 409);
    const p = m.players.find((p) => p.id === id); p.ready = true;
    if (m.players.every((p) => p.ready)) { m.phase = "riding"; m.started_at = this.now(); m.deadline = this.now() + 360000; m.players.forEach((p) => p.status = "riding"); }
    this.save(m); return this.snapshot(id);
  }
  penalty(id, minutes) { this.store.put("squad_breaks", id, { player_id: id, until: this.now() + minutes * 60000 }); }
  leave(id, matchId) {
    this.tick(); const m = this.current(id);
    if (!m || m.id !== matchId) throw fault("Match not active", 409);
    if (m.phase === "ready") { this.penalty(id, 1); m.phase = "void"; m.void = true; m.reason = "A rider left before the ready check finished. Ratings unchanged."; this.save(m); }
    else { const p = m.players.find((p) => p.id === id); if (p.status !== "riding") throw fault("Your run is already submitted", 409); p.status = "forfeit"; p.score = 0; this.penalty(id, 5); this.save(m); if (m.players.every((p) => p.status !== "riding")) this.finish(m); }
    return this.snapshot(id);
  }
  accept(id, run, { competitive = false } = {}) {
    const m = this.current(id); if (!m || m.phase !== "riding" || competitive) return;
    if (this.now() > m.deadline) return;
    const p = m.players.find((p) => p.id === id);
    if (p.status !== "riding" || run.player_id !== id || run.verified !== true || run.course_id !== "apex-v1" || !Number.isFinite(run.score) || run.score < 0 || !Number.isFinite(run.duration_ms) || run.duration_ms <= 0 || !run.inputs_hash || this.now() - m.started_at + 1500 < run.duration_ms || Date.parse(run.created_at) < m.started_at) return;
    if (this.store.rows("completed_runs").some((r) => r.id !== run.id && r.player_id === id && r.inputs_hash === run.inputs_hash)) return;
    p.score = run.score; p.status = "finished"; p.run = run.id; this.save(m);
    // Rating writes run in the verifier's current transaction when accepting a run.
    if (m.players.every((p) => p.status !== "riding")) this.finish(m, true);
  }
  finish(m, inTransaction = false) {
    if (m.phase !== "riding") return;
    const apply = () => {
      const valid = m.players.some((p) => p.status === "finished");
      m.phase = valid ? "complete" : "void"; m.void = !valid; m.finished_at = this.now();
      const total = (side) => m.players.filter((p) => p.side === side).reduce((sum, p) => sum + (p.score ?? 0), 0), left = total("L"), right = total("R");
      m.winner = left === right ? "draw" : left > right ? "L" : "R";
      if (!valid) m.reason = "No verified finishes. Ratings unchanged.";
      const before = new Map(m.players.map((p) => [p.id, this.store.rating(p.id, m.size)]));
      for (const p of m.players) {
        const dropped = p.status === "forfeit", result = dropped ? "loss" : m.winner === "draw" ? "draw" : m.winner === p.side ? "win" : "loss";
        const forgiven = result === "loss" && !dropped && m.players.some((q) => q.side === p.side && q.status === "forfeit");
        const average = (side) => m.players.filter((q) => q.side === side).reduce((sum, q) => sum + before.get(q.id).rating, 0) / Number(m.size[0]);
        const expected = 1 / (1 + 10 ** ((average(p.side === "L" ? "R" : "L") - average(p.side)) / 400));
        const delta = valid && !forgiven ? Math.round(32 * ((result === "win" ? 1 : result === "draw" ? .5 : 0) - expected)) : 0, r = before.get(p.id);
        p.result = { rating: Math.max(0, r.rating + delta), delta, outcome: !valid ? "void" : forgiven ? "forgiven" : result };
        if (valid && !forgiven) this.store.put("ratings-" + m.size, p.id, { ...r, rating: Math.max(0, r.rating + delta), peak: Math.max(r.peak, r.rating + delta), games: r.games + 1, wins: r.wins + Number(result === "win"), losses: r.losses + Number(result === "loss"), draws: r.draws + Number(result === "draw") });
      }
      this.save(m);
    };
    if (inTransaction) apply(); else this.store.transaction(apply);
  }
  tick() {
    for (const q of new Set(this.queues.values())) {
      const party = q.party && this.store.competition?.parties.get(q.party);
      if (q.ids.some((id) => this.now() - (this.presence.get(id) ?? 0) > 30000 || this.store.banned(id) || this.legacyBusy(id)) || q.party && (!party || party.members.length !== q.ids.length || q.ids.some((id) => !party.members.includes(id)))) this.cancelQueue(q.ids[0]);
    }
    for (const m of this.store.rows("squad_matches")) {
      if (m.phase === "ready" && this.now() > m.ready_deadline) {
        m.players.filter((p) => !p.ready).forEach((p) => this.penalty(p.id, 1)); m.phase = "void"; m.void = true; m.reason = "Ready check expired. Ratings unchanged."; this.save(m);
      } else if (m.phase === "riding" && this.now() > m.deadline) {
        for (const p of m.players.filter((p) => p.status === "riding")) { p.status = "forfeit"; p.score = 0; this.penalty(p.id, 5); } this.finish(m);
      }
    }
    this.matchmake();
  }
}
