import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import { useTranslation } from 'react-i18next';
import { Link, useRouter } from 'expo-router';
import { Button, Header, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { authClient } from '@/lib/auth-client';

const tabs: {
  title: string;
  icon: keyof typeof Icons.Hugeicons;
  href: string;
}[] = [
  {
    title: 'Profile',
    icon: 'UserFreeIcons',
    href: '/app/profile',
  },
  {
    title: 'Notifications',
    icon: 'NotificationFreeIcons',
    href: '/app/notifications',
  },
  {
    title: 'Chats',
    icon: 'ChatMultipleFreeIcons',
    href: '/inbox',
  },
  {
    title: 'Feedback',
    icon: 'ThumbUpFreeIcons',
    href: '/app/feedback',
  },
  {
    title: 'Contact Us',
    icon: 'SendMessageFreeIcons',
    href: '/app/contact',
  },
];

export default function Settings() {
  const { t } = useTranslation();
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;
  const { replace } = useRouter();

  return (
    <RootWrapper className="px-4">
      <Header />

      <View className="mt-3">
        <Text className="text-lg font-medium">Settings</Text>
      </View>

      {/* Settings Items */}
      <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-4">
        <View className="space-y-4">
          {tabs.map((item) => (
            <Link key={item.title} href={item.href as any} asChild>
              <TouchableOpacity className="flex-row items-center gap-3">
                <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-full">
                  <Icons.Icon
                    icon={Icons.Hugeicons[item.icon]}
                    size={20}
                    strokeWidth={2}
                    color={secondary}
                  />
                </View>
                <Text className="text-sm font-semibold text-gray-900">
                  {t(item.title)}
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
          className="border-error/20 bg-error/10 flex-row items-center justify-center gap-2 rounded-2xl border p-4">
          <Icons.Icon
            icon={Icons.Hugeicons.SignOutFreeIcons}
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
