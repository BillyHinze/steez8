import { el, button, css, api, message, dialog, heading } from "./mountain-ui.js";
export function openLoadouts() { dialog("Saved looks", mountLoadouts); }
export function mountLoadouts(root) {
  css(); root.classList.add("mt-root"); let disposed = false;
  async function load() { try { const data = await api("/api/loadouts"); if (!disposed) render(data); } catch (e) { if (!disposed) message(root, e.message, true); } }
  function render(data) {
    root.replaceChildren(); heading(root, "YOUR LOCKER · SAVED LOOKS", "A look for every line.", "Keep three complete outfits. Switch from your park setup to your race kit in one click.");
    const body = el("div", undefined, "mt-body"); message(body, "Choose your equipment in the Locker and wait for Saved, then store your current look below. Equipping a saved look uses the items you currently own.");
    for (const slot of data.slots) {
      const card = el("section", undefined, "mt-card"), input = el("input"); input.maxLength = 24; input.value = slot.name; input.setAttribute("aria-label", "Name for look " + slot.slot); input.style.cssText = "width:100%;padding:10px;border:1px solid #cad5ce;border-radius:8px;font:700 15px 'DM Sans',sans-serif";
      card.style.margin = "14px 0"; card.append(el("small", "LOOK 0" + slot.slot, "mt-eyebrow"), input);
      message(card, slot.outfit ? (slot.outfit.ride === "board" ? "Snowboard setup" : "Ski setup") + " · Saved " + new Date(slot.saved_at).toLocaleDateString() : "An empty slot, ready for your next look.");
      const actions = el("div", undefined, "mt-toolbar");
      const save = button(slot.outfit ? "Replace with current look" : "Save current look", async () => {
        save.disabled = true;
        try { const next = await api("/api/loadouts", { action: "save", slot: slot.slot, name: input.value }); if (!disposed) { render(next); message(root, "Look saved."); } }
        catch (e) { message(card, e.message, true); save.disabled = false; }
      }, "mt-button secondary");
      const equip = button("Equip look", async () => {
        equip.disabled = true;
        try { const next = await api("/api/loadouts", { action: "equip", slot: slot.slot }); window.dispatchEvent(new Event("independent-outfit-refresh")); if (!disposed) { render(next); message(root, slot.name + " equipped. Your Locker and rider are updating."); } }
        catch (e) { message(card, e.message, true); equip.disabled = false; }
      }); equip.disabled = !slot.outfit; actions.append(save, equip); card.append(actions); body.append(card);
    }
    root.append(body);
  }
  message(root, "Opening your saved looks…"); load(); return () => { disposed = true; };
}
