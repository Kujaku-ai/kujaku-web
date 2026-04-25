// Collector API client — data-{sector}.kujaku.ai per-sector services.
// TODO Phase 8+: replace mock with fetch() to real endpoints.
// See ASSETPAGE_BUILD_SPEC.md → "Data Sources / API Plumbing".

import type { Bar } from '~/lib/types/asset';
import { loadAssetData } from '~/lib/data/mock';

export type CollectorHealth = {
  source: string;
  status: 'live' | 'stale' | 'down';
  updatedAt: string;        // ISO
};

export type RecentPricesQuery = {
  limit?: number;
  resolution?: '1m' | '5m' | '15m' | '1h' | '1d';
};

// GET data-{sector}.kujaku.ai/health
export async function getHealth(_assetSlug: string): Promise<CollectorHealth | null> {
  const d = loadAssetData(_assetSlug);
  if (!d) return null;
  return {
    source: d.sourceLabel,
    status: d.stale ? 'stale' : 'live',
    updatedAt: d.lastUpdated,
  };
}

// GET data-{sector}.kujaku.ai/api/prices/latest
export async function getLatestPrice(_assetSlug: string): Promise<number | null> {
  const d = loadAssetData(_assetSlug);
  return d ? d.currentPrice : null;
}

// GET data-{sector}.kujaku.ai/api/prices/recent?limit=N
export async function getRecentBars(
  _assetSlug: string,
  _q: RecentPricesQuery = {},
): Promise<Bar[]> {
  const d = loadAssetData(_assetSlug);
  if (!d) return [];
  const limit = _q.limit ?? d.bars.length;
  return d.bars.slice(-limit);
}
