import type { TokenConfig } from '../config/token.ts';
import { validateEvmAddress } from './address.ts';
import { checkSwapUrl } from './links.ts';

export type PurchaseReason =
  | 'ok'
  | 'prelaunch'
  | 'chain-mismatch'
  | 'missing-address'
  | 'invalid-address'
  | 'missing-swap'
  | 'invalid-swap'
  | 'swap-mismatch';

export interface PurchaseDecision {
  enabled: boolean;
  href: string | null;
  reason: PurchaseReason;
}

export function evaluatePurchase(config: TokenConfig): PurchaseDecision {
  if (config.launchStatus !== 'live') {
    return { enabled: false, href: null, reason: 'prelaunch' };
  }
  if (config.chainId !== 1) {
    return { enabled: false, href: null, reason: 'chain-mismatch' };
  }

  const rawAddress = config.contractAddress;
  if (rawAddress === null || rawAddress.trim() === '') {
    return { enabled: false, href: null, reason: 'missing-address' };
  }
  const address = validateEvmAddress(rawAddress);
  if (!address) {
    return { enabled: false, href: null, reason: 'invalid-address' };
  }

  const swap = checkSwapUrl(config.swapUrl, address);
  if (!swap.ok || !swap.href) {
    if (swap.reason === 'missing') return { enabled: false, href: null, reason: 'missing-swap' };
    if (swap.reason === 'mismatch') return { enabled: false, href: null, reason: 'swap-mismatch' };
    return { enabled: false, href: null, reason: 'invalid-swap' };
  }

  return { enabled: true, href: swap.href, reason: 'ok' };
}
