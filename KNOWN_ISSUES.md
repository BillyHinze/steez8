# Known limits and release checks

- New 3v3/4v4 matches use concurrent solo Apex attempts and a shared team scoreboard, rather than an eight-rider physical race room. A match needs six/eight real accounts; no bots fill empty queues.
- Original private server algorithms are unavailable. Ratings and deterministic UTC daily shop selection are independent equivalents.
- Cash purchases are disabled. Email recovery needs a configured mail webhook; production reports unavailable until connected. Local reset messages stay in a private development outbox.
- Four original optional chunks returned HTTP 404: accelerated MP4, route prefetch, standalone leaderboard and standalone shop. MediaRecorder provides clip fallback; local routes use the retained main game tabs or independent pages.
- Shared replay validation checks the original codec and metadata; it does not prove frame-by-frame correspondence or prevent automated input play.
- Automated tests cover complete service-level ranked/team/together matches and a verified cup. Full 400-player concurrent browser/load testing, every controller and every mobile/browser GPU combination have not been validated.
- macOS iCloud optimization evicted Desktop source/assets during development and caused read delays. Keep CORK7REWRITE downloaded in Finder to avoid hydration delays.
- Signed native desktop applications are not rebuilt. This is the local web game.
- Free hosting uses GitHub Pages, Render and Turso. Render sleeps when idle and has usage limits; active matches end on backend restarts. Large concurrent public load has not been validated.

No claim that every feature is production ready or identical to the original private service is made.
