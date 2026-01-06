import colors from 'configs/color';

import type { Theme } from '@react-navigation/native';
import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { useUniwind } from 'uniwind';

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: colors.primary,
    background: colors.backgroundDark,
    text: colors.black,
    border: colors.gray,
    card: colors.backgroundSecondaryDark,
  },
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.backgroundSecondary,
  },
};

export function useThemeConfig() {
  const { theme, hasAdaptiveThemes } = useUniwind();

  if (hasAdaptiveThemes && theme === 'dark') return DarkTheme;

  return LightTheme;
}
