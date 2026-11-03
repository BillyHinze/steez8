import crypto from "node:crypto";
const packs = {
  "pow-600": { pow: 600, nok: 2900 },
  "pow-1200": { pow: 1200, nok: 5900 },
  "pow-2600": { pow: 2600, nok: 11900 },
};
const fault = (message, status = 400) =>
  Object.assign(Error(message), { status });
export class Payments {
  constructor(store, { mode = process.env.PAYMENT_MODE || "disabled" } = {}) {
    this.store = store;
    this.mode = mode;
    store.payments = this;
  }
  checkout(id, body, origin) {
    if (this.mode !== "local_test" || !this.store.owner(id))
      throw fault(
        "Cash purchases are disabled until a real payment provider is connected. No payment has been taken.",
        503,
      );
    const item = String(body.checkout),
      pack = packs[item],
      offer = this.store.economy.offers.get(item),
      pass = this.store.catalog.passes.find((r) => r.id === item);
    if (!pack && !offer && !pass) throw fault("Unknown checkout item", 404);
    if (
      offer &&
      offer.items.every((v) => this.store.account(id).items.includes(v))
    )
      return { owned: true };
    const order = {
      id: crypto.randomUUID(),
      player_id: id,
      item,
      currency: ["nok", "sek", "dkk", "eur", "usd"].includes(body.currency)
        ? body.currency
        : "nok",
      pow: pack?.pow || 0,
      items: offer?.items || [],
      pass: pass?.id || null,
      amount_nok:
        pack?.nok || Math.max(0, ((offer?.pow || pass.pow) / 200) * 1000 - 100),
      status: "open",
      test: true,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 1200000).toISOString(),
    };
    this.store.put("shop_orders", order.id, order);
    return {
      order: order.id,
      url: origin + "/checkout/" + order.id,
      test: true,
    };
  }
  order(id, orderId) {
    const order = this.store.get("shop_orders", orderId);
    if (!order || order.player_id !== id) throw fault("Order not found", 404);
    if (order.status === "open" && Date.parse(order.expires_at) < Date.now()) {
      order.status = "expired";
      this.store.put("shop_orders", order.id, order);
    }
    return order;
  }
  complete(id, orderId) {
    if (this.mode !== "local_test" || !this.store.owner(id))
      throw fault("Test payment completion is disabled", 403);
    return this.store.transaction(() => {
      const order = this.order(id, orderId);
      if (!order.test) throw fault("This is not a test checkout", 403);
      if (order.status === "paid") return order;
      if (order.status !== "open") throw fault("Order expired", 409);
      if (order.pow)
        this.store.economy.ledger(id, order.pow, "bought", "order:" + order.id);
      for (const item of order.items)
        this.store.economy.grant(id, item, "order:" + order.id);
      if (order.pass) {
        this.store.put("passes", id + ":" + order.pass, {
          player_id: id,
          season: order.pass,
          paid: true,
          order: order.id,
        });
        this.store.economy.settleRewards(
          id,
          this.store.catalog.passes.find((p) => p.id === order.pass),
        );
      }
      order.status = "paid";
      order.paid_at = new Date().toISOString();
      this.store.put("shop_orders", order.id, order);
      return order;
    });
  }
}
