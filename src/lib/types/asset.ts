// AssetPage types — shaped to match what real APIs will eventually return.
// Phase 1 ships these as mocked data; Phases 2+ swap loaders to live calls
// without component-level changes.
//
// Source-of-truth for shapes: v02-comparisons.html DATA payload.

export type Direction = 'up' | 'down' | 'flat' | 'side';

export type Bar = {
  time: number;     // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type DailyChange = {
  abs: number;
  pct: number;
  direction: Direction;
};

export type RangeBand = { high: number; low: number };

export type Ranges = {
  short: RangeBand;
  day: RangeBand;
  week: RangeBand;
  month: RangeBand;
  year: RangeBand;
};

export type PerfWindow = {
  pct: number;
  abs: number;
  dir: Direction;
};

export type Perf = {
  d24: PerfWindow;
  d7: PerfWindow;
  d30: PerfWindow;
  y1: PerfWindow;
};

export type Sentiment =
  | 'bullish'
  | 'bearish'
  | 'consolidating'
  | 'neutral';

export type StructureCell = {
  sentiment: Sentiment;
  dir: Direction;
  horizon: string;
};

export type Structure = {
  short: StructureCell;
  day: StructureCell;
  week: StructureCell;
  month: StructureCell;
  year: StructureCell;
};

export type Analyst = {
  cadence: 'weekly' | 'daily';
  reportTs: string;            // ISO
  rangeLabel: string;
  title: string;
  body: string[];              // paragraphs
  observations: string[];
  outlook: string;
  recentNotes: Array<{ ts: string; text: string }>;
};

export type LiquidityZone = {
  id: number;
  direction: 'bullish' | 'bearish';
  top: number;
  bottom: number;
  strengthTier: 'strong' | 'medium' | 'weak';
  status: 'open' | 'swept';
};

export type FvgZone = {
  id: number;
  direction: 'bullish' | 'bearish';
  gapTop: number;
  gapBottom: number;
  status: 'open' | 'closed';
};

export type StructureEvent = {
  type: 'bos' | 'choch';
  direction: 'bullish' | 'bearish';
  breakTime: number;
  breakPrice: number;
};

export type OrderBlock = {
  direction: 'bullish' | 'bearish';
  bodyTop: number;
  bodyBottom: number;
  status: 'active' | 'mitigated';
};

export type Overlays = {
  liquidity: LiquidityZone[];
  fvg: FvgZone[];
  structure: StructureEvent[];
  orderblocks: OrderBlock[];
};

// Bot/agent payload — shape matches what kalshi15min-btc.kujaku.ai
// /api/portfolio + /api/window will return when wired.
export type BotData =
  | { available: false }
  | {
      available: true;
      name: string;
      strategy: string;
      mode: 'paper' | 'live';
      version: string;
      portfolio: number;
      cash: number;
      exposure: number;
      winRate: number;       // 0..1
      wins: number;
      losses: number;
      totalTrades: number;
      settledTrades: number;
      totalPnl: number;
      lastDecisionAgeS: number;
      href: string;
      window: {
        ticker: string;
        yesBid: number;
        yesAsk: number;
        floorStrike: number;
        closeTimeLocal: string;
        timeLeftS: number;
        volume: number;
        openInterest: number;
      };
    };

// Hypothesis — shape returned by /api/decisions AFTER the server-side
// strip. context_json is INTENTIONALLY EXCLUDED here — that field is
// ~1.2 MB/row and must never reach the client. The bot.ts API client
// is responsible for stripping it before delivery.
export type Hypothesis = {
  id: number;
  ts: string;                    // ISO
  side: 'YES' | 'NO';
  confidence: number;            // 0..1
  probabilityBucket: string;     // e.g. '0.6-0.7'
  thesisTimeframe: string;       // e.g. '15m'
  thesis: string;
  reasoning: string;
  windowTicker: string;
};

export type Swing = {
  ts: string;
  type: 'BOS' | 'CHoCH' | 'swing high' | 'swing low';
  direction: 'bullish' | 'bearish';
  from: number;
  to: number;
};

// News — primaries (scraped, single source) + features (synthesized
// multi-source). Scraper backend doesn't exist yet; mocked for Phase 1.
export type NewsPrimary = {
  ts: string;
  source: string;
  headline: string;
  excerpt: string;
  likes?: number;
  popularity?: number;
};

export type NewsFeature = {
  ts: string;
  headline: string;
  excerpt: string;
  sources: string[];
  likes?: number;
  popularity?: number;
};

export type NewsBundle = {
  primaries: NewsPrimary[];
  features: NewsFeature[];
};

// Comparisons — agentic synthesis service doesn't exist yet; mocked.
export type Comparison = {
  vsSymbol: string;
  vsName: string;
  vsCategory: string;
  vsPrice: string;          // pre-formatted
  vsPerfPct: number;
  vsPerfDir: Direction;
  selfPerfPct: number;
  selfPerfDir: Direction;
  metricLabel: string;
  metricValue: string;
  metricTrend: string;
  title: string;
  body: string;
  refreshedAt: string;      // ISO
};

// Agent — the view-shape consumed by AgentCard. Distinct from BotData
// (the wire shape returned by the bot endpoint). Phase 4 ships it
// pre-baked in mock.ts; Phase 8+ will compose Agents from BotData +
// /api/decisions[0] in the bot.ts client.
export type AgentLatestDecision = {
  ts: string;                  // ISO
  windowTicker: string;
  side: 'YES' | 'NO';
  thesis: string;
  reasoning: string;
};

export type Agent = {
  agentSlug: string;           // 'kalshi-15min-btc'
  name: string;                // '15-minute BTC' (italic Sentient hero)
  role: string;                // 'Trading agent · 15-minute binary windows'
  modeTag: string;             // 'PAPER' (uppercase)
  versionTag: string;          // 'v1.5.2'
  description: string;         // body paragraph under hero
  winRatePct: number;          // integer, no decimal in v1
  portfolioValue: string;      // pre-formatted: '$1,021.84 (+2.18% vs start)'
  tradesCount: number;
  pnlValue: string;            // pre-formatted: '+$21.84'
  currentlyActive: string | null;     // window ticker or null when not active
  latestDecision: AgentLatestDecision | null;
  href: string;                // dedicated agent page (TODO: future phase)
};

// Single asset payload — composes everything an AssetPage tab needs.
export type AssetData = {
  sector: string;             // 'crypto' | 'quantum' (display label, not URL slug)
  slug: string;               // 'btc' | 'rgti' | 'ionq' | 'qbts'
  symbol: string;             // 'BTC' etc.
  fullName: string;           // 'Bitcoin' etc.
  kanji?: string;
  sourceLabel: string;        // 'coinbase · BTC-USD' etc.
  currentPrice: number;
  lastUpdated: string;        // ISO
  dailyChange: DailyChange;
  ranges: Ranges;
  perf: Perf;
  structure: Structure;
  analyst?: Analyst;          // BTC-only for v1; quantum tickers omit
  stale: boolean;
  bars: Bar[];
  overlays: Overlays | null;  // null until charting-calculations is wired
  node: BotData;              // wire shape — Phase 8+ live data feed
  agents: Agent[];            // view shape — drives the Agents tab
  news: NewsBundle;
  comparisons: Comparison[];
  swings: Swing[];
  hypotheses: Hypothesis[];
};

// Tab vocabulary — locked in URL routing.
export type AssetTab =
  | 'overview'
  | 'charting'
  | 'agents'
  | 'news'
  | 'comparisons';

export const ASSET_TABS: readonly AssetTab[] = [
  'overview',
  'charting',
  'agents',
  'news',
  'comparisons',
] as const;

export function isAssetTab(s: string | undefined): s is AssetTab {
  return !!s && (ASSET_TABS as readonly string[]).includes(s);
}
