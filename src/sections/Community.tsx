import { BadgeCreator } from '../components/BadgeCreator.tsx';
import { TextLink } from '../components/TextLink.tsx';
import { buildTokenView } from '../lib/view.ts';

export function Community() {
  const view = buildTokenView();
  return (
    <section className="section section--paper" id="community" aria-labelledby="community-title">
      <div className="wrap community-center">
        <p className="eyebrow eyebrow--ink">Community</p>
        <h2 id="community-title">CLOCK IN. BRING MEMES.</h2>
        {view.socials.length > 0 ? (
          <ul className="community-socials">
            {view.socials.map((item) => (
              <li key={item.href}>
                <TextLink href={item.href} external>
                  {item.label}
                </TextLink>
              </li>
            ))}
          </ul>
        ) : null}
        <BadgeCreator />
      </div>
    </section>
  );
}
