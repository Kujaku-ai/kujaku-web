# SYSTEM.md Patch — Layer 3 Kickoff

> This file contains instructions for updating `kujaku-meta/SYSTEM.md` to reflect the Layer 3 (`site/`) kickoff. Apply these edits, commit to `kujaku-meta` as a single commit: `system: layer 3 site/ kickoff`.

Five targeted edits. Each shows the current text and the replacement text.

---

## Edit 1 — Current Services table (line ~186)

**Replace this row:**

```
| Public Website | 3 | Next major project | `kujaku-web` | — |
```

**With:**

```
| kujaku.ai (site) | 3 | **SCAFFOLDING** | `kujaku-meta/site/` | — |
```

**Rationale:** the site lives as a subdirectory inside the `kujaku-meta` monorepo, not as its own repo. Deviates from the one-repo-per-service convention for Layer 3 because the site and brand co-evolve closely in early phases. Documented as an intentional deviation below.

---

## Edit 2 — Folder Layout section (line ~222)

**Replace the folder layout block with:**

```
MASTER_KUJAKU/
├── SYSTEM.md                       ← this file (repo: kujaku-meta)
├── NOTES.md                        ← future-thinking scratchpad (repo: kujaku-meta)
├── README.md                       ← repo: kujaku-meta
├── brand/                          ← design system (repo: kujaku-meta)
│   ├── STYLE.md
│   ├── dist/
│   └── src/
├── site/                           ← Layer 3 frontend (repo: kujaku-meta)
│   ├── SITE.md
│   ├── SETUP.md
│   ├── src/
│   └── public/
├── data/                           ← BTC Collector (repo: kujaku-data-btc)
│   ├── COLLECTOR.md
│   ├── app/
│   └── tests/
├── bot-kalshi15min-btc/            ← BTC Kalshi 15-min Bot (repo: kujaku-bot-kalshi15min-btc)
│   ├── BOT.md
│   ├── CLAUDE.md
│   ├── app/
│   └── tests/
├── charting-calculations/          ← ICT indicators engine (repo: charting-calculations)
│   ├── ANALYSIS.md
│   ├── CLAUDE.md
│   ├── app/
│   └── tests/
└── (future) data-eth/              ← ETH Collector (Layer 1)
```

**Rationale:** adds `brand/` (previously implicit) and `site/` (new) to the layout. Removes the `(future) web/` stub since the frontend is now `site/` and under construction.

---

## Edit 3 — Naming & Conventions (line ~254)

**Replace this bullet:**

```
- **Spec docs:** UPPERCASE role name, `.md` extension — `COLLECTOR.md`, `BOT.md`, `ANALYSIS.md`, `WEB.md` — lives at the repo root.
```

**With:**

```
- **Spec docs:** UPPERCASE role name, `.md` extension — `COLLECTOR.md`, `BOT.md`, `ANALYSIS.md`, `SITE.md` — lives at the repo root (or the subsystem root, for monorepo subsystems like `site/`).
```

**Rationale:** Layer 3's spec doc is `SITE.md` in a folder called `site/`. The name "site" is more precise than "web" for what this is (a consumer-facing product surface, not every possible web thing). Updating the canonical convention to reflect the actual name being used.

---

## Edit 4 — "When to Deviate from This Architecture" (line ~299)

**Append a new bullet to the examples list:**

```
- A subsystem that lives inside the monorepo rather than its own repo, because it co-evolves tightly with another subsystem (e.g. `site/` inside `kujaku-meta` co-evolves with `brand/`). Justified when the two subsystems share aesthetic or structural decisions that benefit from being committed atomically. Can be ejected to its own repo later.
```

**Rationale:** documents the site-in-monorepo pattern as an intentional deviation so future subsystems don't treat it as precedent without thought.

---

## Edit 5 — Build Order "Next phase" (line ~271)

**Replace this block:**

```
**Next phase:**
- **Layer 3** — `kujaku-web`, the public-facing frontend. Kickoff prompt is prepared; waiting for the green-light to start that conversation.
```

**With:**

```
**Next phase (active):**
- **Layer 3** — `site/` inside `kujaku-meta`, the public-facing frontend at `kujaku.ai`. Spec drafted (`site/SITE.md`). Cycle 1 scaffolding prompt prepared (`site/SETUP.md`). Astro SSR, password-gated with Discord webhook pings. Three-level taxonomy (home → sector → asset) driven by config.
```

**Rationale:** reflects that Layer 3 work is actively starting, not waiting.

---

## Edit 6 — Session Log (line ~313, prepend this new entry at the top)

**Insert this entry above the existing `2026-04-20` entry:**

```
**2026-04-21 — Layer 3 kickoff; `site/` subsystem planned.**
- Spec drafted at `site/SITE.md` (inside `kujaku-meta` monorepo, not its own repo).
- Framework: Astro with `@astrojs/node` SSR adapter (needed for auth middleware).
- Information architecture: three-level taxonomy (home → sector → asset) driven by `site/src/config/taxonomy.ts`. Adding a market family = adding a config entry; the page exists automatically.
- Fallback pattern: assets have `canonicalSector` (permanent) + sectors have `fallbackTo` (temporary). Lets a parent section be pulled down for editing while its children render under another parent; snaps home when the parent goes live.
- Auth v1: password allowlist with Discord webhook pings on login. `AUTH_USERS` JSON env var maps name → bcrypt hash. Swappable to Discord OAuth in Phase 2 via one middleware file.
- Brand consumption: relative-path copy at build time (`../brand/dist/` → `site/public/brand/`). Brand can still be edited when genuinely needed; brand changes commit separately from site changes.
- Sandbox workflow: `site/sandbox/` (gitignored), 10 variants per visual page (login, home, about) generated by Claude Code, user picks winner, promoted to `src/`. Sector/asset templates skip sandbox (data-driven).
- Cycle 1: scaffolding only, no auth, no content, placeholder page, deploy to Railway. `SETUP.md` is the Claude Code prompt.
- Deferred to Phase 2: Discord OAuth, slash-palette search, MDX commentary/archives, additional sectors (quantum, AI infrastructure, AI, oil).
```

---

## How to Apply

```bash
cd ~/OneDrive/Desktop/"Kujaku Investments"/MASTER_KUJAKU
# Edit SYSTEM.md with the six changes above
git add SYSTEM.md
git commit -m "system: layer 3 site/ kickoff — spec, taxonomy, auth approach"
git push
```

If any edit looks wrong when you're applying it, **don't improvise** — flag it and we'll revise.
