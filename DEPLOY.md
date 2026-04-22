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

## Cycle 7 — app shell + brand extraction (2026-04-21)

**Summary:** Promoted v04-final sandbox winner to production home. Extracted 6
inline treatments from sandbox into brand as first-class recipes. Added a 7th
modifier (.is-centered-ticker) for a clean primitive. Shell now lives behind
auth at /.

**What changed:**
- Home page replaced: Cycle 3's sector grid → minimal canvas with "press / to search"
- New Nav.astro: full shell composition (overlay rail + centered ticker masthead + palette + user)
- New Palette.astro: palette DOM + inline JS (/ key open, Esc close, click-outside close)
- Brand recipes added:
  - `.nav-rail.is-overlay` (+ sibling selector for main reservation)
  - `.nav-masthead.is-centered-ticker`
  - `.nav-masthead.is-suppressed`
  - `.nav-masthead .user`
  - `.search-palette` family (8 classes)
  - `--user-slot-width` layout token
- `.nav-masthead` base gained `position: relative` (post-deploy patch — ticker was anchoring to `.nav-composition` on prod)
- `.palette-trigger` gained `align-self: center` + `margin-left: 20px` (post-deploy patches)
- `.nav-masthead .ticker-viewport` gained opacity transition

**Commit SHAs (kujaku-meta / brand):**
- 68fd03a — recipes
- 562dc0e — specimen + STYLE.md
- b7b0d79 — .nav-masthead position: relative (post-deploy)
- 21e996d — .palette-trigger align-self: center (post-deploy)
- 926b4c8 — .palette-trigger margin-left: 20px (post-deploy)

**Commit SHAs (kujaku-web / site):**
- 9f07de6 — submodule bump to 562dc0e
- 87a0787 — shell promotion to production
- c67fbae — submodule bump to b7b0d79
- a644a45 — Palette.astro a11y (name/id/autocomplete)
- d93fae5 — submodule bump to 21e996d
- 7224543 — submodule bump to 926b4c8

**Cycle 7 friction (for future cycles):**
- Submodule lag surfaced during precondition check — handle by rolling forward, not rewinding.
- Railway redeploys CSS-only changes in <30s; component changes ~40s. Faster than the 2-min assumption.
- Brand extraction dropped an inline `position: relative` on `.nav-masthead` — sandbox had it, first extraction didn't. Post-deploy patch caught it. Lesson: when extracting an inline composition into primitives, audit every declaration — don't judge "consumer concern" without verifying.
- Same lesson repeated on `.palette-trigger` `margin-left: 20px` (judged "consumer positioning" — was actually part of the component's intended breathing room).
- CSP eval console warnings traced to browser extensions, not site code. Noise.

**Known gaps (Cycle 8+ targets):**
- Palette dropdown renders empty state only — no backend search yet
- Home page has no content — sector/asset links only reachable via direct URL
- No live data anywhere

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
