import {I as e, O as t, Y as n, _ as r, a as i, at as a, f as o, ft as s, g as c, h as l, i as u, j as d, k as f, n as p, ot as m, p as h} from "./active-course-BUb4R-L7.js";
import {P as g, v as _, x as v} from "./rider-appearance-Cs5aq3V7.js";
import {$ as y, C as b, D as ee, E as te, G as ne, H as re, K as ie, L as ae, M as oe, P as se, S as ce, V as le, _ as ue, ct as de, et as fe, g as x, i as pe, j as me, n as he, st as ge, t as _e, v as ve, xt as ye} from "./rider-outfit-BI9AmbRj.js";
import {A as be, D as xe, Gt as S, I as C, It as w, M as T, Mt as E, P as D, Q as Se, Tn as O, Xt as k, Y as A, _t as Ce, an as j, bt as we, dt as Te, jt as M, pn as Ee, rt as N, un as P, vt as F} from "./replay-Bo7bmJ9f.js";
import {c as De, f as Oe, l as ke, o as Ae, u as je} from "./rider-environment-CWsYLVtD.js";
function I(e) {
    let t = [];
    return e.traverse(e => {
        if (!(e instanceof P))
            return;
        let n = e.skeleton
          , r = t.find(e => e === n || e.bones.length === n.bones.length && e.bones.every( (e, t) => e === n.bones[t]) && e.boneInverses.every( (e, t) => e.equals(n.boneInverses[t])));
        if (!r) {
            t.push(n);
            return
        }
        r !== n && (e.bind(r, e.bindMatrix),
        n.dispose())
    }
    ),
    t.length
}
function L(e, t=!1) {
    e.matrixAutoUpdate && e.updateMatrix(),
    (e.matrixWorldNeedsUpdate || t) && (e.matrixWorldAutoUpdate && (e.parent === null ? e.matrixWorld.copy(e.matrix) : e.matrixWorld.multiplyMatrices(e.parent.matrixWorld, e.matrix)),
    e.matrixWorldNeedsUpdate = !1,
    t = !0),
    e instanceof P && (e.bindMode === `attached` ? e.bindMatrixInverse.copy(e.matrixWorld).invert() : e.bindMode === `detached` && e.bindMatrixInverse.copy(e.bindMatrix).invert());
    let n = e.children;
    for (let e = 0; e < n.length; e++)
        n[e].visible && L(n[e], t)
}
var R = 4.4
  , z = c.powder ? -24 : 0
  , B = c.powder ? a : p
  , V = (c.powder ? [z, ...m, B] : [...Array.from({
    length: Math.ceil(p / h)
}, (e, t) => t * h), p]).map(t => {
    let r = f(Math.min(t, p - t) / 150, 0, 1)
      , i = c.surfaceLift ? 8 : c.powder ? t === z || t === B ? R + .2 : 86 : 4.45 + r * r * (3 - 2 * r) * (19.5 + 1.8 * Math.sin(t * .0028) ** 2)
      , a = e(t);
    return {
        x: a,
        y: (c.powder ? s(a, t) : n(a, t)) + i,
        z: t,
        height: i
    }
}
);
if (c.surfaceLift)
    for (let t = 0; t < V.length - 1; t++) {
        let r = V[t]
          , i = V[t + 1]
          , a = 0;
        for (let t = r.z; t <= i.z; t++) {
            let o = (t - r.z) / (i.z - r.z)
              , s = r.y * (1 - o) + i.y * o - .25 * 4 * o * (1 - o);
            for (let r of [-3, 3])
                a = Math.max(a, n(e(t, r), t) + 7 - s)
        }
        for (let e of [r, i])
            e.y += a,
            e.height += a
    }
if (c.powder) {
    let e = V[1];
    e.y = V[0].y - .5,
    e.height = e.y - s(e.x, e.z);
    for (let e = 0; e < V.length - 1; e++) {
        let t = V[e]
          , n = V[e + 1]
          , r = e === V.length - 2
          , i = e === 0 ? 0 : r ? 1 : 8
          , a = 0;
        for (let e = t.z + 2; e < n.z; e += 2) {
            let o = (e - t.z) / (n.z - t.z)
              , c = t.x + (n.x - t.x) * o
              , l = .15 + 7.85 * f((Math.min(e - z, B - e) - 65) / 130, 0, 1)
              , u = Math.max(...[-6, 0, 6].map(t => s(c + t, e))) + R + l;
            a = Math.max(a, (u - (t.y * (1 - o) + n.y * o - i * 4 * o * (1 - o))) / (r ? 1 - o : o))
        }
        if (a > 0) {
            let e = r ? t : n;
            e.y += a,
            e.height += a
        }
    }
}
function H(e) {
    let t = V[e]
      , n = V[Math.max(0, e - 1)]
      , r = V[Math.min(V.length - 1, e + 1)];
    return ((t.y - n.y) / Math.max(1, t.z - n.z) + (r.y - t.y) / Math.max(1, r.z - t.z)) * .5
}
var Me = () => [...new Set([...Array.from({
    length: Math.ceil((B - z) / 8) + 1
}, (e, t) => Math.min(B, z + t * 8)), ...V.flatMap( (e, t) => t && t < V.length - 1 ? [-3.4, -2.4, -.8, 0, .8, 2.4, 3.4].map(t => e.z + t) : [e.z])])].sort( (e, t) => e - t);
function U(t, n=0) {
    t = f(t, z, B);
    let r = Math.min(V.length - 2, c.powder ? Math.max(0, V.findIndex( (e, n) => n < V.length - 1 && t <= V[n + 1].z)) : Math.floor(t / h))
      , i = V[r]
      , a = V[r + 1];
    if (c.powder) {
        let o = H(r)
          , s = H(r + 1)
          , c = i.z + (r ? 3.4 : 0)
          , l = a.z - (r + 1 < V.length - 1 ? 3.4 : 0)
          , u = i.y + o * (c - i.z)
          , d = a.y + s * (l - a.z)
          , p = f((t - c) / (l - c), 0, 1)
          , m = (r === 0 ? 0 : r === V.length - 2 ? 1 : 8) * 4 * p * (1 - p)
          , h = t < c ? i.y + o * (t - i.z) : t > l ? a.y + s * (t - a.z) : u + (d - u) * p - m;
        return {
            x: e(t) + n,
            y: h,
            z: t
        }
    }
    let o = (t - i.z) / (a.z - i.z)
      , s = r === 0 || r === V.length - 2
      , l = (c.surfaceLift ? .25 : s ? .75 : 2.1) * 4 * o * (1 - o);
    return {
        x: i.x + (a.x - i.x) * o + n,
        y: i.y + (a.y - i.y) * o - l,
        z: t
    }
}
function W(e, t=`#f5783e`, n=1.5) {
    let r = new N;
    r.name = `Safety net`;
    let i = new Te(new T(.08,n,.08),new w({
        color: t,
        roughness: .84
    }),e.length)
      , a = new M;
    e.forEach( (e, t) => i.setMatrixAt(t, a.makeTranslation(e.x, e.y + n / 2, e.z))),
    i.castShadow = i.receiveShadow = !0,
    i.computeBoundingSphere(),
    r.add(i);
    let o = [];
    for (let t = 1; t < e.length; t++) {
        let r = e[t - 1]
          , i = e[t];
        for (let e = .3; e <= n - .15; e += .15)
            o.push(r.x, r.y + e, r.z, i.x, i.y + e, i.z);
        let a = Math.ceil(r.distanceTo(i) / .22);
        for (let e = 0; e <= a; e++) {
            let t = r.clone().lerp(i, e / a);
            o.push(t.x, t.y + .3, t.z, t.x, t.y + n - .15, t.z)
        }
    }
    let s = new D;
    return s.setAttribute(`position`, new Se(o,3)),
    r.add(new we(s,new F({
        color: t,
        transparent: !0,
        opacity: .7
    }))),
    r
}
var Ne = (e, t) => Math.atan2(t.x - e.x, t.z - e.z)
  , Pe = `#15323b`
  , Fe = `#f2f1e8`
  , G = `#f5783e`
  , K = new w({
    color: `#243a41`,
    roughness: .66,
    metalness: .4
})
  , q = new w({
    color: G,
    roughness: .85
})
  , J = new WeakSet([K, q])
  , Ie = new WeakMap;
function Y(e, t, n, r, i, a, o, s=K) {
    let c = new E(new T(t,n,r),s);
    return c.position.set(i, a, o),
    c.castShadow = !0,
    c.receiveShadow = !0,
    e.add(c),
    c
}
function Le(e, t, n) {
    let r = new N;
    Y(r, t + .07, n + .07, .065, 0, 0, 0);
    let i = Ie.get(e);
    i || (Ie.set(e, i = new w({
        map: e,
        roughness: .82,
        side: 0
    })),
    J.add(i));
    let a = new E(new S(t,n),i);
    return a.position.z = .037,
    r.add(a),
    r
}
function Re(e, r) {
    let i = new N
      , a = t(r)
      , o = n(a, r)
      , s = Math.atan(d(r));
    i.name = `park-entrance-fallback`,
    i.position.set(a, o, r),
    i.rotation.y = s;
    let c = 5.65
      , u = 1.25;
    for (let e of [-1, 1]) {
        let t = e * 12
          , l = n(a + Math.cos(s) * t, r - Math.sin(s) * t) - o;
        for (let e of [-.44, .44])
            Y(i, .16, c + u - l, .16, t, (c + u + l) / 2, e);
        Y(i, .85, 1.65, 1.12, t, l + .825, 0, q),
        Y(i, .85, .12, 1.2, t, l + .02, 0);
        for (let e = l + 1.9; e < c + u; e += .8)
            Y(i, .2, .1, 1.04, t, e, 0)
    }
    Y(i, 24.9, u + .12, 1, 0, c + u / 2, 0);
    for (let e of [!1, !0]) {
        let t = document.createElement(`canvas`);
        t.width = 2048,
        t.height = Math.round(t.width * u / 23.5);
        let n = t.getContext(`2d`);
        n.fillStyle = Pe,
        n.fillRect(0, 0, t.width, t.height),
        n.fillStyle = G,
        n.fillRect(0, t.height * .92, t.width, t.height * .08),
        n.fillStyle = Fe,
        n.textAlign = `center`,
        n.textBaseline = `middle`,
        n.font = `900 ${t.height * .68}px Arial`,
        n.fillText(e ? `GOOD LINES ONLY` : `STEEZ8 / ${l}`, t.width / 2, t.height * .49);
        let r = new C(t);
        r.colorSpace = j,
        r.anisotropy = 4;
        let a = new E(new S(23.5,u),new w({
            map: r,
            side: 0
        }));
        a.rotation.y = e ? 0 : Math.PI,
        a.position.set(0, c + u / 2, e ? .506 : -.506),
        i.add(a)
    }
    e.add(i);
    for (let i of [-1, 1]) {
        let a = [];
        for (let e = 0; e < 5; e++) {
            let o = r - 18 + e * 6
              , s = t(o) + i * (12 + Math.abs(o - r) * .34);
            a.push(new O(s,n(s, o),o))
        }
        e.add(W(a, G))
    }
    return i
}
function ze() {
    if (c.bigAir)
        return [];
    let e = t(p);
    return [-1, 1].map(t => ({
        center: new O(e + t * 28,n(e + t * 28, p) + .6,p - 3),
        size: new O(.12,1.2,50)
    }))
}
function Be(r) {
    for (let t of c.surfaceLift ? [p] : [0, p]) {
        let i = e(t)
          , a = n(i, t)
          , o = (e, n, o, s, c, l, u) => r.addBox(`terminal-${t}-${e}`, new O(i + n,a + o,t + s), new O(c,l,u));
        o(`house`, -10, 2.34, 0, 7.7, 4.15, 16.7),
        o(`plinth`, -10, .25, 0, 7.9, .6, 17),
        o(`canopy`, -3, 6.32, 0, 20, 1.18, 22);
        for (let e of [-5.9, 5.8])
            for (let t of [-7.7, 7.7])
                o(`column-${e}-${t}`, e, 3.05, t, .36, 5.8, .4),
                o(`footing-${e}-${t}`, e, .18, t, 1.25, .45, 1.25)
    }
    for (let e of [-1, 1]) {
        let a = t(i) + e * u
          , o = n(a, i);
        r.addBox(`finish-marker-${e}`, new O(a,o + 2.2,i), new O(1.6,4.4,1.2))
    }
}
var X = () => {
    let e = c.bigAir ? i + 25 : p + 8
      , r = t(e) + (c.bigAir ? 44 : 17);
    return new O(r,n(r, e) + .045,e)
}
;
function Z(e, t=`STEEZ8`, n=8) {
    let r = document.createElement(`canvas`);
    r.width = e === `wall` ? 1024 : 2048,
    r.height = e === `wall` ? 512 : Math.round(r.width / n);
    let i = r.getContext(`2d`);
    if (i.fillStyle = `#13212b`,
    i.fillRect(0, 0, r.width, r.height),
    i.textAlign = `center`,
    i.textBaseline = `middle`,
    e === `wall`)
        for (let e = 0; e < 4; e++)
            for (let t = -1; t < 5; t++) {
                let n = t * 265 + (e % 2 ? 130 : 0) + 70
                  , r = e * 128 + 47;
                i.fillStyle = `#ecede4`,
                i.font = `italic 900 42px Arial`,
                i.fillText(`STEEZ8`, n, r),
                i.fillStyle = `#ea7954`,
                i.fillRect(n - 67, r + 28, 134, 3),
                i.fillStyle = `#8fa8b3`,
                i.font = `bold 11px Arial`,
                i.fillText(l.split(``).join(` `), n, r + 45)
            }
    else
        i.fillStyle = `#f0eee6`,
        i.font = `italic 900 ${r.height * .68}px Arial`,
        i.fillText(t, r.width / 2, r.height * .49),
        i.fillStyle = `#f17852`,
        i.fillRect(0, r.height * .92, r.width, r.height * .08);
    let a = new C(r);
    return a.colorSpace = j,
    a.anisotropy = 4,
    a
}
function Q(e, t, n) {
    return new E(new S(t,n),new w({
        map: e,
        roughness: .94,
        metalness: 0
    }))
}
function Ve(e, r=typeof document < `u`, a={
    halfWidth: u,
    scale: 1
}) {
    let o = new N;
    o.name = `Open finish line`,
    o.userData.noCollision = !0;
    for (let s of [-1, 1]) {
        let c = e?.clone(!0) ?? new N;
        if (!e) {
            let e = new E(new T(1.5,4.4,.7),new w({
                color: `#22383e`
            }));
            e.position.y = 2.2,
            c.add(e)
        }
        let l = t(i) + s * a.halfWidth;
        if (c.position.set(l, n(l, i), i),
        r)
            for (let e of [!1, !0]) {
                let t = document.createElement(`canvas`);
                t.width = 256,
                t.height = 768;
                let n = t.getContext(`2d`);
                n.fillStyle = `#efefe5`,
                n.fillRect(0, 0, 256, 768),
                n.translate(128, 384),
                n.rotate(-Math.PI / 2),
                n.fillStyle = `#13212b`,
                n.textAlign = `center`,
                n.textBaseline = `middle`,
                n.font = `900 104px Arial`,
                n.fillText(e ? `STEEZ8` : `FINISH`, 0, 0, 660);
                let r = new C(t);
                r.colorSpace = j;
                let i = Q(r, 1.23, 2.7);
                i.position.set(0, 2.7, e ? .39 : -.39),
                i.rotation.y = e ? 0 : Math.PI,
                c.add(i)
            }
        c.scale.setScalar(a.scale),
        o.add(c)
    }
    return o
}
function He(e) {
    e.updateMatrixWorld(!0);
    let t = new Map;
    return e.traverse(e => {
        if (!e.userData.venueComponent || e.userData.venueComponent === `FinishFence`)
            return;
        let n = new N;
        n.name = e.userData.venueComponent;
        let r = e.matrixWorld.clone().invert();
        e.traverse(e => {
            if (e instanceof E) {
                let t = new E(e.geometry.clone().applyMatrix4(r.clone().multiply(e.matrixWorld)),e.material);
                t.castShadow = t.receiveShadow = !0,
                n.add(t)
            }
        }
        ),
        t.set(n.name, n)
    }
    ),
    t
}
function Ue(e, t) {
    let n = new N;
    if (n.position.copy(X()),
    n.rotation.y = Math.PI,
    n.add(e.get(`InterviewWall`).clone(!0)),
    t) {
        let e = Q(Z(`wall`), 6.5, 3.4);
        e.position.set(0, 1.75, -.888),
        n.add(e)
    }
    let r = e.get(`TVCamera`).clone(!0);
    return r.position.set(2.3, 0, 3.5),
    r.rotation.y = Math.PI + .45,
    n.add(r),
    n
}
function We(e, t=typeof document < `u`) {
    let n = He(e);
    for (let e of [`InterviewWall`, `TVCamera`])
        if (!n.has(e))
            throw Error(`Venue missing ${e}`);
    return Ue(n, t)
}
function Ge(i, a=typeof document < `u`, s={
    terminals: !0
}) {
    let u = He(i);
    for (let e of [`TerminalBuilding`, `TerminalWheel`, `InterviewWall`, `TVCamera`, `StartPortal`, `FinishPylon`])
        if (!u.has(e))
            throw Error(`Venue missing ${e}`);
    let f = new N;
    f.name = `STEEZ8 terminals and finish`;
    let m = u.get(`StartPortal`).clone(!0)
      , h = r;
    if (m.position.set(t(h), n(t(h), h), h),
    m.rotation.y = Math.atan(d(h)),
    a)
        for (let e of [!1, !0]) {
            let t = Q(Z(`banner`, e ? `GOOD LINES ONLY` : `STEEZ8 / ${l}`, 22.4 / .94), 22.4, .94);
            t.position.set(0, 6.275, e ? .455 : -.455),
            t.rotation.y = e ? 0 : Math.PI,
            m.add(t)
        }
    f.add(m, Ve(u.get(`FinishPylon`), a));
    let g = [];
    for (let t of s.terminals ? [0, p] : s.baseTerminal ? [p] : []) {
        let r = e(t)
          , i = n(r, t)
          , o = u.get(`TerminalBuilding`).clone(!0);
        if (o.position.set(r, i, t),
        f.add(o),
        !c.surfaceLift) {
            let e = u.get(`TerminalWheel`).clone(!0);
            e.position.set(r, U(t).y, t),
            f.add(e),
            g.push(e)
        }
        if (a)
            for (let e of [-1, 1]) {
                let n = Q(Z(`banner`, c.surfaceLift ? `${l} / T-BAR` : t ? `NORD EXPRESS` : `STEEZ8 / SUMMIT`, 8.5 / .48), 8.5, .48);
                n.position.set(r - 3, i + 6.27, t + e * 11.035),
                n.rotation.y = e < 0 ? Math.PI : 0,
                f.add(n)
            }
        let s = Array.from({
            length: 33
        }, (e, n) => {
            let i = n / 32 * Math.PI;
            return new O(r + 3 * Math.cos(i),U(t).y,t + (t ? 1 : -1) * 3 * Math.sin(i))
        }
        );
        f.add(new Ce(new D().setFromPoints(s),new F({
            color: `#344952`
        })))
    }
    let _ = ze()
      , v = t(p)
      , y = (e, t, r, i) => {
        let a = Math.ceil(Math.hypot(r - e, i - t) / 6)
          , o = Array.from({
            length: a + 1
        }, (o, s) => {
            let c = e + (r - e) * s / a
              , l = t + (i - t) * s / a;
            return new O(c,n(c, l),l)
        }
        );
        f.add(W(o, `#20272b`))
    }
    ;
    for (let e of c.bigAir ? [] : [-1, 1])
        y(v + e * 28, p - 28, v + e * 28, p + 22);
    c.bigAir || y(v - 18, p + 22, v + 28, p + 22);
    let b = Ue(u, a);
    return f.add(b),
    {
        group: f,
        interview: b,
        solids: _,
        wheels: g,
        update(e) {
            for (let t of g)
                t.rotation.y = -e * o / 3
        }
    }
}
var Ke = new O(-.64,0,.12)
  , qe = -.1
  , Je = .81
  , $ = new k().setFromRotationMatrix(new M().makeBasis(new O(-1,0,0), new O(0,0,1), new O(0,1,0))).premultiply(new k().setFromAxisAngle(new O(0,0,1), qe))
  , Ye = new O(0,0,1)
  , Xe = new O(0,-1,0)
  , Ze = class {
    constructor(e, t, n) {
        this.group = new N,
        this.materials = [],
        this.shellSkins = new _e,
        this.helmetItem = `park`,
        this.pantsItem = `ripstop`,
        this.polesItem = `bmx-grip`,
        this.jacketItem = `park-shell`,
        this.skiItem = `park-twin`,
        this.bindingItem = `park-binding`,
        this.bootItem = `park-boot`,
        this.gloveItem = `park-mitten`,
        this.bones = new Map,
        this.rest = new Map,
        this.q = new k,
        this.parentQ = new k,
        this.a = new O,
        this.b = new O,
        this.c = new O,
        this.from = new O,
        this.to = new O,
        this.target = new O,
        this.bend = new O,
        this.middle = new O,
        this.poleGrip = new O,
        this.heldGrip = new O,
        this.board = null,
        this.onBoard = !1,
        this.gear = new Ae,
        this.model = ye(e),
        I(this.model),
        Oe(this.model),
        this.group.name = `Finish interview rider`,
        this.group.add(this.model),
        this.group.position.copy(X()),
        this.group.rotation.y = Math.PI;
        for (let[e,t,n,r] of [[-2, 3.1, 3, 22], [2, 2.3, 2, 8]]) {
            let i = new Ee(`#e9f1ff`,r,8,Math.PI / 3,.8,2);
            i.position.set(e, t, n),
            i.target.position.set(0, 1.2, 0),
            this.group.add(i, i.target)
        }
        this.model.traverse(e => {
            if (e instanceof be && this.bones.set(e.name, e),
            !(e instanceof E))
                return;
            let t = (Array.isArray(e.material) ? e.material : [e.material]).map(t => {
                let n = t.clone();
                return this.materials.push({
                    material: n,
                    slot: x(e),
                    original: `color` in t ? t.color.clone() : void 0
                }),
                n
            }
            );
            e.material = Array.isArray(e.material) ? t : t[0],
            e.castShadow = e.receiveShadow = !0,
            this.shellSkins.track(e),
            e.frustumCulled = !1
        }
        ),
        this.root = this.bones.get(`Root`),
        this.mixer = new xe(this.model);
        let r = t.find(e => e.name === `Idle`);
        r && this.mixer.clipAction(r).play(),
        this.mixer.update(0);
        for (let e of this.bones.values())
            this.rest.set(e, {
                position: e.position.clone(),
                rotation: e.quaternion.clone()
            });
        this.poleGrip.copy(this.bones.get(`Pole_R`).position);
        for (let e of [`Ski_L`, `Ski_R`, `Pole_L`, `Pole_R`]) {
            let t = this.bones.get(e);
            t && this.root.add(t)
        }
        this.setOutfit(n),
        this.update(0, 0)
    }
    setOutfit(e) {
        let t = v(e);
        for (let {material: e, slot: n, original: r} of this.materials)
            r && `color` in e && e.color.copy(r),
            pe(e, n, t);
        he(this.model, t),
        this.shellSkins.apply(t),
        this.helmetItem = t.helmetItem,
        ue(this.model, t, () => this.helmetItem),
        this.pantsItem = t.pantsItem,
        ve(this.model, t, () => this.pantsItem),
        this.polesItem = t.polesItem,
        re(this.model, t, () => this.polesItem),
        this.jacketItem = t.jacketItem,
        ie(this.model, t, () => this.jacketItem),
        this.skiItem = t.skiItem,
        ae(this.model, t, () => this.skiItem),
        this.bindingItem = t.bindingItem,
        oe(this.model, t, () => this.bindingItem),
        this.bootItem = t.bootItem,
        ee(this.model, t, () => this.bootItem),
        this.gloveItem = t.gloveItem,
        b(this.model, t, () => this.gloveItem),
        fe(this.model, t),
        de(this.model, t),
        this.onBoard = g(t),
        this.onBoard && !this.board && (this.board = De(),
        this.board.name = `Interview snowboard`,
        this.model.add(this.board),
        this.board.quaternion.copy($),
        this.board.position.copy(Ke).addScaledVector(new O(0,0,1).applyQuaternion($), Je),
        this.board.traverse(e => {
            e instanceof E && (e.frustumCulled = !1)
        }
        )),
        this.board && (this.board.visible = this.onBoard,
        je(this.board, _(t), t.boardItem)),
        this.onBoard ? this.gear.hide(this.model) : this.gear.restore()
    }
    aim(e, t, n, r) {
        this.from.subVectors(n, t).normalize(),
        this.to.subVectors(r, t).normalize(),
        this.q.setFromUnitVectors(this.from, this.to).multiply(e.getWorldQuaternion(new k)),
        e.parent.getWorldQuaternion(this.parentQ).invert(),
        e.quaternion.copy(this.parentQ.multiply(this.q)),
        e.updateWorldMatrix(!1, !0)
    }
    arm(e, t) {
        let n = this.bones.get(`Arm_` + e)
          , r = this.bones.get(`Elbow_` + e)
          , i = this.bones.get(`Hand_` + e);
        this.group.updateMatrixWorld(!0),
        n.getWorldPosition(this.a),
        r.getWorldPosition(this.b),
        i.getWorldPosition(this.c),
        this.target.copy(t),
        this.model.localToWorld(this.target);
        let a = this.a.distanceTo(this.b)
          , o = this.b.distanceTo(this.c)
          , s = this.to.subVectors(this.target, this.a).normalize().clone()
          , c = Math.min(this.a.distanceTo(this.target), (a + o) * .985)
          , l = (a * a - o * o + c * c) / (2 * c);
        this.bend.set(e === `L` ? -.34 : .35, 1.13, -.06),
        this.model.localToWorld(this.bend),
        this.bend.sub(this.a),
        this.bend.addScaledVector(s, -this.bend.dot(s)).normalize(),
        this.middle.copy(this.a).addScaledVector(s, l).addScaledVector(this.bend, Math.sqrt(Math.max(0, a * a - l * l))),
        this.aim(n, this.a, this.b, this.middle),
        r.getWorldPosition(this.b),
        i.getWorldPosition(this.c),
        this.aim(r, this.b, this.c, this.target)
    }
    update(e, t) {
        for (let[e,t] of this.rest)
            e.position.copy(t.position),
            e.quaternion.copy(t.rotation);
        this.mixer.update(e),
        this.model.updateWorldMatrix(!0, !0);
        let n = .007 * Math.sin(t * 1.1)
          , r = .004 * Math.sin(t * 1.9);
        this.onBoard ? (this.arm(`L`, new O(-.36 + n,1.1 + r,.14)),
        this.arm(`R`, new O(.3 + n,.93 + r,.06)),
        this.gear.hide(this.model)) : (this.arm(`L`, new O(-.32 + n,1.12 + r,.16)),
        this.arm(`R`, new O(.34 + n,.94 + r,.19)));
        for (let[e,t] of [`Ski_L`, `Ski_R`].entries()) {
            let i = this.bones.get(t);
            i.position.set(-.36 - e * .145 + n, 1.015 + r, .2 - e * .018),
            i.quaternion.setFromEuler(new A(-Math.PI / 2,0,Math.PI + .025))
        }
        this.heldGrip.copy(this.poleGrip),
        this.bones.get(`Hand_R`).localToWorld(this.heldGrip),
        this.root.worldToLocal(this.heldGrip),
        this.heldGrip.y -= .025;
        for (let[e,t] of [`Pole_L`, `Pole_R`].entries()) {
            let n = this.bones.get(t);
            n.position.copy(this.heldGrip).add(new O((e - .5) * .03,0,0)),
            n.quaternion.setFromEuler(new A(-.17,0,.31 + e * .09))
        }
        this.bones.get(`Head`).quaternion.multiply(new k().setFromEuler(new A(.015 * Math.sin(t * .73),.06 + .025 * Math.sin(t * .46),0))),
        this.model.updateMatrixWorld(!0)
    }
    neutral() {
        this.board && (this.board.visible = !1);
        for (let[e,t] of this.rest)
            e.position.copy(t.position),
            e.quaternion.copy(t.rotation);
        this.mixer.update(0),
        this.model.updateWorldMatrix(!0, !0),
        this.arm(`L`, new O(-.3,.93,.05)),
        this.arm(`R`, new O(.3,.93,.05)),
        this.model.updateMatrixWorld(!0)
    }
    stance(e, t) {
        if (e.bare && e.poles && !this.polesShown()) {
            this.stance(e.bare, t);
            return
        }
        if (this.group.rotation.y = 0,
        this.update(0, t),
        !this.onBoard)
            if (e.handL && this.arm(`L`, new O(...e.handL)),
            e.handR && this.arm(`R`, new O(...e.handR)),
            this.model.updateMatrixWorld(!0),
            e.skis && this.place([`Ski_L`, `Ski_R`], e.skis, Ye, Math.PI),
            e.poles)
                this.place([`Pole_L`, `Pole_R`], e.poles, Xe, 0);
            else {
                this.heldGrip.copy(this.poleGrip),
                this.bones.get(`Hand_R`).localToWorld(this.heldGrip),
                this.root.worldToLocal(this.heldGrip),
                this.heldGrip.y -= .025;
                for (let[e,t] of [`Pole_L`, `Pole_R`].entries())
                    this.bones.get(t).position.copy(this.heldGrip).add(this.a.set((e - .5) * .03, 0, 0))
            }
        let n = this.bones.get(`Head`);
        n.quaternion.multiply(this.q.setFromEuler(new A(.015 * Math.sin(t * .73),.06 + .025 * Math.sin(t * .46),0)).invert()),
        this.model.updateMatrixWorld(!0);
        let r = this.a.set(1, 0, 0).transformDirection(this.model.matrixWorld)
          , i = this.b.set(0, 1, 0).transformDirection(this.model.matrixWorld)
          , a = n.getWorldQuaternion(new k).premultiply(new k().setFromAxisAngle(r, e.head[1])).premultiply(new k().setFromAxisAngle(i, e.head[0]));
        n.quaternion.copy(n.parent.getWorldQuaternion(this.parentQ).invert().multiply(a)),
        this.group.rotation.y = e.yaw,
        this.group.updateMatrixWorld(!0)
    }
    headTop(e=new O) {
        return this.bones.get(`Head`).getWorldPosition(e).add(this.c.set(0, .2, 0))
    }
    place(e, t, n, r) {
        let i = new k().setFromUnitVectors(n, this.a.set(...t.dir).normalize()).multiply(new k().setFromAxisAngle(n, r + (t.roll ?? 0)));
        for (let[n,r] of e.entries()) {
            let e = this.bones.get(r);
            e.position.set(t.at[0] + n * t.step[0], t.at[1] + n * t.step[1], t.at[2] + n * t.step[2]),
            e.quaternion.copy(i)
        }
    }
    polesShown() {
        let e = !1;
        return this.model.traverseVisible(t => {
            t instanceof E && x(t) === `POLES` && (e = !0)
        }
        ),
        e
    }
    frame(e, t, n, r) {
        let i = r ? 37 : 32
          , a = r ? 3.6 : 3.35
          , o = r ? 0 : Math.tan(i * Math.PI / 360) * a * n * .48;
        return e.set(o, 1.53, a),
        t.set(o, r ? 1.15 : 1.38, 0),
        this.group.localToWorld(e),
        this.group.localToWorld(t),
        i
    }
    dispose() {
        this.board &&= (ke(this.board),
        null),
        ge(this.model),
        y(this.model),
        le(this.model),
        ne(this.model),
        se(this.model),
        me(this.model),
        te(this.model),
        ce(this.model),
        this.mixer.stopAllAction(),
        this.mixer.uncacheRoot(this.model),
        this.group.removeFromParent();
        for (let {material: e} of this.materials)
            e.dispose();
        this.shellSkins.dispose()
    }
}
;
export {I as _, Be as a, Ne as c, R as d, V as f, L as g, H as h, Ge as i, Le as l, Me as m, Ve as n, J as o, U as p, We as r, Re as s, Ze as t, W as u};
