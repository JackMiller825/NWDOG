import type { Allocation } from '../config/token.ts';

export function AllocationChart({ rows }: { rows: Allocation[] }) {
  return (
    <figure className="allocation">
      <figcaption>Published allocation split. The table lists the same figures.</figcaption>
      <div className="allocation-bar" aria-hidden="true">
        {rows.map((row) => (
          <span key={row.label} style={{ width: `${row.percent}%` }} />
        ))}
      </div>
      <ul className="allocation-legend">
        {rows.map((row) => (
          <li key={row.label}>
            <span aria-hidden="true" />
            {row.label}: {formatPercent(row.percent)}
          </li>
        ))}
      </ul>
      <table className="fact-table">
        <caption>Allocations</caption>
        <thead>
          <tr>
            <th scope="col">Allocation</th>
            <th scope="col">Percent</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{formatPercent(row.percent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function formatPercent(value: number): string {
  const text = Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  return `${text}%`;
}
