import { el, button, css, api, message, dialog, tabs, heading, number, time } from "./mountain-ui.js";
export function openSessions() { dialog("Mountain Sessions", mountSessions); }
const score = (session) => session.mode === "air-time" ? (session.value / 1000).toFixed(2) + " s airborne" : ["time-attack", "park-tour"].includes(session.mode) ? time(session.value) : number(session.value) + " pts";
const ride = (park) => location.assign("/?park=" + encodeURIComponent(park) + "&mode=solo");
export function mountSessions(root) {
  css(); root.classList.add("mt-root");
  let data, selected = "Play", park = "apex", boardMode = "time-attack", disposed = false, pending = false, boardGeneration = 0;
  async function load() {
    try { data = await api("/api/sessions"); if (!disposed) render(); }
    catch (e) { if (!disposed) { root.replaceChildren(); heading(root, "THE MOUNTAIN IS YOUR PLAYGROUND", "Mountain Sessions", "Six new ways to ride. No queues. Just you and the mountain."); const body = el("div", undefined, "mt-body"); message(body, e.message, true); body.append(button("Try again", load), Object.assign(el("a", "Back to Basecamp", "mt-button secondary"), { href: "/" })); root.append(body); } }
  }
  async function action(path, body, launch = false) {
    if (pending) return; pending = true;
    try { data = await api(path, body); if (disposed) return; if (launch && data.active) ride(data.active.next_park); else render(); }
    catch (e) { if (!disposed) message(root, e.message, true); }
    finally { pending = false; }
  }
  function selectPark(toolbar) {
    const select = el("select"); select.setAttribute("aria-label", "Choose park");
    for (const p of data.parks) { const option = el("option", p.name); option.value = p.id; select.append(option); }
    select.value = park; select.addEventListener("change", () => { park = select.value; render(); }); toolbar.append(select);
  }
  function render() {
    root.replaceChildren(); boardGeneration++;
    heading(root, "MOUNTAIN SESSIONS · UPDATE 0.4", "Pick your next obsession.", "Six ways to ride. Personal bests to chase. Every result verified.");
    const body = el("div", undefined, "mt-body"); body.append(tabs(["Play", "Leaderboards", "My sessions"], selected, (s) => { selected = s; render(); }));
    if (selected === "Play") {
      if (data.active) {
        const s = data.active, mode = data.modes.find((m) => m.id === s.mode), card = el("section", undefined, "mt-session-active");
        card.append(el("small", "SESSION IN PROGRESS", "mt-eyebrow"), el("h3", mode.name), el("div", s.runs.length ? score(s) : "Your line starts here.", "mt-result"), el("p", s.notice));
        const remaining = el("p"); remaining.dataset.expires = s.expires_at; card.append(remaining);
        if (s.mode === "park-tour") { const route = el("div", undefined, "mt-route"); for (const [i, p] of data.parks.entries()) route.append(el("span", (i < s.runs.length ? "✓ " : "") + p.name, i < s.runs.length ? "done" : "")); card.append(route); }
        const actions = el("div", undefined, "mt-toolbar"); actions.append(button("Ride " + data.parks.find((p) => p.id === s.next_park)?.name + " ↗", () => ride(s.next_park)));
        if (s.mode === "score-rush" && s.runs.length) actions.append(button("Bank this session", () => action("/api/sessions/end", { id: s.id }), "mt-button secondary"));
        actions.append(button("Abandon session", () => {
          actions.replaceChildren(button("Keep riding", render), button("Confirm abandon", () => action("/api/sessions/end", { id: s.id, abandon: true }), "mt-button secondary"));
        }, "mt-button secondary")); card.append(actions); body.append(card);
      } else if (data.history[0]) {
        const last = data.history[0], card = el("div", undefined, "mt-featured");
        card.textContent = data.modes.find((m) => m.id === last.mode).name + " · " + (last.status === "complete" ? "Finished — " + score(last) : last.status === "failed" ? "Clean line broken. Reset, breathe, go again." : "Session " + last.status); body.append(card);
      }
      const toolbar = el("div", undefined, "mt-toolbar"); toolbar.append(el("strong", "Choose your mountain")); selectPark(toolbar); body.append(toolbar);
      const featured = el("div", undefined, "mt-featured"); featured.append(el("span", "Today’s park pick: " + data.featured.name + " · A fresh recommendation every UTC day. "), button("Pick it", () => { park = data.featured.id; render(); }, "mt-button secondary")); body.append(featured);
      const grid = el("div", undefined, "mt-grid");
      for (const [i, m] of data.modes.entries()) {
        const card = el("article", undefined, "mt-card"); card.append(el("small", "0" + (i + 1) + " / " + m.tag, "mt-eyebrow"), el("h3", m.name), el("p", m.description));
        const best = data.bests.find((b) => b.mode === m.id && b.park === (m.id === "park-tour" ? "all" : park));
        card.append(el("small", best ? "PERSONAL BEST · " + score(best) : "A new personal best is waiting.", "mt-muted"), el("br"));
        const start = button("Start " + m.name + " ↗", () => action("/api/sessions/start", { mode: m.id, park }, true)); start.disabled = !!data.active; card.append(start); grid.append(card);
      }
      body.append(grid); message(body, "Solo sessions use the current park physics. Start from the top after activating a mode. Only new, fully finished and verified runs count; ranked and cup runs do not. Timers continue while paused or offline. Session scores do not award POW.");
    } else if (selected === "Leaderboards") {
      const toolbar = el("div", undefined, "mt-toolbar"), select = el("select"); select.setAttribute("aria-label", "Leaderboard mode");
      for (const m of data.modes) { const option = el("option", m.name); option.value = m.id; select.append(option); } select.value = boardMode; select.addEventListener("change", () => { boardMode = select.value; render(); }); toolbar.append(select); if (boardMode !== "park-tour") selectPark(toolbar); body.append(toolbar);
      const board = el("div"); message(board, "Loading the mountain’s best…"); body.append(board); const generation = boardGeneration;
      api("/api/sessions/board?mode=" + boardMode + "&park=" + (boardMode === "park-tour" ? "all" : park)).then((rows) => {
        if (disposed || generation !== boardGeneration) return; board.replaceChildren();
        if (!rows.length) board.append(el("p", "Fresh tracks. Finish a session to put the first result on this board.", "mt-empty"));
        else table(board, ["Rank", "Rider", "Best result"], rows.map((r) => ["#" + r.rank, r.handle, score(r)]));
      }).catch((e) => { if (!disposed && generation === boardGeneration) { board.replaceChildren(); message(board, e.message, true); } });
      message(body, "One best result per rider, per mode and park. Fastest time wins Time Attack and Park Tour; highest score wins Score Rush, Clean Line and Rail Jam; most airtime wins Air Time. Ties favour the earlier result.");
    } else {
      if (!data.history.length) body.append(el("p", "No sessions yet. Pick a mode and make your first mark.", "mt-empty"));
      else table(body, ["Mode / park", "When", "Status", "Result"], data.history.map((s) => [data.modes.find((m) => m.id === s.mode).name + " / " + (s.park === "all" ? "All parks" : data.parks.find((p) => p.id === s.park)?.name), new Date(s.started_at).toLocaleDateString(), s.status, s.runs.length ? score(s) : "—"]));
      message(body, "Your latest 20 sessions. Complete results stay on your personal-best record.");
    }
    body.append(button("Refresh sessions", load, "mt-button secondary")); root.append(body); tick();
  }
  function table(root, headings, rows) {
    const wrap = el("div", undefined, "mt-table-wrap"), table = el("table", undefined, "mt-table"), head = el("thead"), tr = el("tr"), body = el("tbody");
    headings.forEach((h) => tr.append(el("th", h))); head.append(tr); rows.forEach((values) => { const r = el("tr"); values.forEach((v) => r.append(el("td", v))); body.append(r); }); table.append(head, body); wrap.append(table); root.append(wrap);
  }
  function tick() {
    for (const e of root.querySelectorAll("[data-expires]")) { const remaining = Math.max(0, Number(e.dataset.expires) - Date.now()); e.textContent = remaining ? Math.ceil(remaining / 60000) + " min left · " + (data?.active?.runs.length || 0) + " verified finishes" : "Session time ended. Refresh to see your result."; }
  }
  message(root, "Opening Mountain Sessions…"); load(); const timer = setInterval(tick, 1000);
  return () => { disposed = true; clearInterval(timer); };
}
export function startSessionHUD() {
  css(); let hud, previousId, previousStatus, busy = false, dismissed = null;
  async function update() {
    if (busy || document.hidden) return; busy = true;
    try {
      const data = await api("/api/sessions"), latest = data.active || data.history[0];
      if (!latest || latest.status === "abandoned" || latest.id === dismissed || (!data.active && Date.now() - latest.finished_at > 120000)) { hud?.remove(); hud = null; return; }
      if (!hud) { hud = button("", openSessions, "mt-session-hud"); document.body.append(hud); }
      const name = data.modes.find((m) => m.id === latest.mode).name;
      hud.replaceChildren(el("b", name + (data.active ? " · LIVE" : " · " + latest.status.toUpperCase())), el("span", latest.runs.length ? score(latest) + " · " + latest.runs.length + " finishes" : "Start a fresh run from the top"), el("br"), el("small", data.active ? (latest.mode === "park-tour" ? "Next: " + data.parks.find((p) => p.id === latest.next_park)?.name : Math.max(0, Math.ceil((latest.expires_at - data.now) / 60000)) + " min left") + " · View session ↗" : "View your result ↗"));
      if (latest.id === previousId && previousStatus === "active" && latest.status === "complete") hud.setAttribute("role", "status");
      previousId = latest.id; previousStatus = latest.status;
    } catch { hud?.remove(); hud = null; }
    finally { busy = false; }
  }
  update(); const timer = setInterval(update, 6000);
  window.addEventListener("focus", update); window.addEventListener("pagehide", () => { clearInterval(timer); window.removeEventListener("focus", update); }, { once: true });
}
if (document.querySelector("#mountain-sessions")) mountSessions(document.querySelector("#mountain-sessions"));
