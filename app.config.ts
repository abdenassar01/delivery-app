/* eslint-disable max-lines-per-function */
import type { ConfigContext, ExpoConfig } from '@expo/config';

import { ClientEnv, Env } from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  owner: Env.EXPO_ACCOUNT_OWNER,
  scheme: Env.SCHEME,
  slug: 'tanger-deliver',
  version: Env.VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/icon-light.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.BUNDLE_ID,
    infoPlist: {},
    icon: {
      dark: './assets/icon-dark.png',
      light: './assets/icon-light.png',
      tinted: './assets/icon-tinted.png',
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2E3C4B',
    },
    package: Env.PACKAGE,
    permissions: [],
    config: {
      googleMaps: {
        apiKey: Env.MAP_API_KEY,
      },
    },
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
    output: 'single',
    config: {},
  },
  plugins: [
    'expo-localization',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          deploymentTarget: '15.1',
        },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'The app accesses your photos to let you share them with your friends.',
      },
    ],
    [
      'expo-document-picker',
      {
        iCloudContainerEnvironment: 'Production',
      },
    ],
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/AtkinsonHyperlegible-Regular.ttf',
          './assets/fonts/AtkinsonHyperlegible-Bold.ttf',
          './assets/fonts/Cairo-Light.ttf',
          './assets/fonts/Cairo-Regular.ttf',
          './assets/fonts/Cairo-Medium.ttf',
        ],
      },
    ],

    [
      'expo-splash-screen',
      {
        backgroundColor: '#FFFFFF',
        image: './assets/splash-icon.png',
        dark: {
          image: './assets/splash-icon.png',
          backgroundColor: '#000000',
        },
        imageWidth: 200,
      },
    ],
    'expo-router',
    'expo-secure-store',
    ['react-native-edge-to-edge'],
  ],
  extra: {
    ...ClientEnv,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
});
