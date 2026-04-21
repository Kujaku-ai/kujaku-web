# kujaku-web

Layer 3 of the Kujaku platform. Public-facing frontend at kujaku.ai.

See `SITE.md` for the spec. See `SETUP.md` for the Cycle 1 setup that produced this scaffold.

Sibling repos:
- `kujaku-meta` — design system (brand/) + platform docs (SYSTEM.md)
- `kujaku-data-btc` — Layer 1 BTC collector
- `kujaku-bot-kalshi15min-btc` — Layer 2b Kalshi BTC bot
- `charting-calculations` — Layer 2a ICT indicators

## Dev

Run submodule init first, then install and dev:

- nvm use 20
- git submodule update --init --recursive
- npm install
- npm run dev

Served at http://localhost:4321

## Deploy (Railway)

Runtime: Railway. Build: NIXPACKS (auto-detected). See `railway.json` for the build command.

### Env vars (set in Railway dashboard)
- `AUTH_USERS` — single-quoted JSON map of name -> bcrypt hash. Must use `\$` escaping. See `.env.example`.
- `SESSION_SECRET` — 96-char hex (generated independently from local dev). 
- `DISCORD_WEBHOOK_URL` — optional webhook for login pings.
- `NODE_ENV=production` — Railway usually sets this automatically; confirm it's present.

### First deploy
1. Create new service in the Kujaku-ai Railway project, connected to this repo's main branch.
2. Set the three env vars above in the dashboard.
3. Railway runs `git submodule update --init --recursive && npm ci && npm run build` then `npm start`.
4. Healthcheck hits `/login` (returns 200 without auth).

### Custom domain
- Canonical: `www.kujaku.ai` (CNAME to Railway service domain)
- Apex (`kujaku.ai`) redirects to www via GoDaddy forwarding.
- DNS records applied via GoDaddy; Railway generates a TXT verification record.

### Redeploy
Automatic on every push to `main`. Manual: `railway up` from repo root if CLI installed.
