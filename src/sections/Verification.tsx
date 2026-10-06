import { TextLink } from '../components/TextLink.tsx';
import { buildTokenView } from '../lib/view.ts';

export function Verification() {
  const view = buildTokenView();
  return (
    <section className="section section--paper" id="verification" aria-labelledby="verify-title">
      <div className="wrap verify-layout">
        <div>
          <p className="eyebrow eyebrow--ink">Verification</p>
          <h2 id="verify-title">CHECK THE BADGE.</h2>
          <p>
            These rows point at project-supplied links. This page has not run an independent check. Nothing here is a
            security guarantee, and a lock or a burned liquidity position would not make a meme token safe.
          </p>
        </div>
        <ul className="evidence-list">
          {view.evidence.map((item) => (
            <li key={item.id}>
              <h3>{item.label}</h3>
              <p className="state">{item.state}</p>
              <p>{item.detail}</p>
              <p>{item.review}</p>
              {item.href ? (
                <p>
                  <TextLink href={item.href} external>
                    Open {item.label}
                  </TextLink>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
