// Production smoke checks after GitHub Pages publishes a STEEZ8 release.
// Uses only Node 24 built-ins. Tests the public DNS/TLS, static build, API and
// anonymous WebSocket handshake without creating accounts or submitting runs.
import assert from "node:assert/strict";
import dns from "node:dns/promises";

const site = "https://steez8.me";
const expectedA = new Set([
  "185.199.108.153", "185.199.109.153",
  "185.199.110.153", "185.199.111.153",
]);
const expectedAAAA = new Set([
  "2606:50c0:8000::153", "2606:50c0:8001::153",
  "2606:50c0:8002::153", "2606:50c0:8003::153",
]);

async function request(url, options = {}) {
  const start = Date.now();
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(options.timeout ?? 30000),
    headers: options.headers,
  });
  return { response, elapsed: Date.now() - start };
}

function assertOk(response, label) {
  assert.equal(response.ok, true, label + " returned HTTP " + response.status);
}

console.log("Checking global-facing STEEZ8 production endpoints...");
const ipv4 = await dns.resolve4("steez8.me");
assert(ipv4.length > 0, "No A records published");
for (const addr of ipv4) assert(expectedA.has(addr), "Unexpected GitHub Pages A record: " + addr);
console.log("DNS IPv4:", ipv4.join(", "));
try {
  const ipv6 = await dns.resolve6("steez8.me");
  for (const addr of ipv6) assert(expectedAAAA.has(addr), "Unexpected GitHub Pages AAAA record: " + addr);
  console.log("DNS IPv6:", ipv6.join(", "));
} catch (error) {
  if (!["ENODATA", "ENOTFOUND"].includes(error.code)) throw error;
  console.log("DNS IPv6: no AAAA record; IPv4 remains available");
}

const { response: home, elapsed } = await request(site + "/", { timeout: 30000 });
assertOk(home, "Basecamp");
const body = await home.text();
assert(body.length > 50000 && body.includes("STEEZ8"), "Basecamp HTML missing or incomplete");
assert(body.includes("backend-warmup.js?release="), "Early backend warmup missing from published HTML");
console.log("Basecamp HTTPS:", home.status, elapsed + "ms", body.length + " chars");

for (const pathname of ["/runtime-config.js", "/services.js", "/backend-warmup.js", "/status/", "/status-check.js", "/brand/steez8-share.png"]) {
  const { response } = await request(site + pathname);
  assertOk(response, "Static " + pathname);
  if (pathname === "/status/") {
    const statusHtml = await response.text();
    assert(statusHtml.includes("Mountain connection"), "Diagnostics page is stale or missing");
    assert(statusHtml.includes("status-check.js?release="), "Diagnostics script not versioned");
  }
  if (pathname === "/runtime-config.js") {
    const config = await response.text();
    const apiOrigin = config.match(/"apiOrigin":"(https:\/\/[^"]+)"/)?.[1];
    assert(apiOrigin, "Published backend origin is absent");
    globalThis.__steez8BackendOrigin = apiOrigin;
  }
  console.log("Static " + pathname + " OK");
}

const backend = globalThis.__steez8BackendOrigin;
assert(backend && new URL(backend).protocol === "https:", "Backend HTTPS origin invalid");
console.log("Checking active backend:", backend);
let health;
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    const { response, elapsed: ms } = await request(backend + "/api/health", {
      timeout: 80000,
      headers: { Origin: site },
    });
    if (!response.ok || !(response.headers.get("content-type") || "").includes("application/json")) {
      throw Error("Backend returned " + response.status + " instead of health JSON");
    }
    assert.equal(response.headers.get("access-control-allow-origin"), site, "Browser CORS policy broken");
    health = await response.json();
    console.log("Backend health attempt", attempt, ms + "ms", JSON.stringify({
      ok: health.ok, ready: health.ready, database: health.database, online: health.online,
    }));
    if (health.ok === true && health.ready === true) break;
  } catch (error) {
    console.warn("Backend not ready on attempt", attempt + ":", error.message);
  }
  if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 5000));
}
assert(health?.ok === true && health?.ready === true, "Multiplayer backend was not ready after retries");

// New WebSocket clients should receive an anonymous authentication challenge.
// Never insert credentials or user data into production verification.
await new Promise((resolve, reject) => {
  const socket = new WebSocket(backend.replace(/^https:/, "wss:") + "/parties/friends/hub");
  const timer = setTimeout(() => {
    socket.close();
    reject(Error("Public WebSocket handshake timed out"));
  }, 20000);
  let settled = false;
  const finish = (error) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    try { socket.close(); } catch {}
    error ? reject(error) : resolve();
  };
  socket.addEventListener("message", (event) => {
    let payload;
    try { payload = JSON.parse(String(event.data)); } catch { return; }
    if (payload.t === "auth-required") finish();
  });
  socket.addEventListener("error", () => finish(Error("Public WebSocket connection failed")));
  socket.addEventListener("close", () => finish(Error("WebSocket closed before the authentication challenge")));
});
console.log("Multiplayer WebSocket handshake: OK");
console.log("STEEZ8 production smoke checks passed.");
