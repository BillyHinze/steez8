import { css as mountainCSS } from "./mountain-ui.js";
import { t as clientFactory } from "./_next/static/chunks/supabase-BEhtaJUq.js";
async function startOwnerUI() {
  mountainCSS();
  import('./basecamp-status.js').then(m => m.startBasecampStatus());
  import("./sessions.js").then(m => m.startSessionHUD());
  import("./squads.js").then(m => m.startSquadHUD());
  const panels = { "/sessions": ["./sessions.js", "openSessions"], "/loadouts": ["./loadouts.js", "openLoadouts"], "/journal": ["./journal.js", "openJournal"], "/squads": ["./squads.js", "openSquads"] };
  document.addEventListener("click", event => { const link=event.target.closest?.("a[href]"); if(!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; const url=new URL(link.href);const panel=url.origin===location.origin && panels[url.pathname]; if(panel){event.preventDefault();import(panel[0]).then(m=>m[panel[1]]()).catch(()=>location.assign(link.href));} });
  const style = document.createElement("style");
  style.textContent =
    '.ind-owner-bar{position:fixed;z-index:1000;top:2px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:5px 9px;background:#17263ae8;color:#fff7d4;border:1px solid #d5b85d;border-radius:9px;font:700 9px "DM Sans",sans-serif;box-shadow:0 3px 15px #0004}.ind-owner-bar a{color:inherit;text-decoration:none}.ind-owner-tag{display:inline-block!important;padding:3px 7px!important;background:#e2c36d!important;border-radius:5px;color:#30260c!important;letter-spacing:.1em;font:800 10px "DM Sans",sans-serif!important;margin:6px!important}';
  document.head.append(style);
  let owner = null,
    frame = 0;
  function paint() {
    frame = 0;
    openRequestedPanel();
    const locker = document.querySelector(".bc-locker-controls");
    if (locker && !locker.querySelector(".mt-locker-loadouts")) { const link = document.createElement("a"); link.href = "/loadouts"; link.className = "mt-locker-loadouts"; link.textContent = "Saved looks · 3 outfit slots ↗"; locker.prepend(link); }
    const menu = document.querySelector('[aria-labelledby="game-menu-title"]');
    if (menu && !menu.querySelector(".ind-daily-goals")) {
      const link = document.createElement("a");
      link.href = "/challenges";
      link.className = "ind-daily-goals";
      link.textContent = "Daily + weekly goals · Earn POW ↗";
      link.style.cssText =
        'display:block;text-align:center;padding:13px 16px;margin-top:12px;border-radius:10px;background:#235d4d;color:white;font:700 14px "DM Sans",sans-serif;text-decoration:none';
      link.addEventListener("click", (event) => {
        event.preventDefault();
        import("/challenges.js")
          .then((module) => module.openGoals())
          .catch(() => location.assign("/challenges"));
      });
      menu.append(link);
    }
    if (menu && !menu.querySelector(".mt-menu-link")) { for (const [href,label,detail] of [["/sessions","Mountain Sessions","Six solo challenges"],["/squads","Ranked Squads","3v3 + 4v4 · Bring the crew"],["/journal","Mountain journal","Passport, milestones & personal bests"]]) { const link=document.createElement("a");link.href=href;link.className="mt-menu-link"+(href==="/sessions"?" sessions":"");link.textContent=label;const small=document.createElement("small");small.textContent=detail;link.append(small);menu.append(link); } }
    let bar = document.querySelector(".ind-owner-bar");
    if (!owner) {
      bar?.remove();
      document.querySelectorAll(".ind-owner-tag").forEach((e) => e.remove());
      return;
    }
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "ind-owner-bar";
      const badge = document.createElement("span"),
        link = document.createElement("a");
      badge.textContent = "OWNER";
      link.textContent = "Owner Tools ↗";
      link.href = "/owner";
      bar.append(badge, link);
      document.body.append(bar);
    }
    for (const name of document.querySelectorAll(".rd-name")) {
      const label = name.querySelector("b");
      if (
        label?.textContent?.trim().toLowerCase() ===
          owner.handle.toLowerCase() &&
        !name.querySelector(".ind-owner-tag")
      ) {
        const tag = document.createElement("small");
        tag.className = "ind-owner-tag";
        tag.textContent = "OWNER";
        name.append(tag);
      }
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(paint);
  }
  let pendingOpen = new URLSearchParams(location.search).get("open");
  function openRequestedPanel() {
    if (!pendingOpen) return;
    const panel = panels["/" + pendingOpen];
    if (panel) import(panel[0]).then(m => m[panel[1]]());
    else if (["shop", "leaderboard", "locker", "replays", "pass", "updates"].includes(pendingOpen)) {
      const target = [...document.querySelectorAll("button")].find(b => b.textContent.trim().toLowerCase().replace(/\s+/g, " ").startsWith(pendingOpen));
      if (!target) return;
      target.click();
    } else return;
    pendingOpen = null;
    const url = new URL(location.href);
    url.searchParams.delete("open");
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  }
  openRequestedPanel();
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  async function changed(session) {
    if (!session) {
      owner = null;
      schedule();
      return;
    }
    try {
      const response = await fetch("/api/me", {
        headers: { authorization: "Bearer " + session.access_token },
      });
      if (!response.ok) throw Error("Session unavailable");
      const me = await response.json();
      owner = me.user?.app_metadata?.role === "owner" ? me.user : null;
    } catch {
      owner = null;
    }
    schedule();
  }
  const client = clientFactory();
  client.auth.onAuthStateChange((_event, session) => {
    queueMicrotask(() => changed(session));
  });
  changed((await client.auth.getSession()).data.session);
}
if (window.INDEPENDENT_APP_READY) startOwnerUI();
else
  window.addEventListener("independent-app-ready", startOwnerUI, {
    once: true,
  });
