import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContractPanel } from './ContractPanel.tsx';
import type { ContractView } from '../lib/view.ts';

const ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

const published: ContractView = {
  address: ADDRESS,
  etherscanUrl: `https://etherscan.io/token/${ADDRESS}`,
  message: '',
  copyEnabled: true,
  availability: 'Published',
};

describe('contract copy', () => {
  it('copies the configured address exactly', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    render(<ContractPanel contract={published} />);

    await user.click(screen.getByRole('button', { name: 'Copy Address' }));

    expect(writeText).toHaveBeenCalledWith(ADDRESS);
    expect(await screen.findByText('Copied')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Etherscan/i })).toHaveAttribute('href', published.etherscanUrl);
  });

  it('shows Coming Soon and a disabled copy control before a contract is published', () => {
    render(
      <ContractPanel
        contract={{
          address: null,
          etherscanUrl: null,
          message: 'Coming Soon..',
          copyEnabled: false,
          availability: 'Not published',
        }}
      />,
    );
    expect(screen.getByText('Coming Soon..')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy Address' })).toBeDisabled();
    expect(screen.queryByText(/0x/i)).not.toBeInTheDocument();
  });
});
