import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Store } from "../server/store.mjs";

test("a damaged remote BEGIN recovers exactly once before any writes", () => {
  const store = Object.create(Store.prototype);
  store.remote = true;
  store.transactionDepth = 0;
  let recovered = 0;
  const events = [];
  store.db = {
    inTransaction: false,
    exec(sql) {
      events.push(sql);
      if (sql === "BEGIN IMMEDIATE") throw Error('InvalidParserState("Txn")');
    },
  };
  store.recoverReplica = () => {
    recovered++;
    store.db = { inTransaction: false, exec(sql) { events.push(sql); } };
    return true;
  };
  const value = store.transaction(() => { events.push("callback"); return 42; });
  assert.equal(value, 42);
  assert.equal(recovered, 1);
  assert.deepEqual(events, ["BEGIN IMMEDIATE", "BEGIN IMMEDIATE", "callback", "COMMIT"]);
  assert.equal(store.transactionDepth, 0);
});

test("failed rollback never masks the original database error", () => {
  const store = Object.create(Store.prototype);
  store.remote = false;
  store.transactionDepth = 0;
  store.db = {
    inTransaction: true,
    exec(sql) {
      if (sql === "ROLLBACK") throw Error("rollback failed");
    },
  };
  assert.throws(
    () => store.transaction(() => { throw Error("original failure"); }),
    /original failure/,
  );
  assert.equal(store.transactionDepth, 0);
});

test("local transactions roll back failed writes and support nested helpers", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "steez8-reliability-"));
  const store = new Store(dir);
  try {
    assert.throws(
      () => store.transaction(() => {
        store.put("reliability", "attempt", { value: "bad" });
        store.transaction(() => store.put("reliability", "nested", { value: "bad" }));
        throw Error("abort");
      }),
      /abort/,
    );
    assert.equal(store.get("reliability", "attempt"), null);
    assert.equal(store.get("reliability", "nested"), null);
    store.transaction(() => store.put("reliability", "good", { value: 42 }));
    assert.equal(store.get("reliability", "good").value, 42);
  } finally {
    store.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
