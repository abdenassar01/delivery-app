import { Header, Text } from '@/components/common';
import { api } from 'convex/_generated/api';
import { useQuery } from 'convex/react';
import { Image, TouchableOpacity, View } from 'react-native';
import * as Icons from '@/icons';
import { useCSSVariable } from 'uniwind';
import { useRouter } from 'expo-router';

export function HomeTopSection() {
  const user = useQuery(api.users.getCurrentUser);
  const { push } = useRouter();

  const primary = useCSSVariable('--color-primary');

  return (
    <View className="bg-primary/10 rounded-b-2xl px-4 pt-12 pb-6">
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2">
          <Image
            source={{ uri: user?.avatarUrl || '' }}
            className="h-12 w-12 rounded-xl"
          />
          <View>
            <Text className="text-primary text-sm font-medium capitalize">
              Hi, {user?.name}
            </Text>
            <Text className="text-xs text-gray-500">{user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => push('/app/notifications')}
          className="bg-primary/10 rounded-xl p-1.5">
          <Icons.Icon
            icon={Icons.Hugeicons.NotificationFreeIcons}
            size={18}
            strokeWidth={1.5}
            color={primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
