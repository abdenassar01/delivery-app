import React from 'react';

import { storage } from '../storage';
import { Uniwind, useUniwind } from 'uniwind';

const SELECTED_THEME = 'light';
export type ColorSchemeType = 'light';

export const useSelectedTheme = () => {
  const { theme } = useUniwind();

  const setSelectedTheme = React.useCallback((t: ColorSchemeType) => {
    Uniwind.setTheme(t);
  }, []);

  const selectedTheme = (theme ?? 'light') as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};

export const loadSelectedTheme = () => {
  const theme = storage.getString(SELECTED_THEME);
  if (theme !== undefined) {
    Uniwind.setTheme(theme as ColorSchemeType);
  }
  // Always set to light theme
  Uniwind.setTheme('light');
};
