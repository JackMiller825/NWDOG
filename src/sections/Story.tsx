const PANELS = [
  {
    kicker: '01',
    title: 'The city went quiet',
    copy: 'The future got self-driving cars. Lamps stayed on, traffic got strange, and the small creatures in the road still needed someone ridiculous enough to care.',
  },
  {
    kicker: '02',
    title: 'He took the shift',
    copy: 'A Shiba in a safety vest decided the job was his. Goggles down. Paw out. Chief safety officer, self-appointed, with an unreasonable number of snack breaks.',
  },
  {
    kicker: '03',
    title: 'The watch clocks in',
    copy: 'Memes, drawings, and whoever shows up. That is the patrol. Make art of him. Pass it on. Nobody has to buy anything to take part.',
  },
] as const;

export function Story() {
  return (
    <section className="section section--ink" id="story" aria-labelledby="story-title">
      <div className="wrap">
        <p className="eyebrow">Story</p>
        <h2 id="story-title">THE NIGHT SHIFT FOUND ITS DOG.</h2>
        <p className="pull">Every good boy deserves a safe ride.</p>
        <div className="comic-row">
          {PANELS.map((panel) => (
            <article key={panel.kicker} className={`comic-card comic-card--${panel.kicker}`}>
              <p className="kicker">{panel.kicker}</p>
              <h3>{panel.title}</h3>
              <p>{panel.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
