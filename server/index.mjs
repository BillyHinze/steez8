import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";
import { Store, hash } from "./store.mjs";
import { attachRealtime } from "./realtime-v2.mjs";
import { verifyRun } from "./verify-v2.mjs";
import { Economy } from "./economy.mjs";
import { Cups } from "./cups.mjs";
import { Payments } from "./payments.mjs";
import { Challenges } from "./challenges.mjs";
import { Loadouts, equippedOutfit } from "./loadouts.mjs";
import { Journal } from "./journal.mjs";
import { Sessions } from "./sessions.mjs";
import { Squads } from "./squads.mjs";
import { infoPage, checkoutPage } from "./pages.mjs";
import { originPolicy } from "./origins.mjs";
const root = path.resolve(import.meta.dirname, "..");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".glb": "model/gltf-binary",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ogg": "audio/ogg",
  ".mp4": "audio/mp4",
  ".gz": "application/gzip",
  ".svg": "image/svg+xml",
};
const privateTables = new Set([
  "player_settings",
  "player_preferences",
  "player_outfits",
  "player_news_seen",
  "gift_choices",
]);
const readableTables = new Set([
  ...privateTables,
  "player_profiles",
  "completed_runs",
  "community_leaderboard",
  "leaderboard_best_runs",
  "season_awards",
  "pow_ledger",
  "rider_items",
  "shop_orders",
  "pass_progress",
]);
export function createApplication({
  dataDir = process.env.DATA_DIR || root + "/data",
  brand = process.env.GAME_NAME || "STEEZ8",
  paymentMode = process.env.PAYMENT_MODE || "disabled",
  clock = Date.now,
  publicOrigin = process.env.PUBLIC_ORIGIN || "",
  allowedOrigins = process.env.ALLOWED_ORIGINS || "",
} = {}) {
  const originAllowed = originPolicy({ publicOrigin, allowedOrigins });
  const store = new Store(dataDir),
    economy = new Economy(store),
    payments = new Payments(store, { mode: paymentMode }),
    challenges = new Challenges(store, economy, { clock }),
    journal = new Journal(store, economy, { clock }),
    loadouts = new Loadouts(store),
    mountainSessions = new Sessions(store, { clock }),
    squads = new Squads(store, { clock }),
    rates = new Map(),
    missing = new Set(),
    assetCache = new Map();
  store.mountainSessions = mountainSessions;
  store.squads = squads;
  let realtime,
    cups,
    assetBytes = 0,
    mountainReady = false;
  async function asset(file, stat) {
    const cached = assetCache.get(file);
    if (cached && cached.mtime === stat.mtimeMs) {
      assetCache.delete(file);
      assetCache.set(file, cached);
      return cached.bytes;
    }
    const bytes = await fsp.readFile(file);
    const current = assetCache.get(file);
    if (current) assetBytes -= current.bytes.length;
    assetCache.set(file, { mtime: stat.mtimeMs, bytes });
    assetBytes += bytes.length;
    while (assetBytes > (Number(process.env.ASSET_CACHE_MB) || 32) * 1024 * 1024 && assetCache.size > 1) {
      const oldest = assetCache.keys().next().value;
      assetBytes -= assetCache.get(oldest).bytes.length;
      assetCache.delete(oldest);
    }
    return bytes;
  }
  function rate(key, limit = 120) {
    let row = rates.get(key);
    if (!row || Date.now() > row.until) {
      row = { count: 0, until: Date.now() + 60000 };
      rates.set(key, row);
    }
    return ++row.count <= limit;
  }
  const maintenance = setInterval(() => {
    for (const [k, v] of rates) if (v.until < Date.now()) rates.delete(k);
    store.db
      .prepare("DELETE FROM sessions WHERE refresh_expires_at<?")
      .run(Date.now());
    store.db
      .prepare("DELETE FROM password_resets WHERE expires_at<?")
      .run(Date.now());
  }, 60000);
  maintenance.unref();
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost"),
      p = url.pathname,
      token = (req.headers.authorization || "").replace(/^Bearer /i, ""),
      user = store.authenticate(token);
    const json = (value, status = 200, headers = {}) => {
      res.writeHead(status, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        ...headers,
      });
      res.end(JSON.stringify(value));
    };
    const fail = (message, status = 400) => {
      throw Object.assign(Error(message), { status });
    };
    const need = () => {
      if (!user) fail("Authentication required", 401);
      return user;
    };
    let memo;
    async function body() {
      if (memo !== undefined) return memo;
      let size = 0,
        parts = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 2 * 1024 * 1024) fail("Request too large", 413);
        parts.push(chunk);
      }
      const raw = Buffer.concat(parts).toString();
      try {
        return (memo = raw ? JSON.parse(raw) : {});
      } catch {
        fail("Invalid JSON", 400);
      }
    }
    try {
      const serviceRequest = /^\/(api|auth|rest|functions|storage|parties|moderation)(\/|$)/.test(p) || /^\/(populations|cup-results)(\/|$)/.test(p) || p === '/leaderboard' && url.searchParams.has('season');
      if (serviceRequest) {
        res.setHeader('vary', 'Origin');
        if (!originAllowed(req)) return json({ error: 'Origin not allowed' }, 403);
        if (req.headers.origin) res.setHeader('access-control-allow-origin', req.headers.origin);
        res.setHeader('access-control-expose-headers', 'Content-Range, Range, X-Total-Count');
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'access-control-allow-methods': 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS',
            'access-control-allow-headers': 'Authorization, Content-Type, Apikey, X-Client-Info, X-Supabase-Api-Version, Prefer, Range, Accept-Profile, Content-Profile, X-Upsert',
            'access-control-max-age': '600',
          });
          return res.end();
        }
      }
      res.setHeader("x-content-type-options", "nosniff");
      res.setHeader("referrer-policy", "same-origin");
      res.setHeader(
        "content-security-policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' blob:; connect-src 'self' blob: data: ws: wss:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
      );
      if (
        serviceRequest && !rate(
          req.socket.remoteAddress +
            ":" +
            (p.startsWith("/auth/") ? "auth" : "api"),
          p.startsWith("/auth/") ? 40 : 2000,
        )
      )
        return json({ error: "Rate limit exceeded" }, 429);
      if (p === "/api/health")
        return json({
          ok: true,
          ready: mountainReady,
          brand,
          version: "0.5.0",
          database: store.remote ? 'turso' : 'sqlite',
          online: realtime.count(),
          payments: paymentMode,
          email: process.env.RESET_WEBHOOK_URL
            ? "webhook"
            : process.env.NODE_ENV === "production" ? "unconfigured" : "development_outbox",
        });
      if (p === "/api/me") {
        need();
        return json({
          user: store.user(user.id),
          profile: store.profile(user.id),
          account: store.account(user.id),
        });
      }
      if (p === "/api/catalog")
        return json({
          items: store.catalog.items,
          offers: store.catalog.offers,
          passes: store.catalog.passes,
        });
      if (p === "/api/loadouts") { need(); if (req.method === "GET") return json(loadouts.snapshot(user.id)); if (req.method === "POST") return json(loadouts.action(user.id, await body())); fail("Method not allowed", 405); }
      if (p === "/api/journal" && req.method === "GET") { need(); return json(journal.snapshot(user.id)); }
      if (p === "/api/journal/claim" && req.method === "POST") { need(); return json(journal.claim(user.id, (await body()).milestone)); }
      if (p === "/api/sessions" && req.method === "GET") { need(); return json(mountainSessions.snapshot(user.id)); }
      if (p === "/api/sessions/board" && req.method === "GET") { need(); return json(mountainSessions.board(url.searchParams.get("mode"), url.searchParams.get("park"))); }
      if (p === "/api/sessions/start" && req.method === "POST") { need(); const b = await body(); return json(mountainSessions.start(user.id, b.mode, b.park)); }
      if (p === "/api/sessions/end" && req.method === "POST") { need(); const b = await body(); return json(mountainSessions.end(user.id, b.id, b.abandon === true)); }
      if (p === "/api/squads" && req.method === "GET") { need(); return json(squads.snapshot(user.id)); }
      if (p === "/api/squads/queue" && req.method === "POST") { need(); const b = await body(); if (b.cancel === true) { squads.cancelQueue(user.id); return json(squads.snapshot(user.id)); } return json(squads.join(user.id, b.size)); }
      if (p === "/api/squads/ready" && req.method === "POST") { need(); return json(squads.ready(user.id, (await body()).id)); }
      if (p === "/api/squads/leave" && req.method === "POST") { need(); return json(squads.leave(user.id, (await body()).id)); }
      if (p === "/api/challenges") {
        need();
        return json(challenges.snapshot(user.id));
      }
      if (p === "/api/challenges/claim" && req.method === "POST") {
        need();
        return json(challenges.claim(user.id, (await body()).goal));
      }
      if (p.startsWith("/api/owner/")) {
        need();
        if (!store.owner(user.id)) fail("Owner access required", 403);
        const b = req.method === "POST" ? await body() : {};
        if (p === "/api/owner/summary")
          return json({
            owner: store.user(user.id),
            players: store.db
              .prepare("SELECT id,handle,created_at FROM users")
              .all()
              .map((r) => ({
                ...r,
                role: store.role(r.id),
                banned: store.banned(r.id),
              })),
            reports: store.rows("reports").slice(-100),
            online: realtime.count(),
            matches: store.rows("matches").slice(-50),
            mail: store.rows("mail_outbox").slice(-25),
            catalog: store.catalog.values.length,
            payments: paymentMode,
          });
        if (p === "/api/owner/grant" && req.method === "POST") {
          if (!store.user(b.player)) fail("Rider not found", 404);
          store.transaction(() => {
            if (b.item) economy.grant(b.player, b.item, "owner-grant");
            if (Number.isSafeInteger(b.pow) && b.pow > 0 && b.pow <= 10000000)
              economy.ledger(b.player, b.pow, "gift", "owner:" + user.id);
          });
          return json({ ok: true, account: store.account(b.player) });
        }
        if (p === "/api/owner/ban" && req.method === "POST") {
          if (!store.user(b.player) || store.owner(b.player))
            fail("Invalid target");
          if (b.remove) store.remove("bans", b.player);
          else
            store.put("bans", b.player, {
              until: b.hours
                ? new Date(
                    Date.now() + Math.max(1, Math.min(720, b.hours)) * 3600000,
                  ).toISOString()
                : null,
              why: "other",
              note: String(b.note || "").slice(0, 200),
              by: user.id,
            });
          realtime.disconnectAccount(b.player);
          return json({ ok: true });
        }
        if (p === "/api/owner/report" && req.method === "POST") {
          const report = store.get("reports", b.id);
          if (!report) fail("Report not found", 404);
          store.put("reports", b.id, {
            ...report,
            resolved: true,
            resolved_by: user.id,
            resolved_at: new Date().toISOString(),
          });
          return json({ ok: true });
        }
        if (p === "/api/owner/cup-start" && req.method === "POST") {
          const cup = cups.events.get(b.code);
          if (!cup) fail("Cup not found", 404);
          await cups.ready;
          cups.start(cup);
          return json({ ok: true });
        }
        if (p === "/api/owner/cup-create" && req.method === "POST") {
          await cups.room(
            { user, room: "apex", ws: { readyState: 0 } },
            { op: "open", rules: b },
          );
          const cup = [...cups.events.values()]
            .filter((c) => c.host === user.id && c.status === "open")
            .at(-1);
          return json({ ok: true, code: cup?.code });
        }
        return json({ error: "Unknown owner action" }, 404);
      }
      if (p.startsWith("/api/test-checkout/")) {
        need();
        const orderId = p.split("/").at(-1);
        if (req.method === "POST") {
          const b = await body();
          if (b.confirm !== "CONFIRM TEST PURCHASE")
            fail("Test purchase confirmation required");
          return json(payments.complete(user.id, orderId));
        }
        return json(payments.order(user.id, orderId));
      }
      if (p === "/favicon.svg" || p === "/favicon.ico") {
        res.writeHead(302, { location: "/brand/favicon-96.png" });
        return res.end();
      }
      if (p === "/version.json") return json({ version: "1.0.5" });
      if (p === "/auth/v1/signup" && req.method === "POST") {
        const b = await body();
        return json(await store.register(b.email, b.password, b.data?.handle));
      }
      if (p === "/auth/v1/token" && req.method === "POST") {
        const b = await body();
        return json(
          url.searchParams.get("grant_type") === "refresh_token"
            ? store.refresh(b.refresh_token)
            : await store.login(b.email, b.password),
        );
      }
      if (p === "/auth/v1/user") {
        need();
        if (req.method === "PUT") {
          const b = await body();
          if (b.password) await store.password(user.id, b.password);
        }
        return json(store.user(user.id));
      }
      if (p === "/auth/v1/logout" && req.method === "POST") {
        need();
        store.logout(token);
        return json({});
      }
      if (p === "/auth/v1/recover" && req.method === "POST") {
        if (process.env.NODE_ENV === 'production' && !process.env.RESET_WEBHOOK_URL) fail('Password recovery is not available yet. Contact the game host for help.', 503);
        const b = await body();
        const row = store.db
          .prepare("SELECT id,email FROM users WHERE email=?")
          .get(String(b.email).trim().toLowerCase());
        if (row) {
          const reset = crypto.randomBytes(32).toString("base64url");
          store.db
            .prepare("INSERT INTO password_resets VALUES(?,?,?)")
            .run(hash(reset), row.id, Date.now() + 30 * 60000);
          const link = `${publicOrigin || "http://" + req.headers.host}/reset-password?reset=${reset}`;
          if (process.env.RESET_WEBHOOK_URL) {
            const r = await fetch(process.env.RESET_WEBHOOK_URL, {
              method: "POST",
              headers: {
                "content-type": "application/json",
                ...(process.env.RESET_WEBHOOK_TOKEN
                  ? {
                      authorization:
                        "Bearer " + process.env.RESET_WEBHOOK_TOKEN,
                    }
                  : {}),
              },
              body: JSON.stringify({
                email: row.email,
                link,
                expires_in: 1800,
              }),
              signal: AbortSignal.timeout(10000),
            });
            if (!r.ok) fail("Error sending recovery email", 503);
          } else
            store.put("mail_outbox", crypto.randomUUID(), {
              player_id: row.id,
              email: row.email,
              link,
              created_at: new Date().toISOString(),
              test: true,
            });
        }
        return json({ development: !process.env.RESET_WEBHOOK_URL });
      }
      if (p === "/auth/v1/verify" && req.method === "POST") {
        const b = await body(),
          row = store.db
            .prepare(
              "SELECT * FROM password_resets WHERE token_hash=? AND expires_at>?",
            )
            .get(hash(String(b.token_hash)), Date.now());
        if (!row) fail("Recovery link expired", 400);
        store.db
          .prepare("DELETE FROM password_resets WHERE token_hash=?")
          .run(hash(b.token_hash));
        return json(store.session(row.user_id));
      }
      if (p === "/leaderboard" && url.searchParams.has("season")) {
        const board = store.board(url.searchParams.get("season"));
        return json({
          top: board.slice(0, 25),
          count: board.length,
          updatedAt: Date.now(),
          stale: false,
        });
      }
      if (p === "/populations") return json(realtime.populations());
      if (p === "/moderation/ban") {
        need();
        return json({ ban: store.banned(user.id) });
      }
      if (p === "/cup-results")
        return json(
          [...cups.events.values()]
            .filter((c) => !c.parent && c.status === "over")
            .sort((a, b) => b.created - a.created)
            .slice(0, 20)
            .map((c) => cups.results(c.code)),
        );
      if (p.startsWith("/cup-results/")) {
        const result = cups.results(p.split("/").at(-1));
        return result ? json(result) : json({ error: "Cup not found" }, 404);
      }
      if (p.startsWith("/parties/mountain/") && req.method === "GET")
        return json(
          realtime.population(decodeURIComponent(p.split("/").at(-1))),
        );
      if (p.startsWith("/parties/mountain/") && req.method === "POST")
        return json(
          { error: "Presence uses authenticated WebSocket connections" },
          405,
        );
      if (p.startsWith("/rest/v1/rpc/")) {
        const name = p.split("/").at(-1),
          b = await body();
        if (name === "shop_today") return json(economy.today());
        if (name === "duel_records")
          return json(
            (Array.isArray(b.players) ? b.players : []).slice(0, 50).map(
              (id) =>
                store.get("duel_records", String(id)) || {
                  player_id: id,
                  wins: 0,
                  losses: 0,
                  draws: 0,
                },
            ),
          );
        if (name === "ranked_result")
          return json(realtime.competition.result(b.p_duel, "duel"));
        if (name === "team_result")
          return json(realtime.competition.result(b.p_team, "team"));
        need();
        const account = () => store.account(user.id);
        if (name === "my_snapshot")
          return json({
            profile: store.profile(user.id),
            account: account(),
            settings: store.get("player_settings", user.id),
            outfit: store.get("player_outfits", user.id),
            preferences: store.get("player_preferences", user.id),
            friends: store.friends(user.id),
          });
        if (name === "my_account") return json(account());
        if (name === "my_news") {
          const from =
            [
              b.news_from,
              b.seen_here,
              store.get("player_news_seen", user.id)?.seen_at,
            ]
              .filter(Boolean)
              .sort()
              .at(-1) || "";
          const passId = economy.passForNow()?.id;
          const purchase = passId
            ? store.get("passes", user.id + ":" + passId)
            : null;
          return json({
            ledger: store
              .rows("pow_ledger")
              .filter((r) => r.player_id === user.id && r.created_at > from),
            items: store
              .rows("rider_items")
              .filter(
                (r) =>
                  r.player_id === user.id &&
                  (r.acquired_at || r.created_at || "") > from,
              )
              .map((r) => ({
                item: r.item,
                granted_at: r.acquired_at || r.created_at,
              })),
            orders: store
              .rows("shop_orders")
              .filter(
                (r) =>
                  r.player_id === user.id &&
                  r.status === "paid" &&
                  r.paid_at > from,
              ),
            pass: {
              xp: account().pass.xp,
              paid_at:
                purchase?.paid_at ||
                (purchase?.purchase
                  ? store.get("pow_ledger", String(purchase.purchase))
                      ?.created_at
                  : null) ||
                null,
            },
            gifts: store
              .rows("gifts")
              .filter((r) => r.to === user.id && r.at > from)
              .map((r) => ({
                from: store.profile(r.from)?.handle || "Rider",
                items: r.items,
                created_at: r.at,
              })),
          });
        }
        if (name === "ranked_board" || name === "team_board")
          return json(
            store.rankedBoard(user.id, name === "team_board" ? "2v2" : "1v1"),
          );
        if (name === "gift_friends")
          return json(
            economy.giftFriends(
              user.id,
              Array.isArray(b.item_ids) ? b.item_ids : [],
            ),
          );
        if (name === "my_friends") return json(store.friends(user.id));
        if (name === "find_riders") {
          const query = String(
            b.prefix ?? b.query ?? b.search ?? b.q ?? "",
          ).toLowerCase();
          const friends = new Map(
            store.friends(user.id).map((r) => [r.account, r.state]),
          );
          return json(
            store
              .rows("player_profiles")
              .filter(
                (r) =>
                  r.id !== user.id && r.handle.toLowerCase().startsWith(query),
              )
              .slice(0, 20)
              .map((r) => ({
                account: r.id,
                handle: r.handle,
                state: friends.get(r.id) || null,
              })),
          );
        }
        if (["friend_ask", "friend_answer", "friend_remove"].includes(name)) {
          let target = String(
            b.target ?? b.rider ?? b.to ?? b.who ?? b.account ?? b.other ?? "",
          );
          if (name === "friend_ask")
            target =
              store
                .rows("player_profiles")
                .find((p) => p.handle_key === target.toLowerCase())?.id ||
              target;
          if (!store.user(target) || target === user.id) fail("Invalid rider");
          const key = [user.id, target].sort().join(":"),
            old = store.get("friendships", key);
          if (name === "friend_ask") {
            if (!old)
              store.put("friendships", key, {
                a: user.id,
                b: target,
                accepted: false,
                created_at: new Date().toISOString(),
              });
          } else if (name === "friend_remove")
            store.db
              .prepare("DELETE FROM records WHERE collection=? AND id=?")
              .run("friendships", key);
          else {
            if (!old || old.b !== user.id) fail("No incoming request", 403);
            if (b.accept === true || b.yes === true)
              store.put("friendships", key, {
                ...old,
                accepted: true,
                created_at: new Date().toISOString(),
              });
            else
              store.db
                .prepare("DELETE FROM records WHERE collection=? AND id=?")
                .run("friendships", key);
          }
          realtime.friendsChanged(user.id, target);
          return json(
            name === "friend_ask"
              ? { result: "asked", account: target }
              : store.friends(user.id),
          );
        }
        return json(
          {
            error: `${name} is not yet implemented in this independent backend`,
            code: "NOT_IMPLEMENTED",
          },
          501,
        );
      }
      if (p.startsWith("/rest/v1/")) {
        const table = p.split("/").at(-1);
        if (!readableTables.has(table)) fail("Unknown table", 404);
        let rows =
          table === "community_leaderboard" || table === "leaderboard_best_runs"
            ? store.board((url.searchParams.get("season_id") || "eq.").slice(3))
            : store.rows(table);
        if (
          privateTables.has(table) ||
          [
            "pow_ledger",
            "rider_items",
            "completed_runs",
            "shop_orders",
            "pass_progress",
          ].includes(table)
        ) {
          need();
          rows = rows.filter((r) => (r.player_id ?? r.id) === user.id);
        }
        const filters = [...url.searchParams].filter(
          ([k]) =>
            !["select", "order", "limit", "offset", "on_conflict"].includes(k),
        );
        rows = rows.filter((row) =>
          filters.every(([k, v]) => {
            const [op, ...parts] = v.split("."),
              value = parts.join(".");
            if (op === "eq") return String(row[k]) === value;
            if (op === "neq") return String(row[k]) !== value;
            if (op === "gt") return row[k] > value;
            if (op === "in")
              return value.slice(1, -1).split(",").includes(String(row[k]));
            return false;
          }),
        );
        if (["POST", "PATCH"].includes(req.method)) {
          need();
          if (!privateTables.has(table) && table !== "player_profiles")
            fail(
              "Table is server managed; scores must use verified input logs",
              403,
            );
          const b = await body(),
            items = Array.isArray(b) ? b : [b];
          if (items.length > 10) fail("Too many rows");
          const saved = [];
          for (let item of items) {
            const own = table === "player_profiles" ? "id" : "player_id";
            if (item[own] && item[own] !== user.id)
              fail("Cannot update another rider", 403);
            item = { ...item, [own]: user.id };
            let old = store.get(table, user.id) || {};
            if (table === "player_profiles") {
              const handle = String(item.handle ?? old.handle).trim();
              if (!/^[\p{L}\p{N} _-]{3,20}$/u.test(handle))
                fail("Invalid handle");
              const key = handle.toLowerCase();
              try {
                store.db
                  .prepare("UPDATE users SET handle=?,handle_key=? WHERE id=?")
                  .run(handle, key, user.id);
              } catch {
                fail("Handle already registered", 409);
              }
              item = {
                id: user.id,
                handle,
                handle_key: key,
                handle_changed_at:
                  old.handle === handle
                    ? old.handle_changed_at
                    : new Date().toISOString(),
                handle_fix_until: null,
              };
            } else {
              const allowed = {
                player_settings: ["controls"],
                player_preferences: ["preferences"],
                player_outfits: ["outfit"],
                player_news_seen: ["seen_at"],
                gift_choices: ["accepts"],
              }[table];
              item = Object.fromEntries(
                Object.entries(item).filter(
                  ([k]) => k === "player_id" || allowed.includes(k),
                ),
              );
              item.updated_at = new Date().toISOString();
            }
            if (table === "player_outfits") item.outfit = equippedOutfit(store, user.id, item.outfit);
            saved.push(store.put(table, user.id, { ...old, ...item }));
            if (table === "player_outfits") store.outfitChanged?.(user.id, item.outfit);
          }
          return req.headers.prefer?.includes("return=representation")
            ? json(saved)
            : json(null, 201);
        }
        if (req.method !== "GET" && req.method !== "HEAD")
          fail("Method not allowed", 405);
        const order = url.searchParams.get("order");
        if (order) {
          const [column, dir] = order.split(".");
          rows.sort(
            (a, b) =>
              (a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0) *
              (dir === "desc" ? -1 : 1),
          );
        }
        const count = rows.length,
          offset = Math.max(0, Number(url.searchParams.get("offset")) || 0),
          limit = Math.min(
            200,
            Math.max(1, Number(url.searchParams.get("limit")) || 200),
          );
        rows = rows.slice(offset, offset + limit);
        const columns = url.searchParams.get("select");
        if (columns && columns !== "*")
          rows = rows.map((row) =>
            Object.fromEntries(
              columns
                .split(",")
                .filter((k) => Object.hasOwn(row, k))
                .map((k) => [k, row[k]]),
            ),
          );
        const headers = {
          "content-range": `${offset}-${Math.max(offset, offset + rows.length - 1)}/${count}`,
        };
        if (req.headers.accept?.includes("application/vnd.pgrst.object+json"))
          return rows.length === 1
            ? json(rows[0], 200, headers)
            : json(
                {
                  code: "PGRST116",
                  details: `The result contains ${rows.length} rows`,
                  message: "Cannot coerce the result to a single JSON object",
                },
                406,
                headers,
              );
        return json(rows, 200, headers);
      }
      if (p === "/functions/v1/verify-run" && req.method === "POST") {
        need();
        const b = await body();
        try {
          return json(
            await verifyRun(store, user.id, b, url.searchParams.has("replay")),
          );
        } catch (error) {
          console.warn("Verification rejected:", error.message);
          throw error;
        }
      }
      if (p === "/functions/v1/shop" && req.method === "POST") {
        need();
        const b = await body();
        if (b.checkout)
          return json(
            payments.checkout(
              user.id,
              b,
              process.env.PUBLIC_ORIGIN || "http://" + req.headers.host,
            ),
          );
        if (b.order) return json(payments.order(user.id, b.order));
        if (b.orders === "open")
          return json({
            orders: store
              .rows("shop_orders")
              .filter((o) => o.player_id === user.id && o.status === "open"),
          });
        return json(economy.action(user.id, b));
      }
      if (p === "/functions/v1/delete-account" && req.method === "POST") {
        need();
        const b = await body();
        if (b.confirm !== "DELETE MY ACCOUNT")
          fail("Exact deletion confirmation is required");
        if (store.owner(user.id))
          fail("Transfer ownership before deleting the owner account", 409);
        realtime.competition.leaveParty(user.id);
        realtime.disconnectAccount(user.id);
        store.deleteAccount(user.id);
        return json({ deleted: true });
      }
      if (p.startsWith("/storage/v1/object/public/run-replays/")) {
        const key = p.slice("/storage/v1/object/public/run-replays/".length);
        if (!/^[a-z0-9-]+\/[a-f0-9-]+\.c7r\.gz$/.test(key))
          fail("Invalid replay path");
        const [season, replayName] = key.split("/");
        const run = store.get(
          "completed_runs",
          replayName.replace(/\.c7r\.gz$/, ""),
        );
        if (!run?.verified || !run.has_replay || run.season_id !== season)
          fail("Replay not found", 404);
        const file = path.join(dataDir, "replays", key);
        try {
          const b = await fsp.readFile(file);
          res.writeHead(200, { "content-type": "application/gzip" });
          return res.end(b);
        } catch {
          const replay = store.remote && store.get('shared_replays', run.id);
          if (replay?.data) {
            res.writeHead(200, { 'content-type': 'application/gzip' });
            return res.end(Buffer.from(replay.data, 'base64'));
          }
          fail("Replay not found", 404);
        }
      }
      if (
        p.startsWith("/functions/") ||
        p.startsWith("/auth/") ||
        p.startsWith("/api/")
      )
        return json({ error: "Unknown endpoint" }, 404);
      if (
        ["/shop", "/leaderboard", "/locker", "/replays", "/pass"].includes(p)
      ) {
        res.writeHead(302, { location: "/?open=" + p.slice(1) });
        return res.end();
      }
      if (p.startsWith("/checkout/")) {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        return res.end(checkoutPage(p.split("/").at(-1), brand));
      }
      if (p === "/" && url.searchParams.has("reset")) {
        res.writeHead(302, {
          location:
            "/reset-password?reset=" +
            encodeURIComponent(url.searchParams.get("reset")),
          "cache-control": "no-store",
        });
        return res.end();
      }
      if (
        [
          "/challenges",
          "/journal",
          "/sessions",
          "/squads",
          "/reset-password",
          "/about",
          "/how-to-play",
          "/download",
          "/privacy",
          "/credits",
          "/terms-of-use",
          "/terms",
          "/updates",
          "/owner",
          "/status",
        ].includes(p)
      ) {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        return res.end(infoPage(p === "/terms" ? "/terms-of-use" : p, brand));
      }
      if (req.method !== "GET" && req.method !== "HEAD")
        fail("Method not allowed", 405);
      let relative = decodeURIComponent(p);
      if (relative.includes("\0")) fail("Invalid path");
      const publicRoot = path.resolve(root, "public"),
        file = path.resolve(publicRoot, "." + relative);
      if (!file.startsWith(publicRoot + path.sep) && file !== publicRoot)
        fail("Invalid path", 403);
      let target = file;
      try {
        const st = await fsp.stat(target);
        if (st.isDirectory()) target = path.join(target, "index.html");
      } catch {
        if (!path.extname(relative))
          target = path.join(publicRoot, "index.html");
        else {
          if (!missing.has(relative)) {
            missing.add(relative);
            console.warn("MISSING ASSET", relative);
          }
          return json({ error: "Asset unavailable", path: relative }, 404);
        }
      }
      const stat = await fsp.stat(target),
        headers = {
          "content-type":
            types[path.extname(target)] || "application/octet-stream",
          "accept-ranges": "bytes",
          "cache-control": /\.(webp|png|jpg|jpeg|glb|woff2|mp3|ogg|wav)$/.test(target) ? "public, max-age=3600, stale-while-revalidate=86400" : "no-cache",
          etag: `"${stat.size.toString(16)}-${stat.mtimeMs.toString(16)}"`,
        };
      if (!req.headers.range && req.headers["if-none-match"]?.split(/,\s*/).includes(headers.etag)) { res.writeHead(304, headers); return res.end(); }
      let start = 0,
        end = stat.size - 1,
        status = 200;
      if (req.headers.range) {
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if (!range || (!range[1] && !range[2])) {
          res.writeHead(416, { "content-range": "bytes */" + stat.size });
          return res.end();
        }
        if (!range[1]) start = Math.max(0, stat.size - Number(range[2]));
        else {
          start = Number(range[1]);
          if (range[2]) end = Math.min(end, Number(range[2]));
        }
        if (
          !Number.isSafeInteger(start) ||
          !Number.isSafeInteger(end) ||
          start < 0 ||
          start > end ||
          start >= stat.size
        ) {
          res.writeHead(416, { "content-range": "bytes */" + stat.size });
          return res.end();
        }
        status = 206;
        headers["content-range"] = `bytes ${start}-${end}/${stat.size}`;
      }
      headers["content-length"] = Math.max(0, end - start + 1);
      if (req.method === "HEAD") {
        res.writeHead(status, headers);
        return res.end();
      }
      const bytes = await asset(target, stat);
      res.writeHead(status, headers);
      return res.end(bytes.subarray(start, end + 1));
    } catch (error) {
      if (!res.headersSent)
        json(
          {
            error: error.message,
            reason: error.message,
            code: String(error.status || 500),
          },
          error.status || 500,
        );
      else res.destroy();
      if (!error.status) console.error(error);
    }
  });
  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: 65536,
    perMessageDeflate: false,
  });
  realtime = attachRealtime(server, wss, store, { clock, originAllowed });
  cups = new Cups(store, realtime.transport, { clock });
  store.cups = cups;
  realtime.setCups(cups);
  const ready = Promise.all([realtime.competition.ready, cups.ready]).then(() => {
    mountainReady = true;
  });
  return {
    server,
    store,
    realtime,
    cups,
    economy,
    payments,
    challenges,
    journal,
    loadouts,
    mountainSessions,
    squads,
    ready,
    missing,
    close: async () => {
      clearInterval(maintenance);
      squads.close();
      realtime.close();
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      store.close();
    },
  };
}
if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  console.info("STEEZ8 startup: opening database and game services");
  const app = createApplication();
  console.info("STEEZ8 startup: database opened; starting HTTP health endpoint");
  const port = Number(process.env.PORT || 4173),
    host = process.env.HOST || "127.0.0.1";
  app.ready.then(
    () => console.info("STEEZ8 startup: mountain simulation ready"),
    (error) => {
      console.error("STEEZ8 mountain startup failed:", error);
      process.exit(1);
    },
  );
  // Do not block HTTP health checks on expensive physics module loading.
  app.server.listen(port, host, () =>
    console.log(`Independent game: http://${host}:${port}`),
  );
  process.on("SIGTERM", () => app.close().then(() => process.exit(0)));
  process.on("SIGINT", () => app.close().then(() => process.exit(0)));
}
