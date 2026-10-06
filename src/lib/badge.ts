export const DEFAULT_NICKNAME = 'Good Boy';
export const MAX_NICKNAME_LENGTH = 20;
export const BADGE_SIZE = 800;
export const BADGE_FILENAME = 'nwdog-fan-badge.png';

export const BADGE_COLORS = [
  { id: 'lime', label: 'Lime vest', field: '#BEF526', ribbon: '#FFF0C7', ink: '#081A30' },
  { id: 'orange', label: 'Shiba orange', field: '#F79A28', ribbon: '#FFF0C7', ink: '#081A30' },
  { id: 'paper', label: 'Warm paper', field: '#FFF0C7', ribbon: '#BEF526', ink: '#081A30' },
] as const;

export type BadgeColorId = (typeof BADGE_COLORS)[number]['id'];

const NICKNAME_CHAR = /[\p{L}\p{N} '-]/u;

export function normalizeNickname(input: string): string {
  const kept: string[] = [];
  for (const character of Array.from(input)) {
    if (NICKNAME_CHAR.test(character)) kept.push(character);
  }
  const cleaned = kept.join('').replace(/\s+/g, ' ').trim();
  const limited = Array.from(cleaned).slice(0, MAX_NICKNAME_LENGTH).join('').trim();
  return limited.length > 0 ? limited : DEFAULT_NICKNAME;
}

export function nicknameDroppedCharacters(input: string): boolean {
  if (input.trim() === '') return false;
  return normalizeNickname(input) !== input.trim().replace(/\s+/g, ' ');
}

export async function drawFanBadge(options: {
  canvas: HTMLCanvasElement;
  mascot: CanvasImageSource;
  nickname: string;
  color: BadgeColorId;
}): Promise<void> {
  const canvas = options.canvas;
  canvas.width = BADGE_SIZE;
  canvas.height = BADGE_SIZE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('canvas-unsupported');

  const palette = BADGE_COLORS.find((item) => item.id === options.color) ?? BADGE_COLORS[0];
  const nickname = normalizeNickname(options.nickname);
  await loadBadgeFont();

  context.clearRect(0, 0, BADGE_SIZE, BADGE_SIZE);
  context.fillStyle = palette.field;
  context.fillRect(0, 0, BADGE_SIZE, BADGE_SIZE);
  context.strokeStyle = palette.ink;
  context.lineWidth = 18;
  context.strokeRect(12, 12, BADGE_SIZE - 24, BADGE_SIZE - 24);
  context.drawImage(options.mascot, 150, 36, 500, 500);

  context.fillStyle = palette.ribbon;
  context.fillRect(48, 560, 704, 188);
  context.lineWidth = 8;
  context.strokeStyle = palette.ink;
  context.strokeRect(48, 560, 704, 188);

  context.fillStyle = palette.ink;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '48px "Bebas Neue", Impact, sans-serif';
  context.fillText('NIGHT WATCH MEMBER', 400, 612);
  context.font = fitFont(context, nickname, 640, 64);
  context.fillText(nickname, 400, 678);
  context.font = '22px "Atkinson Hyperlegible", sans-serif';
  context.fillText('Fan badge · not a credential', 400, 728);
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof canvas.toBlob !== 'function') {
      reject(new Error('export-unsupported'));
      return;
    }
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('export-empty'));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function fitFont(context: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number): string {
  const family = '"Bebas Neue", Impact, sans-serif';
  let size = startSize;
  while (size > 28) {
    context.font = `${size}px ${family}`;
    if (context.measureText(text).width <= maxWidth) return context.font;
    size -= 2;
  }
  return `28px ${family}`;
}

async function loadBadgeFont(): Promise<void> {
  try {
    if (document.fonts?.load) {
      await document.fonts.load('64px "Bebas Neue"');
      await document.fonts.load('22px "Atkinson Hyperlegible"');
    }
  } catch {
    // Canvas falls back to the generic families in the font stack.
  }
}
