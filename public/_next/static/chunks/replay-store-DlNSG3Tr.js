import {a as e} from "./season-BrQumfIM.js";
import {APEX_SEASON as t, BIG_AIR_SEASON as n, FOREST_LINE_SEASON as r, HALFPIPE_SEASON as i, PARKS as a} from "./parks-1qsmaijL.js";
import {f as o, h as s, p as c, u as l} from "./replay-Bo7bmJ9f.js";
var u = 5
  , d = (e, t) => !e.meta.versus == !t.meta.versus
  , f = e => `run/${e.meta.course === `nordryggen-v1` ? `` : `${e.meta.course}/`}${e.meta.recorded}/${e.meta.run}`
  , p = `whiteout-replays`
  , m = `slots`
  , h = `replays`
  , g = class {
    constructor(e=`nordryggen-v1`, t=p) {
        this.memory = new Map,
        this.writes = Promise.resolve(),
        this.packed = new WeakMap,
        this.course = e,
        this.database = t,
        this.db = this.open()
    }
    get season() {
        return this.course === a.apex.course ? t : this.course === a.bigair.course ? n : this.course === a.forestline.course ? r : this.course === a.halfpipe.course ? i : e
    }
    slotKey(e, t) {
        return `${this.course === `nordryggen-v1` ? `` : `${this.course}/`}${t}/${e}`
    }
    open() {
        return typeof indexedDB > `u` ? Promise.resolve(null) : new Promise(e => {
            try {
                let t = indexedDB.open(this.database, 1);
                t.onupgradeneeded = () => {
                    let e = t.result;
                    e.objectStoreNames.contains(m) || e.createObjectStore(m, {
                        keyPath: `id`
                    }),
                    e.objectStoreNames.contains(h) || e.createObjectStore(h, {
                        keyPath: `id`
                    })
                }
                ,
                t.onsuccess = () => e(t.result),
                t.onerror = () => e(null),
                t.onblocked = () => e(null)
            } catch {
                e(null)
            }
        }
        )
    }
    async put(e, t) {
        let n = await this.db;
        if (!n) {
            this.memory.set(`${e}/${t.id}`, t);
            return
        }
        await new Promise( (r, i) => {
            let a = n.transaction(e, `readwrite`);
            a.objectStore(e).put(t),
            a.oncomplete = () => r(),
            a.onerror = () => i(a.error)
        }
        )
    }
    async get(e, t) {
        let n = await this.db;
        return n ? new Promise(r => {
            let i = n.transaction(e, `readonly`).objectStore(e).get(t);
            i.onsuccess = () => r(i.result ?? null),
            i.onerror = () => r(null)
        }
        ) : this.memory.get(`${e}/${t}`) ?? null
    }
    async all(e) {
        let t = await this.db;
        return t ? new Promise(n => {
            let r = t.transaction(e, `readonly`).objectStore(e).getAll();
            r.onsuccess = () => n(r.result),
            r.onerror = () => n([])
        }
        ) : [...this.memory.entries()].filter( ([t]) => t.startsWith(`${e}/`)).map( ([,e]) => e)
    }
    async remove(e, t) {
        let n = await this.db;
        if (!n) {
            this.memory.delete(`${e}/${t}`);
            return
        }
        await new Promise(r => {
            let i = n.transaction(e, `readwrite`);
            i.objectStore(e).delete(t),
            i.oncomplete = () => r(),
            i.onerror = () => r()
        }
        )
    }
    async pack(e, t) {
        let n = this.packed.get(t);
        return n || this.packed.set(t, n = l(s(t))),
        {
            id: e,
            meta: t.meta,
            bytes: await n
        }
    }
    async unpack(e) {
        try {
            return e ? o(await c(e.bytes)) : null
        } catch {
            return null
        }
    }
    queue(e) {
        let t = this.writes.then(e);
        return this.writes = t.catch( () => {}
        ),
        t
    }
    saveAutomatic(e) {
        return this.queue(async () => {
            let t = {
                ...await this.pack(f(e), e),
                automatic: !0
            }
              , n = await this.db;
            if (!n) {
                let e = this.memory.get(`${h}/${t.id}`);
                if (e && !e.automatic)
                    return;
                this.memory.set(`${h}/${t.id}`, t);
                let n = (await this.all(h)).filter(e => e.automatic && d(e, t)).sort( (e, t) => t.meta.recorded.localeCompare(e.meta.recorded));
                for (let e of n.slice(5))
                    this.memory.delete(`${h}/${e.id}`);
                return
            }
            await new Promise( (e, r) => {
                let i = n.transaction(h, `readwrite`)
                  , a = i.objectStore(h)
                  , o = a.getAll();
                o.onsuccess = () => {
                    let e = o.result
                      , n = e.find(e => e.id === t.id);
                    if (n && !n.automatic)
                        return;
                    a.put(t);
                    let r = [...e.filter(e => e.automatic && e.id !== t.id && d(e, t)), t].sort( (e, t) => t.meta.recorded.localeCompare(e.meta.recorded));
                    for (let e of r.slice(5))
                        a.delete(e.id)
                }
                ,
                i.oncomplete = () => e(),
                i.onabort = () => r(i.error),
                i.onerror = () => r(i.error)
            }
            )
        }
        )
    }
    saveSlot(e, n) {
        return this.pack(this.slotKey(e, this.course === a.apex.course ? t : n.meta.season ?? `legacy`), n).then(e => this.put(m, e))
    }
    loadSlot(e, t=this.season) {
        return this.get(m, this.slotKey(e, t)).then(e => this.unpack(e))
    }
    saveReplay(e, t) {
        return this.queue(async () => {
            await this.put(h, await this.pack(e, t))
        }
        )
    }
    loadReplay(e) {
        return this.get(h, e).then(e => this.unpack(e))
    }
    deleteReplay(e) {
        return this.remove(h, e)
    }
    async close() {
        await this.writes,
        (await this.db)?.close()
    }
    async listReplays() {
        return (await this.all(h)).map( ({id: e, meta: t, bytes: n, automatic: r}) => ({
            id: e,
            meta: t,
            automatic: r,
            size: n.byteLength
        })).sort( (e, t) => t.meta.recorded.localeCompare(e.meta.recorded))
    }
}
;
export {u as AUTO_REPLAY_LIMIT, g as ReplayStore, f as replayId};
