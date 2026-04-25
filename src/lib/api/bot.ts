// Bot API client — kalshi15min-btc.kujaku.ai (and any future bot services).
// TODO Phase 4: replace mock returns with real fetch().
//
// CRITICAL: /api/decisions returns context_json (~1.2 MB/row, the full
// prompt sent to Claude per decision). This client MUST strip that field
// before returning to callers — never let it reach the browser. The
// Hypothesis type in ~/lib/types/asset.ts already excludes context_json
// so any leaked field would surface as a TS error.

import type { BotData, Hypothesis } from '~/lib/types/asset';
import { loadAssetData } from '~/lib/data/mock';

// GET kalshi15min-btc.kujaku.ai/api/portfolio + /api/window
export async function getBotData(_assetSlug: string): Promise<BotData> {
  const d = loadAssetData(_assetSlug);
  return d?.node ?? { available: false };
}

// GET kalshi15min-btc.kujaku.ai/api/decisions?limit=N
// IMPORTANT: real implementation must strip context_json server-side
// before the response is serialized to the client. Pseudocode:
//   const rows = await fetch(...).then(r => r.json());
//   return rows.map(({ context_json, ...rest }) => rest);
export async function getHypotheses(
  _assetSlug: string,
  _limit = 5,
): Promise<Hypothesis[]> {
  const d = loadAssetData(_assetSlug);
  if (!d) return [];
  return d.hypotheses.slice(0, _limit);
}
