import { ActivityIndicator, Text, View } from '@/components';
import { useIsFirstTime } from '@/lib';
import { useConvexAuth } from 'convex/react';
import { Redirect, SplashScreen } from 'expo-router';
import { Tabs } from 'expo-router';
import { useCallback, useEffect } from 'react';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isFirstTime } = useIsFirstTime();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    setTimeout(hideSplash, 1000);
  }, [hideSplash]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={52} />
      </View>
    );
  }

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="article" />
    </Tabs>
  );
}
