import { createContext, useContext } from 'react';

export interface MenuValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

export const MenuContext = createContext<MenuValue | null>(null);

export function useMenu(): MenuValue {
  const value = useContext(MenuContext);
  if (!value) throw new Error('Menu is unavailable outside its provider.');
  return value;
}
