import { TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Header, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;
  const user = useQuery(api.users.getCurrentUser);

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      // TODO: Implement avatar upload
      console.log('Image selected:', result.assets[0].uri);
    }
  };

  const profileSections: {
    title: string;
    icon: React.ReactNode;
    href: string;
  }[] = [
    {
      title: 'Personal Information',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.UserFreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      href: '/app/profile/personal',
    },
    {
      title: 'Delivery Addresses',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.Location01FreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      href: '/app/profile/addresses',
    },
    {
      title: 'Payment Methods',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.Wallet03FreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      href: '/app/profile/payment',
    },
    {
      title: 'Security',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.Shield01FreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      href: '/app/profile/security',
    },
  ];

  return (
    <RootWrapper className="px-4">
      <Header />

      {/* Profile Card */}
      <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-6">
        <View className="items-center">
          <TouchableOpacity
            onPress={handleImageUpload}
            className="bg-primary/10 relative mb-4 h-24 w-24 items-center justify-center rounded-full">
            {user?.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                className="h-full w-full rounded-full"
              />
            ) : (
              <Icons.Icon
                icon={Icons.Hugeicons.UserFreeIcons}
                size={40}
                strokeWidth={1.5}
                color={primary}
              />
            )}
            <View className="bg-primary absolute right-0 bottom-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white">
              <Icons.Icon
                icon={Icons.Hugeicons.CameraFreeIcons}
                size={14}
                strokeWidth={2}
                color="white"
              />
            </View>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">
            {user?.name || 'User'}
          </Text>
          <Text className="text-sm text-gray-500">{user?.email}</Text>
          <View className="bg-primary/10 mt-3 flex-row items-center gap-1 rounded-full px-3 py-1">
            <Icons.Icon
              icon={Icons.Hugeicons.Male02FreeIcons}
              size={14}
              strokeWidth={2}
              color={primary}
            />
            <Text className="text-primary text-xs font-medium capitalize">
              {user?.role || 'User'}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View className="mt-3 flex-row gap-3">
        <View className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
          <View className="bg-primary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
            <Icons.Icon
              icon={Icons.Hugeicons.NewReleasesFreeIcons}
              size={20}
              strokeWidth={2}
              color={primary}
            />
          </View>
          <Text className="text-lg font-bold text-gray-900">
            {user?.isVerified ? 'Verified' : '-'}
          </Text>
          <Text className="text-xs text-gray-500">Status</Text>
        </View>

        <View className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
          <View className="bg-secondary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
            <Icons.Icon
              icon={Icons.Hugeicons.DollarCircleFreeIcons}
              size={20}
              strokeWidth={2}
              color={secondary}
            />
          </View>
          <Text className="text-lg font-bold text-gray-900">
            ${user?.balance || '0'}
          </Text>
          <Text className="text-xs text-gray-500">Balance</Text>
        </View>
      </View>

      {/* Profile Sections */}
      <View className="mt-3">
        <Text className="text-lg font-medium">Profile Settings</Text>
      </View>

      <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-2">
        <View>
          {profileSections.map((item, index) => (
            <React.Fragment key={item.title}>
              <Link href={item.href as any} asChild>
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
              {index < profileSections.length - 1 && (
                <View className="bg-secondary/10 my-1 h-px w-full rounded-full" />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    </RootWrapper>
  );
}
