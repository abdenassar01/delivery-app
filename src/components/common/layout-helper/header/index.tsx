import { View, Image } from 'react-native';
import React from 'react';
import { HeaderWithGoBack } from './header-with-go-back';

function Header() {
  return (
    <View className="flex-row items-center">
      <Image source={require('assets/icon.png')} className="h-12 w-12" />
    </View>
  );
}

export { Header, HeaderWithGoBack };
