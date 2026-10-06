import { createContext, useContext } from 'react';

export interface NightVisionValue {
  enabled: boolean;
  toggle: () => void;
}

export const NightVisionContext = createContext<NightVisionValue | null>(null);

export function useNightVision(): NightVisionValue {
  const value = useContext(NightVisionContext);
  if (!value) throw new Error('Night vision is unavailable outside its provider.');
  return value;
}
