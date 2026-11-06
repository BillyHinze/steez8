(() => {
  "use strict";
  const backendOrigin = window.CORK7_CONFIG?.apiOrigin;
  const ids = {
    internet: document.getElementById("internet"),
    backend: document.getElementById("backend"),
    game: document.getElementById("game"),
  };
  const button = document.getElementById("run-check");
  const copy = document.getElementById("copy");
  const result = document.getElementById("result");
  const checked = document.getElementById("checked-at");
  const states = { website: "Online", internet: "Unknown", backend: "Unknown", game: "Unknown" };
  let checking = false, checkedTime = "";
  function set(key, state, message) {
    states[key] = message;
    const element = ids[key];
    if (!element) return;
    element.dataset.state = state;
    element.textContent = message;
  }
  function note(message) {
    result.replaceChildren();
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    result.append(paragraph);
  }
  async function run() {
    if (checking) return;
    checking = true;
    button.disabled = true;
    set("internet", "checking", "Checking");
    set("backend", "checking", "Checking");
    set("game", "checking", "Checking");
    checked.textContent = "Testing now…";
    try {
      const online = navigator.onLine !== false;
      set("internet", online ? "online" : "offline", online ? "Browser online" : "Browser offline");
      if (!online) {
        set("backend", "offline", "Unavailable");
        set("game", "offline", "Unavailable");
        note("Your browser reports that it is offline. Check your connection before retrying.");
        return;
      }
      if (!backendOrigin || new URL(backendOrigin).protocol !== "https:") {
        set("backend", "offline", "Not configured");
        set("game", "offline", "Unavailable");
        note("This website does not have a valid HTTPS multiplayer server configured.");
        return;
      }
      const controller = new AbortController();
      let timedOut = false;
      const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 16000);
      let response;
      try {
        response = await fetch(new URL("/api/health", backendOrigin).href, {
          method: "GET",
          mode: "cors",
          credentials: "omit",
          cache: "no-store",
          signal: controller.signal,
        });
      } catch (error) {
        set("backend", "offline", timedOut ? "Timed out" : "Not reachable");
        set("game", "offline", "Unavailable");
        note(timedOut
          ? "The multiplayer server took too long to answer. It might be waking from idle or your network might be restricting the connection. Solo play is still available."
          : "This network cannot contact the multiplayer server right now. The website itself is online; check local restrictions or try again later.");
        return;
      } finally {
        clearTimeout(timer);
      }
      const type = response.headers.get("content-type") || "";
      if (!response.ok || !type.includes("application/json")) {
        set("backend", "starting", response.status === 503 || response.status === 502 ? "Waking up" : "Unavailable");
        set("game", "starting", "Waiting");
        note("The hosting platform is starting the game server or is temporarily unavailable. Solo riding works independently. Retry after a short pause.");
        return;
      }
      const health = await response.json();
      if (health?.ok === true && health.ready === true) {
        set("backend", "online", "Connected");
        set("game", "online", "Ready");
        note("The website, multiplayer API and game simulation are responding. You can return to Basecamp.");
      } else if (health?.ok === true && health.ready === false) {
        set("backend", "starting", "Starting");
        set("game", "starting", "Loading");
        note("The server is responding but the game simulation is still starting. Solo riding works while it prepares.");
      } else {
        set("backend", "offline", "Unavailable");
        set("game", "offline", "Unavailable");
        note("The server replied but did not report healthy status. Please try again later.");
      }
    } finally {
      checkedTime = new Date().toISOString();
      checked.textContent = "Checked: " + new Date(checkedTime).toLocaleString();
      button.disabled = false;
      checking = false;
    }
  }
  function report() {
    return [
      "STEEZ8 connection report",
      "Checked: " + (checkedTime || "not run"),
      "Site: https://steez8.me/",
      "Website: " + states.website,
      "Internet: " + states.internet,
      "Multiplayer: " + states.backend,
      "Game: " + states.game,
      "Backend: " + (backendOrigin ? new URL(backendOrigin).origin : "not configured"),
    ].join("\n");
  }
  button.addEventListener("click", () => { void run(); });
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(report());
      const original = copy.textContent;
      copy.textContent = "Copied report";
      setTimeout(() => { copy.textContent = original; }, 2000);
    } catch {
      note("Copy is unavailable on this browser. You can describe the results shown above.");
    }
  });
  window.addEventListener("online", () => { void run(); });
  window.addEventListener("offline", () => { void run(); });
  void run();
})();
