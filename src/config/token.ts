/**
 * Single source for token facts and official destinations.
 * Unknown values stay null. Do not invent numbers, links, or listings.
 * Purchase buttons turn on only through evaluatePurchase() in src/lib/purchase.ts.
 */
export type LaunchStatus = 'prelaunch' | 'live';

export interface Allocation {
  label: string;
  percent: number;
}

export interface LiquidityLock {
  locker: string | null;
  unlockDate: string | null;
  evidenceUrl: string | null;
}

export interface LiquidityBurn {
  evidenceUrl: string | null;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  summary: string;
  activities: string[];
  status: 'proposed' | 'complete';
}

export interface SourceNote {
  dateLabel: string;
  publisher: string;
  url: string;
}

export interface TokenConfig {
  launchStatus: LaunchStatus;
  name: string;
  ticker: string;
  chainId: number;
  contractAddress: string | null;
  swapUrl: string | null;
  chartUrl: string | null;
  xUrl: string | null;
  telegramGroupUrl: string | null;
  telegramChannelUrl: string | null;
  docsUrl: string | null;
  siteUrl: string | null;
  totalSupply: string | null;
  circulatingSupply: string | null;
  buyTaxPercent: number | null;
  sellTaxPercent: number | null;
  allocations: Allocation[] | null;
  liquidityDescription: string | null;
  liquidityEvidenceUrl: string | null;
  liquidityLock: LiquidityLock | null;
  liquidityBurn: LiquidityBurn | null;
  ownershipDescription: string | null;
  ownershipEvidenceUrl: string | null;
  adminDescription: string | null;
  adminEvidenceUrl: string | null;
  auditUrl: string | null;
  roadmap: RoadmapMilestone[];
  sourceNote: SourceNote;
}

export const tokenConfig: TokenConfig = {
  launchStatus: 'prelaunch',
  name: 'Night Watch Dog',
  ticker: 'NWDOG',
  chainId: 1,
  contractAddress: null,
  swapUrl: null,
  chartUrl: null,
  xUrl: 'https://x.com/nwdog_eth',
  telegramGroupUrl: 'https://t.me/nwdog_eth',
  telegramChannelUrl: null,
  docsUrl: null,
  siteUrl: 'https://nwdog.world',
  totalSupply: '1,000,000,000',
  circulatingSupply: null,
  buyTaxPercent: 0,
  sellTaxPercent: 0,
  allocations: null,
  liquidityDescription: null,
  liquidityEvidenceUrl: null,
  liquidityLock: null,
  liquidityBurn: null,
  ownershipDescription: 'LP tokens are burnt and contract ownership is renounced.',
  ownershipEvidenceUrl: null,
  adminDescription: null,
  adminEvidenceUrl: null,
  auditUrl: null,
  roadmap: [
    {
      id: 'hq',
      title: 'Set Up HQ',
      summary: 'Publish this site and the official channels the project actually uses.',
      activities: ['Site launch', 'Official channels'],
      status: 'proposed',
    },
    {
      id: 'watch',
      title: 'Grow the Night Watch',
      summary: 'Invite people to draw, joke, and pass the mascot around. Buying is not required.',
      activities: ['Community art', 'Night-shift memes'],
      status: 'proposed',
    },
    {
      id: 'kit',
      title: 'Expand the Meme Kit',
      summary: 'Add more badge and meme tools people can use without a wallet.',
      activities: ['Badge tools', 'Meme kit'],
      status: 'proposed',
    },
  ],
  sourceNote: {
    dateLabel: 'October 3, 2026',
    publisher: 'Business Insider',
    url: 'https://www.businessinsider.com/elon-musk-tesla-trying-to-stop-robotaxis-from-hitting-cats-2026-10',
  },
};
