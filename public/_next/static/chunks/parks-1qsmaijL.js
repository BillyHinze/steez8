import "./live-protocol-j28FoPiw.js";
import {a as e, s as t, t as n} from "./season-BrQumfIM.js";
var r = {
    height: {
        min: .8,
        max: 3.2,
        step: .1
    },
    angle: {
        min: -10,
        max: 50,
        step: 1
    },
    distance: {
        min: 1.5,
        max: 8,
        step: .1
    },
    fov: {
        min: 50,
        max: 100,
        step: 1
    },
    stiffness: {
        min: 0,
        max: 100,
        step: 5
    },
    slopeTilt: {
        min: 0,
        max: 100,
        step: 5
    }
}
  , i = {
    height: 1.3,
    angle: 0,
    distance: 4.3,
    firstPerson: !1,
    fov: 58,
    speedFov: !0,
    stiffness: 50,
    slopeTilt: 100,
    trickCam: !0
}
  , a = `cork7-camera-rig`
  , o = (e, {min: t, max: n, step: r}, i) => Math.round(Math.min(n, Math.max(t, typeof e == `number` && Number.isFinite(e) ? e : i)) / r) * r;
function s(e) {
    let t = e && typeof e == `object` ? e : {};
    return {
        height: +o(t.height, r.height, i.height).toFixed(1),
        angle: +o(t.angle, r.angle, i.angle).toFixed(0),
        distance: +o(t.distance, r.distance, i.distance).toFixed(1),
        firstPerson: t.firstPerson === !0,
        fov: +o(t.fov, r.fov, i.fov).toFixed(0),
        speedFov: typeof t.speedFov == `boolean` ? t.speedFov : i.speedFov,
        stiffness: +o(t.stiffness, r.stiffness, i.stiffness).toFixed(0),
        slopeTilt: +o(t.slopeTilt, r.slopeTilt, i.slopeTilt).toFixed(0),
        trickCam: typeof t.trickCam == `boolean` ? t.trickCam : i.trickCam
    }
}
function c() {
    try {
        return s(JSON.parse(localStorage.getItem(a) ?? `null`))
    } catch {
        return {
            ...i
        }
    }
}
function l(e) {
    let t = s(e);
    try {
        localStorage.setItem(a, JSON.stringify(t))
    } catch {}
    return t
}
var u = e => e === `host` ? `guest` : `host`
  , d = {
    intro: 7e3,
    present: 4500,
    count: 3e3,
    posted: 4500,
    winner: 7e3,
    startLimit: 15e3,
    runClock: 180,
    runLimit: 21e4,
    leaveGrace: 1e4,
    decideAfter: 12e3,
    silentShow: 3e3,
    stillLimit: 3e4,
    silentLimit: 45e3,
    waitLimit: 9e4
}
  , f = [`left`, `gone`, `silent`, `stalled`]
  , p = {
    forestline: 240
};
function m(e=`apex`) {
    let t = p[e] ?? d.runClock;
    return {
        runClock: t,
        runLimit: d.runLimit + (t - d.runClock) * 1e3
    }
}
var h = (e, t) => t && e === `forestline` ? 1 : 2
  , ee = {
    intro: d.intro,
    present: d.present,
    count: d.count,
    posted: d.posted,
    winner: d.winner
}
  , g = (e, t) => e === `count` || e === `present` && t <= d.count / 1e3 ? Math.max(1, Math.ceil(t)) : null;
function _(e=`host`, t=0) {
    return {
        seq: t,
        phase: `waiting`,
        drop: 0,
        first: e,
        runs: {
            host: [, , ].fill(null),
            guest: [, , ].fill(null)
        },
        winner: null,
        walkover: !1
    }
}
var v = e => Math.floor(e / 2) + 1
  , y = (e, t) => t % 2 == 0 ? e.first : u(e.first)
  , b = e => typeof e == `number` ? e : 0
  , x = e => Math.max(0, ...e.map(b))
  , S = e => e.filter(e => e !== null).length;
function C(e) {
    let t = e => e.map(b).sort( (e, t) => t - e)
      , n = t(e.host)
      , r = t(e.guest);
    for (let e = 0; e < Math.max(n.length, r.length); e++) {
        if ((n[e] ?? 0) > (r[e] ?? 0))
            return `host`;
        if ((r[e] ?? 0) > (n[e] ?? 0))
            return `guest`
    }
    return `draw`
}
function te(e) {
    let t = x(e.host)
      , n = x(e.guest);
    return t === n ? null : t > n ? {
        role: `host`,
        by: t - n
    } : {
        role: `guest`,
        by: n - t
    }
}
var w = (e, t) => ({
    ...e,
    ...t,
    seq: e.seq + 1
});
function ne(e) {
    return e.phase === `waiting` ? w(e, {
        phase: `intro`
    }) : e
}
function re(e, t=4) {
    switch (e.phase) {
    case `intro`:
        return w(e, {
            phase: `present`,
            drop: 0
        });
    case `present`:
    case `count`:
        return w(e, {
            phase: `run`
        });
    case `posted`:
        return e.drop + 1 < t ? w(e, {
            phase: `present`,
            drop: e.drop + 1
        }) : w(e, {
            phase: `winner`,
            winner: C(e.runs)
        });
    case `winner`:
        return w(e, {
            phase: `over`
        });
    default:
        return e
    }
}
function ie(e, t, n, r) {
    return n !== e.drop || y(e, n) !== t || e.phase !== `run` && e.phase !== `count` && e.phase !== `present` ? e : w(e, {
        phase: `posted`,
        runs: {
            ...e.runs,
            [t]: e.runs[t].map( (e, t) => t === v(n) - 1 ? r : e)
        }
    })
}
function ae(e, t) {
    return e.phase === `winner` || e.phase === `over` ? e : w(e, {
        phase: `winner`,
        winner: u(t),
        walkover: !0
    })
}
function oe(e) {
    return {
        ..._(u(e.first), e.seq + 1),
        phase: `intro`
    }
}
var se = e => typeof e == `number` ? Math.max(0, Math.round(e)) : e === `dns` ? -2 : e === `dnf` ? -3 : -1
  , ce = e => e >= 0 ? e : e === -2 ? `dns` : e === -3 ? `dnf` : null
  , T = [`invite`, `accept`, `decline`, `cancel`, `start`, `hello`, `state`, `result`, `rematch`, `bye`, `camera`, `move`]
  , E = [`apex`, `bigair`, `forestline`, `halfpipe`]
  , D = [`apex`, `bigair`]
  , O = 6e4
  , k = e => E.includes(e)
  , A = e => k(e) ? e : `apex`
  , j = [`waiting`, `intro`, `present`, `count`, `run`, `posted`, `winner`, `over`]
  , M = /^[a-z0-9]{8}$/
  , N = (e, t=`apex`) => t === `apex` ? `duel-${e}` : `duel-${t}-${e}`;
function P(e) {
    let t = /^duel-(?:(bigair|forestline|halfpipe)-)?([a-z0-9]{8})$/.exec(e);
    return t ? {
        code: t[2],
        park: t[1] ?? `apex`
    } : null
}
var F = e => P(e) !== null
  , I = (e, t=`apex`) => t === `apex` ? `team-${e}` : `team-${t}-${e}`;
function L(e=Math.random) {
    let t = ``;
    for (let n = 0; n < 8; n++)
        t += `0123456789abcdefghijklmnopqrstuvwxyz`[Math.floor(e() * 36)];
    return t
}
var R = 36e5
  , z = e => [e.code, e.quiet, e.up, e.off, e.tries, +!!e.hidden, e.froze].map(e => Math.max(0, Math.min(R, Math.round(e)))).join(`.`)
  , B = (e, t, n) => typeof e == `number` && Number.isInteger(e) && e >= t && e <= n
  , V = 2e6;
function H(e) {
    if (!e || typeof e != `object` || Array.isArray(e))
        return null;
    let t = e
      , n = t.op;
    if (typeof n != `string` || !T.includes(n))
        return null;
    let r = {
        op: n
    };
    if (t.to !== void 0) {
        if (!B(t.to, 1, 255))
            return null;
        r.to = t.to
    }
    if (n === `invite` || n === `accept` || n === `decline` || n === `cancel` || n === `start`) {
        if (typeof t.code != `string` || !M.test(t.code))
            return null;
        if (r.code = t.code,
        n === `invite`) {
            if (!D.includes(t.park))
                return null;
            r.park = t.park
        }
        if ((n === `accept` || n === `decline` || n === `start`) && r.to === void 0)
            return null
    }
    if (n === `hello` && (r.host = t.host === !0),
    n === `rematch` && t.park !== void 0) {
        if (!k(t.park))
            return null;
        r.park = t.park
    }
    if (n === `move`) {
        if (typeof t.code != `string` || !M.test(t.code) || !k(t.park))
            return null;
        r.code = t.code,
        r.park = t.park
    }
    if (t.v !== void 0) {
        if (!B(t.v, 1, 99))
            return null;
        r.v = t.v
    }
    if (n === `state`) {
        if (!B(t.seq, 0, 1e6) || !j.includes(t.phase) || !B(t.drop, 0, 3) || t.first !== `h` && t.first !== `g` || !Array.isArray(t.runs) || t.runs.length !== 4 && t.runs.length !== 8 || !t.runs.every(e => B(e, -3, V)) || t.win !== `` && t.win !== `h` && t.win !== `g` && t.win !== `d` || !B(t.left, -1, 6e5))
            return null;
        Object.assign(r, {
            seq: t.seq,
            phase: t.phase,
            drop: t.drop,
            first: t.first,
            runs: [...t.runs],
            win: t.win,
            wo: t.wo === !0,
            left: t.left
        })
    }
    if (n === `result`) {
        if (!B(t.drop, 0, 3) || !B(t.score, -3, V) || t.score === -1)
            return null;
        r.drop = t.drop,
        r.score = t.score
    }
    if (n === `camera`) {
        if (!t.camera || typeof t.camera != `object` || Array.isArray(t.camera))
            return null;
        r.camera = s(t.camera)
    }
    return r
}
function U(e) {
    let t = H(e)
      , n = e;
    return !t || !n || !B(n.id, 1, 255) || typeof n.name != `string` ? null : {
        ...t,
        id: n.id,
        name: n.name.slice(0, 40)
    }
}
var W = `apex-2026-10-18`
  , G = t
  , le = `apex-2026-10`
  , ue = `apex-2026-09`
  , de = `APEX BETA`
  , K = `bigair-2026-10-18`
  , fe = t
  , pe = `bigair-2026-10`
  , q = `forestline-2026-10-18`
  , me = t
  , J = `halfpipe-2026-10-18`
  , he = t
  , Y = {
    nordryggen: {
        id: `nordryggen`,
        name: `THE YARD`,
        subtitle: `Nordryggen · Open Session`,
        course: `nordryggen-v1`,
        length: `3.96 KM`,
        features: `15 JUMPS · 5 RAIL ZONES`,
        description: `Find your line. Make it your own.`,
        multiplayer: !0,
        leaderboard: !0,
        room: `nordryggen`,
        season: e,
        shortestRunMs: 6e4,
        topSpeedKmh: 160,
        start: 0
    },
    apex: {
        id: `apex`,
        name: `APEX`,
        subtitle: `Pro Grounds`,
        course: `apex-v1`,
        length: `1.6 KM`,
        features: `4 KICKERS · 2 RAIL ZONES`,
        description: `Big lines. Precision landings.`,
        multiplayer: !0,
        leaderboard: !0,
        room: `apex`,
        season: W,
        shortestRunMs: 3e4,
        topSpeedKmh: 160,
        start: 35
    },
    shirakumo: {
        id: `shirakumo`,
        name: `SHIRAKUMO`,
        subtitle: `Powder Basin`,
        course: `shirakumo-v8`,
        length: `3.2 KM`,
        features: `DEEP POWDER · NATURAL DROPS`,
        description: `From the white room to the snow ghosts.`,
        multiplayer: !0,
        leaderboard: !1,
        room: `shirakumo`,
        season: `shirakumo-local`,
        shortestRunMs: 9e4,
        topSpeedKmh: 160,
        start: -10
    },
    bigair: {
        id: `bigair`,
        name: `BIG AIR`,
        subtitle: `Extreme Grounds`,
        course: `bigair-v7`,
        length: `0.73 KM`,
        features: `1 MEGA KICKER · FOREST DROP`,
        description: `Drop fast. Go big. Ride it out.`,
        multiplayer: !0,
        leaderboard: !0,
        room: `bigair`,
        season: K,
        shortestRunMs: 15e3,
        topSpeedKmh: 190,
        start: 27
    },
    forestline: {
        id: `forestline`,
        name: `FOREST LINE`,
        subtitle: `Woodland Rail Park`,
        course: `forestline-v2`,
        length: `3.84 KM`,
        features: `15 JUMPS · 8 RAIL ZONES`,
        description: `Natural shelves. Long steel. Find your flow.`,
        multiplayer: !0,
        leaderboard: !0,
        room: `forestline`,
        season: q,
        shortestRunMs: 9e4,
        topSpeedKmh: 160,
        start: 20
    },
    ridgeline: {
        id: `ridgeline`,
        name: `RIDGELINE`,
        subtitle: `Progression Ridge · New`,
        course: `ridgeline-v1`,
        length: `1.6 KM`,
        features: `5 FLOW KICKERS · SIDE HIP · 2 RAIL ZONES`,
        description: `Warm up on steel. Find your rhythm. Take the side quest.`,
        multiplayer: !0,
        leaderboard: !0,
        room: `ridgeline`,
        season: `ridgeline-2026-11`,
        shortestRunMs: 3e4,
        topSpeedKmh: 160,
        start: 35
    },
    halfpipe: {
        id: `halfpipe`,
        name: `ASPEN PIPE`,
        subtitle: `Forest Superpipe`,
        course: `halfpipe-v9`,
        length: `0.8 KM`,
        features: `600 M SUPERPIPE · T-BAR`,
        description: `Find the rhythm. Rise above the trees.`,
        multiplayer: !0,
        leaderboard: !0,
        room: `halfpipe`,
        season: J,
        shortestRunMs: 15e3,
        topSpeedKmh: 160,
        start: 14
    }
}
  , X = e => e === `ridgeline` ? `ridgeline` : e === `halfpipe` ? `halfpipe` : e === `forestline` ? `forestline` : e === `bigair` ? `bigair` : e === `shirakumo` ? `shirakumo` : e === `apex` ? `apex` : `nordryggen`
  , Z = e => e === `ridgeline-v1` ? `ridgeline` : e === `halfpipe-v9` ? `halfpipe` : e === `forestline-v2` || e === `forestline-v1` ? `forestline` : e === `bigair-v7` ? `bigair` : e === `shirakumo-v8` ? `shirakumo` : e === `nordryggen-v1` ? `nordryggen` : e === `apex-v1` || e === `flowline-v12` ? `apex` : null
  , ge = e => {
    let t = Z(e);
    return t ? Y[t].name : `UNKNOWN PARK`
}
  , _e = e => e === `nordryggen` ? n : e === `apex` ? `${Y.apex.course}:whiteout-best:${W}` : e === `bigair` || e === `forestline` || e === `halfpipe` ? `${Y[e].course}:whiteout-best:${Y[e].season}` : `${Y[e].course}:${n}`;
function ve(e, t=`solo`, n, r, i=!1) {
    let a = new URLSearchParams({
        park: e,
        mode: Y[e].multiplayer ? t : `solo`
    });
    return n && a.set(`replay`, n),
    t === `live` && Y[e].multiplayer && i ? a.set(`party`, `1`) : r && r > 1 && t === `live` && Y[e].multiplayer && a.set(`room`, String(r)),
    `/?${a}`
}
function ye(e) {
    let t = new URLSearchParams(e);
    for (let e of [`park`, `mode`, `replay`, `choose`, `duel`, `vs`, `host`, `test`, `bot`, `botride`, `size`, `watch`, `room`, `party`, `ranked`, `search`, ...Te])
        t.delete(e);
    let n = t.toString();
    return n ? `?${n}` : ``
}
function be(e) {
    let t = new URLSearchParams(e);
    t.get(`cup`) === `test` && !t.has(`park`) && (t.set(`park`, `apex`),
    t.set(`mode`, `live`),
    t.set(`test`, `cup`));
    let n = X(t.get(`park`));
    return {
        id: n,
        mode: t.get(`mode`) === `live` && Y[n].multiplayer ? `live` : `solo`,
        start: t.has(`park`),
        replay: t.get(`replay`),
        choose: t.get(`choose`) === `live` ? `live` : t.has(`choose`) ? `solo` : null,
        duel: Se(t, n),
        team: De(t, n),
        watch: we(t, n),
        cup: Ce(t, n),
        test: t.get(`test`) === `room` ? `room` : t.get(`test`) === `cup` && $.includes(n) ? `train` : null,
        bot: t.get(`bot`) === `pro` || t.get(`bot`) === `easy` ? t.get(`bot`) : null,
        botBoard: t.get(`botride`) === `board`,
        queue: !t.has(`park`) && (t.get(`ranked`) === `1` || t.get(`ranked`) === `test` && t.get(`search`) === `1`),
        rankedTest: (!t.has(`park`) || t.get(`team`) === `test`) && t.get(`ranked`) === `test`,
        queueSize: t.get(`size`) === `2v2` ? `2v2` : `1v1`,
        room: Q(t, n),
        party: xe(t, n)
    }
}
function xe(e, t) {
    return e.get(`party`) === `1` && e.get(`mode`) === `live` && Y[t].multiplayer && !e.has(`duel`) && !e.has(`watch`) && !e.has(`cup`)
}
function Q(e, t) {
    let n = Number(e.get(`room`));
    return e.get(`mode`) === `live` && Y[t].multiplayer && Number.isInteger(n) && n >= 2 && n <= 30 ? n : null
}
function Se(e, t) {
    let n = e.get(`duel`);
    if (!E.includes(t) || e.get(`mode`) !== `live` || !n || !(n === `test` || /^[a-z0-9]{8}$/.test(n)))
        return null;
    let r = e.get(`ranked`) === `1`;
    return {
        code: n,
        vs: (e.get(`vs`) ?? ``).slice(0, 40) || (n === `test` ? `SNOWBOT` : r ? `` : `RIDER`),
        host: e.get(`host`) !== `0`,
        ranked: r
    }
}
function Ce(e, t) {
    let n = e.get(`cup`);
    return n && /^[a-z0-9]{8}$/.test(n) && e.get(`mode`) === `live` && !e.has(`duel`) && $.includes(t) ? {
        code: n,
        watch: e.get(`cupwatch`) === `1`
    } : null
}
function we(e, t) {
    let n = e.get(`watch`);
    return E.includes(t) && e.get(`mode`) === `live` && !e.has(`duel`) && !e.has(`team`) && n && /^[a-z0-9]{8}$/.test(n) ? n : null
}
var Te = [`team`, `slot`, `l1`, `l2`, `r1`, `r2`]
  , Ee = [`L1`, `L2`, `R1`, `R2`];
function De(e, t) {
    let n = e.get(`team`);
    if (!E.includes(t) || e.get(`ranked`) === `1` && t !== `apex` || e.get(`mode`) !== `live` || e.has(`duel`) || !n || !(n === `test` || /^[a-z0-9]{8}$/.test(n)))
        return null;
    let r = Ee.find(t => t === e.get(`slot`)) ?? `L1`
      , i = t => (e.get(t.toLowerCase()) ?? ``).slice(0, 40) || `RIDER`
      , a = e.get(`t`) === `2` || n === `test` && e.get(`t`) !== `1`;
    return {
        code: n,
        slot: r,
        names: {
            L1: i(`L1`),
            L2: i(`L2`),
            R1: i(`R1`),
            R2: i(`R2`)
        },
        ranked: e.get(`ranked`) === `1`,
        together: a
    }
}
function Oe(e, t, n, r=!1, i=`apex`, a=!1) {
    return `/?${new URLSearchParams({
        park: i,
        mode: `live`,
        team: e,
        slot: t,
        l1: n.L1,
        l2: n.L2,
        r1: n.R1,
        r2: n.R2,
        ...r ? {
            ranked: `1`
        } : {},
        ...a ? {
            t: `2`
        } : {}
    })}`
}
var $ = [`apex`, `forestline`, `halfpipe`, `bigair`]
  , ke = e => `/?${new URLSearchParams({
    park: e,
    mode: `live`,
    test: `cup`
})}`
  , Ae = (e, t=`apex`) => `/?${new URLSearchParams({
    park: t,
    mode: `live`,
    watch: e
})}`;
function je(e, t, n, r, i=`apex`, a=!1) {
    let o = new URLSearchParams({
        park: i,
        mode: `live`,
        duel: e,
        vs: t,
        host: n ? `1` : `0`
    });
    return r && o.set(`bot`, r),
    a && o.set(`ranked`, `1`),
    `/?${o}`
}
export {ie as A, de as APEX_BETA_LABEL, ue as APEX_BETA_SEASON, le as APEX_LAST_SEASON, W as APEX_SEASON, G as APEX_SEASON_ENDS, pe as BIG_AIR_LAST_SEASON, K as BIG_AIR_SEASON, fe as BIG_AIR_SEASON_ENDS, v as C, se as D, te as E, r as F, q as FOREST_LINE_SEASON, me as FOREST_LINE_SEASON_ENDS, J as HALFPIPE_SEASON, he as HALFPIPE_SEASON_ENDS, i as I, s as L, S as M, b as N, _ as O, ae as P, Y as PARKS, c as R, y as S, h as T, ne as _, A as a, g as b, k as c, U as d, je as duelUrl, I as f, re as g, ee as h, H as i, oe as j, u as k, F as l, d as m, O as n, N as o, f as p, Z as parkForCourse, X as parkId, ge as parkLabel, ve as parkUrl, D as r, be as readParkRoute, _e as recordKey, z as s, ye as spentRoute, E as t, Oe as teamUrl, ke as trainUrl, L as u, x as v, m as w, Ae as watchUrl, C as x, ce as y, l as z};
