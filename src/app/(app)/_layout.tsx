import { ActivityIndicator, Text, View } from '@/components';
import { useIsFirstTime } from '@/lib';
import { useConvexAuth } from 'convex/react';
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import { useCallback, useEffect } from 'react';
import * as Icons from '@/icons';

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
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Icons.Icon
              icon={
                focused
                  ? Icons.Hugeicons.Home02FreeIcons
                  : Icons.Hugeicons.Home01FreeIcons
              }
              size={size}
              strokeWidth={2.5}
              style={{ color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size, focused }) => (
            <Icons.Icon
              icon={Icons.Hugeicons.ShoppingBagFreeIcons}
              size={size}
              strokeWidth={2.5}
              style={{ color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => (
            <Icons.Icon
              icon={Icons.Hugeicons.ClockFreeIcons}
              size={size}
              strokeWidth={2.5}
              style={{ color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Icons.Icon
              icon={Icons.Hugeicons.Settings02FreeIcons}
              size={size}
              strokeWidth={2.5}
              style={{ color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
