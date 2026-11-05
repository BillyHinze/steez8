import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import crypto from "node:crypto";
import { promisify } from "node:util";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const scrypt = promisify(crypto.scrypt);
export const hash = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
export class Store {
  constructor(directory) {
    fs.mkdirSync(directory, { recursive: true });
    this.directory = directory;
    this.remote = !!process.env.TURSO_DATABASE_URL;
    if (process.env.RENDER && !this.remote) throw Error('Free Render hosting requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN so accounts survive restarts.');
    if (this.remote && !process.env.TURSO_AUTH_TOKEN) throw Error('TURSO_AUTH_TOKEN is required for permanent account storage.');
    if (this.remote || process.env.DATABASE_DRIVER === 'libsql') {
      const Database = require('libsql');
      this.db = new Database(path.join(directory, this.remote ? 'replica.sqlite' : 'game.sqlite'), this.remote ? {
        syncUrl: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
        readYourWrites: true,
        offline: false,
      } : {});
      if (this.remote) this.db.sync();
    } else this.db = new DatabaseSync(path.join(directory, "game.sqlite"));
    // Remote libSQL accepts one schema statement per exec call.
    const schema = fs.readFileSync(new URL("../migrations/001_initial.sql", import.meta.url), "utf8");
    for (const statement of schema.split(";").map(s => s.trim()).filter(Boolean)) this.db.exec(statement);
    if (this.remote) this.db.sync();
    let key = this.db
      .prepare("SELECT value FROM metadata WHERE key=?")
      .get("session-key")?.value;
    if (!key) {
      key = crypto.randomBytes(48).toString("hex");
      this.db
        .prepare("INSERT INTO metadata(key,value) VALUES(?,?)")
        .run("session-key", key);
    }
    this.key = key;
    if (process.env.OWNER_ACCOUNT_ID) this.configureOwner(process.env.OWNER_ACCOUNT_ID);
  }
  rows(table) {
    return this.db
      .prepare("SELECT body FROM records WHERE collection=?")
      .all(table)
      .map((r) => JSON.parse(r.body));
  }
  put(table, id, value) {
    this.db
      .prepare(
        "INSERT INTO records(collection,id,body) VALUES(?,?,?) ON CONFLICT(collection,id) DO UPDATE SET body=excluded.body",
      )
      .run(table, id, JSON.stringify(value));
    return value;
  }
  get(table, id) {
    let row = this.db
      .prepare("SELECT body FROM records WHERE collection=? AND id=?")
      .get(table, id);
    return row ? JSON.parse(row.body) : null;
  }
  remove(table, id) {
    this.db
      .prepare("DELETE FROM records WHERE collection=? AND id=?")
      .run(table, id);
  }
  recoverReplica() {
    if (!this.remote) return false;
    // Keep the replica file/WAL intact: never delete data to recover a session.
    try { this.db.close(); } catch {}
    const Database = require("libsql");
    this.db = new Database(path.join(this.directory, "replica.sqlite"), {
      syncUrl: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
      readYourWrites: true,
      offline: false,
    });
    this.db.sync();
    return true;
  }
  transaction(fn) {
    // Reentrant database work shares one atomic transaction.
    if (this.transactionDepth) return fn();
    try {
      this.db.exec("BEGIN IMMEDIATE");
    } catch (error) {
      if (!this.remote || !/InvalidParserState.*Txn/.test(String(error.message)))
        throw error;
      console.warn("Recovering libSQL replica after failed transaction BEGIN");
      this.recoverReplica();
      // Only BEGIN is retried: the callback hasn't modified any records yet.
      this.db.exec("BEGIN IMMEDIATE");
    }
    this.transactionDepth = 1;
    try {
      const result = fn();
      if (result && typeof result.then === "function")
        throw Error("Database transactions must be synchronous");
      this.db.exec("COMMIT");
      return result;
    } catch (error) {
      // Do not replace the original failure with a secondary rollback error.
      try {
        if (this.db.inTransaction !== false) this.db.exec("ROLLBACK");
      } catch (rollbackError) {
        console.error("Database rollback failed:", rollbackError.message);
      }
      throw error;
    } finally {
      this.transactionDepth = 0;
    }
  }
  configureOwner(id) {
    // Deployment-only setting: bind privileges to an existing immutable account ID.
    // Never trust a display name, client metadata, or a newly registered email.
    if (!this.db.prepare("SELECT id FROM users WHERE id=?").get(id))
      throw Error("Configured owner account does not exist");
    this.db.prepare("INSERT INTO metadata(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run("owner_user_id", id);
  }
  owner(id) {
    return (
      this.db
        .prepare("SELECT value FROM metadata WHERE key=?")
        .get("owner_user_id")?.value === id
    );
  }
  role(id) {
    return this.owner(id) ? "owner" : "rider";
  }
  user(id) {
    const row = this.db
      .prepare("SELECT id,email,handle,created_at FROM users WHERE id=?")
      .get(id);
    return row
      ? {
          ...row,
          is_anonymous: false,
          aud: "authenticated",
          role: "authenticated",
          user_metadata: {
            handle: row.handle,
            role: this.role(id),
            tag: this.owner(id) ? "OWNER" : null,
          },
          app_metadata: {
            provider: "email",
            providers: ["email"],
            role: this.role(id),
          },
          identities: [{ provider: "email", id: row.id, user_id: row.id }],
        }
      : null;
  }
  async register(email, password, handle) {
    if (typeof email === 'string') email = email.trim().toLowerCase();
    if (
      typeof email !== "string" ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      email.length > 254
    )
      throw Object.assign(Error("Invalid email format"), { status: 400 });
    if (
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 256
    )
      throw Object.assign(
        Error("Password must have at least eight characters"),
        { status: 400 },
      );
    handle = String(handle || "Rider").trim();
    if (!/^[\p{L}\p{N} _-]{3,20}$/u.test(handle))
      throw Object.assign(
        Error("Handle must contain 3–20 letters, numbers, spaces, _ or -"),
        { status: 400 },
      );
    const salt = crypto.randomBytes(16).toString("hex"),
      key = await scrypt(password, salt, 64),
      id = crypto.randomUUID();
    try {
      this.db
        .prepare(
          "INSERT INTO users(id,email,handle,handle_key,password_hash,salt,created_at) VALUES(?,?,?,?,?,?,?)",
        )
        .run(
          id,
          email.toLowerCase(),
          handle,
          handle.toLocaleLowerCase("en"),
          key.toString("hex"),
          salt,
          new Date().toISOString(),
        );
    } catch {
      throw Object.assign(Error("Email or rider name already registered"), {
        status: 409,
      });
    }
    this.put("player_profiles", id, {
      id,
      handle,
      handle_key: handle.toLocaleLowerCase("en"),
      handle_changed_at: null,
      handle_fix_until: null,
    });
    const pass = this.economy?.passForNow();
    if (pass) this.transaction(() => this.economy.settleRewards(id, pass));
    return this.session(id);
  }
  async login(email, password) {
    if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 256) throw Object.assign(Error('Invalid email or password'), { status: 400 });
    const row = this.db
      .prepare("SELECT * FROM users WHERE email=?")
      .get(email.trim().toLowerCase());
    const salt = row?.salt || "dummy-salt";
    const key = await scrypt(String(password), salt, 64);
    if (
      !row ||
      !crypto.timingSafeEqual(key, Buffer.from(row.password_hash, "hex"))
    )
      throw Object.assign(Error("Invalid login credentials"), { status: 400 });
    return this.session(row.id);
  }
  session(id) {
    const expires = Math.floor(Date.now() / 1000) + 3600;
    const part = (x) => Buffer.from(JSON.stringify(x)).toString("base64url");
    const payload =
      part({ alg: "HS256", typ: "JWT" }) +
      "." +
      part({
        sub: id,
        exp: expires,
        role: "authenticated",
        aud: "authenticated",
        jti: crypto.randomUUID(),
      });
    const access =
        payload +
        "." +
        crypto
          .createHmac("sha256", this.key)
          .update(payload)
          .digest("base64url"),
      refresh = crypto.randomBytes(48).toString("base64url");
    this.db
      .prepare(
        "INSERT INTO sessions(access_hash,refresh_hash,user_id,expires_at,refresh_expires_at) VALUES(?,?,?,?,?)",
      )
      .run(
        hash(access),
        hash(refresh),
        id,
        expires * 1000,
        Date.now() + 30 * 86400000,
      );
    return {
      access_token: access,
      refresh_token: refresh,
      expires_in: 3600,
      expires_at: expires,
      token_type: "bearer",
      user: this.user(id),
    };
  }
  authenticate(token) {
    if (!token) return null;
    const row = this.db
      .prepare(
        "SELECT user_id FROM sessions WHERE access_hash=? AND expires_at>?",
      )
      .get(hash(token), Date.now());
    return row ? this.user(row.user_id) : null;
  }
  refresh(token) {
    const row = this.db
      .prepare(
        "SELECT user_id FROM sessions WHERE refresh_hash=? AND refresh_expires_at>?",
      )
      .get(hash(String(token)), Date.now());
    if (!row)
      throw Object.assign(Error("Invalid refresh token"), { status: 401 });
    this.db
      .prepare("DELETE FROM sessions WHERE refresh_hash=?")
      .run(hash(token));
    return this.session(row.user_id);
  }
  logout(token) {
    this.db
      .prepare("DELETE FROM sessions WHERE access_hash=?")
      .run(hash(token));
  }
  async password(id, password) {
    if (
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 256
    )
      throw Object.assign(
        Error("Password must have at least eight characters"),
        { status: 400 },
      );
    const salt = crypto.randomBytes(16).toString("hex"),
      key = await scrypt(password, salt, 64);
    this.db
      .prepare("UPDATE users SET password_hash=?,salt=? WHERE id=?")
      .run(key.toString("hex"), salt, id);
    this.db.prepare("DELETE FROM sessions WHERE user_id=?").run(id);
    return this.user(id);
  }
  profile(id) {
    const profile = this.get("player_profiles", id);
    return profile
      ? {
          ...profile,
          role: this.role(id),
          tag: this.owner(id) ? "OWNER" : null,
        }
      : null;
  }
  balance(id) {
    // Finite wire value for unlimited owner POW; privileges remain server-authorized.
    if (this.owner(id)) return Number.MAX_SAFE_INTEGER;
    return this.rows("pow_ledger")
      .filter((r) => r.player_id === id)
      .reduce((n, r) => n + r.delta, 0);
  }
  account(id) {
    const history = this.rows("completed_runs")
      .filter((r) => r.player_id === id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    const pass = this.economy?.passForNow(),
      progress = pass ? this.get("pass_progress", id + ":" + pass.id) : null;
    const owner = this.owner(id),
      items =
        owner && this.catalog
          ? this.catalog.values
          : this.rows("rider_items")
              .filter((r) => r.player_id === id)
              .map((r) => r.item);
    const ledger = this.rows("pow_ledger").filter((r) => r.player_id === id);
    const yard = history.filter((r) => r.course_id === "nordryggen-v1");
    return {
      history,
      items: [...new Set(items)],
      returned: ledger.filter((r) => r.reason === "return").map((r) => r.ref),
      bought: ledger
        .filter((r) => r.reason === "item" && r.recipient === id)
        .map((r) => ({ id: r.id, ref: r.ref, pow: -r.delta })),
      best: yard.length ? Math.max(...yard.map((r) => r.score)) : null,
      pow: this.balance(id),
      pow_unlimited: owner,
      role: this.role(id),
      tag: owner ? "OWNER" : null,
      pass: {
        xp: owner && pass ? pass.tiers * pass.tierXp : progress?.xp || 0,
        paid: owner || !!(pass && this.get("passes", id + ":" + pass.id)),
        xp_day: progress?.xp_day || new Date().toISOString().slice(0, 10),
        xp_today: progress?.xp_today || 0,
        over_xp: progress?.over_xp || 0,
      },
    };
  }
  rating(id, size = "1v1") {
    return (
      this.get("ratings-" + size, id) || {
        player_id: id,
        rating: 1000,
        peak: 1000,
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
      }
    );
  }
  rankedBoard(id, size = "1v1") {
    const rows = this.rows("ratings-" + size)
      .filter((r) => this.user(r.player_id))
      .sort(
        (a, b) => b.rating - a.rating || a.player_id.localeCompare(b.player_id),
      );
    const ranked = rows.filter((r) => r.games >= 5),
      standing = this.rating(id, size),
      place = ranked.findIndex((r) => r.player_id === id);
    return {
      season: "independent-2026-11",
      open: true,
      top: ranked
        .slice(0, 50)
        .map((r) => ({
          handle: this.profile(r.player_id)?.handle || "Rider",
          rating: r.rating,
          games: r.games,
          wins: r.wins,
          losses: r.losses,
          draws: r.draws,
          you: r.player_id === id,
        })),
      me: { ...standing, place: place < 0 ? null : place + 1 },
    };
  }
  publicStanding(id, size = "1v1") {
    const r = this.rating(id, size);
    return {
      rating: r.rating,
      games: r.games,
      w: r.wins,
      l: r.losses,
      d: r.draws,
    };
  }
  banned(id) {
    const b = this.get("bans", id);
    return b && (!b.until || Date.parse(b.until) > Date.now()) ? b : null;
  }
  deleteAccount(id) {
    if (this.owner(id))
      throw Object.assign(
        Error("Transfer ownership before deleting the owner account"),
        { status: 409 },
      );
    this.transaction(() => {
      this.db.prepare("DELETE FROM sessions WHERE user_id=?").run(id);
      this.db.prepare("DELETE FROM password_resets WHERE user_id=?").run(id);
      for (const row of this.db
        .prepare("SELECT collection,id,body FROM records")
        .all()) {
        const body = JSON.parse(row.body);
        if (
          row.id === id ||
          body.player_id === id ||
          body.a === id ||
          body.b === id ||
          body.from === id ||
          body.to === id
        )
          this.remove(row.collection, row.id);
      }
      this.db.prepare("DELETE FROM users WHERE id=?").run(id);
    });
  }
  board(season) {
    const best = new Map();
    for (const r of this.rows("completed_runs").filter(
      (r) => r.season_id === season && r.verified,
    )) {
      if (!best.has(r.player_id) || best.get(r.player_id).score < r.score)
        best.set(r.player_id, r);
    }
    return [...best.values()]
      .sort((a, b) => b.score - a.score || a.duration_ms - b.duration_ms)
      .map((r, i) => ({
        rank: i + 1,
        player_id: r.player_id,
        handle: this.profile(r.player_id)?.handle ?? "Rider",
        score: r.score,
        duration_ms: r.duration_ms,
        run_id: r.id,
        has_replay: !!r.has_replay,
        season_id: r.season_id,
      }));
  }
  friends(id) {
    return this.rows("friendships")
      .filter((r) => r.a === id || r.b === id)
      .map((r) => ({
        account: r.a === id ? r.b : r.a,
        handle: this.profile(r.a === id ? r.b : r.a)?.handle ?? "Rider",
        state: r.accepted ? "friends" : r.a === id ? "you-asked" : "asked-you",
      }));
  }
  close() {
    this.db.close();
  }
}
