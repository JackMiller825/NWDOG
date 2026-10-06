import { useEffect, useRef } from 'react';
import { logoFull } from '../config/assets.ts';
import { buildTokenView } from '../lib/view.ts';
import { CtaLink } from './CtaLink.tsx';
import { useMenu } from './menuState.ts';
import { NightVisionToggle } from './NightVisionToggle.tsx';

const NAV = [
  { href: '#story', label: 'Story' },
  { href: '#how-to-buy', label: 'How to Buy' },
  { href: '#tokenomics', label: 'Tokenomics' },
  { href: '#community', label: 'Community' },
] as const;

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const { open, toggle, close } = useMenu();
  const view = buildTokenView();

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const apply = () => {
      document.documentElement.style.setProperty('--header-h', `${node.offsetHeight}px`);
    };
    apply();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="wrap header-inner">
        <a className="brand" href="#main">
          <img
            src={logoFull.png}
            width={logoFull.width}
            height={logoFull.height}
            alt=""
          />
          <span className="wordmark">Night Watch Dog</span>
        </a>
        <p className="status-pill">{view.launchLabel}</p>
        <nav className="primary-nav" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <NightVisionToggle />
        <CtaLink cta={view.primaryCta} className="header-cta" />
        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls={open ? 'primary-menu' : undefined}
          onClick={toggle}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open ? <MobileMenu onClose={close} /> : null}
    </header>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const view = buildTokenView();

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusable = () => {
      if (!root) return [];
      return Array.from(
        root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );
    };

    focusable()[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (!firstItem || !lastItem) return;
      const active = document.activeElement;
      if (event.shiftKey && active === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && active === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      id="primary-menu"
      className="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Primary menu"
    >
      <nav aria-label="Mobile">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} onClick={onClose}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="mobile-menu__actions">
        <CtaLink cta={view.primaryCta} />
        <CtaLink cta={view.secondaryCta} className="button--ghost" />
      </div>
      <p className="status-pill">{view.launchLabel}</p>
    </div>
  );
}
