import crypto from "node:crypto";
import { parks } from "./journal.mjs";
export const modes = [
  { id: "time-attack", name: "Time Attack", tag: "RACE THE CLOCK", description: "One complete run. Your fastest verified finish wins. Take any line you like.", unit: "time", minutes: 10 },
  { id: "score-rush", name: "Score Rush", tag: "TEN MINUTES. THREE LINES.", description: "Ride as many laps as you can in ten minutes. Your three highest-scoring finishes make your total.", unit: "score", minutes: 10 },
  { id: "clean-line", name: "Clean Line", tag: "STYLE WITHOUT THE SLAM", description: "One run, zero crashes. Land your biggest score cleanly; a crash means a new attempt.", unit: "score", minutes: 10 },
  { id: "air-time", name: "Air Time", tag: "SPEND MORE TIME IN THE SKY", description: "One finished run. Link jumps and transitions to build the most total airtime. Every second in the air counts.", unit: "airtime", minutes: 10 },
  { id: "rail-jam", name: "Rail Jam", tag: "MAKE EVERY RAIL COUNT", description: "One finished run. Your verified rail points decide the result. Find your line through the park’s rails and boxes.", unit: "score", minutes: 10 },
  { id: "park-tour", name: "Park Tour", tag: "FIVE PARKS. ONE ADVENTURE.", description: "Finish The Yard, Apex, Big Air, Forest Line and Aspen Pipe in order. Your combined riding time decides your result. You have 24 hours.", unit: "time", minutes: 1440 },
];
const fault = (message, status = 400) => Object.assign(Error(message), { status });
const modeOf = (id) => modes.find((m) => m.id === id);
export class Sessions {
  constructor(store, { clock = Date.now } = {}) { this.store = store; this.now = clock; }
  records(id) { return this.store.rows("mountain_sessions").filter((s) => s.player_id === id).sort((a, b) => b.started_at - a.started_at); }
  active(id) {
    const session = this.records(id).find((s) => s.status === "active");
    if (session && this.now() > session.expires_at) {
      this.finish(session, session.mode === "score-rush" && session.runs.length ? "complete" : "expired");
      return null;
    }
    return session ?? null;
  }
  view(session) {
    if (!session) return null;
    const { player_id, ...view } = session;
    return { ...view, runs: session.runs.map(({ hash, ...r }) => r), next_park: session.mode === "park-tour" ? parks[session.runs.length]?.id ?? null : session.park };
  }
  snapshot(id) {
    const active = this.active(id), records = this.records(id);
    const bests = new Map();
    for (const s of records.filter((s) => s.status === "complete")) {
      const key = s.mode + ":" + s.park, previous = bests.get(key);
      if (!previous || this.better(s, previous)) bests.set(key, s);
    }
    return { now: this.now(), modes, parks, featured: parks[Math.floor(this.now() / 86400000) % parks.length], active: this.view(active), history: records.slice(0, 20).map((s) => this.view(s)), bests: [...bests.values()].map((s) => this.view(s)) };
  }
  better(a, b) { return modeOf(a.mode).unit === "time" ? a.value < b.value : a.value > b.value; }
  start(id, mode, park) {
    if (this.store.banned(id)) throw fault("Account is not eligible to start a session", 403);
    if (this.store.squads?.busy(id) || this.store.squads?.legacyBusy(id)) throw fault("Finish your ranked match or cancel its search first", 409);
    if (!modeOf(mode)) throw fault("Choose a supported mode");
    if (!parks.some((p) => p.id === park)) throw fault("Choose a supported park");
    if (this.active(id)) throw fault("Finish or abandon your current session first", 409);
    const session = { id: crypto.randomUUID(), player_id: id, mode, park: mode === "park-tour" ? "all" : park, status: "active", started_at: this.now(), expires_at: this.now() + modeOf(mode).minutes * 60000, runs: [], value: 0, notice: "Your next complete solo run counts. Start from the top." };
    this.store.put("mountain_sessions", session.id, session);
    return this.snapshot(id);
  }
  finish(session, status) {
    session.status = status;
    session.finished_at = this.now();
    this.store.put("mountain_sessions", session.id, session);
  }
  end(id, sessionId, abandon = false) {
    const active = this.active(id);
    if (!active || active.id !== sessionId) throw fault("This session is no longer active", 409);
    if (!abandon && (active.mode !== "score-rush" || !active.runs.length)) throw fault("Finish a qualifying run first", 409);
    this.finish(active, abandon ? "abandoned" : "complete");
    return this.snapshot(id);
  }
  accept(id, run, { competitive = false } = {}) {
    const session = this.active(id);
    if (!session || competitive || run.player_id !== id || run.verified !== true || !Number.isFinite(run.duration_ms) || run.duration_ms <= 0 || !Number.isFinite(run.score) || run.score < 0 || !run.inputs_hash) return;
    const park = session.mode === "park-tour" ? parks[session.runs.length]?.id : session.park;
    if (!new RegExp("^" + park + "-v[0-9]+$").test(run.course_id)) return;
    // A pre-session run, duplicate log or a client-selected score cannot enter a session.
    const lastEnd = session.runs.at(-1)?.accepted_at ?? session.started_at;
    if (this.now() - lastEnd + 1500 < run.duration_ms || Date.parse(run.created_at) < session.started_at || session.runs.some((r) => r.id === run.id || r.hash === run.inputs_hash) || this.store.rows("completed_runs").some((r) => r.id !== run.id && r.player_id === id && r.inputs_hash === run.inputs_hash)) {
      session.notice = "That run was already recorded or began before this session. Start a fresh run from the top.";
      this.store.put("mountain_sessions", session.id, session);
      return;
    }
    if (session.mode === "clean-line" && run.crashes !== 0) {
      session.notice = "A crash broke your clean line. Start a new attempt and give it another go.";
      this.finish(session, "failed");
      return;
    }
    if (session.mode === "air-time" && (!Number.isFinite(run.airtime_ms) || run.airtime_ms < 0) || session.mode === "rail-jam" && (!Number.isFinite(run.rails) || run.rails < 0)) return;
    session.runs.push({ airtime_ms: run.airtime_ms ?? 0, rails: run.rails ?? 0, id: run.id, hash: run.inputs_hash, park, score: run.score, duration_ms: run.duration_ms, accepted_at: this.now() });
    session.value = session.mode === "score-rush" ? session.runs.map((r) => r.score).sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a + b, 0) : modeOf(session.mode).unit === "time" ? session.runs.reduce((a, r) => a + r.duration_ms, 0) : session.mode === "air-time" ? run.airtime_ms : session.mode === "rail-jam" ? run.rails : run.score;
    session.notice = session.mode === "park-tour" ? "Park stamped. Continue to the next stop." : "Verified run added to your session.";
    if (["time-attack", "clean-line", "air-time", "rail-jam"].includes(session.mode) || session.mode === "park-tour" && session.runs.length === 5) this.finish(session, "complete");
    else this.store.put("mountain_sessions", session.id, session);
  }
  board(mode, park) {
    if (!modeOf(mode) || !(park === "all" && mode === "park-tour") && !parks.some((p) => p.id === park)) throw fault("Unknown leaderboard");
    const bests = new Map();
    for (const s of this.store.rows("mountain_sessions")) {
      if (s.mode !== mode || s.park !== park || s.status !== "complete" || !this.store.user(s.player_id)) continue;
      if (!bests.has(s.player_id) || this.better(s, bests.get(s.player_id))) bests.set(s.player_id, s);
    }
    return [...bests.values()].sort((a, b) => (modeOf(mode).unit === "time" ? a.value - b.value : b.value - a.value) || a.finished_at - b.finished_at).slice(0, 25).map((s, i) => ({ rank: i + 1, handle: this.store.user(s.player_id).handle, value: s.value, mode, park }));
  }
}
