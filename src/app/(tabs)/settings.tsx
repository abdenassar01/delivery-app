import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components';
import { useRouter } from 'expo-router';
import * as Icons from '@/icons';
import { authClient } from '@/lib/auth-client';
import { useQuery } from 'convex/react';
import { cn } from '@/lib';
import { api } from 'convex/_generated/api';
import { HeaderWithGoBack } from '@/components/common/layout-helper/header';

export default function SettingsScreen() {
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);

  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userAvatar = user?.avatar;
  const userRole = user?.role || 'user';

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: Icons.Hugeicons.UserFreeIcons,
          label: 'Profile',
          subtitle: 'Manage your account',
          color: 'bg-primary/10 text-primary',
        },
        {
          icon: Icons.Hugeicons.ShieldFreeIcons,
          label: 'Security',
          subtitle: 'Password & authentication',
          color: 'bg-secondary/10 text-secondary',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Icons.Hugeicons.NotificationFreeIcons,
          label: 'Notifications',
          subtitle: 'Push notifications',
          color: 'bg-primary/10 text-primary',
        },
      ],
    },
  ];

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.replace('/(auth)/login' as any);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-error/10 text-error';
      case 'delivery':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-4 shadow-sm">
        <View className="mb-4">
          <HeaderWithGoBack />
        </View>
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        <Text className="text-sm text-gray-500">Manage your preferences</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity
          className="mx-5 mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-md"
          activeOpacity={0.7}>
          <View className="flex-row items-center">
            <View className="h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
              {userAvatar ? (
                <Image
                  source={{ uri: userAvatar }}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <Icons.Icon
                  icon={Icons.Hugeicons.UserFreeIcons}
                  size={32}
                  strokeWidth={2}
                  className="text-white"
                />
              )}
            </View>
            <View className="ml-4 flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-bold text-gray-900">
                  {userName}
                </Text>
                <View
                  className={cn(
                    'rounded-full px-2 py-0.5',
                    getRoleBadgeColor(userRole),
                  )}>
                  <Text className="text-xs font-bold uppercase">
                    {userRole}
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-gray-500">{userEmail}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mt-6">
            <Text className="mb-2 px-6 text-sm font-bold text-gray-500 uppercase">
              {section.title}
            </Text>
            <View className="mx-5 overflow-hidden rounded-2xl shadow-sm">
              <View className="border border-gray-100 bg-white">
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    className={`flex-row items-center p-4 ${
                      itemIndex !== section.items.length - 1
                        ? 'border-b border-gray-100'
                        : ''
                    }`}
                    activeOpacity={0.7}>
                    <View
                      className={cn(
                        'h-11 w-11 items-center justify-center rounded-full',
                        item.color,
                      )}>
                      <Icons.Icon icon={item.icon} size={22} strokeWidth={2} />
                    </View>
                    <View className="ml-3.5 flex-1">
                      <Text className="font-semibold text-gray-900">
                        {item.label}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {item.subtitle}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View className="mx-5 mt-8 mb-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center rounded-2xl bg-error p-4 shadow-md">
            <Icons.Icon
              icon={Icons.Hugeicons.Logout01FreeIcons}
              size={22}
              strokeWidth={2}
              className="mr-2 text-white"
            />
            <Text className="font-bold text-white">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mb-8 items-center">
          <Text className="text-xs text-gray-400">AMTA Livraison v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
