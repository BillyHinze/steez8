import test from "node:test";
import assert from "node:assert/strict";
import { summarizeProbes, checkWwwRedirect } from "../scripts/audit-global-reachability.mjs";

test("global reachability counts clean HTTPS results separately from failures", () => {
  const result = summarizeProbes([
    { probe: { country: "AU", city: "Brisbane" }, result: { status: "finished", statusCode: 200, timings: { total: 152 } } },
    { probe: { country: "US", city: "Dallas" }, result: { status: "finished", statusCode: 200, timings: { total: 88 } } },
    { probe: { country: "DE", city: "Berlin" }, result: { status: "failed", rawOutput: "timeout" } },
    { probe: { country: "GB", city: "London" }, result: { status: "finished", statusCode: 403 } },
  ]);
  assert.equal(result.checked, 4);
  assert.equal(result.passed, 2);
  assert.equal(result.failed, 2);
  assert.deepEqual(result.rows.map(row => row.ok), [true, true, false, false]);
  assert.equal(result.rows[0].elapsed, 152);
  assert.equal(result.rows[2].code, null);
});

test("global reachability handles empty and partial probe responses", () => {
  const empty = summarizeProbes();
  assert.deepEqual({ checked: empty.checked, failed: empty.failed }, { checked: 0, failed: 0 });
  const incomplete = summarizeProbes([{ probe: {}, result: {} }]);
  assert.equal(incomplete.checked, 1);
  assert.equal(incomplete.failed, 1);
  assert.equal(incomplete.rows[0].country, "Unknown");
});

test("global reachability safely prints potentially untrusted probe location text", () => {
  const data = summarizeProbes([
    { probe: { country: "AA|Injected\n::error::", city: "City" }, result: { status: "finished", statusCode: 200 } },
  ]);
  assert.equal(data.rows[0].country, "AA Injected ::error::");
  assert.equal(data.rows[0].ok, true);
});


test("canonical www HTTPS redirect is accepted", async () => {
  let seenUrl = "";
  const report = await checkWwwRedirect(async (url, opts) => {
    seenUrl = url;
    assert.equal(opts.method, "HEAD");
    assert.equal(opts.redirect, "manual");
    return { status: 301, headers: { get: () => "https://steez8.me/" } };
  });
  assert.equal(seenUrl, "https://www.steez8.me/");
  assert.equal(report.ok, true);
  assert.equal(report.status, 301);
});

test("incorrect www redirect or a non-redirect response cannot pass", async () => {
  const wrongDestination = await checkWwwRedirect(async () => ({
    status: 302, headers: { get: () => "https://example.com/" },
  }));
  assert.equal(wrongDestination.ok, false);
  const notRedirect = await checkWwwRedirect(async () => ({
    status: 200, headers: { get: () => "https://steez8.me/" },
  }));
  assert.equal(notRedirect.ok, false);
});

test("failed www TLS or DNS lookup is reported without crashing global reachability", async () => {
  const report = await checkWwwRedirect(async () => { throw Error("TLS unavailable"); });
  assert.equal(report.ok, false);
  assert.equal(report.status, null);
  assert.match(report.error, /TLS unavailable/);
});
