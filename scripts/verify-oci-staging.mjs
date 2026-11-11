// Non-destructive gate: run against staging before switching GitHub Pages.
import assert from "node:assert/strict";
import { WebSocket } from "ws";

const arg = process.argv[2] || process.env.STEEZ8_STAGING_ORIGIN;
if (!arg) throw Error("Provide the HTTPS origin of the OCI staging backend.");
const url = new URL(arg);
if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash)
  throw Error("Staging origin must be an HTTPS origin with no path.");
const origin = url.origin;
const timeout = (ms) => AbortSignal.timeout(ms);
const healthResponse = await fetch(origin + "/api/health", {
  signal: timeout(15000), cache: "no-store",
  headers: { Origin: "https://steez8.me" },
});
assert.equal(healthResponse.status, 200);
assert.equal(healthResponse.headers.get("access-control-allow-origin"), "https://steez8.me");
const health = await healthResponse.json();
assert.equal(health.ok, true);
assert.equal(health.ready, true, "The game simulator/database must be fully ready");
console.log("Health OK:", JSON.stringify({
  ready: health.ready, database: health.database, online: health.online,
}));

const live = await fetch(origin + "/api/live", { signal: timeout(15000) });
assert.equal(live.status, 200);
assert.equal((await live.json()).ok, true);
console.log("Gateway ready");

const preflight = await fetch(origin + "/auth/v1/signup", {
  method: "OPTIONS", signal: timeout(15000),
  headers: {
    Origin: "https://steez8.me",
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "content-type",
  },
});
assert.equal(preflight.status, 204);
assert.equal(preflight.headers.get("access-control-allow-origin"), "https://steez8.me");
console.log("Browser-origin CORS OK");

await new Promise((resolve, reject) => {
  const socket = new WebSocket(origin.replace(/^https/, "wss") + "/parties/friends/hub", {
    origin: "https://steez8.me",
    handshakeTimeout: 12000,
  });
  const timer = setTimeout(() => {
    socket.terminate();
    reject(Error("WebSocket did not request authentication"));
  }, 15000);
  socket.on("message", (data) => {
    let message;
    try { message = JSON.parse(data.toString()); }
    catch { return; }
    if (message.t !== "auth-required") return;
    clearTimeout(timer);
    socket.terminate();
    resolve();
  });
  socket.on("error", (error) => {
    clearTimeout(timer);
    reject(error);
  });
});
console.log("WSS upgrade and authentication challenge OK");
console.log("OCI staging smoke test passed. Production frontend remains untouched.");
