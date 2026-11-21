import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sources from "./recovered/runtime-sources.mjs";
import {
  SIMULATION_FILES,
  liveVersion,
  simulationDirectory,
} from "./simulation-versions.mjs";
const cache = new Map();
const colliderData = JSON.parse(
  fs.readFileSync(
    new URL("./recovered/course-colliders.json", import.meta.url),
    "utf8",
  ),
);
// Physics for a park at a specific input-log version (default: the version
// the current client sends). See simulation-versions.mjs.
export function physicsFor(park = "nordryggen", version) {
  if (version === undefined) version = liveVersion(park);
  const chunks = simulationDirectory(park, version);
  if (!chunks)
    return Promise.reject(Error(`Unsupported simulation version ${version} for ${park}`));
  return physicsFromDirectory(park, chunks, park + "@" + version);
}
// Exported for tests: build physics from an explicit directory of
// SIMULATION_FILES (for example a frozen copy).
export function physicsFromDirectory(park, chunks, key = park + "@" + chunks) {
  if (cache.has(key)) return cache.get(key);
  const pending = (async () => {
    const context = vm.createContext({
      console,
      Math,
      Date,
      Map,
      Set,
      WeakMap,
      WeakSet,
      Promise,
      ArrayBuffer,
      DataView,
      Uint8Array,
      Uint16Array,
      Uint32Array,
      Int8Array,
      Int16Array,
      Int32Array,
      Float32Array,
      Float64Array,
      TextEncoder,
      TextDecoder,
      URL,
      URLSearchParams,
      Response,
      Request,
      Headers,
      Blob,
      CompressionStream,
      DecompressionStream,
      crypto: crypto.webcrypto,
      atob,
      btoa,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      performance,
      window: {
        location: { hostname: "independent.local", search: `?park=${park}` },
      },
      navigator: { userAgent: "Independent verifier" },
      localStorage: {
        getItem() {
          return null;
        },
      },
      document: {
        createElement() {
          return {
            relList: {
              supports() {
                return true;
              },
            },
          };
        },
        addEventListener() {},
        querySelectorAll() {
          return [];
        },
      },
    });
    const modules = new Map();
    async function load(name) {
      name = path.basename(name);
      if (modules.has(name)) return modules.get(name);
      if (name === "index-CXkhr5iE.js") {
        const m = new vm.SyntheticModule(
          ["t"],
          function () {
            this.setExport("t", async (fn) => fn());
          },
          { context },
        );
        modules.set(name, m);
        return m;
      }
      // Course definitions must match what the browser executes, including new parks.
      // The simulation files come from public/ (LIVE) or a frozen copy.
      let source = SIMULATION_FILES.includes(name) ? fs.readFileSync(path.join(chunks, name), 'utf8') : sources[name];
      if (!source) throw Error("Missing verifier source: " + name);
      if (name === "input-log-BvMdAwyG.js")
        source +=
          "\nexport {Ge as cupSchedule,Ye as cupCreate,rt as cupReady,it as cupMark,at as cupWithdraw,st as cupTick,ct as cupStandings,ut as cupLane,dt as cupPosition,vt as cupHeats};";
      const m = new vm.SourceTextModule(source, {
        context,
        identifier: name,
        importModuleDynamically: async (n) => {
          const m = await load(n);
          if (m.status === "unlinked") await m.link(load);
          if (m.status === "linked") await m.evaluate();
          return m;
        },
      });
      modules.set(name, m);
      return m;
    }
    async function module(name) {
      const m = await load(name);
      if (m.status === "unlinked") await m.link(load);
      if (m.status === "linked") await m.evaluate();
      return m.namespace;
    }
    const course = await module("active-course-BUb4R-L7.js"),
      input = await module("input-log-BvMdAwyG.js"),
      collision = await module("park-collisions-BVQXeNDo.js"),
      three = await module("replay-Bo7bmJ9f.js");
    let colliders;
    if (park === "forestline")
      colliders = (await module("forest-line-solids-D71Lgqaf.js")).t();
    else if (park === "halfpipe")
      colliders = (await module("halfpipe-solids-BQjbOIHB.js")).t();
    else if (["nordryggen", "apex", "bigair", "ridgeline"].includes(park)) {
      colliders = new collision.t();
      const data = colliderData[park === 'ridgeline' ? 'apex' : park];
      for (const line of data.trim().split("\n")) {
        const [name, ...values] = line.split(" "),
          v = values.map(Number);
        colliders.addBox(
          name,
          new three.Tn(v[0], v[1], v[2]),
          new three.Tn(v[3], v[4], v[5]),
          new three.Xt(v[6], v[7], v[8], v[9]).normalize(),
        );
      }
    }
    return {
      course,
      input,
      module,
      createSimulation({ competitive = false, lane = 0, cup = null } = {}) {
        const s = new course.x();
        s.collisions = colliders;
        if (competitive) {
          s.boardLift();
          s.fastTravel();
          s.z = course._ - 3;
          s.x = course.O(s.z) + lane;
          s.y = course.Y(s.x, s.z);
          s.heading = Math.atan(course.j(s.z));
          s.travelHeading = s.heading;
          if (cup) {
            s.x += input.cupLane(cup.slot, cup.count) * 1.6;
            s.y = course.Y(s.x, s.z);
          }
        } else s.arrive();
        return s;
      },
    };
  })();
  cache.set(key, pending);
  // Do not keep a failed build cached forever; the next request retries.
  pending.catch(() => { if (cache.get(key) === pending) cache.delete(key); });
  return pending;
}
