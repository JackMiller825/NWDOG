import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { MenuContext } from './menuState.ts';

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, toggle, close }), [open, toggle, close]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}
