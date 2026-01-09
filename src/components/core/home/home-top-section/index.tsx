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
    <View className="bg-primary/10 rounded-b-2xl px-4 pt-12 pb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-row gap-2">
          <Image
            source={{ uri: user?.avatarUrl || '' }}
            className="h-24 w-24 rounded-xl"
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
        <TouchableOpacity
          onPress={() => push('/app/profile/wallet')}
          className="bg-primary/20 absolute right-0 bottom-0 flex-row items-center gap-1 rounded-xl px-3 py-1.5">
          <Icons.Icon
            icon={Icons.Hugeicons.WalletAdd01FreeIcons}
            size={18}
            strokeWidth={1.5}
            color={primary}
          />
          <Text className="text-primary text-xs font-semibold">
            {user?.balance || 0} DH
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
