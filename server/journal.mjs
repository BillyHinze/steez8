export const parks = [
  { id: "nordryggen", name: "The Yard", terrain: "Rails & progression" },
  { id: "apex", name: "Apex", terrain: "Kickers & big lines" },
  { id: "bigair", name: "Big Air", terrain: "One jump. Make it count." },
  { id: "forestline", name: "Forest Line", terrain: "Find your way through" },
  { id: "halfpipe", name: "Aspen Pipe", terrain: "Wall to wall" },
  { id: "ridgeline", name: "Ridgeline", terrain: "Flow kickers & a side quest" },
];
export const milestones = [
  { id: "first-tracks", title: "First tracks", description: "Finish your first verified run.", metric: "runs", target: 1, reward: 25, mark: "01" },
  { id: "finding-flow", title: "Finding flow", description: "Land a 5,000-point run.", metric: "best", target: 5000, reward: 50, mark: "5K" },
  { id: "regular", title: "Mountain regular", description: "Finish 25 verified runs.", metric: "runs", target: 25, reward: 100, mark: "25" },
  { id: "explorer", title: "All-mountain rider", description: "Stamp five different parks in your passport.", metric: "parks", target: 5, reward: 150, mark: "V" },
  { id: "high-line", title: "The high line", description: "Land a 25,000-point run.", metric: "best", target: 25000, reward: 100, mark: "25K" },
  { id: "century", title: "Century club", description: "Finish 100 verified runs.", metric: "runs", target: 100, reward: 250, mark: "100" },
];
const fault = (message, status = 400) => Object.assign(Error(message), { status });
const parkFor = (course) => parks.find((p) => course === p.id || new RegExp("^" + p.id + "-v[0-9]+$").test(course));
export class Journal {
  constructor(store, economy, { clock = Date.now } = {}) {
    this.store = store;
    this.economy = economy;
    this.now = clock;
  }
  snapshot(id) {
    // Only authenticated account-owned results written by the verifier count.
    const runs = this.store.rows("completed_runs")
      .filter((r) => r.player_id === id && r.verified === true && Number.isFinite(r.score) && r.score >= 0 && Number.isFinite(Date.parse(r.created_at)) && Date.parse(r.created_at) <= this.now() && parkFor(r.course_id))
      .sort((a, b) => b.created_at.localeCompare(a.created_at) || String(a.id).localeCompare(String(b.id)));
    const passport = parks.map((p) => {
      const visits = runs.filter((r) => parkFor(r.course_id).id === p.id);
      return { ...p, runs: visits.length, best: visits.length ? visits.reduce((best, r) => Math.max(best, r.score), 0) : null, first_visit: visits.at(-1)?.created_at ?? null };
    });
    const totals = { runs: runs.length, best: runs.reduce((best, r) => Math.max(best, r.score), 0), parks: passport.filter((p) => p.runs).length };
    const badges = milestones.map((m) => ({ ...m, progress: Math.min(m.target, totals[m.metric]), ready: totals[m.metric] >= m.target, claimed: !!this.store.get("milestone_rewards", id + ":" + m.id) }));
    return {
      rider: this.store.user(id)?.handle ?? "Rider", balance: this.store.balance(id),
      totals: { ...totals, riding_ms: runs.reduce((total, r) => total + (Number.isFinite(r.duration_ms) && r.duration_ms > 0 ? r.duration_ms : 0), 0),
        active_days: new Set(runs.map((r) => r.created_at.slice(0, 10))).size,
        favorite: [...passport].sort((a, b) => b.runs - a.runs)[0]?.runs ? [...passport].sort((a, b) => b.runs - a.runs)[0].name : null },
      passport, milestones: badges,
      recent: runs.slice(0, 50).map((r) => ({ id: r.id, park: parkFor(r.course_id).id, park_name: parkFor(r.course_id).name, score: r.score, created_at: r.created_at, duration_ms: r.duration_ms ?? null })),
      earned_pow: badges.filter((b) => b.claimed).reduce((sum, b) => sum + b.reward, 0),
    };
  }
  claim(id, milestoneId) {
    if (this.store.banned(id)) throw fault("Account is not eligible to claim rewards", 403);
    return this.store.transaction(() => {
      const m = this.snapshot(id).milestones.find((m) => m.id === milestoneId);
      if (!m) throw fault("Milestone not found", 404);
      if (!m.ready) throw fault("Finish this milestone before claiming its reward", 409);
      if (!m.claimed) {
        this.economy.ledger(id, m.reward, "milestone", "milestone:" + m.id);
        this.store.put("milestone_rewards", id + ":" + m.id, { player_id: id, milestone: m.id, pow: m.reward, claimed_at: new Date(this.now()).toISOString() });
      }
      return this.snapshot(id);
    });
  }
}
