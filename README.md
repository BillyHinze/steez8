# STEEZ8

A browser freestyle mountain game for **https://steez8.me**. The 0.5 update adds Ridgeline, a new jump layout on the alpine terrain, cross-domain account services, connection status, and static hosting support.

## Run locally

Use Node 24 and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:4173. Local accounts live in `data/` and are never committed. Copy `.env.example` to `.env` for deployment settings. No paid services or payment details are required by the configured deployment.

## Hosting

- Frontend: GitHub Pages, `BillyHinze/BillyHinze.github.io`, custom domain `steez8.me`.
- Source and backend: this repository, `BillyHinze/steez8`.
- Backend: Render **Free**, Singapore.
- Durable account database: Turso **Free**, Singapore. Secrets belong only in Render environment settings.

See [DEPLOYMENT.md](DEPLOYMENT.md) for publishing and service limits. A static upload by itself cannot provide accounts, multiplayer or saved progress.

## Check and build

```sh
pnpm test
BACKEND_ORIGIN=https://YOUR-SERVER.onrender.com pnpm build:pages
```

`dist/` is the frontend artifact for Pages or a manual Netlify upload. It contains the public backend URL, never the database key. `pnpm audit` checks the local reconstruction archive and asset hashes; original reference files intentionally remain outside the deployment repository.

The recovered game assets retain their original credits. This independent deployment is not the original Cork7 service. Cash purchases are disabled. Do not run the historical adaptation scripts over a release: they describe earlier reconstruction steps and would overwrite newer changes.
