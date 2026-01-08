import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import { Link, useRouter } from 'expo-router';
import { Header, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { authClient } from '@/lib/auth-client';

export default function Settings() {
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;
  const { replace } = useRouter();

  const tabs: {
    title: string;
    icon: any;
    href: string;
  }[] = [
    {
      title: 'Profile',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.UserFreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      href: '/app/profile',
    },
    {
      title: 'Notifications',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.Notification01FreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      href: '/app/notifications',
    },

    {
      title: 'Contact Us',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.Message02FreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      href: '/app/contact',
    },
  ];

  return (
    <RootWrapper className="px-4">
      <Header />

      <View className="mt-3">
        <Text className="text-lg font-medium">Settings</Text>
      </View>

      <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-2">
        <View className="">
          {tabs.map((item, index) => (
            <>
              <Link key={item.title} href={item.href as any} asChild>
                <TouchableOpacity className="flex-row items-center gap-3">
                  <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-xl">
                    {item.icon}
                  </View>
                  <Text className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </Text>
                  <View className="ml-auto">
                    <Icons.Icon
                      icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                      size={16}
                      strokeWidth={2}
                      color={secondary}
                    />
                  </View>
                </TouchableOpacity>
              </Link>
              {index < tabs.length - 1 && (
                <View className="bg-secondary/10 my-1 h-px w-full rounded-full" />
              )}
            </>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <View className="mt-6">
        <TouchableOpacity
          onPress={() =>
            authClient.signOut().then(() => {
              replace('/(auth)/login');
            })
          }
          className="border-error/20 bg-error/10 flex-row items-center justify-center gap-2 rounded-2xl border p-4 py-2">
          <Icons.Icon
            icon={Icons.Hugeicons.Logout01FreeIcons}
            size={20}
            strokeWidth={2}
            color="#cc0202"
          />
          <Text className="text-error text-base font-semibold">Log out</Text>
        </TouchableOpacity>
      </View>
    </RootWrapper>
  );
}
