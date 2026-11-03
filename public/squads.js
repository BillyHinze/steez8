import { el, button, css, api, message, dialog, tabs, heading, number } from "./mountain-ui.js";
export function openSquads() { dialog("Ranked Squads", mountSquads); }
export function mountSquads(root) {
  css(); root.classList.add("mt-root");
  let selected = "Play", size = "3v3", data, disposed = false, busy = false, fingerprint = "", confirmLeave = false;
  async function load(force = false) {
    if (busy || disposed) return;
    busy = true;
    try {
      const next = await api("/api/squads");
      const signature = JSON.stringify({ queue: next.queue, match: next.match, standings: next.standings, party: next.party, break_until: next.break_until });
      data = next;
      if (!disposed && (force || signature !== fingerprint)) { fingerprint = signature; render(); }
    } catch (e) {
      if (!disposed && !data) { root.replaceChildren(); heading(root, "MORE RIDERS. BIGGER LINES.", "Ranked Squads", "Real 3v3 and 4v4 matches on Apex."); const body = el("div", undefined, "mt-body"); message(body, e.message, true); body.append(Object.assign(el("a", "Sign in at Basecamp", "mt-button"), { href: "/" })); root.append(body); }
      else if (!disposed) { const old = root.querySelector(".mt-connection"); if (!old) { const note = message(root, "Connection lost. Reconnecting…", true); note.classList.add("mt-connection"); } }
    } finally { busy = false; }
  }
  async function act(path, body) {
    if (busy) return; busy = true;
    try { data = await api(path, body); confirmLeave = false; if (!disposed) render(); }
    catch (e) { if (!disposed) message(root, e.message, true); }
    finally { busy = false; }
  }
  function render() {
    root.replaceChildren();
    heading(root, "RANKED SQUADS · 3V3 + 4V4", "Bring the whole crew.", "One Apex run each. Ride at the same time. Biggest team total wins.");
    const body = el("div", undefined, "mt-body"); body.append(tabs(["Play", "Rankings"], selected, (s) => { selected = s; render(); }));
    const formats = el("div", undefined, "mt-toolbar");
    for (const s of ["3v3", "4v4"]) { const b = button(s.toUpperCase(), () => { size = s; render(); }, "mt-button" + (size === s ? "" : " secondary")); b.setAttribute("aria-pressed", String(size === s)); formats.append(b); }
    const standing = data.standings[size].me; formats.append(el("small", number(standing.rating) + " rating · " + standing.games + " games · " + standing.wins + " wins", "mt-muted")); body.append(formats);
    if (selected === "Rankings") {
      const rows = data.standings[size].top;
      message(body, "Complete five matches to place on this format’s leaderboard. Your 1v1 and 2v2 ratings are separate.");
      if (!rows.length) body.append(el("p", "The first squad season starts with you. No placed riders yet.", "mt-empty"));
      else {
        const table = el("table", undefined, "mt-table"), head = el("tr"); ["Place", "Rider", "Games", "Rating"].forEach((t) => head.append(el("th", t))); const thead = el("thead"); thead.append(head); table.append(thead);
        const tbody = el("tbody"); rows.forEach((r, i) => { const row = el("tr"); [i + 1, r.handle + (r.you ? " · YOU" : ""), r.games, r.rating].forEach((t) => row.append(el("td", t))); tbody.append(row); }); table.append(tbody); body.append(table);
      }
    } else {
      const m = data.match;
      if (m && ["ready", "riding"].includes(m.phase)) {
        const card = el("section", undefined, "mt-session-active"), you = m.players.find((p) => p.you);
        card.append(el("small", m.size.toUpperCase() + " · APEX", "mt-eyebrow"), el("h3", m.phase === "ready" ? "Match found. Crew ready?" : "Your team’s line is live."));
        if (m.phase === "ready") {
          card.append(el("p", m.players.filter((p) => p.ready).length + "/" + m.players.length + " riders ready · Confirm within 60 seconds."));
          const ready = button(you.ready ? "Ready ✓ Waiting for the crew" : "I’m ready", () => act("/api/squads/ready", { id: m.id })); ready.disabled = you.ready; card.append(ready);
        } else {
          card.append(el("p", "Finish a fresh solo Apex run before " + new Date(m.deadline).toLocaleTimeString() + ". Reopen Squads to see everyone’s progress. Leaving the page does not cancel the match."));
          if (you.status === "riding") card.append(button("Drop into Apex ↗", () => location.assign("/?park=apex&mode=solo")));
          else card.append(el("strong", you.status === "finished" ? "Your verified score: " + number(you.score) + " · Waiting for teammates" : "You forfeited this run."));
        }
        card.append(el("div", `${number(m.totals[0])} : ${number(m.totals[1])}`, "mt-result")); body.append(card); teams(body, m);
        if (m.phase === "ready" || you.status === "riding") body.append(button(confirmLeave ? "Confirm leave · short ranked break applies" : "Leave match", () => { if (confirmLeave) act("/api/squads/leave", { id: m.id }); else { confirmLeave = true; render(); } }, "mt-button secondary"));
      } else if (data.queue) {
        const card = el("section", undefined, "mt-session-active"); card.append(el("small", "SEARCHING " + data.queue.size.toUpperCase(), "mt-eyebrow"), el("h3", data.queue.searching + " real riders in queue"), el("p", "Your crew: " + data.queue.members.join(", ") + ". Keep Squads open while searching; everyone gets a ready check when a match is found."), button("Cancel search", () => act("/api/squads/queue", { cancel: true }), "mt-button secondary")); body.append(card);
      } else {
        if (m) { const card = el("section", undefined, "mt-featured"), you = m.players.find((p) => p.you), result = you.result;
          card.append(el("strong", m.void ? "Match cancelled" : m.winner === "draw" ? "A team draw" : m.winner === m.you ? "Your crew wins!" : "Next run, new chance."));
          card.append(el("p", m.reason || `${number(m.totals[0])} : ${number(m.totals[1])} · ${result?.outcome === "forgiven" ? "Rating protected: a teammate left." : "Your rating: " + (result?.rating ?? "—") + " (" + ((result?.delta ?? 0) >= 0 ? "+" : "") + (result?.delta ?? 0) + ")"}`)); body.append(card); teams(body, m); }
        const card = el("div", undefined, "mt-card"); card.append(el("h3", size === "3v3" ? "Three riders. One team." : "Four riders. Full send."), el("p", "Queue solo and find a crew, or queue with a party of up to " + size[0] + ". Your party stays on the same side. Every player gets one complete Apex run and the team scores are added together."));
        if (data.party?.count > 1) message(card, "Party of " + data.party.count + ". " + (data.party.leader ? "Ask your crew to open Squads, then start the search." : "Your party leader starts the search for everyone."));
        const cooling = data.break_until > data.now; if (cooling) message(card, "Ranked break until " + new Date(data.break_until).toLocaleTimeString() + ".");
        const join = button("Find ranked " + size.toUpperCase(), () => act("/api/squads/queue", { size })); join.disabled = cooling || data.party?.count > 1 && !data.party.leader; card.append(join); body.append(card);
      }
      message(body, "Teams have separate ratings for 3v3 and 4v4. Party rating spread: 500 maximum. Ready check: 60 seconds. Run window: 6 minutes. A missed ready check gives a 1-minute break; an unfinished or forfeited run gives a 5-minute break. A losing teammate who stayed receives rating protection. No bots or cash entry fees.");
    }
    body.append(button("Refresh", () => load(true), "mt-button secondary")); root.append(body);
  }
  function teams(root, m) {
    const grid = el("div", undefined, "mt-grid"); grid.style.marginBottom = "20px";
    for (const side of ["L", "R"]) { const card = el("div", undefined, "mt-card"); card.append(el("h3", side === m.you ? "Your crew" : "Other crew"));
      for (const p of m.players.filter((p) => p.side === side)) { const row = el("div", undefined, "mt-toolbar"); row.append(el("strong", p.handle + (p.you ? " · YOU" : "")), el("small", m.phase === "ready" ? p.ready ? "READY ✓" : "Confirming…" : p.status === "finished" ? number(p.score) + " pts ✓" : p.status === "forfeit" ? "FORFEIT" : "RIDING", "mt-muted")); card.append(row); } grid.append(card);
    } root.append(grid);
  }
  message(root, "Connecting to the crew…"); load(true); const timer = setInterval(() => load(), 2500); return () => { disposed = true; clearInterval(timer); };
}
export function startSquadHUD() {
  css(); let hud, busy = false;
  async function update() {
    if (busy || document.hidden) return; busy = true;
    try { const data = await api("/api/squads"), m = data.match;
      if (!m || !["ready", "riding"].includes(m.phase)) { hud?.remove(); hud = null; return; }
      if (!hud) { hud = button("", openSquads, "mt-session-hud mt-squad-hud"); document.body.append(hud); }
      hud.replaceChildren(el("b", "RANKED " + m.size.toUpperCase() + " · " + (m.phase === "ready" ? "READY CHECK" : "APEX")), el("span", m.phase === "ready" ? "Your crew is waiting. Confirm now." : `${number(m.totals[0])} : ${number(m.totals[1])} · ${m.players.filter((p) => p.status === "finished").length}/${m.players.length} finishes`), el("br"), el("small", "Open squad scoreboard ↗"));
    } catch { hud?.remove(); hud = null; } finally { busy = false; }
  }
  update(); const timer = setInterval(update, 4000); window.addEventListener("pagehide", () => clearInterval(timer), { once: true });
}
if (document.querySelector("#ranked-squads")) mountSquads(document.querySelector("#ranked-squads"));
