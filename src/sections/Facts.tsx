import { buildTokenView } from '../lib/view.ts';
import { TextLink } from '../components/TextLink.tsx';

export function Facts() {
  const view = buildTokenView();
  return (
    <section className="section section--paper facts-section" aria-label="Quick facts">
      <div className="wrap">
        <dl className="facts">
          {view.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>
                {fact.href ? (
                  <TextLink href={fact.href} external>
                    {fact.value}
                  </TextLink>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
