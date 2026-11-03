import { el, button, css, api, message, dialog, tabs, heading, number, time } from "./mountain-ui.js";
export function openJournal() { dialog("Mountain journal", mountJournal); }
export function mountJournal(root) {
  css(); root.classList.add("mt-root");
  let data, selected = "Passport", park = "all", disposed = false;
  async function load() {
    try { data = await api("/api/journal"); if (!disposed) render(); }
    catch (e) { if (!disposed) { root.replaceChildren(); heading(root, "YOUR MOUNTAIN STORY", "Mountain journal", "Every lap leaves a mark."); const body = el("div", undefined, "mt-body"); message(body, e.message, true); body.append(button("Try again", load), Object.assign(el("a", "Back to Basecamp", "mt-button secondary"), { href: "/" })); root.append(body); } }
  }
  function render() {
    root.replaceChildren();
    heading(root, "MOUNTAIN JOURNAL · " + data.rider, "Every lap leaves a mark.", "Your parks, personal bests and milestones. Past verified runs count too.");
    const body = el("div", undefined, "mt-body");
    body.append(tabs(["Passport", "Milestones", "Run history"], selected, (s) => { selected = s; render(); }));
    if (selected === "Passport") {
      const stats = el("div", undefined, "mt-stats");
      for (const [value, label] of [[number(data.totals.runs), "Finished runs"], [number(data.totals.best), "Best score"], [data.totals.parks + "/" + data.passport.length, "Parks stamped"], [number(data.totals.active_days), "Days on snow"]]) {
        const stat = el("div", undefined, "mt-stat"); stat.append(el("strong", value), el("small", label)); stats.append(stat);
      }
      body.append(stats);
      const title = el("div", undefined, "mt-section-title"); title.append(el("h3", "Your park passport"), el("small", "Finish a run. Collect a stamp.", "mt-muted")); body.append(title);
      const passport = el("div", undefined, "mt-passport");
      for (const [i, p] of data.passport.entries()) {
        const stamp = el("article", undefined, "mt-stamp" + (p.runs ? " is-earned" : ""));
        stamp.append(el("div", String(i + 1).padStart(2, "0"), "mt-mark"), el("strong", p.name), el("small", p.runs ? number(p.runs) + " runs · PB " + number(p.best) : "Not stamped yet"), el("small", p.runs ? "Since " + new Date(p.first_visit).toLocaleDateString() : p.terrain)); passport.append(stamp);
      }
      body.append(passport);
      message(body, "Favourite park: " + (data.totals.favorite || "Your next adventure") + " · Recorded riding time: " + time(data.totals.riding_ms));
      const earned = data.milestones.filter((m) => m.claimed).length, ready = data.milestones.filter((m) => m.ready && !m.claimed).length;
      body.append(button(ready ? `${ready} milestone reward${ready === 1 ? "" : "s"} ready →` : `${earned}/6 milestones earned →`, () => { selected = "Milestones"; render(); }));
      message(body, "Only finished, verified runs saved to your account appear here. Shirakumo is free riding and has no verified finish stamp.");
    } else if (selected === "Milestones") {
      const line = el("div", undefined, "mt-toolbar"); line.append(el("strong", number(data.earned_pow) + " / 675 POW earned"), el("small", "Lifetime rewards · each claimed once", "mt-muted")); body.append(line);
      const grid = el("div", undefined, "mt-grid");
      for (const m of data.milestones) {
        const card = el("article", undefined, "mt-card mt-badge" + (m.claimed ? " is-earned" : "")), copy = el("div", undefined, "mt-badge-copy"), mark = el("div", m.mark, "mt-mark");
        copy.append(el("h3", m.title), el("p", m.description));
        const progress = el("progress"); progress.max = m.target; progress.value = m.progress; progress.setAttribute("aria-label", m.title + " progress");
        copy.append(progress, el("small", `${number(m.progress)} / ${number(m.target)} · ${m.reward} POW`));
        const claim = button(m.claimed ? "Earned ✓" : m.ready ? "Claim " + m.reward + " POW" : "Keep riding", async () => {
          claim.disabled = true;
          try { data = await api("/api/journal/claim", { milestone: m.id }); if (!disposed) { render(); window.dispatchEvent(new Event("independent-account-refresh")); message(root, m.title + " earned · " + m.reward + " POW added."); } }
          catch (e) { message(copy, e.message, true); claim.disabled = false; }
        }); claim.disabled = m.claimed || !m.ready; claim.setAttribute("aria-label", m.title + ": " + claim.textContent); copy.append(el("br"), claim); card.append(mark, copy); grid.append(card);
      }
      body.append(grid);
    } else {
      const toolbar = el("div", undefined, "mt-toolbar"), select = el("select"); select.setAttribute("aria-label", "Filter run history by park");
      for (const p of [{ id: "all", name: "All parks" }, ...data.passport]) { const option = el("option", p.name); option.value = p.id; select.append(option); }
      select.value = park; select.addEventListener("change", () => { park = select.value; render(); }); toolbar.append(select, el("small", "Latest 50 verified finishes", "mt-muted")); body.append(toolbar);
      const rows = data.recent.filter((r) => park === "all" || r.park === park);
      if (!rows.length) body.append(el("p", "No finishes here yet. Start a solo run and take it all the way to the bottom.", "mt-empty"));
      else {
        const wrap = el("div", undefined, "mt-table-wrap"), table = el("table", undefined, "mt-table"), head = el("tr");
        for (const title of ["Park", "When", "Time", "Score"]) head.append(el("th", title)); const thead = el("thead"); thead.append(head); table.append(thead);
        const tbody = el("tbody"); for (const r of rows) { const row = el("tr"); for (const value of [r.park_name, new Date(r.created_at).toLocaleString(), r.duration_ms ? time(r.duration_ms) : "—", number(r.score)]) row.append(el("td", value)); tbody.append(row); } table.append(tbody); wrap.append(table); body.append(wrap);
      }
    }
    const footer = el("div", undefined, "mt-toolbar"); footer.append(button("Refresh journal", load, "mt-button secondary"), el("small", number(data.balance) + " POW", "mt-muted")); body.append(footer); root.append(body);
  }
  message(root, "Opening your journal…"); load(); return () => { disposed = true; };
}
if (document.querySelector("#mountain-journal")) mountJournal(document.querySelector("#mountain-journal"));
