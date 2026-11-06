import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import { WebSocketServer, WebSocket } from "ws";
import { createGateway } from "../server/gateway.mjs";

const listen = async (server) => {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
};
const close = (server) => new Promise((resolve) => server.close(resolve));

test("gateway answers health immediately even while Turso/application is unavailable", async () => {
  const server = createGateway({ targetPort: 1, ready: () => false, originAllowed: () => true });
  const port = await listen(server);
  try {
    const base = `http://127.0.0.1:${port}`;
    const responses = await Promise.all(Array.from({ length: 100 },
      () => fetch(base + "/api/health").then((response) => response.json())));
    assert.equal(responses.length, 100);
    for (const item of responses) {
      assert.equal(item.ok, true);
      assert.equal(item.ready, false);
      assert.equal(item.status, "starting");
    }
    const offline = await fetch(base + "/auth/v1/user");
    assert.equal(offline.status, 503);
    assert.equal(offline.headers.get("retry-after"), "3");
    const live = await fetch(base + "/api/live");
    assert.equal(live.status, 200);
  } finally {
    await close(server);
  }
});

test("gateway forwards HTTP, POST request bodies and WebSocket upgrades once ready", async () => {
  const backend = http.createServer(async (req, res) => {
    if (req.url === "/api/health") {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ ok: true, ready: true }));
      return;
    }
    const parts = [];
    for await (const chunk of req) parts.push(chunk);
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ method: req.method, path: req.url, body: Buffer.concat(parts).toString() }));
  });
  const sockets = new WebSocketServer({ server: backend });
  sockets.on("connection", (ws) => ws.on("message", (data) => ws.send(data)));
  const backendPort = await listen(backend);
  let isReady = true;
  const gateway = createGateway({ targetPort: backendPort, ready: () => isReady, originAllowed: () => true });
  const gatewayPort = await listen(gateway);
  try {
    const base = `http://127.0.0.1:${gatewayPort}`;
    const health = await (await fetch(base + "/api/health")).json();
    assert.equal(health.ready, true);
    const request = await fetch(base + "/api/check?key=123", { method: "POST", body: "mountain" });
    assert.deepEqual(await request.json(), { method: "POST", path: "/api/check?key=123", body: "mountain" });
    const ws = new WebSocket(base.replace("http:", "ws:") + "/");
    try {
      await once(ws, "open");
      const answer = new Promise((resolve) => ws.once("message", (data) => resolve(data.toString())));
      ws.send("steez8");
      assert.equal(await answer, "steez8");
    } finally {
      ws.terminate();
    }
    isReady = false;
    assert.equal((await (await fetch(base + "/api/health")).json()).ready, false);
    assert.equal((await fetch(base + "/api/check")).status, 503);
  } finally {
    for (const client of sockets.clients) client.terminate();
    await new Promise((resolve) => sockets.close(resolve));
    await close(gateway);
    await close(backend);
  }
});

test("gateway does not expose warming-up endpoints to untrusted cross-origin requests", async () => {
  const server = createGateway({
    targetPort: 1,
    ready: () => false,
    originAllowed: (req) => req.headers.origin === "https://steez8.me",
  });
  const port = await listen(server);
  try {
    const url = `http://127.0.0.1:${port}/api/health`;
    const valid = await fetch(url, { headers: { Origin: "https://steez8.me" } });
    assert.equal(valid.status, 200);
    assert.equal(valid.headers.get("access-control-allow-origin"), "https://steez8.me");
    const invalid = await fetch(url, { headers: { Origin: "https://other.invalid" } });
    assert.equal(invalid.status, 403);
    assert.equal(invalid.headers.get("access-control-allow-origin"), null);
  } finally {
    await close(server);
  }
});
