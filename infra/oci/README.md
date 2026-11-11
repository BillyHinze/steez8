# STEEZ8 — Oracle Always Free staging deployment

This is an **unprovisioned deployment package**, not a live Oracle VM. The
existing Render backend and GitHub Pages production build are intentionally
untouched. The deployment is designed for an eligible, authorised Oracle Cloud
account owner.

## Safety and resource constraints

- OCI Always Free account, with available `VM.Standard.A1.Flex` shape in its
  **home region**. As of November 2026, the Always Free ARM allocation is up to
  **2 OCPUs and 12 GB RAM** total, not 4/24. This Terraform stack requests
  exactly one VM at 2 OCPUs/12 GB and a 50 GB boot volume.
- A free VM may be unavailable, reclaimed when idle, or subject to platform
  limits. Do not turn on paid upgrades, create paid load balancers, or assume
  performance until measured.
- Account creation and payment/identity checks must be completed by an **eligible
  account owner** using their own accurate information. Never evade checks or
  publish billing information.
- OCI Resource Manager/Terraform must be authenticated to the owner account.
  Terraform variables: `region` (home region), `compartment_ocid`,
  `availability_domain`, `ssh_public_key`, `ssh_allowed_cidr` (the
  administrator's IP, not `0.0.0.0/0`).
- The VM is provisioned with only SSH (restricted to a trusted admin network),
  HTTPS and HTTP inbound. The actual game is **not** started by provisioning,
  and no production DNS is switched.

## What a connected cloud deployment must finish

1. Provision `infra/oci/main.tf` in the approved tenancy after checking the
   final plan contains **only Always Free resources**. Keep Terraform state in a
   secure backend; don't commit state or `.tfvars` files.
2. The Ubuntu 24.04 ARM64 cloud-init installs Docker and downloads the public
   STEEZ8 repo. It does **not** carry passwords or API tokens.
3. Securely transfer the existing Render deployment's **same Turso database URL
   and auth token** to `/etc/steez8/backend.env`, only on the VM, with `0600`
   permissions. Never commit either secret, paste it into chat, add it to
   Terraform, or send it to the browser. This is needed to keep players'
   accounts, scores and progress. Preserve current Render/Turso settings.
4. Configure a domain **approved for the backend** (for example,
   `api.steez8.me`) with an A record pointing to the new VM. Add
   `STEEZ8_API_HOST=api.steez8.me` to `/opt/steez8/deploy/oci/.env`.
   HTTPS certificates are issued automatically by the Caddy container.
5. Start the staging stack with
   `cd /opt/steez8 && docker compose -f deploy/oci/compose.yaml up -d --build`.
   OCI network + Ubuntu firewall must allow ports 80 and 443; **never** expose
   Node's port 10000 or Turso credentials publicly.
6. Test the staging backend from outside the VM:
   `node scripts/verify-oci-staging.mjs https://api.steez8.me`. This checks
   readiness, browser CORS and the authenticated WebSocket handshake.
   Independently test account login, existing data, and a complete two-browser
   1v1 game before any production changes.
7. Only after all tests succeed, modify the **separate GitHub Pages publishing
   workflow** to build with the OCI backend origin. Deploy the frontend,
   monitor errors and preserve Render as the rollback target.
8. Do capacity/load tests before advertising hundreds of simultaneous players.
   All live rooms are in one Node process; this is **one VM, not horizontal
   scaling**. Hardware limits, Turso throughput, WebSocket traffic and the
   game physics verification queue may constrain capacity.
9. Monitor disk, database errors, bandwidth, memory, process restarts, TLS
   renewals and valid backups. Apply security updates and protect the SSH key.

## Expected configuration files on the VM

`/etc/steez8/backend.env` (root-owned, never committed):

```dotenv
TURSO_DATABASE_URL=<existing Turso connection URL>
TURSO_AUTH_TOKEN=<existing secret token>
GAME_NAME=STEEZ8
ASSET_CACHE_MB=24
VERIFICATION_CONCURRENCY=1
```

`/opt/steez8/deploy/oci/.env`:

```dotenv
STEEZ8_API_HOST=api.steez8.me
```

These are **templates only**. Replace the placeholders through a secure
connection. Do not write real secrets into this repository.

## Scope

This package prepares a conventional HTTPS, WebSocket-capable container host
with the current Node 24 STEEZ8 backend and Caddy automatic TLS. The existing
GitHub Pages domain stays on GitHub; it does not automatically resolve or
override an institution's website category filtering or a visitor's network
restrictions. No OCI account, VM, DNS record, certificate, or billing change
has been created merely by adding these files.
