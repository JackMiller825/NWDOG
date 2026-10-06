import type { ReactNode } from 'react';

export function TextLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  if (!external) {
    return (
      <a className="text-link" href={href}>
        {children}
      </a>
    );
  }

  let host: string | null = null;
  try {
    host = new URL(href).host;
  } catch {
    host = null;
  }

  return (
    <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      {host ? <span className="host"> ({host})</span> : null}
    </a>
  );
}
