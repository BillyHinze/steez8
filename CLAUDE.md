# STEEZ8 — notes for Claude Code

STEEZ8 is a 3D browser freestyle ski and snowboard game at **https://steez8.me**.
Everything below was checked against the source at commit `b103d42` and the domain cleanup in `f7888a1` (2026-11-21).
If the code no longer matches these notes, trust the code and update this file.

## 1. The most important fact: the game client is shipped build output

There is **no editable source for the game client** in this repository.
`public/_next/static/chunks/*.js` are minified Rolldown/Three.js/React production bundles recovered from the original Cork7 game. They were then patched by hand. The patches are listed in `PATCHES.json` with original and patched SHA-256 values. `server/recovered/runtime-sources.mjs` holds a gzipped copy of the *original* bundles.

Consequences:
- Chunk filenames such as `engine-Dlp-9Jq2.js` are fixed identifiers. **Never rename them.** Imports between chunks, `server/physics-v2.mjs`, tests and deploy-repo smoke checks all name them directly.
- Minified exports are single letters (for example `course.x` = SkiSimulation and `three.Tn` = Vector3). Before using one, look up the chunk's trailing `export{...}` statement.
- Readable STEEZ8 code goes in **standalone ES modules in `public/`** wherever possible (`signature-grab-poses.js`, `grab-presets.js`, `grab-studio.js`, `sessions.js`, `squads.js`, `journal.js`, `challenges.js`, `loadouts.js`). Inside a chunk, add only small hooks that call those modules. The pattern to copy: `rider-animation-*.js` line 1 imports `signature-grab-poses.js`.
- `public/independent.js` adds STEEZ8 UI (menu links, Locker link, owner bar) on top of the React app. It uses a `MutationObserver` and finds elements with CSS selectors such as `.bc-locker-controls` and `[aria-labelledby="game-menu-title"]`. Never mutate React-owned nodes in a way React will fight. Grab Lab crashed the Locker this way (PR #20 → #22); the fix was an isolated portal appended to `document.body`.
- `git config core.autocrlf` is `true` on the Windows dev machine and there is no `.gitattributes`. Keep edits to minified chunks small and check `git diff --stat` for whole-file line-ending churn.

## 2. Layout

| Path | Purpose |
|---|---|
| `public/index.html` | Archived Next.js SSR document (about 100 KB, embedded RSC payload). `build-static.mjs` rewrites it. |
| `public/_next/static/chunks/` | Game client (see the table below). |
| `public/*.js` / `*.css` | STEEZ8 modules: Grab Lab, signature poses, sessions, squads, journal, goals, status page, backend warm-up, `services.js` (routes Supabase-style client calls to the backend). |
| `public/models/` | GLBs: `rider-v20.glb` (7.6 MB rider with skeleton, skis, board and poles), rails, lift, venue, Shirakumo tram. |
| `public/items/`, `sfx/`, `music/`, `onboarding/`, `updates/` | Cosmetics, audio and UI art (about 189 MB in `public/`). |
| `server/` | Node 24 backend: HTTP API, Supabase-compatible auth/REST emulation, WebSockets, verification. |
| `server/recovered/` | Original bundles (verifier fallback), `catalog-v2.json` (item catalog), `course-colliders.json`. |
| `migrations/001_initial.sql` | The only schema. It is idempotent and runs at every boot. |
| `scripts/` | `build-static.mjs` (Pages build), `check-public-site.mjs`, `locker-browser-smoke.mjs` (Playwright), reachability audit. |
| `tests/*.test.mjs` | `node:test` suites (106 tests). |

Key client chunks:
- `engine-*` (945 KB): main game runtime, input mapping (keyboard/gamepad → `{steer, airRoll, forward, brake, jump, grab, grabStyle, cork, over, butter}`), the SNOWBOT AI and the scene.
- `active-course-*`: **deterministic `SkiSimulation`**, one copy per park family (8 near-duplicate classes). It holds physics, rails, butter, flips/spins/cork, the grab ledger, scoring and trick names (`Ft`/`It` arrays = ski/board grab names).
- `rider-animation-*`: animation controller: clip blending, foot IK, the `GrabContact` hand solver, `PoleGrip`, landing motion, cloth.
- `rider-outfit-*` and `rider-appearance-*`: equipment meshes and outfit validation. The server imports `rider-appearance` for validation.
- `rider-locker-*`: 3D Locker preview. It listens for the `steez8:preview-grab` event.
- `replay-*`: Three.js plus the replay codec. `input-log-*`: input-log encoder and cup scheduling. `live-protocol-*`: room capacities and the binary pose packet validator.
- `parks-*`: park list `nordryggen, apex, shirakumo, bigair, forestline, ridgeline, halfpipe`. "The Yard" = `nordryggen`.

## 3. Gameplay systems

**Simulation and scoring** (`active-course-*`): fixed 1/60 s steps. Air score = rotation judge (spins, flips, off-axis/cork, switch) × airtime/height, then repeat decay (`he(repeat)`). Grab points `De(holdTime, distinctGrabs, rotation, repeat, longestHold)`; grab multiplier `Ce(distinctGrabs, longest)`; line multiplier `_e(chainLinks)` across rail → air → butter chains. A grab counts after 0.25 s of continuous hold (`Lt` ledger, bitmask per style). **The grab style ID only affects distinctness and the trick name.** All 8 grabs score the same.

**Grab styles (IDs are stable; never renumber):** `public/grab-presets.js` `GRAB_CATALOG`, IDs 0–7. The three grab buttons (mute/tail/japan) map to slots. Grab Lab writes `globalThis.__steez8GrabActiveSlots` and `engine-*` turns slot → style ID (clamped 0..7). The input log carries `grabStyle` in 7 bits (`equipment & 127`), and the verifier rejects values above 15.

**Custom (signature) grab animation (IDs 4–7, skis only)** in `public/signature-grab-poses.js`. History: PR #23 → #24 → #25. Current, stable design:
- `applySignatureGrabPose` adds authored per-bone rotations through `controller.overlay()` and authored ski rotations through `controller.skiRotation()`. It runs **after** the controller saves its leg *and* arm smoothing baseline (`lastJoints`). Saving after the overlay caused rotations to compound frame after frame.
- For styles 4–7 the original `GrabContact.update()` hand solver is **not** run (it only resets). `reachSignatureGrab` (two-bone hand-to-ski IK) exists but is **intentionally not imported or called**. Two IK passes on the same arm caused elbow flips and wrist twisting.
- Poles: `PoleGrip.update` is skipped while a signature grab is airborne. `stabilizeSignaturePoles` aims the shafts in the pole's parent space from a fixed rider-space direction, never relative to the previous frame.
- Snowboard styles 4–7 (Stalefish/Melon/Tailfish/Seatbelt) get **no** signature pose (`controller.board` returns early) and fall back to board clips.
- Debug: `?grabDebug` or `window.__steez8GrabDebugEnabled` exposes `window.__steez8SignaturePose` and `__steez8AnimatorTrace`.
- Rules: exactly one system owns a joint each frame. Do not add a second IK or orientation solver to arms/wrists. Do not write rotations that build on the previous frame's quaternion. Overlays must be recomputed from the saved baseline every frame.

**Server-authoritative scores** (`server/verify-v2.mjs`, `verification-worker-v2.mjs`, `physics-v2.mjs`): the client uploads a gzipped input log (header `[1][u32 version][u32 steps]`, then 6 bytes per step: i16 steer, i16 airRoll, u8 flags, u8 equipment). One warm worker thread replays it through the real client simulation inside `node:vm`. It loads `active-course`, `parks`, `live-protocol` and `input-log` from **`public/`** and everything else from the recovered originals. Per-park input-log versions are checked (`nordryggen 39, apex 36, ridgeline 36, bigair 31, forestline 8, halfpipe 7`). Ridgeline reuses Apex colliders. **Shirakumo is not in the verifier course list.**
→ **Any change to simulation code changes verified scores.** Accepted versions are registered in `server/simulation-versions.mjs`. `LIVE` means the chunks in `public/`; any other label is a frozen copy of the four simulation files in `server/simulations/<label>/`. The worker reads the version from the log header and loads that simulation (`physicsFor(park, version)`).

**Shipping a simulation or scoring change (mandatory procedure):**
1. Copy `SIMULATION_FILES` from `public/_next/static/chunks/` unchanged into `server/simulations/<label>/`, and point the current version number at `<label>`.
2. Make the change. Bump the encoder default (`encode(e=N)`) for each affected park in `engine-*.js` (or the base default 39 in `input-log-*.js` for nordryggen), and register the new number as `LIVE`.
3. Run `node --experimental-vm-modules scripts/record-golden-runs.mjs`. It adds runs for new versions and never overwrites existing ones.
4. `tests/simulation-versions.test.mjs` must pass. Old golden runs must verify against the frozen copy, the client's encoder versions must match the registry, and every accepted version must have a golden run. **Never edit `tests/fixtures/golden-runs.json` to make a failing golden pass.** A failure there means verified scores changed for an existing version.
5. After the frontend release has been live long enough, remove the frozen version in a later PR.

The scripted golden rider covers every park, all grab styles 0–7 with holds of varying length, rails and chained tricks. Halfpipe and Big Air produce little or no trick score, so scoring changes there are weakly covered.

**Multiplayer** (`server/realtime-v2.mjs`, `competition.mjs`, `cups.mjs`, `squads.mjs`): authenticated WebSocket rooms per park (capacity 20–30, overflow rooms `park-N`). Each client sends its own pose as a 98/194-byte binary packet; the server checks the format and relays it, with no server-side movement authority. The server also handles chat with moderation, invites, parties and follows. Ranked 1v1/2v2 duels are turn-based "drops" verified by physics. 3v3/4v4 squads are concurrent solo Apex runs with summed scores. Cups are owner-created timed events. All live state is in memory on one instance and a restart ends active matches.

**Accounts and data** (`server/store.mjs`): Supabase-compatible `/auth/v1/*` and `/rest/v1/*` routes, so the original client works unchanged. Passwords use scrypt and sessions use hashed access/refresh tokens. Storage is one generic table `records(collection,id,body JSON)` plus `users`, `sessions`, `password_resets` and `metadata`. In production this is libSQL with a Turso embedded replica (`TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`); locally it is `node:sqlite` (or libsql when `DATABASE_DRIVER=libsql`). `store.rows(collection)` loads and parses **the entire collection**, and the REST filters run in JS.

**Economy and progression:** `economy.mjs` (POW ledger, shop with a deterministic UTC daily selection, gifts, returns, season pass), `challenges.mjs` (daily/weekly goals), `journal.mjs` (passport, milestones), `sessions.mjs` (six solo modes and their boards), `loadouts.mjs` (three outfit slots), `grabs.mjs` (per-account grab loadout). Rewards are idempotent and only verified runs count. Cash checkout is disabled (`PAYMENT_MODE=disabled`). The owner is bound to `OWNER_ACCOUNT_ID`.

## 4. Commands

```sh
pnpm install --frozen-lockfile        # pnpm 11.25.0, Node >= 24 (npx --yes pnpm@11.25.0 if pnpm is absent)
pnpm dev                              # http://127.0.0.1:4173, data in ./data (never commit)
DATABASE_DRIVER=libsql pnpm test      # what CI runs
BACKEND_ORIGIN=https://steez8-api.onrender.com PUBLIC_SITE_ORIGIN=https://steez8.me pnpm build:pages   # -> dist/
LOCKER_TEST_SIGNED_IN=1 node scripts/locker-browser-smoke.mjs   # needs Playwright and running static + API servers (see .github/workflows/locker-browser-regression.yml)
```

On Windows, all assertions pass but 7 tests report `EPERM` from `fs.rmSync` in their cleanup, because SQLite files are still open. Linux CI is not affected. Treat any *other* failure as real.

Tests cover auth, privacy, economy idempotency, ranked/team/cup flows through real physics verification, replay forgery, the grab catalog, and source-shape assertions for the signature grabs. **No automated test renders and inspects animation frames.** Animation changes need a browser check (Locker preview and an in-run grab, Chromium and WebKit).

## 5. Deployment (two repositories)

- **Backend:** Render free web service `steez8-api` (Singapore), deployed **automatically from `main` of this repository** (`render.yaml`). It cold-starts after 15 minutes idle. `/api/health` is served immediately while the database warms up (`gateway.mjs`).
- **Frontend:** `BillyHinze/BillyHinze.github.io`. Its `source-revision.txt` contains `Commit: <40-char SHA>`. A push changing that file runs `pages.yml`, which: checks the Pages custom domain is `steez8.me` → checks out this repo at that SHA → `pnpm test` → `build:pages` → asserts `CNAME`/canonical are `steez8.me` and contain no `novacryptotool.com` → deploys → runs `scripts/check-public-site.mjs` against production.
- `build:pages` appends `?release=<hash of all js/css>` to every module reference, so a new release cannot load stale cached chunks.
- To verify a release, fetch live files and compare them with the pinned commit, ignoring `?release=` and CRLF. Do not rely on the workflow status alone.

**Production safety rules**
- The domain is **steez8.me**. Never deploy to or make anything canonical on `novacryptotool.com` (a former temporary domain).
- Never wipe, recreate, migrate destructively or overwrite the Turso database. The schema is `CREATE TABLE IF NOT EXISTS` and runs at every boot, so any schema change must be additive and idempotent. Back up from the Turso dashboard before any data change, and get the owner's approval.
- Secrets (`TURSO_AUTH_TOKEN`, `STEEZ8_GATEWAY_TOKEN`, reset webhook) belong only in Render. Never put them in the repository, `runtime-config.js` or `dist/`.
- **Version skew:** merging to `main` deploys the backend immediately, but the frontend changes only when the deploy repo's SHA is bumped. For simulation changes, follow the versioning procedure in §3 so the backend accepts both the old and new client. Other protocol changes (WebSocket messages, API shapes) need equivalent backward compatibility.
- Use a branch and a PR. CI (`ci.yml`) and the Playwright Locker regression run on PRs.

## 6. Known limitations and stale items (as of b103d42)

- Temporary domain retired 2026-11-21 (steez8#27, BillyHinze.github.io#5). Deploy-repo checks (`grab-lab-check`, `global-reachability`, `availability-monitor`) target steez8.me. `render.yaml` is only a blueprint: the live Render `ALLOWED_ORIGINS` is whatever is set in the Render dashboard.
- The signature-pose file header says the reach helper is unused, and it is. The hands follow an authored pose and are not pinned to the ski mesh.
- `store.rows()` full-collection scans (leaderboards, journal, challenges, pow ledger) grow as O(total records) per request.
- One backend instance and in-memory matches. No bots fill queues. 3v3/4v4 squads are not shared physical runs.
- Shirakumo is selectable but is not a verified course.
- Each park change in solo is a full page navigation and reloads every chunk (from cache) plus about 70 individual SFX files. The rider GLB is 7.6 MB.
- Some original Cork7 branding remains in assets (for example the default ski graphics) and in identifiers (`CORK7_CONFIG`, localStorage keys). Renaming identifiers can break saved state; change art and text only deliberately.
- Do not run historical adaptation scripts over a release (see README).
