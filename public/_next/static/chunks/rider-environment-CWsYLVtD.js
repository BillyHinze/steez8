import {n as e} from "./rider-appearance-Cs5aq3V7.js";
import {St as t, pt as n} from "./rider-outfit-BI9AmbRj.js";
import {ut as r} from "./shop-day-DKdIHqyF.js";
import {C as i, I as a, It as o, M as s, Mt as c, N as l, P as u, Q as d, Tn as f, U as p, W as m, X as h, _n as g, an as _, cn as v, en as ee, gn as te, it as ne, jt as y, kt as b, rt as re, un as ie, wt as ae, xt as oe, z as x} from "./replay-Bo7bmJ9f.js";
var S = .007
  , se = e => {
    let t = Math.min(1, Math.max(0, e));
    return t * t * (3 - 2 * t)
}
  , ce = e => .108 + -.032 * se((e - S - .095) / .15)
  , C = (e, t, n) => new f(e,t,n);
function w(e, t, n) {
    let r = e.length
      , i = e[0].length
      , a = (t, n) => [e[t][Math.min(n + 1, i - 1)].clone().sub(e[t][Math.max(n - 1, 0)]), e[Math.min(t + 1, r - 1)][n].clone().sub(e[Math.max(t - 1, 0)][n])]
      , o = (t, r) => {
        let[i,o] = a(t, r)
          , s = i.cross(o).normalize();
        return s.dot(n(e[t][r])) < 0 ? s.negate() : s
    }
      , s = e.map( (e, n) => e.map( (e, r) => e.clone().addScaledVector(o(n, r), t)))
      , [c,l] = a(0, 0)
      , f = c.cross(l).dot(n(e[0][0])) > 0
      , p = []
      , m = []
      , h = (e, t) => {
        let n = p.length / 3;
        for (let t of e)
            for (let e of t)
                p.push(e.x, e.y, e.z);
        for (let e = 0; e < r - 1; e++)
            for (let r = 0; r < i - 1; r++) {
                let a = n + e * i + r
                  , o = a + 1
                  , s = a + i
                  , c = s + 1;
                t === f ? m.push(a, o, s, o, c, s) : m.push(a, s, o, o, s, c)
            }
    }
    ;
    h(s, !0),
    h(e, !1);
    let g = (e, t) => {
        for (let n = 0; n < e.length - 1; n++) {
            let r = p.length / 3;
            for (let r of [e[n], e[n + 1], t[n + 1], t[n]])
                p.push(r.x, r.y, r.z);
            m.push(r, r + 1, r + 2, r, r + 2, r + 3)
        }
    }
    ;
    g(e[0], s[0]),
    g(e[r - 1], s[r - 1]),
    g(e.map(e => e[0]), s.map(e => e[0])),
    g(e.map(e => e[i - 1]), s.map(e => e[i - 1]));
    let _ = new u;
    return _.setAttribute(`position`, new d(p,3)),
    _.setIndex(m),
    _.computeVertexNormals(),
    _
}
function le(e, t, n, r, i, a=18) {
    let o = C(0, 0, t)
      , s = n.clone().sub(e)
      , c = o.clone().cross(s).normalize()
      , l = Array.from({
        length: a + 1
    }, (t, n) => {
        let r = Math.PI * n / a;
        return e.clone().addScaledVector(o, Math.cos(r)).addScaledVector(s, Math.sin(r))
    }
    );
    return {
        geometry: w([-1, 1].map(e => l.map(t => t.clone().addScaledVector(c, e * r / 2))), i, t => {
            let n = t.clone().sub(e);
            return n.addScaledVector(c, -n.dot(c))
        }
        ),
        path: l
    }
}
var T = `#1d2024`
  , ue = `#2c3036`
  , de = `#8e949a`;
function fe() {
    let e = []
      , t = new v
      , n = -.15
      , r = .112
      , i = .056
      , a = .03;
    t.moveTo(n + a, -i),
    t.lineTo(r - a, -i),
    t.quadraticCurveTo(r, -i, r, -i + a),
    t.lineTo(r, i - a),
    t.quadraticCurveTo(r, i, r - a, i),
    t.lineTo(n + a, i),
    t.quadraticCurveTo(n, i, n, i - a),
    t.lineTo(n, -i + a),
    t.quadraticCurveTo(n, -i, n + a, -i);
    let o = new h(t,{
        depth: S,
        bevelEnabled: !0,
        bevelThickness: .0015,
        bevelSize: .002,
        bevelSegments: 1,
        curveSegments: 5
    });
    o.rotateX(Math.PI / 2).translate(0, S, 0),
    o.deleteAttribute(`uv`),
    e.push([o, T]);
    let c = (e, t) => C(e, 0, t)
      , l = []
      , u = .068
      , d = .06;
    for (let e = 0; e <= 4; e++)
        l.push(c(-.004 + (u + .004) * e / 4, d));
    for (let e = 1; e < 16; e++) {
        let t = Math.PI / 2 - Math.PI * e / 16;
        l.push(c(u + d * Math.cos(t), d * Math.sin(t)))
    }
    for (let e = 0; e <= 4; e++)
        l.push(c(u - (u + .004) * e / 4, -d));
    let f = e => S + .032 + .03 * se((e.x + .004) / (u + d + .004));
    e.push([w([l.map(e => C(e.x, .001, e.z)), l.map(e => C(e.x, f(e), e.z))], .008, e => C(e.x - Math.min(e.x, u), 0, e.z)), T]);
    let p = []
      , m = .062;
    for (let e = 0; e <= 8; e++) {
        let t = e / 8
          , n = S + .054 + .156 * t
          , r = ce(n) + .01 - m
          , i = 1.25 - .42 * t * t
          , a = [];
        for (let e = 0; e <= 22; e++) {
            let o = -i + 2 * i * e / 22
              , s = .052 * t ** 4 * Math.abs(o / i) ** 2.2;
            a.push(C(r + m * Math.cos(o), n - s, m * 1.04 * Math.sin(o)))
        }
        p.push(a)
    }
    e.push([w(p, .008, e => C(e.x - (ce(e.y) + .01 - m), 0, e.z)), T]);
    for (let[t,n,r] of [[C(.04, S + .036, 0), C(-.058, S + .158, 0), .042], [C(-.098, S + .006, 0), C(-.129, S + .116, 0), .03]]) {
        let i = le(t, .064, n, r, .009);
        e.push([i.geometry, ue]);
        for (let t of [i.path[2], i.path[i.path.length - 3]]) {
            let n = new s(.018,.022,.01).translate(t.x, t.y, t.z + Math.sign(t.z) * .006);
            n.deleteAttribute(`uv`),
            e.push([n, de])
        }
    }
    return e
}
var pe = 1.62
  , E = .39
  , me = .36
  , D = .09
  , O = .014
  , k = .205
  , A = 3 * Math.PI / 180
  , he = .011
  , ge = .108
  , j = pe / 2
  , _e = j - E / 2
  , M = _e - .06
  , ve = e => {
    let t = Math.abs(e);
    if (t <= M)
        return 0;
    let n = (t - M) / (j - M);
    return D * n * n
}
;
function ye() {
    let e = E / 2
      , t = _e
      , n = n => {
        let r = Math.abs(n);
        return r <= t ? me / 2 + (e - me / 2) * (r / t) ** 2 : Math.sqrt(Math.max(0, e * e - (r - t) ** 2))
    }
      , r = [];
    for (let e = 0; e <= 24; e++)
        r.push(-t + 2 * t * e / 24);
    for (let n = 1; n <= 16; n++) {
        let i = t + e * Math.sin(Math.PI / 2 * n / 16);
        r.push(i, -i)
    }
    r.sort( (e, t) => e - t);
    let i = []
      , a = []
      , o = []
      , s = (e, t) => e * 4 + t;
    for (let e of r) {
        let t = n(e)
          , r = ve(e);
        i.push(-t, r + O, e, t, r + O, e, -t, r, e, t, r, e)
    }
    let c = (e, t, n, r) => a.push(e, t, n, e, n, r)
      , l = a.length;
    for (let e = 0; e < r.length - 1; e++)
        c(s(e, 0), s(e + 1, 0), s(e + 1, 1), s(e, 1)),
        c(s(e, 2), s(e, 3), s(e + 1, 3), s(e + 1, 2));
    o.push([l, a.length - l, 0]);
    let f = a.length;
    for (let e = 0; e < r.length - 1; e++)
        c(s(e, 2), s(e + 1, 2), s(e + 1, 0), s(e, 0)),
        c(s(e, 1), s(e + 1, 1), s(e + 1, 3), s(e, 3));
    o.push([f, a.length - f, 1]);
    let p = new u;
    p.setAttribute(`position`, new d(i,3)),
    p.setIndex(a);
    for (let[e,t,n] of o)
        p.addGroup(e, t, n);
    let m = p.toNonIndexed();
    return m.computeVertexNormals(),
    m
}
var N = (e, t) => {
    let n = e.getAttribute(`position`).count
      , r = new Float32Array(n * 3);
    for (let[e,n,i] of t)
        for (let t = n; t < n + i; t++)
            e.toArray(r, t * 3);
    return e.setAttribute(`color`, new l(r,3)),
    e.clearGroups(),
    e
}
;
function be(e=`#d43b42`, r, i=`park-board`) {
    let a = ye()
      , s = a.groups.map(e => [e.start, e.count, e.materialIndex ?? 0])
      , l = new x(e)
      , u = new x(`#15181c`)
      , d = [N(a, s.map( ([e,t,n]) => [n === 0 ? l : u, e, t]))]
      , f = new y
      , p = new y
      , m = fe();
    for (let[e,t] of [[k, A], [-k, -A]]) {
        f.makeTranslation(he, O, e).multiply(p.makeRotationY(t));
        for (let[e,t] of m) {
            let n = (e.index ? e.toNonIndexed() : e.clone()).applyMatrix4(f);
            d.push(N(n, [[new x(t), 0, n.getAttribute(`position`).count]]))
        }
    }
    for (let[e] of m)
        e.dispose();
    let h = t(d);
    for (let e of d)
        e.dispose();
    let g = n(new o({
        vertexColors: !0,
        roughness: .55,
        side: 2
    }));
    r?.(g);
    let _ = new re;
    _.name = `Snowboard`;
    let v = new c(h,g);
    return v.name = `Snowboard deck`,
    v.castShadow = !0,
    v.receiveShadow = !0,
    v.userData.deckPoints = a.getAttribute(`position`).count,
    v.userData.topsheet = s.filter( ([,,e]) => e === 0).map( ([e,t]) => [e, t]),
    v.userData.painted = e,
    v.userData.boardItem = `park-board`,
    _.add(v),
    F(_, e, i),
    _
}
function xe(e) {
    let t = e.geometry;
    if (t.hasAttribute(`uv`))
        return;
    let n = t.getAttribute(`position`)
      , r = new Float32Array(n.count * 2)
      , i = e.userData.topsheet[0][1];
    for (let e = 0; e < n.count; e++) {
        let t = e < i
          , a = e % 12 < 6;
        r[e * 2] = t ? a ? .25 - n.getX(e) / E * .5 : .75 + n.getX(e) / E * .5 : .5,
        r[e * 2 + 1] = t ? 1 / 32 + (j - n.getZ(e)) / pe * (31 / 32) : 1 / 64
    }
    t.setAttribute(`uv`, new l(r,2))
}
var P = new Map;
function Se(t) {
    if (!e.some(e => e.value === t && `print` in e))
        return null;
    let n = P.get(t);
    return n || (n = typeof document > `u` ? new te : new g().load(r(`/items/boards/${t}.webp?v=3`, t)),
    n.name = t,
    n.flipY = !1,
    n.colorSpace = _,
    n.anisotropy = 4,
    P.set(t, n)),
    n
}
function F(e, t, n=`park-board`) {
    let r = e.getObjectByName(`Snowboard deck`);
    if (!r || r.userData.painted === t && r.userData.boardItem === n)
        return;
    let i = r.material
      , a = Se(n)
      , o = new x(t);
    if (a && xe(r),
    i.map !== a) {
        let e = !!i.map != !!a;
        i.map = a,
        e && (i.needsUpdate = !0)
    }
    let s = r.geometry.getAttribute(`color`);
    for (let[e,t] of r.userData.topsheet)
        for (let n = e; n < e + t; n++)
            a ? s.setXYZ(n, 1, 1, 1) : s.setXYZ(n, o.r, o.g, o.b);
    s.needsUpdate = !0,
    r.userData.painted = t,
    r.userData.boardItem = n
}
function Ce(e) {
    e.traverse(e => {
        e instanceof c && (e.geometry.dispose(),
        e.material.dispose())
    }
    ),
    e.removeFromParent()
}
var we = new y
  , Te = new f
  , Ee = new y
  , De = class {
    constructor(e, t) {
        this.feet = [],
        e.traverse(e => {
            if (this.feet.length || !(e instanceof ie))
                return;
            let n = t.map(t => e.skeleton.bones.indexOf(t));
            if (!n.some(e => e < 0))
                for (let t of n)
                    this.feet.push({
                        bone: e.skeleton.bones[t],
                        inverse: e.skeleton.boneInverses[t]
                    })
        }
        )
    }
    up(e, t) {
        if (!this.feet.length)
            return !1;
        t.set(0, 0, 0);
        for (let {bone: e, inverse: n} of this.feet)
            e.updateWorldMatrix(!0, !1),
            t.add(Te.set(0, 1, 0).transformDirection(we.multiplyMatrices(e.matrixWorld, n)));
        return t.transformDirection(Ee.copy(e.matrixWorld).invert()),
        !0
    }
}
  , I = new f
  , L = new f
  , R = new f
  , z = new f
  , B = new f
  , Oe = new y;
function ke(e, t, n, r, i) {
    r.updateWorldMatrix(!0, !1),
    r.worldToLocal(t.getWorldPosition(I)),
    r.worldToLocal(n.getWorldPosition(L)),
    R.subVectors(I, L),
    !(R.lengthSq() < 1e-6) && (R.normalize(),
    i?.up(r, z) || z.set(0, 1, 0),
    z.addScaledVector(R, -z.dot(R)).normalize(),
    B.crossVectors(z, R).normalize(),
    e.quaternion.setFromRotationMatrix(Oe.makeBasis(B, z, R)),
    e.position.addVectors(I, L).multiplyScalar(.5).addScaledVector(z, -ge).addScaledVector(B, -he))
}
var Ae = 14 * Math.PI / 180
  , je = 6
  , Me = 14
  , Ne = .08
  , Pe = 9 * Math.PI / 180
  , Fe = .05
  , V = k + .07
  , H = M - V
  , U = .4
  , Ie = Math.tan(U) * (j - V - H / 2);
function Le(e) {
    let t = Math.tan(Math.min(Math.abs(e), 1.4))
      , n = Math.tan(Math.min(Math.abs(e), U));
    if (t - n < 1e-6)
        return V + H / 2;
    let r = j - M
      , i = Math.min(1, (t - n) * r / (2 * D))
      , a = M + r * i;
    return a - (n * (a - V - H / 2) + D * i * i) / t
}
var Re = .72
  , ze = .3
  , Be = 1.2
  , Ve = 1.5
  , W = (e, t, n) => Math.min(n, Math.max(t, e))
  , G = (e, t, n, r) => t + (e - t) * Math.exp(-n * r)
  , He = new f
  , Ue = class e {
    constructor(e) {
        this.pivot = 0,
        this.twist = 0,
        this.bow = 0,
        this.press = 0,
        this.roll = NaN,
        this.rollRate = 0,
        this.shaped = !1,
        this.landed = 1 / 0,
        this.ends = [],
        this.point = new f,
        this.normal = new f,
        this.axis = new f;
        let t = e.getObjectByName(`Snowboard deck`);
        this.geometry = t.geometry,
        this.rest = Float32Array.from(this.geometry.getAttribute(`position`).array),
        this.restNormals = Float32Array.from(this.geometry.getAttribute(`normal`).array),
        this.deckPoints = t.userData.deckPoints ?? this.geometry.getAttribute(`position`).count,
        this.geometry.computeBoundingSphere(),
        this.geometry.boundingSphere && (this.geometry.boundingSphere.radius += Math.max(Fe, Ie) + .03);
        let n = new Set
          , r = t.userData.topsheet?.[0]?.[1] ?? 0;
        for (let e = 0; e < r; e++) {
            let t = this.rest[e * 3]
              , r = this.rest[e * 3 + 2]
              , i = `${t.toFixed(4)} ${r.toFixed(4)}`;
            e % 12 >= 6 && Math.abs(r) > V && !n.has(i) && (n.add(i),
            this.ends.push(e))
        }
    }
    static riding(e) {
        return e.phase === `skiing` && !e.airborne && !e.grind && e.crashTime <= 0 && !e.landingSettling
    }
    turn(t, n, r=!1) {
        let i = W((Me - n.speed) / (Me - je), 0, 1) * W((n.speed - 1.5) / 3, 0, 1)
          , a = e.riding(n) ? Math.sign(n.edge) * Ae * Math.abs(n.edge) ** 1.5 * i * (1 - Math.min(1, Math.abs(n.skid))) : 0;
        return this.pivot = r || t <= 0 ? a : G(this.pivot, a, 6, t),
        this.pivot
    }
    aboutLeadingFoot(e) {
        e.x -= k * Math.sin(this.pivot),
        e.z += k * (1 - Math.cos(this.pivot))
    }
    sprayLateral(e) {
        return this.pivot / Re * e * .7
    }
    sprayAmount(e) {
        return e <= 2 ? 0 : Math.abs(this.pivot / Re) * e * 1.2
    }
    bend(t, n, r, i=!1, a=0) {
        this.landed = n.airborne ? 0 : i ? 1 / 0 : this.landed + Math.max(0, t),
        He.set(1, 0, 0).applyQuaternion(r.quaternion);
        let o = Math.asin(W(He.y, -1, 1))
          , s = e.riding(n);
        this.rollRate = i || t <= 0 || !Number.isFinite(this.roll) ? 0 : G(this.rollRate, s ? (o - this.roll) / t : 0, 25, t),
        this.roll = o;
        let c = s ? W(this.rollRate * Ne, -Pe, Pe) * (n.switchStance ? -1 : 1) : 0
          , l = s ? Fe * W((Math.abs(n.edge) - .35) / .65, 0, 1) ** 2 * W((n.speed - 4) / 10, 0, 1) : 0;
        this.twist = i || t <= 0 ? c : G(this.twist, c, 25, t),
        this.bow = i || t <= 0 ? l : G(this.bow, l, 8, t),
        this.press = a,
        this.shape()
    }
    shape() {
        let e = this.geometry.getAttribute(`position`)
          , t = e.array
          , n = this.rest
          , r = this.geometry.getAttribute(`normal`)
          , i = this.deckPoints * 3;
        if (Math.abs(this.twist) < 1e-4 && this.bow < 1e-4 && Math.abs(this.press) < 1e-4) {
            this.shaped &&= (t.set(n.subarray(0, i)),
            r.array.set(this.restNormals.subarray(0, i)),
            this.upload(e),
            this.upload(r),
            !1);
            return
        }
        let a = Math.sign(this.press)
          , o = Math.tan(Math.min(Math.abs(this.press), U));
        for (let e = 0; e < i; e += 3) {
            let r = n[e]
              , i = n[e + 1]
              , s = n[e + 2]
              , c = Math.abs(s);
            if (c <= V) {
                t[e] = r,
                t[e + 1] = i;
                continue
            }
            let l = ((c - V) / (j - V)) ** 2
              , u = Math.sign(s) * this.twist * l
              , d = ve(s) + O / 2
              , f = Math.cos(u)
              , p = Math.sin(u)
              , m = i - d
              , h = (c - V) / H
              , g = a && Math.sign(s) === a ? o * (h < 1 ? H * h * h / 2 : c - V - H / 2) : 0;
            t[e] = r * f - m * p,
            t[e + 1] = d + r * p + m * f + this.bow * l + g
        }
        this.upload(e),
        this.shadeDeck(t, r),
        this.shaped = !0
    }
    holdUp(e, t) {
        let n = 1 - b.smoothstep(this.landed, Be, Ve);
        if (n <= 0 || !this.ends.length)
            return 0;
        let r = e.getObjectByName(`Snowboard deck`) ?? e
          , i = this.geometry.getAttribute(`position`).array;
        r.updateWorldMatrix(!0, !1),
        this.point.setFromMatrixPosition(r.matrixWorld);
        let a = t(this.point.x, this.point.z);
        this.normal.set(2 * (a - t(this.point.x + .5, this.point.z)), 1, 2 * (a - t(this.point.x, this.point.z + .5))).normalize();
        let o = j * Math.abs(this.axis.set(0, 0, 1).transformDirection(r.matrixWorld).dot(this.normal)) + E / 2 * Math.abs(this.axis.set(1, 0, 0).transformDirection(r.matrixWorld).dot(this.normal)) + .035;
        if ((this.point.y - a) * this.normal.y > o)
            return 0;
        let s = 0;
        for (let e of this.ends)
            this.point.set(i[e * 3], i[e * 3 + 1], i[e * 3 + 2]).applyMatrix4(r.matrixWorld),
            s = Math.max(s, t(this.point.x, this.point.z) - this.point.y);
        return Math.min(ze, s) * n
    }
    upload(e) {
        e.clearUpdateRanges(),
        e.addUpdateRange(0, this.deckPoints * 3),
        e.needsUpdate = !0
    }
    shadeDeck(e, t) {
        let n = t.array;
        for (let t = 0; t < this.deckPoints * 3; t += 9) {
            let r = e[t + 3] - e[t]
              , i = e[t + 4] - e[t + 1]
              , a = e[t + 5] - e[t + 2]
              , o = e[t + 6] - e[t]
              , s = e[t + 7] - e[t + 1]
              , c = e[t + 8] - e[t + 2]
              , l = i * c - a * s
              , u = a * o - r * c
              , d = r * s - i * o
              , f = Math.hypot(l, u, d) || 1;
            l /= f,
            u /= f,
            d /= f;
            for (let e = 0; e < 9; e += 3)
                n[t + e] = l,
                n[t + e + 1] = u,
                n[t + e + 2] = d
        }
        this.upload(t)
    }
}
  , We = new Set([`SKIS`, `POLES`, `BINDINGS`])
  , Ge = class {
    constructor() {
        this.was = new Map
    }
    hide(e) {
        e.traverse(e => {
            let t = typeof e.userData.whiteout_slot == `string` ? e.userData.whiteout_slot : e.name.startsWith(`SLOT_`) ? e.name.slice(5).split(`__`)[0] : ``;
            We.has(t) && (this.was.has(e) || (this.was.set(e, e.visible),
            e.userData[K] = e.visible),
            e.visible = !1)
        }
        )
    }
    restore() {
        for (let[e,t] of this.was)
            e.visible = t,
            delete e.userData[K];
        this.was.clear()
    }
}
  , K = `shownBeforeBoard`;
function Ke(e) {
    e.traverse(e => {
        typeof e.userData[K] == `boolean` && (e.visible = e.userData[K],
        delete e.userData[K])
    }
    )
}
function qe(e) {
    let t = document.createElement(`canvas`);
    t.width = 512,
    t.height = 256;
    let n = t.getContext(`2d`)
      , r = n.createLinearGradient(0, 0, 0, 256);
    for (let[e,t] of [[0, `#426c99`], [.36, `#9ebbd7`], [.5, `#dde7ed`], [.56, `#c9d9e7`], [1, `#b6ccd9`]])
        r.addColorStop(e, t);
    n.fillStyle = r,
    n.fillRect(0, 0, 512, 256);
    let o = n.createRadialGradient(311, 88, 1, 311, 88, 25);
    o.addColorStop(0, `#fff2d9`),
    o.addColorStop(.12, `#fff2d9`),
    o.addColorStop(1, `#fff2d900`),
    n.fillStyle = o,
    n.fillRect(280, 57, 62, 62);
    let s = new a(t);
    s.colorSpace = _,
    s.mapping = 303;
    let c = new i(e)
      , l = c.fromEquirectangular(s);
    return s.dispose(),
    c.dispose(),
    l
}
var q = 512
  , J = 256
  , Je = [.1, .22, .55]
  , Ye = [1.05, 1.18, 1.32]
  , Xe = [.35, .42, .55]
  , Ze = [1.3, 1.4, 1.55]
  , Qe = [.95, 1, 1.08]
  , $e = [.52, .56, .62]
  , et = 9
  , Y = .09
  , X = (e, t, n) => [e[0] + (t[0] - e[0]) * n, e[1] + (t[1] - e[1]) * n, e[2] + (t[2] - e[2]) * n]
  , tt = e => {
    let t = Math.sin(e * 127.1) * 43758.5453;
    return t - Math.floor(t)
}
  , Z = (e, t) => {
    let n = e * t
      , r = Math.floor(n)
      , i = n - r
      , a = i * i * (3 - 2 * i);
    return tt(r % t) * (1 - a) + tt((r + 1) % t) * a
}
  , nt = e => .018 + .05 * Z(e, 7) ** 1.6 + .016 * Z(e, 23) + .005 * Z(e, 61)
  , Q = null;
function rt() {
    if (Q)
        return Q;
    let e = new Float32Array(q * J * 3);
    for (let t = 0; t < J; t++) {
        let n = ((t + .5) / J - .5) * Math.PI;
        for (let r = 0; r < q; r++) {
            let i = (r + .5) / q, a;
            if (n > 0) {
                a = X(Ye, Je, Math.sin(n) ** .55);
                let e = nt(i);
                n < e && (a = X(Xe, Ze, Math.min(1, Math.max(0, (n - e * .55) / (e * .45))) * .85))
            } else
                a = X(Qe, $e, Math.sin(-n) ** .6);
            e.set(a, (t * q + r) * 3)
        }
    }
    return Q = e
}
function it(e) {
    let t = e.clone().normalize();
    return {
        x: (Math.atan2(t.z, t.x) / (2 * Math.PI) + .5) * q - .5,
        y: (Math.asin(b.clamp(t.y, -1, 1)) / Math.PI + .5) * J - .5
    }
}
var $ = null;
function at() {
    if ($)
        return $;
    let e = rt()
      , t = new Uint16Array(q * J * 4)
      , n = e => m.toHalfFloat(e)
      , r = n(1);
    for (let i = 0, a = 0; i < e.length; i += 3,
    a += 4)
        t[a] = n(e[i]),
        t[a + 1] = n(e[i + 1]),
        t[a + 2] = n(e[i + 2]),
        t[a + 3] = r;
    return $ = t
}
function ot(e) {
    let t = rt()
      , n = at().slice()
      , r = e => m.toHalfFloat(e)
      , i = e.clone().normalize()
      , a = it(i)
      , o = Math.ceil(4 * Y / Math.PI * J)
      , s = Math.asin(b.clamp(i.y, -1, 1))
      , c = Math.atan2(i.z, i.x);
    for (let e = Math.max(0, Math.floor(a.y) - o); e <= Math.min(J - 1, Math.ceil(a.y) + o); e++) {
        let i = ((e + .5) / J - .5) * Math.PI
          , l = Math.cos(i)
          , u = Math.min(q / 2, Math.ceil(o / Math.max(.05, l)));
        for (let o = -u; o <= u; o++) {
            let u = ((Math.round(a.x) + o) % q + q) % q
              , d = ((u + .5) / q - .5) * 2 * Math.PI
              , f = Math.sin(i) * Math.sin(s) + l * Math.cos(s) * Math.cos(d - c)
              , p = Math.acos(b.clamp(f, -1, 1))
              , m = et * Math.exp(-p * p / (2 * Y * Y));
            if (m < .002)
                continue;
            let h = (e * q + u) * 3
              , g = (e * q + u) * 4;
            for (let e = 0; e < 3; e++)
                n[g + e] = r(t[h + e] + m)
        }
    }
    return n
}
function st(e, t) {
    let n = new p(ot(t),q,J,ee,ne);
    n.mapping = 303,
    n.colorSpace = ae,
    n.magFilter = n.minFilter = oe,
    n.needsUpdate = !0;
    let r = new i(e)
      , a = r.fromEquirectangular(n);
    return n.dispose(),
    r.dispose(),
    {
        target: a,
        texture: a.texture,
        sun: t.clone().normalize(),
        dispose: () => a.dispose()
    }
}
export {De as a, be as c, ke as d, Ke as f, Ue as i, Ce as l, qe as n, Ge as o, ge as r, Le as s, st as t, F as u};
