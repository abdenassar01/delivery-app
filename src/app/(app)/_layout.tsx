import { ActivityIndicator, View } from '@/components';
import { cn, useIsFirstTime } from '@/lib';
import { useConvexAuth } from 'convex/react';
import { Redirect, SplashScreen, Tabs, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import * as Icons from '@/icons';
import { useCSSVariable } from 'uniwind';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet } from 'react-native';

const tabs = [
  {
    name: 'index',
    label: 'Home',
    icon: Icons.Hugeicons.Home01FreeIcons,
  },
  {
    name: 'orders',
    label: 'Orders',
    icon: Icons.Hugeicons.ShoppingBagFreeIcons,
  },
  {
    name: 'history',
    label: 'History',
    icon: Icons.Hugeicons.ClockFreeIcons,
  },
  {
    name: 'settings',
    label: 'Settings',
    icon: Icons.Hugeicons.Settings02FreeIcons,
  },
];

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isFirstTime } = useIsFirstTime();
  const primary = useCSSVariable('--color-primary');

  const { push } = useRouter();

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
      {tabs.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, size, focused }) => (
              <Pressable
                // @ts-ignore
                onPress={() => push(tab.name)}
                className={cn('rounded-full p-2', focused && 'bg-primary/20')}>
                <Icons.Icon
                  icon={tab.icon}
                  size={24}
                  strokeWidth={1.5}
                  color={focused ? primary : '#191B1F'}
                />
              </Pressable>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
