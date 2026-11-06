import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const code = fs.readFileSync(new URL("../public/services.js", import.meta.url), "utf8");
function harness(fetchImpl) {
  const timeouts = [];
  const calls = [];
  const window = {
    CORK7_CONFIG: { apiOrigin: "https://steez8-api.onrender.com" },
    fetch: async (input, init) => {
      calls.push({ input, init });
      return fetchImpl(input, init);
    },
  };
  const context = {
    window,
    location: {
      origin: "https://steez8.me",
      href: "https://steez8.me/",
      protocol: "https:",
    },
    URL,
    Request,
    AbortController,
    // Deliberately NO AbortSignal.any or AbortSignal.timeout.
    setTimeout: (fn, delay) => {
      timeouts.push(delay);
      return setTimeout(fn, delay);
    },
    clearTimeout,
  };
  vm.runInNewContext(code, context);
  return { window, calls, timeouts };
}
const json = () => ({
  ok: true,
  headers: { get: () => "application/json; charset=utf-8" },
  json: async () => ({ ok: true }),
});

test("API calls work without AbortSignal.any and AbortSignal.timeout", async () => {
  const h = harness(async () => json());
  const response = await h.window.fetch("/api/health");
  assert.equal(response.ok, true);
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].input, "https://steez8-api.onrender.com/api/health");
  assert.equal(h.timeouts[0], 18000);
  assert.equal(h.calls[0].init.signal.aborted, false);
});

test("non-API traffic stays on the original website with caller options", async () => {
  const h = harness(async () => json());
  const options = { method: "POST" };
  await h.window.fetch("/brand/icon.svg", options);
  assert.equal(h.calls[0].input, "/brand/icon.svg");
  assert.equal(h.calls[0].init, options);
  assert.deepEqual(h.timeouts, []);
});

test("replay verification has time to complete before its 130s gateway deadline", async () => {
  const h = harness(async () => json());
  await h.window.fetch("/functions/v1/verify-run", { method: "POST", body: "{}" });
  assert.equal(h.timeouts[0], 140000);
});

test("Request object proxy preserves its method, headers and request body", async () => {
  const h = harness(async input => {
    assert(input instanceof Request);
    assert.equal(input.url, "https://steez8-api.onrender.com/auth/v1/token?grant_type=password");
    assert.equal(input.method, "POST");
    assert.equal(input.headers.get("content-type"), "application/json");
    assert.equal(await input.text(), '{"password":"test"}');
    return json();
  });
  const original = new Request("https://steez8.me/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: '{"password":"test"}',
  });
  await h.window.fetch(original);
});

test("caller abort is passed through to the upstream fetch and not hidden as offline", async () => {
  const h = harness((input, init) => new Promise((resolve, reject) => {
    init.signal.addEventListener("abort", () => reject(new DOMException("Caller aborted", "AbortError")), { once: true });
  }));
  const controller = new AbortController();
  const pending = h.window.fetch("/api/health", { signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, /Caller aborted/);
  assert.equal(h.calls[0].init.signal.aborted, true);
});

test("HTTP 503 response from a waking backend is delivered without a false network error", async () => {
  const h = harness(async () => ({
    status: 503,
    ok: false,
    headers: { get: () => "application/json" },
  }));
  const response = await h.window.fetch("/api/health");
  assert.equal(response.status, 503);
});

test("HTML fallback is correctly rejected instead of pretending to be a game API", async () => {
  const h = harness(async () => ({
    ok: true,
    headers: { get: () => "text/html" },
  }));
  await assert.rejects(() => h.window.fetch("/api/health"), /account server is not connected/);
});

test("unrelated third-party URLs remain untouched", async () => {
  const h = harness(async () => json());
  await h.window.fetch("https://example.org/api/health");
  assert.equal(h.calls[0].input, "https://example.org/api/health");
});
