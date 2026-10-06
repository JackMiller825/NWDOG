import { logoFull } from '../config/assets.ts';
import { buildTokenView } from '../lib/view.ts';

const SECTIONS = [
  { href: '#story', label: 'Story' },
  { href: '#how-to-buy', label: 'How to Buy' },
  { href: '#tokenomics', label: 'Tokenomics' },
  { href: '#community', label: 'Community' },
] as const;

export function Footer() {
  const view = buildTokenView();
  const x = view.socials.find((item) => item.label === 'X');
  const telegram = view.socials.find((item) => item.label === 'Telegram');

  return (
    <footer className="site-footer">
      <div className="wrap footer-bar">
        <a className="footer-logo-link" href="#main">
          <img
            className="footer-logo"
            src={logoFull.png}
            width={logoFull.width}
            height={logoFull.height}
            alt="Night Watch Dog"
          />
        </a>
        <div className="footer-right">
          <nav className="footer-nav" aria-label="Sections">
            {SECTIONS.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="footer-social">
            {x ? (
              <a className="social-icon" href={x.href} target="_blank" rel="noopener noreferrer">
                <XIcon />
                <span className="visually-hidden">X (opens in a new tab)</span>
              </a>
            ) : null}
            {telegram ? (
              <a className="social-icon" href={telegram.href} target="_blank" rel="noopener noreferrer">
                <TelegramIcon />
                <span className="visually-hidden">Telegram (opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="wrap footer-notes">
        <p>© 2026 Night Watch Dog</p>
      </div>
    </footer>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.7 10.3 22.4 1.5h-1.8l-6.7 7.6L8.4 1.5H1.6l8.1 11.5L1.6 22.5h1.8l7.1-8.1 5.7 8.1h6.8l-8.3-12.2Zm-2.5 2.8-.8-1.2L4.2 2.9h2.8l5.3 7.4.8 1.2 6.9 9.6h-2.8l-5.9-8z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.8 4.2 18.7 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.2 9.5-8.6c.4-.4-.1-.6-.6-.2L6.3 13.1 1.3 11.5c-1.1-.3-1.1-1.1.2-1.6L20.4 3.2c.9-.3 1.7.2 1.4 1z" />
    </svg>
  );
}
