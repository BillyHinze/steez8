import fs from "node:fs";
import path from "node:path";

// Which input-log versions the score verifier accepts, per park.
//
// The browser stamps every input log with its park's simulation version
// (the `encode(e=N)` defaults on the encoder classes in engine-*.js). The
// backend deploys from `main` immediately, but steez8.me only changes when the
// deploy repository's pinned commit is bumped. A simulation change therefore
// has to be verifiable at BOTH the old and the new version during a release.
//
// LIVE means "the chunk files in public/" (what the current client runs).
// Any other value names a directory in server/simulations/ that holds frozen
// copies of SIMULATION_FILES exactly as they were shipped for that version.
//
// To ship a simulation or scoring change:
//   1. Copy the current SIMULATION_FILES from public/_next/static/chunks into
//      server/simulations/<label>/ (unchanged bytes).
//   2. Point the current version number at "<label>" below.
//   3. Make the change, bump the encoder default for each affected park in
//      engine-*.js, and register the new number as LIVE.
//   4. Record new golden runs (scripts/record-golden-runs.mjs). Keep the old
//      ones: they must still verify against the frozen copy.
// Remove a frozen version only after every live client has moved on.
export const LIVE = "live";
export const SIMULATIONS = Object.freeze({
  nordryggen: Object.freeze({ 39: LIVE }),
  apex: Object.freeze({ 36: LIVE }),
  ridgeline: Object.freeze({ 36: LIVE }),
  bigair: Object.freeze({ 31: LIVE }),
  forestline: Object.freeze({ 8: LIVE }),
  halfpipe: Object.freeze({ 7: LIVE }),
});
// Chunks the verifier reads from public/ rather than the recovered originals.
export const SIMULATION_FILES = Object.freeze([
  "active-course-BUb4R-L7.js",
  "parks-1qsmaijL.js",
  "live-protocol-j28FoPiw.js",
  "input-log-BvMdAwyG.js",
]);
export const LIVE_DIRECTORY = path.resolve(import.meta.dirname, "../public/_next/static/chunks");
export const FROZEN_ROOT = path.resolve(import.meta.dirname, "simulations");

export function acceptedVersions(park) {
  return Object.keys(SIMULATIONS[park] || {}).map(Number).sort((a, b) => a - b);
}

export function liveVersion(park) {
  const entry = Object.entries(SIMULATIONS[park] || {}).find(([, source]) => source === LIVE);
  if (!entry) throw Error("No live simulation registered for park: " + park);
  return Number(entry[0]);
}

// Directory holding SIMULATION_FILES for this park/version, or null when the
// version is not accepted.
export function simulationDirectory(park, version) {
  const source = SIMULATIONS[park]?.[version];
  if (!source) return null;
  if (source === LIVE) return LIVE_DIRECTORY;
  if (!/^[a-z0-9][a-z0-9._-]{0,63}$/.test(source)) throw Error("Invalid frozen simulation label: " + source);
  return path.join(FROZEN_ROOT, source);
}

export function frozenDirectories() {
  const labels = new Set(Object.values(SIMULATIONS).flatMap((versions) => Object.values(versions)).filter((s) => s !== LIVE));
  return [...labels].map((label) => path.join(FROZEN_ROOT, label));
}

export function missingSimulationFiles(directory) {
  return SIMULATION_FILES.filter((file) => !fs.existsSync(path.join(directory, file)));
}
