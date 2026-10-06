import { buildTokenView } from '../lib/view.ts';
import { CtaLink } from '../components/CtaLink.tsx';

export function Invitation() {
  const view = buildTokenView();
  return (
    <section className="section section--paper invitation" id="invitation" aria-labelledby="invite-title">
      <div className="wrap">
        <h2 id="invite-title">THE NIGHT SHIFT HAS ROOM FOR YOU.</h2>
        <p className="lede">
          Bring a joke, a drawing, or a quiet scroll. The patrol is a meme project, and you can stand around without
          buying anything.
        </p>
        <div className="cta-row">
          <CtaLink cta={view.secondaryCta} />
          <CtaLink cta={view.primaryCta} className="button--ink" />
        </div>
      </div>
    </section>
  );
}
