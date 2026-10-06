import { sameAddress, validateEvmAddress } from './address.ts';

const UNISWAP_HOST = 'app.uniswap.org';
const ETHERSCAN_HOST = 'etherscan.io';
const ALLOWED_SWAP_PARAMS = new Set([
  'chain',
  'inputCurrency',
  'outputCurrency',
  'value',
  'field',
  'theme',
]);

export interface SwapCheck {
  ok: boolean;
  href: string | null;
  reason: 'ok' | 'missing' | 'invalid' | 'mismatch';
}

export function parseHttpsUrl(value: string): URL | null {
  if (value.trim() === '' || /\s/.test(value)) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  if (url.username !== '' || url.password !== '') return null;
  return url;
}

export function etherscanTokenUrl(address: string): string | null {
  const valid = validateEvmAddress(address);
  if (!valid) return null;
  return `https://${ETHERSCAN_HOST}/token/${valid}`;
}

/**
 * Confirm an owner-supplied Uniswap URL.
 * Accepted shapes, from Uniswap's custom-linking and embed docs
 * (developers.uniswap.org, reviewed October 5, 2026):
 * - https://app.uniswap.org/#/swap?chain=ethereum&outputCurrency=0x...
 * - https://app.uniswap.org/swap?chain=ethereum&outputCurrency=0x...
 * `chain` must be `ethereum`. `outputCurrency` must be this token.
 * This module never invents a swap URL from a contract address.
 */
export function checkSwapUrl(swapUrl: string | null, contractAddress: string | null): SwapCheck {
  if (swapUrl === null || swapUrl.trim() === '') {
    return { ok: false, href: null, reason: 'missing' };
  }
  const contract = contractAddress ? validateEvmAddress(contractAddress) : null;
  if (!contract) return { ok: false, href: null, reason: 'invalid' };

  const url = parseHttpsUrl(swapUrl);
  if (!url || url.hostname !== UNISWAP_HOST || url.port !== '') {
    return { ok: false, href: null, reason: 'invalid' };
  }

  if (!url.hash.startsWith('#/') && url.hash !== '') {
    return { ok: false, href: null, reason: 'invalid' };
  }

  const parsed = readSwapRoute(url);
  if (!parsed || parsed.route !== '/swap') {
    return { ok: false, href: null, reason: 'invalid' };
  }

  for (const key of parsed.params.keys()) {
    if (!ALLOWED_SWAP_PARAMS.has(key)) {
      return { ok: false, href: null, reason: 'invalid' };
    }
  }

  const chains = parsed.params.getAll('chain');
  const outputs = parsed.params.getAll('outputCurrency');
  if (chains.length !== 1 || outputs.length !== 1) {
    return { ok: false, href: null, reason: 'invalid' };
  }

  const chain = chains[0]?.toLowerCase() ?? '';
  const output = outputs[0] ?? '';
  if (!isWellFormedOptionalParams(parsed.params)) {
    return { ok: false, href: null, reason: 'invalid' };
  }

  if (chain !== 'ethereum') {
    return { ok: false, href: null, reason: 'mismatch' };
  }

  const outputAddress = validateEvmAddress(output);
  if (!outputAddress) return { ok: false, href: null, reason: 'invalid' };
  if (!sameAddress(outputAddress, contract)) {
    return { ok: false, href: null, reason: 'mismatch' };
  }

  return { ok: true, href: swapUrl, reason: 'ok' };
}

function readSwapRoute(url: URL): { route: string; params: URLSearchParams } | null {
  if (url.hash.startsWith('#/')) {
    const raw = url.hash.slice(1);
    const queryAt = raw.indexOf('?');
    const route = normalizeRoute(queryAt === -1 ? raw : raw.slice(0, queryAt));
    const params = new URLSearchParams(queryAt === -1 ? '' : raw.slice(queryAt + 1));
    return { route, params };
  }
  return { route: normalizeRoute(url.pathname), params: url.searchParams };
}

function normalizeRoute(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

function isWellFormedOptionalParams(params: URLSearchParams): boolean {
  const themes = params.getAll('theme');
  if (themes.length > 1) return false;
  if (themes[0] && themes[0] !== 'light' && themes[0] !== 'dark') return false;

  const fields = params.getAll('field');
  if (fields.length > 1) return false;
  if (fields[0] && fields[0] !== 'input' && fields[0] !== 'output') return false;

  const values = params.getAll('value');
  if (values.length > 1) return false;
  if (values[0] && !/^\d+(\.\d+)?$/.test(values[0])) return false;

  const inputs = params.getAll('inputCurrency');
  if (inputs.length > 1) return false;
  const input = inputs[0];
  if (!input) return true;
  if (input.toLowerCase() === 'eth') return true;
  return validateEvmAddress(input) !== null;
}
