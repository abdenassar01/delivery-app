import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Icon, Hugeicons } from '@/icons';
import { Text } from '../../ui';
import { Uniwind } from 'uniwind';
import { useCSSVariable } from 'uniwind';

export function HeaderWithGoBack() {
  const { back, canGoBack } = useRouter();
  const primary = useCSSVariable('--color-primary');

  return (
    <View className="bg-primary/10 max-w-40 flex-row items-center gap-2 rounded-full p-1 pr-3">
      <TouchableOpacity
        pressRetentionOffset={20}
        onPress={() => canGoBack() && back()}
        className="bg-primary/20 text-primary h-8 w-8 justify-center rounded-full pl-1">
        <Icon
          icon={Hugeicons.ArrowLeftIcon}
          size={20}
          strokeWidth={2}
          color={primary}
        />
      </TouchableOpacity>
      <Text className="text-primary font-medium">Tanger Delivery</Text>
    </View>
  );
}
