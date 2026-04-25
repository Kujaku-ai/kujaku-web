// Charting calculations API client — charting-calculations-production.up.railway.app.
// TODO Phase 3+: replace mock returns with real fetch() per overlay endpoint.
// Spec: ASSETPAGE_BUILD_SPEC.md → Data Sources.

import type { Overlays, Structure } from '~/lib/types/asset';
import { loadAssetData } from '~/lib/data/mock';

// GET /api/structure?asset={slug} — returns 5-tf bias.
export async function getStructure(_assetSlug: string): Promise<Structure | null> {
  const d = loadAssetData(_assetSlug);
  return d ? d.structure : null;
}

// GET /api/{liquidity|fvg|structure|orderblocks}?asset={slug}
// Returned shape per spec maps directly onto the Overlays union.
export async function getOverlays(_assetSlug: string): Promise<Overlays | null> {
  const d = loadAssetData(_assetSlug);
  return d ? d.overlays : null;
}
