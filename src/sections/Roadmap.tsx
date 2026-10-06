import { tokenConfig } from '../config/token.ts';

export function Roadmap() {
  const proposed = tokenConfig.roadmap.every((item) => item.status === 'proposed');
  return (
    <section className="section section--ink" id="roadmap" aria-labelledby="roadmap-title">
      <div className="wrap">
        <p className="eyebrow">Roadmap</p>
        <h2 id="roadmap-title">PATROL PLAN</h2>
        <p className="lede">
          {proposed
            ? 'Proposed community plan. Completion is taken from configuration, and none of these milestones are marked done.'
            : 'Completion is taken from configuration. Proposed items stay in the community plan.'}
        </p>
        <p>No listings, prices, partnerships, yields, or dates are promised.</p>
        <ol className="timeline">
          {tokenConfig.roadmap.map((item) => (
            <li key={item.id}>
              <p className="state">{item.status === 'complete' ? 'Marked complete in configuration' : 'Proposed'}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <ul>
                {item.activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
