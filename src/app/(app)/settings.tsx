import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components';
import { useRouter } from 'expo-router';
import * as Icons from '@/icons';
import { authClient } from '@/lib/auth-client';
import { useQuery } from 'convex/react';
import { cn } from '@/lib';
import { api } from 'convex/_generated/api';

export default function SettingsScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const currentUser = useQuery(api.users.getCurrentUser);

  const user = currentUser ?? session?.user;
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
          route: '/profile',
          color: 'bg-indigo-100 text-indigo-600',
        },
        {
          icon: Icons.Hugeicons.ShieldFreeIcons,
          label: 'Security',
          subtitle: 'Password & authentication',
          route: '/security',
          color: 'bg-green-100 text-green-600',
        },
        {
          icon: Icons.Hugeicons.Wallet03FreeIcons,
          label: 'Payment',
          subtitle: 'Payment methods & earnings',
          route: '/payment',
          color: 'bg-blue-100 text-blue-600',
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
          route: '/notifications',
          color: 'bg-orange-100 text-orange-600',
        },
        {
          icon: Icons.Hugeicons.Globe02FreeIcons,
          label: 'Language',
          subtitle: 'English',
          route: '/language',
          color: 'bg-purple-100 text-purple-600',
        },
        {
          icon: Icons.Hugeicons.NavigationFreeIcons,
          label: 'Location',
          subtitle: 'Location services',
          route: '/location',
          color: 'bg-red-100 text-red-600',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: Icons.Hugeicons.CustomerSupportFreeIcons,
          label: 'Help Center',
          subtitle: 'FAQs & support',
          route: '/help',
          color: 'bg-cyan-100 text-cyan-600',
        },
        {
          icon: Icons.Hugeicons.File01FreeIcons,
          label: 'Terms of Service',
          subtitle: 'Legal terms',
          route: '/terms',
          color: 'bg-gray-100 text-gray-600',
        },
        {
          icon: Icons.Hugeicons.InformationCircleFreeIcons,
          label: 'About',
          subtitle: 'App version 1.0.0',
          route: '/about',
          color: 'bg-teal-100 text-teal-600',
        },
      ],
    },
  ];

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'delivery':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        <Text className="text-sm text-gray-500">Manage your preferences</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity
          onPress={() => router.push('/profile' as any)}
          className="mx-5 mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-md"
          activeOpacity={0.7}>
          <View className="flex-row items-center">
            <View className="h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
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
            <Icons.Icon
              icon={Icons.Hugeicons.ArrowDown01FreeIcons}
              size={22}
              strokeWidth={2.5}
              className="text-gray-400"
            />
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
                    onPress={() => router.push(item.route as any)}
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
                    <Icons.Icon
                      icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                      size={20}
                      strokeWidth={2.5}
                      className="text-gray-400"
                    />
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
            className="flex-row items-center justify-center rounded-2xl bg-red-500 p-4 shadow-md">
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
          <Text className="text-xs text-gray-400">TDelivery v1.0.0</Text>
          <Text className="mt-1 text-xs text-gray-400">Made with ❤️</Text>
        </View>
      </ScrollView>
    </View>
  );
}
