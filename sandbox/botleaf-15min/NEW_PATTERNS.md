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

---
---

# Round 2 — locked-direction additions (v11-v15)

Following the design review that locked the centered pressed-paper
tab direction, five additional variants (v11-v15) were built around
that one shared primitive. The patterns invented in this round are
catalogued below.

---

## leaf-tab-pressed — centered pressed-paper tab primitive

**Used in:** v11, v12, v13 (mobile-fallback only), v14, v15
**Why needed:** the locked direction. Brand has no tab primitive
yet; this is the candidate that earned approval after Round 1.
**Implementation:** flex row with `justify-content: center` and
`flex-wrap: wrap` (mobile sanity — at <360px three buttons wrap to
two lines instead of overflowing). Each button is 150px min-width
× ~44px tall, mono 11px label tracked 0.2em uppercase.

INACTIVE state composes the brand's letterpress emboss vocabulary
verbatim from `textures.css`:
```
box-shadow:
  inset 0 1px 0 rgba(255,251,240,0.7),
  0 1px 0 rgba(255,251,240,0.5),
  0 2px 6px rgba(40,30,18,0.06),
  0 8px 16px rgba(40,30,18,0.05);
```
Background `--paper`, color `--ink-mid`.

ACTIVE state composes the brand's deboss vocabulary:
```
background: var(--paper-deep);
box-shadow:
  inset 0 2px 4px rgba(40,30,18,0.10),
  inset 0 -1px 0 rgba(255,251,240,0.7),
  0 1px 0 rgba(255,251,240,0.7);
```
Color `--ink`, weight 500. Hover on inactive: color steps to `--ink`
(no shadow change). Transition `box-shadow` and `background` over
240ms `--ease-out`. The "physical key" feel is achieved purely through
the shadow swap — no border, no fill change beyond paper / paper-deep,
no scale transform.

Mobile fallback at <480px: min-width drops to 110px, padding tightens
to 12px × 18px, font-size 10px. Three buttons fit comfortably on a
360px viewport via flex-wrap if needed.

**Promotion note:** this is THE candidate. Promote as the brand's
canonical tab primitive. Suggested name: `.tab-rail.is-pressed` or
just `.tab-pressed` if the segmented/underline variants from Round 1
are not promoted alongside it. The pressed-paper composition is a
direct re-use of the existing `.emboss-letterpress` (rest) and
`.emboss-deboss` (active) recipes from `textures.css` — could be
implemented in `recipes.css` by simply applying `.emboss-letterpress`
on rest and `.emboss-deboss.is-active` (or similar). One question
for the architect: should the pressed-paper feel be exposed as a
generic interaction primitive (a "physical key" pattern other UI
elements could opt into — toggle buttons, segmented controls, mode
switches) or kept tab-scoped?

---

## tab-rail-mobile-fallback — media-query toggle pattern

**Used in:** v13
**Why needed:** v13 ships a vertical pressed rail on desktop and the
centered pressed-paper row on mobile. Both must coexist in markup;
neither requires JS to switch.
**Implementation:** two sibling tab containers in the markup —
`<aside class="tab-rail-desktop">` and `<div class="leaf-tab-row-mobile">`.
Default state: rail visible (`display: flex`), mobile row hidden
(`display: none`). At `@media (max-width: 899px)`: rail hides, mobile
row appears (`display: flex`). All buttons share the `.leaf-tab` class
hook so the JS tab-switching handler iterates both containers and
keeps `.is-active` synced across them — no state divergence regardless
of which container fired the click. The handler uses
`tabs.forEach(x => x.classList.toggle('is-active', x.dataset.panel === target))`
to set state on every button at once.
**Promotion note:** the dual-container approach is a layout pattern,
not a primitive — brand doesn't need to ship the toggle CSS. What
DOES belong in brand is documenting the pattern: when a primitive has
both a "wide-screen" layout and a "narrow-screen" layout that aren't
just CSS reflows of the same DOM (e.g. tabs-as-rail vs tabs-as-row),
the canonical solution is dual-render + media query, not JS layout
switching. Worth a paragraph in `STYLE.md /components` once we have
two examples (this is the first).

---

## hero-zone — single editorial display number

**Used in:** v14
**Why needed:** v14 wanted ONE figure to dominate, treated as
display typography rather than dashboard data.
**Implementation:** wrapper section with mono caps eyebrow above
("LIFETIME · V1.4 PAPER"), a Sentient italic 300 hero number at 72px
(line-height 1, tabular-nums, letter-spacing -0.02em), and a mono
caps meta line below. The number is the lone hero — no chart, no
context bar, just the figure. Mobile breakpoint scales the hero down
to 48px so it doesn't overrun small viewports.
**Promotion note:** could be a `.indicator-hero` or `.indicator-display`
variant of the existing `.indicator-*` family — distinct from
`.indicator-gloss.is-lg` (44px mono with JP gloss) because this
specifically uses Sentient italic display typography. Brand /typography
/ Lead paragraphs already covers Sentient italic 300 at this scale;
the new pattern is the *use* of Sentient italic for a numeral, not
the type itself. STYLE.md currently routes numerals to JetBrains Mono
exclusively ("Numerals · JetBrains Mono · Tabular figures only" in the
typography usage table) — promoting this requires either an explicit
exception in STYLE.md ("Sentient italic permitted for hero figures
≥56px") or staying scene-local. **ARCHITECT DECISION NEEDED** before
promotion: is Sentient italic on a numeral a brand-rule violation that
needs an exception clause, or a brand-rule violation that should not
be promoted? See "Open questions" below.

---

## dense-strip — hairline-divided 3-stat band

**Used in:** v14 (Zone B)
**Why needed:** secondary stats below the v14 hero needed a quieter
register than the hero itself.
**Implementation:** 3-column grid with vertical 1px `--ink-faint`
borders between cells (`border-right` on every cell except the last).
Each cell: mono 10px caps label + mono 19px tabular number + mono
10px caps meta. Top + bottom 1px hairlines bookend the strip.
Effectively a horizontal `.indicator-row` group with shared dividers.
**Promotion note:** this is what `.indicator-row` should compose into
when used as a horizontal strip of 2-4 items. Brand could ship a
`.indicator-strip` wrapper that handles the grid + hairline-divider
work, with `.indicator-row` rendering inside each cell. Same pattern
as the masthead-stats hairline-band from Round 1, just at smaller scale.

---

## broadsheet — newspaper masthead row

**Used in:** v15
**Why needed:** v15 commits to the newspaper metaphor; the page
opens with a title-and-stamp masthead row distinct from the editorial
masthead used elsewhere.
**Implementation:** `<header class="broadsheet">` is a 3-column grid
(`1fr auto auto`) with a 2px `--ink` top border and 1px `--ink`
bottom border. Italic Sentient 300 title at 38px on the left. Mono
caps date/time stamp on the right ("23 APR 2026 · 15:22 MDT"). A
`.hanko-slot` slot in the rightmost column carries the only hanko
in the locked batch (`.hanko.is-28` with 観). Mobile: collapses to a
single column with title above stamp.
**Promotion note:** masthead variants are scene-specific — every page
that wants this voice would compose its own. What's reusable is the
*recipe*: italic Sentient title + mono stamp + 2px-top + 1px-bottom
hairlines = "broadsheet header." Could promote as `.masthead-broadsheet`
or as documentation in /components Nav noting that the existing
`.nav-masthead` is page-chrome, while broadsheet-style page openers
are a separate concern. Probably stays scene-local for v1.

---

## news-stats — newspaper-style stat grid

**Used in:** v15
**Why needed:** v15 needed a stat row that read as continuous newspaper
columns, not as discrete dashboard cells.
**Implementation:** 4-column grid with internal vertical hairline
dividers between cells (`border-right` on each except last). Each cell
has mono 11px caps label, mono 22px tabular number, mono 10px meta —
so labels read as column headers, numbers as the column figures.
Bottom hairline bookends the row. Mobile: collapses to a 2×2 grid.
**Promotion note:** essentially the same pattern as v14's `.dense-strip`
just with 4 columns instead of 3 and 22px numbers instead of 19px. If
the `.indicator-strip` wrapper described above gets promoted, this is
the same primitive at a different size step. Recommend: bundle
`.dense-strip` (v14) and `.news-stats` (v15) into a single promoted
recipe with size modifiers.

---

## reasoning-card — Satoshi 400 body (round 2 confirmation)

**Used in (locked round):** v15 (one of the five)
**Why needed:** the architect explicitly asked v15 to try Satoshi
body as a counterpoint to Sentient italic. Round 1 already had this
counterpoint in v05 and v06. This is the third sample.
**Implementation:** unchanged from Round 1 — `.card-paper-sunken`
container with mono caps eyebrow + Satoshi `font-weight: 400`,
`font-size: 15px`, `line-height: 1.7`, `--ink-soft`,
`max-width: 62ch`. v11-v14 use the Sentient italic version (the
default observed in Round 1 winners).
**Promotion note:** with three Satoshi-body samples in the sandbox now
(v05, v06, v15) versus seven Sentient-italic samples (every other
variant), the architect now has a representative set. Pick after
review.

---

## Open questions / ARCHITECT DECISION NEEDED

1. **Sentient italic on a numeral (v14 hero).** STYLE.md /typography
   says "Numerals · JetBrains Mono · Tabular figures only." v14's
   hero number uses Sentient italic 300 at 72px. This is a brand-rule
   violation in service of editorial voice. Three resolution paths:
   (a) STYLE.md gets an exception clause ("Sentient italic permitted
   for hero figures ≥56px when ceremony justifies it"); (b) v14 falls
   out of contention if this rule is non-negotiable; (c) v14's hero
   gets re-rendered in 72px JetBrains Mono 500 (loses the editorial
   ceremony but keeps the rule). Asking before any code changes.
2. **Pressed-paper "physical key" — generic primitive or tab-scoped?**
   The pressed-paper interaction (raised → deboss) is now used only
   for tabs in this sandbox, but it's a coherent interaction grammar
   that could power toggles, segmented controls, mode switches, even
   filter pills elsewhere. Ship as `.tab-pressed` (tab-only) or as
   a generic `.pressed` interactive surface that any element can
   adopt? Affects the recipe's name and where it lives in `recipes.css`.
3. **`.dense-strip` (v14) and `.news-stats` (v15) — one promoted
   recipe with size modifiers, or two separate?** They're structurally
   identical with different cell counts and font sizes. Recommend
   one recipe, ship as `.indicator-strip` with `.is-sm`/default/`.is-lg`
   sizes — but flagging in case the architect would prefer narrower
   primitives.

---
---

# Round 3 — final candidates (v16-v18)

Three variants combining the locked-direction pieces (centered
pressed-paper tab primitive from Round 2 + layered hero from v14 +
side rail from v13) and integrating the production app shell from
`sandbox/_archive/shell/v04-final.html`. Per architect resolution of
Round 2 ARCHITECT DECISIONS:
- Decision #1 (Sentient italic numeral) — ALLOWED for hero figures
  ≥56px in this sandbox round; logged below as a proposed brand
  exception.
- Decisions #2, #3 — deferred to final-variant selection.

---

## Brand exception proposed: Sentient italic hero numeral

**Used in:** v14, v16, v17, v18 (the hero P&L number rendered at
72px in italic Sentient 300, tabular-nums)

**Existing brand rule:** STYLE.md /typography "Usage table" maps
`Numerals (data, prices, %)` to `JetBrains Mono` weight 500 with
"Tabular figures only." This is the canonical rule for every
numeric value in the system — sparkline endpoints, chart axis
labels, indicator numerals, table cells, the lot.

**Proposed exception:** when a numeral is rendered at hero scale
(≥56px) AND functions as the page's single ceremonial figure,
Sentient italic 300 may substitute for JetBrains Mono. Tabular-
nums remains required (Sentient supports `font-variant-numeric:
tabular-nums`). The exception does NOT apply to:

- Numerals at non-hero scale (anything <56px stays mono — a hero
  is a hero, not just a "big number")
- Numerals that participate in a comparison set (column of
  numbers, a chart axis, a table cell — those are data, mono)
- Multiple hero numerals on the same page (one hero per page max)

**Reasoning:** the brand's editorial voice is built on Sentient
italic 300 for "lead paragraphs," "hero headlines," "section
titles." A hero numeral that anchors a page is doing the same
editorial job — it's not data being read, it's a figure being
DECLARED. JetBrains Mono is the data voice; Sentient italic is
the editorial voice. When a numeral crosses into editorial use
(single, large, ceremonial), the typography should follow.

**Where it would live in STYLE.md:** /typography section, under
"Usage table" — append a row:
```
| Hero figures (single ceremonial numeral) | Sentient | italic 300 | ≥56px, tabular-nums, max one per page |
```
And under "Forbidden" — add: "Sentient italic for any numeral
under 56px or any numeral inside a chart/table/comparison set."

**Where it lives in the sandbox right now:** scene-local CSS in
each variant under the `.hero-zone .hero-num` rule. Identical
across v14, v16, v17, v18. Not promoted to brand yet — the
architect resolved this for the sandbox round only. A real
promotion conversation happens at final-variant selection.

**Open question for that conversation:** STYLE.md's gold-budget
chain explicitly lists which primitives can claim the page's
"one ceremonial element" — `.eyebrow.is-gold`, `.indicator-gloss
.is-dark`, `.btn.is-oxblood .jp`, `.tbl.is-eyebrow-header`. The
hero numeral feels like it should join that chain (one per page
maximum). Worth deciding whether the chain becomes "one gold OR
one Sentient hero numeral OR one of the existing chain members,
not two."

---

## leaf-rail — app-shell-integrated pressed-paper rail

**Used in:** v16 (120px), v17 (220px with stacked stats), v18
(130px with eyebrow label)

**Why needed:** v16-v18 introduce a SECOND rail concept — a
leaf-level navigation rail that lives INSIDE the main content
column, distinct from the brand's app-level `.nav-rail.is-overlay`
on the far left. Brand has no primitive for "secondary rail
nested inside content."

**Implementation:** `<aside class="tab-rail-desktop">` is a
`position: sticky` flex-column container holding `.rail-tab`
buttons. Each `.rail-tab` is a slash-prefix mono-caps label
(matching the brand's slash vernacular for nav routes) with the
pressed-paper emboss vocabulary from the locked tab primitive:
inactive uses `.emboss-letterpress` shadow stack on `--paper`,
active uses `.emboss-deboss` on `--paper-deep`. A 2px
`border-left: var(--ink)` appears on the active state to
reinforce "you are here" at the rail edge.

Width and presence of a divider vary per variant:
- v16: 120px wide, NO `border-right` divider — the 36px grid gap
  IS the visual separator between rail and content.
- v17: 220px wide, `border-right: 1px var(--ink-faint)` with
  28px right-padding so content doesn't crowd the divider.
- v18: 130px wide, `border-right: 1px var(--ink-faint)` with
  24px right-padding, plus a `.rail-label` mono-9px caps eyebrow
  at the top reading "NAVIGATION" to explicitly label the rail.

All three coexist in markup with the mobile-fallback centered
pressed-paper tab row from Round 2. JS handler iterates both
`.leaf-tab` containers (rail buttons + mobile pressed buttons)
and keeps `.is-active` synced — same pattern as Round 2 v13.

**Promotion note:** strong candidate. Fits as a sibling to the
existing brand `.nav-rail` family — name candidate `.tab-rail.is-
inline` or `.leaf-rail` to distinguish from the app-shell rail.
Should ship the base recipe (sticky positioning, flex-column,
slash-prefix tab item, pressed emboss states) plus modifiers for
divider presence (`.has-divider`), width-via-CSS-custom-property
(consumer sets `--leaf-rail-width: 120px`), and the optional
eyebrow label slot. Brand's existing `.nav-rail.is-overlay` is
reserved for app-level navigation; this would be the canonical
"section/leaf-level navigation rail" pattern. Note the slash
vernacular reuse — same `.slash` span pattern as `.nav-item` —
which suggests a future consolidation where `.nav-item` becomes
a shared primitive both rails compose from.

---

## leaf-rail-with-stats — rail as full sidebar (v17)

**Used in:** v17

**Why needed:** v17's thesis is that the side rail can absorb
secondary context (the dense 3-stat strip from the layered hero)
and become a full sidebar, not just navigation. This frees the
header to lead with the single hero figure.

**Implementation:** the leaf-rail container holds three sections
top-to-bottom:
1. `.rail-section` containing the three `.rail-tab` buttons
2. `.rail-divider` — a 1px `--ink-faint` horizontal hairline
   with 22px / 18px vertical margins
3. `.rail-stats` — flex-column of three `.rs` cells, each a
   label-above-number stack (mono 9px caps label, mono 17px
   tabular number, mono 9px meta line)

Wider rail (220px) accommodates the stats without truncation.
The mobile fallback at `<900px` not only hides the rail and
shows the centered pressed-paper tab row, but also reveals a
sibling `.dense-strip-mobile` horizontal strip below the hero
header — so the secondary stats remain visible on mobile when
the rail's stats disappear with it.

**Promotion note:** the rail-with-stats composition is scene-
specific (depends on the page having both nav and secondary
metrics that fit the same column), but the underlying primitives
are reusable. If `.leaf-rail` is promoted, the "stats inside
rail" pattern is just `.indicator-row.is-stacked.is-sm`
instances (existing brand primitive!) placed inside the rail.
The horizontal-rule divider between rail sections might earn
promotion as `.rail-divider` or, more generically, a `.hr-
hairline` utility that any vertical container can use.

The mobile-fallback pattern of "rail-resident content surfaces
elsewhere when rail collapses" is worth documenting as a layout
principle: anything that lives only in the desktop rail must
have an explicit mobile rendering — silently disappearing data
is a UX bug.

---

## rail-label — eyebrow caption for leaf rails (v18)

**Used in:** v18

**Why needed:** v18's narrow rail (130px, tabs only) is at risk
of reading as orphan chrome — three buttons floating with no
context. A small eyebrow label at the top makes the rail read
as a deliberately-named formal element.

**Implementation:** `<p class="rail-label">navigation</p>`
above the first `.rail-tab`. Mono 9px caps tracked 0.22em,
`--ink-pale` color, no border, 14px bottom margin. Quiet
enough not to compete with the tab buttons themselves; loud
enough to caption.

**Promotion note:** companion to `.leaf-rail`. If promoted, it's
just `.leaf-rail .rail-label` as a documented child slot.
Eyebrow vocabulary already exists in brand (`.eyebrow-quiet` is
close — mono caps no-stroke); this might be `.eyebrow-quiet
.is-rail-caption` if we want it composable, or just a one-off
`.rail-label` child class scoped to the rail primitive.

---

## App-shell ↔ leaf JS scoping confirmation

**Used in:** v16, v17, v18

The Round 3 brief flagged: "If there's any functional conflict
between the shell's JS and the variant's own JS, scope the
variant's JS with a leaf-specific class so handlers don't cross."

Verified no conflicts. The shell's two IIFEs target only:
- `.palette` / `.palette-trigger` / `.nav-masthead` (palette
  open/close handler)
- `.nav-rail.is-overlay` / `.nav-rail-toggle` / `.nav-item`
  (rail drawer toggle handler)

The leaf's tab handler targets `.leaf-tab`. The leaf's table-
expand handler targets `.tbl.has-expandable .row.is-expandable`.

Distinct namespaces. No collision possible. The `.leaf-tab`
class hook is the shared marker between rail buttons and mobile
pressed buttons, allowing one query selector to catch both.

The shell's `/`-key palette opener checks `e.target.tagName ===
'INPUT' || ...` and bails out when typing — so leaf-side inputs
(if added in future iterations) would not accidentally trigger
the palette. No leaf `<input>` exists in v16-v18, so this is
moot today.

**Promotion note:** none — this is a JS namespacing convention,
not a primitive. Documented here as confirmation that the dual-
rail composition (app rail + leaf rail) is JS-clean.

---

## Round 3 — open questions

None genuinely blocking. The Round 2 ARCHITECT DECISIONS #2 and #3
remain open per architect direction (deferred to final-variant
selection time).

One soft observation worth flagging: v17's mobile-fallback
`.dense-strip-mobile` introduces a third place where the secondary
stats can render (rail on desktop ≥900px, mobile strip <900px,
nowhere on the variant if the rail was the only home). v16 and v18
keep stats in the header so this question doesn't arise. If v17 is
the winner, the production version should consolidate to "stats
always render somewhere visible regardless of viewport" rather
than the dual-source pattern v17 currently uses for sandbox
clarity.

