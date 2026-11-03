import { t as clientFactory } from "./_next/static/chunks/supabase-BEhtaJUq.js";
const client = clientFactory();
export function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
export const number = (n) => Math.round(n ?? 0).toLocaleString();
export const time = (ms) => `${Math.floor(ms / 60000)}:${((ms % 60000) / 1000).toFixed(2).padStart(5, "0")}`;
export function button(label, action, className = "mt-button") {
  const node = el("button", label, className); node.type = "button";
  node.addEventListener("click", action); return node;
}
export function css() {
  if (document.querySelector("#mountain-styles")) return;
  const link = el("link"); link.id = "mountain-styles"; link.rel = "stylesheet"; link.href = "/mountain.css"; document.head.append(link);
}
export async function api(path, body) {
  const { data: { session } } = await client.auth.getSession();
  if (!session) throw Error("Sign in at Basecamp to start your mountain story.");
  const response = await fetch(path, { method: body ? "POST" : "GET", headers: { authorization: "Bearer " + session.access_token, ...(body ? { "content-type": "application/json" } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json();
  if (!response.ok) throw Error(data.error || "Could not connect. Please try again.");
  return data;
}
export function message(root, text, error = false) {
  const note = el("p", text, error ? "mt-error" : "mt-muted");
  note.setAttribute("role", error ? "alert" : "status"); root.append(note); return note;
}
export function dialog(title, mount) {
  if (document.querySelector(".mt-backdrop")) return;
  // Open the existing game menu first so riding is paused behind the panel.
  if (!document.querySelector('[aria-label="Basecamp lobby"]') && !document.querySelector('[aria-labelledby="game-menu-title"]')) document.querySelector('button[aria-label="Game menu"],button[aria-label^="Open menu"]')?.click();
  css();
  const previous = document.activeElement, backdrop = el("div", undefined, "mt-backdrop"), panel = el("section", undefined, "mt-panel"), root = el("div", undefined, "mt-root");
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-label", title);
  const close = button("×", dismiss, "mt-close"); close.setAttribute("aria-label", "Close " + title);
  let cleanup;
  function dismiss() { cleanup?.(); backdrop.remove(); window.removeEventListener("keydown", keys, true); previous?.focus?.(); }
  function keys(e) {
    if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); dismiss(); }
    if (e.key === "Tab") {
      const items = [...panel.querySelectorAll('button:not(:disabled),a[href],select,input,[tabindex="0"]')];
      const first = items[0], last = items.at(-1);
      if (e.shiftKey && document.activeElement === first || !e.shiftKey && document.activeElement === last) { e.preventDefault(); (e.shiftKey ? last : first)?.focus(); }
    }
  }
  backdrop.addEventListener("pointerdown", (e) => { if (e.target === backdrop) dismiss(); });
  panel.append(close, root); backdrop.append(panel); document.body.append(backdrop);
  window.addEventListener("keydown", keys, true); cleanup = mount(root); close.focus();
}
export function tabs(labels, selected, change) {
  const nav = el("nav", undefined, "mt-tabs"); nav.setAttribute("aria-label", "View");
  for (const label of labels) { const b = button(label, () => change(label), label === selected ? "is-active" : ""); b.setAttribute("aria-pressed", String(label === selected)); nav.append(b); }
  return nav;
}
export function heading(root, eyebrow, title, description) {
  const header = el("header", undefined, "mt-header"); header.append(el("small", eyebrow, "mt-eyebrow"), el("h2", title), el("p", description)); root.append(header);
}
