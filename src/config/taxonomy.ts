export type SectorStatus = 'live' | 'draft' | 'hidden';

export type Sector = {
  slug: string;              // lowercase, url-safe
  name: string;              // display name, may be mixed case
  kanji?: string;            // brand-approved kanji only (optional)
  tagline?: string;          // one-line descriptor
  status: SectorStatus;
  fallbackTo: string | null; // if draft/hidden, canonical assets render under this sector slug
};

export type Asset = {
  slug: string;              // lowercase, url-safe
  name: string;              // short display, e.g. "BTC"
  fullName: string;          // e.g. "Bitcoin"
  canonicalSector: string;   // permanent home — never changes when parent sector is pulled down
  aliases: string[];         // for future search palette
  api: {
    data?: string;           // layer 1 collector base URL
    bot?: string;            // layer 2b bot base URL
  };
  panels: string[];          // future sub-sections on the asset page
  status: 'live' | 'stub';   // 'stub' = placeholder page, no live data
};

export const sectors: Record<string, Sector> = {
  crypto: {
    slug: 'crypto',
    name: 'Crypto',
    tagline: 'prediction markets on digital assets',
    status: 'live',
    fallbackTo: null,
  },
  qc: {
    slug: 'qc',
    name: 'Quantum Computing',
    tagline: 'public-market quantum hardware names',
    status: 'live',
    fallbackTo: null,
  },
};

export const assets: Record<string, Asset> = {
  btc: {
    slug: 'btc',
    name: 'BTC',
    fullName: 'Bitcoin',
    canonicalSector: 'crypto',
    aliases: ['bitcoin', 'ビットコイン'],
    api: {
      data: 'https://data-btc.kujaku.ai/api',
      bot: 'https://kalshi15min-btc.kujaku.ai/api',
    },
    panels: ['overview', 'charting', 'agents', 'news', 'comparisons'],
    status: 'live',
  },
  rgti: {
    slug: 'rgti',
    name: 'RGTI',
    fullName: 'Rigetti Computing',
    canonicalSector: 'qc',
    aliases: ['rigetti'],
    api: {
      data: 'https://data-qc.kujaku.ai/api',
    },
    panels: ['overview', 'charting', 'agents', 'news', 'comparisons'],
    status: 'live',
  },
  ionq: {
    slug: 'ionq',
    name: 'IONQ',
    fullName: 'IonQ',
    canonicalSector: 'qc',
    aliases: ['ionq'],
    api: {
      data: 'https://data-qc.kujaku.ai/api',
    },
    panels: ['overview', 'charting', 'agents', 'news', 'comparisons'],
    status: 'live',
  },
  qbts: {
    slug: 'qbts',
    name: 'QBTS',
    fullName: 'D-Wave Quantum',
    canonicalSector: 'qc',
    aliases: ['d-wave', 'dwave'],
    api: {
      data: 'https://data-qc.kujaku.ai/api',
    },
    panels: ['overview', 'charting', 'agents', 'news', 'comparisons'],
    status: 'live',
  },
};

export function visibleSectors(): Sector[] {
  return Object.values(sectors).filter((s) => s.status === 'live');
}

export function sectorBySlug(slug: string): Sector | null {
  return sectors[slug] ?? null;
}

export function assetBySlug(slug: string): Asset | null {
  return assets[slug] ?? null;
}

export function assetsForSector(sectorSlug: string): Asset[] {
  const sector = sectors[sectorSlug];
  if (!sector) return [];
  const canonical = Object.values(assets).filter((a) => a.canonicalSector === sectorSlug);
  const fallbackFromDrafts = Object.values(sectors)
    .filter((s) => (s.status === 'draft' || s.status === 'hidden') && s.fallbackTo === sectorSlug)
    .flatMap((s) => Object.values(assets).filter((a) => a.canonicalSector === s.slug));
  return [...canonical, ...fallbackFromDrafts];
}

export type Bot = {
  slug: string;
  name: string;
  fullName: string;
  assetSlug: string;
  strategy: string;
  status: 'live' | 'paper' | 'stub';
  api?: string;
};

export const bots: Record<string, Bot> = {
  '15min': {
    slug: '15min',
    name: '15-minute',
    fullName: 'BTC 15-minute Kalshi bot',
    assetSlug: 'btc',
    strategy: 'kalshi15min',
    status: 'paper',
  },
};

export function botBySlug(slug: string): Bot | null {
  return bots[slug] ?? null;
}

export function botsForAsset(assetSlug: string): Bot[] {
  return Object.values(bots).filter((b) => b.assetSlug === assetSlug);
}
