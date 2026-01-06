import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components';
import { useRouter } from 'expo-router';
import * as Icons from '@/icons';
import { authClient } from '@/lib/auth-client';

export default function SettingsScreen() {
  const router = useRouter();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: Icons.Hugeicons.UserFreeIcons, label: 'Profile', subtitle: 'Manage your account', route: '/profile' },
        { icon: Icons.Hugeicons.ShieldFreeIcons, label: 'Security', subtitle: 'Password & authentication', route: '/security' },
        { icon: Icons.Hugeicons.Wallet03FreeIcons, label: 'Payment', subtitle: 'Payment methods', route: '/payment' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Icons.Hugeicons.NotificationFreeIcons, label: 'Notifications', subtitle: 'Push notifications', route: '/notifications' },
        { icon: Icons.Hugeicons.Globe02FreeIcons, label: 'Language', subtitle: 'English', route: '/language' },
        { icon: Icons.Hugeicons.Moon01FreeIcons, label: 'Dark Mode', subtitle: 'Off', route: '/appearance' },
        { icon: Icons.Hugeicons.NavigationFreeIcons, label: 'Location', subtitle: 'Location services', route: '/location' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: Icons.Hugeicons.CustomerSupportFreeIcons, label: 'Help Center', subtitle: 'FAQs & support', route: '/help' },
        { icon: Icons.Hugeicons.File01FreeIcons, label: 'Terms of Service', subtitle: 'Legal terms', route: '/terms' },
        { icon: Icons.Hugeicons.InformationCircleFreeIcons, label: 'About', subtitle: 'App version 1.0.0', route: '/about' },
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

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pb-4 pt-12 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        <Text className="text-sm text-gray-500">Manage your preferences</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="mx-5 mt-6 bg-white rounded-2xl p-4 shadow-sm">
          <View className="flex-row items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <Icons.Icon
                icon={Icons.Hugeicons.UserFreeIcons}
                size={32}
                strokeWidth={2}
                className="text-indigo-600"
              />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-gray-900">John Doe</Text>
              <Text className="text-sm text-gray-500">john.doe@example.com</Text>
            </View>
            <Icons.Icon
              icon={Icons.Hugeicons.ArrowRight01FreeIcons}
              size={20}
              strokeWidth={2}
              className="text-gray-400"
            />
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mt-6">
            <Text className="mb-2 px-5 text-sm font-semibold text-gray-500 uppercase">
              {section.title}
            </Text>
            <View className="mx-5 bg-white rounded-2xl shadow-sm">
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  onPress={() => router.push(item.route as any)}
                  className={`flex-row items-center border-b border-gray-100 p-4 ${
                    itemIndex === section.items.length - 1 ? 'border-b-0' : ''
                  }`}>
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Icons.Icon
                      icon={item.icon}
                      size={20}
                      strokeWidth={2}
                      className="text-gray-600"
                    />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-medium text-gray-900">{item.label}</Text>
                    <Text className="text-sm text-gray-500">{item.subtitle}</Text>
                  </View>
                  <Icons.Icon
                    icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                    size={20}
                    strokeWidth={2}
                    className="text-gray-400"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View className="mx-5 mt-6 mb-24">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center rounded-2xl bg-red-500 p-4 shadow-sm">
            <Icons.Icon
              icon={Icons.Hugeicons.Logout01FreeIcons}
              size={20}
              strokeWidth={2}
              className="text-white mr-2"
            />
            <Text className="font-semibold text-white">Sign Out</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
