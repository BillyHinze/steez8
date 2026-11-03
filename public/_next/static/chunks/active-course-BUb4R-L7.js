import {n as e} from "./rolldown-runtime-C60lm6uB.js";
import {PARKS as t, readParkRoute as n} from "./parks-1qsmaijL.js";
import {Bt as r, Et as i, Ft as a, It as o, Lt as s, Rt as c, Tt as l, kt as u, wt as d, zt as f} from "./rider-outfit-BI9AmbRj.js";
import {An as p, Ht as m, Tn as h, Xt as g, jt as _} from "./replay-Bo7bmJ9f.js";
const isRidgeline = new URLSearchParams(window.location?.search ?? ``).get("park") === "ridgeline";
var v = n(window.location?.search ?? ``)
  , y = t[v.id]
  , b = y.id === `apex` || isRidgeline
  , x = y.id === `forestline`
  , S = y.id === `halfpipe`
  , C = y.id === `bigair` || x || S
  , w = y.id === `bigair`
  , T = y.id === `shirakumo`
  , ee = false
  , te = v.duel && (v.duel.code !== `test` || ee) ? v.duel : null
  , E = !te && v.team && (v.team.code !== `test` || ee) ? v.team : null
  , ne = te || E ? null : v.watch
  , re = (te?.code === `test` || E?.code === `test` || v.test === `room` && v.mode === `live`) && ee
  , ie = v.test === `train` && v.mode === `live` && !te && ee
  , ae = v.cup && !te && !ne && !ie ? v.cup : null
  , oe = !ee && y.leaderboard && !ae
  , se = () => ({
    tricks: 0,
    grabs: 0,
    rails: 0,
    landings: 0
})
  , ce = 1e7
  , le = 1.25
  , ue = .15
  , de = .15
  , fe = .5
  , pe = e => 1 - fe * a.min(1, a.max(0, e))
  , me = [1, .75, .55, .4]
  , he = e => me[a.min(e, me.length - 1)]
  , ge = e => e < 4 ? he(e) : 0
  , _e = e => 1 + .25 * a.max(0, e - 1)
  , ve = 500 * 3;
function ye(e, t, n, r) {
    return e + 1e-9 < .25 || t <= .12 || r < 3 ? 0 : n > 2 * a.PI - .12 ? 600 : n > a.PI - .12 ? 300 : 150
}
var be = .25
  , xe = .25
  , Se = .05
  , Ce = (e, t=1) => {
    let n = a.min(3, a.max(0, e));
    return n ? 1 + xe * a.min(1, a.max(0, t) / 1) + Se * (n - 1) : 1
}
  , we = e => a.round(ve * a.pow(a.max(0, e), 2));
function Te(e) {
    let t = e => `×${Number(e.toFixed(2))}`;
    return [e.turns > 0 ? `${e.turns} ${e.turns === 1 ? `TURN` : `TURNS`}` : ``, e.grabs ? `${e.grabs} ${e.grabs === 1 ? `GRAB` : `GRABS`} ${e.turns > 0 ? t(e.grabMultiplier) : `+${e.grabs * 300}`}` : ``, e.flips ? `INVERTED ${t(1 + ue * e.flips)}` : ``, e.switchStance ? `SWITCH ${t(le)}` : ``, e.lineMultiplier > 1 ? `LINE ${t(e.lineMultiplier)}` : ``, e.landing !== void 0 && e.landing < 1 ? `SIDEWAYS ${t(e.landing)}` : ``].filter(Boolean)
}
function Ee(e) {
    let t = e.offAxis ? a.min(e.inversions, a.max(1, a.floor(e.rotations / 450))) : e.inversions
      , n = e.rotations / 360 + (e.offAxis ? 0 : e.inversions)
      , r = a.round(we(n) * (1 + ue * t) * (e.switchStance ? le : 1))
      , i = e.airTime * 135 + e.maxAir * 36;
    return {
        turns: n,
        flips: t,
        rotation: r,
        amplitude: i,
        total: a.round(r + i)
    }
}
var De = (e, t=0, n=0, r=1, i=1) => {
    let o = a.min(3, a.max(0, t));
    return a.round(e * 840 + (o * 300 + n * (Ce(o, i) - 1)) * r)
}
  , Oe = (e, t) => a.round(e * 750) + t * 450
  , ke = [{
    key: `tricks`,
    label: `Tricks & airtime`,
    detail: `Rotations, switch, inverts, airtime and butters`
}, {
    key: `grabs`,
    label: `Grabs & variety`,
    detail: `Hold points + different-grab bonuses`
}, {
    key: `rails`,
    label: `Rails & slides`,
    detail: `Bar time, swaps and hops, banked when the line lands`
}, {
    key: `landings`,
    label: `Stomped landings`,
    detail: `450 plus ${de * 100} % of the line for every stomped landing`
}];
function Ae(e, t) {
    let n = ke.map( (n, r) => {
        let i = a.max(0, a.min(1, (t - .25 - r * .58) / .52));
        return a.round(e[n.key] * (1 - a.pow(1 - i, 3)))
    }
    );
    return {
        rows: n,
        total: n.reduce( (e, t) => e + t, 0),
        done: t >= 2.55
    }
}
var je = 88 * a.PI / 180
  , Me = 10.5 / (1 - a.cos(je))
  , Ne = 17 - Me * a.sin(je)
  , Pe = Ne + Me * a.sin(je)
  , Fe = Me * (1 - a.cos(je))
  , Ie = {
    snowWalls: !1,
    maxSpeed: 43
}
  , Le = (e, t=0, n=1) => a.max(t, a.min(n, e))
  , Re = e => {
    let t = Le(e);
    return t * t * (3 - 2 * t)
}
  , ze = e => 0
  , Be = e => 0
  , Ve = (e, t) => a.abs(e)
  , He = (e, t) => 0
  , Ue = []
  , We = [[0, 0], [8, 0], [24, .4], [54, .4], [94, .34], [694, .34], [744, .12], [768, 0], [805, 0]]
  , Ge = [0];
for (let e = 1; e < We.length; e++)
    Ge.push(Ge[e - 1] + (We[e][0] - We[e - 1][0]) * (We[e][1] + We[e - 1][1]) / 2);
function D(e) {
    let t = Le(e, 0, 805)
      , n = 0;
    for (; n + 2 < We.length && t > We[n + 1][0]; )
        n++;
    let r = We[n]
      , i = We[n + 1]
      , a = i[0] - r[0]
      , o = (t - r[0]) / a;
    return 1020 - Ge[n] - a * (r[1] * o + (i[1] - r[1]) * (o ** 3 - o ** 4 / 2))
}
function Ke(e, t=1) {
    let n = a.abs(e)
      , r = Le(n - Ne, 0, Pe - Ne);
    if (t >= 1)
        return n >= Pe ? Fe : Me - a.sqrt(Me ** 2 - r ** 2);
    if (t <= 0)
        return 0;
    let i = Pe - Ne
      , o = qe(t)
      , s = r / i
      , c = r * r / (o + a.sqrt(o * o - r * r))
      , l = i * a.tan(je * t / 2)
      , u = 1 - Re((t - .25) / .5);
    return c + (l * Re(s) - c) * u
}
function qe(e) {
    return e >= 1 ? Me : e > 0 ? (Pe - Ne) / a.sin(je * e) : 1 / 0
}
function Je(e, t) {
    let n = a.abs(e);
    if (n <= Ne || n >= Pe || t <= 0)
        return 0;
    let r = n - Ne
      , i = Pe - Ne
      , o = qe(t)
      , s = r / a.sqrt(o * o - r * r);
    if (t >= 1)
        return a.sign(e) * s;
    let c = r / i
      , l = 1 - Re((t - .25) / .5)
      , u = i * a.tan(je * t / 2);
    return a.sign(e) * (s + (u * 6 * c * (1 - c) / i - s) * l)
}
var Ye = e => Re((e - 54) / 40) * (1 - Re((e - 694) / 50));
function Xe(e, t) {
    let n = Le((a.abs(e) - 100) / 120);
    if (!n)
        return 0;
    let r = (t - 788 / 2 + 4) / 420
      , i = (a.abs(e) - 195) / 120;
    return 28 * Re(n) * a.exp(-i * i - r * r)
}
function Ze(e, t) {
    let n = a.abs(e)
      , r = Ke(e, Ye(t))
      , i = Xe(e, t)
      , o = Re((n - 44) / 28) * (a.sin(e * .13 + t * .035) * .55 + a.sin(t * .09) * .3);
    return D(t) + r + i + o
}
var Qe = (e, t, n) => n
  , $e = []
  , et = []
  , tt = []
  , nt = []
  , rt = (e, t) => ze(t)
  , it = []
  , at = []
  , ot = at
  , st = [[0, `START / APPROACH`], [35, `FOREST APPROACH`], [54, `PIPE ENTRY`], [94, `SUPERPIPE`], [694, `LAST HIT`], [744, `RUNOUT / BRAKE`], [780, `FINISH / T-BAR`]]
  , ct = (e, t, n) => a.max(t, a.min(n, e))
  , lt = .6
  , ut = .05
  , dt = (e, t) => Ye(t) > 0 && a.abs(e) > Ne && a.abs(e) < Pe;
function ft(e, t) {
    let n = a.abs(e)
      , r = Ye(t);
    return {
        x: r > 0 && n < 43 ? Je(e, r) : (Ze(e + .002, t) - Ze(e - .002, t)) / .004,
        z: (Ze(e, t + .05) - Ze(e, t - .05)) / .1
    }
}
function pt(e, t, n, r=0) {
    let i = ft(e.x, e.z)
      , o = a.hypot(i.x, 1, i.z)
      , s = -i.x / o
      , c = 1 / o
      , l = -i.z / o
      , u = e.velocityX
      , d = e.velocityZ;
    a.hypot(u, d) < .01 && (u = a.sin(e.travelHeading),
    d = a.cos(e.travelHeading));
    let f = ft(e.x - u * t, e.z - d * t)
      , p = f.x * u + f.z * d
      , m = u * s + p * c + d * l;
    u -= s * m,
    p -= c * m,
    d -= l * m;
    let h = e.speed / a.max(.001, a.hypot(u, p, d));
    u *= h,
    p *= h,
    d *= h;
    let g = e.edge * (.8 + ct(e.speed / 85, 0, .44)) * (1 + r * .14) * (n ? .7 : 1)
      , _ = g * t
      , v = a.cos(_)
      , y = a.sin(_)
      , b = u * v + (c * d - l * p) * y
      , x = p * v + (l * u - s * d) * y
      , S = d * v + (s * p - c * u) * y
      , C = 9.81 * 1.7
      , w = C * c * s
      , T = C * (c * c - 1)
      , ee = C * c * l
      , te = -l * s
      , E = -l * c
      , ne = 1 - l * l
      , re = a.hypot(te, E, ne) || 1
      , ie = (w * te + T * E + ee * ne) / (re * re);
    w = te * ie + (w - te * ie) * lt,
    T = E * ie + (T - E * ie) * lt,
    ee = ne * ie + (ee - ne * ie) * lt,
    u = b + w * t,
    p = x + T * t,
    d = S + ee * t;
    let ae = a.hypot(u, p, d)
      , oe = e.tucking ? .0024 : .0028
      , se = b * b * (1 + i.x * i.x) / qe(Ye(e.z)) * a.sqrt((1 + i.x * i.x) / (1 + i.x * i.x + i.z * i.z))
      , ce = ct(ae - (.13 + oe * e.speed * e.speed + a.abs(e.edge) * .38 + se * (ut + a.abs(e.edge) * .04) + (n ? 17 : 0)) * t, 0, Ie.maxSpeed)
      , le = ce / a.max(.001, ae);
    e.velocityX = u * le,
    e.velocityZ = d * le,
    e.speed = ce,
    e.travelHeading = a.atan2(u, d),
    e.turnRate = g,
    e.lateral = e.edge * e.speed * .35 + e.skid * e.speed * .1
}
var mt = (e, t, n) => a.max(t, a.min(n, e))
  , ht = .7
  , gt = 1.25
  , _t = 12
  , vt = 30
  , yt = .08
  , bt = a.PI * 160 / 180
  , xt = a.PI
  , St = a.PI / 4;
a.PI + 1.1;
var Ct = 60 / 3.6
  , wt = 1.5;
2 * a.PI + 1.1;
var Tt = .7
  , Et = .26
  , Dt = 1.4
  , Ot = 1.2
  , kt = 4
  , At = (e, t, n) => mt(-n * a.sin(a.atan(e)) / a.max(t, kt), -Ot, Ot)
  , jt = new h(1,0,0)
  , Mt = new g
  , Nt = e => e.premultiply(o(Mt, jt, Tt))
  , Pt = class {
    constructor() {
        this.load = 0,
        this.pressure = new i,
        this.end = 0,
        this.velocity = 0,
        this.active = !1,
        this.entry = ``,
        this.entryPoints = 0,
        this.ready = !1,
        this.fast = !1,
        this.riding = !1,
        this.ridingAge = 0,
        this.armed = !1,
        this.forLanding = !1,
        this.requestedEnd = 1,
        this.spent = !1,
        this.age = 0,
        this.groundHeld = 0,
        this.cooldown = 0,
        this.travel = 0,
        this.direction = 0,
        this.rotation = new g,
        this.landed = {
            pitch: 0,
            end: 1
        },
        this.caughtPitch = 0,
        this.normal = new h
    }
    reset(e=!1) {
        let t = this.cooldown;
        this.pressure.reset(),
        this.load = 0,
        this.end = 0,
        this.velocity = 0,
        this.active = !1,
        this.entry = ``,
        this.entryPoints = 0,
        this.ready = !1,
        this.armed = !1,
        this.forLanding = !1,
        this.spent = !1,
        this.riding = !1,
        this.ridingAge = 0,
        this.fast = !1,
        this.age = 0,
        this.groundHeld = 0,
        this.cooldown = e ? t : 0,
        this.travel = 0,
        this.direction = 0,
        this.grade = void 0,
        this.caughtPitch = 0,
        this.landed.pitch = 0,
        this.landed.end = 1
    }
    get turned() {
        return this.travel
    }
    get driveEnd() {
        return this.fast ? 2 * a.PI : xt
    }
    get limited() {
        return this.travel >= this.driveEnd - 1e-6
    }
    get cooldownRemaining() {
        return this.cooldown
    }
    get preparing() {
        return this.armed && !this.spent && this.cooldown === 0
    }
    contact(e, t, n=this.requestedEnd) {
        if (e.grind || e.airborne || !this.preparing || this.active)
            return !1;
        let r = this.pressure.impact(t);
        return r === `overload` && (this.spent = !0),
        r === `loaded` ? (this.active = !0,
        this.spent = !0,
        this.end = n,
        this.fast = e.speed + 1e-9 >= Ct,
        this.caughtPitch = 0,
        this.age = 0,
        this.travel = 0,
        this.direction = 0,
        this.ready = !1,
        this.riding = !1,
        this.velocity = mt(e.spinVelocity, -10, 10),
        e.landingSettling = !1,
        !0) : !1
    }
    catchLanding(e, t, n) {
        this.normal.copy(n).applyQuaternion(this.rotation.copy(t).invert()),
        e.switchStance && (this.normal.x *= -1,
        this.normal.z *= -1);
        let {x: r, y: i, z: o} = this.normal
          , s = a.min(.9 * o, -.84 * o) + .04 * i - .073 * a.abs(r)
          , c = a.min(.82 * i - .25, 1.2 * i + .06 * o - .25, 1.65 * i + .04 * o - .18);
        return this.landed.pitch = a.asin(mt(a.abs(o), 0, 1)),
        this.landed.end = o < 0 ? 1 : -1,
        this.forLanding && this.armed && this.preparing && !this.active && !e.grind && e.airTime <= 1.2 && i > 0 && this.landed.pitch <= 1.4 && s + .06 < c
    }
    landingFor(e) {
        let t = this.forLanding && this.armed && !e.grind;
        return this.forLanding = !1,
        t ? !this.preparing || this.active ? (this.spent = !0,
        null) : e.airTime > 1.2 ? (this.spent = !0,
        `faceplant`) : `press` : null
    }
    pressLanding(e, t) {
        let n = this.landed.pitch
          , r = n > Et;
        this.landed.pitch = 0;
        let i = this.contact(e, mt(t, 2, l), r ? this.landed.end : this.requestedEnd);
        return i ? (this.pressure.lean = ht,
        this.caughtPitch = r ? a.min(n, Dt) : 0) : this.spent = !0,
        i
    }
    pose(e) {
        if (!this.active || e.grind)
            return;
        e.landingPrepare = -1,
        e.landingFlip = this.caughtPitch,
        e.spinTightness = this.load * .85,
        e.spinWindup = mt(this.velocity / 3, -1, 1);
        let t = mt((this.age - .25) / gt, 0, 1);
        e.flipWindup = this.end,
        e.flipTightness = this.pressure.shift * .84 + .16 * t * t * (3 - 2 * t)
    }
    step(e, t, n, r=0) {
        if (e.grind)
            return this.reset(),
            !1;
        this.cooldown = a.max(0, this.cooldown - n),
        this.cooldown < 1e-9 && (this.cooldown = 0);
        let i = this.armed;
        if (this.armed = !!t.butter,
        this.armed && !i && (this.requestedEnd = t.brake && !t.forward ? -1 : 1,
        e.airborne ? this.forLanding = !0 : this.cooldown > 0 && (this.spent = !0)),
        this.armed || (this.forLanding = !1),
        !this.armed && !this.active && (this.spent = !1),
        e.airborne)
            return this.grade = void 0,
            this.groundHeld = 0,
            this.riding = !1,
            !1;
        if (this.forLanding && (this.forLanding = !1,
        this.spent = !0),
        this.entry = ``,
        this.entryPoints = 0,
        i && this.grade !== void 0 && !e.landingSettling) {
            let t = e.speed * a.max(0, a.sin(a.atan(r) - a.atan(this.grade)));
            t > .7 && this.contact(e, t)
        }
        if (this.grade = r,
        this.groundHeld = this.preparing && !this.active && !e.landingSettling ? this.groundHeld + n : 0,
        this.groundHeld + 1e-9 >= .1 && this.contact(e, 2, this.requestedEnd) && (this.pressure.lean = ht),
        !this.active)
            return this.settle(e, n),
            !1;
        this.age += n,
        this.pressure.update(!0, n),
        this.load = this.pressure.compression,
        this.direction ||= a.sign(a.abs(this.velocity) > .3 ? this.velocity : t.steer);
        let o = 0
          , s = a.max(1, a.ceil(n * 120))
          , c = n / s
          , l = this.driveEnd
          , d = l - xt + bt;
        for (let e = 0; e < s; e++) {
            let e = mt((this.travel - d) / (l - d), 0, 1)
              , n = e * e * (3 - 2 * e)
              , r = this.armed && t.steer * this.direction > .06
              , i = a.min(6.5, 3 + this.load * 4) * (this.fast ? wt : 1)
              , s = r ? this.direction * i * (1 - n) : 0
              , u = r ? mt((a.abs(this.velocity) - i) / 3.5, 0, 1) : 0
              , f = mt((this.travel - l) / St, 0, 1)
              , p = f * f * (3 - 2 * f)
              , m = 6 - 4.5 * u * (1 - n) + n * 2 + p * 10 + (t.steer * this.direction < -.06 ? 4 : 0)
              , h = a.exp(-m * c)
              , g = this.velocity;
            this.velocity = s + (g - s) * h;
            let _ = s * c + (g - s) * (1 - h) / m;
            this.travel += a.abs(_),
            o += _
        }
        let f = e.heading + e.spin + (e.switchStance ? a.PI : 0);
        e.spin += o;
        let p = this.end * u(e.flipTightness, this.load);
        e.x += p * (a.sin(f) - a.sin(f + o)),
        e.z += p * (a.cos(f) - a.cos(f + o)),
        e.spinVelocity = this.velocity;
        let m = this.load * (5 + e.speed * .18 + a.abs(this.velocity) * .5);
        e.speed = a.max(0, e.speed - m * n),
        this.pose(e);
        let h = this.travel >= this.driveEnd - 1e-6 && a.abs(this.velocity) < 1.5;
        return this.ready = this.age > .12 && (!this.armed || h || this.age + 1e-9 >= 2.5),
        !0
    }
    launch(e, t, n=0, r=0) {
        if (this.entry = ``,
        this.entryPoints = 0,
        this.riding = !1,
        !this.active)
            return {
                pop: 0,
                spin: 0,
                flip: 0
            };
        let i = a.round((e.spin + n) / a.PI)
          , o = i * a.PI;
        this.rotation.set(0, a.sin(-o / 2), 0, a.cos(-o / 2)),
        t.multiply(this.rotation),
        a.abs(i) % 2 && (e.switchStance = !e.switchStance);
        let s = this.load > .12
          , c = a.max(this.travel, r)
          , l = c > 2 * a.PI - .12 ? ` 360` : c > a.PI - .12 ? ` 180` : ``;
        s && (this.entry = `${this.end > 0 ? `NOSE` : `TAIL`} BUTTER${l}`),
        this.entryPoints = ye(this.age, this.load, c, e.speed);
        let u = {
            pop: this.pressure.release(),
            spin: this.velocity,
            flip: 0
        };
        return this.cooldown = 1,
        this.pressure.reset(),
        this.active = !1,
        this.ready = !1,
        this.load = 0,
        this.velocity = 0,
        this.end = 0,
        u
    }
    release(e, t) {
        let n = this.velocity
          , r = n * a.abs(n) / (2 * vt) + n * yt / 2
          , i = a.round((e.spin + r) / a.PI) * a.PI;
        this.launch(e, t, r, a.abs(i)),
        e.spin -= i,
        e.spinVelocity = n,
        this.riding = !0,
        this.ridingAge = 0
    }
    settle(e, t) {
        if (!this.riding)
            return;
        this.ridingAge += t;
        let n = mt(this.ridingAge / yt, 0, 1)
          , r = vt * n * n * (3 - 2 * n);
        e.spinVelocity += mt(-_t * _t * e.spin - 2 * _t * e.spinVelocity, -r, r) * t,
        e.spin += e.spinVelocity * t,
        a.abs(e.spin) < .002 && a.abs(e.spinVelocity) < .02 && (e.spin = 0,
        e.spinVelocity = 0,
        this.riding = !1)
    }
}
  , Ft = [`MUTE GRAB`, `TAIL GRAB`, `JAPAN GRAB`]
  , It = [`WEDDLE GRAB`, `NOSE GRAB`, `METHOD GRAB`]
  , Lt = class {
    constructor() {
        this.mask = 0,
        this.style = -1,
        this.streak = 0,
        this.qualified = !1,
        this.board = !1,
        this.time = 0,
        this.longest = 0
    }
    reset() {
        this.mask = 0,
        this.style = -1,
        this.streak = 0,
        this.qualified = !1,
        this.time = 0,
        this.longest = 0,
        this.board = !1
    }
    update(e, t, n=0, r=!1) {
        if (!t || !Number.isInteger(n) || n < 0 || n >= Ft.length) {
            this.style = -1,
            this.streak = 0,
            this.qualified = !1;
            return
        }
        e <= 0 || (this.board = r,
        n !== this.style && (this.style = n,
        this.streak = 0,
        this.qualified = !1),
        this.streak += e,
        this.qualified ? this.time += e : this.streak + 1e-9 >= .25 && (this.qualified = !0,
        this.mask |= 1 << n,
        this.time += this.streak),
        this.qualified && (this.longest = a.max(this.longest, this.streak)))
    }
    get names() {
        return this.namesOn(this.board)
    }
    namesOn(e) {
        return (e ? It : Ft).filter( (e, t) => this.mask & 1 << t)
    }
    get count() {
        return Number(!!(this.mask & 1)) + Number(!!(this.mask & 2)) + Number(!!(this.mask & 4))
    }
}
  , Rt = a.PI * 2
  , zt = e => a.atan2(a.sin(e), a.cos(e))
  , Bt = -.2
  , Vt = -.05
  , Ht = 60 * a.PI / 180
  , Ut = .6
  , Wt = .5
  , Gt = -.17
  , Kt = -.8
  , qt = 1.25
  , Jt = .26
  , Yt = .35
  , Xt = [``, ``, `DOUBLE `, `TRIPLE `, `QUAD `]
  , Zt = e => Xt[e] ?? `${e}X `
  , Qt = {
    back: `BACKFLIP`,
    front: `FRONTFLIP`,
    side: `SIDEFLIP`
}
  , $t = {
    back: `WILDCAT`,
    front: `TAMEDOG`,
    heels: `BACKFLIP`,
    toes: `FRONTFLIP`
}
  , en = {
    step: 180,
    from: 0
}
  , tn = {
    step: 90,
    from: 0
}
  , nn = {
    step: 180,
    from: 90
}
  , rn = (e, t) => !t || e === `side` ? e : e === `back` ? `front` : `back`
  , an = class {
    constructor() {
        this.flips = [],
        this.twist = 0,
        this.base = new g,
        this.body = new g,
        this.previous = new g,
        this.delta = new g,
        this.inverse = new g,
        this.up = new h,
        this.lastUp = new h,
        this.move = new h,
        this.frame = new h,
        this.nose = new h,
        this.hip = new h,
        this.facing = 0,
        this.unseen = 0,
        this.blind = !1,
        this.inside = !1,
        this.entry = 0,
        this.deepest = 0,
        this.deepMove = new h,
        this.deepFrame = new h,
        this.settled = !0,
        this.tippedTwist = 0,
        this.lowest = 1,
        this.lowestFrame = new h,
        this.worldUp = new h,
        this.lowestWorld = 1,
        this.tippedWorldTwist = 0,
        this.turned = 0,
        this.discount = 0,
        this.flatFromTakeoff = !1,
        this.nameAsLanded = !1
    }
    reset(e, t=0) {
        this.base.copy(e).invert(),
        this.previous.identity(),
        this.flips.length = 0,
        this.twist = 0,
        this.unseen = 0,
        this.blind = !1,
        this.inside = !1,
        this.lowest = 1,
        this.settled = !0,
        this.tippedTwist = 0,
        this.facing = 0,
        this.lastUp.set(0, 1, 0),
        this.lowestWorld = 1,
        this.tippedWorldTwist = 0,
        this.turned = 0,
        this.discount = 0
    }
    observe(e, t) {
        this.track(e)
    }
    correct(e, t, n=!0) {
        this.track(e, n)
    }
    facingOf(e) {
        return this.nose.set(0, 0, 1).applyQuaternion(e),
        this.hip.set(1, 0, 0).applyQuaternion(e),
        a.atan2(this.nose.x - this.hip.z, this.nose.z + this.hip.x)
    }
    track(e, t=!0) {
        let n = this.body.copy(this.base).multiply(e);
        this.delta.copy(n).multiply(this.previous.invert()),
        this.previous.copy(n),
        this.delta.w < 0 && this.delta.set(-this.delta.x, -this.delta.y, -this.delta.z, -this.delta.w);
        let r = a.hypot(this.delta.x, this.delta.y, this.delta.z)
          , i = 2 * a.atan2(r, this.delta.w)
          , o = r > 1e-12 ? this.delta.y / r * i : 0;
        if (this.unseen += o,
        t && (this.turned += i),
        this.up.set(0, 1, 0).applyQuaternion(n),
        this.flatFromTakeoff ? this.worldUp.copy(this.up) : this.worldUp.set(0, 1, 0).applyQuaternion(e),
        this.worldUp.y < this.lowestWorld && (this.lowestWorld = this.worldUp.y),
        1 + this.up.y > Yt) {
            let e = this.facingOf(n)
              , r = zt(e - this.facing);
            this.blind && (r += Rt * a.round((this.unseen - r) / Rt)),
            t || (r = this.blind ? r - o : 0),
            r -= this.discount,
            this.twist += r,
            this.facing = e,
            this.unseen = 0,
            this.blind = !1,
            this.discount = 0,
            this.up.y < Wt && (this.tippedTwist += a.abs(r)),
            this.worldUp.y < Wt && (this.tippedWorldTwist += a.abs(r))
        } else
            this.blind = !0,
            t || (this.discount += o);
        if (this.frame.subVectors(this.up, this.lastUp),
        this.lastUp.copy(this.up),
        this.move.copy(this.frame).applyQuaternion(this.inverse.copy(n).invert()),
        this.up.y < this.lowest && (this.lowest = this.up.y,
        this.lowestFrame.copy(this.frame)),
        this.up.y > Ut && (this.settled = !0),
        !this.inside)
            this.up.y < Bt && (this.inside = !0,
            this.entry = a.atan2(this.up.x, this.up.z),
            this.deepest = this.up.y,
            this.deepMove.copy(this.move),
            this.deepFrame.copy(this.frame));
        else if (this.up.y < this.deepest && (this.deepest = this.up.y,
        this.deepMove.copy(this.move),
        this.deepFrame.copy(this.frame)),
        this.up.y > Vt && (this.inside = !1,
        a.abs(zt(a.atan2(this.up.x, this.up.z) - this.entry)) > Ht)) {
            let e = this.deepMove.clone().normalize()
              , t = this.flips.at(-1);
            t && !this.settled && t.sense.dot(e) < -.3 ? this.flips.pop() : this.flips.push({
                direction: on(e),
                family: sn(this.deepFrame),
                sense: e
            }),
            this.settled = !1
        }
    }
    result(e=!1, t=!1, n=en, r=!1) {
        let i = t || this.nameAsLanded
          , o = (i ? 35 : 15) * a.PI / 180
          , s = a.min(a.abs(this.twist), this.turned)
          , c = n.step < 180 ? n.step / 2 : i ? 35 : 15
          , l = e => {
            let t = e * 180 / a.PI + c - n.from;
            return t < 0 ? 0 : a.floor(t / n.step) * n.step + n.from
        }
          , u = l(s)
          , d = this.flips.length
          , f = this.lowest < Kt
          , p = d ? this.flips[0].family : sn(this.lowestFrame)
          , m = (d > 0 || this.lowest < Gt) && this.tippedTwist >= a.PI - o
          , h = p === `side` && !f && this.lowestWorld < Jt && this.tippedWorldTwist >= a.PI - o
          , g = (u >= 360 || f && d === 1 && u >= 180) && (m || h)
          , _ = ``
          , v = ``
          , y = this.twist > 0 !== e
          , b = !r || !u ? `` : e ? y ? `CAB ` : `SWITCH BS ` : y ? `FS ` : `BS `
          , x = ``;
        if (g) {
            let t = rn(p, e)
              , n = a.max(1, d)
              , r = n > 1 ? this.turned : s > 2 * Rt ? this.turned + a.PI : 1 / 0;
            u = l(f ? a.min(s + n * Rt, r) : a.min(a.abs(this.twist), this.turned * qt));
            let i = t === `front` ? f ? `MISTY` : `BIO` : f ? `RODEO` : t === `side` ? `FLATSPIN` : `CORK`;
            _ = `${Zt(n)}${i} ${u}`,
            v = i,
            b && (x = b,
            _ = `${b}${Zt(n)}${i === `BIO` ? `CORK` : i} ${u}`)
        } else if (d) {
            let t = [];
            for (let n of this.flips) {
                let r = rn(n.direction, e)
                  , i = t.at(-1);
                i?.direction === r ? i.count++ : t.push({
                    direction: r,
                    count: 1
                })
            }
            if (_ = t.map(e => `${Zt(e.count)}${Qt[e.direction]}`).join(` + `) + (u ? ` ${u}` : ``),
            v = t.map(e => Qt[e.direction]).join(` + `),
            r) {
                let t = [];
                for (let n of this.flips) {
                    let r = rn(n.direction, e)
                      , i = t.at(-1)
                      , a = $t[r === `side` ? n.sense.x > 0 ? `heels` : `toes` : r];
                    i?.flip === a ? i.count++ : t.push({
                        flip: a,
                        count: 1
                    })
                }
                _ = t.map(e => `${Zt(e.count)}${e.flip}`).join(` + `) + (u ? ` ${u}` : ``)
            }
        } else
            u && (x = b,
            _ = `${b}${u}`,
            v = u > 180 ? `SPIN` : `180`);
        return _ && e && !x && (_ = `SWITCH ${_}`),
        v && e && (v = `SWITCH ${v}`),
        v && u && a.abs(this.twist) >= a.PI / 2 && (v += this.twist > 0 ? ` LEFT` : ` RIGHT`),
        {
            name: _,
            rotations: u,
            inversions: d,
            offAxis: g,
            type: v
        }
    }
}
;
function on(e) {
    return a.abs(e.x) > a.abs(e.z) * 1.2 ? `side` : e.z < 0 ? `back` : `front`
}
function sn(e) {
    return a.abs(e.x) > a.abs(e.z) * 1.2 ? `side` : e.z > 0 ? `back` : `front`
}
var cn = 3
  , ln = .66
  , un = 2.9
  , dn = 40 * a.PI / 180
  , fn = 2
  , pn = .28
  , mn = 7
  , hn = 95 * a.PI / 180
  , gn = -.3
  , _n = .05
  , vn = .25
  , yn = class {
    constructor() {
        this.orientation = new g,
        this.judge = new an,
        this.momentum = new h,
        this.inverse = new g,
        this.local = new h,
        this.omega = new h,
        this.step = new g,
        this.half = new g,
        this.up = new h,
        this.nose = new h,
        this.hip = new h,
        this.regular = new h,
        this.corkAxis = new h,
        this.flipAxis = new h,
        this.carrier = new h,
        this.regularCarrier = new h,
        this.takeoffLateral = new h(1,0,0),
        this.takeoffForward = new h(0,0,1),
        this.takeoffUp = new h(0,1,0),
        this.pitchHeld = !1,
        this.corkTransition = new d,
        this.overTransition = new d,
        this.spineEase = cn,
        this.rollLean = ln * a.tan(hn / 2),
        this.turned = 0,
        this.heading = 0,
        this.wasInverted = !1,
        this.speed = 0,
        this.corked = !1,
        this.regularScale = 1,
        this.regularSpin = 0,
        this.spinAngle = 0,
        this.flipAngle = 0,
        this.inversions = 0
    }
    reset(e=0, t=0, n) {
        this.pitchHeld = !1,
        n ? this.orientation.copy(n) : s(this.orientation, e, t, 0, `YXZ`),
        this.takeoffLateral.set(a.cos(t), 0, -a.sin(t)),
        this.takeoffForward.set(a.sin(t), 0, a.cos(t)),
        n && (this.takeoffLateral.set(1, 0, 0).applyQuaternion(n),
        this.takeoffForward.set(0, 0, 1).applyQuaternion(n)),
        this.takeoffUp.crossVectors(this.takeoffForward, this.takeoffLateral).normalize();
        let r = a.hypot(this.takeoffForward.x, this.takeoffForward.z) || 1
          , i = a.atan2(-(this.takeoffUp.x * this.takeoffForward.x + this.takeoffUp.z * this.takeoffForward.z) / r, this.takeoffUp.y);
        this.rollLean = ln * a.tan(a.max(.2, a.min(1.1, (hn - i) / 2))),
        this.corkTransition.reset(),
        this.overTransition.reset(),
        this.turned = 0,
        this.corked = !1,
        this.speed = 0,
        this.spinAngle = 0,
        this.flipAngle = 0,
        this.inversions = 0,
        this.heading = this.bodyHeading,
        this.wasInverted = this.upright < gn,
        this.judge.reset(this.orientation, t)
    }
    controlPitch(e, t, n, r) {
        let i = e !== 0;
        if (i && !this.pitchHeld && a.abs(n) < .1 && a.abs(r) < .1) {
            let e = t ? -1 : 1;
            this.takeoffLateral.set(e, 0, 0).applyQuaternion(this.orientation),
            this.takeoffForward.set(0, 0, e).applyQuaternion(this.orientation),
            this.takeoffUp.crossVectors(this.takeoffForward, this.takeoffLateral).normalize()
        }
        this.pitchHeld = i
    }
    update(e, t, n, r=!1, i=0, s=!1) {
        if (n <= 0)
            return;
        let c = a.max(a.abs(e), a.abs(t), a.abs(i))
          , l = a.max(1, a.ceil(n * 240))
          , u = n / l
          , d = 0;
        for (let n = 0; n < l; n++) {
            this.turned < _n && (this.corkTransition.reset(),
            this.overTransition.reset());
            let n = this.corkTransition.update(r, u * .5)
              , l = this.overTransition.update(s, u * .5)
              , f = dn * a.max(-1, a.min(1, t / fn)) * a.max(0, a.min(1, -e / fn)) * (1 - l);
            this.flipAxis.copy(this.takeoffLateral).multiplyScalar(a.cos(f)).addScaledVector(this.takeoffForward, a.sin(f)),
            this.momentum.copy(this.flipAxis).multiplyScalar(e).addScaledVector(this.takeoffUp, t * (ln + (pn - ln) * l)).addScaledVector(this.takeoffForward, -i * this.rollLean);
            let p = a.abs(e) / (a.abs(e) + a.abs(i) || 1)
              , m = cn + (un - cn) * p;
            this.spineEase = m + (mn - m) * l,
            this.velocity(this.orientation, e, t, i, c, n, this.omega);
            let h = this.omega.length();
            o(this.step, this.omega.normalize(), h * u * .5),
            this.velocity(this.half.copy(this.orientation).premultiply(this.step), e, t, i, c, n, this.omega);
            let g = this.omega.length();
            o(this.step, this.omega.normalize(), g * u),
            this.orientation.premultiply(this.step).normalize(),
            this.judge.observe(this.orientation, this.carrier),
            d += g * u,
            this.turned += g * u,
            this.corkTransition.update(r, u * .5),
            this.overTransition.update(s, u * .5),
            n > .5 && a.abs(e) > .3 && a.abs(t) > .3 && (this.corked = !0);
            let _ = this.bodyHeading
              , v = _ - this.heading;
            v > a.PI ? v -= a.PI * 2 : v < -a.PI && (v += a.PI * 2),
            this.spinAngle += (1 - n) * this.regularSpin * this.regularScale * u + n * v,
            this.flipAngle += ((1 - n) * e * this.regularScale + n * this.omega.x * g) * u,
            this.heading = _;
            let y = this.upright < gn;
            y && !this.wasInverted && this.inversions++,
            this.wasInverted = y
        }
        this.speed = d / n
    }
    velocity(e, t, n, r, i, o, s) {
        let c = a.abs(t) / a.max(a.abs(t), a.abs(n), 1e-9);
        this.regularSpin = n * (1 - c);
        let l = -n * c;
        this.regular.set(0, this.regularSpin, -r).applyQuaternion(e).addScaledVector(this.takeoffLateral, t).addScaledVector(this.takeoffForward, l);
        let u = a.max(a.hypot(t, this.regularSpin, l, r), this.regular.length());
        this.regularScale = u > 1e-9 ? i / u : 0,
        this.regular.multiplyScalar(this.regularScale),
        this.regularCarrier.set(0, 0, -r).applyQuaternion(e).addScaledVector(this.takeoffLateral, t).addScaledVector(this.takeoffForward, l).multiplyScalar(this.regularScale),
        a.abs(t) + a.abs(l) < 1e-5 && a.abs(r) > 1e-5 && this.regularCarrier.copy(this.regular),
        this.turnAxis(e, this.corkAxis),
        this.corkAxis.multiplyScalar(i);
        let d = this.local.length() > 1e-9 ? i / this.local.length() : 0;
        return this.carrier.copy(this.regularCarrier).multiplyScalar(1 - o).addScaledVector(this.momentum, o * d),
        s.copy(this.regular).lerp(this.corkAxis, o)
    }
    correct(e, t=!0) {
        e.x === 0 && e.y === 0 && e.z === 0 || (this.orientation.premultiply(e).normalize(),
        this.judge.correct(this.orientation, e, t),
        this.heading = this.bodyHeading,
        this.wasInverted = this.upright < gn)
    }
    turnAxis(e, t) {
        this.inverse.copy(e).invert(),
        this.local.copy(this.momentum).applyQuaternion(this.inverse),
        this.local.y *= this.spineEase,
        t.copy(this.local).applyQuaternion(e).normalize()
    }
    get upright() {
        return this.up.set(0, 1, 0).applyQuaternion(this.orientation).y
    }
    get bodyHeading() {
        this.nose.set(0, 0, 1).applyQuaternion(this.orientation),
        this.hip.set(1, 0, 0).applyQuaternion(this.orientation);
        let e = this.nose.x - this.hip.z
          , t = this.nose.z + this.hip.x;
        return e * e + t * t < 1e-12 ? this.heading : a.atan2(e, t)
    }
    get landingYaw() {
        return this.bodyHeading
    }
    get tilt() {
        return a.acos(a.max(-1, a.min(1, this.upright)))
    }
}
  , bn = .35
  , xn = 45 * a.PI / 180
  , Sn = new h;
function Cn(e, t) {
    let n = a.asin(a.max(-1, a.min(1, Sn.set(0, 0, 1).applyQuaternion(e).dot(t)))) / xn
      , r = a.asin(a.max(-1, a.min(1, Sn.set(1, 0, 0).applyQuaternion(e).dot(t)))) / bn;
    return n * n + r * r >= 1
}
var wn = (e, t, n) => a.max(t, a.min(n, e))
  , Tn = new g;
function En(e, t, n, r, i=0, c=1.3) {
    let l = wn(e, -c, c);
    return s(r, -a.atan(l), 0, a.atan(wn(i, -c, c) / a.hypot(1, l)) - n * .045, `YXZ`),
    r.multiply(o(Tn, m.DEFAULT_UP, t))
}
var Dn = class {
    constructor(e=1.3) {
        this.released = 0,
        this.locked = !1,
        this.yaw = 0,
        this.rail = !1,
        this.holdYaw = !1,
        this.velocity = new h,
        this.desired = new h,
        this.error = new g,
        this.target = new g,
        this.correction = new g,
        this.gradeLimit = e
    }
    reset() {
        this.released = 0,
        this.locked = !1,
        this.velocity.set(0, 0, 0)
    }
    update(e, t, n, r, i, s, c, l=!1, u=0, d=0, f=!1, p=0) {
        if (this.correction.identity(),
        e <= 0)
            return this.correction;
        this.released = c ? 0 : this.released + e,
        (c || l !== this.rail || f !== this.holdYaw) && (this.locked = !1),
        this.rail = l,
        this.holdYaw = f;
        let m = !c && this.released > .035 && s < 2.8;
        if (m && !this.locked && (this.yaw = l ? n : a.round((n + d - p) / a.PI) * a.PI,
        this.locked = !0),
        m) {
            (l || f) && (this.yaw = n);
            let e = Number.isFinite(i) ? a.max(0, a.min(1, (1.5 - i) / 1.2)) : 0;
            En(r * e, this.yaw + (l || f ? 0 : p), 0, this.target, u * e, this.gradeLimit),
            this.error.copy(t).invert().premultiply(this.target).normalize(),
            this.error.w < 0 && this.error.set(-this.error.x, -this.error.y, -this.error.z, -this.error.w),
            this.desired.set(this.error.x, this.error.y, this.error.z);
            let o = this.desired.length()
              , s = 2 * a.atan2(o, this.error.w);
            this.desired.multiplyScalar(o > 1e-8 ? a.min(4.8, s * 8) / o : 0)
        } else
            this.desired.set(0, 0, 0);
        let h = (c ? 40 : 30) * e;
        this.desired.sub(this.velocity).clampLength(0, h),
        this.velocity.add(this.desired);
        let g = this.velocity.length();
        return g > 1e-8 && o(this.correction, this.desired.copy(this.velocity).multiplyScalar(1 / g), g * e),
        this.correction
    }
}
  , On = a.tan(8 * a.PI / 180)
  , kn = class {
    constructor(e=1.3) {
        this.target = new g,
        this.error = new g,
        this.axis = new h,
        this.up = new h,
        this.correction = new g,
        this.gradeLimit = e
    }
    update(e, t, n, r, i=0, s=0, c=0) {
        if (this.correction.identity(),
        e <= 0)
            return this.correction;
        this.up.set(0, 1, 0).applyQuaternion(t);
        let l = a.min(On, a.tan(a.acos(a.max(-1, a.min(1, this.up.y)))))
          , u = a.max(0, a.min(1, c));
        En(l + (i - l) * u, n, 0, this.target, s * u, this.gradeLimit),
        this.error.copy(t).invert().premultiply(this.target).normalize(),
        this.error.w < 0 && this.error.set(-this.error.x, -this.error.y, -this.error.z, -this.error.w),
        this.axis.set(this.error.x, this.error.y, this.error.z);
        let d = this.axis.length()
          , f = 2 * a.atan2(d, this.error.w);
        if (d < 1e-8 || f < 1e-4)
            return this.correction;
        let p = a.max(0, a.min(1, (r - .03) / .12))
          , m = a.min(2.2, f * 7) * p;
        return o(this.correction, this.axis.multiplyScalar(1 / d), a.min(f, m * e)),
        this.correction
    }
}
  , An = 17.5
  , jn = a.PI / 2 + 2 * a.PI / 180
  , Mn = .15
  , Nn = e => e <= 22 ? e : a.min(27, 22 + (e - 22) * .5)
  , Pn = e => e <= 30 ? e : 30 + (e - 30) * .5
  , Fn = (e, t) => a.max(0, a.min(1, (e - t) / 40))
  , In = `TOO CLOSE: NO POINTS`;
function Ln(e, t, n, r, i=0) {
    return En(e, t, n, r, i, 32)
}
function Rn(e, t, n) {
    return Ye(t) > .8 && a.abs(e) > Ne + 1 && a.abs(e) < Pe && a.sign(e) * n > .12
}
function zn(e, t, n) {
    if (a.abs(t) < Pe || a.abs(e.x) >= Pe || a.sign(t) * e.velocityX >= 0)
        return null;
    let r = a.sign(t)
      , i = (r * Pe - t) / (e.x - t)
      , o = n + (e.z - n) * i;
    if (Ye(o) <= 0 || a.abs(ft(r * (Pe - 1e-5), o).x) < .005)
        return null;
    let s = ft(r * (Pe + 1e-5), o);
    return {
        x: r * (Pe - 1e-5),
        y: Ze(r * Pe, o),
        z: o,
        velocityX: e.velocityX,
        velocityZ: e.velocityZ,
        vertical: s.x * e.velocityX + s.z * e.velocityZ,
        gx: s.x,
        gz: s.z
    }
}
function Bn(e, t, n, r) {
    if (a.abs(t) >= Pe || a.abs(e.x) < Pe || a.sign(e.x) * e.velocityX <= 0)
        return null;
    let i = a.sign(e.x)
      , o = (i * Pe - t) / (e.x - t)
      , s = n + (e.z - n) * o
      , c = Ye(s);
    if (c <= 0)
        return null;
    let l = ft(t, n)
      , u = ft(i * (Pe - 1e-5), s);
    if (a.abs(u.x) < .005)
        return null;
    let d = e.velocityX
      , f = l.x * d + l.z * e.velocityZ
      , p = e.velocityZ
      , m = a.hypot(d, f, p)
      , h = e.speed / a.max(.001, m);
    d *= h,
    f *= h,
    p *= h;
    let g = a.hypot(l.x, 1, l.z)
      , _ = a.hypot(u.x, 1, u.z)
      , v = -l.x / g
      , y = 1 / g
      , b = -l.z / g
      , x = -u.x / _
      , S = 1 / _
      , C = -u.z / _
      , w = y * C - b * S
      , T = b * x - v * C
      , ee = v * S - y * x
      , te = v * x + y * S + b * C
      , E = w * d + T * f + ee * p
      , ne = d * te + T * p - ee * f + w * E / (1 + te)
      , re = f * te + ee * d - w * p + T * E / (1 + te)
      , ie = p * te + w * f - T * d + ee * E / (1 + te);
    if (re - u.z * ie < .12)
        return null;
    let ae = (jn - je) * c
      , oe = i * ne
      , se = re - u.z * ie
      , ce = i * (oe * a.cos(ae) - se * a.sin(ae))
      , le = oe * a.sin(ae) + se * a.cos(ae) + u.z * ie
      , ue = a.hypot(ne, re, ie) / a.hypot(ce, le, ie);
    ce *= ue,
    le *= ue;
    let de = ie * ue
      , fe = a.max(0, a.min(1, r)) * 2.2
      , pe = {
        x: i * (Pe - 1e-5),
        y: Ze(i * Pe, s),
        z: s,
        gx: u.x,
        gz: u.z
    };
    if (c > .98) {
        let e = Nn(a.hypot(oe, se))
          , t = Pn(a.hypot(e, ie))
          , n = a.sign(ie) * a.sqrt(a.max(0, t * t - e * e))
          , r = a.max(.5, e - -u.z * n)
          , o = a.min(r * .5, Mn * An / (2 * a.max(.5, r + fe - u.z * n)))
          , s = a.min(1, a.hypot(ne, re, ie) / a.max(.001, a.hypot(o, r, n)));
        return n *= s,
        r *= s,
        o *= s,
        {
            ...pe,
            velocityX: -i * o,
            vertical: r + fe,
            velocityZ: n
        }
    }
    let me = a.atan(a.abs(u.x)) + ae
      , he = ce + i * a.cos(me) * fe;
    return {
        ...pe,
        velocityX: i * he > 0 ? 0 : he,
        vertical: le + a.sin(me) * fe,
        velocityZ: de
    }
}
function Vn(e, t, n) {
    let r = a.hypot(t, 1, n)
      , i = -t / r
      , o = 1 / r
      , s = -n / r
      , c = a.min(0, e.velocityX * i + e.vy * o + e.velocityZ * s)
      , l = e.velocityX - i * c
      , u = e.vy - o * c
      , d = e.velocityZ - s * c;
    return {
        x: l,
        y: u,
        z: d,
        speed: a.hypot(l, u, d),
        impact: -c
    }
}
var Hn = new h
  , Un = new g
  , Wn = new h
  , Gn = new h
  , Kn = new h
  , qn = (e, t) => Kn.set(e, 0, t).addScaledVector(Wn, -(e * Wn.x + t * Wn.z)).addScaledVector(Gn, -(e * Gn.x + t * Gn.z));
function Jn(e, t, n, r, i) {
    let o = Vn(e, r, i)
      , s = a.hypot(r, 1, i);
    Wn.set(-r / s, 1 / s, -i / s),
    Hn.set(0, 0, 1).applyQuaternion(n);
    let c = a.cos(t)
      , l = a.sin(t);
    if (Hn.set(Hn.x * c + Hn.z * l, Hn.y, Hn.z * c - Hn.x * l),
    Hn.addScaledVector(Wn, -Hn.dot(Wn)),
    Gn.set(0, -1, 0).addScaledVector(Wn, Wn.y).normalize(),
    qn(o.x, o.z),
    Kn.lengthSq() < .01 * o.speed * o.speed && qn(l, c),
    Kn.lengthSq() < 1e-8 || Hn.lengthSq() < 1e-8)
        return 0;
    Kn.normalize();
    let u = a.atan2(Hn.dot(Kn), Hn.dot(Gn));
    return u < 0 && (u += a.PI),
    u <= a.PI / 2 ? 0 : u - a.PI / 2 < a.PI - u ? u - a.PI / 2 : u - a.PI
}
function Yn(e, t, n, r, i) {
    if (!Number.isFinite(i))
        return 0;
    let o = a.cos(t)
      , s = a.sin(t)
      , c = a.exp(-.003 * i)
      , l = e.velocityX * c
      , u = e.velocityZ * c;
    return Hn.set(l * o - u * s, e.vy - An * i, l * s + u * o),
    Ln(n * s + r * o, 0, 0, Un, n * o - r * s).invert(),
    Hn.applyQuaternion(Un),
    a.hypot(Hn.x, Hn.z) < .5 ? 0 : a.atan2(Hn.x, Hn.z)
}
function Xn(e, t) {
    let n = 0
      , r = [.25, .5, .75, 1];
    if (t.x !== e.x)
        for (let n of [-Pe, Pe]) {
            let i = (n - e.x) / (t.x - e.x);
            i > 0 && i < 1 && r.push(i)
        }
    r.sort( (e, t) => e - t);
    for (let i of r) {
        let r = e.x + (t.x - e.x) * i
          , a = e.z + (t.z - e.z) * i;
        if (e.y + (t.y - e.y) * i > Ze(r, a)) {
            n = i;
            continue
        }
        let o = n
          , s = i;
        for (let n = 0; n < 14; n++) {
            let n = (o + s) / 2
              , r = e.x + (t.x - e.x) * n
              , i = e.z + (t.z - e.z) * n;
            e.y + (t.y - e.y) * n > Ze(r, i) ? o = n : s = n
        }
        let c = e.x + (t.x - e.x) * s
          , l = e.z + (t.z - e.z) * s;
        return {
            x: c,
            y: Ze(c, l),
            z: l
        }
    }
    return null
}
function Zn(e, t, n) {
    let r = 1 / 120
      , i = a.floor(t / r)
      , o = t / r - i
      , s = a.exp(-.003 * r)
      , c = a.exp(-.003 * r * i)
      , l = r * s * (1 - c) / (1 - s) + o * r * c * s;
    return n.x = e.velocityX * l,
    n.z = e.velocityZ * l,
    n.y = e.vy * t - An * r * r * (i * (i + 1) / 2 + o * (i + 1)),
    n
}
var Qn = class {
    constructor() {
        this.next = -1,
        this.at = 1 / 0,
        this.gx = 0,
        this.gz = 0,
        this.offset = {
            x: 0,
            y: 0,
            z: 0
        },
        this.result = {
            time: 1 / 0,
            x: 0,
            z: 0
        }
    }
    reset() {
        this.next = -1,
        this.at = 1 / 0
    }
    update(e) {
        if (e.airTime >= this.next) {
            this.next = e.airTime + .1,
            this.at = 1 / 0;
            let t = 0;
            for (let n = .04; n <= 6; n += .04) {
                let r = Zn(e, n, this.offset);
                if (e.y + r.y > Ze(e.x + r.x, e.z + r.z)) {
                    t = n;
                    continue
                }
                let i = t
                  , a = n;
                for (let t = 0; t < 12; t++) {
                    let t = (i + a) / 2
                      , n = Zn(e, t, this.offset);
                    e.y + n.y > Ze(e.x + n.x, e.z + n.z) ? i = t : a = t
                }
                let o = Zn(e, a, this.offset)
                  , s = ft(e.x + o.x, e.z + o.z);
                this.at = e.airTime + a,
                this.gx = s.x,
                this.gz = s.z;
                break
            }
        }
        return this.result.time = a.max(0, this.at - e.airTime),
        this.result.x = this.gx,
        this.result.z = this.gz,
        this.result
    }
}
  , $n = 35 * a.PI / 180
  , er = (e, t) => a.abs(e - a.round(e / t) * t)
  , tr = .5
  , nr = .5
  , rr = (e, t) => a.tan(t * a.atan(e))
  , ir = e => a.max(tr, Number.isFinite(e) ? a.max(0, a.min(1, (1.5 - e) / 1.2)) : 0)
  , ar = class {
    constructor() {
        this.assist = new Dn(32),
        this.turn = new g,
        this.axis = new h
    }
    reset() {
        this.assist.reset()
    }
    update(e, t, n, r, i, o, s, c=!1, l=0, u=0, d=!1, f=0, p=0) {
        let m = er(p, a.PI) > $n
          , h = ir(i)
          , g = this.assist.update(e, t, n, rr(r, h), a.min(i, .3), o, s, c, rr(l, h), u, d || m, f)
          , _ = a.hypot(g.x, g.y, g.z);
        return _ < 1e-9 ? g : (this.axis.set(g.x / _, g.y / _, g.z / _),
        this.turn.setFromAxisAngle(this.axis, 2 * a.atan2(_, g.w) * nr))
    }
}
;
function or() {
    let e = new yn;
    return e.judge.flatFromTakeoff = !0,
    e.judge.nameAsLanded = !0,
    e
}
var sr = class {
    constructor() {
        this.level = new kn(32)
    }
    update(e, t, n, r, i=0, o=0, s=0) {
        let c = a.max(tr, s);
        return this.level.update(e, t, n, r, rr(i, c), rr(o, c), 1)
    }
}
;
function cr(e, t, n, r) {
    if (r.z <= n.z)
        return null;
    for (let i of t) {
        if (n.z >= i.z || r.z < i.z)
            continue;
        let t = (i.z - n.z) / (r.z - n.z)
          , a = n.x + (r.x - n.x) * t;
        if (n.y + (r.y - n.y) * t > e(a, i.z))
            continue;
        let o = 0
          , s = t;
        for (let t = 0; t < 12; t++) {
            let t = (o + s) / 2
              , i = n.x + (r.x - n.x) * t
              , a = n.z + (r.z - n.z) * t;
            n.y + (r.y - n.y) * t > e(i, a) ? o = t : s = t
        }
        let c = n.x + (r.x - n.x) * s
          , l = n.z + (r.z - n.z) * s;
        return {
            x: c,
            y: e(c, l),
            z: l
        }
    }
    return null
}
var lr = .16;
function ur(e, t, n) {
    let r = (e(t + .12, n) - e(t - .12, n)) / .24
      , i = (e(t, n + .12) - e(t, n - .12)) / .24;
    return {
        dx: r,
        dz: i,
        length: a.hypot(r, i)
    }
}
function dr(e, t, n) {
    let r = n.x - t.x
      , i = n.z - t.z
      , o = a.hypot(r, i);
    if (o < 1e-7)
        return null;
    let s = a.max(1, a.ceil(o / lr))
      , c = e(t.x, t.z);
    for (let a = 1; a <= s; a++) {
        let o = a / s
          , l = t.x + r * o
          , u = t.z + i * o
          , d = e(l, u)
          , f = d > c + .001;
        if (c = d,
        !f || d < t.y + (n.y - t.y) * o - .1)
            continue;
        let p = ur(e, l, u);
        if (!(p.length < 2.75 || r * p.dx + i * p.dz <= 0))
            return {
                t: (a - 1) / s,
                nx: -p.dx / p.length,
                nz: -p.dz / p.length
            }
    }
    return null
}
function fr(e, t, n, r=.55) {
    let i = dr(e, t, n)
      , a = ur(e, n.x, n.z)
      , o = (n.x - t.x) * a.dx + (n.z - t.z) * a.dz;
    if (!i && (e(n.x, n.z) < n.y - .1 || a.length < 2.75 || n.y > t.y + 1e-6 || o < -1e-6))
        return null;
    let s = i?.nx ?? -a.dx / a.length
      , c = i?.nz ?? -a.dz / a.length
      , l = i ? t.x + (n.x - t.x) * i.t : n.x
      , u = i ? t.z + (n.z - t.z) * i.t : n.z;
    for (let t = 0; t < 4 && !(ur(e, l, u).length < 2.75 && e(l, u) <= n.y + .1); t += .12)
        l += s * .12,
        u += c * .12;
    return {
        x: l + s * r,
        z: u + c * r,
        nx: s,
        nz: c
    }
}
function pr(e, t, n) {
    let r = n.x - t.x
      , i = n.z - t.z
      , o = a.hypot(r, i);
    if (o < 1e-7)
        return null;
    let s = r / o
      , c = i / o
      , l = o
      , u = a.max(1, a.ceil(l / lr))
      , d = l / u
      , f = e(t.x, t.z);
    for (let n = 1; n <= u; n++) {
        let r = d * n
          , i = t.x + s * r
          , o = t.z + c * r
          , l = e(i, o)
          , u = (l - f) / d < -.5;
        if (f = l,
        !u)
            continue;
        let p = ur(e, i, o);
        if (p.length < 2.75 || s * p.dx + c * p.dz >= -.3)
            continue;
        let m = e(t.x, t.z)
          , h = (e, t) => a.abs(e) < a.abs(t) ? e : t
          , g = h((e(t.x + .4, t.z) - m) / .4, (m - e(t.x - .4, t.z)) / .4)
          , _ = h((e(t.x, t.z + .4) - m) / .4, (m - e(t.x, t.z - .4)) / .4)
          , v = g * s + _ * c;
        return {
            grade: a.abs(v) < 1 ? v : 0,
            dx: g,
            dz: _
        }
    }
    return null
}
var mr = new h(0,1,0)
  , hr = (e, t, n) => a.max(t, a.min(n, e))
  , gr = class {
    get shedsEquipment() {
        return !this.gentle && this.age >= (this.bracing ? .13 : .025)
    }
    constructor(e, t=!1) {
        this.collisions = null,
        this.nodes = {},
        this.links = [],
        this.velocity = new h,
        this.rest = {},
        this.origin = new h,
        this.before = new h,
        this.q = new g,
        this.target = new g,
        this.stance = new g,
        this.normal = new h,
        this.along = new h,
        this.right = new h,
        this.forward = new h,
        this.basis = new _,
        this.delta = new h,
        this.inverse = new g,
        this.offsets = [],
        this.collisionStart = new h,
        this.bends = {},
        this.identity = new g,
        this.bend = new g,
        this.slideHeading = 0,
        this.yawCarry = 0,
        this.slideOnBack = !1,
        this.contacts = 0,
        this.age = 0,
        this.bracing = !1,
        this.impact = 0,
        this.gentle = !1,
        this.ground = e,
        this.snowWalls = t;
        let n = (e, t, n, r, i, a=1) => {
            this.rest[e] = new h(t,n,r),
            this.nodes[e] = {
                p: new h,
                old: new h,
                frame: new h,
                radius: i,
                mass: a
            },
            this.offsets.push(new h)
        }
        ;
        n(`Hips`, 0, .99, 0, .19, 7),
        n(`Chest`, 0, 1.43, 0, .21, 8),
        n(`Neck`, 0, 1.65, 0, .1, 2),
        n(`Head`, 0, 1.83, 0, .16, 3);
        for (let e of [`L`, `R`]) {
            let t = e === `L` ? -1 : 1;
            n(`Leg_${e}`, t * .14, .99, 0, .14, 3),
            n(`Knee_${e}`, t * .14, .54, .045, .13, 2),
            n(`Foot_${e}`, t * .14, .14, 0, .11, 2),
            n(`Arm_${e}`, t * .245, 1.49, 0, .14, 2),
            n(`Elbow_${e}`, t * .44, 1.245, -.012, .1),
            n(`Hand_${e}`, t * .47, .94, .09, .08);
            for (let[t,n] of [[`Leg_${e}`, `Knee_${e}`], [`Knee_${e}`, `Foot_${e}`], [`Arm_${e}`, `Elbow_${e}`], [`Elbow_${e}`, `Hand_${e}`]])
                this.bends[n] = {
                    parent: t,
                    rest: this.rest[n].clone().sub(this.rest[t]),
                    from: new g
                }
        }
        let r = [`Hips`, `Chest`, `Leg_L`, `Leg_R`, `Arm_L`, `Arm_R`, `Neck`, `Head`];
        for (let e = 0; e < r.length; e++)
            for (let t = e + 1; t < r.length; t++)
                this.links.push({
                    a: r[e],
                    b: r[t],
                    length: this.rest[r[e]].distanceTo(this.rest[r[t]]),
                    minimum: !1
                });
        for (let[e,t] of Object.entries(this.bends))
            this.links.push({
                a: t.parent,
                b: e,
                length: t.rest.length(),
                minimum: !1
            })
    }
    start(e, t, n, r, i, c, l, u, d, f, p, m, g=0, _=!1, v=!1) {
        this.age = 0,
        this.bracing = _,
        this.impact = d,
        this.gentle = v,
        this.contacts = 0,
        m ? s(this.q, 0, r, 0).multiply(m).multiply(o(this.stance, mr, g)) : s(this.q, c, r + i, 0, `YXZ`),
        this.slideHeading = a.hypot(l, u) > .5 ? a.atan2(l, u) : r,
        this.forward.set(0, 0, 1).applyQuaternion(this.q),
        this.slideOnBack = new h(0,1,0).applyQuaternion(this.q).y > .25 ? this.forward.x * a.sin(this.slideHeading) + this.forward.z * a.cos(this.slideHeading) < 0 : a.cos(g) < 0,
        this.yawCarry = hr(p * .025, -.18, .18);
        for (let e of Object.values(this.bends))
            e.from.identity();
        this.origin.set(e, t + .99, n),
        this.velocity.set(l * .94, -hr(d * (v ? .18 : .3), .4, 15), u * .94),
        this.pose(),
        this.resolveSnowWalls(!0),
        this.support();
        for (let e of Object.values(this.nodes))
            e.old.copy(e.p).addScaledVector(this.velocity, -1 / 120),
            e.frame.copy(e.p)
    }
    seed(e) {
        if (!(!e.Hips || !e.Chest || !e.Leg_L || !e.Leg_R)) {
            this.origin.copy(e.Hips),
            this.right.subVectors(e.Leg_R, e.Leg_L).normalize(),
            this.along.subVectors(e.Chest, e.Hips).normalize(),
            this.forward.crossVectors(this.right, this.along).normalize(),
            this.along.crossVectors(this.forward, this.right).normalize(),
            this.q.setFromRotationMatrix(this.basis.makeBasis(this.right, this.along, this.forward)),
            this.inverse.copy(this.q).invert();
            for (let[t,n] of Object.entries(this.bends))
                !e[t] || !e[n.parent] || (this.delta.subVectors(e[t], e[n.parent]).normalize().applyQuaternion(this.inverse),
                n.from.setFromUnitVectors(n.rest.clone().normalize(), this.delta));
            this.pose(),
            this.resolveSnowWalls(!0),
            this.support();
            for (let e of Object.values(this.nodes))
                e.old.copy(e.p).addScaledVector(this.velocity, -1 / 120),
                e.frame.copy(e.p)
        }
    }
    pose() {
        let e = 1 - a.exp(-this.age * 9);
        for (let[t,n] of Object.entries(this.nodes)) {
            let i = this.bends[t];
            i ? (r(this.bend.copy(i.from), this.identity, e),
            n.p.copy(i.rest).applyQuaternion(this.bend).applyQuaternion(this.q).add(this.nodes[i.parent].p)) : n.p.copy(this.rest[t]).sub(this.rest.Hips).applyQuaternion(this.q).add(this.origin)
        }
    }
    support() {
        let e = 0;
        for (let t of Object.values(this.nodes))
            e = a.max(e, this.ground(t.p.x, t.p.z) + t.radius - t.p.y);
        if (e <= 0)
            return !1;
        this.origin.y += e;
        for (let t of Object.values(this.nodes))
            t.p.y += e;
        return this.contacts++,
        !0
    }
    resolveSnowWalls(e=!1) {
        if (this.snowWalls)
            for (let t of Object.values(this.nodes)) {
                let n = e ? {
                    x: this.origin.x,
                    y: t.p.y - t.radius,
                    z: this.origin.z
                } : {
                    x: t.old.x,
                    y: t.old.y - t.radius,
                    z: t.old.z
                }
                  , r = {
                    x: t.p.x,
                    y: t.p.y - t.radius,
                    z: t.p.z
                }
                  , i = fr(this.ground, n, r, .18) ?? fr(this.ground, r, r, .18);
                if (!i)
                    continue;
                let a = i.x - t.p.x
                  , o = i.z - t.p.z;
                this.origin.x += a,
                this.origin.z += o;
                for (let e of Object.values(this.nodes))
                    e.p.x += a,
                    e.p.z += o;
                let s = this.velocity.x * i.nx + this.velocity.z * i.nz;
                s < 0 && (this.velocity.x -= i.nx * s,
                this.velocity.z -= i.nz * s),
                this.contacts++
            }
    }
    update(e, t) {
        if (e <= 0)
            return;
        for (let e of Object.values(this.nodes))
            e.frame.copy(e.p);
        let n = a.max(1, a.ceil(e * 120))
          , i = e / n;
        this.contacts = 0;
        for (let e = 0; e < n; e++) {
            this.age += i,
            this.before.copy(this.origin);
            for (let e of Object.values(this.nodes))
                e.old.copy(e.p);
            let {x: e, z: n} = this.origin;
            this.normal.set(this.ground(e - .3, n) - this.ground(e + .3, n), .6, this.ground(e, n - .3) - this.ground(e, n + .3)).normalize();
            let o = this.slideHeading + this.yawCarry * a.exp(-this.age * 3);
            if (this.along.set(a.sin(o), 0, a.cos(o)).addScaledVector(this.normal, -(this.normal.x * a.sin(o) + this.normal.z * a.cos(o))).normalize(),
            this.forward.copy(this.normal).multiplyScalar(this.slideOnBack ? 1 : -1),
            this.right.crossVectors(this.along, this.forward).normalize(),
            this.target.setFromRotationMatrix(this.basis.makeBasis(this.right, this.along, this.forward)),
            r(this.q, this.target, 1 - a.exp(-(this.gentle ? 10 : this.bracing ? 8 : 7) * i)),
            this.velocity.y -= 17.5 * i,
            this.velocity.multiplyScalar(a.exp(-(t ? this.gentle ? .25 : .5 : .18) * i)),
            this.origin.addScaledVector(this.velocity, i),
            this.pose(),
            this.collisions) {
                let e = 0;
                for (let t of Object.values(this.nodes))
                    this.offsets[e++].subVectors(t.p, this.origin);
                this.collisionStart.copy(this.before),
                this.collisions.move(this.collisionStart, this.origin, this.velocity, this.offsets, .21).touched && (this.contacts++,
                this.pose())
            }
            if (this.resolveSnowWalls(),
            this.support()) {
                let e = this.velocity.dot(this.normal);
                e < 0 && this.velocity.addScaledVector(this.normal, -e);
                let t = this.velocity.length();
                this.velocity.multiplyScalar(a.max(0, 1 - 2.4 * i / a.max(t, .001)))
            }
        }
    }
    sample(e, t, n) {
        let r = this.nodes[e];
        return n.copy(r.frame).lerp(r.p, hr(t, 0, 1))
    }
    translate(e, t) {
        this.origin.x += e,
        this.origin.z += t;
        for (let n of Object.values(this.nodes))
            for (let r of [n.p, n.old, n.frame])
                r.x += e,
                r.z += t
    }
}
;
function _r(e, t) {
    let n = e / a.max(e, t, .001);
    return e < 3 ? `scrape` : e < 14 || n < .48 ? `balance` : e < 25 || n < .72 ? `fall` : `crash`
}
function vr(e, t, n, r) {
    let i = n * a.PI / 180
      , o = a.atan(r)
      , s = a.sin(o)
      , c = a.cos(o)
      , l = a.sin(i)
      , u = e - t
      , d = u / (l - s)
      , f = d * (c - a.cos(i))
      , p = a.tan(i);
    return {
        radius: d,
        rise: f + p * t,
        at: e => {
            if (e >= u)
                return f + p * (e - u);
            let t = s + a.max(0, e) / d;
            return d * (c - a.sqrt(a.max(0, 1 - t * t)))
        }
    }
}
var yr = e({
    AIR_ANGLE: () => Vi,
    AIR_GRAVITY: () => ni,
    AIR_RATE: () => Hi,
    AIR_REACH: () => 1,
    AIR_WINDOW: () => Ui,
    BRANCHES: () => Ue,
    COURSE_LENGTH: () => 805,
    COURSE_WIDTH: () => 180,
    FINISH_HALF_WIDTH: () => 28,
    FINISH_Z: () => 780,
    FLAT_SLAM: () => 33,
    FLIP_RATE: () => Mi,
    FORWARD_TUCK_SPEED: () => 18,
    FORWARD_TUCK_TIME: () => Li,
    FUNNEL_ANGLE: () => zi,
    FUNNEL_PULL: () => Bi,
    FUNNEL_REACH: () => Ri,
    GRAB_SPIN_RATE: () => Pi,
    JIB_PLATFORMS: () => nt,
    JIB_SECTIONS: () => tt,
    JUMPS: () => $e,
    KICKER_BACK: () => li,
    LIFT_DURATION: () => 161,
    LIFT_SPEED: () => 5,
    LIFT_TOWER_SPACING: () => 60,
    PARK_BANKS: () => ot,
    PARK_ENTRY_Z: () => 25,
    POP_CATCH: () => $r,
    POP_CLEAR: () => Qr,
    POP_CLIMB: () => Or,
    POP_GAP: () => Xr,
    POP_KICK: () => 24,
    POP_STEP: () => Zr,
    RAILS: () => et,
    RAIL_HOPS: () => 2,
    RAIL_LIP: () => Jr,
    RAIL_PULL: () => ji,
    RAIL_SPIN_RATE: () => Ai,
    RAIL_SWAPS: () => 2,
    ROLLERS: () => it,
    SNOW_FORMS: () => at,
    SPIN_RATE: () => ki,
    SPIN_TURN_RATE: () => Ni,
    SkiSimulation: () => Gi,
    UP_RUN: () => 3,
    UP_START: () => Wr,
    ZONES: () => st,
    baseHeight: () => D,
    branchOffset: () => He,
    cabinTravel: () => Di,
    center: () => ze,
    clamp: () => O,
    climbsOut: () => Gr,
    courseTangent: () => Be,
    damp: () => xr,
    groundHeight: () => _i,
    groundLaunch: () => Nr,
    groundPop: () => Pr,
    jibGrooming: () => si,
    jibLips: () => oi,
    jibSectionCenter: () => rt,
    jibTerraces: () => mi,
    jumpCenter: () => Er,
    jumpStyle: () => wr,
    lerp: () => br,
    liftX: () => Ei,
    lineDistance: () => Ve,
    mountainHeight: () => Ti,
    mountainShoulder: () => Xe,
    onKickerWall: () => Ar,
    parkBanks: () => hi,
    parkGrooming: () => gi,
    popLine: () => ti,
    railCrest: () => ri,
    railFrame: () => Hr,
    railHeading: () => Br,
    railLipRun: () => Yr,
    railPoint: () => Vr,
    railPopGap: () => ei,
    railTop: () => qr,
    rampHeight: () => fi,
    rampLaunch: () => Dr,
    riderSurface: () => Lr,
    sculptedSnow: () => pi,
    snowGrade: () => Ir,
    snowSurface: () => vi,
    terrainHeight: () => A,
    zoneAt: () => Oi
})
  , O = (e, t, n) => a.max(t, a.min(n, e))
  , br = (e, t, n) => e + (t - e) * n
  , xr = (e, t, n, r) => br(e, t, 1 - a.exp(-n * r))
  , Sr = e => {
    let t = O(e, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10)
}
  , k = e => {
    let t = O(e, 0, 1);
    return t * t * (3 - 2 * t)
}
  , Cr = a.atan(Be(25));
a.cos(Cr),
a.sin(Cr),
D(17);
var wr = e => e.kick === `high` ? `HIGH KICK` : e.kind === `step-up` ? `STEP UP` : e.kind === `hip` ? `HIP` : `FLOW`
  , Tr = new Map;
function Er(e, t) {
    let n = Tr.get(e);
    (!n || !Object.is(n.z, e.z)) && Tr.set(e, n = {
        z: e.z,
        x: ze(e.z),
        tangent: Be(e.z)
    });
    let r = a.max(0, t - e.z)
      , i = n.x + n.tangent * r;
    return br(ze(t), i, k(r / e.table)) + e.offset + e.transfer * O(r / 65, 0, 1)
}
function Dr(e, t, n, r=0) {
    let i = a.atan(a.tan(e.lipAngle * a.PI / 180) * a.max(.2, a.cos(r)))
      , o = 1.2 + O(n, 0, 1) * 2.2;
    return {
        horizontal: t * a.cos(i) - o * a.sin(i),
        vertical: t * a.sin(i) + o * a.cos(i)
    }
}
var Or = a.tan(12 * a.PI / 180)
  , kr = (e, t) => $e.some(n => {
    if (t < n.z - n.run || t > n.z + 1)
        return !1;
    let r = Er(n, t)
      , i = a.abs(e - r) - n.width / 2;
    return i >= 0 && i < 1.5 && A(e, t) < A(r + a.sign(e - r) * (n.width / 2 - .6), t) - 1
}
)
  , Ar = (e, t) => {
    let n = !1;
    for (let r of $e) {
        let i = t - r.z
          , o = r.mound;
        if (i < -r.run || i > r.table + r.landing)
            continue;
        let s = o?.shoulder ?? 3
          , c = a.abs(e - Er(r, t)) - r.width / 2;
        if (c <= (o?.height ? s - 1 : 1))
            return !1;
        n ||= !!o?.height && c < s + (o.wall ?? 4) + 1
    }
    return n
}
  , jr = a.tan(60 * a.PI / 180);
function Mr(e, t, n, r) {
    for (let i = 1; i <= 5; i++) {
        let a = ur(A, e + n * i / 10, t + r * i / 10);
        if (a.length >= jr && a.dx * n + a.dz * r > 0)
            return !0
    }
    return !1
}
function Nr(e, t, n, r, i) {
    let {slope: o, crossSlope: s} = Lr(e, t, 0)
      , c = $e.some(n => t >= n.z - n.run && t <= n.z && a.abs(e - Er(n, t)) < n.width / 2);
    if (!c) {
        let n = A(e, t);
        Mr(e, t, 1, 0) ? s = (n - A(e - .5, t)) / .5 : Mr(e, t, -1, 0) && (s = (A(e + .5, t) - n) / .5),
        Mr(e, t, 0, 1) ? o = (n - A(e, t - .5)) / .5 : Mr(e, t, 0, -1) && (o = (A(e, t + .5) - n) / .5)
    }
    let l = (c ? 1.2 + O(i, 0, 1) * 2.2 : 3.6 + O(i, 0, 1) * 2.6) / a.hypot(s, 1, o)
      , u = s * n + o * r
      , d = a.hypot(n, r) * Or;
    return {
        velocityX: n - s * l,
        velocityZ: r - o * l,
        vertical: (u > d && (kr(e, t) || Ar(e, t)) ? d : u) + l
    }
}
var Pr = (e, t, n, r, i) => Nr(e, t, n, r, i).vertical;
function Fr(e, t, n) {
    let r = Er(e, n)
      , i = a.max(.6, e.width / 2 - .05)
      , o = a.max(r - i, a.min(r + i - 1, t - .5));
    return A(o + 1, n) - A(o, n)
}
function Ir(e, t, n) {
    for (let r of $e)
        if (t <= r.z && t >= r.z - r.lipLength + .5 && a.abs(e - Er(r, t)) < r.width / 2)
            return Fr(r, e, t) * a.sin(n) + a.tan(r.lipAngle * a.PI / 180) * a.cos(n);
    let r = a.sin(n) * .5
      , i = a.cos(n) * .5;
    return A(e + r, t + i) - A(e - r, t - i)
}
function Lr(e, t, n, r=!1) {
    let i = ft(e, t);
    return {
        slope: i.x * a.sin(n) + i.z * a.cos(n),
        crossSlope: i.x * a.cos(n) - i.z * a.sin(n),
        lip: 0
    }
}
var Rr = new WeakMap;
function zr(e) {
    let t = Rr.get(e);
    if (!t) {
        let n = a.atan(Be(e.z)) + e.angle * a.PI / 180;
        t = {
            h: n,
            sin: a.sin(n),
            cos: a.cos(n),
            c: ze(e.z)
        },
        Rr.set(e, t)
    }
    return t
}
var Br = e => zr(e).h;
function Vr(e, t) {
    let n = zr(e);
    return {
        x: n.c + e.offset + n.sin * e.length * t,
        z: e.z + n.cos * e.length * t
    }
}
function Hr(e, t, n) {
    let r = zr(e)
      , i = t - r.c - e.offset
      , a = n - e.z;
    return {
        t: (i * r.sin + a * r.cos) / e.length,
        side: i * r.cos - a * r.sin
    }
}
var Ur = {
    flat: () => 0,
    kink: e => e < .3 ? .65 * k(e / .3) : e < .62 ? .65 : .65 * (1 - k((e - .62) / .38)),
    down: e => .35 - .6 * e,
    "down-flat-down": e => e < .28 ? .36 * (1 - k(e / .28)) : e < .64 ? 0 : -.25 * k((e - .64) / .36),
    rainbow: e => 1.5 * a.sin(a.PI * e),
    cannon: e => 1.9 * a.pow(k((e - .55) / .45), 1.3)
}
  , Wr = .5
  , Gr = e => e.entry === `ride` && e.profile !== `rainbow`
  , Kr = (e, t) => Gr(e) ? -Wr * (1 - k(t * e.length / 3)) : 0;
function qr(e, t) {
    let n = Vr(e, 0)
      , r = Vr(e, 1)
      , i = O(t, 0, 1);
    return br(_i(n.x, n.z), _i(r.x, r.z), i) + e.height + Ur[e.profile](i) + Kr(e, i)
}
var Jr = 8.5
  , Yr = e => e.entryRun ?? 8.5
  , Xr = 2.5
  , Zr = .8
  , Qr = .35
  , $r = .45
  , ei = e => e.entryGap ?? 2.5
  , ti = e => qr(e, 0) - (qr(e, .1) - qr(e, 0)) / (.1 * e.length) * ei(e)
  , ni = An
  , ri = e => e.entry === `pop` ? -ei(e) : 0
  , ii = new WeakMap;
function ai(e) {
    let t = ii.get(e);
    if (!t) {
        let n = ei(e)
          , r = Vr(e, -n / e.length)
          , i = e.entryHeight ?? ti(e) - (e.popStep ?? .8) - _i(r.x, r.z)
          , o = Br(e)
          , s = a.sin(o) * .5
          , c = a.cos(o) * .5
          , l = e.popLaunch === `ballistic` ? _i(r.x + s, r.z + c) - _i(r.x - s, r.z - c) : 0;
        t = {
            height: i,
            power: (a.tan((e.popAngle ?? 24) * a.PI / 180) - l) * (Yr(e) - n) / i
        },
        ii.set(e, t)
    }
    return t
}
function oi(e, t) {
    let n = 0;
    for (let r of et) {
        let i = Hr(r, e, t)
          , o = i.t * r.length;
        if (r.entry === `transfer` && o < 0)
            continue;
        let s = Yr(r);
        if (o < -s || o > r.length + 14 || a.abs(i.side) > 4.2)
            continue;
        let c = r.height + Ur[r.profile](0) + Kr(r, 0), l = k((3.2 - a.abs(i.side)) / 1.6), u;
        if (r.entry === `pop`) {
            let n = ai(r)
              , i = ei(r);
            if (r.popLaunch === `manual` && o <= -i) {
                let c = Vr(r, -i / r.length)
                  , l = _i(c.x, c.z) + n.height;
                u = a.max(0, l - _i(e, t)) * k((o + s) / (s - i - 1.5))
            } else if (r.popLaunch === `ballistic` && o <= -i) {
                let e = (o + s) / (s - i);
                u = n.height * (k(e) + (e * e * e - e * e) * n.power)
            } else
                u = o <= -i ? n.height * a.pow((o + s) / (s - i), n.power) : n.height * (1 - k((o + i) / 1.4))
        } else
            u = r.entry === `transfer` ? 0 : c * (o <= 0 ? k(1 + o / s) : 1 - k(o / 3));
        let d = o - r.length
          , f = (r.exitLanding === !1 ? 0 : 1) * k((d + .5) / 3) * (1 - k((d - 2) / 12)) * a.min(.42, a.max(0, r.height + Ur[r.profile](1) - .3))
          , p = k((o - 2) / 5) * (1 - k((o - r.length + (r.exitLanding === !1 ? 5 : 3)) / 5)) * a.exp(-a.pow((a.abs(i.side) - 2.6) / .9, 2)) * .22;
        n = a.max(n, (u + f) * l + p)
    }
    return n
}
function si(e, t) {
    let n = 0;
    for (let r of tt) {
        let i = k((t - r.start + 16) / 14) * (1 - k((t - r.end - 4) / 16));
        n = a.max(n, i * (1 - k((a.abs(e - rt(r, t)) - r.halfWidth) / 10)))
    }
    return n
}
var ci = (e, t) => {
    let n = a.min(.8, e, t);
    return a.max(e, t) + (n > 0 ? a.pow(a.max(0, 1 - a.abs(e - t) / n), 2) * n * .25 : 0)
}
  , li = .65
  , ui = new WeakMap;
function di(e, t, n) {
    let r = n - e.z
      , i = e.mound;
    if (r < -e.run)
        return 0;
    let o = ui.get(e);
    if (!o) {
        let t = e.z - e.run;
        o = vr(e.run, e.lipLength, e.lipAngle, D(t + .5) - D(t - .5)),
        ui.set(e, o)
    }
    let s, c;
    if (r <= 0)
        s = a.max(0, D(e.z - e.run) + o.at(r + e.run) - D(n)),
        c = s * i.height / e.height;
    else {
        let t = O((r - e.table) / e.landing, 0, 1)
          , a = t * t * t * (35 + t * (-105 + t * (126 + t * (-70 + 15 * t))))
          , o = br(Sr(t), a, i.landingBias ?? 0);
        c = (i.height + (i.levelLanding ? D(e.z) - D(n) : 0)) * (1 - o),
        s = c + (e.height - i.height) * (1 - k(r / li))
    }
    let l = a.abs(t - Er(e, n))
      , u = e.width / 2
      , d = 1 - O((l - u) / .55, 0, 1)
      , f = 1 - O((l - u - (i.shoulder ?? 3)) / (i.wall ?? 4), 0, 1);
    return (c + (s - c) * d) * f
}
function fi(e, t) {
    let n = 0;
    for (let r of $e) {
        let i = t - r.z
          , o = r.approach ?? (r.main ? 64 : 42);
        if (i < -r.run - o || i > r.table + r.landing)
            continue;
        if (r.mound) {
            n = ci(n, di(r, e, t));
            continue
        }
        let s = a.abs(e - Er(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * k(i / r.table) : 0
          , l = r.foundation ?? (r.main ? 2 : .9)
          , u = br(9, 2.4, k((i + r.run) / (r.run * .7)))
          , d = k((r.width / 2 + c + (i > .65 ? 9 : u) - s) / (i > .65 ? 9 : u))
          , f = l * k((i + r.run + o) / o) * (1 - k((i - 2) / (r.table * .55))) * k((r.width / 2 + 12 - s) / 7);
        if (i < -r.run)
            n = ci(n, f);
        else if (i <= 0) {
            let e = r.z - r.lipLength
              , o = a.tan(r.lipAngle * a.PI / 180)
              , s = r.height - o * r.lipLength + D(r.z) - D(e)
              , c = (o - (D(e + .5) - D(e - .5))) * (r.run - r.lipLength) / (s - l)
              , u = i >= -r.lipLength ? r.height + o * i + D(r.z) - D(t) : l + a.pow((i + r.run) / (r.run - r.lipLength), a.max(1.5, c)) * (s - l);
            f = a.max(f, u * d),
            n = ci(n, f)
        } else {
            let e = k(i / r.table)
              , t = 1 - Sr((i - r.table) / r.landing)
              , o = D(r.z) + r.height + r.landingRise - D(r.z + r.table)
              , s = e * t * o
              , c = r.height * (1 - k(i / li))
              , l = a.max(0, 1 - a.abs(c - s) / .8);
            n = ci(n, a.max(f, (a.max(c, s) + l * l * .2) * d))
        }
    }
    return n
}
function pi(e, t) {
    let n = e - ze(t)
      , r = 0;
    for (let e of at) {
        let i = (t - e.z) / e.radiusZ;
        if (a.abs(i) > 2.8)
            continue;
        let o = (n - e.offset) / e.radiusX;
        r += e.height * a.exp(-o * o * 1.5 - i * i * 1.8)
    }
    return r
}
function mi(e, t) {
    let n = 0;
    for (let r of nt) {
        let i = a.abs(e - ze(t) - r.offset);
        if (i > r.halfWidth + r.cut || t < r.start - r.approach || t > r.end + r.exit)
            continue;
        let o = k((t - r.start + r.approach) / r.approach) * (1 - k((t - r.end) / r.exit))
          , s = (r.height + (r.level === void 0 ? 0 : D(r.level) - D(t)) + (r.stepRise ?? 0) * k((t - r.start - 13) / 20) - (r.descent ? r.descent.drop * O((t - r.descent.start) / (r.descent.end - r.descent.start), 0, 1) : 0)) * o;
        if (r.downhillApproach && t < r.start) {
            let e = r.start - r.approach
              , n = O((t - e) / r.approach, 0, 1)
              , i = D(e)
              , o = D(r.level ?? r.start) + r.height
              , c = a.min(0, (o - i) / r.approach)
              , l = O(D(e + .5) - D(e - .5), c * 3, 0)
              , u = r.level === void 0 ? O(D(r.start + .5) - D(r.start - .5), c * 3, 0) : 0
              , d = n * n
              , f = d * n
              , p = (2 * f - 3 * d + 1) * i + (f - 2 * d + n) * r.approach * l + (-2 * f + 3 * d) * o + (f - d) * r.approach * u;
            s = a.max(0, p - D(t))
        }
        n = a.max(n, s * (1 - O((i - r.halfWidth) / r.cut, 0, 1)))
    }
    for (let r of tt) {
        if (r.branch === void 0 || t < r.start - 50 || t > r.end + 16)
            continue;
        let i = 1 - k((a.abs(e - rt(r, t)) - r.halfWidth - 2) / 7);
        if (!i)
            continue;
        let o = k((t - r.start + 50) / 34) * (1 - k((t - r.end + 4) / 20))
          , s = D(r.start - 16) + 1.2 - (t - r.start + 16) * .075;
        n = a.max(n, O(s - D(t), 0, 3.5) * o * i)
    }
    return n
}
function hi(e, t) {
    let n = 0;
    for (let r of ot) {
        let i = a.abs(t - r.z) / r.radiusZ;
        if (i >= 1)
            continue;
        let o = a.abs(e - ze(t) - r.offset) / r.radiusX;
        o < 1 && (n = a.max(n, r.height * (1 - k(i)) * (1 - k(o))))
    }
    return n
}
function gi(e, t) {
    let n = 0;
    for (let r of $e) {
        let i = t - r.z
          , o = r.mound ? 20 : 12;
        if (i < -r.run - o || i > r.table + r.landing + 15)
            continue;
        let s = a.abs(e - Er(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * k(i / r.table) : 0;
        n = a.max(n, k((i + r.run + o) / 16) * (1 - k((i - r.table - r.landing + 8) / 23)) * (1 - k((s - r.width / 2 - c - 2) / 12)))
    }
    return a.max(n, si(e, t))
}
function _i(e, t) {
    return Ze(e, t)
}
function A(e, t) {
    let n = vi(e, t);
    return a.max(n, wi(e, t, n))
}
function vi(e, t) {
    return _i(e, t) + oi(e, t)
}
var yi = et.find(e => e.stairs)
  , bi = 1.2
  , xi = 1.5
  , Si = .45
  , Ci = ( () => {
    if (!yi?.stairs)
        return null;
    let e = [Vr(yi, 0), Vr(yi, 1)]
      , t = yi.stairs.width + Si + 2;
    return {
        minX: a.min(e[0].x, e[1].x) - t,
        maxX: a.max(e[0].x, e[1].x) + t,
        minZ: a.min(e[0].z, e[1].z) - t,
        maxZ: a.max(e[0].z, e[1].z) + t
    }
}
)();
function wi(e, t, n) {
    let r = yi
      , i = Ci;
    if (!r?.stairs || !i || e < i.minX || e > i.maxX || t < i.minZ || t > i.maxZ)
        return -1 / 0;
    let {width: o, steps: s, clearance: c} = r.stairs
      , l = (r.length - 1) / s
      , u = (r.stairs.railSide === `right` ? 1 : r.stairs.railSide === `left` ? -1 : 0) * (o / 2 - .12)
      , d = Hr(r, e, t)
      , f = d.t * r.length
      , p = a.abs(d.side - u) - o / 2
      , m = .5
      , h = m + s * l;
    if (p > Si || f < m - bi || f > h + xi)
        return -1 / 0;
    let g = e => qr(r, O(e, 0, r.length) / r.length) - c
      , _ = f <= m + l ? g(m) : g(f <= h ? f - l : h - l)
      , v = k((f - m + bi) / bi) * (1 - k((f - h) / xi)) * (1 - k(p / Si));
    return n + a.max(0, _ - n) * v
}
function Ti(e, t) {
    let n = a.max(0, a.abs(e - ze(t)) - 115)
      , r = a.sin(t * .006 + e * .003) * .4 + a.cos(t * .012 - e * .008) * .21 + a.sin(t * .021 + e * .013) * .12;
    return Qe(e, t, D(t) + Xe(e - ze(t), t) + a.pow(n, .84) * (.64 + r * .88) + a.max(0, -t - 100) * .54) - 2
}
function Ei(e, t=0) {
    return -36 + t
}
function Di(e, t=0, n=6) {
    let r = ((e / 161 + t / n * 2) % 2 + 2) % 2
      , i = a.PI * 3 / 2
      , o = r * 805;
    if (a.abs(o - 805) < i) {
        let e = (o - 805 + i) / 3;
        return {
            up: r < 1,
            z: -3 * a.sin(e),
            lane: -3 * a.cos(e),
            p: r
        }
    }
    let s = o > 2 * 805 - i ? o - 2 * 805 : o;
    if (a.abs(s) < i) {
        let e = (s + i) / 3;
        return {
            up: r < 1,
            z: 805 + 3 * a.sin(e),
            lane: 3 * a.cos(e),
            p: r
        }
    }
    let c = (r < 1 ? 1 - r : r - 1) * 805
      , l = e => i * (1 - k((e - i) / (50 - i)))
      , u = c - l(c) + l(805 - c);
    return {
        up: r < 1,
        z: u,
        lane: r < 1 ? -3 : 3,
        p: r
    }
}
function Oi(e) {
    let t = st[0][1];
    for (let[n,r] of st)
        e >= n && (t = r);
    return t
}
var ki = 6.3
  , Ai = 4.2
  , ji = ni * .5
  , Mi = ki
  , Ni = ki * 1.08
  , Pi = Ni * 1.4
  , Fi = 6.5
  , Ii = (e, t, n, r, i=28) => xr(e, t, t ? r ? i : 10 : Fi, n)
  , Li = 1.25
  , Ri = 1.5
  , zi = 25 * a.PI / 180
  , Bi = 1 / 12
  , Vi = 35 * a.PI / 180
  , Hi = .7
  , Ui = .45
  , Wi = (e, t) => a.atan2(a.sin(e - t), a.cos(e - t))
  , Gi = class e {
    constructor() {
        this.equipmentDetached = !1,
        this.collisions = null,
        this.collisionStart = new h,
        this.collisionEnd = new h,
        this.collisionVelocity = new h,
        this.collisionOffsets = [new h(0,.28,0), new h(0,.85,0), new h(0,1.47,0)],
        this.phase = `intro`,
        this.paused = !1,
        this.switchStance = !1,
        this.x = ze(90),
        this.z = 90,
        this.y = A(this.x, this.z),
        this.speed = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.carveTransfer = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.airTime = 0,
        this.maxAir = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.grabLedger = new Lt,
        this.scoreFactors = null,
        this.lastScoreFactors = null,
        this.spin = 0,
        this.flip = 0,
        this.grabTime = 0,
        this.trickScore = 0,
        this.score = 0,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.butter = new Pt,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.trick = ``,
        this.notice = ``,
        this.noticeTime = 0,
        this.elapsed = 0,
        this.liftTime = 0,
        this.liftClock = 0,
        this.runs = 0,
        this.crashes = 0,
        this.cabinIndex = 0,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.previousSteer = 0,
        this.corkSet = !1,
        this.railPitchHeld = 0,
        this.rollVelocity = 0,
        this.airRotation = or(),
        this.airOrientation = this.airRotation.orientation,
        this.landingAssist = new ar,
        this.airLevel = new sr,
        this.groundTarget = new g,
        this.poleProgressZ = 14,
        this.pipePopBuffer = 0,
        this.pipeScoredZ = -1 / 0,
        this.pipeTakeoffZ = -1 / 0,
        this.pipeShare = 1,
        this.pipeSameSpot = !1,
        this.pipeRecentAirs = [],
        this.pipeSpot = new Qn,
        this.landingUp = new h,
        this.landingNormal = new h,
        this.stanceTurn = new g,
        this.landingSettling = !1,
        this.ragdoll = new gr(A,Ie.snowWalls),
        this.crashDuration = 0,
        this.crashSeverity = 0,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.crashTime = 0,
        this.landing = 0,
        this.landingImpact = 0,
        this.landingBoost = 0,
        this.crouch = 0,
        this.grind = !1,
        this.jumpHeld = !1,
        this.charge = 0,
        this.topSpeed = 0,
        this.skid = 0,
        this.skidSide = 1,
        this.polePhase = 0,
        this.poling = 0,
        this.takeoffKick = 0,
        this.jumpDistance = 0,
        this.lastJumpDistance = 0,
        this.recoveryPushTime = 0,
        this.event = ``,
        this.rail = null,
        this.railT = 0,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.barSave = null,
        this.railHops = [],
        this.railHopPoints = 0,
        this.railTarget = null,
        this.railSteer = 0,
        this.railPresses = 0,
        this.chain = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.airRepeatKey = ``,
        this.chainRepeatKeys = [],
        this.trickTally = new Map,
        this.repeat = 0,
        this.lost = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.board = !1,
        this.airSource = `jump`,
        this.airGrid = en
    }
    collideWithSnow() {
        if (!Ie.snowWalls || this.rail || this.crashTime > 0)
            return !1;
        let e = fr(A, this.collisionStart, this) ?? (this.airborne && this.vy < 0 ? fr(A, this, this) : null);
        if (!e)
            return !1;
        let t = a.hypot(this.velocityX, this.velocityZ)
          , n = a.max(0, -this.velocityX * e.nx - this.velocityZ * e.nz);
        this.x = e.x,
        this.z = e.z,
        this.airborne || (this.y = A(this.x, this.z)),
        this.velocityX += e.nx * n,
        this.velocityZ += e.nz * n;
        let r = _r(n, t);
        return r === `fall` || r === `crash` ? (this.landingImpact = n,
        this.beginCrash(n, !1, r),
        !0) : (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && (this.landingSpin = O((e.nx * a.cos(this.heading) - e.nz * a.sin(this.heading)) * n / 16, -.8, .8),
        this.landingFlip = O(-(e.nx * a.sin(this.heading) + e.nz * a.cos(this.heading)) * n / 20, -.6, .6)),
        !1)
    }
    leaveSnowEdge(e) {
        if (!Ie.snowWalls)
            return;
        let t = pr(A, this.collisionStart, this);
        if (!t)
            return;
        let n = a.hypot(this.velocityX, this.velocityZ);
        this.y = this.collisionStart.y;
        let r = a.cos(this.heading)
          , i = a.sin(this.heading)
          , o = Ln(t.dx * i + t.dz * r, this.spin, this.edge, new g, t.dx * r - t.dz * i);
        this.takeoff(t.grade * n, n, `ground`, o),
        this.takeoffKick = 0,
        this.railPitchHeld = Number(e.forward) | Number(e.brake) << 1,
        this.charge = 0
    }
    collideWithPark() {
        if (!this.collisions || this.rail || this.crashTime > 0)
            return !1;
        this.collisionEnd.set(this.x, this.y, this.z),
        this.collisionVelocity.set(this.velocityX, this.airborne ? this.vy : 0, this.velocityZ);
        let e = this.collisionVelocity.length()
          , t = this.airborne ? -1 : et.findIndex(e => {
            let t = Hr(e, this.x, this.z)
              , n = Br(e);
            return e.entry === `ride` && t.t >= -.7 / e.length && t.t < 0 && a.abs(t.side) < e.width / 2 + .1 && this.y >= qr(e, 0) - .65 && this.velocityX * a.sin(n) + this.velocityZ * a.cos(n) > 0
        }
        )
          , n = this.collisions.move(this.collisionStart, this.collisionEnd, this.collisionVelocity, this.collisionOffsets, .27, t >= 0 ? `rail-${t}` : ``);
        if (!n.touched)
            return !1;
        this.x = this.collisionEnd.x,
        this.y = this.collisionEnd.y,
        this.z = this.collisionEnd.z,
        this.velocityX = this.collisionVelocity.x,
        this.velocityZ = this.collisionVelocity.z,
        this.airborne && (this.vy = this.collisionVelocity.y);
        let r = _r(n.impact, e);
        if (r === `fall` || r === `crash`)
            return this.landingImpact = n.impact,
            this.beginCrash(n.impact, !1, r),
            this.notice = `BAIL`,
            !0;
        if (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && !this.airborne) {
            let e = n.normal.x * a.cos(this.heading) - n.normal.z * a.sin(this.heading)
              , t = n.normal.x * a.sin(this.heading) + n.normal.z * a.cos(this.heading);
            this.landingSpin = O(e * n.impact / 16, -.8, .8),
            this.landingFlip = O(-t * n.impact / 20, -.6, .6)
        }
        return !1
    }
    get trickEvent() {
        let e = this.event;
        if (!e || e === `arrive`)
            return null;
        let t = e === `land` && !this.rail || e === `butter`;
        return {
            t: this.elapsed,
            kind: e,
            text: e === `crash` || t ? this.notice : this.chain.length ? this.trick : ``,
            score: e === `crash` ? this.lost : t ? this.lastScore : 0,
            impact: this.landingImpact
        }
    }
    toLobby() {
        this.pipePopBuffer = 0,
        this.butter.reset(),
        this.railPitchHeld = 0,
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `intro`,
        this.paused = !1,
        this.crashTime = 0,
        this.recovery = 0,
        this.airborne = !1,
        this.rail = null,
        this.grind = !1,
        this.x = ze(90),
        this.z = 90,
        this.y = A(this.x, this.z),
        this.speed = 0,
        this.vy = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.turnRate = 0,
        this.skid = 0,
        this.crouch = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spin = 0,
        this.flip = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.landingPrepare = 0,
        this.trick = ``,
        this.trickScore = 0,
        this.notice = ``,
        this.noticeTime = 0,
        this.liftTime = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.switchStance = !1,
        this.clearChain()
    }
    boardLift(e) {
        if (this.butter.reset(),
        !(this.phase !== `intro` && this.phase !== `finished`)) {
            if (this.phase = `gondola`,
            this.liftTime = 0,
            this.speed = 0,
            this.paused = !1,
            this.liftClock = e ?? 0,
            this.cabinIndex = 0,
            e !== void 0) {
                let t = 1 / 0;
                for (let n = 0; n < 6; n++) {
                    let r = Di(e, n);
                    r.up && r.p < t && (t = r.p,
                    this.cabinIndex = n)
                }
            }
            this.airborne = !1,
            this.grind = !1,
            this.spin = 0,
            this.flip = 0,
            this.edge = 0,
            this.crouch = 0,
            this.placeOnTow()
        }
    }
    placeOnTow() {
        let e = Di(this.liftClock, this.cabinIndex)
          , t = Di(this.liftClock + .03, this.cabinIndex);
        this.z = e.z,
        this.x = Ei(e.z, e.lane),
        this.y = A(this.x, this.z),
        this.heading = a.atan2(Ei(t.z, t.lane) - this.x, t.z - this.z),
        this.travelHeading = this.heading,
        this.speed = 805 / 161
    }
    arrive() {
        Object.assign(this, new e, {
            liftClock: this.liftClock,
            liftTime: this.liftTime,
            cabinIndex: this.cabinIndex,
            runs: this.runs,
            collisions: this.collisions
        }),
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `skiing`,
        this.z = 14,
        this.x = -2,
        this.y = A(this.x, 14),
        this.speed = 3,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = a.atan(Be(14)),
        this.travelHeading = this.heading,
        this.edge = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.pipeScoredZ = -1 / 0,
        this.pipeTakeoffZ = -1 / 0,
        this.pipeShare = 1,
        this.pipeRecentAirs = [],
        this.elapsed = 0,
        this.score = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.crashes = 0,
        this.crashTime = 0,
        this.landingImpact = 0,
        this.landing = 0,
        this.landingBoost = 0,
        this.switchStance = !1,
        this.trick = ``,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.topSpeed = 0,
        this.spin = 0,
        this.flip = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.charge = 0,
        this.jumpHeld = !1,
        this.skid = 0,
        this.poling = 0,
        this.polePhase = 0,
        this.lastJumpDistance = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.trickTally.clear(),
        this.lost = 0,
        this.notice = `FIND YOUR LINE`,
        this.noticeTime = 3,
        this.event = `arrive`
    }
    fastTravel() {
        if (this.phase !== `gondola` || this.paused)
            return;
        let e = (1 - Di(this.liftClock, this.cabinIndex).p) * 161;
        this.liftClock += e,
        this.liftTime += e,
        this.arrive()
    }
    recover() {
        this.pipePopBuffer = 0,
        this.butter.reset(!0),
        this.lastScoreFactors = null,
        this.phase === `skiing` && (this.railPitchHeld = 0,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.x = ze(this.z),
        this.y = A(this.x, this.z),
        this.vy = 0,
        this.lateral = 0,
        this.speed = 5,
        this.airborne = !1,
        this.spin = 0,
        this.flip = 0,
        this.crashTime = 0,
        this.skid = 0,
        this.travelHeading = a.atan(Be(this.z)),
        this.heading = this.travelHeading,
        this.edge = 0,
        this.turnRate = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.notice = `BACK ON TRACK`,
        this.noticeTime = 2)
    }
    rideOutButter() {
        let e = Lr(this.x, this.z, this.heading);
        this.butter.release(this, Ln(e.slope, this.spin, this.edge, this.airOrientation, e.crossSlope)),
        this.flipTightness = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.spinWindup = 0;
        let t = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length
          , n = a.round(this.butter.entryPoints * ge(t));
        this.butter.entryPoints = 0,
        !(n <= 0) && (this.lastScore = n,
        this.score += n,
        this.runScore.tricks += n,
        this.trickTally.set(`BUTTER`, (this.trickTally.get(`BUTTER`) ?? 0) + 1),
        n > this.bestCombo && (this.bestCombo = n,
        this.bestTrick = this.butter.entry),
        this.notice = `STOMPED. ${this.butter.entry}`,
        this.noticeTime = 3,
        this.event = `butter`)
    }
    takeoff(e, t=this.speed, n=`jump`, r) {
        this.railPitchHeld = 0;
        let i = Lr(this.x, this.z, this.heading, this.grind)
          , o = this.landingSettling ? this.airOrientation.clone() : r ?? Ln(i.slope, this.spin, this.edge, new g, i.crossSlope)
          , s = this.butter.launch(this, o);
        this.speed = t,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.pipeSpot.reset(),
        this.pipePopBuffer = 0;
        let c = Ye(this.z) > 0 && a.abs(this.x) < Pe + .1;
        this.pipeTakeoffZ = c ? this.z : -1 / 0,
        this.pipeShare = c ? Fn(this.z, this.pipeScoredZ) : 1,
        this.airborne = !0,
        this.vy = e + s.pop,
        this.airTime = 0,
        this.spin = 0,
        this.flip = 0,
        this.corkSet = !1,
        this.airRotation.reset(0, 0, o),
        this.rollVelocity = 0,
        this.landingAssist.reset(),
        this.landingSettling = !1,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.spinVelocity = s.spin,
        this.flipVelocity = s.flip,
        this.velocityZ = this.speed * a.cos(this.travelHeading),
        this.velocityX = this.speed * a.sin(this.travelHeading),
        this.grabTime = 0,
        this.grabLedger.reset(),
        this.scoreFactors = null,
        this.maxAir = 0,
        this.jumpDistance = 0,
        this.trickScore = this.projectChain(0, 0, 0, 0),
        this.trick = this.chainText(``),
        this.event = `jump`,
        this.takeoffKick = 1,
        this.airSource = n,
        this.airGrid = en,
        this.rail = null,
        this.grind = !1,
        this.lost = 0
    }
    mountRail(e, t, n, r=0) {
        this.butter.reset(),
        this.landingSettling = !1,
        this.landingAssist.reset();
        let i = Br(e)
          , o = a.atan2(a.sin(this.travelHeading - i), a.cos(this.travelHeading - i))
          , s = a.atan2(a.sin(n - i), a.cos(n - i));
        this.spin = 0,
        this.spinTightness = 0,
        this.rail = e,
        this.railT = O(t, 0, 1),
        this.grind = !0,
        this.airborne = !1,
        this.vy = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.railHops = [],
        this.railHopPoints = 0,
        this.railSpinVelocity = r,
        this.railTarget = null,
        this.railPresses = 0,
        this.railSpin = s,
        this.railSpinTravel = 0,
        this.switchStance = !1,
        this.skid = 0,
        this.charge = 0,
        this.speed = a.max(9, this.speed * a.max(.35, a.cos(o))),
        this.travelHeading = this.heading = i,
        this.velocityX = this.speed * a.sin(i),
        this.velocityZ = this.speed * a.cos(i);
        let c = Vr(e, this.railT);
        this.x = c.x,
        this.z = c.z,
        this.y = qr(e, this.railT)
    }
    chainText(e) {
        return [...this.chain, e].filter(Boolean).join(` → `)
    }
    railName() {
        return [this.railSwaps ? `RAIL ${this.railSwaps * 90}` : `RAIL SLIDE`, ...this.railHops].join(` + `)
    }
    barPoints() {
        return Oe(this.railTime, this.railSwaps) + this.railHopPoints
    }
    hopValue(e) {
        let t = this.airRotation.judge.result(!1, !0, tn).rotations;
        if (t < 90 || e.length >= 2)
            return null;
        let n = `HOP ${t}`
          , r = (this.trickTally.get(n) ?? 0) + this.chainRepeatKeys.filter(e => e === n).length;
        return {
            name: n,
            points: a.round(t / 90 * 450 * he(r))
        }
    }
    projectChain(e, t, n, r, i=0) {
        let o = _e(this.chainLinks + r);
        return this.chainButter + i + a.round((this.chainTricks + e) * o) + a.round((this.chainGrabs + t) * o) + a.round((this.chainRails + n) * o)
    }
    pushAirLink() {
        this.chainButter += this.butterPoints,
        this.butterPoints > 0 && this.chainRepeatKeys.push(`BUTTER`),
        this.butter.entryPoints = 0,
        this.chainTricks += a.round(this.airPoints * he(this.repeat)),
        this.chainGrabs += this.grabPoints,
        this.airName && this.chain.push(this.airName),
        this.airIsLink && this.airRepeatKey && this.chainRepeatKeys.push(this.airRepeatKey),
        this.airIsLink && this.chainLinks++,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    pushRailLink() {
        this.chainRails += this.barPoints(),
        this.chain.push(this.railName()),
        this.chainLinks++
    }
    clearChain() {
        this.scoreFactors = null,
        this.chain = [],
        this.chainRepeatKeys = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    judgeAir(e=!1, t=!1) {
        if (!e && this.barSave && Hr(this.barSave.r, this.x, this.z).t <= 1) {
            let e = this.hopValue(this.barSave.railHops)
              , t = this.chain.length - 1;
            this.trick = [...this.chain.slice(0, t), [this.chain[t], ...e ? [e.name] : []].join(` + `)].join(` → `),
            this.trickScore = this.projectChain(0, 0, e?.points ?? 0, 0);
            return
        }
        let n = t || (this.velocityZ > .5 || this.pipeTakeoffZ > -1 / 0) && (this.airSource !== `ground` || this.airTime >= 1.05 && this.maxAir >= 1.3) && this.pipeShare > 0
          , r = this.airRotation.judge.result(this.switchStance, e, t ? tn : this.airGrid, this.board)
          , i = t ? `ON` : this.airSource === `rail` ? `OFF` : ``
          , o = r.name && i ? `${r.name} ${i}` : r.name
          , s = this.grabLedger.namesOn(this.board)
          , c = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length;
        this.butterPoints = a.round(this.butter.entryPoints * ge(c)),
        this.airName = [this.butterPoints > 0 ? this.butter.entry : ``, ...n ? [o, ...s] : []].filter(Boolean).join(` + `);
        let l = Ee({
            airTime: this.airTime,
            maxAir: this.maxAir,
            ...r,
            switchStance: this.switchStance
        });
        this.airRepeatKey = n ? (r.type && i ? `${r.type} ${i}` : r.type) || `STRAIGHT AIR` : ``,
        this.repeat = this.airRepeatKey ? this.pipeRecentAirs.filter(e => e === this.airRepeatKey).length + this.chainRepeatKeys.filter(e => e === this.airRepeatKey).length : 0,
        this.airPoints = n ? a.round(l.total * this.pipeShare) : 0,
        this.grabPoints = n ? a.round(De(this.grabLedger.time, s.length, l.rotation, he(this.repeat), this.grabLedger.longest) * this.pipeShare) : 0,
        this.airIsLink = n && (this.airTime >= .5 || o !== `` || s.length > 0),
        this.scoreFactors = n ? {
            turns: l.turns,
            grabs: s.length,
            grabMultiplier: Ce(s.length, this.grabLedger.longest),
            lineMultiplier: _e(this.chainLinks + +!!this.airIsLink),
            offAxis: r.offAxis,
            switchStance: this.switchStance,
            flips: l.flips,
            pipe: this.pipeShare
        } : null,
        this.trickScore = this.projectChain(a.round(this.airPoints * he(this.repeat)), this.grabPoints, 0, +!!this.airIsLink, this.butterPoints),
        this.trick = this.trickScore > 0 ? this.chainText(this.airName) : ``,
        this.pipeSameSpot = this.pipeShare === 0 && (!!r.name || s.length > 0)
    }
    landOnRail(e=!1) {
        let t = a.abs(this.flipVelocity) > .1;
        for (let n of et) {
            let r = Hr(n, this.x, this.z)
              , i = r.t * n.length
              , o = n.entry === `pop`;
            if (i < (o ? -.45 : 0) || r.t > 1 || a.abs(r.side) > n.width / 2 + .5)
                continue;
            let s = qr(n, r.t);
            if (e && (n.popLaunch === `ballistic` || n.popLaunch === `manual`) || (e ? !o || i > 3 || t || this.y > s + .1 || this.y < s - .35 : this.y > s + .05 || this.y < s - (o && i < 3 ? .35 : .75)))
                continue;
            if (this.airRotation.upright < .45)
                return this.landingImpact = a.max(2, -this.vy),
                this.beginCrash(this.landingImpact),
                !0;
            let c = this.heading + this.airRotation.landingYaw + (this.switchStance ? a.PI : 0);
            return this.barSave?.r === n ? (this.resumeBar(n, r.t, c),
            !0) : (this.judgeAir(!0, !0),
            this.pushAirLink(),
            this.landedJumps++,
            this.totalAirTime += this.airTime,
            this.lastJumpDistance = this.jumpDistance,
            this.landingImpact = 0,
            this.landing = .6,
            this.mountRail(n, r.t, c, this.spinVelocity),
            this.event = `land`,
            this.spin = 0,
            this.flip = 0,
            this.rollVelocity = 0,
            this.trick = this.chainText(this.railName()),
            this.trickScore = this.projectChain(0, 0, 0, 0),
            this.flipVelocity = 0,
            this.flipTightness = 0,
            this.spinVelocity = 0,
            this.spinTightness = 0,
            this.landingPrepare = 1,
            !0)
        }
        return !1
    }
    resumeBar(e, t, n) {
        let r = this.barSave;
        this.barSave = null,
        this.chain.pop(),
        this.chainLinks--,
        this.chainRails -= r.rails;
        let i = this.hopValue(r.railHops)
          , a = this.airTime;
        this.mountRail(e, t, n, this.spinVelocity),
        this.railTime = r.railTime + a,
        this.railPresses = r.railPresses,
        this.railSpinTravel = r.railSpinTravel,
        this.railSwaps = r.railSwaps,
        this.railHops = i ? [...r.railHops, i.name] : r.railHops,
        this.railHopPoints = r.railHopPoints + (i?.points ?? 0),
        i && this.chainRepeatKeys.push(i.name),
        this.landing = .3,
        this.landingImpact = 0,
        this.event = ``,
        this.spin = 0,
        this.flip = 0,
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipTightness = 0,
        this.spinVelocity = 0,
        this.spinTightness = 0,
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, this.barPoints(), 1)
    }
    shiftAcross(e, t) {
        let n = Br(e);
        this.x += a.cos(n) * t,
        this.z -= a.sin(n) * t
    }
    funnelToRail(e, t) {
        for (let n of et) {
            if (n.entry !== `ride`)
                continue;
            let r = Hr(n, this.x, this.z)
              , i = r.t * n.length
              , o = Yr(n);
            if (i < -o || i >= 0 || a.abs(r.side) > 1.5)
                continue;
            let s = Wi(this.travelHeading, Br(n));
            if (a.abs(s) > zi || this.speed < 4 || t.steer * a.sign(r.side) > .3)
                return;
            let c = k((i + o) / o);
            this.shiftAcross(n, -a.sign(r.side) * a.min(a.abs(r.side), Bi * c * this.speed * e)),
            this.travelHeading -= s * (1 - a.exp(-3 * c * e));
            return
        }
    }
    funnelInAir(e) {
        for (let t of et) {
            let n = Hr(t, this.x, this.z)
              , r = n.t * t.length
              , i = t.entry === `pop` && r >= -ei(t) && r <= 3;
            if (n.t < -.02 && !i || n.t > 1 || a.abs(n.side) > 1)
                continue;
            let o = this.y - qr(t, O(n.t, 0, 1));
            if (!(!i && (this.vy >= 0 || o < -.2 || o > -this.vy * .45)) && !(a.abs(Wi(this.travelHeading, Br(t))) > Vi)) {
                this.shiftAcross(t, -a.sign(n.side) * a.min(a.abs(n.side), Hi * e));
                return
            }
        }
    }
    popOffKicker(e, t, n) {
        for (let n of et) {
            if (n.entry !== `pop` || n.popLaunch === `manual` || this.speed < 5)
                continue;
            let r = Hr(n, this.x, this.z)
              , i = ei(n);
            if (Hr(n, e, t).t * n.length >= -i || r.t * n.length < -i || ai(n).height * k((3.2 - a.abs(r.side)) / 1.6) < .4)
                continue;
            let o = Br(n)
              , s = Vr(n, -i / n.length)
              , c = {
                x: s.x + a.cos(o) * r.side,
                z: s.z - a.sin(o) * r.side
            }
              , l = a.hypot(this.velocityX, this.velocityZ)
              , u = l * a.max(.2, a.cos(Wi(this.travelHeading, o)))
              , d = (qr(n, .1) - qr(n, 0)) / (.1 * n.length)
              , f = A(c.x, c.z)
              , p = a.max(.3, -r.t * n.length)
              , m = qr(n, 0) - d * p - f
              , h = p / a.max(u, 1)
              , _ = a.max(a.sqrt(2 * ni * (m + Qr)), (m - .1) / h + ni * h / 2)
              , v = n.popLaunch === `ballistic`
              , y = (n.popAngle ?? 24) * a.PI / 180
              , b = v ? this.speed * a.cos(y) : l
              , x = v ? this.speed * a.sin(y) : _ + d * u;
            this.y = f,
            this.takeoff(x, b, `jump`, Ln(x / b, this.spin, this.edge, new g, 0)),
            this.charge = 0;
            return
        }
    }
    slide(e, t) {
        let n = this.rail
          , r = Br(n);
        this.grind = !0,
        this.railTime += e;
        let i = O(this.railT, 0, 1)
          , o = a.max(0, i - .02)
          , s = a.min(1, i + .02)
          , c = (qr(n, s) - qr(n, o)) / ((s - o) * n.length);
        this.speed = a.max(9, this.speed - ji * c / a.hypot(1, c) * e),
        this.railT += this.speed * e / n.length;
        let l = O(this.railT, 0, 1)
          , u = Vr(n, l);
        this.x = u.x,
        this.z = u.z,
        this.y = qr(n, l),
        this.travelHeading = this.heading = r,
        this.velocityX = this.speed * a.sin(r),
        this.velocityZ = this.speed * a.cos(r),
        this.turnRate = 0,
        this.lateral = 0,
        this.skid = 0;
        let d = a.abs(t.steer) > .06 ? O(t.steer, -1, 1) : 0
          , f = a.sign(d);
        f && f !== this.railSteer && this.railPresses < 2 && (this.railPresses++,
        this.railTarget = (this.railTarget ?? a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2)) + f * a.PI / 2),
        this.railSteer = f;
        let p;
        if (this.railTarget !== null) {
            let t = this.railTarget - this.railSpin;
            p = a.sign(t) * a.min(a.abs(t), Ai * e),
            this.railSpinVelocity = p / e,
            a.abs(t - p) < 1e-6 && (this.railTarget = null,
            this.railSpinVelocity = 0)
        } else
            this.railSpinVelocity = xr(this.railSpinVelocity, 0, 1.65, e),
            p = this.railSpinVelocity * e;
        if (this.railSpin += p,
        this.railSpinTravel += a.abs(p),
        this.railTarget === null && a.abs(this.railSpinVelocity) < .45) {
            let t = a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2);
            this.railSpin = xr(this.railSpin, t, 4.8, e)
        }
        let m = a.floor((this.railSpinTravel + .12) / (a.PI / 2));
        m > this.railSwaps && (this.railSwaps = a.min(m, 2)),
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, this.barPoints(), 1),
        this.scoreFactors = {
            turns: 0,
            grabs: 0,
            grabMultiplier: 1,
            lineMultiplier: _e(this.chainLinks + 1),
            offAxis: !1,
            switchStance: !1
        },
        t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
        !t.jump && this.jumpHeld ? this.dismount(4.6 + this.charge * 3.4, !0, t) : this.railT >= 1 && this.dismount(.5, !1, t)
    }
    dismount(e, t, n) {
        let r = this.rail
          , i = this.railSpin
          , o = this.railSpinVelocity
          , s = O(this.railT, 0, 1)
          , c = .02
          , l = (qr(r, a.min(1, s + c)) - qr(r, a.max(0, s - c))) / ((a.min(1, s + c) - a.max(0, s - c)) * r.length);
        this.barSave = {
            r,
            railTime: this.railTime,
            railSwaps: this.railSwaps,
            railSpinTravel: this.railSpinTravel,
            railPresses: this.railPresses,
            railHops: this.railHops,
            railHopPoints: this.railHopPoints,
            rails: this.barPoints()
        },
        this.pushRailLink(),
        this.rail = null,
        this.grind = !1;
        let u = Ln(l, i, 0, new g);
        this.takeoff(this.speed * l + e, this.speed, `rail`, u),
        this.airGrid = a.abs(a.round(i / (a.PI / 2))) % 2 ? nn : en,
        this.airRotation.reset(0, i, u),
        this.spinVelocity = o,
        this.charge = 0,
        t || (this.event = `dismount`,
        this.railPitchHeld = Number(n.forward) | Number(n.brake) << 1)
    }
    faceplant() {
        Nt(this.airOrientation),
        this.beginCrash(this.landingImpact),
        this.notice = `FACEPLANT`
    }
    beginCrash(e, t=!1, n) {
        if (this.pipePopBuffer = 0,
        this.crashTime > 0)
            return;
        this.equipmentDetached = !1,
        this.lastScoreFactors = null,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.crashSeverity = O(n ? e / 42 * .8 + a.max(0, this.y - A(this.x, this.z)) / 45 * .2 : this.speed / 43 * .35 + e / 42 * .45 + this.maxAir / 45 * .2, .12, 1);
        let r = n ? n === `fall` : !t && e < 16 && this.maxAir < 5.5 && this.speed < 27;
        this.crashDuration = r ? .8 + this.crashSeverity * .4 : 1.35 + this.crashSeverity * 1.35,
        this.crashTime = this.crashDuration,
        this.recovery = 0,
        this.ragdoll.start(this.x, this.y, this.z, this.heading, this.spin + (this.switchStance ? a.PI : 0), this.flip, this.velocityX, this.velocityZ, e, this.flipVelocity, this.spinVelocity, this.airOrientation, this.switchStance ? a.PI : 0, t, r),
        this.crashes++,
        this.airborne = !1,
        this.landing = 0,
        this.landingBoost = 0,
        this.event = `crash`,
        this.rail = null,
        this.grind = !1,
        this.lost = this.trickScore,
        this.notice = t ? `LANDED FLAT` : `BAIL`,
        this.noticeTime = this.crashDuration,
        this.trick = ``,
        this.trickScore = 0,
        this.clearChain()
    }
    updateCrash(e) {
        this.ragdoll.collisions = this.collisions,
        this.crashTime = a.max(0, this.crashTime - e),
        this.recovery = 1 - O(this.crashTime / (this.ragdoll.gentle ? .45 : .6), 0, 1),
        this.ragdoll.update(e, this.crashTime < (this.ragdoll.gentle ? .55 : .75)),
        this.equipmentDetached = this.crashTime > 0 && this.ragdoll.shedsEquipment;
        let t = this.ragdoll.nodes.Hips.p
          , n = O(t.z, -22, 805)
          , r = O(t.x, ze(n) - 123, ze(n) + 123);
        this.ragdoll.translate(r - t.x, n - t.z),
        this.x = r,
        this.z = n,
        this.y = A(r, n),
        this.velocityX = this.ragdoll.velocity.x,
        this.velocityZ = this.ragdoll.velocity.z,
        this.speed = a.min(Ie.maxSpeed, a.hypot(this.velocityX, this.velocityZ)),
        this.speed > 1.5 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        this.crashTime === 0 && (this.speed = O(this.speed, 4, this.ragdoll.gentle ? 32 : 23),
        this.vy = 0,
        this.spin = 0,
        this.flip = 0,
        this.edge = 0,
        this.skid = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.switchStance = !1,
        this.heading = this.travelHeading,
        this.recovery = 0,
        this.crouch = .5,
        this.poling = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.polePhase = 0,
        this.recoveryPushTime = 6,
        this.velocityX = a.sin(this.travelHeading) * this.speed,
        this.velocityZ = a.cos(this.travelHeading) * this.speed,
        this.notice = `BACK ON YOUR FEET`,
        this.noticeTime = 2)
    }
    update(e, t) {
        let n = a.max(1, a.ceil(e * 120))
          , r = e / n
          , i = ``;
        for (let e = 0; e < n; e++)
            this.pipeStep(r, t),
            this.event && (i = this.event);
        this.event = i
    }
    pipeStep(e, t) {
        if (this.board = !!t.board,
        this.event = ``,
        !this.airborne && !this.grind && (this.barSave = null),
        this.grind || (this.railSteer = a.abs(t.steer) > .06 ? a.sign(t.steer) : 0),
        this.crashTime <= 0 && (this.equipmentDetached = !1),
        this.paused)
            return;
        if (this.liftClock += e,
        this.noticeTime = a.max(0, this.noticeTime - e),
        this.landing = a.max(0, this.landing - e * 3.4),
        this.landingBoost = a.max(0, this.landingBoost - e),
        this.takeoffKick = a.max(0, this.takeoffKick - e * 4),
        this.phase === `gondola`) {
            this.liftTime += e,
            this.placeOnTow(),
            Di(this.liftClock, this.cabinIndex).p >= .999999999 && this.arrive();
            return
        }
        if (this.phase !== `skiing`)
            return;
        if (this.railPitchHeld &= Number(t.forward) | Number(t.brake) << 1,
        this.poleProgressZ = a.max(this.poleProgressZ, this.z),
        this.elapsed += e,
        this.crashTime > 0) {
            this.butter.reset(),
            this.updateCrash(e);
            return
        }
        this.recoveryPushTime = this.speed >= 18 ? 0 : a.max(0, this.recoveryPushTime - e),
        this.pipePopBuffer > 0 && (this.pipePopBuffer = this.airborne || !Rn(this.x, this.z, this.velocityX) ? 0 : a.max(0, this.pipePopBuffer - e),
        this.pipePopBuffer === 0 && (this.charge = 0));
        let n = this.airborne;
        this.landingSpin = xr(this.landingSpin, 0, 5, e),
        this.landingFlip = xr(this.landingFlip, 0, 5, e);
        let r = this.butter.step(this, t, e, !this.airborne && (t.butter || this.butter.active) ? Ir(this.x, this.z, this.travelHeading) : 0);
        this.butter.ready && !this.rail && this.rideOutButter();
        let i = !r && t.brake && !this.airborne && !this.rail;
        this.forwardHeld = !r && t.forward && !this.airborne && !this.rail && !i ? this.forwardHeld + e : 0,
        this.tucking = !r && t.forward && !this.airborne && !this.rail && !i && (this.switchStance || this.forwardHeld >= 1.25 || this.speed >= 18),
        this.crouch = xr(this.crouch, !this.airborne && (this.tucking || t.jump) ? 1 : 0, 9, e),
        a.abs(t.steer) > .15 && (this.skidSide = a.sign(t.steer)),
        this.skid = xr(this.skid, i ? this.skidSide * O(this.speed / 9, 0, 1) : 0, 7, e);
        let o = !r && a.abs(t.steer) > .05 ? O(t.steer, -1, 1) : 0;
        this.carveTransfer *= a.exp(-6 * e),
        !this.airborne && !i && this.previousSteer * o < 0 && (this.carveTransfer = a.abs(this.edge) * O(this.speed / 18, 0, 1)),
        this.previousSteer = this.airborne || !o && a.abs(this.edge) < .1 ? 0 : o || this.previousSteer;
        let s = O(13 / a.max(this.speed, 1), .45, 1)
          , l = o ? (11 + this.carveTransfer * 11) * s : 9
          , u = k((1 - this.landing) / .68);
        this.edge = xr(this.edge, !this.airborne && !this.rail ? o * u : 0, l, e);
        let d = !r && t.forward && !this.switchStance && !this.tucking && !this.airborne && !this.rail && !i && !t.jump;
        if (this.poling = xr(this.poling, +!!d, 12, e),
        this.airborne)
            this.velocityX *= a.exp(-.003 * e),
            this.velocityZ *= a.exp(-.003 * e),
            this.speed = a.hypot(this.velocityX, this.velocityZ),
            this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
            this.turnRate = 0,
            this.lateral = 0;
        else if (this.landingSettling && !this.rail && !r && (this.spinVelocity += (-100 * this.spin - 20 * this.spinVelocity) * e,
        this.spin += this.spinVelocity * e),
        r || (this.spinWindup = xr(this.spinWindup, 0, 10, e),
        this.spinTightness = xr(this.spinTightness, 0, 14, e)),
        this.landingPrepare = this.butter.active ? -1 : 0,
        dt(this.x, this.z)) {
            pt(this, e, i, this.carveTransfer);
            let t = this.speed;
            if (d) {
                let t = this.polePhase;
                if (this.polePhase = (this.polePhase + e / .95) % 1,
                t < .34 && this.polePhase >= .34) {
                    let e = a.cos(this.travelHeading) < 0 ? 1 - k((this.poleProgressZ - this.z - 8) / 8) : 1;
                    this.speed = a.min(Ie.maxSpeed, this.speed + e * 1.65 * O(1 - this.speed / 52, .25, 1)),
                    this.recoveryPushTime > 0 && (this.speed += e * a.min(3, a.max(0, 13 - this.speed))),
                    this.recoveryPushTime = 0
                }
            } else
                this.poling < .02 && (this.polePhase = 0);
            let n = t > .001 ? this.speed / t : 1;
            this.velocityX *= n,
            this.velocityZ *= n
        } else {
            let t = Ve(this.x, this.z) > 24 && gi(this.x, this.z) < .5
              , n = this.edge * (.8 + O(this.speed / 85, 0, .44)) * (1 + this.carveTransfer * .14) * (i ? .7 : 1);
            this.turnRate = this.rail ? 0 : n,
            this.travelHeading += this.turnRate * e,
            r && (this.travelHeading += At(Ir(this.x, this.z, this.travelHeading + a.PI / 2), this.speed, 9.81 * 1.7) * e);
            let o = Ir(this.x, this.z, this.travelHeading);
            if (Ye(this.z) > 0 && a.abs(this.x) >= Pe && a.abs(this.x) < Pe + 2) {
                let e = ft(this.x, this.z);
                o = e.x * a.sin(this.travelHeading) + e.z * a.cos(this.travelHeading)
            }
            if (Ie.snowWalls && o < -1) {
                let e = {
                    x: this.x + a.sin(this.travelHeading) * .5,
                    y: this.y,
                    z: this.z + a.cos(this.travelHeading) * .5
                }
                  , t = pr(A, this, e);
                t && (o = t.grade)
            }
            let s = -o
              , c = (this.tucking ? .0024 : .0028) * (t ? 1.38 : 1)
              , l = 9.81 * a.sin(a.atan(s)) * 1.7 - .13 - c * this.speed * this.speed - a.abs(this.edge) * .38;
            if (this.rail || (this.speed = O(this.speed + (l - (i ? 17 : 0)) * e, 0, Ie.maxSpeed)),
            d) {
                let t = this.polePhase;
                if (this.polePhase = (this.polePhase + e / .95) % 1,
                t < .34 && this.polePhase >= .34) {
                    let e = a.cos(this.travelHeading) < 0 ? 1 - k((this.poleProgressZ - this.z - 8) / 8) : 1;
                    this.speed = a.min(Ie.maxSpeed, this.speed + e * 1.65 * O(1 - this.speed / 52, .25, 1)),
                    this.recoveryPushTime > 0 && (this.speed += e * a.min(3, a.max(0, 13 - this.speed))),
                    this.recoveryPushTime = 0
                }
            } else
                this.poling < .02 && (this.polePhase = 0);
            let u = this.skid * this.speed * .1
              , f = this.speed / a.hypot(1, o);
            this.velocityZ = f * a.cos(this.travelHeading) - u * a.sin(this.travelHeading),
            this.velocityX = f * a.sin(this.travelHeading) + u * a.cos(this.travelHeading),
            this.lateral = this.edge * this.speed * .35 + u
        }
        this.topSpeed = a.max(this.topSpeed, this.speed * 3.6);
        let p = a.atan2(a.sin(this.travelHeading + this.skid * .72 - this.heading), a.cos(this.travelHeading + this.skid * .72 - this.heading));
        if (!this.airborne) {
            let t = p * (1 - a.exp(-12 * e));
            this.landingSettling && this.airOrientation.premultiply(this.stanceTurn.set(0, a.sin(-t / 2), 0, a.cos(t / 2))),
            this.heading += t
        }
        let m = this.x
          , h = this.z;
        this.collisionStart.set(this.x, this.y, this.z),
        this.x += this.velocityX * e,
        this.z += this.velocityZ * e,
        this.z = a.max(-22, this.z);
        let _ = ze(this.z);
        if (a.abs(this.x - _) > 86) {
            let t = a.sign(this.x - _);
            this.x = _ + t * 86;
            let n = this.velocityX - Be(this.z) * this.velocityZ;
            t * n > 0 && (this.velocityX -= n,
            this.speed *= a.exp(-e * 2.8))
        }
        if (!this.airborne && !this.rail && this.funnelToRail(e, t),
        !(!this.airborne && this.collideWithSnow())) {
            if (!this.airborne && !this.rail)
                for (let e of et) {
                    let t = Hr(e, this.x, this.z);
                    if (t.t >= 0 && t.t <= 1 && a.abs(t.side) < e.width / 2 + .35 && this.y >= qr(e, t.t) - .4) {
                        this.mountRail(e, t.t, this.heading + this.spin + (this.switchStance ? a.PI : 0), this.spinVelocity);
                        break
                    }
                }
            if (this.rail)
                this.slide(e, t);
            else if (!this.airborne) {
                for (let e of $e)
                    if (h <= e.z && this.z > e.z && a.abs(this.x - ze(this.z) - e.offset) < e.width / 2 + 1 && this.speed > 7) {
                        let t = ze(this.z) + e.offset
                          , n = a.max(t - e.width / 2 + .6, a.min(t + e.width / 2 - .6, this.x));
                        if (this.y < A(n, e.z - .01) - 1)
                            continue;
                        let r = Dr(e, this.speed, this.charge, this.travelHeading)
                          , i = Lr(n, e.z - .01, this.heading)
                          , o = Ln(i.slope, this.spin, this.edge, new g, i.crossSlope);
                        this.y = A(this.x, e.z - .01),
                        this.takeoff(r.vertical, r.horizontal, `jump`, o),
                        this.velocityX += e.transfer * .22,
                        this.charge = 0;
                        break
                    }
                let n = this.airborne ? null : Bn(this, m, h, this.charge);
                if (n) {
                    this.x = n.x,
                    this.z = n.z,
                    this.y = n.y;
                    let e = a.cos(this.heading)
                      , t = a.sin(this.heading)
                      , r = this.charge
                      , i = Ln(n.gx * t + n.gz * e, this.spin, this.edge, new g, n.gx * e - n.gz * t);
                    this.takeoff(n.vertical, a.hypot(n.velocityX, n.velocityZ), `jump`, i),
                    this.takeoffKick = r,
                    this.velocityX = n.velocityX,
                    this.velocityZ = n.velocityZ,
                    this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
                    this.charge = 0
                }
                let r = this.airborne ? null : zn(this, m, h);
                if (r) {
                    this.x = r.x,
                    this.y = r.y,
                    this.z = r.z;
                    let e = a.cos(this.heading)
                      , n = a.sin(this.heading)
                      , i = Ln(r.gx * n + r.gz * e, this.spin, this.edge, new g, r.gx * e - r.gz * n);
                    this.takeoff(r.vertical, a.hypot(r.velocityX, r.velocityZ), `ground`, i),
                    this.velocityX = r.velocityX,
                    this.velocityZ = r.velocityZ,
                    this.takeoffKick = 0,
                    this.charge = 0,
                    this.railPitchHeld = Number(t.forward) | Number(t.brake) << 1
                }
                if (this.airborne || this.popOffKicker(m, h, t),
                this.airborne || this.leaveSnowEdge(t),
                !this.airborne && (this.y = A(this.x, this.z),
                t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
                !t.jump && this.jumpHeld && Rn(this.x, this.z, this.velocityX) && (this.pipePopBuffer = 2),
                !t.jump && this.jumpHeld && this.pipePopBuffer <= 0)) {
                    let e = Nr(this.x, this.z, this.velocityX, this.velocityZ, this.charge);
                    this.takeoff(e.vertical, a.hypot(e.velocityX, e.velocityZ), `ground`),
                    this.velocityX = e.velocityX,
                    this.velocityZ = e.velocityZ,
                    this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
                    this.charge = 0
                }
            }
            if (!(!this.airborne && this.collideWithPark())) {
                if (this.airborne) {
                    let r = !n;
                    if (r || (this.vy -= ni * e,
                    this.y += this.vy * e,
                    this.airTime += e,
                    this.jumpDistance += a.hypot(this.velocityX, this.velocityZ) * e),
                    this.collideWithSnow())
                        return;
                    if (!r) {
                        let e = Xn(this.collisionStart, this);
                        e && (this.x = e.x,
                        this.y = e.y,
                        this.z = e.z)
                    }
                    let i = A(this.x, this.z)
                      , o = ft(this.x, this.z)
                      , s = this.pipeSpot.update(this)
                      , c = this.y <= i + 1e-6 ? {
                        slope: o.z,
                        crossSlope: o.x
                    } : {
                        slope: s.z,
                        crossSlope: s.x
                    }
                      , l = c ? c.slope : A(this.x, this.z + .5) - A(this.x, this.z - .5)
                      , u = c ? c.crossSlope : A(this.x + .5, this.z) - A(this.x - .5, this.z)
                      , d = l * this.velocityZ + u * this.velocityX
                      , f = this.y <= i + 1e-6 ? 0 : s.time;
                    this.landingPrepare = xr(a.max(0, this.landingPrepare), 1 - k((f - .1) / .45), 14, e);
                    let p = a.abs(t.steer) > .06 ? O(t.steer, -1, 1) : 0
                      , m = Number(t.forward && !(this.railPitchHeld & 1)) - Number(t.brake && !(this.railPitchHeld & 2));
                    this.airRotation.controlPitch(m, this.switchStance && !t.board, this.flipVelocity, this.rollVelocity);
                    let h = a.abs(t.airRoll ?? 0) > .06 ? O(t.airRoll ?? 0, -1, 1) : 0;
                    this.spinTightness = xr(this.spinTightness, a.abs(p), p ? 12 : 10, e),
                    this.airGrab = xr(this.airGrab, +!!t.grab, 12, e);
                    let g = br(ki, br(Ni, Pi, this.airGrab), this.spinTightness)
                      , _ = p * g
                      , v = m * g;
                    this.spinReversal = p * this.spinVelocity < 0 ? .12 : a.max(0, this.spinReversal - e),
                    (!m || a.sign(m) !== this.flipReversal) && (this.flipReversal = 0),
                    m * this.flipVelocity < -.12 && (this.flipReversal = a.sign(m)),
                    a.abs(v - this.flipVelocity) < g * .05 && (this.flipReversal = 0),
                    this.spinVelocity = Ii(this.spinVelocity, _, e, this.spinReversal > 0 || this.flipReversal !== 0, this.flipReversal ? 3.2 : 28),
                    this.flipVelocity = Ii(this.flipVelocity, v, e, this.flipReversal !== 0, 3.2),
                    this.rollVelocity = Ii(this.rollVelocity, h * g, e, h * this.rollVelocity < 0, 5),
                    this.flipReversal && (this.spinVelocity = a.sign(this.spinVelocity) * a.min(a.abs(this.spinVelocity), a.abs(this.flipVelocity)));
                    let y = this.flipReversal ? O(this.spinVelocity / g, -1, 1) : p;
                    this.spinWindup = xr(this.spinWindup, y, p ? 17 : 8, e);
                    let b = this.flipReversal ? O(this.flipVelocity / g, -1, 1) : m;
                    this.flipWindup = xr(this.flipWindup, b, m ? 24 : 9, e),
                    this.flipTightness = xr(this.flipTightness, a.abs(b), m ? 14 : 10, e),
                    !m && a.abs(this.flipVelocity) < .015 && (this.flipVelocity = 0),
                    !p && a.abs(this.spinVelocity) < .015 && (this.spinVelocity = 0),
                    this.spin += this.spinVelocity * e,
                    this.flip += this.flipVelocity * e,
                    !h && a.abs(this.rollVelocity) < .015 && (this.rollVelocity = 0),
                    t.cork && this.airTime <= .25 && (this.corkSet = !0);
                    let x = !!t.cork && this.corkSet;
                    this.airRotation.update(this.flipVelocity, this.spinVelocity, e, x, this.rollVelocity, !!t.over && x);
                    let S = !!(p || m || h || t.grab)
                      , C = u * a.sin(this.heading) + l * a.cos(this.heading)
                      , w = !S && et.some(e => {
                        for (let t of [0, .25, .5, .75]) {
                            let n = Hr(e, this.x + this.velocityX * t, this.z + this.velocityZ * t);
                            if (n.t >= 0 && n.t <= 1 && a.abs(n.side) < e.width / 2 + .7 && this.y >= qr(e, n.t) - .1)
                                return !0
                        }
                        return !1
                    }
                    )
                      , T = a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 ? this.spinVelocity / Fi : 0
                      , ee = this.airRotation.upright > .64 && a.abs(this.airRotation.flipAngle) < .5 && this.airRotation.inversions === 0 && !this.airRotation.corked && !m && !h && !t.cork && a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 && !w
                      , te = t.grab && ee
                      , E = !!(p || m || h)
                      , ne = this.landingAssist.update(e, this.airOrientation, this.airRotation.landingYaw, w ? 0 : C, f, this.airRotation.speed, E || t.grab && !te || this.airTime < .22 && this.vy > 0, w, w ? 0 : u * a.cos(this.heading) - l * a.sin(this.heading), T, te, w ? 0 : Yn(this, this.heading, u, l, f), this.airRotation.spinAngle + T);
                    if (this.airRotation.correct(ne, !1),
                    ee && (a.abs(this.spinVelocity) > .5 || p) && ne.x === 0 && ne.y === 0 && ne.z === 0) {
                        let t = Number.isFinite(f) ? a.max(0, a.min(1, (1.5 - f) / 1.2)) : 0;
                        this.airRotation.correct(this.airLevel.update(e, this.airOrientation, this.airRotation.landingYaw, this.airTime, w ? 0 : C, w ? 0 : u * a.cos(this.heading) - l * a.sin(this.heading), t), !1)
                    }
                    t.grab && (this.grabTime += e),
                    this.grabLedger.update(e, t.grab, t.grabStyle ?? 0, !!t.board),
                    this.maxAir = a.max(this.maxAir, this.y - A(this.x, this.z)),
                    this.judgeAir(),
                    r || this.funnelInAir(e);
                    let re = !r && this.landOnRail(this.vy >= 0);
                    if (!re && this.collideWithPark())
                        return;
                    if (!re && !r && this.y <= i) {
                        this.landingImpact = a.max(0, d - this.vy) / a.hypot(1, u, l),
                        this.y = i,
                        this.airborne = !1,
                        this.landing = 1,
                        this.lastJumpDistance = this.jumpDistance;
                        let e = this.airRotation.landingYaw
                          , t = dt(this.x, this.z)
                          , n = t ? Jn(this, this.heading, this.airOrientation, u, l) : 0
                          , r = t ? a.abs(a.sin(n)) : a.abs(a.sin(e));
                        this.landingNormal.set(-u * a.cos(this.heading) + l * a.sin(this.heading), 1, -u * a.sin(this.heading) - l * a.cos(this.heading)).normalize();
                        let o = this.landingUp.set(0, 1, 0).applyQuaternion(this.airOrientation).dot(this.landingNormal)
                          , s = a.acos(O(o, -1, 1))
                          , c = !this.butter.catchLanding(this, this.airOrientation, this.landingNormal) && o < .25 && (o < 0 || this.landingImpact > 3 || this.airTime > .3)
                          , f = this.landingImpact > 33 && this.airTime > .35
                          , p = c || f ? null : this.butter.landingFor(this)
                          , m = !c && !f && p !== `faceplant`
                          , h = !1;
                        if (m) {
                            this.judgeAir(!0),
                            this.lastScoreFactors = this.scoreFactors;
                            let i = a.round((e + T) / a.PI);
                            a.abs(i) % 2 == 1 && (this.switchStance = !this.switchStance,
                            this.airOrientation.multiply(this.stanceTurn.set(0, 1, 0, 0)));
                            let o = r >= .3 || Cn(this.airOrientation, this.landingNormal)
                              , c = !o && this.airTime > .65
                              , f = c && this.speed > 3 && this.velocityZ > .5 && d < -.15
                              , m = a.max(0, (this.speed * this.speed + this.vy * d) / (a.hypot(this.speed, d) || 1));
                            if (this.speed = O(m * (c ? 1 : .975 - r * .065 - O(s, 0, 1) * .045) + (f ? 2.6 : 0), 0, Ie.maxSpeed),
                            this.landingBoost = f ? 2.2 : 0,
                            dt(this.x, this.z)) {
                                let e = Vn(this, u, l)
                                  , t = c && d < -.15 ? 2.6 * this.pipeShare : 0
                                  , n = a.min(1 + t / a.max(.001, e.speed), Ie.maxSpeed / a.max(.001, e.speed));
                                this.velocityX = e.x * n,
                                this.velocityZ = e.z * n,
                                this.speed = e.speed * n,
                                this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
                                this.landingBoost = t ? 2.2 : 0
                            }
                            this.pushAirLink();
                            let g = _e(this.chainLinks)
                              , _ = o ? pe(r) : 1;
                            _ < 1 && this.lastScoreFactors && (this.lastScoreFactors = {
                                ...this.lastScoreFactors,
                                landing: _
                            });
                            let v = a.round(a.round(this.chainTricks * g) * _) + this.chainButter
                              , y = a.round(this.chainGrabs * g * _)
                              , b = a.round(this.chainRails * g * _)
                              , x = c && this.chainLinks > 0 ? a.round(450 * this.pipeShare) + a.round((v - this.chainButter + y + b) * de) : 0;
                            this.lastScore = v + y + b + x,
                            this.score += this.lastScore,
                            this.lastScore > 0 && (this.pipeScoredZ = a.max(this.pipeScoredZ, this.pipeTakeoffZ)),
                            this.runScore.tricks += v,
                            this.runScore.grabs += y,
                            this.runScore.rails += b,
                            this.runScore.landings += x;
                            for (let e of this.chainRepeatKeys)
                                this.trickTally.set(e, (this.trickTally.get(e) ?? 0) + 1);
                            this.pipeRecentAirs = [...this.pipeRecentAirs, ...this.chainRepeatKeys.filter(e => e !== `BUTTER`)].slice(-3);
                            let S = this.chain.join(` → `);
                            this.landedJumps++,
                            this.cleanLandings += Number(c),
                            this.totalAirTime += this.airTime,
                            this.lastScore > this.bestCombo && (this.bestCombo = this.lastScore,
                            this.bestTrick = S || `STRAIGHT AIR`),
                            this.spin = Wi(e, i * a.PI),
                            this.landingSpin = t ? n : this.spin,
                            this.landingFlip = s * (a.sign(this.landingUp.z) || 1),
                            h = p === `press` && this.butter.pressLanding(this, this.landingImpact),
                            this.spinVelocity = h ? this.butter.velocity : O(this.spinVelocity, -3, 3),
                            this.landingSettling = !h,
                            this.notice = !this.lastScore && this.pipeSameSpot ? In : this.lastScore > 0 ? S ? `${o ? `SAVED IT` : `STOMPED`}. ${S}` : c ? `CLEAN LANDING` : `` : ``,
                            this.noticeTime = this.notice ? 3 : 0,
                            this.event = `land`,
                            this.clearChain()
                        } else
                            p === `faceplant` ? this.faceplant() : this.beginCrash(this.landingImpact, f && !c);
                        this.vy = 0,
                        this.flip = 0,
                        this.trick = ``,
                        this.rollVelocity = 0,
                        this.flipVelocity = 0,
                        this.flipTightness = 0,
                        this.spinTightness = 0,
                        this.landingPrepare = 1,
                        h && this.butter.pose(this)
                    }
                }
                if (!this.airborne && !n && this.landingSettling && !this.grind && this.crashTime <= 0) {
                    let t = Lr(this.x, this.z, this.heading)
                      , n = t.slope;
                    Ln(n, this.spin, this.edge, this.groundTarget, t.crossSlope);
                    let r = f(this.airOrientation, this.groundTarget);
                    c(this.airOrientation, this.groundTarget, a.min(8 * e, r * (1 - a.exp(-18 * e)))),
                    r < .035 && a.abs(this.spin) < .002 && a.abs(this.spinVelocity) < .02 && (this.landingSettling = !1,
                    this.spin = 0,
                    this.spinVelocity = 0)
                }
                this.jumpHeld = t.jump,
                this.z >= 780 && this.crashTime <= 0 && (this.z = 780,
                this.phase = `finished`,
                this.speed = 0,
                this.runs++)
            }
        }
    }
}
  , Ki = (e, t, n) => a.max(t, a.min(n, e))
  , qi = new g;
function j(e, t, n, r, i=0) {
    let c = Ki(e, -1.3, 1.3);
    return s(r, -a.atan(c), 0, a.atan(Ki(i, -1.3, 1.3) / a.hypot(1, c)) - n * .045, `YXZ`),
    r.multiply(o(qi, m.DEFAULT_UP, t))
}
function Ji(e, t, n) {
    return n.copy(e).multiply(o(qi, m.DEFAULT_UP, t))
}
var Yi = class {
    constructor() {
        this.released = 0,
        this.locked = !1,
        this.yaw = 0,
        this.rail = !1,
        this.holdYaw = !1,
        this.velocity = new h,
        this.desired = new h,
        this.error = new g,
        this.target = new g,
        this.correction = new g
    }
    reset() {
        this.released = 0,
        this.locked = !1,
        this.velocity.set(0, 0, 0)
    }
    update(e, t, n, r, i, s, c, l=!1, u=0, d=0, f=!1) {
        if (this.correction.identity(),
        e <= 0)
            return this.correction;
        this.released = c ? 0 : this.released + e,
        (c || l !== this.rail || f !== this.holdYaw) && (this.locked = !1),
        this.rail = l,
        this.holdYaw = f;
        let p = !c && this.released > .035 && s < 2.8;
        if (p && !this.locked && (this.yaw = l ? n : a.round((n + d) / a.PI) * a.PI,
        this.locked = !0),
        p) {
            (l || f) && (this.yaw = n);
            let e = Number.isFinite(i) ? a.max(0, a.min(1, (1.5 - i) / 1.2)) : 0;
            j(r * e, this.yaw, 0, this.target, u * e),
            this.error.copy(t).invert().premultiply(this.target).normalize(),
            this.error.w < 0 && this.error.set(-this.error.x, -this.error.y, -this.error.z, -this.error.w),
            this.desired.set(this.error.x, this.error.y, this.error.z);
            let o = this.desired.length()
              , s = 2 * a.atan2(o, this.error.w);
            this.desired.multiplyScalar(o > 1e-8 ? a.min(4.8, s * 8) / o : 0)
        } else
            this.desired.set(0, 0, 0);
        let m = (c ? 40 : 30) * e;
        this.desired.sub(this.velocity).clampLength(0, m),
        this.velocity.add(this.desired);
        let h = this.velocity.length();
        return h > 1e-8 && o(this.correction, this.desired.copy(this.velocity).multiplyScalar(1 / h), h * e),
        this.correction
    }
}
  , Xi = a.tan(8 * a.PI / 180)
  , Zi = class {
    constructor() {
        this.target = new g,
        this.error = new g,
        this.axis = new h,
        this.up = new h,
        this.correction = new g
    }
    update(e, t, n, r, i=0, s=0, c=0) {
        if (this.correction.identity(),
        e <= 0)
            return this.correction;
        this.up.set(0, 1, 0).applyQuaternion(t);
        let l = a.min(Xi, a.tan(a.acos(a.max(-1, a.min(1, this.up.y)))))
          , u = a.max(0, a.min(1, c));
        j(l + (i - l) * u, n, 0, this.target, s * u),
        this.error.copy(t).invert().premultiply(this.target).normalize(),
        this.error.w < 0 && this.error.set(-this.error.x, -this.error.y, -this.error.z, -this.error.w),
        this.axis.set(this.error.x, this.error.y, this.error.z);
        let d = this.axis.length()
          , f = 2 * a.atan2(d, this.error.w);
        if (d < 1e-8 || f < 1e-4)
            return this.correction;
        let p = a.max(0, a.min(1, (r - .03) / .12))
          , m = a.min(2.2, f * 7) * p;
        return o(this.correction, this.axis.multiplyScalar(1 / d), a.min(f, m * e)),
        this.correction
    }
}
  , Qi = 275
  , $i = 1236 + Qi
  , ea = $i + 230
  , ta = $i - 146
  , na = {
    snowWalls: !0,
    maxSpeed: 43
}
  , ra = e => {
    let t = a.max(0, a.min(1, e));
    return t * t * (3 - 2 * t)
}
  , ia = e => (14 * a.sin(e * a.PI / 424) + 5 * a.sin(e * a.PI / 192)) * ra((e - 48) / 65) * (1 - ra((e - ea + Qi + 120) / 120))
  , aa = [{
    from: ta - Qi - 20,
    to: $i - Qi + 130,
    into: 25,
    out: 40
}, {
    from: 630,
    to: 790,
    into: 25,
    out: 40
}].map(e => {
    let t = ia(e.from);
    return {
        ...e,
        a: t,
        chord: (ia(e.to) - t) / (e.to - e.from)
    }
}
)
  , oa = e => {
    let t = ia(e)
      , n = t;
    for (let r of aa) {
        let i = ra((e - r.from + r.into) / r.into) * (1 - ra((e - r.to) / r.out));
        i <= 0 || (n += (r.a + r.chord * (e - r.from) - t) * i)
    }
    return n
}
  , sa = {
    z: 2130,
    run: 36,
    lip: 28,
    lipLength: 3,
    width: 22,
    table: 46,
    landing: 150
}
  , ca = {
    z: 1950,
    height: 2.4,
    radiusZ: 32,
    radiusX: 34,
    bench: 2004
}
  , la = {
    drift: 22,
    driftFrom: 2400,
    driftTo: 2520,
    turn: -67,
    turnFrom: 2860,
    turnTo: 3120
}
  , ua = e => la.drift * ra((e - la.driftFrom) / (la.driftTo - la.driftFrom)) + la.turn * ra((e - la.turnFrom) / (la.turnTo - la.turnFrom))
  , da = {
    z: 2624,
    apron: 30,
    gap: 28,
    landing: 90,
    deck: {
        length: 50,
        halfWidth: 6.5,
        below: 1.5
    },
    kickers: [{
        side: `LEFT`,
        offset: 13,
        run: 22,
        lip: 25,
        width: 9
    }, {
        side: `RIGHT`,
        offset: -13,
        run: 18,
        lip: 22,
        width: 9
    }]
}
  , fa = {
    knuckle: 3217,
    apron: 72,
    offset: -6,
    height: 1.5,
    step: .1,
    gap: 2,
    lead: 10,
    lengths: [30, 30, 30]
}
  , pa = {
    start: fa.knuckle + 6,
    length: 90
}
  , ma = {
    z: fa.knuckle - 6,
    offset: 13,
    run: 16,
    lip: 22,
    width: 9,
    table: 14,
    landing: 80
}
  , ha = {
    first: 3400,
    count: 3,
    run: 20,
    lip: 29,
    width: 9,
    table: 12,
    landings: [70, 50, 50],
    ease: 14,
    apron: 16,
    cut: 1.2,
    pair: 6.5,
    shoulder: 4,
    wall: 6
}
  , ga = ha.landings.reduce( (e, t, n) => n ? [...e, e[n - 1] + ha.table + ha.landings[n - 1] + ha.ease + ha.apron + ha.run] : [ha.first], [])
  , _a = ga[ha.count - 1] + ha.table + ha.landings[ha.count - 1]
  , va = _a + 74
  , ya = va + 64
  , ba = ya / 6
  , xa = oa(234.5) - oa(233.5)
  , Sa = oa(234)
  , Ca = NaN
  , wa = 0
  , M = e => {
    if (e === Ca)
        return wa;
    let t = a.max(0, e - 175);
    return wa = t <= 234 ? oa(t) : t <= 334 ? Sa + xa * (t - 234) : oa(t - 100) + xa * 100 + ua(e),
    Ca = e,
    wa
}
  , Ta = e => M(e + .5) - M(e - .5)
  , Ea = e => -99
  , Da = [];
function Oa(e, t) {
    let n = Da[t];
    return n.offset * ra((e - n.start) / 116) * (1 - ra((e - n.end + 116) / 116))
}
function ka(e, t) {
    let n = a.abs(e - M(t));
    for (let r = 0; r < Da.length; r++)
        t >= Da[r].start && t <= Da[r].end && (n = a.min(n, a.abs(e - M(t) - Oa(t, r))));
    return n
}
var Aa = [{
    z: 376 + Qi,
    table: 20,
    landing: 90,
    grade: .48,
    landingGrade: .3,
    run: 19,
    angle: 14,
    width: 9,
    offset: -11,
    name: `GROVE TRANSFER`
}, {
    z: 888 + Qi,
    table: 34,
    landing: 120,
    grade: .68,
    landingGrade: .43,
    run: 30,
    angle: 20,
    width: 12,
    offset: 12,
    name: `RIDGE GAP`
}]
  , ja = {
    z: 361 + Qi,
    offset: 5.5,
    length: 40
}
  , Ma = 703 + Qi
  , Na = {
    z: 252,
    run: 20,
    lip: 24,
    table: 4,
    landing: 52
}
  , Pa = [[89, 111], [166, 188]]
  , Fa = .34
  , Ia = [[0, 0], [36, 0], [44, .34], [60, .34], [68, .06], ...Pa.flatMap( ([e,t]) => [[e - 2, .06], [e + 4, Fa], [t - 8, Fa], [t, .06]]), [Pa[1][1] + 6, .06], [Pa[1][1] + 16, .18], [Na.z - Na.run - 16, .18], [Na.z - Na.run, .12], [Na.z + Na.table, .36], [Na.z + Na.table + 8, .52], [Na.z + Na.table + Na.landing - 6, .5], [Na.z + Na.table + Na.landing + 24, .035], [407, .035], [504 + Qi, .035], [534 + Qi, .4], [561 + Qi, .4], [596 + Qi, .035], [Ma, .035], [Ma + 9, .62], [800 + Qi, .62], [830 + Qi, .3], [856 + Qi, 0]]
  , La = Aa[0];
Ia.push([La.z - 140, .035], [La.z - 112, La.grade], [La.z - 65, La.grade], [La.z - 32, 0]);
for (let e of Aa)
    Ia.push([e.z + e.table, 0], [e.z + e.table + 28, e.landingGrade], [e.z + e.table + e.landing - 25, e.landingGrade], [e.z + e.table + e.landing + 20, .035]);
Ia.push([$i + 2, .035], [$i + 12, .2], [$i + 46, .2], [$i + 58, .58], [$i + 130, .58], [$i + 160, .12]);
{
    let e = sa
      , t = e.z - e.run
      , n = e.z + e.table
      , r = da
      , i = r.z + r.gap
      , a = fa
      , o = pa
      , s = ha;
    Ia.push([1700, .14], [1800, .16], [1830, .28], [1880, .28], [1905, .05], [ca.bench, .05], [ca.bench + 24, .5], [t - 30, .5], [t - 6, .06], [e.z, .03], [n, .03], [n + 14, .38], [n + 26, .62], [n + 80, .62], [n + 110, .34], [n + 140, .16], [r.z - r.kickers[0].run - r.apron, .16], [r.z - r.kickers[0].run - r.apron + 20, .06], [i - 2, .05], [i + 6, .28], [i + 16, .34], [i + r.landing - 15, .34], [i + r.landing + 10, .14], [3e3, .14], [a.knuckle - a.apron - 20, .14], [a.knuckle - a.apron, .05], [a.knuckle, .05], [o.start, .3], [o.start + 10, .34], [o.start + o.length - 15, .34], [o.start + o.length + 10, .16], ...ga.flatMap( (e, t) => [[e - s.run - s.apron, .06], [e + s.table, .06], [e + s.table + s.landings[t], .14]]), [_a + 28, .1], [va - 16, 0], [ya, 0])
}
var Ra = Ia.sort( (e, t) => e[0] - t[0])
  , za = e => e.reduce( (t, n, r) => [...t, r ? t[r - 1] + (n[0] - e[r - 1][0]) * (n[1] + e[r - 1][1]) / 2 : 0], []);
function Ba(e, t, n) {
    let r = 0
      , i = e.length - 2;
    for (; r < i; ) {
        let t = r + i >> 1;
        n > e[t + 1][0] ? r = t + 1 : i = t
    }
    let a = e[r]
      , o = e[r + 1]
      , s = o[0] - a[0]
      , c = (n - a[0]) / s;
    return t[r] + s * (a[1] * c + (o[1] - a[1]) * (c ** 3 - c ** 4 / 2))
}
var Va = 1680
  , Ha = [[0, 0], [36, 0], [44, .4], [56, .4], [66, .05], [190, .05], [200, .24], [216, .24], [232, .12], [256, .36], [264, .52], [302, .5], [332, .035], [407, .035]]
  , Ua = [[$i + 160, .12], [$i + 185, .035], [$i + 214, 0], [$i + 294, 0]]
  , Wa = za(Ra)
  , Ga = za(Ha)
  , Ka = za(Ua)
  , qa = Va + Wa[Ra.findIndex( ([e]) => e === 407)] - Ga[Ha.length - 1];
function N(e) {
    return qa - Ba(Ra, Wa, a.max(0, a.min(ya, e)))
}
function Ja(e) {
    if (e <= 407)
        return N(e) - (Va - Ba(Ha, Ga, a.max(0, e)));
    let t = Ua[0][0]
      , n = Ua[Ua.length - 1][0];
    return e < t ? 0 : N(e) - (N(t) - Ba(Ua, Ka, a.min(e, n)))
}
function Ya(e, t) {
    let n = ra((a.abs(e) - 72) / 105);
    return n && (18 + 8 * a.sin(t * .006) ** 2) * n * (.7 + .3 * a.sin(t * .002) ** 2)
}
function Xa(e, t, n) {
    return n
}
var Za = []
  , Qa = []
  , $a = []
  , eo = []
  , to = []
  , no = []
  , ro = (e, t) => M(t) + (e.branch === void 0 ? 0 : Oa(t, e.branch));
function io(e, t, n, r, i={}) {
    let a = {
        z: e,
        offset: t,
        length: n,
        name: r,
        width: .14,
        build: `box`,
        profile: `flat`,
        angle: 0,
        height: 2.65,
        entry: `pop`,
        popLaunch: `ballistic`,
        entryRun: 14,
        entryGap: 3,
        popAngle: 8,
        exitLanding: !1,
        paint: `#181e25`,
        ...i
    };
    return Za.push(a),
    a
}
function ao(e, t, n, r, i, o, s=2.65, c={}, l=0, u) {
    let d = io(e, t, r, `${n} / ENTRY`, {
        build: o,
        width: o === `tube` ? .18 : o === `twin` ? .16 : .14,
        height: s,
        finish: `worn-tank`,
        ...c
    })
      , f = a.atan(Ta(e))
      , p = e + a.cos(f) * r;
    return [d, io(p, M(e) + t + a.sin(f) * r - M(p), i, `${n} / DOWN`, {
        build: `tube`,
        width: .18,
        profile: `down`,
        height: s - .35,
        entry: `transfer`,
        angle: (f - a.atan(Ta(p))) * 144 / a.PI + l,
        bend: u
    })]
}
function oo(e) {
    let t = a.atan(Ta(e.z)) + e.angle * a.PI / 180
      , n = e.bend
      , r = n?.shape === `right` ? -n.size : n?.shape === `left` ? n.size : 0
      , i = (n?.shape === `shift-left` ? n.size : n?.shape === `shift-right` ? -n.size : 0) + r
      , o = t + (r && a.atan(2 * r / (((n?.to ?? 1) - (n?.from ?? 0)) * e.length)));
    return {
        x: M(e.z) + e.offset + a.sin(t) * e.length + a.cos(t) * i,
        z: e.z + a.cos(t) * e.length - a.sin(t) * i,
        h: o
    }
}
function so(e, t, n, r, i) {
    let o = a.atan(Ta(e.z)) + e.angle * a.PI / 180
      , s = M(e.z) + e.offset
      , c = e.z - a.cos(o) * (t + n);
    return io(c, s - a.sin(o) * (t + n) - M(c), n, r, {
        ...i,
        angle: (o - a.atan(Ta(c))) * 180 / a.PI
    })
}
function co(e, t, n, r, i) {
    let o = oo(e);
    return io(t, o.x + a.tan(o.h) * (t - o.z) - M(t), n, r, {
        ...i,
        angle: (o.h - a.atan(Ta(t))) * 180 / a.PI
    })
}
var lo = [{
    z: 70,
    name: `DROP IN`
}, {
    z: 628 + Qi,
    name: `HIGH STREET`
}];
for (let e of lo)
    eo.push({
        name: e.name,
        start: e.z - 24,
        end: e.z + 108,
        halfWidth: 42
    });
var uo = {
    entry: `pop`,
    popLaunch: `manual`,
    entryRun: 18,
    entryGap: 2,
    popAngle: 8
};
io(81, 0, 26, `DROP IN / FIRST BAR`, {
    build: `box`,
    profile: `down`,
    width: .16,
    height: 2,
    follow: !0,
    ...uo
}),
io(158, 7, 26, `DROP IN / KINK PIPE`, {
    build: `tube`,
    profile: `kink`,
    width: .18,
    height: 2.3,
    follow: !0,
    ...uo
}),
io(158, -7, 26, `DROP IN / DOWN BAR`, {
    build: `box`,
    profile: `down`,
    width: .16,
    height: 2.3,
    follow: !0,
    ...uo
});
var fo = {};
for (let[e,t,n,r,i,a,o,s] of [[-32, 32, 40, 3, `box`, 2.65, 0, {
    size: 16.3,
    from: 0,
    to: .85,
    shape: `shift-left`
}], [-16, 22, 47, 2.65, `tube`, 2.3, 3, {
    size: 2.2,
    from: .45,
    to: .87,
    shape: `shift-left`
}], [20, 27, 42, 2.65, `twin`, 2.3, 0, void 0]]) {
    let[c,l] = ao(628 + Qi, e, `HIGH STREET / ${i.toUpperCase()}`, t, n, i, r, {
        entryRun: 14,
        entryGap: 5,
        entryHeight: a,
        popAngle: 10
    }, o, s);
    i === `tube` && (c.width = .55),
    fo[i] = l
}
var po = {
    start: Ma + 14,
    length: 70,
    height: 2.65
}
  , mo = [];
for (let[e,t,n] of [[`box`, `HILL RAIL`, {
    build: `box`,
    width: .14
}], [`twin`, `WAVE RAIL`, {
    build: `tube`,
    width: .18,
    wave: {
        size: .8,
        waves: 2
    }
}]]) {
    let r = po
      , i = r.start + r.length
      , a = co(fo[e], r.start, r.length, `HIGH STREET / ${e.toUpperCase()} / ${t}`, {
        ...n,
        height: r.height,
        follow: !0,
        entry: `transfer`,
        finish: `worn-tank`
    });
    mo.push({
        start: i,
        end: i + 70,
        offset: a.offset,
        halfWidth: 9
    })
}
for (let[e,t] of Aa.entries()) {
    let {run: n, offset: r} = t
      , i = t.angle
      , a = 2.4
      , o = vr(n, a, i, N(t.z - n + .5) - N(t.z - n - .5))
      , s = N(t.z - n) + o.rise - N(t.z);
    Qa.push({
        z: t.z,
        offset: r,
        name: t.name,
        run: n,
        lipAngle: i,
        lipLength: a,
        height: s,
        width: t.width,
        table: t.table,
        landing: t.landing,
        landingRise: -s,
        transfer: 0,
        kind: `kicker`,
        kick: `flow`,
        main: !1,
        approach: 75,
        mound: {
            height: 0,
            shoulder: 0,
            wall: 1
        }
    }),
    !(e > 0) && (io(ja.z, ja.offset, ja.length, `GROVE / RIGHT BOW`, {
        build: `tube`,
        height: 2.3,
        width: .18,
        entryRun: 14,
        entryGap: 5,
        entryHeight: 1.9,
        popAngle: 10,
        bend: {
            size: 2,
            from: .5,
            shape: `right`
        }
    }),
    io(t.z + t.table + 18, r - 3, 36, `${t.name} / LANDING PIPE`, {
        entry: `transfer`,
        build: `tube`,
        width: .2,
        height: 2.1,
        profile: `down`
    }))
}
var ho = {
    height: 1.8,
    half: 4.2,
    sink: 1.5
}
  , go = Ma - 10 - {
    back: 10
}.back
  , _o = go + 5;
$a.push({
    start: _o - ho.half,
    end: _o + ho.half,
    offset: 2,
    height: ho.height,
    halfWidth: ho.half,
    cut: .45,
    approach: .45,
    exit: .45,
    level: _o
}),
io(go, 2, 10, `HIGH STREET / GIANT STEEL TAP`, {
    feature: `sphere`,
    build: `tube`,
    width: 10,
    profile: `rainbow`,
    entry: `transfer`,
    height: ho.height + 5 - ho.sink + N(_o) - N(go)
});
function vo(e, t, n, r, i, a, o, s) {
    let c = 2.4
      , l = vr(r, c, i, N(e - r + .5) - N(e - r - .5))
      , u = N(e - r) + l.rise - N(e);
    Qa.push({
        z: e,
        offset: t,
        name: n,
        run: r,
        lipAngle: i,
        lipLength: c,
        height: u,
        width: a,
        table: o,
        landing: s,
        landingRise: -u,
        transfer: 0,
        kind: `kicker`,
        kick: `flow`,
        main: !1,
        mound: {
            height: 0,
            shoulder: 0,
            wall: 1
        }
    })
}
function yo(e, t, n, r, i, o, s, c, l, u={}) {
    let d = 2.5
      , f = vr(r, d, i, N(e - r + .5) - N(e - r - .5))
      , p = N(e - r) + f.rise - N(e);
    Qa.push({
        z: e,
        offset: t,
        name: n,
        run: r,
        lipAngle: i,
        lipLength: d,
        height: p,
        width: o,
        table: s,
        landing: c,
        landingRise: -p,
        transfer: 0,
        kind: `kicker`,
        kick: `flow`,
        main: !1,
        approach: 30,
        mound: {
            height: a.max(0, p - l),
            landingBias: u.landingBias ?? .5,
            levelLanding: !0,
            shoulder: u.shoulder ?? 5,
            wall: u.wall ?? 5,
            drop: u.drop
        }
    })
}
yo(Na.z, 0, `DROP IN / FIRST HIT`, Na.run, Na.lip, 10, Na.table, Na.landing, 3);
var bo = {
    crown: 493,
    bump: 24,
    rise: 5.5,
    wide: 16,
    up: 20,
    end: .35,
    height: 1.4,
    gap: 4,
    run: 10,
    knuckle: 512,
    down: 37
}
  , xo = {
    build: `tube`,
    width: .6,
    finish: `worn-tank`,
    paint: `#377dad`
};
no.push({
    z: bo.crown,
    offset: 0,
    height: bo.rise,
    radiusX: bo.wide,
    radiusZ: bo.bump
}),
co(io(bo.crown - bo.bump * bo.end - bo.up, 0, bo.up, `BLUE PIPES / UP PIPE`, {
    ...xo,
    height: bo.height,
    follow: !0,
    entryRun: bo.run,
    entryGap: bo.gap,
    entryHeight: bo.height - .6,
    popAngle: 12
}), bo.knuckle, bo.down, `BLUE PIPES / DOWN PIPE`, {
    ...xo,
    height: 1.8,
    follow: !0,
    entry: `ride`,
    entryRun: 10
}),
vo(go - 19, 2, `GIANT TAP / TAKEOFF`, 28, 20, 8, 20, 60);
var So = {
    run: 20,
    lipAngle: 18,
    width: 10,
    table: 46,
    cut: .5,
    railStart: 5,
    railHeight: 1.3
};
yo($i, 0, `PLATFORM / KICKER`, So.run, So.lipAngle, So.width, So.table, 60, So.cut, {
    shoulder: 2,
    wall: 3,
    landingBias: .6,
    drop: 30
}),
io($i + So.railStart, 0, So.table - So.railStart - .5, `PLATFORM / LONG RAIL`, {
    build: `tube`,
    width: .2,
    height: So.railHeight,
    entry: `transfer`
}),
io(ta, 0, 58, `FOREST / LONG S`, {
    build: `tube`,
    width: .2,
    height: 2.7,
    entryRun: 20,
    entryGap: 8,
    entryHeight: 2,
    popAngle: 10,
    bend: {
        size: 1.2,
        from: .3
    }
});
var Co = Aa[1]
  , wo = {
    z: Co.z + Co.table + 4,
    offset: -4,
    length: 69
}
  , To = {
    start: wo.z - 20,
    end: wo.z + 3 + 5,
    rise: .6,
    ramp: 8,
    bend: 5,
    halfWidth: 4.5,
    side: .9
};
$a.push({
    start: To.start,
    end: To.end,
    offset: wo.offset + To.side,
    height: To.rise,
    halfWidth: To.halfWidth,
    cut: .5,
    approach: To.ramp,
    exit: To.bend,
    level: To.start
}),
$a.push({
    start: wo.z + 21 + 5,
    end: wo.z + 35 + 5,
    offset: wo.offset + 2,
    height: 0,
    halfWidth: 3.4,
    cut: 1,
    approach: .5,
    exit: 18,
    level: wo.z + 21 + 5
}),
io(wo.z, wo.offset, wo.length, `RIDGE / STAIR RAIL`, {
    build: `tube`,
    width: .14,
    height: 1.9,
    follow: !0,
    entryRun: 10,
    entryGap: 4,
    entryHeight: 1.6,
    popAngle: 8,
    stairs: {
        width: 4.4,
        steps: a.round(120 * wo.length / 64),
        clearance: 1.65,
        railSide: `right`
    }
});
var Eo = {
    offset: wo.offset - 7,
    end: wo.z - 5,
    pipe: {
        length: 20,
        height: 2.3
    },
    gap: 2.5,
    snake: {
        length: 30,
        height: 2.6,
        wave: .8,
        waves: 2,
        gap: 3,
        lip: 6
    }
};
{
    let e = Eo;
    so(io(e.end - e.pipe.length, e.offset, e.pipe.length, `RIDGE / FLAT PIPE`, {
        build: `tube`,
        width: .2,
        height: e.pipe.height,
        entry: `transfer`,
        finish: `worn-tank`
    }), e.gap, e.snake.length, `RIDGE / SNAKE`, {
        build: `tube`,
        width: .18,
        height: e.snake.height,
        follow: !0,
        wave: {
            size: e.snake.wave,
            waves: e.snake.waves,
            level: !0
        },
        finish: `worn-tank`,
        entry: `pop`,
        popLaunch: `manual`,
        entryRun: 20,
        entryGap: e.snake.gap,
        popAngle: e.snake.lip
    })
}
var Do = {
    z: va - 50,
    offset: 29,
    height: 3,
    depth: .8,
    sink: .3,
    yaw: 0,
    plinth: .9,
    margin: .9
}
  , Oo = [{
    name: `CORK7 LOGO`,
    x: M(Do.z) + Do.offset,
    z: Do.z,
    width: Do.height * 172 / 36,
    height: Do.height,
    depth: Do.depth,
    sink: Do.sink,
    yaw: Do.yaw * a.PI / 180
}];
$a.push({
    start: Do.z - Do.depth / 2 - Do.margin,
    end: Do.z + Do.depth / 2 + Do.margin,
    offset: Do.offset,
    height: Do.plinth,
    halfWidth: Oo[0].width / 2 + Do.margin,
    cut: .45,
    approach: .45,
    exit: .45,
    level: Do.z
}),
no.push({
    z: ca.z,
    offset: 0,
    height: ca.height,
    radiusX: ca.radiusX,
    radiusZ: ca.radiusZ
});
function ko(e, t, n, r, i, a, o, s, c, l, u) {
    let d = vr(r, a, i, N(e - r + .5) - N(e - r - .5))
      , f = N(e - r) + d.rise - N(e);
    Qa.push({
        z: e,
        offset: t,
        name: n,
        run: r,
        lipAngle: i,
        lipLength: a,
        height: f,
        width: o,
        table: s,
        landing: c,
        landingRise: -f,
        transfer: 0,
        kind: `kicker`,
        kick: l,
        main: !1,
        approach: u,
        mound: {
            height: 0,
            shoulder: 0,
            wall: 1
        }
    })
}
ko(sa.z, 0, `BIG HIT`, sa.run, sa.lip, sa.lipLength, sa.width, sa.table, sa.landing, `high`, 90);
for (let e of da.kickers) {
    let t = da
      , n = t.deck
      , r = N(t.z - e.run) + vr(e.run, 2.4, e.lip, N(t.z - e.run + .5) - N(t.z - e.run - .5)).rise;
    ko(t.z, e.offset, `GAP / ${e.side}`, e.run, e.lip, 2.4, e.width, t.gap, t.landing, `flow`, 60);
    let i = r - n.below - N(t.z + t.gap);
    $a.push({
        start: t.z + t.gap,
        end: t.z + t.gap + n.length,
        offset: e.offset,
        height: i,
        halfWidth: n.halfWidth,
        cut: 1.2,
        approach: .5,
        exit: 1,
        descent: {
            start: t.z + t.gap,
            end: t.z + t.gap + n.length - 2,
            drop: i
        }
    })
}
ko(ma.z, ma.offset, `TRIPLE PIPE / MEDIUM JUMP`, ma.run, ma.lip, 2.4, ma.width, ma.table, ma.landing, `flow`, 50);
for (let[e,t] of ga.entries())
    for (let[n,r] of [[`LEFT`, ha.pair], [`RIGHT`, -ha.pair]])
        yo(t, r, `THE LINE / ${e + 1} ${n}`, ha.run, ha.lip, ha.width, ha.table, ha.landings[e], ha.cut, {
            shoulder: ha.shoulder,
            wall: ha.wall,
            landingBias: .5
        });
var Ao;
for (let[e,t] of fa.lengths.entries()) {
    let n = `TRIPLE PIPE / ${[`FLAT`, `DOWN`, `LAST`][e]}`
      , r = {
        ...xo,
        height: fa.height - fa.step * e,
        follow: !0
    };
    if (!Ao)
        Ao = io(fa.knuckle - fa.lead - fa.gap - t, fa.offset, t, n, r);
    else {
        let e = oo(Ao);
        Ao = co(Ao, e.z + a.cos(e.h) * fa.gap, t, n, {
            ...r,
            entry: `transfer`
        })
    }
}
var jo = {
    z: 2993,
    offset: -8,
    length: 24,
    height: 1.15,
    lead: .3,
    gap: 38,
    tail: 3,
    block: {
        height: 5.4,
        half: 6.6,
        landing: 26
    },
    kicker: {
        run: 12,
        lip: 20,
        lipLength: 2.4,
        width: 13
    }
}
  , Mo = a.cos(a.atan(Ta(jo.z)));
$a.push({
    start: jo.z - jo.lead * Mo,
    end: jo.z + (jo.length + jo.tail) * Mo,
    offset: jo.offset,
    height: jo.block.height,
    halfWidth: jo.block.half,
    cut: .4,
    approach: .4,
    exit: jo.block.landing
});
var No = jo.lead + jo.gap
  , Po = jo.z - No * Mo;
for (let e = 0; e < 4; e++)
    Po = jo.z - No * a.cos(a.atan(Ta(Po)));
var Fo = a.atan(Ta(Po));
ko(Po, M(jo.z) + jo.offset - No * a.sin(Fo) - M(Po), `THE BEND / GAP KICKER`, jo.kicker.run, jo.kicker.lip, jo.kicker.lipLength, jo.kicker.width, jo.gap, 60, `flow`, 60),
io(jo.z, jo.offset, jo.length, `THE BEND / RAINBOW`, {
    build: `tube`,
    profile: `rainbow`,
    width: .45,
    height: jo.height,
    finish: `polished`,
    legs: [.25, .75],
    entry: `transfer`,
    popLaunch: void 0,
    catchRising: !0,
    angle: (Fo - a.atan(Ta(jo.z))) * 180 / a.PI
});
var Io = {
    gap: 3,
    length: 30
};
{
    let e = Za.find(e => e.name === `GROVE / RIGHT BOW`)
      , t = oo(e);
    co(e, t.z + a.cos(t.h) * Io.gap, Io.length, `GROVE / SECOND BAR`, {
        build: `tube`,
        width: e.width,
        height: e.height,
        follow: !0,
        entry: `transfer`
    })
}
var Lo = []
  , Ro = [[0, `FOREST LINE / DROP IN`], [195, `FIRST HIT`], [403, `BLUE PIPES`], [236 + Qi, `THE GROVE`], [604 + Qi, `HIGH STREET`], [Ma + 8, `THE HILL`], [858 + Qi, `RIDGE GAP`], [ta - 30, `THE FOREST`], [$i - 50, `PLATFORM`], [$i + 165, `LOWER FOREST`], [ca.z - 40, `THE KNOLL`], [sa.z - sa.run - 60, `BIG HIT`], [sa.z + sa.table + sa.landing + 30, `DEEP FOREST`], [da.z - da.kickers[0].run - da.apron, `THE GAPS`], [da.z + da.gap + da.landing, `THE BEND`], [fa.knuckle - 92, `TRIPLE PIPE`], [ga[0] - 40, `THE LINE`], [va - 64, `HOME / BRAKE`], [va, `FOREST LINE / FINISH`]]
  , zo = e({
    AIR_ANGLE: () => Fc,
    AIR_GRAVITY: () => ks,
    AIR_RATE: () => Ic,
    AIR_REACH: () => 1,
    AIR_WINDOW: () => Lc,
    BALL_BOUNCE: () => 0,
    BALL_CAP: () => Xs,
    BALL_GLANCE: () => Zs,
    BALL_GRIP: () => Qs,
    BALL_LIFT: () => $s,
    BALL_SKIN: () => Ys,
    BRANCHES: () => Da,
    COURSE_LENGTH: () => ya,
    COURSE_WIDTH: () => 260,
    DROP_FACE: () => ec,
    FINISH_HALF_WIDTH: () => 30,
    FINISH_Z: () => va,
    FLAT_SLAM: () => 33,
    FLIP_RATE: () => Ec,
    FORWARD_TUCK_SPEED: () => 18,
    FORWARD_TUCK_TIME: () => jc,
    FUNNEL_ANGLE: () => Nc,
    FUNNEL_PULL: () => Pc,
    FUNNEL_REACH: () => Mc,
    GRAB_SPIN_RATE: () => Oc,
    JIB_PLATFORMS: () => $a,
    JIB_SECTIONS: () => eo,
    JUMPS: () => Qa,
    KICKER_BACK: () => Js,
    LIFT_DURATION: () => ba,
    LIFT_SPEED: () => 6,
    LIFT_TOWER_SPACING: () => 100,
    LIP_EDGE: () => Ps,
    LIP_GRACE: () => Ns,
    LIP_STEP: () => Fs,
    PARK_BANKS: () => no,
    PARK_ENTRY_Z: () => 34,
    POP_CATCH: () => Es,
    POP_CLEAR: () => Ts,
    POP_CLIMB: () => Qo,
    POP_GAP: () => Cs,
    POP_KICK: () => 24,
    POP_STEP: () => ws,
    RAILS: () => Za,
    RAIL_HOPS: () => 2,
    RAIL_LIP: () => xs,
    RAIL_PULL: () => Tc,
    RAIL_SPIN_RATE: () => wc,
    RAIL_SWAPS: () => 2,
    ROLLERS: () => Lo,
    SNOW_FORMS: () => to,
    SPIN_RATE: () => Cc,
    SPIN_TURN_RATE: () => Dc,
    SkiSimulation: () => zc,
    UP_RUN: () => 3,
    UP_START: () => _s,
    ZONES: () => Ro,
    baseHeight: () => N,
    branchOffset: () => Oa,
    cabinTravel: () => xc,
    center: () => M,
    clamp: () => P,
    climbsOut: () => vs,
    courseTangent: () => Ta,
    damp: () => Vo,
    groundHeight: () => cc,
    groundLaunch: () => rs,
    groundPop: () => is,
    jibGrooming: () => Ks,
    jibLips: () => Gs,
    jibSectionCenter: () => ro,
    jibTerraces: () => ac,
    jumpCenter: () => Xo,
    jumpStyle: () => Jo,
    lerp: () => Bo,
    liftX: () => bc,
    lineDistance: () => ka,
    mountainHeight: () => yc,
    mountainShoulder: () => Ya,
    onKickerWall: () => es,
    parkBanks: () => oc,
    parkGrooming: () => sc,
    popLine: () => Os,
    railBend: () => ds,
    railCrest: () => As,
    railFrame: () => hs,
    railHeading: () => us,
    railHeadingAt: () => ps,
    railLipRun: () => Ss,
    railPoint: () => ms,
    railPopGap: () => Ds,
    railTop: () => bs,
    railWave: () => fs,
    rampHeight: () => rc,
    rampLaunch: () => Zo,
    riderSurface: () => ss,
    sculptedSnow: () => ic,
    snowGrade: () => os,
    snowSurface: () => fc,
    terrainHeight: () => I,
    zoneAt: () => Sc
})
  , P = (e, t, n) => a.max(t, a.min(n, e))
  , Bo = (e, t, n) => e + (t - e) * n
  , Vo = (e, t, n, r) => Bo(e, t, 1 - a.exp(-n * r))
  , Ho = e => {
    let t = P(e, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10)
}
  , F = e => {
    let t = P(e, 0, 1);
    return t * t * (3 - 2 * t)
}
  , Uo = M(34)
  , Wo = a.atan(Ta(34))
  , Go = a.cos(Wo)
  , Ko = a.sin(Wo)
  , qo = N(26)
  , Jo = e => e.kick === `high` ? `HIGH KICK` : e.kind === `step-up` ? `STEP UP` : e.kind === `hip` ? `HIP` : `FLOW`
  , Yo = new Map;
function Xo(e, t) {
    let n = Yo.get(e);
    (!n || !Object.is(n.z, e.z)) && Yo.set(e, n = {
        z: e.z,
        x: M(e.z),
        tangent: Ta(e.z)
    });
    let r = a.max(0, t - e.z)
      , i = n.x + n.tangent * r;
    return Bo(M(t), i, F(r / e.table)) + e.offset + e.transfer * P(r / 65, 0, 1)
}
function Zo(e, t, n, r=0) {
    let i = a.atan(a.tan(e.lipAngle * a.PI / 180) * a.max(.2, a.cos(r)))
      , o = 1.2 + P(n, 0, 1) * 2.2;
    return {
        horizontal: t * a.cos(i) - o * a.sin(i),
        vertical: t * a.sin(i) + o * a.cos(i)
    }
}
var Qo = a.tan(12 * a.PI / 180)
  , $o = (e, t) => Qa.some(n => {
    if (t < n.z - n.run || t > n.z + 1)
        return !1;
    let r = Xo(n, t)
      , i = a.abs(e - r) - n.width / 2;
    return i >= 0 && i < 1.5 && I(e, t) < I(r + a.sign(e - r) * (n.width / 2 - .6), t) - 1
}
)
  , es = (e, t) => {
    let n = !1;
    for (let r of Qa) {
        let i = t - r.z
          , o = r.mound;
        if (i < -r.run || i > r.table + r.landing)
            continue;
        let s = o?.shoulder ?? 3
          , c = a.abs(e - Xo(r, t)) - r.width / 2;
        if (c <= (o?.height ? s - 1 : 1))
            return !1;
        n ||= !!o?.height && c < s + (o.wall ?? 4) + 1
    }
    return n
}
  , ts = a.tan(60 * a.PI / 180);
function ns(e, t, n, r) {
    for (let i = 1; i <= 5; i++) {
        let a = ur(I, e + n * i / 10, t + r * i / 10);
        if (a.length >= ts && a.dx * n + a.dz * r > 0)
            return !0
    }
    return !1
}
function rs(e, t, n, r, i) {
    let {slope: o, crossSlope: s} = ss(e, t, 0)
      , c = Qa.some(n => t >= n.z - n.run && t <= n.z && a.abs(e - Xo(n, t)) < n.width / 2);
    if (!c) {
        let n = I(e, t);
        ns(e, t, 1, 0) ? s = (n - I(e - .5, t)) / .5 : ns(e, t, -1, 0) && (s = (I(e + .5, t) - n) / .5),
        ns(e, t, 0, 1) ? o = (n - I(e, t - .5)) / .5 : ns(e, t, 0, -1) && (o = (I(e, t + .5) - n) / .5)
    }
    let l = (c ? 1.2 + P(i, 0, 1) * 2.2 : 3.6 + P(i, 0, 1) * 2.6) / a.hypot(s, 1, o)
      , u = s * n + o * r
      , d = a.hypot(n, r) * Qo;
    return {
        velocityX: n - s * l,
        velocityZ: r - o * l,
        vertical: (u > d && ($o(e, t) || es(e, t)) ? d : u) + l
    }
}
var is = (e, t, n, r, i) => rs(e, t, n, r, i).vertical;
function as(e, t, n) {
    let r = Xo(e, n)
      , i = a.max(.6, e.width / 2 - .05)
      , o = a.max(r - i, a.min(r + i - 1, t - .5));
    return I(o + 1, n) - I(o, n)
}
function os(e, t, n) {
    for (let r of Qa)
        if (t <= r.z && t >= r.z - r.lipLength + .5 && a.abs(e - Xo(r, t)) < r.width / 2)
            return as(r, e, t) * a.sin(n) + a.tan(r.lipAngle * a.PI / 180) * a.cos(n);
    let r = a.sin(n) * .5
      , i = a.cos(n) * .5;
    return I(e + r, t + i) - I(e - r, t - i)
}
function ss(e, t, n, r=!1) {
    let i = I(e + .5, t) - I(e - .5, t)
      , o = I(e, t + .5) - I(e, t - .5)
      , s = 0;
    for (let n of Qa)
        if (t <= n.z && t > n.z - n.lipLength - 3 && a.abs(e - Xo(n, t)) < n.width / 2) {
            s = F((t - n.z + n.lipLength + 3) / 3),
            i = as(n, e, t),
            t >= n.z - n.lipLength + .5 && (o = a.tan(n.lipAngle * a.PI / 180));
            break
        }
    for (let n of Za) {
        if (t < n.z - (n.entryRun ?? 20) - 4 || t > n.z + n.length + 20 || n.popLaunch !== `manual` || t > n.z || t < n.z - Ds(n) - 1)
            continue;
        let r = hs(n, e, t)
          , i = r.t * n.length + Ds(n);
        if (i > -.6 && i < 1 && a.abs(r.side) < 3.2) {
            let r = t - a.max(0, i) * a.cos(us(n));
            o = (I(e, r) - I(e, r - .5)) / .5;
            break
        }
    }
    if (r)
        for (let n of Za) {
            if (t < n.z - (n.entryRun ?? 20) - 4 || t > n.z + n.length + 20)
                continue;
            let r = hs(n, e, t);
            if (r.t >= 0 && r.t <= 1 && a.abs(r.side) < .8) {
                let e = a.max(0, r.t - .01)
                  , t = a.min(1, r.t + .01)
                  , s = ps(n, r.t)
                  , c = (bs(n, t) - bs(n, e)) / ((t - e) * n.length);
                i = a.sin(s) * c,
                o = a.cos(s) * c;
                break
            }
        }
    return {
        slope: i * a.sin(n) + o * a.cos(n),
        crossSlope: i * a.cos(n) - o * a.sin(n),
        lip: s
    }
}
var cs = new WeakMap;
function ls(e) {
    let t = cs.get(e);
    if (!t) {
        let n = a.atan(Ta(e.z)) + e.angle * a.PI / 180;
        t = {
            h: n,
            sin: a.sin(n),
            cos: a.cos(n),
            c: M(e.z)
        },
        cs.set(e, t)
    }
    return t
}
var us = e => ls(e).h;
function ds(e, t) {
    if (!e.bend)
        return 0;
    let n = P((t - e.bend.from) / ((e.bend.to ?? 1) - e.bend.from), 0, 1);
    return e.bend.shape === `right` || e.bend.shape === `left` ? (e.bend.shape === `left` ? 1 : -1) * e.bend.size * n * n : e.bend.shape === `shift-left` || e.bend.shape === `shift-right` ? (e.bend.shape === `shift-left` ? 1 : -1) * e.bend.size * n * n * (3 - 2 * n) : e.bend.size * a.SQRT2 * a.sin(2 * a.PI * n) * a.sin(a.PI * n)
}
function fs(e, t) {
    if (!e.wave)
        return 0;
    let n = 2 * a.PI * e.wave.waves * P(t, 0, 1);
    return e.wave.level ? e.wave.size * (1 - a.cos(n)) / 2 : e.wave.size * a.sin(n)
}
function ps(e, t) {
    if (!e.bend)
        return ls(e).h;
    let n = P(t, .004, .996);
    return ls(e).h + a.atan((ds(e, n + .004) - ds(e, n - .004)) / (.008 * e.length))
}
function ms(e, t) {
    let n = ls(e)
      , r = ds(e, t);
    return {
        x: n.c + e.offset + n.sin * e.length * t + n.cos * r,
        z: e.z + n.cos * e.length * t - n.sin * r
    }
}
function hs(e, t, n) {
    let r = ls(e)
      , i = t - r.c - e.offset
      , a = n - e.z
      , o = (i * r.sin + a * r.cos) / e.length;
    return {
        t: o,
        side: i * r.cos - a * r.sin - ds(e, o)
    }
}
var gs = {
    flat: () => 0,
    kink: e => e < .3 ? .65 * F(e / .3) : e < .62 ? .65 : .65 * (1 - F((e - .62) / .38)),
    down: e => .35 - .6 * e,
    "down-flat-down": e => e < .28 ? .36 * (1 - F(e / .28)) : e < .64 ? 0 : -.25 * F((e - .64) / .36),
    rainbow: e => 1.5 * a.sin(a.PI * e),
    cannon: e => 1.9 * a.pow(F((e - .55) / .45), 1.3)
}
  , _s = .5
  , vs = e => e.entry === `ride` && e.profile !== `rainbow`
  , ys = (e, t) => vs(e) ? -_s * (1 - F(t * e.length / 3)) : 0;
function bs(e, t) {
    let n = ms(e, 0)
      , r = ms(e, 1)
      , i = P(t, 0, 1);
    if (e.feature === `sphere`)
        return cc(n.x, n.z) + e.height + a.sqrt(a.max(0, 1 - (i * 2 - 1) ** 2)) * e.length / 2;
    if (e.follow) {
        let t = ms(e, i);
        return cc(t.x, t.z) + e.height + fs(e, i)
    }
    return Bo(cc(n.x, n.z), cc(r.x, r.z), i) + e.height + gs[e.profile](i) + ys(e, i)
}
var xs = 8.5
  , Ss = e => e.entryRun ?? 8.5
  , Cs = 2.5
  , ws = .8
  , Ts = .35
  , Es = .45
  , Ds = e => e.entryGap ?? 2.5
  , Os = e => bs(e, 0) - (bs(e, .1) - bs(e, 0)) / (.1 * e.length) * Ds(e)
  , ks = 17.5
  , As = e => e.entry === `pop` ? -Ds(e) : 0
  , js = new WeakMap;
function Ms(e) {
    let t = js.get(e);
    if (!t) {
        let n = Ds(e)
          , r = ms(e, -n / e.length)
          , i = e.entryHeight ?? bs(e, 0) + (e.popLaunch === `manual` ? -.5 : .12) - cc(r.x, r.z)
          , o = us(e)
          , s = a.sin(o) * .5
          , c = a.cos(o) * .5
          , l = e.popLaunch ? cc(r.x + s, r.z + c) - cc(r.x - s, r.z - c) : 0;
        t = {
            height: i,
            power: (a.tan((e.popAngle ?? 24) * a.PI / 180) - l) * (Ss(e) - n) / i
        },
        js.set(e, t)
    }
    return t
}
var Ns = .1
  , Ps = .5
  , Fs = .5
  , Is = 16
  , Ls = [];
function Rs(e, t) {
    let n = null
      , r = 0;
    return i => {
        if (!e.length)
            return Ls;
        if (!n) {
            let i = e.map(t);
            r = a.floor(a.min(...i.map(e => e[0])) / Is);
            let o = Array.from({
                length: a.floor(a.max(...i.map(e => e[1])) / Is) - r + 1
            }, () => []);
            e.forEach( (e, t) => {
                for (let n = a.floor(i[t][0] / Is); n <= a.floor(i[t][1] / Is); n++)
                    o[n - r].push(e)
            }
            ),
            n = o
        }
        let o = a.floor(i / Is) - r;
        return o === o ? n[o] ?? Ls : e
    }
}
var zs = Rs(Za.filter(e => e.popLaunch === `manual`), e => [e.z - Ds(e) - 2, e.z])
  , Bs = Rs(Za, e => [e.z - (e.entryRun ?? 20) - 4, e.z + e.length + 20])
  , Vs = Rs(Qa, e => [e.z - e.run - (e.approach ?? (e.main ? 64 : 42)), e.z + e.table + e.landing])
  , Hs = Rs(Qa, e => [e.z - e.run - (e.mound ? 20 : 12), e.z + e.table + e.landing + 15])
  , Us = Rs($a, e => [e.start - e.approach, e.end + e.exit]);
function Ws(e, t) {
    return zs(t).some(n => {
        if (n.popLaunch !== `manual` || t > n.z || t < n.z - Ds(n) - 2)
            return !1;
        let r = hs(n, e, t)
          , i = r.t * n.length + Ds(n);
        return i > -1.5 && i < 1 && a.abs(r.side) < 3.2
    }
    )
}
function Gs(e, t) {
    let n = 0;
    for (let r of Bs(t)) {
        if (t < r.z - (r.entryRun ?? 20) - 4 || t > r.z + r.length + 20)
            continue;
        let i = hs(r, e, t)
          , o = i.t * r.length;
        if (r.entry === `transfer` && o < 0)
            continue;
        let s = Ss(r);
        if (o < -s || o > r.length + 14 || a.abs(i.side) > 4.2)
            continue;
        let c = r.height + gs[r.profile](0) + ys(r, 0), l = F((3.2 - a.abs(i.side)) / 1.6), u;
        if (r.entry === `pop`) {
            let e = Ms(r)
              , t = Ds(r);
            if (r.popLaunch && o <= -t) {
                let n = (o + s) / (s - t);
                u = e.height * (F(n) + (n * n * n - n * n) * e.power)
            } else
                u = o <= -t ? e.height * a.pow((o + s) / (s - t), e.power) : e.height * (1 - F((o + t) / (r.popLaunch === `manual` ? Ps : 1.4)))
        } else
            u = r.entry === `transfer` ? 0 : c * (o <= 0 ? F(1 + o / s) : 1 - F(o / 3));
        let d = o - r.length
          , f = (r.exitLanding === !1 ? 0 : 1) * F((d + .5) / 3) * (1 - F((d - 2) / 12)) * a.min(.42, a.max(0, r.height + gs[r.profile](1) - .3))
          , p = F((o - 2) / 5) * (1 - F((o - r.length + (r.exitLanding === !1 ? 5 : 3)) / 5)) * a.exp(-a.pow((a.abs(i.side) - 2.6) / .9, 2)) * .22;
        n = a.max(n, (u + f) * l + p)
    }
    return n
}
function Ks(e, t) {
    let n = 0;
    for (let r of eo) {
        let i = F((t - r.start + 16) / 14) * (1 - F((t - r.end - 4) / 16));
        n = a.max(n, i * (1 - F((a.abs(e - ro(r, t)) - r.halfWidth) / 10)))
    }
    for (let r of Oo)
        n = a.max(n, (1 - F((a.abs(e - r.x) - r.width / 2 - 3) / 8)) * (1 - F((a.abs(t - r.z) - r.depth / 2 - 3) / 8)));
    return n
}
var qs = (e, t) => {
    let n = a.min(.8, e, t);
    return a.max(e, t) + (n > 0 ? a.pow(a.max(0, 1 - a.abs(e - t) / n), 2) * n * .25 : 0)
}
  , Js = .65
  , Ys = .3
  , Xs = .35
  , Zs = .5
  , Qs = .12
  , $s = .4
  , ec = .5
  , tc = new WeakMap;
function nc(e, t, n) {
    let r = n - e.z
      , i = e.mound;
    if (r < -e.run)
        return 0;
    let o = tc.get(e);
    if (!o) {
        let t = e.z - e.run;
        o = vr(e.run, e.lipLength, e.lipAngle, N(t + .5) - N(t - .5)),
        tc.set(e, o)
    }
    let s, c;
    if (r <= 0)
        s = a.max(0, N(e.z - e.run) + o.at(r + e.run) - N(n)),
        c = s * i.height / e.height;
    else {
        let t = P((r - e.table) / e.landing, 0, 1)
          , o = t * t * t * (35 + t * (-105 + t * (126 + t * (-70 + 15 * t))))
          , l = Bo(Ho(t), o, i.landingBias ?? 0)
          , u = i.height + (i.levelLanding ? N(e.z) - N(n) : 0);
        c = (u - (i.drop ? a.min(i.drop, u) * F((r - e.table) / ec) : 0)) * (1 - l),
        s = c + (e.height - i.height) * (1 - F(r / Js))
    }
    let l = a.abs(t - Xo(e, n))
      , u = e.width / 2
      , d = 1 - P((l - u) / .55, 0, 1)
      , f = 1 - P((l - u - (i.shoulder ?? 3)) / (i.wall ?? 4), 0, 1);
    return (c + (s - c) * d) * f
}
function rc(e, t) {
    let n = 0;
    for (let r of Vs(t)) {
        let i = t - r.z
          , o = r.approach ?? (r.main ? 64 : 42);
        if (i < -r.run - o || i > r.table + r.landing)
            continue;
        if (r.mound) {
            n = qs(n, nc(r, e, t));
            continue
        }
        let s = a.abs(e - Xo(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * F(i / r.table) : 0
          , l = r.foundation ?? (r.main ? 2 : .9)
          , u = Bo(9, 2.4, F((i + r.run) / (r.run * .7)))
          , d = F((r.width / 2 + c + (i > .65 ? 9 : u) - s) / (i > .65 ? 9 : u))
          , f = l * F((i + r.run + o) / o) * (1 - F((i - 2) / (r.table * .55))) * F((r.width / 2 + 12 - s) / 7);
        if (i < -r.run)
            n = qs(n, f);
        else if (i <= 0) {
            let e = r.z - r.lipLength
              , o = a.tan(r.lipAngle * a.PI / 180)
              , s = r.height - o * r.lipLength + N(r.z) - N(e)
              , c = (o - (N(e + .5) - N(e - .5))) * (r.run - r.lipLength) / (s - l)
              , u = i >= -r.lipLength ? r.height + o * i + N(r.z) - N(t) : l + a.pow((i + r.run) / (r.run - r.lipLength), a.max(1.5, c)) * (s - l);
            f = a.max(f, u * d),
            n = qs(n, f)
        } else {
            let e = F(i / r.table)
              , t = 1 - Ho((i - r.table) / r.landing)
              , o = N(r.z) + r.height + r.landingRise - N(r.z + r.table)
              , s = e * t * o
              , c = r.height * (1 - F(i / Js))
              , l = a.max(0, 1 - a.abs(c - s) / .8);
            n = qs(n, a.max(f, (a.max(c, s) + l * l * .2) * d))
        }
    }
    return n
}
function ic(e, t) {
    let n = e - M(t)
      , r = 0;
    for (let e of to) {
        let i = (t - e.z) / e.radiusZ;
        if (a.abs(i) > 2.8)
            continue;
        let o = (n - e.offset) / e.radiusX;
        r += e.height * a.exp(-o * o * 1.5 - i * i * 1.8)
    }
    return r
}
function ac(e, t) {
    let n = 0;
    for (let r of Us(t)) {
        let i = a.abs(e - M(t) - r.offset);
        if (i > r.halfWidth + r.cut || t < r.start - r.approach || t > r.end + r.exit)
            continue;
        let o = F((t - r.start + r.approach) / r.approach) * (1 - F((t - r.end) / r.exit))
          , s = (r.height + (r.level === void 0 ? 0 : N(r.level) - N(t)) + (r.stepRise ?? 0) * F((t - r.start - 13) / 20) - (r.descent ? r.descent.drop * P((t - r.descent.start) / (r.descent.end - r.descent.start), 0, 1) : 0)) * o;
        if (r.downhillApproach && t < r.start) {
            let e = r.start - r.approach
              , n = P((t - e) / r.approach, 0, 1)
              , i = N(e)
              , o = N(r.level ?? r.start) + r.height
              , c = a.min(0, (o - i) / r.approach)
              , l = P(N(e + .5) - N(e - .5), c * 3, 0)
              , u = r.level === void 0 ? P(N(r.start + .5) - N(r.start - .5), c * 3, 0) : 0
              , d = n * n
              , f = d * n
              , p = (2 * f - 3 * d + 1) * i + (f - 2 * d + n) * r.approach * l + (-2 * f + 3 * d) * o + (f - d) * r.approach * u;
            s = a.max(0, p - N(t))
        }
        n = a.max(n, s * (1 - P((i - r.halfWidth) / r.cut, 0, 1)))
    }
    for (let r of eo) {
        if (r.branch === void 0 || t < r.start - 50 || t > r.end + 16)
            continue;
        let i = 1 - F((a.abs(e - ro(r, t)) - r.halfWidth - 2) / 7);
        if (!i)
            continue;
        let o = F((t - r.start + 50) / 34) * (1 - F((t - r.end + 4) / 20))
          , s = N(r.start - 16) + 1.2 - (t - r.start + 16) * .075;
        n = a.max(n, P(s - N(t), 0, 3.5) * o * i)
    }
    return n
}
function oc(e, t) {
    let n = 0;
    for (let r of no) {
        let i = a.abs(t - r.z) / r.radiusZ;
        if (i >= 1)
            continue;
        let o = a.abs(e - M(t) - r.offset) / r.radiusX;
        o < 1 && (n = a.max(n, r.height * (1 - F(i)) * (1 - F(o))))
    }
    return n
}
function sc(e, t) {
    let n = 0;
    for (let r of Hs(t)) {
        let i = t - r.z
          , o = r.mound ? 20 : 12;
        if (i < -r.run - o || i > r.table + r.landing + 15)
            continue;
        let s = a.abs(e - Xo(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * F(i / r.table) : 0;
        n = a.max(n, F((i + r.run + o) / 16) * (1 - F((i - r.table - r.landing + 8) / 23)) * (1 - F((s - r.width / 2 - c - 2) / 12)))
    }
    return a.max(n, Ks(e, t))
}
function cc(e, t) {
    let n = a.abs(e + 102);
    if (n <= 6)
        return N(t);
    let r = e - M(t)
      , i = ka(e, t)
      , o = F((i - 18) / 26)
      , s = o && (a.sin(e * .081 + t * .029) * .9 + a.sin(t * .082 - e * .049) * .6) * o
      , c = a.pow(a.max(0, a.abs(r) - 76), 1.37) * .018
      , l = 0;
    for (let e of Lo) {
        let n = (t - e) / 23;
        a.abs(n) < 1 && (l += (1 + a.cos(n * a.PI)) * 1.1 * F((25 - i) / 10))
    }
    let u = F((a.abs(r) - 12) / 25)
      , d = u && a.sin(t * .006) * r * .022 * u
      , f = o && o * (1.35 * a.sin(t * .014 + r * .036) + .55 * a.sin(t * .027 - r * .041))
      , p = a.max(sc(e, t), 1 - F((i - 12) / 6), 1 - F((a.abs(e + 102) - 2.3) / .8))
      , m = o && o * (1.3 * a.sin(t * .021 + r * .05) + .6 * a.sin(t * .041 - r * .07))
      , h = N(t) + c + Ya(r, t) + (s * .55 + f + m + l + d + ic(e, t) * 1.12) * (1 - p * .97) + rc(e, t) + ac(e, t) + oc(e, t);
    if (a.abs(t) < 32 && a.abs(e - (M(0) - 12)) < 26) {
        let n = (1 - F((a.abs(t) - 14) / 18)) * (1 - F((a.abs(e - (M(0) - 12)) - 13) / 13));
        return Bo(h, N(0), n)
    }
    if (a.abs(t - 34) < 30 && a.abs(e - Uo) < 32) {
        let n = e - Uo
          , r = t - 34
          , i = n * Go - r * Ko
          , o = n * Ko + r * Go;
        return Bo(h, qo, (1 - F((a.abs(i) - 15) / 9)) * F((o + 23) / 9) * (1 - F((o - 4) / 10)))
    }
    return Bo(N(t), Xa(e, t, h), F((n - 6) / 7))
}
var lc = 16
  , uc = new Float64Array(3 * lc).fill(NaN)
  , dc = 0;
function I(e, t) {
    for (let n = 0; n < 3 * lc; n += 3)
        if (uc[n] === e && uc[n + 1] === t && (e !== 0 || 1 / uc[n] == 1 / e) && (t !== 0 || 1 / uc[n + 1] == 1 / t))
            return uc[n + 2];
    let n = fc(e, t)
      , r = a.max(n, vc(e, t, n));
    return uc[dc] = e,
    uc[dc + 1] = t,
    uc[dc + 2] = r,
    dc = (dc + 3) % (3 * lc),
    r
}
function fc(e, t) {
    return cc(e, t) + Gs(e, t)
}
var pc = Za.find(e => e.stairs && !e.follow)
  , mc = 1.2
  , hc = 1.5
  , gc = .45
  , _c = ( () => {
    if (!pc?.stairs)
        return null;
    let e = [ms(pc, 0), ms(pc, 1)]
      , t = pc.stairs.width + gc + 2;
    return {
        minX: a.min(e[0].x, e[1].x) - t,
        maxX: a.max(e[0].x, e[1].x) + t,
        minZ: a.min(e[0].z, e[1].z) - t,
        maxZ: a.max(e[0].z, e[1].z) + t
    }
}
)();
function vc(e, t, n) {
    let r = pc
      , i = _c;
    if (!r?.stairs || !i || e < i.minX || e > i.maxX || t < i.minZ || t > i.maxZ)
        return -1 / 0;
    let {width: o, steps: s, clearance: c} = r.stairs
      , l = (r.length - 1) / s
      , u = (r.stairs.railSide === `right` ? 1 : r.stairs.railSide === `left` ? -1 : 0) * (o / 2 - .12)
      , d = hs(r, e, t)
      , f = d.t * r.length
      , p = a.abs(d.side - u) - o / 2
      , m = .5
      , h = m + s * l;
    if (p > gc || f < m - mc || f > h + hc)
        return -1 / 0;
    let g = e => bs(r, P(e, 0, r.length) / r.length) - c
      , _ = f <= m + l ? g(m) : g(f <= h ? f - l : h - l)
      , v = F((f - m + mc) / mc) * (1 - F((f - h) / hc)) * (1 - F(p / gc));
    return n + a.max(0, _ - n) * v
}
function yc(e, t) {
    let n = a.max(0, a.abs(e - M(t)) - 115)
      , r = a.sin(t * .006 + e * .003) * .4 + a.cos(t * .012 - e * .008) * .21 + a.sin(t * .021 + e * .013) * .12;
    return Xa(e, t, N(t) + Ya(e - M(t), t) + a.pow(n, .84) * (.64 + r * .88) + a.max(0, -t - 100) * .54) - 2
}
function bc(e, t=0) {
    return -99 + t
}
function xc(e, t=0, n=12) {
    let r = ((e / ba + t / n * 2) % 2 + 2) % 2
      , i = a.PI * 3 / 2
      , o = r * ya;
    if (a.abs(o - ya) < i) {
        let e = (o - ya + i) / 3;
        return {
            up: r < 1,
            z: -3 * a.sin(e),
            lane: -3 * a.cos(e),
            p: r
        }
    }
    let s = o > 2 * ya - i ? o - 2 * ya : o;
    if (a.abs(s) < i) {
        let e = (s + i) / 3;
        return {
            up: r < 1,
            z: ya + 3 * a.sin(e),
            lane: 3 * a.cos(e),
            p: r
        }
    }
    let c = (r < 1 ? 1 - r : r - 1) * ya
      , l = e => i * (1 - F((e - i) / (50 - i)))
      , u = c - l(c) + l(ya - c);
    return {
        up: r < 1,
        z: u,
        lane: r < 1 ? -3 : 3,
        p: r
    }
}
function Sc(e) {
    let t = Ro[0][1];
    for (let[n,r] of Ro)
        e >= n && (t = r);
    return t
}
var Cc = 6.3
  , wc = 4.2
  , Tc = ks * .5
  , Ec = Cc
  , Dc = Cc * 1.08
  , Oc = Dc * 1.4
  , kc = 6.5
  , Ac = (e, t, n, r, i=28) => Vo(e, t, t ? r ? i : 10 : kc, n)
  , jc = 1.25
  , Mc = 1.5
  , Nc = 25 * a.PI / 180
  , Pc = 1 / 12
  , Fc = 35 * a.PI / 180
  , Ic = .7
  , Lc = .45
  , Rc = (e, t) => a.atan2(a.sin(e - t), a.cos(e - t))
  , zc = class e {
    constructor() {
        this.equipmentDetached = !1,
        this.collisions = null,
        this.collisionStart = new h,
        this.collisionEnd = new h,
        this.collisionVelocity = new h,
        this.collisionOffsets = [new h(0,.28,0), new h(0,.85,0), new h(0,1.47,0)],
        this.phase = `intro`,
        this.paused = !1,
        this.switchStance = !1,
        this.x = M(90),
        this.z = 90,
        this.y = I(this.x, this.z),
        this.speed = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.carveTransfer = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.airTime = 0,
        this.maxAir = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.grabLedger = new Lt,
        this.scoreFactors = null,
        this.lastScoreFactors = null,
        this.spin = 0,
        this.flip = 0,
        this.grabTime = 0,
        this.trickScore = 0,
        this.score = 0,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.butter = new Pt,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.trick = ``,
        this.notice = ``,
        this.noticeTime = 0,
        this.elapsed = 0,
        this.liftTime = 0,
        this.liftClock = 0,
        this.runs = 0,
        this.crashes = 0,
        this.cabinIndex = 0,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.previousSteer = 0,
        this.corkSet = !1,
        this.railPitchHeld = 0,
        this.rollVelocity = 0,
        this.airRotation = new yn,
        this.airOrientation = this.airRotation.orientation,
        this.landingAssist = new Yi,
        this.airLevel = new Zi,
        this.groundTarget = new g,
        this.landingUp = new h,
        this.landingNormal = new h,
        this.stanceTurn = new g,
        this.landingSettling = !1,
        this.ragdoll = new gr(I,na.snowWalls),
        this.crashDuration = 0,
        this.crashSeverity = 0,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.crashTime = 0,
        this.landing = 0,
        this.landingImpact = 0,
        this.landingBoost = 0,
        this.crouch = 0,
        this.grind = !1,
        this.jumpHeld = !1,
        this.charge = 0,
        this.lipGrace = 0,
        this.topSpeed = 0,
        this.skid = 0,
        this.skidSide = 1,
        this.polePhase = 0,
        this.poling = 0,
        this.takeoffKick = 0,
        this.jumpDistance = 0,
        this.lastJumpDistance = 0,
        this.recoveryPushTime = 0,
        this.event = ``,
        this.rail = null,
        this.railT = 0,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.barSave = null,
        this.railHops = [],
        this.railHopPoints = 0,
        this.railTarget = null,
        this.railSteer = 0,
        this.railPresses = 0,
        this.chain = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.airRepeatKey = ``,
        this.chainRepeatKeys = [],
        this.trickTally = new Map,
        this.repeat = 0,
        this.lost = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.board = !1,
        this.airSource = `jump`,
        this.airGrid = en,
        this.ballTaps = 0
    }
    collideWithSnow() {
        if (!na.snowWalls || this.rail || this.crashTime > 0)
            return !1;
        let e = fr(I, this.collisionStart, this) ?? (this.airborne && this.vy < 0 ? fr(I, this, this) : null);
        if (!e)
            return !1;
        let t = a.hypot(this.velocityX, this.velocityZ)
          , n = a.max(0, -this.velocityX * e.nx - this.velocityZ * e.nz);
        this.x = e.x,
        this.z = e.z,
        this.airborne || (this.y = I(this.x, this.z)),
        this.velocityX += e.nx * n,
        this.velocityZ += e.nz * n;
        let r = _r(n, t);
        return r === `fall` || r === `crash` ? (this.landingImpact = n,
        this.beginCrash(n, !1, r),
        !0) : (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && (this.landingSpin = P((e.nx * a.cos(this.heading) - e.nz * a.sin(this.heading)) * n / 16, -.8, .8),
        this.landingFlip = P(-(e.nx * a.sin(this.heading) + e.nz * a.cos(this.heading)) * n / 20, -.6, .6)),
        !1)
    }
    leaveSnowEdge(e) {
        if (!na.snowWalls)
            return;
        let t = pr(I, this.collisionStart, this);
        if (!t)
            return;
        let n = a.hypot(this.velocityX, this.velocityZ);
        this.y = this.collisionStart.y;
        let r = a.cos(this.heading)
          , i = a.sin(this.heading)
          , o = j(t.dx * i + t.dz * r, this.spin, this.edge, new g, t.dx * r - t.dz * i);
        this.takeoff(t.grade * n, n, `ground`, o),
        this.takeoffKick = 0,
        this.railPitchHeld = Number(e.forward) | Number(e.brake) << 1;
        let s = Ws(this.collisionStart.x, this.collisionStart.z);
        s && !e.jump && this.jumpHeld && (this.vy += 3.6 + this.charge * 2.6),
        this.lipGrace = s && e.jump ? Ns : 0,
        this.lipGrace || (this.charge = 0)
    }
    collideWithPark() {
        if (!this.collisions || this.rail || this.crashTime > 0)
            return !1;
        this.collisionEnd.set(this.x, this.y, this.z),
        this.collisionVelocity.set(this.velocityX, this.airborne ? this.vy : 0, this.velocityZ);
        let e = this.collisionVelocity.length()
          , t = this.airborne ? -1 : Za.findIndex(e => {
            let t = hs(e, this.x, this.z)
              , n = us(e);
            return e.entry === `ride` && t.t >= -.7 / e.length && t.t < 0 && a.abs(t.side) < e.width / 2 + .1 && this.y >= bs(e, 0) - .65 && this.velocityX * a.sin(n) + this.velocityZ * a.cos(n) > 0
        }
        )
          , n = this.collisions.move(this.collisionStart, this.collisionEnd, this.collisionVelocity, this.collisionOffsets, .27, t >= 0 ? `rail-${t}` : ``);
        if (!n.touched)
            return !1;
        this.x = this.collisionEnd.x,
        this.y = this.collisionEnd.y,
        this.z = this.collisionEnd.z,
        this.velocityX = this.collisionVelocity.x,
        this.velocityZ = this.collisionVelocity.z,
        this.airborne && (this.vy = this.collisionVelocity.y);
        let r = _r(n.impact, e);
        if (r === `fall` || r === `crash`)
            return this.landingImpact = n.impact,
            this.beginCrash(n.impact, !1, r),
            this.notice = `BAIL`,
            !0;
        if (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && !this.airborne) {
            let e = n.normal.x * a.cos(this.heading) - n.normal.z * a.sin(this.heading)
              , t = n.normal.x * a.sin(this.heading) + n.normal.z * a.cos(this.heading);
            this.landingSpin = P(e * n.impact / 16, -.8, .8),
            this.landingFlip = P(-t * n.impact / 20, -.6, .6)
        }
        return !1
    }
    get trickEvent() {
        let e = this.event;
        if (!e || e === `arrive`)
            return null;
        let t = e === `land` && !this.rail || e === `butter`;
        return {
            t: this.elapsed,
            kind: e,
            text: e === `crash` || t ? this.notice : this.chain.length ? this.trick : ``,
            score: e === `crash` ? this.lost : t ? this.lastScore : 0,
            impact: this.landingImpact
        }
    }
    toLobby() {
        this.butter.reset(),
        this.railPitchHeld = 0,
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `intro`,
        this.paused = !1,
        this.crashTime = 0,
        this.recovery = 0,
        this.airborne = !1,
        this.rail = null,
        this.grind = !1,
        this.x = M(90),
        this.z = 90,
        this.y = I(this.x, this.z),
        this.speed = 0,
        this.vy = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.turnRate = 0,
        this.skid = 0,
        this.crouch = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spin = 0,
        this.flip = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.landingPrepare = 0,
        this.trick = ``,
        this.trickScore = 0,
        this.notice = ``,
        this.noticeTime = 0,
        this.liftTime = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.switchStance = !1,
        this.clearChain()
    }
    boardLift(e) {
        if (this.butter.reset(),
        !(this.phase !== `intro` && this.phase !== `finished`)) {
            if (this.phase = `gondola`,
            this.liftTime = 0,
            this.speed = 0,
            this.paused = !1,
            this.liftClock = e ?? 0,
            this.cabinIndex = 0,
            e !== void 0) {
                let t = 1 / 0;
                for (let n = 0; n < 12; n++) {
                    let r = xc(e, n);
                    r.up && r.p < t && (t = r.p,
                    this.cabinIndex = n)
                }
            }
            this.airborne = !1,
            this.grind = !1,
            this.spin = 0,
            this.flip = 0,
            this.edge = 0,
            this.crouch = 0,
            this.placeOnTow()
        }
    }
    placeOnTow() {
        let e = xc(this.liftClock, this.cabinIndex)
          , t = xc(this.liftClock + .03, this.cabinIndex);
        this.z = e.z,
        this.x = bc(e.z, e.lane),
        this.y = I(this.x, this.z),
        this.heading = a.atan2(bc(t.z, t.lane) - this.x, t.z - this.z),
        this.travelHeading = this.heading,
        this.speed = ya / ba
    }
    arrive() {
        Object.assign(this, new e, {
            liftClock: this.liftClock,
            liftTime: this.liftTime,
            cabinIndex: this.cabinIndex,
            runs: this.runs,
            collisions: this.collisions
        }),
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `skiing`,
        this.z = 20,
        this.x = -7,
        this.y = I(this.x, 20),
        this.speed = 3,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = a.atan(Ta(20)),
        this.travelHeading = this.heading,
        this.edge = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.elapsed = 0,
        this.score = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.crashes = 0,
        this.crashTime = 0,
        this.landingImpact = 0,
        this.landing = 0,
        this.landingBoost = 0,
        this.switchStance = !1,
        this.trick = ``,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.topSpeed = 0,
        this.spin = 0,
        this.flip = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.charge = 0,
        this.jumpHeld = !1,
        this.skid = 0,
        this.poling = 0,
        this.polePhase = 0,
        this.lastJumpDistance = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.trickTally.clear(),
        this.lost = 0,
        this.notice = `FIND YOUR LINE`,
        this.noticeTime = 3,
        this.event = `arrive`
    }
    fastTravel() {
        if (this.phase !== `gondola` || this.paused)
            return;
        let e = (1 - xc(this.liftClock, this.cabinIndex).p) * ba;
        this.liftClock += e,
        this.liftTime += e,
        this.arrive()
    }
    recover() {
        this.butter.reset(!0),
        this.lastScoreFactors = null,
        this.phase === `skiing` && (this.railPitchHeld = 0,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.x = M(this.z),
        this.y = I(this.x, this.z),
        this.vy = 0,
        this.lateral = 0,
        this.speed = 5,
        this.airborne = !1,
        this.spin = 0,
        this.flip = 0,
        this.crashTime = 0,
        this.skid = 0,
        this.travelHeading = a.atan(Ta(this.z)),
        this.heading = this.travelHeading,
        this.edge = 0,
        this.turnRate = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.notice = `BACK ON TRACK`,
        this.noticeTime = 2)
    }
    rideOutButter() {
        let e = ss(this.x, this.z, this.heading);
        this.butter.release(this, j(e.slope, this.spin, this.edge, this.airOrientation, e.crossSlope)),
        this.flipTightness = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.spinWindup = 0;
        let t = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length
          , n = a.round(this.butter.entryPoints * ge(t));
        this.butter.entryPoints = 0,
        !(n <= 0) && (this.lastScore = n,
        this.score += n,
        this.runScore.tricks += n,
        this.trickTally.set(`BUTTER`, (this.trickTally.get(`BUTTER`) ?? 0) + 1),
        n > this.bestCombo && (this.bestCombo = n,
        this.bestTrick = this.butter.entry),
        this.notice = `STOMPED. ${this.butter.entry}`,
        this.noticeTime = 3,
        this.event = `butter`)
    }
    takeoff(e, t=this.speed, n=`jump`, r) {
        this.railPitchHeld = 0,
        this.lipGrace = 0;
        let i = ss(this.x, this.z, this.heading, this.grind)
          , o = this.landingSettling ? this.airOrientation.clone() : r ?? j(i.slope, this.spin, this.edge, new g, i.crossSlope)
          , s = this.butter.launch(this, o);
        this.speed = t,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.airborne = !0,
        this.vy = e + s.pop,
        this.airTime = 0,
        this.spin = 0,
        this.flip = 0,
        this.corkSet = !1,
        this.airRotation.reset(0, 0, o),
        this.rollVelocity = 0,
        this.landingAssist.reset(),
        this.landingSettling = !1,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.spinVelocity = s.spin,
        this.flipVelocity = s.flip,
        this.velocityZ = this.speed * a.cos(this.travelHeading),
        this.velocityX = this.speed * a.sin(this.travelHeading),
        this.grabTime = 0,
        this.grabLedger.reset(),
        this.scoreFactors = null,
        this.maxAir = 0,
        this.jumpDistance = 0,
        this.trickScore = this.projectChain(0, 0, 0, 0),
        this.trick = this.chainText(``),
        this.event = `jump`,
        this.takeoffKick = 1,
        this.airSource = n,
        this.airGrid = en,
        this.rail = null,
        this.grind = !1,
        this.lost = 0
    }
    mountRail(e, t, n, r=0) {
        this.butter.reset(),
        this.landingSettling = !1,
        this.landingAssist.reset();
        let i = ps(e, t)
          , o = a.atan2(a.sin(this.travelHeading - i), a.cos(this.travelHeading - i))
          , s = a.atan2(a.sin(n - i), a.cos(n - i));
        this.spin = 0,
        this.spinTightness = 0,
        this.rail = e,
        this.railT = P(t, 0, 1),
        this.grind = !0,
        this.airborne = !1,
        this.vy = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.railHops = [],
        this.railHopPoints = 0,
        this.railSpinVelocity = r,
        this.railTarget = null,
        this.railPresses = 0,
        this.railSpin = s,
        this.railSpinTravel = 0,
        this.switchStance = !1,
        this.skid = 0,
        this.charge = 0,
        this.speed = a.max(9, this.speed * a.max(.35, a.cos(o))),
        this.travelHeading = this.heading = i,
        this.velocityX = this.speed * a.sin(i),
        this.velocityZ = this.speed * a.cos(i);
        let c = ms(e, this.railT);
        this.x = c.x,
        this.z = c.z,
        this.y = bs(e, this.railT)
    }
    chainText(e) {
        return [...this.chain, e].filter(Boolean).join(` → `)
    }
    railName() {
        return [this.railSwaps ? `RAIL ${this.railSwaps * 90}` : `RAIL SLIDE`, ...this.railHops].join(` + `)
    }
    barPoints() {
        return Oe(this.railTime, this.railSwaps) + this.railHopPoints
    }
    hopValue(e) {
        let t = this.airRotation.judge.result(!1, !0, tn).rotations;
        if (t < 90 || e.length >= 2)
            return null;
        let n = `HOP ${t}`
          , r = (this.trickTally.get(n) ?? 0) + this.chainRepeatKeys.filter(e => e === n).length;
        return {
            name: n,
            points: a.round(t / 90 * 450 * he(r))
        }
    }
    projectChain(e, t, n, r, i=0) {
        let o = _e(this.chainLinks + r);
        return this.chainButter + i + a.round((this.chainTricks + e) * o) + a.round((this.chainGrabs + t) * o) + a.round((this.chainRails + n) * o)
    }
    pushAirLink() {
        this.chainButter += this.butterPoints,
        this.butterPoints > 0 && this.chainRepeatKeys.push(`BUTTER`),
        this.butter.entryPoints = 0,
        this.chainTricks += a.round(this.airPoints * he(this.repeat)),
        this.chainGrabs += this.grabPoints,
        this.airName && this.chain.push(this.airName),
        this.airIsLink && this.airRepeatKey && this.chainRepeatKeys.push(this.airRepeatKey),
        this.airIsLink && this.chainLinks++,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    pushRailLink() {
        this.chainRails += this.barPoints(),
        this.chain.push(this.railName()),
        this.chainLinks++
    }
    clearChain() {
        this.scoreFactors = null,
        this.chain = [],
        this.chainRepeatKeys = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    judgeAir(e=!1, t=!1) {
        if (!e && this.barSave && hs(this.barSave.r, this.x, this.z).t <= 1) {
            let e = this.hopValue(this.barSave.railHops)
              , t = this.chain.length - 1;
            this.trick = [...this.chain.slice(0, t), [this.chain[t], ...e ? [e.name] : []].join(` + `)].join(` → `),
            this.trickScore = this.projectChain(0, 0, e?.points ?? 0, 0);
            return
        }
        let n = t || this.velocityZ > .5 && (this.airSource !== `ground` || this.airTime >= 1.05 && this.maxAir >= 1.3)
          , r = this.airRotation.judge.result(this.switchStance, e, t ? tn : this.airGrid, this.board)
          , i = t ? `ON` : this.airSource === `rail` ? `OFF` : ``
          , o = r.name && i ? `${r.name} ${i}` : r.name
          , s = this.grabLedger.namesOn(this.board)
          , c = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length;
        this.butterPoints = a.round(this.butter.entryPoints * ge(c)),
        this.airName = [this.butterPoints > 0 ? this.butter.entry : ``, ...n ? [o, ...s] : []].filter(Boolean).join(` + `);
        let l = Ee({
            airTime: this.airTime,
            maxAir: this.maxAir,
            ...r,
            switchStance: this.switchStance
        });
        this.airRepeatKey = n ? (r.type && i ? `${r.type} ${i}` : r.type) || `STRAIGHT AIR` : ``,
        this.repeat = this.airRepeatKey ? (this.trickTally.get(this.airRepeatKey) ?? 0) + this.chainRepeatKeys.filter(e => e === this.airRepeatKey).length : 0,
        this.airPoints = n ? l.total : 0,
        this.grabPoints = n ? De(this.grabLedger.time, s.length, l.rotation, he(this.repeat), this.grabLedger.longest) : 0,
        this.airIsLink = n && (this.airTime >= .5 || o !== `` || s.length > 0),
        this.scoreFactors = n ? {
            turns: l.turns,
            grabs: s.length,
            grabMultiplier: Ce(s.length, this.grabLedger.longest),
            lineMultiplier: _e(this.chainLinks + +!!this.airIsLink),
            offAxis: r.offAxis,
            switchStance: this.switchStance,
            flips: l.flips
        } : null,
        this.trickScore = this.projectChain(a.round(this.airPoints * he(this.repeat)), this.grabPoints, 0, +!!this.airIsLink, this.butterPoints),
        this.trick = this.trickScore > 0 ? this.chainText(this.airName) : ``
    }
    tapBall() {
        for (let e of Za) {
            if (this.z < e.z - (e.entryRun ?? 20) - 4 || this.z > e.z + e.length + 20 || e.feature !== `sphere` || this.z < e.z - 6 || this.z > e.z + e.length + 6)
                continue;
            let t = ms(e, .5)
              , n = ms(e, 0)
              , r = e.length / 2
              , i = cc(n.x, n.z) + e.height
              , o = this.x - t.x
              , s = this.y - i
              , c = this.z - t.z
              , l = a.hypot(o, s, c);
            if (l > r + .3 || l < 1e-6 || s < r * .35)
                continue;
            let u = o / l
              , d = s / l
              , f = c / l
              , p = this.velocityX * u + this.vy * d + this.velocityZ * f;
            if (-p > .5 * a.hypot(this.velocityX, this.vy, this.velocityZ))
                continue;
            if (this.x = t.x + u * (r + Ys),
            this.y = i + d * (r + Ys),
            this.z = t.z + f * (r + Ys),
            p >= 0)
                return !0;
            let m = 1 * p
              , h = this.vy;
            this.velocityX -= m * u,
            this.vy -= m * d,
            this.velocityZ -= m * f;
            let g = a.hypot(this.velocityX, this.vy, this.velocityZ)
              , _ = g > 1e-6 ? a.max(0, 1 + Qs * p / g) : 1;
            return this.velocityX *= _,
            this.vy *= _,
            this.velocityZ *= _,
            this.vy > h && (this.vy = h + (this.vy - h) * $s),
            this.speed = a.hypot(this.velocityX, this.velocityZ),
            this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
            this.ballTaps++,
            !0
        }
        return !1
    }
    landOnRail(e=!1) {
        let t = a.abs(this.flipVelocity) > .1;
        for (let n of Za) {
            if (this.z < n.z - 24 || this.z > n.z + n.length + 20)
                continue;
            let r = hs(n, this.x, this.z)
              , i = r.t * n.length
              , o = n.entry === `pop`;
            if (i < (o ? -.45 : 0) || n.feature === `sphere` || r.t > 1 || a.abs(r.side) > n.width / 2 + .5)
                continue;
            let s = bs(n, r.t);
            if (e && (n.popLaunch === `ballistic` || n.popLaunch === `manual`) || (e ? !o && !n.catchRising || i > 3 || t || this.y > s + .1 || this.y < s - .35 : this.y > s + .05 || this.y < s - (o && i < 3 ? .35 : .75)))
                continue;
            if (this.airRotation.upright < .45)
                return this.landingImpact = a.max(2, -this.vy),
                this.beginCrash(this.landingImpact),
                !0;
            let c = this.heading + this.airRotation.landingYaw + (this.switchStance ? a.PI : 0);
            return this.barSave?.r === n ? (this.resumeBar(n, r.t, c),
            !0) : (this.judgeAir(!0, !0),
            this.pushAirLink(),
            this.landedJumps++,
            this.totalAirTime += this.airTime,
            this.lastJumpDistance = this.jumpDistance,
            this.landingImpact = 0,
            this.landing = .6,
            this.mountRail(n, r.t, c, this.spinVelocity),
            this.event = `land`,
            this.spin = 0,
            this.flip = 0,
            this.rollVelocity = 0,
            this.trick = this.chainText(this.railName()),
            this.trickScore = this.projectChain(0, 0, 0, 0),
            this.flipVelocity = 0,
            this.flipTightness = 0,
            this.spinVelocity = 0,
            this.spinTightness = 0,
            this.landingPrepare = 1,
            !0)
        }
        return !1
    }
    resumeBar(e, t, n) {
        let r = this.barSave;
        this.barSave = null,
        this.chain.pop(),
        this.chainLinks--,
        this.chainRails -= r.rails;
        let i = this.hopValue(r.railHops)
          , a = this.airTime;
        this.mountRail(e, t, n, this.spinVelocity),
        this.railTime = r.railTime + a,
        this.railPresses = r.railPresses,
        this.railSpinTravel = r.railSpinTravel,
        this.railSwaps = r.railSwaps,
        this.railHops = i ? [...r.railHops, i.name] : r.railHops,
        this.railHopPoints = r.railHopPoints + (i?.points ?? 0),
        i && this.chainRepeatKeys.push(i.name),
        this.landing = .3,
        this.landingImpact = 0,
        this.event = ``,
        this.spin = 0,
        this.flip = 0,
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipTightness = 0,
        this.spinVelocity = 0,
        this.spinTightness = 0,
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, this.barPoints(), 1)
    }
    shiftAcross(e, t) {
        let n = us(e);
        this.x += a.cos(n) * t,
        this.z -= a.sin(n) * t
    }
    funnelToRail(e, t) {
        for (let n of Za) {
            if (this.z < n.z - (n.entryRun ?? 20) - 4 || this.z > n.z + n.length + 20 || n.entry !== `ride`)
                continue;
            let r = hs(n, this.x, this.z)
              , i = r.t * n.length
              , o = Ss(n);
            if (i < -o || i >= 0 || a.abs(r.side) > 1.5)
                continue;
            let s = Rc(this.travelHeading, us(n));
            if (a.abs(s) > Nc || this.speed < 4 || t.steer * a.sign(r.side) > .3)
                return;
            let c = F((i + o) / o);
            this.shiftAcross(n, -a.sign(r.side) * a.min(a.abs(r.side), Pc * c * this.speed * e)),
            this.travelHeading -= s * (1 - a.exp(-3 * c * e));
            return
        }
    }
    funnelInAir(e) {
        for (let t of Za) {
            if (this.z < t.z - 24 || this.z > t.z + t.length + 20)
                continue;
            let n = hs(t, this.x, this.z)
              , r = n.t * t.length;
            if (t.feature === `sphere`)
                continue;
            let i = t.entry === `pop` && r >= -Ds(t) && r <= 3;
            if (n.t < -.02 && !i || n.t > 1 || a.abs(n.side) > 1)
                continue;
            let o = this.y - bs(t, P(n.t, 0, 1));
            if (!(!i && (this.vy >= 0 || o < -.2 || o > -this.vy * .45)) && !(a.abs(Rc(this.travelHeading, us(t))) > Fc)) {
                this.shiftAcross(t, -a.sign(n.side) * a.min(a.abs(n.side), Ic * e));
                return
            }
        }
    }
    popOffKicker(e, t, n) {
        for (let n of Za) {
            if (this.z < n.z - (n.entryRun ?? 20) - 4 || this.z > n.z + n.length + 20 || n.entry !== `pop` || n.popLaunch === `manual` || this.speed < 5)
                continue;
            let r = hs(n, this.x, this.z)
              , i = Ds(n);
            if (hs(n, e, t).t * n.length >= -i || r.t * n.length < -i || Ms(n).height * F((3.2 - a.abs(r.side)) / 1.6) < .4)
                continue;
            let o = us(n)
              , s = ms(n, -i / n.length)
              , c = {
                x: s.x + a.cos(o) * r.side,
                z: s.z - a.sin(o) * r.side
            }
              , l = a.hypot(this.velocityX, this.velocityZ)
              , u = l * a.max(.2, a.cos(Rc(this.travelHeading, o)))
              , d = (bs(n, .1) - bs(n, 0)) / (.1 * n.length)
              , f = I(c.x, c.z)
              , p = a.max(.3, -r.t * n.length)
              , m = bs(n, 0) - d * p - f
              , h = p / a.max(u, 1)
              , _ = a.max(a.sqrt(2 * ks * (m + Ts)), (m - .1) / h + ks * h / 2)
              , v = n.popLaunch === `ballistic`
              , y = (n.popAngle ?? 24) * a.PI / 180
              , b = v ? this.speed * a.cos(y) : l
              , x = v ? this.speed * a.sin(y) : _ + d * u;
            this.y = f,
            this.takeoff(x, b, `jump`, j(x / b, this.spin, this.edge, new g, 0)),
            this.charge = 0;
            return
        }
    }
    slide(e, t) {
        let n = this.rail;
        this.grind = !0,
        this.railTime += e;
        let r = P(this.railT, 0, 1)
          , i = a.max(0, r - .02)
          , o = a.min(1, r + .02)
          , s = (bs(n, o) - bs(n, i)) / ((o - i) * n.length);
        this.speed = a.max(9, this.speed - Tc * s / a.hypot(1, s) * e),
        this.railT += this.speed * e / n.length;
        let c = P(this.railT, 0, 1)
          , l = ms(n, c);
        this.x = l.x,
        this.z = l.z,
        this.y = bs(n, c);
        let u = ps(n, c);
        this.travelHeading = this.heading = u,
        this.velocityX = this.speed * a.sin(u),
        this.velocityZ = this.speed * a.cos(u),
        this.turnRate = 0,
        this.lateral = 0,
        this.skid = 0;
        let d = a.abs(t.steer) > .06 ? P(t.steer, -1, 1) : 0
          , f = a.sign(d);
        f && f !== this.railSteer && this.railPresses < 2 && (this.railPresses++,
        this.railTarget = (this.railTarget ?? a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2)) + f * a.PI / 2),
        this.railSteer = f;
        let p;
        if (this.railTarget !== null) {
            let t = this.railTarget - this.railSpin;
            p = a.sign(t) * a.min(a.abs(t), wc * e),
            this.railSpinVelocity = p / e,
            a.abs(t - p) < 1e-6 && (this.railTarget = null,
            this.railSpinVelocity = 0)
        } else
            this.railSpinVelocity = Vo(this.railSpinVelocity, 0, 1.65, e),
            p = this.railSpinVelocity * e;
        if (this.railSpin += p,
        this.railSpinTravel += a.abs(p),
        this.railTarget === null && a.abs(this.railSpinVelocity) < .45) {
            let t = a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2);
            this.railSpin = Vo(this.railSpin, t, 4.8, e)
        }
        let m = a.floor((this.railSpinTravel + .12) / (a.PI / 2));
        m > this.railSwaps && (this.railSwaps = a.min(m, 2)),
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, this.barPoints(), 1),
        this.scoreFactors = {
            turns: 0,
            grabs: 0,
            grabMultiplier: 1,
            lineMultiplier: _e(this.chainLinks + 1),
            offAxis: !1,
            switchStance: !1
        },
        t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
        !t.jump && this.jumpHeld ? this.dismount(4.6 + this.charge * 3.4, !0, t) : this.railT >= (n.feature === `sphere` ? .5 : 1) && this.dismount(.5, !1, t)
    }
    dismount(e, t, n) {
        let r = this.rail
          , i = this.railSpin
          , o = this.railSpinVelocity
          , s = P(this.railT, 0, 1)
          , c = .02
          , l = (bs(r, a.min(1, s + c)) - bs(r, a.max(0, s - c))) / ((a.min(1, s + c) - a.max(0, s - c)) * r.length);
        this.barSave = {
            r,
            railTime: this.railTime,
            railSwaps: this.railSwaps,
            railSpinTravel: this.railSpinTravel,
            railPresses: this.railPresses,
            railHops: this.railHops,
            railHopPoints: this.railHopPoints,
            rails: this.barPoints()
        },
        this.pushRailLink(),
        this.rail = null,
        this.grind = !1;
        let u = j(l, i, 0, new g);
        this.takeoff(this.speed * l + e, this.speed, `rail`, u),
        this.airGrid = a.abs(a.round(i / (a.PI / 2))) % 2 ? nn : en,
        this.airRotation.reset(0, i, u),
        this.spinVelocity = o,
        this.charge = 0,
        t || (this.event = `dismount`,
        this.railPitchHeld = Number(n.forward) | Number(n.brake) << 1)
    }
    faceplant() {
        Nt(this.airOrientation),
        this.beginCrash(this.landingImpact),
        this.notice = `FACEPLANT`
    }
    beginCrash(e, t=!1, n) {
        if (this.crashTime > 0)
            return;
        this.equipmentDetached = !1,
        this.lastScoreFactors = null,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.crashSeverity = P(n ? e / 42 * .8 + a.max(0, this.y - I(this.x, this.z)) / 45 * .2 : this.speed / 43 * .35 + e / 42 * .45 + this.maxAir / 45 * .2, .12, 1);
        let r = n ? n === `fall` : !t && e < 16 && this.maxAir < 5.5 && this.speed < 27;
        this.crashDuration = r ? .8 + this.crashSeverity * .4 : 1.35 + this.crashSeverity * 1.35,
        this.crashTime = this.crashDuration,
        this.recovery = 0,
        this.ragdoll.start(this.x, this.y, this.z, this.heading, this.spin + (this.switchStance ? a.PI : 0), this.flip, this.velocityX, this.velocityZ, e, this.flipVelocity, this.spinVelocity, this.airOrientation, this.switchStance ? a.PI : 0, t, r),
        this.crashes++,
        this.airborne = !1,
        this.landing = 0,
        this.landingBoost = 0,
        this.event = `crash`,
        this.rail = null,
        this.grind = !1,
        this.lost = this.trickScore,
        this.notice = t ? `LANDED FLAT` : `BAIL`,
        this.noticeTime = this.crashDuration,
        this.trick = ``,
        this.trickScore = 0,
        this.clearChain()
    }
    updateCrash(e) {
        this.ragdoll.collisions = this.collisions,
        this.crashTime = a.max(0, this.crashTime - e),
        this.recovery = 1 - P(this.crashTime / (this.ragdoll.gentle ? .45 : .6), 0, 1),
        this.ragdoll.update(e, this.crashTime < (this.ragdoll.gentle ? .55 : .75)),
        this.equipmentDetached = this.crashTime > 0 && this.ragdoll.shedsEquipment;
        let t = this.ragdoll.nodes.Hips.p
          , n = P(t.z, -22, ya)
          , r = P(t.x, M(n) - 123, M(n) + 123);
        this.ragdoll.translate(r - t.x, n - t.z),
        this.x = r,
        this.z = n,
        this.y = I(r, n),
        this.velocityX = this.ragdoll.velocity.x,
        this.velocityZ = this.ragdoll.velocity.z,
        this.speed = a.min(na.maxSpeed, a.hypot(this.velocityX, this.velocityZ)),
        this.speed > 1.5 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        this.crashTime === 0 && (this.speed = P(this.speed, 4, this.ragdoll.gentle ? 32 : 23),
        this.vy = 0,
        this.spin = 0,
        this.flip = 0,
        this.edge = 0,
        this.skid = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.switchStance = !1,
        this.heading = this.travelHeading,
        this.recovery = 0,
        this.crouch = .5,
        this.poling = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.polePhase = 0,
        this.recoveryPushTime = 6,
        this.velocityX = a.sin(this.travelHeading) * this.speed,
        this.velocityZ = a.cos(this.travelHeading) * this.speed,
        this.notice = `BACK ON YOUR FEET`,
        this.noticeTime = 2)
    }
    update(e, t) {
        if (this.board = !!t.board,
        this.event = ``,
        !this.airborne && !this.grind && (this.barSave = null),
        this.grind || (this.railSteer = a.abs(t.steer) > .06 ? a.sign(t.steer) : 0),
        this.crashTime <= 0 && (this.equipmentDetached = !1),
        this.paused)
            return;
        if (this.liftClock += e,
        this.noticeTime = a.max(0, this.noticeTime - e),
        this.landing = a.max(0, this.landing - e * 3.4),
        this.landingBoost = a.max(0, this.landingBoost - e),
        this.takeoffKick = a.max(0, this.takeoffKick - e * 4),
        this.phase === `gondola`) {
            this.liftTime += e,
            this.placeOnTow(),
            xc(this.liftClock, this.cabinIndex).p >= .999999999 && this.arrive();
            return
        }
        if (this.phase !== `skiing`)
            return;
        if (this.railPitchHeld &= Number(t.forward) | Number(t.brake) << 1,
        this.elapsed += e,
        this.crashTime > 0) {
            this.butter.reset(),
            this.updateCrash(e);
            return
        }
        this.recoveryPushTime = this.speed >= 18 ? 0 : a.max(0, this.recoveryPushTime - e);
        let n = this.airborne;
        this.landingSpin = Vo(this.landingSpin, 0, 5, e),
        this.landingFlip = Vo(this.landingFlip, 0, 5, e);
        let r = this.butter.step(this, t, e, !this.airborne && (t.butter || this.butter.active) ? os(this.x, this.z, this.travelHeading) : 0);
        this.butter.ready && !this.rail && this.rideOutButter();
        let i = !r && t.brake && !this.airborne && !this.rail;
        this.forwardHeld = !r && t.forward && !this.airborne && !this.rail && !i ? this.forwardHeld + e : 0,
        this.tucking = !r && t.forward && !this.airborne && !this.rail && !i && (this.switchStance || this.forwardHeld >= 1.25 || this.speed >= 18),
        this.crouch = Vo(this.crouch, !this.airborne && (this.tucking || t.jump) ? 1 : 0, 9, e),
        a.abs(t.steer) > .15 && (this.skidSide = a.sign(t.steer)),
        this.skid = Vo(this.skid, i ? this.skidSide * P(this.speed / 9, 0, 1) : 0, 7, e);
        let o = !r && a.abs(t.steer) > .05 ? P(t.steer, -1, 1) : 0;
        this.carveTransfer *= a.exp(-6 * e),
        !this.airborne && !i && this.previousSteer * o < 0 && (this.carveTransfer = a.abs(this.edge) * P(this.speed / 18, 0, 1)),
        this.previousSteer = this.airborne || !o && a.abs(this.edge) < .1 ? 0 : o || this.previousSteer;
        let s = P(13 / a.max(this.speed, 1), .45, 1)
          , l = o ? (11 + this.carveTransfer * 11) * s : 9
          , u = F((1 - this.landing) / .68);
        this.edge = Vo(this.edge, !this.airborne && !this.rail ? o * u : 0, l, e);
        let d = !r && t.forward && !this.switchStance && !this.tucking && !this.airborne && !this.rail && !i && !t.jump;
        if (this.poling = Vo(this.poling, +!!d, 12, e),
        this.airborne)
            this.velocityX *= a.exp(-.003 * e),
            this.velocityZ *= a.exp(-.003 * e),
            this.speed = a.hypot(this.velocityX, this.velocityZ),
            this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
            this.turnRate = 0,
            this.lateral = 0;
        else {
            this.landingSettling && !this.rail && !r && (this.spinVelocity += (-100 * this.spin - 20 * this.spinVelocity) * e,
            this.spin += this.spinVelocity * e),
            r || (this.spinWindup = Vo(this.spinWindup, 0, 10, e),
            this.spinTightness = Vo(this.spinTightness, 0, 14, e)),
            this.landingPrepare = this.butter.active ? -1 : 0;
            let t = ka(this.x, this.z) > 24 && sc(this.x, this.z) < .5
              , n = this.edge * (.8 + P(this.speed / 85, 0, .44)) * (1 + this.carveTransfer * .14) * (i ? .7 : 1);
            this.turnRate = this.rail ? 0 : n,
            this.travelHeading += this.turnRate * e,
            r && (this.travelHeading += At(os(this.x, this.z, this.travelHeading + a.PI / 2), this.speed, 9.81 * 1.7) * e);
            let o = os(this.x, this.z, this.travelHeading);
            if (na.snowWalls && o < -1) {
                let e = {
                    x: this.x + a.sin(this.travelHeading) * .5,
                    y: this.y,
                    z: this.z + a.cos(this.travelHeading) * .5
                }
                  , t = pr(I, this, e);
                t && (o = t.grade)
            }
            let s = -o
              , c = (this.tucking ? .0024 : .0028) * (t ? 1.38 : 1)
              , l = 9.81 * a.sin(a.atan(s)) * 1.7 - .13 - c * this.speed * this.speed - a.abs(this.edge) * .38;
            if (this.rail || (this.speed = P(this.speed + (l - (i ? 17 : 0)) * e, 0, na.maxSpeed)),
            d) {
                let t = this.polePhase;
                this.polePhase = (this.polePhase + e / .95) % 1,
                t < .34 && this.polePhase >= .34 && (this.speed = a.min(na.maxSpeed, this.speed + 1.65 * P(1 - this.speed / 52, .25, 1)),
                this.recoveryPushTime > 0 && (this.speed += a.min(3, a.max(0, 13 - this.speed))),
                this.recoveryPushTime = 0)
            } else
                this.poling < .02 && (this.polePhase = 0);
            let u = this.skid * this.speed * .1
              , f = this.speed / a.hypot(1, o);
            this.velocityZ = f * a.cos(this.travelHeading) - u * a.sin(this.travelHeading),
            this.velocityX = f * a.sin(this.travelHeading) + u * a.cos(this.travelHeading),
            this.lateral = this.edge * this.speed * .35 + u
        }
        this.topSpeed = a.max(this.topSpeed, this.speed * 3.6);
        let p = a.atan2(a.sin(this.travelHeading + this.skid * .72 - this.heading), a.cos(this.travelHeading + this.skid * .72 - this.heading));
        this.heading += p * (1 - a.exp(-12 * e));
        let m = this.x
          , h = this.z;
        this.collisionStart.set(this.x, this.y, this.z),
        this.x += this.velocityX * e,
        this.z += this.velocityZ * e,
        this.z = a.max(-22, this.z);
        let _ = M(this.z);
        if (a.abs(this.x - _) > 126) {
            let t = a.sign(this.x - _);
            this.x = _ + t * 126;
            let n = this.velocityX - Ta(this.z) * this.velocityZ;
            t * n > 0 && (this.velocityX -= n,
            this.speed *= a.exp(-e * 2.8))
        }
        if (!this.airborne && !this.rail && this.funnelToRail(e, t),
        !(!this.airborne && this.collideWithSnow())) {
            if (!this.airborne && !this.rail)
                for (let e of Za) {
                    if (this.z < e.z - 24 || this.z > e.z + e.length + 20)
                        continue;
                    let t = hs(e, this.x, this.z);
                    if (t.t >= 0 && t.t <= 1 && a.abs(t.side) < e.width / 2 + .35 && this.y >= bs(e, t.t) - .4) {
                        this.mountRail(e, t.t, this.heading + this.spin + (this.switchStance ? a.PI : 0), this.spinVelocity);
                        break
                    }
                }
            if (this.rail)
                this.slide(e, t);
            else if (!this.airborne) {
                for (let e of Qa)
                    if (h <= e.z && this.z > e.z && a.abs(this.x - M(this.z) - e.offset) < e.width / 2 + 1 && this.speed > 7) {
                        let t = M(this.z) + e.offset
                          , n = a.max(t - e.width / 2 + .6, a.min(t + e.width / 2 - .6, this.x));
                        if (this.y < I(n, e.z - .01) - 1)
                            continue;
                        let r = Zo(e, this.speed, this.charge, this.travelHeading)
                          , i = ss(n, e.z - .01, this.heading)
                          , o = j(i.slope, this.spin, this.edge, new g, i.crossSlope);
                        this.y = I(this.x, e.z - .01),
                        this.takeoff(r.vertical, r.horizontal, `jump`, o),
                        this.velocityX += e.transfer * .22,
                        this.charge = 0;
                        break
                    }
                if (this.airborne || this.popOffKicker(m, h, t),
                this.airborne || this.leaveSnowEdge(t),
                !this.airborne && (this.y = I(this.x, this.z),
                t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
                !t.jump && this.jumpHeld)) {
                    let e = rs(this.x, this.z, this.velocityX, this.velocityZ, this.charge);
                    this.takeoff(e.vertical, a.hypot(e.velocityX, e.velocityZ), `ground`),
                    this.velocityX = e.velocityX,
                    this.velocityZ = e.velocityZ,
                    this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
                    this.charge = 0
                }
            }
            if (!(!this.airborne && this.collideWithPark())) {
                if (this.airborne) {
                    let r = !n;
                    if (this.lipGrace > 0 && (this.lipGrace = a.max(0, this.lipGrace - e),
                    t.jump ? this.charge = a.min(1, this.charge + e * 1.7) : (this.vy += 3.6 + this.charge * 2.6,
                    this.lipGrace = 0),
                    this.lipGrace || (this.charge = 0)),
                    r || (this.vy -= ks * e,
                    this.y += this.vy * e,
                    this.airTime += e,
                    this.jumpDistance += a.hypot(this.velocityX, this.velocityZ) * e),
                    this.collideWithSnow())
                        return;
                    if (!r) {
                        let e = cr(I, Qa, this.collisionStart, this);
                        e && (this.x = e.x,
                        this.y = e.y,
                        this.z = e.z)
                    }
                    let i = I(this.x, this.z)
                      , o = this.y <= i ? ss(this.x, this.z, 0) : null
                      , s = o ? o.slope : I(this.x, this.z + .5) - I(this.x, this.z - .5)
                      , c = o ? o.crossSlope : I(this.x + .5, this.z) - I(this.x - .5, this.z)
                      , l = s * this.velocityZ + c * this.velocityX
                      , u = l - this.vy
                      , d = u > .1 ? a.max(0, this.y - i) / u : 1 / 0;
                    this.landingPrepare = Vo(a.max(0, this.landingPrepare), 1 - F((d - .1) / .45), 14, e);
                    let f = a.abs(t.steer) > .06 ? P(t.steer, -1, 1) : 0
                      , p = Number(t.forward && !(this.railPitchHeld & 1)) - Number(t.brake && !(this.railPitchHeld & 2));
                    this.airRotation.controlPitch(p, this.switchStance && !t.board, this.flipVelocity, this.rollVelocity);
                    let m = a.abs(t.airRoll ?? 0) > .06 ? P(t.airRoll ?? 0, -1, 1) : 0;
                    this.spinTightness = Vo(this.spinTightness, a.abs(f), f ? 12 : 10, e),
                    this.airGrab = Vo(this.airGrab, +!!t.grab, 12, e);
                    let h = Bo(Cc, Bo(Dc, Oc, this.airGrab), this.spinTightness)
                      , g = f * h
                      , _ = p * h;
                    this.spinReversal = f * this.spinVelocity < 0 ? .12 : a.max(0, this.spinReversal - e),
                    (!p || a.sign(p) !== this.flipReversal) && (this.flipReversal = 0),
                    p * this.flipVelocity < -.12 && (this.flipReversal = a.sign(p)),
                    a.abs(_ - this.flipVelocity) < h * .05 && (this.flipReversal = 0),
                    this.spinVelocity = Ac(this.spinVelocity, g, e, this.spinReversal > 0 || this.flipReversal !== 0, this.flipReversal ? 3.2 : 28),
                    this.flipVelocity = Ac(this.flipVelocity, _, e, this.flipReversal !== 0, 3.2),
                    this.rollVelocity = Ac(this.rollVelocity, m * h, e, m * this.rollVelocity < 0, 5),
                    this.flipReversal && (this.spinVelocity = a.sign(this.spinVelocity) * a.min(a.abs(this.spinVelocity), a.abs(this.flipVelocity)));
                    let v = this.flipReversal ? P(this.spinVelocity / h, -1, 1) : f;
                    this.spinWindup = Vo(this.spinWindup, v, f ? 17 : 8, e);
                    let y = this.flipReversal ? P(this.flipVelocity / h, -1, 1) : p;
                    this.flipWindup = Vo(this.flipWindup, y, p ? 24 : 9, e),
                    this.flipTightness = Vo(this.flipTightness, a.abs(y), p ? 14 : 10, e),
                    !p && a.abs(this.flipVelocity) < .015 && (this.flipVelocity = 0),
                    !f && a.abs(this.spinVelocity) < .015 && (this.spinVelocity = 0),
                    this.spin += this.spinVelocity * e,
                    this.flip += this.flipVelocity * e,
                    !m && a.abs(this.rollVelocity) < .015 && (this.rollVelocity = 0),
                    t.cork && this.airTime <= .25 && (this.corkSet = !0);
                    let b = !!t.cork && this.corkSet;
                    this.airRotation.update(this.flipVelocity, this.spinVelocity, e, b, this.rollVelocity, !!t.over && b);
                    let x = !!(f || p || m || t.grab)
                      , S = c * a.sin(this.heading) + s * a.cos(this.heading)
                      , C = !x && Za.some(e => {
                        for (let t of [0, .25, .5, .75]) {
                            let n = hs(e, this.x + this.velocityX * t, this.z + this.velocityZ * t);
                            if (n.t >= 0 && n.t <= 1 && a.abs(n.side) < e.width / 2 + .7 && this.y >= bs(e, n.t) - .1)
                                return !0
                        }
                        return !1
                    }
                    )
                      , w = a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 ? this.spinVelocity / kc : 0
                      , T = this.airRotation.upright > .64 && a.abs(this.airRotation.flipAngle) < .5 && this.airRotation.inversions === 0 && !this.airRotation.corked && !p && !m && !t.cork && a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 && !C
                      , ee = t.grab && T
                      , te = !!(f || p || m)
                      , E = this.landingAssist.update(e, this.airOrientation, this.airRotation.landingYaw, C ? 0 : S, d, this.airRotation.speed, te || t.grab && !ee || this.airTime < .22 && this.vy > 0, C, C ? 0 : c * a.cos(this.heading) - s * a.sin(this.heading), w, ee);
                    if (this.airRotation.correct(E),
                    T && (a.abs(this.spinVelocity) > .5 || f) && E.x === 0 && E.y === 0 && E.z === 0) {
                        let t = Number.isFinite(d) ? a.max(0, a.min(1, (1.5 - d) / 1.2)) : 0;
                        this.airRotation.correct(this.airLevel.update(e, this.airOrientation, this.airRotation.landingYaw, this.airTime, C ? 0 : S, C ? 0 : c * a.cos(this.heading) - s * a.sin(this.heading), t))
                    }
                    t.grab && (this.grabTime += e),
                    this.grabLedger.update(e, t.grab, t.grabStyle ?? 0, !!t.board),
                    this.maxAir = a.max(this.maxAir, this.y - I(this.x, this.z)),
                    this.judgeAir(),
                    r || this.funnelInAir(e);
                    let ne = !r && this.landOnRail(this.vy >= 0)
                      , re = !ne && !r && this.tapBall();
                    if (!ne && !re && this.collideWithPark())
                        return;
                    if (!ne && !r && this.y <= i) {
                        this.landingImpact = a.max(0, l - this.vy) / a.hypot(1, c, s),
                        this.y = i,
                        this.airborne = !1,
                        this.landing = 1,
                        this.lastJumpDistance = this.jumpDistance;
                        let e = this.airRotation.landingYaw
                          , t = a.abs(a.sin(e));
                        this.landingNormal.set(-c * a.cos(this.heading) + s * a.sin(this.heading), 1, -c * a.sin(this.heading) - s * a.cos(this.heading)).normalize();
                        let n = this.landingUp.set(0, 1, 0).applyQuaternion(this.airOrientation).dot(this.landingNormal)
                          , r = a.acos(P(n, -1, 1))
                          , o = !this.butter.catchLanding(this, this.airOrientation, this.landingNormal) && n < .25 && (n < 0 || this.landingImpact > 3 || this.airTime > .3)
                          , u = this.landingImpact > 33 && this.airTime > .35
                          , d = o || u ? null : this.butter.landingFor(this)
                          , f = !o && !u && d !== `faceplant`
                          , p = !1;
                        if (f) {
                            this.judgeAir(!0),
                            this.lastScoreFactors = this.scoreFactors;
                            let n = a.round((e + w) / a.PI);
                            a.abs(n) % 2 == 1 && (this.switchStance = !this.switchStance,
                            this.airOrientation.multiply(this.stanceTurn.set(0, 1, 0, 0)));
                            let i = t >= .3 || Cn(this.airOrientation, this.landingNormal)
                              , o = !i && this.airTime > .65
                              , s = o && this.speed > 3 && this.velocityZ > .5 && l < -.15
                              , c = a.max(0, (this.speed * this.speed + this.vy * l) / (a.hypot(this.speed, l) || 1));
                            this.speed = P(c * (o ? 1 : .975 - t * .065 - P(r, 0, 1) * .045) + (s ? 2.6 : 0), 0, na.maxSpeed),
                            this.landingBoost = s ? 2.2 : 0,
                            this.pushAirLink();
                            let u = _e(this.chainLinks)
                              , f = i ? pe(t) : 1;
                            f < 1 && this.lastScoreFactors && (this.lastScoreFactors = {
                                ...this.lastScoreFactors,
                                landing: f
                            });
                            let m = a.round(a.round(this.chainTricks * u) * f) + this.chainButter
                              , h = a.round(this.chainGrabs * u * f)
                              , g = a.round(this.chainRails * u * f)
                              , _ = o && this.chainLinks > 0 ? 450 + a.round((m - this.chainButter + h + g) * de) : 0;
                            this.lastScore = m + h + g + _,
                            this.score += this.lastScore,
                            this.runScore.tricks += m,
                            this.runScore.grabs += h,
                            this.runScore.rails += g,
                            this.runScore.landings += _;
                            for (let e of this.chainRepeatKeys)
                                this.trickTally.set(e, (this.trickTally.get(e) ?? 0) + 1);
                            let v = this.chain.join(` → `);
                            this.landedJumps++,
                            this.cleanLandings += Number(o),
                            this.totalAirTime += this.airTime,
                            this.lastScore > this.bestCombo && (this.bestCombo = this.lastScore,
                            this.bestTrick = v || `STRAIGHT AIR`),
                            this.landingSpin = Rc(e, n * a.PI),
                            this.landingFlip = r * (a.sign(this.landingUp.z) || 1),
                            p = d === `press` && this.butter.pressLanding(this, this.landingImpact),
                            this.spin = this.landingSpin,
                            this.spinVelocity = p ? this.butter.velocity : P(this.spinVelocity, -3, 3),
                            this.landingSettling = !p,
                            this.notice = this.lastScore > 0 ? v ? `${i ? `SAVED IT` : `STOMPED`}. ${v}` : o ? `CLEAN LANDING` : `` : ``,
                            this.noticeTime = this.notice ? 3 : 0,
                            this.event = `land`,
                            this.clearChain()
                        } else
                            d === `faceplant` ? this.faceplant() : this.beginCrash(this.landingImpact, u && !o);
                        this.vy = 0,
                        this.flip = 0,
                        this.trick = ``,
                        this.rollVelocity = 0,
                        this.flipVelocity = 0,
                        this.flipTightness = 0,
                        this.spinTightness = 0,
                        this.landingPrepare = 1,
                        p && this.butter.pose(this)
                    }
                }
                if (!this.airborne && !n && this.landingSettling && !this.grind && this.crashTime <= 0) {
                    j(os(this.x, this.z, this.heading), this.spin, this.edge, this.groundTarget, os(this.x, this.z, this.heading + a.PI / 2));
                    let t = f(this.airOrientation, this.groundTarget);
                    c(this.airOrientation, this.groundTarget, a.min(8 * e, t * (1 - a.exp(-18 * e)))),
                    t < .035 && a.abs(this.spin) < .002 && a.abs(this.spinVelocity) < .02 && (this.landingSettling = !1,
                    this.spin = 0,
                    this.spinVelocity = 0)
                }
                this.jumpHeld = t.jump,
                this.z >= va && this.crashTime <= 0 && (this.z = va,
                this.phase = `finished`,
                this.speed = 0,
                this.runs++)
            }
        }
    }
}
  , Bc = new h(0,1,0)
  , Vc = (e, t, n) => a.max(t, a.min(n, e))
  , Hc = class {
    get shedsEquipment() {
        return !this.gentle && this.age >= (this.bracing ? .13 : .025)
    }
    constructor(e) {
        this.collisions = null,
        this.nodes = {},
        this.links = [],
        this.velocity = new h,
        this.rest = {},
        this.origin = new h,
        this.before = new h,
        this.q = new g,
        this.target = new g,
        this.stance = new g,
        this.normal = new h,
        this.along = new h,
        this.right = new h,
        this.forward = new h,
        this.basis = new _,
        this.delta = new h,
        this.inverse = new g,
        this.offsets = [],
        this.collisionStart = new h,
        this.bends = {},
        this.identity = new g,
        this.bend = new g,
        this.slideHeading = 0,
        this.yawCarry = 0,
        this.slideOnBack = !1,
        this.contacts = 0,
        this.age = 0,
        this.bracing = !1,
        this.impact = 0,
        this.gentle = !1,
        this.ground = e;
        let t = (e, t, n, r, i, a=1) => {
            this.rest[e] = new h(t,n,r),
            this.nodes[e] = {
                p: new h,
                old: new h,
                frame: new h,
                radius: i,
                mass: a
            },
            this.offsets.push(new h)
        }
        ;
        t(`Hips`, 0, .99, 0, .19, 7),
        t(`Chest`, 0, 1.43, 0, .21, 8),
        t(`Neck`, 0, 1.65, 0, .1, 2),
        t(`Head`, 0, 1.83, 0, .16, 3);
        for (let e of [`L`, `R`]) {
            let n = e === `L` ? -1 : 1;
            t(`Leg_${e}`, n * .14, .99, 0, .14, 3),
            t(`Knee_${e}`, n * .14, .54, .045, .13, 2),
            t(`Foot_${e}`, n * .14, .14, 0, .11, 2),
            t(`Arm_${e}`, n * .245, 1.49, 0, .14, 2),
            t(`Elbow_${e}`, n * .44, 1.245, -.012, .1),
            t(`Hand_${e}`, n * .47, .94, .09, .08);
            for (let[t,n] of [[`Leg_${e}`, `Knee_${e}`], [`Knee_${e}`, `Foot_${e}`], [`Arm_${e}`, `Elbow_${e}`], [`Elbow_${e}`, `Hand_${e}`]])
                this.bends[n] = {
                    parent: t,
                    rest: this.rest[n].clone().sub(this.rest[t]),
                    from: new g
                }
        }
        let n = [`Hips`, `Chest`, `Leg_L`, `Leg_R`, `Arm_L`, `Arm_R`, `Neck`, `Head`];
        for (let e = 0; e < n.length; e++)
            for (let t = e + 1; t < n.length; t++)
                this.links.push({
                    a: n[e],
                    b: n[t],
                    length: this.rest[n[e]].distanceTo(this.rest[n[t]]),
                    minimum: !1
                });
        for (let[e,t] of Object.entries(this.bends))
            this.links.push({
                a: t.parent,
                b: e,
                length: t.rest.length(),
                minimum: !1
            })
    }
    start(e, t, n, r, i, c, l, u, d, f, p, m, g=0, _=!1, v=!1) {
        this.age = 0,
        this.bracing = _,
        this.impact = d,
        this.gentle = v,
        this.contacts = 0,
        m ? s(this.q, 0, r, 0).multiply(m).multiply(o(this.stance, Bc, g)) : s(this.q, c, r + i, 0, `YXZ`),
        this.slideHeading = a.hypot(l, u) > .5 ? a.atan2(l, u) : r,
        this.forward.set(0, 0, 1).applyQuaternion(this.q),
        this.slideOnBack = new h(0,1,0).applyQuaternion(this.q).y > .25 ? this.forward.x * a.sin(this.slideHeading) + this.forward.z * a.cos(this.slideHeading) < 0 : a.cos(g) < 0,
        this.yawCarry = Vc(p * .025, -.18, .18);
        for (let e of Object.values(this.bends))
            e.from.identity();
        this.origin.set(e, t + .99, n),
        this.velocity.set(l * .94, -Vc(d * (v ? .18 : .3), .4, 15), u * .94),
        this.pose(),
        this.support();
        for (let e of Object.values(this.nodes))
            e.old.copy(e.p).addScaledVector(this.velocity, -1 / 120),
            e.frame.copy(e.p)
    }
    seed(e) {
        if (!(!e.Hips || !e.Chest || !e.Leg_L || !e.Leg_R)) {
            this.origin.copy(e.Hips),
            this.right.subVectors(e.Leg_R, e.Leg_L).normalize(),
            this.along.subVectors(e.Chest, e.Hips).normalize(),
            this.forward.crossVectors(this.right, this.along).normalize(),
            this.along.crossVectors(this.forward, this.right).normalize(),
            this.q.setFromRotationMatrix(this.basis.makeBasis(this.right, this.along, this.forward)),
            this.inverse.copy(this.q).invert();
            for (let[t,n] of Object.entries(this.bends))
                !e[t] || !e[n.parent] || (this.delta.subVectors(e[t], e[n.parent]).normalize().applyQuaternion(this.inverse),
                n.from.setFromUnitVectors(n.rest.clone().normalize(), this.delta));
            this.pose(),
            this.support();
            for (let e of Object.values(this.nodes))
                e.old.copy(e.p).addScaledVector(this.velocity, -1 / 120),
                e.frame.copy(e.p)
        }
    }
    pose() {
        let e = 1 - a.exp(-this.age * 9);
        for (let[t,n] of Object.entries(this.nodes)) {
            let i = this.bends[t];
            i ? (r(this.bend.copy(i.from), this.identity, e),
            n.p.copy(i.rest).applyQuaternion(this.bend).applyQuaternion(this.q).add(this.nodes[i.parent].p)) : n.p.copy(this.rest[t]).sub(this.rest.Hips).applyQuaternion(this.q).add(this.origin)
        }
    }
    support() {
        let e = 0;
        for (let t of Object.values(this.nodes))
            e = a.max(e, this.ground(t.p.x, t.p.z) + t.radius - t.p.y);
        if (e <= 0)
            return !1;
        this.origin.y += e;
        for (let t of Object.values(this.nodes))
            t.p.y += e;
        return this.contacts++,
        !0
    }
    update(e, t) {
        if (e <= 0)
            return;
        for (let e of Object.values(this.nodes))
            e.frame.copy(e.p);
        let n = a.max(1, a.ceil(e * 120))
          , i = e / n;
        this.contacts = 0;
        for (let e = 0; e < n; e++) {
            this.age += i,
            this.before.copy(this.origin);
            for (let e of Object.values(this.nodes))
                e.old.copy(e.p);
            let {x: e, z: n} = this.origin;
            this.normal.set(this.ground(e - .3, n) - this.ground(e + .3, n), .6, this.ground(e, n - .3) - this.ground(e, n + .3)).normalize();
            let o = this.slideHeading + this.yawCarry * a.exp(-this.age * 3);
            if (this.along.set(a.sin(o), 0, a.cos(o)).addScaledVector(this.normal, -(this.normal.x * a.sin(o) + this.normal.z * a.cos(o))).normalize(),
            this.forward.copy(this.normal).multiplyScalar(this.slideOnBack ? 1 : -1),
            this.right.crossVectors(this.along, this.forward).normalize(),
            this.target.setFromRotationMatrix(this.basis.makeBasis(this.right, this.along, this.forward)),
            r(this.q, this.target, 1 - a.exp(-(this.gentle ? 10 : this.bracing ? 8 : 7) * i)),
            this.velocity.y -= 17.5 * i,
            this.velocity.multiplyScalar(a.exp(-(t ? this.gentle ? .25 : .5 : .18) * i)),
            this.origin.addScaledVector(this.velocity, i),
            this.pose(),
            this.collisions) {
                let e = 0;
                for (let t of Object.values(this.nodes))
                    this.offsets[e++].subVectors(t.p, this.origin);
                this.collisionStart.copy(this.before),
                this.collisions.move(this.collisionStart, this.origin, this.velocity, this.offsets, .21).touched && (this.contacts++,
                this.pose())
            }
            if (this.support()) {
                let e = this.velocity.dot(this.normal);
                e < 0 && this.velocity.addScaledVector(this.normal, -e);
                let t = this.velocity.length();
                this.velocity.multiplyScalar(a.max(0, 1 - 2.4 * i / a.max(t, .001)))
            }
        }
    }
    sample(e, t, n) {
        let r = this.nodes[e];
        return n.copy(r.frame).lerp(r.p, Vc(t, 0, 1))
    }
    translate(e, t) {
        this.origin.x += e,
        this.origin.z += t;
        for (let n of Object.values(this.nodes))
            for (let r of [n.p, n.old, n.frame])
                r.x += e,
                r.z += t
    }
}
  , Uc = 3960
  , Wc = [[245, 75, .3], [470, 110, .3], [905, 75, .28], [1220, 130, .42], [1500, 100, .34], [2110, 95, .4], [2335, 120, .34], [2920, 130, .34], [3440, 155, .267], [3755, 100, .3]]
  , Gc = .145
  , Kc = Gc * Uc + Wc.reduce( (e, [,t,n]) => e + t * n, 0);
function qc(e) {
    let t = a.max(0, a.min(Uc, e))
      , n = Gc * t
      , r = Gc;
    for (let[e,i,o] of Wc) {
        let s = a.max(0, a.min(1, (t - e + i) / (2 * i)));
        n += o * i * (s - a.sin(s * a.PI * 2) / (a.PI * 2)),
        r += o * .5 * (1 - a.cos(s * a.PI * 2))
    }
    return {
        height: 940 - n * 830 / Kc,
        slope: -r * 830 / Kc
    }
}
var Jc = 4
  , Yc = Array.from({
    length: Uc / Jc + 1
}, (e, t) => qc(t * Jc));
function Xc(e) {
    let t = a.max(0, a.min(Uc, e)) / Jc
      , n = a.min(Yc.length - 2, a.floor(t))
      , r = t - n
      , i = Yc[n]
      , o = Yc[n + 1]
      , s = r * r
      , c = s * r;
    return (2 * c - 3 * s + 1) * i.height + (c - 2 * s + r) * i.slope * Jc + (-2 * c + 3 * s) * o.height + (c - s) * o.slope * Jc
}
var Zc = [[-185, 300, 92, 100, 240], [205, 830, 65, 115, 290], [-200, 1300, 112, 115, 300], [188, 1830, 79, 100, 260], [-210, 2410, 100, 125, 320], [195, 2980, 90, 105, 300], [-190, 3460, 76, 110, 230]];
function Qc(e, t) {
    if (a.abs(e) <= 82 || a.abs(e) > 650 || t < -450 || t > 4310)
        return 0;
    let n = a.max(0, a.min(1, (a.abs(e) - 82) / 80))
      , r = n * n * (3 - 2 * n)
      , i = 0;
    for (let[n,r,o,s,c] of Zc) {
        let l = (t - r) / c;
        if (a.abs(l) > 2.5)
            continue;
        let u = (e - n - a.sin(l * 1.8) * 22) / s;
        i += o * a.exp(-u * u * .85 - l * l * 1.5)
    }
    return i * r
}
var $c = e({
    AIR_ANGLE: () => Au,
    AIR_GRAVITY: () => eu,
    AIR_RATE: () => ju,
    AIR_REACH: () => 1,
    AIR_WINDOW: () => Mu,
    BRANCHES: () => gl,
    COURSE_LENGTH: () => el,
    COURSE_WIDTH: () => 260,
    FINISH_HALF_WIDTH: () => 22,
    FINISH_Z: () => tl,
    FLAT_SLAM: () => 33,
    FLIP_RATE: () => xu,
    FORWARD_TUCK_SPEED: () => 18,
    FORWARD_TUCK_TIME: () => Eu,
    FUNNEL_ANGLE: () => Ou,
    FUNNEL_PULL: () => ku,
    FUNNEL_REACH: () => Du,
    GRAB_SPIN_RATE: () => Cu,
    JIB_SECTIONS: () => Fl,
    JUMPS: () => Sl,
    LIFT_DURATION: () => nl,
    LIFT_SPEED: () => 6,
    LIFT_TOWER_SPACING: () => 190,
    LIP_REACH: () => 1,
    PARK_ENTRY_Z: () => 61,
    POP_CATCH: () => Ql,
    POP_CLEAR: () => Zl,
    POP_CLIMB: () => Ol,
    POP_GAP: () => Yl,
    POP_KICK: () => 24,
    POP_STEP: () => Xl,
    RAILS: () => Ll,
    RAIL_HOPS: () => 2,
    RAIL_LIP: () => Jl,
    RAIL_PULL: () => bu,
    RAIL_SPIN_RATE: () => yu,
    RAIL_SWAPS: () => 2,
    ROLLERS: () => ou,
    SNOW_FORMS: () => lu,
    SPIN_RATE: () => vu,
    SPIN_TURN_RATE: () => Su,
    SkiSimulation: () => Pu,
    UP_RUN: () => 3,
    UP_START: () => Wl,
    ZONES: () => gu,
    baseHeight: () => ul,
    branchOffset: () => yl,
    cabinTravel: () => hu,
    center: () => cl,
    clamp: () => L,
    climbsOut: () => Gl,
    courseTangent: () => ll,
    damp: () => il,
    groundHeight: () => fu,
    groundPop: () => Dl,
    jibGrooming: () => au,
    jibLips: () => iu,
    jibSectionCenter: () => Il,
    jumpCenter: () => Tl,
    jumpStyle: () => Cl,
    lerp: () => rl,
    liftX: () => mu,
    lineDistance: () => bl,
    mountainHeight: () => pu,
    parkGrooming: () => du,
    popClimb: () => jl,
    popLine: () => $l,
    railCrest: () => tu,
    railFrame: () => Hl,
    railHeading: () => Bl,
    railPoint: () => Vl,
    railTop: () => ql,
    rampHeight: () => cu,
    rampLaunch: () => El,
    riderSurface: () => Nl,
    sculptedSnow: () => uu,
    snowGrade: () => Ml,
    terrainHeight: () => z,
    zoneAt: () => _u
})
  , el = Uc
  , tl = el - 32
  , nl = el / 6
  , L = (e, t, n) => a.max(t, a.min(n, e))
  , rl = (e, t, n) => e + (t - e) * n
  , il = (e, t, n, r) => rl(e, t, 1 - a.exp(-n * r))
  , al = e => {
    let t = L(e, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10)
}
  , R = e => {
    let t = L(e, 0, 1);
    return t * t * (3 - 2 * t)
}
  , ol = NaN
  , sl = 0
  , cl = e => Object.is(e, ol) ? sl : (ol = e,
sl = a.sin(e * .0021) * 120 + a.sin(e * .005) * 48)
  , ll = e => cl(e + .5) - cl(e - .5)
  , ul = Xc
  , dl = cl(61)
  , fl = a.atan(ll(61))
  , pl = a.cos(fl)
  , ml = a.sin(fl)
  , hl = ul(53)
  , gl = [{
    start: 410,
    end: 1240,
    offset: -54,
    name: `JIB GARDEN`
}, {
    start: 1370,
    end: 2340,
    offset: 57,
    name: `SIDEQUEST`
}, {
    start: 2490,
    end: 3440,
    offset: -56,
    name: `SNAKE RUN`
}]
  , _l = gl.map( () => NaN)
  , vl = gl.map( () => 0);
function yl(e, t) {
    if (Object.is(e, _l[t]))
        return vl[t];
    let n = gl[t]
      , r = L((e - n.start) / (n.end - n.start), 0, 1);
    return _l[t] = e,
    vl[t] = n.offset * a.pow(a.sin(r * a.PI), 2)
}
var bl = (e, t) => a.min(a.abs(e - cl(t)), ...gl.map( (n, r) => a.abs(e - cl(t) - yl(t, r))))
  , xl = (e, t, n, r={}) => ({
    z: e,
    height: t,
    name: n,
    offset: 0,
    width: 20,
    lipAngle: 22,
    lipLength: 2.5,
    landingRise: -1.5,
    run: 24,
    table: 28,
    landing: 72,
    kind: `kicker`,
    kick: `flow`,
    transfer: 0,
    main: !0,
    ...r
})
  , Sl = [xl(320, 5.2, `FIRST FLIGHT`, {
    width: 19,
    lipAngle: 24,
    run: 24,
    table: 25,
    landing: 68
}), xl(620, 5.6, `THE DOUBLE`, {
    offset: -5,
    lipAngle: 23,
    run: 27,
    table: 26,
    landing: 78
}), xl(1020, 6, `SKYLINE`, {
    offset: 5,
    lipAngle: 24,
    run: 28,
    table: 28,
    landing: 80
}), xl(1410, 10, `BIG AIR`, {
    width: 23,
    kick: `high`,
    lipAngle: 36,
    lipLength: 4,
    landingRise: -2,
    run: 36,
    table: 34,
    landing: 130
}), xl(1820, 6.5, `HIGH ROAD`, {
    offset: -5,
    kind: `step-up`,
    lipAngle: 27,
    landingRise: 1.5,
    table: 24,
    landing: 72
}), xl(2240, 11, `MOON BOOTER`, {
    width: 24,
    kick: `high`,
    lipAngle: 37,
    lipLength: 4.5,
    landingRise: -1,
    run: 39,
    table: 37,
    landing: 128
}), xl(2670, 7, `THE STEP-UP`, {
    kind: `step-up`,
    lipAngle: 29,
    landingRise: 2,
    run: 28,
    table: 25,
    landing: 78
}), xl(3110, 6, `AFTER HOURS`, {
    offset: 4,
    width: 21,
    lipAngle: 23,
    run: 30,
    table: 28,
    landing: 82
}), xl(3660, 10.5, `LAST LIGHT`, {
    width: 24,
    kick: `high`,
    lipAngle: 35,
    lipLength: 4,
    landingRise: -2.5,
    run: 37,
    table: 37,
    landing: 116
}), xl(730, 3.2, `PLAYGROUND`, {
    offset: yl(730, 0),
    width: 12,
    lipAngle: 19,
    run: 16,
    table: 16,
    landing: 42,
    main: !1
}), xl(970, 3.8, `LEFT HIP`, {
    offset: yl(970, 0),
    width: 13,
    lipAngle: 21,
    run: 18,
    kind: `hip`,
    transfer: 7,
    table: 19,
    landing: 62,
    main: !1
}), xl(1680, 4.2, `SIDE HIT`, {
    offset: yl(1680, 1),
    width: 14,
    lipAngle: 21,
    run: 19,
    kind: `hip`,
    transfer: -7,
    table: 21,
    landing: 68,
    main: !1
}), xl(2090, 4.6, `TRANSFER`, {
    offset: yl(2090, 1),
    width: 14,
    lipAngle: 22,
    run: 20,
    kind: `hip`,
    transfer: -9,
    table: 22,
    landing: 70,
    main: !1
}), xl(2880, 3.8, `SNAKE HIP`, {
    offset: yl(2880, 2),
    width: 14,
    lipAngle: 21,
    run: 18,
    kind: `hip`,
    transfer: 8,
    table: 20,
    landing: 48,
    main: !1
}), xl(3290, 5, `REJOIN`, {
    offset: yl(3290, 2),
    width: 15,
    lipAngle: 26,
    run: 22,
    kind: `step-up`,
    landingRise: .8,
    table: 21,
    landing: 58,
    main: !1
})]
  , Cl = e => e.kick === `high` ? `HIGH KICK` : e.kind === `step-up` ? `STEP UP` : e.kind === `hip` ? `HIP` : `FLOW`
  , wl = new Map;
function Tl(e, t) {
    let n = wl.get(e);
    (!n || !Object.is(n.z, e.z)) && wl.set(e, n = {
        z: e.z,
        x: cl(e.z),
        tangent: ll(e.z)
    });
    let r = a.max(0, t - e.z)
      , i = n.x + n.tangent * r;
    return rl(cl(t), i, R(r / e.table)) + e.offset + e.transfer * L(r / 65, 0, 1)
}
function El(e, t, n, r=0) {
    let i = a.atan(a.tan(e.lipAngle * a.PI / 180) * a.max(.2, a.cos(r)));
    return {
        horizontal: t * a.cos(i),
        vertical: t * a.sin(i) + 1.2 + L(n, 0, 1) * 2.2
    }
}
function Dl(e, t, n, r, i) {
    let {slope: o, crossSlope: s} = Nl(e, t, 0)
      , c = (3.6 + L(i, 0, 1) * 2.6) / a.hypot(s, 1, o);
    return jl(e, t, s * n + o * r, a.hypot(n, r)) + c
}
var Ol = a.tan(12 * a.PI / 180);
function kl(e, t) {
    for (let n of Sl)
        if (t >= n.z - n.run && t <= n.z) {
            let r = a.abs(e - Tl(n, t));
            if (r <= n.width / 2 + 1)
                return {
                    jump: n,
                    face: r <= n.width / 2
                }
        }
    return null
}
function Al(e, t) {
    for (let n of Ll) {
        let r = Hl(n, e, t)
          , i = r.t * n.length;
        if (i >= -8.5 && i <= 0 && a.abs(r.side) < 1.6)
            return !0
    }
    return !1
}
function jl(e, t, n, r) {
    if (n <= r * Ol)
        return n;
    let i = kl(e, t);
    if (i?.face || Al(e, t))
        return n;
    if (!i)
        return r * Ol;
    let o = ll(t)
      , s = Nl(Tl(i.jump, t), t, 0);
    return a.min(n, r * a.max(Ol, (s.crossSlope * o + s.slope) / a.hypot(o, 1)))
}
function Ml(e, t, n) {
    let r = a.sin(n) * .5
      , i = a.cos(n) * .5;
    return z(e + r, t + i) - z(e - r, t - i)
}
function Nl(e, t, n, r=!1) {
    let i = z(e + .5, t) - z(e - .5, t)
      , o = z(e, t + .5) - z(e, t - .5)
      , s = 0;
    for (let n of Sl)
        if (t <= n.z && t > n.z - n.lipLength - 3 && a.abs(e - Tl(n, t)) < n.width / 2) {
            s = R((t - n.z + n.lipLength + 3) / 3),
            t >= n.z - n.lipLength + .5 && (o = a.tan(n.lipAngle * a.PI / 180));
            break
        }
    if (r)
        for (let n of Ll) {
            let r = Hl(n, e, t);
            if (r.t >= 0 && r.t <= 1 && a.abs(r.side) < .8) {
                let e = a.max(0, r.t - .01)
                  , t = a.min(1, r.t + .01)
                  , s = Bl(n)
                  , c = (ql(n, t) - ql(n, e)) / ((t - e) * n.length);
                i = a.sin(s) * c,
                o = a.cos(s) * c;
                break
            }
        }
    return {
        slope: i * a.sin(n) + o * a.cos(n),
        crossSlope: i * a.cos(n) - o * a.sin(n),
        lip: s
    }
}
var Pl = (e, t, n, r, i={}) => ({
    z: e,
    offset: t,
    length: n,
    name: r,
    width: .2,
    build: `box`,
    profile: `flat`,
    angle: 0,
    height: 1.7,
    entry: `ride`,
    ...i
})
  , Fl = [{
    name: `THE YARD`,
    start: 90,
    end: 145,
    halfWidth: 41
}, {
    name: `WALL LINE`,
    start: 168,
    end: 235,
    halfWidth: 39
}, {
    name: `FOREST LAB`,
    start: 832,
    end: 902,
    halfWidth: 31,
    branch: 0
}, {
    name: `TRANSFER DECK`,
    start: 1924,
    end: 1984,
    halfWidth: 31,
    branch: 1
}, {
    name: `NIGHT SHIFT`,
    start: 2950,
    end: 3010,
    halfWidth: 31,
    branch: 2
}]
  , Il = (e, t) => cl(t) + (e.branch === void 0 ? 0 : yl(t, e.branch))
  , Ll = [Pl(99, -33, 17, `RAINBOW`, {
    build: `tube`,
    profile: `rainbow`,
    width: .148,
    angle: -7
}), Pl(101, -17, 21, `TWIN BAR`, {
    build: `twin`,
    width: .212,
    height: 1.8,
    angle: -3,
    entry: `pop`
}), Pl(98, 9, 23, `DOWN-FLAT-DOWN`, {
    profile: `down-flat-down`,
    width: .2,
    angle: 3
}), Pl(103, 27, 17, `CANNON`, {
    build: `tube`,
    profile: `cannon`,
    width: .148,
    angle: 7
}), Pl(174, -31, 24, `DOWN MAILBOX`, {
    profile: `down`,
    width: .2,
    height: 1.9,
    angle: -6
}), Pl(176, -15, 22, `FLAT-DOWN`, {
    build: `tube`,
    profile: `down`,
    width: .148,
    angle: -2
}), Pl(173, 8, 27, `UP-FLAT-DOWN`, {
    profile: `kink`,
    width: .2,
    angle: 2
}), Pl(180, 29, 20, `STREET BAR`, {
    width: .2,
    angle: 6,
    entry: `pop`
}), Pl(460, 23, 20, `FLAT BAR`, {
    width: .2
}), Pl(853, yl(853, 0) - 24, 19, `FOREST TUBE`, {
    build: `tube`,
    width: .148,
    angle: -5,
    entry: `pop`
}), Pl(850, yl(850, 0) - 8, 25, `FOREST KINK`, {
    profile: `kink`,
    angle: -2
}), Pl(856, yl(856, 0) + 10, 22, `FOREST FLAT`, {
    width: .2,
    angle: 2,
    entry: `pop`
}), Pl(851, yl(851, 0) + 25, 18, `FOREST CANNON`, {
    build: `tube`,
    profile: `cannon`,
    width: .148,
    angle: 6
}), Pl(1220, 24, 26, `FLAT BAR`, {}), Pl(1570, -25, 24, `TUBE`, {
    build: `tube`,
    width: .148
}), Pl(1938, yl(1938, 1) - 24, 18, `TRANSFER TUBE`, {
    build: `tube`,
    width: .148,
    angle: -5
}), Pl(1941, yl(1941, 1) - 8, 24, `TRANSFER KINK`, {
    profile: `down-flat-down`,
    angle: -2
}), Pl(1937, yl(1937, 1) + 10, 23, `TRANSFER FLAT`, {
    width: .2,
    angle: 2,
    entry: `pop`
}), Pl(1943, yl(1943, 1) + 25, 18, `TRANSFER RAINBOW`, {
    build: `tube`,
    profile: `rainbow`,
    width: .148,
    angle: 6
}), Pl(2430, 25, 29, `TUBE`, {
    build: `tube`,
    width: .148
}), Pl(2964, yl(2964, 2) - 24, 18, `NIGHT TUBE`, {
    build: `tube`,
    width: .148,
    angle: -5
}), Pl(2968, yl(2968, 2) - 8, 25, `NIGHT KINK`, {
    profile: `kink`,
    angle: -2
}), Pl(2965, yl(2965, 2) + 10, 22, `NIGHT FLAT`, {
    width: .2,
    angle: 2
}), Pl(2970, yl(2970, 2) + 25, 17, `NIGHT CANNON`, {
    build: `tube`,
    profile: `cannon`,
    width: .148,
    angle: 6
}), Pl(3500, -23, 30, `FLAT BAR`, {
    width: .2
})]
  , Rl = new WeakMap;
function zl(e) {
    let t = Rl.get(e);
    if (!t) {
        let n = a.atan(ll(e.z)) + e.angle * a.PI / 180;
        t = {
            h: n,
            sin: a.sin(n),
            cos: a.cos(n),
            c: cl(e.z)
        },
        Rl.set(e, t)
    }
    return t
}
var Bl = e => zl(e).h;
function Vl(e, t) {
    let n = zl(e);
    return {
        x: n.c + e.offset + n.sin * e.length * t,
        z: e.z + n.cos * e.length * t
    }
}
function Hl(e, t, n) {
    let r = zl(e)
      , i = t - r.c - e.offset
      , a = n - e.z;
    return {
        t: (i * r.sin + a * r.cos) / e.length,
        side: i * r.cos - a * r.sin
    }
}
var Ul = {
    flat: () => 0,
    kink: e => e < .3 ? .65 * R(e / .3) : e < .62 ? .65 : .65 * (1 - R((e - .62) / .38)),
    down: e => .35 - .6 * e,
    "down-flat-down": e => e < .28 ? .36 * (1 - R(e / .28)) : e < .64 ? 0 : -.25 * R((e - .64) / .36),
    rainbow: e => 1.5 * a.sin(a.PI * e),
    cannon: e => 1.9 * a.pow(R((e - .55) / .45), 1.3)
}
  , Wl = .5
  , Gl = e => e.entry === `ride` && e.profile !== `rainbow`
  , Kl = (e, t) => Gl(e) ? -Wl * (1 - R(t * e.length / 3)) : 0;
function ql(e, t) {
    let n = Vl(e, 0)
      , r = Vl(e, 1)
      , i = L(t, 0, 1);
    return rl(fu(n.x, n.z), fu(r.x, r.z), i) + e.height + Ul[e.profile](i) + Kl(e, i)
}
var Jl = 8.5
  , Yl = 2.5
  , Xl = .8
  , Zl = .35
  , Ql = .45
  , $l = e => ql(e, 0) - (ql(e, .1) - ql(e, 0)) / (.1 * e.length) * Yl
  , eu = 17.5
  , tu = e => e.entry === `pop` ? -Yl : 0
  , nu = new WeakMap;
function ru(e) {
    let t = nu.get(e);
    if (!t) {
        let n = Vl(e, -Yl / e.length)
          , r = $l(e) - Xl - fu(n.x, n.z);
        t = {
            height: r,
            power: a.tan(24 * a.PI / 180) * (Jl - Yl) / r
        },
        nu.set(e, t)
    }
    return t
}
function iu(e, t) {
    let n = 0;
    for (let r of Ll) {
        let i = Hl(r, e, t)
          , o = i.t * r.length;
        if (o < -8.5 || o > r.length + 14 || a.abs(i.side) > 4.2)
            continue;
        let s = r.height + Ul[r.profile](0) + Kl(r, 0), c = R((3.2 - a.abs(i.side)) / 1.6), l;
        if (r.entry === `pop`) {
            let e = ru(r);
            l = o <= -2.5 ? e.height * a.pow((o + Jl) / (Jl - Yl), e.power) : e.height * (1 - R((o + Yl) / 1.4))
        } else
            l = s * (o <= 0 ? R(1 + o / Jl) : 1 - R(o / 3));
        let u = o - r.length
          , d = R((u + .5) / 3) * (1 - R((u - 2) / 12)) * a.min(.42, a.max(0, r.height + Ul[r.profile](1) - .3))
          , f = R((o - 2) / 5) * (1 - R((o - r.length + 3) / 5)) * a.exp(-a.pow((a.abs(i.side) - 2.6) / .9, 2)) * .22;
        n = a.max(n, (l + d) * c + f)
    }
    return n
}
function au(e, t) {
    let n = 0;
    for (let r of Fl) {
        let i = R((t - r.start + 16) / 14) * (1 - R((t - r.end - 4) / 16));
        n = a.max(n, i * (1 - R((a.abs(e - Il(r, t)) - r.halfWidth) / 10)))
    }
    return n
}
var ou = [480, 540, 1510, 1570, 2540, 2600, 3400, 3455]
  , su = (e, t) => {
    let n = a.min(.8, e, t);
    return a.max(e, t) + (n > 0 ? a.pow(a.max(0, 1 - a.abs(e - t) / n), 2) * n * .25 : 0)
}
;
function cu(e, t) {
    let n = 0;
    for (let r of Sl) {
        let i = t - r.z
          , o = r.main ? 64 : 42;
        if (i < -r.run - o || i > r.table + r.landing)
            continue;
        let s = a.abs(e - Tl(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * R(i / r.table) : 0
          , l = R((r.width / 2 + c + 9 - s) / 9);
        if (i < -r.run) {
            let e = (i + r.run + o) / o;
            n = su(n, a.pow(a.sin(e * a.PI), 2) * (r.main ? 2.5 : 1.5) * l)
        } else if (i <= 0) {
            let e = r.z - r.lipLength
              , o = a.tan(r.lipAngle * a.PI / 180)
              , s = r.height - o * r.lipLength + ul(r.z) - ul(e)
              , c = (o - (ul(e + .5) - ul(e - .5))) * (r.run - r.lipLength) / s
              , u = i >= -r.lipLength ? r.height + o * i + ul(r.z) - ul(t) : a.pow((i + r.run) / (r.run - r.lipLength), a.max(1.5, c)) * s;
            n = su(n, u * l)
        } else {
            let e = R(i / r.table)
              , t = 1 - al((i - r.table) / r.landing)
              , o = ul(r.z) + r.height + r.landingRise - ul(r.z + r.table)
              , s = e * t * o
              , c = r.height * (1 - R(i / 7))
              , u = a.max(0, 1 - a.abs(c - s) / .8);
            n = su(n, (a.max(c, s) + u * u * .2) * l)
        }
    }
    return n
}
var lu = [{
    z: 390,
    offset: 69,
    height: 7,
    radiusX: 23,
    radiusZ: 68
}, {
    z: 790,
    offset: 38,
    height: 5,
    radiusX: 14,
    radiusZ: 80
}, {
    z: 1160,
    offset: -81,
    height: 10,
    radiusX: 26,
    radiusZ: 95
}, {
    z: 1530,
    offset: -68,
    height: 8,
    radiusX: 24,
    radiusZ: 95
}, {
    z: 1940,
    offset: -64,
    height: 11,
    radiusX: 25,
    radiusZ: 125
}, {
    z: 2530,
    offset: 63,
    height: 9,
    radiusX: 26,
    radiusZ: 115
}, {
    z: 2960,
    offset: 68,
    height: 12,
    radiusX: 30,
    radiusZ: 115
}, {
    z: 3410,
    offset: -84,
    height: 10,
    radiusX: 28,
    radiusZ: 115
}, {
    z: 3890,
    offset: 69,
    height: 8,
    radiusX: 24,
    radiusZ: 95
}];
function uu(e, t) {
    let n = e - cl(t)
      , r = 0;
    for (let e of lu) {
        let i = (t - e.z) / e.radiusZ;
        if (a.abs(i) > 2.8)
            continue;
        let o = (n - e.offset) / e.radiusX;
        r += e.height * a.exp(-o * o * 1.5 - i * i * 1.8)
    }
    return r
}
function du(e, t) {
    let n = 0;
    for (let r of Sl) {
        let i = t - r.z;
        if (i < -r.run - 12 || i > r.table + r.landing + 15)
            continue;
        let o = a.abs(e - Tl(r, t))
          , s = i > 0 ? (r.kick === `high` ? 13 : 8) * R(i / r.table) : 0;
        n = a.max(n, R((i + r.run + 12) / 16) * (1 - R((i - r.table - r.landing + 8) / 23)) * (1 - R((o - r.width / 2 - s - 2) / 12)))
    }
    return a.max(n, au(e, t))
}
function fu(e, t) {
    let n = e - cl(t)
      , r = bl(e, t)
      , i = R((r - 18) / 26)
      , o = (a.sin(e * .081 + t * .029) * .9 + a.sin(t * .082 - e * .049) * .6) * i
      , s = a.pow(a.max(0, a.abs(n) - 76), 1.37) * .018
      , c = 0;
    for (let e of ou) {
        let n = (t - e) / 23;
        a.abs(n) < 1 && (c += (1 + a.cos(n * a.PI)) * 1.1 * R((25 - r) / 10))
    }
    let l = a.sin(t * .006) * n * .022 * R((a.abs(n) - 12) / 25)
      , u = i * (1.35 * a.sin(t * .014 + n * .036) + .55 * a.sin(t * .027 - n * .041))
      , d = du(e, t)
      , f = i * (1.3 * a.sin(t * .021 + n * .05) + .6 * a.sin(t * .041 - n * .07))
      , p = ul(t) + s + Qc(n, t) + (o * .55 + u + f + c + l + uu(e, t) * 1.12) * (1 - d * .97) + cu(e, t);
    if (a.abs(t) < 32 && a.abs(e - (cl(0) - 12)) < 26) {
        let n = (1 - R((a.abs(t) - 14) / 18)) * (1 - R((a.abs(e - (cl(0) - 12)) - 13) / 13));
        return rl(p, ul(0), n)
    }
    if (a.abs(t - 61) < 30 && a.abs(e - dl) < 32) {
        let n = e - dl
          , r = t - 61
          , i = n * pl - r * ml
          , o = n * ml + r * pl;
        return rl(p, hl, (1 - R((a.abs(i) - 15) / 9)) * (1 - R((a.abs(o) - 4) / 16)))
    }
    return p
}
function z(e, t) {
    return fu(e, t) + iu(e, t)
}
function pu(e, t) {
    let n = a.max(0, a.abs(e - cl(t)) - 115)
      , r = a.sin(t * .006 + e * .003) * .4 + a.cos(t * .012 - e * .008) * .21 + a.sin(t * .021 + e * .013) * .12;
    return ul(t) - 2 + Qc(e - cl(t), t) + a.pow(n, .84) * (.64 + r * .88) + a.max(0, -t - 100) * .54
}
function mu(e, t=0) {
    return cl(e) - 9 - 79 * R(a.min(e, el - e) / 150) + t
}
function hu(e, t=0, n=24) {
    let r = ((e / nl + t / n * 2) % 2 + 2) % 2
      , i = a.PI * 3 / 2
      , o = r * el;
    if (a.abs(o - el) < i) {
        let e = (o - el + i) / 3;
        return {
            up: r < 1,
            z: -3 * a.sin(e),
            lane: -3 * a.cos(e),
            p: r
        }
    }
    let s = o > 2 * el - i ? o - 2 * el : o;
    if (a.abs(s) < i) {
        let e = (s + i) / 3;
        return {
            up: r < 1,
            z: el + 3 * a.sin(e),
            lane: 3 * a.cos(e),
            p: r
        }
    }
    let c = (r < 1 ? 1 - r : r - 1) * el
      , l = e => i * (1 - R((e - i) / (50 - i)))
      , u = c - l(c) + l(el - c);
    return {
        up: r < 1,
        z: u,
        lane: r < 1 ? -3 : 3,
        p: r
    }
}
var gu = [[0, `RAIL YARD`], [300, `SUMMIT PLAYGROUND`], [530, `JIB GARDEN / SKYLINE`], [1260, `BIG AIR / SIDEQUEST`], [2380, `SNAKE RUN`], [3470, `LAST LIGHT`]];
function _u(e) {
    let t = gu[0][1];
    for (let[n,r] of gu)
        e >= n && (t = r);
    return t
}
var vu = 6.3
  , yu = 4.2
  , bu = eu * .5
  , xu = vu
  , Su = vu * 1.08
  , Cu = Su * 1.4
  , wu = 6.5
  , Tu = (e, t, n, r, i=28) => il(e, t, t ? r ? i : 10 : wu, n)
  , Eu = 1.25
  , Du = 1.5
  , Ou = 25 * a.PI / 180
  , ku = 1 / 12
  , Au = 35 * a.PI / 180
  , ju = .7
  , Mu = .45
  , Nu = (e, t) => a.atan2(a.sin(e - t), a.cos(e - t))
  , Pu = class e {
    constructor() {
        this.equipmentDetached = !1,
        this.collisions = null,
        this.collisionStart = new h,
        this.collisionEnd = new h,
        this.collisionVelocity = new h,
        this.collisionOffsets = [new h(0,.28,0), new h(0,.85,0), new h(0,1.47,0)],
        this.phase = `intro`,
        this.paused = !1,
        this.switchStance = !1,
        this.x = cl(90),
        this.z = 90,
        this.y = z(this.x, this.z),
        this.speed = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.carveTransfer = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.airTime = 0,
        this.maxAir = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.grabLedger = new Lt,
        this.scoreFactors = null,
        this.lastScoreFactors = null,
        this.spin = 0,
        this.flip = 0,
        this.grabTime = 0,
        this.trickScore = 0,
        this.score = 0,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.butter = new Pt,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.trick = ``,
        this.notice = ``,
        this.noticeTime = 0,
        this.elapsed = 0,
        this.liftTime = 0,
        this.liftClock = 0,
        this.runs = 0,
        this.crashes = 0,
        this.cabinIndex = 0,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.previousSteer = 0,
        this.corkSet = !1,
        this.rollVelocity = 0,
        this.airRotation = new yn,
        this.airOrientation = this.airRotation.orientation,
        this.landingAssist = new Yi,
        this.airLevel = new Zi,
        this.groundTarget = new g,
        this.landingUp = new h,
        this.landingNormal = new h,
        this.stanceTurn = new g,
        this.landingSettling = !1,
        this.ragdoll = new Hc(z),
        this.crashDuration = 0,
        this.crashSeverity = 0,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.crashTime = 0,
        this.landing = 0,
        this.landingImpact = 0,
        this.landingBoost = 0,
        this.crouch = 0,
        this.grind = !1,
        this.jumpHeld = !1,
        this.charge = 0,
        this.topSpeed = 0,
        this.skid = 0,
        this.skidSide = 1,
        this.polePhase = 0,
        this.poling = 0,
        this.takeoffKick = 0,
        this.jumpDistance = 0,
        this.lastJumpDistance = 0,
        this.recoveryPushTime = 0,
        this.event = ``,
        this.rail = null,
        this.railT = 0,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.barSave = null,
        this.railHops = [],
        this.railHopPoints = 0,
        this.railTarget = null,
        this.railSteer = 0,
        this.railPresses = 0,
        this.chain = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.airRepeatKey = ``,
        this.chainRepeatKeys = [],
        this.trickTally = new Map,
        this.repeat = 0,
        this.lost = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.board = !1,
        this.airSource = `jump`,
        this.airGrid = en
    }
    collideWithPark() {
        if (!this.collisions || this.rail || this.crashTime > 0)
            return !1;
        this.collisionEnd.set(this.x, this.y, this.z),
        this.collisionVelocity.set(this.velocityX, this.airborne ? this.vy : 0, this.velocityZ);
        let e = this.collisionVelocity.length()
          , t = this.airborne ? -1 : Ll.findIndex(e => {
            let t = Hl(e, this.x, this.z)
              , n = Bl(e);
            return e.entry === `ride` && t.t >= -.7 / e.length && t.t < 0 && a.abs(t.side) < e.width / 2 + .1 && this.y >= ql(e, 0) - .65 && this.velocityX * a.sin(n) + this.velocityZ * a.cos(n) > 0
        }
        )
          , n = this.collisions.move(this.collisionStart, this.collisionEnd, this.collisionVelocity, this.collisionOffsets, .27, t >= 0 ? `rail-${t}` : ``);
        if (!n.touched)
            return !1;
        this.x = this.collisionEnd.x,
        this.y = this.collisionEnd.y,
        this.z = this.collisionEnd.z,
        this.velocityX = this.collisionVelocity.x,
        this.velocityZ = this.collisionVelocity.z,
        this.airborne && (this.vy = this.collisionVelocity.y);
        let r = _r(n.impact, e);
        if (r === `fall` || r === `crash`)
            return this.landingImpact = n.impact,
            this.beginCrash(n.impact, !1, r),
            this.notice = `BAIL`,
            !0;
        if (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && !this.airborne) {
            let e = n.normal.x * a.cos(this.heading) - n.normal.z * a.sin(this.heading)
              , t = n.normal.x * a.sin(this.heading) + n.normal.z * a.cos(this.heading);
            this.landingSpin = L(e * n.impact / 16, -.8, .8),
            this.landingFlip = L(-t * n.impact / 20, -.6, .6)
        }
        return !1
    }
    get trickEvent() {
        let e = this.event;
        if (!e || e === `arrive`)
            return null;
        let t = e === `land` && !this.rail || e === `butter`;
        return {
            t: this.elapsed,
            kind: e,
            text: e === `crash` || t ? this.notice : this.chain.length ? this.trick : ``,
            score: e === `crash` ? this.lost : t ? this.lastScore : 0,
            impact: this.landingImpact
        }
    }
    toLobby() {
        this.butter.reset(),
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `intro`,
        this.paused = !1,
        this.crashTime = 0,
        this.recovery = 0,
        this.airborne = !1,
        this.rail = null,
        this.grind = !1,
        this.x = cl(90),
        this.z = 90,
        this.y = z(this.x, this.z),
        this.speed = 0,
        this.vy = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.turnRate = 0,
        this.skid = 0,
        this.crouch = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spin = 0,
        this.flip = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.landingPrepare = 0,
        this.trick = ``,
        this.trickScore = 0,
        this.notice = ``,
        this.noticeTime = 0,
        this.liftTime = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.switchStance = !1,
        this.clearChain()
    }
    boardLift(e) {
        if (this.butter.reset(),
        !(this.phase !== `intro` && this.phase !== `finished`) && (this.phase = `gondola`,
        this.liftTime = 0,
        this.speed = 0,
        this.paused = !1,
        this.liftClock = e ?? 0,
        this.cabinIndex = 0,
        e !== void 0)) {
            let t = 1 / 0;
            for (let n = 0; n < 24; n++) {
                let r = hu(e, n);
                r.up && r.p < t && (t = r.p,
                this.cabinIndex = n)
            }
        }
    }
    arrive() {
        Object.assign(this, new e, {
            liftClock: this.liftClock,
            liftTime: this.liftTime,
            cabinIndex: this.cabinIndex,
            runs: this.runs,
            collisions: this.collisions
        }),
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `skiing`,
        this.x = mu(0, -3),
        this.z = 0,
        this.y = z(this.x, 0),
        this.speed = 3,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = a.atan(ll(0)),
        this.travelHeading = this.heading,
        this.edge = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.elapsed = 0,
        this.score = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.crashes = 0,
        this.crashTime = 0,
        this.landingImpact = 0,
        this.landing = 0,
        this.landingBoost = 0,
        this.switchStance = !1,
        this.trick = ``,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.topSpeed = 0,
        this.spin = 0,
        this.flip = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.charge = 0,
        this.jumpHeld = !1,
        this.skid = 0,
        this.poling = 0,
        this.polePhase = 0,
        this.lastJumpDistance = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.trickTally.clear(),
        this.lost = 0,
        this.notice = `FIND YOUR LINE`,
        this.noticeTime = 3,
        this.event = `arrive`
    }
    fastTravel() {
        if (this.phase !== `gondola` || this.paused)
            return;
        let e = (1 - hu(this.liftClock, this.cabinIndex).p) * nl;
        this.liftClock += e,
        this.liftTime += e,
        this.arrive()
    }
    recover() {
        this.butter.reset(!0),
        this.lastScoreFactors = null,
        this.phase === `skiing` && (this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.x = cl(this.z),
        this.y = z(this.x, this.z),
        this.vy = 0,
        this.lateral = 0,
        this.speed = 5,
        this.airborne = !1,
        this.spin = 0,
        this.flip = 0,
        this.crashTime = 0,
        this.skid = 0,
        this.travelHeading = a.atan(ll(this.z)),
        this.heading = this.travelHeading,
        this.edge = 0,
        this.turnRate = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.notice = `BACK ON TRACK`,
        this.noticeTime = 2)
    }
    rideOutButter() {
        let e = Nl(this.x, this.z, this.heading);
        this.butter.release(this, j(e.slope, this.spin, this.edge, this.airOrientation, e.crossSlope)),
        this.flipTightness = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.spinWindup = 0;
        let t = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length
          , n = a.round(this.butter.entryPoints * ge(t));
        this.butter.entryPoints = 0,
        !(n <= 0) && (this.lastScore = n,
        this.score += n,
        this.runScore.tricks += n,
        this.trickTally.set(`BUTTER`, (this.trickTally.get(`BUTTER`) ?? 0) + 1),
        n > this.bestCombo && (this.bestCombo = n,
        this.bestTrick = this.butter.entry),
        this.notice = `STOMPED. ${this.butter.entry}`,
        this.noticeTime = 3,
        this.event = `butter`)
    }
    takeoff(e, t=this.speed, n=`jump`, r) {
        let i = Nl(this.x, this.z, this.heading, this.grind)
          , o = this.landingSettling ? this.airOrientation.clone() : r ?? j(i.slope, this.spin, this.edge, new g, i.crossSlope)
          , s = this.butter.launch(this, o);
        this.speed = t,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.airborne = !0,
        this.vy = e + s.pop,
        this.airTime = 0,
        this.spin = 0,
        this.flip = 0,
        this.corkSet = !1,
        this.airRotation.reset(0, 0, o),
        this.rollVelocity = 0,
        this.landingAssist.reset(),
        this.landingSettling = !1,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.spinVelocity = s.spin,
        this.flipVelocity = s.flip,
        this.velocityZ = this.speed * a.cos(this.travelHeading),
        this.velocityX = this.speed * a.sin(this.travelHeading),
        this.grabTime = 0,
        this.grabLedger.reset(),
        this.scoreFactors = null,
        this.maxAir = 0,
        this.jumpDistance = 0,
        this.trickScore = this.projectChain(0, 0, 0, 0),
        this.trick = this.chainText(``),
        this.event = `jump`,
        this.takeoffKick = 1,
        this.airSource = n,
        this.airGrid = en,
        this.rail = null,
        this.grind = !1,
        this.lost = 0
    }
    mountRail(e, t, n, r=0) {
        this.butter.reset(),
        this.landingSettling = !1,
        this.landingAssist.reset();
        let i = Bl(e)
          , o = a.atan2(a.sin(this.travelHeading - i), a.cos(this.travelHeading - i))
          , s = a.atan2(a.sin(n - i), a.cos(n - i));
        this.spin = 0,
        this.spinTightness = 0,
        this.rail = e,
        this.railT = L(t, 0, 1),
        this.grind = !0,
        this.airborne = !1,
        this.vy = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.railHops = [],
        this.railHopPoints = 0,
        this.railSpinVelocity = r,
        this.railTarget = null,
        this.railPresses = 0,
        this.railSpin = s,
        this.railSpinTravel = 0,
        this.switchStance = !1,
        this.skid = 0,
        this.charge = 0,
        this.speed = a.max(9, this.speed * a.max(.35, a.cos(o))),
        this.travelHeading = this.heading = i,
        this.velocityX = this.speed * a.sin(i),
        this.velocityZ = this.speed * a.cos(i);
        let c = Vl(e, this.railT);
        this.x = c.x,
        this.z = c.z,
        this.y = ql(e, this.railT)
    }
    chainText(e) {
        return [...this.chain, e].filter(Boolean).join(` → `)
    }
    railName() {
        return [this.railSwaps ? `RAIL ${this.railSwaps * 90}` : `RAIL SLIDE`, ...this.railHops].join(` + `)
    }
    barPoints() {
        return Oe(this.railTime, this.railSwaps) + this.railHopPoints
    }
    hopValue(e) {
        let t = this.airRotation.judge.result(!1, !0, tn).rotations;
        if (t < 90 || e.length >= 2)
            return null;
        let n = `HOP ${t}`
          , r = (this.trickTally.get(n) ?? 0) + this.chainRepeatKeys.filter(e => e === n).length;
        return {
            name: n,
            points: a.round(t / 90 * 450 * he(r))
        }
    }
    projectChain(e, t, n, r, i=0) {
        let o = _e(this.chainLinks + r);
        return this.chainButter + i + a.round((this.chainTricks + e) * o) + a.round((this.chainGrabs + t) * o) + a.round((this.chainRails + n) * o)
    }
    pushAirLink() {
        this.chainButter += this.butterPoints,
        this.butterPoints > 0 && this.chainRepeatKeys.push(`BUTTER`),
        this.butter.entryPoints = 0,
        this.chainTricks += a.round(this.airPoints * he(this.repeat)),
        this.chainGrabs += this.grabPoints,
        this.airName && this.chain.push(this.airName),
        this.airIsLink && this.airRepeatKey && this.chainRepeatKeys.push(this.airRepeatKey),
        this.airIsLink && this.chainLinks++,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    pushRailLink() {
        this.chainRails += this.barPoints(),
        this.chain.push(this.railName()),
        this.chainLinks++
    }
    clearChain() {
        this.scoreFactors = null,
        this.chain = [],
        this.chainRepeatKeys = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    judgeAir(e=!1, t=!1) {
        if (!e && this.barSave && Hl(this.barSave.r, this.x, this.z).t <= 1) {
            let e = this.hopValue(this.barSave.railHops)
              , t = this.chain.length - 1;
            this.trick = [...this.chain.slice(0, t), [this.chain[t], ...e ? [e.name] : []].join(` + `)].join(` → `),
            this.trickScore = this.projectChain(0, 0, e?.points ?? 0, 0);
            return
        }
        let n = t || this.velocityZ > .5 && (this.airSource !== `ground` || this.airTime >= 1.05 && this.maxAir >= 1.3)
          , r = this.airRotation.judge.result(this.switchStance, e, t ? tn : this.airGrid, this.board)
          , i = t ? `ON` : this.airSource === `rail` ? `OFF` : ``
          , o = r.name && i ? `${r.name} ${i}` : r.name
          , s = this.grabLedger.namesOn(this.board)
          , c = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length;
        this.butterPoints = a.round(this.butter.entryPoints * ge(c)),
        this.airName = [this.butterPoints > 0 ? this.butter.entry : ``, ...n ? [o, ...s] : []].filter(Boolean).join(` + `);
        let l = Ee({
            airTime: this.airTime,
            maxAir: this.maxAir,
            ...r,
            switchStance: this.switchStance
        });
        this.airRepeatKey = n ? (r.type && i ? `${r.type} ${i}` : r.type) || `STRAIGHT AIR` : ``,
        this.repeat = this.airRepeatKey ? (this.trickTally.get(this.airRepeatKey) ?? 0) + this.chainRepeatKeys.filter(e => e === this.airRepeatKey).length : 0,
        this.airPoints = n ? l.total : 0,
        this.grabPoints = n ? De(this.grabLedger.time, s.length, l.rotation, he(this.repeat), this.grabLedger.longest) : 0,
        this.airIsLink = n && (this.airTime >= .5 || o !== `` || s.length > 0),
        this.scoreFactors = n ? {
            turns: l.turns,
            grabs: s.length,
            grabMultiplier: Ce(s.length, this.grabLedger.longest),
            lineMultiplier: _e(this.chainLinks + +!!this.airIsLink),
            offAxis: r.offAxis,
            switchStance: this.switchStance,
            flips: l.flips
        } : null,
        this.trickScore = this.projectChain(a.round(this.airPoints * he(this.repeat)), this.grabPoints, 0, +!!this.airIsLink, this.butterPoints),
        this.trick = this.trickScore > 0 ? this.chainText(this.airName) : ``
    }
    landOnRail(e=!1) {
        let t = a.abs(this.flipVelocity) > .1;
        for (let n of Ll) {
            let r = Hl(n, this.x, this.z)
              , i = r.t * n.length
              , o = n.entry === `pop`;
            if (i < (o ? -.45 : 0) || r.t > 1 || a.abs(r.side) > n.width / 2 + .5)
                continue;
            let s = ql(n, r.t);
            if (e ? !o || i > 3 || t || this.y > s + .1 || this.y < s - .35 : this.y > s + .05 || this.y < s - (o && i < 3 ? .35 : .75))
                continue;
            if (this.airRotation.upright < .45)
                return this.landingImpact = a.max(2, -this.vy),
                this.beginCrash(this.landingImpact),
                !0;
            let c = this.heading + this.airRotation.landingYaw + (this.switchStance ? a.PI : 0);
            return this.barSave?.r === n ? (this.resumeBar(n, r.t, c),
            !0) : (this.judgeAir(!0, !0),
            this.pushAirLink(),
            this.landedJumps++,
            this.totalAirTime += this.airTime,
            this.lastJumpDistance = this.jumpDistance,
            this.landingImpact = 0,
            this.landing = .6,
            this.mountRail(n, r.t, c, this.spinVelocity),
            this.event = `land`,
            this.spin = 0,
            this.flip = 0,
            this.rollVelocity = 0,
            this.trick = this.chainText(this.railName()),
            this.trickScore = this.projectChain(0, 0, 0, 0),
            this.flipVelocity = 0,
            this.flipTightness = 0,
            this.spinVelocity = 0,
            this.spinTightness = 0,
            this.landingPrepare = 1,
            !0)
        }
        return !1
    }
    resumeBar(e, t, n) {
        let r = this.barSave;
        this.barSave = null,
        this.chain.pop(),
        this.chainLinks--,
        this.chainRails -= r.rails;
        let i = this.hopValue(r.railHops)
          , a = this.airTime;
        this.mountRail(e, t, n, this.spinVelocity),
        this.railTime = r.railTime + a,
        this.railPresses = r.railPresses,
        this.railSpinTravel = r.railSpinTravel,
        this.railSwaps = r.railSwaps,
        this.railHops = i ? [...r.railHops, i.name] : r.railHops,
        this.railHopPoints = r.railHopPoints + (i?.points ?? 0),
        i && this.chainRepeatKeys.push(i.name),
        this.landing = .3,
        this.landingImpact = 0,
        this.event = ``,
        this.spin = 0,
        this.flip = 0,
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipTightness = 0,
        this.spinVelocity = 0,
        this.spinTightness = 0,
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, this.barPoints(), 1)
    }
    shiftAcross(e, t) {
        let n = Bl(e);
        this.x += a.cos(n) * t,
        this.z -= a.sin(n) * t
    }
    funnelToRail(e, t) {
        for (let n of Ll) {
            if (n.entry !== `ride`)
                continue;
            let r = Hl(n, this.x, this.z)
              , i = r.t * n.length;
            if (i < -8.5 || i >= 0 || a.abs(r.side) > 1.5)
                continue;
            let o = Nu(this.travelHeading, Bl(n));
            if (a.abs(o) > Ou || this.speed < 4 || t.steer * a.sign(r.side) > .3)
                return;
            let s = R((i + Jl) / Jl);
            this.shiftAcross(n, -a.sign(r.side) * a.min(a.abs(r.side), ku * s * this.speed * e)),
            this.travelHeading -= o * (1 - a.exp(-3 * s * e));
            return
        }
    }
    funnelInAir(e) {
        for (let t of Ll) {
            let n = Hl(t, this.x, this.z)
              , r = n.t * t.length
              , i = t.entry === `pop` && r >= -2.5 && r <= 3;
            if (n.t < -.02 && !i || n.t > 1 || a.abs(n.side) > 1)
                continue;
            let o = this.y - ql(t, L(n.t, 0, 1));
            if (!(!i && (this.vy >= 0 || o < -.2 || o > -this.vy * .45)) && !(a.abs(Nu(this.travelHeading, Bl(t))) > Au)) {
                this.shiftAcross(t, -a.sign(n.side) * a.min(a.abs(n.side), ju * e));
                return
            }
        }
    }
    popOffKicker(e, t) {
        for (let n of Ll) {
            if (n.entry !== `pop` || this.speed < 5)
                continue;
            let r = Hl(n, this.x, this.z);
            if (Hl(n, e, t).t * n.length >= -2.5 || r.t * n.length < -2.5 || ru(n).height * R((3.2 - a.abs(r.side)) / 1.6) < .4)
                continue;
            let i = Bl(n)
              , o = Vl(n, -Yl / n.length)
              , s = {
                x: o.x + a.cos(i) * r.side,
                z: o.z - a.sin(i) * r.side
            }
              , c = L(r.side, -1.6, 1.6)
              , l = {
                x: o.x + a.cos(i) * c,
                z: o.z - a.sin(i) * c
            }
              , u = a.hypot(this.velocityX, this.velocityZ)
              , d = u * a.max(.2, a.cos(Nu(this.travelHeading, i)))
              , f = (ql(n, .1) - ql(n, 0)) / (.1 * n.length)
              , p = z(s.x, s.z)
              , m = a.max(.3, -r.t * n.length)
              , h = ql(n, 0) - f * m - z(l.x, l.z)
              , _ = m / a.max(d, 1)
              , v = a.max(a.sqrt(2 * eu * (h + Zl)), (h - .1) / _ + eu * _ / 2) + f * d;
            this.y = p,
            this.takeoff(v, u, `jump`, j(v / u, this.spin, this.edge, new g, 0)),
            this.charge = 0;
            return
        }
    }
    slide(e, t) {
        let n = this.rail
          , r = Bl(n);
        this.grind = !0,
        this.railTime += e;
        let i = L(this.railT, 0, 1)
          , o = a.max(0, i - .02)
          , s = a.min(1, i + .02)
          , c = (ql(n, s) - ql(n, o)) / ((s - o) * n.length);
        this.speed = a.max(9, this.speed - bu * c / a.hypot(1, c) * e),
        this.railT += this.speed * e / n.length;
        let l = L(this.railT, 0, 1)
          , u = Vl(n, l);
        this.x = u.x,
        this.z = u.z,
        this.y = ql(n, l),
        this.travelHeading = this.heading = r,
        this.velocityX = this.speed * a.sin(r),
        this.velocityZ = this.speed * a.cos(r),
        this.turnRate = 0,
        this.lateral = 0,
        this.skid = 0;
        let d = a.abs(t.steer) > .06 ? L(t.steer, -1, 1) : 0
          , f = a.sign(d);
        f && f !== this.railSteer && this.railPresses < 2 && (this.railPresses++,
        this.railTarget = (this.railTarget ?? a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2)) + f * a.PI / 2),
        this.railSteer = f;
        let p;
        if (this.railTarget !== null) {
            let t = this.railTarget - this.railSpin;
            p = a.sign(t) * a.min(a.abs(t), yu * e),
            this.railSpinVelocity = p / e,
            a.abs(t - p) < 1e-6 && (this.railTarget = null,
            this.railSpinVelocity = 0)
        } else
            this.railSpinVelocity = il(this.railSpinVelocity, 0, 1.65, e),
            p = this.railSpinVelocity * e;
        if (this.railSpin += p,
        this.railSpinTravel += a.abs(p),
        this.railTarget === null && a.abs(this.railSpinVelocity) < .45) {
            let t = a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2);
            this.railSpin = il(this.railSpin, t, 4.8, e)
        }
        let m = a.floor((this.railSpinTravel + .12) / (a.PI / 2));
        m > this.railSwaps && (this.railSwaps = a.min(m, 2)),
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, this.barPoints(), 1),
        this.scoreFactors = {
            turns: 0,
            grabs: 0,
            grabMultiplier: 1,
            lineMultiplier: _e(this.chainLinks + 1),
            offAxis: !1,
            switchStance: !1
        },
        t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
        !t.jump && this.jumpHeld ? this.dismount(4.6 + this.charge * 3.4, !0, t) : this.railT >= 1 && this.dismount(.5, !1, t)
    }
    dismount(e, t, n) {
        let r = this.rail
          , i = this.railSpin
          , o = this.railSpinVelocity
          , s = L(this.railT, 0, 1)
          , c = .02
          , l = (ql(r, a.min(1, s + c)) - ql(r, a.max(0, s - c))) / ((a.min(1, s + c) - a.max(0, s - c)) * r.length);
        this.barSave = {
            r,
            railTime: this.railTime,
            railSwaps: this.railSwaps,
            railSpinTravel: this.railSpinTravel,
            railPresses: this.railPresses,
            railHops: this.railHops,
            railHopPoints: this.railHopPoints,
            rails: this.barPoints()
        },
        this.pushRailLink(),
        this.rail = null,
        this.grind = !1;
        let u = j(l, i, 0, new g);
        this.takeoff(this.speed * l + e, this.speed, `rail`, u),
        this.airGrid = a.abs(a.round(i / (a.PI / 2))) % 2 ? nn : en,
        this.airRotation.reset(0, i, u),
        this.spinVelocity = o,
        this.charge = 0,
        t || (this.event = `dismount`)
    }
    faceplant() {
        Nt(this.airOrientation),
        this.beginCrash(this.landingImpact),
        this.notice = `FACEPLANT`
    }
    beginCrash(e, t=!1, n) {
        if (this.crashTime > 0)
            return;
        this.equipmentDetached = !1,
        this.lastScoreFactors = null,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.crashSeverity = L(n ? e / 42 * .8 + a.max(0, this.y - z(this.x, this.z)) / 45 * .2 : this.speed / 43 * .35 + e / 42 * .45 + this.maxAir / 45 * .2, .12, 1);
        let r = n ? n === `fall` : !t && e < 16 && this.maxAir < 5.5 && this.speed < 27;
        this.crashDuration = r ? .8 + this.crashSeverity * .4 : 1.35 + this.crashSeverity * 1.35,
        this.crashTime = this.crashDuration,
        this.recovery = 0,
        this.ragdoll.start(this.x, this.y, this.z, this.heading, this.spin + (this.switchStance ? a.PI : 0), this.flip, this.velocityX, this.velocityZ, e, this.flipVelocity, this.spinVelocity, this.airOrientation, this.switchStance ? a.PI : 0, t, r),
        this.crashes++,
        this.airborne = !1,
        this.landing = 0,
        this.landingBoost = 0,
        this.event = `crash`,
        this.rail = null,
        this.grind = !1,
        this.lost = this.trickScore,
        this.notice = t ? `LANDED FLAT` : `BAIL`,
        this.noticeTime = this.crashDuration,
        this.trick = ``,
        this.trickScore = 0,
        this.clearChain()
    }
    updateCrash(e) {
        this.ragdoll.collisions = this.collisions,
        this.crashTime = a.max(0, this.crashTime - e),
        this.recovery = 1 - L(this.crashTime / (this.ragdoll.gentle ? .45 : .6), 0, 1),
        this.ragdoll.update(e, this.crashTime < (this.ragdoll.gentle ? .55 : .75)),
        this.equipmentDetached = this.crashTime > 0 && this.ragdoll.shedsEquipment;
        let t = this.ragdoll.nodes.Hips.p
          , n = L(t.z, -22, el)
          , r = L(t.x, cl(n) - 123, cl(n) + 123);
        this.ragdoll.translate(r - t.x, n - t.z),
        this.x = r,
        this.z = n,
        this.y = z(r, n),
        this.velocityX = this.ragdoll.velocity.x,
        this.velocityZ = this.ragdoll.velocity.z,
        this.speed = a.min(43, a.hypot(this.velocityX, this.velocityZ)),
        this.speed > 1.5 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        this.crashTime === 0 && (this.speed = L(this.speed, 4, this.ragdoll.gentle ? 32 : 23),
        this.vy = 0,
        this.spin = 0,
        this.flip = 0,
        this.edge = 0,
        this.skid = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.switchStance = !1,
        this.heading = this.travelHeading,
        this.recovery = 0,
        this.crouch = .5,
        this.poling = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.polePhase = 0,
        this.recoveryPushTime = 6,
        this.velocityX = a.sin(this.travelHeading) * this.speed,
        this.velocityZ = a.cos(this.travelHeading) * this.speed,
        this.notice = `BACK ON YOUR FEET`,
        this.noticeTime = 2)
    }
    update(e, t) {
        if (this.board = !!t.board,
        this.event = ``,
        !this.airborne && !this.grind && (this.barSave = null),
        this.grind || (this.railSteer = a.abs(t.steer) > .06 ? a.sign(t.steer) : 0),
        this.crashTime <= 0 && (this.equipmentDetached = !1),
        this.paused)
            return;
        if (this.liftClock += e,
        this.noticeTime = a.max(0, this.noticeTime - e),
        this.landing = a.max(0, this.landing - e * 3.4),
        this.landingBoost = a.max(0, this.landingBoost - e),
        this.takeoffKick = a.max(0, this.takeoffKick - e * 4),
        this.phase === `gondola`) {
            this.liftTime += e,
            hu(this.liftClock, this.cabinIndex).p >= .999999999 && this.arrive();
            return
        }
        if (this.phase !== `skiing`)
            return;
        if (this.elapsed += e,
        this.crashTime > 0) {
            this.butter.reset(),
            this.updateCrash(e);
            return
        }
        this.recoveryPushTime = this.speed >= 18 ? 0 : a.max(0, this.recoveryPushTime - e);
        let n = this.airborne;
        this.landingSpin = il(this.landingSpin, 0, 5, e),
        this.landingFlip = il(this.landingFlip, 0, 5, e);
        let r = this.butter.step(this, t, e, !this.airborne && (t.butter || this.butter.active) ? Ml(this.x, this.z, this.travelHeading) : 0);
        this.butter.ready && !this.rail && this.rideOutButter();
        let i = !r && t.brake && !this.airborne && !this.rail;
        this.forwardHeld = !r && t.forward && !this.airborne && !this.rail && !i ? this.forwardHeld + e : 0,
        this.tucking = !r && t.forward && !this.airborne && !this.rail && !i && (this.switchStance || this.forwardHeld >= 1.25 || this.speed >= 18),
        this.crouch = il(this.crouch, !this.airborne && (this.tucking || t.jump) ? 1 : 0, 9, e),
        a.abs(t.steer) > .15 && (this.skidSide = a.sign(t.steer)),
        this.skid = il(this.skid, i ? this.skidSide * L(this.speed / 9, 0, 1) : 0, 7, e);
        let o = !r && a.abs(t.steer) > .05 ? L(t.steer, -1, 1) : 0;
        this.carveTransfer *= a.exp(-6 * e),
        !this.airborne && !i && this.previousSteer * o < 0 && (this.carveTransfer = a.abs(this.edge) * L(this.speed / 18, 0, 1)),
        this.previousSteer = this.airborne || !o && a.abs(this.edge) < .1 ? 0 : o || this.previousSteer;
        let s = L(13 / a.max(this.speed, 1), .45, 1)
          , l = o ? (11 + this.carveTransfer * 11) * s : 9
          , u = R((1 - this.landing) / .68);
        this.edge = il(this.edge, !this.airborne && !this.rail ? o * u : 0, l, e);
        let d = !r && t.forward && !this.switchStance && !this.tucking && !this.airborne && !this.rail && !i && !t.jump;
        if (this.poling = il(this.poling, +!!d, 12, e),
        this.airborne)
            this.velocityX *= a.exp(-.003 * e),
            this.velocityZ *= a.exp(-.003 * e),
            this.speed = a.hypot(this.velocityX, this.velocityZ),
            this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
            this.turnRate = 0,
            this.lateral = 0;
        else {
            this.landingSettling && !this.rail && !r && (this.spinVelocity += (-100 * this.spin - 20 * this.spinVelocity) * e,
            this.spin += this.spinVelocity * e),
            r || (this.spinWindup = il(this.spinWindup, 0, 10, e),
            this.spinTightness = il(this.spinTightness, 0, 14, e)),
            this.landingPrepare = this.butter.active ? -1 : 0;
            let t = bl(this.x, this.z) > 24 && du(this.x, this.z) < .5
              , n = this.edge * (.8 + L(this.speed / 85, 0, .44)) * (1 + this.carveTransfer * .14) * (i ? .7 : 1);
            this.turnRate = this.rail ? 0 : n,
            this.travelHeading += this.turnRate * e,
            r && (this.travelHeading += At(Ml(this.x, this.z, this.travelHeading + a.PI / 2), this.speed, 9.81 * 1.7) * e);
            let o = Ml(this.x, this.z, this.travelHeading)
              , s = -o
              , c = (this.tucking ? .0024 : .0028) * (t ? 1.38 : 1)
              , l = 9.81 * a.sin(a.atan(s)) * 1.7 - .13 - c * this.speed * this.speed - a.abs(this.edge) * .38;
            if (this.rail || (this.speed = L(this.speed + (l - (i ? 17 : 0)) * e, 0, 43)),
            d) {
                let t = this.polePhase;
                this.polePhase = (this.polePhase + e / .95) % 1,
                t < .34 && this.polePhase >= .34 && (this.speed = a.min(43, this.speed + 1.65 * L(1 - this.speed / 52, .25, 1)),
                this.recoveryPushTime > 0 && (this.speed += a.min(3, a.max(0, 13 - this.speed))),
                this.recoveryPushTime = 0)
            } else
                this.poling < .02 && (this.polePhase = 0);
            let u = this.skid * this.speed * .1
              , f = this.speed / a.hypot(1, o);
            this.velocityZ = f * a.cos(this.travelHeading) - u * a.sin(this.travelHeading),
            this.velocityX = f * a.sin(this.travelHeading) + u * a.cos(this.travelHeading),
            this.lateral = this.edge * this.speed * .35 + u
        }
        this.topSpeed = a.max(this.topSpeed, this.speed * 3.6);
        let p = a.atan2(a.sin(this.travelHeading + this.skid * .72 - this.heading), a.cos(this.travelHeading + this.skid * .72 - this.heading));
        this.heading += p * (1 - a.exp(-12 * e));
        let m = this.x
          , h = this.z;
        this.collisionStart.set(this.x, this.y, this.z),
        this.x += this.velocityX * e,
        this.z += this.velocityZ * e,
        this.z = a.max(-22, this.z);
        let _ = cl(this.z);
        if (a.abs(this.x - _) > 126) {
            let t = a.sign(this.x - _);
            this.x = _ + t * 126;
            let n = this.velocityX - ll(this.z) * this.velocityZ;
            t * n > 0 && (this.velocityX -= n,
            this.speed *= a.exp(-e * 2.8))
        }
        if (!this.airborne && !this.rail && this.funnelToRail(e, t),
        !this.airborne && !this.rail)
            for (let e of Ll) {
                let t = Hl(e, this.x, this.z);
                if (t.t >= 0 && t.t <= 1 && a.abs(t.side) < e.width / 2 + .35 && this.y >= ql(e, t.t) - .4) {
                    this.mountRail(e, t.t, this.heading + this.spin + (this.switchStance ? a.PI : 0), this.spinVelocity);
                    break
                }
            }
        if (this.rail)
            this.slide(e, t);
        else if (!this.airborne) {
            for (let e of Sl)
                if (h <= e.z && this.z > e.z && a.abs(this.x - cl(this.z) - e.offset) < e.width / 2 + 1 && this.speed > 7) {
                    let t = cl(this.z) + e.offset;
                    if (this.y < z(a.max(t - e.width / 2 + .6, a.min(t + e.width / 2 - .6, this.x)), e.z - .01) - 1)
                        continue;
                    let n = El(e, this.speed, this.charge, this.travelHeading)
                      , r = Nl(this.x, e.z - .01, this.heading)
                      , i = j(r.slope, this.spin, this.edge, new g, r.crossSlope);
                    this.y = z(this.x, e.z - .01),
                    this.takeoff(n.vertical, n.horizontal, `jump`, i),
                    this.velocityX += e.transfer * .22,
                    this.charge = 0;
                    break
                }
            this.airborne || this.popOffKicker(m, h),
            this.airborne || (this.y = z(this.x, this.z),
            t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
            !t.jump && this.jumpHeld && (this.takeoff(Dl(this.x, this.z, this.velocityX, this.velocityZ, this.charge), this.speed, `ground`),
            this.charge = 0))
        }
        if (!(!this.airborne && this.collideWithPark())) {
            if (this.airborne) {
                let r = !n;
                if (!r) {
                    this.vy -= eu * e,
                    this.y += this.vy * e,
                    this.airTime += e,
                    this.jumpDistance += a.hypot(this.velocityX, this.velocityZ) * e;
                    let t = cr(z, Sl, this.collisionStart, this);
                    t && (this.x = t.x,
                    this.y = t.y,
                    this.z = t.z)
                }
                let i = z(this.x, this.z)
                  , o = this.y <= i ? Nl(this.x, this.z, 0) : null
                  , s = o ? o.slope : z(this.x, this.z + .5) - z(this.x, this.z - .5)
                  , c = o ? o.crossSlope : z(this.x + .5, this.z) - z(this.x - .5, this.z)
                  , l = s * this.velocityZ + c * this.velocityX
                  , u = l - this.vy
                  , d = u > .1 ? a.max(0, this.y - i) / u : 1 / 0;
                this.landingPrepare = il(a.max(0, this.landingPrepare), 1 - R((d - .1) / .45), 14, e);
                let f = a.abs(t.steer) > .06 ? L(t.steer, -1, 1) : 0
                  , p = Number(t.forward) - Number(t.brake);
                this.airRotation.controlPitch(p, this.switchStance && !t.board, this.flipVelocity, this.rollVelocity);
                let m = a.abs(t.airRoll ?? 0) > .06 ? L(t.airRoll ?? 0, -1, 1) : 0;
                this.spinTightness = il(this.spinTightness, a.abs(f), f ? 12 : 10, e),
                this.airGrab = il(this.airGrab, +!!t.grab, 12, e);
                let h = rl(vu, rl(Su, Cu, this.airGrab), this.spinTightness)
                  , g = f * h
                  , _ = p * h;
                this.spinReversal = f * this.spinVelocity < 0 ? .12 : a.max(0, this.spinReversal - e),
                (!p || a.sign(p) !== this.flipReversal) && (this.flipReversal = 0),
                p * this.flipVelocity < -.12 && (this.flipReversal = a.sign(p)),
                a.abs(_ - this.flipVelocity) < h * .05 && (this.flipReversal = 0),
                this.spinVelocity = Tu(this.spinVelocity, g, e, this.spinReversal > 0 || this.flipReversal !== 0, this.flipReversal ? 3.2 : 28),
                this.flipVelocity = Tu(this.flipVelocity, _, e, this.flipReversal !== 0, 3.2),
                this.rollVelocity = Tu(this.rollVelocity, m * h, e, m * this.rollVelocity < 0, 5),
                this.flipReversal && (this.spinVelocity = a.sign(this.spinVelocity) * a.min(a.abs(this.spinVelocity), a.abs(this.flipVelocity)));
                let v = this.flipReversal ? L(this.spinVelocity / h, -1, 1) : f;
                this.spinWindup = il(this.spinWindup, v, f ? 17 : 8, e);
                let y = this.flipReversal ? L(this.flipVelocity / h, -1, 1) : p;
                this.flipWindup = il(this.flipWindup, y, p ? 24 : 9, e),
                this.flipTightness = il(this.flipTightness, a.abs(y), p ? 14 : 10, e),
                !p && a.abs(this.flipVelocity) < .015 && (this.flipVelocity = 0),
                !f && a.abs(this.spinVelocity) < .015 && (this.spinVelocity = 0),
                this.spin += this.spinVelocity * e,
                this.flip += this.flipVelocity * e,
                !m && a.abs(this.rollVelocity) < .015 && (this.rollVelocity = 0),
                t.cork && this.airTime <= .25 && (this.corkSet = !0);
                let b = !!t.cork && this.corkSet;
                this.airRotation.update(this.flipVelocity, this.spinVelocity, e, b, this.rollVelocity, !!t.over && b);
                let x = !!(f || p || m || t.grab)
                  , S = c * a.sin(this.heading) + s * a.cos(this.heading)
                  , C = !x && Ll.some(e => {
                    for (let t of [0, .25, .5, .75]) {
                        let n = Hl(e, this.x + this.velocityX * t, this.z + this.velocityZ * t);
                        if (n.t >= 0 && n.t <= 1 && a.abs(n.side) < e.width / 2 + .7 && this.y >= ql(e, n.t) - .1)
                            return !0
                    }
                    return !1
                }
                )
                  , w = a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 ? this.spinVelocity / wu : 0
                  , T = this.airRotation.upright > .64 && a.abs(this.airRotation.flipAngle) < .5 && this.airRotation.inversions === 0 && !this.airRotation.corked && !p && !m && !t.cork && a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 && !C
                  , ee = t.grab && T
                  , te = !!(f || p || m)
                  , E = this.landingAssist.update(e, this.airOrientation, this.airRotation.landingYaw, C ? 0 : S, d, this.airRotation.speed, te || t.grab && !ee || this.airTime < .22 && this.vy > 0, C, C ? 0 : c * a.cos(this.heading) - s * a.sin(this.heading), w, ee);
                if (this.airRotation.correct(E),
                T && (a.abs(this.spinVelocity) > .5 || f) && E.x === 0 && E.y === 0 && E.z === 0) {
                    let t = Number.isFinite(d) ? a.max(0, a.min(1, (1.5 - d) / 1.2)) : 0;
                    this.airRotation.correct(this.airLevel.update(e, this.airOrientation, this.airRotation.landingYaw, this.airTime, C ? 0 : S, C ? 0 : c * a.cos(this.heading) - s * a.sin(this.heading), t))
                }
                t.grab && (this.grabTime += e),
                this.grabLedger.update(e, t.grab, t.grabStyle ?? 0, !!t.board),
                this.maxAir = a.max(this.maxAir, this.y - z(this.x, this.z)),
                this.judgeAir(),
                r || this.funnelInAir(e);
                let ne = !r && this.landOnRail(this.vy >= 0);
                if (!ne && this.collideWithPark())
                    return;
                if (!ne && !r && this.y <= i) {
                    this.landingImpact = a.max(0, l - this.vy) / a.hypot(1, c, s),
                    this.y = i,
                    this.airborne = !1,
                    this.landing = 1,
                    this.lastJumpDistance = this.jumpDistance;
                    let e = this.airRotation.landingYaw
                      , t = a.abs(a.sin(e));
                    this.landingNormal.set(-c * a.cos(this.heading) + s * a.sin(this.heading), 1, -c * a.sin(this.heading) - s * a.cos(this.heading)).normalize();
                    let n = this.landingUp.set(0, 1, 0).applyQuaternion(this.airOrientation).dot(this.landingNormal)
                      , r = a.acos(L(n, -1, 1))
                      , o = !this.butter.catchLanding(this, this.airOrientation, this.landingNormal) && n < .25 && (n < 0 || this.landingImpact > 3 || this.airTime > .3)
                      , u = this.landingImpact > 33 && this.airTime > .35
                      , d = o || u ? null : this.butter.landingFor(this)
                      , f = !o && !u && d !== `faceplant`
                      , p = !1;
                    if (f) {
                        this.judgeAir(!0),
                        this.lastScoreFactors = this.scoreFactors;
                        let n = a.round((e + w) / a.PI);
                        a.abs(n) % 2 == 1 && (this.switchStance = !this.switchStance,
                        this.airOrientation.multiply(this.stanceTurn.set(0, 1, 0, 0)));
                        let i = t >= .3 || Cn(this.airOrientation, this.landingNormal)
                          , o = !i && this.airTime > .65
                          , s = o && this.speed > 3 && this.velocityZ > .5 && l < -.15;
                        this.speed = L(this.speed * (o ? 1 : .975 - t * .065 - L(r, 0, 1) * .045) + (s ? 2.6 : 0), 0, 43),
                        this.landingBoost = s ? 2.2 : 0,
                        this.pushAirLink();
                        let c = _e(this.chainLinks)
                          , u = i ? pe(t) : 1;
                        u < 1 && this.lastScoreFactors && (this.lastScoreFactors = {
                            ...this.lastScoreFactors,
                            landing: u
                        });
                        let f = a.round(a.round(this.chainTricks * c) * u) + this.chainButter
                          , m = a.round(this.chainGrabs * c * u)
                          , h = a.round(this.chainRails * c * u)
                          , g = o && this.chainLinks > 0 ? 450 + a.round((f - this.chainButter + m + h) * de) : 0;
                        this.lastScore = f + m + h + g,
                        this.score += this.lastScore,
                        this.runScore.tricks += f,
                        this.runScore.grabs += m,
                        this.runScore.rails += h,
                        this.runScore.landings += g;
                        for (let e of this.chainRepeatKeys)
                            this.trickTally.set(e, (this.trickTally.get(e) ?? 0) + 1);
                        let _ = this.chain.join(` → `);
                        this.landedJumps++,
                        this.cleanLandings += Number(o),
                        this.totalAirTime += this.airTime,
                        this.lastScore > this.bestCombo && (this.bestCombo = this.lastScore,
                        this.bestTrick = _ || `STRAIGHT AIR`),
                        this.landingSpin = Nu(e, n * a.PI),
                        this.landingFlip = r * (a.sign(this.landingUp.z) || 1),
                        p = d === `press` && this.butter.pressLanding(this, this.landingImpact),
                        this.spin = this.landingSpin,
                        this.spinVelocity = p ? this.butter.velocity : L(this.spinVelocity, -3, 3),
                        this.landingSettling = !p,
                        this.notice = this.lastScore > 0 ? _ ? `${i ? `SAVED IT` : `STOMPED`}. ${_}` : o ? `CLEAN LANDING` : `` : ``,
                        this.noticeTime = this.notice ? 3 : 0,
                        this.event = `land`,
                        this.clearChain()
                    } else
                        d === `faceplant` ? this.faceplant() : this.beginCrash(this.landingImpact, u && !o);
                    this.vy = 0,
                    this.flip = 0,
                    this.trick = ``,
                    this.rollVelocity = 0,
                    this.flipVelocity = 0,
                    this.flipTightness = 0,
                    this.spinTightness = 0,
                    this.landingPrepare = 1,
                    p && this.butter.pose(this)
                }
            }
            if (!this.airborne && !n && this.landingSettling && !this.grind && this.crashTime <= 0) {
                j(Ml(this.x, this.z, this.heading), this.spin, this.edge, this.groundTarget, Ml(this.x, this.z, this.heading + a.PI / 2));
                let t = f(this.airOrientation, this.groundTarget);
                c(this.airOrientation, this.groundTarget, a.min(8 * e, t * (1 - a.exp(-18 * e)))),
                t < .035 && a.abs(this.spin) < .002 && a.abs(this.spinVelocity) < .02 && (this.landingSettling = !1,
                this.spin = 0,
                this.spinVelocity = 0)
            }
            this.jumpHeld = t.jump,
            this.z >= tl && this.crashTime <= 0 && (this.z = tl,
            this.phase = `finished`,
            this.speed = 0,
            this.runs++)
        }
    }
}
  , Fu = .3
  , Iu = 1 / 30
  , Lu = .2
  , Ru = .02
  , zu = .4;
function Bu(e, t, n, r, i) {
    if (r < 6)
        return null;
    let a = Math.sin(n)
      , o = Math.cos(n)
      , s = e(t.x, t.z)
      , c = Math.max(.5, r / 30)
      , l = Math.min(zu, (s - e(t.x - a * c, t.z - o * c)) / c)
      , u = r * l
      , d = 0;
    for (let n = Iu; n <= Fu + 1e-9; n += Iu) {
        let c = s + u * n - i * n * n / 2 - e(t.x + a * r * n, t.z + o * r * n);
        if (c < -Ru)
            return null;
        d = Math.max(d, c)
    }
    return d >= Lu ? {
        grade: l,
        climb: u
    } : null
}
var Vu = (e, t, n) => a.max(t, a.min(n, e))
  , Hu = e => {
    let t = Vu(e, 0, 1);
    return t * t * (3 - 2 * t)
}
  , Uu = (e, t) => {
    let n = a.imul(e, 2654435761) ^ a.imul(t + 1663821227, 2246822519);
    return n = a.imul(n ^ n >>> 15, 739982445),
    n = a.imul(n ^ n >>> 12, 695872825),
    n ^= n >>> 15,
    (n >>> 0) / 4294967296
}
  , Wu = 9
  , Gu = 3
  , Ku = .28
  , qu = .9
  , Ju = 1
  , Yu = 6
  , Xu = .3
  , Zu = [.5, .1]
  , Qu = (e, t, n) => (Zu[0] + Zu[1] * a.sin(e * .02 + t * 1.7)) * Hu(n / 4) * (1 - Hu((n - 6) / 8))
  , $u = 40
  , ed = 3150
  , td = -162
  , nd = .42
  , rd = [.2, .55]
  , id = .55
  , ad = 1.33
  , od = [104, 98, 108, 100, 106, 96, 104, 100, 98, 102, 96, 100, 98]
  , sd = 46
  , cd = 1.22
  , ld = 14
  , ud = 26
  , dd = 250
  , fd = 45
  , pd = (e, t, n) => {
    if (n <= 0)
        return a.min(e, t);
    let r = a.max(n - a.abs(e - t), 0) / n;
    return a.min(e, t) - r * r * n / 4
}
  , md = e => e < Yu ? e * e / (2 * Yu) : e - Yu / 2
  , hd = class {
    constructor(e, t, n, r) {
        this.from = e,
        this.to = t,
        this.half = n,
        this.main = r,
        this.steps = a.round(t - e) + 1,
        this.off = new Float64Array(this.steps),
        this.slope = new Float64Array(this.steps),
        this.bend = new Float64Array(this.steps),
        this.groomed = new Float64Array(this.steps),
        this.across = new Float64Array(this.steps),
        this.halfWidth = new Float64Array(this.steps).fill(n)
    }
    sample(e, t) {
        let n = Vu(t - this.from, 0, this.steps - 1)
          , r = a.min(this.steps - 2, a.floor(n))
          , i = n - r;
        return e[r] + (e[r + 1] - e[r]) * i
    }
    line(e) {
        return {
            off: this.sample(this.off, e),
            slope: this.sample(this.slope, e),
            bend: this.sample(this.bend, e)
        }
    }
    frame(e, t) {
        let n = Vu(t, this.from, this.to);
        for (let r = 0; r < 6; r++) {
            let r = this.line(n)
              , i = (r.off - e) * r.slope + (n - t);
            n = Vu(n - Vu(i / (r.slope * r.slope + 1), -12, 12), this.from, this.to)
        }
        let r = this.line(n)
          , i = a.hypot(1, r.slope);
        return {
            zf: n,
            d: (e - r.off - r.slope * (t - n)) / i,
            slope: r.slope
        }
    }
    presence(e) {
        return this.main ? Hu((e - this.from) / 40) * (1 - Hu((e - 3050) / 70)) : +(e >= this.from - 1 && e <= this.to + 1)
    }
    near(e, t, n) {
        return t > this.from - 10 && t < this.to + 10 && a.abs(e - this.line(t).off) < (this.half + n) * 1.9 + 4
    }
    halfAt(e) {
        return this.sample(this.halfWidth, e)
    }
    benchAt(e, t) {
        return this.sample(this.groomed, e) + Vu(this.sample(this.across, e), -Ku, Ku) * t
    }
    fill(e, t) {
        let n = 0;
        for (let t = 0; t < this.steps; t++) {
            let r = this.from + t;
            for (; n < e.length - 2 && e[n + 1][0] < r; )
                n++;
            let[i,o] = e[n]
              , [s,c] = e[n + 1]
              , l = Vu((r - i) / a.max(1e-6, s - i), 0, 1);
            this.off[t] = o + (c - o) * l
        }
        let r = Float64Array.from(this.off)
          , i = this.steps;
        for (let e = 0; e < i; e++) {
            let n = 0
              , o = 0;
            for (let s = -t; s <= t; s++) {
                let c = t + 1 - a.abs(s);
                n += r[Vu(e + s, 0, i - 1)] * c,
                o += c
            }
            this.off[e] = n / o
        }
        for (let e = 0; e < i; e++)
            this.slope[e] = (this.off[a.min(i - 1, e + 1)] - this.off[a.max(0, e - 1)]) / (e > 0 && e < i - 1 ? 2 : 1);
        for (let e = 0; e < i; e++)
            this.bend[e] = (this.slope[a.min(i - 1, e + 1)] - this.slope[a.max(0, e - 1)]) / (e > 0 && e < i - 1 ? 2 : 1)
    }
}
  , gd = []
  , _d = () => 0;
function vd(e, t=[]) {
    gd.length = 0;
    let n = []
      , r = td
      , i = $u
      , o = a.atan(nd)
      , s = 1
      , c = 0;
    for (n.push([i, r]); i < ed; ) {
        let l = (e(r + 8, i) - e(r - 8, i)) / 16
          , u = (e(r, i + 8) - e(r, i - 8)) / 16
          , d = a.hypot(l, u)
          , f = a.atan2(-l, -u)
          , p = Vu(id * d, rd[0], rd[1])
          , m = d <= p ? f : f + s * a.min(ad, a.acos(p / d))
          , h = Hu((i - 2900) / 120);
        h > 0 && (m = m * (1 - h) + a.atan2(-r, a.max(20, ed - i)) * h),
        m = Vu(m, -cd, cd);
        let g = a.atan2(a.sin(m - o), a.cos(m - o));
        o += Vu(g, -1 / sd, 1 / sd),
        o = Vu(o, -cd, cd);
        let _ = a.atan2(a.sin(o - f), a.cos(o - f));
        a.abs(_) > ad && d > .1 && (o = f + a.sign(_) * ad),
        r += a.sin(o),
        i += a.cos(o),
        n.push([i, r]);
        let v = od[c % od.length];
        for (let e of t)
            a.abs(e.z - i) < 90 && a.sign(e.off) === s && (v = a.min(v, a.abs(e.off) - e.radius - 12 - ld - 12));
        h < .5 && (s * r > v + 12 || s * r > v - 25 && d < .5) && (s = -s,
        c++)
    }
    let l = new hd($u,ed,12,!0);
    l.fill(n, 6),
    gd.push(l);
    let u = [];
    for (let e = 1; e < l.steps; e++)
        l.slope[e - 1] * l.slope[e] < 0 && l.from + e > 150 && l.from + e < 2900 && u.push({
            z: l.from + e,
            off: l.off[e]
        });
    for (let e = 0; e + 2 < u.length; e++) {
        let n = u[e]
          , r = u[e + 2]
          , i = a.sign(n.off);
        if (i !== a.sign(r.off) || Uu(e, 31) > .55 || gd.some(e => !e.main && e.to > n.z - 40))
            continue;
        let o = [];
        for (let e = n.z; e <= r.z; e += 2) {
            let t = (e - n.z) / (r.z - n.z);
            o.push([e, n.off + (r.off - n.off) * t + i * (ud * a.sin(a.PI * t) + 6 * a.sin(a.PI * 3 * t) * a.sin(a.PI * t))])
        }
        if (o.some( ([e,n]) => a.abs(n) + Wu > dd || t.some(t => a.abs(t.z - e) < 30 && a.abs(t.off - n) < t.radius + Wu + ld)))
            continue;
        let s = new hd(n.z,r.z,Wu,!1);
        s.fill(o, 4),
        gd.push(s)
    }
}
function yd(e, t, n) {
    let r = gd[0]
      , i = bd(r, e, t, n);
    if (i.on)
        return i.height;
    for (let n = 1; n < gd.length; n++) {
        let r = gd[n];
        if (!r.near(e, t, 0) || r.presence(t) <= 0)
            continue;
        let o = r.frame(e, t);
        if (a.abs(o.d) >= r.halfAt(o.zf))
            continue;
        let s = 1 - Hu(i.e / 12);
        return r.benchAt(o.zf, o.d) + (i.height - r.benchAt(o.zf, o.d)) * s
    }
    let o = i.height
      , s = Hu(i.e / 12);
    for (let n = 1; n < gd.length; n++)
        o += (bd(gd[n], e, t, o).height - o) * s;
    return o
}
function bd(e, t, n, r) {
    if (!e.near(t, n, 34))
        return {
            on: !1,
            height: r,
            e: 1 / 0
        };
    let i = e.presence(n);
    if (i <= 0)
        return {
            on: !1,
            height: r,
            e: 1 / 0
        };
    let o = e.frame(t, n)
      , s = e.halfAt(o.zf)
      , c = a.abs(o.d) - s;
    if (c <= 0)
        return {
            on: !0,
            height: r + (e.benchAt(o.zf, o.d) - r) * i,
            e: 0
        };
    if (c > 34)
        return {
            on: !1,
            height: r,
            e: c
        };
    let l = e.benchAt(o.zf, a.sign(o.d) * s)
      , u = a.min(6, c * .6)
      , d = a.abs(e.sample(e.across, o.zf)) + Xu
      , f = l + a.max(qu, d) * md(c)
      , p = l - a.max(Ju, d) * md(c);
    return {
        on: !1,
        height: r + (-pd(-pd(r, f, u), -p, u) + Qu(o.zf, a.sign(o.d), c) - r) * i * (1 - Hu((c - 34 + 8) / 8)),
        e: c
    }
}
function xd(e, t) {
    let n = 99
      , r = 0;
    for (let i of gd) {
        if (!i.near(e, t, 2))
            continue;
        let o = i.frame(e, t)
          , s = i.presence(t) * (1 - Hu((a.abs(o.d) - i.halfAt(o.zf) + .5) / 1.5));
        (s > r || r === 0 && a.abs(o.d) < a.abs(n)) && (r = a.max(r, s),
        n = o.d)
    }
    return {
        d: n,
        groom: r
    }
}
var Sd = (e, t) => xd(e, t).groom;
function Cd(e, t) {
    let n = 1e9;
    for (let r of gd) {
        if (!r.near(e, t, 20))
            continue;
        let i = r.frame(e, t);
        n = a.min(n, a.abs(i.d) - r.halfAt(i.zf))
    }
    return n
}
function wd(e, t, n=0) {
    for (let r of gd) {
        if (!r.near(e, t, n))
            continue;
        let i = r.frame(e, t);
        if (a.abs(i.d) < r.halfAt(i.zf) + n)
            return !0
    }
    return !1
}
var Td = []
  , Ed = new Map
  , Dd = 10;
function Od(e) {
    _d = e,
    Td.length = 0,
    Ed.clear();
    for (let t of gd) {
        let n = t.steps
          , r = new Float64Array(n);
        for (let i = 0; i < n; i++) {
            let n = t.from + i
              , o = t.line(n)
              , s = a.hypot(1, o.slope)
              , c = 1 / s
              , l = -o.slope / s;
            r[i] = e(o.off, n),
            t.across[i] = (e(o.off + c * 6, n + l * 6) - e(o.off - c * 6, n - l * 6)) / 12
        }
        let i = t.main ? 30 : 16;
        for (let e = 0; e < n; e++) {
            let o = 0
              , s = 0;
            for (let t = -i; t <= i; t++) {
                let c = Vu(e + t, 0, n - 1)
                  , l = 1 - a.abs(t) / (i + 1);
                o += r[c] * l,
                s += l
            }
            t.groomed[e] = o / s
        }
        if (!t.main) {
            let e = gd[0];
            for (let r = 0; r < n; r++) {
                let i = a.max(1 - Hu(r / fd), Hu((r - n + 1 + fd) / fd));
                if (i <= 0)
                    continue;
                let o = e.frame(t.off[r], t.from + r);
                t.groomed[r] += (e.benchAt(o.zf, o.d) - t.groomed[r]) * i
            }
        }
        for (let e = 1; e < n; e++)
            t.groomed[e] = a.min(t.groomed[e], t.groomed[e - 1] - .05 * a.hypot(1, t.slope[e]));
        let o = Float64Array.from(t.across);
        for (let e = 0; e < n; e++) {
            let r = 0;
            for (let i = -8; i <= 8; i++)
                r += t.across[Vu(e + i, 0, n - 1)];
            o[e] = r / 17
        }
        t.across.set(o);
        for (let e = 0; e < n; e++)
            t.halfWidth[e] = t.half - Gu * Hu((a.abs(t.across[e]) - .45) / .3);
        t.main && kd(t, e)
    }
    for (let e of Td)
        for (let t = a.floor(e.reach.z0 / 200); t <= a.floor(e.reach.z1 / 200); t++) {
            let n = Ed.get(t) ?? [];
            n.push(e),
            Ed.set(t, n)
        }
}
function kd(e, t) {
    let n = n => {
        let r = e.line(n)
          , i = a.sign(e.sample(e.across, n)) || 1
          , o = a.hypot(1, r.slope)
          , s = e.halfAt(n)
          , c = i * (s + 2);
        return {
            side: i,
            height: t(r.off + c / o, n - r.slope * c / o) - e.benchAt(n, i * s),
            slope: r.slope
        }
    }
      , r = NaN
      , i = 0;
    for (let t = e.from + 60; t <= a.min(e.to, 3040); t += 1) {
        let o = n(t)
          , s = o.height >= 3.2 && o.height <= 11 && a.abs(o.slope) >= .7 && a.abs(e.line(t - Dd).slope) >= .6 && a.abs(e.line(t + Dd).slope) >= .6;
        if (s && Number.isNaN(r) && (r = t),
        (!s || t === 3040) && !Number.isNaN(r)) {
            for (let o = r; t - o >= 26; ) {
                let r = a.min(t - o, 30 + 50 * Uu(++i, 1))
                  , s = 30 + 40 * Uu(i, 2);
                Uu(i, 3) < .8 && Ad(e, o, o + r, n),
                o += r + s
            }
            r = NaN
        }
    }
}
function Ad(e, t, n, r) {
    let i = 0
      , o = 0;
    for (let e = t; e <= n; e += 2) {
        let t = r(e);
        i = a.max(i, t.height),
        o += t.side
    }
    o = a.sign(o) || 1;
    let s = Vu(.14 * i, .7, 1.4)
      , c = []
      , l = 1 / 0
      , u = -1 / 0
      , d = 1 / 0
      , f = -1 / 0;
    for (let r = t - Dd; r <= n + Dd; r += 1) {
        let t = e.line(r)
          , n = a.hypot(1, t.slope);
        for (let i of [-1, s, 34]) {
            let p = o * (e.halfAt(r) + i)
              , m = t.off + p / n
              , h = r - t.slope * p / n;
            l = a.min(l, m),
            u = a.max(u, m),
            d = a.min(d, h),
            f = a.max(f, h),
            i === s && c.push({
                off: m,
                z: h,
                per: a.min(2.4, n / a.max(.5, a.abs(t.slope)))
            })
        }
    }
    c.sort( (e, t) => e.off - t.off),
    Td.push({
        piste: e,
        z0: t,
        z1: n,
        side: o,
        face: s,
        height: i,
        phase: 6.283 * Uu(a.round(t), 7),
        phase2: 6.283 * Uu(a.round(n), 8),
        reach: {
            off0: l - 1,
            off1: u + 1,
            z0: d - 2,
            z1: f + 2
        },
        tops: c
    })
}
function jd(e, t) {
    let n = e.tops;
    if (t <= n[0].off)
        return n[0];
    if (t >= n[n.length - 1].off)
        return n[n.length - 1];
    let r = 0
      , i = n.length - 1;
    for (; r + 1 < i; ) {
        let e = r + i >> 1;
        n[e].off <= t ? r = e : i = e
    }
    let o = (t - n[r].off) / a.max(1e-6, n[i].off - n[r].off);
    return {
        off: t,
        z: n[r].z + (n[i].z - n[r].z) * o,
        per: n[r].per + (n[i].per - n[r].per) * o
    }
}
var Md = e => Hu(e - .7 * a.sin(e * 6 * a.PI) / (6 * a.PI));
function Nd(e, t, n, r) {
    if (t < e.reach.off0 || t > e.reach.off1 || n < e.reach.z0 || n > e.reach.z1)
        return 0;
    let i = e.piste
      , o = i.frame(t, n);
    if (a.sign(o.d) !== e.side)
        return 0;
    let s = i.halfAt(o.zf)
      , c = a.abs(o.d) - s;
    if (c <= 0 || c > 34)
        return 0;
    let l = Hu((o.zf - e.z0 + Dd) / Dd) * (1 - Hu((o.zf - e.z1) / Dd));
    if (l <= 0)
        return 0;
    let u = _d(t, n)
      , d = i.benchAt(o.zf, e.side * s);
    if (u <= d)
        return 0;
    let f = e.face * Vu(1 + .45 * a.sin(o.zf * .23 + e.phase) * a.sin(o.zf * .087 + e.phase2) + .2 * a.sin(o.zf * .71 + e.phase2), .55, 1.7)
      , p = d + (u - d) * (c >= f ? 1 : Md(c / f))
      , m = r ?? yd(t, n, u);
    return a.max(0, p - m) * l
}
function Pd(e, t, n) {
    let r = Ed.get(a.floor(t / 200));
    if (!r)
        return 0;
    let i = 0;
    for (let o of r)
        i = a.max(i, Nd(o, e, t, n));
    return i
}
var Fd = e => Ed.get(a.floor(e / 200)) ?? [];
function Id(e, t) {
    for (let n of Fd(t)) {
        if (e < n.reach.off0 - 4 || e > n.reach.off1 + 4 || t < n.reach.z0 - 4 || t > n.reach.z1 + 4)
            continue;
        let r = n.piste.frame(e, t)
          , i = a.abs(r.d) - n.piste.halfAt(r.zf);
        if (a.sign(r.d) === n.side && i > -2 && i < 22 && r.zf > n.z0 - 6 && r.zf < n.z1 + 6)
            return !0
    }
    return !1
}
var Ld = (e, t, n) => a.max(t, a.min(n, e))
  , Rd = e => {
    let t = Ld(e, 0, 1);
    return t * t * (3 - 2 * t)
}
  , zd = (e, t) => {
    let n = a.imul(e, 2654435761) ^ a.imul(t + 1663821227, 2246822519);
    return n = a.imul(n ^ n >>> 15, 739982445),
    n = a.imul(n ^ n >>> 12, 695872825),
    n ^= n >>> 15,
    (n >>> 0) / 4294967296
}
  , Bd = .36
  , Vd = [.36, .52]
  , Hd = .36
  , Ud = 32
  , Wd = [[260, 60], [700, 70], [1130, 60], [1560, 75], [1990, 65], [2400, 70], [2780, 60], [3060, 30]]
  , Gd = ([e,t], n) => {
    let r = {
        z: e,
        drop: t,
        amp: 4 + 6 * zd(n, 1),
        wave: 220 + 200 * zd(n, 2),
        phase: 6.283 * zd(n, 3),
        amp2: 1 + 1.5 * zd(n, 4),
        wave2: 70 + 60 * zd(n, 5),
        phase2: 6.283 * zd(n, 6),
        steepWave: 70 + 70 * zd(n, 7),
        steepPhase: 6.283 * zd(n, 8),
        from: 0,
        to: 0
    };
    return r.from = e - r.amp - r.amp2 - 1,
    r.to = e + r.amp + r.amp2 + Kd(r, Vd[0]) + 1,
    r
}
  , Kd = (e, t) => 1.5 * e.drop / t
  , qd = Wd.map(Gd)
  , Jd = qd.reduce( (e, t) => e + t.drop, 0)
  , Yd = (e, t) => e.z + e.amp * a.sin(t * 6.283 / e.wave + e.phase) + e.amp2 * a.sin(t * 6.283 / e.wave2 + e.phase2)
  , Xd = (e, t) => Hd + (Vd[0] + (Vd[1] - Vd[0]) * (.5 + .5 * a.sin(t * 6.283 / e.steepWave + e.steepPhase)) - Hd) * Rd((a.abs(t) - Ud) / 20);
function Zd(e, t, n) {
    return n <= e.from ? 0 : n >= e.to ? e.drop : e.drop * Rd((n - Yd(e, t)) / Kd(e, Xd(e, t)))
}
var Qd = 25
  , $d = [];
for (let e = 0; e * Qd < 3400; e++) {
    let t = e * Qd
      , n = t + Qd;
    $d.push({
        above: qd.filter(e => e.to <= t).reduce( (e, t) => e + t.drop, 0),
        near: qd.filter(e => e.to > t && e.from < n)
    })
}
function ef(e, t) {
    if (t <= 0)
        return 0;
    let n = $d[a.min($d.length - 1, a.floor(t / Qd))]
      , r = n.above;
    for (let i of n.near)
        r += Zd(i, e, t);
    return r
}
var tf = []
  , nf = (e, t) => {
    let n = a.imul(e, 2146121005) ^ a.imul(t + 1013904242, 2221713035);
    return n = a.imul(n ^ n >>> 16, 739982445),
    n = a.imul(n ^ n >>> 13, 695872825),
    n ^= n >>> 16,
    (n >>> 0) / 4294967296
}
;
function rf(e) {
    tf.length = 0,
    qd.forEach( (t, n) => {
        for (let r = 0; r < 8; r++) {
            let i = n * 16 + r
              , a = (n % 2 ? -1 : 1) * (r < 4 ? 1 : -1) * (40 + 50 * nf(i, 2))
              , o = {
                name: `EDGE ${n + 1}`,
                z: Yd(t, a) - 2 - 3 * nf(i, 3),
                offset: a,
                shaped: !0,
                halfWidth: 6 + 3 * nf(i, 4),
                rise: 2.4 + 1.2 * nf(i, 5),
                run: 14 + 6 * nf(i, 6),
                drop: 1.1,
                arc: .5 + .5 * nf(i, 8)
            }
              , s = !0;
            for (let t of [-o.run, -o.run / 2, 0, 10, 22])
                for (let n of [-1, 0, 1])
                    e(a + n * o.halfWidth, o.z + t) || (s = !1);
            if (s) {
                tf.push(o);
                break
            }
        }
    }
    )
}
var af = (e, t, n) => a.max(t, a.min(n, e))
  , of = e => {
    let t = af(e, 0, 1);
    return t * t * (3 - 2 * t)
}
  , sf = (e, t) => {
    let n = a.imul(e, 2654435761) ^ a.imul(t + 1663821227, 2246822519);
    return n = a.imul(n ^ n >>> 15, 739982445),
    n = a.imul(n ^ n >>> 12, 695872825),
    n ^= n >>> 15,
    (n >>> 0) / 4294967296
}
  , cf = []
  , lf = new Map
  , uf = () => 0
  , df = .15
  , ff = .04
  , pf = e => a.max(.5, ff * e.height)
  , mf = e => a.max(.6, .08 * e.height)
  , hf = 262
  , gf = .15
  , _f = 6
  , vf = 16
  , yf = 3.5
  , bf = (e, t) => e.off + e.skew * (e.z - t)
  , xf = e => e.z - e.length
  , Sf = (e, t, n) => e.top - e.grade * (n - xf(e)) + e.tilt * (t - bf(e, n))
  , Cf = e => e <= 0 ? 0 : e < _f ? e * e / (2 * _f) : e - _f / 2
  , wf = (e, t) => e.half * (e.taper + (1 - e.taper) * of(t / e.length * 1.25))
  , Tf = (e, t, n, r) => {
    let i = wf(e, a.max(0, r))
      , o = a.abs(t - bf(e, n));
    if (o >= i)
        return 0;
    if (e.soft) {
        let t = a.min(.85 * i, Lf[0] + Lf[1] * e.height);
        return 1 - of((o - (i - t)) / t)
    }
    let s = a.min(.75 * i, 4 + e.height)
      , c = (o - (i - s)) / s;
    return 1 - .55 * of(c / .78) - .45 * of((c - .72) / .22)
}
  , Ef = (e, t) => {
    let n = af((t - e.off) / e.half, -1, 1);
    return e.z - e.bow * a.min(.8 * e.half, .6 * e.length) * a.abs(n) ** e.lobe + e.slant * n * e.half + .6 * a.sin(n * 3.1 + e.phase) + .3 * a.sin(n * 7.3 + e.phase2)
}
  , Df = e => af(.04 * e.height, .3, 1.2)
  , Of = (e, t) => {
    let n = af(t - e.off, -e.half, e.half)
      , r = 2 * a.PI / af(.2 * e.half, 8.4, 18);
    return Ef(e, t) + Df(e) * (.65 * a.sin(n * r + e.phase * 1.7) + .35 * a.sin(n * r * 2 + e.phase2 * 2.3))
}
  , kf = new Map
  , Af = (e, t) => {
    let n = kf.get(e);
    n || kf.set(e, n = new Map);
    let r = n.get(t);
    if (r === void 0) {
        let i = Of(e, t);
        r = Cf(Sf(e, t, i) - uf(t, i)) * .9,
        n.size > 4096 && n.clear(),
        n.set(t, r)
    }
    return r
}
  , jf = (e, t) => {
    let n = af((t - e.off) / e.half, -1, 1);
    return a.max(.5, df * Af(e, t) * (1 + .45 * a.sin(n * 5.3 + e.phase) * a.sin(n * 2.1 + e.phase2) + .25 * a.sin(n * 13 + e.phase * 3)))
}
  , Mf = e => of(e - .7 * a.sin(e * 6 * a.PI) / (6 * a.PI));
function Nf(e) {
    let t = xf(e)
      , n = e.z - e.length / 2
      , r = .4 * e.half;
    e.top = uf(bf(e, t), t),
    e.tilt = e.soft ? 0 : af((uf(bf(e, n) + r, n) - uf(bf(e, n) - r, n)) / (2 * r), -gf, gf),
    e.height = Af(e, e.off)
}
function Pf(e) {
    let t = a.abs(e.skew) * e.length
      , n = e.half * a.max(1, e.taper)
      , r = -1 / 0;
    for (let t = -1; t <= 1; t += 1 / 32) {
        let n = e.off + t * e.half;
        r = a.max(r, Of(e, n) + jf(e, n))
    }
    return {
        off0: e.off - n - t - 1,
        off1: e.off + n + t + 1,
        z0: xf(e) - vf - 1,
        z1: r + .3 + mf(e) + .8
    }
}
var Ff = e => e.reach;
function If(e, t= () => !0) {
    cf.length = 0,
    lf.clear(),
    kf.clear(),
    uf = e;
    let n = (t, n) => (e(t, n - 2) - e(t, n + 2)) / 4
      , r = e => cf.every(t => e.reach.off1 + 8 < t.reach.off0 || t.reach.off1 + 8 < e.reach.off0 || e.reach.z1 + 2 * e.height + 12 < t.reach.z0 || t.reach.z1 + 2 * t.height + 12 < e.reach.z0)
      , i = 0;
    for (let o = 520; o < 2900; o += 26)
        for (let s = -4; s <= 4; s++) {
            let c = ++i;
            if (sf(c, 1) > .7)
                continue;
            let l = o + (sf(c, 2) - .5) * 20
              , u = s * 52 + (sf(c, 3) - .5) * 30;
            if (a.abs(u) > hf - 30 || !t(u, l) || !t(u, l + 30) || !t(u, l + 50) || cf.some(e => u > e.reach.off0 - 20 && u < e.reach.off1 + 20 && l > e.reach.z0 - 30 && l < e.reach.z1 + 2 * e.height + 20))
                continue;
            let d = (e(u + 6, l) - e(u - 6, l)) / 12
              , f = (e(u, l + 6) - e(u, l - 6)) / 12;
            if (f > -.25 || f < -1.1)
                continue;
            let p = 4 + 5 * sf(c, 4)
              , m = {
                off: u,
                z: l,
                half: (12 + 2.4 * p) * (.85 + .35 * sf(c, 5)),
                length: 0,
                height: 0,
                grade: .06 + .06 * sf(c, 6),
                taper: .85 + .3 * sf(c, 7),
                skew: (sf(c, 8) - .5) * .1,
                bow: .1 + .25 * sf(c, 9),
                lobe: 1.8 + 1.2 * sf(c, 10),
                slant: af(-d / f, -.8, .8) + (sf(c, 11) - .5) * .1,
                phase: 6.283 * sf(c, 12),
                phase2: 6.283 * sf(c, 13),
                top: 0,
                tilt: 0,
                cluster: cf.length,
                tier: 0,
                reach: {
                    off0: 0,
                    off1: 0,
                    z0: 0,
                    z1: 0
                },
                soft: !0
            };
            for (let e = 6; e < 48 && (m.z = l + e,
            m.length = e,
            kf.delete(m),
            Nf(m),
            !(m.height >= p)); e += 3)
                ;
            if (m.height < 3.5 || m.height > 10 || a.abs(m.off) + m.half * a.max(1, m.taper) + a.abs(m.skew) * m.length > hf || (m.reach = Pf(m),
            !r(m)))
                continue;
            let h = Of(m, m.off)
              , g = !0;
            for (let e = xf(m) - vf; g && e <= h + 2 * m.height + 12; e += 6)
                for (let n = -1.15; g && n <= 1.15; n += .23)
                    g = t(bf(m, e) + n * m.half * a.max(1, m.taper), e);
            if (!g || [-.5, 0, .5].some(e => {
                let t = m.off + e * m.half
                  , r = Of(m, t);
                return [r + m.height * .6 + 3, r + m.height * 1.4 + 7].some(e => {
                    let r = n(t, e);
                    return r < .25 || r > 1.4
                }
                )
            }
            ))
                continue;
            let _ = !1;
            for (let e of [.5, .95]) {
                let t = xf(m) + e * (h - xf(m))
                  , n = NaN;
                for (let e = m.reach.off0; !_ && e <= m.reach.off1; e += .75) {
                    if (t > Of(m, e) - 1) {
                        n = NaN;
                        continue
                    }
                    let r = Bf(m, e, t);
                    a.abs(r - n) > .75 && (_ = !0),
                    n = r
                }
            }
            _ || cf.push(m)
        }
    for (let e of cf)
        for (let t = a.floor((e.reach.z0 - 3) / 200); t <= a.floor((e.reach.z1 + e.height * 3 + 20) / 200); t++) {
            let n = lf.get(t) ?? [];
            n.push(e),
            lf.set(t, n)
        }
}
var Lf = [5, 1.6]
  , Rf = []
  , zf = e => lf.get(a.floor(e / 200)) ?? Rf;
function Bf(e, t, n, r) {
    let i = xf(e)
      , a = n - i;
    if (a < -vf || t < e.reach.off0 || t > e.reach.off1 || n > e.reach.z1)
        return 0;
    let o = Of(e, t)
      , s = n - o;
    if (s <= 0) {
        let i = Tf(e, t, n, a);
        if (!i)
            return 0;
        let o = a >= 0 ? 1 : of(1 + a / vf);
        return Cf(Sf(e, t, n) - (r ?? uf(t, n))) * i * o * (1 - .1 * of(1 + s / pf(e)))
    }
    let c = jf(e, t);
    if (s > c)
        return 0;
    let l = Tf(e, t, n, o - i);
    return l ? Af(e, t) * l * (1 - Mf(s / c)) : 0
}
function Vf(e, t, n) {
    let r = 0
      , i = 0
      , a = null
      , o = null;
    for (let s of zf(t)) {
        let c = Bf(s, e, t, n);
        c <= 0 || (c > r ? (i = r,
        o = a,
        r = c,
        a = s) : c > i && (i = c,
        o = s))
    }
    return r + (a && o && a.cluster === o.cluster ? Hf(r, i) : 0)
}
var Hf = (e, t) => {
    let n = yf - a.abs(e - t);
    return n > 0 ? n * n / (4 * yf) * of(a.min(e, t)) : 0
}
;
function Uf(e, t, n, r, i) {
    let o = Bf(e, n, r, i)
      , s = 0;
    for (let o of t)
        o !== e && (s = a.max(s, Bf(o, n, r, i)));
    return {
        lift: o + (o > 0 && s > 0 ? Hf(o, s) : 0),
        hidden: s > o + yf + .3
    }
}
function Wf(e, t) {
    for (let n of zf(t)) {
        if (e < n.reach.off0 - 3 || e > n.reach.off1 + 3)
            continue;
        let r = t - Of(n, e);
        if (n.soft) {
            if (r > -8 && r < n.height * 2.2 + 12 || r > -26 && r <= -8 && a.abs(e - bf(n, t)) < n.half * .35)
                return !0;
            continue
        }
        if (r > -a.max(25, .45 * n.length) && r < n.height * 2.5 + 10)
            return !0;
        let i = t - xf(n);
        if (i <= 0 || r > 0)
            continue;
        let o = Tf(n, e, t, i);
        if (o > .02 && o < .9)
            return !0
    }
    return !1
}
var Gf = []
  , Kf = (e, t) => {
    let n = a.imul(e, 2146121005) ^ a.imul(t + 1013904242, 2221713035);
    return n = a.imul(n ^ n >>> 16, 739982445),
    n = a.imul(n ^ n >>> 13, 695872825),
    n ^= n >>> 16,
    (n >>> 0) / 4294967296
}
  , qf = 4.5
  , Jf = 520
  , Yf = 2900
  , Xf = 3
  , Zf = 110
  , Qf = 3
  , $f = 90
  , ep = 230
  , tp = .16
  , np = 2
  , rp = 45
  , ip = .2;
function ap(e, t) {
    Gf.length = 0;
    let n = gd[0]
      , r = [];
    for (let e = n.from + 2, t = a.sign(n.line(n.from + 1).slope); e < n.to; e += 2) {
        let i = a.sign(n.line(e).slope);
        i && i !== t && (r.push(e),
        t = i)
    }
    for (let i = 0; i + 1 < r.length; i++) {
        let o = r[i]
          , s = r[i + 1];
        if (s < Jf || o > Yf)
            continue;
        let c = null;
        for (let r = 0; r < 7 && !c; r++) {
            let l = .5 + (r % 2 ? 1 : -1) * a.ceil(r / 2) * .07
              , u = o + (s - o) * l;
            if (u < Jf || u > Yf)
                continue;
            let d = n.line(u)
              , f = a.hypot(1, d.slope)
              , p = -a.sign(d.slope)
              , m = n.halfAt(u) + 1
              , h = d.off + p * m / f
              , g = u - p * d.slope * m / f
              , _ = Kf(i, r) * a.PI * 2
              , v = []
              , y = !1;
            for (let e = 0; e <= ep; e += Qf) {
                let n = g + e
                  , r = h + Xf * (a.sin(a.PI * 2 * e / Zf + _) - a.sin(_));
                if (v.push({
                    off: r,
                    z: n
                }),
                e > 24 && wd(r, n, 1)) {
                    y = e >= $f;
                    break
                }
                if (e > 12 && (!t(r, n) || !t(r - qf, n) || !t(r + qf, n)))
                    break
            }
            if (!y)
                continue;
            let b = a.round(21 / Qf)
              , x = !0;
            for (let t = 0; t + b < v.length; t++)
                (e(v[t].off, v[t].z) - e(v[t + b].off, v[t + b].z)) / (b * Qf) < tp && (x = !1);
            let S = Gf.every(e => e.z1 < v[0].z - 10 || e.z0 > v[v.length - 1].z + 10 || v.every(t => e.points.every(e => a.abs(e.z - t.z) > Qf || a.abs(e.off - t.off) > 40)));
            x && S && (c = {
                points: v,
                phase: _
            })
        }
        if (!c)
            continue;
        let {points: l, phase: u} = c
          , d = Gf.length
          , f = {
            name: `TRAIL ${d + 1}`,
            points: l,
            half: qf,
            z0: l[0].z,
            z1: l[l.length - 1].z
        };
        Gf.push(f);
        let p = l[0].z
          , m = f.z1 - p
          , h = 0
          , g = -1 / 0;
        for (let t = a.ceil((u - a.PI / 2) / a.PI); h < np; t++) {
            let n = (a.PI / 2 + t * a.PI - u) / (a.PI * 2) * Zf;
            if (n > m * .82)
                break;
            if (!(n < m * .28 || n - g < rp))
                for (let r of [0, -6, 6, -12, 12]) {
                    let i = n + r
                      , o = p + i
                      , s = l[a.max(0, a.min(l.length - 1, a.round(i / Qf)))].off
                      , c = d * 8 + t
                      , u = {
                        name: `${f.name} KICKER`,
                        z: o,
                        offset: s,
                        shaped: !0,
                        halfWidth: qf - .5,
                        rise: 2.1 + .7 * Kf(c, 5),
                        run: 14 + 3 * Kf(c, 6),
                        drop: 1.2,
                        arc: .3
                    }
                      , m = t => (e(s, o + t - 2) - e(s, o + t + 2)) / 4;
                    if (m(-6) < .25 || m(-6) > .9 || m(10) < .3 || m(18) < .3)
                        continue;
                    let _ = (t, n) => a.max(a.abs((e(t - 3.4, n) + e(t + 3.4, n)) / 2 - e(t, n)), a.abs((e(t, n - 3.4) + e(t, n + 3.4)) / 2 - e(t, n)))
                      , v = !0;
                    for (let e of [-u.run, -u.run / 2, -2, u.drop + 2])
                        for (let t of [-1, 0, 1])
                            _(s + t * u.halfWidth, o + e) > ip && (v = !1);
                    if (v) {
                        tf.push(u),
                        h++,
                        g = i;
                        break
                    }
                }
        }
    }
}
function op(e, t, n=0) {
    for (let r of Gf) {
        if (t < r.z0 - r.half - n || t > r.z1 + r.half + n)
            continue;
        let i = a.max(0, a.min(r.points.length - 1, a.round((t - r.z0) / Qf)));
        for (let o = a.max(0, i - 2); o <= a.min(r.points.length - 1, i + 2); o++) {
            let i = r.points[o];
            if ((i.off - e) ** 2 + (i.z - t) ** 2 < (r.half + n) ** 2)
                return !0
        }
    }
    return !1
}
var sp = e => {
    let t = a.max(0, a.min(1, e));
    return t * t * (3 - 2 * t)
}
  , cp = []
  , lp = (e, t) => e.offset + e.bend * sp((t - e.z + e.uphill) / (e.uphill + e.downhill))
  , up = (e, t) => {
    let n = a.imul(e, 668265261) ^ a.imul(t + 374761393, 2654435761);
    return n = a.imul(n ^ n >>> 15, 739982445),
    n = a.imul(n ^ n >>> 12, 695872825),
    n ^= n >>> 15,
    (n >>> 0) / 4294967296
}
  , dp = qd.flatMap( (e, t) => [t % 2 ? 1 : -1, ...up(t, 1) < .55 ? [t % 2 ? -1 : 1] : []].flatMap( (n, r) => {
    let i = t * 4 + r
      , o = n * (70 + 90 * up(i, 2))
      , s = 1.5 * e.drop / Xd(e, o)
      , c = Yd(e, o) + s * (.1 + .35 * up(i, 5))
      , l = 3 + a.floor(up(i, 3) * 3);
    return Array.from({
        length: l
    }, (e, t) => ({
        z: c + t * (8 + 5 * up(i, 50 + t)),
        offset: o + (up(i, 10 + t) - .5) * 12,
        rx: 4 + 3 * up(i, 20 + t),
        rz: 4 + 2.5 * up(i, 30 + t),
        height: 1.5 + 1.5 * up(i, 40 + t)
    }))
}
));
function fp(e, t) {
    let n = new Map;
    for (let r of e) {
        let[e,i] = t(r);
        for (let t = a.floor(e / 200); t <= a.floor(i / 200); t++) {
            let e = n.get(t) ?? [];
            e.push(r),
            n.set(t, e)
        }
    }
    return n
}
var pp = fp(cp, e => [e.z - e.uphill, e.z + e.downhill * 1.4])
  , mp = fp(dp, e => [e.z - e.rz, e.z + e.rz])
  , hp = fp(dp, e => [e.z - e.rz - 4, e.z + e.rz + 28])
  , gp = [];
function _p(e) {
    for (let t = dp.length - 1; t >= 0; t--)
        e(dp[t]) && dp.splice(t, 1);
    mp = fp(dp, e => [e.z - e.rz, e.z + e.rz]),
    hp = fp(dp, e => [e.z - e.rz - 4, e.z + e.rz + 28])
}
function vp(e, t) {
    let n = 0;
    for (let r of pp.get(a.floor(t / 200)) ?? gp) {
        let i = t - r.z
          , o = i / (i < 0 ? r.uphill : r.downhill * 1.4)
          , s = (e - lp(r, t)) / (r.width * .7);
        a.abs(o) < 1 && a.abs(s) < 1 && (n += .4 * r.height * (1 - o * o) ** 2 * (1 - s ** 4) ** 2)
    }
    for (let r of mp.get(a.floor(t / 200)) ?? gp) {
        let i = (e - r.offset) / r.rx
          , a = (t - r.z) / r.rz
          , o = i * i + a * a;
        o < 1 && (n += r.height * (1 - o) ** 2)
    }
    return n
}
function yp(e, t) {
    return (hp.get(a.floor(t / 200)) ?? gp).some(n => t > n.z - n.rz - 4 && t < n.z + n.rz + 28 && a.abs(e - n.offset) < n.rx + 5)
}
var bp = (e, t, n) => a.max(t, a.min(n, e))
  , xp = e => {
    let t = bp(e, 0, 1);
    return t * t * (3 - 2 * t)
}
  , Sp = {
    snowWalls: !0
}
  , Cp = 3200
  , wp = 3185
  , Tp = 3255
  , Ep = [140, 800, 2200]
  , Dp = -184.34
  , Op = e => Dp + (e - -10) * .42
  , kp = (Tp - -24) / 278
  , B = e => 28 * a.sin(e * .0023) - 18 * a.sin(e * .0051)
  , Ap = e => (B(e + 1) - B(e - 1)) / 2
  , jp = 40
  , Mp = 100
  , Np = 3150
  , Pp = Cp;
function Fp(e) {
    if (e <= jp)
        return 0;
    let t = Mp - jp;
    if (e <= Mp)
        return Bd * (e - jp) ** 2 / (2 * t);
    let n = Bd * t / 2;
    if (e <= Np)
        return n + Bd * (e - Mp);
    let r = Pp - Np
      , i = a.min(e, Pp) - Np;
    return n + Bd * (Np - Mp) + Bd * (i - i * i / (2 * r))
}
var Ip = 177.3 + Fp(Pp) + Jd;
function V(e) {
    if (e <= 40)
        return Ip;
    let t = Jd * bp((e - 100) / 2900, 0, 1);
    return Ip - Fp(e) - t - .04 * a.max(0, e - Cp - 90)
}
function Lp(e, t) {
    if (t <= 40)
        return Ip;
    let n = xp((a.abs(e) - 175) / 55)
      , r = Jd * bp((t - 100) / 2900, 0, 1);
    return Ip - Fp(t) - (ef(e, t) * (1 - n) + r * n) - .04 * a.max(0, t - Cp - 90)
}
var Rp = [{
    start: 570,
    end: 1250,
    offset: -70,
    name: `WHITE SADDLE`
}, {
    start: 1460,
    end: 2110,
    offset: 62,
    name: `SILVER SHOULDER`
}, {
    start: 2130,
    end: 2990,
    offset: -85,
    name: `CEDAR GLADES`
}, {
    start: 170,
    end: 1440,
    offset: -176,
    name: `WEST FACE`,
    entry: 340,
    width: 32,
    depth: 8
}, {
    start: 210,
    end: 1410,
    offset: 162,
    name: `EAST BOWL`,
    entry: 350,
    width: 34,
    depth: 8
}, {
    start: 1330,
    end: 2250,
    offset: -170,
    name: `RAVEN GULLY`,
    entry: 255,
    width: 30,
    depth: 9
}, {
    start: 1340,
    end: 2270,
    offset: 172,
    name: `SKYLINE PILLOWS`,
    entry: 265,
    width: 32,
    depth: 8
}, {
    start: 2110,
    end: 3050,
    offset: -166,
    name: `BIRCH HOLLOW`,
    entry: 235,
    width: 30,
    depth: 7
}, {
    start: 2110,
    end: 3050,
    offset: 160,
    name: `EAST CEDARS`,
    entry: 245,
    width: 30,
    depth: 7
}]
  , zp = (e, t) => {
    let n = Rp[t];
    return n.offset * (n.entry ? xp((e - n.start) / n.entry) * (1 - xp((e - n.end + n.entry) / n.entry)) : a.sin(a.PI * bp((e - n.start) / (n.end - n.start), 0, 1)))
}
;
function Bp(e, t) {
    let n = a.abs(e - B(t));
    for (let r = 0; r < Rp.length; r++)
        n = a.min(n, a.abs(e - B(t) - zp(t, r)));
    return n
}
var Vp = (e, t) => a.pow(a.max(0, a.abs(e) - 168), 1.25) * .09 * (1 + .25 * a.sin(t * .003))
  , Hp = (e, t) => e.z + a.sin((t - e.offset) / e.halfWidth * a.PI * .72) * e.arc + (a.cos((t - e.offset) / e.halfWidth * a.PI) - 1) * e.arc * .24
  , Up = (e, t) => 1 - xp((a.abs(t - e.offset) - e.halfWidth * .6) / (e.halfWidth * .4));
function Wp(e, t) {
    let n = new Map;
    for (let r of e) {
        let[e,i] = t(r);
        for (let t = a.floor(e / 200); t <= a.floor(i / 200); t++) {
            let e = n.get(t) ?? [];
            e.push(r),
            n.set(t, e)
        }
    }
    return n
}
var Gp = new Map
  , Kp = []
  , qp = [{
    z: 3055,
    off: -190,
    rx: 78,
    rz: 85,
    h: 8
}, {
    z: 3110,
    off: 228,
    rx: 90,
    rz: 110,
    h: 11
}, {
    z: 3205,
    off: -238,
    rx: 68,
    rz: 95,
    h: 9
}, {
    z: 3270,
    off: 145,
    rx: 85,
    rz: 100,
    h: 7
}, {
    z: 3320,
    off: -165,
    rx: 90,
    rz: 85,
    h: 6
}];
function Jp(e, t) {
    if (t < 2950 || t > 3420)
        return 0;
    let n = 0;
    for (let r of qp) {
        let i = (e - B(t) - r.off) / r.rx
          , o = (t - r.z) / r.rz;
        a.abs(i) < 1 && a.abs(o) < 1 && (n += r.h * (1 - i * i) ** 2 * (1 - o * o) ** 2)
    }
    return n
}
function Yp(e, t, n) {
    if (n < e.z - e.run - e.arc * 1.5 || n > e.z + e.drop + e.arc * 1.5 || a.abs(t - e.offset) >= e.halfWidth)
        return 0;
    let r = Hp(e, t)
      , i = bp((n - r + e.run) / e.run, 0, 1);
    return e.rise * i * i * (1 - xp((n - r) / e.drop)) * Up(e, t)
}
function Xp(e, t) {
    let n = 0;
    for (let r of Gp.get(a.floor(t / 200)) ?? Kp)
        n = a.max(n, Yp(r, e, t));
    return n
}
var Zp = {
    across: 3.9,
    along: 4.4,
    depth: 1.44
}
  , Qp = .3
  , $p = -.25
  , em = 1.4
  , tm = 1.1
  , nm = 24
  , rm = null;
function im() {
    return rm ??= Ep.map(e => {
        let t = Sm(e)
          , n = 1 / 0;
        for (let r of [-Zp.across, 0, Zp.across])
            for (let i of [-Zp.along, 0, Zp.along])
                n = a.min(n, cm(t + r, e + i));
        let r = n - Qp
          , i = r + Zp.depth;
        return {
            x: t,
            z: e,
            bottom: r,
            top: i,
            level: i - $p
        }
    }
    )
}
function am(e, t, n) {
    let r = 0;
    for (let i of im()) {
        let o = e - i.x
          , s = t - i.z;
        if (a.abs(o) > nm || a.abs(s) > nm)
            continue;
        let c = a.max(0, a.abs(o) - Zp.across - em)
          , l = a.max(0, a.abs(s) - Zp.along - em)
          , u = a.hypot(c, l)
          , d = u < 1 ? u * u / 2 : u - .5
          , f = i.level - tm * d;
        r = a.max(r, f - (n ?? cm(e, t)))
    }
    return r
}
var om = (e, t, n) => a.max(Vf(e, t, n), Xp(e, t), Pd(e, t, n), am(B(t) + e, t, n));
function sm(e, t) {
    return cm(e, t) + om(e - B(t), t)
}
function cm(e, t) {
    return yd(e - B(t), t, lm(e, t))
}
function lm(e, t) {
    let n = e - B(t)
      , r = xp((t - 70) / 75)
      , i = 1 - xp((t - 3090) / 80)
      , o = Vp(n, t)
      , s = vp(n, t)
      , c = (a.sin(e * .044 + t * .033) * .28 + a.sin(e * .077 - t * .021) * .18) * xp((Cd(n, t) - 2) / 12)
      , l = Lp(n, t) + (s + c) * r * i + o * r + Jp(e, t);
    for (let n of [-24, Tp]) {
        let r = Sm(n)
          , i = 1 - xp((a.max(a.abs(e - r) / 68, a.abs(t - n) / 68) - .55) / .45);
        l += (V(n) - l) * i
    }
    let u = 6 * (1 - xp(t / 20));
    return l += u * (1 - xp((a.abs(e - Sm(-24)) - 45) / 35)),
    l
}
function um(e, t) {
    let n = sm(e, t)
      , r = 1 / a.hypot(1, .034)
      , i = .034 * r;
    for (let o of [-24, Tp]) {
        if (a.abs(t - o) > 20)
            continue;
        let s = e - Sm(o)
          , c = t - o
          , l = s * r - c * i
          , u = s * i + c * r;
        a.abs(l + 5) <= 20.8 && a.abs(u) <= 18.8 && (n = a.max(n, sm(Sm(o), o) + .22))
    }
    return n
}
var dm = (e, t) => e < 0 ? 0 : (.07 + (.8 + .1 * xp((e - 1750) / 650)) * xp((e - 40) / 80)) * (t === void 0 ? 1 : 1 - .85 * Sd(t - B(e), e))
  , fm = (e, t, n=0, r) => {
    let i = dm(t, r);
    return a.min(.98, i * (.9 - .16 * xp(e / 36)) + .26 * n * a.min(1, i / .7))
}
  , pm = []
  , mm = []
  , hm = []
  , gm = []
  , _m = []
  , vm = []
  , ym = []
  , bm = (e, t) => B(t)
  , xm = [[0, `SHIRAKUMO SUMMIT`], [100, `WHITE ROOM`], [700, `WHITE SADDLES`], [1250, `SILVER RIDGE`], [1900, `SNOW GHOSTS`], [2400, `CEDAR PILLOWS`], [2950, `BASECAMP · FINISH AHEAD`], [3145, `SHIRAKUMO FINISH`]]
  , Sm = (e, t=0) => -190 + e * .034 + t;
function Cm(e, t=0) {
    let n = (e % (288 * 2) + 288 * 2) % (288 * 2)
      , r = n < 288
      , i = n % 288
      , a = bp((i - 10) / 278, 0, 1)
      , o = t === 0 ? r : !r
      , s = t === 0 ? r ? 1 - a : a : r ? a : 1 - a;
    return {
        up: o,
        z: -24 + s * (Tp - -24),
        lane: t === 0 ? -6 : 6,
        p: o ? 1 - s : 1 + s,
        stopped: i < 10
    }
}
function wm(e, t=0) {
    let n = Cm(e, t);
    if (!n.up)
        return 0;
    let r = (e % 288 + 288) % 288;
    return a.max(0, 10 - r) + (1 - n.p) * 278
}
vd(Lp, Ep.map(e => ({
    off: Sm(e) - B(e),
    z: e,
    radius: 6
}))),
_p(e => wd(e.offset, e.z, e.rx + 14) || wd(e.offset, e.z - e.rz, e.rx + 14) || wd(e.offset, e.z + e.rz, e.rx + 14)),
Od( (e, t) => lm(B(t) + e, t)),
_p(e => Td.some(t => e.offset + e.rx + 4 > t.reach.off0 && e.offset - e.rx - 4 < t.reach.off1 && e.z + e.rz + 4 > t.reach.z0 && e.z - e.rz - 4 < t.reach.z1)),
If( (e, t) => cm(B(t) + e, t) - vp(e, t), (e, t) => !wd(e, t, 14) && a.abs(B(t) + e - Sm(t)) > 24),
_p(e => cf.some(t => e.offset + e.rx + 4 > t.reach.off0 && e.offset - e.rx - 4 < t.reach.off1 && e.z + e.rz + 4 > t.reach.z0 && e.z - e.rz - 4 < t.reach.z1) || Wf(e.offset, e.z)),
rf( (e, t) => !dp.some(n => ((e - n.offset) / (n.rx + 6)) ** 2 + ((t - n.z) / (n.rz + 6)) ** 2 < 1) && a.abs(B(t) + e - Sm(t)) > 22 && !wd(e, t, 22) && !Wf(e, t) && !cf.some(n => e > n.reach.off0 - 6 && e < n.reach.off1 + 6 && t > n.reach.z0 - 6 && t < n.reach.z1 + 6)),
ap( (e, t) => cm(B(t) + e, t), (e, t) => a.abs(e) < 240 && a.abs(B(t) + e - Sm(t)) > 26 && !Wf(e, t) && !Id(e, t) && !cf.some(n => e > n.reach.off0 - 4 && e < n.reach.off1 + 4 && t > n.reach.z0 - 4 && t < n.reach.z1 + 4) && !Td.some(n => e > n.reach.off0 - 4 && e < n.reach.off1 + 4 && t > n.reach.z0 - 4 && t < n.reach.z1 + 4) && !dp.some(n => ((e - n.offset) / (n.rx + 6)) ** 2 + ((t - n.z) / (n.rz + 6)) ** 2 < 1) && !tf.some(n => t > n.z - n.run - 10 && t < n.z + 30 && a.abs(e - n.offset) < n.halfWidth + 10)),
Gp = Wp(tf, e => [e.z - e.run - e.arc * 1.5, e.z + e.drop + e.arc * 1.5]),
rm = null;
var Tm = e({
    AIR_ANGLE: () => Rh,
    AIR_GRAVITY: () => ah,
    AIR_RATE: () => zh,
    AIR_REACH: () => 1,
    AIR_WINDOW: () => Bh,
    BRANCHES: () => Rp,
    COURSE_LENGTH: () => Cp,
    COURSE_WIDTH: () => 520,
    FINISH_HALF_WIDTH: () => 256,
    FINISH_Z: () => wp,
    FLAT_SLAM: () => Eh,
    FLIP_RATE: () => kh,
    FORWARD_TUCK_SPEED: () => 18,
    FORWARD_TUCK_TIME: () => Ph,
    FUNNEL_ANGLE: () => Ih,
    FUNNEL_PULL: () => Lh,
    FUNNEL_REACH: () => Fh,
    GRAB_SPIN_RATE: () => jh,
    JIB_PLATFORMS: () => gm,
    JIB_SECTIONS: () => hm,
    JUMPS: () => pm,
    KICKER_BACK: () => fh,
    LIFT_DURATION: () => 278,
    LIFT_SPEED: () => kp,
    LIFT_TOWER_SPACING: () => 800,
    PARK_BANKS: () => vm,
    PARK_ENTRY_Z: () => 40,
    POP_CATCH: () => nh,
    POP_CLEAR: () => th,
    POP_GAP: () => $m,
    POP_KICK: () => 24,
    POP_STEP: () => eh,
    POWDER_MAX_SPEED: () => 43,
    RAILS: () => mm,
    RAIL_LIP: () => Zm,
    RAIL_SPIN_RATE: () => Oh,
    ROLLERS: () => _m,
    SNOW_FORMS: () => ym,
    SPIN_RATE: () => Dh,
    SPIN_TURN_RATE: () => Ah,
    SkiSimulation: () => Hh,
    UP_RUN: () => 3,
    UP_START: () => qm,
    ZONES: () => xm,
    baseHeight: () => V,
    branchOffset: () => zp,
    cabinTravel: () => wh,
    center: () => B,
    clamp: () => H,
    climbsOut: () => Jm,
    courseTangent: () => Ap,
    damp: () => Dm,
    groundHeight: () => bh,
    groundLaunch: () => Im,
    groundPop: () => Lm,
    jibGrooming: () => uh,
    jibLips: () => lh,
    jibSectionCenter: () => bm,
    jibTerraces: () => _h,
    jumpCenter: () => jm,
    jumpStyle: () => km,
    lerp: () => Em,
    liftX: () => Ch,
    lineDistance: () => Bp,
    mountainHeight: () => Sh,
    mountainShoulder: () => Vp,
    parkBanks: () => vh,
    parkGrooming: () => yh,
    popLine: () => ih,
    railCrest: () => oh,
    railFrame: () => Gm,
    railHeading: () => Um,
    railLipRun: () => Qm,
    railPoint: () => Wm,
    railPopGap: () => rh,
    railTop: () => Xm,
    rampHeight: () => hh,
    rampLaunch: () => Mm,
    riderSurface: () => Bm,
    sculptedSnow: () => gh,
    snowGrade: () => zm,
    snowSurface: () => xh,
    terrainHeight: () => W,
    zoneAt: () => Th
})
  , H = (e, t, n) => a.max(t, a.min(n, e))
  , Em = (e, t, n) => e + (t - e) * n
  , Dm = (e, t, n, r) => Em(e, t, 1 - a.exp(-n * r))
  , Om = e => {
    let t = H(e, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10)
}
  , U = e => {
    let t = H(e, 0, 1);
    return t * t * (3 - 2 * t)
}
  , km = e => e.kick === `high` ? `HIGH KICK` : e.kind === `step-up` ? `STEP UP` : e.kind === `hip` ? `HIP` : `FLOW`
  , Am = new Map;
function jm(e, t) {
    let n = Am.get(e);
    (!n || !Object.is(n.z, e.z)) && Am.set(e, n = {
        z: e.z,
        x: B(e.z),
        tangent: Ap(e.z)
    });
    let r = a.max(0, t - e.z)
      , i = n.x + n.tangent * r;
    return Em(B(t), i, U(r / e.table)) + e.offset + e.transfer * H(r / 65, 0, 1)
}
function Mm(e, t, n, r=0) {
    let i = a.atan(a.tan(e.lipAngle * a.PI / 180) * a.max(.2, a.cos(r)))
      , o = 1.2 + H(n, 0, 1) * 2.2;
    return {
        horizontal: t * a.cos(i) - o * a.sin(i),
        vertical: t * a.sin(i) + o * a.cos(i)
    }
}
var Nm = a.tan(12 * a.PI / 180);
function Pm(e, t) {
    let n = e - B(t);
    for (let e of tf) {
        if (a.abs(n - e.offset) >= e.halfWidth * .6)
            continue;
        let r = Hp(e, n);
        if (t >= r - e.run && t <= r)
            return !0
    }
    return pm.some(n => t >= n.z - n.run && t <= n.z && a.abs(e - jm(n, t)) < n.width / 2)
}
function Fm(e, t, n, r) {
    return n > r * Nm && !Pm(e, t) ? r * Nm : n
}
function Im(e, t, n, r, i) {
    let {slope: o, crossSlope: s} = Bm(e, t, 0)
      , c = (pm.some(n => t >= n.z - n.run && t <= n.z && a.abs(e - jm(n, t)) < n.width / 2) ? 1.2 + H(i, 0, 1) * 2.2 : 3.6 + H(i, 0, 1) * 2.6) / a.hypot(s, 1, o);
    return {
        velocityX: n - s * c,
        velocityZ: r - o * c,
        vertical: Fm(e, t, s * n + o * r, a.hypot(n, r)) + c
    }
}
var Lm = (e, t, n, r, i) => Im(e, t, n, r, i).vertical;
function Rm(e, t, n) {
    let r = jm(e, n)
      , i = a.max(.6, e.width / 2 - .05)
      , o = a.max(r - i, a.min(r + i - 1, t - .5));
    return W(o + 1, n) - W(o, n)
}
function zm(e, t, n) {
    for (let r of pm)
        if (t <= r.z && t >= r.z - r.lipLength + .5 && a.abs(e - jm(r, t)) < r.width / 2)
            return Rm(r, e, t) * a.sin(n) + a.tan(r.lipAngle * a.PI / 180) * a.cos(n);
    let r = a.sin(n) * .5
      , i = a.cos(n) * .5;
    return W(e + r, t + i) - W(e - r, t - i)
}
function Bm(e, t, n, r=!1) {
    let i = W(e + .5, t) - W(e - .5, t)
      , o = W(e, t + .5) - W(e, t - .5)
      , s = 0;
    for (let n of pm)
        if (t <= n.z && t > n.z - n.lipLength - 3 && a.abs(e - jm(n, t)) < n.width / 2) {
            s = U((t - n.z + n.lipLength + 3) / 3),
            i = Rm(n, e, t),
            t >= n.z - n.lipLength + .5 && (o = a.tan(n.lipAngle * a.PI / 180));
            break
        }
    if (r)
        for (let n of mm) {
            let r = Gm(n, e, t);
            if (r.t >= 0 && r.t <= 1 && a.abs(r.side) < .8) {
                let e = a.max(0, r.t - .01)
                  , t = a.min(1, r.t + .01)
                  , s = Um(n)
                  , c = (Xm(n, t) - Xm(n, e)) / ((t - e) * n.length);
                i = a.sin(s) * c,
                o = a.cos(s) * c;
                break
            }
        }
    return {
        slope: i * a.sin(n) + o * a.cos(n),
        crossSlope: i * a.cos(n) - o * a.sin(n),
        lip: s
    }
}
var Vm = new WeakMap;
function Hm(e) {
    let t = Vm.get(e);
    if (!t) {
        let n = a.atan(Ap(e.z)) + e.angle * a.PI / 180;
        t = {
            h: n,
            sin: a.sin(n),
            cos: a.cos(n),
            c: B(e.z)
        },
        Vm.set(e, t)
    }
    return t
}
var Um = e => Hm(e).h;
function Wm(e, t) {
    let n = Hm(e);
    return {
        x: n.c + e.offset + n.sin * e.length * t,
        z: e.z + n.cos * e.length * t
    }
}
function Gm(e, t, n) {
    let r = Hm(e)
      , i = t - r.c - e.offset
      , a = n - e.z;
    return {
        t: (i * r.sin + a * r.cos) / e.length,
        side: i * r.cos - a * r.sin
    }
}
var Km = {
    flat: () => 0,
    kink: e => e < .3 ? .65 * U(e / .3) : e < .62 ? .65 : .65 * (1 - U((e - .62) / .38)),
    down: e => .35 - .6 * e,
    "down-flat-down": e => e < .28 ? .36 * (1 - U(e / .28)) : e < .64 ? 0 : -.25 * U((e - .64) / .36),
    rainbow: e => 1.5 * a.sin(a.PI * e),
    cannon: e => 1.9 * a.pow(U((e - .55) / .45), 1.3)
}
  , qm = .5
  , Jm = e => e.entry === `ride` && e.profile !== `rainbow`
  , Ym = (e, t) => Jm(e) ? -qm * (1 - U(t * e.length / 3)) : 0;
function Xm(e, t) {
    let n = Wm(e, 0)
      , r = Wm(e, 1)
      , i = H(t, 0, 1);
    return Em(bh(n.x, n.z), bh(r.x, r.z), i) + e.height + Km[e.profile](i) + Ym(e, i)
}
var Zm = 8.5
  , Qm = e => e.entryRun ?? 8.5
  , $m = 2.5
  , eh = .8
  , th = .35
  , nh = .45
  , rh = e => e.entryGap ?? 2.5
  , ih = e => Xm(e, 0) - (Xm(e, .1) - Xm(e, 0)) / (.1 * e.length) * rh(e)
  , ah = 17.5
  , oh = e => e.entry === `pop` ? -rh(e) : 0
  , sh = new WeakMap;
function ch(e) {
    let t = sh.get(e);
    if (!t) {
        let n = rh(e)
          , r = Wm(e, -n / e.length)
          , i = e.entryHeight ?? ih(e) - (e.popStep ?? .8) - bh(r.x, r.z)
          , o = Um(e)
          , s = a.sin(o) * .5
          , c = a.cos(o) * .5
          , l = e.popLaunch === `ballistic` ? bh(r.x + s, r.z + c) - bh(r.x - s, r.z - c) : 0;
        t = {
            height: i,
            power: (a.tan((e.popAngle ?? 24) * a.PI / 180) - l) * (Qm(e) - n) / i
        },
        sh.set(e, t)
    }
    return t
}
function lh(e, t) {
    let n = 0;
    for (let r of mm) {
        let i = Gm(r, e, t)
          , o = i.t * r.length;
        if (r.entry === `transfer` && o < 0)
            continue;
        let s = Qm(r);
        if (o < -s || o > r.length + 14 || a.abs(i.side) > 4.2)
            continue;
        let c = r.height + Km[r.profile](0) + Ym(r, 0), l = U((3.2 - a.abs(i.side)) / 1.6), u;
        if (r.entry === `pop`) {
            let n = ch(r)
              , i = rh(r);
            if (r.popLaunch === `manual` && o <= -i) {
                let c = Wm(r, -i / r.length)
                  , l = bh(c.x, c.z) + n.height;
                u = a.max(0, l - bh(e, t)) * U((o + s) / (s - i - 1.5))
            } else if (r.popLaunch === `ballistic` && o <= -i) {
                let e = (o + s) / (s - i);
                u = n.height * (U(e) + (e * e * e - e * e) * n.power)
            } else
                u = o <= -i ? n.height * a.pow((o + s) / (s - i), n.power) : n.height * (1 - U((o + i) / 1.4))
        } else
            u = r.entry === `transfer` ? 0 : c * (o <= 0 ? U(1 + o / s) : 1 - U(o / 3));
        let d = o - r.length
          , f = (r.exitLanding === !1 ? 0 : 1) * U((d + .5) / 3) * (1 - U((d - 2) / 12)) * a.min(.42, a.max(0, r.height + Km[r.profile](1) - .3))
          , p = U((o - 2) / 5) * (1 - U((o - r.length + (r.exitLanding === !1 ? 5 : 3)) / 5)) * a.exp(-a.pow((a.abs(i.side) - 2.6) / .9, 2)) * .22;
        n = a.max(n, (u + f) * l + p)
    }
    return n
}
function uh(e, t) {
    let n = 0;
    for (let r of hm) {
        let i = U((t - r.start + 16) / 14) * (1 - U((t - r.end - 4) / 16));
        n = a.max(n, i * (1 - U((a.abs(e - bm(r, t)) - r.halfWidth) / 10)))
    }
    return n
}
var dh = (e, t) => {
    let n = a.min(.8, e, t);
    return a.max(e, t) + (n > 0 ? a.pow(a.max(0, 1 - a.abs(e - t) / n), 2) * n * .25 : 0)
}
  , fh = .65
  , ph = new WeakMap;
function mh(e, t, n) {
    let r = n - e.z
      , i = e.mound;
    if (r < -e.run)
        return 0;
    let o = ph.get(e);
    if (!o) {
        let t = e.z - e.run;
        o = vr(e.run, e.lipLength, e.lipAngle, V(t + .5) - V(t - .5)),
        ph.set(e, o)
    }
    let s, c;
    if (r <= 0)
        s = a.max(0, V(e.z - e.run) + o.at(r + e.run) - V(n)),
        c = s * i.height / e.height;
    else {
        let t = H((r - e.table) / e.landing, 0, 1)
          , a = t * t * t * (35 + t * (-105 + t * (126 + t * (-70 + 15 * t))))
          , o = Em(Om(t), a, i.landingBias ?? 0);
        c = (i.height + (i.levelLanding ? V(e.z) - V(n) : 0)) * (1 - o),
        s = c + (e.height - i.height) * (1 - U(r / fh))
    }
    let l = a.abs(t - jm(e, n))
      , u = e.width / 2
      , d = 1 - H((l - u) / .55, 0, 1)
      , f = 1 - H((l - u - (i.shoulder ?? 3)) / (i.wall ?? 4), 0, 1);
    return (c + (s - c) * d) * f
}
function hh(e, t) {
    let n = 0;
    for (let r of pm) {
        let i = t - r.z
          , o = r.approach ?? (r.main ? 64 : 42);
        if (i < -r.run - o || i > r.table + r.landing)
            continue;
        if (r.mound) {
            n = dh(n, mh(r, e, t));
            continue
        }
        let s = a.abs(e - jm(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * U(i / r.table) : 0
          , l = r.foundation ?? (r.main ? 2 : .9)
          , u = Em(9, 2.4, U((i + r.run) / (r.run * .7)))
          , d = U((r.width / 2 + c + (i > .65 ? 9 : u) - s) / (i > .65 ? 9 : u))
          , f = l * U((i + r.run + o) / o) * (1 - U((i - 2) / (r.table * .55))) * U((r.width / 2 + 12 - s) / 7);
        if (i < -r.run)
            n = dh(n, f);
        else if (i <= 0) {
            let e = r.z - r.lipLength
              , o = a.tan(r.lipAngle * a.PI / 180)
              , s = r.height - o * r.lipLength + V(r.z) - V(e)
              , c = (o - (V(e + .5) - V(e - .5))) * (r.run - r.lipLength) / (s - l)
              , u = i >= -r.lipLength ? r.height + o * i + V(r.z) - V(t) : l + a.pow((i + r.run) / (r.run - r.lipLength), a.max(1.5, c)) * (s - l);
            f = a.max(f, u * d),
            n = dh(n, f)
        } else {
            let e = U(i / r.table)
              , t = 1 - Om((i - r.table) / r.landing)
              , o = V(r.z) + r.height + r.landingRise - V(r.z + r.table)
              , s = e * t * o
              , c = r.height * (1 - U(i / fh))
              , l = a.max(0, 1 - a.abs(c - s) / .8);
            n = dh(n, a.max(f, (a.max(c, s) + l * l * .2) * d))
        }
    }
    return n
}
function gh(e, t) {
    let n = e - B(t)
      , r = 0;
    for (let e of ym) {
        let i = (t - e.z) / e.radiusZ;
        if (a.abs(i) > 2.8)
            continue;
        let o = (n - e.offset) / e.radiusX;
        r += e.height * a.exp(-o * o * 1.5 - i * i * 1.8)
    }
    return r
}
function _h(e, t) {
    let n = 0;
    for (let r of gm) {
        let i = a.abs(e - B(t) - r.offset);
        if (i > r.halfWidth + r.cut || t < r.start - r.approach || t > r.end + r.exit)
            continue;
        let o = U((t - r.start + r.approach) / r.approach) * (1 - U((t - r.end) / r.exit))
          , s = (r.height + (r.level === void 0 ? 0 : V(r.level) - V(t)) + (r.stepRise ?? 0) * U((t - r.start - 13) / 20) - (r.descent ? r.descent.drop * H((t - r.descent.start) / (r.descent.end - r.descent.start), 0, 1) : 0)) * o;
        if (r.downhillApproach && t < r.start) {
            let e = r.start - r.approach
              , n = H((t - e) / r.approach, 0, 1)
              , i = V(e)
              , o = V(r.level ?? r.start) + r.height
              , c = a.min(0, (o - i) / r.approach)
              , l = H(V(e + .5) - V(e - .5), c * 3, 0)
              , u = r.level === void 0 ? H(V(r.start + .5) - V(r.start - .5), c * 3, 0) : 0
              , d = n * n
              , f = d * n
              , p = (2 * f - 3 * d + 1) * i + (f - 2 * d + n) * r.approach * l + (-2 * f + 3 * d) * o + (f - d) * r.approach * u;
            s = a.max(0, p - V(t))
        }
        n = a.max(n, s * (1 - H((i - r.halfWidth) / r.cut, 0, 1)))
    }
    for (let r of hm) {
        if (r.branch === void 0 || t < r.start - 50 || t > r.end + 16)
            continue;
        let i = 1 - U((a.abs(e - bm(r, t)) - r.halfWidth - 2) / 7);
        if (!i)
            continue;
        let o = U((t - r.start + 50) / 34) * (1 - U((t - r.end + 4) / 20))
          , s = V(r.start - 16) + 1.2 - (t - r.start + 16) * .075;
        n = a.max(n, H(s - V(t), 0, 3.5) * o * i)
    }
    return n
}
function vh(e, t) {
    let n = 0;
    for (let r of vm) {
        let i = a.abs(t - r.z) / r.radiusZ;
        if (i >= 1)
            continue;
        let o = a.abs(e - B(t) - r.offset) / r.radiusX;
        o < 1 && (n = a.max(n, r.height * (1 - U(i)) * (1 - U(o))))
    }
    return n
}
function yh(e, t) {
    let n = 0;
    for (let r of pm) {
        let i = t - r.z
          , o = r.mound ? 20 : 12;
        if (i < -r.run - o || i > r.table + r.landing + 15)
            continue;
        let s = a.abs(e - jm(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * U(i / r.table) : 0;
        n = a.max(n, U((i + r.run + o) / 16) * (1 - U((i - r.table - r.landing + 8) / 23)) * (1 - U((s - r.width / 2 - c - 2) / 12)))
    }
    return a.max(n, uh(e, t))
}
function bh(e, t) {
    return sm(e, t)
}
function W(e, t) {
    return um(e, t)
}
function xh(e, t) {
    return sm(e, t)
}
function Sh(e, t) {
    return sm(e, t)
}
var Ch = Sm
  , wh = Cm;
function Th(e) {
    let t = xm[0][1];
    for (let[n,r] of xm)
        e >= n && (t = r);
    return t
}
var Eh = 1 / 0
  , Dh = 6.3
  , Oh = 4.2
  , kh = Dh
  , Ah = Dh * 1.08
  , jh = Ah * 1.4
  , Mh = 6.5
  , Nh = (e, t, n, r, i=28) => Dm(e, t, t ? r ? i : 10 : Mh, n)
  , Ph = 1.25
  , Fh = 1.5
  , Ih = 25 * a.PI / 180
  , Lh = 1 / 12
  , Rh = 35 * a.PI / 180
  , zh = .7
  , Bh = .45
  , Vh = (e, t) => a.atan2(a.sin(e - t), a.cos(e - t))
  , Hh = class e {
    constructor() {
        this.equipmentDetached = !1,
        this.collisions = null,
        this.collisionStart = new h,
        this.collisionEnd = new h,
        this.collisionVelocity = new h,
        this.collisionOffsets = [new h(0,.28,0), new h(0,.85,0), new h(0,1.47,0)],
        this.phase = `intro`,
        this.paused = !1,
        this.switchStance = !1,
        this.x = B(90),
        this.z = 90,
        this.y = W(this.x, this.z),
        this.speed = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.carveTransfer = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.airTime = 0,
        this.maxAir = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.grabLedger = new Lt,
        this.scoreFactors = null,
        this.lastScoreFactors = null,
        this.spin = 0,
        this.flip = 0,
        this.grabTime = 0,
        this.trickScore = 0,
        this.score = 0,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.butter = new Pt,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.trick = ``,
        this.notice = ``,
        this.noticeTime = 0,
        this.elapsed = 0,
        this.liftTime = 0,
        this.liftClock = 0,
        this.runs = 0,
        this.crashes = 0,
        this.cabinIndex = 0,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.previousSteer = 0,
        this.corkSet = !1,
        this.railPitchHeld = 0,
        this.rollVelocity = 0,
        this.airRotation = new yn,
        this.airOrientation = this.airRotation.orientation,
        this.landingAssist = new Yi,
        this.airLevel = new Zi,
        this.groundTarget = new g,
        this.landingUp = new h,
        this.landingNormal = new h,
        this.stanceTurn = new g,
        this.landingSettling = !1,
        this.ragdoll = new gr(W,Sp.snowWalls),
        this.crashDuration = 0,
        this.crashSeverity = 0,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.powderLanding = 0,
        this.powderLandingAge = 1 / 0,
        this.powderLandingImpact = 0,
        this.crashTime = 0,
        this.landing = 0,
        this.landingImpact = 0,
        this.landingBoost = 0,
        this.crouch = 0,
        this.grind = !1,
        this.jumpHeld = !1,
        this.charge = 0,
        this.topSpeed = 0,
        this.skid = 0,
        this.skidSide = 1,
        this.polePhase = 0,
        this.poling = 0,
        this.takeoffKick = 0,
        this.jumpDistance = 0,
        this.lastJumpDistance = 0,
        this.recoveryPushTime = 0,
        this.event = ``,
        this.rail = null,
        this.railT = 0,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.chain = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.airRepeatKey = ``,
        this.chainRepeatKeys = [],
        this.trickTally = new Map,
        this.repeat = 0,
        this.lost = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.board = !1,
        this.airSource = `jump`
    }
    collideWithSnow() {
        if (!Sp.snowWalls || this.rail || this.crashTime > 0)
            return !1;
        let e = fr(W, this.collisionStart, this) ?? (this.airborne && this.vy < 0 ? fr(W, this, this) : null);
        if (!e)
            return !1;
        let t = a.hypot(this.velocityX, this.velocityZ)
          , n = a.max(0, -this.velocityX * e.nx - this.velocityZ * e.nz);
        this.x = e.x,
        this.z = e.z,
        this.airborne || (this.y = W(this.x, this.z)),
        this.velocityX += e.nx * n,
        this.velocityZ += e.nz * n;
        let r = _r(n, t);
        return r === `fall` || r === `crash` ? (this.landingImpact = n,
        this.beginCrash(n, !1, r),
        !0) : (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && (this.landingSpin = H((e.nx * a.cos(this.heading) - e.nz * a.sin(this.heading)) * n / 16, -.8, .8),
        this.landingFlip = H(-(e.nx * a.sin(this.heading) + e.nz * a.cos(this.heading)) * n / 20, -.6, .6)),
        !1)
    }
    leaveSnowEdge(e) {
        if (!Sp.snowWalls)
            return;
        let t = pr(W, this.collisionStart, this);
        if (!t)
            return;
        let n = a.hypot(this.velocityX, this.velocityZ);
        this.y = this.collisionStart.y;
        let r = a.cos(this.heading)
          , i = a.sin(this.heading)
          , o = j(t.dx * i + t.dz * r, this.spin, this.edge, new g, t.dx * r - t.dz * i)
          , s = n > 1e-6 ? (t.dx * this.velocityX + t.dz * this.velocityZ) / n : 0;
        this.takeoff(H(s, -1.6, .4) * n, n, `ground`, o),
        this.takeoffKick = 0,
        this.railPitchHeld = Number(e.forward) | Number(e.brake) << 1,
        this.charge = 0
    }
    leaveSnowCrest(e, t) {
        if (this.z <= 40 || t.brake)
            return;
        let n = this.x - B(this.z);
        if (tf.some(e => a.abs(n - e.offset) < e.halfWidth + 6 && this.z > e.z - e.run - e.arc - 6 && this.z < e.z + e.arc + e.drop * 2 + 6))
            return;
        let r = Bu(W, this.collisionStart, this.travelHeading, this.speed, ah);
        if (!r)
            return;
        let i = Bm(this.collisionStart.x, this.collisionStart.z, this.heading)
          , o = j(r.grade, this.spin, this.edge, new g, i.crossSlope);
        this.y = a.max(this.collisionStart.y + r.climb * e, W(this.x, this.z)),
        this.takeoff(r.climb, this.speed, `ground`, o),
        this.takeoffKick = 0,
        this.railPitchHeld = Number(t.forward) | Number(t.brake) << 1,
        this.charge = 0
    }
    collideWithPark() {
        if (!this.collisions || this.rail || this.crashTime > 0)
            return !1;
        this.collisionEnd.set(this.x, this.y, this.z),
        this.collisionVelocity.set(this.velocityX, this.airborne ? this.vy : 0, this.velocityZ);
        let e = this.collisionVelocity.length()
          , t = this.airborne ? -1 : mm.findIndex(e => {
            let t = Gm(e, this.x, this.z)
              , n = Um(e);
            return e.entry === `ride` && t.t >= -.7 / e.length && t.t < 0 && a.abs(t.side) < e.width / 2 + .1 && this.y >= Xm(e, 0) - .65 && this.velocityX * a.sin(n) + this.velocityZ * a.cos(n) > 0
        }
        )
          , n = this.collisions.move(this.collisionStart, this.collisionEnd, this.collisionVelocity, this.collisionOffsets, .27, t >= 0 ? `rail-${t}` : ``);
        if (!n.touched)
            return !1;
        this.x = this.collisionEnd.x,
        this.y = this.collisionEnd.y,
        this.z = this.collisionEnd.z,
        this.velocityX = this.collisionVelocity.x,
        this.velocityZ = this.collisionVelocity.z,
        this.airborne && (this.vy = this.collisionVelocity.y);
        let r = _r(n.impact, e);
        if (r === `fall` || r === `crash`)
            return this.landingImpact = n.impact,
            this.beginCrash(n.impact, !1, r),
            this.notice = `BAIL`,
            !0;
        if (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && !this.airborne) {
            let e = n.normal.x * a.cos(this.heading) - n.normal.z * a.sin(this.heading)
              , t = n.normal.x * a.sin(this.heading) + n.normal.z * a.cos(this.heading);
            this.landingSpin = H(e * n.impact / 16, -.8, .8),
            this.landingFlip = H(-t * n.impact / 20, -.6, .6)
        }
        return !1
    }
    get powderCompression() {
        return this.airborne || this.rail || this.crashTime > 0 ? 0 : fm(this.speed, this.z, this.powderLanding, this.x)
    }
    get trickEvent() {
        let e = this.event;
        if (!e || e === `arrive`)
            return null;
        let t = e === `land` && !this.rail || e === `butter`;
        return {
            t: this.elapsed,
            kind: e,
            text: e === `crash` || t ? this.notice : this.chain.length ? this.trick : ``,
            score: e === `crash` ? this.lost : t ? this.lastScore : 0,
            impact: this.landingImpact
        }
    }
    toLobby() {
        this.butter.reset(),
        this.railPitchHeld = 0,
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.powderLanding = 0,
        this.powderLandingAge = 1 / 0,
        this.phase = `intro`,
        this.paused = !1,
        this.crashTime = 0,
        this.recovery = 0,
        this.airborne = !1,
        this.rail = null,
        this.grind = !1,
        this.x = B(90),
        this.z = 90,
        this.y = W(this.x, this.z),
        this.speed = 0,
        this.vy = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.turnRate = 0,
        this.skid = 0,
        this.crouch = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spin = 0,
        this.flip = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.landingPrepare = 0,
        this.trick = ``,
        this.trickScore = 0,
        this.notice = ``,
        this.noticeTime = 0,
        this.liftTime = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.switchStance = !1,
        this.clearChain()
    }
    boardLift(e) {
        if (this.butter.reset(),
        !(this.phase !== `intro` && this.phase !== `finished`) && (this.phase = `gondola`,
        this.liftTime = 0,
        this.speed = 0,
        this.paused = !1,
        this.liftClock = e ?? 0,
        this.cabinIndex = 0,
        e !== void 0)) {
            let t = 1 / 0;
            for (let n = 0; n < 2; n++) {
                let r = wh(e, n);
                r.up && r.p < t && (t = r.p,
                this.cabinIndex = n)
            }
        }
    }
    arrive() {
        Object.assign(this, new e, {
            liftClock: this.liftClock,
            liftTime: this.liftTime,
            cabinIndex: this.cabinIndex,
            runs: this.runs,
            collisions: this.collisions
        }),
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `skiing`,
        this.x = Dp,
        this.z = -10,
        this.y = W(this.x, this.z),
        this.speed = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = a.atan(.42),
        this.travelHeading = this.heading,
        this.edge = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.elapsed = 0,
        this.score = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.crashes = 0,
        this.crashTime = 0,
        this.landingImpact = 0,
        this.landing = 0,
        this.powderLanding = 0,
        this.powderLandingAge = 1 / 0,
        this.landingBoost = 0,
        this.switchStance = !1,
        this.trick = ``,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.topSpeed = 0,
        this.spin = 0,
        this.flip = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.charge = 0,
        this.jumpHeld = !1,
        this.skid = 0,
        this.poling = 0,
        this.polePhase = 0,
        this.lastJumpDistance = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.trickTally.clear(),
        this.lost = 0,
        this.notice = `FIND YOUR LINE`,
        this.noticeTime = 3,
        this.event = `arrive`
    }
    fastTravel() {
        if (this.phase !== `gondola` || this.paused)
            return;
        let e = wm(this.liftClock, this.cabinIndex);
        this.liftClock += e,
        this.liftTime += e,
        this.arrive()
    }
    recover() {
        this.butter.reset(!0),
        this.lastScoreFactors = null,
        this.phase === `skiing` && (this.railPitchHeld = 0,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.x = B(this.z),
        this.y = W(this.x, this.z),
        this.vy = 0,
        this.lateral = 0,
        this.powderLanding = 0,
        this.powderLandingAge = 1 / 0,
        this.speed = 5,
        this.airborne = !1,
        this.spin = 0,
        this.flip = 0,
        this.crashTime = 0,
        this.skid = 0,
        this.travelHeading = a.atan(Ap(this.z)),
        this.heading = this.travelHeading,
        this.edge = 0,
        this.turnRate = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.notice = `BACK ON TRACK`,
        this.noticeTime = 2)
    }
    rideOutButter() {
        let e = Bm(this.x, this.z, this.heading);
        this.butter.release(this, j(e.slope, this.spin, this.edge, this.airOrientation, e.crossSlope)),
        this.flipTightness = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.spinWindup = 0;
        let t = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length
          , n = a.round(this.butter.entryPoints * ge(t));
        this.butter.entryPoints = 0,
        !(n <= 0) && (this.lastScore = n,
        this.score += n,
        this.runScore.tricks += n,
        this.trickTally.set(`BUTTER`, (this.trickTally.get(`BUTTER`) ?? 0) + 1),
        n > this.bestCombo && (this.bestCombo = n,
        this.bestTrick = this.butter.entry),
        this.notice = `STOMPED. ${this.butter.entry}`,
        this.noticeTime = 3,
        this.event = `butter`)
    }
    takeoff(e, t=this.speed, n=`jump`, r) {
        this.railPitchHeld = 0;
        let i = Bm(this.x, this.z, this.heading, this.grind)
          , o = this.landingSettling ? this.airOrientation.clone() : r ?? j(i.slope, this.spin, this.edge, new g, i.crossSlope)
          , s = this.butter.launch(this, o);
        this.speed = t,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.airborne = !0,
        this.vy = e + s.pop,
        this.airTime = 0,
        this.spin = 0,
        this.flip = 0,
        this.corkSet = !1,
        this.airRotation.reset(0, 0, o),
        this.rollVelocity = 0,
        this.landingAssist.reset(),
        this.landingSettling = !1,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.spinVelocity = s.spin,
        this.flipVelocity = s.flip,
        this.velocityZ = this.speed * a.cos(this.travelHeading),
        this.velocityX = this.speed * a.sin(this.travelHeading),
        this.grabTime = 0,
        this.grabLedger.reset(),
        this.scoreFactors = null,
        this.maxAir = 0,
        this.jumpDistance = 0,
        this.trickScore = this.projectChain(0, 0, 0, 0),
        this.trick = this.chainText(``),
        this.event = `jump`,
        this.takeoffKick = 1,
        this.airSource = n,
        this.rail = null,
        this.grind = !1,
        this.lost = 0
    }
    mountRail(e, t, n, r=0) {
        this.butter.reset(),
        this.landingSettling = !1,
        this.landingAssist.reset();
        let i = Um(e)
          , o = a.atan2(a.sin(this.travelHeading - i), a.cos(this.travelHeading - i))
          , s = a.atan2(a.sin(n - i), a.cos(n - i));
        this.spin = 0,
        this.spinTightness = 0,
        this.rail = e,
        this.railT = H(t, 0, 1),
        this.grind = !0,
        this.airborne = !1,
        this.vy = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.railSpinVelocity = r,
        this.railSpin = s,
        this.railSpinTravel = a.abs(s),
        this.switchStance = !1,
        this.skid = 0,
        this.charge = 0,
        this.speed = a.max(9, this.speed * a.max(.35, a.cos(o))),
        this.travelHeading = this.heading = i,
        this.velocityX = this.speed * a.sin(i),
        this.velocityZ = this.speed * a.cos(i);
        let c = Wm(e, this.railT);
        this.x = c.x,
        this.z = c.z,
        this.y = Xm(e, this.railT)
    }
    chainText(e) {
        return [...this.chain, e].filter(Boolean).join(` → `)
    }
    railName() {
        return this.railSwaps ? `RAIL ${this.railSwaps * 90}` : `RAIL SLIDE`
    }
    projectChain(e, t, n, r, i=0) {
        let o = _e(this.chainLinks + r);
        return this.chainButter + i + a.round((this.chainTricks + e) * o) + a.round((this.chainGrabs + t) * o) + a.round((this.chainRails + n) * o)
    }
    pushAirLink() {
        this.chainButter += this.butterPoints,
        this.butterPoints > 0 && this.chainRepeatKeys.push(`BUTTER`),
        this.butter.entryPoints = 0,
        this.chainTricks += a.round(this.airPoints * he(this.repeat)),
        this.chainGrabs += this.grabPoints,
        this.airName && this.chain.push(this.airName),
        this.airIsLink && this.airRepeatKey && this.chainRepeatKeys.push(this.airRepeatKey),
        this.airIsLink && this.chainLinks++,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    pushRailLink() {
        this.chainRails += Oe(this.railTime, this.railSwaps),
        this.chain.push(this.railName()),
        this.chainLinks++
    }
    clearChain() {
        this.scoreFactors = null,
        this.chain = [],
        this.chainRepeatKeys = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    judgeAir(e=!1, t=!1) {
        let n = t || this.velocityZ > .5 && (this.airSource !== `ground` || this.airTime >= 1.05 && this.maxAir >= 1.3)
          , r = this.airRotation.judge.result(this.switchStance, e, void 0, this.board)
          , i = this.grabLedger.namesOn(this.board)
          , o = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length;
        this.butterPoints = a.round(this.butter.entryPoints * ge(o)),
        this.airName = [this.butterPoints > 0 ? this.butter.entry : ``, ...n ? [r.name, ...i] : []].filter(Boolean).join(` + `);
        let s = Ee({
            airTime: this.airTime,
            maxAir: this.maxAir,
            ...r,
            switchStance: this.switchStance
        });
        this.airRepeatKey = n ? r.type || `STRAIGHT AIR` : ``,
        this.repeat = this.airRepeatKey ? (this.trickTally.get(this.airRepeatKey) ?? 0) + this.chainRepeatKeys.filter(e => e === this.airRepeatKey).length : 0,
        this.airPoints = n ? s.total : 0,
        this.grabPoints = n ? De(this.grabLedger.time, i.length, s.rotation, he(this.repeat), this.grabLedger.longest) : 0,
        this.airIsLink = n && (this.airTime >= .5 || r.name !== `` || i.length > 0),
        this.scoreFactors = n ? {
            turns: s.turns,
            grabs: i.length,
            grabMultiplier: Ce(i.length, this.grabLedger.longest),
            lineMultiplier: _e(this.chainLinks + +!!this.airIsLink),
            offAxis: r.offAxis,
            switchStance: this.switchStance,
            flips: s.flips
        } : null,
        this.trickScore = this.projectChain(a.round(this.airPoints * he(this.repeat)), this.grabPoints, 0, +!!this.airIsLink, this.butterPoints),
        this.trick = this.trickScore > 0 ? this.chainText(this.airName) : ``
    }
    landOnRail(e=!1) {
        for (let t of mm) {
            let n = Gm(t, this.x, this.z)
              , r = n.t * t.length
              , i = t.entry === `pop`;
            if (r < (i ? -.45 : 0) || n.t > 1 || a.abs(n.side) > t.width / 2 + .5)
                continue;
            let o = Xm(t, n.t);
            if (e && (t.popLaunch === `ballistic` || t.popLaunch === `manual`) || (e ? !i || r > 3 || this.y > o + .1 || this.y < o - .35 : this.y > o + .05 || this.y < o - (i && r < 3 ? .35 : .75)))
                continue;
            if (this.airRotation.upright < .45)
                return this.landingImpact = a.max(2, -this.vy),
                this.beginCrash(this.landingImpact),
                !0;
            let s = this.heading + this.airRotation.landingYaw + (this.switchStance ? a.PI : 0);
            return this.judgeAir(!0, !0),
            this.pushAirLink(),
            this.landedJumps++,
            this.totalAirTime += this.airTime,
            this.lastJumpDistance = this.jumpDistance,
            this.landingImpact = 0,
            this.landing = .6,
            this.mountRail(t, n.t, s, this.spinVelocity),
            this.event = `land`,
            this.spin = 0,
            this.flip = 0,
            this.rollVelocity = 0,
            this.trick = this.chainText(this.railName()),
            this.trickScore = this.projectChain(0, 0, 0, 0),
            this.flipVelocity = 0,
            this.flipTightness = 0,
            this.spinVelocity = 0,
            this.spinTightness = 0,
            this.landingPrepare = 1,
            !0
        }
        return !1
    }
    shiftAcross(e, t) {
        let n = Um(e);
        this.x += a.cos(n) * t,
        this.z -= a.sin(n) * t
    }
    funnelToRail(e, t) {
        for (let n of mm) {
            if (n.entry !== `ride`)
                continue;
            let r = Gm(n, this.x, this.z)
              , i = r.t * n.length
              , o = Qm(n);
            if (i < -o || i >= 0 || a.abs(r.side) > 1.5)
                continue;
            let s = Vh(this.travelHeading, Um(n));
            if (a.abs(s) > Ih || this.speed < 4 || t.steer * a.sign(r.side) > .3)
                return;
            let c = U((i + o) / o);
            this.shiftAcross(n, -a.sign(r.side) * a.min(a.abs(r.side), Lh * c * this.speed * e)),
            this.travelHeading -= s * (1 - a.exp(-3 * c * e));
            return
        }
    }
    funnelInAir(e) {
        for (let t of mm) {
            let n = Gm(t, this.x, this.z)
              , r = n.t * t.length
              , i = t.entry === `pop` && r >= -rh(t) && r <= 3;
            if (n.t < -.02 && !i || n.t > 1 || a.abs(n.side) > 1)
                continue;
            let o = this.y - Xm(t, H(n.t, 0, 1));
            if (!(!i && (this.vy >= 0 || o < -.2 || o > -this.vy * .45)) && !(a.abs(Vh(this.travelHeading, Um(t))) > Rh)) {
                this.shiftAcross(t, -a.sign(n.side) * a.min(a.abs(n.side), zh * e));
                return
            }
        }
    }
    popOffKicker(e, t, n) {
        for (let r of mm) {
            if (r.entry !== `pop` || r.popLaunch === `manual` || this.speed < 5)
                continue;
            let i = Gm(r, this.x, this.z)
              , o = rh(r);
            if (Gm(r, e, t).t * r.length >= -o || i.t * r.length < -o || ch(r).height * U((3.2 - a.abs(i.side)) / 1.6) < .4)
                continue;
            let s = Um(r)
              , c = Wm(r, -o / r.length)
              , l = {
                x: c.x + a.cos(s) * i.side,
                z: c.z - a.sin(s) * i.side
            }
              , u = a.hypot(this.velocityX, this.velocityZ)
              , d = u * a.max(.2, a.cos(Vh(this.travelHeading, s)))
              , f = (Xm(r, .1) - Xm(r, 0)) / (.1 * r.length)
              , p = W(l.x, l.z)
              , m = a.max(.3, -i.t * r.length)
              , h = Xm(r, 0) - f * m - p
              , _ = m / a.max(d, 1)
              , v = a.max(a.sqrt(2 * ah * (h + th)), (h - .1) / _ + ah * _ / 2)
              , y = r.popLaunch === `ballistic`
              , b = (r.popAngle ?? 24) * a.PI / 180
              , x = y ? this.speed * a.cos(b) : u
              , S = y ? this.speed * a.sin(b) : v + f * d;
            this.y = p,
            this.takeoff(S, x, `jump`, j(S / x, this.spin, this.edge, new g, 0)),
            this.railPitchHeld = Number(n.forward) | Number(n.brake) << 1,
            this.charge = 0;
            return
        }
    }
    slide(e, t) {
        let n = this.rail
          , r = Um(n);
        this.grind = !0,
        this.railTime += e,
        this.speed = a.max(9, this.speed - e * (.9 + this.speed * .02)),
        this.railT += this.speed * e / n.length;
        let i = H(this.railT, 0, 1)
          , o = Wm(n, i);
        this.x = o.x,
        this.z = o.z,
        this.y = Xm(n, i),
        this.travelHeading = this.heading = r,
        this.velocityX = this.speed * a.sin(r),
        this.velocityZ = this.speed * a.cos(r),
        this.turnRate = 0,
        this.lateral = 0,
        this.skid = 0;
        let s = a.abs(t.steer) > .06 ? H(t.steer, -1, 1) : 0;
        s ? this.railSpinVelocity = Dm(this.railSpinVelocity, s * Oh, !this.railSpinVelocity || a.sign(this.railSpinVelocity) === s ? 10 : 7, e) : this.railSpinVelocity = Dm(this.railSpinVelocity, 0, 1.65, e);
        let c = this.railSpinVelocity * e;
        if (this.railSpin += c,
        this.railSpinTravel += a.abs(c),
        !s && a.abs(this.railSpinVelocity) < .45) {
            let t = a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2);
            this.railSpin = Dm(this.railSpin, t, 4.8, e)
        }
        let l = a.floor((this.railSpinTravel + .12) / (a.PI / 2));
        l > this.railSwaps && (this.railSwaps = l),
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, Oe(this.railTime, this.railSwaps), 1),
        this.scoreFactors = {
            turns: 0,
            grabs: 0,
            grabMultiplier: 1,
            lineMultiplier: _e(this.chainLinks + 1),
            offAxis: !1,
            switchStance: !1
        },
        t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
        !t.jump && this.jumpHeld ? this.dismount(4.6 + this.charge * 3.4, !0, t) : this.railT >= 1 && this.dismount(.5, !1, t)
    }
    dismount(e, t, n) {
        let r = this.rail
          , i = this.railSpin
          , o = this.railSpinVelocity
          , s = H(this.railT, 0, 1)
          , c = .02
          , l = (Xm(r, a.min(1, s + c)) - Xm(r, a.max(0, s - c))) / ((a.min(1, s + c) - a.max(0, s - c)) * r.length);
        this.pushRailLink(),
        this.rail = null,
        this.grind = !1;
        let u = j(l, i, 0, new g);
        this.takeoff(this.speed * l + e, this.speed, `rail`, u),
        this.airRotation.reset(0, i, u),
        this.spinVelocity = o,
        this.charge = 0,
        t || (this.event = `dismount`,
        this.railPitchHeld = Number(n.forward) | Number(n.brake) << 1)
    }
    faceplant() {
        Nt(this.airOrientation),
        this.beginCrash(this.landingImpact),
        this.notice = `FACEPLANT`
    }
    beginCrash(e, t=!1, n) {
        if (this.crashTime > 0)
            return;
        this.equipmentDetached = !1,
        this.lastScoreFactors = null,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.crashSeverity = H(n ? e / 42 * .8 + a.max(0, this.y - W(this.x, this.z)) / 45 * .2 : this.speed / 43 * .35 + e / 42 * .45 + this.maxAir / 45 * .2, .12, 1);
        let r = n ? n === `fall` : !t && e < 16 && this.maxAir < 5.5 && this.speed < 27;
        this.crashDuration = r ? .8 + this.crashSeverity * .4 : 1.35 + this.crashSeverity * 1.35,
        this.crashTime = this.crashDuration,
        this.recovery = 0,
        this.ragdoll.start(this.x, this.y, this.z, this.heading, this.spin + (this.switchStance ? a.PI : 0), this.flip, this.velocityX, this.velocityZ, e, this.flipVelocity, this.spinVelocity, this.airOrientation, this.switchStance ? a.PI : 0, t, r),
        this.crashes++,
        this.airborne = !1,
        this.landing = 0,
        this.powderLanding = 0,
        this.powderLandingAge = 1 / 0,
        this.landingBoost = 0,
        this.event = `crash`,
        this.rail = null,
        this.grind = !1,
        this.lost = this.trickScore,
        this.notice = t ? `LANDED FLAT` : `BAIL`,
        this.noticeTime = this.crashDuration,
        this.trick = ``,
        this.trickScore = 0,
        this.clearChain()
    }
    updateCrash(e) {
        this.ragdoll.collisions = this.collisions,
        this.crashTime = a.max(0, this.crashTime - e),
        this.recovery = 1 - H(this.crashTime / (this.ragdoll.gentle ? .45 : .6), 0, 1),
        this.ragdoll.update(e, this.crashTime < (this.ragdoll.gentle ? .55 : .75)),
        this.equipmentDetached = this.crashTime > 0 && this.ragdoll.shedsEquipment;
        let t = this.ragdoll.nodes.Hips.p
          , n = H(t.z, -22, Cp)
          , r = H(t.x, B(n) - 520 / 2 + 4, B(n) + 520 / 2 - 4);
        this.ragdoll.translate(r - t.x, n - t.z),
        this.x = r,
        this.z = n,
        this.y = W(r, n),
        this.velocityX = this.ragdoll.velocity.x,
        this.velocityZ = this.ragdoll.velocity.z,
        this.speed = a.min(43, a.hypot(this.velocityX, this.velocityZ)),
        this.speed > 1.5 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        this.crashTime === 0 && (this.speed = H(this.speed, 4, this.ragdoll.gentle ? 32 : 23),
        this.vy = 0,
        this.spin = 0,
        this.flip = 0,
        this.edge = 0,
        this.skid = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.switchStance = !1,
        this.heading = this.travelHeading,
        this.recovery = 0,
        this.crouch = .5,
        this.poling = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.polePhase = 0,
        this.recoveryPushTime = 6,
        this.velocityX = a.sin(this.travelHeading) * this.speed,
        this.velocityZ = a.cos(this.travelHeading) * this.speed,
        this.notice = `BACK ON YOUR FEET`,
        this.noticeTime = 2)
    }
    finishRun() {
        return this.phase !== `skiing` || this.z < 3185 ? !1 : (this.z = wp,
        this.phase = `finished`,
        this.speed = 0,
        this.velocityX = this.velocityZ = this.vy = 0,
        this.runs++,
        !0)
    }
    update(e, t) {
        if (this.board = !!t.board,
        this.event = ``,
        this.crashTime <= 0 && (this.equipmentDetached = !1),
        this.paused)
            return;
        if (this.powderLandingAge += e,
        this.powderLanding = p(this.powderLandingImpact, this.powderLandingAge),
        this.liftClock += e,
        this.noticeTime = a.max(0, this.noticeTime - e),
        this.landing = a.max(0, this.landing - e * 3.4),
        this.landingBoost = a.max(0, this.landingBoost - e),
        this.takeoffKick = a.max(0, this.takeoffKick - e * 4),
        this.phase === `gondola`) {
            this.liftTime += e,
            wh(this.liftClock, this.cabinIndex).p >= .999999999 && this.arrive();
            return
        }
        if (this.phase !== `skiing` || (this.railPitchHeld &= Number(t.forward) | Number(t.brake) << 1,
        this.elapsed += e,
        this.finishRun()))
            return;
        if (this.crashTime > 0) {
            this.updateCrash(e),
            this.finishRun();
            return
        }
        this.recoveryPushTime = this.speed >= 18 ? 0 : a.max(0, this.recoveryPushTime - e);
        let n = this.airborne;
        this.landingSpin = Dm(this.landingSpin, 0, 5, e),
        this.landingFlip = Dm(this.landingFlip, 0, 5, e);
        let r = this.butter.step(this, t, e, !this.airborne && (t.butter || this.butter.active) ? zm(this.x, this.z, this.travelHeading) : 0);
        this.butter.ready && !this.rail && this.rideOutButter();
        let i = !r && t.brake && !this.airborne && !this.rail;
        this.forwardHeld = !r && t.forward && !this.airborne && !this.rail && !i ? this.forwardHeld + e : 0,
        this.tucking = !r && this.z > 40 && t.forward && !this.airborne && !this.rail && !i && (this.switchStance || this.forwardHeld >= 1.25 || this.speed >= 18),
        this.crouch = Dm(this.crouch, !this.airborne && (this.tucking || t.jump) ? 1 : 0, 9, e),
        a.abs(t.steer) > .15 && (this.skidSide = a.sign(t.steer)),
        this.skid = Dm(this.skid, i ? this.skidSide * H(this.speed / 9, 0, 1) : 0, 7, e);
        let o = !r && a.abs(t.steer) > .05 ? H(t.steer, -1, 1) : 0;
        this.carveTransfer *= a.exp(-6 * e),
        !this.airborne && !i && this.previousSteer * o < 0 && (this.carveTransfer = a.abs(this.edge) * H(this.speed / 18, 0, 1)),
        this.previousSteer = this.airborne || !o && a.abs(this.edge) < .1 ? 0 : o || this.previousSteer;
        let s = o ? 11 + this.carveTransfer * 11 : 9
          , l = U((1 - this.landing) / .68);
        this.edge = Dm(this.edge, !this.airborne && !this.rail ? o * l : 0, s, e);
        let u = !r && t.forward && !this.switchStance && !this.tucking && !this.airborne && !this.rail && !i && !t.jump;
        if (this.poling = Dm(this.poling, +!!u, 12, e),
        this.airborne)
            this.velocityX *= a.exp(-.003 * e),
            this.velocityZ *= a.exp(-.003 * e),
            this.speed = a.hypot(this.velocityX, this.velocityZ),
            this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
            this.turnRate = 0,
            this.lateral = 0;
        else {
            this.landingSettling && !this.rail && !r && (this.spinVelocity += (-100 * this.spin - 20 * this.spinVelocity) * e,
            this.spin += this.spinVelocity * e),
            r || (this.spinWindup = Dm(this.spinWindup, 0, 10, e),
            this.spinTightness = Dm(this.spinTightness, 0, 14, e)),
            this.landingPrepare = this.butter.active ? -1 : 0;
            let t = this.edge * (.8 + H(this.speed / 85, 0, .44)) * (1 + this.carveTransfer * .14) * (i ? .7 : 1);
            if (this.turnRate = this.rail ? 0 : t,
            this.travelHeading += this.turnRate * e,
            r && (this.travelHeading += At(zm(this.x, this.z, this.travelHeading + a.PI / 2), this.speed, 9.81 * 1.7) * e),
            !this.rail && !r && this.speed < 1.2 && this.z > 40) {
                let t = W(this.x + .5, this.z) - W(this.x - .5, this.z)
                  , n = W(this.x, this.z + .5) - W(this.x, this.z - .5)
                  , r = a.hypot(t, n);
                if (r > .12) {
                    let i = Vh(a.atan2(-t, -n), this.travelHeading)
                      , s = (1.2 - this.speed) / 1.2 * a.min(2.4, r * 4) * (o ? .35 : 1);
                    this.travelHeading += H(i, -s * e, s * e)
                }
            }
            let n = zm(this.x, this.z, this.travelHeading);
            if (Sp.snowWalls && n < -1) {
                let e = {
                    x: this.x + a.sin(this.travelHeading) * .5,
                    y: this.y,
                    z: this.z + a.cos(this.travelHeading) * .5
                }
                  , t = pr(W, this, e);
                t && (n = t.grade)
            }
            let s = -n
              , c = Sd(this.x - B(this.z), this.z)
              , l = Em(this.tucking ? .004 : .0049, this.tucking ? .0024 : .0028, c)
              , d = 9.81 * a.sin(a.atan(s)) * Em(1.1, 1.7, c) - Em(.8, .13, c) - l * this.speed * this.speed - a.abs(this.edge) * Em(1.05, .38, c);
            if (this.rail || (this.speed = H(this.speed + (d - (i ? 17 : 0)) * e, 0, 43)),
            u) {
                let t = this.polePhase;
                this.polePhase = (this.polePhase + e / .95) % 1,
                t < .34 && this.polePhase >= .34 && (this.speed = a.min(43, this.speed + 1.65 * H(1 - this.speed / 52, .25, 1)),
                this.recoveryPushTime > 0 && (this.speed += a.min(3, a.max(0, 13 - this.speed))),
                this.recoveryPushTime = 0)
            } else
                this.poling < .02 && (this.polePhase = 0);
            let f = this.skid * this.speed * .1
              , p = this.speed / a.hypot(1, n);
            this.velocityZ = p * a.cos(this.travelHeading) - f * a.sin(this.travelHeading),
            this.velocityX = p * a.sin(this.travelHeading) + f * a.cos(this.travelHeading),
            this.lateral = this.edge * this.speed * .35 + f
        }
        this.topSpeed = a.max(this.topSpeed, this.speed * 3.6);
        let d = a.atan2(a.sin(this.travelHeading + this.skid * .72 - this.heading), a.cos(this.travelHeading + this.skid * .72 - this.heading));
        this.heading += d * (1 - a.exp(-12 * e));
        let m = this.x
          , h = this.z;
        this.collisionStart.set(this.x, this.y, this.z),
        this.x += this.velocityX * e,
        this.z += this.velocityZ * e,
        this.z = a.max(-22, this.z);
        let _ = B(this.z);
        if (a.abs(this.x - _) > 256) {
            let t = a.sign(this.x - _);
            this.x = _ + t * 256;
            let n = this.velocityX - Ap(this.z) * this.velocityZ;
            t * n > 0 && (this.velocityX -= n,
            this.speed *= a.exp(-e * 2.8))
        }
        if (!this.finishRun() && (!this.airborne && !this.rail && this.funnelToRail(e, t),
        !(!this.airborne && this.collideWithSnow()))) {
            if (!this.airborne && !this.rail)
                for (let e of mm) {
                    let t = Gm(e, this.x, this.z);
                    if (t.t >= 0 && t.t <= 1 && a.abs(t.side) < e.width / 2 + .35 && this.y >= Xm(e, t.t) - .4) {
                        this.mountRail(e, t.t, this.heading + this.spin + (this.switchStance ? a.PI : 0), this.spinVelocity);
                        break
                    }
                }
            if (this.rail)
                this.slide(e, t);
            else if (!this.airborne) {
                for (let e of pm)
                    if (h <= e.z && this.z > e.z && a.abs(this.x - B(this.z) - e.offset) < e.width / 2 + 1 && this.speed > 7) {
                        let t = B(this.z) + e.offset
                          , n = a.max(t - e.width / 2 + .6, a.min(t + e.width / 2 - .6, this.x));
                        if (this.y < W(n, e.z - .01) - 1)
                            continue;
                        let r = Mm(e, this.speed, this.charge, this.travelHeading)
                          , i = Bm(n, e.z - .01, this.heading)
                          , o = j(i.slope, this.spin, this.edge, new g, i.crossSlope);
                        this.y = W(this.x, e.z - .01),
                        this.takeoff(r.vertical, r.horizontal, `jump`, o),
                        this.velocityX += e.transfer * .22,
                        this.charge = 0;
                        break
                    }
                if (this.airborne || this.popOffKicker(m, h, t),
                this.airborne || this.leaveSnowEdge(t),
                this.airborne || this.leaveSnowCrest(e, t),
                !this.airborne && (this.y = W(this.x, this.z),
                t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
                !t.jump && this.jumpHeld)) {
                    let e = Im(this.x, this.z, this.velocityX, this.velocityZ, this.charge);
                    this.takeoff(e.vertical, a.hypot(e.velocityX, e.velocityZ), `ground`),
                    this.velocityX = e.velocityX,
                    this.velocityZ = e.velocityZ,
                    this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
                    this.charge = 0,
                    mm.some(e => {
                        if (e.entry !== `pop` || !e.popLaunch)
                            return !1;
                        let t = Gm(e, this.x, this.z)
                          , n = t.t * e.length;
                        return n >= -Qm(e) && n <= 0 && a.abs(t.side) < 3.2
                    }
                    ) && (this.railPitchHeld = Number(t.forward) | Number(t.brake) << 1)
                }
            }
            if (!(!this.airborne && this.collideWithPark())) {
                if (this.airborne) {
                    let r = !n;
                    if (r || (this.vy -= ah * e,
                    this.y += this.vy * e,
                    this.airTime += e,
                    this.jumpDistance += a.hypot(this.velocityX, this.velocityZ) * e),
                    this.collideWithSnow())
                        return;
                    let i = W(this.x, this.z)
                      , o = W(this.x, this.z + .5) - W(this.x, this.z - .5)
                      , s = W(this.x + .5, this.z) - W(this.x - .5, this.z)
                      , c = o * this.velocityZ + s * this.velocityX
                      , l = c - this.vy
                      , u = l > .1 ? a.max(0, this.y - i) / l : 1 / 0;
                    this.landingPrepare = Dm(a.max(0, this.landingPrepare), 1 - U((u - .1) / .45), 14, e);
                    let d = a.abs(t.steer) > .06 ? H(t.steer, -1, 1) : 0
                      , f = Number(t.forward && !(this.railPitchHeld & 1)) - Number(t.brake && !(this.railPitchHeld & 2));
                    this.airRotation.controlPitch(f, this.switchStance && !t.board, this.flipVelocity, this.rollVelocity);
                    let m = a.abs(t.airRoll ?? 0) > .06 ? H(t.airRoll ?? 0, -1, 1) : 0;
                    this.spinTightness = Dm(this.spinTightness, a.abs(d), d ? 12 : 10, e),
                    this.airGrab = Dm(this.airGrab, +!!t.grab, 12, e);
                    let h = Em(Dh, Em(Ah, jh, this.airGrab), this.spinTightness)
                      , g = d * h
                      , _ = f * h;
                    this.spinReversal = d * this.spinVelocity < 0 ? .12 : a.max(0, this.spinReversal - e),
                    (!f || a.sign(f) !== this.flipReversal) && (this.flipReversal = 0),
                    f * this.flipVelocity < -.12 && (this.flipReversal = a.sign(f)),
                    a.abs(_ - this.flipVelocity) < h * .05 && (this.flipReversal = 0),
                    this.spinVelocity = Nh(this.spinVelocity, g, e, this.spinReversal > 0 || this.flipReversal !== 0, this.flipReversal ? 3.2 : 28),
                    this.flipVelocity = Nh(this.flipVelocity, _, e, this.flipReversal !== 0, 3.2),
                    this.rollVelocity = Nh(this.rollVelocity, m * h, e, m * this.rollVelocity < 0, 5),
                    this.flipReversal && (this.spinVelocity = a.sign(this.spinVelocity) * a.min(a.abs(this.spinVelocity), a.abs(this.flipVelocity)));
                    let v = this.flipReversal ? H(this.spinVelocity / h, -1, 1) : d;
                    this.spinWindup = Dm(this.spinWindup, v, d ? 17 : 8, e);
                    let y = this.flipReversal ? H(this.flipVelocity / h, -1, 1) : f;
                    this.flipWindup = Dm(this.flipWindup, y, f ? 24 : 9, e),
                    this.flipTightness = Dm(this.flipTightness, a.abs(y), f ? 14 : 10, e),
                    !f && a.abs(this.flipVelocity) < .015 && (this.flipVelocity = 0),
                    !d && a.abs(this.spinVelocity) < .015 && (this.spinVelocity = 0),
                    this.spin += this.spinVelocity * e,
                    this.flip += this.flipVelocity * e,
                    !m && a.abs(this.rollVelocity) < .015 && (this.rollVelocity = 0),
                    t.cork && this.airTime <= .25 && (this.corkSet = !0);
                    let b = !!t.cork && this.corkSet;
                    this.airRotation.update(this.flipVelocity, this.spinVelocity, e, b, this.rollVelocity, !!t.over && b);
                    let x = !!(d || f || m || t.grab)
                      , S = s * a.sin(this.heading) + o * a.cos(this.heading)
                      , C = !x && mm.some(e => {
                        for (let t of [0, .25, .5, .75]) {
                            let n = Gm(e, this.x + this.velocityX * t, this.z + this.velocityZ * t);
                            if (n.t >= 0 && n.t <= 1 && a.abs(n.side) < e.width / 2 + .7 && this.y >= Xm(e, n.t) - .1)
                                return !0
                        }
                        return !1
                    }
                    )
                      , w = a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 ? this.spinVelocity / Mh : 0
                      , T = this.airRotation.upright > .64 && a.abs(this.airRotation.flipAngle) < .5 && this.airRotation.inversions === 0 && !this.airRotation.corked && !f && !m && !t.cork && a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 && !C
                      , ee = t.grab && T
                      , te = !!(d || f || m)
                      , E = this.landingAssist.update(e, this.airOrientation, this.airRotation.landingYaw, C ? 0 : S, u, this.airRotation.speed, te || t.grab && !ee || this.airTime < .22 && this.vy > 0, C, C ? 0 : s * a.cos(this.heading) - o * a.sin(this.heading), w, ee);
                    if (this.airRotation.correct(E),
                    T && (a.abs(this.spinVelocity) > .5 || d) && E.x === 0 && E.y === 0 && E.z === 0) {
                        let t = Number.isFinite(u) ? a.max(0, a.min(1, (1.5 - u) / 1.2)) : 0;
                        this.airRotation.correct(this.airLevel.update(e, this.airOrientation, this.airRotation.landingYaw, this.airTime, C ? 0 : S, C ? 0 : s * a.cos(this.heading) - o * a.sin(this.heading), t))
                    }
                    t.grab && (this.grabTime += e),
                    this.grabLedger.update(e, t.grab, t.grabStyle ?? 0, !!t.board),
                    this.maxAir = a.max(this.maxAir, this.y - W(this.x, this.z)),
                    this.judgeAir(),
                    r || this.funnelInAir(e);
                    let ne = !r && this.landOnRail(this.vy >= 0);
                    if (!ne && this.collideWithPark())
                        return;
                    if (!ne && !r && this.y <= i && this.vy < 0) {
                        this.landingImpact = a.max(0, c - this.vy) / a.hypot(1, s, o),
                        this.y = i,
                        this.airborne = !1,
                        this.landing = 1,
                        this.lastJumpDistance = this.jumpDistance;
                        let e = this.airRotation.landingYaw
                          , t = a.abs(a.sin(e));
                        this.landingNormal.set(-s * a.cos(this.heading) + o * a.sin(this.heading), 1, -s * a.sin(this.heading) - o * a.cos(this.heading)).normalize();
                        let n = this.landingUp.set(0, 1, 0).applyQuaternion(this.airOrientation).dot(this.landingNormal)
                          , r = a.acos(H(n, -1, 1))
                          , l = !this.butter.catchLanding(this, this.airOrientation, this.landingNormal) && n < .25 && (n < 0 || this.landingImpact > 3 || this.airTime > .3)
                          , u = l ? null : this.butter.landingFor(this)
                          , d = !l && u !== `faceplant`
                          , f = !1;
                        if (d) {
                            this.powderLandingImpact = this.landingImpact,
                            this.powderLandingAge = 0,
                            this.powderLanding = p(this.landingImpact, 0),
                            this.judgeAir(!0),
                            this.lastScoreFactors = this.scoreFactors;
                            let n = a.round((e + w) / a.PI);
                            a.abs(n) % 2 == 1 && (this.switchStance = !this.switchStance,
                            this.airOrientation.multiply(this.stanceTurn.set(0, 1, 0, 0)));
                            let i = t >= .3 || Cn(this.airOrientation, this.landingNormal)
                              , o = !i && this.airTime > .65
                              , s = o && this.speed > 3 && this.velocityZ > .5 && c < -.15
                              , l = a.max(0, (this.speed * this.speed + this.vy * c) / (a.hypot(this.speed, c) || 1));
                            this.speed = H(l * (o ? 1 : .975 - t * .065 - H(r, 0, 1) * .045) + (s ? 2.6 : 0), 0, 43),
                            this.landingBoost = s ? 2.2 : 0,
                            this.pushAirLink();
                            let d = _e(this.chainLinks)
                              , m = i ? pe(t) : 1;
                            m < 1 && this.lastScoreFactors && (this.lastScoreFactors = {
                                ...this.lastScoreFactors,
                                landing: m
                            });
                            let h = a.round(a.round(this.chainTricks * d) * m) + this.chainButter
                              , g = a.round(this.chainGrabs * d * m)
                              , _ = a.round(this.chainRails * d * m)
                              , v = o && this.chainLinks > 0 ? 450 + a.round((h - this.chainButter + g + _) * de) : 0;
                            this.lastScore = h + g + _ + v,
                            this.score += this.lastScore,
                            this.runScore.tricks += h,
                            this.runScore.grabs += g,
                            this.runScore.rails += _,
                            this.runScore.landings += v;
                            for (let e of this.chainRepeatKeys)
                                this.trickTally.set(e, (this.trickTally.get(e) ?? 0) + 1);
                            let y = this.chain.join(` → `);
                            this.landedJumps++,
                            this.cleanLandings += Number(o),
                            this.totalAirTime += this.airTime,
                            this.lastScore > this.bestCombo && (this.bestCombo = this.lastScore,
                            this.bestTrick = y || `STRAIGHT AIR`),
                            this.landingSpin = Vh(e, n * a.PI),
                            this.landingFlip = r * (a.sign(this.landingUp.z) || 1),
                            f = u === `press` && this.butter.pressLanding(this, this.landingImpact),
                            this.spin = this.landingSpin,
                            this.spinVelocity = f ? this.butter.velocity : H(this.spinVelocity, -3, 3),
                            this.landingSettling = !f,
                            this.notice = this.lastScore > 0 ? y ? `${i ? `SAVED IT` : `STOMPED`}. ${y}` : o ? `CLEAN LANDING` : `` : ``,
                            this.noticeTime = this.notice ? 3 : 0,
                            this.event = `land`,
                            this.clearChain()
                        } else
                            u === `faceplant` ? this.faceplant() : this.beginCrash(this.landingImpact);
                        this.vy = 0,
                        this.flip = 0,
                        this.trick = ``,
                        this.rollVelocity = 0,
                        this.flipVelocity = 0,
                        this.flipTightness = 0,
                        this.spinTightness = 0,
                        this.landingPrepare = 1,
                        f && this.butter.pose(this)
                    }
                }
                if (!this.airborne && !n && this.landingSettling && !this.grind && this.crashTime <= 0) {
                    j(zm(this.x, this.z, this.heading), this.spin, this.edge, this.groundTarget, zm(this.x, this.z, this.heading + a.PI / 2));
                    let t = f(this.airOrientation, this.groundTarget);
                    c(this.airOrientation, this.groundTarget, a.min(8 * e, t * (1 - a.exp(-18 * e)))),
                    t < .035 && a.abs(this.spin) < .002 && a.abs(this.spinVelocity) < .02 && (this.landingSettling = !1,
                    this.spin = 0,
                    this.spinVelocity = 0)
                }
                this.jumpHeld = t.jump,
                this.finishRun()
            }
        }
    }
}
  , Uh = 1600
  , Wh = [[0, .1], [35, .24], [47, 0], [65, 0], [85, .34], [130, .34], [155, .07], [235, .07], [255, .42], [310, .42], [335, .06], [415, .06], [450, .42], [500, .44], [540, .44], [588, .28], [690, .276], [750, .44], [780, .44], [809, .27], [920, .262], [1190, .25], [1230, .26], [1250, .32], [1340, .22], [1494, .1], [1540, .065], [1580, .045], [1600, .025]]
  , Gh = 984
  , Kh = Wh.findIndex( ([e]) => e === 155)
  , qh = [];
qh[Kh] = 47.225;
for (let e = Kh - 1; e >= 0; e--) {
    let t = Wh[e]
      , n = Wh[e + 1];
    qh[e] = qh[e + 1] - (n[0] - t[0]) * (t[1] + n[1]) / 2
}
for (let e = Kh + 1; e < Wh.length; e++) {
    let t = Wh[e - 1]
      , n = Wh[e];
    qh[e] = qh[e - 1] + (n[0] - t[0]) * (t[1] + n[1]) / 2
}
Gh - qh[0],
qh[qh.length - 1] - qh[0];
function Jh(e) {
    let t = a.max(0, a.min(Uh, e))
      , n = 0;
    for (; n + 2 < Wh.length && t > Wh[n + 1][0]; )
        n++;
    let r = Wh[n]
      , i = Wh[n + 1]
      , o = i[0] - r[0]
      , s = (t - r[0]) / o;
    return Gh - qh[n] - o * (r[1] * s + (i[1] - r[1]) * (s * s * s - s * s * s * s / 2))
}
function Yh(e, t) {
    let n = a.max(0, a.min(1, (a.abs(e) - 100) / 120));
    if (!n)
        return 0;
    let r = (t - 760) / 830
      , i = (a.abs(e) - 195) / 120;
    return 28 * n * n * (3 - 2 * n) * a.exp(-i * i - r * r)
}
var Xh = {
    snowWalls: !0
}
  , Zh = `/models/flowline/rails-v2.glb`
  , Qh = Uh
  , $h = Qh - 32
  , eg = Qh / 6
  , G = Jh
  , K = e => 7 * a.sin(e * .005) - 3 * a.sin(e * .01)
  , tg = e => K(e + .5) - K(e - .5)
  , ng = []
  , rg = (e, t) => 0
  , ig = (e, t) => a.abs(e - K(t))
  , ag = (e, t, n, r={}) => ({
    z: e,
    height: t,
    name: n,
    offset: 0,
    width: 18,
    lipAngle: 32,
    lipLength: 3,
    landingRise: -6,
    run: 42,
    table: 20,
    landing: 110,
    kind: `kicker`,
    kick: `high`,
    transfer: 0,
    main: !0,
    approach: 56,
    mound: {
        height: 10
    },
    ...r
})
  , og = [ag(630, 16, `FIRST WALL`, {
    table: 8,
    landing: 140
}), ag(855, 18, `HIGH TIDE`, {
    width: 20,
    lipAngle: 34,
    run: 46,
    table: 12,
    landing: 145,
    mound: {
        height: 12
    }
}), ag(1075, 20, `CORK SEVEN`, {
    width: 22,
    lipAngle: 35,
    run: 50,
    table: 14,
    landing: 135,
    mound: {
        height: 14
    }
}), ag(1310, 13, `LAST LIGHT`, {
    width: 18,
    lipAngle: 30,
    run: 36,
    table: 14,
    landing: 170,
    approach: 40,
    mound: {
        height: 8
    }
}), ag(1310, 9, `SIDE HIP`, {
    offset: -34,
    width: 10,
    lipAngle: 27,
    run: 30,
    table: 16,
    landing: 112,
    kind: `hip`,
    transfer: 2,
    main: !1,
    approach: 38,
    mound: {
        height: 5
    }
})];
if (isRidgeline) og = [
    ag(590, 8, 'FIRST TRACKS', { width: 24, lipAngle: 24, run: 30, table: 10, landing: 95 }),
    ag(760, 10, 'BLUEBIRD', { width: 24, lipAngle: 28, run: 34, table: 12, landing: 105 }),
    ag(940, 12, 'RIDGE RUNNER', { width: 22, lipAngle: 30, run: 38, table: 14, landing: 110 }),
    ag(1130, 14, 'SKYLINE', { width: 22, lipAngle: 32, run: 42, table: 12, landing: 120 }),
    ag(1350, 10, 'HOME STRETCH', { width: 24, lipAngle: 27, run: 34, table: 10, landing: 125 }),
    ag(940, 7, 'SIDE QUEST', { offset: -34, width: 12, lipAngle: 26, run: 28, table: 12, landing: 90, kind: 'hip', transfer: 3, main: false })
  ];
for (let e of og) {
    let t = e.z - e.run
      , n = vr(e.run, e.lipLength, e.lipAngle, G(t + .5) - G(t - .5));
    e.height = G(t) + n.rise - G(e.z),
    e.mound.landingBias = e.z < 1e3 ? .35 : .8,
    e.mound.levelLanding = !0,
    e.mound.shoulder = e.main ? 9 : 4,
    e.mound.wall = e.main ? 7 : 5,
    e.mound.height = e.height - (e.main ? e.run >= 50 ? 7 : e.run >= 46 ? 6.5 : e.run >= 40 ? 6 : 5 : 3.5)
}
var sg = (e, t, n, r, i={}) => ({
    z: e,
    offset: t,
    length: n,
    name: r,
    width: .2,
    build: `box`,
    profile: `flat`,
    angle: 0,
    height: 2.65,
    entry: `pop`,
    popLaunch: `ballistic`,
    entryRun: 18,
    entryGap: 4,
    entryHeight: 1.7,
    popAngle: 3,
    ...i
})
  , cg = [{
    name: `01 / STREET LINK`,
    start: 166,
    end: 296,
    halfWidth: 34
}, {
    name: `02 / SWITCH YARD`,
    start: 346,
    end: 496,
    halfWidth: 34
}]
  , lg = (e, t) => K(t)
  , ug = [[sg(178, 0, 20, `STREETBAR`, {
    exitLanding: !1
}), sg(202, 0, 34, `FLAT DOWN`, {
    build: `tube`,
    width: .148,
    profile: `down`,
    height: .95,
    entry: `transfer`
})], [sg(178, -18, 21, `TWINBAR`, {
    build: `twin`,
    width: .212,
    exitLanding: !1
}), sg(203, -18, 34, `DFD`, {
    profile: `down-flat-down`,
    height: .94,
    entry: `transfer`
})], [sg(178, 18, 20, `ROUND BAR`, {
    build: `tube`,
    width: .148,
    entry: `ride`,
    entryRun: 14,
    exitLanding: !1
}), sg(202, 18, 28, `RAINBOW`, {
    build: `tube`,
    profile: `rainbow`,
    width: .148,
    height: 1.05,
    entry: `transfer`
})], [sg(358, 0, 32, `LONG PIPE`, {
    build: `tube`,
    width: .6,
    finish: `worn-tank`,
    paint: `#377dad`,
    exitLanding: !1
}), sg(392, 0, 48, `PIPE EXIT`, {
    build: `tube`,
    width: .6,
    finish: `worn-tank`,
    paint: `#377dad`,
    height: 1.05,
    entry: `transfer`
})], [sg(358, -18, 27, `FLAT DECK`, {
    exitLanding: !1
}), sg(389, -18, 53, `BACKSIDE DOWN`, {
    build: `tube`,
    width: .148,
    entry: `transfer`
})], [sg(358, 18, 22, `STAIR ENTRY`, {
    exitLanding: !1
}), sg(382, 18, 58, `STAIR DOWN`, {
    stairs: {
        width: 3.6,
        steps: 72,
        clearance: 2,
        railSide: `right`
    },
    entry: `transfer`
})]];
for (let[e,t] of ug) {
    e.z < 300 && (e.height = e.offset > 1 ? 2.4 : 3);
    let n = a.atan(tg(e.z));
    t.z = e.z + a.cos(n) * (e.length + 3),
    t.height = e.z < 300 ? 2.15 : 2.1,
    t.exitLanding = !1;
    let r = t.z - e.z;
    t.offset = K(e.z) + e.offset + a.tan(n) * r - K(t.z),
    t.angle = (n - a.atan(tg(t.z))) * 180 / a.PI
}
var dg = ug.flat()
  , fg = ug.map( ([e,t]) => ({
    start: e.z - 13,
    end: t.z + t.length + 1,
    offset: e.offset,
    height: e.offset < -1 ? 2.3 : e.offset > 1 ? 1.4 : 2.8,
    stepRise: e.offset > 1 && e.z < 300 ? 4.4 : 0,
    ...e.z > 300 ? {
        height: a.abs(e.offset) < 1 ? 5 : 7,
        level: e.z,
        descent: {
            start: e.z + e.length + .5,
            end: t.z + t.length,
            drop: e.offset < -1 || e.offset > 1 ? 12 : 10.5
        }
    } : {},
    halfWidth: 6,
    cut: e.z < 300 && e.offset <= 0 ? .45 : .7,
    approach: e.z < 300 ? 64 : 86,
    downhillApproach: !0,
    exit: 20
}))
  , pg = [244, 444].map(e => ({
    start: e,
    end: e,
    offset: 0,
    height: 1.8,
    halfWidth: 27,
    cut: 5,
    approach: 18,
    exit: 52
}))
  , mg = [...fg, ...pg];
for (let e of dg)
    e.build === `tube` && !e.paint && (e.paint = `#8074c5`);
var hg = []
  , gg = []
  , _g = []
  , vg = [[0, `DROP IN`], [125, `BREMS / STREET LINK`], [166, `STREET LINK`], [260, `DROP / SWITCH YARD`], [312, `BREMS / SWITCH YARD`], [346, `SWITCH YARD`], [465, `DROP / FIRST WALL`], [570, `FIRST WALL`], [760, `HIGH TIDE`], [977, `CORK SEVEN`], [1250, `LAST LIGHT`], [1515, `UTLØP / BREMS`], [1540, `FINISH`]]
  , ridgelineZones = isRidgeline && (vg = [[0, 'RIDGELINE / DROP IN'], [166, 'WARMUP RAILS'], [346, 'SWITCH YARD'], [530, 'FIRST TRACKS'], [700, 'BLUEBIRD'], [880, 'RIDGE RUNNER / SIDE QUEST'], [1070, 'SKYLINE'], [1290, 'HOME STRETCH'], [1500, 'RUNOUT / FINISH']])
  , yg = e({
    AIR_ANGLE: () => G_,
    AIR_GRAVITY: () => o_,
    AIR_RATE: () => K_,
    AIR_REACH: () => 1,
    AIR_WINDOW: () => q_,
    BRANCHES: () => ng,
    COURSE_LENGTH: () => Qh,
    COURSE_WIDTH: () => 260,
    FINISH_HALF_WIDTH: () => 22,
    FINISH_Z: () => $h,
    FLAT_SLAM: () => 33,
    FLIP_RATE: () => I_,
    FORWARD_TUCK_SPEED: () => 18,
    FORWARD_TUCK_TIME: () => V_,
    FUNNEL_ANGLE: () => U_,
    FUNNEL_PULL: () => W_,
    FUNNEL_REACH: () => H_,
    GRAB_SPIN_RATE: () => R_,
    JIB_PLATFORMS: () => mg,
    JIB_SECTIONS: () => cg,
    JUMPS: () => og,
    KICKER_BACK: () => p_,
    LIFT_DURATION: () => eg,
    LIFT_SPEED: () => 6,
    LIFT_TOWER_SPACING: () => 190,
    PARK_BANKS: () => gg,
    PARK_ENTRY_Z: () => 61,
    POP_CATCH: () => r_,
    POP_CLEAR: () => n_,
    POP_CLIMB: () => Mg,
    POP_GAP: () => e_,
    POP_KICK: () => 24,
    POP_STEP: () => t_,
    RAILS: () => dg,
    RAIL_HOPS: () => 2,
    RAIL_LIP: () => Qg,
    RAIL_PULL: () => F_,
    RAIL_SPIN_RATE: () => P_,
    RAIL_SWAPS: () => 2,
    ROLLERS: () => hg,
    SNOW_FORMS: () => _g,
    SPIN_RATE: () => N_,
    SPIN_TURN_RATE: () => L_,
    SkiSimulation: () => Y_,
    UP_RUN: () => 3,
    UP_START: () => Jg,
    ZONES: () => vg,
    baseHeight: () => G,
    branchOffset: () => rg,
    cabinTravel: () => j_,
    center: () => K,
    clamp: () => q,
    climbsOut: () => Yg,
    courseTangent: () => tg,
    damp: () => xg,
    groundHeight: () => x_,
    groundLaunch: () => Lg,
    groundPop: () => Rg,
    jibGrooming: () => d_,
    jibLips: () => u_,
    jibSectionCenter: () => lg,
    jibTerraces: () => v_,
    jumpCenter: () => Ag,
    jumpStyle: () => Og,
    lerp: () => bg,
    liftX: () => A_,
    lineDistance: () => ig,
    mountainHeight: () => k_,
    mountainShoulder: () => Yh,
    onKickerWall: () => Pg,
    parkBanks: () => y_,
    parkGrooming: () => b_,
    popLine: () => a_,
    railCrest: () => s_,
    railFrame: () => Kg,
    railHeading: () => Wg,
    railLipRun: () => $g,
    railPoint: () => Gg,
    railPopGap: () => i_,
    railTop: () => Zg,
    rampHeight: () => g_,
    rampLaunch: () => jg,
    riderSurface: () => Vg,
    sculptedSnow: () => __,
    snowGrade: () => Bg,
    snowSurface: () => S_,
    terrainHeight: () => Y,
    zoneAt: () => M_
})
  , q = (e, t, n) => a.max(t, a.min(n, e))
  , bg = (e, t, n) => e + (t - e) * n
  , xg = (e, t, n, r) => bg(e, t, 1 - a.exp(-n * r))
  , Sg = e => {
    let t = q(e, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10)
}
  , J = e => {
    let t = q(e, 0, 1);
    return t * t * (3 - 2 * t)
}
  , Cg = K(61)
  , wg = a.atan(tg(61))
  , Tg = a.cos(wg)
  , Eg = a.sin(wg)
  , Dg = G(53)
  , Og = e => e.kick === `high` ? `HIGH KICK` : e.kind === `step-up` ? `STEP UP` : e.kind === `hip` ? `HIP` : `FLOW`
  , kg = new Map;
function Ag(e, t) {
    let n = kg.get(e);
    (!n || !Object.is(n.z, e.z)) && kg.set(e, n = {
        z: e.z,
        x: K(e.z),
        tangent: tg(e.z)
    });
    let r = a.max(0, t - e.z)
      , i = n.x + n.tangent * r;
    return bg(K(t), i, J(r / e.table)) + e.offset + e.transfer * q(r / 65, 0, 1)
}
function jg(e, t, n, r=0) {
    let i = a.atan(a.tan(e.lipAngle * a.PI / 180) * a.max(.2, a.cos(r)))
      , o = 1.2 + q(n, 0, 1) * 2.2;
    return {
        horizontal: t * a.cos(i) - o * a.sin(i),
        vertical: t * a.sin(i) + o * a.cos(i)
    }
}
var Mg = a.tan(12 * a.PI / 180)
  , Ng = (e, t) => og.some(n => {
    if (t < n.z - n.run || t > n.z + 1)
        return !1;
    let r = Ag(n, t)
      , i = a.abs(e - r) - n.width / 2;
    return i >= 0 && i < 1.5 && Y(e, t) < Y(r + a.sign(e - r) * (n.width / 2 - .6), t) - 1
}
)
  , Pg = (e, t) => {
    let n = !1;
    for (let r of og) {
        let i = t - r.z
          , o = r.mound;
        if (i < -r.run || i > r.table + r.landing)
            continue;
        let s = o?.shoulder ?? 3
          , c = a.abs(e - Ag(r, t)) - r.width / 2;
        if (c <= (o?.height ? s - 1 : 1))
            return !1;
        n ||= !!o?.height && c < s + (o.wall ?? 4) + 1
    }
    return n
}
  , Fg = a.tan(60 * a.PI / 180);
function Ig(e, t, n, r) {
    for (let i = 1; i <= 5; i++) {
        let a = ur(Y, e + n * i / 10, t + r * i / 10);
        if (a.length >= Fg && a.dx * n + a.dz * r > 0)
            return !0
    }
    return !1
}
function Lg(e, t, n, r, i) {
    let {slope: o, crossSlope: s} = Vg(e, t, 0)
      , c = og.some(n => t >= n.z - n.run && t <= n.z && a.abs(e - Ag(n, t)) < n.width / 2);
    if (!c) {
        let n = Y(e, t);
        Ig(e, t, 1, 0) ? s = (n - Y(e - .5, t)) / .5 : Ig(e, t, -1, 0) && (s = (Y(e + .5, t) - n) / .5),
        Ig(e, t, 0, 1) ? o = (n - Y(e, t - .5)) / .5 : Ig(e, t, 0, -1) && (o = (Y(e, t + .5) - n) / .5)
    }
    let l = (c ? 1.2 + q(i, 0, 1) * 2.2 : 3.6 + q(i, 0, 1) * 2.6) / a.hypot(s, 1, o)
      , u = s * n + o * r
      , d = a.hypot(n, r) * Mg;
    return {
        velocityX: n - s * l,
        velocityZ: r - o * l,
        vertical: (u > d && (Ng(e, t) || Pg(e, t)) ? d : u) + l
    }
}
var Rg = (e, t, n, r, i) => Lg(e, t, n, r, i).vertical;
function zg(e, t, n) {
    let r = Ag(e, n)
      , i = a.max(.6, e.width / 2 - .05)
      , o = a.max(r - i, a.min(r + i - 1, t - .5));
    return Y(o + 1, n) - Y(o, n)
}
function Bg(e, t, n) {
    for (let r of og)
        if (t <= r.z && t >= r.z - r.lipLength + .5 && a.abs(e - Ag(r, t)) < r.width / 2)
            return zg(r, e, t) * a.sin(n) + a.tan(r.lipAngle * a.PI / 180) * a.cos(n);
    let r = a.sin(n) * .5
      , i = a.cos(n) * .5;
    return Y(e + r, t + i) - Y(e - r, t - i)
}
function Vg(e, t, n, r=!1) {
    let i = Y(e + .5, t) - Y(e - .5, t)
      , o = Y(e, t + .5) - Y(e, t - .5)
      , s = 0;
    for (let n of og)
        if (t <= n.z && t > n.z - n.lipLength - 3 && a.abs(e - Ag(n, t)) < n.width / 2) {
            s = J((t - n.z + n.lipLength + 3) / 3),
            i = zg(n, e, t),
            t >= n.z - n.lipLength + .5 && (o = a.tan(n.lipAngle * a.PI / 180));
            break
        }
    if (r)
        for (let n of dg) {
            let r = Kg(n, e, t);
            if (r.t >= 0 && r.t <= 1 && a.abs(r.side) < .8) {
                let e = a.max(0, r.t - .01)
                  , t = a.min(1, r.t + .01)
                  , s = Wg(n)
                  , c = (Zg(n, t) - Zg(n, e)) / ((t - e) * n.length);
                i = a.sin(s) * c,
                o = a.cos(s) * c;
                break
            }
        }
    return {
        slope: i * a.sin(n) + o * a.cos(n),
        crossSlope: i * a.cos(n) - o * a.sin(n),
        lip: s
    }
}
var Hg = new WeakMap;
function Ug(e) {
    let t = Hg.get(e);
    if (!t) {
        let n = a.atan(tg(e.z)) + e.angle * a.PI / 180;
        t = {
            h: n,
            sin: a.sin(n),
            cos: a.cos(n),
            c: K(e.z)
        },
        Hg.set(e, t)
    }
    return t
}
var Wg = e => Ug(e).h;
function Gg(e, t) {
    let n = Ug(e);
    return {
        x: n.c + e.offset + n.sin * e.length * t,
        z: e.z + n.cos * e.length * t
    }
}
function Kg(e, t, n) {
    let r = Ug(e)
      , i = t - r.c - e.offset
      , a = n - e.z;
    return {
        t: (i * r.sin + a * r.cos) / e.length,
        side: i * r.cos - a * r.sin
    }
}
var qg = {
    flat: () => 0,
    kink: e => e < .3 ? .65 * J(e / .3) : e < .62 ? .65 : .65 * (1 - J((e - .62) / .38)),
    down: e => .35 - .6 * e,
    "down-flat-down": e => e < .28 ? .36 * (1 - J(e / .28)) : e < .64 ? 0 : -.25 * J((e - .64) / .36),
    rainbow: e => 1.5 * a.sin(a.PI * e),
    cannon: e => 1.9 * a.pow(J((e - .55) / .45), 1.3)
}
  , Jg = .5
  , Yg = e => e.entry === `ride` && e.profile !== `rainbow`
  , Xg = (e, t) => Yg(e) ? -Jg * (1 - J(t * e.length / 3)) : 0;
function Zg(e, t) {
    let n = Gg(e, 0)
      , r = Gg(e, 1)
      , i = q(t, 0, 1);
    return bg(x_(n.x, n.z), x_(r.x, r.z), i) + e.height + qg[e.profile](i) + Xg(e, i)
}
var Qg = 8.5
  , $g = e => e.entryRun ?? 8.5
  , e_ = 2.5
  , t_ = .8
  , n_ = .35
  , r_ = .45
  , i_ = e => e.entryGap ?? 2.5
  , a_ = e => Zg(e, 0) - (Zg(e, .1) - Zg(e, 0)) / (.1 * e.length) * i_(e)
  , o_ = 17.5
  , s_ = e => e.entry === `pop` ? -i_(e) : 0
  , c_ = new WeakMap;
function l_(e) {
    let t = c_.get(e);
    if (!t) {
        let n = i_(e)
          , r = Gg(e, -n / e.length)
          , i = e.entryHeight ?? a_(e) - (e.popStep ?? .8) - x_(r.x, r.z)
          , o = Wg(e)
          , s = a.sin(o) * .5
          , c = a.cos(o) * .5
          , l = e.popLaunch === `ballistic` ? x_(r.x + s, r.z + c) - x_(r.x - s, r.z - c) : 0;
        t = {
            height: i,
            power: (a.tan((e.popAngle ?? 24) * a.PI / 180) - l) * ($g(e) - n) / i
        },
        c_.set(e, t)
    }
    return t
}
function u_(e, t) {
    let n = 0;
    for (let r of dg) {
        let i = Kg(r, e, t)
          , o = i.t * r.length;
        if (r.entry === `transfer` && o < 0)
            continue;
        let s = $g(r);
        if (o < -s || o > r.length + 14 || a.abs(i.side) > 4.2)
            continue;
        let c = r.height + qg[r.profile](0) + Xg(r, 0), l = J((3.2 - a.abs(i.side)) / 1.6), u;
        if (r.entry === `pop`) {
            let n = l_(r)
              , i = i_(r);
            if (r.popLaunch === `manual` && o <= -i) {
                let c = Gg(r, -i / r.length)
                  , l = x_(c.x, c.z) + n.height;
                u = a.max(0, l - x_(e, t)) * J((o + s) / (s - i - 1.5))
            } else if (r.popLaunch === `ballistic` && o <= -i) {
                let e = (o + s) / (s - i);
                u = n.height * (J(e) + (e * e * e - e * e) * n.power)
            } else
                u = o <= -i ? n.height * a.pow((o + s) / (s - i), n.power) : n.height * (1 - J((o + i) / 1.4))
        } else
            u = r.entry === `transfer` ? 0 : c * (o <= 0 ? J(1 + o / s) : 1 - J(o / 3));
        let d = o - r.length
          , f = (r.exitLanding === !1 ? 0 : 1) * J((d + .5) / 3) * (1 - J((d - 2) / 12)) * a.min(.42, a.max(0, r.height + qg[r.profile](1) - .3))
          , p = J((o - 2) / 5) * (1 - J((o - r.length + (r.exitLanding === !1 ? 5 : 3)) / 5)) * a.exp(-a.pow((a.abs(i.side) - 2.6) / .9, 2)) * .22;
        n = a.max(n, (u + f) * l + p)
    }
    return n
}
function d_(e, t) {
    let n = 0;
    for (let r of cg) {
        let i = J((t - r.start + 16) / 14) * (1 - J((t - r.end - 4) / 16));
        n = a.max(n, i * (1 - J((a.abs(e - lg(r, t)) - r.halfWidth) / 10)))
    }
    return n
}
var f_ = (e, t) => {
    let n = a.min(.8, e, t);
    return a.max(e, t) + (n > 0 ? a.pow(a.max(0, 1 - a.abs(e - t) / n), 2) * n * .25 : 0)
}
  , p_ = .65
  , m_ = new WeakMap;
function h_(e, t, n) {
    let r = n - e.z
      , i = e.mound;
    if (r < -e.run)
        return 0;
    let o = m_.get(e);
    if (!o) {
        let t = e.z - e.run;
        o = vr(e.run, e.lipLength, e.lipAngle, G(t + .5) - G(t - .5)),
        m_.set(e, o)
    }
    let s, c;
    if (r <= 0)
        s = a.max(0, G(e.z - e.run) + o.at(r + e.run) - G(n)),
        c = s * i.height / e.height;
    else {
        let t = q((r - e.table) / e.landing, 0, 1)
          , a = t * t * t * (35 + t * (-105 + t * (126 + t * (-70 + 15 * t))))
          , o = bg(Sg(t), a, i.landingBias ?? 0);
        c = (i.height + (i.levelLanding ? G(e.z) - G(n) : 0)) * (1 - o),
        s = c + (e.height - i.height) * (1 - J(r / p_))
    }
    let l = a.abs(t - Ag(e, n))
      , u = e.width / 2
      , d = 1 - q((l - u) / .55, 0, 1)
      , f = 1 - q((l - u - (i.shoulder ?? 3)) / (i.wall ?? 4), 0, 1);
    return (c + (s - c) * d) * f
}
function g_(e, t) {
    let n = 0;
    for (let r of og) {
        let i = t - r.z
          , o = r.approach ?? (r.main ? 64 : 42);
        if (i < -r.run - o || i > r.table + r.landing)
            continue;
        if (r.mound) {
            n = f_(n, h_(r, e, t));
            continue
        }
        let s = a.abs(e - Ag(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * J(i / r.table) : 0
          , l = r.foundation ?? (r.main ? 2 : .9)
          , u = bg(9, 2.4, J((i + r.run) / (r.run * .7)))
          , d = J((r.width / 2 + c + (i > .65 ? 9 : u) - s) / (i > .65 ? 9 : u))
          , f = l * J((i + r.run + o) / o) * (1 - J((i - 2) / (r.table * .55))) * J((r.width / 2 + 12 - s) / 7);
        if (i < -r.run)
            n = f_(n, f);
        else if (i <= 0) {
            let e = r.z - r.lipLength
              , o = a.tan(r.lipAngle * a.PI / 180)
              , s = r.height - o * r.lipLength + G(r.z) - G(e)
              , c = (o - (G(e + .5) - G(e - .5))) * (r.run - r.lipLength) / (s - l)
              , u = i >= -r.lipLength ? r.height + o * i + G(r.z) - G(t) : l + a.pow((i + r.run) / (r.run - r.lipLength), a.max(1.5, c)) * (s - l);
            f = a.max(f, u * d),
            n = f_(n, f)
        } else {
            let e = J(i / r.table)
              , t = 1 - Sg((i - r.table) / r.landing)
              , o = G(r.z) + r.height + r.landingRise - G(r.z + r.table)
              , s = e * t * o
              , c = r.height * (1 - J(i / p_))
              , l = a.max(0, 1 - a.abs(c - s) / .8);
            n = f_(n, a.max(f, (a.max(c, s) + l * l * .2) * d))
        }
    }
    return n
}
function __(e, t) {
    let n = e - K(t)
      , r = 0;
    for (let e of _g) {
        let i = (t - e.z) / e.radiusZ;
        if (a.abs(i) > 2.8)
            continue;
        let o = (n - e.offset) / e.radiusX;
        r += e.height * a.exp(-o * o * 1.5 - i * i * 1.8)
    }
    return r
}
function v_(e, t) {
    let n = 0;
    for (let r of mg) {
        let i = a.abs(e - K(t) - r.offset);
        if (i > r.halfWidth + r.cut || t < r.start - r.approach || t > r.end + r.exit)
            continue;
        let o = J((t - r.start + r.approach) / r.approach) * (1 - J((t - r.end) / r.exit))
          , s = (r.height + (r.level === void 0 ? 0 : G(r.level) - G(t)) + (r.stepRise ?? 0) * J((t - r.start - 13) / 20) - (r.descent ? r.descent.drop * q((t - r.descent.start) / (r.descent.end - r.descent.start), 0, 1) : 0)) * o;
        if (r.downhillApproach && t < r.start) {
            let e = r.start - r.approach
              , n = q((t - e) / r.approach, 0, 1)
              , i = G(e)
              , o = G(r.level ?? r.start) + r.height
              , c = a.min(0, (o - i) / r.approach)
              , l = q(G(e + .5) - G(e - .5), c * 3, 0)
              , u = r.level === void 0 ? q(G(r.start + .5) - G(r.start - .5), c * 3, 0) : 0
              , d = n * n
              , f = d * n
              , p = (2 * f - 3 * d + 1) * i + (f - 2 * d + n) * r.approach * l + (-2 * f + 3 * d) * o + (f - d) * r.approach * u;
            s = a.max(0, p - G(t))
        }
        n = a.max(n, s * (1 - q((i - r.halfWidth) / r.cut, 0, 1)))
    }
    for (let r of cg) {
        if (r.branch === void 0 || t < r.start - 50 || t > r.end + 16)
            continue;
        let i = 1 - J((a.abs(e - lg(r, t)) - r.halfWidth - 2) / 7);
        if (!i)
            continue;
        let o = J((t - r.start + 50) / 34) * (1 - J((t - r.end + 4) / 20))
          , s = G(r.start - 16) + 1.2 - (t - r.start + 16) * .075;
        n = a.max(n, q(s - G(t), 0, 3.5) * o * i)
    }
    return n
}
function y_(e, t) {
    let n = 0;
    for (let r of gg) {
        let i = a.abs(t - r.z) / r.radiusZ;
        if (i >= 1)
            continue;
        let o = a.abs(e - K(t) - r.offset) / r.radiusX;
        o < 1 && (n = a.max(n, r.height * (1 - J(i)) * (1 - J(o))))
    }
    return n
}
function b_(e, t) {
    let n = 0;
    for (let r of og) {
        let i = t - r.z
          , o = r.mound ? 20 : 12;
        if (i < -r.run - o || i > r.table + r.landing + 15)
            continue;
        let s = a.abs(e - Ag(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * J(i / r.table) : 0;
        n = a.max(n, J((i + r.run + o) / 16) * (1 - J((i - r.table - r.landing + 8) / 23)) * (1 - J((s - r.width / 2 - c - 2) / 12)))
    }
    return a.max(n, d_(e, t))
}
function x_(e, t) {
    let n = e - K(t)
      , r = ig(e, t)
      , i = J((r - 18) / 26)
      , o = (a.sin(e * .081 + t * .029) * .9 + a.sin(t * .082 - e * .049) * .6) * i
      , s = a.pow(a.max(0, a.abs(n) - 76), 1.37) * .018
      , c = 0;
    for (let e of hg) {
        let n = (t - e) / 23;
        a.abs(n) < 1 && (c += (1 + a.cos(n * a.PI)) * 1.1 * J((25 - r) / 10))
    }
    let l = a.sin(t * .006) * n * .022 * J((a.abs(n) - 12) / 25)
      , u = i * (1.35 * a.sin(t * .014 + n * .036) + .55 * a.sin(t * .027 - n * .041))
      , d = b_(e, t)
      , f = i * (1.3 * a.sin(t * .021 + n * .05) + .6 * a.sin(t * .041 - n * .07))
      , p = G(t) + s + Yh(n, t) + (o * .55 + u + f + c + l + __(e, t) * 1.12) * (1 - d * .97) + g_(e, t) + v_(e, t) + y_(e, t);
    if (a.abs(t) < 32 && a.abs(e - (K(0) - 12)) < 26) {
        let n = (1 - J((a.abs(t) - 14) / 18)) * (1 - J((a.abs(e - (K(0) - 12)) - 13) / 13));
        return bg(p, G(0), n)
    }
    if (a.abs(t - 61) < 30 && a.abs(e - Cg) < 32) {
        let n = e - Cg
          , r = t - 61
          , i = n * Tg - r * Eg
          , o = n * Eg + r * Tg;
        return bg(p, Dg, (1 - J((a.abs(i) - 15) / 9)) * J((o + 23) / 9) * (1 - J((o - 4) / 10)))
    }
    return p
}
function Y(e, t) {
    let n = S_(e, t);
    return a.max(n, O_(e, t, n))
}
function S_(e, t) {
    return x_(e, t) + u_(e, t)
}
var C_ = dg.find(e => e.stairs)
  , w_ = 1.2
  , T_ = 1.5
  , E_ = .45
  , D_ = ( () => {
    if (!C_?.stairs)
        return null;
    let e = [Gg(C_, 0), Gg(C_, 1)]
      , t = C_.stairs.width + E_ + 2;
    return {
        minX: a.min(e[0].x, e[1].x) - t,
        maxX: a.max(e[0].x, e[1].x) + t,
        minZ: a.min(e[0].z, e[1].z) - t,
        maxZ: a.max(e[0].z, e[1].z) + t
    }
}
)();
function O_(e, t, n) {
    let r = C_
      , i = D_;
    if (!r?.stairs || !i || e < i.minX || e > i.maxX || t < i.minZ || t > i.maxZ)
        return -1 / 0;
    let {width: o, steps: s, clearance: c} = r.stairs
      , l = (r.length - 1) / s
      , u = (r.stairs.railSide === `right` ? 1 : r.stairs.railSide === `left` ? -1 : 0) * (o / 2 - .12)
      , d = Kg(r, e, t)
      , f = d.t * r.length
      , p = a.abs(d.side - u) - o / 2
      , m = .5
      , h = m + s * l;
    if (p > E_ || f < m - w_ || f > h + T_)
        return -1 / 0;
    let g = e => Zg(r, q(e, 0, r.length) / r.length) - c
      , _ = f <= m + l ? g(m) : g(f <= h ? f - l : h - l)
      , v = J((f - m + w_) / w_) * (1 - J((f - h) / T_)) * (1 - J(p / E_));
    return n + a.max(0, _ - n) * v
}
function k_(e, t) {
    let n = a.max(0, a.abs(e - K(t)) - 115)
      , r = a.sin(t * .006 + e * .003) * .4 + a.cos(t * .012 - e * .008) * .21 + a.sin(t * .021 + e * .013) * .12;
    return G(t) - 2 + Yh(e - K(t), t) + a.pow(n, .84) * (.64 + r * .88) + a.max(0, -t - 100) * .54
}
function A_(e, t=0) {
    return K(e) - 9 - 79 * J(a.min(e, Qh - e) / 150) + t
}
function j_(e, t=0, n=24) {
    let r = ((e / eg + t / n * 2) % 2 + 2) % 2
      , i = a.PI * 3 / 2
      , o = r * Qh;
    if (a.abs(o - Qh) < i) {
        let e = (o - Qh + i) / 3;
        return {
            up: r < 1,
            z: -3 * a.sin(e),
            lane: -3 * a.cos(e),
            p: r
        }
    }
    let s = o > 2 * Qh - i ? o - 2 * Qh : o;
    if (a.abs(s) < i) {
        let e = (s + i) / 3;
        return {
            up: r < 1,
            z: Qh + 3 * a.sin(e),
            lane: 3 * a.cos(e),
            p: r
        }
    }
    let c = (r < 1 ? 1 - r : r - 1) * Qh
      , l = e => i * (1 - J((e - i) / (50 - i)))
      , u = c - l(c) + l(Qh - c);
    return {
        up: r < 1,
        z: u,
        lane: r < 1 ? -3 : 3,
        p: r
    }
}
function M_(e) {
    let t = vg[0][1];
    for (let[n,r] of vg)
        e >= n && (t = r);
    return t
}
var N_ = 6.3
  , P_ = 4.2
  , F_ = o_ * .5
  , I_ = N_
  , L_ = N_ * 1.08
  , R_ = L_ * 1.4
  , z_ = 6.5
  , B_ = (e, t, n, r, i=28) => xg(e, t, t ? r ? i : 10 : z_, n)
  , V_ = 1.25
  , H_ = 1.5
  , U_ = 25 * a.PI / 180
  , W_ = 1 / 12
  , G_ = 35 * a.PI / 180
  , K_ = .7
  , q_ = .45
  , J_ = (e, t) => a.atan2(a.sin(e - t), a.cos(e - t))
  , Y_ = class e {
    constructor() {
        this.equipmentDetached = !1,
        this.collisions = null,
        this.collisionStart = new h,
        this.collisionEnd = new h,
        this.collisionVelocity = new h,
        this.collisionOffsets = [new h(0,.28,0), new h(0,.85,0), new h(0,1.47,0)],
        this.phase = `intro`,
        this.paused = !1,
        this.switchStance = !1,
        this.x = K(90),
        this.z = 90,
        this.y = Y(this.x, this.z),
        this.speed = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.carveTransfer = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.airTime = 0,
        this.maxAir = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.grabLedger = new Lt,
        this.scoreFactors = null,
        this.lastScoreFactors = null,
        this.spin = 0,
        this.flip = 0,
        this.grabTime = 0,
        this.trickScore = 0,
        this.score = 0,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.butter = new Pt,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.trick = ``,
        this.notice = ``,
        this.noticeTime = 0,
        this.elapsed = 0,
        this.liftTime = 0,
        this.liftClock = 0,
        this.runs = 0,
        this.crashes = 0,
        this.cabinIndex = 0,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.previousSteer = 0,
        this.corkSet = !1,
        this.railPitchHeld = 0,
        this.rollVelocity = 0,
        this.airRotation = new yn,
        this.airOrientation = this.airRotation.orientation,
        this.landingAssist = new Yi,
        this.airLevel = new Zi,
        this.groundTarget = new g,
        this.landingUp = new h,
        this.landingNormal = new h,
        this.stanceTurn = new g,
        this.landingSettling = !1,
        this.ragdoll = new gr(Y,Xh.snowWalls),
        this.crashDuration = 0,
        this.crashSeverity = 0,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.crashTime = 0,
        this.landing = 0,
        this.landingImpact = 0,
        this.landingBoost = 0,
        this.crouch = 0,
        this.grind = !1,
        this.jumpHeld = !1,
        this.charge = 0,
        this.topSpeed = 0,
        this.skid = 0,
        this.skidSide = 1,
        this.polePhase = 0,
        this.poling = 0,
        this.takeoffKick = 0,
        this.jumpDistance = 0,
        this.lastJumpDistance = 0,
        this.recoveryPushTime = 0,
        this.poleProgressZ = 35,
        this.event = ``,
        this.rail = null,
        this.railT = 0,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.barSave = null,
        this.railHops = [],
        this.railHopPoints = 0,
        this.railTarget = null,
        this.railSteer = 0,
        this.railPresses = 0,
        this.chain = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.airRepeatKey = ``,
        this.chainRepeatKeys = [],
        this.trickTally = new Map,
        this.repeat = 0,
        this.lost = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.board = !1,
        this.airSource = `jump`,
        this.airGrid = en
    }
    collideWithSnow() {
        if (!Xh.snowWalls || this.rail || this.crashTime > 0)
            return !1;
        let e = fr(Y, this.collisionStart, this) ?? (this.airborne && this.vy < 0 ? fr(Y, this, this) : null);
        if (!e)
            return !1;
        let t = a.hypot(this.velocityX, this.velocityZ)
          , n = a.max(0, -this.velocityX * e.nx - this.velocityZ * e.nz);
        this.x = e.x,
        this.z = e.z,
        this.airborne || (this.y = Y(this.x, this.z)),
        this.velocityX += e.nx * n,
        this.velocityZ += e.nz * n;
        let r = _r(n, t);
        return r === `fall` || r === `crash` ? (this.landingImpact = n,
        this.beginCrash(n, !1, r),
        !0) : (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && (this.landingSpin = q((e.nx * a.cos(this.heading) - e.nz * a.sin(this.heading)) * n / 16, -.8, .8),
        this.landingFlip = q(-(e.nx * a.sin(this.heading) + e.nz * a.cos(this.heading)) * n / 20, -.6, .6)),
        !1)
    }
    leaveSnowEdge(e) {
        if (!Xh.snowWalls)
            return;
        let t = pr(Y, this.collisionStart, this);
        if (!t)
            return;
        let n = a.hypot(this.velocityX, this.velocityZ);
        this.y = this.collisionStart.y;
        let r = a.cos(this.heading)
          , i = a.sin(this.heading)
          , o = j(t.dx * i + t.dz * r, this.spin, this.edge, new g, t.dx * r - t.dz * i);
        this.takeoff(t.grade * n, n, `ground`, o),
        this.takeoffKick = 0,
        this.railPitchHeld = Number(e.forward) | Number(e.brake) << 1,
        this.charge = 0
    }
    collideWithPark() {
        if (!this.collisions || this.rail || this.crashTime > 0)
            return !1;
        this.collisionEnd.set(this.x, this.y, this.z),
        this.collisionVelocity.set(this.velocityX, this.airborne ? this.vy : 0, this.velocityZ);
        let e = this.collisionVelocity.length()
          , t = this.airborne ? -1 : dg.findIndex(e => {
            let t = Kg(e, this.x, this.z)
              , n = Wg(e);
            return e.entry === `ride` && t.t >= -.7 / e.length && t.t < 0 && a.abs(t.side) < e.width / 2 + .1 && this.y >= Zg(e, 0) - .65 && this.velocityX * a.sin(n) + this.velocityZ * a.cos(n) > 0
        }
        )
          , n = this.collisions.move(this.collisionStart, this.collisionEnd, this.collisionVelocity, this.collisionOffsets, .27, t >= 0 ? `rail-${t}` : ``);
        if (!n.touched)
            return !1;
        this.x = this.collisionEnd.x,
        this.y = this.collisionEnd.y,
        this.z = this.collisionEnd.z,
        this.velocityX = this.collisionVelocity.x,
        this.velocityZ = this.collisionVelocity.z,
        this.airborne && (this.vy = this.collisionVelocity.y);
        let r = _r(n.impact, e);
        if (r === `fall` || r === `crash`)
            return this.landingImpact = n.impact,
            this.beginCrash(n.impact, !1, r),
            this.notice = `BAIL`,
            !0;
        if (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && !this.airborne) {
            let e = n.normal.x * a.cos(this.heading) - n.normal.z * a.sin(this.heading)
              , t = n.normal.x * a.sin(this.heading) + n.normal.z * a.cos(this.heading);
            this.landingSpin = q(e * n.impact / 16, -.8, .8),
            this.landingFlip = q(-t * n.impact / 20, -.6, .6)
        }
        return !1
    }
    get trickEvent() {
        let e = this.event;
        if (!e || e === `arrive`)
            return null;
        let t = e === `land` && !this.rail || e === `butter`;
        return {
            t: this.elapsed,
            kind: e,
            text: e === `crash` || t ? this.notice : this.chain.length ? this.trick : ``,
            score: e === `crash` ? this.lost : t ? this.lastScore : 0,
            impact: this.landingImpact
        }
    }
    toLobby() {
        this.butter.reset(),
        this.railPitchHeld = 0,
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `intro`,
        this.paused = !1,
        this.crashTime = 0,
        this.recovery = 0,
        this.airborne = !1,
        this.rail = null,
        this.grind = !1,
        this.x = K(90),
        this.z = 90,
        this.y = Y(this.x, this.z),
        this.speed = 0,
        this.vy = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.turnRate = 0,
        this.skid = 0,
        this.crouch = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spin = 0,
        this.flip = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.landingPrepare = 0,
        this.trick = ``,
        this.trickScore = 0,
        this.notice = ``,
        this.noticeTime = 0,
        this.liftTime = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.switchStance = !1,
        this.clearChain()
    }
    boardLift(e) {
        if (this.butter.reset(),
        !(this.phase !== `intro` && this.phase !== `finished`) && (this.phase = `gondola`,
        this.liftTime = 0,
        this.speed = 0,
        this.paused = !1,
        this.liftClock = e ?? 0,
        this.cabinIndex = 0,
        e !== void 0)) {
            let t = 1 / 0;
            for (let n = 0; n < 24; n++) {
                let r = j_(e, n);
                r.up && r.p < t && (t = r.p,
                this.cabinIndex = n)
            }
        }
    }
    arrive() {
        Object.assign(this, new e, {
            liftClock: this.liftClock,
            liftTime: this.liftTime,
            cabinIndex: this.cabinIndex,
            runs: this.runs,
            collisions: this.collisions
        }),
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `skiing`,
        this.z = 35,
        this.x = K(35),
        this.y = Y(this.x, 35),
        this.speed = 3,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = a.atan(tg(35)),
        this.travelHeading = this.heading,
        this.edge = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.elapsed = 0,
        this.score = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.crashes = 0,
        this.crashTime = 0,
        this.landingImpact = 0,
        this.landing = 0,
        this.landingBoost = 0,
        this.switchStance = !1,
        this.trick = ``,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.topSpeed = 0,
        this.spin = 0,
        this.flip = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.charge = 0,
        this.jumpHeld = !1,
        this.skid = 0,
        this.poling = 0,
        this.polePhase = 0,
        this.lastJumpDistance = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.trickTally.clear(),
        this.lost = 0,
        this.notice = `FIND YOUR LINE`,
        this.noticeTime = 3,
        this.event = `arrive`
    }
    fastTravel() {
        if (this.phase !== `gondola` || this.paused)
            return;
        let e = (1 - j_(this.liftClock, this.cabinIndex).p) * eg;
        this.liftClock += e,
        this.liftTime += e,
        this.arrive()
    }
    recover() {
        this.butter.reset(!0),
        this.lastScoreFactors = null,
        this.phase === `skiing` && (this.railPitchHeld = 0,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.x = K(this.z),
        this.y = Y(this.x, this.z),
        this.vy = 0,
        this.lateral = 0,
        this.speed = 5,
        this.airborne = !1,
        this.spin = 0,
        this.flip = 0,
        this.crashTime = 0,
        this.skid = 0,
        this.travelHeading = a.atan(tg(this.z)),
        this.heading = this.travelHeading,
        this.edge = 0,
        this.turnRate = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.notice = `BACK ON TRACK`,
        this.noticeTime = 2)
    }
    rideOutButter() {
        let e = Vg(this.x, this.z, this.heading);
        this.butter.release(this, j(e.slope, this.spin, this.edge, this.airOrientation, e.crossSlope)),
        this.flipTightness = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.spinWindup = 0;
        let t = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length
          , n = a.round(this.butter.entryPoints * ge(t));
        this.butter.entryPoints = 0,
        !(n <= 0) && (this.lastScore = n,
        this.score += n,
        this.runScore.tricks += n,
        this.trickTally.set(`BUTTER`, (this.trickTally.get(`BUTTER`) ?? 0) + 1),
        n > this.bestCombo && (this.bestCombo = n,
        this.bestTrick = this.butter.entry),
        this.notice = `STOMPED. ${this.butter.entry}`,
        this.noticeTime = 3,
        this.event = `butter`)
    }
    takeoff(e, t=this.speed, n=`jump`, r) {
        this.railPitchHeld = 0;
        let i = Vg(this.x, this.z, this.heading, this.grind)
          , o = this.landingSettling ? this.airOrientation.clone() : r ?? j(i.slope, this.spin, this.edge, new g, i.crossSlope)
          , s = this.butter.launch(this, o);
        this.speed = t,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.airborne = !0,
        this.vy = e + s.pop,
        this.airTime = 0,
        this.spin = 0,
        this.flip = 0,
        this.corkSet = !1,
        this.airRotation.reset(0, 0, o),
        this.rollVelocity = 0,
        this.landingAssist.reset(),
        this.landingSettling = !1,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.spinVelocity = s.spin,
        this.flipVelocity = s.flip,
        this.velocityZ = this.speed * a.cos(this.travelHeading),
        this.velocityX = this.speed * a.sin(this.travelHeading),
        this.grabTime = 0,
        this.grabLedger.reset(),
        this.scoreFactors = null,
        this.maxAir = 0,
        this.jumpDistance = 0,
        this.trickScore = this.projectChain(0, 0, 0, 0),
        this.trick = this.chainText(``),
        this.event = `jump`,
        this.takeoffKick = 1,
        this.airSource = n,
        this.airGrid = en,
        this.rail = null,
        this.grind = !1,
        this.lost = 0
    }
    mountRail(e, t, n, r=0) {
        this.butter.reset(),
        this.landingSettling = !1,
        this.landingAssist.reset();
        let i = Wg(e)
          , o = a.atan2(a.sin(this.travelHeading - i), a.cos(this.travelHeading - i))
          , s = a.atan2(a.sin(n - i), a.cos(n - i));
        this.spin = 0,
        this.spinTightness = 0,
        this.rail = e,
        this.railT = q(t, 0, 1),
        this.grind = !0,
        this.airborne = !1,
        this.vy = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.railHops = [],
        this.railHopPoints = 0,
        this.railSpinVelocity = r,
        this.railTarget = null,
        this.railPresses = 0,
        this.railSpin = s,
        this.railSpinTravel = 0,
        this.switchStance = !1,
        this.skid = 0,
        this.charge = 0,
        this.speed = a.max(9, this.speed * a.max(.35, a.cos(o))),
        this.travelHeading = this.heading = i,
        this.velocityX = this.speed * a.sin(i),
        this.velocityZ = this.speed * a.cos(i);
        let c = Gg(e, this.railT);
        this.x = c.x,
        this.z = c.z,
        this.y = Zg(e, this.railT)
    }
    chainText(e) {
        return [...this.chain, e].filter(Boolean).join(` → `)
    }
    railName() {
        return [this.railSwaps ? `RAIL ${this.railSwaps * 90}` : `RAIL SLIDE`, ...this.railHops].join(` + `)
    }
    barPoints() {
        return Oe(this.railTime, this.railSwaps) + this.railHopPoints
    }
    hopValue(e) {
        let t = this.airRotation.judge.result(!1, !0, tn).rotations;
        if (t < 90 || e.length >= 2)
            return null;
        let n = `HOP ${t}`
          , r = (this.trickTally.get(n) ?? 0) + this.chainRepeatKeys.filter(e => e === n).length;
        return {
            name: n,
            points: a.round(t / 90 * 450 * he(r))
        }
    }
    projectChain(e, t, n, r, i=0) {
        let o = _e(this.chainLinks + r);
        return this.chainButter + i + a.round((this.chainTricks + e) * o) + a.round((this.chainGrabs + t) * o) + a.round((this.chainRails + n) * o)
    }
    pushAirLink() {
        this.chainButter += this.butterPoints,
        this.butterPoints > 0 && this.chainRepeatKeys.push(`BUTTER`),
        this.butter.entryPoints = 0,
        this.chainTricks += a.round(this.airPoints * he(this.repeat)),
        this.chainGrabs += this.grabPoints,
        this.airName && this.chain.push(this.airName),
        this.airIsLink && this.airRepeatKey && this.chainRepeatKeys.push(this.airRepeatKey),
        this.airIsLink && this.chainLinks++,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    pushRailLink() {
        this.chainRails += this.barPoints(),
        this.chain.push(this.railName()),
        this.chainLinks++
    }
    clearChain() {
        this.scoreFactors = null,
        this.chain = [],
        this.chainRepeatKeys = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    judgeAir(e=!1, t=!1) {
        if (!e && this.barSave && Kg(this.barSave.r, this.x, this.z).t <= 1) {
            let e = this.hopValue(this.barSave.railHops)
              , t = this.chain.length - 1;
            this.trick = [...this.chain.slice(0, t), [this.chain[t], ...e ? [e.name] : []].join(` + `)].join(` → `),
            this.trickScore = this.projectChain(0, 0, e?.points ?? 0, 0);
            return
        }
        let n = t || this.velocityZ > .5 && (this.airSource !== `ground` || this.airTime >= 1.05 && this.maxAir >= 1.3)
          , r = this.airRotation.judge.result(this.switchStance, e, t ? tn : this.airGrid, this.board)
          , i = t ? `ON` : this.airSource === `rail` ? `OFF` : ``
          , o = r.name && i ? `${r.name} ${i}` : r.name
          , s = this.grabLedger.namesOn(this.board)
          , c = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length;
        this.butterPoints = a.round(this.butter.entryPoints * ge(c)),
        this.airName = [this.butterPoints > 0 ? this.butter.entry : ``, ...n ? [o, ...s] : []].filter(Boolean).join(` + `);
        let l = Ee({
            airTime: this.airTime,
            maxAir: this.maxAir,
            ...r,
            switchStance: this.switchStance
        });
        this.airRepeatKey = n ? (r.type && i ? `${r.type} ${i}` : r.type) || `STRAIGHT AIR` : ``,
        this.repeat = this.airRepeatKey ? (this.trickTally.get(this.airRepeatKey) ?? 0) + this.chainRepeatKeys.filter(e => e === this.airRepeatKey).length : 0,
        this.airPoints = n ? l.total : 0,
        this.grabPoints = n ? De(this.grabLedger.time, s.length, l.rotation, he(this.repeat), this.grabLedger.longest) : 0,
        this.airIsLink = n && (this.airTime >= .5 || o !== `` || s.length > 0),
        this.scoreFactors = n ? {
            turns: l.turns,
            grabs: s.length,
            grabMultiplier: Ce(s.length, this.grabLedger.longest),
            lineMultiplier: _e(this.chainLinks + +!!this.airIsLink),
            offAxis: r.offAxis,
            switchStance: this.switchStance,
            flips: l.flips
        } : null,
        this.trickScore = this.projectChain(a.round(this.airPoints * he(this.repeat)), this.grabPoints, 0, +!!this.airIsLink, this.butterPoints),
        this.trick = this.trickScore > 0 ? this.chainText(this.airName) : ``
    }
    landOnRail(e=!1) {
        let t = a.abs(this.flipVelocity) > .1;
        for (let n of dg) {
            let r = Kg(n, this.x, this.z)
              , i = r.t * n.length
              , o = n.entry === `pop`;
            if (i < (o ? -.45 : 0) || r.t > 1 || a.abs(r.side) > n.width / 2 + .5)
                continue;
            let s = Zg(n, r.t);
            if (e && (n.popLaunch === `ballistic` || n.popLaunch === `manual`) || (e ? !o || i > 3 || t || this.y > s + .1 || this.y < s - .35 : this.y > s + .05 || this.y < s - (o && i < 3 ? .35 : .75)))
                continue;
            if (this.airRotation.upright < .45)
                return this.landingImpact = a.max(2, -this.vy),
                this.beginCrash(this.landingImpact),
                !0;
            let c = this.heading + this.airRotation.landingYaw + (this.switchStance ? a.PI : 0);
            return this.barSave?.r === n ? (this.resumeBar(n, r.t, c),
            !0) : (this.judgeAir(!0, !0),
            this.pushAirLink(),
            this.landedJumps++,
            this.totalAirTime += this.airTime,
            this.lastJumpDistance = this.jumpDistance,
            this.landingImpact = 0,
            this.landing = .6,
            this.mountRail(n, r.t, c, this.spinVelocity),
            this.event = `land`,
            this.spin = 0,
            this.flip = 0,
            this.rollVelocity = 0,
            this.trick = this.chainText(this.railName()),
            this.trickScore = this.projectChain(0, 0, 0, 0),
            this.flipVelocity = 0,
            this.flipTightness = 0,
            this.spinVelocity = 0,
            this.spinTightness = 0,
            this.landingPrepare = 1,
            !0)
        }
        return !1
    }
    resumeBar(e, t, n) {
        let r = this.barSave;
        this.barSave = null,
        this.chain.pop(),
        this.chainLinks--,
        this.chainRails -= r.rails;
        let i = this.hopValue(r.railHops)
          , a = this.airTime;
        this.mountRail(e, t, n, this.spinVelocity),
        this.railTime = r.railTime + a,
        this.railPresses = r.railPresses,
        this.railSpinTravel = r.railSpinTravel,
        this.railSwaps = r.railSwaps,
        this.railHops = i ? [...r.railHops, i.name] : r.railHops,
        this.railHopPoints = r.railHopPoints + (i?.points ?? 0),
        i && this.chainRepeatKeys.push(i.name),
        this.landing = .3,
        this.landingImpact = 0,
        this.event = ``,
        this.spin = 0,
        this.flip = 0,
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipTightness = 0,
        this.spinVelocity = 0,
        this.spinTightness = 0,
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, this.barPoints(), 1)
    }
    shiftAcross(e, t) {
        let n = Wg(e);
        this.x += a.cos(n) * t,
        this.z -= a.sin(n) * t
    }
    funnelToRail(e, t) {
        for (let n of dg) {
            if (n.entry !== `ride`)
                continue;
            let r = Kg(n, this.x, this.z)
              , i = r.t * n.length
              , o = $g(n);
            if (i < -o || i >= 0 || a.abs(r.side) > 1.5)
                continue;
            let s = J_(this.travelHeading, Wg(n));
            if (a.abs(s) > U_ || this.speed < 4 || t.steer * a.sign(r.side) > .3)
                return;
            let c = J((i + o) / o);
            this.shiftAcross(n, -a.sign(r.side) * a.min(a.abs(r.side), W_ * c * this.speed * e)),
            this.travelHeading -= s * (1 - a.exp(-3 * c * e));
            return
        }
    }
    funnelInAir(e) {
        for (let t of dg) {
            let n = Kg(t, this.x, this.z)
              , r = n.t * t.length
              , i = t.entry === `pop` && r >= -i_(t) && r <= 3;
            if (n.t < -.02 && !i || n.t > 1 || a.abs(n.side) > 1)
                continue;
            let o = this.y - Zg(t, q(n.t, 0, 1));
            if (!(!i && (this.vy >= 0 || o < -.2 || o > -this.vy * .45)) && !(a.abs(J_(this.travelHeading, Wg(t))) > G_)) {
                this.shiftAcross(t, -a.sign(n.side) * a.min(a.abs(n.side), K_ * e));
                return
            }
        }
    }
    popOffKicker(e, t, n) {
        for (let n of dg) {
            if (n.entry !== `pop` || n.popLaunch === `manual` || this.speed < 5)
                continue;
            let r = Kg(n, this.x, this.z)
              , i = i_(n);
            if (Kg(n, e, t).t * n.length >= -i || r.t * n.length < -i || l_(n).height * J((3.2 - a.abs(r.side)) / 1.6) < .4)
                continue;
            let o = Wg(n)
              , s = Gg(n, -i / n.length)
              , c = {
                x: s.x + a.cos(o) * r.side,
                z: s.z - a.sin(o) * r.side
            }
              , l = a.hypot(this.velocityX, this.velocityZ)
              , u = l * a.max(.2, a.cos(J_(this.travelHeading, o)))
              , d = (Zg(n, .1) - Zg(n, 0)) / (.1 * n.length)
              , f = Y(c.x, c.z)
              , p = a.max(.3, -r.t * n.length)
              , m = Zg(n, 0) - d * p - f
              , h = p / a.max(u, 1)
              , _ = a.max(a.sqrt(2 * o_ * (m + n_)), (m - .1) / h + o_ * h / 2)
              , v = n.popLaunch === `ballistic`
              , y = (n.popAngle ?? 24) * a.PI / 180
              , b = v ? this.speed * a.cos(y) : l
              , x = v ? this.speed * a.sin(y) : _ + d * u;
            this.y = f,
            this.takeoff(x, b, `jump`, j(x / b, this.spin, this.edge, new g, 0)),
            this.charge = 0;
            return
        }
    }
    slide(e, t) {
        let n = this.rail
          , r = Wg(n);
        this.grind = !0,
        this.railTime += e;
        let i = q(this.railT, 0, 1)
          , o = a.max(0, i - .02)
          , s = a.min(1, i + .02)
          , c = (Zg(n, s) - Zg(n, o)) / ((s - o) * n.length);
        this.speed = a.max(9, this.speed - F_ * c / a.hypot(1, c) * e),
        this.railT += this.speed * e / n.length;
        let l = q(this.railT, 0, 1)
          , u = Gg(n, l);
        this.x = u.x,
        this.z = u.z,
        this.y = Zg(n, l),
        this.travelHeading = this.heading = r,
        this.velocityX = this.speed * a.sin(r),
        this.velocityZ = this.speed * a.cos(r),
        this.turnRate = 0,
        this.lateral = 0,
        this.skid = 0;
        let d = a.abs(t.steer) > .06 ? q(t.steer, -1, 1) : 0
          , f = a.sign(d);
        f && f !== this.railSteer && this.railPresses < 2 && (this.railPresses++,
        this.railTarget = (this.railTarget ?? a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2)) + f * a.PI / 2),
        this.railSteer = f;
        let p;
        if (this.railTarget !== null) {
            let t = this.railTarget - this.railSpin;
            p = a.sign(t) * a.min(a.abs(t), P_ * e),
            this.railSpinVelocity = p / e,
            a.abs(t - p) < 1e-6 && (this.railTarget = null,
            this.railSpinVelocity = 0)
        } else
            this.railSpinVelocity = xg(this.railSpinVelocity, 0, 1.65, e),
            p = this.railSpinVelocity * e;
        if (this.railSpin += p,
        this.railSpinTravel += a.abs(p),
        this.railTarget === null && a.abs(this.railSpinVelocity) < .45) {
            let t = a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2);
            this.railSpin = xg(this.railSpin, t, 4.8, e)
        }
        let m = a.floor((this.railSpinTravel + .12) / (a.PI / 2));
        m > this.railSwaps && (this.railSwaps = a.min(m, 2)),
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, this.barPoints(), 1),
        this.scoreFactors = {
            turns: 0,
            grabs: 0,
            grabMultiplier: 1,
            lineMultiplier: _e(this.chainLinks + 1),
            offAxis: !1,
            switchStance: !1
        },
        t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
        !t.jump && this.jumpHeld ? this.dismount(4.6 + this.charge * 3.4, !0, t) : this.railT >= 1 && this.dismount(.5, !1, t)
    }
    dismount(e, t, n) {
        let r = this.rail
          , i = this.railSpin
          , o = this.railSpinVelocity
          , s = q(this.railT, 0, 1)
          , c = .02
          , l = (Zg(r, a.min(1, s + c)) - Zg(r, a.max(0, s - c))) / ((a.min(1, s + c) - a.max(0, s - c)) * r.length);
        this.barSave = {
            r,
            railTime: this.railTime,
            railSwaps: this.railSwaps,
            railSpinTravel: this.railSpinTravel,
            railPresses: this.railPresses,
            railHops: this.railHops,
            railHopPoints: this.railHopPoints,
            rails: this.barPoints()
        },
        this.pushRailLink(),
        this.rail = null,
        this.grind = !1;
        let u = j(l, i, 0, new g);
        this.takeoff(this.speed * l + e, this.speed, `rail`, u),
        this.airGrid = a.abs(a.round(i / (a.PI / 2))) % 2 ? nn : en,
        this.airRotation.reset(0, i, u),
        this.spinVelocity = o,
        this.charge = 0,
        t || (this.event = `dismount`,
        this.railPitchHeld = Number(n.forward) | Number(n.brake) << 1)
    }
    faceplant() {
        Nt(this.airOrientation),
        this.beginCrash(this.landingImpact),
        this.notice = `FACEPLANT`
    }
    beginCrash(e, t=!1, n) {
        if (this.crashTime > 0)
            return;
        this.equipmentDetached = !1,
        this.lastScoreFactors = null,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.crashSeverity = q(n ? e / 42 * .8 + a.max(0, this.y - Y(this.x, this.z)) / 45 * .2 : this.speed / 43 * .35 + e / 42 * .45 + this.maxAir / 45 * .2, .12, 1);
        let r = n ? n === `fall` : !t && e < 16 && this.maxAir < 5.5 && this.speed < 27;
        this.crashDuration = r ? .8 + this.crashSeverity * .4 : 1.35 + this.crashSeverity * 1.35,
        this.crashTime = this.crashDuration,
        this.recovery = 0,
        this.ragdoll.start(this.x, this.y, this.z, this.heading, this.spin + (this.switchStance ? a.PI : 0), this.flip, this.velocityX, this.velocityZ, e, this.flipVelocity, this.spinVelocity, this.airOrientation, this.switchStance ? a.PI : 0, t, r),
        this.crashes++,
        this.airborne = !1,
        this.landing = 0,
        this.landingBoost = 0,
        this.event = `crash`,
        this.rail = null,
        this.grind = !1,
        this.lost = this.trickScore,
        this.notice = t ? `LANDED FLAT` : `BAIL`,
        this.noticeTime = this.crashDuration,
        this.trick = ``,
        this.trickScore = 0,
        this.clearChain()
    }
    updateCrash(e) {
        this.ragdoll.collisions = this.collisions,
        this.crashTime = a.max(0, this.crashTime - e),
        this.recovery = 1 - q(this.crashTime / (this.ragdoll.gentle ? .45 : .6), 0, 1),
        this.ragdoll.update(e, this.crashTime < (this.ragdoll.gentle ? .55 : .75)),
        this.equipmentDetached = this.crashTime > 0 && this.ragdoll.shedsEquipment;
        let t = this.ragdoll.nodes.Hips.p
          , n = q(t.z, -22, Qh)
          , r = q(t.x, K(n) - 123, K(n) + 123);
        this.ragdoll.translate(r - t.x, n - t.z),
        this.x = r,
        this.z = n,
        this.y = Y(r, n),
        this.velocityX = this.ragdoll.velocity.x,
        this.velocityZ = this.ragdoll.velocity.z,
        this.speed = a.min(43, a.hypot(this.velocityX, this.velocityZ)),
        this.speed > 1.5 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        this.crashTime === 0 && (this.speed = q(this.speed, 4, this.ragdoll.gentle ? 32 : 23),
        this.vy = 0,
        this.spin = 0,
        this.flip = 0,
        this.edge = 0,
        this.skid = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.switchStance = !1,
        this.heading = this.travelHeading,
        this.recovery = 0,
        this.crouch = .5,
        this.poling = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.polePhase = 0,
        this.recoveryPushTime = 6,
        this.velocityX = a.sin(this.travelHeading) * this.speed,
        this.velocityZ = a.cos(this.travelHeading) * this.speed,
        this.notice = `BACK ON YOUR FEET`,
        this.noticeTime = 2)
    }
    update(e, t) {
        if (this.board = !!t.board,
        this.event = ``,
        !this.airborne && !this.grind && (this.barSave = null),
        this.grind || (this.railSteer = a.abs(t.steer) > .06 ? a.sign(t.steer) : 0),
        this.crashTime <= 0 && (this.equipmentDetached = !1),
        this.paused)
            return;
        if (this.liftClock += e,
        this.noticeTime = a.max(0, this.noticeTime - e),
        this.landing = a.max(0, this.landing - e * 3.4),
        this.landingBoost = a.max(0, this.landingBoost - e),
        this.takeoffKick = a.max(0, this.takeoffKick - e * 4),
        this.phase === `gondola`) {
            this.liftTime += e,
            j_(this.liftClock, this.cabinIndex).p >= .999999999 && this.arrive();
            return
        }
        if (this.phase !== `skiing`)
            return;
        if (this.railPitchHeld &= Number(t.forward) | Number(t.brake) << 1,
        this.poleProgressZ = a.max(this.poleProgressZ, this.z),
        this.elapsed += e,
        this.crashTime > 0) {
            this.butter.reset(),
            this.updateCrash(e);
            return
        }
        this.recoveryPushTime = this.speed >= 18 ? 0 : a.max(0, this.recoveryPushTime - e);
        let n = this.airborne;
        this.landingSpin = xg(this.landingSpin, 0, 5, e),
        this.landingFlip = xg(this.landingFlip, 0, 5, e);
        let r = this.butter.step(this, t, e, !this.airborne && (t.butter || this.butter.active) ? Bg(this.x, this.z, this.travelHeading) : 0);
        this.butter.ready && !this.rail && this.rideOutButter();
        let i = !r && t.brake && !this.airborne && !this.rail;
        this.forwardHeld = !r && t.forward && !this.airborne && !this.rail && !i ? this.forwardHeld + e : 0,
        this.tucking = !r && t.forward && !this.airborne && !this.rail && !i && (this.switchStance || this.forwardHeld >= 1.25 || this.speed >= 18),
        this.crouch = xg(this.crouch, !this.airborne && (this.tucking || t.jump) ? 1 : 0, 9, e),
        a.abs(t.steer) > .15 && (this.skidSide = a.sign(t.steer)),
        this.skid = xg(this.skid, i ? this.skidSide * q(this.speed / 9, 0, 1) : 0, 7, e);
        let o = !r && a.abs(t.steer) > .05 ? q(t.steer, -1, 1) : 0;
        this.carveTransfer *= a.exp(-6 * e),
        !this.airborne && !i && this.previousSteer * o < 0 && (this.carveTransfer = a.abs(this.edge) * q(this.speed / 18, 0, 1)),
        this.previousSteer = this.airborne || !o && a.abs(this.edge) < .1 ? 0 : o || this.previousSteer;
        let s = q(13 / a.max(this.speed, 1), .45, 1)
          , l = o ? (11 + this.carveTransfer * 11) * s : 9
          , u = J((1 - this.landing) / .68);
        this.edge = xg(this.edge, !this.airborne && !this.rail ? o * u : 0, l, e);
        let d = !r && t.forward && !this.switchStance && !this.tucking && !this.airborne && !this.rail && !i && !t.jump;
        if (this.poling = xg(this.poling, +!!d, 12, e),
        this.airborne)
            this.velocityX *= a.exp(-.003 * e),
            this.velocityZ *= a.exp(-.003 * e),
            this.speed = a.hypot(this.velocityX, this.velocityZ),
            this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
            this.turnRate = 0,
            this.lateral = 0;
        else {
            this.landingSettling && !this.rail && !r && (this.spinVelocity += (-100 * this.spin - 20 * this.spinVelocity) * e,
            this.spin += this.spinVelocity * e),
            r || (this.spinWindup = xg(this.spinWindup, 0, 10, e),
            this.spinTightness = xg(this.spinTightness, 0, 14, e)),
            this.landingPrepare = this.butter.active ? -1 : 0;
            let t = ig(this.x, this.z) > 24 && b_(this.x, this.z) < .5
              , n = this.edge * (.8 + q(this.speed / 85, 0, .44)) * (1 + this.carveTransfer * .14) * (i ? .7 : 1);
            this.turnRate = this.rail ? 0 : n,
            this.travelHeading += this.turnRate * e,
            r && (this.travelHeading += At(Bg(this.x, this.z, this.travelHeading + a.PI / 2), this.speed, 9.81 * 1.7) * e);
            let o = Bg(this.x, this.z, this.travelHeading);
            if (Xh.snowWalls && o < -1) {
                let e = {
                    x: this.x + a.sin(this.travelHeading) * .5,
                    y: this.y,
                    z: this.z + a.cos(this.travelHeading) * .5
                }
                  , t = pr(Y, this, e);
                t && (o = t.grade)
            }
            let s = -o
              , c = (this.tucking ? .0024 : .0028) * (t ? 1.38 : 1)
              , l = 9.81 * a.sin(a.atan(s)) * 1.7 - .13 - c * this.speed * this.speed - a.abs(this.edge) * .38;
            if (this.rail || (this.speed = q(this.speed + (l - (i ? 17 : 0)) * e, 0, 43)),
            d) {
                let t = this.polePhase;
                if (this.polePhase = (this.polePhase + e / .95) % 1,
                t < .34 && this.polePhase >= .34) {
                    let e = a.cos(this.travelHeading) < 0 ? 1 - J((this.poleProgressZ - this.z - 8) / 8) : 1;
                    this.speed = a.min(43, this.speed + e * 1.65 * q(1 - this.speed / 52, .25, 1)),
                    this.recoveryPushTime > 0 && (this.speed += e * a.min(3, a.max(0, 13 - this.speed))),
                    this.recoveryPushTime = 0
                }
            } else
                this.poling < .02 && (this.polePhase = 0);
            let u = this.skid * this.speed * .1
              , f = this.speed / a.hypot(1, o);
            this.velocityZ = f * a.cos(this.travelHeading) - u * a.sin(this.travelHeading),
            this.velocityX = f * a.sin(this.travelHeading) + u * a.cos(this.travelHeading),
            this.lateral = this.edge * this.speed * .35 + u
        }
        this.topSpeed = a.max(this.topSpeed, this.speed * 3.6);
        let p = a.atan2(a.sin(this.travelHeading + this.skid * .72 - this.heading), a.cos(this.travelHeading + this.skid * .72 - this.heading));
        this.heading += p * (1 - a.exp(-12 * e));
        let m = this.x
          , h = this.z;
        this.collisionStart.set(this.x, this.y, this.z),
        this.x += this.velocityX * e,
        this.z += this.velocityZ * e,
        this.z = a.max(-22, this.z);
        let _ = K(this.z);
        if (a.abs(this.x - _) > 126) {
            let t = a.sign(this.x - _);
            this.x = _ + t * 126;
            let n = this.velocityX - tg(this.z) * this.velocityZ;
            t * n > 0 && (this.velocityX -= n,
            this.speed *= a.exp(-e * 2.8))
        }
        if (!this.airborne && !this.rail && this.funnelToRail(e, t),
        !(!this.airborne && this.collideWithSnow())) {
            if (!this.airborne && !this.rail)
                for (let e of dg) {
                    let t = Kg(e, this.x, this.z);
                    if (t.t >= 0 && t.t <= 1 && a.abs(t.side) < e.width / 2 + .35 && this.y >= Zg(e, t.t) - .4) {
                        this.mountRail(e, t.t, this.heading + this.spin + (this.switchStance ? a.PI : 0), this.spinVelocity);
                        break
                    }
                }
            if (this.rail)
                this.slide(e, t);
            else if (!this.airborne) {
                for (let e of og)
                    if (h <= e.z && this.z > e.z && a.abs(this.x - K(this.z) - e.offset) < e.width / 2 + 1 && this.speed > 7) {
                        let t = K(this.z) + e.offset
                          , n = a.max(t - e.width / 2 + .6, a.min(t + e.width / 2 - .6, this.x));
                        if (this.y < Y(n, e.z - .01) - 1)
                            continue;
                        let r = jg(e, this.speed, this.charge, this.travelHeading)
                          , i = Vg(n, e.z - .01, this.heading)
                          , o = j(i.slope, this.spin, this.edge, new g, i.crossSlope);
                        this.y = Y(this.x, e.z - .01),
                        this.takeoff(r.vertical, r.horizontal, `jump`, o),
                        this.velocityX += e.transfer * .22,
                        this.charge = 0;
                        break
                    }
                if (this.airborne || this.popOffKicker(m, h, t),
                this.airborne || this.leaveSnowEdge(t),
                !this.airborne && (this.y = Y(this.x, this.z),
                t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
                !t.jump && this.jumpHeld)) {
                    let e = Lg(this.x, this.z, this.velocityX, this.velocityZ, this.charge);
                    this.takeoff(e.vertical, a.hypot(e.velocityX, e.velocityZ), `ground`),
                    this.velocityX = e.velocityX,
                    this.velocityZ = e.velocityZ,
                    this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
                    this.charge = 0
                }
            }
            if (!(!this.airborne && this.collideWithPark())) {
                if (this.airborne) {
                    let r = !n;
                    if (r || (this.vy -= o_ * e,
                    this.y += this.vy * e,
                    this.airTime += e,
                    this.jumpDistance += a.hypot(this.velocityX, this.velocityZ) * e),
                    this.collideWithSnow())
                        return;
                    if (!r) {
                        let e = cr(Y, og, this.collisionStart, this);
                        e && (this.x = e.x,
                        this.y = e.y,
                        this.z = e.z)
                    }
                    let i = Y(this.x, this.z)
                      , o = this.y <= i ? Vg(this.x, this.z, 0) : null
                      , s = o ? o.slope : Y(this.x, this.z + .5) - Y(this.x, this.z - .5)
                      , c = o ? o.crossSlope : Y(this.x + .5, this.z) - Y(this.x - .5, this.z)
                      , l = s * this.velocityZ + c * this.velocityX
                      , u = l - this.vy
                      , d = u > .1 ? a.max(0, this.y - i) / u : 1 / 0;
                    this.landingPrepare = xg(a.max(0, this.landingPrepare), 1 - J((d - .1) / .45), 14, e);
                    let f = a.abs(t.steer) > .06 ? q(t.steer, -1, 1) : 0
                      , p = Number(t.forward && !(this.railPitchHeld & 1)) - Number(t.brake && !(this.railPitchHeld & 2));
                    this.airRotation.controlPitch(p, this.switchStance && !t.board, this.flipVelocity, this.rollVelocity);
                    let m = a.abs(t.airRoll ?? 0) > .06 ? q(t.airRoll ?? 0, -1, 1) : 0;
                    this.spinTightness = xg(this.spinTightness, a.abs(f), f ? 12 : 10, e),
                    this.airGrab = xg(this.airGrab, +!!t.grab, 12, e);
                    let h = bg(N_, bg(L_, R_, this.airGrab), this.spinTightness)
                      , g = f * h
                      , _ = p * h;
                    this.spinReversal = f * this.spinVelocity < 0 ? .12 : a.max(0, this.spinReversal - e),
                    (!p || a.sign(p) !== this.flipReversal) && (this.flipReversal = 0),
                    p * this.flipVelocity < -.12 && (this.flipReversal = a.sign(p)),
                    a.abs(_ - this.flipVelocity) < h * .05 && (this.flipReversal = 0),
                    this.spinVelocity = B_(this.spinVelocity, g, e, this.spinReversal > 0 || this.flipReversal !== 0, this.flipReversal ? 3.2 : 28),
                    this.flipVelocity = B_(this.flipVelocity, _, e, this.flipReversal !== 0, 3.2),
                    this.rollVelocity = B_(this.rollVelocity, m * h, e, m * this.rollVelocity < 0, 5),
                    this.flipReversal && (this.spinVelocity = a.sign(this.spinVelocity) * a.min(a.abs(this.spinVelocity), a.abs(this.flipVelocity)));
                    let v = this.flipReversal ? q(this.spinVelocity / h, -1, 1) : f;
                    this.spinWindup = xg(this.spinWindup, v, f ? 17 : 8, e);
                    let y = this.flipReversal ? q(this.flipVelocity / h, -1, 1) : p;
                    this.flipWindup = xg(this.flipWindup, y, p ? 24 : 9, e),
                    this.flipTightness = xg(this.flipTightness, a.abs(y), p ? 14 : 10, e),
                    !p && a.abs(this.flipVelocity) < .015 && (this.flipVelocity = 0),
                    !f && a.abs(this.spinVelocity) < .015 && (this.spinVelocity = 0),
                    this.spin += this.spinVelocity * e,
                    this.flip += this.flipVelocity * e,
                    !m && a.abs(this.rollVelocity) < .015 && (this.rollVelocity = 0),
                    t.cork && this.airTime <= .25 && (this.corkSet = !0);
                    let b = !!t.cork && this.corkSet;
                    this.airRotation.update(this.flipVelocity, this.spinVelocity, e, b, this.rollVelocity, !!t.over && b);
                    let x = !!(f || p || m || t.grab)
                      , S = c * a.sin(this.heading) + s * a.cos(this.heading)
                      , C = !x && dg.some(e => {
                        for (let t of [0, .25, .5, .75]) {
                            let n = Kg(e, this.x + this.velocityX * t, this.z + this.velocityZ * t);
                            if (n.t >= 0 && n.t <= 1 && a.abs(n.side) < e.width / 2 + .7 && this.y >= Zg(e, n.t) - .1)
                                return !0
                        }
                        return !1
                    }
                    )
                      , w = a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 ? this.spinVelocity / z_ : 0
                      , T = this.airRotation.upright > .64 && a.abs(this.airRotation.flipAngle) < .5 && this.airRotation.inversions === 0 && !this.airRotation.corked && !p && !m && !t.cork && a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 && !C
                      , ee = t.grab && T
                      , te = !!(f || p || m)
                      , E = this.landingAssist.update(e, this.airOrientation, this.airRotation.landingYaw, C ? 0 : S, d, this.airRotation.speed, te || t.grab && !ee || this.airTime < .22 && this.vy > 0, C, C ? 0 : c * a.cos(this.heading) - s * a.sin(this.heading), w, ee);
                    if (this.airRotation.correct(E),
                    T && (a.abs(this.spinVelocity) > .5 || f) && E.x === 0 && E.y === 0 && E.z === 0) {
                        let t = Number.isFinite(d) ? a.max(0, a.min(1, (1.5 - d) / 1.2)) : 0;
                        this.airRotation.correct(this.airLevel.update(e, this.airOrientation, this.airRotation.landingYaw, this.airTime, C ? 0 : S, C ? 0 : c * a.cos(this.heading) - s * a.sin(this.heading), t))
                    }
                    t.grab && (this.grabTime += e),
                    this.grabLedger.update(e, t.grab, t.grabStyle ?? 0, !!t.board),
                    this.maxAir = a.max(this.maxAir, this.y - Y(this.x, this.z)),
                    this.judgeAir(),
                    r || this.funnelInAir(e);
                    let ne = !r && this.landOnRail(this.vy >= 0);
                    if (!ne && this.collideWithPark())
                        return;
                    if (!ne && !r && this.y <= i) {
                        this.landingImpact = a.max(0, l - this.vy) / a.hypot(1, c, s),
                        this.y = i,
                        this.airborne = !1,
                        this.landing = 1,
                        this.lastJumpDistance = this.jumpDistance;
                        let e = this.airRotation.landingYaw
                          , t = a.abs(a.sin(e));
                        this.landingNormal.set(-c * a.cos(this.heading) + s * a.sin(this.heading), 1, -c * a.sin(this.heading) - s * a.cos(this.heading)).normalize();
                        let n = this.landingUp.set(0, 1, 0).applyQuaternion(this.airOrientation).dot(this.landingNormal)
                          , r = a.acos(q(n, -1, 1))
                          , o = !this.butter.catchLanding(this, this.airOrientation, this.landingNormal) && n < .25 && (n < 0 || this.landingImpact > 3 || this.airTime > .3)
                          , u = this.landingImpact > 33 && this.airTime > .35
                          , d = o || u ? null : this.butter.landingFor(this)
                          , f = !o && !u && d !== `faceplant`
                          , p = !1;
                        if (f) {
                            this.judgeAir(!0),
                            this.lastScoreFactors = this.scoreFactors;
                            let n = a.round((e + w) / a.PI);
                            a.abs(n) % 2 == 1 && (this.switchStance = !this.switchStance,
                            this.airOrientation.multiply(this.stanceTurn.set(0, 1, 0, 0)));
                            let i = t >= .3 || Cn(this.airOrientation, this.landingNormal)
                              , o = !i && this.airTime > .65
                              , s = o && this.speed > 3 && this.velocityZ > .5 && l < -.15
                              , c = a.max(0, (this.speed * this.speed + this.vy * l) / (a.hypot(this.speed, l) || 1));
                            this.speed = q(c * (o ? 1 : .975 - t * .065 - q(r, 0, 1) * .045) + (s ? 2.6 : 0), 0, 43),
                            this.landingBoost = s ? 2.2 : 0,
                            this.pushAirLink();
                            let u = _e(this.chainLinks)
                              , f = i ? pe(t) : 1;
                            f < 1 && this.lastScoreFactors && (this.lastScoreFactors = {
                                ...this.lastScoreFactors,
                                landing: f
                            });
                            let m = a.round(a.round(this.chainTricks * u) * f) + this.chainButter
                              , h = a.round(this.chainGrabs * u * f)
                              , g = a.round(this.chainRails * u * f)
                              , _ = o && this.chainLinks > 0 ? 450 + a.round((m - this.chainButter + h + g) * de) : 0;
                            this.lastScore = m + h + g + _,
                            this.score += this.lastScore,
                            this.runScore.tricks += m,
                            this.runScore.grabs += h,
                            this.runScore.rails += g,
                            this.runScore.landings += _;
                            for (let e of this.chainRepeatKeys)
                                this.trickTally.set(e, (this.trickTally.get(e) ?? 0) + 1);
                            let v = this.chain.join(` → `);
                            this.landedJumps++,
                            this.cleanLandings += Number(o),
                            this.totalAirTime += this.airTime,
                            this.lastScore > this.bestCombo && (this.bestCombo = this.lastScore,
                            this.bestTrick = v || `STRAIGHT AIR`),
                            this.landingSpin = J_(e, n * a.PI),
                            this.landingFlip = r * (a.sign(this.landingUp.z) || 1),
                            p = d === `press` && this.butter.pressLanding(this, this.landingImpact),
                            this.spin = this.landingSpin,
                            this.spinVelocity = p ? this.butter.velocity : q(this.spinVelocity, -3, 3),
                            this.landingSettling = !p,
                            this.notice = this.lastScore > 0 ? v ? `${i ? `SAVED IT` : `STOMPED`}. ${v}` : o ? `CLEAN LANDING` : `` : ``,
                            this.noticeTime = this.notice ? 3 : 0,
                            this.event = `land`,
                            this.clearChain()
                        } else
                            d === `faceplant` ? this.faceplant() : this.beginCrash(this.landingImpact, u && !o);
                        this.vy = 0,
                        this.flip = 0,
                        this.trick = ``,
                        this.rollVelocity = 0,
                        this.flipVelocity = 0,
                        this.flipTightness = 0,
                        this.spinTightness = 0,
                        this.landingPrepare = 1,
                        p && this.butter.pose(this)
                    }
                }
                if (!this.airborne && !n && this.landingSettling && !this.grind && this.crashTime <= 0) {
                    j(Bg(this.x, this.z, this.heading), this.spin, this.edge, this.groundTarget, Bg(this.x, this.z, this.heading + a.PI / 2));
                    let t = f(this.airOrientation, this.groundTarget);
                    c(this.airOrientation, this.groundTarget, a.min(8 * e, t * (1 - a.exp(-18 * e)))),
                    t < .035 && a.abs(this.spin) < .002 && a.abs(this.spinVelocity) < .02 && (this.landingSettling = !1,
                    this.spin = 0,
                    this.spinVelocity = 0)
                }
                this.jumpHeld = t.jump,
                this.z >= $h && this.crashTime <= 0 && (this.z = $h,
                this.phase = `finished`,
                this.speed = 0,
                this.runs++)
            }
        }
    }
}
  , X_ = 2.2
  , Z_ = .65
  , Q_ = e => -32 - 39 * a.max(0, a.min(1, e / 730))
  , $_ = {
    snowWalls: !0,
    maxSpeed: 52
}
  , ev = e => 0
  , tv = e => 0
  , nv = (e, t) => a.abs(e)
  , rv = []
  , iv = (e, t) => 0
  , av = [[0, 0], [46, 0], [100, .92], [210, .92], [254, 0], [346, 0], [390, 1], [510, 1], [600, .14], [630, 0], [730, 0]]
  , ov = [0];
for (let e = 1; e < av.length; e++) {
    let t = av[e - 1]
      , n = av[e];
    ov.push(ov[e - 1] + (n[0] - t[0]) * (t[1] + n[1]) / 2)
}
function X(e) {
    let t = a.max(0, a.min(730, e))
      , n = 0;
    for (; n + 2 < av.length && t > av[n + 1][0]; )
        n++;
    let r = av[n]
      , i = av[n + 1]
      , o = i[0] - r[0]
      , s = (t - r[0]) / o;
    return 1020 - ov[n] - o * (r[1] * s + (i[1] - r[1]) * (a.pow(s, 3) - a.pow(s, 4) / 2))
}
function sv(e, t) {
    let n = a.max(0, a.min(1, (a.abs(e) - 84) / 100));
    return 30 * n * n * (3 - 2 * n) * a.exp(-a.pow((t - 355) / 540, 2))
}
function cv(e, t, n) {
    let r = e => {
        let t = a.max(0, a.min(1, e));
        return t * t * (3 - 2 * t)
    }
      , i = r((t - 600) / 40) * (1 - r((a.abs(e) - 96) / 36)) * (1 - r((t - 730 - 20) / 60));
    return n + (X(t) - n) * i
}
var lv = 294
  , uv = 40
  , dv = 4
  , fv = 28
  , pv = vr(uv, dv, fv, X(lv - uv + .5) - X(lv - uv - .5))
  , mv = X(lv - uv) + pv.rise - X(lv)
  , hv = [{
    name: `BIG AIR`,
    z: lv,
    run: uv,
    height: mv,
    width: 26,
    lipAngle: fv,
    lipLength: dv,
    table: 52,
    landing: 264,
    landingRise: -mv,
    offset: 0,
    transfer: 0,
    main: !0,
    kind: `kicker`,
    kick: `high`,
    approach: 64,
    mound: {
        height: 0,
        shoulder: 0,
        wall: 1
    }
}]
  , gv = []
  , _v = []
  , vv = []
  , yv = (e, t) => ev(t)
  , bv = []
  , xv = []
  , Sv = []
  , Cv = [[0, `BIG AIR / DROP IN`], [75, `STRAIGHT DOWN`], [254, `BIG AIR`], [346, `LANDING`], [610, `RUNOUT / BRAKE`], [630, `FINISH PLAZA`]]
  , wv = e({
    AIR_ANGLE: () => Xy,
    AIR_GRAVITY: () => dy,
    AIR_RATE: () => Zy,
    AIR_REACH: () => 1,
    AIR_WINDOW: () => Qy,
    BRANCHES: () => rv,
    COURSE_LENGTH: () => 730,
    COURSE_WIDTH: () => 260,
    FINISH_HALF_WIDTH: () => 58,
    FINISH_Z: () => 650,
    FLAT_SLAM: () => 33,
    FLIP_RATE: () => Vy,
    FORWARD_TUCK_SPEED: () => 18,
    FORWARD_TUCK_TIME: () => Ky,
    FUNNEL_ANGLE: () => Jy,
    FUNNEL_PULL: () => Yy,
    FUNNEL_REACH: () => qy,
    GRAB_SPIN_RATE: () => Uy,
    JIB_PLATFORMS: () => vv,
    JIB_SECTIONS: () => _v,
    JUMPS: () => hv,
    KICKER_BACK: () => vy,
    LIFT_DURATION: () => 146,
    LIFT_SPEED: () => 5,
    LIFT_TOWER_SPACING: () => 60,
    PARK_BANKS: () => Sv,
    PARK_ENTRY_Z: () => 44,
    POP_CATCH: () => cy,
    POP_CLEAR: () => sy,
    POP_CLIMB: () => Lv,
    POP_GAP: () => ay,
    POP_KICK: () => 24,
    POP_STEP: () => oy,
    RAILS: () => gv,
    RAIL_HOPS: () => 2,
    RAIL_LIP: () => ry,
    RAIL_PULL: () => By,
    RAIL_SPIN_RATE: () => zy,
    RAIL_SWAPS: () => 2,
    ROLLERS: () => bv,
    SNOW_FORMS: () => xv,
    SPIN_RATE: () => Ry,
    SPIN_TURN_RATE: () => Hy,
    SkiSimulation: () => eb,
    UP_RUN: () => 3,
    UP_START: () => $v,
    ZONES: () => Cv,
    baseHeight: () => X,
    branchOffset: () => iv,
    cabinTravel: () => Iy,
    center: () => ev,
    clamp: () => Z,
    climbsOut: () => ey,
    courseTangent: () => tv,
    damp: () => Ev,
    groundHeight: () => Ey,
    groundLaunch: () => Hv,
    groundPop: () => Uv,
    jibGrooming: () => gy,
    jibLips: () => hy,
    jibSectionCenter: () => yv,
    jibTerraces: () => Cy,
    jumpCenter: () => Fv,
    jumpStyle: () => Nv,
    lerp: () => Tv,
    liftX: () => Fy,
    lineDistance: () => nv,
    mountainHeight: () => Py,
    mountainShoulder: () => sv,
    onKickerWall: () => zv,
    parkBanks: () => wy,
    parkGrooming: () => Ty,
    popLine: () => uy,
    railCrest: () => fy,
    railFrame: () => Zv,
    railHeading: () => Yv,
    railLipRun: () => iy,
    railPoint: () => Xv,
    railPopGap: () => ly,
    railTop: () => ny,
    rampHeight: () => xy,
    rampLaunch: () => Iv,
    riderSurface: () => Kv,
    sculptedSnow: () => Sy,
    snowGrade: () => Gv,
    snowSurface: () => Dy,
    terrainHeight: () => $,
    zoneAt: () => Ly
})
  , Z = (e, t, n) => a.max(t, a.min(n, e))
  , Tv = (e, t, n) => e + (t - e) * n
  , Ev = (e, t, n, r) => Tv(e, t, 1 - a.exp(-n * r))
  , Dv = e => {
    let t = Z(e, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10)
}
  , Q = e => {
    let t = Z(e, 0, 1);
    return t * t * (3 - 2 * t)
}
  , Ov = ev(44)
  , kv = a.atan(tv(44))
  , Av = a.cos(kv)
  , jv = a.sin(kv)
  , Mv = X(36)
  , Nv = e => e.kick === `high` ? `HIGH KICK` : e.kind === `step-up` ? `STEP UP` : e.kind === `hip` ? `HIP` : `FLOW`
  , Pv = new Map;
function Fv(e, t) {
    let n = Pv.get(e);
    (!n || !Object.is(n.z, e.z)) && Pv.set(e, n = {
        z: e.z,
        x: ev(e.z),
        tangent: tv(e.z)
    });
    let r = a.max(0, t - e.z)
      , i = n.x + n.tangent * r;
    return Tv(ev(t), i, Q(r / e.table)) + e.offset + e.transfer * Z(r / 65, 0, 1)
}
function Iv(e, t, n, r=0) {
    let i = a.atan(a.tan(e.lipAngle * a.PI / 180) * a.max(.2, a.cos(r)))
      , o = 1.2 + Z(n, 0, 1) * 2.2;
    return {
        horizontal: t * a.cos(i) - o * a.sin(i),
        vertical: t * a.sin(i) + o * a.cos(i)
    }
}
var Lv = a.tan(12 * a.PI / 180)
  , Rv = (e, t) => hv.some(n => {
    if (t < n.z - n.run || t > n.z + 1)
        return !1;
    let r = Fv(n, t)
      , i = a.abs(e - r) - n.width / 2;
    return i >= 0 && i < 1.5 && $(e, t) < $(r + a.sign(e - r) * (n.width / 2 - .6), t) - 1
}
)
  , zv = (e, t) => {
    let n = !1;
    for (let r of hv) {
        let i = t - r.z
          , o = r.mound;
        if (i < -r.run || i > r.table + r.landing)
            continue;
        let s = o?.shoulder ?? 3
          , c = a.abs(e - Fv(r, t)) - r.width / 2;
        if (c <= (o?.height ? s - 1 : 1))
            return !1;
        n ||= !!o?.height && c < s + (o.wall ?? 4) + 1
    }
    return n
}
  , Bv = a.tan(60 * a.PI / 180);
function Vv(e, t, n, r) {
    for (let i = 1; i <= 5; i++) {
        let a = ur($, e + n * i / 10, t + r * i / 10);
        if (a.length >= Bv && a.dx * n + a.dz * r > 0)
            return !0
    }
    return !1
}
function Hv(e, t, n, r, i) {
    let {slope: o, crossSlope: s} = Kv(e, t, 0)
      , c = hv.some(n => t >= n.z - n.run && t <= n.z && a.abs(e - Fv(n, t)) < n.width / 2);
    if (!c) {
        let n = $(e, t);
        Vv(e, t, 1, 0) ? s = (n - $(e - .5, t)) / .5 : Vv(e, t, -1, 0) && (s = ($(e + .5, t) - n) / .5),
        Vv(e, t, 0, 1) ? o = (n - $(e, t - .5)) / .5 : Vv(e, t, 0, -1) && (o = ($(e, t + .5) - n) / .5)
    }
    let l = (c ? 1.2 + Z(i, 0, 1) * 2.2 : 3.6 + Z(i, 0, 1) * 2.6) / a.hypot(s, 1, o)
      , u = s * n + o * r
      , d = a.hypot(n, r) * Lv;
    return {
        velocityX: n - s * l,
        velocityZ: r - o * l,
        vertical: (u > d && (Rv(e, t) || zv(e, t)) ? d : u) + l
    }
}
var Uv = (e, t, n, r, i) => Hv(e, t, n, r, i).vertical;
function Wv(e, t, n) {
    let r = Fv(e, n)
      , i = a.max(.6, e.width / 2 - .05)
      , o = a.max(r - i, a.min(r + i - 1, t - .5));
    return $(o + 1, n) - $(o, n)
}
function Gv(e, t, n) {
    for (let r of hv)
        if (t <= r.z && t >= r.z - r.lipLength + .5 && a.abs(e - Fv(r, t)) < r.width / 2)
            return Wv(r, e, t) * a.sin(n) + a.tan(r.lipAngle * a.PI / 180) * a.cos(n);
    let r = a.sin(n) * .5
      , i = a.cos(n) * .5;
    return $(e + r, t + i) - $(e - r, t - i)
}
function Kv(e, t, n, r=!1) {
    let i = $(e + .5, t) - $(e - .5, t)
      , o = $(e, t + .5) - $(e, t - .5)
      , s = 0;
    for (let n of hv)
        if (t <= n.z && t > n.z - n.lipLength - 3 && a.abs(e - Fv(n, t)) < n.width / 2) {
            s = Q((t - n.z + n.lipLength + 3) / 3),
            i = Wv(n, e, t),
            t >= n.z - n.lipLength + .5 && (o = a.tan(n.lipAngle * a.PI / 180));
            break
        }
    if (r)
        for (let n of gv) {
            let r = Zv(n, e, t);
            if (r.t >= 0 && r.t <= 1 && a.abs(r.side) < .8) {
                let e = a.max(0, r.t - .01)
                  , t = a.min(1, r.t + .01)
                  , s = Yv(n)
                  , c = (ny(n, t) - ny(n, e)) / ((t - e) * n.length);
                i = a.sin(s) * c,
                o = a.cos(s) * c;
                break
            }
        }
    return {
        slope: i * a.sin(n) + o * a.cos(n),
        crossSlope: i * a.cos(n) - o * a.sin(n),
        lip: s
    }
}
var qv = new WeakMap;
function Jv(e) {
    let t = qv.get(e);
    if (!t) {
        let n = a.atan(tv(e.z)) + e.angle * a.PI / 180;
        t = {
            h: n,
            sin: a.sin(n),
            cos: a.cos(n),
            c: ev(e.z)
        },
        qv.set(e, t)
    }
    return t
}
var Yv = e => Jv(e).h;
function Xv(e, t) {
    let n = Jv(e);
    return {
        x: n.c + e.offset + n.sin * e.length * t,
        z: e.z + n.cos * e.length * t
    }
}
function Zv(e, t, n) {
    let r = Jv(e)
      , i = t - r.c - e.offset
      , a = n - e.z;
    return {
        t: (i * r.sin + a * r.cos) / e.length,
        side: i * r.cos - a * r.sin
    }
}
var Qv = {
    flat: () => 0,
    kink: e => e < .3 ? .65 * Q(e / .3) : e < .62 ? .65 : .65 * (1 - Q((e - .62) / .38)),
    down: e => .35 - .6 * e,
    "down-flat-down": e => e < .28 ? .36 * (1 - Q(e / .28)) : e < .64 ? 0 : -.25 * Q((e - .64) / .36),
    rainbow: e => 1.5 * a.sin(a.PI * e),
    cannon: e => 1.9 * a.pow(Q((e - .55) / .45), 1.3)
}
  , $v = .5
  , ey = e => e.entry === `ride` && e.profile !== `rainbow`
  , ty = (e, t) => ey(e) ? -$v * (1 - Q(t * e.length / 3)) : 0;
function ny(e, t) {
    let n = Xv(e, 0)
      , r = Xv(e, 1)
      , i = Z(t, 0, 1);
    return Tv(Ey(n.x, n.z), Ey(r.x, r.z), i) + e.height + Qv[e.profile](i) + ty(e, i)
}
var ry = 8.5
  , iy = e => e.entryRun ?? 8.5
  , ay = 2.5
  , oy = .8
  , sy = .35
  , cy = .45
  , ly = e => e.entryGap ?? 2.5
  , uy = e => ny(e, 0) - (ny(e, .1) - ny(e, 0)) / (.1 * e.length) * ly(e)
  , dy = 17.5
  , fy = e => e.entry === `pop` ? -ly(e) : 0
  , py = new WeakMap;
function my(e) {
    let t = py.get(e);
    if (!t) {
        let n = ly(e)
          , r = Xv(e, -n / e.length)
          , i = e.entryHeight ?? uy(e) - (e.popStep ?? .8) - Ey(r.x, r.z)
          , o = Yv(e)
          , s = a.sin(o) * .5
          , c = a.cos(o) * .5
          , l = e.popLaunch === `ballistic` ? Ey(r.x + s, r.z + c) - Ey(r.x - s, r.z - c) : 0;
        t = {
            height: i,
            power: (a.tan((e.popAngle ?? 24) * a.PI / 180) - l) * (iy(e) - n) / i
        },
        py.set(e, t)
    }
    return t
}
function hy(e, t) {
    let n = 0;
    for (let r of gv) {
        let i = Zv(r, e, t)
          , o = i.t * r.length;
        if (r.entry === `transfer` && o < 0)
            continue;
        let s = iy(r);
        if (o < -s || o > r.length + 14 || a.abs(i.side) > 4.2)
            continue;
        let c = r.height + Qv[r.profile](0) + ty(r, 0), l = Q((3.2 - a.abs(i.side)) / 1.6), u;
        if (r.entry === `pop`) {
            let n = my(r)
              , i = ly(r);
            if (r.popLaunch === `manual` && o <= -i) {
                let c = Xv(r, -i / r.length)
                  , l = Ey(c.x, c.z) + n.height;
                u = a.max(0, l - Ey(e, t)) * Q((o + s) / (s - i - 1.5))
            } else if (r.popLaunch === `ballistic` && o <= -i) {
                let e = (o + s) / (s - i);
                u = n.height * (Q(e) + (e * e * e - e * e) * n.power)
            } else
                u = o <= -i ? n.height * a.pow((o + s) / (s - i), n.power) : n.height * (1 - Q((o + i) / 1.4))
        } else
            u = r.entry === `transfer` ? 0 : c * (o <= 0 ? Q(1 + o / s) : 1 - Q(o / 3));
        let d = o - r.length
          , f = (r.exitLanding === !1 ? 0 : 1) * Q((d + .5) / 3) * (1 - Q((d - 2) / 12)) * a.min(.42, a.max(0, r.height + Qv[r.profile](1) - .3))
          , p = Q((o - 2) / 5) * (1 - Q((o - r.length + (r.exitLanding === !1 ? 5 : 3)) / 5)) * a.exp(-a.pow((a.abs(i.side) - 2.6) / .9, 2)) * .22;
        n = a.max(n, (u + f) * l + p)
    }
    return n
}
function gy(e, t) {
    let n = 0;
    for (let r of _v) {
        let i = Q((t - r.start + 16) / 14) * (1 - Q((t - r.end - 4) / 16));
        n = a.max(n, i * (1 - Q((a.abs(e - yv(r, t)) - r.halfWidth) / 10)))
    }
    return n
}
var _y = (e, t) => {
    let n = a.min(.8, e, t);
    return a.max(e, t) + (n > 0 ? a.pow(a.max(0, 1 - a.abs(e - t) / n), 2) * n * .25 : 0)
}
  , vy = .65
  , yy = new WeakMap;
function by(e, t, n) {
    let r = n - e.z
      , i = e.mound;
    if (r < -e.run)
        return 0;
    let o = yy.get(e);
    if (!o) {
        let t = e.z - e.run;
        o = vr(e.run, e.lipLength, e.lipAngle, X(t + .5) - X(t - .5)),
        yy.set(e, o)
    }
    let s, c;
    if (r <= 0)
        s = a.max(0, X(e.z - e.run) + o.at(r + e.run) - X(n)),
        c = s * i.height / e.height;
    else {
        let t = Z((r - e.table) / e.landing, 0, 1)
          , a = t * t * t * (35 + t * (-105 + t * (126 + t * (-70 + 15 * t))))
          , o = Tv(Dv(t), a, i.landingBias ?? 0);
        c = (i.height + (i.levelLanding ? X(e.z) - X(n) : 0)) * (1 - o),
        s = c + (e.height - i.height) * (1 - Q(r / vy))
    }
    let l = a.abs(t - Fv(e, n))
      , u = e.width / 2
      , d = 1 - Z((l - u) / .55, 0, 1)
      , f = 1 - Z((l - u - (i.shoulder ?? 3)) / (i.wall ?? 4), 0, 1);
    return (c + (s - c) * d) * f
}
function xy(e, t) {
    let n = 0;
    for (let r of hv) {
        let i = t - r.z
          , o = r.approach ?? (r.main ? 64 : 42);
        if (i < -r.run - o || i > r.table + r.landing)
            continue;
        if (r.mound) {
            n = _y(n, by(r, e, t));
            continue
        }
        let s = a.abs(e - Fv(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * Q(i / r.table) : 0
          , l = r.foundation ?? (r.main ? 2 : .9)
          , u = Tv(9, 2.4, Q((i + r.run) / (r.run * .7)))
          , d = Q((r.width / 2 + c + (i > .65 ? 9 : u) - s) / (i > .65 ? 9 : u))
          , f = l * Q((i + r.run + o) / o) * (1 - Q((i - 2) / (r.table * .55))) * Q((r.width / 2 + 12 - s) / 7);
        if (i < -r.run)
            n = _y(n, f);
        else if (i <= 0) {
            let e = r.z - r.lipLength
              , o = a.tan(r.lipAngle * a.PI / 180)
              , s = r.height - o * r.lipLength + X(r.z) - X(e)
              , c = (o - (X(e + .5) - X(e - .5))) * (r.run - r.lipLength) / (s - l)
              , u = i >= -r.lipLength ? r.height + o * i + X(r.z) - X(t) : l + a.pow((i + r.run) / (r.run - r.lipLength), a.max(1.5, c)) * (s - l);
            f = a.max(f, u * d),
            n = _y(n, f)
        } else {
            let e = Q(i / r.table)
              , t = 1 - Dv((i - r.table) / r.landing)
              , o = X(r.z) + r.height + r.landingRise - X(r.z + r.table)
              , s = e * t * o
              , c = r.height * (1 - Q(i / vy))
              , l = a.max(0, 1 - a.abs(c - s) / .8);
            n = _y(n, a.max(f, (a.max(c, s) + l * l * .2) * d))
        }
    }
    return n
}
function Sy(e, t) {
    let n = e - ev(t)
      , r = 0;
    for (let e of xv) {
        let i = (t - e.z) / e.radiusZ;
        if (a.abs(i) > 2.8)
            continue;
        let o = (n - e.offset) / e.radiusX;
        r += e.height * a.exp(-o * o * 1.5 - i * i * 1.8)
    }
    return r
}
function Cy(e, t) {
    let n = 0;
    for (let r of vv) {
        let i = a.abs(e - ev(t) - r.offset);
        if (i > r.halfWidth + r.cut || t < r.start - r.approach || t > r.end + r.exit)
            continue;
        let o = Q((t - r.start + r.approach) / r.approach) * (1 - Q((t - r.end) / r.exit))
          , s = (r.height + (r.level === void 0 ? 0 : X(r.level) - X(t)) + (r.stepRise ?? 0) * Q((t - r.start - 13) / 20) - (r.descent ? r.descent.drop * Z((t - r.descent.start) / (r.descent.end - r.descent.start), 0, 1) : 0)) * o;
        if (r.downhillApproach && t < r.start) {
            let e = r.start - r.approach
              , n = Z((t - e) / r.approach, 0, 1)
              , i = X(e)
              , o = X(r.level ?? r.start) + r.height
              , c = a.min(0, (o - i) / r.approach)
              , l = Z(X(e + .5) - X(e - .5), c * 3, 0)
              , u = r.level === void 0 ? Z(X(r.start + .5) - X(r.start - .5), c * 3, 0) : 0
              , d = n * n
              , f = d * n
              , p = (2 * f - 3 * d + 1) * i + (f - 2 * d + n) * r.approach * l + (-2 * f + 3 * d) * o + (f - d) * r.approach * u;
            s = a.max(0, p - X(t))
        }
        n = a.max(n, s * (1 - Z((i - r.halfWidth) / r.cut, 0, 1)))
    }
    for (let r of _v) {
        if (r.branch === void 0 || t < r.start - 50 || t > r.end + 16)
            continue;
        let i = 1 - Q((a.abs(e - yv(r, t)) - r.halfWidth - 2) / 7);
        if (!i)
            continue;
        let o = Q((t - r.start + 50) / 34) * (1 - Q((t - r.end + 4) / 20))
          , s = X(r.start - 16) + 1.2 - (t - r.start + 16) * .075;
        n = a.max(n, Z(s - X(t), 0, 3.5) * o * i)
    }
    return n
}
function wy(e, t) {
    let n = 0;
    for (let r of Sv) {
        let i = a.abs(t - r.z) / r.radiusZ;
        if (i >= 1)
            continue;
        let o = a.abs(e - ev(t) - r.offset) / r.radiusX;
        o < 1 && (n = a.max(n, r.height * (1 - Q(i)) * (1 - Q(o))))
    }
    return n
}
function Ty(e, t) {
    let n = 0;
    for (let r of hv) {
        let i = t - r.z
          , o = r.mound ? 20 : 12;
        if (i < -r.run - o || i > r.table + r.landing + 15)
            continue;
        let s = a.abs(e - Fv(r, t))
          , c = i > 0 ? (r.kick === `high` ? 13 : 8) * Q(i / r.table) : 0;
        n = a.max(n, Q((i + r.run + o) / 16) * (1 - Q((i - r.table - r.landing + 8) / 23)) * (1 - Q((s - r.width / 2 - c - 2) / 12)))
    }
    return a.max(n, gy(e, t))
}
function Ey(e, t) {
    let n = e - ev(t)
      , r = nv(e, t)
      , i = Q((r - 18) / 26)
      , o = (a.sin(e * .081 + t * .029) * .9 + a.sin(t * .082 - e * .049) * .6) * i
      , s = a.pow(a.max(0, a.abs(n) - 76), 1.37) * .018
      , c = 0;
    for (let e of bv) {
        let n = (t - e) / 23;
        a.abs(n) < 1 && (c += (1 + a.cos(n * a.PI)) * 1.1 * Q((25 - r) / 10))
    }
    let l = a.sin(t * .006) * n * .022 * Q((a.abs(n) - 12) / 25)
      , u = i * (1.35 * a.sin(t * .014 + n * .036) + .55 * a.sin(t * .027 - n * .041))
      , d = a.max(Ty(e, t), 1 - Q((r - 35) / 16))
      , f = i * (1.3 * a.sin(t * .021 + n * .05) + .6 * a.sin(t * .041 - n * .07))
      , p = X(t) + s + sv(n, t) + (o * .55 + u + f + c + l + Sy(e, t) * 1.12) * (1 - d * .97) + xy(e, t) + Cy(e, t) + wy(e, t);
    if (a.abs(t) < 32 && a.abs(e - (ev(0) - 12)) < 26) {
        let n = (1 - Q((a.abs(t) - 14) / 18)) * (1 - Q((a.abs(e - (ev(0) - 12)) - 13) / 13));
        return Tv(p, X(0), n)
    }
    if (a.abs(t - 44) < 30 && a.abs(e - Ov) < 32) {
        let n = e - Ov
          , r = t - 44
          , i = n * Av - r * jv
          , o = n * jv + r * Av;
        return Tv(p, Mv, (1 - Q((a.abs(i) - 15) / 9)) * Q((o + 23) / 9) * (1 - Q((o - 4) / 10)))
    }
    return cv(e, t, p)
}
function $(e, t) {
    let n = Dy(e, t);
    return a.max(n, Ny(e, t, n))
}
function Dy(e, t) {
    return Ey(e, t) + hy(e, t)
}
var Oy = gv.find(e => e.stairs)
  , ky = 1.2
  , Ay = 1.5
  , jy = .45
  , My = ( () => {
    if (!Oy?.stairs)
        return null;
    let e = [Xv(Oy, 0), Xv(Oy, 1)]
      , t = Oy.stairs.width + jy + 2;
    return {
        minX: a.min(e[0].x, e[1].x) - t,
        maxX: a.max(e[0].x, e[1].x) + t,
        minZ: a.min(e[0].z, e[1].z) - t,
        maxZ: a.max(e[0].z, e[1].z) + t
    }
}
)();
function Ny(e, t, n) {
    let r = Oy
      , i = My;
    if (!r?.stairs || !i || e < i.minX || e > i.maxX || t < i.minZ || t > i.maxZ)
        return -1 / 0;
    let {width: o, steps: s, clearance: c} = r.stairs
      , l = (r.length - 1) / s
      , u = (r.stairs.railSide === `right` ? 1 : r.stairs.railSide === `left` ? -1 : 0) * (o / 2 - .12)
      , d = Zv(r, e, t)
      , f = d.t * r.length
      , p = a.abs(d.side - u) - o / 2
      , m = .5
      , h = m + s * l;
    if (p > jy || f < m - ky || f > h + Ay)
        return -1 / 0;
    let g = e => ny(r, Z(e, 0, r.length) / r.length) - c
      , _ = f <= m + l ? g(m) : g(f <= h ? f - l : h - l)
      , v = Q((f - m + ky) / ky) * (1 - Q((f - h) / Ay)) * (1 - Q(p / jy));
    return n + a.max(0, _ - n) * v
}
function Py(e, t) {
    let n = a.max(0, a.abs(e - ev(t)) - 115)
      , r = a.sin(t * .006 + e * .003) * .4 + a.cos(t * .012 - e * .008) * .21 + a.sin(t * .021 + e * .013) * .12;
    return cv(e, t, X(t) + sv(e - ev(t), t) + a.pow(n, .84) * (.64 + r * .88) + a.max(0, -t - 100) * .54) - 2
}
function Fy(e, t=0) {
    return ev(e) - 29 - 39 * Z(e / 730, 0, 1) + t
}
function Iy(e, t=0, n=12) {
    let r = ((e / 146 + t / n * 2) % 2 + 2) % 2
      , i = a.PI * 3 / 2
      , o = r * 730;
    if (a.abs(o - 730) < i) {
        let e = (o - 730 + i) / 3;
        return {
            up: r < 1,
            z: -3 * a.sin(e),
            lane: -3 * a.cos(e),
            p: r
        }
    }
    let s = o > 2 * 730 - i ? o - 2 * 730 : o;
    if (a.abs(s) < i) {
        let e = (s + i) / 3;
        return {
            up: r < 1,
            z: 730 + 3 * a.sin(e),
            lane: 3 * a.cos(e),
            p: r
        }
    }
    let c = (r < 1 ? 1 - r : r - 1) * 730
      , l = e => i * (1 - Q((e - i) / (50 - i)))
      , u = c - l(c) + l(730 - c);
    return {
        up: r < 1,
        z: u,
        lane: r < 1 ? -3 : 3,
        p: r
    }
}
function Ly(e) {
    let t = Cv[0][1];
    for (let[n,r] of Cv)
        e >= n && (t = r);
    return t
}
var Ry = 6.3
  , zy = 4.2
  , By = dy * .5
  , Vy = Ry
  , Hy = Ry * 1.08
  , Uy = Hy * 1.4
  , Wy = 6.5
  , Gy = (e, t, n, r, i=28) => Ev(e, t, t ? r ? i : 10 : Wy, n)
  , Ky = 1.25
  , qy = 1.5
  , Jy = 25 * a.PI / 180
  , Yy = 1 / 12
  , Xy = 35 * a.PI / 180
  , Zy = .7
  , Qy = .45
  , $y = (e, t) => a.atan2(a.sin(e - t), a.cos(e - t))
  , eb = class e {
    constructor() {
        this.equipmentDetached = !1,
        this.collisions = null,
        this.collisionStart = new h,
        this.collisionEnd = new h,
        this.collisionVelocity = new h,
        this.collisionOffsets = [new h(0,.28,0), new h(0,.85,0), new h(0,1.47,0)],
        this.phase = `intro`,
        this.paused = !1,
        this.switchStance = !1,
        this.x = ev(90),
        this.z = 90,
        this.y = $(this.x, this.z),
        this.speed = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.carveTransfer = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.airTime = 0,
        this.maxAir = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.grabLedger = new Lt,
        this.scoreFactors = null,
        this.lastScoreFactors = null,
        this.spin = 0,
        this.flip = 0,
        this.grabTime = 0,
        this.trickScore = 0,
        this.score = 0,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.butter = new Pt,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.trick = ``,
        this.notice = ``,
        this.noticeTime = 0,
        this.elapsed = 0,
        this.liftTime = 0,
        this.liftClock = 0,
        this.runs = 0,
        this.crashes = 0,
        this.cabinIndex = 0,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.previousSteer = 0,
        this.corkSet = !1,
        this.railPitchHeld = 0,
        this.rollVelocity = 0,
        this.airRotation = new yn,
        this.airOrientation = this.airRotation.orientation,
        this.landingAssist = new Yi,
        this.airLevel = new Zi,
        this.groundTarget = new g,
        this.landingUp = new h,
        this.landingNormal = new h,
        this.stanceTurn = new g,
        this.landingSettling = !1,
        this.ragdoll = new gr($,$_.snowWalls),
        this.crashDuration = 0,
        this.crashSeverity = 0,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.crashTime = 0,
        this.landing = 0,
        this.landingImpact = 0,
        this.landingBoost = 0,
        this.crouch = 0,
        this.grind = !1,
        this.jumpHeld = !1,
        this.charge = 0,
        this.topSpeed = 0,
        this.skid = 0,
        this.skidSide = 1,
        this.polePhase = 0,
        this.poling = 0,
        this.takeoffKick = 0,
        this.jumpDistance = 0,
        this.lastJumpDistance = 0,
        this.recoveryPushTime = 0,
        this.event = ``,
        this.rail = null,
        this.railT = 0,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.barSave = null,
        this.railHops = [],
        this.railHopPoints = 0,
        this.railTarget = null,
        this.railSteer = 0,
        this.railPresses = 0,
        this.chain = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.airRepeatKey = ``,
        this.chainRepeatKeys = [],
        this.trickTally = new Map,
        this.repeat = 0,
        this.lost = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.board = !1,
        this.airSource = `jump`,
        this.airGrid = en
    }
    collideWithSnow() {
        if (!$_.snowWalls || this.rail || this.crashTime > 0)
            return !1;
        let e = fr($, this.collisionStart, this) ?? (this.airborne && this.vy < 0 ? fr($, this, this) : null);
        if (!e)
            return !1;
        let t = a.hypot(this.velocityX, this.velocityZ)
          , n = a.max(0, -this.velocityX * e.nx - this.velocityZ * e.nz);
        this.x = e.x,
        this.z = e.z,
        this.airborne || (this.y = $(this.x, this.z)),
        this.velocityX += e.nx * n,
        this.velocityZ += e.nz * n;
        let r = _r(n, t);
        return r === `fall` || r === `crash` ? (this.landingImpact = n,
        this.beginCrash(n, !1, r),
        !0) : (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && (this.landingSpin = Z((e.nx * a.cos(this.heading) - e.nz * a.sin(this.heading)) * n / 16, -.8, .8),
        this.landingFlip = Z(-(e.nx * a.sin(this.heading) + e.nz * a.cos(this.heading)) * n / 20, -.6, .6)),
        !1)
    }
    leaveSnowEdge(e) {
        if (!$_.snowWalls)
            return;
        let t = pr($, this.collisionStart, this);
        if (!t)
            return;
        let n = a.hypot(this.velocityX, this.velocityZ);
        this.y = this.collisionStart.y;
        let r = a.cos(this.heading)
          , i = a.sin(this.heading)
          , o = j(t.dx * i + t.dz * r, this.spin, this.edge, new g, t.dx * r - t.dz * i);
        this.takeoff(t.grade * n, n, `ground`, o),
        this.takeoffKick = 0,
        this.railPitchHeld = Number(e.forward) | Number(e.brake) << 1,
        this.charge = 0
    }
    collideWithPark() {
        if (!this.collisions || this.rail || this.crashTime > 0)
            return !1;
        this.collisionEnd.set(this.x, this.y, this.z),
        this.collisionVelocity.set(this.velocityX, this.airborne ? this.vy : 0, this.velocityZ);
        let e = this.collisionVelocity.length()
          , t = this.airborne ? -1 : gv.findIndex(e => {
            let t = Zv(e, this.x, this.z)
              , n = Yv(e);
            return e.entry === `ride` && t.t >= -.7 / e.length && t.t < 0 && a.abs(t.side) < e.width / 2 + .1 && this.y >= ny(e, 0) - .65 && this.velocityX * a.sin(n) + this.velocityZ * a.cos(n) > 0
        }
        )
          , n = this.collisions.move(this.collisionStart, this.collisionEnd, this.collisionVelocity, this.collisionOffsets, .27, t >= 0 ? `rail-${t}` : ``);
        if (!n.touched)
            return !1;
        this.x = this.collisionEnd.x,
        this.y = this.collisionEnd.y,
        this.z = this.collisionEnd.z,
        this.velocityX = this.collisionVelocity.x,
        this.velocityZ = this.collisionVelocity.z,
        this.airborne && (this.vy = this.collisionVelocity.y);
        let r = _r(n.impact, e);
        if (r === `fall` || r === `crash`)
            return this.landingImpact = n.impact,
            this.beginCrash(n.impact, !1, r),
            this.notice = `BAIL`,
            !0;
        if (this.speed = a.hypot(this.velocityX, this.velocityZ),
        this.speed > .1 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        r === `balance` && !this.airborne) {
            let e = n.normal.x * a.cos(this.heading) - n.normal.z * a.sin(this.heading)
              , t = n.normal.x * a.sin(this.heading) + n.normal.z * a.cos(this.heading);
            this.landingSpin = Z(e * n.impact / 16, -.8, .8),
            this.landingFlip = Z(-t * n.impact / 20, -.6, .6)
        }
        return !1
    }
    get trickEvent() {
        let e = this.event;
        if (!e || e === `arrive`)
            return null;
        let t = e === `land` && !this.rail || e === `butter`;
        return {
            t: this.elapsed,
            kind: e,
            text: e === `crash` || t ? this.notice : this.chain.length ? this.trick : ``,
            score: e === `crash` ? this.lost : t ? this.lastScore : 0,
            impact: this.landingImpact
        }
    }
    toLobby() {
        this.butter.reset(),
        this.railPitchHeld = 0,
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `intro`,
        this.paused = !1,
        this.crashTime = 0,
        this.recovery = 0,
        this.airborne = !1,
        this.rail = null,
        this.grind = !1,
        this.x = ev(90),
        this.z = 90,
        this.y = $(this.x, this.z),
        this.speed = 0,
        this.vy = 0,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = 0,
        this.travelHeading = 0,
        this.edge = 0,
        this.turnRate = 0,
        this.skid = 0,
        this.crouch = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spin = 0,
        this.flip = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.landingPrepare = 0,
        this.trick = ``,
        this.trickScore = 0,
        this.notice = ``,
        this.noticeTime = 0,
        this.liftTime = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.switchStance = !1,
        this.clearChain()
    }
    boardLift(e) {
        if (this.butter.reset(),
        !(this.phase !== `intro` && this.phase !== `finished`)) {
            if (this.phase = `gondola`,
            this.liftTime = 0,
            this.speed = 0,
            this.paused = !1,
            this.liftClock = e ?? 0,
            this.cabinIndex = 0,
            e !== void 0) {
                let t = 1 / 0;
                for (let n = 0; n < 12; n++) {
                    let r = Iy(e, n);
                    r.up && r.p < t && (t = r.p,
                    this.cabinIndex = n)
                }
            }
            this.airborne = !1,
            this.grind = !1,
            this.spin = 0,
            this.flip = 0,
            this.edge = 0,
            this.crouch = 0,
            this.placeOnTow()
        }
    }
    placeOnTow() {
        let e = Iy(this.liftClock, this.cabinIndex)
          , t = Iy(this.liftClock + .03, this.cabinIndex);
        this.z = e.z,
        this.x = Fy(e.z, e.lane),
        this.y = $(this.x, this.z),
        this.heading = a.atan2(Fy(t.z, t.lane) - this.x, t.z - this.z),
        this.travelHeading = this.heading,
        this.speed = 730 / 146
    }
    arrive() {
        Object.assign(this, new e, {
            liftClock: this.liftClock,
            liftTime: this.liftTime,
            cabinIndex: this.cabinIndex,
            runs: this.runs,
            collisions: this.collisions
        }),
        this.equipmentDetached = !1,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.lastScoreFactors = null,
        this.recoveryPushTime = 0,
        this.phase = `skiing`,
        this.z = 27,
        this.x = -7,
        this.y = $(this.x, 27),
        this.speed = 3,
        this.lateral = 0,
        this.velocityX = 0,
        this.velocityZ = 0,
        this.heading = a.atan(tv(27)),
        this.travelHeading = this.heading,
        this.edge = 0,
        this.turnRate = 0,
        this.vy = 0,
        this.airborne = !1,
        this.elapsed = 0,
        this.score = 0,
        this.runScore = se(),
        this.bestTrick = ``,
        this.cleanLandings = 0,
        this.landedJumps = 0,
        this.totalAirTime = 0,
        this.crashes = 0,
        this.crashTime = 0,
        this.landingImpact = 0,
        this.landing = 0,
        this.landingBoost = 0,
        this.switchStance = !1,
        this.trick = ``,
        this.lastScore = 0,
        this.bestCombo = 0,
        this.topSpeed = 0,
        this.spin = 0,
        this.flip = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.charge = 0,
        this.jumpHeld = !1,
        this.skid = 0,
        this.poling = 0,
        this.polePhase = 0,
        this.lastJumpDistance = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.trickTally.clear(),
        this.lost = 0,
        this.notice = `FIND YOUR LINE`,
        this.noticeTime = 3,
        this.event = `arrive`
    }
    fastTravel() {
        if (this.phase !== `gondola` || this.paused)
            return;
        let e = (1 - Iy(this.liftClock, this.cabinIndex).p) * 146;
        this.liftClock += e,
        this.liftTime += e,
        this.arrive()
    }
    recover() {
        this.butter.reset(!0),
        this.lastScoreFactors = null,
        this.phase === `skiing` && (this.railPitchHeld = 0,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.x = ev(this.z),
        this.y = $(this.x, this.z),
        this.vy = 0,
        this.lateral = 0,
        this.speed = 5,
        this.airborne = !1,
        this.spin = 0,
        this.flip = 0,
        this.crashTime = 0,
        this.skid = 0,
        this.travelHeading = a.atan(tv(this.z)),
        this.heading = this.travelHeading,
        this.edge = 0,
        this.turnRate = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.recovery = 0,
        this.landingSpin = 0,
        this.landingFlip = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.spinReversal = this.flipReversal = 0,
        this.rail = null,
        this.grind = !1,
        this.railSpin = 0,
        this.railSpinVelocity = 0,
        this.railSpinTravel = 0,
        this.clearChain(),
        this.notice = `BACK ON TRACK`,
        this.noticeTime = 2)
    }
    rideOutButter() {
        let e = Kv(this.x, this.z, this.heading);
        this.butter.release(this, j(e.slope, this.spin, this.edge, this.airOrientation, e.crossSlope)),
        this.flipTightness = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.spinWindup = 0;
        let t = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length
          , n = a.round(this.butter.entryPoints * ge(t));
        this.butter.entryPoints = 0,
        !(n <= 0) && (this.lastScore = n,
        this.score += n,
        this.runScore.tricks += n,
        this.trickTally.set(`BUTTER`, (this.trickTally.get(`BUTTER`) ?? 0) + 1),
        n > this.bestCombo && (this.bestCombo = n,
        this.bestTrick = this.butter.entry),
        this.notice = `STOMPED. ${this.butter.entry}`,
        this.noticeTime = 3,
        this.event = `butter`)
    }
    takeoff(e, t=this.speed, n=`jump`, r) {
        this.railPitchHeld = 0;
        let i = Kv(this.x, this.z, this.heading, this.grind)
          , o = this.landingSettling ? this.airOrientation.clone() : r ?? j(i.slope, this.spin, this.edge, new g, i.crossSlope)
          , s = this.butter.launch(this, o);
        this.speed = t,
        this.spinReversal = 0,
        this.flipReversal = 0,
        this.carveTransfer = 0,
        this.previousSteer = 0,
        this.airborne = !0,
        this.vy = e + s.pop,
        this.airTime = 0,
        this.spin = 0,
        this.flip = 0,
        this.corkSet = !1,
        this.airRotation.reset(0, 0, o),
        this.rollVelocity = 0,
        this.landingAssist.reset(),
        this.landingSettling = !1,
        this.flipVelocity = 0,
        this.flipWindup = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.spinVelocity = 0,
        this.spinWindup = 0,
        this.spinTightness = 0,
        this.landingPrepare = 0,
        this.spinVelocity = s.spin,
        this.flipVelocity = s.flip,
        this.velocityZ = this.speed * a.cos(this.travelHeading),
        this.velocityX = this.speed * a.sin(this.travelHeading),
        this.grabTime = 0,
        this.grabLedger.reset(),
        this.scoreFactors = null,
        this.maxAir = 0,
        this.jumpDistance = 0,
        this.trickScore = this.projectChain(0, 0, 0, 0),
        this.trick = this.chainText(``),
        this.event = `jump`,
        this.takeoffKick = 1,
        this.airSource = n,
        this.airGrid = en,
        this.rail = null,
        this.grind = !1,
        this.lost = 0
    }
    mountRail(e, t, n, r=0) {
        this.butter.reset(),
        this.landingSettling = !1,
        this.landingAssist.reset();
        let i = Yv(e)
          , o = a.atan2(a.sin(this.travelHeading - i), a.cos(this.travelHeading - i))
          , s = a.atan2(a.sin(n - i), a.cos(n - i));
        this.spin = 0,
        this.spinTightness = 0,
        this.rail = e,
        this.railT = Z(t, 0, 1),
        this.grind = !0,
        this.airborne = !1,
        this.vy = 0,
        this.railTime = 0,
        this.railSwaps = 0,
        this.railHops = [],
        this.railHopPoints = 0,
        this.railSpinVelocity = r,
        this.railTarget = null,
        this.railPresses = 0,
        this.railSpin = s,
        this.railSpinTravel = 0,
        this.switchStance = !1,
        this.skid = 0,
        this.charge = 0,
        this.speed = a.max(9, this.speed * a.max(.35, a.cos(o))),
        this.travelHeading = this.heading = i,
        this.velocityX = this.speed * a.sin(i),
        this.velocityZ = this.speed * a.cos(i);
        let c = Xv(e, this.railT);
        this.x = c.x,
        this.z = c.z,
        this.y = ny(e, this.railT)
    }
    chainText(e) {
        return [...this.chain, e].filter(Boolean).join(` → `)
    }
    railName() {
        return [this.railSwaps ? `RAIL ${this.railSwaps * 90}` : `RAIL SLIDE`, ...this.railHops].join(` + `)
    }
    barPoints() {
        return Oe(this.railTime, this.railSwaps) + this.railHopPoints
    }
    hopValue(e) {
        let t = this.airRotation.judge.result(!1, !0, tn).rotations;
        if (t < 90 || e.length >= 2)
            return null;
        let n = `HOP ${t}`
          , r = (this.trickTally.get(n) ?? 0) + this.chainRepeatKeys.filter(e => e === n).length;
        return {
            name: n,
            points: a.round(t / 90 * 450 * he(r))
        }
    }
    projectChain(e, t, n, r, i=0) {
        let o = _e(this.chainLinks + r);
        return this.chainButter + i + a.round((this.chainTricks + e) * o) + a.round((this.chainGrabs + t) * o) + a.round((this.chainRails + n) * o)
    }
    pushAirLink() {
        this.chainButter += this.butterPoints,
        this.butterPoints > 0 && this.chainRepeatKeys.push(`BUTTER`),
        this.butter.entryPoints = 0,
        this.chainTricks += a.round(this.airPoints * he(this.repeat)),
        this.chainGrabs += this.grabPoints,
        this.airName && this.chain.push(this.airName),
        this.airIsLink && this.airRepeatKey && this.chainRepeatKeys.push(this.airRepeatKey),
        this.airIsLink && this.chainLinks++,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    pushRailLink() {
        this.chainRails += this.barPoints(),
        this.chain.push(this.railName()),
        this.chainLinks++
    }
    clearChain() {
        this.scoreFactors = null,
        this.chain = [],
        this.chainRepeatKeys = [],
        this.chainTricks = 0,
        this.chainGrabs = 0,
        this.chainRails = 0,
        this.chainLinks = 0,
        this.chainButter = 0,
        this.butterPoints = 0,
        this.airName = ``,
        this.airRepeatKey = ``,
        this.airPoints = 0,
        this.grabPoints = 0,
        this.airIsLink = !1,
        this.repeat = 0
    }
    judgeAir(e=!1, t=!1) {
        if (!e && this.barSave && Zv(this.barSave.r, this.x, this.z).t <= 1) {
            let e = this.hopValue(this.barSave.railHops)
              , t = this.chain.length - 1;
            this.trick = [...this.chain.slice(0, t), [this.chain[t], ...e ? [e.name] : []].join(` + `)].join(` → `),
            this.trickScore = this.projectChain(0, 0, e?.points ?? 0, 0);
            return
        }
        let n = t || this.velocityZ > .5 && (this.airSource !== `ground` || this.airTime >= 1.05 && this.maxAir >= 1.3)
          , r = this.airRotation.judge.result(this.switchStance, e, t ? tn : this.airGrid, this.board)
          , i = t ? `ON` : this.airSource === `rail` ? `OFF` : ``
          , o = r.name && i ? `${r.name} ${i}` : r.name
          , s = this.grabLedger.namesOn(this.board)
          , c = (this.trickTally.get(`BUTTER`) ?? 0) + this.chainRepeatKeys.filter(e => e === `BUTTER`).length;
        this.butterPoints = a.round(this.butter.entryPoints * ge(c)),
        this.airName = [this.butterPoints > 0 ? this.butter.entry : ``, ...n ? [o, ...s] : []].filter(Boolean).join(` + `);
        let l = Ee({
            airTime: this.airTime,
            maxAir: this.maxAir,
            ...r,
            switchStance: this.switchStance
        });
        this.airRepeatKey = n ? (r.type && i ? `${r.type} ${i}` : r.type) || `STRAIGHT AIR` : ``,
        this.repeat = this.airRepeatKey ? (this.trickTally.get(this.airRepeatKey) ?? 0) + this.chainRepeatKeys.filter(e => e === this.airRepeatKey).length : 0,
        this.airPoints = n ? l.total : 0,
        this.grabPoints = n ? De(this.grabLedger.time, s.length, l.rotation, he(this.repeat), this.grabLedger.longest) : 0,
        this.airIsLink = n && (this.airTime >= .5 || o !== `` || s.length > 0),
        this.scoreFactors = n ? {
            turns: l.turns,
            grabs: s.length,
            grabMultiplier: Ce(s.length, this.grabLedger.longest),
            lineMultiplier: _e(this.chainLinks + +!!this.airIsLink),
            offAxis: r.offAxis,
            switchStance: this.switchStance,
            flips: l.flips
        } : null,
        this.trickScore = this.projectChain(a.round(this.airPoints * he(this.repeat)), this.grabPoints, 0, +!!this.airIsLink, this.butterPoints),
        this.trick = this.trickScore > 0 ? this.chainText(this.airName) : ``
    }
    landOnRail(e=!1) {
        let t = a.abs(this.flipVelocity) > .1;
        for (let n of gv) {
            let r = Zv(n, this.x, this.z)
              , i = r.t * n.length
              , o = n.entry === `pop`;
            if (i < (o ? -.45 : 0) || r.t > 1 || a.abs(r.side) > n.width / 2 + .5)
                continue;
            let s = ny(n, r.t);
            if (e && (n.popLaunch === `ballistic` || n.popLaunch === `manual`) || (e ? !o || i > 3 || t || this.y > s + .1 || this.y < s - .35 : this.y > s + .05 || this.y < s - (o && i < 3 ? .35 : .75)))
                continue;
            if (this.airRotation.upright < .45)
                return this.landingImpact = a.max(2, -this.vy),
                this.beginCrash(this.landingImpact),
                !0;
            let c = this.heading + this.airRotation.landingYaw + (this.switchStance ? a.PI : 0);
            return this.barSave?.r === n ? (this.resumeBar(n, r.t, c),
            !0) : (this.judgeAir(!0, !0),
            this.pushAirLink(),
            this.landedJumps++,
            this.totalAirTime += this.airTime,
            this.lastJumpDistance = this.jumpDistance,
            this.landingImpact = 0,
            this.landing = .6,
            this.mountRail(n, r.t, c, this.spinVelocity),
            this.event = `land`,
            this.spin = 0,
            this.flip = 0,
            this.rollVelocity = 0,
            this.trick = this.chainText(this.railName()),
            this.trickScore = this.projectChain(0, 0, 0, 0),
            this.flipVelocity = 0,
            this.flipTightness = 0,
            this.spinVelocity = 0,
            this.spinTightness = 0,
            this.landingPrepare = 1,
            !0)
        }
        return !1
    }
    resumeBar(e, t, n) {
        let r = this.barSave;
        this.barSave = null,
        this.chain.pop(),
        this.chainLinks--,
        this.chainRails -= r.rails;
        let i = this.hopValue(r.railHops)
          , a = this.airTime;
        this.mountRail(e, t, n, this.spinVelocity),
        this.railTime = r.railTime + a,
        this.railPresses = r.railPresses,
        this.railSpinTravel = r.railSpinTravel,
        this.railSwaps = r.railSwaps,
        this.railHops = i ? [...r.railHops, i.name] : r.railHops,
        this.railHopPoints = r.railHopPoints + (i?.points ?? 0),
        i && this.chainRepeatKeys.push(i.name),
        this.landing = .3,
        this.landingImpact = 0,
        this.event = ``,
        this.spin = 0,
        this.flip = 0,
        this.rollVelocity = 0,
        this.flipVelocity = 0,
        this.flipTightness = 0,
        this.spinVelocity = 0,
        this.spinTightness = 0,
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, this.barPoints(), 1)
    }
    shiftAcross(e, t) {
        let n = Yv(e);
        this.x += a.cos(n) * t,
        this.z -= a.sin(n) * t
    }
    funnelToRail(e, t) {
        for (let n of gv) {
            if (n.entry !== `ride`)
                continue;
            let r = Zv(n, this.x, this.z)
              , i = r.t * n.length
              , o = iy(n);
            if (i < -o || i >= 0 || a.abs(r.side) > 1.5)
                continue;
            let s = $y(this.travelHeading, Yv(n));
            if (a.abs(s) > Jy || this.speed < 4 || t.steer * a.sign(r.side) > .3)
                return;
            let c = Q((i + o) / o);
            this.shiftAcross(n, -a.sign(r.side) * a.min(a.abs(r.side), Yy * c * this.speed * e)),
            this.travelHeading -= s * (1 - a.exp(-3 * c * e));
            return
        }
    }
    funnelInAir(e) {
        for (let t of gv) {
            let n = Zv(t, this.x, this.z)
              , r = n.t * t.length
              , i = t.entry === `pop` && r >= -ly(t) && r <= 3;
            if (n.t < -.02 && !i || n.t > 1 || a.abs(n.side) > 1)
                continue;
            let o = this.y - ny(t, Z(n.t, 0, 1));
            if (!(!i && (this.vy >= 0 || o < -.2 || o > -this.vy * .45)) && !(a.abs($y(this.travelHeading, Yv(t))) > Xy)) {
                this.shiftAcross(t, -a.sign(n.side) * a.min(a.abs(n.side), Zy * e));
                return
            }
        }
    }
    popOffKicker(e, t, n) {
        for (let n of gv) {
            if (n.entry !== `pop` || n.popLaunch === `manual` || this.speed < 5)
                continue;
            let r = Zv(n, this.x, this.z)
              , i = ly(n);
            if (Zv(n, e, t).t * n.length >= -i || r.t * n.length < -i || my(n).height * Q((3.2 - a.abs(r.side)) / 1.6) < .4)
                continue;
            let o = Yv(n)
              , s = Xv(n, -i / n.length)
              , c = {
                x: s.x + a.cos(o) * r.side,
                z: s.z - a.sin(o) * r.side
            }
              , l = a.hypot(this.velocityX, this.velocityZ)
              , u = l * a.max(.2, a.cos($y(this.travelHeading, o)))
              , d = (ny(n, .1) - ny(n, 0)) / (.1 * n.length)
              , f = $(c.x, c.z)
              , p = a.max(.3, -r.t * n.length)
              , m = ny(n, 0) - d * p - f
              , h = p / a.max(u, 1)
              , _ = a.max(a.sqrt(2 * dy * (m + sy)), (m - .1) / h + dy * h / 2)
              , v = n.popLaunch === `ballistic`
              , y = (n.popAngle ?? 24) * a.PI / 180
              , b = v ? this.speed * a.cos(y) : l
              , x = v ? this.speed * a.sin(y) : _ + d * u;
            this.y = f,
            this.takeoff(x, b, `jump`, j(x / b, this.spin, this.edge, new g, 0)),
            this.charge = 0;
            return
        }
    }
    slide(e, t) {
        let n = this.rail
          , r = Yv(n);
        this.grind = !0,
        this.railTime += e;
        let i = Z(this.railT, 0, 1)
          , o = a.max(0, i - .02)
          , s = a.min(1, i + .02)
          , c = (ny(n, s) - ny(n, o)) / ((s - o) * n.length);
        this.speed = a.max(9, this.speed - By * c / a.hypot(1, c) * e),
        this.railT += this.speed * e / n.length;
        let l = Z(this.railT, 0, 1)
          , u = Xv(n, l);
        this.x = u.x,
        this.z = u.z,
        this.y = ny(n, l),
        this.travelHeading = this.heading = r,
        this.velocityX = this.speed * a.sin(r),
        this.velocityZ = this.speed * a.cos(r),
        this.turnRate = 0,
        this.lateral = 0,
        this.skid = 0;
        let d = a.abs(t.steer) > .06 ? Z(t.steer, -1, 1) : 0
          , f = a.sign(d);
        f && f !== this.railSteer && this.railPresses < 2 && (this.railPresses++,
        this.railTarget = (this.railTarget ?? a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2)) + f * a.PI / 2),
        this.railSteer = f;
        let p;
        if (this.railTarget !== null) {
            let t = this.railTarget - this.railSpin;
            p = a.sign(t) * a.min(a.abs(t), zy * e),
            this.railSpinVelocity = p / e,
            a.abs(t - p) < 1e-6 && (this.railTarget = null,
            this.railSpinVelocity = 0)
        } else
            this.railSpinVelocity = Ev(this.railSpinVelocity, 0, 1.65, e),
            p = this.railSpinVelocity * e;
        if (this.railSpin += p,
        this.railSpinTravel += a.abs(p),
        this.railTarget === null && a.abs(this.railSpinVelocity) < .45) {
            let t = a.round(this.railSpin / (a.PI / 2)) * (a.PI / 2);
            this.railSpin = Ev(this.railSpin, t, 4.8, e)
        }
        let m = a.floor((this.railSpinTravel + .12) / (a.PI / 2));
        m > this.railSwaps && (this.railSwaps = a.min(m, 2)),
        this.trick = this.chainText(this.railName()),
        this.trickScore = this.projectChain(0, 0, this.barPoints(), 1),
        this.scoreFactors = {
            turns: 0,
            grabs: 0,
            grabMultiplier: 1,
            lineMultiplier: _e(this.chainLinks + 1),
            offAxis: !1,
            switchStance: !1
        },
        t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
        !t.jump && this.jumpHeld ? this.dismount(4.6 + this.charge * 3.4, !0, t) : this.railT >= 1 && this.dismount(.5, !1, t)
    }
    dismount(e, t, n) {
        let r = this.rail
          , i = this.railSpin
          , o = this.railSpinVelocity
          , s = Z(this.railT, 0, 1)
          , c = .02
          , l = (ny(r, a.min(1, s + c)) - ny(r, a.max(0, s - c))) / ((a.min(1, s + c) - a.max(0, s - c)) * r.length);
        this.barSave = {
            r,
            railTime: this.railTime,
            railSwaps: this.railSwaps,
            railSpinTravel: this.railSpinTravel,
            railPresses: this.railPresses,
            railHops: this.railHops,
            railHopPoints: this.railHopPoints,
            rails: this.barPoints()
        },
        this.pushRailLink(),
        this.rail = null,
        this.grind = !1;
        let u = j(l, i, 0, new g);
        this.takeoff(this.speed * l + e, this.speed, `rail`, u),
        this.airGrid = a.abs(a.round(i / (a.PI / 2))) % 2 ? nn : en,
        this.airRotation.reset(0, i, u),
        this.spinVelocity = o,
        this.charge = 0,
        t || (this.event = `dismount`,
        this.railPitchHeld = Number(n.forward) | Number(n.brake) << 1)
    }
    faceplant() {
        Nt(this.airOrientation),
        this.beginCrash(this.landingImpact),
        this.notice = `FACEPLANT`
    }
    beginCrash(e, t=!1, n) {
        if (this.crashTime > 0)
            return;
        this.equipmentDetached = !1,
        this.lastScoreFactors = null,
        this.landingSettling = !1,
        this.landingAssist.reset(),
        this.recoveryPushTime = 0,
        this.crashSeverity = Z(n ? e / 42 * .8 + a.max(0, this.y - $(this.x, this.z)) / 45 * .2 : this.speed / 43 * .35 + e / 42 * .45 + this.maxAir / 45 * .2, .12, 1);
        let r = n ? n === `fall` : !t && e < 16 && this.maxAir < 5.5 && this.speed < 27;
        this.crashDuration = r ? .8 + this.crashSeverity * .4 : 1.35 + this.crashSeverity * 1.35,
        this.crashTime = this.crashDuration,
        this.recovery = 0,
        this.ragdoll.start(this.x, this.y, this.z, this.heading, this.spin + (this.switchStance ? a.PI : 0), this.flip, this.velocityX, this.velocityZ, e, this.flipVelocity, this.spinVelocity, this.airOrientation, this.switchStance ? a.PI : 0, t, r),
        this.crashes++,
        this.airborne = !1,
        this.landing = 0,
        this.landingBoost = 0,
        this.event = `crash`,
        this.rail = null,
        this.grind = !1,
        this.lost = this.trickScore,
        this.notice = t ? `LANDED FLAT` : `BAIL`,
        this.noticeTime = this.crashDuration,
        this.trick = ``,
        this.trickScore = 0,
        this.clearChain()
    }
    updateCrash(e) {
        this.ragdoll.collisions = this.collisions,
        this.crashTime = a.max(0, this.crashTime - e),
        this.recovery = 1 - Z(this.crashTime / (this.ragdoll.gentle ? .45 : .6), 0, 1),
        this.ragdoll.update(e, this.crashTime < (this.ragdoll.gentle ? .55 : .75)),
        this.equipmentDetached = this.crashTime > 0 && this.ragdoll.shedsEquipment;
        let t = this.ragdoll.nodes.Hips.p
          , n = Z(t.z, -22, 730)
          , r = Z(t.x, ev(n) - 123, ev(n) + 123);
        this.ragdoll.translate(r - t.x, n - t.z),
        this.x = r,
        this.z = n,
        this.y = $(r, n),
        this.velocityX = this.ragdoll.velocity.x,
        this.velocityZ = this.ragdoll.velocity.z,
        this.speed = a.min($_.maxSpeed, a.hypot(this.velocityX, this.velocityZ)),
        this.speed > 1.5 && (this.travelHeading = a.atan2(this.velocityX, this.velocityZ)),
        this.crashTime === 0 && (this.speed = Z(this.speed, 4, this.ragdoll.gentle ? 32 : 23),
        this.vy = 0,
        this.spin = 0,
        this.flip = 0,
        this.edge = 0,
        this.skid = 0,
        this.airRotation.reset(),
        this.rollVelocity = 0,
        this.spinVelocity = 0,
        this.flipVelocity = 0,
        this.spinWindup = 0,
        this.flipWindup = 0,
        this.spinTightness = 0,
        this.flipTightness = 0,
        this.airGrab = 0,
        this.switchStance = !1,
        this.heading = this.travelHeading,
        this.recovery = 0,
        this.crouch = .5,
        this.poling = 0,
        this.charge = 0,
        this.jumpHeld = !1,
        this.forwardHeld = 0,
        this.tucking = !1,
        this.polePhase = 0,
        this.recoveryPushTime = 6,
        this.velocityX = a.sin(this.travelHeading) * this.speed,
        this.velocityZ = a.cos(this.travelHeading) * this.speed,
        this.notice = `BACK ON YOUR FEET`,
        this.noticeTime = 2)
    }
    update(e, t) {
        if (this.board = !!t.board,
        this.event = ``,
        !this.airborne && !this.grind && (this.barSave = null),
        this.grind || (this.railSteer = a.abs(t.steer) > .06 ? a.sign(t.steer) : 0),
        this.crashTime <= 0 && (this.equipmentDetached = !1),
        this.paused)
            return;
        if (this.liftClock += e,
        this.noticeTime = a.max(0, this.noticeTime - e),
        this.landing = a.max(0, this.landing - e * 3.4),
        this.landingBoost = a.max(0, this.landingBoost - e),
        this.takeoffKick = a.max(0, this.takeoffKick - e * 4),
        this.phase === `gondola`) {
            this.liftTime += e,
            this.placeOnTow(),
            Iy(this.liftClock, this.cabinIndex).p >= .999999999 && this.arrive();
            return
        }
        if (this.phase !== `skiing`)
            return;
        if (this.railPitchHeld &= Number(t.forward) | Number(t.brake) << 1,
        this.elapsed += e,
        this.crashTime > 0) {
            this.butter.reset(),
            this.updateCrash(e);
            return
        }
        this.recoveryPushTime = this.speed >= 18 ? 0 : a.max(0, this.recoveryPushTime - e);
        let n = this.airborne;
        this.landingSpin = Ev(this.landingSpin, 0, 5, e),
        this.landingFlip = Ev(this.landingFlip, 0, 5, e);
        let r = this.butter.step(this, t, e, !this.airborne && (t.butter || this.butter.active) ? Gv(this.x, this.z, this.travelHeading) : 0);
        this.butter.ready && !this.rail && this.rideOutButter();
        let i = !r && t.brake && !this.airborne && !this.rail;
        this.forwardHeld = !r && t.forward && !this.airborne && !this.rail && !i ? this.forwardHeld + e : 0,
        this.tucking = !r && t.forward && !this.airborne && !this.rail && !i && (this.switchStance || this.forwardHeld >= 1.25 || this.speed >= 18),
        this.crouch = Ev(this.crouch, !this.airborne && (this.tucking || t.jump) ? 1 : 0, 9, e),
        a.abs(t.steer) > .15 && (this.skidSide = a.sign(t.steer)),
        this.skid = Ev(this.skid, i ? this.skidSide * Z(this.speed / 9, 0, 1) : 0, 7, e);
        let o = !r && a.abs(t.steer) > .05 ? Z(t.steer, -1, 1) : 0;
        this.carveTransfer *= a.exp(-6 * e),
        !this.airborne && !i && this.previousSteer * o < 0 && (this.carveTransfer = a.abs(this.edge) * Z(this.speed / 18, 0, 1)),
        this.previousSteer = this.airborne || !o && a.abs(this.edge) < .1 ? 0 : o || this.previousSteer;
        let s = Z(13 / a.max(this.speed, 1), .45, 1)
          , l = o ? (11 + this.carveTransfer * 11) * s : 9
          , u = Q((1 - this.landing) / .68);
        this.edge = Ev(this.edge, !this.airborne && !this.rail ? o * u : 0, l, e);
        let d = !r && t.forward && !this.switchStance && !this.tucking && !this.airborne && !this.rail && !i && !t.jump;
        if (this.poling = Ev(this.poling, +!!d, 12, e),
        this.airborne)
            this.velocityX *= a.exp(-.003 * e),
            this.velocityZ *= a.exp(-.003 * e),
            this.speed = a.hypot(this.velocityX, this.velocityZ),
            this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
            this.turnRate = 0,
            this.lateral = 0;
        else {
            this.landingSettling && !this.rail && !r && (this.spinVelocity += (-100 * this.spin - 20 * this.spinVelocity) * e,
            this.spin += this.spinVelocity * e),
            r || (this.spinWindup = Ev(this.spinWindup, 0, 10, e),
            this.spinTightness = Ev(this.spinTightness, 0, 14, e)),
            this.landingPrepare = this.butter.active ? -1 : 0;
            let t = nv(this.x, this.z) > 24 && Ty(this.x, this.z) < .5
              , n = this.edge * (.8 + Z(this.speed / 85, 0, .44)) * (1 + this.carveTransfer * .14) * (i ? .7 : 1);
            this.turnRate = this.rail ? 0 : n,
            this.travelHeading += this.turnRate * e,
            r && (this.travelHeading += At(Gv(this.x, this.z, this.travelHeading + a.PI / 2), this.speed, 9.81 * 1.7) * e);
            let o = Gv(this.x, this.z, this.travelHeading);
            if ($_.snowWalls && o < -1) {
                let e = {
                    x: this.x + a.sin(this.travelHeading) * .5,
                    y: this.y,
                    z: this.z + a.cos(this.travelHeading) * .5
                }
                  , t = pr($, this, e);
                t && (o = t.grade)
            }
            let s = -o
              , c = (this.tucking ? .0024 : .0028) * (t ? 1.38 : 1)
              , l = 9.81 * a.sin(a.atan(s)) * 1.7 - .13 - c * this.speed * this.speed - a.abs(this.edge) * .38;
            if (this.rail || (this.speed = Z(this.speed + (l - (i ? 17 : 0)) * e, 0, $_.maxSpeed)),
            d) {
                let t = this.polePhase;
                this.polePhase = (this.polePhase + e / .95) % 1,
                t < .34 && this.polePhase >= .34 && (this.speed = a.min($_.maxSpeed, this.speed + 1.65 * Z(1 - this.speed / 52, .25, 1)),
                this.recoveryPushTime > 0 && (this.speed += a.min(3, a.max(0, 13 - this.speed))),
                this.recoveryPushTime = 0)
            } else
                this.poling < .02 && (this.polePhase = 0);
            let u = this.skid * this.speed * .1
              , f = this.speed / a.hypot(1, o);
            this.velocityZ = f * a.cos(this.travelHeading) - u * a.sin(this.travelHeading),
            this.velocityX = f * a.sin(this.travelHeading) + u * a.cos(this.travelHeading),
            this.lateral = this.edge * this.speed * .35 + u
        }
        this.topSpeed = a.max(this.topSpeed, this.speed * 3.6);
        let p = a.atan2(a.sin(this.travelHeading + this.skid * .72 - this.heading), a.cos(this.travelHeading + this.skid * .72 - this.heading));
        this.heading += p * (1 - a.exp(-12 * e));
        let m = this.x
          , h = this.z;
        this.collisionStart.set(this.x, this.y, this.z),
        this.x += this.velocityX * e,
        this.z += this.velocityZ * e,
        this.z = a.max(-22, this.z);
        let _ = ev(this.z);
        if (a.abs(this.x - _) > 126) {
            let t = a.sign(this.x - _);
            this.x = _ + t * 126;
            let n = this.velocityX - tv(this.z) * this.velocityZ;
            t * n > 0 && (this.velocityX -= n,
            this.speed *= a.exp(-e * 2.8))
        }
        if (!this.airborne && !this.rail && this.funnelToRail(e, t),
        !(!this.airborne && this.collideWithSnow())) {
            if (!this.airborne && !this.rail)
                for (let e of gv) {
                    let t = Zv(e, this.x, this.z);
                    if (t.t >= 0 && t.t <= 1 && a.abs(t.side) < e.width / 2 + .35 && this.y >= ny(e, t.t) - .4) {
                        this.mountRail(e, t.t, this.heading + this.spin + (this.switchStance ? a.PI : 0), this.spinVelocity);
                        break
                    }
                }
            if (this.rail)
                this.slide(e, t);
            else if (!this.airborne) {
                for (let e of hv)
                    if (h <= e.z && this.z > e.z && a.abs(this.x - ev(this.z) - e.offset) < e.width / 2 + 1 && this.speed > 7) {
                        let t = ev(this.z) + e.offset
                          , n = a.max(t - e.width / 2 + .6, a.min(t + e.width / 2 - .6, this.x));
                        if (this.y < $(n, e.z - .01) - 1)
                            continue;
                        let r = Iv(e, this.speed, this.charge, this.travelHeading)
                          , i = Kv(n, e.z - .01, this.heading)
                          , o = j(i.slope, this.spin, this.edge, new g, i.crossSlope);
                        this.y = $(this.x, e.z - .01),
                        this.takeoff(r.vertical, r.horizontal, `jump`, o),
                        this.velocityX += e.transfer * .22,
                        this.charge = 0;
                        break
                    }
                if (this.airborne || this.popOffKicker(m, h, t),
                this.airborne || this.leaveSnowEdge(t),
                !this.airborne && (this.y = $(this.x, this.z),
                t.jump && (this.charge = a.min(1, this.charge + e * 1.7)),
                !t.jump && this.jumpHeld)) {
                    let e = Hv(this.x, this.z, this.velocityX, this.velocityZ, this.charge);
                    this.takeoff(e.vertical, a.hypot(e.velocityX, e.velocityZ), `ground`),
                    this.velocityX = e.velocityX,
                    this.velocityZ = e.velocityZ,
                    this.travelHeading = a.atan2(this.velocityX, this.velocityZ),
                    this.charge = 0
                }
            }
            if (!(!this.airborne && this.collideWithPark())) {
                if (this.airborne) {
                    let r = !n;
                    if (r || (this.vy -= dy * e,
                    this.y += this.vy * e,
                    this.airTime += e,
                    this.jumpDistance += a.hypot(this.velocityX, this.velocityZ) * e),
                    this.collideWithSnow())
                        return;
                    if (!r) {
                        let e = cr($, hv, this.collisionStart, this);
                        e && (this.x = e.x,
                        this.y = e.y,
                        this.z = e.z)
                    }
                    let i = $(this.x, this.z)
                      , o = this.y <= i ? Kv(this.x, this.z, 0) : null
                      , s = o ? o.slope : $(this.x, this.z + .5) - $(this.x, this.z - .5)
                      , c = o ? o.crossSlope : $(this.x + .5, this.z) - $(this.x - .5, this.z)
                      , l = s * this.velocityZ + c * this.velocityX
                      , u = l - this.vy
                      , d = u > .1 ? a.max(0, this.y - i) / u : 1 / 0;
                    this.landingPrepare = Ev(a.max(0, this.landingPrepare), 1 - Q((d - .1) / .45), 14, e);
                    let f = a.abs(t.steer) > .06 ? Z(t.steer, -1, 1) : 0
                      , p = Number(t.forward && !(this.railPitchHeld & 1)) - Number(t.brake && !(this.railPitchHeld & 2));
                    this.airRotation.controlPitch(p, this.switchStance && !t.board, this.flipVelocity, this.rollVelocity);
                    let m = a.abs(t.airRoll ?? 0) > .06 ? Z(t.airRoll ?? 0, -1, 1) : 0;
                    this.spinTightness = Ev(this.spinTightness, a.abs(f), f ? 12 : 10, e),
                    this.airGrab = Ev(this.airGrab, +!!t.grab, 12, e);
                    let h = Tv(Ry, Tv(Hy, Uy, this.airGrab), this.spinTightness)
                      , g = f * h
                      , _ = p * h;
                    this.spinReversal = f * this.spinVelocity < 0 ? .12 : a.max(0, this.spinReversal - e),
                    (!p || a.sign(p) !== this.flipReversal) && (this.flipReversal = 0),
                    p * this.flipVelocity < -.12 && (this.flipReversal = a.sign(p)),
                    a.abs(_ - this.flipVelocity) < h * .05 && (this.flipReversal = 0),
                    this.spinVelocity = Gy(this.spinVelocity, g, e, this.spinReversal > 0 || this.flipReversal !== 0, this.flipReversal ? 3.2 : 28),
                    this.flipVelocity = Gy(this.flipVelocity, _, e, this.flipReversal !== 0, 3.2),
                    this.rollVelocity = Gy(this.rollVelocity, m * h, e, m * this.rollVelocity < 0, 5),
                    this.flipReversal && (this.spinVelocity = a.sign(this.spinVelocity) * a.min(a.abs(this.spinVelocity), a.abs(this.flipVelocity)));
                    let v = this.flipReversal ? Z(this.spinVelocity / h, -1, 1) : f;
                    this.spinWindup = Ev(this.spinWindup, v, f ? 17 : 8, e);
                    let y = this.flipReversal ? Z(this.flipVelocity / h, -1, 1) : p;
                    this.flipWindup = Ev(this.flipWindup, y, p ? 24 : 9, e),
                    this.flipTightness = Ev(this.flipTightness, a.abs(y), p ? 14 : 10, e),
                    !p && a.abs(this.flipVelocity) < .015 && (this.flipVelocity = 0),
                    !f && a.abs(this.spinVelocity) < .015 && (this.spinVelocity = 0),
                    this.spin += this.spinVelocity * e,
                    this.flip += this.flipVelocity * e,
                    !m && a.abs(this.rollVelocity) < .015 && (this.rollVelocity = 0),
                    t.cork && this.airTime <= .25 && (this.corkSet = !0);
                    let b = !!t.cork && this.corkSet;
                    this.airRotation.update(this.flipVelocity, this.spinVelocity, e, b, this.rollVelocity, !!t.over && b);
                    let x = !!(f || p || m || t.grab)
                      , S = c * a.sin(this.heading) + s * a.cos(this.heading)
                      , C = !x && gv.some(e => {
                        for (let t of [0, .25, .5, .75]) {
                            let n = Zv(e, this.x + this.velocityX * t, this.z + this.velocityZ * t);
                            if (n.t >= 0 && n.t <= 1 && a.abs(n.side) < e.width / 2 + .7 && this.y >= ny(e, n.t) - .1)
                                return !0
                        }
                        return !1
                    }
                    )
                      , w = a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 ? this.spinVelocity / Wy : 0
                      , T = this.airRotation.upright > .64 && a.abs(this.airRotation.flipAngle) < .5 && this.airRotation.inversions === 0 && !this.airRotation.corked && !p && !m && !t.cork && a.abs(this.flipVelocity) < .1 && a.abs(this.rollVelocity) < .1 && !C
                      , ee = t.grab && T
                      , te = !!(f || p || m)
                      , E = this.landingAssist.update(e, this.airOrientation, this.airRotation.landingYaw, C ? 0 : S, d, this.airRotation.speed, te || t.grab && !ee || this.airTime < .22 && this.vy > 0, C, C ? 0 : c * a.cos(this.heading) - s * a.sin(this.heading), w, ee);
                    if (this.airRotation.correct(E),
                    T && (a.abs(this.spinVelocity) > .5 || f) && E.x === 0 && E.y === 0 && E.z === 0) {
                        let t = Number.isFinite(d) ? a.max(0, a.min(1, (1.5 - d) / 1.2)) : 0;
                        this.airRotation.correct(this.airLevel.update(e, this.airOrientation, this.airRotation.landingYaw, this.airTime, C ? 0 : S, C ? 0 : c * a.cos(this.heading) - s * a.sin(this.heading), t))
                    }
                    t.grab && (this.grabTime += e),
                    this.grabLedger.update(e, t.grab, t.grabStyle ?? 0, !!t.board),
                    this.maxAir = a.max(this.maxAir, this.y - $(this.x, this.z)),
                    this.judgeAir(),
                    r || this.funnelInAir(e);
                    let ne = !r && this.landOnRail(this.vy >= 0);
                    if (!ne && this.collideWithPark())
                        return;
                    if (!ne && !r && this.y <= i) {
                        this.landingImpact = a.max(0, l - this.vy) / a.hypot(1, c, s),
                        this.y = i,
                        this.airborne = !1,
                        this.landing = 1,
                        this.lastJumpDistance = this.jumpDistance;
                        let e = this.airRotation.landingYaw
                          , t = a.abs(a.sin(e));
                        this.landingNormal.set(-c * a.cos(this.heading) + s * a.sin(this.heading), 1, -c * a.sin(this.heading) - s * a.cos(this.heading)).normalize();
                        let n = this.landingUp.set(0, 1, 0).applyQuaternion(this.airOrientation).dot(this.landingNormal)
                          , r = a.acos(Z(n, -1, 1))
                          , o = !this.butter.catchLanding(this, this.airOrientation, this.landingNormal) && n < .25 && (n < 0 || this.landingImpact > 3 || this.airTime > .3)
                          , u = this.landingImpact > 33 && this.airTime > .35
                          , d = o || u ? null : this.butter.landingFor(this)
                          , f = !o && !u && d !== `faceplant`
                          , p = !1;
                        if (f) {
                            this.judgeAir(!0),
                            this.lastScoreFactors = this.scoreFactors;
                            let n = a.round((e + w) / a.PI);
                            a.abs(n) % 2 == 1 && (this.switchStance = !this.switchStance,
                            this.airOrientation.multiply(this.stanceTurn.set(0, 1, 0, 0)));
                            let i = t >= .3 || Cn(this.airOrientation, this.landingNormal)
                              , o = !i && this.airTime > .65
                              , s = o && this.speed > 3 && this.velocityZ > .5 && l < -.15
                              , c = a.max(0, (this.speed * this.speed + this.vy * l) / (a.hypot(this.speed, l) || 1));
                            this.speed = Z(c * (o ? 1 : .975 - t * .065 - Z(r, 0, 1) * .045) + (s ? 2.6 : 0), 0, $_.maxSpeed),
                            this.landingBoost = s ? 2.2 : 0,
                            this.pushAirLink();
                            let u = _e(this.chainLinks)
                              , f = i ? pe(t) : 1;
                            f < 1 && this.lastScoreFactors && (this.lastScoreFactors = {
                                ...this.lastScoreFactors,
                                landing: f
                            });
                            let m = a.round(a.round(this.chainTricks * u) * f) + this.chainButter
                              , h = a.round(this.chainGrabs * u * f)
                              , g = a.round(this.chainRails * u * f)
                              , _ = o && this.chainLinks > 0 ? 450 + a.round((m - this.chainButter + h + g) * de) : 0;
                            this.lastScore = m + h + g + _,
                            this.score += this.lastScore,
                            this.runScore.tricks += m,
                            this.runScore.grabs += h,
                            this.runScore.rails += g,
                            this.runScore.landings += _;
                            for (let e of this.chainRepeatKeys)
                                this.trickTally.set(e, (this.trickTally.get(e) ?? 0) + 1);
                            let v = this.chain.join(` → `);
                            this.landedJumps++,
                            this.cleanLandings += Number(o),
                            this.totalAirTime += this.airTime,
                            this.lastScore > this.bestCombo && (this.bestCombo = this.lastScore,
                            this.bestTrick = v || `STRAIGHT AIR`),
                            this.landingSpin = $y(e, n * a.PI),
                            this.landingFlip = r * (a.sign(this.landingUp.z) || 1),
                            p = d === `press` && this.butter.pressLanding(this, this.landingImpact),
                            this.spin = this.landingSpin,
                            this.spinVelocity = p ? this.butter.velocity : Z(this.spinVelocity, -3, 3),
                            this.landingSettling = !p,
                            this.notice = this.lastScore > 0 ? v ? `${i ? `SAVED IT` : `STOMPED`}. ${v}` : o ? `CLEAN LANDING` : `` : ``,
                            this.noticeTime = this.notice ? 3 : 0,
                            this.event = `land`,
                            this.clearChain()
                        } else
                            d === `faceplant` ? this.faceplant() : this.beginCrash(this.landingImpact, u && !o);
                        this.vy = 0,
                        this.flip = 0,
                        this.trick = ``,
                        this.rollVelocity = 0,
                        this.flipVelocity = 0,
                        this.flipTightness = 0,
                        this.spinTightness = 0,
                        this.landingPrepare = 1,
                        p && this.butter.pose(this)
                    }
                }
                if (!this.airborne && !n && this.landingSettling && !this.grind && this.crashTime <= 0) {
                    j(Gv(this.x, this.z, this.heading), this.spin, this.edge, this.groundTarget, Gv(this.x, this.z, this.heading + a.PI / 2));
                    let t = f(this.airOrientation, this.groundTarget);
                    c(this.airOrientation, this.groundTarget, a.min(8 * e, t * (1 - a.exp(-18 * e)))),
                    t < .035 && a.abs(this.spin) < .002 && a.abs(this.spinVelocity) < .02 && (this.landingSettling = !1,
                    this.spin = 0,
                    this.spinVelocity = 0)
                }
                this.jumpHeld = t.jump,
                this.z >= 650 && this.crashTime <= 0 && (this.z = 650,
                this.phase = `finished`,
                this.speed = 0,
                this.runs++)
            }
        }
    }
}
  , tb = e({
    AIR_ANGLE: () => Zb,
    AIR_GRAVITY: () => Db,
    AIR_RATE: () => Qb,
    AIR_REACH: () => Xb,
    AIR_WINDOW: () => $b,
    BRANCHES: () => dx,
    COURSE_LENGTH: () => ex,
    COURSE_WIDTH: () => ix,
    FINISH_HALF_WIDTH: () => nx,
    FINISH_Z: () => tx,
    FLAT_SLAM: () => Bb,
    FLIP_RATE: () => Ub,
    FORWARD_TUCK_SPEED: () => Kb,
    FORWARD_TUCK_TIME: () => Gb,
    FUNNEL_ANGLE: () => Jb,
    FUNNEL_PULL: () => Yb,
    FUNNEL_REACH: () => qb,
    GRAB_SPIN_RATE: () => Wb,
    JIB_PLATFORMS: () => Ex,
    JIB_SECTIONS: () => gx,
    JUMPS: () => mx,
    KICKER_BACK: () => Px,
    LANDMARKS: () => Dx,
    LIFT_DURATION: () => sx,
    LIFT_SPEED: () => ax,
    LIFT_TOWER_SPACING: () => ox,
    MAP_ID: () => jx,
    MAP_NAME: () => Ax,
    MAP_VISUALS: () => kx,
    PARK_ENTRY_Z: () => rx,
    POP_CATCH: () => Tb,
    POP_CLEAR: () => Cb,
    POP_GAP: () => xb,
    POP_KICK: () => wb,
    POP_STEP: () => Sb,
    RAILS: () => hx,
    RAIL_ART_URL: () => Mx,
    RAIL_LIP: () => bb,
    RAIL_SPIN_RATE: () => Hb,
    ROLLERS: () => vx,
    SNOW_FORMS: () => yx,
    SPIN_RATE: () => Vb,
    SkiSimulation: () => rb,
    UP_RUN: () => _b,
    UP_START: () => gb,
    ZONES: () => bx,
    barUnder: () => Nx,
    baseHeight: () => ux,
    branchOffset: () => fx,
    cabinTravel: () => Rb,
    center: () => cx,
    clamp: () => ib,
    climbsOut: () => vb,
    courseTangent: () => lx,
    damp: () => ob,
    groundHeight: () => Pb,
    groundPop: () => ub,
    jibGrooming: () => Ab,
    jibLips: () => kb,
    jibSectionCenter: () => _x,
    jumpCenter: () => cb,
    jumpStyle: () => sb,
    lerp: () => ab,
    liftX: () => Lb,
    lineDistance: () => px,
    mountainHeight: () => Ib,
    parkGrooming: () => Nb,
    popLine: () => Eb,
    railBend: () => Cx,
    railCrest: () => Ob,
    railFrame: () => hb,
    railHeading: () => pb,
    railHeadingAt: () => wx,
    railLipRun: () => Sx,
    railPoint: () => mb,
    railPopGap: () => Tx,
    railTop: () => yb,
    rampHeight: () => jb,
    rampLaunch: () => lb,
    replayLift: () => Ox,
    riderSurface: () => fb,
    sculptedSnow: () => Mb,
    snowGrade: () => db,
    snowSurface: () => xx,
    terrainHeight: () => Fb,
    zoneAt: () => zb
})
  , nb = S ? yr : x ? zo : T ? Tm : w ? wv : b ? yg : $c
  , rb = nb.SkiSimulation
  , {clamp: ib, lerp: ab, damp: ob, jumpStyle: sb, jumpCenter: cb, rampLaunch: lb, groundPop: ub, snowGrade: db, riderSurface: fb, railHeading: pb, railPoint: mb, railFrame: hb, UP_START: gb, UP_RUN: _b, climbsOut: vb, railTop: yb, RAIL_LIP: bb, POP_GAP: xb, POP_STEP: Sb, POP_CLEAR: Cb, POP_KICK: wb, POP_CATCH: Tb, popLine: Eb, AIR_GRAVITY: Db, railCrest: Ob, jibLips: kb, jibGrooming: Ab, rampHeight: jb, sculptedSnow: Mb, parkGrooming: Nb, groundHeight: Pb, terrainHeight: Fb, mountainHeight: Ib, liftX: Lb, cabinTravel: Rb, zoneAt: zb, FLAT_SLAM: Bb, SPIN_RATE: Vb, RAIL_SPIN_RATE: Hb, FLIP_RATE: Ub, GRAB_SPIN_RATE: Wb, FORWARD_TUCK_TIME: Gb, FORWARD_TUCK_SPEED: Kb, FUNNEL_REACH: qb, FUNNEL_ANGLE: Jb, FUNNEL_PULL: Yb, AIR_REACH: Xb, AIR_ANGLE: Zb, AIR_RATE: Qb, AIR_WINDOW: $b, COURSE_LENGTH: ex, FINISH_Z: tx, FINISH_HALF_WIDTH: nx, PARK_ENTRY_Z: rx, COURSE_WIDTH: ix, LIFT_SPEED: ax, LIFT_TOWER_SPACING: ox, LIFT_DURATION: sx, center: cx, courseTangent: lx, baseHeight: ux, BRANCHES: dx, branchOffset: fx, lineDistance: px, JUMPS: mx, RAILS: hx, JIB_SECTIONS: gx, jibSectionCenter: _x, ROLLERS: vx, SNOW_FORMS: yx, ZONES: bx} = nb
  , xx = S ? vi : x ? fc : T ? xh : w ? Dy : b ? S_ : z
  , Sx = e => x ? Ss(e) : b ? $g(e) : Jl
  , Cx = (e, t) => x ? ds(e, t) : 0
  , wx = (e, t) => x ? ps(e, t) : nb.railHeading(e)
  , Tx = e => x ? Ds(e) : b ? i_(e) : Yl
  , Ex = x ? $a : b ? mg : []
  , Dx = x ? Oo : []
  , Ox = e => x && e === `forestline-v1` ? Ja : null
  , kx = {
    halfpipe: S,
    forestLine: x,
    surfaceLift: C,
    pineForest: w || x,
    openAlpine: S || x || b || T || w,
    powder: T,
    bigAir: w
}
  , Ax = isRidgeline ? `RIDGELINE` : S ? `ASPEN PIPE` : x ? `FOREST LINE` : w ? `BIG AIR` : T ? `SHIRAKUMO` : b ? `APEX` : `NORDRYGGEN`
  , jx = y.id
  , Mx = S ? null : x ? `/models/forest-line/rails-v1.glb` : T || w ? null : b ? Zh : `/models/rails-v2.glb`;
function Nx(e, t, n) {
    for (let r of hx) {
        let i = hb(r, e, t);
        if (i.t < -.05 || i.t > 1.05 || Math.abs(i.side) >= .8)
            continue;
        let a = ib(i.t, 0, 1)
          , o = mb(r, a)
          , s = wx(r, a)
          , c = Math.max(0, a - .01)
          , l = Math.min(1, a + .01);
        return n.x = o.x,
        n.y = yb(r, a),
        n.z = o.z,
        n.sin = Math.sin(s),
        n.cos = Math.cos(s),
        n.grade = (yb(r, l) - yb(r, c)) / ((l - c) * r.length),
        n.build = r.build,
        n.width = r.width,
        n
    }
}
var Px = p_;
export {Z_ as $, ne as $n, pa as $t, vb as A, _e as An, pf as At, Ob as B, ae as Bn, Qi as Bt, tb as C, be as Cn, cf as Ct, Rb as D, fe as Dn, Uf as Dt, fx as E, me as En, jf as Et, cb as F, Te as Fn, xd as Ft, yb as G, S as Gn, mo as Gt, pb as H, b as Hn, ya as Ht, Lb as I, ke as In, Id as It, xx as J, ee as Jn, Qa as Jt, Ox as K, T as Kn, Ma as Kt, px as L, Ae as Ln, Nd as Lt, ob as M, Ce as Mn, tf as Mt, Pb as N, he as Nn, Td as Nt, cx as O, de as On, Of as Ot, _x as P, we as Pn, wd as Pt, hv as Q, ie as Qn, Aa as Qt, Ib as R, y as Rn, jd as Rt, _b as S, Je as Sn, op as St, ux as T, ce as Tn, Wf as Tt, Sx as U, w as Un, va as Ut, hb as V, te as Vn, sa as Vt, mb as W, x as Wn, ja as Wt, zb as X, E as Xn, Oo as Xt, Fb as Y, v as Yn, ca as Yt, wv as Z, re as Zn, la as Zt, rx as _, Pe as _n, am as _t, tx as a, Ea as an, Tp as at, bb as b, Ze as bn, dp as bt, mx as c, yr as cn, V as ct, sx as d, xn as dn, Hp as dt, $i as en, X_ as et, ax as f, vn as fn, cm as ft, kx as g, Ne as gn, sm as gt, Ax as h, je as hn, fm as ht, nx as i, ka as in, wp as it, lx as j, se as jn, mf as jt, ib as k, le as kn, Bf as kt, Px as l, En as ln, B as lt, jx as m, ft as mn, om as mt, ex as n, M as nn, yg as nt, Ex as o, Ji as on, Ep as ot, ox as p, dt as pn, dm as pt, fb as q, C as qn, $a as qt, ix as r, Ta as rn, Cp as rt, gx as s, j as sn, Op as st, dx as t, Za as tn, Q_ as tt, Dx as u, bn as un, Yp as ut, hx as v, Me as vn, im as vt, Nx as w, ue as wn, Ff as wt, rb as x, Ye as xn, yp as xt, Mx as y, D as yn, Sm as yt, Cx as z, oe as zn, zo as zt};
