import { parks } from "./journal.mjs";
const definitions = [
  { id: "laps", title: "Get some laps in", description: "Finish three runs today.", target: 3, reward: 25 },
  { id: "flow", title: "Find your flow", description: "Score at least 5,000 points in one run today.", target: 5000, reward: 50 },
  { id: "explore", title: "Explore the mountain", description: "Finish runs in two different parks today.", target: 2, reward: 25 },
];
const weekly = [
  { id: "weekly-laps", title: "The long session", description: "Finish 20 runs this week.", target: 20, reward: 100 },
  { id: "weekly-explore", title: "Mountain collector", description: "Finish a run in all five parks this week.", target: 5, reward: 125 },
  { id: "weekly-days", title: "Keep coming back", description: "Finish runs on three different UTC days this week.", target: 3, reward: 75 },
];
const fault = (message, status = 400) => Object.assign(Error(message), { status });
export class Challenges {
  constructor(store, economy, { clock = Date.now } = {}) { this.store = store; this.economy = economy; this.now = clock; }
  snapshot(id) {
    const now = this.now(), day = new Date(now).toISOString().slice(0, 10), midnight = Date.parse(day + "T00:00:00Z"), weekStart = midnight - ((new Date(midnight).getUTCDay() + 6) % 7) * 86400000, week = new Date(weekStart).toISOString().slice(0, 10);
    const parkOf = r => parks.find(p => new RegExp("^" + p.id + "-v[0-9]+$").test(r.course_id))?.id;
    const all = this.store.rows("completed_runs").filter(r => r.player_id === id && r.verified === true && Number.isFinite(r.score) && r.score >= 0 && Number.isFinite(r.duration_ms) && r.duration_ms > 0 && Date.parse(r.created_at) <= now && parkOf(r));
    const runs = all.filter(r => r.created_at.slice(0, 10) === day), weekRuns = all.filter(r => Date.parse(r.created_at) >= weekStart);
    const counts = { laps: runs.length, flow: runs.reduce((best, r) => Math.max(best, r.score), 0), explore: new Set(runs.map(parkOf)).size, "weekly-laps": weekRuns.length, "weekly-explore": new Set(weekRuns.map(parkOf)).size, "weekly-days": new Set(weekRuns.map(r => r.created_at.slice(0, 10))).size };
    const goals = (list, period, collection) => list.map(goal => ({ ...goal, progress: Math.min(goal.target, counts[goal.id]), claimed: !!this.store.get(collection, id + ":" + period + ":" + goal.id), ready: counts[goal.id] >= goal.target }));
    return { day, week, resets_at: new Date(midnight + 86400000).toISOString(), weekly_resets_at: new Date(weekStart + 7 * 86400000).toISOString(), balance: this.store.balance(id), goals: goals(definitions, day, "daily_rewards"), weekly_goals: goals(weekly, week, "weekly_rewards") };
  }
  claim(id, goalId) {
    if (this.store.banned(id)) throw fault("Account is not eligible to claim rewards", 403);
    return this.store.transaction(() => {
      const snapshot = this.snapshot(id), isWeekly = weekly.some(g => g.id === goalId), goal = [...snapshot.goals, ...snapshot.weekly_goals].find(g => g.id === goalId), period = isWeekly ? snapshot.week : snapshot.day;
      if (!goal) throw fault("Goal not found", 404);
      if (!goal.ready) throw fault("Finish this goal before claiming its reward", 409);
      if (!goal.claimed) {
        this.economy.ledger(id, goal.reward, "challenge", "challenge:" + period + ":" + goal.id);
        this.store.put(isWeekly ? "weekly_rewards" : "daily_rewards", id + ":" + period + ":" + goal.id, { player_id: id, day: period, goal: goal.id, pow: goal.reward, claimed_at: new Date(this.now()).toISOString() });
      }
      return { ...this.snapshot(id), claimed: goal.id };
    });
  }
}
