import { normalizeGrabLoadout, validGrabLoadout } from "../public/grab-presets.js";

const fail = (message, status = 400) => Object.assign(new Error(message), { status });

export class GrabLoadouts {
  constructor(store) { this.store = store; }

  snapshot(userId) {
    // Keep each account's choices separate. No client-submitted user ID is trusted.
    const saved = this.store.get("player_grab_loadouts", userId);
    return {
      loadout: normalizeGrabLoadout(saved?.loadout),
      updated_at: saved?.updated_at || null,
    };
  }

  save(userId, payload) {
    if (!validGrabLoadout(payload?.loadout))
      throw fail("Choose three different valid grabs for skis and three for snowboard");
    const saved = {
      user_id: userId,
      loadout: normalizeGrabLoadout(payload.loadout),
      updated_at: new Date().toISOString(),
    };
    this.store.put("player_grab_loadouts", userId, saved);
    return this.snapshot(userId);
  }
}
