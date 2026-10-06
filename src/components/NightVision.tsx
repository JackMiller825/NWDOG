import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { NightVisionContext } from './nightVisionState.ts';

const STORAGE_KEY = 'nwdog-night-vision';

function readInitial(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dataset.vision === 'night';
}

export function NightVisionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(readInitial);

  useEffect(() => {
    document.documentElement.dataset.vision = enabled ? 'night' : 'day';
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    } catch {
      // Storage can throw in private mode. The choice still applies for this visit.
    }
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((value) => !value);
  }, []);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);
  return <NightVisionContext.Provider value={value}>{children}</NightVisionContext.Provider>;
}
