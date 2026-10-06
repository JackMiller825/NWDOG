import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header.tsx';
import { MenuProvider } from './MenuContext.tsx';
import { MobileBar } from './MobileBar.tsx';
import { NightVisionProvider } from './NightVision.tsx';

function renderChrome() {
  return render(
    <NightVisionProvider>
      <MenuProvider>
        <Header />
        <MobileBar />
      </MenuProvider>
    </NightVisionProvider>,
  );
}

describe('mobile navigation', () => {
  it('opens, traps escape, and returns focus to the menu button', async () => {
    const user = userEvent.setup();
    renderChrome();

    expect(document.querySelector('a[href*="uniswap"]')).toBeNull();
    expect(screen.getAllByRole('link', { name: 'How to Buy' }).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    const dialog = screen.getByRole('dialog', { name: 'Primary menu' });
    expect(dialog).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(within(dialog).getByRole('link', { name: 'Story' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
  });
});

describe('night vision', () => {
  it('toggles a pressed state and survives a storage failure', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    const user = userEvent.setup();
    renderChrome();
    const toggle = screen.getByRole('button', { name: /Night vision/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.dataset.vision).toBe('night');
    expect(screen.getByText('On')).toBeInTheDocument();
  });
});
