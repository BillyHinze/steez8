import {a as e, n as t, t as n} from "./live-protocol-j28FoPiw.js";
import {A as r, C as i, D as a, E as o, M as s, N as c, O as l, P as u, S as d, _ as f, b as ee, g as te, h as ne, j as re, k as p, m, u as ie, v as h, w as ae, x as oe, y as se} from "./parks-1qsmaijL.js";
import {t as ce} from "./chat-DlnF30mF.js";
import {Rn as le, d as ue} from "./active-course-BUb4R-L7.js";
import {d as de, i as fe} from "./rider-appearance-Cs5aq3V7.js";
import {Ft as pe} from "./rider-outfit-BI9AmbRj.js";
import {m as me} from "./replay-Bo7bmJ9f.js";
var he = [`nordryggen`, `apex`, `shirakumo`, `bigair`, `forestline`, `halfpipe`]
  , ge = 3e4
  , _e = 3e4
  , ve = `/parties/friends/hub`
  , ye = `{"t":"ping"}`
  , be = {
    slow: 4014,
    idle: 4002,
    refused: 4004,
    lapsed: 4015,
    tabs: 4006
}
  , xe = 3e4
  , Se = 6e4
  , Ce = 5 * 6e4
  , we = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  , Te = e => typeof e == `string` && we.test(e);
function Ee(e) {
    try {
        let t = e.split(`.`)[1];
        if (!t)
            return null;
        let n = JSON.parse(atob(t.replace(/-/g, `+`).replace(/_/g, `/`).padEnd(Math.ceil(t.length / 4) * 4, `=`)));
        return typeof n.sub == `string` && typeof n.exp == `number` && Number.isFinite(n.exp) ? {
            sub: n.sub,
            exp: n.exp * 1e3
        } : null
    } catch {
        return null
    }
}
function De(e) {
    if (!Array.isArray(e))
        return null;
    let t = [];
    for (let n of e)
        !n || !Te(n.account) || typeof n.handle != `string` || n.state !== `friends` && n.state !== `you-asked` && n.state !== `asked-you` || t.push({
            account: n.account,
            handle: n.handle,
            state: n.state
        });
    return t
}
var Oe = 1e4
  , ke = 6e4;
function Ae(e) {
    if (!e || typeof e != `object`)
        return null;
    let t = e;
    if (typeof t.from?.id != `string` || typeof t.from.name != `string`)
        return null;
    let n = {
        id: t.from.id.slice(0, 36),
        name: t.from.name.slice(0, 40)
    }
      , r = typeof t.age == `number` && t.age >= 0 ? t.age : 0;
    return typeof t.text == `string` ? {
        from: n,
        text: t.text.slice(0, 240),
        age: r
    } : typeof t.quick == `number` && Number.isInteger(t.quick) && t.quick >= 0 && t.quick < ce.length ? {
        from: n,
        quick: t.quick,
        age: r
    } : null
}
var je = (e, t) => `party-${e}-${t}`
  , Me = e => typeof e == `string` && /^[a-z0-9]{16}$/.test(e)
  , Ne = `cork7-party-room`;
function Pe(e, t) {
    try {
        sessionStorage.setItem(Ne, `${t}:${e}`)
    } catch {}
}
function Fe(e) {
    try {
        let[t,n] = (sessionStorage.getItem(Ne) ?? ``).split(`:`);
        return t === e && Me(n) ? n : null
    } catch {
        return null
    }
}
function Ie(e) {
    return e?.at === `live` ? e.party ? {
        park: e.park,
        privacy: `private`
    } : {
        park: e.park,
        privacy: `public`,
        ...e.room ? {
            room: e.room
        } : {}
    } : {
        park: null,
        privacy: `private`
    }
}
var Le = (e, t) => e.park === t.park && (e.park === null || e.privacy === t.privacy && (e.room ?? 1) === (t.room ?? 1));
function Re(e, t, n, r) {
    return e.park === null ? !0 : n?.at !== `live` || n.park !== e.park ? !1 : e.privacy === `private` ? n.party === !0 && r === t : !n.party && (n.room ?? 1) === (e.room ?? 1)
}
function ze(e, t, n) {
    return e?.at !== `live` || e.party || t?.at === `duel` || n && n.park !== null && Le(Ie(e), n) || t?.at === `live` && !t.party && t.park === e.park && (t.room ?? 1) === (e.room ?? 1) ? null : {
        park: e.park,
        ...e.room ? {
            room: e.room
        } : {}
    }
}
function Be(e) {
    if (!e.settled)
        return {
            kind: `wait`
        };
    if (!e.party)
        return {
            kind: e.known && e.roomKey ? `leave` : `none`
        };
    if (e.roomKey && e.roomKey !== e.party.key && e.where?.at === `live`)
        return {
            kind: `rekey`,
            park: e.where.park
        };
    if (e.busy)
        return {
            kind: `wait`
        };
    let t = `${e.party.id}:${e.party.dest.n}`;
    return e.done === t ? {
        kind: `none`
    } : Re(e.party.dest, e.party.key, e.where, e.roomKey) ? {
        kind: `done`,
        tag: t
    } : {
        kind: e.told === t || e.where?.at === `lobby` ? `go` : `warn`,
        tag: t
    }
}
function Ve(e) {
    return Array.isArray(e) ? e.filter(e => typeof e?.code == `string` && /^[a-z0-9]{8}$/.test(e.code)).slice(0, 12).map(e => ({
        code: e.code,
        host: String(e.host ?? ``).slice(0, 40),
        guest: String(e.guest ?? ``).slice(0, 40),
        watching: Math.max(0, Math.min(1e3, Math.round(Number(e.watching) || 0))),
        live: e.live !== !1
    })) : []
}
function He(e) {
    let t = e;
    return !t || t.park !== `apex` && t.park !== `bigair` || !Number.isSafeInteger(t.revision) || t.revision < 0 || !Array.isArray(t.duels) ? null : {
        park: t.park,
        revision: t.revision,
        duels: Ve(t.duels)
    }
}
var Ue = class {
    constructor() {
        this.latest = new Map
    }
    receive(e) {
        return e.revision <= (this.latest.get(e.park)?.revision ?? -1) ? !1 : (this.latest.set(e.park, e),
        !0)
    }
    merge(e, t) {
        if (!t || e !== `apex` && e !== `bigair`)
            return t;
        t.duelsRevision !== void 0 && this.receive({
            park: e,
            revision: t.duelsRevision,
            duels: t.duels ?? []
        });
        let n = this.latest.get(e);
        return n ? {
            ...t,
            duels: n.duels,
            duelsRevision: n.revision
        } : t
    }
}
  , We = `STEEZ8 CUP`
  , g = [`apex`, `forestline`, `halfpipe`, `bigair`];
function Ge(e, t=30) {
    let n = Math.max(1, e.length)
      , r = Math.max(1, Math.min(30, Math.round(t)))
      , i = Math.min(5, r);
    return e.flatMap( (e, t) => {
        if (t < n - 1)
            return [{
                map: e,
                riders: Math.round(r - t * (r - i) / (n - 1)),
                leg: t
            }];
        let a = n === 1 ? r : i;
        return e === `bigair` ? [1, 2].map(n => ({
            map: e,
            riders: a,
            leg: t,
            final: !0,
            jump: n
        })) : [{
            map: e,
            riders: a,
            leg: t,
            final: !0
        }]
    }
    )
}
var _ = Ge(g, 20);
g.length + 1;
var v = {
    intro: 25e3,
    onLine: 5e3,
    lineup: 25e3,
    count: 3e3,
    results: 8e3,
    podium: 12e4,
    run: {
        apex: 15e4,
        forestline: 15e4,
        halfpipe: 12e4,
        bigair: 6e4
    }
}
  , Ke = 19e3
  , y = e => e.runs?.length ? e.runs : _
  , qe = e => {
    let t = y(e);
    return t[Math.min(e.run, t.length - 1)]
}
  , b = e => qe(e).map
  , Je = e => {
    let t = y(e);
    return t[t.length - 1].leg + 1
}
  , x = (e, t, n, r) => {
    e.phase = t,
    e.at = n,
    e.ends = n + r
}
;
function Ye(e, t, n=`zero`, r=_) {
    let i = (r.length ? r : _).map(e => ({
        ...e
    }));
    return {
        run: 0,
        runs: i,
        phase: `lineup`,
        at: t,
        ends: t + v.intro + v.onLine,
        here: [],
        finalRule: n,
        riders: e.slice(0, i[0].riders).map( (e, t) => ({
            id: e.id,
            name: e.name,
            slot: t,
            marks: i.map( () => null),
            gone: !1,
            cutAt: null
        }))
    }
}
var S = (e, t) => !e.gone && (e.cutAt === null || t < e.cutAt)
  , C = (e, t=e.run) => e.riders.filter(e => S(e, t))
  , Xe = (e, t) => e.riders.find(e => e.id === t) ?? null
  , Ze = e => C(e).every(t => t.marks[e.run] !== null)
  , w = e => typeof e == `number` ? e : 0
  , T = (e, t=_) => t.reduce( (t, n, r) => n.final ? t : t + w(e.marks[r]), 0)
  , Qe = (e, t=_) => Math.max(0, ...t.map( (t, n) => t.final ? w(e.marks[n]) : 0))
  , E = (e, t) => Math.max(0, ...t.map( (t, n) => t.final ? 0 : w(e.marks[n])))
  , $e = (e, t, n=_) => Qe(e, n) + (t === `total` ? T(e, n) : 0)
  , et = e => {
    let t = y(e);
    return !!t[e.run]?.final && !t[e.run - 1]?.final
}
  , tt = e => e.run === 0 || et(e)
  , nt = (e, t) => e.run === 0 && e.phase === `lineup` && t - e.at < v.intro ? Math.max(0, t - e.at) : null;
function rt(e, t, n) {
    let r = Xe(e, t);
    return e.phase !== `lineup` || !r || !S(r, e.run) || e.here.includes(t) ? !1 : (e.here.push(t),
    !tt(e) && C(e).every(t => e.here.includes(t.id)) && x(e, `count`, n, v.count),
    !0)
}
function it(e, t, n, r) {
    let i = Xe(e, t);
    return e.phase !== `run` || !i || !S(i, e.run) || i.marks[e.run] !== null ? !1 : (i.marks[e.run] = typeof n == `number` ? Math.max(0, Math.round(n)) : n,
    Ze(e) && x(e, `results`, r, v.results),
    !0)
}
function at(e, t, n) {
    let r = Xe(e, t);
    if (!r || r.gone || e.phase === `over` || r.cutAt !== null && r.cutAt <= e.run)
        return !1;
    let i = S(r, e.run);
    r.gone = !0;
    for (let t = e.run; t < r.marks.length; t++)
        (r.cutAt === null || t < r.cutAt) && (r.marks[t] ??= `dnf`);
    return C(e).length ? (i && (e.phase === `lineup` && !tt(e) && C(e).every(t => e.here.includes(t.id)) ? x(e, `count`, n, v.count) : e.phase === `run` && Ze(e) && x(e, `results`, n, v.results)),
    !0) : (x(e, `over`, n, 0),
    !0)
}
function ot(e, t=e.run) {
    let n = y(e)
      , r = n[t + 1]
      , i = C(e, t).sort( (e, t) => T(t, n) - T(e, n) || E(t, n) - E(e, n) || e.slot - t.slot);
    return r ? i.slice(0, r.riders) : []
}
function st(e, t) {
    if (e.phase === `over` || t < e.ends)
        return !1;
    if (e.phase === `lineup`)
        x(e, `count`, t, v.count);
    else if (e.phase === `count`)
        x(e, `run`, t, v.run[b(e)]);
    else if (e.phase === `run`) {
        for (let t of C(e))
            t.marks[e.run] ??= `dnf`;
        x(e, `results`, t, v.results)
    } else if (e.phase === `results`) {
        if (e.run + 1 >= y(e).length)
            return x(e, `over`, t, 0),
            !0;
        let n = new Set(ot(e).map(e => e.id));
        for (let t of C(e))
            n.has(t.id) || (t.cutAt = e.run + 1);
        e.run++,
        e.here = [],
        x(e, `lineup`, t, v.lineup)
    }
    return !0
}
function ct(e, t=e.finalRule) {
    let n = y(e)
      , r = n.findIndex(e => e.final)
      , i = t => S(t, r) && e.run >= r
      , a = e => e.gone ? -1 : e.cutAt === null ? n.length : e.cutAt
      , o = e => i(e) ? $e(e, t, n) : T(e, n)
      , s = [...e.riders].sort( (e, t) => a(t) - a(e) || o(t) - o(e) || E(t, n) - E(e, n) || e.slot - t.slot)
      , c = 0;
    return s.map(e => ({
        id: e.id,
        name: e.name,
        place: e.gone ? null : ++c,
        score: o(e),
        total: T(e, n),
        marks: [...e.marks],
        gone: e.gone,
        cutAt: e.cutAt,
        finalist: i(e)
    }))
}
function lt(e, t=e.run) {
    return e.riders.filter(e => typeof e.marks[t] == `number`).sort( (e, n) => w(n.marks[t]) - w(e.marks[t]) || e.slot - n.slot).map( (e, n) => ({
        id: e.id,
        name: e.name,
        place: n + 1,
        score: w(e.marks[t])
    }))
}
function ut(e, t) {
    let n = Math.max(1, Math.min(t, 30))
      , r = Math.max(0, Math.min(e, n - 1))
      , i = Math.ceil(r / 2) * (r % 2 ? 1 : -1) || 0;
    return n % 2 ? i : i - .5
}
function dt(e, t) {
    let n = e.run === 0 ? C(e).sort( (e, t) => e.slot - t.slot) : ft(e);
    return Math.max(0, n.findIndex(e => e.id === t))
}
function ft(e) {
    let t = y(e);
    return C(e).sort( (e, n) => T(n, t) - T(e, t) || E(n, t) - E(e, t) || e.slot - n.slot)
}
var pt = [20, 40, 60, 80, 100, 200, 400]
  , mt = `apex`
  , ht = {
    room: 20,
    advance: 4
};
function gt(e, t=20) {
    let n = Math.max(1, Math.ceil(e / Math.max(1, t)))
      , r = Math.floor(e / n)
      , i = e % n;
    return Array.from({
        length: n
    }, (e, t) => r + +(t < i))
}
function _t(e, t=ht) {
    return e * t.advance <= t.room ? Math.max(t.advance, Math.floor(t.room / e)) : t.advance
}
function vt(e, t=ht) {
    let n = []
      , r = e;
    for (let e = 0; r > t.room && e < 8; e++) {
        let e = gt(r, t.room)
          , i = t => e.reduce( (e, n) => e + Math.min(n, t), 0)
          , a = _t(e.length, t);
        i(a) >= r && (a = Math.max(1, Math.floor(t.room / e.length))),
        n.push({
            heats: e,
            advance: a
        }),
        r = i(a)
    }
    return {
        rounds: n,
        final: r
    }
}
var D = /^[a-z0-9]{8}$/
  , yt = e => `cup-${e}`
  , bt = (e, t, n=!1) => `/?${new URLSearchParams({
    park: e,
    mode: `live`,
    cup: t,
    ...n ? {
        cupwatch: `1`
    } : {}
})}`;
function xt(t) {
    let n = e(t);
    return n ? `/?${new URLSearchParams({
        park: n.base,
        mode: `live`,
        ...n.n > 1 ? {
            room: String(n.n)
        } : {}
    })}` : `/`
}
_[0].map;
var St = 1e7
  , Ct = [2, 5, 10, 15, 30]
  , wt = {
    maps: [...g],
    seats: 30,
    min: null,
    max: null,
    final: `zero`
};
function Tt(e) {
    if (!e || typeof e != `object`)
        return null;
    let t = e;
    if (!Array.isArray(t.maps) || !t.maps.length || t.maps.length > g.length)
        return null;
    let n = t.maps.filter( (e, t, n) => g.includes(e) && n.indexOf(e) === t);
    if (n.length !== t.maps.length || !Number.isInteger(t.seats) || t.seats < 2 || t.seats > 400)
        return null;
    let r = e => e == null ? null : Number.isInteger(e) && e >= 0 && e <= 1e7 ? e : void 0
      , i = r(t.min)
      , a = r(t.max);
    if (i === void 0 || a === void 0 || i !== null && a !== null && i > a || t.final !== `zero` && t.final !== `total`)
        return null;
    let o = t.startIn;
    return o != null && !Ct.includes(o) ? null : {
        maps: n,
        seats: t.seats,
        min: i,
        max: a,
        final: t.final,
        ...typeof o == `number` ? {
            startIn: o
        } : {},
        ...t.checked === !0 ? {
            checked: !0
        } : {}
    }
}
function Et(e) {
    if (!Array.isArray(e))
        return;
    let t = e.slice(0, 12).map(e => e).filter(e => !!e && typeof e.name == `string` && typeof e.score == `number` && Number.isFinite(e.score) && e.score >= 0).slice(0, 3).map(e => ({
        name: e.name.slice(0, 40),
        score: Math.round(e.score)
    }));
    return t.length ? t : void 0
}
var Dt = 5 * 6e4;
function Ot(t) {
    if (!t || typeof t != `object`)
        return null;
    let n = t
      , r = (e, t, n) => Number.isInteger(e) && e >= t && e <= n;
    if (typeof n.code != `string` || !D.test(n.code) || typeof n.live != `boolean` || !g.includes(n.map) || !r(n.leg, 1, g.length) || !r(n.legs, 1, g.length) || !r(n.riders, 0, 400) || typeof n.at != `number` || !Number.isFinite(n.at))
        return null;
    let i = n.open;
    if (i !== void 0 && (!i || typeof i != `object` || typeof i.room != `string` || !e(i.room) || !r(i.seats, 1, 400) || n.live || n.winner !== void 0))
        return null;
    let a = typeof i?.startAt == `number` && Number.isFinite(i.startAt) ? {
        startAt: i.startAt
    } : {}
      , o = n.live && r(n.heats, 2, 20) && typeof n.watch == `string` && D.test(n.watch) ? {
        heats: n.heats,
        watch: n.watch,
        ...r(n.done, 0, n.heats) ? {
            done: n.done
        } : {}
    } : {}
      , s = n.live && !(`heats` in o) && n.final === !0 ? {
        final: !0
    } : {}
      , c = e => typeof e == `string` ? e.slice(0, 40) : ``
      , l = !n.live && n.winner !== void 0 ? Et(n.top) : void 0;
    return {
        code: n.code,
        live: n.live,
        map: n.map,
        leg: n.leg,
        legs: n.legs,
        riders: n.riders,
        admin: c(n.admin),
        at: n.at,
        ...n.winner === void 0 ? {} : {
            winner: c(n.winner)
        },
        ...l ? {
            top: l
        } : {},
        ...i ? {
            open: {
                room: i.room,
                seats: i.seats,
                ...a
            }
        } : {},
        ...o,
        ...s
    }
}
var kt = (e, t) => !!e && t - e.at < (e.open ? 36e5 : e.live ? 54e5 : 3e5)
  , At = e => e.replace(/^ws/, `http`).replace(/\/+$/, ``);
async function O(e, t) {
    let n = new AbortController
      , r = setTimeout( () => n.abort(), 4e3);
    try {
        let r = await fetch(`${At(e)}/parties/mountain/${encodeURIComponent(t)}`, {
            signal: n.signal
        });
        return r.ok ? Nt(await r.json(), t) : null
    } catch {
        return null
    } finally {
        clearTimeout(r)
    }
}
function jt(e) {
    let t = e
      , n = e => typeof e == `number` && Number.isInteger(e) && e >= 0 && e <= 1e6;
    if (!t || typeof t != `object` || !n(t.ranked) || !n(t.friendly) || !n(t.searching))
        return null;
    let r = n(t.teams) && n(t.teamSearching) ? {
        teams: t.teams,
        teamSearching: t.teamSearching
    } : {};
    return {
        ranked: t.ranked,
        friendly: t.friendly,
        searching: t.searching,
        ...r
    }
}
async function Mt(e, t) {
    let n = () => ({
        rooms: Object.fromEntries(t.map(e => [e, null])),
        duels: null,
        cup: null
    }), r = new AbortController, i = setTimeout( () => r.abort(), 4e3), a;
    try {
        a = await fetch(`${At(e)}/populations`, {
            signal: r.signal
        })
    } catch {
        return clearTimeout(i),
        n()
    }
    try {
        if (a.status === 404)
            return clearTimeout(i),
            {
                rooms: Object.fromEntries(await Promise.all(t.map(async t => [t, await O(e, t)]))),
                duels: null,
                cup: null
            };
        if (!a.ok)
            return n();
        let r = await a.json()
          , o = r && typeof r.rooms == `object` && r.rooms !== null ? r.rooms : null;
        return o ? {
            rooms: Object.fromEntries(await Promise.all(t.map(async t => {
                if (!Object.prototype.hasOwnProperty.call(o, t))
                    return [t, await O(e, t)];
                let n = o[t];
                return [t, n && typeof n == `object` ? Nt(n, t) : null]
            }
            ))),
            duels: jt(r.duels),
            cup: (e => kt(e, Date.now()) ? e : null)(Ot(r.cup))
        } : n()
    } catch {
        return n()
    } finally {
        clearTimeout(i)
    }
}
function Nt(e, t) {
    let r = e
      , i = Ve(r.duels)
      , a = Number.isSafeInteger(r.duelsRevision) && r.duelsRevision >= 0 ? {
        duelsRevision: r.duelsRevision
    } : {}
      , o = Number(r.cap) || n[t] || 30
      , s = Number(r.count) || 0
      , c = Pt(r.rooms, t, o)
      , l = c ? c.reduce( (e, t) => e + t.count, 0) : s
      , u = c ? c.length >= 30 && c.every(e => e.count >= o) : s >= o;
    return {
        count: l,
        cap: o,
        riders: Array.isArray(r.riders) ? r.riders.filter(e => typeof e?.id == `number`).map(e => ({
            id: e.id,
            name: String(e.name ?? ``)
        })) : [],
        solo: Number(r.solo) || 0,
        ...i.length ? {
            duels: i
        } : {},
        ...a,
        ...c ? {
            rooms: c
        } : {},
        full: u
    }
}
function Pt(t, n, r) {
    if (!Array.isArray(t))
        return null;
    let i = new Map;
    for (let a of t) {
        let t = typeof a?.room == `string` ? e(a.room) : null
          , o = Number(a?.count);
        t?.base === n && Number.isFinite(o) && o >= 0 && i.set(t.n, Math.min(r, Math.round(o)))
    }
    return [...i].sort( ([e], [t]) => e - t).map( ([e,t]) => ({
        n: e,
        count: t
    }))
}
function Ft(e) {
    if (!e?.rooms)
        return 1;
    let n = new Map(e.rooms.map(e => [e.n, e.count]))
      , r = t(e.cap);
    for (let e = 1; e <= 30; e++)
        if ((n.get(e) ?? 0) < r)
            return e;
    return 1
}
function It(e) {
    let t = e.filter(e => e !== null);
    return t.length ? {
        ...t.reduce( (e, t) => ({
            count: e.count + t.count,
            cap: e.cap + t.cap,
            riders: [...e.riders, ...t.riders],
            solo: e.solo + t.solo
        }), {
            count: 0,
            cap: 0,
            riders: [],
            solo: 0
        }),
        full: t.every(e => e.full ?? e.count >= e.cap)
    } : null
}
var Lt = e => e?.isTrusted === !0
  , Rt = e => typeof Gamepad < `u` && e instanceof Gamepad
  , k = [{
    id: `steerLeft`,
    label: `Carve / spin left`,
    short: `Carve left`,
    hint: `Turns on the snow, spins in the air.`,
    group: `ride`,
    listens: `ride`,
    keys: [`KeyA`],
    buttons: [],
    stick: `left`
}, {
    id: `steerRight`,
    label: `Carve / spin right`,
    short: `Carve right`,
    hint: `Turns on the snow, spins in the air.`,
    group: `ride`,
    listens: `ride`,
    keys: [`KeyD`],
    buttons: [],
    stick: `left`
}, {
    id: `rollLeft`,
    label: `Air roll left`,
    short: `Roll left`,
    hint: `Rolls around the skis in the air.`,
    group: `ride`,
    listens: `ride`,
    keys: [`ArrowLeft`],
    buttons: [],
    stick: `right`
}, {
    id: `rollRight`,
    label: `Air roll right`,
    short: `Roll right`,
    hint: `Rolls around the skis in the air.`,
    group: `ride`,
    listens: `ride`,
    keys: [`ArrowRight`],
    buttons: [],
    stick: `right`
}, {
    id: `tuck`,
    label: `Pole · tuck · front flip`,
    short: `Tuck · front flip`,
    hint: `Hold for speed. Starts a front flip as you leave the lip.`,
    group: `ride`,
    listens: `ride`,
    keys: [`KeyW`],
    buttons: [7, 5]
}, {
    id: `brake`,
    label: `Brake · back flip`,
    short: `Brake · back flip`,
    hint: `Slows you on the snow. Starts a back flip off the lip.`,
    group: `ride`,
    listens: `ride`,
    keys: [`KeyS`],
    buttons: [6]
}, {
    id: `butter`,
    label: `Butter / press`,
    short: `Butter`,
    hint: `Hold on the snow to press the nose; with brake, the tails. Or press it in the air and hold it onto the snow: off a bump or a small hop you land straight into a press that carries your spin on, but on a big jump you faceplant. Tip back with brake in the air, or forward for the tips, and the press holds the angle you land at. Steer to turn the press: it eases off near 180°, and from 60 km/h it turns faster and can go all the way round. Let go to ride out of it, or pop to jump out. Not on rails or boxes. Presses slow you and last up to 2.5 seconds; wait 1 second before pressing again. A press scores 150 points, a butter 180 300 and a butter 360 600; repeats pay less, and only your first 4 butters in a run score.`,
    group: `ride`,
    listens: `ride`,
    keys: [`KeyB`],
    buttons: [10]
}, {
    id: `pop`,
    label: `Load / pop`,
    short: `Pop`,
    hint: `Hold to load, release to jump. Pops off a rail.`,
    group: `ride`,
    listens: `ride`,
    keys: [`Space`],
    buttons: [0]
}, {
    id: `mute`,
    label: `Mute grab`,
    short: `Mute grab`,
    hint: `Hold in the air. Let go to open up for the landing.`,
    group: `ride`,
    listens: `ride`,
    keys: [`ShiftLeft`, `ShiftRight`],
    buttons: [4]
}, {
    id: `tail`,
    label: `Tail grab`,
    short: `Tail grab`,
    hint: `Hold in the air.`,
    group: `ride`,
    listens: `ride`,
    keys: [`KeyQ`],
    buttons: [2]
}, {
    id: `japan`,
    label: `Japan grab`,
    short: `Japan grab`,
    hint: `Hold in the air.`,
    group: `ride`,
    listens: `ride`,
    keys: [`KeyE`],
    buttons: [3]
}, {
    id: `cork`,
    label: `Rodeo / misty`,
    short: `Rodeo / misty`,
    hint: `Hold with a spin and a flip: the feet go over the head, a rodeo back or a misty forward.`,
    group: `ride`,
    listens: `ride`,
    keys: [`ArrowUp`],
    buttons: [1]
}, {
    id: `pause`,
    label: `Pause`,
    short: `Pause`,
    hint: `Esc always pauses too.`,
    group: `game`,
    listens: `always`,
    keys: [`KeyP`],
    buttons: [9]
}, {
    id: `restart`,
    label: `Restart run`,
    short: `Restart (hold)`,
    hint: `Hold to start the run again from the top.`,
    group: `game`,
    listens: `ride`,
    keys: [`KeyR`],
    buttons: [8]
}, {
    id: `skip`,
    label: `Skip gondola ride`,
    short: `Skip ride`,
    hint: `Straight to the summit.`,
    group: `game`,
    listens: `lift`,
    keys: [`KeyF`],
    buttons: [3]
}, {
    id: `chat`,
    label: `Chat`,
    short: `Chat`,
    hint: `Multiplayer. Skips the gondola ride in solo.`,
    group: `game`,
    listens: `always`,
    keys: [`KeyT`],
    buttons: [],
    keyboardOnly: !0
}, {
    id: `duel`,
    label: `1v1`,
    short: `1v1`,
    hint: `Multiplayer on APEX and BIG AIR: accepts the 1v1 asking you, or the top open one; with none, challenges the room (once a minute).`,
    group: `game`,
    listens: `always`,
    keys: [`KeyV`],
    buttons: [],
    keyboardOnly: !0
}]
  , zt = new Map(k.map(e => [e.id, e]))
  , A = e => zt.get(e)
  , Bt = /^(Escape|Enter|NumpadEnter|Tab|Backspace|Delete|Control(Left|Right)|Alt(Left|Right)|Meta(Left|Right)|OS(Left|Right)|ContextMenu|Fn|FnLock|F\d{1,2})$/
  , j = e => /^[A-Za-z][A-Za-z0-9]{1,23}$/.test(e) && !Bt.test(e)
  , Vt = Object.freeze({
    keys: Object.fromEntries(k.map(e => [e.id, [...e.keys]])),
    buttons: Object.fromEntries(k.map(e => [e.id, [...e.buttons]])),
    style: `auto`
});
function M(e) {
    let t = e && typeof e == `object` ? e : {}
      , n = t.keys && typeof t.keys == `object` ? t.keys : {}
      , r = t.buttons && typeof t.buttons == `object` ? t.buttons : {}
      , i = (e, t, n) => Array.isArray(e) ? [...new Set(e.filter(n))].slice(0, 2) : [...t]
      , a = e => typeof e == `string` && j(e)
      , o = e => Number.isInteger(e) && e >= 0 && e < 16
      , s = (e, t, n) => n.filter(n => !k.some(r => r.id !== e.id && Ht(e.listens, r.listens) && Array.isArray(t[r.id]) && t[r.id].includes(n)));
    return {
        keys: Object.fromEntries(k.map(e => [e.id, i(n[e.id], s(e, n, e.keys), a)])),
        buttons: Object.fromEntries(k.map(e => [e.id, e.keyboardOnly ? [] : i(r[e.id], s(e, r, e.buttons), o)])),
        style: t.style === `xbox` || t.style === `playstation` ? t.style : `auto`
    }
}
var Ht = (e, t) => e === `always` || t === `always` || e === t;
function Ut(e, t) {
    let n = A(e).listens;
    return n === `always` || (n === `lift` ? t === `gondola` : t === `skiing`)
}
function Wt(e, t, n, r) {
    let i = Object.fromEntries(Object.entries(e).map( ([e,t]) => [e, [...t]]))
      , a = i[t]
      , o = a.indexOf(r)
      , s = [];
    if (o === n)
        return {
            table: e,
            moved: s
        };
    if (o >= 0)
        return n < a.length && ([a[o],a[n]] = [a[n], a[o]]),
        {
            table: i,
            moved: s
        };
    let c = a[n] ?? null;
    for (let e of k) {
        if (e.id === t || !Ht(e.listens, A(t).listens))
            continue;
        let n = i[e.id]
          , a = n.indexOf(r);
        if (a < 0)
            continue;
        let o = c !== null && !n.includes(c) ? c : null;
        o === null ? n.splice(a, 1) : n[a] = o,
        s.push({
            action: e.id,
            to: o
        })
    }
    return n < a.length ? a[n] = r : a.push(r),
    {
        table: i,
        moved: s
    }
}
function Gt(e, t, n, r) {
    if (!j(r))
        return {
            binds: e,
            moved: []
        };
    let {table: i, moved: a} = Wt(e.keys, t, n, r);
    return {
        binds: {
            ...e,
            keys: i
        },
        moved: a
    }
}
function Kt(e, t, n, r) {
    if (A(t).keyboardOnly || !Number.isInteger(r) || r < 0 || r >= 16)
        return {
            binds: e,
            moved: []
        };
    let {table: i, moved: a} = Wt(e.buttons, t, n, r);
    return {
        binds: {
            ...e,
            buttons: i
        },
        moved: a
    }
}
function qt(e, t, n) {
    return {
        ...e,
        keys: {
            ...e.keys,
            [t]: e.keys[t].filter( (e, t) => t !== n)
        }
    }
}
function Jt(e, t, n) {
    return {
        ...e,
        buttons: {
            ...e.buttons,
            [t]: e.buttons[t].filter( (e, t) => t !== n)
        }
    }
}
var Yt = (e, t) => e.length === t.length && e.every( (e, n) => e === t[n])
  , Xt = e => k.every(t => Yt(e.keys[t.id], t.keys))
  , Zt = e => k.every(t => Yt(e.buttons[t.id], t.keyboardOnly ? [] : t.buttons))
  , Qt = e => Xt(e) && Zt(e) && e.style === `auto`
  , $t = e => ({
    ...e,
    keys: M(null).keys
})
  , en = e => ({
    ...e,
    buttons: M(null).buttons
});
function tn(e, t, n, r) {
    return i => e.keys[i].some(e => t.has(e)) || n.has(i) || !!r && e.buttons[i].some(e => !!r.buttons[e]?.pressed)
}
var nn = (e, t) => k.some(n => n.group === `ride` && e.keys[n.id].includes(t))
  , rn = (e, t) => t.includes(e.code) && !e.ctrlKey && !e.metaKey && !e.altKey;
function an(e) {
    return /054c|playstation|dualsense|dualshock|^wireless controller/i.test(e) ? `playstation` : /045e|xbox|xinput/i.test(e) ? `xbox` : null
}
var on = (e, t) => e.style === `auto` ? an(t ?? ``) ?? `xbox` : e.style
  , sn = [`A`, `B`, `X`, `Y`, `LB`, `RB`, `LT`, `RT`, `VIEW`, `MENU`, `LS`, `RS`, `D-PAD ↑`, `D-PAD ↓`, `D-PAD ←`, `D-PAD →`]
  , cn = [`✕`, `○`, `□`, `△`, `L1`, `R1`, `L2`, `R2`, `CREATE`, `OPTIONS`, `L3`, `R3`, `D-PAD ↑`, `D-PAD ↓`, `D-PAD ←`, `D-PAD →`]
  , ln = [`Cross`, `Circle`, `Square`, `Triangle`]
  , un = [`A`, `B`, `X`, `Y`, `left bumper`, `right bumper`, `left trigger`, `right trigger`, `View`, `Menu`, `left stick press`, `right stick press`, `d-pad up`, `d-pad down`, `d-pad left`, `d-pad right`]
  , N = (e, t) => (t === `playstation` ? cn : sn)[e] ?? `#${e}`
  , dn = (e, t) => t === `playstation` ? ln[e] ?? N(e, t) : un[e] ?? `button ${e}`;
function fn(e, t, n, r) {
    let i = e.buttons[t][0]
      , a = e.keys[t][0];
    return n && i !== void 0 ? N(i, e.style === `auto` ? n : e.style) : a ? mn(a, r) : `—`
}
var pn = {
    Space: `SPACE`,
    ShiftLeft: `SHIFT`,
    ShiftRight: `R SHIFT`,
    ArrowLeft: `←`,
    ArrowRight: `→`,
    ArrowUp: `↑`,
    ArrowDown: `↓`,
    Backspace: `BACKSPACE`,
    Delete: `DEL`,
    Insert: `INS`,
    Home: `HOME`,
    End: `END`,
    PageUp: `PG UP`,
    PageDown: `PG DN`,
    CapsLock: `CAPS`,
    Backquote: "`",
    Minus: `-`,
    Equal: `=`,
    BracketLeft: `[`,
    BracketRight: `]`,
    Backslash: `\\`,
    Semicolon: `;`,
    Quote: `'`,
    Comma: `,`,
    Period: `.`,
    Slash: `/`,
    IntlBackslash: `<`,
    NumpadAdd: `NUM +`,
    NumpadSubtract: `NUM −`,
    NumpadMultiply: `NUM ×`,
    NumpadDivide: `NUM ÷`,
    NumpadDecimal: `NUM .`
};
function mn(e, t) {
    let n = t?.get(e);
    return n && n.trim().length === 1 ? n.toUpperCase() : pn[e] ? pn[e] : /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit\d$/.test(e) ? e.slice(5) : /^Numpad\d$/.test(e) ? `NUM ${e.slice(6)}` : e.replace(/(Left|Right)$/, ``).toUpperCase()
}
var hn = `cork7-controls-v1`;
function gn() {
    try {
        let e = JSON.parse(localStorage.getItem(hn) ?? `null`);
        return {
            binds: M(e),
            at: Number(e?.at) || 0,
            owner: typeof e?.owner == `string` ? e.owner : null
        }
    } catch {
        return {
            binds: M(null),
            at: 0,
            owner: null
        }
    }
}
function _n(e, t=Date.now(), n=null) {
    let r = M(e);
    try {
        localStorage.setItem(hn, JSON.stringify({
            ...r,
            at: t,
            owner: n
        }))
    } catch {}
    return r
}
var P = [`apex`]
  , vn = (e=Math.random) => P[Math.min(P.length - 1, Math.floor(e() * P.length))]
  , yn = [`1v1`, `2v2`]
  , bn = 45e3
  , xn = [6e4, 5 * 6e4, 15 * 6e4];
function Sn(e, t) {
    let n = e && t - e.at < 72e5 ? e.strikes + 1 : 1;
    return {
        strikes: n,
        at: t,
        until: t + xn[Math.min(n, xn.length) - 1]
    }
}
var Cn = [5 * 6e4, 15 * 6e4, 30 * 6e4]
  , wn = e => {
    let t = Math.max(0, Math.ceil(e / 1e3));
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, `0`)}`
}
  , Tn = e => `YOU LEFT A MATCH · RANKED IN ${wn(e)}`
  , En = [{
    name: `CONTENDER`,
    emblem: `contender`,
    from: -1 / 0,
    steps: [850, 900]
}, {
    name: `CHALLENGER`,
    emblem: `challenger`,
    from: 950,
    steps: [1e3, 1050]
}, {
    name: `PRO`,
    emblem: `pro`,
    from: 1100,
    steps: [1150, 1200]
}, {
    name: `ELITE`,
    emblem: `elite`,
    from: 1250,
    steps: [1300, 1350]
}, {
    name: `MASTER`,
    emblem: `master`,
    from: 1400,
    steps: [1500, 1600]
}, {
    name: `CHAMPION`,
    emblem: `champion`,
    from: 1700,
    steps: []
}, {
    name: `LEGEND`,
    emblem: `legend`,
    from: 2e3,
    steps: []
}]
  , Dn = e => [...En].reverse().find(t => e >= t.from)
  , On = [`I`, `II`, `III`]
  , F = En.flatMap(e => [e.from, ...e.steps].map( (t, n) => ({
    rank: e.name,
    step: e.steps.length ? On[n] : ``,
    from: t
})))
  , I = e => {
    let t = 0;
    for (; t + 1 < F.length && e >= F[t + 1].from; )
        t++;
    return t
}
  , kn = e => On.indexOf(F[I(e)].step) + 1
  , An = e => {
    let t = F[I(e)];
    return t.step ? `${t.rank} ${t.step}` : t.rank
}
  , jn = (e, t) => I(e) === I(t);
function Mn(e) {
    let t = F[I(e) + 1];
    return t ? {
        title: t.step ? `${t.rank} ${t.step}` : t.rank,
        points: Math.ceil(t.from - e)
    } : null
}
var Nn = e => e.games >= 5
  , Pn = e => Math.round(e).toLocaleString(`en-US`)
  , Fn = e => Nn(e) ? `${An(e.rating)} ${Pn(e.rating)}` : e.games > 0 ? `PLACEMENT ${e.games}/5` : `UNRANKED`
  , In = e => e > 0 ? `+${e}` : e < 0 ? `−${-e}` : `±0`;
function Ln(e, t, n) {
    let r = e;
    if (!r || r.ranked !== !0 || r.rated !== !0)
        return null;
    let i = r[t];
    return !i || typeof i.delta != `number` || !Number.isInteger(i.delta) || typeof i.rating != `number` || !Number.isInteger(i.rating) ? null : {
        before: i.rating,
        after: i.rating + i.delta,
        delta: i.delta,
        games: n + 1
    }
}
var Rn = e => !!e && e.ranked === !1;
function zn(e, t=!1) {
    let n = e;
    if (!n || typeof n.rating != `number` || !Number.isInteger(n.rating) || n.rating < 0 || n.rating > 1e5 || typeof n.games != `number` || !Number.isInteger(n.games) || n.games < 0 || n.games > 1e6)
        return null;
    let r = typeof n.place == `number` && Number.isInteger(n.place) && n.place >= 1 && n.place <= 1e7 ? n.place : null
      , i = e => typeof e == `number` && Number.isInteger(e) && e >= 0 && e <= n.games
      , a = t && i(n.w) && i(n.l) && i(n.d) && n.w + n.l + n.d <= n.games ? {
        w: n.w,
        l: n.l,
        d: n.d
    } : {};
    return {
        rating: n.rating,
        games: n.games,
        ...r ? {
            place: r
        } : {},
        ...a
    }
}
var Bn = e => [...e.runs.host, ...e.runs.guest].map(a);
function Vn(e, t, n, r, i=2) {
    let a = e.runs[t].slice(0, i);
    return {
        name: n,
        you: r,
        runs: a,
        best: h(a),
        ridden: s(a)
    }
}
function Hn(e) {
    let t = (e.runs ?? []).map(se)
      , n = e.first === `g` ? `guest` : `host`
      , r = t.length > 4 ? t.length / 2 : 2;
    return {
        seq: e.seq,
        phase: e.phase,
        drop: e.drop,
        first: n,
        runs: {
            host: t.slice(0, r),
            guest: t.slice(r)
        },
        winner: e.win === `h` ? `host` : e.win === `g` ? `guest` : e.win === `d` ? `draw` : null,
        walkover: !!e.wo
    }
}
var Un = {
    host: `h`,
    guest: `g`,
    draw: `d`
}
  , Wn = 4e3
  , Gn = 2500
  , Kn = 2e3
  , qn = Kn + 1e3
  , Jn = 3e3
  , Yn = 2e4
  , Xn = class {
    constructor(e, t, n, r, i, a=ae(), o=2, s=`apex`) {
        this.endsAt = -1,
        this.phaseAt = 0,
        this.heard = !1,
        this.helloAt = -1 / 0,
        this.sentAt = -1 / 0,
        this.goneSince = null,
        this.gateDrop = -1,
        this.releasedDrop = -1,
        this.releasedAt = 0,
        this.reported = new Map,
        this.onRun = !1,
        this.stillFor = 0,
        this.stillSince = null,
        this.stillStep = -1,
        this.wants = {
            me: !1,
            them: !1
        },
        this.wantPark = {
            me: null,
            them: null
        },
        this.alone = !1,
        this.decided = !1,
        this.refereed = !1,
        this.offlineSince = null,
        this.backAt = -1 / 0,
        this.announced = !0,
        this.endWhy = null,
        this.queued = !1,
        this.park = s,
        this.host = n,
        this.link = r,
        this.me = e,
        this.names = {
            ...t
        },
        this.state = l(`host`),
        this.createdAt = i,
        this.phaseAt = i,
        this.clock = a,
        this.runs = o,
        this.host.toGate(),
        this.gateDrop = 0,
        e === `guest` && this.hello(i)
    }
    get drops() {
        return this.runs * 2
    }
    useRuns(e) {
        let t = this.state
          , n = t.drop <= 1 && t.phase !== `winner` && t.phase !== `over`;
        return e !== 1 && e !== 2 || e === this.runs || !n ? !1 : (this.runs = e,
        !0)
    }
    get role() {
        return this.me
    }
    get atStake() {
        let e = this.state.phase;
        return e === `intro` || e === `present` || e === `count` || e === `run` || e === `posted`
    }
    opponentJoined(e, t) {
        this.names[p(this.me)] = e,
        this.me === `guest` ? this.hello(t) : this.send(t)
    }
    receive(e, t) {
        let n = p(this.me);
        if (e.name && !(this.refereed && e.op === `state`) && (this.names[n] = e.name),
        e.op === `bye`) {
            this.over(u(this.state, n), t);
            return
        }
        if (e.op === `rematch`) {
            this.wants.them = !0,
            this.wantPark.them = e.park ?? this.park,
            this.me === `host` && this.tryRematch(t);
            return
        }
        if (e.op === `move`) {
            this.me === `guest` && e.code && e.park && (this.state.phase === `over` || this.state.phase === `winner`) && this.host.moveTo?.(e.code, e.park);
            return
        }
        if (this.me === `host` && !this.refereed) {
            if (e.op === `hello`) {
                this.heard = !0,
                this.send(t);
                return
            }
            if (e.op === `result` && e.drop !== void 0 && e.score !== void 0) {
                let n = se(e.score);
                n === null ? this.send(t) : this.set(r(this.state, `guest`, e.drop, n), t)
            }
            return
        }
        if (e.op !== `state` || e.seq === void 0 || !this.refereed && e.seq <= this.state.seq && this.heard || this.decided && e.phase !== `intro`)
            return;
        this.heard = !0,
        e.phase === `intro` && (this.state.phase === `over` || this.state.phase === `winner`) && (this.wants = {
            me: !1,
            them: !1
        },
        this.wantPark = {
            me: null,
            them: null
        },
        this.gateDrop = -1,
        this.releasedDrop = -1,
        this.reported.clear(),
        this.alone = !1,
        this.decided = !1,
        this.refereed = !1,
        this.endWhy = null);
        let i = e.phase !== this.state.phase || e.drop !== this.state.drop;
        this.state = Hn(e),
        i && (this.phaseAt = t),
        this.endsAt = e.left !== void 0 && e.left >= 0 ? t + e.left : -1;
        for (let e of this.reported.keys())
            this.postedAlready(e) && this.reported.delete(e)
    }
    verdict(e, t, n) {
        let r = p(e);
        if (this.decided = !0,
        this.endWhy = n ?? null,
        !(this.state.winner === r && this.state.walkover)) {
            if (this.state.phase !== `winner` && this.state.phase !== `over`) {
                this.over(u(this.state, e), t);
                return
            }
            this.state = {
                ...this.state,
                winner: r,
                walkover: !0,
                seq: this.state.seq + 1
            },
            this.me === `host` && this.send(t)
        }
    }
    ended(e, t) {
        let n = e.map(se)
          , r = {
            host: n.slice(0, 2),
            guest: n.slice(2)
        };
        this.decided = !0,
        this.endWhy = null,
        this.reported.clear();
        let i = this.state.phase === `winner` || this.state.phase === `over`
          , a = {
            ...this.state,
            runs: r,
            winner: oe(r),
            walkover: !1,
            seq: this.state.seq + 1,
            ...i ? {} : {
                phase: `winner`
            }
        };
        if (!i) {
            this.over(a, t);
            return
        }
        this.state = a,
        this.me === `host` && this.send(t)
    }
    refereeing() {
        this.refereed = !0
    }
    askRematch(e, t=this.park) {
        this.state.phase !== `over` && this.state.phase !== `winner` || this.wants.me && this.wantPark.me === t || (this.wants.me = !0,
        this.wantPark.me = t,
        this.link.send({
            op: `rematch`,
            ...t === this.park ? {} : {
                park: t
            }
        }),
        this.me === `host` && this.tryRematch(e))
    }
    leave() {
        this.link.send({
            op: `bye`
        })
    }
    update(e) {
        let t = this.state
          , n = this.host.connected?.() ?? !0;
        if (n && this.offlineSince !== null && (this.backAt = e),
        this.watchOpponent(e),
        this.watchHost(e),
        this.state !== t) {
            this.ride(e);
            return
        }
        this.me === `host` && !this.refereed ? (!this.announced && n && this.send(e),
        t.phase === `waiting` ? this.heard && this.host.opponentHere() ? this.set(f(t), e) : e - this.createdAt > (this.queued ? 45e3 : m.waitLimit) && this.over(u(t, `guest`), e) : this.endsAt >= 0 && e >= this.endsAt && this.announced ? this.set(te(t, this.drops), e) : t.phase === `run` && this.announced && n && e - this.backAt > qn && e - this.phaseAt > this.clock.runLimit && this.set(r(t, d(t, t.drop), t.drop, `dnf`), e),
        e - this.sentAt > Wn && t.phase !== `waiting` && this.send(e)) : this.me === `host` && this.refereed ? this.ride(e) : this.alone ? this.endsAt >= 0 && e >= this.endsAt && (this.state = te(t, this.drops),
        this.phaseAt = e,
        this.endsAt = -1) : this.queued && !this.heard && e - this.createdAt > 45e3 ? this.over(u(t, `host`), e) : (!this.heard || t.phase === `waiting`) && e - this.helloAt > Gn && this.hello(e),
        this.ride(e)
    }
    fromQueue() {
        this.queued = !0
    }
    walkedAway(e) {
        return this.state.phase !== `waiting` || this.me === `guest` && this.heard ? !1 : (this.over(u(this.state, p(this.me)), e),
        !0)
    }
    ride(e) {
        let t = this.state
          , n = e => e < this.drops && d(t, e) === this.me
          , r = t.phase === `posted` ? t.drop + 1 : t.phase === `intro` || t.phase === `waiting` || t.phase === `present` || t.phase === `count` ? t.drop : -1;
        if (r >= 0 && n(r) && this.gateDrop !== r && this.releasedDrop !== r && (this.host.toGate(),
        this.gateDrop = r,
        this.onRun = !1),
        t.phase === `run` && n(t.drop) && this.announced && this.releasedDrop !== t.drop && !this.reported.has(t.drop) && !this.postedAlready(t.drop) && (this.gateDrop !== t.drop && (this.host.toGate(),
        this.gateDrop = t.drop),
        this.host.release(),
        this.releasedDrop = t.drop,
        this.releasedAt = e,
        this.onRun = !0,
        this.stillFor = 0,
        this.stillSince = null,
        this.stillStep = -1),
        this.onRun && this.releasedDrop !== t.drop && this.postedAlready(this.releasedDrop) && (this.onRun = !1,
        this.host.stopRun()),
        this.releasedDrop === t.drop && n(t.drop) && (t.phase === `run` || t.phase === `count`) && !this.reported.has(t.drop)) {
            let n = this.host.myRun();
            n.moved && (n.still && this.stillStep >= 0 && (this.stillFor += e - this.stillStep),
            this.stillSince = n.still ? this.stillSince ?? e : null,
            this.stillStep = e),
            n.phase === `finished` ? this.report(t.drop, Math.round(n.score), e) : !n.moved && e - this.releasedAt > m.startLimit ? (this.host.stopRun(),
            this.report(t.drop, `dns`, e)) : (e - this.releasedAt > this.clock.runClock * 1e3 || this.stillFor >= m.stillLimit) && (this.report(t.drop, Math.round(n.score), e, !0),
            this.host.stopRun())
        }
        if (this.me === `guest` || this.refereed)
            for (let[t,n] of this.reported)
                e - n.at > Kn && (n.at = e,
                this.link.send({
                    op: `result`,
                    drop: t,
                    score: a(n.mark)
                }))
    }
    report(e, t, n, i=!1) {
        if (this.onRun = !1,
        typeof t == `number` && this.host.ran?.(e, i),
        this.me === `host` && !this.refereed) {
            this.reported.set(e, {
                mark: t,
                at: n
            }),
            this.set(r(this.state, `host`, e, t), n);
            return
        }
        this.reported.set(e, {
            mark: t,
            at: n
        }),
        this.link.send({
            op: `result`,
            drop: e,
            score: a(t)
        })
    }
    postedAlready(e) {
        let t = this.state;
        return t.drop > e || t.drop === e && (t.phase === `posted` || t.phase === `winner` || t.phase === `over`) || t.runs[d(t, e)][i(e) - 1] !== null
    }
    watchOpponent(e) {
        let t = this.state
          , n = t.phase !== `waiting` && t.phase !== `winner` && t.phase !== `over`
          , r = this.host.connected?.() ?? !0;
        if (this.offlineSince = n && !r ? this.offlineSince ?? e : null,
        !n || !r || this.host.opponentHere()) {
            this.goneSince = null;
            return
        }
        this.goneSince ??= e,
        e - this.goneSince > m.decideAfter + (this.refereed ? 2e4 : 0) && this.over(u(t, p(this.me)), e)
    }
    hostDue() {
        let e = this.state;
        return this.me !== `guest` || this.alone || this.decided || !this.heard || e.phase === `waiting` || e.phase === `winner` || e.phase === `over` ? null : this.endsAt >= 0 ? this.endsAt : e.phase === `run` ? d(e, e.drop) === `host` ? this.phaseAt + this.clock.runClock * 1e3 : this.reported.get(e.drop)?.at ?? this.phaseAt + this.clock.runLimit : null
    }
    watchHost(e) {
        let t = this.hostDue();
        t === null || this.goneSince !== null || this.offlineSince !== null || e - t > 25e3 + (this.refereed ? 2e4 : 0) && this.over(u(this.state, `host`), e)
    }
    quietFor(e) {
        let t = this.state;
        if (t.phase !== `run` || this.decided || this.goneSince !== null || this.offlineSince !== null || d(t, t.drop) === this.me)
            return null;
        let n = this.host.opponentQuiet?.();
        return n == null ? null : Math.min(n, e - this.phaseAt)
    }
    stillBudget(e) {
        let t = this.state;
        return t.phase !== `run` || this.releasedDrop !== t.drop || d(t, t.drop) !== this.me || this.reported.has(t.drop) || this.stillStep < 0 ? null : Math.max(0, (m.stillLimit - this.stillFor - (this.stillSince === null ? 0 : e - this.stillStep)) / 1e3)
    }
    silentLeft(e) {
        let t = this.quietFor(e);
        return t === null || t < m.silentShow ? null : Math.max(0, Math.min(this.clock.runClock - (e - this.phaseAt) / 1e3, (m.silentLimit - t) / 1e3))
    }
    afk(e, t) {
        let n = this.state;
        if (n.phase !== `run` || n.drop !== e || this.decided || this.reported.has(e))
            return !1;
        let i = d(n, e);
        return i === this.me ? (this.onRun && this.host.stopRun(),
        this.report(e, `dnf`, t),
        !0) : this.me === `host` ? (this.set(r(n, i, e, `dnf`), t),
        !0) : !1
    }
    tryRematch(e) {
        if (!this.wants.me || !this.wants.them || this.state.phase !== `over` && this.state.phase !== `winner` || !this.host.opponentHere())
            return;
        let t = this.wantPark.me ?? this.park;
        if ((this.wantPark.them ?? this.park) === t) {
            if (t !== this.park) {
                if (!this.host.moveTo)
                    return;
                let e = ie();
                this.wants = {
                    me: !1,
                    them: !1
                },
                this.wantPark = {
                    me: null,
                    them: null
                },
                this.link.send({
                    op: `move`,
                    code: e,
                    park: t
                }),
                this.host.moveTo(e, t);
                return
            }
            this.wants = {
                me: !1,
                them: !1
            },
            this.wantPark = {
                me: null,
                them: null
            },
            this.gateDrop = -1,
            this.releasedDrop = -1,
            this.reported.clear(),
            this.set(re(this.state), e)
        }
    }
    over(e, t) {
        if (e !== this.state) {
            if (this.me === `host`) {
                this.set(e, t);
                return
            }
            this.state = e,
            this.phaseAt = t,
            this.endsAt = t + m.winner,
            this.alone = !0
        }
    }
    set(e, t) {
        if (e === this.state)
            return;
        e.phase === `intro` && this.state.phase !== `waiting` && (this.gateDrop = -1,
        this.releasedDrop = -1,
        this.reported.clear(),
        this.decided = !1,
        this.refereed = !1,
        this.endWhy = null),
        this.state = e,
        this.phaseAt = t;
        let n = ne[e.phase];
        this.endsAt = n === void 0 ? -1 : t + n,
        this.announced = !1,
        this.send(t)
    }
    send(e) {
        let t = this.state;
        if (this.sentAt = e,
        !this.announced && (this.host.connected?.() ?? !0)) {
            this.announced = !0,
            this.phaseAt = e;
            let n = ne[t.phase];
            n !== void 0 && (this.endsAt = e + n)
        }
        this.link.send({
            op: `state`,
            seq: t.seq,
            phase: t.phase,
            drop: t.drop,
            first: t.first === `host` ? `h` : `g`,
            runs: Bn(t),
            win: t.winner ? Un[t.winner] : ``,
            wo: t.walkover,
            left: this.endsAt >= 0 ? Math.max(0, Math.round(this.endsAt - e)) : -1
        })
    }
    hello(e) {
        this.helloAt = e,
        this.link.send({
            op: `hello`,
            host: !1
        })
    }
    shot() {
        let e = this.state
          , t = d(e, e.drop) === this.me;
        switch (e.phase) {
        case `waiting`:
            return `wait`;
        case `intro`:
            return `intro`;
        case `present`:
        case `count`:
            return t ? `gate-me` : `gate-them`;
        case `run`:
            return t ? `ride-me` : `ride-them`;
        case `posted`:
            return t ? `finish-me` : `finish-them`;
        default:
            return `end`
        }
    }
    stallLeft(e) {
        let t = this.hostDue();
        return t === null || this.goneSince !== null || this.offlineSince !== null || e - t < 3e3 ? null : Math.max(0, (t + Yn - e) / 1e3)
    }
    hud(e) {
        let t = this.state
          , n = d(t, t.drop)
          , r = ne[t.phase]
          , a = !this.announced
          , c = a && r !== void 0 ? r / 1e3 : this.endsAt >= 0 ? Math.max(0, (this.endsAt - e) / 1e3) : 0
          , l = t.phase === `present` || t.phase === `count` || t.phase === `run` || t.phase === `posted`;
        return {
            phase: t.phase,
            me: this.me,
            shot: this.shot(),
            riders: {
                host: Vn(t, `host`, this.names.host, this.me === `host`, this.runs),
                guest: Vn(t, `guest`, this.names.guest, this.me === `guest`, this.runs)
            },
            drop: t.drop,
            round: i(t.drop),
            runsEach: this.runs,
            runner: l ? n : null,
            left: c,
            count: ee(t.phase, c),
            runLeft: t.phase === `run` ? Math.max(0, this.clock.runClock - (a ? 0 : e - (n === this.me && this.releasedDrop === t.drop ? this.releasedAt : this.phaseAt)) / 1e3) : null,
            runClock: this.clock.runClock,
            goneLeft: this.goneSince === null ? null : Math.max(0, (m.decideAfter - (e - this.goneSince)) / 1e3),
            atStake: this.atStake,
            reconnecting: this.offlineSince === null ? null : Math.max(0, (m.decideAfter - (e - this.offlineSince)) / 1e3),
            stalled: this.stallLeft(e),
            silent: this.silentLeft(e),
            endWhy: this.endWhy,
            stillLeft: this.stillSince !== null && e - this.stillSince >= m.silentShow ? this.stillBudget(e) : null,
            toBeat: h(t.runs[p(n)]),
            posted: t.phase === `posted` ? {
                role: n,
                mark: t.runs[n][i(t.drop) - 1],
                round: i(t.drop)
            } : null,
            lead: o(t.runs),
            winner: t.winner,
            walkover: t.walkover,
            noShow: t.walkover && !this.decided && s(t.runs.host) + s(t.runs.guest) === 0,
            rematch: {
                ...this.wants
            },
            rematchPark: {
                ...this.wantPark
            },
            park: this.park,
            opponentHere: this.host.opponentHere(),
            connected: this.host.connected?.() ?? !0
        }
    }
}
  , L = (e, t) => e.length <= t ? e : `${e.slice(0, t - 1).trimEnd()}…`
  , Zn = [``, ``, `DOUBLE`, `TRIPLE`, `QUAD`]
  , Qn = e => Number(e.match(/×(\d+)/)?.[1] ?? Math.max(1, Zn.indexOf(e.match(/(?:^|\s)(DOUBLE|TRIPLE|QUAD) /)?.[1] ?? ``)))
  , $n = e => Number(e.match(/(?:^|\s)(\d+)(?: ON| OFF)?$/)?.[1] ?? 0)
  , R = e => e.replace(/(MIXED ROTATION|[A-Z-]+) ×(\d+)/g, (e, t, n) => Zn[Number(n)] ? `${Zn[Number(n)]} ${t}` : `${t} ×${n}`);
function er(e) {
    let t = e.match(/^(STOMPED|SAVED IT|CLEAN LANDING)\.\s*/)
      , n = t?.[1] ?? ``
      , r = e.slice(t?.[0].length ?? 0).split(/\s*→\s*/).filter(Boolean)
      , i = r.at(-1) ?? ``
      , a = i.split(/\s+\+\s+/).filter(Boolean)
      , o = a.filter(e => /GRAB/.test(e))
      , s = a.filter(e => !/GRAB/.test(e))
      , c = R(s.join(` + `) || o.shift() || i)
      , l = o.map(e => e.replace(` GRAB`, ``)).join(` · `);
    if (c.length > 34) {
        let e = s.filter(e => /FLIP|FLATSPIN|MISTY|CORK|BIO|RODEO|OFF-AXIS|MIXED ROTATION/.test(e))
          , t = e.reduce( (e, t) => e + Qn(t), 0)
          , n = s.filter(e => $n(e) > 0)
          , r = n.reduce( (e, t) => e + $n(t), 0);
        c = t ? `${t} ${e.some(e => e.includes(`MIXED ROTATION`)) ? `ROTATION` : `FLIP`} COMBO${r ? ` · ${r}°${n.length > 1 ? ` TOTAL` : ``}` : ``}` : r ? `${r}° SPIN COMBO` : L(c, 34);
        let i = [...e.map(R), ...n.length > 1 ? n.filter(t => !e.includes(t)) : [], ...o.map(e => e.replace(` GRAB`, ``))];
        l = i.slice(-2).join(` · `),
        i.length > 2 && (l += ` · +${i.length - 2}`)
    }
    let u = r.length > 1 ? `${r.length > 3 ? `… → ` : ``}${r.slice(-3, -1).map(e => L(R(e), 19)).join(` → `)} →` : ``
      , d = o.map(e => e.replace(` GRAB`, ``))
      , f = s.length ? [R(s.join(` + `)), ...d].join(` `) : [c, ...d].join(` + `);
    return {
        headline: L(c, 34),
        name: f.length <= 34 ? f : L(c, 34),
        detail: L(l, 44),
        trail: u,
        status: n,
        combo: r.length > 1 ? `${r.length} TRICK COMBO` : ``,
        history: r,
        full: e
    }
}
var tr = [`L1`, `R1`, `L2`, `R2`]
  , nr = e => tr.includes(e)
  , rr = e => `${e.side === `host` ? `L` : `R`}${e.n}`
  , ir = e => ({
    side: e[0] === `L` ? `host` : `guest`,
    n: e[1] === `1` ? 1 : 2
})
  , ar = 4
  , or = e => e.runs.host.length > 2;
function sr(e) {
    let t = l(`host`);
    return e ? {
        ...t,
        runs: {
            host: Array(ar).fill(null),
            guest: Array(ar).fill(null)
        }
    } : t
}
function z(e, t) {
    let n = d(e, t);
    return or(e) ? [{
        side: n,
        n: 1
    }, {
        side: n,
        n: 2
    }] : [{
        side: n,
        n: i(t)
    }]
}
var cr = (e, t) => z(e, t)[0];
function B(e, t, n) {
    return z(e, t).some(e => e.side === n.side && e.n === n.n) ? or(e) ? (i(t) - 1) * 2 + n.n - 1 : n.n - 1 : -1
}
var lr = (e, t) => Array.from({
    length: 4
}, (n, r) => B(e, r, t)).filter(e => e >= 0).map(n => e.runs[t.side][n])
  , ur = e => e.reduce( (e, t) => e + c(t), 0)
  , V = e => ({
    host: ur(e.host),
    guest: ur(e.guest)
});
function dr(e) {
    let t = V(e);
    if (t.host !== t.guest)
        return t.host > t.guest ? `host` : `guest`;
    let n = h(e.host)
      , r = h(e.guest);
    return n === r ? `draw` : n > r ? `host` : `guest`
}
function fr(e) {
    let t = V(e);
    return t.host === t.guest ? null : t.host > t.guest ? {
        role: `host`,
        by: t.host - t.guest
    } : {
        role: `guest`,
        by: t.guest - t.host
    }
}
function pr(e, t) {
    let n = d(e, t)
      , r = V(e.runs)
      , i = r[p(n)] - r[n];
    return i >= 0 && r[p(n)] > 0 ? i + 1 : 0
}
var H = (e, t) => ({
    ...e,
    ...t,
    seq: e.seq + 1
});
function mr(e) {
    switch (e.phase) {
    case `intro`:
        return H(e, {
            phase: `present`,
            drop: 0
        });
    case `present`:
    case `count`:
        return H(e, {
            phase: `run`
        });
    case `posted`:
        return e.drop + 1 < 4 ? H(e, {
            phase: `present`,
            drop: e.drop + 1
        }) : H(e, {
            phase: `winner`,
            winner: dr(e.runs)
        });
    case `winner`:
        return H(e, {
            phase: `over`
        });
    default:
        return e
    }
}
var hr = (e, t, n) => B(e, t, n) >= 0;
function gr(e, t, n, r) {
    let i = B(e, n, t);
    if (n !== e.drop || i < 0 || e.phase !== `run` && e.phase !== `count` && e.phase !== `present` || e.runs[t.side][i] !== null)
        return e;
    let a = {
        ...e.runs,
        [t.side]: e.runs[t.side].map( (e, t) => t === i ? r : e)
    };
    return H(e, z(e, n).every(t => a[t.side][B(e, n, t)] !== null) ? {
        phase: `posted`,
        runs: a
    } : {
        runs: a
    })
}
function _r() { return window.CORK7_SERVICES?.wsOrigin || window.location.origin.replace(/^http/, `ws`); }
var vr = 36e5
  , yr = {
    park: `apex`,
    score: 25e4
}
  , br = e => e !== null && e >= yr.score;
function xr(e) {
    let t = [...e].sort( (e, t) => e.at - t.at || (e.id < t.id ? -1 : 1));
    return {
        riders: t.slice(0, 20),
        waitlist: t.slice(20)
    }
}
function Sr(e, t, n, r, i=vr) {
    if (!e)
        return {
            state: `soon`
        };
    if (r < e.opens)
        return {
            state: `coming`,
            opens: e.opens,
            starts: e.starts
        };
    let {riders: a, waitlist: o} = xr(e.signups);
    if (r < e.starts) {
        let t = a.findIndex(e => e.id === n)
          , r = o.findIndex(e => e.id === n);
        return {
            state: `open`,
            starts: e.starts,
            taken: a.length,
            seats: 20,
            full: a.length >= 20,
            you: t >= 0 ? `in` : r >= 0 ? `waiting` : null,
            waiting: r >= 0 ? r + 1 : null
        }
    }
    if (!t)
        return {
            state: `live`,
            you: a.some(e => e.id === n),
            left: a.length,
            of: a.length,
            map: `apex`,
            leg: 1,
            final: !1
        };
    if (t.phase !== `over`) {
        let e = t.riders.find(e => e.id === n)
          , r = C(t)
          , i = qe(t);
        return {
            state: `live`,
            you: !!e && r.includes(e),
            left: r.length,
            of: t.riders.length,
            map: i.map,
            leg: i.leg + 1,
            final: !!i.final
        }
    }
    let s = t.at + i;
    if (r >= s)
        return {
            state: `soon`
        };
    let c = ct(t)
      , l = c.find(e => e.place === 1) ?? null
      , u = c.find(e => e.id === n) ?? null;
    return {
        state: `finished`,
        winner: l && {
            id: l.id,
            name: l.name
        },
        place: u?.place ?? null,
        of: c.filter(e => e.place !== null).length,
        until: s
    }
}
function Cr(e) {
    let t = Math.max(0, Math.ceil(e / 1e3))
      , n = Math.floor(t / 86400)
      , r = Math.floor(t / 3600) % 24
      , i = Math.floor(t / 60) % 60
      , a = t % 60;
    return n > 0 ? `${n}D ${r}H` : r > 0 ? `${r}:${String(i).padStart(2, `0`)}:${String(a).padStart(2, `0`)}` : `${i}:${String(a).padStart(2, `0`)}`
}
function wr(e) {
    let t = new Date(e);
    return `${t.toLocaleDateString(`en-US`, {
        weekday: `short`
    }).toUpperCase()} ${String(t.getHours()).padStart(2, `0`)}:${String(t.getMinutes()).padStart(2, `0`)}`
}
var Tr = 1e3
  , Er = 1e4
  , U = 4096
  , Dr = class {
    constructor() {
        this.stamps = new Float64Array(U),
        this.intervals = new Float32Array(U),
        this.work = new Float32Array(U),
        this.next = 0,
        this.filled = 0
    }
    add(e, t, n) {
        t > 0 && (this.stamps[this.next] = e,
        this.intervals[this.next] = t,
        this.work[this.next] = n,
        this.next = (this.next + 1) % U,
        this.filled = Math.min(U, this.filled + 1))
    }
    reset() {
        this.next = 0,
        this.filled = 0
    }
    snapshot(e) {
        let t = 0
          , n = 0
          , r = 0
          , i = 0
          , a = [];
        for (let o = 1; o <= this.filled; o++) {
            let s = (this.next - o + U) % U
              , c = e - this.stamps[s];
            if (c > Er)
                break;
            a.push(this.intervals[s]),
            (c <= Math.max(Tr, this.intervals[s]) || o === 1) && (t++,
            n += this.intervals[s],
            r = Math.max(r, this.intervals[s]),
            i += this.work[s])
        }
        a.sort( (e, t) => t - e);
        let o = a[Math.floor(a.length / 100)] ?? 0;
        return {
            fps: n > 0 ? t * 1e3 / n : 0,
            frameMs: t ? n / t : 0,
            worstMs: r,
            low1: o > 0 ? 1e3 / o : 0,
            cpuMs: t ? i / t : 0
        }
    }
}
  , Or = 20
  , kr = class {
    constructor() {
        this.waiting = [],
        this.trips = [],
        this.answered = [],
        this.next = 1,
        this.bytesIn = 0,
        this.bytesOut = 0,
        this.poses = 0,
        this.mark = null,
        this.rates = {
            down: 0,
            up: 0,
            poses: 0
        }
    }
    ping(e) {
        this.expire(e),
        this.waiting.length >= 50 && (this.waiting.shift(),
        this.counted(!1));
        let t = this.next++;
        return this.waiting.push({
            n: t,
            at: e
        }),
        t
    }
    pong(e, t) {
        this.expire(e);
        let n = t === void 0 ? 0 : this.waiting.findIndex(e => e.n === t);
        if (n < 0 || n >= this.waiting.length)
            return;
        let r = this.waiting[n].at;
        for (let e = 0; e < n; e++)
            this.counted(!1);
        this.waiting.splice(0, n + 1),
        this.counted(!0),
        this.trips.push(e - r),
        this.trips.length > 10 && this.trips.shift()
    }
    expire(e) {
        for (; this.waiting.length && e - this.waiting[0].at > 1e4; )
            this.waiting.shift(),
            this.counted(!1)
    }
    counted(e) {
        this.answered.push(e),
        this.answered.length > Or && this.answered.shift()
    }
    received(e, t=0) {
        this.bytesIn += e,
        this.poses += t
    }
    sent(e) {
        this.bytesOut += e
    }
    reset() {
        this.waiting.length = 0,
        this.trips.length = 0,
        this.answered.length = 0
    }
    snapshot(e, t) {
        this.expire(e),
        this.mark ||= {
            at: e,
            bytesIn: this.bytesIn,
            bytesOut: this.bytesOut,
            poses: this.poses
        };
        let n = (e - this.mark.at) / 1e3;
        n >= 1 && (this.rates = {
            down: (this.bytesIn - this.mark.bytesIn) / n / 1024,
            up: (this.bytesOut - this.mark.bytesOut) / n / 1024,
            poses: (this.poses - this.mark.poses) / n
        },
        this.mark = {
            at: e,
            bytesIn: this.bytesIn,
            bytesOut: this.bytesOut,
            poses: this.poses
        });
        let r = this.trips.slice(-5).sort( (e, t) => e - t)
          , i = null;
        if (this.trips.length >= 2) {
            let e = 0;
            for (let t = 1; t < this.trips.length; t++)
                e += Math.abs(this.trips[t] - this.trips[t - 1]);
            i = e / (this.trips.length - 1)
        }
        let a = this.answered.filter(e => !e).length;
        return {
            pingMs: r.length ? r[Math.floor(r.length / 2)] : null,
            jitterMs: i,
            lossPct: this.answered.length ? 100 * a / this.answered.length : null,
            downKBs: this.rates.down,
            upKBs: this.rates.up,
            updatesHz: t ? this.rates.poses / t : 0
        }
    }
}
;
function Ar(e) {
    let t = e.match(/^ANGLE \((.*)\)$/)?.[1] ?? e;
    return (t.match(/Renderer: ([^,]+)/)?.[1] ?? (t === e ? e : t.split(`,`)[1] ?? t)).replace(/\s+(Direct3D|OpenGL|vs_|ps_|\(0x).*$/, ``).trim().slice(0, 40)
}
var jr = {
    apex: {
        z: -8,
        spacing: 1.6
    },
    forestline: {
        z: -6,
        spacing: 1.5
    },
    halfpipe: {
        z: -18,
        spacing: 1.6,
        x: -6.5,
        half: 20.5
    },
    bigair: {
        z: -6,
        spacing: 1.5,
        half: 20
    }
}
  , Mr = {
    steer: 0,
    forward: !1,
    brake: !1,
    jump: !1,
    grab: !1
};
function Nr(e, t, n, r) {
    let i = jr[t] ?? jr.apex
      , a = e.PARK_ENTRY_Z + i.z
      , o = pe.atan(e.courseTangent(a))
      , s = Math.max(.5, (Math.min(r, 30) - 1) / 2)
      , c = i.half === void 0 ? i.spacing : Math.min(i.spacing, i.half / s)
      , l = (i.x ?? 0) + ut(n, r) * c
      , u = e.center(a) + l * pe.cos(o)
      , d = a - l * pe.sin(o);
    return {
        x: u,
        y: e.terrainHeight(u, d),
        z: d,
        heading: o
    }
}
var Pr = class {
    constructor(e, t, n, r) {
        this.riding = !1,
        this.input = Mr,
        this.air = 0,
        this.wasAir = !1,
        this.spin = 1,
        this.spinFor = 1.2,
        this.grabStyle = 1,
        this.still = 0,
        this.course = e,
        this.lane = n,
        this.seed = r >>> 0 || 1,
        this.s = new e.SkiSimulation,
        this.s.collisions = t,
        this.lips = [...e.JUMPS.map(e => ({
            z: e.z,
            x: e.offset
        })), ...e.RAILS.filter(e => e.entry === `pop` && Math.abs(e.offset) < 1).map(e => ({
            z: e.z - 4,
            x: e.offset
        }))].sort( (e, t) => e.z - t.z)
    }
    random() {
        return (this.seed = this.seed * 16807 % 2147483647) / 2147483647
    }
    toLine(e) {
        let t = this.s;
        t.phase === `skiing` && (t.phase = `finished`),
        t.paused = !1,
        t.boardLift(),
        t.fastTravel(),
        Object.assign(t, e, {
            travelHeading: e.heading
        }),
        this.riding = !1,
        this.air = 0,
        this.wasAir = !1,
        this.still = 0
    }
    step() {
        let e = this.s
          , t = this.course;
        if (e.airborne && !this.wasAir && (this.spin = this.random() < .5 ? -1 : 1,
        this.spinFor = .9 + this.random() * 1.1,
        this.grabStyle = Math.floor(this.random() * 3),
        this.air = 0),
        this.wasAir = e.airborne,
        e.airborne)
            this.air += 1 / 60,
            this.input = {
                ...Mr,
                steer: this.air < this.spinFor ? this.spin : 0,
                grab: !0,
                grabStyle: this.grabStyle
            };
        else {
            let n = 28 + e.speed * .35
              , r = this.lips.find(t => t.z > e.z)
              , i = r === void 0 ? 1 / 0 : r.z - e.z
              , a = i < 45 ? 1 - Math.max(0, (i - 20) / 25) : 0
              , o = this.lane * (1 - a) + (r ? r.x : 0) * a + 2 * Math.sin(this.seed % 97 + e.z / 90) * (1 - a)
              , s = Math.atan2(t.center(e.z + n) + o - e.x, n)
              , c = Math.atan2(Math.sin(s - e.travelHeading), Math.cos(s - e.travelHeading));
            this.input = {
                ...Mr,
                steer: e.grind ? 0 : Math.max(-1, Math.min(1, c * 2.7 / (.72 + Math.min(.42, e.speed / 85)))),
                forward: e.speed < 11,
                jump: i < 15 && i > 3
            }
        }
        this.still = e.speed < .5 && !e.airborne && e.crashTime <= 0 ? this.still + 1 : 0,
        this.still > 120 && (e.recover(),
        this.still = 0),
        e.update(1 / 60, this.input)
    }
}
  , Fr = `cork7-train-test-v2`
  , Ir = 60
  , Lr = 1
  , Rr = `NORDLYS.FJELLREV.SKAVL.POLARIS.RYPE.LAVINE.TINDE.ISBRE.FOKK.HAGL.VARDE.GRANA.STORM.BRATT.KORK.PUDDER.SPRUT.KAMMEN.BREEN.FONNA.JUVET.SKARE.TOPP.LIA.ELVA.NUTEN.KULDE.DALEN.MAANE`.split(`.`)
  , zr = {
    apex: 5.5,
    forestline: 7,
    halfpipe: 10,
    bigair: 22
};
function W(e) {
    let t = 2166136261;
    for (let n = 0; n < e.length; n++)
        t = Math.imul(t ^ e.charCodeAt(n), 16777619) >>> 0;
    return t
}
function Br(e) {
    let t = W(e)
      , n = e => de[(t >>> e) % de.length].color;
    return {
        ...fe,
        jacket: n(0),
        pants: n(7),
        helmet: n(14)
    }
}
function Vr(e=localStorage) {
    try {
        let t = JSON.parse(e.getItem(Fr) ?? `null`);
        return t?.v === 2 ? t : null
    } catch {
        return null
    }
}
function Hr(e, t=localStorage) {
    try {
        e ? t.setItem(Fr, JSON.stringify(e)) : t.removeItem(Fr)
    } catch {}
}
function Ur(e) {
    let t = 1;
    try {
        localStorage.getItem(`cork7-train-test-weak`) === `1` && (t = .01)
    } catch {}
    let n = Rr[e];
    return {
        id: `bot-${e}`,
        name: n,
        level: (.55 + (W(n) >>> 3) % 1e3 / 1e3 * .9) * t,
        seed: 1e3 + W(n) % 1e5
    }
}
var Wr = e => (e || `RIDER`).toUpperCase().slice(0, 20);
function Gr(e, t, n, r=`zero`) {
    let i = Array.from({
        length: Math.max(0, Math.min(29, t))
    }, (e, t) => Ur(t))
      , a = {
        id: `you`,
        name: Wr(e)
    };
    return {
        v: 2,
        created: n,
        you: a.id,
        bots: i,
        event: Ye([a, ...i], n, r)
    }
}
var G = {
    opens: 6e4,
    open: 12e4,
    winner: 12e4,
    bots: 21
}
  , Kr = `cork7-train-schedule-test-v1`
  , qr = `cork7-train-test-beat`;
function K() {
    try {
        let e = JSON.parse(localStorage.getItem(Kr) ?? `null`);
        return e?.v === 1 ? e : null
    } catch {
        return null
    }
}
function q(e) {
    try {
        e ? localStorage.setItem(Kr, JSON.stringify(e)) : localStorage.removeItem(Kr)
    } catch {}
}
var Jr = e => ({
    v: 1,
    opens: e + G.opens,
    starts: e + G.opens + G.open,
    signups: [],
    next: null,
    train: null
})
  , Yr = (e, t) => e.opens + (t + 1) / (G.bots + 1) * (e.starts - e.opens) * .9;
function Xr(e, t) {
    let n = xr(e.signups).riders;
    return {
        v: 2,
        created: t,
        you: `you`,
        bots: n.filter(e => e.id !== `you`).map(e => Ur(Number(e.id.split(`-`)[1]))),
        event: Ye(n.map(e => ({
            id: e.id,
            name: e.name
        })), t, Vr()?.event.finalRule)
    }
}
function Zr(e) {
    try {
        return e - Number(localStorage.getItem(qr) ?? 0) < 3e3
    } catch {
        return !1
    }
}
var Qr = {
    apex: {
        seconds: 55,
        score: 14e4
    },
    forestline: {
        seconds: 140,
        score: 125e3
    },
    halfpipe: {
        seconds: 45,
        score: 11e4
    },
    bigair: {
        seconds: 20,
        score: 1e5
    }
};
function $r(e, t) {
    let n = e.event;
    for (let r = 0; n.phase !== `over` && r < 200; r++) {
        if (n.phase === `lineup`)
            for (let t of e.bots)
                rt(n, t.id, n.at);
        if (n.phase === `run`) {
            let r = Qr[b(n)]
              , i = e.bots.map(e => {
                let t = W(`${e.seed}:${n.run}`) / 4294967296;
                return {
                    bot: e,
                    at: n.at + r.seconds * 1e3 * (.85 + .4 * t),
                    mark: Math.round(r.score * e.level * (.75 + .5 * t))
                }
            }
            ).sort( (e, t) => e.at - t.at);
            for (let e of i)
                e.at <= Math.min(t, n.ends) && it(n, e.bot.id, e.mark, e.at);
            if (n.phase !== `run`)
                continue
        }
        if (n.ends > t)
            return;
        st(n, n.ends)
    }
}
function ei(e) {
    let t = K();
    t || (t = Jr(e),
    q(t));
    let n = !1;
    for (let r = 0; r < G.bots; r++) {
        let i = Yr(t, r)
          , a = `bot-${r}`;
        i <= e && i < t.starts && !t.signups.some(e => e.id === a) && (t.signups.push({
            id: a,
            name: Rr[r],
            at: i
        }),
        n = !0)
    }
    let r = xr(t.signups).riders.some(e => e.id === `you`);
    if (e >= t.starts && !t.train && !r && (t.train = Xr(t, t.starts),
    n = !0),
    t.train && t.train.event.phase !== `over` && !Zr(e)) {
        let r = JSON.stringify(t.train.event);
        $r(t.train, e),
        n ||= JSON.stringify(t.train.event) !== r
    }
    return n && q(t),
    {
        schedule: t,
        card: Sr(t, t.train?.event ?? null, `you`, e, G.winner)
    }
}
var ti = {
    signUp(e, t, n) {
        let r = K();
        !r || !br(n) || t < r.opens || t >= r.starts || r.signups.some(e => e.id === `you`) || (r.signups.push({
            id: `you`,
            name: Wr(e),
            at: t
        }),
        q(r))
    },
    withdraw() {
        let e = K();
        e && (e.signups = e.signups.filter(e => e.id !== `you`),
        q(e))
    },
    skip(e) {
        let t = K();
        if (t) {
            if (e < t.opens)
                t.opens = e,
                t.starts = e + G.open;
            else if (e < t.starts) {
                for (let n = 0; n < G.bots; n++)
                    t.signups.some(e => e.id === `bot-${n}`) || t.signups.push({
                        id: `bot-${n}`,
                        name: Rr[n],
                        at: e + n
                    });
                t.starts = e
            } else
                t.train && t.train.event.phase !== `over` && !Zr(e) ? $r(t.train, 2 ** 53 - 1) : t.train?.event.phase === `over` && (t.train.event.at = e - G.winner);
            q(t)
        }
    },
    restart(e) {
        q(Jr(e))
    }
}
  , ni = `cork7-cup-test-best`
  , ri = [`real`, `200000`, `300000`];
function ii() {
    try {
        let e = localStorage.getItem(ni);
        return ri.includes(e ?? ``) ? e : `real`
    } catch {
        return `real`
    }
}
function ai(e) {
    try {
        e === `real` ? localStorage.removeItem(ni) : localStorage.setItem(ni, e)
    } catch {}
}
var oi = class {
    constructor(e, t, n, r, i=29) {
        this.status = `off`,
        this.me = 0,
        this.cap = 30,
        this.roomNumber = 1,
        this.riders = new Map,
        this.net = new kr,
        this.train = null,
        this.riding = new Map,
        this.scheduled = !1,
        this.beatAt = 0,
        this.timers = new Set,
        this.accumulator = 0,
        this.sentAt = 0,
        this.seen = ``,
        this.name = e,
        this.hooks = t,
        this.course = n,
        this.collisions = r,
        this.bots = i
    }
    get online() {
        return this.status === `online`
    }
    get onThisMap() {
        return !!this.train && b(this.train.event) === le.id
    }
    later(e, t) {
        let n = setTimeout( () => {
            this.timers.delete(n),
            t()
        }
        , e);
        this.timers.add(n)
    }
    connect() {
        this.status === `off` && (this.status = `connecting`,
        this.hooks.change(),
        this.later(300, () => {
            let e = Date.now(), t = K(), n;
            if (t && e >= t.starts && !(t.train?.event.phase === `over` && e - t.train.event.at > 6e4) ? (n = t.train ??= Xr(t, e),
            this.scheduled = !0,
            q(t)) : (n = Vr(),
            (!n || e - n.created > 36e5 || n.event.phase === `over` && e - n.event.at > 6e4) && (n = Gr(this.name, this.bots, e, n?.event.finalRule))),
            this.train = n,
            this.save(),
            this.status = `online`,
            this.me = Lr,
            this.onThisMap) {
                let e = this.collisions()
                  , t = n.event.run;
                n.bots.forEach( (r, i) => {
                    let a = n.event.riders.find(e => e.id === r.id);
                    if (!a || !S(a, t))
                        return;
                    let o = Math.max(-6, Math.min(6, (a.slot % 2 ? 1 : -1) * Math.ceil(a.slot / 2) * .55))
                      , s = {
                        bot: r,
                        rider: new Pr(this.course,e,o,r.seed),
                        room: 2 + i,
                        poseAt: 0,
                        scoreAt: 0,
                        lastScore: -1
                    };
                    this.riding.set(r.id, s);
                    let c = {
                        id: s.room,
                        name: r.name,
                        outfit: Br(r.name)
                    };
                    this.riders.set(s.room, c),
                    this.hooks.join(c)
                }
                )
            }
            this.hooks.change(),
            this.send(e)
        }
        ))
    }
    disconnect() {
        for (let e of this.timers)
            clearTimeout(e);
        this.timers.clear();
        for (let e of this.riders.keys())
            this.hooks.leave(e);
        this.riders.clear(),
        this.riding.clear(),
        this.status = `off`,
        this.me = 0,
        this.hooks.change()
    }
    sendTrain(e) {
        this.later(Ir, () => {
            let t = this.train
              , n = Date.now();
            if (!t)
                return;
            let r = t.event;
            e.op === `here` ? rt(r, t.you, n) : e.op === `run` && e.run === r.run ? it(r, t.you, e.mark, n) : e.op === `leave` && at(r, t.you, n),
            this.save(),
            this.send(n)
        }
        )
    }
    save() {
        let e = this.train;
        if (!e)
            return;
        if (!this.scheduled) {
            Hr(e);
            return
        }
        let t = K();
        t && t.train?.created === e.created && (t.train = e,
        q(t)),
        this.beat(Date.now())
    }
    beat(e) {
        this.beatAt = e;
        try {
            localStorage.setItem(qr, String(e))
        } catch {}
    }
    reset() {
        this.train && !this.scheduled && Hr({
            ...this.train,
            created: 0
        }),
        this.train = null
    }
    setFinalRule(e) {
        if (this.train) {
            if (this.train.event.finalRule = e,
            this.save(),
            this.scheduled) {
                let t = Vr();
                t && (t.event.finalRule = e,
                Hr(t))
            }
            this.send(Date.now())
        }
    }
    update(e) {
        let t = this.train;
        if (!this.online || !t)
            return;
        let n = Date.now()
          , r = t.event
          , i = `${r.run}:${r.phase}`;
        if (r.phase === `lineup` && this.onThisMap)
            for (let e of this.riding.keys())
                rt(r, e, n);
        st(r, n);
        let a = `${r.run}:${r.phase}`;
        a !== this.seen && (this.seen = a,
        this.started(r)),
        this.onThisMap && this.ride(e, n, r),
        a === i ? this.scheduled && n - this.beatAt > 1e3 && this.beat(n) : this.save(),
        (a !== i || n - this.sentAt > 1e3) && this.send(n)
    }
    started(e) {
        if (!this.onThisMap)
            return;
        let t = C(e).length;
        for (let[n,r] of this.riding) {
            let i = e.riders.find(e => e.id === n);
            if (!i || !S(i, e.run)) {
                r.rider.riding = !1;
                continue
            }
            let a = () => Nr(this.course, b(e), dt(e, n), t);
            (e.phase === `lineup` || e.phase === `count`) && (r.rider.riding || r.rider.toLine(a())),
            e.phase === `run` && i.marks[e.run] === null && (r.rider.s.phase !== `skiing` && r.rider.toLine(a()),
            r.rider.riding = !0),
            (e.phase === `results` || e.phase === `over`) && (r.rider.riding = !1)
        }
    }
    scaled(e, t) {
        return Math.round(e.rider.s.score * (zr[t] ?? zr.apex) * e.bot.level)
    }
    ride(e, t, n) {
        let r = b(n)
          , i = [...this.riding.values()].filter(e => e.rider.riding);
        for (this.accumulator = Math.min(this.accumulator + e, .1); this.accumulator >= 1 / 60; ) {
            this.accumulator -= 1 / 60;
            for (let e of i) {
                let i = e.rider;
                if (!i.riding || i.s.phase !== `skiing`)
                    continue;
                i.step();
                let a = i.s.trickEvent;
                a && this.hooks.event({
                    id: e.room,
                    kind: a.kind,
                    text: a.text,
                    score: Math.round(a.score * (zr[r] ?? 1) * e.bot.level),
                    impact: a.impact
                }),
                i.s.phase !== `skiing` && (i.riding = !1,
                it(n, e.bot.id, this.scaled(e, r), t),
                i.s.phase === `finished` && this.hooks.pose(e.room, me(e.room, performance.now() / 1e3 - this.accumulator, i.s, i.input)))
            }
        }
        let a = performance.now()
          , o = n.phase === `lineup` || n.phase === `count` || n.phase === `run`;
        for (let[e,t] of this.riding) {
            let i = t.rider
              , s = n.riders.find(t => t.id === e);
            i.s.phase === `skiing` && o && s && S(s, n.run) && a - t.poseAt > 95 && (t.poseAt = a,
            this.hooks.pose(t.room, me(t.room, a / 1e3 - this.accumulator, i.s, i.input, i.s.crashTime > 0 ? i.s.ragdoll : void 0)));
            let c = n.phase === `run` || n.phase === `results` ? this.scaled(t, r) : 0;
            if (c !== t.lastScore && a - t.scoreAt > 500) {
                t.lastScore = c,
                t.scoreAt = a;
                let e = this.riders.get(t.room);
                e && this.riders.set(t.room, {
                    ...e,
                    score: c
                }),
                this.hooks.score?.(t.room, c),
                this.hooks.change()
            }
        }
    }
    send(e) {
        let t = this.train;
        if (!t)
            return;
        this.sentAt = e;
        let n = {
            [t.you]: Lr
        }
          , r = t.event;
        for (let[e,t] of this.riding)
            n[e] = t.room;
        let i = !r.riders.some(e => e.id === t.you && !e.gone)
          , a = r.riders.filter(e => !e.gone && e.cutAt !== null && e.cutAt <= r.run).length + +!!i;
        this.hooks.train?.(structuredClone({
            now: e,
            event: r,
            you: t.you,
            ids: n,
            watchers: a,
            scheduled: this.scheduled
        }))
    }
    setActivity() {}
    setProbe() {}
    setAccessToken() {}
    setOutfit() {}
    rename(e) {
        this.name = e
    }
    sendPose() {}
    stopPose() {}
    sendEvent() {}
    sendScore() {}
    sendChat(e) {
        this.online && this.later(Ir, () => this.hooks.chat?.({
            id: this.me,
            name: this.name,
            text: e
        }))
    }
    sendQuick(e) {
        this.online && this.later(Ir, () => this.hooks.chat?.({
            id: this.me,
            name: this.name,
            quick: e
        }))
    }
    sendDuel() {}
    report() {
        this.hooks.notice?.(`Reported. Thanks.`)
    }
}
  , si = [`follow`, `drone`, `tv`, `cinematic`, `gopro`, `pov`, `orbit`, `free`]
  , ci = {
    follow: `Follow`,
    drone: `Drone`,
    tv: `TV`,
    cinematic: `Cinematic`,
    gopro: `GoPro follow`,
    pov: `POV`,
    orbit: `Orbit`,
    free: `Free cam`
}
  , li = [`cinematic`, `gopro`, `pov`, `free`]
  , ui = {
    language: `Bad language in chat`,
    bullying: `Bullying`,
    contact: `Asking for contact info`,
    cheating: `Cheating`,
    name: `An offensive rider name`,
    other: `Breaking the chat rules`
};
function di(e) {
    let t = e.replace(/^(Report|Moderator): /, ``);
    return t === `language` || t === `bullying` || t === `contact` || t === `cheating` || t === `name` ? t : `other`
}
function fi(e) {
    let t = e;
    return !t || typeof t != `object` || t.until !== null && !(typeof t.until == `number` && Number.isFinite(t.until)) ? null : {
        until: t.until,
        why: typeof t.why == `string` ? di(t.why) : `other`
    }
}
function pi(e, t) {
    let n = Math.max(1, Math.ceil((e - t) / 6e4))
      , r = Math.floor(n / 1440)
      , i = Math.floor(n % 1440 / 60)
      , a = n % 60;
    return r ? `${r} D${i ? ` ${i} H` : ``}` : i ? `${i} H${a ? ` ${a} MIN` : ``}` : `${n} MIN`
}
var mi = `cork7-graphics-quality`
  , hi = `cork7-graphics-auto`
  , J = `cork7-frame-cap`
  , gi = {
    quality: `high`,
    source: `default`,
    reason: null
};
function _i(e) {
    return e === `performance` || e === `ultra` ? e : `high`
}
function vi(e) {
    return e === `high` || e === `ultra`
}
var yi = e => e === `software` || e === `device` || e === `slow` ? e : null;
function bi(e, t) {
    if (e === `ultra` || e === `high` || e === `performance`)
        return {
            quality: e,
            source: `player`,
            reason: null
        };
    let n = yi(t);
    return n ? {
        quality: `performance`,
        source: `auto`,
        reason: n
    } : gi
}
function xi(e, t=0) {
    return /iPhone|iPad|iPod|Android|Cork7iOS\//i.test(e) || /Macintosh/.test(e) && t > 1
}
function Si(e, t) {
    return t && e.source === `default` ? {
        quality: `performance`,
        source: `auto`,
        reason: `device`
    } : e
}
function Ci() {
    let e = gi;
    try {
        e = bi(localStorage.getItem(mi), localStorage.getItem(hi))
    } catch {}
    return Si(e, typeof navigator < `u` && xi(navigator.userAgent, navigator.maxTouchPoints))
}
function wi(e) {
    try {
        localStorage.setItem(mi, e),
        localStorage.removeItem(hi)
    } catch {}
}
function Ti(e) {
    try {
        localStorage.setItem(hi, e)
    } catch {}
}
function Ei(e) {
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(e)
}
function Di(e, t, n) {
    return Ei(e) ? `software` : typeof t == `number` && t > 0 && t <= 4 || typeof n == `number` && n > 0 && n <= 2 ? `device` : null
}
var Oi = class {
    constructor() {
        this.frames = [],
        this.limit = 45,
        this.span = 4e3
    }
    reset() {
        this.frames = []
    }
    add(e, t) {
        if (!(e > 0) || e > 2e3)
            return this.frames = [],
            !1;
        for (this.frames.push({
            at: t,
            interval: e
        }); this.frames.length && this.frames[0].at < t - this.span; )
            this.frames.shift();
        if (this.frames.length < 6 || t - this.frames[0].at < this.span * .75)
            return !1;
        let n = this.frames.map(e => e.interval).sort( (e, t) => e - t);
        return n[Math.floor(n.length / 2)] > this.limit
    }
}
;
function ki() {
    try {
        return localStorage.getItem(J) === `30`
    } catch {
        return !1
    }
}
function Ai(e) {
    try {
        e ? localStorage.setItem(J, `30`) : localStorage.removeItem(J)
    } catch {}
}
var ji = [{
    keys: `{steerLeft} / {steerRight}`,
    action: `Carve / spin`,
    extra: `Spin with {brake} for a cork, with {tuck} for a bio, with {rollLeft} or {rollRight} for a flatspin, set together at the lip: a spin added later only tilts the flip.`
}, {
    keys: `{rollLeft} / {rollRight}`,
    action: `Air roll`,
    extra: `Roll around the skis’ forward axis: alone a sideflip, with a spin a flatspin that lies flat.`
}, {
    keys: `{tuck}`,
    action: `Pole / tuck · frontflip in the air`,
    extra: `Hold for speed. In the air, starts toward the rider’s front, also switch or after a 180.`
}, {
    keys: `{brake}`,
    action: `Brake · backflip in the air`,
    extra: `In the air, starts toward the rider’s back, also switch or after a 180. Reversing first slows the existing flip.`
}, {
    keys: `{cork} + spin + flip`,
    action: `Rodeo / misty`,
    extra: `The feet go over the head: a rodeo with {brake}, a misty with {tuck}. Tricks are judged from completed movement, not the key you held.`
}, {
    keys: `{butter}`,
    action: `Arm nose / tail butter`,
    extra: `Hold {butter} to keep your own air angle and prepare a contact: nose by default; press it together with {brake} to select tail. A ski-end hit on snow loads the flex; {steerLeft}/{steerRight} drives one half turn, with a little extra drift from your incoming spin. A press slows you and lasts up to 1.5 seconds; release earlier to rebound. Wait 1 second after it ends, then press {butter} again. Too little impact gives no press; too much releases the press. Normal steering and air tricks remain available. Butter does not activate on rails or boxes. A loaded press held for at least 0.25 seconds while moving earns 150 points after landing, or 300 total for a butter 180. Repeats pay less.`
}, {
    keys: `{pop}`,
    action: `Load / pop`,
    extra: `Hold to load, release to jump. Kickers also launch you automatically.`
}, {
    keys: `{mute}`,
    action: `Mute grab in the air`,
    extra: `Hold while airborne. Release to open up for landing.`
}, {
    keys: `{tail} / {japan}`,
    action: `Tail / Japan grab`,
    extra: `Hold a grab 0.25s to count it. Held 1s it adds 25% rotation points, each other grab 5%. Release to open up.`
}, {
    keys: `ON A RAIL`,
    action: `{steerLeft}/{steerRight} slides · {pop} pops off`,
    extra: `Rails carry you forward. Rotation continues off the end.`
}, {
    keys: `{skip}`,
    action: `Skip gondola ride`,
    extra: `Arrive at the summit, ready to ski.`
}, {
    keys: `{chat}`,
    action: `Chat (multiplayer)`,
    extra: `Enter sends, Esc closes. Hold Tab to see everyone on the mountain.`
}, {
    keys: `{restart}`,
    action: `Restart run`,
    extra: `Hold {restart} for 2 s to start the run again from the top.`
}, {
    keys: `ESC / {pause}`,
    action: `Menu / pause`,
    extra: `Settings, controls and friends. Esc goes back one menu level.`
}, {
    keys: `CONTROLLER`,
    action: `Left stick: turn · right stick: air roll`,
    extra: `{pad}`
}, {
    keys: `REPLAY`,
    action: `SPACE plays · arrows seek · C camera`,
    extra: `Save a run from the results screen. Open it to export a video clip.`
}];
function Mi(e, t) {
    let n = {
        butter: `butter`,
        pop: `pop`,
        cork: `rodeo/misty`,
        tuck: `tuck/front`,
        brake: `brake/back`,
        mute: `mute`,
        tail: `tail`,
        japan: `Japan`,
        restart: `hold to restart`,
        pause: `pause`
    };
    return `${k.filter(t => n[t.id] && e.buttons[t.id].length).map(r => `${e.buttons[r.id].map(e => N(e, t)).join(`/`)}: ${n[r.id]}`).join(` · `)}. ${t === `playstation` ? `PlayStation` : `Xbox`} buttons; change them in Settings → Controls.`
}
function Ni(e, t, n, r=`xbox`) {
    return e.replace(/\{(\w+)\}/g, (e, i) => i === `pad` ? Mi(t, r) : t.keys[i]?.[0] ? mn(t.keys[i][0], n) : `—`)
}
function Pi(e, t, n=`xbox`) {
    let r = r => Ni(r, e, t, n);
    return ji.map(e => ({
        keys: r(e.keys),
        action: r(e.action),
        extra: r(e.extra)
    }))
}
var Y = {
    music: .5,
    wind: .5,
    effects: .5
}
  , Fi = `cork7-sound`
  , Ii = `whiteout-music`
  , Li = .42
  , Ri = e => (e / Y.wind) ** 2
  , zi = e => e * e
  , Bi = (e, t) => Math.round(Math.min(1, Math.max(0, typeof e == `number` && Number.isFinite(e) ? e : t)) * 100) / 100;
function X(e) {
    let t = e && typeof e == `object` ? e : {};
    return {
        music: Bi(t.music, Y.music),
        wind: Bi(t.wind, Y.wind),
        effects: Bi(t.effects, Y.effects)
    }
}
function Vi() {
    try {
        let e = localStorage.getItem(Fi);
        if (e !== null)
            return X(JSON.parse(e));
        let t = JSON.parse(localStorage.getItem(Ii) ?? `null`)
          , n = t && typeof t.volume == `number` && Number.isFinite(t.volume) ? Math.min(1, Math.max(0, t.volume)) : null;
        return X({
            ...Y,
            music: n === null || Math.abs(n - Li) < 1e-6 ? Y.music : Math.sqrt(n)
        })
    } catch {
        return {
            ...Y
        }
    }
}
function Hi(e) {
    let t = X(e);
    try {
        localStorage.setItem(Fi, JSON.stringify(t))
    } catch {}
    return t
}
var Ui = {
    lift: `ON THE GONDOLA`,
    replay: `WATCHING A REPLAY`,
    results: `BETWEEN RUNS`,
    pause: `PAUSED`,
    away: `AWAY`
}
  , Wi = e => e.split(` / `)[0];
function Gi(e, t, n, r) {
    return e === `pause` || e === `away` ? n ? `${Wi(n)} (${Ui[e]})` : Ui[e] : e && e !== `ride` ? Ui[e] : t ?? (r > ue ? `IDLE` : `AT THE LIFT`)
}
function Ki(e) {
    let t = 0
      , n = 0
      , r = [];
    for (let i = e.length - 1; i >= 0; i--) {
        let a = e[i];
        (a.event ? n++ < 12 : t++ < 60) && r.push(a)
    }
    return r.reverse()
}
function qi(e, t, n=Date.now()) {
    let r = new Set;
    return t.filter(t => {
        let i = n - (t.age ?? 0)
          , a = null;
        for (let n of e)
            n.event || r.has(n.key) || n.name !== t.name || n.text !== t.text || n.quick !== t.quick || Math.abs(n.at - i) > 2e4 || (!a || Math.abs(n.at - i) < Math.abs(a.at - i)) && (a = n);
        return a && r.add(a.key),
        !a
    }
    )
}
var Ji = `cork7-light-look`;
function Yi(e) {
    return e === `golden` ? `golden` : `crisp`
}
function Xi() {
    try {
        return Yi(localStorage.getItem(Ji))
    } catch {
        return `crisp`
    }
}
function Zi(e) {
    try {
        e === `crisp` ? localStorage.removeItem(Ji) : localStorage.setItem(Ji, e)
    } catch {}
}
var Qi = {
    crisp: {
        sun: [-.85, .32, .3],
        color: `#fff4e6`,
        intensity: 3.6,
        sky: {
            day: 1,
            twilight: 0
        },
        glowTowardSun: !0,
        skyLight: `#7ea6dc`,
        bounce: `#dfe8f2`,
        ambient: .55,
        environment: .3,
        fog: `#c4d4e4`,
        matte: 0,
        clouds: .5
    },
    golden: {
        sun: [.25, .14, .96],
        color: `#ffbd7a`,
        intensity: 3,
        sky: {
            day: .8,
            twilight: .5
        },
        glowTowardSun: !0,
        skyLight: `#7f9fcf`,
        bounce: `#efe2d2`,
        ambient: .45,
        environment: .25,
        fog: `#e6d6cc`,
        matte: .7,
        clouds: .9
    }
}
  , Z = 6
  , Q = 9
  , $i = 1
  , ea = 2
  , ta = 4
  , na = 8
  , ra = 16
  , ia = 32
  , aa = 64
  , oa = 128
  , sa = 128
  , $ = e => Math.max(-1e3, Math.min(1e3, Math.round((Number.isFinite(e) ? e : 0) * 1e3)));
function ca(e) {
    return {
        steer: $(e.steer) / 1e3,
        airRoll: $(e.airRoll ?? 0) / 1e3,
        forward: !!e.forward,
        brake: !!e.brake,
        jump: !!e.jump,
        grab: !!e.grab,
        cork: !!e.cork,
        over: !!e.over,
        butter: !!e.butter,
        grabStyle: e.grabStyle ?? 0,
        board: !!e.board
    }
}
var la = class {
    constructor() {
        this.data = new Uint8Array(Q + 4096 * Z),
        this.steps = 0
    }
    push(e, t=!1) {
        if (Q + (this.steps + 1) * Z > this.data.length) {
            let e = new Uint8Array(this.data.length * 2);
            e.set(this.data),
            this.data = e
        }
        let n = new DataView(this.data.buffer)
          , r = Q + this.steps * Z;
        n.setInt16(r, $(e.steer), !0),
        n.setInt16(r + 2, $(e.airRoll ?? 0), !0),
        this.data[r + 4] = (e.forward ? $i : 0) | (e.brake ? ea : 0) | (e.jump ? ta : 0) | (e.grab ? na : 0) | (e.cork ? ra : 0) | (t ? ia : 0) | (e.over ? aa : 0) | (e.butter ? oa : 0),
        this.data[r + 5] = (e.grabStyle ?? 0) | (e.board ? sa : 0),
        this.steps++
    }
    encode(e=39) {
        let t = this.data.slice(0, Q + this.steps * Z)
          , n = new DataView(t.buffer);
        return t[0] = 1,
        n.setUint32(1, e, !0),
        n.setUint32(5, this.steps, !0),
        t
    }
}
;
async function ua(e) {
    let t = new Uint8Array(await new Response(new Blob([new Uint8Array(e.encode())]).stream().pipeThrough(new CompressionStream(`gzip`))).arrayBuffer())
      , n = ``;
    for (let e = 0; e < t.length; e += 32768)
        n += String.fromCharCode(...t.subarray(e, e + 32768));
    return btoa(n)
}
export {dr as $, ze as $n, Qt as $t, pi as A, We as An, Mn as At, ei as B, b as Bn, k as Bt, Ci as C, Et as Cn, bn as Ct, Ei as D, pt as Dn, In as Dt, wi as E, xt as En, Tn as Et, ri as F, et as Fn, vn as Ft, Ar as G, y as Gn, N as Gt, Nr as H, S as Hn, Kt as Ht, oi as I, ot as In, Ln as It, br as J, Ue as Jn, rn as Jt, yr as K, ct as Kn, dn as Kt, ii as L, nt as Ln, zn as Lt, li as M, g as Mn, Dn as Mt, si as N, _ as Nn, Fn as Nt, Di as O, mt as On, Rn as Ot, ci as P, v as Pn, An as Pt, mr as Q, Pe as Qn, fn as Qt, ai as R, Je as Rn, jn as Rt, ki as S, Tt as Sn, yn as St, Ai as T, bt as Tn, Cn as Tt, Dr as U, qe as Un, Gt as Ut, Br as V, C as Vn, Vt, kr as W, lt as Wn, j as Wt, _r as X, ke as Xn, qt as Xt, wr as Y, He as Yn, Jt as Yt, tr as Z, Re as Zn, tn as Zt, Pi as _, D as _n, Jn as _t, Xi as a, gn as an, Ce as ar, B as at, vi as b, wt as bn, xn as bt, qi as c, nn as cn, he as cr, gr as ct, Y as d, Rt as dn, _e as dr, fr as dt, mn as en, je as er, cr as et, Ri as f, Lt as fn, ye as fr, pr as ft, X as g, It as gn, Ee as gr, Yn as gt, Hi as h, Ft as hn, De as hr, Xn as ht, Qi as i, M as in, Se as ir, or as it, fi as j, Ke as jn, Nn as jt, ui as k, vt as kn, Sn as kt, Wi as l, _n as ln, xe as lr, rr as lt, Vi as m, O as mn, Te as mr, er as mt, ca as n, Ut as nn, Ae as nr, hr as nt, Zi as o, en as on, ge as or, lr as ot, zi as p, Mt as pn, Oe as pr, V as pt, Cr as q, Ge as qn, Zt as qt, ua as r, an as rn, Fe as rr, nr as rt, Ki as s, $t as sn, ve as sr, sr as st, la as t, Xt as tn, Be as tr, z as tt, Gi as u, on as un, be as ur, ir as ut, Ni as v, St as vn, Vn as vt, Ti as w, yt as wn, En as wt, _i as x, Ct as xn, P as xt, Oi as y, Dt as yn, Hn as yt, ti as z, dt as zn, kn as zt};
