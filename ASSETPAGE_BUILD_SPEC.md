# Kujaku — AssetPage Build Spec

> **For Claude Code.** Promote the design sandbox into the real Astro app.
> Source of truth: `v02-comparisons.html` (single inlined HTML, ~852 KB).
> Reference it visually; build the structure described below.

---

## Status

This is the first close-to-final template for the asset / ticker page at
`/crypto/btc` (and `/qc/{rgti,ionq,qbts}` etc.). Five tabs, one shell.
The design is locked enough that further changes are expected but minor.
Susie will review before merge.

---

## Open questions Susie needs to confirm before Claude Code starts

These shape the build. Skim, answer inline, then hand the file off.

1. **URL routing for tabs.** Path segment (`/crypto/btc/news`) or query
   string (`/crypto/btc?tab=news`)? Recommend path segment — better for
   deep links, share links, and search engines.
2. **Astro project structure.** Does `AssetPage.astro` already exist as a
   stub, or is this a from-scratch build? (Audit notes from earlier this
   session said it was an empty placeholder.)
3. **SSR vs static.** Data fetches (`/api/prices/recent`,
   `/api/decisions`, etc.) happen server-side at request time, or are
   pages static + client polls? Recommend SSR for the initial paint,
   client polling for live values (price, bot decisions).
4. **State persistence across reloads.** Should the active tab + news
   sort state + chart timeframe persist via `localStorage`, or just live
   for the session?
5. **Existing `/bot` route at kalshi15min-btc.kujaku.ai dashboard.**
   Stays as the operator dashboard. The Agents tab here is the public
   view. Same data, different framing.
6. **Comparison builder UX.** v1 button is a TODO that alerts. Is the
   real flow "type a ticker / pick from a list, kick off a job"? Specify
   later.
7. **News scraper backend.** All news content is mocked. Is the scraper
   a separate service Claude Code stubs an API for, or just leave the
   data layer as a typed placeholder that returns mock until the
   scraper is built?
8. **Brand recipes.** Vendor lives at `vendor/kujaku-meta/brand/dist/`.
   Use recipes (`recipes.css` 84 KB) directly via component-scoped CSS,
   or wrap each pattern in our own Astro component classes? Recommend
   direct recipe import once at the layout level + page-specific CSS
   inside each `.astro` file.
9. **Folder layout for asset sub-pages.** Confirm preferred structure
   (recommendation under "Project Structure" below).

---

## Source-of-truth HTML

`v02-comparisons.html` is the visual reference. It contains:

- 4 tickers (BTC, RGTI, IONQ, QBTS) with mock + live-shaped data
- 5 binder tabs (Overview / Charting / Agents / News / Comparisons)
- Identity spine (left rail) + masthead (top bar) + tab rail
- All inline CSS (~6,400 lines), inline JS render functions
- Brand fonts inlined as base64 (Sentient, Satoshi, JetBrains Mono);
  Shippori Mincho via Google Fonts CDN

**Open it in a browser to see the target.** Toggle between tabs and
between tickers to see how the page reacts to data shape changes
(empty states, partial data, etc.).

The HTML is a sandbox prototype: monolithic file, mock-data-heavy,
client-side rendering. Claude Code's job is to translate the
*structure, vocabulary, and behavior* into idiomatic Astro components,
not to copy the file verbatim.

---

## Architecture Target

```
src/
├── components/
│   ├── pages/
│   │   ├── AssetPage.astro              ← shell: spine + masthead + tab rail + slot
│   │   └── asset/
│   │       ├── Overview.astro
│   │       ├── Charting.astro
│   │       ├── Agents.astro
│   │       ├── News.astro
│   │       └── Comparisons.astro
│   ├── shell/
│   │   ├── IdentitySpine.astro          ← left rail with sector eyebrow, name, source/status table, sparkline
│   │   ├── Masthead.astro               ← URL crumb, source label
│   │   └── TabRail.astro                ← 5-tab segmented control
│   └── tiles/
│       ├── PerfBiasCard.astro           ← Overview: 4-tf perf + 3-bias
│       ├── MiniChart.astro              ← Overview: hero+chart split
│       ├── FullChart.astro              ← Charting: full-width chart with overlay pills
│       ├── StructureCard.astro          ← Charting: 5-cell structure analysis
│       ├── AnalystCommentary.astro      ← Charting: editorial card
│       ├── AgentCard.astro              ← Agents: per-analyst card
│       ├── AgentSlot.astro              ← Agents: "Add another analyst" sunken slot
│       ├── NewsArticle.astro            ← News: primary tile
│       ├── NewsFeature.astro            ← News: feature tile
│       ├── ComparisonCard.astro         ← Comparisons: per-comparison card
│       └── ComparisonSlot.astro         ← Comparisons: "Build your own" sunken slot
├── pages/
│   └── [sector]/[ticker]/[tab].astro    ← dynamic route; tab defaults to overview
└── lib/
    ├── api/
    │   ├── collector.ts                 ← data-btc, data-qc API client
    │   ├── charting.ts                  ← charting-calculations API client
    │   └── bot.ts                       ← kalshi15min-btc bot API client
    └── types/
        └── asset.ts                     ← TS types for ticker, news, comparisons, etc.
```

If `BotLeaf.astro` exists from before, retire it (its content is now
the Agents tab on the AssetPage).

---

## Brand Vocabulary — Locked

These are not negotiable. They've been iterated on across many turns
and Susie has approved them. Don't drift.

### CSS Variables

```css
:root {
  /* Paper tones */
  --paper:        #f0e9d8;
  --paper-deep:   #e7dfca;
  --paper-coal:   #1f1812;

  /* Ink tones */
  --ink:          #1f1812;
  --ink-mid:      #6b5e4c;
  --ink-pale:     #9a8d77;
  --ink-faint:    #d8cfb9;

  /* Accents */
  --red:          #c8331e;   /* brand red — kanji eyebrows, hover headlines, live pulse */
  --red-deep:     #8a2113;
  --gold:         #b8923a;   /* chart crosshair, secondary accent */

  /* Fonts */
  --font-display: 'Sentient', serif;        /* italic 300, big numerals + titles */
  --font-body:    'Satoshi', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
  --font-jp:      'Shippori Mincho', serif; /* kanji eyebrows */

  /* Easing */
  --ease-out:     cubic-bezier(0.2, 0, 0, 1);

  /* Layout */
  --rail-collapsed: 64px;
  --spine-width:    220px;
  --rail-expanded:  284px;     /* collapsed + spine */
  --masthead-height: 64px;
}
```

### Typography Scale

| Use | Font | Size | Style |
|---|---|---|---|
| Hero numerals (price, agent name, comparison symbol) | display (Sentient) | 32–56px | italic 400 |
| Card titles (analyst commentary, comparison title, feature headline) | display | 20–28px | italic 400 |
| Section eyebrow (with kanji) | mono (JetBrains) | 11px | 500, 0.28em letter-spacing, uppercase |
| Tile eyebrow | mono | 9–10px | 500, 0.22em, uppercase |
| Body prose | body (Satoshi) | 13–15px | regular, line-height 1.55–1.65 |
| Numeric values (metrics, prices) | mono | 11–14px | tabular-nums |
| Kanji | jp (Shippori Mincho) | 13–14px | regular, NOT uppercase, --red color |

### Direction Glyphs (NEVER green/red)

Use Unicode arrows, all in `--ink` or `--ink-mid`:

| State | Glyph |
|---|---|
| up / bullish | ↑ |
| down / bearish | ↓ |
| flat / neutral | → |
| consolidating | ↔ |

### Kanji Eyebrows (locked set)

Each is paired with an English label, English in `--ink` (mono caps),
kanji in `--red` (Shippori Mincho):

| Component | English | Kanji | Reading |
|---|---|---|---|
| Overview perf card | `performance` | 動向 | dōkō |
| Overview bias card | `bias` | 偏向 | henkō |
| Charting structure | `structure analysis` | 構造 | kōzō |
| Charting commentary | `chart analyst commentary` | 解説 | kaisetsu |
| Agents page header | `analysts` | 分析者 | bunsekisha |
| News primaries section | `primaries` | 主要 | shuyō |
| News features section | `features` | 特集 | tokushū |
| Comparison card | `comparison` | 比較 | hikaku |
| Build-your-own slot | `add comparison` | 作成 | sakusei |

Add new kanji eyebrows only with operator approval. The set is small
on purpose — too many becomes noise.

### Slash-prefix Vernacular

URLs render as crumbs in the masthead with this style:

```
/SECTORS/CRYPTO/BITCOIN
```

Slashes touch the segment text. No active-page suffix. All caps, mono,
`--ink-mid`. The crumb is presentational; the actual route may be
`/crypto/btc/overview` (decided in open question 1).

### Reusable Utilities

```css
/* .is-pressable — paper letterpress press-down. Used on CTAs only.
   Lifted shadow → pressed (debossed) shadow on hover, deeper press
   on active. Cursor: pointer. Reset link color/underline. */

/* .is-hoverable — paper-lift on hover. Used on tiles that aren't
   clickable buttons themselves but want a reading affordance.
   translateY(-3px) with spring easing (cubic-bezier(0.34, 1.56, 0.64, 1)),
   deeper drop shadow, .headline child color shifts to --red.
   Respects prefers-reduced-motion. */
```

Specificity note for `.is-hoverable`: the rule
`.is-hoverable.is-hoverable:hover .headline { color: var(--red); }`
uses a doubled class to bump from (0,0,3,0) to (0,0,4,0). This wins
over component-level `.headline` color rules. Keep this when porting.

---

## Layout Shell

### Identity Spine (left rail)

220px wide, fixed-position `position: fixed`, full height.

Top to bottom:

1. **Sector eyebrow** — mono caps, `--ink-pale`, e.g. `CRYPTO` or `QC`.
2. **Italic ticker name** — Sentient italic, e.g. *Bitcoin*. 36px.
3. **Mono symbol** — `BTC` etc. Mono caps, `--ink`.
4. **Hairline-bordered table**:
   - `SOURCE` / `BTC-USD` (or `IONQ`)
   - `STATUS` / `LIVE` (mono, `--ink`)
   - `UPDATED` / `18:55 UTC` (live timestamp from collector)
5. **Hairline divider**.
6. **`INTRADAY · 30 BAR`** mono eyebrow.
7. **Sparkline** — 30-bar mini chart with red live pulse at the last
   point. Pulse: 8px dot + paper outer ring + soft red glow + two
   staggered halos animating `pulse-ring` 1.8s ease-out infinite (delays
   0/0.9s). Pulse repositions on resize and visible-range change.

### Masthead (top bar)

Fixed across the top. 64px tall. `left: var(--rail-collapsed)`. 
Z-index 10.

- **Left**: URL crumb in slash vernacular (`/SECTORS/CRYPTO/BITCOIN`)
- **Right**: live source label, e.g. `24 APR · 18:55 UTC · COINBASE · BTC-USD`
- Mono caps, `--ink-mid`. Hairline divider below.

### Tab Rail

Below the masthead. Z-index 20 (covers spine when wider; but at 220px
spine, no overlap). Five tabs:

```
[ OVERVIEW ] [ CHARTING ] [ AGENTS ] [ NEWS ] [ COMPARISONS ]
```

Active tab styling: white-ish background, `--ink` text, raised
letterpress shadow. Inactive: paper, `--ink-mid` text, recessed.

### Z-Layer Ordering

```
Tab Rail   (20)  ↑ top
Masthead   (10)
Spine       (1)  ↓ bottom
```

When the rail is in `is-expanded` mode (mobile/overlay) it covers
the masthead temporarily.

### Mobile Breakpoints

- `≤1100px`: collapse all multi-column spans (.span-2/5/6/7/10) to
  full-width. Two-column hero/chart on Overview becomes stacked.
- `≤700px`: chart min-height 540 → 380px. lwc-attribution hidden.
  Mode/overlay pill groups stack with hidden divider. Hero typography
  trimmed (32px → 26px etc.).

---

## Per-Page Specs

Each tab is a child component receiving the asset's data as props
from `AssetPage.astro`.

### Overview

**Layout**: 2-column grid (`grid-cols: 5fr 7fr` desktop, stack on
mobile).

**Left (5/12)**: hero block

- Big italic Sentient price ($77,420)
- Below: signed daily change, glyph + percent, in mono — e.g.
  `↓ -0.18% / 24h ─ $-138.40`
- Above: red kanji `performance · 動向` eyebrow
- Below: red kanji `bias · 偏向` eyebrow on the bias section
- Two cards stacked: perf-bias card + recent activity feed

**Right (7/12)**: mini chart

- Lightweight Charts (LWC), single line series
- TF buttons in eyebrow: `1H · 1D · 1W · 1M · 1Y` (default 1D)
- Red live pulse at last point
- 20% trailing right offset (`rightOffset = bars.length * 0.25`)
- No axes, no grid, no crosshair, no LWC attribution
- Hover crosshair: gold (`#B8923A`), radius 2

**Perf+Bias card** (50/50 split inside one tile):

- Top zone: 4 timeframe % changes (24H · 7D · 30D · 1Y) — hairline
  cells, mono numbers in `--ink`, glyph + signed %
- Bottom zone: 3 biases (short-term · mid-term · long-term) — hairline
  cells, glyphs (↑↓→↔), bias direction word (bullish/bearish/etc.)
- All numbers and glyphs in `--ink` per the no-color-direction rule

**Recent Activity feed** — chronological mix of:

- News primaries (with source name)
- News features (with `feature · kujaku newsdesk` detail)
- Bot swings (BOS, CHoCH, swing high, swing low)
- Hypothesis decisions (with side, confidence %, probability bucket)

Each item: relative timestamp ("14m ago"), kind badge, headline,
detail line. Sorted newest-first. Limit 3 items in the preview;
"see more" link to the full activity page (out of scope for v1).

### Charting

**Layout**: full-width chart (span-12) on top, structure analysis
card + analyst commentary card stacked below.

**Full Chart**:

- LWC line + candle modes; toggle via segmented control in chart footer
- LINE | CANDLE inverted-active button (paper-coal bg when active)
- TF buttons: `1H · 1D · 1W · 1M · 1Y` (independent state from
  Overview's mini-chart — `tfStateFull` separate from `tfState`)
- Overlay pills (footer): `LIQUIDITY · FAIR VALUE GAP · STRUCTURE · ORDER BLOCKS`
- Pills toggle visually but DO NOT call setMode/toggleOverlay yet.
  TODO comment in code — Claude Code wires when overlay data is
  plumbed via `charting-calculations` API.
- Red live pulse at last point (works in both line and candle modes)
- Gold crosshair (`#B8923A`), radius 2
- No horizontal grid lines

**Structure Analysis card** (red kanji `structure analysis · 構造`):

- 5 hairline-divided cells: short-term · 24H · 1W · 1M · 1Y
- Each cell: bias direction word (bullish/bearish/neutral/consolidating)
  + glyph (↑↓→↔)
- Single source of truth: `d.structure` (5 entries). Replaces the
  earlier `d.bias` (3 entries). Overview's perf-bias maps:
  short → short, mid → month, long → year.

**Analyst Commentary card** (red kanji `chart analyst commentary · 解説`):

- Eyebrow with mono date range header
- Italic Sentient title (28px)
- Body prose (Satoshi 15px, line-height 1.7, max 70ch)
- Sub-eyebrows: `KEY OBSERVATIONS` + `OUTLOOK`
- Hairline divider before
- `RECENT NOTES` list (110px timestamp column on the left)
- BTC has full mock report; quantum tickers show empty state:
  `First report incoming`. The AI analyst formats its own reports
  per Claude Code's eventual prompt (out of scope for visual spec).

### Agents

**Layout**: stack of agent cards + a sunken `agent-slot` at the end.
Page header: red kanji `Analysts · 分析者`.

**AgentCard structure** (rebuilt from scratch, do not regress to v1):

- **Top row**: eyebrow `analyst · kalshi 15-min · 指標` (red kanji
  *shihyō* = "indicator") on left, mode/version tags on right
  (`PAPER · v1.5.2`)
- **Hero**: Sentient italic 38px name (e.g. *15-minute BTC*) +
  Sentient italic 38px mono win-rate (e.g. *67%*) side-by-side
- **Body**: Satoshi 14px description
- **Hairline-divided 3-stat strip**: portfolio · trades · P&L
- **Single-line "currently active"** summary
- **Editorial latest-decision block**:
  - Mono meta line (decision time, window ticker)
  - Side chip (YES/NO, paper-coal background)
  - Sentient italic 18px thesis
  - Body prose for reasoning
- **Dark CTA button**: `enter analyst →` (paper-coal bg, paper text,
  uses `is-pressable`)

**AgentSlot** (sunken):

- `--paper-deep` background, dashed `--ink-faint` border
- Centered content
- Sentient italic title
- Body description
- Outline button (border `--ink`, hover swap to filled)
- Used as **"Add another analyst"** below the BTC card AND as
  **"First analyst incoming"** empty state on quantum tickers

For BTC: 1 agent card (the Kalshi 15-min bot) + 1 slot.
For quantum tickers: 0 agent cards + 1 slot (empty-state copy).

### News

**Layout**: two stacked sections, each with its own header + modular
grid. Cards have `is-hoverable` utility (lift + red headline).

**Section structure** (repeated per section):

```
[ PRIMARIES · 主要 ]              [most recent · most popular · most liked]
[grid of articles — first 2 span-3 lead tiles, rest span-2 ]

[ FEATURES · 特集 ]               [most recent · most popular · most liked]
[grid of features — same modular sizing, paper-deep tiles ]
```

**Sort buttons** (right side of each section header):

- Three options: `most recent` (default) · `most popular` · `most liked`
- Mono caps 10px, `--ink-pale` inactive, `--ink` active
- Per-section state in `newsSortState = { primaries: 'recent', features: 'recent' }`
- Sort state persists across ticker switches
- Event-delegated click handler on the news mount survives re-renders

**Article tile** (primary):

- `--paper` background, raised letterpress shadow
- **Eyebrow**: source name (mono `--ink`) + timestamp (mono `--ink-mid`)
- **Italic Sentient headline** (20px lead tile, 17px regular)
- **Body excerpt** (Satoshi 13px)
- **Metrics footer**: heart + likes count, eye + popularity count
- `is-hoverable` utility

**Feature tile** (synthesized):

- `--paper-deep` background (subtle distinction from primaries)
- **Eyebrow**: `FEATURE · SYNTHESIZED` tag (mono `--ink`, NOT red — the
  paper-deep bg does the differentiation work) + timestamp
- **Italic Sentient headline** (same sizes as primary)
- **Body excerpt** with the synthesis
- **Metrics footer**: heart + likes, eye + popularity, **check + sources count**
- Source names live as `title=` tooltip on the check icon
- `is-hoverable` utility

**Mock data shape** (until scraper service exists):

```ts
news: {
  primaries: Array<{
    ts: string;            // ISO
    source: string;        // single source
    headline: string;
    excerpt: string;
    likes?: number;        // mock — augmented at boot
    popularity?: number;   // mock — augmented at boot
  }>;
  features: Array<{
    ts: string;
    headline: string;
    excerpt: string;
    sources: string[];     // multi-source byline
    likes?: number;
    popularity?: number;
  }>;
}
```

**Backwards-compat**: legacy flat-array shape (`news: NewsItem[]`)
must still render — treat as primaries-only with no features.

### Comparisons

**Layout**: stack of editorial comparison cards + a sunken
`cm-slot` (build-your-own) at the end. Page header:
`Comparisons · {ticker}` with mono meta `比較 · {N} active · agentic reports refresh daily`.

**ComparisonCard structure**:

- **Eyebrow**: `comparison · {category} · 比較` (red kanji *hikaku*)
  on left, `refreshed {date} · DAILY AGENTIC` on right; hairline below
- **Vs hero row**: 3-column grid
  - Left: subject ticker (current asset's symbol, name, price, perf)
  - Middle: italic Sentient `vs` divider, `--ink-pale`
  - Right: comparison ticker (symbol, name, price, perf)
- **Key metric callout**: hairline-bordered horizontal cell with three
  parts:
  - Label (mono caps, `--ink-mid`) — e.g. `correlation (90d)`
  - Value (italic Sentient 22px, `--ink`) — e.g. `0.71`
  - Trend (mono caps, `--ink-pale`) — e.g. `↓ from 0.85 in Q1`
- **Italic Sentient title** (24px) — the editorial headline
- **Body prose** (Satoshi 14px, line-height 1.65, max 72ch) — the
  agentic synthesis (single paragraph for v1; can expand later)
- **Foot row**: byline (mono caps `--ink-pale` — "GENERATED DAILY ·
  KUJAKU NEWSDESK") on left, dark CTA `enter analysis →` on right
  (paper-coal bg, uses `is-pressable`)

**ComparisonSlot** (sunken, dashed-border):

- Red kanji eyebrow `add comparison · 作成`
- Italic Sentient title: "Build your own comparison"
- Body description (uses current asset's name): "Compare {Bitcoin}
  against any tracked asset. Kujaku will generate a daily agentic
  report and refresh it each morning."
- Outline button: `+ START A COMPARISON` (TODO — Claude Code wires to
  real comparison-builder UI later; for now alerts a placeholder)

**Empty state**: if `comparisons.length === 0`, render
`no comparisons yet for {symbol} · build your first below` and just
the slot.

**Mock data shape**:

```ts
comparisons: Array<{
  vsSymbol: string;       // 'ETH', 'GLD', 'IONQ', etc.
  vsName: string;
  vsCategory: string;     // 'digital asset', 'safe-haven', etc.
  vsPrice: string;        // pre-formatted, e.g. '$3,210.40'
  vsPerfPct: number;
  vsPerfDir: 'up' | 'down' | 'flat';
  selfPerfPct: number;
  selfPerfDir: 'up' | 'down' | 'flat';
  metricLabel: string;    // 'correlation (90d)'
  metricValue: string;    // '0.71'
  metricTrend: string;    // '↓ from 0.85 in Q1'
  title: string;          // editorial headline
  body: string;           // synthesis prose
  refreshedAt: string;    // ISO
}>;
```

---

## Data Sources / API Plumbing

| Page section | Endpoint | Notes |
|---|---|---|
| Spine source/status/updated | `GET data-{sector}.kujaku.ai/health` | per-sector collector |
| Spine sparkline | `GET /api/prices/recent?limit=30` | last 30 bars |
| Overview hero price | `GET /api/prices/latest` | live BTC/QC |
| Overview mini chart | `GET /api/prices/recent` | parameterize by TF |
| Overview perf+bias | computed client-side from `/api/prices/recent` | no separate endpoint yet |
| Overview activity feed | merges news + bot swings + bot hypotheses | client-side merge |
| Charting full chart | `GET /api/prices/recent` (with bar resolution) | LWC-compatible |
| Charting structure analysis | `GET charting-calculations-production.up.railway.app/api/structure` | 5-tf biases |
| Charting overlays | `GET .../api/liquidity`, `.../api/fvg`, etc. | per overlay type |
| Charting commentary | mock for v1 (analyst-formatted reports later) | TODO |
| Agents card metrics | `GET kalshi15min-btc.kujaku.ai/api/portfolio` + `/api/trades` | bot live |
| Agents latest decision | `GET .../api/decisions?limit=1` | **STRIP `context_json` server-side** — it's 1.2 MB/row |
| News | mock for v1 (scraper service later) | TODO |
| Comparisons | mock for v1 (agentic synthesis service later) | TODO |

**Critical**: `/api/decisions` returns `context_json` containing the full
prompt that was sent to Claude per decision. ~1.2 MB per row. Strip
before client-side delivery — only `decision`, `side`, `probability_*`,
`reasoning`, `self_critique`, `playbook_edit.diff_description`,
timestamps, and trade IDs are needed for the UI.

---

## What Stays Mocked in v1

Explicit out-of-scope. Each becomes a future build.

- **News scraper backend** — primaries + features content all mocked.
  Augment `likes` / `popularity` deterministically per article (hash
  the headline char codes — see the `augmentNewsForSort` IIFE in the
  HTML for the formula).
- **Comparison agentic synthesis** — all comparison cards mocked. The
  build-your-own button alerts placeholder text.
- **Charting overlay data** — overlay pills toggle visually but don't
  call the indicator service. Wire when `charting-calculations` is
  ready for all 4 overlays per asset.
- **Charting analyst commentary** — BTC has a mock report; quantum
  tickers show empty state. Real reports format themselves later.
- **Quantum sector data** — RGTI/IONQ/QBTS have live price + mocked
  history (collector accumulating ~5 days). 7D/30D/1Y % values are
  mocks for now.

---

## Reusable Components & Patterns

### Hairline-divided cell strip

Used in: perf+bias card, structure analysis card, agent stat strip,
comparison metric callout.

```css
.hairline-strip {
  display: grid; grid-template-columns: repeat(3, 1fr);  /* or 4, 5 */
}
.hairline-strip > div {
  padding-left: 16px;
  border-left: 1px solid var(--ink-faint);
}
.hairline-strip > div:first-child {
  padding-left: 0;
  border-left: 0;
}
```

### Modular grid (news-style)

```css
.modular-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}
.modular-grid > .item { grid-column: span 2; }
.modular-grid > .item:nth-child(1),
.modular-grid > .item:nth-child(2) { grid-column: span 3; }  /* lead tiles */
```

### Sunken slot (paper-deep + dashed border)

```css
.slot {
  background: var(--paper-deep);
  border: 1px dashed var(--ink-faint);
  border-radius: 4px;
  padding: 36px 26px 38px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 12px;
  box-shadow: inset 0 1px 2px rgba(40,30,18,0.04);
}
```

Used in: AgentSlot, ComparisonSlot. Same visual treatment, different
content per use.

---

## Hover & Interaction Behaviors

| Element | Behavior |
|---|---|
| News article tile | `is-hoverable`: lift -3px spring, headline → red, deeper shadow |
| Comparison card | `is-hoverable` (same as news) |
| Agent card outer | NOT pressable (Susie removed in v02-cta-press). Only the inner CTA button is pressable. |
| Agent CTA button (`.ac-cta`) | `is-pressable`: dark button, deboss inset shadow on hover |
| Comparison CTA button (`.cm-cta`) | `is-pressable`: same dark button vocab |
| News sort buttons | inactive `--ink-pale` → hover `--ink-mid` → active `--ink` |
| Charting TF buttons | same as sort buttons |
| Charting mode/overlay pills | mode = inverted-active (paper-coal bg when active); overlay = pill-with-dot pattern |
| Tab rail | active tab = paper bg + raised; inactive = paper-deep + recessed |
| Comparison `+ START A COMPARISON` button | outline (`border: 1px solid var(--ink)`) → on hover, fill (`bg --ink, color --paper`) |

**Reduced motion**: `@media (prefers-reduced-motion: reduce)` strips
the spring transform on `.is-hoverable` and the press transform on
`.is-pressable`, but keeps color cues (red headline, button color
swap). Done in the HTML; preserve when porting.

---

## Acceptance Criteria

The build is "done" when:

1. Five tabs render at `/crypto/btc` (or whatever route shape we agree
   on). Each tab is a separate Astro component file.
2. All four tickers route correctly: BTC, RGTI, IONQ, QBTS.
3. Spine + masthead + tab rail layout matches the HTML reference at
   desktop (≥1100px) and mobile (≤700px).
4. The brand vocabulary above is locked in — same fonts, colors,
   eyebrows (including kanji), spacing, typography scale.
5. `is-hoverable` and `is-pressable` utilities work as specced
   (specificity, spring easing, reduced-motion fallback).
6. News page: two sections stack correctly (not side-by-side — see
   the bug history in this thread for the `nw-columns` mount class
   pitfall to avoid).
7. Mocked data is plumbed via TS-typed mock loaders that can later
   be swapped for real API calls without component-level changes.
8. Live data flows where APIs exist: spine timestamp, hero price,
   spine sparkline, overview mini-chart, charting full-chart,
   structure analysis, agent card metrics + latest decision.
9. Direction glyphs (↑↓→↔) are used everywhere; no green/red color
   coding for direction anywhere.
10. Mobile breakpoints work: spans collapse at ≤1100px, charting
    polish + overview phone polish at ≤700px.

---

## TODO Punchlist (after v1 ships)

Not blockers; track separately.

- Wire charting overlay pills to `charting-calculations` API when all
  overlay endpoints are ready for each asset.
- Build the news scraper backend service (separate Layer 2a or its own
  service category). Spec it per `kujaku-data-*` Pattern A.
- Build the agentic comparison synthesis service. Probably runs once
  daily, generates a fresh report per active comparison, stores in a
  comparisons DB.
- Wire the build-your-own comparison UX (form to pick a target asset,
  POST to the synthesis service, show "report incoming" state).
- Add settle/exit history to the agent card (currently shows latest
  decision only; should rotate through last 5 settled trades).
- Quantum tickers' analyst commentary needs the analyst service to
  generate first reports.
- ICT v3 charting indicators (FVG, liquidity, structure, order blocks)
  need to be present for all 4 assets, not just BTC.

---

## How to use this doc

1. Susie reviews and answers the **Open Questions** section above.
2. Hand the answered MD + the `v02-comparisons.html` file to Claude
   Code with a kickoff prompt like:

   > "Read `ASSETPAGE_BUILD_SPEC.md` and `v02-comparisons.html`.
   > Build the AssetPage and its 5 child tab components per spec.
   > Use the HTML as visual reference; don't copy verbatim. Match
   > the brand vocabulary exactly. Mock data layer per the typed
   > shapes in the spec — leave clear TODO comments where real
   > APIs will plug in. Run dev server and confirm all four tickers
   > render across all five tabs at desktop and mobile breakpoints.
   > Push to a new branch, open a PR for review."

3. Claude Code executes; we review the PR; iterate on anything
   that drifted from the spec.
