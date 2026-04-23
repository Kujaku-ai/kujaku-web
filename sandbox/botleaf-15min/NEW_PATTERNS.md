# NEW_PATTERNS — botleaf-15min sandbox

Inventory of scene-local patterns invented across the 10 variants. Each
pattern was built using only brand tokens (colors, fonts, type scale,
easings, durations — per `vendor/kujaku-meta/brand/dist/tokens.css`).
No new tokens introduced.

This file is the bridge back to brand. When winners are picked, the
survivors here are candidates for promotion into `brand/dist/recipes.css`.

---

## leaf-tabs — horizontal hairline underline

**Used in:** v01, v09
**Why needed:** brand has no `.tab` / `.tabs` primitive; the leaf
requires a three-option segmented navigator.
**Implementation:** `.leaf-tabs` flex row above a `1px --ink-faint`
bottom border. Each `.leaf-tab` is a mono-caps 11px label, letter-spacing
0.2em, `--ink-mid` at rest → `--ink` on hover → `--ink` weight 500 with
a 1px `--ink` `border-bottom` on `.is-active`, negative margin-bottom to
overlap the track. Transitions `color` and `border-color` with
`--duration-fast` + `--ease-out`. v09 right-aligns the group.
**Promotion note:** best-candidate baseline — closest to brand's
existing hairline vocabulary. For promotion: name `.tab-rail`, ship
`.is-active` modifier only, alignment via flex container (consumer
chooses `justify-content`), leave left/right/center to the consumer.
Active treatment should compose with `.is-dark` per brand's unified
`.is-dark` convention.

---

## leaf-tabs — segmented-control (connected pill)

**Used in:** v02
**Why needed:** dense variant wanted a compact, unmistakable
tab-group affordance.
**Implementation:** `.leaf-tabs` inline-flex with a single
`1px --ink-faint` border + 2px radius wrapping three `.leaf-tab`
buttons separated by `border-right` hairlines (last-child removes it).
Tabs are paper by default; active = `--ink` fill + `--paper` text +
weight 500. Mono 10px, letter-spacing 0.2em.
**Promotion note:** candidate `.tab-rail.is-segmented` modifier on
the same base recipe. Follows the brand's "one surface modifier per
primitive" rule — segmented is mutually exclusive with hairline-
underline, not composed.

---

## leaf-tabs — vertical side-rail

**Used in:** v03
**Why needed:** variant tests nested leaf-level navigation sharing the
slash vernacular of `.nav-rail .nav-item` without re-using that primitive
(nav-rail is reserved for app-shell nav).
**Implementation:** flex-column, sticky `top: 24px`, paper background,
1px `--ink-faint` top + bottom hairlines. Each `.leaf-tab` is a flex
row with a `/` slash span in `--ink-pale`. Active state: slash hidden,
`>` prepended via `::before`, color flipped to `--red` — exactly
matches the brand's approved `.nav-item.is-active` treatment scaled
for nested use.
**Promotion note:** candidate `.tab-rail.is-side`. Worth deciding
whether brand should ship a shared "slash-route navigator" primitive
that both `.nav-rail` and leaf-side-rails instantiate, rather than
duplicating the slash-and-red-caret pattern.

---

## leaf-tabs — eyebrow-pill slash row

**Used in:** v04 (on coal), v10 (on paper)
**Why needed:** v04 needed a pill-tab treatment legible on dark
surface; v10 wanted a ceremony-light compact tab group on paper.
**Implementation:** inline-flex wrapped in `1px ink-faint/
rgba-paper` border + 2px radius + 4px padding. Each `.leaf-tab` is a
mono-caps 10-11px label prefixed by a `/` slash span, padding
8px × 16-18px. Active state uses filled background (`--ink` on paper,
`--paper` on coal) with contrasting text. Rest state uses `--ink-mid` /
`rgba(241,236,224,0.6)`.
**Promotion note:** this is `.tab-rail.is-slash-pill` in the same
family as segmented. Note the surface-dependent color contract:
paper-variant flips `--ink` / `--paper`, coal-variant flips
`--paper` / `--ink`. Brand's existing `.is-dark` convention covers
this — promotion would ship the base on paper and an `.is-dark`
override.

---

## leaf-tabs — Latin + JP gloss stacked

**Used in:** v05, v08
**Why needed:** editorial-leaning variants wanted tabs that carry
JP-gloss treatment matching the `.eyebrow-gloss` vocabulary used
throughout brand.
**Implementation:** each `.leaf-tab` contains two block children:
`.lat` (mono-caps Latin label) on top, `.jp` (Mincho 11-13px JP
gloss) below. Active state: Latin weight 500 + Mincho gains `--red`
or `--ink` color. 2px `border-bottom: --ink` underline anchors the
active tab. JP glyphs drawn exclusively from the approved vocabulary:
観 (kan / overview), 図表 (zuhyō / chart → live), 見本
(mihon / specimen → learning).
**Promotion note:** candidate `.tab-rail.is-gloss` variant. Mirrors
`.eyebrow-gloss` structurally — might be worth unifying under a
shared `.jp-gloss` child class so consumers can drop it in any
header-like primitive (tabs, cards, sections) and get the same
typographic treatment.

---

## leaf-tabs — bracket mono `[LABEL]`

**Used in:** v06
**Why needed:** the terminal-mono variant needed a tab treatment
that reads as "keystroke option" rather than "clickable widget."
**Implementation:** plain buttons, mono 11px caps, `::before`
renders `[` in `--ink-faint` and `::after` renders `]`, 6px gutter
on each side. Hover: label `--ink`, brackets `--ink-pale`. Active:
label `--ink` weight 500, brackets `--ink`. No border, no
underline, no fill — just the bracket swap.
**Promotion note:** lowest-weight tab variant in the set. If this
wins, could become the default for surfaces that already carry
lots of chrome (bracketed options don't add a visual frame to
compete with it). Name candidate: `.tab-rail.is-bracket`.

---

## leaf-tabs — inline with stats

**Used in:** v07
**Why needed:** the variant collapses "header stats" and "tab bar"
into a single horizontal band to test whether the leaf's vertical
footprint can be compressed without loss.
**Implementation:** parent band is a 5-column grid
(`1fr 1fr auto 1fr 1fr`) with the middle column holding a
vertical stack of three full-width filled-pill tabs. Left/right
`1px --ink-faint` dividers separate the tab group from the stat
cells. Tabs use the segmented-control treatment inside a vertical
stack (center-aligned, 96px min-width).
**Promotion note:** the tab primitive reused here is the same as
v02's segmented-control. What's new is the *composition*: an
inline group of tabs flanked by content. That composition isn't a
brand concern — it's a layout decision for the consumer. No
promotion candidate.

---

## leaf-panel — show/hide container

**Used in:** all 10 variants
**Why needed:** generic tab-panel switcher; brand has no
tab-panel primitive.
**Implementation:** `.leaf-panel { display: none; }` +
`.leaf-panel.is-active { display: block; }`. ~30 LOC vanilla JS
toggles the `.is-active` class on both tab and panel in sync.
**Promotion note:** trivial — doesn't need promotion. If the
tab-rail primitive earns promotion, the panel toggle CSS should
ship alongside it as the canonical pairing.

---

## session-strip — horizontal card-chip strip

**Used in:** v01 (hairline chips), v04 (coal chips), v08
(paper-deep chips)
**Why needed:** past-sessions zone needs a horizontal scannable
strip where each session is a clickable chip; brand has no such
primitive.
**Implementation:** CSS grid `repeat(10, 1fr)` (or flex row with
shared borders). Each chip is a left-aligned button with a
stacked `.ts / .pnl / .result` column (mono 9-10px caps / mono
13-16px tabular / mono 8-9px caps). Hover shifts background to
`--paper-deep`. `.is-open` state uses full `--paper` (on coal) or
`--paper-deep` (on paper) plus a border-color step.
**Promotion note:** strong promotion candidate. Name candidate
`.session-strip` or the more general `.chip-strip`. Should ship
a base recipe (1-row grid, hover/open behavior, typography hook
classes) plus capability flags for: (a) equal-width grid vs
intrinsic-width flex, (b) `.is-dark` for coal surfaces, (c)
scene-local drawer pairing. The chip contents (ts/pnl/result)
are consumer concerns — brand ships the container + state, not
the data structure.

---

## session-drawer — inline expand below strip

**Used in:** v01, v04, v07, v08
**Why needed:** pairs with the session-strip to reveal detail
inline when a chip is clicked. Brand's `.tbl.has-expandable`
only handles vertical-row expansion.
**Implementation:** sibling `<div class="session-drawer">` to the
strip, `display:none` by default, `display:block` when
`.is-open` is toggled. Paper-deep (on paper) or
`rgba(241,236,224,0.04)` (on coal) background, padding 22-32px.
Internal `<dl>` with 2×2 or 4-column definition grid in mono.
**Promotion note:** companion to `.session-strip`. Ship together.
Detail content (`<dl>`) is consumer markup; drawer ships only
the toggle container + padding + `.is-open` visibility modifier.

---

## session-timeline — horizontal tick + popover

**Used in:** v03, v05
**Why needed:** an editorial alternative to the card-chip strip
— sparse tick marks along a horizontal axis with hover popovers
in lieu of click-expand.
**Implementation:** container with an `.axis` or `.track` 1-2px
horizontal line. `.tick` children absolutely positioned along
the axis by percent. Each tick holds a `.dot` (8-10px filled
`--ink`, red on hover), an optional `.tick-lab` for the
timestamp below the axis, and a `.popover` child hidden by
default, revealed on `:hover` — standard card-like paper pill
with 1px border and paper-lift shadow.
**Promotion note:** candidate `.timeline` primitive. Ships the
axis line, tick positioning contract (consumer sets `left:` via
inline style with percent), dot treatment, and popover box. Hover
behavior is CSS-only — no JS required for the viz affordance.
Useful beyond sessions — any ordered sparse event series
(settlements, decisions, outcomes).

---

## sessions-vertical — narrow list with inline detail

**Used in:** v10
**Why needed:** editorial split-column variant needed a sessions
representation compact enough to fit in a narrow left column,
expanding inline without disrupting column rhythm.
**Implementation:** `.sv-row` is a 4-column grid
(`auto 1fr auto auto`) holding ts / details / outcome / pnl.
Hover highlights paper-deep; click toggles `.is-open` on the row
and reveals the sibling `.sv-detail` block below. Detail block
is `display:none` by default, `display:block` on `.is-open`,
with an internal 4-column `<dl>` in paper-deep background.
**Promotion note:** thin wrapper over brand's existing
`.tbl.has-expandable` pattern, but rendered as a divs-not-table
structure so it composes better inside narrow columns where
`<table>` layout doesn't breathe. Could promote as `.list-
expandable` or — cleaner — extend `.tbl.has-expandable` to
support a card-div render via a modifier.

---

## stat-index — right-aligned mono-inline stats

**Used in:** v09
**Why needed:** ledger variant wanted stats to read like a stock-
page index, not a dashboard KPI row.
**Implementation:** grid with `justify-content: end`, each stat
cell a small inline flex containing `.lab` + `.num` + `.meta` on
one baseline. All mono, tabular-nums. 40px gap.
**Promotion note:** specialized enough that it probably stays
scene-local. If promoted, candidate is `.indicator-row.is-inline`
(horizontal stat on one baseline, as opposed to the existing
`.is-stacked`).

---

## masthead-stats — editorial four-number strip

**Used in:** v01, v03, v05, v10
**Why needed:** spacious variants wanted a page-top stat zone
that reads as editorial masthead rather than dashboard row.
**Implementation:** CSS grid `repeat(4, 1fr)` with generous gap
(32-48px), top + bottom 1px `--ink-faint` borders. Each cell:
eyebrow-style mono label + large mono numeral (22-30px) + optional
mono sub-line. No card chrome, no surrounding frame — the
horizontal rules ARE the frame.
**Promotion note:** candidate `.stat-masthead` or could live as
a brand-level utility of existing `.indicator-row`. The differ-
entiator from `.indicator-row` is the grid composition with
hairline borders above/below. Likely a layout recipe
(`.stat-masthead-row` wrapper) rather than a new indicator
variant. Ship if the editorial voice wins.

---

## tableau — 2×2 hero numeral grid

**Used in:** v08
**Why needed:** the flagship variant needed each of the four
numbers to stand as a display moment at display size rather than
a dashboard stat.
**Implementation:** 2×2 CSS grid bounded by 1px `--ink-faint`
hairlines on every edge (outer + inner). Each cell: full-width
eyebrow label with optional `.jp` gloss + mono-display numeral
at 52px weight 500 + mono 11px sub-line. 40px × 44px internal
padding.
**Promotion note:** if promoted, this is `.indicator-tableau` or
`.stat-tableau`. Specialized — only fits pages with exactly four
"headline" figures. Keep scene-local unless a second page earns
the same treatment.

---

## reasoning-card — Sentient italic pull-quote

**Used in:** v01, v03, v04, v05, v07, v08, v10
**Why needed:** Claude's reasoning text reads as a pull quote /
editorial passage; `.card-paper-sunken` is the closest brand
primitive for the deboss "quoted" surface, but there's no
typographic recipe for the prose itself.
**Implementation:** inside `.card-paper-sunken`, a mono-caps
`.lab` eyebrow ("REASONING · 15:16 MDT") + a `<p>` in
`--font-display` italic weight 300, font-size 18-21px,
line-height 1.5-1.55, `--ink-soft` color, `max-width: 60ch`.
v04 replaces `.card-paper-sunken` with a coal block with
`border-left: 2px solid --red` for the coal surface treatment.
**Promotion note:** strong candidate. Ship as `.pull-quote`
or `.reasoning-block` — base recipe is `.card-paper-sunken` +
the typography override. Consider naming/positioning it as a
sibling of `.eyebrow-gloss` in /components so brand has one
obvious home for prose callouts.

---

## reasoning-card — Satoshi body counterpoint

**Used in:** v05, v06
**Why needed:** editorial prose ≠ UI body; but the counterpoint
question is whether reasoning text reads better as prose (Sentient
italic) or as the bot's voice in body type (Satoshi 400). Two
variants test the latter to let the architect compare.
**Implementation:** same card container, same eyebrow label,
but the `<p>` uses `--font-body` weight 400, 13-15px, line-height
1.7, `--ink-soft`, `max-width: 60-62ch`.
**Promotion note:** brand already has Satoshi body voice as the
default; this isn't a new primitive, it's a *non-decision*. If
Satoshi wins, the `.reasoning-block` candidate drops the type
override and just inherits body. If Sentient italic wins, the
promotion includes the display-italic override.

---

## mode-badge — paper/live pill

**Used in:** all 10 variants
**Why needed:** the leaf needs a visible "paper mode" label;
brand's `.badge` family uses severity (ink weight) rather than
mode coding.
**Implementation:** inline-block mono 9px caps, tracked 0.22em,
`--ink-pale` text + 1px `--ink-pale` border, 2px radius, 3-4px
by 8-9px padding.
**Promotion note:** thin — probably fine as scene-local. If
promoted, it's a `.badge.is-quiet` variant (even quieter than
`.badge.is-low`). Alternately, brand may want a semantic
`.mode-badge` with a `.is-paper` / `.is-live` pair where `live`
is the only appearance of red as mode signal — but that strays
into direction-coding territory and deserves a separate
conversation.

---

## overall rule compliance

- No new colors, fonts, sizes, easings, durations introduced.
- No green/red direction coding anywhere — all deltas use `+/-`
  sign + `--ink-mid` color per brand.
- Two-reds rule: preserved. Each chart has at most one `--red` end-
  dot; all other signal is ink-family.
- One-gold rule: variants 1-10 contain zero gold elements. 観 hanko
  uses brand's canonical red-white treatment, not a gold recipe.
- Sentient under 18px: never. Smallest Sentient italic is the
  reasoning-card prose at 18-21px; card titles use 18-22-28-38-56px.
- Hanko only from approved vocabulary: 観 throughout (v04, v05, v08,
  v10 reasoning + every learning stub), no other kanji used inside
  hanko. 観 / 図表 / 見本 / 指標 appear as JP-gloss text (not hanko)
  per voice vocabulary table.
- Mock numbers identical across all 10 — comparison is design-only.

---

## if Susie picks more than one winner

If the review resolves with, say, v01 OR v05 as the winning shell,
the promotion queue in priority order would be:

1. `tab-rail` base recipe + `.is-active` + at least two variants
   (hairline-underline, slash-pill). This is the biggest gap.
2. `session-strip` + companion `session-drawer`. Strong utility beyond
   this one leaf.
3. `.pull-quote` / `.reasoning-block` recipe pair (Sentient OR
   Satoshi — pick one after the v05 / v06 comparison).
4. `timeline` primitive if v03 or v05 wins its past-sessions treatment.
5. `.stat-masthead` layout wrapper if editorial voice dominates.

Everything else stays scene-local unless a second page asks for it.
