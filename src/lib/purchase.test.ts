import { describe, expect, it } from 'vitest';
import { tokenConfig } from '../config/token.ts';
import type { TokenConfig } from '../config/token.ts';
import { validateEvmAddress } from './address.ts';
import { evaluatePurchase } from './purchase.ts';
import { buildTokenView } from './view.ts';

const ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const OTHER = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

function swap(output: string, chain = 'ethereum'): string {
  return `https://app.uniswap.org/swap?chain=${chain}&inputCurrency=ETH&outputCurrency=${output}`;
}

function live(overrides: Partial<TokenConfig> = {}): TokenConfig {
  return {
    ...tokenConfig,
    launchStatus: 'live',
    chainId: 1,
    contractAddress: ADDRESS,
    swapUrl: swap(ADDRESS),
    ...overrides,
  };
}

describe('purchase gating', () => {
  it('stays closed during prelaunch even when an address and swap URL are present', () => {
    const config: TokenConfig = {
      ...tokenConfig,
      contractAddress: ADDRESS,
      swapUrl: swap(ADDRESS),
    };
    const decision = evaluatePurchase(config);
    const view = buildTokenView(config);
    expect(decision).toMatchObject({ enabled: false, href: null, reason: 'prelaunch' });
    expect(view.launchLabel).toBe('Prelaunch');
    expect(view.primaryCta).toMatchObject({ label: 'How to Buy', href: '#how-to-buy', external: false });
  });

  it('rejects a live config with no contract address', () => {
    const decision = evaluatePurchase(live({ contractAddress: null }));
    expect(decision).toMatchObject({ enabled: false, href: null, reason: 'missing-address' });
    expect(buildTokenView(live({ contractAddress: null })).primaryCta.href).not.toContain('uniswap');
  });

  it('rejects an invalid address and does not display it', () => {
    const decision = evaluatePurchase(live({ contractAddress: '0x1234' }));
    const view = buildTokenView(live({ contractAddress: '0x1234' }));
    expect(decision.reason).toBe('invalid-address');
    expect(decision.href).toBeNull();
    expect(view.contract.address).toBeNull();
    expect(view.contract.copyEnabled).toBe(false);
  });

  it('rejects a mixed-case address with a bad checksum', () => {
    const bad = '0xdAC17F958D2ee523a2206206994597C13D831ec6';
    expect(validateEvmAddress(bad)).toBeNull();
    expect(evaluatePurchase(live({ contractAddress: bad })).reason).toBe('invalid-address');
  });

  it('rejects a swap URL that points at a different token', () => {
    const decision = evaluatePurchase(live({ swapUrl: swap(OTHER) }));
    expect(decision).toMatchObject({ enabled: false, href: null, reason: 'swap-mismatch' });
  });

  it('rejects a non-ethereum chain on an otherwise matching swap URL', () => {
    expect(evaluatePurchase(live({ swapUrl: swap(ADDRESS, 'base') })).reason).toBe('swap-mismatch');
    expect(evaluatePurchase(live({ chainId: 137 })).reason).toBe('chain-mismatch');
  });

  it('rejects unsafe or unofficial swap destinations', () => {
    expect(evaluatePurchase(live({ swapUrl: null })).reason).toBe('missing-swap');
    expect(evaluatePurchase(live({ swapUrl: `javascript:alert(${ADDRESS})` })).reason).toBe('invalid-swap');
    expect(
      evaluatePurchase(
        live({
          swapUrl: `https://evil.example/swap?chain=ethereum&outputCurrency=${ADDRESS}`,
        }),
      ).reason,
    ).toBe('invalid-swap');
    expect(evaluatePurchase(live({ swapUrl: swap(ADDRESS).replace('https://', 'http://') })).reason).toBe(
      'invalid-swap',
    );
  });

  it('opens buy links only for a live Ethereum config whose Uniswap URL matches the contract', () => {
    const hashUrl = `https://app.uniswap.org/#/swap?chain=ethereum&outputCurrency=${ADDRESS}`;
    const pathDecision = evaluatePurchase(live());
    const hashDecision = evaluatePurchase(live({ swapUrl: hashUrl }));
    expect(pathDecision).toMatchObject({ enabled: true, href: swap(ADDRESS), reason: 'ok' });
    expect(hashDecision).toMatchObject({ enabled: true, href: hashUrl, reason: 'ok' });

    const view = buildTokenView(live());
    expect(view.launchLabel).toBe('Trading live');
    expect(view.primaryCta).toMatchObject({
      label: 'Buy $NWDOG',
      href: swap(ADDRESS),
      external: true,
    });
    expect(view.contract.address).toBe(ADDRESS);
    expect(view.contract.etherscanUrl).toBe(`https://etherscan.io/token/${ADDRESS}`);
  });

  it('keeps the configured address exact for lowercase and uppercase forms', () => {
    const lower = ADDRESS.toLowerCase();
    const upper = `0x${ADDRESS.slice(2).toUpperCase()}`;
    expect(validateEvmAddress(lower)).toBe(lower);
    expect(validateEvmAddress(upper)).toBe(upper);
    expect(buildTokenView(live({ contractAddress: lower, swapUrl: swap(lower) })).contract.address).toBe(lower);
  });
});
