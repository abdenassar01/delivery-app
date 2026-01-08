import { TouchableOpacity, View } from 'react-native';
import React from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Link, useRouter } from 'expo-router';
import { Button, Header, Map, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { authClient } from '@/lib/auth-client';

const tabs: {
  title: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  href: string;
}[] = [
  {
    title: 'Profile',
    icon: 'person-pin',
    href: '/app/profile',
  },
  {
    title: 'Notifications',
    icon: 'circle-notifications',
    href: '/app/notifications',
  },
  {
    title: 'Chats',
    icon: 'chat',
    href: '/inbox',
  },
  {
    title: 'Feedback',
    icon: 'feedback',
    href: '/app/feedback',
  },
  {
    title: 'Contact Us',
    icon: 'message',
    href: '/app/contact',
  },
];

export default function Settings() {
  const { t } = useTranslation();
  const primary = useCSSVariable('--color-primary') as string;
  const { replace } = useRouter();
  return (
    <RootWrapper className="px-4">
      <Header />
      {/* <ConfigurationPanel /> */}
      <View className="border-primary/30 bg-primary/10 my-3 rounded-xl border p-2">
        <Map
          items={tabs}
          render={(item, index) => (
            <>
              <Link href={item.href as any} asChild>
                <TouchableOpacity className="flex-row items-center gap-1 py-1">
                  <MaterialIcons name={item.icon} size={24} color={primary} />
                  <Text className="text-primary text-base font-medium">
                    {t(item.title)}
                  </Text>
                </TouchableOpacity>
              </Link>
              {index !== tabs.length - 1 && (
                <View className="bg-primary/30 h-[0.5px] w-[90%] self-end rounded-full" />
              )}
            </>
          )}
        />
      </View>
      <View className="">
        <Button
          onPress={() =>
            authClient.signOut().then(() => {
              replace('/(auth)/login');
            })
          }
          label="Log out"
        />
      </View>
    </RootWrapper>
  );
}
