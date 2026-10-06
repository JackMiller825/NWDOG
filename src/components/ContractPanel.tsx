import { useState } from 'react';
import { copyExactText } from '../lib/clipboard.ts';
import type { ContractView } from '../lib/view.ts';
import { TextLink } from './TextLink.tsx';

export function CopyAddressButton({ address }: { address: string | null }) {
  const [status, setStatus] = useState('');
  const ready = Boolean(address);

  async function onCopy() {
    if (!address) return;
    const copied = await copyExactText(address);
    setStatus(copied ? 'Copied' : 'Copy failed. Select the address and copy it manually.');
  }

  return (
    <span className="copy-control">
      <button type="button" className="button button--small" onClick={() => void onCopy()} disabled={!ready}>
        Copy Address
      </button>
      <span className="copy-status" role="status">
        {status}
      </span>
    </span>
  );
}

export function ContractPanel({ contract }: { contract: ContractView }) {
  return (
    <div className="contract-panel">
      <p className="contract-kicker">Contract Address</p>
      <div className="contract-line">
        {contract.address ? (
          <p className="address">{contract.address}</p>
        ) : (
          <p className="coming-soon">{contract.message}</p>
        )}
        <CopyAddressButton address={contract.copyEnabled ? contract.address : null} />
      </div>
      {contract.etherscanUrl ? (
        <p className="contract-explorer">
          <TextLink href={contract.etherscanUrl} external>
            View on Etherscan
          </TextLink>
        </p>
      ) : null}
    </div>
  );
}
