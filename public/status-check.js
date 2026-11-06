(() => {
  "use strict";
  const backendOrigin = window.CORK7_CONFIG?.apiOrigin;
  const ids = {
    website: document.getElementById("website"),
    graphics: document.getElementById("graphics"),
    internet: document.getElementById("internet"),
    backend: document.getElementById("backend"),
    socket: document.getElementById("socket"),
    game: document.getElementById("game"),
  };
  const button = document.getElementById("run-check");
  const copy = document.getElementById("copy");
  const result = document.getElementById("result");
  const checked = document.getElementById("checked-at");
  const states = { graphics: "Unknown", website: "Unknown", internet: "Unknown", backend: "Unknown", socket: "Unknown", game: "Unknown" };
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
  // A working website/API does not guarantee the device can render the game.
  // Use a tiny in-memory canvas; do not download models or collect identifiers.
  function testGraphics() {
    try {
      const canvas = document.createElement("canvas");
      if (typeof canvas.getContext !== "function") return false;
      return !!(canvas.getContext("webgl2") || canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  }
  async function testRealtime() {
    if (typeof WebSocket !== "function") return "unsupported";
    const url = new URL("/parties/friends/hub", backendOrigin);
    url.protocol = "wss:";
    return new Promise((resolve) => {
      let ws, timer, finished = false;
      function finish(result) {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        try { ws?.close(); } catch {}
        resolve(result);
      }
      try {
        ws = new WebSocket(url.href);
      } catch {
        finish("offline");
        return;
      }
      timer = setTimeout(() => finish("offline"), 12000);
      ws.onmessage = (event) => {
        let message;
        try { message = JSON.parse(String(event.data)); } catch { return; }
        // Never send account credentials as part of a health check.
        if (message?.t === "auth-required") finish("online");
      };
      ws.onerror = () => finish("offline");
      ws.onclose = () => finish("offline");
    });
  }

  // A loaded page may have come from the browser cache. Check a small, public
  // same-origin file separately from the multiplayer API so an origin problem
  // is not mistaken for a Render problem. No user information is transmitted.
  async function testWebsite() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch("/version.json?connection-check=" + Date.now(), {
        method: "GET", cache: "no-store", credentials: "omit", signal: controller.signal,
      });
      if (!response.ok || !(response.headers.get("content-type") || "").includes("application/json"))
        return false;
      const version = await response.json();
      return typeof version?.version === "string";
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  // Render Free can wake slowly after idle. A single timed-out health check
  // cannot distinguish a cold start from an unreachable network. Recheck once,
  // only while the user is viewing diagnostics; never send continuous keepalives.
  async function checkBackendHealth() {
    const apiUrl = new URL("/api/health", backendOrigin).href;
    for (let attempt = 1; attempt <= 2; attempt++) {
      const controller = new AbortController();
      let timedOut = false;
      const timer = setTimeout(() => { timedOut = true; controller.abort(); },
        attempt === 1 ? 16000 : 30000);
      let retry = false;
      try {
        const response = await fetch(apiUrl, {
          method: "GET", mode: "cors", credentials: "omit",
          cache: "no-store", signal: controller.signal,
        });
        const type = response.headers.get("content-type") || "";
        if (response.ok && type.includes("application/json")) {
          const health = await response.json();
          if (health?.ok === true && health.ready === false && attempt === 1)
            retry = true;
          else
            return { kind: "health", health };
        } else if ([502, 503, 504].includes(response.status)) {
          if (attempt === 1) retry = true;
          else return { kind: "starting", status: response.status };
        } else {
          return { kind: "invalid", status: response.status };
        }
      } catch {
        if (attempt === 1) retry = true;
        else return { kind: "network-error", timedOut };
      } finally {
        clearTimeout(timer);
      }
      if (retry) {
        set("backend", "starting", "Rechecking");
        checked.textContent = "The multiplayer server may be starting. Checking again…";
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    return { kind: "network-error", timedOut: false };
  }

  async function run() {
    if (checking) return;
    checking = true;
    button.disabled = true;
    const graphicsReady = testGraphics();
    set("graphics", graphicsReady ? "online" : "offline", graphicsReady ? "3D supported" : "3D unavailable");
    set("website", "checking", "Checking");
    set("internet", "checking", "Checking");
    set("backend", "checking", "Checking");
    set("socket", "checking", "Checking");
    set("game", "checking", "Checking");
    checked.textContent = "Testing now…";
    try {
      const online = navigator.onLine !== false;
      set("internet", online ? "online" : "offline", online ? "Browser online" : "Browser offline");
      if (!online) {
        set("website", "offline", "Unavailable");
        set("backend", "offline", "Unavailable");
        set("socket", "offline", "Unavailable");
        set("game", "offline", "Unavailable");
        note("Your browser reports that it is offline. Check your connection before retrying.");
        return;
      }
      const websiteOnline = await testWebsite();
      set("website", websiteOnline ? "online" : "offline",
        websiteOnline ? "Connected" : "Not reachable");
      if (!backendOrigin || new URL(backendOrigin).protocol !== "https:") {
        set("backend", "offline", "Not configured");
        set("socket", "offline", "Unavailable");
        set("game", "offline", "Unavailable");
        note("This website does not have a valid HTTPS multiplayer server configured.");
        return;
      }
      const probe = await checkBackendHealth();
      if (probe.kind === "network-error") {
        set("backend", "offline", probe.timedOut ? "Timed out" : "Not reachable");
        set("socket", "offline", "Unavailable");
        set("game", "offline", "Unavailable");
        note(!websiteOnline
          ? "This network could not load a fresh website file or contact the multiplayer API. Check with the network administrator if the connection is restricted."
          : probe.timedOut
            ? "The multiplayer server did not respond after two attempts. It may be starting or temporarily unreachable. Solo riding is still available."
            : "This network could not contact the multiplayer server after two attempts. Solo riding remains available. Check connection restrictions or retry later.");
        return;
      }
      if (probe.kind === "starting" || probe.kind === "invalid") {
        const starting = probe.kind === "starting";
        set("backend", starting ? "starting" : "offline", starting ? "Waking up" : "Unavailable");
        set("socket", starting ? "starting" : "offline", starting ? "Waiting" : "Unavailable");
        set("game", starting ? "starting" : "offline", starting ? "Waiting" : "Unavailable");
        note(starting
          ? "The game server is still starting after two checks. Solo riding works independently. Run checks again to confirm readiness."
          : "The server returned an unexpected response (HTTP " + probe.status + "). It may be temporarily unavailable or the network may require sign-in.");
        return;
      }
      const health = probe.health;
      if (health?.ok === true && health.ready === true) {
        set("backend", "online", "Connected");
        set("game", "online", "Ready");
        const realtime = await testRealtime();
        set("socket", realtime === "online" ? "online" : "offline",
          realtime === "online" ? "Connected" : realtime === "unsupported" ? "Unsupported" : "Not reachable");
        note(!graphicsReady
          ? "The network and game server are responding, but this browser cannot create a WebGL 3D graphics context. Check browser graphics support and hardware acceleration before trying the mountain again."
          : !websiteOnline
          ? "The multiplayer server is reachable, but this browser cannot load a fresh file from steez8.me. The website could be cached or the current network might be restricting this domain. Ask the network administrator to check the connection."
          : realtime === "online"
            ? "The website, multiplayer API, WebSocket connection and game simulation are responding. You can return to Basecamp."
            : "The multiplayer API and simulation are responding, but this browser cannot establish a real-time WebSocket connection. Some networks restrict real-time connections. Check with the network administrator or retry later.");
      } else if (health?.ok === true && health.ready === false) {
        set("backend", "starting", "Starting");
        set("socket", "starting", "Waiting");
        set("game", "starting", "Loading");
        note("The server is responding but the game simulation is still starting. Solo riding works while it prepares. You can run the checks again when it is ready.");
      } else {
        set("backend", "offline", "Unavailable");
        set("socket", "offline", "Unavailable");
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
      "Browser 3D: " + states.graphics,
      "Internet: " + states.internet,
      "Multiplayer API: " + states.backend,
      "Realtime WebSocket: " + states.socket,
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
