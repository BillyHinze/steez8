import { equippedOutfit } from "./loadouts.mjs";
import { originPolicy } from "./origins.mjs";
import crypto from "node:crypto";
import {
  s as validPose,
  a as parseRoom,
  t as capacities,
  r as validActivity,
} from "../public/_next/static/chunks/live-protocol-j28FoPiw.js";
import { r as moderate } from "../public/_next/static/chunks/chat-DlnF30mF.js";
import { Competition } from "./competition.mjs";
const parks = Object.keys(capacities);
export const send = (ws, message) => {
  if (ws.readyState === 1 && ws.bufferedAmount < 262144)
    ws.send(
      typeof message === "string" || Buffer.isBuffer(message)
        ? message
        : JSON.stringify(message),
    );
};
export function attachRealtime(server, wss, store, options = {}) {
  const originAllowed = options.originAllowed || originPolicy();
  const rooms = new Map(),
    hubs = new Map(),
    all = new Set();
  let cups;
  const broadcast = (room, message, except) => {
    for (const c of rooms.get(room) || [])
      if (c !== except) send(c.ws, message);
  };
  const transport = {
    hub: (id) => hubs.get(id),
    hubSend: (id, m) => {
      const c = hubs.get(id);
      if (c) send(c.ws, m);
    },
    roomSend: broadcast,
    clientSend: (c, m) => send(c.ws, m),
    peers: (room) => [...(rooms.get(room) || [])],
    hubs: () => [...hubs.values()],
  };
  const competition = new Competition(store, transport, options);
  store.competition = competition;
  store.outfitChanged = (id, value) => {
    for (const c of all) if (c.user?.id === id && c.room) { c.outfit = value; broadcast(c.room, { t: "outfit", id: c.id, outfit: value }); }
    const party = competition.party(id); if (party) competition.publishParty(party);
  };
  const descriptor = (c) => ({
    id: c.id,
    name: c.name,
    outfit: c.outfit,
    activity: c.activity,
    score: c.score,
    role: store.role(c.user.id),
    ...(store.owner(c.user.id) ? { tag: "OWNER" } : {}),
    ...(c.watch ? { watch: true } : {}),
  });
  function population(name) {
    const parsed = parseRoom(name),
      base = parsed?.base || name,
      peers = [...rooms].filter(([key]) => parseRoom(key)?.base === base);
    return {
      count: peers.reduce((n, [, r]) => n + r.size, 0),
      cap: capacities[base] || 30,
      solo: [...hubs.values()].filter(
        (c) => c.where?.at === "solo" && c.where.park === base,
      ).length,
      riders: peers.flatMap(([, r]) => [...r].map(descriptor)),
      rooms: peers.map(([room, r]) => ({ room, count: r.size })),
      duels: competition.duels(base),
      duelsRevision: Math.floor(Date.now() / 1000),
    };
  }
  function populations() {
    return {
      rooms: Object.fromEntries(parks.map((p) => [p, population(p)])),
      duels: competition.summary(),
      cup: cups?.summary() || null,
    };
  }
  function friendsChanged(...ids) {
    for (const id of ids) {
      const c = hubs.get(id);
      if (c) send(c.ws, { t: "changed" });
    }
  }
  function updatePresence(c) {
    for (const f of store
      .friends(c.user.id)
      .filter((f) => f.state === "friends")) {
      const peer = hubs.get(f.account);
      if (peer)
        send(peer.ws, {
          t: "where",
          id: c.user.id,
          where: c.where,
          away: c.away,
        });
    }
    competition.where(c.user.id, c.where);
  }
  function hello(c) {
    send(c.ws, {
      t: "hello",
      v: 2,
      you: c.user.id,
      links: store.friends(c.user.id),
      friends: store
        .friends(c.user.id)
        .filter((f) => f.state === "friends" && hubs.has(f.account))
        .map((f) => ({
          id: f.account,
          where: hubs.get(f.account).where,
          away: hubs.get(f.account).away,
        })),
      teams: true,
      partyChat: true,
    });
    competition.hello(c.user.id);
  }
  function outfit(id, value) {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value) ||
      JSON.stringify(value).length > 4096
    )
      return null;
    try { return equippedOutfit(store, id, value); } catch { return null; }
  }

  server.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url, "http://localhost");
    if (!originAllowed(req)) {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }
    if (
      url.pathname !== "/parties/friends/hub" &&
      !/^\/parties\/mountain\/[a-z0-9-]{1,80}$/.test(url.pathname)
    ) {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) =>
      wss.emit("connection", ws, req, url),
    );
  });
  wss.on("connection", (ws, req, url) => {
    if (all.size >= 1000) {
      ws.close(1013, "Connection limit");
      return;
    }
    const hub = url.pathname.endsWith("/friends/hub"),
      room = decodeURIComponent(url.pathname.split("/").at(-1)),
      c = {
        ws,
        hub,
        room,
        user: null,
        token: null,
        id: 0,
        name: "Rider",
        outfit: null,
        activity: "ride",
        score: 0,
        watch: url.searchParams.get("watch") === "1",
        last: Date.now(),
        period: Date.now(),
        messages: 0,
        where: { at: "lobby" },
        away: false,
      };
    all.add(c);
    try {
      c.requestedOutfit = JSON.parse(url.searchParams.get("outfit") || "null");
    } catch {}
    send(ws, { t: "auth-required" });
    const deadline = setTimeout(() => {
      if (!c.user) ws.close(4004, "Authentication required");
    }, 7000);
    deadline.unref();
    ws.on("error", () => {});
    ws.on("message", async (data, isBinary) => {
      try {
        c.last = Date.now();
        if (c.last - c.period > 1000) {
          c.period = c.last;
          c.messages = 0;
        }
        if (++c.messages > 90) {
          ws.close(4014, "Message rate exceeded");
          return;
        }
        if (isBinary) {
          if (!c.user || hub) return;
          const buffer = Buffer.from(data),
            array = buffer.buffer.slice(
              buffer.byteOffset,
              buffer.byteOffset + buffer.byteLength,
            );
          if (!validPose(array)) {
            ws.close(1008, "Invalid pose");
            return;
          }
          buffer[1] = c.id;
          broadcast(c.room, buffer, c);
          return;
        }
        let m;
        try {
          m = JSON.parse(data);
        } catch {
          return;
        }
        if (!m || typeof m.t !== "string") return;
        if (m.t === "auth") {
          const user = store.authenticate(m.token);
          if (!user) {
            ws.close(4004, "Invalid session");
            return;
          }
          if (c.user && c.user.id !== user.id) {
            ws.close(4004, "Rider changed");
            return;
          }
          if (store.banned(user.id)) {
            send(ws, { t: "banned", ...store.banned(user.id) });
            ws.close(4005, "Account banned");
            return;
          }
          const first = !c.user;
          c.user = user;
          c.token = m.token;
          c.name = store.profile(user.id)?.handle || user.handle;
          clearTimeout(deadline);
          if (hub) {
            const old = hubs.get(user.id);
            if (old && old !== c)
              old.ws.close(4006, "Another basecamp tab connected");
            hubs.set(user.id, c);
            hello(c);
            updatePresence(c);
            return;
          }
          if (!first) return;
          await competition.ready;
          const publicRoom = parseRoom(room),
            meta = competition.roomMeta(room) || cups?.roomMeta(room);
          if (
            !publicRoom &&
            !competition.roomAccess(user.id, room, c.watch) &&
            !cups?.roomAccess(user.id, room, c.watch)
          ) {
            ws.close(1008, "This room is private or does not exist");
            return;
          }
          let members = rooms.get(room);
          if (!members) {
            members = new Set();
            rooms.set(room, members);
          }
          const cap = publicRoom
            ? capacities[publicRoom.base]
            : meta?.cap || 30;
          if (members.size >= cap) {
            ws.close(4001, "Room full");
            return;
          }
          for (const peer of members)
            if (peer.user.id === user.id) {
              peer.ws.close(4006, "Another riding tab connected");
              members.delete(peer);
            }
          const used = new Set([...members].map((p) => p.id));
          c.id =
            cups?.assigned(room, user.id) || (meta?.cup && c.watch ? 200 : 1);
          while (used.has(c.id)) c.id++;
          if (c.id > 255) {
            ws.close(4001, "Room full");
            return;
          }
          c.outfit =
            outfit(user.id, c.requestedOutfit) ||
            outfit(user.id, store.get("player_outfits", user.id)?.outfit) ||
            null;
          c.park = publicRoom?.base || meta?.park;
          send(ws, {
            t: "roster",
            me: c.id,
            cap,
            riders: [...members].map(descriptor),
          });
          members.add(c);
          broadcast(room, { t: "join", ...descriptor(c) }, c);
          competition.joined(c);
          cups?.joined(c);
          return;
        }
        if (m.t === "ping") {
          send(ws, { t: "pong", n: m.n });
          return;
        }
        if (!c.user) return;
        if (!store.authenticate(c.token)) {
          ws.close(4004, "Session expired");
          return;
        }
        if (hub) {
          if (
            m.t === "where" &&
            m.where &&
            ["lobby", "live", "solo", "duel", "watch"].includes(m.where.at)
          ) {
            c.where = { ...m.where };
            updatePresence(c);
          } else if (m.t === "away") {
            c.away = !!m.on;
            updatePresence(c);
          } else if (m.t === "changed") friendsChanged(c.user.id, m.with);
          else if (m.t === "duel-map") send(ws, { t: "duel-map-ready" });
          else if (m.t === "invite") {
            const target = hubs.get(m.to),
              friend = store
                .friends(c.user.id)
                .some((f) => f.account === m.to && f.state === "friends");
            if (target && friend && c.where.at === "live") {
              send(target.ws, {
                t: "invite",
                from: { id: c.user.id, name: c.name },
                park: c.where.park,
                room: c.where.room || 1,
              });
              send(ws, { t: "invite-sent", to: m.to });
            } else
              send(ws, {
                t: "invite-failed",
                to: m.to,
                why: !target ? "offline" : !friend ? "not-friends" : "not-live",
              });
          } else if (m.t === "cup") await cups?.hub(c.user.id, m);
          else await competition.hub(c.user.id, m);
          return;
        }
        if (m.t === "rename") {
          c.name = store.profile(c.user.id)?.handle || c.name;
          broadcast(room, { t: "rename", id: c.id, name: c.name });
          return;
        }
        if (m.t === "duel") {
          await competition.room(c, m);
          return;
        }
        if (m.t === "cup") {
          await cups?.room(c, m);
          return;
        }
        if (m.t === "outfit") {
          const value = outfit(c.user.id, m.outfit);
          if (value) {
            c.outfit = value;
            broadcast(room, { t: "outfit", id: c.id, outfit: value }, c);
          }
        } else if (m.t === "state" && validActivity(m.s)) {
          c.activity = m.s;
          broadcast(room, { t: "state", id: c.id, s: c.activity }, c);
        } else if (m.t === "chat") {
          if (Date.now() - (c.chatAt || 0) < 700) return;
          c.chatAt = Date.now();
          const text =
            typeof m.text === "string" ? m.text.trim().slice(0, 120) : null;
          if (text) {
            const filtered = moderate(text);
            if (!filtered.ok) {
              send(ws, {
                t: "chat-notice",
                text: "That message cannot be sent.",
              });
              return;
            }
            broadcast(room, {
              t: "chat",
              id: c.id,
              name: c.name,
              text: filtered.text,
              age: 0,
            });
          } else if (Number.isInteger(m.quick) && m.quick >= 0 && m.quick < 50)
            broadcast(room, {
              t: "chat",
              id: c.id,
              name: c.name,
              quick: m.quick,
              age: 0,
            });
        } else if (
          m.t === "event" &&
          ["jump", "land", "crash", "butter", "dismount"].includes(m.kind)
        )
          broadcast(
            room,
            {
              t: "event",
              id: c.id,
              kind: m.kind,
              text: String(m.text || "").slice(0, 100),
              score: Math.max(0, Math.min(10000000, Number(m.score) || 0)),
              impact: Math.max(0, Math.min(100, Number(m.impact) || 0)),
              landing: m.landing,
            },
            c,
          );
        else if (m.t === "score" && Number.isFinite(m.total)) {
          c.score = Math.max(0, Math.min(10000000, Math.round(m.total)));
          broadcast(room, { t: "score", id: c.id, total: c.score }, c);
        } else if (m.t === "report") {
          store.put("reports", crypto.randomUUID(), {
            from: c.user.id,
            room,
            who: m.id,
            reason: String(m.reason).slice(0, 100),
            at: new Date().toISOString(),
          });
          send(ws, { t: "chat-notice", text: "Report recorded." });
        }
      } catch (error) {
        send(ws, {
          t: c.hub ? "party-chat-notice" : "chat-notice",
          text: error.message.slice(0, 180),
        });
        console.error("Socket request:", error.message);
      }
    });
    ws.on("close", () => {
      clearTimeout(deadline);
      all.delete(c);
      if (c.hub && c.user && hubs.get(c.user.id) === c) {
        hubs.delete(c.user.id);
        c.where = null;
        updatePresence(c);
      } else if (!c.hub) {
        const members = rooms.get(c.room);
        if (members?.delete(c)) {
          broadcast(c.room, { t: "leave", id: c.id });
          competition.left(c);
          cups?.left(c);
          if (!members.size) rooms.delete(c.room);
        }
      }
    });
  });
  const heartbeat = setInterval(() => {
    for (const c of all) {
      if (Date.now() - c.last > 45000) c.ws.close(4003, "Heartbeat timeout");
      else if (
        c.user &&
        (!store.authenticate(c.token) || store.banned(c.user.id))
      )
        c.ws.close(4004, "Session unavailable");
    }
  }, 10000);
  heartbeat.unref();
  return {
    transport,
    competition,
    population,
    populations,
    friendsChanged,
    rooms,
    hubs,
    setCups(value) {
      cups = value;
    },
    count: () => [...all].filter((c) => c.user && !c.hub).length,
    disconnectAccount(id) {
      for (const c of all)
        if (c.user?.id === id) c.ws.close(4004, "Account unavailable");
    },
    close() {
      clearInterval(heartbeat);
      competition.close();
      cups?.close();
      for (const c of all) c.ws.terminate();
      wss.close();
    },
  };
}
