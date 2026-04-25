// Recent-activity feed merger. Ported from v02-comparisons.html
// buildFeedItems (line 6219). Merges news primaries + features + bot
// swings + bot hypotheses into a chronological list, newest-first.
//
// Used by:
//  - Overview tab (top 3 preview)
//  - News tab (full list, Phase 5)
//  - Activity sub-page (whenever that lands)

import type {
  AssetData,
  NewsPrimary,
  NewsFeature,
  Swing,
  Hypothesis,
} from '~/lib/types/asset';

export type FeedKind = 'news' | 'feature' | 'swing' | 'hypothesis';

interface FeedItemBase {
  ts: string;
  kind: FeedKind;
  headline: string;
  detail: string;
}

export interface NewsItem extends FeedItemBase {
  kind: 'news';
  source: string;
}

export interface FeatureItem extends FeedItemBase {
  kind: 'feature';
}

export interface SwingItem extends FeedItemBase {
  kind: 'swing';
}

export interface HypothesisItem extends FeedItemBase {
  kind: 'hypothesis';
  side: Hypothesis['side'];
  confidence: number;
  bucket: string;
}

export type FeedItem = NewsItem | FeatureItem | SwingItem | HypothesisItem;

function fromPrimary(n: NewsPrimary): NewsItem {
  return {
    ts: n.ts,
    kind: 'news',
    source: n.source,
    headline: n.headline,
    detail: n.source,
  };
}

function fromFeature(f: NewsFeature): FeatureItem {
  return {
    ts: f.ts,
    kind: 'feature',
    headline: f.headline,
    detail: 'feature · kujaku newsdesk',
  };
}

function fromSwing(s: Swing): SwingItem {
  return {
    ts: s.ts,
    kind: 'swing',
    headline: `${s.type} · ${s.direction}`,
    detail: `${s.from} → ${s.to}`,
  };
}

function fromHypothesis(h: Hypothesis): HypothesisItem {
  return {
    ts: h.ts,
    kind: 'hypothesis',
    side: h.side,
    confidence: h.confidence,
    bucket: h.probabilityBucket,
    headline: h.thesis,
    detail: h.reasoning,
  };
}

export function buildFeedItems(d: AssetData): FeedItem[] {
  const items: FeedItem[] = [
    ...d.news.primaries.map(fromPrimary),
    ...d.news.features.map(fromFeature),
    ...d.swings.map(fromSwing),
    ...d.hypotheses.map(fromHypothesis),
  ];
  items.sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
  return items;
}
