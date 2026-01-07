import { ActivityIndicator, Text, View } from '@/components';
import { useIsFirstTime } from '@/lib';
import { useConvexAuth } from 'convex/react';
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import { useCallback, useEffect } from 'react';
import * as Icons from '@/icons';
import { useCSSVariable } from 'uniwind';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isFirstTime } = useIsFirstTime();
  const primary = useCSSVariable('--color-primary');

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
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          margin: 5,
          position: 'absolute',
          borderTopWidth: 0,
          paddingTop: 6,
          borderRadius: 100,
          width: '60%',
          height: 50,
          backgroundColor: `${primary}10`,
          marginBottom: 25,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '20%',
        },
        tabBarBackground: () => (
          <BlurView
            intensity={50}
            tint="light"
            style={{
              ...StyleSheet.absoluteFillObject,
              height: 50,
              borderRadius: 100,
              zIndex: 1,
              backgroundColor: 'transparent',
              overflow: 'hidden',
            }}
          />
        ),
      }}
      initialRouteName="index">
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
