# SETUP.md — Cycle 1 Scaffolding Prompt for Claude Code

> This is the prompt to hand to Claude Code to set up the `site/` subsystem's initial scaffolding. Cycle 1 only — no auth, no content, no taxonomy. The goal is to prove the deploy pipeline: empty Astro site → Railway → accessible URL.

---

## Context for Claude Code

You are working in the `kujaku-meta` monorepo at `~/OneDrive/Desktop/Kujaku Investments/MASTER_KUJAKU/`. The repo already contains two locked subsystems (`brand/` and `data/`) and one untouchable subsystem (`bot-kalshi15min-btc/`). You are creating a new subsystem: `site/`.

**Read first:**
- `SYSTEM.md` at the monorepo root — the overall platform architecture
- `site/SITE.md` — the spec for what you're building (will be committed alongside your work)

**Do not touch:**
- `brand/` — locked, consumed as static dist only
- `data/` — Layer 1 collector, live on Railway
- `bot-kalshi15min-btc/` — Layer 2b bot, live on Railway
- `charting-calculations/` — sibling project, gitignored

---

## Cycle 1 Goal

Deploy an empty Astro site to Railway. No auth. No real content. A single placeholder page that says "kujaku.ai — under construction." Brand CSS loaded, so the placeholder uses brand tokens and fonts. That's it.

Why this small: we want to prove the deployment pipeline before investing in content. If the build script, the brand-copy step, or the Railway config are broken, we discover it now with nothing at stake.

---

## Deliverables

### 1. Folder structure

Create `site/` at the monorepo root:

```
site/
├── SITE.md                 # (already provided — just move into place)
├── SETUP.md                # (this file — just move into place)
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .gitignore
├── .nvmrc                  # Node 20
├── public/
│   └── (brand/ populated by build script, gitignored)
├── scripts/
│   └── copy-brand.mjs      # build step: copies ../brand/dist → public/brand
└── src/
    ├── layouts/
    │   └── Base.astro      # loads brand CSS, renders slot
    └── pages/
        └── index.astro     # "under construction" placeholder
```

### 2. `package.json`

```json
{
  "name": "kujaku-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "prebuild": "node scripts/copy-brand.mjs",
    "predev": "node scripts/copy-brand.mjs",
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "start": "node ./dist/server/entry.mjs"
  },
  "dependencies": {
    "astro": "^4.16.0",
    "@astrojs/node": "^8.3.0"
  }
}
```

Pin exact versions when you install — use `npm install --save-exact`.

### 3. `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port: 4321 },
});
```

SSR mode from day one so we don't have to migrate when auth is added in Cycle 2.

### 4. `tsconfig.json`

Standard Astro strict TS config. Use `astro init` defaults or reference Astro docs.

### 5. `.gitignore`

```
node_modules/
dist/
.env
.env.*
!.env.example
public/brand/
sandbox/
.DS_Store
```

`public/brand/` is gitignored because it's generated from `../brand/dist/` at build time. Never commit it.

### 6. `.nvmrc`

```
20
```

### 7. `scripts/copy-brand.mjs`

Copies `../brand/dist/` to `public/brand/` at dev and build time.

```js
import { cp, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const SRC = new URL('../../brand/dist/', import.meta.url);
const DEST = new URL('../public/brand/', import.meta.url);

try {
  await stat(SRC);
} catch {
  console.error('[copy-brand] ERROR: ../brand/dist not found. Is brand/ built?');
  process.exit(1);
}

if (existsSync(DEST)) {
  await rm(DEST, { recursive: true, force: true });
}

await cp(SRC, DEST, { recursive: true });
console.log('[copy-brand] copied ../brand/dist → public/brand');
```

### 8. `src/layouts/Base.astro`

```astro
---
const { title = 'Kujaku' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <link rel="stylesheet" href="/brand/fonts.css" />
    <link rel="stylesheet" href="/brand/tokens.css" />
    <link rel="stylesheet" href="/brand/textures.css" />
    <link rel="stylesheet" href="/brand/recipes.css" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

No nav yet. Cycle 3 adds the nav.

### 9. `src/pages/index.astro`

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Kujaku — under construction">
  <main style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div style="text-align: center;">
      <div class="eyebrow is-gold">孔雀</div>
      <h1 style="font-family: var(--font-serif); font-style: italic; font-weight: 400; font-size: 48px; margin: 16px 0;">kujaku.ai</h1>
      <p style="font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-60, #666);">under construction</p>
    </div>
  </main>
</Base>
```

Use brand tokens if the exact var names above don't match — flag the correct names from `brand/dist/tokens.css` and adjust. Do not invent new tokens.

### 10. Railway config

The monorepo is already connected to Railway (data-btc and bot-kalshi15min-btc deploy from it). Create a new Railway service:

- Service name: `kujaku-web`
- Root directory: `site`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment: `NODE_ENV=production`

If you can't create the Railway service yourself (no Railway CLI access or no permission), **flag it** and document the exact settings for the human to apply. Do not improvise.

---

## Verification Checklist

Run these in order. If any fails, STOP and report the failure — do not try to fix it silently.

1. `cd site && npm install` — completes without errors
2. `npm run dev` — starts on `localhost:4321`, page renders with brand fonts, 孔雀 kanji displays in gold
3. View page source — `/brand/tokens.css`, `/brand/fonts.css`, etc. load with 200 status
4. `npm run build` — completes without errors, `dist/` directory created
5. `npm start` — production server starts, page renders identically to dev
6. Push to a feature branch, open PR, do NOT merge yet
7. Flag to human: "ready for Railway service creation + first deploy"

---

## Commits

Two SHAs minimum:

1. `site: scaffold Astro SSR, brand-copy build step, placeholder page`
   - Includes: package.json, astro.config.mjs, tsconfig.json, .gitignore, .nvmrc, scripts/copy-brand.mjs, src/layouts/Base.astro, src/pages/index.astro
2. `site: add SITE.md and SETUP.md`
   - Just the two spec docs

Explicit staging only. Never `git add .`.

---

## What to Flag (Not Fix)

If any of these come up, **flag them to the human and stop**. Do not improvise solutions.

- Brand CSS var names in `src/pages/index.astro` don't match what's actually in `brand/dist/tokens.css`
- `@astrojs/node` version conflicts with Astro version
- Railway build fails for reasons not covered by these steps
- Node version mismatch (repo uses 20, local has different)
- `brand/dist/` doesn't exist or is incomplete

---

## What Not to Do in Cycle 1

- No auth middleware
- No taxonomy config
- No sector/asset pages
- No nav component
- No PriceChart island
- No sandbox directory
- No real content
- No Discord webhook wiring
- No custom domain

All of those are Cycles 2-5. Cycle 1 is scaffolding only.

---

## Reporting Back

After Cycle 1 is complete, report to the human with:

1. ✅ / ❌ per verification checklist item
2. SHAs of the two commits
3. The Railway service URL once deployed
4. Any friction encountered (things that weren't in this doc but needed resolving)
5. A recommendation for what Cycle 2 prompt should account for that wasn't obvious upfront

Then stop. Do not start Cycle 2 without a new prompt.
