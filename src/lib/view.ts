import type { Allocation, TokenConfig } from '../config/token.ts';
import { tokenConfig } from '../config/token.ts';
import { validateEvmAddress } from './address.ts';
import { etherscanTokenUrl, parseHttpsUrl } from './links.ts';
import { evaluatePurchase } from './purchase.ts';

export interface Cta {
  label: string;
  href: string;
  external: boolean;
  host: string | null;
}

export interface ContractView {
  address: string | null;
  etherscanUrl: string | null;
  message: string;
  copyEnabled: boolean;
  availability: string;
}

export interface FactItem {
  label: string;
  value: string;
  href: string | null;
}

export interface EvidenceItem {
  id: string;
  label: string;
  state: 'Evidence linked' | 'Not published';
  detail: string;
  review: 'Not independently checked';
  href: string | null;
  host: string | null;
}

export interface SocialLink {
  label: string;
  href: string;
  host: string;
}

export interface TokenView {
  launchLabel: 'Prelaunch' | 'Trading live';
  purchaseEnabled: boolean;
  configNote: string | null;
  primaryCta: Cta;
  secondaryCta: Cta;
  networkLabel: string;
  chainProblem: string | null;
  contract: ContractView;
  facts: FactItem[];
  tokenRows: FactItem[];
  showAllocationChart: boolean;
  allocations: Allocation[];
  evidence: EvidenceItem[];
  socials: SocialLink[];
  chart: SocialLink | null;
  docs: SocialLink | null;
  source: { href: string; host: string; publisher: string; dateLabel: string } | null;
  buyTaxLabel: string;
  sellTaxLabel: string;
  roadmapAllProposed: boolean;
}

const NOT_PUBLISHED = 'Not published';

export function allocationsArePublishable(allocations: Allocation[] | null): allocations is Allocation[] {
  if (!allocations || allocations.length === 0) return false;
  if (allocations.some((item) => item.label.trim() === '' || !Number.isFinite(item.percent) || item.percent < 0)) {
    return false;
  }
  const sum = allocations.reduce((total, item) => total + item.percent, 0);
  return Math.abs(sum - 100) < 0.001;
}

export function buildTokenView(config: TokenConfig = tokenConfig): TokenView {
  const purchase = evaluatePurchase(config);
  const launchLabel = purchase.enabled ? 'Trading live' : 'Prelaunch';
  const networkLabel = config.chainId === 1 ? 'Ethereum mainnet' : `Chain ID ${config.chainId}`;
  const chainProblem =
    config.chainId === 1
      ? null
      : `This site only supports Ethereum mainnet (chain ID 1). The configured chain ID is ${config.chainId}.`;

  const rawAddress = config.contractAddress;
  const addressMissing = rawAddress === null || rawAddress.trim() === '';
  const validatedAddress = addressMissing || !rawAddress ? null : validateEvmAddress(rawAddress);
  const contract: ContractView = addressMissing
    ? {
        address: null,
        etherscanUrl: null,
        message: 'Coming Soon..',
        copyEnabled: false,
        availability: NOT_PUBLISHED,
      }
    : validatedAddress
      ? {
          address: validatedAddress,
          etherscanUrl: etherscanTokenUrl(validatedAddress),
          message: '',
          copyEnabled: true,
          availability: 'Published',
        }
      : {
          address: null,
          etherscanUrl: null,
          message: 'The configured contract address failed validation, so it is not shown.',
          copyEnabled: false,
          availability: 'Failed validation',
        };

  const primaryCta: Cta =
    purchase.enabled && purchase.href
      ? { label: 'Buy $NWDOG', href: purchase.href, external: true, host: 'app.uniswap.org' }
      : { label: 'How to Buy', href: '#how-to-buy', external: false, host: null };

  const socials = [
    toSocial('X', config.xUrl),
    toSocial('Telegram', config.telegramGroupUrl),
    toSocial('Telegram channel', config.telegramChannelUrl),
  ].filter((item): item is SocialLink => item !== null);

  const secondaryCta: Cta =
    socials.length === 1 && socials[0]
      ? { label: 'Join the Night Watch', href: socials[0].href, external: true, host: socials[0].host }
      : { label: 'Join the Night Watch', href: '#community', external: false, host: null };

  const docs = toSocial('Documentation', config.docsUrl);
  const chart = toSocial('Chart', config.chartUrl);
  const sourceUrl = parseHttpsUrl(config.sourceNote.url);
  const allocations = allocationsArePublishable(config.allocations) ? config.allocations : [];

  return {
    launchLabel,
    purchaseEnabled: purchase.enabled,
    configNote:
      config.launchStatus === 'live' && !purchase.enabled
        ? 'Buy buttons stay off until the contract, Ethereum chain, and official Uniswap link all check out.'
        : null,
    primaryCta,
    secondaryCta,
    networkLabel,
    chainProblem,
    contract,
    facts: [
      { label: 'Network', value: networkLabel, href: null },
      { label: 'Launch state', value: launchLabel, href: null },
      { label: 'Contract', value: contract.availability, href: null },
      { label: 'Documentation', value: docs ? 'Published' : NOT_PUBLISHED, href: docs?.href ?? null },
    ],
    tokenRows: tokenRows(config, contract, networkLabel, allocations),
    showAllocationChart: allocations.length > 0,
    allocations,
    evidence: evidenceRows(config, contract),
    socials,
    chart,
    docs,
    source: sourceUrl
      ? {
          href: sourceUrl.href,
          host: sourceUrl.host,
          publisher: config.sourceNote.publisher,
          dateLabel: config.sourceNote.dateLabel,
        }
      : null,
    buyTaxLabel: formatTax(config.buyTaxPercent),
    sellTaxLabel: formatTax(config.sellTaxPercent),
    roadmapAllProposed: config.roadmap.every((item) => item.status === 'proposed'),
  };
}

function tokenRows(
  config: TokenConfig,
  contract: ContractView,
  networkLabel: string,
  allocations: Allocation[],
): FactItem[] {
  return [
    { label: 'Name', value: config.name, href: null },
    { label: 'Symbol', value: `$${config.ticker}`, href: null },
    { label: 'Chain', value: `${networkLabel} (chain ID ${config.chainId})`, href: null },
    {
      label: 'Contract',
      value: contract.address ?? contract.message,
      href: contract.etherscanUrl,
    },
    { label: 'Total supply', value: published(config.totalSupply), href: null },
    { label: 'Circulating supply', value: published(config.circulatingSupply), href: null },
    { label: 'Buy tax', value: formatTax(config.buyTaxPercent), href: null },
    { label: 'Sell tax', value: formatTax(config.sellTaxPercent), href: null },
    {
      label: 'Allocations',
      value: allocations.length > 0 ? 'Published in the table below' : NOT_PUBLISHED,
      href: null,
    },
    { label: 'Liquidity', value: published(config.liquidityDescription), href: null },
    evidenceFact('Liquidity evidence', config.liquidityEvidenceUrl, null),
    evidencedDetail(
      'Liquidity burn',
      config.liquidityBurn?.evidenceUrl ?? null,
      config.liquidityBurn ? 'A burn record link has been published.' : null,
    ),
    lockFact(config),
    evidencedDetail(
      'Ownership',
      config.ownershipEvidenceUrl,
      config.ownershipDescription,
    ),
    { label: 'Admin controls', value: published(config.adminDescription), href: null },
    evidenceFact('Admin evidence', config.adminEvidenceUrl, null),
  ];
}

function evidenceRows(config: TokenConfig, contract: ContractView): EvidenceItem[] {
  return [
    evidenceItem(
      'contract-source',
      'Contract source',
      contract.etherscanUrl,
      'Block explorer page for the configured address.',
    ),
    evidenceItem('liquidity', 'Liquidity record', config.liquidityEvidenceUrl, 'Project-supplied liquidity link.'),
    evidenceItem('burn', 'Liquidity burn', config.liquidityBurn?.evidenceUrl ?? null, 'Project-supplied burn record.'),
    evidenceItem('lock', 'Liquidity lock', config.liquidityLock?.evidenceUrl ?? null, 'Project-supplied lock record.'),
    evidenceItem('ownership', 'Ownership', config.ownershipEvidenceUrl, 'Project-supplied ownership record.'),
    evidenceItem('admin', 'Admin controls', config.adminEvidenceUrl, 'Project-supplied admin-control record.'),
    evidenceItem('audit', 'Audit report', config.auditUrl, 'Project-supplied audit report.'),
  ];
}

function evidenceItem(id: string, label: string, url: string | null, detail: string): EvidenceItem {
  const link = toSocial(label, url);
  if (!link) {
    return {
      id,
      label,
      state: 'Not published',
      detail: NOT_PUBLISHED,
      review: 'Not independently checked',
      href: null,
      host: null,
    };
  }
  return {
    id,
    label,
    state: 'Evidence linked',
    detail,
    review: 'Not independently checked',
    href: link.href,
    host: link.host,
  };
}

function evidenceFact(label: string, url: string | null, detail: string | null): FactItem {
  const link = toSocial(label, url);
  if (!link) return { label, value: NOT_PUBLISHED, href: null };
  return { label, value: detail ?? 'Evidence linked', href: link.href };
}

function evidencedDetail(label: string, url: string | null, detail: string | null): FactItem {
  const link = toSocial(label, url);
  if (!link) return { label, value: NOT_PUBLISHED, href: null };
  const text = detail?.trim();
  return { label, value: text ? text : 'Evidence linked', href: link.href };
}

function lockFact(config: TokenConfig): FactItem {
  const lock = config.liquidityLock;
  const link = toSocial('Liquidity lock', lock?.evidenceUrl ?? null);
  if (!lock || !link) return { label: 'Liquidity lock', value: NOT_PUBLISHED, href: null };
  const locker = published(lock.locker);
  const unlock = published(lock.unlockDate);
  return {
    label: 'Liquidity lock',
    value: `Locker: ${locker}. Unlock date: ${unlock}.`,
    href: link.href,
  };
}

function toSocial(label: string, value: string | null): SocialLink | null {
  if (!value) return null;
  const url = parseHttpsUrl(value);
  if (!url) return null;
  return { label, href: url.href, host: url.host };
}

function published(value: string | null): string {
  if (value === null) return NOT_PUBLISHED;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : NOT_PUBLISHED;
}

function formatTax(value: number | null): string {
  if (value === null || !Number.isFinite(value) || value < 0) return NOT_PUBLISHED;
  const text = Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  return `${text}%`;
}
