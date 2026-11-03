# Free deployment

## Architecture

`steez8.me` serves static game files on GitHub Pages. The browser connects to an HTTPS Render Free web service for accounts, gameplay APIs and WebSockets. That service uses a Turso Free database with an ephemeral local replica. Writes go to Turso; accounts, sessions, progress and shared replays survive Render restarts.

The source repository is `BillyHinze/steez8`. The existing Pages repository remains `BillyHinze/BillyHinze.github.io`, preserving its domain configuration. Its publishing workflow checks out the source, installs dependencies, runs tests, builds `dist` and deploys Pages. Run **Actions → Publish steez8.me → Run workflow** after a source update. Render deploys source changes automatically.

## Backend settings

Render workspace: My Workspace. Service type: Web Service. Runtime: Node. Region: Singapore. Plan: **Free**. No disk, paid database or card is needed.

Build: `npx --yes pnpm@11.25.0 install --frozen-lockfile --prod`

Start: `node --experimental-vm-modules server/index.mjs`

Environment:

- `NODE_VERSION=24`, `NODE_ENV=production`, `HOST=0.0.0.0`
- `GAME_NAME=STEEZ8`, `PUBLIC_ORIGIN=https://steez8.me`
- `ALLOWED_ORIGINS=https://www.steez8.me,https://billyhinze.github.io`
- `DATA_DIR=/tmp/steez8`, `ASSET_CACHE_MB=24`, `VERIFICATION_CONCURRENCY=1`
- `PAYMENT_MODE=disabled`
- `TURSO_DATABASE_URL`: database connection URL
- `TURSO_AUTH_TOKEN`: private read/write token for this database, only in Render secrets

Never put the Turso token in GitHub, runtime-config.js, Netlify frontend variables or a browser. The server refuses to start on Render without durable database configuration.

## Frontend and DNS

The Pages repository uses GitHub Actions as its publishing source. The public backend HTTPS URL is supplied as `BACKEND_ORIGIN` during the build. `dist/CNAME` contains `steez8.me`; `.nojekyll` preserves `_next` assets. Standalone information and account pages are generated as directories for static routing.

The domain's apex A records are `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. Enable Enforce HTTPS after GitHub's certificate is available. `www` redirects to the primary domain.

For Netlify, upload **dist**, not public or the project folder. Build it with the same backend URL first. A new frontend domain also needs adding to Render's `ALLOWED_ORIGINS`.

## Free service limits and recovery

Render Free sleeps after 15 idle minutes and can take about a minute to wake. Basecamp displays a connection message and allows retry; solo play remains available. Free resources have usage quotas and are not an uptime guarantee. Keep billing upgrades disabled.

Turso stores the durable state. Download backups from its database dashboard. The local desktop `data/` is preserved separately and is not included in deployment; existing desktop accounts have not been migrated.

Email password recovery requires `RESET_WEBHOOK_URL` and optionally `RESET_WEBHOOK_TOKEN` connected to a mail provider. Until that is configured, production returns a clear unavailable message instead of claiming an email was sent. Local development retains its reset outbox. Never expose the outbox publicly.

One backend instance is supported: live rooms, queues and active matches are in memory. Server restarts end active matches. Completed account records persist. Cash checkout remains disabled.
