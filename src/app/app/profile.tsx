import { TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Header, Map, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const profileSections: {
  title: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  href: string;
}[] = [
  {
    title: 'Personal Information',
    icon: 'person',
    href: '/app/profile/personal',
  },
  {
    title: 'Delivery Addresses',
    icon: 'location-on',
    href: '/app/profile/addresses',
  },
  {
    title: 'Payment Methods',
    icon: 'payment',
    href: '/app/profile/payment',
  },
  {
    title: 'Security',
    icon: 'lock',
    href: '/app/profile/security',
  },
];

export default function ProfileScreen() {
  const primary = useCSSVariable('--color-primary') as string;
  const { push } = useRouter();
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

  return (
    <RootWrapper className="px-4">
      <Header />

      {/* Profile Card */}
      <View className="border-primary/30 bg-primary/10 my-3 rounded-xl border p-4">
        <View className="items-center">
          <TouchableOpacity
            onPress={handleImageUpload}
            className="bg-primary/20 relative mb-3 h-24 w-24 items-center justify-center rounded-full">
            {user?.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                className="h-full w-full rounded-full"
              />
            ) : (
              <MaterialIcons name="person" size={48} color={primary} />
            )}
            <View className="bg-primary absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full border-2 border-white">
              <MaterialIcons name="camera-alt" size={14} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">
            {user?.name || 'User'}
          </Text>
          <Text className="text-sm text-gray-500">{user?.email}</Text>
          <View className="mt-2 flex-row items-center gap-1 rounded-full bg-primary/20 px-3 py-1">
            <MaterialIcons name="verified" size={14} color={primary} />
            <Text className="text-xs font-medium text-primary capitalize">
              {user?.role || 'User'}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View className="my-3 flex-row gap-3">
        <View className="flex-1 rounded-xl border border-gray-200 bg-white p-3">
          <Text className="text-center text-2xl font-bold text-primary">
            {user?.isVerified ? 'Verified' : '-'}
          </Text>
          <Text className="text-center text-xs text-gray-500">Status</Text>
        </View>
        <View className="flex-1 rounded-xl border border-gray-200 bg-white p-3">
          <Text className="text-center text-2xl font-bold text-primary">
            ${user?.balance || '0'}
          </Text>
          <Text className="text-center text-xs text-gray-500">Balance</Text>
        </View>
      </View>

      {/* Profile Sections */}
      <View className="border-primary/30 bg-primary/10 my-3 rounded-xl border p-2">
        <Map
          items={profileSections}
          render={(item, index) => (
            <>
              <Link href={item.href as any} asChild>
                <TouchableOpacity className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name={item.icon} size={24} color={primary} />
                    <Text className="text-primary text-base font-medium">
                      {item.title}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={primary} />
                </TouchableOpacity>
              </Link>
              {index !== profileSections.length - 1 && (
                <View className="bg-primary/30 h-[0.5px] w-[90%] self-end rounded-full" />
              )}
            </>
          )}
        />
      </View>
    </RootWrapper>
  );
}
