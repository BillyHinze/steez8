import {
  GRAB_CATALOG, GRAB_SLOT_ACTIONS, GRAB_STORAGE_KEY,
  normalizeGrabLoadout, assignGrab, grabName,
} from "./grab-presets.js";
import { api } from "./mountain-ui.js";
import { t as clientFactory } from "./_next/static/chunks/supabase-BEhtaJUq.js";

const KEYS = ["SHIFT", "Q", "E"];
const FALLBACK_RIDE = "skis";

function activeRide() {
  try {
    const saved = JSON.parse(localStorage.getItem("whiteout-outfit-v1") || "null");
    return saved?.outfit?.ride === "board" ? "board" : FALLBACK_RIDE;
  } catch { return FALLBACK_RIDE; }
}
function localLoadout() {
  try { return normalizeGrabLoadout(JSON.parse(localStorage.getItem(GRAB_STORAGE_KEY) || "null")); }
  catch { return normalizeGrabLoadout(null); }
}
function displayKeys() {
  try {
    const raw = JSON.parse(localStorage.getItem("cork7-controls-v1") || "{}");
    const keys = raw.keys || {};
    return GRAB_SLOT_ACTIONS.map((action, i) => {
      const first = Array.isArray(keys[action]) ? keys[action][0] : null;
      return typeof first === "string"
        ? first.replace(/^Key/, "").replace(/Left$|Right$/, "").replace(/^Shift$/, "SHIFT").toUpperCase()
        : KEYS[i];
    });
  } catch { return [...KEYS]; }
}

export function startGrabStudio() {
  if (window.__steez8GrabStudioStarted) return;
  window.__steez8GrabStudioStarted = true;
  const styles = document.createElement("link");
  styles.rel = "stylesheet";
  styles.href = "/grab-studio.css";
  styles.id = "steez8-grab-styles";
  if (!document.getElementById(styles.id)) document.head.append(styles);

  let state = localLoadout(), ride = activeRide(), chosenSlot = 0;
  let previewPlaying = true, panelOpen = false, controls = null;
  let status = "Saved on this device", failed = false;
  let accountId = null, accountEpoch = 0, editVersion = 0, saveTimer = null;
  let domFrame = 0;
  const client = clientFactory();

  function activate() {
    const equipped = activeRide();
    window.__steez8GrabActiveSlots = [...state[equipped]];
    window.dispatchEvent(new CustomEvent("steez8:grabs-changed", {
      detail: { ride: equipped, slots: [...state[equipped]] },
    }));
  }
  function preview(style = state[ride][chosenSlot]) {
    window.dispatchEvent(new CustomEvent("steez8:preview-grab", {
      detail: { style: panelOpen && previewPlaying ? style : null, ride },
    }));
  }
  function setStatus(text, isError = false) {
    status = text;
    failed = isError;
    const node = controls?.querySelector(".gl-status");
    if (node) {
      node.textContent = text;
      node.classList.toggle("is-error", isError);
    }
  }
  function onEdit() {
    editVersion++;
    try { localStorage.setItem(GRAB_STORAGE_KEY, JSON.stringify(state)); }
    catch { setStatus("Device storage is unavailable; sign in to save.", true); }
    activate();
    setStatus(accountId ? "Syncing grabs to your account…" : "Saved on this device · sign in to sync");
    if (saveTimer) clearTimeout(saveTimer);
    const version = editVersion, user = accountId;
    if (!user) return;
    saveTimer = setTimeout(async () => {
      try {
        await api("/api/grab-loadout", { loadout: state });
        if (accountId === user && version === editVersion) setStatus("Saved to your account ✓");
      } catch (error) {
        if (accountId === user && version === editVersion)
          setStatus("Saved on this device · account sync failed. Edit again to retry.", true);
      }
    }, 450);
  }
  async function onAccount(session) {
    const nextId = session?.user?.id ?? null;
    if (nextId === accountId) return;
    const epoch = ++accountEpoch;
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    accountId = nextId;
    if (!nextId) {
      state = localLoadout();
      activate();
      setStatus("Saved on this device · sign in to sync");
      if (panelOpen) renderPanel();
      return;
    }
    setStatus("Loading your saved grabs…");
    const originalEdit = editVersion;
    try {
      const saved = await api("/api/grab-loadout");
      if (epoch !== accountEpoch || originalEdit !== editVersion) return;
      state = normalizeGrabLoadout(saved.loadout);
      try { localStorage.setItem(GRAB_STORAGE_KEY, JSON.stringify(state)); } catch {}
      activate();
      setStatus("Account loadout loaded ✓");
      if (panelOpen) { renderPanel(); preview(); }
    } catch {
      if (epoch !== accountEpoch) return;
      setStatus("Using this device's grabs · account unavailable", true);
    }
  }

  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  function action(label, callback, className) {
    const button = node("button", label, className);
    button.type = "button";
    button.addEventListener("click", callback);
    return button;
  }
  function renderPanel() {
    const root = controls?.querySelector(":scope > .gl-panel");
    if (!root || !panelOpen) return;
    root.replaceChildren();
    const intro = node("div", undefined, "gl-intro");
    intro.append(node("span", "STEEZ8 / RIDER LAB", "gl-kicker"),
      node("h2", "Your grabs."),
      node("p", "Build a signature three-button setup. Hold the key in the air to grab; release before landing."));
    root.append(intro);
    const tabs = node("div", undefined, "gl-ride-tabs");
    tabs.setAttribute("role", "group");
    tabs.setAttribute("aria-label", "Equipment");
    for (const [value, label] of [["skis", "Skis"], ["board", "Snowboard"]]) {
      const tab = action(label, () => { ride = value; renderPanel(); preview(); });
      tab.setAttribute("aria-pressed", String(ride === value));
      tabs.append(tab);
    }
    root.append(tabs);
    root.append(node("div", "ASSIGN YOUR THREE GRABS", "gl-label"));
    const slots = node("div", undefined, "gl-slots");
    const keys = displayKeys();
    state[ride].forEach((style, index) => {
      const slot = action("", () => { chosenSlot = index; renderPanel(); preview(); }, "gl-slot");
      slot.setAttribute("aria-label", keys[index] + ": " + grabName(style, ride) + ". Select this key.");
      slot.setAttribute("aria-pressed", String(chosenSlot === index));
      slot.append(node("kbd", keys[index], "gl-key"), node("strong", grabName(style, ride)));
      slots.append(slot);
    });
    root.append(slots);
    const scroll = node("div", undefined, "gl-scroll");
    const legend = node("div", undefined, "GRAB LIBRARY · SELECT TO EQUIP", "gl-label");
    scroll.append(legend);
    const grid = node("div", undefined, "gl-grid");
    for (const grab of GRAB_CATALOG) {
      const selected = state[ride][chosenSlot] === grab.id;
      const equipped = state[ride].indexOf(grab.id);
      const card = action("", () => {
        state = assignGrab(state, ride, chosenSlot, grab.id);
        onEdit();
        renderPanel();
        preview(grab.id);
      }, "gl-card");
      card.setAttribute("aria-pressed", String(selected));
      card.setAttribute("aria-label", grab[ride] + ". " + grab.note + (equipped >= 0 ? ". Equipped." : ""));
      card.append(node("small", grab.id < 3 ? "ORIGINAL" : "SIGNATURE"),
        node("strong", grab[ride]),
        node("span", grab.note, "gl-detail"));
      if (equipped >= 0) card.append(node("span", "EQUIPPED · " + keys[equipped], "gl-equipped"));
      grid.append(card);
    }
    scroll.append(grid);
    root.append(scroll);
    const bottom = node("div", undefined, "gl-bottom");
    const controlsRow = node("div", undefined, "gl-preview");
    const previous = action("← Previous", () => {
      const id = (state[ride][chosenSlot] + GRAB_CATALOG.length - 1) % GRAB_CATALOG.length;
      state = assignGrab(state, ride, chosenSlot, id); onEdit(); renderPanel(); preview(id);
    });
    const pause = action(previewPlaying ? "Ⅱ Pause preview" : "▶ Preview", () => {
      previewPlaying = !previewPlaying; renderPanel(); preview();
    });
    const next = action("Next →", () => {
      const id = (state[ride][chosenSlot] + 1) % GRAB_CATALOG.length;
      state = assignGrab(state, ride, chosenSlot, id); onEdit(); renderPanel(); preview(id);
    });
    controlsRow.append(previous, pause, next);
    bottom.append(controlsRow);
    const message = node("p", status, "gl-status" + (failed ? " is-error" : ""));
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
    bottom.append(message);
    root.append(bottom);
  }

  function paint() {
    domFrame = 0;
    const host = document.querySelector(".bc-locker .bc-locker-controls");
    if (!host) { controls = null; return; }
    if (controls !== host) { controls = host; panelOpen = false; }
    if (!host.querySelector(":scope > .gl-bar")) {
      const bar = node("div", undefined, "gl-bar");
      const button = action("CUSTOM GRABS", () => {
        panelOpen = !panelOpen;
        host.classList.toggle("gl-grab-open", panelOpen);
        button.setAttribute("aria-expanded", String(panelOpen));
        if (panelOpen) {
          ride = activeRide();
          chosenSlot = 0;
          if (!host.querySelector(":scope > .gl-panel"))
            host.append(node("section", undefined, "gl-panel"));
          renderPanel(); preview();
        } else {
          host.querySelector(":scope > .gl-panel")?.remove(); preview(null);
        }
      }, "gl-open");
      button.setAttribute("aria-expanded", String(panelOpen));
      button.setAttribute("aria-label", panelOpen ? "Close custom grabs" : "Open custom grabs");
      bar.append(button);
      host.prepend(bar);
    }
    if (panelOpen) {
      host.classList.add("gl-grab-open");
      if (!host.querySelector(":scope > .gl-panel")) {
        host.append(node("section", undefined, "gl-panel"));
        renderPanel(); preview();
      }
    }
    activate();
  }
  function schedule() {
    if (!domFrame) domFrame = requestAnimationFrame(paint);
  }
  activate();
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  schedule();
  const subscription = client.auth.onAuthStateChange?.((_event, session) => {
    queueMicrotask(() => onAccount(session));
  });
  client.auth.getSession().then(({ data }) => onAccount(data.session)).catch(() => {});
  window.addEventListener("storage", event => {
    if (event.key === "whiteout-outfit-v1") activate();
  });
  window.addEventListener("independent-outfit-refresh", activate);
  return () => {
    observer.disconnect();
    if (domFrame) cancelAnimationFrame(domFrame);
    if (saveTimer) clearTimeout(saveTimer);
    subscription?.data?.subscription?.unsubscribe?.();
    window.dispatchEvent(new CustomEvent("steez8:preview-grab", { detail: { style: null } }));
    window.__steez8GrabStudioStarted = false;
  };
}
