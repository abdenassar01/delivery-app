import React from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { storage } from '../storage';
import { Uniwind, useUniwind } from 'uniwind';

const SELECTED_THEME = 'light';
export type ColorSchemeType = 'light' | 'dark' | 'system';

export const useSelectedTheme = () => {
  const { theme, hasAdaptiveThemes } = useUniwind();
  const [_theme, _setTheme] = useMMKVString(SELECTED_THEME, storage);

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      _setTheme(t);
    },
    [_setTheme],
  );

  const selectedTheme = (theme ?? 'system') as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};

export const loadSelectedTheme = () => {
  const theme = storage.getString(SELECTED_THEME);
  if (theme !== undefined) {
    console.log('theme', theme);
    Uniwind.setTheme(theme);
  }
};
