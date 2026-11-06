import test from "node:test";
import assert from "node:assert/strict";
import { summarizeProbes } from "../scripts/audit-global-reachability.mjs";

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
