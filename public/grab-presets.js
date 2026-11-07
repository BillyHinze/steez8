// STEEZ8 Grab Studio: stable grab IDs shared by browser, multiplayer physics and API.
// IDs 0-2 are the original grabs. Never renumber them: recorded runs use these IDs.
export const GRAB_CATALOG = Object.freeze([
  { id: 0, skis: "Mute", board: "Weddle", family: "mute", note: "Classic cross-body grab, held close to the bindings." },
  { id: 1, skis: "Tail", board: "Nose", family: "tail", note: "Reach back for the tip and hold through the spin." },
  { id: 2, skis: "Japan", board: "Method", family: "japan", note: "Bend into a stylish arched grab." },
  { id: 3, skis: "Safety", board: "Indy", family: "mute", note: "Clean, compact grab beside the boot." },
  { id: 4, skis: "Blunt", board: "Stalefish", family: "tail", note: "Pull the ski or board back with a deeper shoulder turn." },
  { id: 5, skis: "Rocket Air", board: "Melon", family: "tail", note: "Extend the legs for a straight, floating silhouette." },
  { id: 6, skis: "True Nose", board: "Tailfish", family: "japan", note: "Fold toward the tip with a sharp knee tuck." },
  { id: 7, skis: "Back Scratcher", board: "Seatbelt", family: "japan", note: "Bring the tips back into a compact arched pose." },
]);
export const GRAB_SLOT_ACTIONS = Object.freeze(["mute", "tail", "japan"]);
export const DEFAULT_GRAB_LOADOUT = Object.freeze({
  skis: Object.freeze([0, 1, 2]),
  board: Object.freeze([0, 1, 2]),
});
export const GRAB_STORAGE_KEY = "steez8-grab-loadout-v1";
export const MAX_GRAB_STYLE = GRAB_CATALOG.length - 1;

export function validGrabSlots(slots) {
  return Array.isArray(slots) && slots.length === 3 &&
    slots.every(id => Number.isInteger(id) && id >= 0 && id <= MAX_GRAB_STYLE) &&
    new Set(slots).size === 3;
}
export function validGrabLoadout(loadout) {
  return !!loadout && typeof loadout === "object" && !Array.isArray(loadout) &&
    validGrabSlots(loadout.skis) && validGrabSlots(loadout.board);
}
export function normalizeGrabLoadout(value) {
  return {
    skis: validGrabSlots(value?.skis) ? [...value.skis] : [...DEFAULT_GRAB_LOADOUT.skis],
    board: validGrabSlots(value?.board) ? [...value.board] : [...DEFAULT_GRAB_LOADOUT.board],
  };
}
export function assignGrab(loadout, ride, slot, style) {
  if (!["skis", "board"].includes(ride) ||
      !Number.isInteger(slot) || slot < 0 || slot > 2 ||
      !Number.isInteger(style) || style < 0 || style > MAX_GRAB_STYLE)
    throw RangeError("Choose a valid grab and a slot from 1 to 3");
  const next = normalizeGrabLoadout(loadout);
  const previousSlot = next[ride].indexOf(style);
  if (previousSlot !== -1 && previousSlot !== slot)
    next[ride][previousSlot] = next[ride][slot];
  next[ride][slot] = style;
  return next;
}
export function grabName(style, ride = "skis") {
  return GRAB_CATALOG[style]?.[ride === "board" ? "board" : "skis"] || GRAB_CATALOG[0].skis;
}
