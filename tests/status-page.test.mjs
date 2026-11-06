import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../public/status-check.js", import.meta.url), "utf8");
const markup = fs.readFileSync(new URL("../public/status/index.html", import.meta.url), "utf8");

function setup({ online = true, socket = "success", ready = true } = {}) {
  const elements = new Map();
  const sockets = [];
  const copied = [];
  let apiCalls = 0;

  function element(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        textContent: "",
        dataset: {},
        disabled: false,
        handlers: {},
        append(child) { this.child = child; },
        replaceChildren() { this.child = null; },
        addEventListener(type, callback) { this.handlers[type] = callback; },
      });
    }
    return elements.get(id);
  }

  class MockSocket {
    constructor(url) {
      sockets.push(this);
      this.url = url;
      queueMicrotask(() => {
        if (socket === "success") this.onmessage?.({ data: '{"t":"auth-required"}' });
        if (socket === "failed") this.onerror?.(Error("WebSocket unavailable"));
      });
    }
    close() { this.closed = true; }
  }

  const browser = {
    window: {
      CORK7_CONFIG: { apiOrigin: "https://steez8-api.onrender.com" },
      addEventListener() {},
    },
    document: {
      getElementById: element,
      createElement() { return element("created:" + Math.random()); },
    },
    navigator: {
      onLine: online,
      clipboard: {
        async writeText(value) { copied.push(value); },
      },
    },
    fetch: async () => {
      apiCalls++;
      return {
        ok: true,
        status: 200,
        headers: { get() { return "application/json"; } },
        async json() { return { ok: true, ready }; },
      };
    },
    WebSocket: socket === "unsupported" ? undefined : MockSocket,
    URL,
    AbortController,
    setTimeout,
    clearTimeout,
    Date,
  };
  vm.runInNewContext(source, browser);
  return { element, sockets, copied, get apiCalls() { return apiCalls; } };
}

async function finish(harness) {
  for (let i = 0; i < 200; i++) {
    if (!harness.element("run-check").disabled) return;
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  throw Error("status checks did not complete");
}

test("connection status page includes a distinct real-time multiplayer check", () => {
  assert(markup.includes('id="socket"'));
  assert(markup.includes("WebSocket handshake without signing in"));
});

test("working API and WebSockets show independent success and no tokens are transmitted", async () => {
  const h = setup();
  await finish(h);
  assert.equal(h.apiCalls, 1);
  assert.equal(h.element("backend").textContent, "Connected");
  assert.equal(h.element("game").textContent, "Ready");
  assert.equal(h.element("socket").textContent, "Connected");
  assert.equal(h.element("socket").dataset.state, "online");
  assert.equal(h.sockets.length, 1);
  assert.equal(h.sockets[0].url, "wss://steez8-api.onrender.com/parties/friends/hub");
  assert.equal(h.sockets[0].closed, true);
  await h.element("copy").handlers.click();
  assert.match(h.copied[0], /Realtime WebSocket: Connected/);
  assert.doesNotMatch(h.copied[0], /Authorization:|Bearer /);
});

test("HTTP API can be up while realtime WebSockets are unreachable", async () => {
  const h = setup({ socket: "failed" });
  await finish(h);
  assert.equal(h.element("backend").textContent, "Connected");
  assert.equal(h.element("socket").textContent, "Not reachable");
  assert.equal(h.element("socket").dataset.state, "offline");
  assert.match(h.element("result").child.textContent, /cannot establish a real-time WebSocket/);
});

test("older browsers missing the WebSocket API show Unsupported instead of a false success", async () => {
  const h = setup({ socket: "unsupported" });
  await finish(h);
  assert.equal(h.element("backend").textContent, "Connected");
  assert.equal(h.element("socket").textContent, "Unsupported");
});

test("backend start state does not attempt to connect to realtime before ready", async () => {
  const h = setup({ ready: false });
  await finish(h);
  assert.equal(h.element("backend").textContent, "Starting");
  assert.equal(h.element("socket").textContent, "Waiting");
  assert.equal(h.sockets.length, 0);
});

test("offline browser does not contact the multiplayer server", async () => {
  const h = setup({ online: false });
  await finish(h);
  assert.equal(h.apiCalls, 0);
  assert.equal(h.sockets.length, 0);
  assert.equal(h.element("socket").textContent, "Unavailable");
});
