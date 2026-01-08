import { View, Image } from 'react-native';
import React from 'react';
import { HeaderWithGoBack } from './header-with-go-back';
import { Text } from '../../ui';

function Header() {
  return (
    <View className="flex-row items-center">
      <Image
        source={require('@/assets/images/logo.png')}
        className="h-12 w-12"
      />
      <Text className="ml-2 text-sm font-medium">ATN Livraison</Text>
    </View>
  );
}

export { Header, HeaderWithGoBack };
