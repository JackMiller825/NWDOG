import { describe, expect, it } from 'vitest';
import { canvasToPngBlob, DEFAULT_NICKNAME, drawFanBadge, normalizeNickname } from './badge.ts';

describe('fan badge text', () => {
  it('uses a default nickname when the field is empty or unusable', () => {
    expect(normalizeNickname('')).toBe(DEFAULT_NICKNAME);
    expect(normalizeNickname('   ')).toBe(DEFAULT_NICKNAME);
    expect(normalizeNickname('<<<>>>')).toBe(DEFAULT_NICKNAME);
    expect(normalizeNickname('😀😀')).toBe(DEFAULT_NICKNAME);
  });

  it('limits length and drops characters that are not drawn as plain text', () => {
    expect(normalizeNickname('Snack Captain')).toBe('Snack Captain');
    expect(normalizeNickname("O'Brien-7")).toBe("O'Brien-7");
    expect(normalizeNickname('1234567890123456789012345')).toBe('12345678901234567890');
    expect(normalizeNickname('A&B<script>')).toBe('ABscript');
  });
});

describe('fan badge export', () => {
  it('draws the nickname as canvas text and returns a PNG blob', async () => {
    const texts: string[] = [];
    const context = new Proxy(
      {},
      {
        get(_target, property) {
          if (property === 'measureText') return (text: string) => ({ width: text.length * 12 });
          if (property === 'fillText') {
            return (text: string) => {
              texts.push(text);
            };
          }
          return () => undefined;
        },
        set() {
          return true;
        },
      },
    );
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => context,
      toBlob: (callback: BlobCallback) => {
        callback(new Blob(['png'], { type: 'image/png' }));
      },
    } as unknown as HTMLCanvasElement;

    await drawFanBadge({
      canvas,
      mascot: {} as CanvasImageSource,
      nickname: 'Lamp <Cat>',
      color: 'orange',
    });
    const blob = await canvasToPngBlob(canvas);

    expect(texts).toContain('NIGHT WATCH MEMBER');
    expect(texts).toContain('Lamp Cat');
    expect(texts.join(' ')).not.toContain('<');
    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(0);
  });

  it('reports a failed export instead of pretending a file exists', async () => {
    const canvas = {
      toBlob: (callback: BlobCallback) => {
        callback(null);
      },
    } as unknown as HTMLCanvasElement;
    await expect(canvasToPngBlob(canvas)).rejects.toThrow('export-empty');
  });
});
