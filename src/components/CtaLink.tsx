import type { Cta } from '../lib/view.ts';

export function CtaLink({ cta, className = '' }: { cta: Cta; className?: string }) {
  const classNames = className ? `button ${className}` : 'button';
  if (!cta.external) {
    return (
      <a className={classNames} href={cta.href}>
        {cta.label}
      </a>
    );
  }

  return (
    <a className={classNames} href={cta.href} target="_blank" rel="noopener noreferrer">
      {cta.label}
      <span className="visually-hidden"> (opens {cta.host ?? 'an external site'} in a new tab)</span>
    </a>
  );
}
