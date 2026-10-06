import { isAddress } from 'viem';

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

/**
 * Accept an EVM address when the hex form is valid.
 * Mixed-case addresses must match EIP-55. All-lowercase and all-uppercase
 * addresses do not carry a checksum, so checksum rules are not applied.
 * A passing check is not proof that a token is authentic.
 * The original string is returned unchanged so callers can copy it exactly.
 */
export function validateEvmAddress(value: string): string | null {
  if (!ADDRESS_PATTERN.test(value)) return null;
  const hex = value.slice(2);
  const checksumNotApplicable = hex === hex.toLowerCase() || hex === hex.toUpperCase();
  const valid = checksumNotApplicable ? isAddress(value, { strict: false }) : isAddress(value);
  return valid ? value : null;
}

export function sameAddress(left: string, right: string): boolean {
  const a = validateEvmAddress(left);
  const b = validateEvmAddress(right);
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}
