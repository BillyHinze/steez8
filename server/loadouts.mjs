import { N as validate, i as defaults } from "../public/_next/static/chunks/rider-appearance-Cs5aq3V7.js";
const fault = (message, status = 400) => Object.assign(Error(message), { status });
export function equippedOutfit(store, id, value) {
  const normalized = validate(value);
  if (!normalized) throw fault("Choose a valid outfit in the Locker first");
  const account = store.account(id), grants = new Set(account.items), best = Number(account.best) || 0;
  for (const [key, value] of Object.entries(normalized)) {
    const item = store.economy.items.get(value);
    if (item && !grants.has(value) && !(typeof item.unlock?.score === "number" && best >= item.unlock.score)) normalized[key] = defaults[key];
  }
  return normalized;
}
export class Loadouts {
  constructor(store) { this.store = store; }
  snapshot(id) {
    return { slots: [1, 2, 3].map((slot) => { const row = this.store.get("outfit_loadouts", id + ":" + slot); return { slot, name: row?.name ?? "Look " + slot, outfit: row?.outfit ?? null, saved_at: row?.saved_at ?? null }; }) };
  }
  action(id, body) {
    if (![1, 2, 3].includes(body.slot)) throw fault("Choose a loadout slot from 1 to 3");
    const key = id + ":" + body.slot;
    if (body.action === "save") {
      const value = this.store.get("player_outfits", id)?.outfit;
      const outfit = equippedOutfit(this.store, id, value);
      const name = typeof body.name === "string" ? body.name.trim().slice(0, 24) : "";
      this.store.put("outfit_loadouts", key, { player_id: id, name: name || "Look " + body.slot, outfit, saved_at: new Date().toISOString() });
    } else if (body.action === "equip") {
      const saved = this.store.get("outfit_loadouts", key);
      if (!saved) throw fault("Save a look in this slot first", 404);
      const outfit = equippedOutfit(this.store, id, saved.outfit);
      this.store.put("player_outfits", id, { player_id: id, outfit, updated_at: new Date().toISOString() });
      this.store.outfitChanged?.(id, outfit);
    } else throw fault("Unknown loadout action");
    return this.snapshot(id);
  }
}
