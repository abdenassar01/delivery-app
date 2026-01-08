import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import { HeaderWithGoBack, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { router } from 'expo-router';

export default function DeliveryAddressesScreen() {
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;

  return (
    <RootWrapper className="px-4">
      <HeaderWithGoBack />

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-lg font-medium">Delivery Addresses</Text>
        <TouchableOpacity className="bg-primary flex-row items-center gap-1 rounded-full px-3 py-1.5">
          <Icons.Icon
            icon={Icons.Hugeicons.AddCircleFreeIcons}
            size={16}
            strokeWidth={2}
            color="white"
          />
          <Text className="text-xs font-semibold text-white">Add New</Text>
        </TouchableOpacity>
      </View>

      <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-2">
        <View className="items-center py-8">
          <View className="bg-secondary/10 mb-3 h-16 w-16 items-center justify-center rounded-full">
            <Icons.Icon
              icon={Icons.Hugeicons.Location01FreeIcons}
              size={32}
              strokeWidth={1.5}
              color={secondary}
            />
          </View>
          <Text className="text-center font-semibold text-gray-900">
            No saved addresses
          </Text>
          <Text className="text-center text-sm text-gray-500">
            Add your delivery addresses for faster checkout
          </Text>
          <TouchableOpacity
            onPress={() => {}}
            className="bg-primary mt-4 flex-row items-center gap-2 rounded-full px-6 py-2.5">
            <Icons.Icon
              icon={Icons.Hugeicons.AddCircleFreeIcons}
              size={18}
              strokeWidth={2}
              color="white"
            />
            <Text className="text-sm font-semibold text-white">
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-xs text-gray-500">
          Your saved addresses will appear here. You can add multiple addresses
          for home, work, and other locations.
        </Text>
      </View>
    </RootWrapper>
  );
}
