import {C as e, i as t, x as n} from "./rider-appearance-Cs5aq3V7.js";
import {A as r, N as i, Q as a, R as o, T as s, U as c, W as l, Y as u, bt as d, dt as f, ft as p, o as m, rt as h, s as g, ut as _, x as v} from "./rider-outfit-BI9AmbRj.js";
import {Mt as y, T as b, Tn as x, Wt as S, Xt as C, Y as w, at as T, gn as E, on as D, q as O} from "./replay-Bo7bmJ9f.js";
import {t as k} from "./rider-interview-1Ksa_0po.js";
import {n as A, t as j} from "./rider-environment-CWsYLVtD.js";
var M = 900
  , N = 1350
  , P = 20
  , F = 6
  , I = P + F + 6
  , L = 1.2
  , R = .34
  , z = new Map
  , B = `cork7-rider-stickers`
  , V = 21
  , H = `/models/rider-v20.glb`
  , U = .6
  , W = new x(-3,5,4).normalize();
function G(e, t=1) {
    let n = t === 1 ? JSON.stringify(e) : `${t}x:${JSON.stringify(e)}`
      , r = z.get(n);
    return r || (r = (async () => {
        let r = await J(n);
        if (r)
            return r;
        let {blob: i, whole: a} = await Q(e, t);
        return a ? URL.createObjectURL(await Y(n, i)) : (z.delete(n),
        URL.createObjectURL(i))
    }
    )(),
    r.catch( () => z.delete(n)),
    z.set(n, r)),
    r
}
function K(e) {
    let t = JSON.stringify(e)
      , n = z.get(t);
    return n || (n = Q(e).then( ({blob: e, whole: n}) => (n || z.delete(t),
    URL.createObjectURL(e))),
    n.catch( () => z.delete(t)),
    z.set(t, n)),
    n
}
var q = e => `/__rider-sticker/${V}/${encodeURIComponent(H)}/${encodeURIComponent(e)}`;
async function J(e) {
    try {
        let t = await (await caches.open(B)).match(q(e));
        return t ? URL.createObjectURL(await t.blob()) : null
    } catch {
        return null
    }
}
async function Y(e, t) {
    try {
        let n = await caches.open(B)
          , r = q(e);
        for (let e of await n.keys())
            e.url.endsWith(r) || await n.delete(e);
        await n.put(r, new Response(t,{
            headers: {
                "content-type": `image/png`
            }
        }))
    } catch {}
    return t
}
async function X(f) {
    let p = n(f)
      , _ = u(p)
      , [y,b,x,S,C,w,T,E,D] = await Promise.all([new d().loadAsync(H), g(p.pantsItem), o(p.polesItem), l(p.jacketItem), i(p.skiItem), r(p.bindingItem), s(p.bootItem), v(p.gloveItem), _ ? a(_) : null, m(p.helmetItem), h(e(p).cut)]);
    if (!b && p.pantsItem !== t.pantsItem)
        throw Error(`The ${p.pantsItem} pants did not load.`);
    if (!x && p.polesItem !== t.polesItem)
        throw Error(`The ${p.polesItem} poles did not load.`);
    if (!S && c(p.jacketItem))
        throw Error(`The ${p.jacketItem} jacket did not load.`);
    if (!C && p.skiItem !== t.skiItem)
        throw Error(`The ${p.skiItem} skis did not load.`);
    if (!w && p.bindingItem !== t.bindingItem)
        throw Error(`The ${p.bindingItem} bindings did not load.`);
    if (!T && p.bootItem !== t.bootItem)
        throw Error(`The ${p.bootItem} boots did not load.`);
    if (!E && p.gloveItem !== t.gloveItem)
        throw Error(`The ${p.gloveItem} gloves did not load.`);
    if (!D && _)
        throw Error(`The ${p.headItem} headwear did not load.`);
    return {
        outfit: p,
        gltf: y
    }
}
function Z(e) {
    e.traverse(e => {
        if (e instanceof y) {
            e.geometry.dispose();
            for (let t of Array.isArray(e.material) ? e.material : [e.material]) {
                for (let e of Object.values(t))
                    e instanceof E && e.dispose();
                t.dispose()
            }
        }
    }
    )
}
async function Q(e, t=1) {
    let {outfit: n, gltf: r} = await X(e)
      , i = new b({
        alpha: !0,
        antialias: !0,
        preserveDrawingBuffer: !0
    })
      , a = new D
      , o = A(i)
      , s = j(i, W)
      , c = null;
    try {
        i.setPixelRatio(1),
        i.setSize(M * t, N * t, !1),
        i.setClearColor(0, 0),
        i.toneMapping = 4,
        i.toneMappingExposure = 1.25,
        a.environment = o.texture,
        a.environmentIntensity = .4,
        f(a, s.texture, U, 1 / U),
        a.add(new T(`#cbefff`,`#657e88`,2.6));
        let e = new O(`#fff1dc`,4);
        e.position.set(-3, 5, 4),
        a.add(e);
        let l = new O(`#8cdbe5`,3);
        l.position.set(3, 3, -3),
        a.add(l),
        _(r.scene),
        c = new k(r.scene,r.animations,n),
        c.group.position.set(0, 0, 0),
        c.group.rotation.y = 0,
        c.update(0, L),
        a.add(c.group),
        ee(c.group.children[0]);
        let u = await $(c.group)
          , d = new S(22,M / N,.1,60);
        return d.position.set(0, .92, 7),
        d.lookAt(0, .98, 0),
        p(a),
        await i.compileAsync(a, d),
        i.render(a, d),
        {
            blob: await te(i.domElement, t),
            whole: u
        }
    } finally {
        c?.dispose(),
        Z(r.scene),
        o.dispose(),
        s.dispose(),
        i.dispose(),
        i.forceContextLoss()
    }
}
async function $(e, t=8e3) {
    let n = new Set;
    e.traverse(e => {
        if (e instanceof y)
            for (let t of [e.material].flat())
                for (let e of Object.values(t))
                    e instanceof E && n.add(e)
    }
    );
    let r = () => [...n].some(e => !e.image)
      , i = performance.now() + t;
    for (; r() && performance.now() < i; )
        await new Promise(e => setTimeout(e, 50));
    return !r()
}
function ee(e) {
    let t = e.getObjectByName(`Head`);
    t.quaternion.multiply(new C().setFromEuler(new w(.015 * Math.sin(L * .73),.06 + .025 * Math.sin(L * .46),0)).invert()),
    e.updateMatrixWorld(!0);
    let n = new x(1,0,0).transformDirection(e.matrixWorld)
      , r = t.getWorldQuaternion(new C);
    r.premultiply(new C().setFromAxisAngle(n, R)),
    t.quaternion.copy(t.parent.getWorldQuaternion(new C).invert().multiply(r)),
    e.updateMatrixWorld(!0)
}
async function te(e, t) {
    let n = P * t
      , r = F * t
      , i = I * t
      , a = document.createElement(`canvas`);
    a.width = e.width,
    a.height = e.height,
    a.getContext(`2d`).drawImage(e, 0, 0);
    let o = document.createElement(`canvas`);
    o.width = a.width + i * 2,
    o.height = a.height + i * 2;
    let s = o.getContext(`2d`)
      , c = e => {
        let t = document.createElement(`canvas`);
        t.width = a.width,
        t.height = a.height;
        let n = t.getContext(`2d`);
        return n.drawImage(a, 0, 0),
        n.globalCompositeOperation = `source-in`,
        n.fillStyle = e,
        n.fillRect(0, 0, t.width, t.height),
        t
    }
      , l = Math.round(28 * t)
      , u = (e, t) => {
        for (let n of [t / 3, t * 2 / 3, t])
            for (let t = 0; t < l; t++) {
                let r = t / l * Math.PI * 2;
                s.drawImage(e, i + Math.cos(r) * n, i + Math.sin(r) * n)
            }
    }
    ;
    u(c(`#101418`), n + r),
    u(c(`#f7f6ef`), n),
    s.drawImage(a, i, i);
    let {data: d} = s.getImageData(0, 0, o.width, o.height)
      , f = o.width
      , p = 0
      , m = o.height
      , h = 0;
    for (let e = 0; e < o.height; e++)
        for (let t = 0; t < o.width; t++)
            d[(e * o.width + t) * 4 + 3] > 8 && (t < f && (f = t),
            t > p && (p = t),
            e < m && (m = e),
            e > h && (h = e));
    let g = document.createElement(`canvas`);
    g.width = Math.max(1, p - f + 3),
    g.height = Math.max(1, h - m + 3),
    g.getContext(`2d`).drawImage(o, f - 1, m - 1, g.width, g.height, 0, 0, g.width, g.height);
    let _ = await new Promise(e => g.toBlob(e, `image/png`));
    if (!_)
        throw Error(`The sticker could not be drawn.`);
    return _
}
export {H as MODEL, U as PICTURE_GAIN, Z as disposeModel, X as loadDressed, K as otherRiderSticker, G as riderSticker, $ as texturesLoaded};
