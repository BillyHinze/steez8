(() => {
  // Start waking Render while the browser downloads the game UI and 3D assets.
  // One bounded request per page load: no artificial keep-alive traffic or costs.
  const origin = window.CORK7_CONFIG?.apiOrigin;
  if (!origin || typeof fetch !== "function") return;
  let sent = false;
  function wake() {
    if (sent) return;
    sent = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    fetch(new URL("/api/health", origin).href, {
      method: "GET",
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
      signal: controller.signal,
    }).catch(() => {
      // The connection banner provides actionable status once the UI loads.
    }).finally(() => clearTimeout(timer));
  }
  if (document.visibilityState === "hidden") {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) wake();
    }, { once: true });
  } else {
    wake();
  }
})();
