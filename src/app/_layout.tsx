import '../global.css';

import { ConvexReactClient } from 'convex/react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import * as SecureStore from 'expo-secure-store';
import { Toaster } from '../lib/taost/sonner';
import { loadSelectedTheme, useThemeConfig } from '@/lib';
import { SafeAreaListener } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { authClient } from '@/lib/auth-client';

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL as string,
  {
    expectAuth: true,
    unsavedChangesWarning: false,
    verbose: true,
  },
);

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

loadSelectedTheme();
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  return (
    <Providers>
      <Stack initialRouteName="(app)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        <KeyboardProvider>
          <SafeAreaListener
            onChange={({ insets }) => {
              Uniwind.updateInsets(insets);
            }}>
            <BottomSheetModalProvider>
              {children}
              <Toaster position="bottom-center" />
            </BottomSheetModalProvider>
          </SafeAreaListener>
        </KeyboardProvider>
      </ConvexBetterAuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
