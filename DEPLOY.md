# DEPLOY.md — Production deploy state

**Live URL:** https://www.kujaku.ai
**Apex:** https://kujaku.ai → 301 → https://www.kujaku.ai (GoDaddy forwarding, permanent, forward-only)
**Railway service:** kujaku-web (project: patient-renewal / Kujaku-ai)
**Railway URL:** https://kujaku-web-production.up.railway.app
**CNAME target:** 4a767cut.up.railway.app
**SSL:** Let's Encrypt via Railway (www) + GoDaddy cert (apex forwarding)
**Branch:** main, auto-deploys on push

## Env vars on Railway
- `AUTH_USERS` — raw JSON (no outer quotes, no backslash escapes) mapping name → bcrypt hash
- `SESSION_SECRET` — 96-char hex, distinct from local dev
- `DISCORD_WEBHOOK_URL` — currently empty (pings are no-ops until set)
- `NODE_ENV=production` — Railway-injected

## Current users (auth allowlist)
- XBurt (4-digit PIN — rotate before public exposure)
- Shaker (4-digit PIN — rotate before public exposure)

## DNS records on GoDaddy
- CNAME www → 4a767cut.up.railway.app
- TXT _railway-verify (apex) → railway-verify=<hash>
- TXT _railway-verify.data-btc → <hash>
- TXT _railway-verify.data-qc → <hash>
- TXT _railway-verify.kalshi15min-btc → <hash>
- A @ Parked → managed by GoDaddy forwarding
- MX, SPF, Outlook records for kujaku.ai email (untouched, load-bearing)

## Known Cycle 4 friction
- kujaku-meta was private; had to be made public so Railway could clone brand/dist during build
- Nixpacks cache mount conflicted with redundant `npm ci` in buildCommand — removed
- AUTH_USERS env var paste format differs from local .env (no outer quotes, no backslashes in Railway's UI)
- Apex SSL takes up to a few hours to provision via GoDaddy (non-blocking — www is what matters)

## Redeploy
Automatic on push to main. Manual: Railway dashboard → Deployments → Redeploy.

## Next cycles
- Cycle 5: login page sandbox → promote winner → replace placeholder login UI
- Cycle 6: home page sandbox or live data wiring on /crypto/btc (TBD)
- Cycle 7+: additional sectors/assets, MDX commentary, slash palette, Discord OAuth migration
