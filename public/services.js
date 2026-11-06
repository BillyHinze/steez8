(() => {
  "use strict";
  const config = window.CORK7_CONFIG || {};
  const backend = new URL(config.apiOrigin || location.origin);
  if (!["http:", "https:"].includes(backend.protocol) || backend.username || backend.password ||
      (location.protocol === "https:" && backend.protocol !== "https:"))
    throw Error("The game server must use HTTPS.");

  const apiOrigin = backend.origin;
  const originalFetch = window.fetch.bind(window);
  const isService = (url) =>
    /^\/(api|auth\/v1|rest\/v1|functions\/v1|storage\/v1|parties|moderation)(\/|$)/.test(url.pathname) ||
    /^\/(populations|cup-results)(\/|$)/.test(url.pathname) ||
    (url.pathname === "/leaderboard" && url.searchParams.has("season"));

  // STEEZ8 is used on school Chromebooks and older phones. AbortSignal.any()
  // and AbortSignal.timeout() are not available in every browser. Compose
  // cancellation with AbortController instead of mistaking a missing browser
  // API for a blocked or offline multiplayer server.
  window.fetch = async function steez8Fetch(input, init) {
    const isRequest = typeof Request !== "undefined" && input instanceof Request;
    const url = new URL(isRequest ? input.url : input, location.href);
    const service = (url.origin === location.origin || url.origin === apiOrigin) && isService(url);
    if (!service) return originalFetch(input, init);

    const target = apiOrigin + url.pathname + url.search;
    const request = isRequest ? new Request(target, input) : target;
    const controller = new AbortController();
    const externalSignals = [init?.signal, ...(isRequest ? [input.signal] : [])].filter(Boolean);
    const removers = [];
    let externallyAborted = false;
    let timedOut = false;

    for (const signal of externalSignals) {
      const abort = () => {
        externallyAborted = true;
        controller.abort();
      };
      if (signal.aborted) abort();
      else {
        signal.addEventListener("abort", abort, { once: true });
        removers.push(() => signal.removeEventListener("abort", abort));
      }
    }

    // Replay verification may legitimately take longer than account/health APIs.
    // Keep the deadline slightly beyond the gateway's 130s upstream deadline.
    const timeoutMs = url.pathname === "/functions/v1/verify-run"
      ? 140000 : url.pathname === "/api/health" ? 18000 : 65000;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    try {
      const response = await originalFetch(request, { ...init, signal: controller.signal });
      if ((response.headers.get("content-type") || "").includes("text/html"))
        throw Error("The account server is not connected yet. Solo riding is still available.");
      return response;
    } catch (error) {
      if (externallyAborted) throw error;
      if (error?.message?.includes("account server")) throw error;
      if (timedOut)
        throw Error("The multiplayer server took too long to respond. Try again; solo riding is still available.");
      throw Error("Cannot reach the game server. Check your connection and try again. Solo riding is still available.");
    } finally {
      clearTimeout(timer);
      for (const remove of removers) remove();
    }
  };

  window.CORK7_SERVICES = Object.freeze({
    apiOrigin,
    wsOrigin: apiOrigin.replace(/^http/, "ws"),
  });
})();
