import {a as e, o as t, s as n} from "./season-BrQumfIM.js";
import {B as r, E as i, S as a, T as o, U as ee, W as te, Z as ne, _ as s, a as c, c as l, h as u, i as re, l as d, m as f, n as p, nt as ie, o as m, r as h, s as g, t as _} from "./rider-appearance-Cs5aq3V7.js";
var ae = new Set([`drift-denim`, `orbit-nylon`, `transit-wide`, `soft-neck`])
  , oe = /^hw-(?:jack-o|nightfang|joker-cut|ghosted|bone-yard|grave-form|blue-hour|moth-eaten|wrap-sheet)-/;
function v(e, t) {
    let n = /^alpine-drift-cc-(black|blue)$/.test(t) ? `creator-pants-2` : t.startsWith(`alpine-`) ? `alpine-10` : t.startsWith(`ranked-s01-`) ? `ranked-print-3` : t.startsWith(`sd-`) ? /-(top|pants)$/.test(t) ? `street-2` : `street-1` : oe.test(t) ? `costume-1` : t.startsWith(`hw-`) ? `park-ink-5` : ae.has(t) ? `park-ink-2` : null;
    return n ? `${e}${e.includes(`?`) ? `&` : `?`}rev=${n}` : e
}
var y = (e, t) => (t?.baseXp ?? 50) + Math.floor(e / (t?.pointsPerXp ?? 1e3))
  , se = (e=Date.now()) => new Date(e).toLocaleDateString(`sv-SE`, {
    timeZone: `Europe/Oslo`
})
  , ce = e => Date.parse(`${se(e)}T00:00:00Z`) / 864e5
  , le = (e, t=Date.now()) => e.fullXpPerDay ? e.fullXpPerDay * (ce(t) - ce(Date.parse(e.starts)) + 2) : null
  , b = (e, t, n=Date.now()) => {
    let r = le(e, n);
    return r === null ? null : Math.max(0, r - t)
}
  , ue = (e, t, n, r=Date.now()) => {
    let i = y(t, e)
      , a = b(e, n.xp - (n.over ?? 0), r);
    return a === null ? e.dailyXpCap ? Math.min(i, Math.max(0, e.dailyXpCap - n.today)) : i : Math.min(i, a) + Math.floor(Math.max(0, i - a) * (e.overRatePct ?? 0) / 100)
}
  , de = e => {
    let t = e.overRatePct ?? 0;
    return t > 0 && 100 % t == 0 ? `1/${100 / t}` : `${t}%`
}
  , fe = (e, t) => Math.min(e.tiers, 1 + Math.floor(t / e.tierXp))
  , x = (e, t) => ({
    tier: e,
    track: `free`,
    ...t
})
  , S = (e, t) => ({
    tier: e,
    track: `paid`,
    ...t
})
  , pe = {
    10: `high-back-white`,
    15: `flip-lock`,
    20: `woodie`,
    30: `double-knee-sand`
}
  , C = {
    1: 50,
    8: 200,
    18: 200,
    28: 200
}
  , me = {
    5: 200,
    11: 200,
    17: 200,
    23: 200,
    29: 200
}
  , he = [1, 4, 8, 11, 13, 16, 19, 22, 25, 27, 32, 35, 38, 41, 44, 47, 51, 53, 57, 62, 66, 68, 73, 77, 81, 83, 87, 91, 94, 97]
  , ge = [2, 5, 9, 12, 14, 17, 21, 23, 26, 31, 33, 36, 39, 43, 45, 48, 52, 56, 59, 63, 67, 71, 76, 78, 82, 86, 89, 92, 96, 99]
  , w = [{
    id: `pass-2026-10`,
    name: `Season Pass 01`,
    starts: `2026-10-01T00:00:00+02:00`,
    ends: t,
    pow: 1200,
    tiers: 30,
    tierXp: 200,
    rewards: [...Array.from({
        length: 30
    }, (e, t) => t + 1).flatMap(e => pe[e] ? [x(e, {
        item: pe[e]
    })] : C[e] ? [x(e, {
        pow: C[e]
    })] : []), S(1, {
        item: `tiles`
    }), S(4, {
        item: `high-back-teal`
    }), S(7, {
        item: `teal-crackle`
    }), S(10, {
        item: `spartan-white`
    }), S(13, {
        item: `high-back-orange`
    }), S(16, {
        item: `psyche`
    }), S(19, {
        item: `spartan-olive`
    }), S(22, {
        item: `gradient-seven`
    }), S(25, {
        item: `freeride-shell`
    }), S(28, {
        item: `honeycomb`
    }), S(30, {
        item: `spartan-red`
    }), ...Object.entries(me).map( ([e,t]) => S(Number(e), {
        pow: t
    }))]
}, {
    id: `pass-2026-10-18`,
    name: `Season Pass 02`,
    theme: `STEEZ PARK`,
    starts: t,
    ends: `2026-11-18T00:00:00+01:00`,
    pow: 1500,
    tiers: 100,
    tierXp: 500,
    baseXp: 25,
    pointsPerXp: 3e3,
    fullXpPerDay: 1500,
    overRatePct: 20,
    rewards: [x(7, {
        item: `balaclava-grey`
    }), x(18, {
        item: `park-mocha`
    }), x(24, {
        item: `bonk`
    }), x(34, {
        item: `broadcast-tee`
    }), x(50, {
        item: `grey-baggy-long`
    }), x(100, {
        item: `grey-tee`
    }), ...he.map(e => x(e, {
        pow: 25
    })), S(1, {
        item: `black-tee`
    }), S(3, {
        item: `balaclava-white`
    }), S(6, {
        item: `park-fluo`
    }), S(10, {
        item: `four-buckle-race`
    }), S(15, {
        item: `heli-grey`
    }), S(20, {
        item: `white-tee`
    }), S(30, {
        item: `balaclava-black`
    }), S(40, {
        item: `two-buckle-gold`
    }), S(65, {
        item: `black-baggy-long`
    }), S(85, {
        item: `white-baggy-long`
    }), S(28, {
        item: `high-back-black`
    }), S(58, {
        item: `high-back-sand`
    }), S(72, {
        item: `high-back-blue`
    }), S(46, {
        item: `broadcast-pants`
    }), S(64, {
        item: `pit-lane`
    }), S(54, {
        item: `send-it`
    }), S(88, {
        item: `yard-sale`
    }), S(55, {
        item: `heli-black`
    }), S(60, {
        item: `park-baggy-sand`
    }), S(70, {
        item: `mismatch`
    }), S(75, {
        item: `blue-fork`
    }), S(80, {
        item: `grey-baggy-tee`
    }), S(90, {
        item: `black-baggy-tee`
    }), S(95, {
        item: `park-baggy`
    }), S(98, {
        item: `cc-rec-white`
    }), S(100, {
        item: `white-baggy-tee`
    }), ...ge.map(e => S(e, {
        pow: 25
    }))]
}]
  , _e = ( () => {
    if (![`localhost`, `127.0.0.1`, `[::1]`].includes(window.location?.hostname ?? ``))
        return null;
    let e = Date.parse(new URLSearchParams(window.location.search).get(`now`) ?? ``);
    return Number.isFinite(e) ? e : null
}
)()
  , ve = (e=_e ?? Date.now()) => w.find(t => Date.parse(t.starts) <= e && e < Date.parse(t.ends)) ?? null
  , ye = e => w.find(t => t.id === e) ?? null
  , T = new Set(w.flatMap(e => e.rewards.flatMap(e => e.item ? [e.item] : [])))
  , be = [2500, 1500, 750, 250, 250, 250, 250, 250, 250, 250]
  , E = (e=[]) => be.map( (t, n) => e[n] ? {
    place: n + 1,
    item: e[n],
    pow: t
} : {
    place: n + 1,
    pow: t
})
  , D = {
    "park-2026-10": E([`ink-melt`, `sticker-club`, `sticker-bomb`]),
    "apex-2026-10": E(),
    "bigair-2026-10": E(),
    "park-2026-10-18": E(),
    "apex-2026-10-18": E(),
    "bigair-2026-10-18": E(),
    "forestline-2026-10-18": E()
}
  , xe = {
    "park-2026-10": `The Yard S01`,
    "apex-2026-10": `APEX S01`,
    "bigair-2026-10": `BIG AIR S01`,
    "park-2026-10-18": `The Yard S02`,
    "apex-2026-10-18": `APEX S02`,
    "bigair-2026-10-18": `BIG AIR S02`,
    "forestline-2026-10-18": `FOREST LINE S02`
}
  , O = (e, t) => D[e]?.find(e => e.place === t) ?? null
  , Se = e => Math.max(0, ...(D[e] ?? []).map(e => e.place))
  , k = {
    jacket: {
        rare: 800,
        epic: 1e3,
        legendary: 1200
    },
    pants: {
        rare: 600,
        epic: 800,
        legendary: 1e3
    },
    skis: {
        rare: 600,
        epic: 800,
        legendary: 1e3
    },
    bindings: {
        rare: 200,
        epic: 400,
        legendary: 600
    },
    poles: {
        rare: 200,
        epic: 400,
        legendary: 600
    },
    snowboard: {
        rare: 600,
        epic: 800,
        legendary: 1e3
    },
    helmet: {
        rare: 600,
        epic: 800,
        legendary: 1e3
    },
    gloves: {
        rare: 200,
        epic: 400,
        legendary: 600
    },
    boots: {
        rare: 200,
        epic: 400,
        legendary: 600
    },
    goggles: {
        rare: 200,
        epic: 400,
        legendary: 600
    }
}
  , A = new Set([...ie, `bare-body`, `boxers`, `silver-pro`, `starline`, `slow-burn`, `hot-head-cobalt`, `deck-tape-violet`, `haze-lid`, `cc-rec`, `cc-rec-blue`, `cc-rec-red`, `team`, `cork7-cup-winner`, `ink-melt`, `sticker-club`, `sticker-bomb`, `bubble`, `pro-model`, `chrome`, `cream-beanie`, ...ne])
  , j = [{
    id: `olive-starter`,
    name: `Olive Starter Pack`,
    items: [`hooded-olive`, `park-camo`],
    pow: 1e3
}, {
    id: `haze-set`,
    name: `Haze Set`,
    items: [`haze-tee`, `haze-pants`],
    pow: 1600
}, {
    id: `ridge-set`,
    name: `Ridge Set`,
    items: [`ridge-08-long`, `smoke-08-pants`],
    pow: 1600
}, {
    id: `cobalt-set`,
    name: `Cobalt Set`,
    items: [`dead-air-cobalt`, `night-shift-cobalt`],
    pow: 1600
}]
  , Ce = new Set(j.flatMap(e => e.items))
  , M = [[m, `goggles`], [l, `helmet`], [f, `pants`], [u, `poles`], [d, `jacket`], [s, `skis`], [_, `bindings`], [g, `head`], [h, `boots`], [c, `gloves`], [p, `snowboard`]];
function N(e) {
    for (let[t,n] of M) {
        let r = t.find(t => t.value === e);
        if (r)
            return {
                item: r,
                kind: n
            }
    }
    return null
}
function P(e) {
    let t = N(e);
    if (!t || !(`granted` in t.item.unlock) || A.has(e) || T.has(e) || !(t.kind in k))
        return null;
    let {rarity: n} = t.item;
    return n === `rare` || n === `epic` || n === `legendary` ? k[t.kind][n] : null
}
var F = (e, t) => Math.floor(e.reduce( (e, t) => e + (P(t) ?? 0), 0) * (100 - t) / 1e4) * 100
  , we = [`helmet`, `top`, `pants`, `gloves`, `goggles`, `skis`, `poles`, `boots`, `board`, `snowboots`]
  , I = ee.map(e => {
    let t = we.map(t => te(e.id, t))
      , n = t.slice(0, 3);
    return {
        id: `hw-${e.id}`,
        name: e.name,
        collection: `Halloween`,
        items: t,
        look: {
            id: `hw-${e.id}-look`,
            items: n,
            name: `${e.name} Look`,
            pow: F(n, 20)
        },
        full: {
            id: `hw-${e.id}-full`,
            items: t,
            name: `${e.name} Set`,
            pow: F(t, 30)
        },
        color: e.shell,
        accent: e.accent
    }
}
)
  , L = new Map(I.flatMap(e => [e.id, ...e.items, e.look.id, e.full.id].map(t => [t, e])))
  , Te = e => L.get(e) ?? null;
function Ee(e, t) {
    let n = e.items.filter(e => !t.includes(e));
    return n.length === e.items.length ? e.full : n.length ? {
        ...e.full,
        items: n,
        pow: F(n, 30)
    } : null
}
var De = (e, t, n=!1) => t === e.full.id ? [...e.items.slice(0, 5), ...n ? e.items.slice(8, 10) : e.items.slice(5, 8)] : t ? [t] : e.look.items
  , R = M.flatMap( ([e]) => e.flatMap(e => {
    let t = Ce.has(e.value) ? null : P(e.value);
    return t === null ? [] : [{
        id: e.value,
        items: [e.value],
        pow: t
    }]
}
))
  , Oe = [...R, ...j, ...I.flatMap(e => [e.look, e.full])]
  , ke = new Map(Oe.map(e => [e.id, e]))
  , Ae = [...R.filter(e => !L.has(e.id)).map(e => {
    let t = N(e.id);
    return {
        id: e.id,
        kind: t.kind,
        name: t.item.name,
        items: e.items,
        pow: e.pow
    }
}
), ...j.map(e => ({
    id: e.id,
    kind: `pack`,
    name: e.name ?? e.id,
    items: e.items,
    pow: e.pow
})), ...I.map(e => ({
    id: e.id,
    kind: `set`,
    name: e.name,
    items: e.items,
    pow: e.look.pow
}))]
  , je = new Map(Ae.map(e => [e.id, e]))
  , Me = e => je.get(e) ?? null
  , Ne = new Map(j.flatMap(e => e.items.map(t => [t, e])))
  , Pe = e => L.get(e)?.id ?? Ne.get(e)?.id ?? e;
new Map([...`hooded-powder.hooded-blackout.storm-shell.fingerprint.pro-red.wavelength.paint-splash.lime-pipe.nordlys.olive-starter.haze-set.ridge-set.cobalt-set.onyx-mag.grab-tab.olive-groove.blackout-cargo.double-knee.nordic-box.tartan-06-pants.high-back.high-back-red.high-back-army.afterimage-08.moon-ritual-14.slush.knuckle`.split(`.`).map(e => [e, `rotation`]), ...[`harvest`, `jack-o`, `witching`, `ossuary`, `hex`, `bloodmoon`, `phantom`, `wildcard`, `last-laugh`, `dead-press`, `grave-shift`, `ghost-lap`, `bail-notice`].map(e => [`hw-${e}`, `event`]), ...`drift-denim.orbit-nylon.transit-wide.goggle-prism-aurora.goggle-prism-sunset.goggle-prism-black.goggle-prism-silver.goggle-prism-clear.stomp.tweaked.white-room.team-issue-03.lift-rats-06.bad-reception-10.hot-lap-12.whiteout-09-pants.static-09-long.bone-yard-violet.off-axis-violet.after-hours-pants.slow-burn-pants.after-hours-tee.slow-burn-tee.jester.attack.turntable.jerry-black.jerry-white.hooded-race-red.outline-art.spray`.split(`.`).map(e => [e, `never`])]);
var z = [{
    id: `pow-600`,
    pow: 600,
    nok: 2900
}, {
    id: `pow-1200`,
    pow: 1200,
    nok: 5900
}, {
    id: `pow-2600`,
    pow: 2600,
    nok: 11900,
    bonus: 200
}]
  , Fe = (e, t) => e > t ? z.find(n => t + n.pow >= e) ?? z[z.length - 1] : null
  , Ie = e => Math.max(0, e / 200 * 1e3 - 100)
  , Le = e => ke.get(e) ?? null
  , Re = e => `${e % 100 ? (e / 100).toFixed(2).replace(`.`, `,`) : e / 100} kr`
  , ze = {
    900: 600,
    1900: 1300,
    2900: 1900,
    3900: 2500,
    4900: 3500,
    5900: 3900,
    11900: 7900
}
  , Be = (e, t) => t === `nok` || t === `sek` ? e : t === `dkk` ? ze[e] ?? Math.round(e * .69 / 100) * 100 : (e / 100 + 1) * 10 - 1
  , Ve = (e, t) => t === `eur` || t === `usd` ? `${t === `eur` ? `€` : `$`}${(e / 100).toFixed(2)}` : Re(e)
  , He = new Set([`Atlantic/Reykjavik`, `Atlantic/Canary`, `Atlantic/Madeira`, `Atlantic/Azores`])
  , Ue = new Set([`Europe/Copenhagen`, `Atlantic/Faroe`, `America/Nuuk`, `America/Godthab`]);
function We(e) {
    return !e || e === `Europe/Oslo` || e === `Arctic/Longyearbyen` ? `nok` : Ue.has(e) ? `dkk` : e === `Europe/Stockholm` ? `sek` : e.startsWith(`Europe/`) || He.has(e) ? `eur` : `usd`
}
var Ge = e => `${e.pow.toLocaleString(`en-US`)} POW`
  , Ke = {
    standard: `Standard`,
    rare: `Rare`,
    epic: `Epic`,
    legendary: `Legendary`,
    mythic: `Mythic`
}
  , B = e => `score` in e.unlock ? e.unlock.score : null
  , qe = e => e >= Number.MAX_SAFE_INTEGER / 2 ? `∞` : e.toLocaleString(`en-US`)
  , V = e => e >= 1e3 ? `${Math.round(e / 1e3)}K` : String(e)
  , H = e => f.includes(e)
  , U = e => u.includes(e)
  , W = e => d.includes(e)
  , G = e => s.includes(e)
  , K = e => _.includes(e)
  , q = e => g.includes(e)
  , J = e => h.includes(e)
  , Je = e => c.includes(e)
  , Y = e => m.includes(e)
  , X = e => p.includes(e)
  , Ye = new Set([`grey-beanie`, `cream-beanie`, `short-hair`, `bald`, `goggle-none`, `none`])
  , Xe = (e, t=`classic`) => v(`/items/icons/${t === `feminine` && Ye.has(e.value) ? `feminine/` : ``}${H(e) ? `pants` : U(e) ? `poles` : W(e) ? `jacket` : G(e) ? `skis` : K(e) ? `bindings` : q(e) ? `head` : J(e) ? `boots` : Je(e) ? `gloves` : X(e) ? `board` : Y(e) ? `goggles` : `helmet`}-${e.value}.webp`, e.value)
  , Ze = e => `prize` in e.unlock ? e.unlock.prize : null
  , Z = e => [`1ST`, `2ND`, `3RD`][e - 1] ?? `${e}TH`
  , Qe = () => new Date(Date.parse(n) - 1).toLocaleDateString(`en-GB`, {
    day: `numeric`,
    month: `short`,
    timeZone: `Europe/Oslo`
});
function $e(e, t) {
    return [...l.filter(e => e.value !== `park` && e.value !== `none`), ...g.filter(e => (B(e) ?? 0) > 0)].filter(e => (B(e) !== null || Ze(e) !== null) && !A.has(e.value) && !T.has(e.value)).map(n => {
        let r = B(n)
          , a = Ze(n)
          , o = i(n, e, t);
        return {
            id: n.value,
            item: n,
            score: r,
            place: a,
            state: o ? `owned` : a === null ? r === null ? `secret` : `locked` : `prize`,
            progress: o ? 1 : r ? Math.min(1, e / r) : 0
        }
    }
    )
}
var et = `The Yard`
  , tt = new Set(ne);
function nt(e, t=!1) {
    if (tt.has(e.value))
        return t ? `Ranked S01` : `Ranked Season 01 reward`;
    if (`score` in e.unlock) {
        let n = e.unlock.score;
        return n === 0 ? t ? `Free` : `Free for every rider` : t ? `${V(n)} Yard run` : `Earned with a ${V(n)} run on ${et}`
    }
    return `season01` in e.unlock ? t ? `S01 ${V(e.unlock.season01)} run` : `Earned with a ${V(e.unlock.season01)} run in Season 01` : `prize` in e.unlock ? t ? `${Z(e.unlock.prize)} place` : `Won with ${Z(e.unlock.prize).toLowerCase()} place in a season` : t ? `Team` : `Given by Team STEEZ8`
}
var rt = e => {
    let[t=e.name,...n] = e.name.split(` · `);
    return {
        name: t,
        won: n.length ? n.join(` · `) : null
    }
}
  , it = (t, n=e) => {
    let r = O(n, t)?.item;
    return r ? l.find(e => e.value === r) ?? null : null
}
  , at = (e, t) => l.filter(n => i(n, e, t))
  , ot = (e, t) => f.filter(n => i(n, e, t))
  , st = (e, t) => u.filter(n => i(n, e, t))
  , ct = (e, t) => d.filter(n => i(n, e, t))
  , lt = (e, t) => s.filter(n => i(n, e, t))
  , ut = (e, t) => _.filter(n => i(n, e, t))
  , dt = (e, t) => h.filter(n => !o(n) && i(n, e, t))
  , ft = (e, t) => p.filter(n => i(n, e, t))
  , pt = (e=0, t=[]) => h.filter(n => o(n) && i(n, e, t))
  , mt = (e, t) => c.filter(n => i(n, e, t))
  , ht = (e, t) => m.filter(n => i(n, e, t))
  , gt = (e, t) => g.filter(n => i(n, e, t))
  , Q = {
    standard: 0,
    rare: 1,
    epic: 2,
    legendary: 3,
    mythic: 4
}
  , _t = e => [...e].sort( (e, t) => Q[e.rarity] - Q[t.rarity]);
function vt(e, t, n) {
    let r = e.items.map(e => N(e).item)
      , i = r.every(e => t.includes(e.value))
      , a = r.reduce( (e, t) => Q[t.rarity] > Q[e.rarity] ? t : e);
    return {
        id: e.id,
        item: a,
        ...r.length > 1 ? {
            items: r,
            name: e.name
        } : {},
        price: e,
        score: null,
        place: null,
        state: i ? `owned` : `pow`,
        progress: i ? 1 : Math.min(1, n / e.pow)
    }
}
function $(e) {
    return Y(e) ? {
        key: `goggleItem`,
        focus: `goggles`
    } : q(e) ? {
        key: `headItem`,
        focus: `head`
    } : H(e) ? {
        key: `pantsItem`,
        focus: `pants`
    } : U(e) ? {
        key: `polesItem`,
        focus: `poles`
    } : W(e) ? {
        key: `jacketItem`,
        focus: `jacket`
    } : G(e) ? {
        key: `skiItem`,
        focus: `skis`
    } : K(e) ? {
        key: `bindingItem`,
        focus: `bindings`
    } : J(e) ? {
        key: `bootItem`,
        focus: `boots`
    } : Je(e) ? {
        key: `gloveItem`,
        focus: `gloves`
    } : X(e) ? {
        key: `boardItem`,
        focus: `board`
    } : {
        key: `helmetItem`,
        focus: `helmet`
    }
}
var yt = e => G(e) || K(e) || U(e) || J(e) && !o(e) ? `skis` : X(e) || o(e) ? `board` : null
  , bt = (e, ...t) => t.reduce( (e, t) => {
    let {key: n} = $(t)
      , r = yt(t) ?? e.ride;
    if (n === `goggleItem`) {
        let n = {
            ...e,
            goggleItem: t.value
        };
        return {
            ...n,
            goggles: a(n)
        }
    }
    return n === `headItem` ? {
        ...e,
        headItem: t.value,
        helmetItem: `none`
    } : {
        ...e,
        [n]: t.value,
        ride: r
    }
}
, r(e) ? e : {
    ...e,
    polesItem: re.polesItem
})
  , xt = (e, ...t) => t.reduce( (e, t) => {
    let n = {
        ...e,
        [$(t).key]: t.value
    };
    return Y(t) ? {
        ...n,
        goggles: a(n)
    } : n
}
, e)
  , St = new Set([`event`, `featured`, `daily`, `always`])
  , Ct = (e=Date.now()) => new Date(e).toISOString().slice(0, 10)
  , wt = (e=Date.now()) => {
    let t = new Date(e);
    return Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate() + 1)
}
;
function Tt(e, t=Date.now()) {
    let n = Math.max(0, Math.floor((e - t) / 1e3))
      , r = Math.floor(n / 3600)
      , i = Math.floor(n % 3600 / 60);
    return r >= 48 ? `${Math.floor(r / 24)} DAYS` : r > 0 ? `${r}H ${i}M` : i > 0 ? `${i}M` : `${n}S`
}
function Et(e) {
    if (!e || typeof e != `object`)
        return null;
    let t = e
      , n = typeof t.ends_at == `string` ? Date.parse(t.ends_at) : NaN;
    if (typeof t.day != `string` || !/^\d{4}-\d{2}-\d{2}$/.test(t.day) || !Number.isFinite(n) || !Array.isArray(t.cards))
        return null;
    let r = t.event
      , i = typeof r?.ends_at == `string` ? Date.parse(r.ends_at) : NaN
      , a = r && typeof r.name == `string` && r.name && Number.isFinite(i) ? {
        name: r.name,
        ends: i
    } : null
      , o = t.cards.flatMap(e => e && typeof e.card == `string` && typeof e.section == `string` && St.has(e.section) ? [{
        card: e.card,
        section: e.section,
        fresh: e.fresh === !0
    }] : []);
    return {
        day: t.day,
        ends: n,
        event: a,
        cards: o
    }
}
export {Se as $, V as A, P as B, st as C, B as D, it as E, z as F, Ie as G, Le as H, Ae as I, Ee as J, Be as K, Me as L, bt as M, xt as N, Qe as O, A as P, O as Q, Pe as R, ot as S, qe as T, Fe as U, Ve as V, Ge as W, N as X, De as Y, xe as Z, mt as _, Ke as a, ye as at, at as b, nt as c, b as ct, vt as d, T as et, Z as f, dt as g, ft as h, Tt as i, de as it, $ as j, $e as k, Xe as l, y as lt, pt as m, Et as n, ve as nt, et as o, ue as ot, ut as p, Te as q, Ct as r, se as rt, _t as s, fe as st, wt as t, w as tt, rt as u, v as ut, ht as v, lt as w, ct as x, gt as y, We as z};
