import { buildTokenView } from '../lib/view.ts';
import { CtaLink } from './CtaLink.tsx';

export function MobileBar() {
  const view = buildTokenView();
  return (
    <div className="mobile-bar">
      <CtaLink cta={view.primaryCta} />
      <CtaLink cta={view.secondaryCta} className="button--ghost" />
    </div>
  );
}
