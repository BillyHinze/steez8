import fs from "node:fs";
import crypto from "node:crypto";
const error = (message, status = 400) =>
  Object.assign(Error(message), { status });
const day = () =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo" }).format(
    new Date(),
  );
export class Economy {
  constructor(store) {
    this.store = store;
    this.catalog = JSON.parse(
      fs.readFileSync(
        new URL("./recovered/catalog-v2.json", import.meta.url),
        "utf8",
      ),
    );
    store.catalog = this.catalog;
    store.economy = this;
    this.offers = new Map(this.catalog.offers.map((r) => [r.id, r]));
    this.items = new Map(this.catalog.items.map((r) => [r.value, r]));
  }
  passForNow(now = Date.now()) {
    return (
      this.catalog.passes.find(
        (p) => Date.parse(p.starts) <= now && now < Date.parse(p.ends),
      ) || null
    );
  }
  today() {
    const d = new Date().toISOString().slice(0, 10),
      rank = (id) =>
        crypto
          .createHash("sha256")
          .update(d + ":" + id)
          .digest("hex");
    const entries = [...this.catalog.displayCatalog].sort((a, b) =>
      rank(a.id).localeCompare(rank(b.id)),
    );
    const featured = entries
        .filter((r) => ["pack", "set"].includes(r.kind))
        .slice(0, 4),
      daily = entries
        .filter((r) => !["pack", "set"].includes(r.kind))
        .slice(0, 12);
    const end = new Date(Date.parse(d + "T12:00:00Z") + 86400000);
    end.setUTCHours(0, 0, 0, 0);
    return {
      day: d,
      ends_at: end.toISOString(),
      cards: [
        ...featured.map((r) => ({
          card: r.id,
          section: "featured",
          fresh: false,
        })),
        ...daily.map((r) => ({ card: r.id, section: "daily", fresh: false })),
      ],
    };
  }
  ledger(id, delta, reason, ref, extra = {}) {
    const key =
      Number(
        this.store.db
          .prepare("SELECT value FROM metadata WHERE key='ledger-sequence'")
          .get()?.value || 0,
      ) + 1;
    this.store.db
      .prepare(
        "INSERT INTO metadata(key,value) VALUES('ledger-sequence',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
      )
      .run(String(key));
    const row = {
      id: key,
      player_id: id,
      delta,
      reason,
      ref,
      created_at: new Date().toISOString(),
      ...extra,
    };
    this.store.put("pow_ledger", String(key), row);
    return row;
  }
  grant(id, item, source) {
    if (!this.items.has(item)) throw error("Unknown item");
    this.store.put("rider_items", id + ":" + item, {
      player_id: id,
      item,
      source,
      acquired_at: new Date().toISOString(),
    });
  }
  settleRewards(id, pass) {
    const progress = this.store.get("pass_progress", id + ":" + pass.id) || {
      xp: 0,
    };
    const tier = Math.min(
      pass.tiers,
      1 + Math.floor(progress.xp / pass.tierXp),
    );
    const paid =
      this.store.owner(id) || !!this.store.get("passes", id + ":" + pass.id);
    for (const reward of pass.rewards) {
      if (reward.tier > tier || (reward.track === "paid" && !paid)) continue;
      const key = id + ":" + pass.id + ":" + reward.track + ":" + reward.tier;
      if (this.store.get("pass_rewards", key)) continue;
      if (reward.item) this.grant(id, reward.item, "pass:" + pass.id);
      if (reward.pow)
        this.ledger(id, reward.pow, "pass", pass.id + ":" + reward.tier);
      this.store.put("pass_rewards", key, {
        player_id: id,
        season: pass.id,
        ...reward,
        at: new Date().toISOString(),
      });
    }
  }
  verifiedRun(id, run) {
    const pass = this.passForNow();
    if (!pass) return;
    const previous = this.store.get("pass_progress", id + ":" + pass.id) || {
      player_id: id,
      xp: 0,
      xp_today: 0,
      xp_day: day(),
      over_xp: 0,
    };
    const base =
        (pass.baseXp ?? 50) +
        Math.floor(run.score / (pass.pointsPerXp ?? 1000)),
      days =
        Math.floor(Date.parse(day() + "T00:00:00Z") / 86400000) -
        Math.floor(
          Date.parse(
            new Intl.DateTimeFormat("sv-SE", {
              timeZone: "Europe/Oslo",
            }).format(new Date(pass.starts)) + "T00:00:00Z",
          ) / 86400000,
        ) +
        2;
    const cap = pass.fullXpPerDay
      ? Math.max(0, pass.fullXpPerDay * days - (previous.xp - previous.over_xp))
      : pass.dailyXpCap
        ? Math.max(
            0,
            pass.dailyXpCap -
              (previous.xp_day === day() ? previous.xp_today : 0),
          )
        : base;
    const full = Math.min(base, cap),
      over = Math.floor(
        (Math.max(0, base - full) * (pass.overRatePct ?? 0)) / 100,
      ),
      gain = full + over;
    this.store.put("pass_progress", id + ":" + pass.id, {
      ...previous,
      xp: previous.xp + gain,
      xp_day: day(),
      xp_today: (previous.xp_day === day() ? previous.xp_today : 0) + gain,
      over_xp: previous.over_xp + over,
    });
    this.settleRewards(id, pass);
  }
  giftFriends(id, itemIds) {
    const now = Date.now(),
      owner = this.store.owner(id),
      user = this.store.user(id),
      runs = this.store.account(id).history.length,
      ready = Date.parse(user.created_at) + 7 * 86400000,
      left = owner
        ? 1000
        : Math.max(
            0,
            5 -
              this.store
                .rows("gifts")
                .filter(
                  (r) =>
                    r.from === id &&
                    r.at.slice(0, 10) === new Date().toISOString().slice(0, 10),
                ).length,
          );
    const friends = this.store
      .friends(id)
      .filter((f) => f.state === "friends")
      .map((f) => {
        const relation = this.store.get(
          "friendships",
          [id, f.account].sort().join(":"),
        );
        const since = relation?.created_at || relation?.at || user.created_at;
        const owned = new Set(this.store.account(f.account).items);
        return {
          account: f.account,
          handle: f.handle,
          since,
          owned: itemIds.filter((v) => owned.has(v)).length,
          closed: this.store.get("gift_choices", f.account)?.accepts === false,
          locked: !owner && now - Date.parse(since) < 48 * 3600000,
        };
      });
    return {
      left,
      ...(!owner && (ready > now || runs < 20)
        ? { ready: { at: new Date(ready).toISOString(), runs } }
        : {}),
      friends,
    };
  }
  action(id, body) {
    if (body.orders === "open") return { orders: [] };
    if (body.checkout || body.order)
      throw error(
        "Real-money purchases are not configured. The owner can grant POW in Owner Tools.",
        503,
      );
    if (body.return) return this.returnItem(id, String(body.return));
    const offerId = String(body.buy ?? body.gift ?? ""),
      pass = this.catalog.passes.find((p) => p.id === offerId);
    let offer = pass
      ? { id: pass.id, items: [], pow: pass.pow }
      : this.offers.get(offerId);
    if (!offer) throw error("This item is not available");
    if (!body.gift && offerId.startsWith("hw-") && offerId.endsWith("-full")) {
      const owned = new Set(this.store.account(id).items),
        items = offer.items.filter((item) => !owned.has(item));
      if (!items.length)
        return { owned: true, balance: this.store.balance(id) };
      if (items.length < offer.items.length) {
        const subtotal = items.reduce(
          (sum, item) => sum + (this.offers.get(item)?.pow || 0),
          0,
        );
        offer = {
          ...offer,
          items,
          pow: Math.floor((subtotal * 0.7) / 100) * 100,
        };
      }
    }
    if (body.pow !== undefined && body.pow !== offer.pow)
      throw error("This item price changed; refresh the shop", 409);
    const recipient = body.gift ? String(body.to || "") : id;
    if (!this.store.user(recipient)) throw error("Rider not found", 404);
    if (body.gift) {
      const eligibility = this.giftFriends(id, offer.items),
        friend = eligibility.friends.find((f) => f.account === recipient);
      if (
        !friend ||
        friend.closed ||
        friend.locked ||
        friend.owned > 0 ||
        eligibility.ready ||
        eligibility.left <= 0
      )
        throw error("This rider is not currently eligible for gifting", 403);
    }
    return this.store.transaction(() => {
      const owned = new Set(this.store.account(recipient).items);
      if (pass && this.store.get("passes", recipient + ":" + pass.id))
        return { owned: true, balance: this.store.balance(id) };
      if (offer.items.length && offer.items.every((item) => owned.has(item)))
        return { owned: true, balance: this.store.balance(id) };
      if (!this.store.owner(id) && this.store.balance(id) < offer.pow)
        throw error("Not enough POW", 409);
      const purchase = this.ledger(id, -offer.pow, "item", "item:" + offer.id, {
        recipient,
        items: offer.items,
      });
      if (pass) {
        this.store.put("passes", recipient + ":" + pass.id, {
          player_id: recipient,
          season: pass.id,
          paid: true,
          purchase: purchase.id,
          paid_at: purchase.created_at,
        });
        this.settleRewards(recipient, pass);
      } else
        for (const item of offer.items)
          this.grant(recipient, item, "purchase:" + purchase.id);
      if (body.gift) {
        this.store.put("gifts", crypto.randomUUID(), {
          from: id,
          to: recipient,
          item: offer.id,
          items: offer.items,
          at: new Date().toISOString(),
        });
        this.store.put("news", crypto.randomUUID(), {
          player_id: recipient,
          kind: "gift",
          from: id,
          items: offer.items,
          at: new Date().toISOString(),
        });
      }
      return {
        bought: true,
        ...(body.gift ? { gifted: true } : {}),
        balance: this.store.balance(id),
        items: offer.items,
        account: this.store.account(id),
      };
    });
  }
  returnItem(id, offerId) {
    return this.store.transaction(() => {
      const ledger = this.store
          .rows("pow_ledger")
          .filter((r) => r.player_id === id),
        returns = ledger.filter((r) => r.reason === "return");
      if (returns.length >= 3 && !this.store.owner(id))
        throw error("All three lifetime returns have been used", 409);
      const purchase = ledger
        .filter(
          (r) =>
            r.reason === "item" &&
            r.ref === "item:" + offerId &&
            r.recipient === id &&
            !returns.some((t) => t.ref === "return:" + r.id),
        )
        .at(-1);
      if (!purchase) throw error("Purchase not found or already returned", 404);
      if (this.catalog.passes.some((p) => p.id === offerId))
        throw error("Season passes cannot be returned");
      for (const item of purchase.items || []) {
        const owned = this.store.get("rider_items", id + ":" + item);
        if (owned?.source === "purchase:" + purchase.id)
          this.store.remove("rider_items", id + ":" + item);
      }
      this.ledger(id, -purchase.delta, "return", "return:" + purchase.id);
      return {
        returned: true,
        balance: this.store.balance(id),
        items: purchase.items || [],
      };
    });
  }
}
