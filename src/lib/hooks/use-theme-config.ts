import colors from 'configs/color';

import type { Theme } from '@react-navigation/native';
import { DefaultTheme } from '@react-navigation/native';

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.backgroundSecondary,
    text: colors.black,
    border: colors.gray,
    notification: colors.primary,
  },
};

export function useThemeConfig() {
  return LightTheme;
}
