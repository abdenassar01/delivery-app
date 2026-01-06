import { primary } from 'configs/color';
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Icon, Hugeicons } from '@/icons';

export function HeaderWithGoBack() {
  const { back, canGoBack } = useRouter();

  return (
    <View className="flex-row items-center gap-2">
      <TouchableOpacity
        onPress={() => canGoBack() && back()}
        className="bg-primary/20 h-8 w-8 justify-center rounded-full pl-1">
        <Icon
          icon={Hugeicons.ArrowLeftIcon}
          size={20}
          color={primary}
          strokeWidth={2}
        />
      </TouchableOpacity>
      <Text>AlmaniaLink</Text>
    </View>
  );
}
