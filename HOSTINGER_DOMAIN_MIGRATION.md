# STEEZ8 temporary domain: novacryptotool.com

This is a **coordinated cutover guide**, not an automatic domain migration.
The STEEZ8 static site stays on GitHub Pages, and the ranked/accounts API stays
on Render/Turso. Do not change player data, database keys, or the API origin.

## Before changing DNS

- Make sure you control `novacryptotool.com` and it is active.
- Save a backup/export of its existing Hostinger DNS zone.
- Changing the root `@` and `www` records **replaces the existing website**
  at those hostnames. Do not change MX, SPF, DKIM, DMARC, or unrelated records.
- Do **not** set up a misleading mirror to circumvent network administrators'
  access controls. If a managed network blocks a site, seek approval.

## 1. DNS at Hostinger

Go to Domains > DNS > select `novacryptotool.com`.
If the domain uses non-Hostinger authoritative nameservers, edit records at
that authoritative DNS provider instead.

Remove conflicting old `@` A/AAAA entries (do not add extra conflicting
addresses). Configure exactly:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | billyhinze.github.io |

Hostinger's default TTL is fine. Do not create two `www` records.
Keep the Render API at `steez8-api.onrender.com`.

## 2. Render browser origin access

In Render's existing STEEZ8 web service, update the origins **without
deleting the existing database configuration or keys**:

```env
PUBLIC_ORIGIN=https://steez8.me
ALLOWED_ORIGINS=https://www.steez8.me,https://billyhinze.github.io,https://novacryptotool.com,https://www.novacryptotool.com
```

This stages the Hostinger domain while preserving the old website origin.
The repository `render.yaml` documents the desired configuration, but a
`render.yaml` edit does **not** by itself prove that an existing Render
service's live environment has been updated. Confirm in the Render dashboard
and verify browser CORS and WebSocket handshakes from the new domain.

## 3. GitHub Pages cutover (only when DNS and Render are ready)

In `BillyHinze/BillyHinze.github.io` > Settings > Pages, change **Custom
domain** from `steez8.me` to `novacryptotool.com`.

The site is published by the workflow in
`BillyHinze/BillyHinze.github.io/.github/workflows/pages.yml`, which checks
out a pinned source revision from `BillyHinze/steez8`. Update the build
step's environment with:

```yaml
PUBLIC_SITE_ORIGIN: https://novacryptotool.com
BACKEND_ORIGIN: https://steez8-api.onrender.com
```

Set the same `PUBLIC_SITE_ORIGIN` on the production verification step.
The source build then emits `CNAME=novacryptotool.com` and generates new
canonical/share metadata. Publish from a tested source SHA and wait until
the GitHub Pages deploy **and** post-deploy verification succeed.

Use GitHub's **Enforce HTTPS** when the new TLS certificate is active.
The `www` certificate is a separate check and may take time to provision.
Do not assume it works just because apex HTTPS works.

## 4. Verify before sharing the new address

- `novacryptotool.com` resolves to GitHub Pages IPv4/IPv6 addresses.
- HTTPS main page, `/runtime-config.js`, `/status/`, and models load.
- `https://www.novacryptotool.com` redirects to the canonical site with
  a valid certificate.
- `GET https://steez8-api.onrender.com/api/health` succeeds with
  `Origin: https://novacryptotool.com` and the expected CORS header.
- Anonymous WebSocket handshake from the new origin succeeds.
- Test login, accounts, ranked multiplayer and solo play in multiple browsers.

## Rollback

If the new hostname is not ready, keep the old GitHub Pages custom domain
and production `PUBLIC_SITE_ORIGIN=https://steez8.me`. Revert the GitHub
Pages custom domain and workflow variable together before changing DNS again.
Do not remove Turso data or credentials.

This domain migration does not guarantee availability on networks with
intentional website restrictions. Respect those networks' policies.
