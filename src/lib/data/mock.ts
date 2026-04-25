// Mock AssetData for Phase 1. Source: v02-comparisons.html DATA payload.
// Phase 2+ will swap this for real API calls; component-level signatures
// stay the same.

import type { AssetData, Bar } from '~/lib/types/asset';

// Deterministic seeded RNG used by the bar generators below — pulled from
// v02-comparisons.html's generateBtcBars / generateQuantumBars so the same
// fixtures render server-side as appeared in the sandbox.
function makeRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}
function round4(x: number): number {
  return Math.round(x * 10000) / 10000;
}

// 60 1-minute BTC bars anchored at the v02 reference timestamp.
function generateBtcBars(): Bar[] {
  const end = Math.floor(Date.parse('2026-04-24T19:22:00Z') / 1000);
  const out: Bar[] = [];
  let p = 77610;
  const rnd = makeRng(17);
  for (let i = 59; i >= 0; i--) {
    const time = end - i * 60;
    const drift = (rnd() - 0.48) * 25;
    const open = p;
    const close = open + drift;
    const range = 8 + rnd() * 28;
    const high = Math.max(open, close) + rnd() * range * 0.5;
    const low = Math.min(open, close) - rnd() * range * 0.5;
    const volume = 0.4 + rnd() * 6.5;
    out.push({
      time,
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
      volume: round4(volume),
    });
    p = close;
  }
  return out;
}

function generateQuantumBars(anchor: number, n: number, volAmp: number): Bar[] {
  const end = Math.floor(Date.parse('2026-04-24T18:55:00Z') / 1000);
  const out: Bar[] = [];
  let p = anchor;
  const rnd = makeRng((anchor * 7) | 0);
  for (let i = n - 1; i >= 0; i--) {
    const time = end - i * 60;
    const drift = (rnd() - 0.5) * anchor * volAmp * 0.3;
    const open = p;
    const close = Math.max(0.01, open + drift);
    const range = anchor * volAmp * (0.4 + rnd() * 0.8);
    const high = Math.max(open, close) + rnd() * range * 0.4;
    const low = Math.max(0.01, Math.min(open, close) - rnd() * range * 0.4);
    const volume = Math.round(80 + rnd() * 1600);
    out.push({
      time,
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
      volume,
    });
    p = close;
  }
  return out;
}

const MOCK_DATA: Record<string, AssetData> = {
  btc: {
    sector: 'crypto',
    slug: 'btc',
    symbol: 'BTC',
    fullName: 'Bitcoin',
    sourceLabel: 'coinbase · BTC-USD',
    currentPrice: 77599.205,
    lastUpdated: '2026-04-24T18:55:51Z',
    dailyChange: { abs: -312.47, pct: -0.40, direction: 'down' },
    ranges: {
      short: { high: 77680.00, low: 77520.00 },
      day:   { high: 77912.45, low: 77340.22 },
      week:  { high: 79104.80, low: 76512.10 },
      month: { high: 80820.00, low: 73445.50 },
      year:  { high: 95400.00, low: 58200.00 },
    },
    perf: {
      d24: { pct: -0.40, abs: -312.47,  dir: 'down' },
      d7:  { pct:  1.85, abs:  1432.50, dir: 'up'   },
      d30: { pct: -3.21, abs: -2563.20, dir: 'down' },
      y1:  { pct: 12.40, abs:  8584.00, dir: 'up'   },
    },
    structure: {
      short: { sentiment: 'bearish',       dir: 'down', horizon: 'next 1–4h'  },
      day:   { sentiment: 'bearish',       dir: 'down', horizon: 'next 24h'   },
      week:  { sentiment: 'consolidating', dir: 'side', horizon: 'past week'  },
      month: { sentiment: 'neutral',       dir: 'flat', horizon: 'past month' },
      year:  { sentiment: 'bullish',       dir: 'up',   horizon: 'past year'  },
    },
    analyst: {
      cadence: 'weekly',
      reportTs: '2026-04-24T18:55:00Z',
      rangeLabel: '2026-04-18 → 04-24',
      title: 'BTC holds the 77,500 pivot — bearish 78,200 FVG fill remains the working thesis',
      body: [
        "The week opened with a clean rejection of the 80,000 round-figure on Monday, printing a bearish fair-value gap (FVG) between 78,200 and 78,400 that has not yet been filled. Price has since drifted lower into a 77,300–77,700 consolidation, with a 4-hour structure low at 77,180 currently holding the range.",
        "The 76,500 liquidity zone — defended on every test since mid-March — is the obvious downside target if Friday's weakness extends. Reclaim of the 78,200 FVG midpoint would invalidate the bearish thesis and bring the 79,100 weekly high back into play. Until then, short-side confluence outweighs long-side.",
      ],
      observations: [
        '77,500 acts as the current pivot — three rejections this week',
        '78,200 bearish FVG remains unfilled — primary downside catalyst',
        '76,500 liquidity zone defended on every test since 03-18',
        'Weekly structure remains constructive above 73,400 swing low',
      ],
      outlook: "Short-term bearish bias into the weekend, with a probable sweep of 76,500 liquidity before any reversal. Reclaim of 78,200 invalidates. Monthly bias remains constructive above 73,400 — the bearish read is tactical, not structural.",
      recentNotes: [
        { ts: '2026-04-23T18:00:00Z', text: 'Bearish FVG fill rejected at 79,100 — intraday short setup taking shape into the close.' },
        { ts: '2026-04-22T14:20:00Z', text: 'Liquidity sweep below 76,500 has not yet occurred. Holding entries.' },
        { ts: '2026-04-21T09:30:00Z', text: 'Range-bound between 77,200 and 78,500. No clean directional bias yet — patience.' },
      ],
    },
    stale: false,
    bars: generateBtcBars(),
    overlays: {
      liquidity: [
        { id: 20271, direction: 'bullish', top: 77820.00, bottom: 77810.00, strengthTier: 'strong', status: 'open'  },
        { id: 20058, direction: 'bearish', top: 77596.52, bottom: 77596.52, strengthTier: 'weak',   status: 'swept' },
        { id: 19823, direction: 'bullish', top: 77450.00, bottom: 77440.00, strengthTier: 'strong', status: 'open'  },
        { id: 19600, direction: 'bearish', top: 77760.00, bottom: 77750.00, strengthTier: 'strong', status: 'open'  },
      ],
      fvg: [
        { id: 3483500, direction: 'bearish', gapTop: 77780.00, gapBottom: 77750.00, status: 'open' },
        { id: 3354962, direction: 'bullish', gapTop: 77520.00, gapBottom: 77490.00, status: 'open' },
      ],
      structure: [
        { type: 'bos',   direction: 'bullish', breakTime: 1777054500, breakPrice: 77660.00 },
        { type: 'choch', direction: 'bearish', breakTime: 1777053300, breakPrice: 77545.00 },
      ],
      orderblocks: [
        { direction: 'bullish', bodyTop: 77700.00, bodyBottom: 77680.00, status: 'active' },
      ],
    },
    node: {
      available: true,
      name: '15-minute',
      strategy: 'kalshi15min',
      mode: 'paper',
      version: 'v1.5',
      portfolio: 1021.84, cash: 940.18, exposure: 81.66,
      winRate: 0.6512, wins: 28, losses: 15,
      totalTrades: 47, settledTrades: 43, totalPnl: 21.84,
      lastDecisionAgeS: 8,
      href: '/crypto/btc/agents',
      window: {
        ticker: 'KXBTC15M-26APR241530-30',
        yesBid: 59, yesAsk: 60, floorStrike: 77623.5,
        closeTimeLocal: '19:30 UTC', timeLeftS: 846,
        volume: 1447, openInterest: 1355,
      },
    },
    news: {
      primaries: [
        { ts: '2026-04-24T17:40:00Z', source: 'CoinDesk',         headline: 'Bitcoin holds $77K as Fed minutes loom',           excerpt: 'Traders are parsing every word of the April FOMC minutes for hints on the pace of rate cuts; options volatility on BTC climbed into the release.' },
        { ts: '2026-04-24T14:12:00Z', source: 'Bloomberg',        headline: 'Spot BTC ETFs see third day of outflows',          excerpt: 'The eleven US spot ETFs shed a combined $224M on Tuesday, extending the longest outflow streak since the April pullback began.' },
        { ts: '2026-04-24T09:30:00Z', source: 'The Block',        headline: 'Miner reserves hit 14-month low',                  excerpt: 'On-chain data shows miners sent more BTC to exchanges this week than in any seven-day stretch since February 2025.' },
        { ts: '2026-04-23T21:15:00Z', source: 'Reuters',          headline: 'Stablecoin market cap crosses $200B',              excerpt: 'USDT and USDC combined now represent over 85% of stablecoin supply, with Tether adding $4.2B in Q1 alone.' },
        { ts: '2026-04-23T11:05:00Z', source: 'WSJ',              headline: 'BTC options open interest concentrated at $80K strike', excerpt: 'Deribit data shows record call open interest at the $80,000 strike for the June expiry, a level traders have watched since Q1.' },
        { ts: '2026-04-22T19:44:00Z', source: 'Axios',            headline: 'Senate committee advances stablecoin oversight bill', excerpt: 'The bipartisan proposal would designate the OCC as lead regulator for dollar-denominated stablecoins above a $10B threshold.' },
        { ts: '2026-04-22T08:20:00Z', source: 'Financial Times',  headline: 'Institutional BTC holdings at new high',           excerpt: 'Eaglebrook and Fidelity Digital Assets report public-company BTC treasuries topped 485,000 coins at the end of March.' },
      ],
      features: [
        { ts: '2026-04-24T16:00:00Z', headline: 'ETF outflow streak reshapes spot-market plumbing',
          excerpt: 'Three consecutive days of net redemptions in the US spot complex have shifted dealer hedging behavior. Options desks report tighter spreads on the front of the curve as authorized participants unwind exposure; BTC carry has compressed roughly 40bp into month-end.',
          sources: ['Bloomberg', 'CoinDesk', 'WSJ'] },
        { ts: '2026-04-24T11:30:00Z', headline: 'Stablecoin policy advances may quietly extend BTC banking access',
          excerpt: 'The Senate stablecoin bill would designate the OCC as lead regulator for dollar-denominated tokens; Kujaku notes the framework also clarifies depository-trust treatment for related crypto reserves, a point custodians have flagged as the bottleneck for offering BTC services to enterprise clients.',
          sources: ['Reuters', 'Axios', 'Financial Times'] },
        { ts: '2026-04-23T18:45:00Z', headline: 'Miner-treasury rotation: a pre-halving capitulation, or just liquidity?',
          excerpt: 'Coinbase deposits from mining-tagged addresses crossed a 14-month high while institutional treasuries continued to add coins. The two flows usually correlate; this week they diverged. We trace the divergence to dispersion in mining-economics, not a directional thesis on BTC itself.',
          sources: ['The Block', 'Financial Times', 'CoinDesk'] },
      ],
    },
    comparisons: [
      {
        vsSymbol: 'ETH', vsName: 'Ethereum', vsCategory: 'digital asset',
        vsPrice: '$3,210.40', vsPerfPct: 1.42, vsPerfDir: 'up',
        selfPerfPct: -0.18, selfPerfDir: 'down',
        metricLabel: 'correlation (90d)', metricValue: '0.71', metricTrend: '↓ from 0.85 in Q1',
        title: 'Decoupling persists as ETF flows diverge',
        body: "BTC and ETH have decoupled meaningfully over the past two weeks as institutional flows favor BTC's spot ETF complex. April pullbacks affect them differently — BTC's range tightened toward $77K while ETH absorbed sector outflows worth roughly $311M. The narrative split — BTC as macro hedge, ETH as application platform — is reasserting after Q1's near-perfect correlation.",
        refreshedAt: '2026-04-24T08:00:00Z',
      },
      {
        vsSymbol: 'GLD', vsName: 'Gold (spot)', vsCategory: 'safe-haven',
        vsPrice: '$2,408.50', vsPerfPct: 0.42, vsPerfDir: 'up',
        selfPerfPct: -0.18, selfPerfDir: 'down',
        metricLabel: 'correlation (90d)', metricValue: '0.34', metricTrend: '↓ from 0.41 average since 2020',
        title: 'Digital-gold thesis strains under rate-cut uncertainty',
        body: "Gold's resilience above $2,400/oz contrasts with BTC's range-bound action through April. Both are pitched as store-of-value instruments but their behaviors during macro stress have re-anchored. Real yields drove gold's March bid; BTC's drawdown coincided with the same stress. The thesis convergence everyone called for in 2024 has not arrived.",
        refreshedAt: '2026-04-24T08:00:00Z',
      },
      {
        vsSymbol: 'SPX', vsName: 'S&P 500', vsCategory: 'macro decoupling',
        vsPrice: '5,481.20', vsPerfPct: 0.62, vsPerfDir: 'up',
        selfPerfPct: -0.18, selfPerfDir: 'down',
        metricLabel: 'correlation (90d)', metricValue: '0.41', metricTrend: '↓ from 0.62 in Q1',
        title: 'Risk-on correlation weakens; macro hedge thesis tested',
        body: "BTC's correlation with the S&P has dropped from 0.62 to 0.41 over the past quarter. April equity strength on AI earnings has not translated to BTC inflows. The simple BTC-as-risk-on framing continues to break down — meanwhile the cross-asset correlation matrix shows BTC behaving more like a separate asset class than at any point since 2022.",
        refreshedAt: '2026-04-24T08:00:00Z',
      },
    ],
    swings: [
      { ts: '2026-04-24T14:22:00Z', type: 'BOS',   direction: 'bullish', from: 77640, to: 77820 },
      { ts: '2026-04-24T11:48:00Z', type: 'CHoCH', direction: 'bearish', from: 78110, to: 77890 },
      { ts: '2026-04-23T22:10:00Z', type: 'BOS',   direction: 'bullish', from: 77220, to: 77460 },
    ],
    hypotheses: [
      { id: 947, ts: '2026-04-24T19:19:52Z', side: 'NO',  confidence: 0.62,
        probabilityBucket: '0.6-0.7', thesisTimeframe: '15m',
        thesis: 'Bearish reversal stalling at VWAP',
        reasoning: 'Momentum reversed up but lacks confirmation; 1H bias still bearish dominant.',
        windowTicker: 'KXBTC15M-26APR241530-30' },
      { id: 943, ts: '2026-04-24T18:35:34Z', side: 'NO',  confidence: 0.55,
        probabilityBucket: '0.5-0.6', thesisTimeframe: '15m',
        thesis: 'Liquidity sweep below prior low',
        reasoning: 'Price swept the 77,596 liquidity pool; expecting mean reversion.',
        windowTicker: 'KXBTC15M-26APR241445-45' },
      { id: 940, ts: '2026-04-24T17:20:00Z', side: 'YES', confidence: 0.71,
        probabilityBucket: '0.7-0.8', thesisTimeframe: '15m',
        thesis: 'VWAP reclaim on rising volume',
        reasoning: 'VWAP reclaimed intrabar with a bullish marubozu on the 15m.',
        windowTicker: 'KXBTC15M-26APR241330-30' },
    ],
  },

  rgti: {
    sector: 'quantum',
    slug: 'rgti',
    symbol: 'RGTI',
    fullName: 'Rigetti Computing',
    sourceLabel: 'finnhub · RGTI',
    currentPrice: 16.525,
    lastUpdated: '2026-04-24T18:55:39Z',
    dailyChange: { abs: -0.08, pct: -0.48, direction: 'down' },
    ranges: {
      short: { high: 16.65, low: 16.40 },
      day:   { high: 16.81, low: 16.42 },
      week:  { high: 17.92, low: 16.10 },
      month: { high: 19.45, low: 14.22 },
      year:  { high: 28.40, low: 5.80  },
    },
    perf: {
      d24: { pct: -0.48, abs: -0.08, dir: 'down' },
      d7:  { pct:  2.12, abs:  0.34, dir: 'up'   },
      d30: { pct: -8.45, abs: -1.52, dir: 'down' },
      y1:  { pct: 32.50, abs:  4.05, dir: 'up'   },
    },
    structure: {
      short: { sentiment: 'bearish',       dir: 'down', horizon: 'next 1–4h'  },
      day:   { sentiment: 'bearish',       dir: 'down', horizon: 'next 24h'   },
      week:  { sentiment: 'consolidating', dir: 'side', horizon: 'past week'  },
      month: { sentiment: 'bearish',       dir: 'down', horizon: 'past month' },
      year:  { sentiment: 'bullish',       dir: 'up',   horizon: 'past year'  },
    },
    stale: false,
    bars: generateQuantumBars(16.525, 50, 0.015),
    overlays: null,
    node: { available: false },
    news: {
      primaries: [
        { ts: '2026-04-24T16:12:00Z', source: 'IEEE Spectrum',   headline: 'Rigetti publishes 84-qubit fidelity benchmarks',    excerpt: 'New results from Rigetti show two-qubit gate fidelity above 99.5% on their latest Ankaa system, the best public figure the company has reported.' },
        { ts: '2026-04-23T18:00:00Z', source: 'Bloomberg',        headline: 'Quantum sector slides on DARPA budget reveal',     excerpt: 'A leaked copy of the DARPA quantum programme budget showed a 30% cut to benchmark-program funding; listed quantum names traded down on the news.' },
        { ts: '2026-04-22T10:40:00Z', source: 'TechCrunch',       headline: 'Rigetti partners with Oak Ridge on logical qubit study', excerpt: 'The two-year collaboration will characterise surface-code performance on Rigetti’s 84-qubit system; results are expected by Q2 2027.' },
        { ts: '2026-04-22T08:45:00Z', source: 'The Information',  headline: 'Rigetti CFO departs after 18 months',              excerpt: 'Finance chief Jeff Bertelsen will leave at the end of May; Rigetti has begun a search and reiterated FY26 revenue guidance.' },
        { ts: '2026-04-21T17:20:00Z', source: 'SEC filing',       headline: '10-Q filing notes increased R&D spend YoY',        excerpt: 'Rigetti reported R&D expenses of $21.4M for Q1 2026, up 18% from Q1 2025 as the company scales its Ankaa-3 development roadmap.' },
        { ts: '2026-04-20T14:00:00Z', source: 'Barron’s',    headline: 'Quantum computing ETFs underperform QQQ by 8% YTD', excerpt: 'Defiance’s QTUM ETF trailed the Nasdaq-100 by 8.1 percentage points through the end of April, led lower by pure-play names.' },
      ],
      features: [
        { ts: '2026-04-24T13:00:00Z', headline: 'Superconducting players race to publish post-DARPA benchmark sheets',
          excerpt: 'With sector funding under review, Rigetti and its peers have moved up benchmark publication timelines. Kujaku reads the latest Ankaa fidelity numbers as a direct response to the procurement-cycle pressure rather than a discrete capability jump.',
          sources: ['IEEE Spectrum', 'Bloomberg', 'TechCrunch'] },
        { ts: '2026-04-23T15:30:00Z', headline: 'Quantum-cloud margin economics tighten; smaller fleets feel it first',
          excerpt: 'AWS Braket and Azure Quantum continue to undercut on-prem economics for low-utilization customers. Rigetti, with the smallest installed base of the listed names, is most exposed to this dynamic over the next two quarters.',
          sources: ['Wall Street Journal', 'Reuters', 'TechCrunch'] },
      ],
    },
    comparisons: [
      {
        vsSymbol: 'IONQ', vsName: 'IonQ', vsCategory: 'trapped-ion vs superconducting',
        vsPrice: '$42.74', vsPerfPct: 0.33, vsPerfDir: 'up',
        selfPerfPct: 2.5, selfPerfDir: 'up',
        metricLabel: 'rel. perf (90d)', metricValue: '-8.4%', metricTrend: 'RGTI vs IONQ',
        title: 'Capex efficiency favors trapped-ion below 1k qubits',
        body: "IonQ's per-logical-qubit capex efficiency continues to outpace Rigetti's at scales below 1k physical qubits. The gap narrowed in early 2026 as Rigetti's 84-qubit Ankaa-3 published better fidelity numbers, but DOE procurement continues to favor IonQ for materials-simulation workloads. Below the inflection point, trapped-ion wins; above it, superconducting wins.",
        refreshedAt: '2026-04-24T08:00:00Z',
      },
    ],
    swings: [
      { ts: '2026-04-24T13:55:00Z', type: 'swing high', direction: 'bearish', from: 16.78, to: 16.42 },
      { ts: '2026-04-24T10:20:00Z', type: 'swing low',  direction: 'bullish', from: 16.20, to: 16.60 },
    ],
    hypotheses: [],
  },

  ionq: {
    sector: 'quantum',
    slug: 'ionq',
    symbol: 'IONQ',
    fullName: 'IonQ',
    sourceLabel: 'finnhub · IONQ',
    currentPrice: 42.74,
    lastUpdated: '2026-04-24T18:43:00Z',
    dailyChange: { abs: 0.14, pct: 0.33, direction: 'up' },
    ranges: {
      short: { high: 42.95, low: 42.55 },
      day:   { high: 42.94, low: 42.38 },
      week:  { high: 45.12, low: 41.05 },
      month: { high: 48.80, low: 38.20 },
      year:  { high: 64.20, low: 28.50 },
    },
    perf: {
      d24: { pct:  0.33, abs:  0.14, dir: 'up'   },
      d7:  { pct: -1.40, abs: -0.62, dir: 'down' },
      d30: { pct:  4.60, abs:  1.88, dir: 'up'   },
      y1:  { pct: 18.20, abs:  6.58, dir: 'up'   },
    },
    structure: {
      short: { sentiment: 'neutral',       dir: 'flat', horizon: 'next 1–4h'  },
      day:   { sentiment: 'consolidating', dir: 'side', horizon: 'next 24h'   },
      week:  { sentiment: 'bullish',       dir: 'up',   horizon: 'past week'  },
      month: { sentiment: 'bullish',       dir: 'up',   horizon: 'past month' },
      year:  { sentiment: 'bullish',       dir: 'up',   horizon: 'past year'  },
    },
    stale: true,
    bars: generateQuantumBars(42.74, 5, 0.02),
    overlays: null,
    node: { available: false },
    news: {
      primaries: [
        { ts: '2026-04-24T15:00:00Z', source: 'Wall Street Journal', headline: 'IonQ secures $55M DOE contract',                excerpt: 'The five-year DOE Office of Science award targets materials-simulation workloads on IonQ’s trapped-ion hardware through FY2030.' },
        { ts: '2026-04-23T09:45:00Z', source: 'Bloomberg',           headline: 'IonQ trades sideways as investors wait on Q1 results', excerpt: 'Shares hovered near $42 ahead of the May 12 earnings date; analysts polled by Refinitiv expect revenue of $10.8M.' },
        { ts: '2026-04-22T22:10:00Z', source: 'Reuters',             headline: 'Peninsula trapped-ion milestone reported at APS', excerpt: 'IonQ researchers demonstrated 99.97% single-qubit gate fidelity on a 32-ion chain in a poster at the APS March Meeting.' },
        { ts: '2026-04-22T08:00:00Z', source: 'CNBC',                headline: 'IonQ and Hyundai expand vehicle-simulation partnership', excerpt: 'The next phase will apply IonQ’s hybrid QAOA workflow to battery-pack fault-mode search across Hyundai’s EV platforms.' },
        { ts: '2026-04-21T14:30:00Z', source: 'IEEE Spectrum',       headline: 'Trapped-ion scaling roadmap revised',           excerpt: 'IonQ’s updated roadmap pushes the 1024-algorithmic-qubit target to 2029, citing supply constraints on their photonic interconnect parts.' },
        { ts: '2026-04-20T11:20:00Z', source: 'The Information',     headline: 'IonQ adds ex-Google research lead to advisory board', excerpt: 'Former Google Quantum AI researcher Sergio Boixo will join IonQ’s scientific advisory board effective May 1.' },
      ],
      features: [
        { ts: '2026-04-24T10:15:00Z', headline: 'DOE awards reshape commercial quantum economics',
          excerpt: 'The latest tranche of Office of Science contracts skews toward trapped-ion modalities; IonQ captures the largest individual award. Kujaku reads this as procurement preferring proven gate fidelity over qubit count for materials-simulation workloads.',
          sources: ['Wall Street Journal', 'IEEE Spectrum', 'Reuters'] },
        { ts: '2026-04-23T17:00:00Z', headline: 'Trapped-ion vs superconducting: the 2026 capex picture',
          excerpt: "Capital efficiency per logical qubit continues to favor trapped-ion fleets at small scale; superconducting wins above 1k physical qubits. IonQ's Tempe expansion suggests bet placed on the former winning the next two-year procurement window.",
          sources: ['Bloomberg', 'TechCrunch', 'Financial Times'] },
      ],
    },
    comparisons: [
      {
        vsSymbol: 'RGTI', vsName: 'Rigetti Computing', vsCategory: 'trapped-ion vs superconducting',
        vsPrice: '$16.42', vsPerfPct: 2.5, vsPerfDir: 'up',
        selfPerfPct: 0.33, selfPerfDir: 'up',
        metricLabel: 'rel. perf (90d)', metricValue: '+12.1%', metricTrend: 'IONQ vs RGTI',
        title: 'DOE procurement reshapes the race',
        body: "IonQ's DOE contract awards have widened the commercial gap with Rigetti. Federal procurement continues to favor proven gate fidelity over qubit count for materials-simulation; IonQ's Tempe expansion suggests management bet on this dynamic persisting through 2027. Rigetti's response has been benchmark publishing rather than commercial wins.",
        refreshedAt: '2026-04-24T08:00:00Z',
      },
    ],
    swings: [
      { ts: '2026-04-24T12:15:00Z', type: 'swing high', direction: 'bearish', from: 42.94, to: 42.60 },
    ],
    hypotheses: [],
  },

  qbts: {
    sector: 'quantum',
    slug: 'qbts',
    symbol: 'QBTS',
    fullName: 'D-Wave Quantum',
    sourceLabel: 'finnhub · QBTS',
    currentPrice: 18.44,
    lastUpdated: '2026-04-24T18:55:59Z',
    dailyChange: { abs: 0.22, pct: 1.21, direction: 'up' },
    ranges: {
      short: { high: 18.60, low: 18.30 },
      day:   { high: 18.58, low: 18.09 },
      week:  { high: 19.10, low: 17.55 },
      month: { high: 22.40, low: 15.80 },
      year:  { high: 25.80, low: 8.40  },
    },
    perf: {
      d24: { pct:  1.21, abs:  0.22, dir: 'up'   },
      d7:  { pct:  3.20, abs:  0.57, dir: 'up'   },
      d30: { pct: -2.10, abs: -0.40, dir: 'down' },
      y1:  { pct: 22.80, abs:  3.42, dir: 'up'   },
    },
    structure: {
      short: { sentiment: 'bullish',       dir: 'up',   horizon: 'next 1–4h'  },
      day:   { sentiment: 'bullish',       dir: 'up',   horizon: 'next 24h'   },
      week:  { sentiment: 'consolidating', dir: 'side', horizon: 'past week'  },
      month: { sentiment: 'bullish',       dir: 'up',   horizon: 'past month' },
      year:  { sentiment: 'bullish',       dir: 'up',   horizon: 'past year'  },
    },
    stale: false,
    bars: generateQuantumBars(18.44, 57, 0.012),
    overlays: null,
    node: { available: false },
    news: {
      primaries: [
        { ts: '2026-04-24T14:30:00Z', source: 'CNBC',            headline: 'D-Wave annealer used in drug-discovery pilot at BMS', excerpt: 'Bristol Myers Squibb reported first results from a year-long pilot applying D-Wave’s hybrid solver to peptide-folding search.' },
        { ts: '2026-04-23T11:05:00Z', source: 'IEEE Spectrum',   headline: 'D-Wave touts hybrid solver traction in Q1 prelim', excerpt: 'Preliminary commentary on the May 9 earnings call suggested record-high customer usage of the Leap quantum-hybrid cloud in Q1 2026.' },
        { ts: '2026-04-22T16:00:00Z', source: 'Reuters',         headline: 'D-Wave signs five-year cloud deal with Mastercard', excerpt: 'The multi-year Leap subscription will explore combinatorial-optimisation use cases in fraud-model parameter search at Mastercard Labs.' },
        { ts: '2026-04-22T09:15:00Z', source: 'Bloomberg',       headline: 'D-Wave insider trading window closes ahead of earnings', excerpt: 'Form 4 filings show no insider purchases during the latest open window; D-Wave reports Q1 on May 9 after the close.' },
        { ts: '2026-04-21T20:45:00Z', source: 'TechCrunch',      headline: 'D-Wave sells 2,000-qubit Advantage2 system to Lockheed', excerpt: 'Lockheed Martin purchased the second on-premises Advantage2 system D-Wave has placed this year, doubling its install base.' },
        { ts: '2026-04-21T09:00:00Z', source: 'Quanta Magazine', headline: 'Annealing’s resurgence: a primer on near-term optimisation', excerpt: 'An explainer survey of quantum annealing’s commercial traction quotes D-Wave, Fujitsu, and NEC on mid-decade optimisation workloads.' },
      ],
      features: [
        { ts: '2026-04-24T08:30:00Z', headline: 'Annealer applications break into pharma',
          excerpt: "BMS's peptide-folding pilot is the first published Pharma-1 use case for D-Wave's hybrid solver. Kujaku notes the procurement model — annealer-as-service via cloud — is the lever that made the pilot economically viable, not the hardware itself.",
          sources: ['CNBC', 'IEEE Spectrum', 'Bloomberg'] },
        { ts: '2026-04-23T13:20:00Z', headline: 'Hybrid solver category gains commercial traction',
          excerpt: "D-Wave's Mastercard cloud deal joins a string of enterprise contracts where the work is hybrid classical-quantum, not pure-quantum. The procurement category is fragmenting: pure-quantum for materials science, hybrid-solver for combinatorial optimization.",
          sources: ['Reuters', 'TechCrunch', 'Wall Street Journal'] },
      ],
    },
    comparisons: [
      {
        vsSymbol: 'IONQ', vsName: 'IonQ', vsCategory: 'annealer vs gate-based',
        vsPrice: '$42.74', vsPerfPct: 0.33, vsPerfDir: 'up',
        selfPerfPct: 1.84, selfPerfDir: 'up',
        metricLabel: 'revenue mix', metricValue: '80% / 95%', metricTrend: 'QBTS optimization / IONQ pure-quantum',
        title: 'Different markets, different metrics',
        body: "D-Wave's commercial wins are concentrated in hybrid optimization workloads — Mastercard, BMS pharma — that don't compete directly with IonQ's pure-quantum materials work. Comparing the two on traditional quantum metrics (gate fidelity, qubit count) misses the point. Their go-to-market thesis differs more than their technology does.",
        refreshedAt: '2026-04-24T08:00:00Z',
      },
    ],
    swings: [
      { ts: '2026-04-24T15:40:00Z', type: 'BOS', direction: 'bullish', from: 18.30, to: 18.55 },
    ],
    hypotheses: [],
  },
};

export function loadAssetData(slug: string): AssetData | null {
  return MOCK_DATA[slug] ?? null;
}
