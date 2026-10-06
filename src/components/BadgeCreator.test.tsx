import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BadgeCreator } from './BadgeCreator.tsx';

describe('badge creator download', () => {
  beforeEach(() => {
    class FakeImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_value: string) {
        this.onload?.();
      }
    }
    vi.stubGlobal('Image', FakeImage);
    HTMLCanvasElement.prototype.getContext = (() =>
      new Proxy(
        {},
        {
          get(_target, property) {
            if (property === 'measureText') return () => ({ width: 40 });
            if (property === 'fillText') return () => undefined;
            return () => undefined;
          },
          set() {
            return true;
          },
        },
      )) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.toBlob = (callback) => {
      callback(new Blob(['png-bytes'], { type: 'image/png' }));
    };
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: () => 'blob:nwdog-badge' });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: () => undefined });
  });

  it('downloads a PNG after the mascot loads', async () => {
    const user = userEvent.setup();
    render(<BadgeCreator />);
    await user.type(screen.getByLabelText('Nickname'), 'Patrol');
    await user.click(screen.getByRole('button', { name: 'Download PNG' }));
    expect(await screen.findByText('Badge downloaded.')).toBeInTheDocument();
  });
});
