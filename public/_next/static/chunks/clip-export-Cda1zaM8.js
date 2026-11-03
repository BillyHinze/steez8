const __vite__mapDeps = (i, m=__vite__mapDeps, d=(m.f || (m.f = ["_next/static/chunks/clip-mp4-26T1AIYl.js", "_next/static/chunks/rolldown-runtime-C60lm6uB.js"]))) => i.map(i => d[i]);
import {t as e} from "./index-CXkhr5iE.js";
var t = 1.1
  , n = .8
  , r = .9
  , i = .6
  , a = 30
  , o = .45;
function s(e, s, c) {
    let l = [];
    for (let a of e) {
        if (!a.rail && !(a.airborne && a.end - a.start >= o))
            continue;
        let e = Math.max(0, a.start - (a.airborne ? t : n))
          , u = Math.min(c, a.end + r)
          , d = s.reduce( (e, t) => (t.kind === `land` || t.kind === `butter`) && t.t >= a.start && t.t <= a.end + .4 ? e + t.score : e, 0)
          , f = l[l.length - 1];
        f && e - f.end < i ? (f.end = Math.max(f.end, u),
        f.worth += d) : l.push({
            start: e,
            end: u,
            worth: d
        })
    }
    let u = () => l.reduce( (e, t) => e + t.end - t.start, 0);
    for (; l.length > 1 && u() > a; )
        l.splice(l.indexOf(l.reduce( (e, t) => t.worth < e.worth ? t : e)), 1);
    return l.map( ({start: e, end: t}) => ({
        start: e,
        end: t
    }))
}
var c = class {
    constructor(e, t, n) {
        this.starts = [],
        this.films = [],
        this.cuts = e,
        this.source = n;
        let r = 0;
        for (let n of e)
            this.starts.push(r),
            this.films.push(t(n.start)),
            r += t(n.end) - t(n.start);
        this.duration = r
    }
    at(e) {
        let t = 0;
        for (; t < this.cuts.length - 1 && e >= this.starts[t + 1]; )
            t++;
        let n = this.films[t] + Math.max(0, e - this.starts[t])
          , r = this.cuts[t];
        return {
            index: t,
            film: n,
            time: Math.min(r.end, Math.max(r.start, this.source(n)))
        }
    }
}
  , l = [1080, 720, 480]
  , u = {
    1080: 1,
    720: .5,
    480: .25
};
function d(e, t=1080) {
    let n = Math.round(t * 16 / 9 / 2) * 2;
    return e === `vertical` ? {
        width: t,
        height: n
    } : {
        width: n,
        height: t
    }
}
var f = [`video/mp4;codecs=avc1.42E01E`, `video/mp4;codecs=avc1`, `video/mp4`, `video/webm;codecs=vp9`, `video/webm;codecs=vp8`, `video/webm`];
function p(e=e => typeof MediaRecorder < `u` && MediaRecorder.isTypeSupported(e)) {
    return f.find(e) ?? ``
}
var m = e => e.startsWith(`video/mp4`) ? `mp4` : `webm`
  , h = (e, t=1080) => (e > 60 ? 6e6 : 9e6) * u[t]
  , g = e => e > 60 ? 22 : 20
  , _ = (e, t=1080) => (e > 60 ? 48e5 : 6e6) * u[t]
  , v = (e, t=1080) => _(e, t) * e / 8 / 1048576
  , y = 42
  , b = class {
    constructor(e, t, n) {
        this.recent = [],
        this.key = 0,
        this.since = 0,
        this.decided = 0,
        this.spent = 0,
        this.back = 0,
        this.keys = new Map,
        this.base = this.quantizer = this.keyQuantizer = e,
        this.ceiling = t,
        this.group = n
    }
    packet(e, t, n) {
        this.spent += t,
        this.back = Math.max(this.back, e + 1),
        n ? (this.key = t,
        this.keyQuantizer = this.keys.get(e) ?? this.base,
        this.keys.delete(e)) : e >= this.since && (this.recent.push(t),
        this.recent.length > 15 && this.recent.shift())
    }
    next(e) {
        return e - this.decided >= 6 && this.recent.length >= 4 && this.decide(e),
        e % this.group === 0 && this.keys.set(e, this.quantizer),
        this.quantizer
    }
    decide(e) {
        this.decided = e;
        let t = (e, t) => Math.min(t, Math.max(1, Math.round(6 * Math.log2(e))))
          , n = this.recent.reduce( (e, t) => e + t, 0) / this.recent.length
          , r = this.key ? this.key * 2 ** ((this.keyQuantizer - this.quantizer) / 6) : n * 6
          , i = (n * (this.group - 1) + r) * 8 * 30 / this.group
          , a = this.ceiling * this.back / 30 - this.spent * 8
          , o = Math.min(this.ceiling * 1.5, Math.max(this.ceiling * .7, this.ceiling + a / 5))
          , s = this.quantizer;
        i > o ? s = Math.min(y, s + t(i / o, 6)) : i < o * .7 && s > this.base && (s = Math.max(this.base, s - t(o * .85 / i, 3))),
        s !== this.quantizer && (this.quantizer = s,
        this.since = e,
        this.recent = [])
    }
}
;
function x(e, t, n, r) {
    if (e === `all`)
        return {
            start: 0,
            end: n
        };
    if (e === `toEnd`)
        return {
            start: Math.max(0, Math.min(t, n - .5)),
            end: n
        };
    if (e === `best`) {
        let e = r.filter(e => e.kind === `land` || e.kind === `butter`)
          , i = e.length ? e.reduce( (e, t) => t.score > e.score ? t : e) : null
          , a = Math.min(n, (i ? i.t : Math.min(n, t + 12)) + 4);
        return {
            start: Math.max(0, a - 16),
            end: a
        }
    }
    let i = Math.min(e === `here15` ? 15 : 30, n)
      , a = Math.max(0, Math.min(t, n - i));
    return {
        start: a,
        end: Math.min(n, a + i)
    }
}
function S(e, t, n) {
    let r = e => String(e).padStart(2, `0`);
    return `steez8-${e}-${t.getFullYear()}-${r(t.getMonth() + 1)}-${r(t.getDate())}-${r(t.getHours())}.${r(t.getMinutes())}.${r(t.getSeconds())}.${n}`
}
var C = (e, t) => e.reduce( (e, n) => (n.kind === `land` || n.kind === `butter`) && n.t <= t ? e + n.score : e, 0)
  , w = class {
    get fixedFrames() {
        return !!this.encoder
    }
    constructor(e, t, n=p()) {
        this.canvas = document.createElement(`canvas`),
        this.encoder = null,
        this.bitrate = 9e6,
        this.recorder = null,
        this.chunks = [],
        this.track = null,
        this.width = e,
        this.height = t,
        this.mime = n,
        this.canvas.width = e,
        this.canvas.height = t;
        let r = this.canvas.getContext(`2d`);
        if (!r)
            throw Error(`No 2D context for the clip canvas`);
        this.ctx = r
    }
    async prepare(t=9e6, n, r, i=null) {
        this.bitrate = t;
        try { if (typeof VideoEncoder < `u`) {
            let {createMp4Encoder: a} = await e(async () => {
                let {createMp4Encoder: e} = await import(`./clip-mp4-26T1AIYl.js`);
                return {
                    createMp4Encoder: e
                }
            }
            , __vite__mapDeps([0, 1]));
            if (this.encoder = await a(this.canvas, t, n, r, i),
            this.encoder) {
                this.mime = `video/mp4`;
                return
            }
        }
        } catch (error) { console.warn(`Optional MP4 encoder unavailable; using MediaRecorder.`, error); }
        if (!this.mime)
            throw Error(`No supported video encoder`)
    }
    start() {
        let e = typeof CanvasCaptureMediaStreamTrack < `u` && `requestFrame` in CanvasCaptureMediaStreamTrack.prototype
          , t = this.canvas.captureStream(e ? 0 : 30);
        this.track = t.getVideoTracks()[0],
        this.recorder = new MediaRecorder(t,{
            mimeType: this.mime || void 0,
            videoBitsPerSecond: this.bitrate
        }),
        this.recorder.ondataavailable = e => {
            e.data.size && this.chunks.push(e.data)
        }
        ,
        this.recorder.start(250)
    }
    async frame(e, t, n=0) {
        if (this.ctx.drawImage(e, 0, 0, this.width, this.height),
        t(this.ctx, this.width, this.height),
        this.encoder) {
            await this.encoder.frame(n);
            return
        }
        this.recorder || this.start(),
        this.track?.requestFrame?.()
    }
    stop() {
        return this.encoder ? this.encoder.stop() : new Promise(e => {
            let t = this.recorder;
            if (!t || t.state === `inactive`)
                return this.track?.stop(),
                e(new Blob(this.chunks,{
                    type: this.mime
                }));
            t.onstop = () => {
                this.track?.stop(),
                e(new Blob(this.chunks,{
                    type: t.mimeType || this.mime
                }))
            }
            ,
            t.stop()
        }
        )
    }
    cancel() {
        this.encoder?.cancel().catch( () => {}
        );
        try {
            this.recorder && this.recorder.state !== `inactive` && this.recorder.stop()
        } catch {}
        this.track?.stop(),
        this.chunks = []
    }
}
;
export {s as a, _ as c, v as d, g as f, w as i, m as l, C as m, c as n, x as o, d as p, b as r, h as s, l as t, S as u};
