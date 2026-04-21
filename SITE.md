# SITE.md — kujaku.ai Frontend

> Layer 3 of the Kujaku platform. The public-facing website. Consumes JSON APIs from Layer 1 collectors and Layer 2b bots. No secrets in the client, no LLM calls, no business logic. See `SYSTEM.md` in `kujaku-meta` for the full platform architecture.

---

## What This Is

The consumer-facing frontend at `kujaku.ai`. Displays sectors, assets, live market data, and bot activity behind a simple password gate for a small group of authorized viewers. Built on top of the locked `brand/` subsystem. Lives as a sibling subsystem inside the `kujaku-meta` monorepo.

The site's information architecture mirrors the platform architecture: every frontend **asset** corresponds to a backend **vertical**. Adding a new market family on the backend adds a new asset page on the frontend — driven by a single config file, not new code.

---

## Does / Does Not

**DOES:**
- Render a three-level taxonomy (home → sector → asset) from a single config file
- Import brand CSS and JS as static assets from `../brand/dist/`
- Fetch live data from existing Railway services (`data-btc.kujaku.ai`, `kalshi15min-btc.kujaku.ai`) via their public JSON APIs
- Deploy to Railway as a third service (SSR via `@astrojs/node`)
- Wrap every page in the same nav component
- Gate the whole site behind a password-based allowlist with Discord login pings
- Support a sandbox workflow for generating and picking page variants before promotion
- Support a `fallbackTo` config pattern for sectors that are drafted/hidden

**DOES NOT:**
- Hold any API keys or third-party secrets in the client
- Make LLM calls of any kind
- Import code from any other subsystem (brand consumed as static dist, backend consumed via HTTP only)
- Store user profile data of any kind (password allowlist only; no emails, no names on disk beyond the allowlist table)
- Include pages for assets that don't exist yet — config lists only what's built
- Implement slash-palette search in v1 (deferred to Phase 2)
- Use Discord OAuth in v1 (deferred to Phase 2 — current auth is password allowlist with Discord webhook notifications)

---

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | **Astro (SSR via `@astrojs/node`)** | Static-first matches mostly-editorial content. Dynamic routing generates every page from config. Islands hydrate only interactive bits. SSR needed for auth middleware. |
| Repo | **`site/` in `kujaku-meta`** | Co-located with brand. Cross-cutting changes = one commit. Can eject to `kujaku-web` later if it earns its own repo. |
| Brand consumption | **Relative path copy-at-build** | `site/public/brand/` populated from `../brand/dist/` during build. No npm publish ceremony. |
| Data model | **SSR for auth + config, client-side fetch for live data** | Auth middleware runs server-side. Live market data fetched from Railway APIs client-side into islands. Decouples frontend runtime from backend runtime. |
| Auth (v1) | **Password allowlist + Discord webhook** | Small trusted group, easy to add/remove people via env vars. Swappable to Discord OAuth in Phase 2 with ~1 hour of work (one middleware file). |
| Hosting | **Railway, third service** | Matches existing pattern (data, bot). Same Railway project. Custom domain wired in Cycle 4. |
| Timezone | **America/Denver (local)** | Not UTC. Log timestamps and Discord pings render as `14:32 MDT`. |
| v1 scope | **Login + home + /crypto + /crypto/btc + about** | Five pages. Proves auth, proves three data-driven templates, proves editorial page. |
| v1 data | **Mock first, live second cycle** | Ship the visual shell fast, then wire real APIs as a focused task. Two clean commits. |

---

## Authentication

**Model:** password-based allowlist. Each authorized person has their own password. Server looks up the hash, grants access on match, sends a Discord webhook ping announcing the login.

**Flow:**
1. User visits any page without a session cookie → redirected to `/login`
2. User types password
3. Server checks against `AUTH_USERS` env var (JSON: `{ "name": "bcrypt-hash" }`)
4. On match:
   - Signed session cookie set, 7-day expiry
   - Discord webhook POST: `"aaron logged in — 14:32 MDT"`
   - Redirect to requested page (or home if none)
5. On failure:
   - Generic "incorrect password" message (no info leak about valid users)
   - Discord webhook POST: `"failed login attempt — 14:32 MDT"`
   - Rate limit: 3 tries per 5 minutes per IP

**Session:**
- 7-day expiry, multi-device allowed (same password usable on phone + laptop simultaneously)
- Signed cookie (HMAC with `SESSION_SECRET` env var), httpOnly, secure, sameSite=lax
- No server-side session store; cookie is self-contained

**Env vars required (set in Railway before Cycle 2):**
- `AUTH_USERS` — JSON string, `{ "aaron": "$2b$10$...", "susie": "$2b$10$..." }`. Edit to add/remove people.
- `SESSION_SECRET` — random 64-char string for cookie signing
- `DISCORD_WEBHOOK_URL` — webhook URL from Kujaku Discord server channel settings

**Adding/removing people:** edit `AUTH_USERS` in Railway dashboard, redeploy. No code change needed. Password hashes generated with a small script committed to `site/scripts/hash-password.mjs`.

**Phase 2 upgrade path:** swap `src/middleware/auth.ts` to check Discord OAuth instead of password. Session cookie shape stays the same. Rest of the site is unchanged.

---

## Three-Level Taxonomy

```
Home (/)
├── Crypto sector (/crypto)
│   ├── BTC asset (/crypto/btc)      ← live in v1
│   ├── ETH asset (/crypto/eth)      ← added by config when ready
│   └── …
├── Quantum sector (/quantum)
│   ├── IONQ (/quantum/ionq)
│   └── …
├── AI infrastructure (/ai-infra)
├── AI (/ai)
└── Oil (/oil)
```

Three page templates render the entire taxonomy:
- `src/pages/index.astro` — home, renders sector grid from config
- `src/pages/[sector]/index.astro` — sector template, renders asset grid
- `src/pages/[sector]/[asset].astro` — asset deep page (chart, bot status, commentary)

Plus two standalone pages: `/login` and `/about`.

---

## Configuration Model

Single source of truth: `src/config/taxonomy.ts`.

```ts
export const sectors = {
  crypto: {
    slug: 'crypto',
    name: 'Crypto',
    kanji: '',           // brand-approved only
    status: 'live',       // 'live' | 'draft' | 'hidden'
    fallbackTo: null,     // if draft/hidden, assets render here temporarily
  },
  ai: {
    slug: 'ai',
    name: 'AI',
    status: 'draft',
    fallbackTo: 'crypto',
  },
};

export const assets = {
  btc: {
    slug: 'btc',
    name: 'BTC',
    fullName: 'Bitcoin',
    canonicalSector: 'crypto',    // never moves — this is the asset's true home
    aliases: ['bitcoin', ''],
    api: {
      data: 'https://data-btc.kujaku.ai/api',
      bot:  'https://kalshi15min-btc.kujaku.ai/api',
    },
    panels: ['chart', 'bot', 'trades'],
  },
};
```

**Fallback/realign rule:** when a sector's `status` is `draft` or `hidden`, its assets render under the sector's `fallbackTo`. An asset's `canonicalSector` never changes. Flipping the parent back to `live` snaps everything home automatically.

**Adding a new asset** = adding an entry to `assets`. The page at `/{canonicalSector}/{slug}` exists automatically.

**Adding a new sector** = adding an entry to `sectors`. The page at `/{slug}` exists automatically.

---

## Sandbox Workflow

Matches the brand subsystem's sandbox → promote discipline. Not every page goes through sandbox — only visual-heavy entry pages where the first impression matters.

**In scope for sandbox:** login, home, about.
**Out of scope:** sector and asset templates (data-driven, iterate once real data lands).

**Mechanism:**
- `site/sandbox/` — gitignored directory
- Per page type, 10 self-contained static HTML variants generated by Claude Code from a design prompt
- Each variant imports brand CSS from `../brand/dist/` so aesthetic is consistent across variants
- Variants are pure HTML + brand CSS + minimal inline JS — no Astro, no framework
- User reviews all 10 in a browser (open each file locally)
- User picks a winner
- Winner is promoted: converted from static HTML to an Astro component in `src/pages/` or `src/components/`
- Sandbox variants are never deployed; gitignore ensures they don't pollute the repo

**Who generates variants:** Claude Code, from a prompt written by Claude. Prompt describes the intent, the brand constraints, and what each variant should try differently (nav placement, hero density, masthead treatment, etc.).

---

## Folder Layout

```
MASTER_KUJAKU/
├── brand/                              # locked, consumed as static dist
├── data/                               # DO NOT TOUCH
├── bot-kalshi15min-btc/                # DO NOT TOUCH
└── site/                               # NEW — this spec
    ├── SITE.md                         # this file
    ├── SETUP.md                        # Cycle 1 setup prompt for Claude Code
    ├── astro.config.mjs
    ├── package.json
    ├── tsconfig.json
    ├── .gitignore                      # includes /sandbox
    ├── sandbox/                        # gitignored — variant generation zone
    ├── scripts/
    │   └── hash-password.mjs           # generates bcrypt hashes for AUTH_USERS
    ├── public/
    │   └── brand/                      # copied from ../brand/dist at build
    ├── src/
    │   ├── config/
    │   │   └── taxonomy.ts             # sectors + assets + API URLs
    │   ├── middleware/
    │   │   └── auth.ts                 # session check + redirect to /login
    │   ├── layouts/
    │   │   └── Base.astro              # nav + brand CSS imports, wraps every page
    │   ├── components/
    │   │   ├── NavComposition.astro
    │   │   ├── SectorGrid.astro
    │   │   ├── AssetGrid.astro
    │   │   ├── Breadcrumb.astro
    │   │   └── PriceChart.astro        # Chart.js island
    │   └── pages/
    │       ├── index.astro             # home
    │       ├── login.astro             # password form
    │       ├── about.astro
    │       ├── api/
    │       │   └── login.ts            # POST handler: check password, set cookie, ping Discord
    │       └── [sector]/
    │           ├── index.astro         # sector template
    │           └── [asset].astro       # asset template
    └── tests/                          # per-component, minimal
```

---

## Contracts With Other Services

The site only reads from other services. Never writes. Never imports their code.

| Upstream service | What the site reads | Endpoint pattern (TBC) |
|---|---|---|
| `kujaku-data-btc` | Price ticks, Kalshi snapshots | `https://data-btc.kujaku.ai/api/*` |
| `kujaku-bot-kalshi15min-btc` | Current positions, recent trades, bot status | `https://kalshi15min-btc.kujaku.ai/api/*` |
| `charting-calculations` | FVG, liquidity zones (Phase 2+) | `https://charting-calculations-production.up.railway.app/api/*` |

**CORS:** each upstream service must allow `kujaku.ai` and the Railway-generated staging URL. Likely an env-var change on each service. Flagged here; dedicated task in the live-data cycle.

**API contract discovery:** during the live-data cycle, we read each service's actual exposed endpoints rather than assume. If an endpoint the site needs doesn't exist, we flag it and decide whether the site adapts or the upstream adds it.

---

## Brand Consumption

Brand is **not permanently locked** — changes allowed when the site genuinely needs them. Brand changes must be committed separately from site changes with a one-line justification in the commit message.

**Mechanism:** build step copies `../brand/dist/` to `site/public/brand/`. Site HTML links to `/brand/tokens.css`, `/brand/fonts.css`, `/brand/textures.css`, `/brand/recipes.css`, `/brand/charts.js`, `/brand/logo-*.svg`.

**Charts:**
- Brand's `charts.js` handles sparklines and small indicator charts (already shipped).
- Site adds a Chart.js island (`PriceChart.astro`) for big interactive price charts. This lives in site, not brand, until it earns promotion.
- Animation tokens (`--chart-ease`, `--chart-dur-enter`, `--chart-dur-update`) live in site first, promotable to brand later if universal.

**Approved chart pattern (from prototype):**
- Canvas + Chart.js 4.x
- Hairline axis (0.5px), tabular-nums JetBrains Mono ticks
- Ink single-line (1.25px), very subtle fill below
- Red-deep crosshair on hover, dashed 2-3
- Ink tooltip, square corners, mono body, no drop shadow
- Easing: `easeOutCubic`, 900ms enter / 200ms update
- No direction-coded colors
- No points by default, markers only on hover

---

## Deployment

**Railway, third service.** Same pattern as data and bot:

- Service name: `kujaku-web`
- Root directory: `site/` (monorepo config)
- Build command: `npm run build` (copies brand/dist → public/brand, runs Astro build)
- Start command: `node ./dist/server/entry.mjs` (Astro's node adapter)
- Custom domain: `kujaku.ai` (apex + `www`) — wired in Cycle 4
- Railway-generated URL retained as debug fallback

**Env vars (Railway):**
- `AUTH_USERS` (Cycle 2)
- `SESSION_SECRET` (Cycle 2)
- `DISCORD_WEBHOOK_URL` (Cycle 2)
- `PORT` (Railway sets automatically)
- `NODE_ENV=production`

**DNS:** GoDaddy → Railway CNAME + TXT verification, same two-record pattern used for `data-btc.kujaku.ai`.

---

## Dev Workflow

1. `cd site && npm run dev` — local hot-reload at `localhost:4321` (Astro default)
2. Build locally with `npm run build` to verify before pushing
3. Branch convention: work on a feature branch, push to `staging` for Railway preview, merge to `main` for production
4. Explicit staging (never `git add .`)
5. Two SHAs per cycle minimum — schema/scaffolding commit separate from content commit

---

## Build Order

**Cycle 1 — Scaffolding (no auth, no content):**
- `site/` folder, `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- Base layout imports brand CSS, renders a stub nav
- Single page at `/` that says "kujaku.ai — under construction" (temporary)
- Brand-copy build script working
- Deployed to Railway, Railway URL accessible
- Two commits: scaffolding + deploy wiring

**Cycle 2 — Auth + sandbox:**
- Password allowlist middleware
- `/login` page with password form
- `src/pages/api/login.ts` POST handler with Discord webhook
- `hash-password.mjs` utility
- Env vars set on Railway
- Sandbox directory created, 10 login variants generated, winner promoted
- Three commits: middleware + login handler, login page promoted from sandbox, wiring/env

**Cycle 3 — Taxonomy + home + about with mock data:**
- `taxonomy.ts` with one sector (crypto) and one asset (btc)
- Home template (rendered from sandbox variant) renders sector grid
- About page (rendered from sandbox variant)
- Sector template renders asset grid
- Asset template renders with mock data (no API calls yet)
- Nav + breadcrumb on every page
- Commits: taxonomy + templates, home + about pages, mock content

**Cycle 4 — Live data on BTC page:**
- `PriceChart.astro` island wired to `data-btc.kujaku.ai/api/*`
- Bot status block wired to `kalshi15min-btc.kujaku.ai/api/*`
- CORS configured on upstream services as needed
- Commits: chart island, bot status, CORS wiring

**Cycle 5 — Custom domain:**
- DNS via GoDaddy
- Railway custom domain config
- SSL verification
- Commit: DNS config notes in meta repo

**Phase 2 (deferred):**
- Discord OAuth replacing password allowlist
- Slash-palette search (brand gets `.nav-search` recipe)
- Commentary/archives page with MDX
- Additional sectors and assets as backends come online

---

## Ground Rules

- The site never imports code from another subsystem. Brand is copied; backend is called via HTTP.
- The site never holds third-party secrets in the client. Server-side secrets live in Railway env vars only.
- The site's config file (`taxonomy.ts`) is the single source of truth for what pages exist.
- Brand changes must be committed separately from site changes, with justification.
- New features that don't fit the three-template model are flagged as potential new page templates, not crammed into an existing one.
- No framework upgrades or dependency additions without explicit discussion.
- Sandbox variants never get committed to the main branch.
- Auth is replaceable — password allowlist today, Discord OAuth later, same middleware shape.

---

## Session Log

**2026-04-21 — Spec drafted and approved.**
Decisions locked: Astro SSR, `site/` in monorepo, three-level taxonomy, fallback via canonicalSector + fallbackTo, mock-first data, password-allowlist auth with Discord webhook pings, sandbox workflow for login/home/about, Mountain Time on pings, slash-palette + Discord OAuth deferred to Phase 2. Approved chart pattern captured from prototype. Cycle 1 ready to start.
