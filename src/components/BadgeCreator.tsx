import { useEffect, useRef, useState } from 'react';
import { logoFull } from '../config/assets.ts';
import {
  BADGE_COLORS,
  BADGE_FILENAME,
  canvasToPngBlob,
  DEFAULT_NICKNAME,
  drawFanBadge,
  downloadBlob,
  MAX_NICKNAME_LENGTH,
  nicknameDroppedCharacters,
  normalizeNickname,
} from '../lib/badge.ts';
import type { BadgeColorId } from '../lib/badge.ts';
import { copyExactText } from '../lib/clipboard.ts';

export function BadgeCreator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mascotRef = useRef<HTMLImageElement | null>(null);
  const [nickname, setNickname] = useState('');
  const [color, setColor] = useState<BadgeColorId>('lime');
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let active = true;
    const image = new Image();
    image.onload = () => {
      if (!active) return;
      mascotRef.current = image;
      setReady(true);
    };
    image.onerror = () => {
      if (!active) return;
      setReady(false);
      setStatus('The mascot image did not load, so the badge cannot be saved yet.');
    };
    image.src = logoFull.png;
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const mascot = mascotRef.current;
    if (!canvas || !mascot || !ready) return;
    let active = true;
    drawFanBadge({ canvas, mascot, nickname, color }).catch(() => {
      if (active) setStatus('Could not draw the badge preview.');
    });
    return () => {
      active = false;
    };
  }, [nickname, color, ready]);

  async function exportBadge(): Promise<Blob> {
    const canvas = canvasRef.current;
    const mascot = mascotRef.current;
    if (!canvas || !mascot || !ready) throw new Error('not-ready');
    await drawFanBadge({ canvas, mascot, nickname, color });
    return canvasToPngBlob(canvas);
  }

  async function onDownload() {
    setStatus('Preparing badge…');
    try {
      const blob = await exportBadge();
      downloadBlob(blob, BADGE_FILENAME);
      setStatus('Badge downloaded.');
    } catch {
      setStatus(
        ready
          ? 'Could not create the badge. Try again.'
          : 'The mascot image did not load, so the badge cannot be saved yet.',
      );
    }
  }

  async function onShare() {
    try {
      const blob = await exportBadge();
      const file = new File([blob], BADGE_FILENAME, { type: 'image/png' });
      const payload = {
        files: [file],
        title: 'Night Watch fan badge',
        text: `${normalizeNickname(nickname)} clocked in with a Night Watch Dog fan badge.`,
      };
      if (typeof navigator.share === 'function' && (!navigator.canShare || navigator.canShare(payload))) {
        await navigator.share(payload);
        setStatus('Share sheet opened.');
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatus('Share canceled.');
        return;
      }
    }

    const copied = await copyExactText(
      `${normalizeNickname(nickname)} made a Night Watch Dog fan badge. Download the PNG from this page.`,
    );
    setStatus(
      copied
        ? 'Sharing is not available in this browser. A caption was copied, and the PNG can still be downloaded.'
        : 'Sharing is not available in this browser. Use the download button.',
    );
  }

  const previewName = normalizeNickname(nickname);
  const dropped = nicknameDroppedCharacters(nickname);

  return (
    <form
      className="badge-creator"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <p className="fan-sticker">Fan badge</p>
      <h3>Make a patrol badge</h3>
      <p>
        This is a fan badge for fun. It is not an NFT, a credential, a token, or proof that anyone holds $NWDOG.
      </p>
      <label className="field" htmlFor="badge-nickname">
        Nickname
        <input
          id="badge-nickname"
          name="nickname"
          maxLength={MAX_NICKNAME_LENGTH}
          value={nickname}
          placeholder={DEFAULT_NICKNAME}
          autoComplete="nickname"
          aria-describedby="nickname-hint"
          onChange={(event) => setNickname(event.target.value)}
        />
      </label>
      <p id="nickname-hint" className="field-hint">
        Optional, up to {MAX_NICKNAME_LENGTH} characters. Letters, numbers, spaces, hyphens, and apostrophes. An empty
        name becomes {DEFAULT_NICKNAME}.
      </p>
      {dropped ? <p className="field-hint">Some characters were left off the badge.</p> : null}
      <fieldset>
        <legend>Badge color</legend>
        <div className="swatches">
          {BADGE_COLORS.map((item) => (
            <label key={item.id} className="swatch">
              <input
                type="radio"
                name="badge-color"
                value={item.id}
                checked={color === item.id}
                onChange={() => setColor(item.id)}
              />
              <span className={`swatch-chip swatch-chip--${item.id}`} aria-hidden="true" />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>
      <canvas
        ref={canvasRef}
        className="badge-canvas"
        width={800}
        height={800}
        role="img"
        aria-label={`Night Watch Member fan badge preview for ${previewName}`}
      >
        Fan badge preview
      </canvas>
      <div className="badge-actions">
        <button type="button" className="button" onClick={() => void onDownload()}>
          Download PNG
        </button>
        <button type="button" className="button button--share" onClick={() => void onShare()}>
          Share badge
        </button>
      </div>
      <p className="copy-status" role="status">
        {status}
      </p>
    </form>
  );
}
