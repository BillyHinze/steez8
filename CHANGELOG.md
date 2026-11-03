# Independent rewrite updates

## 0.5.0 — Ridgeline and free hosting

- New Ridgeline layout on the alpine terrain: five main kickers, a side hip, two rail zones, live rooms and verified records.
- Static Pages build, standalone routes, configurable API/WebSocket origins and exact CORS allowlists.
- Trimmed email sign-in, clearer connection errors, Basecamp server status and retry, and persistent Turso account storage.
- Sixth scored park passport stamp, Ridgeline leaderboard selection, direct-link fixes and three new Updates entries.
- Render Free settings, one verification worker, bounded asset cache and durable shared replay records.

## 0.4.0 — Mountain Sessions

- Ranked 3v3 and 4v4 in the existing red format selector above Find Match; persistent format choice and search recovery. Six/eight real riders, party-preserving teams, ready checks, one verified solo Apex finish per rider, combined team scores, independent ratings, leaver penalties and teammate rating protection.
- Six solo modes: Time Attack, Score Rush, Clean Line, Air Time, Rail Jam and a five-park Tour. Mode/park leaderboards, personal bests, recent sessions, progress HUD and a rotating park pick.
- Mountain journal: five-park passport, verified run history, riding statistics and six lifetime milestones worth 675 POW.
- Three weekly goals worth 300 POW, alongside the existing 100 POW daily goals. Rewards are fixed, server-verified and idempotent; weeks start Monday 00:00 UTC.
- Three named saved outfits in the Locker, with ownership revalidation on equip and live rider refresh.
- Restored 180 external model textures missing from the earlier asset inventory. Outfit saves broadcast to mountain peers and parties after persistence. Invalid optional jacket normal maps referencing geometry buffers are skipped; cached incomplete portraits are invalidated.
- Static assets now support ETags, 304 responses and browser caching. Canonical input hashes prevent alternate gzip encodings from counting as different session logs.
- Release notes appear in the original Updates tab. No additional Basecamp navigation tabs or fake cash checkout.

## 0.3.0 — Daily goals

After the baseline multiplayer/browser checks passed, added three daily objectives: finish three runs, score 5,000 points and finish in two parks. Earn up to 100 POW per UTC day. Rewards use server-recorded verified runs and atomic, idempotent claims. Menu → Daily goals opens an in-game panel; /challenges provides a standalone page. The original account balance refreshes immediately after claims. Cash checkout remains disabled.

## 0.2.0 — Independent full-stack services

Ranked/team/friendly matches, parties/private rooms/follow, catalog transactions, gifts/returns, pass progression, cups, source verification, replay sharing, recovery outbox and private owner tools. Configured the requested owner with every equipment value, current paid pass entitlement, OWNER badge and a real administrative POW grant. Preserved original code/assets separately with provenance. Moved the complete project to Desktop/CORK7REWRITE.
